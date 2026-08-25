import { z } from 'zod'

export type PersonaId = 'ananya' | 'rajesh'
export type IdentityField = 'name' | 'mobile' | 'bankAccount'
export type IdentitySource = 'AADHAAR' | 'PAN' | 'BANK' | 'EPFO' | 'INCOME_TAX'
export type Severity = 'INFO' | 'WARNING' | 'BLOCKING'
export type ClaimType = 'FINAL_SETTLEMENT'

export interface TaxpayerProfile {
  fullName: string
  firstName: string
  city: string
  maskedAadhaar: string
  maskedPan: string
}

export interface IdentityRecord {
  personaId: PersonaId
  canonical: Record<IdentityField, string>
  valuesBySource: Record<IdentitySource, Partial<Record<IdentityField, string>>>
  updatedAt: string
}

export interface IdentityMismatch {
  id: string
  field: IdentityField
  valuesBySource: Partial<Record<IdentitySource, string>>
  severity: Severity
  affectedServices: ('INCOME_TAX' | 'EPFO')[]
  status: 'OPEN' | 'PROPAGATING' | 'RESOLVED' | 'PARTIAL'
}

export interface EmploymentRecord {
  id: string
  memberId: string
  employer: string
  joinedOn: string
  exitedOn?: string
  current: boolean
  balance: number
}

export interface KYCRecord {
  kind: 'AADHAAR' | 'PAN' | 'BANK'
  maskedValue: string
  status: 'VALIDATED' | 'NEEDS_ATTENTION'
  updatedAt: string
}

export interface MonthlyContribution {
  id: string
  month: string
  employee: number
  employer: number
  pension: number
  status: 'POSTED' | 'MISSING'
}

export interface EmployerPassbook {
  employmentId: string
  employer: string
  openingBalance: number
  contributions: MonthlyContribution[]
}

export interface PassbookSnapshot {
  employers: EmployerPassbook[]
  capturedAt: string
}

export interface ClaimSubmission {
  id: string
  personaId: PersonaId
  reference: string
  type: ClaimType
  amount: number
  submittedAt: string
  status: 'RECEIVED' | 'VALIDATING'
}

export interface ClaimDraft {
  type: ClaimType
  amount: number
  bankConfirmed: boolean
  declarationAccepted: boolean
  otp: string
  updatedAt: string
}

export interface SourceMetadata {
  system: 'EPFO'
  reference: string
  capturedAt: string
}

export interface ClaimHistoryEntry {
  id: string
  personaId: PersonaId
  reference: string
  type: ClaimType
  amount: number
  submittedAt: string
  decidedAt: string
  status: 'REJECTED' | 'SETTLED'
  reasonCode?: 'C15'
  reasonKey?: string
  source: SourceMetadata
}

export interface TransferDraft {
  sourceEmploymentId: string
  destinationEmploymentId: string
  declarationAccepted: boolean
  otp: string
  updatedAt: string
}

export interface PFTransfer {
  id: string
  personaId: PersonaId
  reference: string
  sourceEmploymentId: string
  destinationEmploymentId: string
  amount: number
  submittedAt: string
  status: 'EMPLOYER_REVIEW' | 'EPFO_PROCESSING' | 'COMPLETED'
}

export interface Nominee {
  id: string
  name: string
  relationship: 'SPOUSE' | 'CHILD' | 'PARENT' | 'OTHER'
  dateOfBirth: string
  share: number
}

export interface NominationRecord {
  status: 'NOT_STARTED' | 'DRAFT' | 'PENDING' | 'EFFECTIVE'
  nominees: Nominee[]
  updatedAt: string
  reference?: string
}

export interface ContributionIssue {
  employmentId: string
  contributionId: string
  category: 'MISSING_CONTRIBUTION'
  summary: string
}

export interface EPFOProfile {
  personaId: PersonaId
  maskedUan: string
  balance: number
  bankAccount: string
  aadhaarKyc: boolean
  panKyc: boolean
  bankKyc: boolean
  employment: EmploymentRecord[]
  kyc: KYCRecord[]
  passbook: PassbookSnapshot
  contributionIssue?: ContributionIssue
  claim?: ClaimSubmission
  claimDraft?: ClaimDraft
  claimHistory: ClaimHistoryEntry[]
  transferDraft?: TransferDraft
  transfer?: PFTransfer
  nomination: NominationRecord
  lastUpdatedAt: string
}

