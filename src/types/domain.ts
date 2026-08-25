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
  employer: string
  joinedOn: string
  exitedOn: string
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

export interface EPFOProfile {
  personaId: PersonaId
  maskedUan: string
  balance: number
  bankAccount: string
  aadhaarKyc: boolean
  panKyc: boolean
  bankKyc: boolean
  employment: EmploymentRecord[]
  claim?: ClaimSubmission
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
  status: 'COMPLETE' | 'IN_PROGRESS' | 'INFO'
  occurredAt: string
}

export interface IdentityChange {
  id: string
  field: IdentityField
  fromValues: string[]
  toValue: string
  destinations: IdentitySource[]
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

export interface PFClaim {
  type: ClaimType
  amount: number
  bankConfirmed: boolean
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
    aadhaarKyc: z.boolean(), panKyc: z.boolean(), bankKyc: z.boolean(), employment: z.array(z.object({ id: z.string(), employer: z.string(), joinedOn: z.string(), exitedOn: z.string() })),
    claim: z.object({ id: z.string(), personaId: z.enum(['ananya', 'rajesh']), reference: z.string(), type: z.literal('FINAL_SETTLEMENT'), amount: z.number(), submittedAt: z.string(), status: z.enum(['RECEIVED', 'VALIDATING']) }).optional(),
    lastUpdatedAt: z.string(),
  }),
  mismatches: z.array(z.object({ id: z.string(), field: z.enum(['name', 'mobile', 'bankAccount']), valuesBySource: z.record(z.string(), z.string()), severity: z.enum(['INFO', 'WARNING', 'BLOCKING']), affectedServices: z.array(z.enum(['INCOME_TAX', 'EPFO'])), status: z.enum(['OPEN', 'PROPAGATING', 'RESOLVED', 'PARTIAL']) })),
  identityChanges: z.array(z.object({ id: z.string(), field: z.enum(['name', 'mobile', 'bankAccount']), fromValues: z.array(z.string()), toValue: z.string(), destinations: z.array(z.enum(['AADHAAR', 'PAN', 'BANK', 'EPFO', 'INCOME_TAX'])), changedAt: z.string() })),
  actions: z.array(z.object({ id: z.string(), service: z.enum(['IDENTITY', 'EPFO', 'INCOME_TAX']), severity: z.enum(['INFO', 'WARNING', 'BLOCKING']), title: z.string(), consequence: z.string(), fixTarget: z.string(), source: z.string() })),
  activity: z.array(z.object({ id: z.string(), kind: z.enum(['IDENTITY', 'EPFO', 'SESSION']), title: z.string(), detail: z.string(), status: z.enum(['COMPLETE', 'IN_PROGRESS', 'INFO']), occurredAt: z.string() })),
})
