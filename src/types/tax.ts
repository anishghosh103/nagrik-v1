import { z } from 'zod';

export type TaxRegime = 'OLD' | 'NEW';
export type FilingRoute =
  'ITR1_LIKE' | 'ITR2_LIKE' | 'ITR4_LIKE' | 'ITR3_ADVANCED' | 'UNSUPPORTED';
export type AgeCategory = 'NON_SENIOR' | 'SENIOR_60' | 'SUPER_SENIOR_80';
export type ResidentialStatus =
  'RESIDENT' | 'RNOR' | 'NON_RESIDENT' | 'NOT_SURE';

/**
 * Deliberately separate from the shared `Severity` type in domain.ts
 * ('INFO'|'WARNING'|'BLOCKING'), which already has hardcoded 3-branch UI
 * mappings across EPFO/identity. Tax validation needs a 4th severity.
 */
export type ValidationSeverity =
  'INFO' | 'WARNING' | 'BLOCKING' | 'ROUTE_CHANGE';

export type SectionId =
  | 'ELIGIBILITY'
  | 'INCOME_SOURCES'
  | 'SALARY'
  | 'HOUSE_PROPERTY'
  | 'CAPITAL_GAINS'
  | 'BUSINESS'
  | 'INTEREST'
  | 'DEDUCTIONS'
  | 'TAX_CREDITS'
  | 'REGIME'
  | 'BANK';

export type SectionStatus =
  'NOT_STARTED' | 'NEEDS_REVIEW' | 'COMPLETE' | 'BLOCKED';

export interface ValidationIssue {
  id: string;
  code: string;
  severity: ValidationSeverity;
  sectionId: SectionId;
  titleKey: string;
  messageKey: string;
  sourceRefs?: string[];
  fixTarget?: { route: string; focusId?: string };
}

export interface SectionState {
  status: SectionStatus;
  reviewedAt?: string;
  blockingIssues: ValidationIssue[];
}

export interface EligibilityAnswers {
  residentialStatus: ResidentialStatus;
  isDirector: boolean;
  holdsUnlistedShares: boolean;
  hasForeignAssetsOrIncome: boolean;
  hasDeferredEsopTax: boolean;
  hasCarryForwardLoss: boolean;
  expectsIncomeAboveFiftyLakh: boolean;
  agriculturalIncomeAmount: number;
  hasSpecialCategoryIncome: boolean;
  hasIncomeBelongingToAnotherPerson: boolean;
  hasUnclassifiableIncomeSource: boolean;
}

export interface SalarySource {
  id: string;
  employerName: string;
  employerTan: string;
  grossSalary: number;
  salarySection17_1: number;
  perquisites17_2: number;
  profitsInLieu17_3: number;
  exemptAllowances: number;
  professionalTax: number;
  employerNps80CCD2: number;
  tdsDeducted: number;
  source: 'FORM16';
  reviewed: boolean;
}

export type OtherSourceCategory =
  'SAVINGS_INTEREST' | 'DEPOSIT_INTEREST' | 'OTHER';
export type OtherSourceProvenance = 'AIS' | 'FORM_26AS' | 'USER_ENTERED';

export interface OtherSourceIncome {
  id: string;
  category: OtherSourceCategory;
  payerName: string;
  maskedReference: string;
  amount: number;
  tdsDeducted: number;
  source: OtherSourceProvenance;
  reviewed: boolean;
  disputed?: boolean;
}

export type PropertyUse = 'SELF_OCCUPIED' | 'LET_OUT';

export interface HouseProperty {
  id: string;
  address: string;
  ownershipPercentage: number;
  coOwned: boolean;
  coOwnerName?: string;
  use: PropertyUse;
  annualRent: number;
  unrealisedRent: number;
  municipalTaxesPaid: number;
  homeLoanInterest: number;
  lenderType?: 'BANK' | 'OTHER';
  lenderName?: string;
  lenderIdentifier?: string;
  loanAccountNumber?: string;
  loanSanctionDate?: string;
  reviewed: boolean;
}