export interface ActionItem {
  id: string
  service: 'IDENTITY' | 'EPFO' | 'INCOME_TAX'
  severity: Severity
  title: string
  consequence: string
  fixTarget: string
  source: string
}

export interface ActivityEvent {
  id: string
  kind: 'IDENTITY' | 'EPFO' | 'SESSION'
  title: string
  detail: string
  values?: Record<string, string | number>
  status: 'COMPLETE' | 'IN_PROGRESS' | 'INFO'
  occurredAt: string
}

export interface IdentityChange {
  id: string
  field: IdentityField
  fromValues: string[]
  toValue: string
  destinations: IdentitySource[]
  destinationResults: PropagationDestination[]
  status: 'SUCCESS' | 'PARTIAL'
  changedAt: string
}

export interface PersonaSeed {
  id: PersonaId
  schemaVersion: number
  profile: TaxpayerProfile
  identity: IdentityRecord
  epfo: EPFOProfile
  mismatches: IdentityMismatch[]
  identityChanges: IdentityChange[]
  actions: ActionItem[]
  activity: ActivityEvent[]
}

export interface MockSession {
  id: string
  personaId: PersonaId
  verified: boolean
  otpExpiresAt: string
  token?: string
}

export interface ResolveMismatchInput {
  personaId: PersonaId
  mismatchId: string
  canonicalValue: string
}

export interface RetryPropagationInput {
  personaId: PersonaId
  mismatchId: string
}

export interface PropagationDestination {
  source: IdentitySource
  status: 'UPDATED' | 'QUEUED' | 'FAILED'
}

export interface PropagationResult {
  change: IdentityChange
  destinations: PropagationDestination[]
  status: 'SUCCESS' | 'PARTIAL'
}

export interface RuleResult {
  code: string
  passed: boolean
  severity: Severity
  messageKey: string
  sourceRefs: string[]
  fixTarget?: string
}

export interface ClaimValidation {
  type: ClaimType
  ready: boolean
  checkedAt: string
  results: RuleResult[]
}

export interface TransferValidation {
  ready: boolean
  checkedAt: string
  results: RuleResult[]
}

export interface PFClaim {
  type: ClaimType
  amount: number
  bankConfirmed: boolean
  declarationAccepted: boolean
  otp: string
}

export interface PFTransferInput {
  sourceEmploymentId: string
  destinationEmploymentId: string
  declarationAccepted: boolean
  otp: string
}

const sourceValueSchema = z.object({
  name: z.string().optional(), mobile: z.string().optional(), bankAccount: z.string().optional(),
})

