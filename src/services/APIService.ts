import type {
  ActivityEvent, ActionItem, ClaimSubmission, ClaimType, ClaimValidation, EPFOProfile, IdentityMismatch,
  IdentityRecord, MockSession, PersonaId, PersonaSeed, PFClaim, PropagationResult, ResolveMismatchInput,
} from '../types/domain'

export interface APIService {
  login(personaId: PersonaId): Promise<MockSession>
  verifyOtp(sessionId: string, otp: string): Promise<MockSession>
  getSession(): Promise<MockSession | null>
  clearSession(): Promise<void>
  getPersona(personaId: PersonaId): Promise<PersonaSeed>
  getIdentityRecord(personaId: PersonaId): Promise<IdentityRecord>
  getMismatches(personaId: PersonaId): Promise<IdentityMismatch[]>
  resolveMismatch(input: ResolveMismatchInput): Promise<PropagationResult>
  getEPFOProfile(personaId: PersonaId): Promise<EPFOProfile>
  validateClaim(personaId: PersonaId, type: ClaimType): Promise<ClaimValidation>
  submitClaim(personaId: PersonaId, claim: PFClaim): Promise<ClaimSubmission>
  getActions(personaId: PersonaId): Promise<ActionItem[]>
  getActivity(personaId: PersonaId): Promise<ActivityEvent[]>
  resetPersona(personaId: PersonaId): Promise<PersonaSeed>
}