export interface HousePropertyResult {
  propertyId: string;
  grossAnnualValue: number;
  netAnnualValue: number;
  standardDeduction: number;
  interestAllowed: number;
  incomeOrLoss: number;
}

export type CapitalAssetType =
  'LISTED_EQUITY' | 'EQUITY_MUTUAL_FUND' | 'UNSUPPORTED';

export interface CapitalGainTransaction {
  id: string;
  assetType: CapitalAssetType;
  description: string;
  isin?: string;
  purchaseDate: string;
  saleDate: string;
  saleConsideration: number;
  acquisitionCost: number;
  transferExpenses: number;
  sttPaid: boolean;
  source: 'AIS' | 'USER_ENTERED';
  reviewed: boolean;
}

export interface CapitalGainResult {
  transactionId: string;
  section: '111A' | '112A';
  holdingPeriodMonths: number;
  gain: number;
  taxableGain: number;
  rate: number;
  tax: number;
}

export type BusinessActivity =
  | 'SMALL_BUSINESS'
  | 'SPECIFIED_PROFESSION'
  | 'COMMISSION_AGENCY'
  | 'GOODS_CARRIAGE'
  | 'OTHER';

export type SpecifiedProfession =
  | 'LEGAL'
  | 'MEDICAL'
  | 'ENGINEERING_ARCHITECTURE'
  | 'ACCOUNTANCY'
  | 'TECHNICAL_CONSULTANCY'
  | 'INTERIOR_DECORATION';

export interface GoodsCarriage {
  id: string;
  registrationNumber: string;
  heavyGoodsVehicle: boolean;
  tonnageCapacity: number;
  monthsOwned: number;
}

export type Form10IEAStatus =
  'NOT_FILED' | 'FILED_TO_OPT_OUT' | 'PREVIOUSLY_OPTED_OLD' | 'REENTERED_NEW';

export interface PresumptiveBusinessIncome {
  id: string;
  activity: BusinessActivity;
  profession?: SpecifiedProfession;
  description: string;
  digitalReceipts: number;
  cashReceipts: number;
  otherReceipts: number;
  declaredProfit: number;
  wantsLowerProfit: boolean;
  goodsCarriages: GoodsCarriage[];
  form10IEAStatus: Form10IEAStatus;
  reviewed: boolean;
}

export interface BusinessIncomeResult {
  section: '44AD' | '44ADA' | '44AE';
  grossReceipts: number;
  minimumPresumptiveIncome: number;
  taxableIncome: number;
}

export type DeductionSection = '80C' | '80D' | '80TTA' | '80TTB';

export interface DeductionClaim {
  id: string;
  section: DeductionSection;
  label: string;
  enteredAmount: number;
  oldRegimeAllowedAmount: number;
  newRegimeAllowedAmount: number;
  oldRegimeAppliedAmount: number;
  newRegimeAppliedAmount: number;
  metadata?: Record<string, string>;
  sourceRefs: string[];
}

export interface DeductionResult {
  section: DeductionSection;
  label: string;
  enteredAmount: number;
  allowedAmount: number;
  appliedAmount: number;
}

export interface SalaryTdsCredit {
  employerName: string;
  tan: string;
  amount: number;
}
export interface OtherTdsCredit {
  payerName: string;
  amount: number;
}
export interface TcsCredit {
  collectorName: string;
  amount: number;
}
export interface AdvanceTaxPayment {
  challanNumber: string;
  paidOn: string;
  amount: number;
}
export interface SelfAssessmentTaxPayment {
  challanNumber: string;
  paidOn: string;
  amount: number;
}

export interface TaxCredits {
  salaryTds: SalaryTdsCredit[];
  otherTds: OtherTdsCredit[];
  tcs: TcsCredit[];
  advanceTax: AdvanceTaxPayment[];
  selfAssessmentTax: SelfAssessmentTaxPayment[];
}

export interface TaxBankAccount {
  id: string;
  bankName: string;
  maskedAccountNumber: string;
  ifsc: string;
  accountType: 'SAVINGS' | 'CURRENT';
  validationStatus: 'VALIDATED' | 'NEEDS_VALIDATION';
  panLinked: boolean;
}

