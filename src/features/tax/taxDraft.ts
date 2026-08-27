import type {
  DeductionClaim,
  DeductionSection,
  OtherSourceIncome,
  ReturnDraft,
  SalarySource,
  SectionId,
  SectionState,
  TaxCredits,
  TaxRulesConfig,
  TaxSourceSnapshot,
} from '../../types/tax';

export const SECTION_IDS: SectionId[] = [
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
];

export function emptySectionStates(): Record<SectionId, SectionState> {
  const states = {} as Record<SectionId, SectionState>;
  for (const id of SECTION_IDS)
    states[id] = { status: 'NOT_STARTED', blockingIssues: [] };
  return states;
}

export function markSectionComplete(
  draft: ReturnDraft,
  id: SectionId,
): ReturnDraft {
  return {
    ...draft,
    sectionStates: {
      ...draft.sectionStates,
      [id]: {
        status: 'COMPLETE',
        reviewedAt: new Date().toISOString(),
        blockingIssues: [],
      },
    },
  };
}

export function createDraftFromSources(
  sources: TaxSourceSnapshot,
  rules: TaxRulesConfig,
): ReturnDraft {
  return {
    assessmentYear: sources.assessmentYear,
    rulesVersion: rules.rulesVersion,
    filingType: 'ORIGINAL',
    filingRoute: 'ITR1_LIKE',
    residentialStatus: 'RESIDENT',
    eligibilityAnswers: {
      residentialStatus: 'RESIDENT',
      isDirector: false,
      holdsUnlistedShares: false,
      hasForeignAssetsOrIncome: false,
      hasDeferredEsopTax: false,
      hasCarryForwardLoss: false,
      expectsIncomeAboveFiftyLakh: false,
      agriculturalIncomeAmount: 0,
      hasSpecialCategoryIncome: false,
      hasIncomeBelongingToAnotherPerson: false,
      hasUnclassifiableIncomeSource: false,
    },
    salary: structuredClone(sources.salary),
    properties: [],
    capitalGains: [],
    business: null,
    otherSources: structuredClone(sources.otherSources),
    exemptIncome: [],
    deductions: [],
    taxCredits: {
      salaryTds: [],
      otherTds: [],
      tcs: [],
      advanceTax: [],
      selfAssessmentTax: [],
    },
    regime: { selected: null, recommended: null },
    bankAccounts: structuredClone(sources.bankAccounts),
    refundAccountId: null,
    aisReviewItems: [],
    losses: {
      housePropertyCarriedForward: 0,
      capitalLossCarriedForward: 0,
    },
    filingDate: new Date().toISOString().slice(0, 10),
    validationIssues: [],
    sectionStates: emptySectionStates(),
    notices: [],
    computation: null,
    updatedAt: new Date().toISOString(),
  };
}

export function deductionClaimsFrom(
  entries: {
    section: DeductionSection;
    label: string;
    enteredAmount: number;
    sourceRefs: string[];
  }[],
): DeductionClaim[] {
  return entries
    .filter((entry) => entry.enteredAmount > 0)
    .map((entry, index) => ({
      id: `deduction-${entry.section}-${index}`,
      section: entry.section,
      label: entry.label,
      enteredAmount: entry.enteredAmount,
      oldRegimeAllowedAmount: entry.enteredAmount,
      newRegimeAllowedAmount: 0,
      oldRegimeAppliedAmount: entry.enteredAmount,
      newRegimeAppliedAmount: 0,
      sourceRefs: entry.sourceRefs,
    }));
}

export function taxCreditsFrom(
  salary: SalarySource[],
  otherSources: OtherSourceIncome[],
): TaxCredits {
  return {
    salaryTds: salary
      .filter((source) => source.reviewed && source.tdsDeducted > 0)
      .map((source) => ({
        employerName: source.employerName,
        tan: source.employerTan,
        amount: source.tdsDeducted,
      })),
    otherTds: otherSources
      .filter((item) => item.reviewed && !item.disputed && item.tdsDeducted > 0)
      .map((item) => ({ payerName: item.payerName, amount: item.tdsDeducted })),
    tcs: [],
    advanceTax: [],
    selfAssessmentTax: [],
  };
}
