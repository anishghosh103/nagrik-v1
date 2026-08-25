import { beforeEach, describe, expect, it } from 'vitest'
import { LocalAPIService } from './LocalAPIService'

describe('LocalAPIService vertical slice', () => {
  let service: LocalAPIService
  beforeEach(() => { localStorage.clear(); service = new LocalAPIService() })

  it('isolates persona persistence and resets deterministically', async () => {
    await service.resolveMismatch({ personaId: 'rajesh', mismatchId: 'mismatch-name', canonicalValue: 'Rajesh Kumar' })
    expect((await service.getMismatches('rajesh'))[0].status).toBe('RESOLVED')
    expect((await service.getPersona('ananya')).identityChanges).toHaveLength(0)
    await service.resetPersona('rajesh')
    expect((await service.getMismatches('rajesh'))[0].status).toBe('OPEN')
  })

  it('propagates a correction and replaces the blocking action', async () => {
    const result = await service.resolveMismatch({ personaId: 'rajesh', mismatchId: 'mismatch-name', canonicalValue: 'Rajesh Kumar' })
    const persona = await service.getPersona('rajesh')
    expect(result.destinations.every((item) => item.status === 'UPDATED')).toBe(true)
    expect(Object.values(persona.identity.valuesBySource).every((source) => source.name === 'Rajesh Kumar')).toBe(true)
    expect(persona.actions[0].id).toBe('action-pf-ready')
    expect((await service.validateClaim('rajesh', 'FINAL_SETTLEMENT')).ready).toBe(true)
    expect(persona.activity[0].kind).toBe('IDENTITY')
  })

  it('blocks an unready claim and prevents duplicate submission', async () => {
    const claim = { type: 'FINAL_SETTLEMENT' as const, amount: 120000, bankConfirmed: true, declarationAccepted: true, otp: '123456' }
    await expect(service.submitClaim('rajesh', claim)).rejects.toThrow('CLAIM_NOT_READY')
    await service.resolveMismatch({ personaId: 'rajesh', mismatchId: 'mismatch-name', canonicalValue: 'Rajesh Kumar' })
    const first = await service.submitClaim('rajesh', claim)
    const duplicate = await service.submitClaim('rajesh', claim)
    expect(duplicate.reference).toBe(first.reference)
    expect((await service.getActivity('rajesh')).filter((event) => event.title === 'PF claim received')).toHaveLength(1)
  })

  it('restores a verified mock session', async () => {
    const pending = await service.login('rajesh')
    await expect(service.verifyOtp(pending.id, '000000')).rejects.toThrow('INVALID_OTP')
    const verified = await service.verifyOtp(pending.id, '123456')
    expect(verified.verified).toBe(true)
    expect((await service.getSession())?.personaId).toBe('rajesh')
  })
})