export interface ReturnComputation {
  regime: TaxRegime;
  income: {
    salary: number;
    houseProperty: number;
    housePropertyLossSetOff: number;
    housePropertyLossCarriedForward: number;
    business: number;
    otherSources: number;
    capitalGains: number;
  };
  houseProperties: HousePropertyResult[];
  capitalGains: CapitalGainResult[];
  business: BusinessIncomeResult | null;
  grossTotalIncome: number;
  deductions: DeductionResult[];
  totalIncome: number;
  normalTax: number;
  specialRateTax: number;
  rebate: number;
  surcharge: number;
  marginalRelief: number;
  cess: number;
  interestAndFee: {
    section234A: number;
    section234B: number;
    section234C: number;
    lateFee234F: number;
    total: number;
  };
  totalTaxLiability: number;
  taxCredits: { total: number };
  taxPayable: number;
  refund: number;
}

export interface RegimeComparison {
  old: ReturnComputation;
  new: ReturnComputation;
  recommended: TaxRegime;
  differenceAmount: number;
}

export type NoticeState = 'NOTICE_RECEIVED' | 'ACTION_REQUIRED' | 'RESOLVED';
export type NoticeRemedy = 'REFILE' | 'PAY' | 'RECTIFY' | 'ITR_U';
export type NoticeFixtureId =
  | 'DEFECTIVE_WRONG_FORM'
  | 'DEMAND_CONFIRMED'
  | 'TDS_CREDIT_OMITTED'
  | 'UPDATED_RETURN_CANDIDATE';

export interface NoticeDiscrepancy {
  id: string;
  code:
    'WRONG_FORM' | 'UNPAID_DEMAND' | 'TDS_CREDIT_MISSING' | 'OMITTED_INCOME';
  labelKey: string;
  declaredAmount: number;
  departmentAmount: number;
  source: 'CPC' | 'FILED_RETURN';
  target?: { sectionId: SectionId; route: string; focusId?: string };
}

export interface NoticeItem {
  id: string;
  linkedAcknowledgmentNumber: string;
  fixtureId: NoticeFixtureId;
  section: '139(9)' | '143(1)';
  issuedOn: string;
  responseDeadline?: string;
  importedAt: string;
  source: { kind: 'SIMULATED_IMPORT'; reference: string };
  discrepancies: NoticeDiscrepancy[];
  remedy: NoticeRemedy;
  state: NoticeState;
  action: {
    status: 'NOT_STARTED' | 'IN_PROGRESS' | 'SUBMITTED' | 'COMPLETED';
    reference?: string;
    updatedAt?: string;
  };
}

export interface ReturnStatusEvent {
  id: string;
  kind:
    'FILED' | 'VERIFIED' | 'PROCESSED' | 'REFUND_ISSUED' | 'REFUND_CREDITED';
  occurredAt: string;
}

export interface RefundRecord {
  amount: number;
  bankName: string;
  maskedAccountNumber: string;
  status: 'PROCESSING' | 'DELAYED' | 'ISSUED' | 'CREDITED';
  delayReason?: 'BANK_LINKAGE';
  expectedNextEventOn?: string;
  updatedAt: string;
}

export interface ReturnDraft {
  assessmentYear: string;
  rulesVersion: string;
  filingType: 'ORIGINAL' | 'DEFECTIVE_RESPONSE';
  responseToNoticeId?: string;
  filingRoute: FilingRoute;
  residentialStatus: ResidentialStatus;
  eligibilityAnswers: EligibilityAnswers;
  salary: SalarySource[];
  properties: HouseProperty[];
  capitalGains: CapitalGainTransaction[];
  business: PresumptiveBusinessIncome | null;
  otherSources: OtherSourceIncome[];
  /** Reserved for the remaining section 9.9 exempt-income schedules. */
  exemptIncome: unknown[];
  deductions: DeductionClaim[];
  taxCredits: TaxCredits;
  regime: { selected: TaxRegime | null; recommended: TaxRegime | null };
  bankAccounts: TaxBankAccount[];
  refundAccountId: string | null;
  /** Reserved for a broader capital-gains AIS reconciliation schedule. */
  aisReviewItems: unknown[];
  losses: {
    housePropertyCarriedForward: number;
    capitalLossCarriedForward: number;
  };
  filingDate: string;
  validationIssues: ValidationIssue[];
  sectionStates: Record<SectionId, SectionState>;
  notices: NoticeItem[];
  computation: { OLD: ReturnComputation; NEW: ReturnComputation } | null;
  updatedAt: string;
}

