import { cloneSeed } from '../data/personas'
import { deriveActions } from '../rules/identity'
import { validatePFClaim } from '../rules/epfo'
import type { APIService } from './APIService'
import type { ClaimSubmission, ClaimType, MockSession, PersonaId, PersonaSeed, PFClaim, PropagationResult, ResolveMismatchInput } from '../types/domain'
import { personaSeedSchema } from '../types/domain'

const SCHEMA_VERSION = 1
const SESSION_KEY = 'nagrik:app:session'
const keyFor = (id: PersonaId) => `nagrik:persona:${id}:state:v${SCHEMA_VERSION}`

function wait(ms = 220) {
  return new Promise<void>((resolve) => window.setTimeout(resolve, import.meta.env.MODE === 'test' ? 0 : ms))
}

function requireOnline() {
  if (typeof navigator !== 'undefined' && !navigator.onLine) throw new Error('OFFLINE')
}

export class LocalAPIService implements APIService {
  private pendingSessions = new Map<string, MockSession>()

  private read(id: PersonaId): PersonaSeed {
    const raw = localStorage.getItem(keyFor(id))
    if (raw) {
      const parsed = personaSeedSchema.safeParse(JSON.parse(raw))
      if (parsed.success && parsed.data.schemaVersion === SCHEMA_VERSION) {
        const data = parsed.data as PersonaSeed
        data.actions = deriveActions(data)
        return data
      }
    }
    const seed = cloneSeed(id)
    seed.actions = deriveActions(seed)
    this.write(seed)
    return seed
  }

  private write(seed: PersonaSeed) {
    seed.actions = deriveActions(seed)
    localStorage.setItem(keyFor(seed.id), JSON.stringify(seed))
  }

  async login(personaId: PersonaId): Promise<MockSession> {
    await wait()
    requireOnline()
    const session: MockSession = { id: `mock-session-${personaId}-${Date.now()}`, personaId, verified: false, otpExpiresAt: new Date(Date.now() + 90_000).toISOString() }
    this.pendingSessions.set(session.id, session)
    return session
  }

  async verifyOtp(sessionId: string, otp: string): Promise<MockSession> {
    await wait()
    requireOnline()
    const pending = this.pendingSessions.get(sessionId)
    if (!pending) throw new Error('SESSION_NOT_FOUND')
    if (new Date(pending.otpExpiresAt).getTime() < Date.now()) throw new Error('OTP_EXPIRED')
    if (otp !== '123456') throw new Error('INVALID_OTP')
    const session = { ...pending, verified: true, token: `mock-token-${pending.personaId}` }
    localStorage.setItem(SESSION_KEY, JSON.stringify(session))
    this.pendingSessions.delete(sessionId)
    return session
  }

  async getSession() {
    await wait(120)
    const raw = localStorage.getItem(SESSION_KEY)
    return raw ? JSON.parse(raw) as MockSession : null
  }

  async clearSession() { await wait(80); localStorage.removeItem(SESSION_KEY) }
  async getPersona(id: PersonaId) { await wait(); return structuredClone(this.read(id)) }
  async getIdentityRecord(id: PersonaId) { return (await this.getPersona(id)).identity }
  async getMismatches(id: PersonaId) { return (await this.getPersona(id)).mismatches }
  async getEPFOProfile(id: PersonaId) { return (await this.getPersona(id)).epfo }
  async validateClaim(id: PersonaId, type: ClaimType) { await wait(); void type; return validatePFClaim(this.read(id)) }
  async getActions(id: PersonaId) { return (await this.getPersona(id)).actions }
  async getActivity(id: PersonaId) { return (await this.getPersona(id)).activity }

  async resolveMismatch(input: ResolveMismatchInput): Promise<PropagationResult> {
    await wait(420)
    requireOnline()
    const seed = this.read(input.personaId)
    const mismatch = seed.mismatches.find((item) => item.id === input.mismatchId)
    if (!mismatch) throw new Error('MISMATCH_NOT_FOUND')
    const destinations = Object.keys(seed.identity.valuesBySource) as (keyof typeof seed.identity.valuesBySource)[]
    const now = new Date().toISOString()
    const fromValues = [...new Set(Object.values(mismatch.valuesBySource).filter(Boolean))] as string[]
    for (const source of destinations) seed.identity.valuesBySource[source][mismatch.field] = input.canonicalValue
    seed.identity.canonical[mismatch.field] = input.canonicalValue
    seed.identity.updatedAt = now
    seed.epfo.lastUpdatedAt = now
    mismatch.status = 'RESOLVED'
    const change = { id: `change-${Date.now()}`, field: mismatch.field, fromValues, toValue: input.canonicalValue, destinations, changedAt: now }
    seed.identityChanges.unshift(change)
    seed.activity.unshift({ id: `act-identity-${Date.now()}`, kind: 'IDENTITY', title: 'Name correction propagated', detail: 'PAN, bank, Income Tax and EPFO records now use the chosen value. PF checks were rerun.', status: 'COMPLETE', occurredAt: now })
    this.write(seed)
    return { change, destinations: destinations.map((source) => ({ source, status: 'UPDATED' as const })), status: 'SUCCESS' }
  }

  async submitClaim(personaId: PersonaId, claim: PFClaim): Promise<ClaimSubmission> {
    await wait(480)
    requireOnline()
    const seed = this.read(personaId)
    if (seed.epfo.claim) return seed.epfo.claim
    const validation = validatePFClaim(seed)
    if (!validation.ready) throw new Error('CLAIM_NOT_READY')
    if (!claim.bankConfirmed || !claim.declarationAccepted || claim.otp !== '123456') throw new Error('CLAIM_CONFIRMATION_REQUIRED')
    const now = new Date().toISOString()
    const submission: ClaimSubmission = { id: `claim-${personaId}`, personaId, reference: `NGR-PF-${personaId === 'rajesh' ? '260825-1042' : '260825-1186'}`, type: claim.type, amount: claim.amount, submittedAt: now, status: 'RECEIVED' }
    seed.epfo.claim = submission
    seed.epfo.lastUpdatedAt = now
    seed.activity.unshift({ id: `act-claim-${Date.now()}`, kind: 'EPFO', title: 'PF claim received', detail: `Reference ${submission.reference}. EPFO validation is the next expected step.`, status: 'IN_PROGRESS', occurredAt: now })
    this.write(seed)
    return submission
  }

  async resetPersona(id: PersonaId) {
    await wait()
    localStorage.removeItem(keyFor(id))
    const seed = cloneSeed(id)
    seed.actions = deriveActions(seed)
    this.write(seed)
    return structuredClone(seed)
  }
}

export const apiService = new LocalAPIService()