export const personaSeedSchema = z.object({
  id: z.enum(['ananya', 'rajesh']),
  schemaVersion: z.number(),
  profile: z.object({ fullName: z.string(), firstName: z.string(), city: z.string(), maskedAadhaar: z.string(), maskedPan: z.string() }),
  identity: z.object({
    personaId: z.enum(['ananya', 'rajesh']),
    canonical: z.object({ name: z.string(), mobile: z.string(), bankAccount: z.string() }),
    valuesBySource: z.object({ AADHAAR: sourceValueSchema, PAN: sourceValueSchema, BANK: sourceValueSchema, EPFO: sourceValueSchema, INCOME_TAX: sourceValueSchema }),
    updatedAt: z.string(),
  }),
  epfo: z.object({
    personaId: z.enum(['ananya', 'rajesh']), maskedUan: z.string(), balance: z.number(), bankAccount: z.string(),
    aadhaarKyc: z.boolean(), panKyc: z.boolean(), bankKyc: z.boolean(), employment: z.array(z.object({ id: z.string(), memberId: z.string(), employer: z.string(), joinedOn: z.string(), exitedOn: z.string().optional(), current: z.boolean(), balance: z.number() })),
    kyc: z.array(z.object({ kind: z.enum(['AADHAAR', 'PAN', 'BANK']), maskedValue: z.string(), status: z.enum(['VALIDATED', 'NEEDS_ATTENTION']), updatedAt: z.string() })),
    passbook: z.object({ capturedAt: z.string(), employers: z.array(z.object({ employmentId: z.string(), employer: z.string(), openingBalance: z.number(), contributions: z.array(z.object({ id: z.string(), month: z.string(), employee: z.number(), employer: z.number(), pension: z.number(), status: z.enum(['POSTED', 'MISSING']) })) })) }),
    contributionIssue: z.object({ employmentId: z.string(), contributionId: z.string(), category: z.literal('MISSING_CONTRIBUTION'), summary: z.string() }).optional(),
    claim: z.object({ id: z.string(), personaId: z.enum(['ananya', 'rajesh']), reference: z.string(), type: z.literal('FINAL_SETTLEMENT'), amount: z.number(), submittedAt: z.string(), status: z.enum(['RECEIVED', 'VALIDATING']) }).optional(),
    claimDraft: z.object({ type: z.literal('FINAL_SETTLEMENT'), amount: z.number(), bankConfirmed: z.boolean(), declarationAccepted: z.boolean(), otp: z.string(), updatedAt: z.string() }).optional(),
    claimHistory: z.array(z.object({ id: z.string(), personaId: z.enum(['ananya', 'rajesh']), reference: z.string(), type: z.literal('FINAL_SETTLEMENT'), amount: z.number(), submittedAt: z.string(), decidedAt: z.string(), status: z.enum(['REJECTED', 'SETTLED']), reasonCode: z.literal('C15').optional(), reasonKey: z.string().optional(), source: z.object({ system: z.literal('EPFO'), reference: z.string(), capturedAt: z.string() }) })),
    transferDraft: z.object({ sourceEmploymentId: z.string(), destinationEmploymentId: z.string(), declarationAccepted: z.boolean(), otp: z.string(), updatedAt: z.string() }).optional(),
    transfer: z.object({ id: z.string(), personaId: z.enum(['ananya', 'rajesh']), reference: z.string(), sourceEmploymentId: z.string(), destinationEmploymentId: z.string(), amount: z.number(), submittedAt: z.string(), status: z.enum(['EMPLOYER_REVIEW', 'EPFO_PROCESSING', 'COMPLETED']) }).optional(),
    nomination: z.object({ status: z.enum(['NOT_STARTED', 'DRAFT', 'PENDING', 'EFFECTIVE']), nominees: z.array(z.object({ id: z.string(), name: z.string(), relationship: z.enum(['SPOUSE', 'CHILD', 'PARENT', 'OTHER']), dateOfBirth: z.string(), share: z.number() })), updatedAt: z.string(), reference: z.string().optional() }),
    lastUpdatedAt: z.string(),
  }),
  mismatches: z.array(z.object({ id: z.string(), field: z.enum(['name', 'mobile', 'bankAccount']), valuesBySource: z.record(z.string(), z.string()), severity: z.enum(['INFO', 'WARNING', 'BLOCKING']), affectedServices: z.array(z.enum(['INCOME_TAX', 'EPFO'])), status: z.enum(['OPEN', 'PROPAGATING', 'RESOLVED', 'PARTIAL']) })),
  identityChanges: z.array(z.object({ id: z.string(), field: z.enum(['name', 'mobile', 'bankAccount']), fromValues: z.array(z.string()), toValue: z.string(), destinations: z.array(z.enum(['AADHAAR', 'PAN', 'BANK', 'EPFO', 'INCOME_TAX'])), destinationResults: z.array(z.object({ source: z.enum(['AADHAAR', 'PAN', 'BANK', 'EPFO', 'INCOME_TAX']), status: z.enum(['UPDATED', 'QUEUED', 'FAILED']) })), status: z.enum(['SUCCESS', 'PARTIAL']), changedAt: z.string() })),
  actions: z.array(z.object({ id: z.string(), service: z.enum(['IDENTITY', 'EPFO', 'INCOME_TAX']), severity: z.enum(['INFO', 'WARNING', 'BLOCKING']), title: z.string(), consequence: z.string(), fixTarget: z.string(), source: z.string() })),
  activity: z.array(z.object({ id: z.string(), kind: z.enum(['IDENTITY', 'EPFO', 'SESSION']), title: z.string(), detail: z.string(), values: z.record(z.string(), z.union([z.string(), z.number()])).optional(), status: z.enum(['COMPLETE', 'IN_PROGRESS', 'INFO']), occurredAt: z.string() })),
})