export interface FiledReturnSnapshot {
  acknowledgmentNumber: string;
  filedAt: string;
  rulesVersion: string;
  regime: TaxRegime;
  filingType: 'ORIGINAL' | 'DEFECTIVE_RESPONSE';
  parentAcknowledgmentNumber?: string;
  draft: ReturnDraft;
  computation: ReturnComputation;
  verification: {
    status: 'PENDING' | 'VERIFIED';
    method?: 'AADHAAR_OTP';
    verifiedAt?: string;
  };
  processing: {
    status: 'FILED' | 'VERIFIED' | 'PROCESSED';
    expectedNextEventOn?: string;
    events: ReturnStatusEvent[];
  };
  refund?: RefundRecord;
}

export interface SuggestedDeduction {
  id: string;
  section: DeductionSection;
  label: string;
  amount: number;
  source: 'FORM16';
}

export interface TaxSourceSnapshot {
  assessmentYear: string;
  capturedAt: string;
  salary: SalarySource[];
  otherSources: OtherSourceIncome[];
  bankAccounts: TaxBankAccount[];
  /** Chapter VI-A amounts the employer already declared for TDS purposes. */
  suggestedDeductions: SuggestedDeduction[];
}

export interface TaxRecord {
  assessmentYear: string;
  rulesVersion: string;
  sources: TaxSourceSnapshot;
  draft: ReturnDraft | null;
  filedReturns: FiledReturnSnapshot[];
  refundScenario: 'STANDARD' | 'BANK_LINKAGE_DELAY';
}

export interface SlabBand {
  upTo: number | null;
  rate: number;
}
export interface RegimeSlabConfig {
  ageCategory: AgeCategory;
  bands: SlabBand[];
}
export interface RegimeRulesConfig {
  slabs: RegimeSlabConfig[];
  standardDeduction: number;
  rebate87A: { thresholdTotalIncome: number; maxRebate: number };
}

/** Output shape of getTaxRules(assessmentYear). Not persisted — no zod schema needed. */
export interface TaxRulesConfig {
  assessmentYear: string;
  rulesVersion: string;
  verified: true;
  newRegime: RegimeRulesConfig;
  oldRegime: RegimeRulesConfig;
  cessRate: number;
  deductionCaps: {
    section80C: number;
    section80D: {
      nonSenior: number;
      senior: number;
      nonSeniorParents: number;
      seniorParents: number;
    };
    section80TTA: number;
    section80TTB: number;
  };
  filingRoute: {
    itr1IncomeCap: number;
    agriculturalIncomeThreshold: number;
    ltcg112AThreshold: number;
    maxHouseProperties: number;
  };
  houseProperty: {
    letOutStandardDeductionRate: number;
    oldRegimeSelfOccupiedInterestCap: number;
    oldRegimeInterHeadLossSetOffCap: number;
    lossCarryForwardYears: number;
  };
  capitalGains: {
    listedHoldingMonths: number;
    section111ARate: number;
    section112ARate: number;
    section112AExemption: number;
  };
  presumptive: {
    cashReceiptThresholdRate: number;
    section44AD: {
      standardTurnoverLimit: number;
      digitalTurnoverLimit: number;
      digitalRate: number;
      otherRate: number;
    };
    section44ADA: {
      standardReceiptLimit: number;
      digitalReceiptLimit: number;
      rate: number;
    };
    section44AE: {
      maxVehicles: number;
      heavyTonnageThreshold: number;
      lightVehicleMonthlyAmount: number;
      heavyVehicleMonthlyAmountPerTonne: number;
    };
  };
  surcharge: {
    thresholds: { above: number; oldRate: number; newRate: number }[];
    specialRateIncomeCap: number;
  };
  interestAndFees: {
    nonAuditFilingDueDate: string;
    financialYearStart: string;
    interestRatePerMonth: number;
    advanceTaxThreshold: number;
    lateFeeIncomeThreshold: number;
    lateFeeBelowThreshold: number;
    lateFeeAboveThreshold: number;
  };
}

