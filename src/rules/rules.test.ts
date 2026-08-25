import { beforeEach, describe, expect, it } from 'vitest'
import { cloneSeed, PERSONA_SEEDS } from '../data/personas'
import { deriveActions, identityHealth } from './identity'
import { validatePFClaim } from './epfo'
import { personaSeedSchema } from '../types/domain'

describe('persona contracts', () => {
  it('parses both personas through the same Zod schema', () => {
    expect(personaSeedSchema.safeParse(PERSONA_SEEDS.ananya).success).toBe(true)
    expect(personaSeedSchema.safeParse(PERSONA_SEEDS.rajesh).success).toBe(true)
    expect(Object.keys(PERSONA_SEEDS.ananya).sort()).toEqual(Object.keys(PERSONA_SEEDS.rajesh).sort())
  })

  it('keeps immutable seed snapshots isolated', () => {
    const copy = cloneSeed('rajesh')
    copy.profile.fullName = 'Changed locally'
    expect(PERSONA_SEEDS.rajesh.profile.fullName).toBe('Rajesh Kumar')
  })
})

describe('identity and PF rules', () => {
  let rajesh = cloneSeed('rajesh')
  beforeEach(() => { rajesh = cloneSeed('rajesh') })

  it('prioritizes the cross-service blocking action', () => {
    const [action] = deriveActions(rajesh)
    expect(action.severity).toBe('BLOCKING')
    expect(action.consequence).toContain('PF claim')
    expect(identityHealth(rajesh)).toBe(72)
  })

  it('returns every named claim rule independently', () => {
    const validation = validatePFClaim(rajesh)
    expect(validation.results.map((result) => result.code)).toEqual([
      'NAME_MATCH', 'PAN_KYC_VALID', 'AADHAAR_KYC_VALID', 'BANK_KYC_MATCH',
      'SERVICE_EXIT_PRESENT', 'DATE_OVERLAP', 'CLAIM_ELIGIBILITY',
    ])
    expect(validation.ready).toBe(false)
    expect(validation.results.find((result) => result.code === 'NAME_MATCH')?.passed).toBe(false)
  })

  it('becomes ready only after the mismatch resolves', () => {
    rajesh.mismatches[0].status = 'RESOLVED'
    const validation = validatePFClaim(rajesh)
    expect(validation.ready).toBe(true)
    expect(validation.results.every((result) => result.passed)).toBe(true)
  })
})
