import type {
  ActivityEvent, ActionItem, ClaimSubmission, ClaimType, ClaimValidation, EPFOProfile, IdentityMismatch,
  IdentityRecord, MockSession, Nominee, NominationRecord, PassbookSnapshot, PersonaId, PersonaSeed, PFClaim, PFTransfer,
  PFTransferInput, PropagationResult, ResolveMismatchInput, RetryPropagationInput, TransferValidation,
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
  retryPropagation(input: RetryPropagationInput): Promise<PropagationResult>
  getEPFOProfile(personaId: PersonaId): Promise<EPFOProfile>
  getPassbook(personaId: PersonaId): Promise<PassbookSnapshot>
  refreshPassbook(personaId: PersonaId): Promise<PassbookSnapshot>
  updateEmploymentExit(personaId: PersonaId, employmentId: string, exitedOn: string): Promise<EPFOProfile>
  validateClaim(personaId: PersonaId, type: ClaimType): Promise<ClaimValidation>
  submitClaim(personaId: PersonaId, claim: PFClaim): Promise<ClaimSubmission>
  saveClaimDraft(personaId: PersonaId, claim: PFClaim): Promise<void>
  validateTransfer(personaId: PersonaId, sourceEmploymentId: string, destinationEmploymentId: string): Promise<TransferValidation>
  saveTransferDraft(personaId: PersonaId, transfer: PFTransferInput): Promise<void>
  submitTransfer(personaId: PersonaId, transfer: PFTransferInput): Promise<PFTransfer>
  saveNominationDraft(personaId: PersonaId, nominees: Nominee[]): Promise<NominationRecord>
  submitNomination(personaId: PersonaId, nominees: Nominee[], otp: string): Promise<NominationRecord>
  getActions(personaId: PersonaId): Promise<ActionItem[]>
  getActivity(personaId: PersonaId): Promise<ActivityEvent[]>
  resetPersona(personaId: PersonaId): Promise<PersonaSeed>
}