// ---------------------------------------------------------------------------
// Zod schema — mirrors TaxRecord field-for-field, used only for persistence
// (parse/migrate) exactly like personaSeedSchema in domain.ts.
// ---------------------------------------------------------------------------

const salarySourceSchema = z.object({
  id: z.string(),
  employerName: z.string(),
  employerTan: z.string(),
  grossSalary: z.number(),
  salarySection17_1: z.number(),
  perquisites17_2: z.number(),
  profitsInLieu17_3: z.number(),
  exemptAllowances: z.number(),
  professionalTax: z.number(),
  employerNps80CCD2: z.number(),
  tdsDeducted: z.number(),
  source: z.literal('FORM16'),
  reviewed: z.boolean(),
});

const otherSourceIncomeSchema = z.object({
  id: z.string(),
  category: z.enum(['SAVINGS_INTEREST', 'DEPOSIT_INTEREST', 'OTHER']),
  payerName: z.string(),
  maskedReference: z.string(),
  amount: z.number(),
  tdsDeducted: z.number(),
  source: z.enum(['AIS', 'FORM_26AS', 'USER_ENTERED']),
  reviewed: z.boolean(),
  disputed: z.boolean().optional(),
});

const housePropertySchema = z.object({
  id: z.string(),
  address: z.string(),
  ownershipPercentage: z.number(),
  coOwned: z.boolean(),
  coOwnerName: z.string().optional(),
  use: z.enum(['SELF_OCCUPIED', 'LET_OUT']),
  annualRent: z.number(),
  unrealisedRent: z.number(),
  municipalTaxesPaid: z.number(),
  homeLoanInterest: z.number(),
  lenderType: z.enum(['BANK', 'OTHER']).optional(),
  lenderName: z.string().optional(),
  lenderIdentifier: z.string().optional(),
  loanAccountNumber: z.string().optional(),
  loanSanctionDate: z.string().optional(),
  reviewed: z.boolean(),
});

const capitalGainTransactionSchema = z.object({
  id: z.string(),
  assetType: z.enum(['LISTED_EQUITY', 'EQUITY_MUTUAL_FUND', 'UNSUPPORTED']),
  description: z.string(),
  isin: z.string().optional(),
  purchaseDate: z.string(),
  saleDate: z.string(),
  saleConsideration: z.number(),
  acquisitionCost: z.number(),
  transferExpenses: z.number(),
  sttPaid: z.boolean(),
  source: z.enum(['AIS', 'USER_ENTERED']),
  reviewed: z.boolean(),
});

const goodsCarriageSchema = z.object({
  id: z.string(),
  registrationNumber: z.string(),
  heavyGoodsVehicle: z.boolean(),
  tonnageCapacity: z.number(),
  monthsOwned: z.number(),
});

const presumptiveBusinessIncomeSchema = z.object({
  id: z.string(),
  activity: z.enum([
    'SMALL_BUSINESS',
    'SPECIFIED_PROFESSION',
    'COMMISSION_AGENCY',
    'GOODS_CARRIAGE',
    'OTHER',
  ]),
  profession: z
    .enum([
      'LEGAL',
      'MEDICAL',
      'ENGINEERING_ARCHITECTURE',
      'ACCOUNTANCY',
      'TECHNICAL_CONSULTANCY',
      'INTERIOR_DECORATION',
    ])
    .optional(),
  description: z.string(),
  digitalReceipts: z.number(),
  cashReceipts: z.number(),
  otherReceipts: z.number(),
  declaredProfit: z.number(),
  wantsLowerProfit: z.boolean(),
  goodsCarriages: z.array(goodsCarriageSchema),
  form10IEAStatus: z.enum([
    'NOT_FILED',
    'FILED_TO_OPT_OUT',
    'PREVIOUSLY_OPTED_OLD',
    'REENTERED_NEW',
  ]),
  reviewed: z.boolean(),
});

