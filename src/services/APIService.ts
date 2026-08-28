import type {
  ActivityEvent,
  ActionItem,
  ClaimSubmission,
  ClaimType,
  ClaimValidation,
  EPFOProfile,
  GrievanceCase,
  GrievanceInput,
  IdentityMismatch,
  IdentityRecord,
  MockSession,
  Nominee,
  NominationRecord,
  PassbookSnapshot,
  PersonaId,
  PersonaSeed,
  PFClaim,
  PFTransfer,
  PFTransferInput,
  PropagationResult,
  ResolveMismatchInput,
  RetryPropagationInput,
  TransferValidation,
} from '../types/domain';
import type {
  FilingRoute,
  FiledReturnSnapshot,
  NoticeFixtureId,
  NoticeItem,
  RegimeComparison,
  ReturnComputation,
  ReturnDraft,
  TaxBankAccount,
  TaxRegime,
  TaxRulesConfig,
  TaxSourceSnapshot,
  ValidationIssue,
} from '../types/tax';

export interface APIService {
  login(personaId: PersonaId): Promise<MockSession>;
  verifyOtp(sessionId: string, otp: string): Promise<MockSession>;
  getSession(): Promise<MockSession | null>;
  clearSession(): Promise<void>;
  getPersona(personaId: PersonaId): Promise<PersonaSeed>;
  getIdentityRecord(personaId: PersonaId): Promise<IdentityRecord>;
  getMismatches(personaId: PersonaId): Promise<IdentityMismatch[]>;
  resolveMismatch(input: ResolveMismatchInput): Promise<PropagationResult>;
  retryPropagation(input: RetryPropagationInput): Promise<PropagationResult>;
  getEPFOProfile(personaId: PersonaId): Promise<EPFOProfile>;
  getPassbook(personaId: PersonaId): Promise<PassbookSnapshot>;
  refreshPassbook(personaId: PersonaId): Promise<PassbookSnapshot>;
  updateEmploymentExit(
    personaId: PersonaId,
    employmentId: string,
    exitedOn: string,
  ): Promise<EPFOProfile>;
  validateClaim(
    personaId: PersonaId,
    type: ClaimType,
  ): Promise<ClaimValidation>;
  submitClaim(personaId: PersonaId, claim: PFClaim): Promise<ClaimSubmission>;
  saveClaimDraft(personaId: PersonaId, claim: PFClaim): Promise<void>;
  refreshClaimStatus(personaId: PersonaId): Promise<EPFOProfile>;
  resubmitClaim(personaId: PersonaId): Promise<EPFOProfile>;
  validateTransfer(
    personaId: PersonaId,
    sourceEmploymentId: string,
    destinationEmploymentId: string,
  ): Promise<TransferValidation>;
  saveTransferDraft(
    personaId: PersonaId,
    transfer: PFTransferInput,
  ): Promise<void>;
  submitTransfer(
    personaId: PersonaId,
    transfer: PFTransferInput,
  ): Promise<PFTransfer>;
  saveNominationDraft(
    personaId: PersonaId,
    nominees: Nominee[],
  ): Promise<NominationRecord>;
  submitNomination(
    personaId: PersonaId,
    nominees: Nominee[],
    otp: string,
  ): Promise<NominationRecord>;
  getActions(personaId: PersonaId): Promise<ActionItem[]>;
  getActivity(personaId: PersonaId): Promise<ActivityEvent[]>;
  resetPersona(personaId: PersonaId): Promise<PersonaSeed>;

  getTaxRules(assessmentYear: string): Promise<TaxRulesConfig>;
  getTaxSources(
    personaId: PersonaId,
    assessmentYear: string,
  ): Promise<TaxSourceSnapshot>;
  getExistingReturnDraft(
    personaId: PersonaId,
    assessmentYear: string,
  ): Promise<ReturnDraft | null>;
  saveReturnDraft(personaId: PersonaId, draft: ReturnDraft): Promise<void>;
  determineFilingRoute(draft: ReturnDraft): Promise<FilingRoute>;
  computeReturn(
    draft: ReturnDraft,
    regime: TaxRegime,
  ): Promise<ReturnComputation>;
  compareRegimes(draft: ReturnDraft): Promise<RegimeComparison>;
  validateReturn(draft: ReturnDraft): Promise<ValidationIssue[]>;
  validateTaxBankAccount(
    personaId: PersonaId,
    accountId: string,
  ): Promise<TaxBankAccount>;
  fileReturn(
    personaId: PersonaId,
    draft: ReturnDraft,
  ): Promise<{
    acknowledgmentNumber: string;
    filedAt: string;
    rulesVersion: string;
    regime: TaxRegime;
  }>;
  verifyReturn(
    personaId: PersonaId,
    input: { acknowledgmentNumber: string; otp: string },
  ): Promise<{ status: 'VERIFIED'; verifiedAt: string }>;
  getFiledReturns(personaId: PersonaId): Promise<FiledReturnSnapshot[]>;
  refreshFiledReturnStatus(
    personaId: PersonaId,
    acknowledgmentNumber: string,
  ): Promise<FiledReturnSnapshot>;
  revalidateRefundBank(
    personaId: PersonaId,
    acknowledgmentNumber: string,
  ): Promise<FiledReturnSnapshot>;
  getNotices(personaId: PersonaId): Promise<NoticeItem[]>;
  importNotice(
    personaId: PersonaId,
    fixtureId: NoticeFixtureId,
  ): Promise<NoticeItem>;
  startNoticeRemedy(
    personaId: PersonaId,
    noticeId: string,
  ): Promise<NoticeItem>;
  submitNoticePayment(
    personaId: PersonaId,
    noticeId: string,
  ): Promise<NoticeItem>;
  submitRectification(
    personaId: PersonaId,
    noticeId: string,
  ): Promise<NoticeItem>;
  refreshNoticeOutcome(
    personaId: PersonaId,
    noticeId: string,
  ): Promise<NoticeItem>;

  getGrievances(personaId: PersonaId): Promise<GrievanceCase[]>;
  submitGrievance(
    personaId: PersonaId,
    input: GrievanceInput,
  ): Promise<GrievanceCase>;
  refreshGrievanceStatus(
    personaId: PersonaId,
    grievanceId: string,
  ): Promise<GrievanceCase>;
  escalateGrievance(
    personaId: PersonaId,
    grievanceId: string,
  ): Promise<GrievanceCase>;
}