const deductionClaimSchema = z.object({
  id: z.string(),
  section: z.enum(['80C', '80D', '80TTA', '80TTB']),
  label: z.string(),
  enteredAmount: z.number(),
  oldRegimeAllowedAmount: z.number(),
  newRegimeAllowedAmount: z.number(),
  oldRegimeAppliedAmount: z.number(),
  newRegimeAppliedAmount: z.number(),
  metadata: z.record(z.string(), z.string()).optional(),
  sourceRefs: z.array(z.string()),
});

const taxCreditsSchema = z.object({
  salaryTds: z.array(
    z.object({ employerName: z.string(), tan: z.string(), amount: z.number() }),
  ),
  otherTds: z.array(z.object({ payerName: z.string(), amount: z.number() })),
  tcs: z.array(z.object({ collectorName: z.string(), amount: z.number() })),
  advanceTax: z.array(
    z.object({
      challanNumber: z.string(),
      paidOn: z.string(),
      amount: z.number(),
    }),
  ),
  selfAssessmentTax: z.array(
    z.object({
      challanNumber: z.string(),
      paidOn: z.string(),
      amount: z.number(),
    }),
  ),
});

const taxBankAccountSchema = z.object({
  id: z.string(),
  bankName: z.string(),
  maskedAccountNumber: z.string(),
  ifsc: z.string(),
  accountType: z.enum(['SAVINGS', 'CURRENT']),
  validationStatus: z.enum(['VALIDATED', 'NEEDS_VALIDATION']),
  panLinked: z.boolean(),
});

const eligibilityAnswersSchema = z.object({
  residentialStatus: z.enum(['RESIDENT', 'RNOR', 'NON_RESIDENT', 'NOT_SURE']),
  isDirector: z.boolean(),
  holdsUnlistedShares: z.boolean(),
  hasForeignAssetsOrIncome: z.boolean(),
  hasDeferredEsopTax: z.boolean(),
  hasCarryForwardLoss: z.boolean(),
  expectsIncomeAboveFiftyLakh: z.boolean(),
  agriculturalIncomeAmount: z.number(),
  hasSpecialCategoryIncome: z.boolean(),
  hasIncomeBelongingToAnotherPerson: z.boolean(),
  hasUnclassifiableIncomeSource: z.boolean(),
});

const validationIssueSchema = z.object({
  id: z.string(),
  code: z.string(),
  severity: z.enum(['INFO', 'WARNING', 'BLOCKING', 'ROUTE_CHANGE']),
  sectionId: z.enum([
    'ELIGIBILITY',
    'INCOME_SOURCES',
    'SALARY',
    'HOUSE_PROPERTY',
    'CAPITAL_GAINS',
    'BUSINESS',
    'INTEREST',
    'DEDUCTIONS',
    'TAX_CREDITS',
    'REGIME',
    'BANK',
  ]),
  titleKey: z.string(),
  messageKey: z.string(),
  sourceRefs: z.array(z.string()).optional(),
  fixTarget: z
    .object({ route: z.string(), focusId: z.string().optional() })
    .optional(),
});

const sectionStateSchema = z.object({
  status: z.enum(['NOT_STARTED', 'NEEDS_REVIEW', 'COMPLETE', 'BLOCKED']),
  reviewedAt: z.string().optional(),
  blockingIssues: z.array(validationIssueSchema),
});

const noticeDiscrepancySchema = z.object({
  id: z.string(),
  code: z.enum([
    'WRONG_FORM',
    'UNPAID_DEMAND',
    'TDS_CREDIT_MISSING',
    'OMITTED_INCOME',
  ]),
  labelKey: z.string(),
  declaredAmount: z.number(),
  departmentAmount: z.number(),
  source: z.enum(['CPC', 'FILED_RETURN']),
  target: z
    .object({
      sectionId: z.enum([
        'ELIGIBILITY',
        'INCOME_SOURCES',
        'SALARY',
        'HOUSE_PROPERTY',
        'CAPITAL_GAINS',
        'BUSINESS',
        'INTEREST',
        'DEDUCTIONS',
        'TAX_CREDITS',
        'REGIME',
        'BANK',
      ]),
      route: z.string(),
      focusId: z.string().optional(),
    })
    .optional(),
});

const noticeItemSchema = z.object({
  id: z.string(),
  linkedAcknowledgmentNumber: z.string(),
  fixtureId: z.enum([
    'DEFECTIVE_WRONG_FORM',
    'DEMAND_CONFIRMED',
    'TDS_CREDIT_OMITTED',
    'UPDATED_RETURN_CANDIDATE',
  ]),
  section: z.enum(['139(9)', '143(1)']),
  issuedOn: z.string(),
  responseDeadline: z.string().optional(),
  importedAt: z.string(),
  source: z.object({
    kind: z.literal('SIMULATED_IMPORT'),
    reference: z.string(),
  }),
  discrepancies: z.array(noticeDiscrepancySchema),
  remedy: z.enum(['REFILE', 'PAY', 'RECTIFY', 'ITR_U']),
  state: z.enum(['NOTICE_RECEIVED', 'ACTION_REQUIRED', 'RESOLVED']),
  action: z.object({
    status: z.enum(['NOT_STARTED', 'IN_PROGRESS', 'SUBMITTED', 'COMPLETED']),
    reference: z.string().optional(),
    updatedAt: z.string().optional(),
  }),
});

const deductionResultSchema = z.object({
  section: z.enum(['80C', '80D', '80TTA', '80TTB']),
  label: z.string(),
  enteredAmount: z.number(),
  allowedAmount: z.number(),
  appliedAmount: z.number(),
});

const returnComputationSchema = z.object({
  regime: z.enum(['OLD', 'NEW']),
  income: z.object({
    salary: z.number(),
    houseProperty: z.number(),
    housePropertyLossSetOff: z.number(),
    housePropertyLossCarriedForward: z.number(),
    business: z.number(),
    otherSources: z.number(),
    capitalGains: z.number(),
  }),
  houseProperties: z.array(
    z.object({
      propertyId: z.string(),
      grossAnnualValue: z.number(),
      netAnnualValue: z.number(),
      standardDeduction: z.number(),
      interestAllowed: z.number(),
      incomeOrLoss: z.number(),
    }),
  ),
  capitalGains: z.array(
    z.object({
      transactionId: z.string(),
      section: z.enum(['111A', '112A']),
      holdingPeriodMonths: z.number(),
      gain: z.number(),
      taxableGain: z.number(),
      rate: z.number(),
      tax: z.number(),
    }),
  ),
  business: z
    .object({
      section: z.enum(['44AD', '44ADA', '44AE']),
      grossReceipts: z.number(),
      minimumPresumptiveIncome: z.number(),
      taxableIncome: z.number(),
    })
    .nullable(),
  grossTotalIncome: z.number(),
  deductions: z.array(deductionResultSchema),
  totalIncome: z.number(),
  normalTax: z.number(),
  specialRateTax: z.number(),
  rebate: z.number(),
  surcharge: z.number(),
  marginalRelief: z.number(),
  cess: z.number(),
  interestAndFee: z.object({
    section234A: z.number(),
    section234B: z.number(),
    section234C: z.number(),
    lateFee234F: z.number(),
    total: z.number(),
  }),
  totalTaxLiability: z.number(),
  taxCredits: z.object({ total: z.number() }),
  taxPayable: z.number(),
  refund: z.number(),
});

const returnDraftSchema = z.object({
  assessmentYear: z.string(),
  rulesVersion: z.string(),
  filingType: z.enum(['ORIGINAL', 'DEFECTIVE_RESPONSE']),
  responseToNoticeId: z.string().optional(),
  filingRoute: z.enum([
    'ITR1_LIKE',
    'ITR2_LIKE',
    'ITR4_LIKE',
    'ITR3_ADVANCED',
    'UNSUPPORTED',
  ]),
  residentialStatus: z.enum(['RESIDENT', 'RNOR', 'NON_RESIDENT', 'NOT_SURE']),
  eligibilityAnswers: eligibilityAnswersSchema,
  salary: z.array(salarySourceSchema),
  properties: z.array(housePropertySchema),
  capitalGains: z.array(capitalGainTransactionSchema),
  business: presumptiveBusinessIncomeSchema.nullable(),
  otherSources: z.array(otherSourceIncomeSchema),
  exemptIncome: z.array(z.unknown()),
  deductions: z.array(deductionClaimSchema),
  taxCredits: taxCreditsSchema,
  regime: z.object({
    selected: z.enum(['OLD', 'NEW']).nullable(),
    recommended: z.enum(['OLD', 'NEW']).nullable(),
  }),
  bankAccounts: z.array(taxBankAccountSchema),
  refundAccountId: z.string().nullable(),
  aisReviewItems: z.array(z.unknown()),
  losses: z.object({
    housePropertyCarriedForward: z.number(),
    capitalLossCarriedForward: z.number(),
  }),
  filingDate: z.string(),
  validationIssues: z.array(validationIssueSchema),
  sectionStates: z.record(z.string(), sectionStateSchema),
  notices: z.array(noticeItemSchema),
  computation: z
    .object({ OLD: returnComputationSchema, NEW: returnComputationSchema })
    .nullable(),
  updatedAt: z.string(),
});

const filedReturnSnapshotSchema = z.object({
  acknowledgmentNumber: z.string(),
  filedAt: z.string(),
  rulesVersion: z.string(),
  regime: z.enum(['OLD', 'NEW']),
  filingType: z.enum(['ORIGINAL', 'DEFECTIVE_RESPONSE']),
  parentAcknowledgmentNumber: z.string().optional(),
  draft: returnDraftSchema,
  computation: returnComputationSchema,
  verification: z.object({
    status: z.enum(['PENDING', 'VERIFIED']),
    method: z.literal('AADHAAR_OTP').optional(),
    verifiedAt: z.string().optional(),
  }),
  processing: z.object({
    status: z.enum(['FILED', 'VERIFIED', 'PROCESSED']),
    expectedNextEventOn: z.string().optional(),
    events: z.array(
      z.object({
        id: z.string(),
        kind: z.enum([
          'FILED',
          'VERIFIED',
          'PROCESSED',
          'REFUND_ISSUED',
          'REFUND_CREDITED',
        ]),
        occurredAt: z.string(),
      }),
    ),
  }),
  refund: z
    .object({
      amount: z.number(),
      bankName: z.string(),
      maskedAccountNumber: z.string(),
      status: z.enum(['PROCESSING', 'DELAYED', 'ISSUED', 'CREDITED']),
      delayReason: z.literal('BANK_LINKAGE').optional(),
      expectedNextEventOn: z.string().optional(),
      updatedAt: z.string(),
    })
    .optional(),
});

const suggestedDeductionSchema = z.object({
  id: z.string(),
  section: z.enum(['80C', '80D', '80TTA', '80TTB']),
  label: z.string(),
  amount: z.number(),
  source: z.literal('FORM16'),
});

const taxSourceSnapshotSchema = z.object({
  assessmentYear: z.string(),
  capturedAt: z.string(),
  salary: z.array(salarySourceSchema),
  otherSources: z.array(otherSourceIncomeSchema),
  bankAccounts: z.array(taxBankAccountSchema),
  suggestedDeductions: z.array(suggestedDeductionSchema),
});

export const taxRecordSchema = z.object({
  assessmentYear: z.string(),
  rulesVersion: z.string(),
  sources: taxSourceSnapshotSchema,
  draft: returnDraftSchema.nullable(),
  filedReturns: z.array(filedReturnSnapshotSchema),
  refundScenario: z.enum(['STANDARD', 'BANK_LINKAGE_DELAY']),
});
