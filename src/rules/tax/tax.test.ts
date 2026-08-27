import { describe, expect, it } from 'vitest';
import { getTaxRulesConfig } from '../../data/taxRules';
import { determineFilingRoute } from './filingRoute';
import { computeReturn } from './compute';
import { validateReturn } from './validate';
import type {
  DeductionClaim,
  OtherSourceIncome,
  ReturnDraft,
  SalarySource,
  SectionId,
  SectionState,
} from '../../types/tax';

const rules = getTaxRulesConfig('2026-27');

const SECTION_IDS: SectionId[] = [
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

function emptySectionStates(): Record<SectionId, SectionState> {
  const states = {} as Record<SectionId, SectionState>;
  for (const id of SECTION_IDS)
    states[id] = { status: 'NOT_STARTED', blockingIssues: [] };
  return states;
}

function baseDraft(overrides: Partial<ReturnDraft> = {}): ReturnDraft {
  return {
    assessmentYear: '2026-27',
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
    salary: [],
    properties: [],
    capitalGains: [],
    business: null,
    otherSources: [],
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
    bankAccounts: [],
    refundAccountId: null,
    aisReviewItems: [],
    losses: {
      housePropertyCarriedForward: 0,
      capitalLossCarriedForward: 0,
    },
    filingDate: '2026-08-27',
    validationIssues: [],
    sectionStates: emptySectionStates(),
    notices: [],
    computation: null,
    updatedAt: '2026-08-24T00:00:00.000Z',
    ...overrides,
  };
}

function salarySource(overrides: Partial<SalarySource> = {}): SalarySource {
  return {
    id: 's-1',
    employerName: 'Employer',
    employerTan: 'TAN1234A',
    grossSalary: 900000,
    salarySection17_1: 900000,
    perquisites17_2: 0,
    profitsInLieu17_3: 0,
    exemptAllowances: 0,
    professionalTax: 0,
    employerNps80CCD2: 0,
    tdsDeducted: 40000,
    source: 'FORM16',
    reviewed: true,
    ...overrides,
  };
}

function otherSource(
  overrides: Partial<OtherSourceIncome> = {},
): OtherSourceIncome {
  return {
    id: 'o-1',
    category: 'SAVINGS_INTEREST',
    payerName: 'Bank',
    maskedReference: '••••1234',
    amount: 6000,
    tdsDeducted: 0,
    source: 'AIS',
    reviewed: true,
    ...overrides,
  };
}

describe('determineFilingRoute', () => {
  it('routes an ordinary resident salaried draft to ITR1_LIKE', () => {
    const draft = baseDraft({ salary: [salarySource()] });
    expect(determineFilingRoute(draft, rules)).toBe('ITR1_LIKE');
  });

  it('keeps ITR1_LIKE reachable exactly at the ₹50 lakh cap', () => {
    const draft = baseDraft({
      salary: [salarySource({ grossSalary: 5000000 })],
    });
    expect(determineFilingRoute(draft, rules)).toBe('ITR1_LIKE');
  });

  it('routes to ITR2_LIKE one rupee above the ₹50 lakh cap', () => {
    const draft = baseDraft({
      salary: [salarySource({ grossSalary: 5000001 })],
    });
    expect(determineFilingRoute(draft, rules)).toBe('ITR2_LIKE');
  });

  it('keeps ITR1_LIKE reachable exactly at the agricultural income threshold', () => {
    const draft = baseDraft({
      salary: [salarySource()],
      eligibilityAnswers: {
        ...baseDraft().eligibilityAnswers,
        agriculturalIncomeAmount: 5000,
      },
    });
    expect(determineFilingRoute(draft, rules)).toBe('ITR1_LIKE');
  });

  it('routes to ITR2_LIKE one rupee above the agricultural income threshold', () => {
    const draft = baseDraft({
      salary: [salarySource()],
      eligibilityAnswers: {
        ...baseDraft().eligibilityAnswers,
        agriculturalIncomeAmount: 5001,
      },
    });
    expect(determineFilingRoute(draft, rules)).toBe('ITR2_LIKE');
  });

  it('routes foreign assets/income to UNSUPPORTED', () => {
    const draft = baseDraft({
      salary: [salarySource()],
      eligibilityAnswers: {
        ...baseDraft().eligibilityAnswers,
        hasForeignAssetsOrIncome: true,
      },
    });
    expect(determineFilingRoute(draft, rules)).toBe('UNSUPPORTED');
  });
});

describe('computeReturn', () => {
  it('computes OLD and NEW regimes independently without cross-mutation', () => {
    const claim: DeductionClaim = {
      id: 'd-1',
      section: '80C',
      label: '80C',
      enteredAmount: 120000,
      oldRegimeAllowedAmount: 120000,
      newRegimeAllowedAmount: 0,
      oldRegimeAppliedAmount: 120000,
      newRegimeAppliedAmount: 0,
      sourceRefs: ['You entered this'],
    };
    const draft = baseDraft({
      salary: [salarySource({ grossSalary: 900000, tdsDeducted: 40000 })],
      deductions: [claim],
    });
    const old = computeReturn(structuredClone(draft), 'OLD', rules);
    const fresh = computeReturn(structuredClone(draft), 'NEW', rules);
    // Original draft object must be untouched by either call.
    expect(draft.deductions[0].enteredAmount).toBe(120000);
    const oldSection80C = old.deductions.find((d) => d.section === '80C');
    const newSection80C = fresh.deductions.find((d) => d.section === '80C');
    expect(oldSection80C?.appliedAmount).toBe(120000);
    expect(newSection80C?.appliedAmount).toBe(0);
    expect(old.totalIncome).not.toBe(fresh.totalIncome);
  });

  it('applies the full 87A rebate at ₹12,00,000 and marginal relief just above it', () => {
    const atThreshold = baseDraft({
      salary: [salarySource({ grossSalary: 1275000, tdsDeducted: 0 })],
    });
    const aboveThreshold = baseDraft({
      salary: [salarySource({ grossSalary: 1275001, tdsDeducted: 0 })],
    });
    const atResult = computeReturn(atThreshold, 'NEW', rules);
    const aboveResult = computeReturn(aboveThreshold, 'NEW', rules);
    expect(atResult.totalIncome).toBe(1200000);
    expect(atResult.rebate).toBeGreaterThan(0);
    expect(atResult.totalTaxLiability).toBe(0);
    expect(aboveResult.rebate).toBeGreaterThan(0);
    expect(aboveResult.rebate).toBeLessThan(atResult.rebate);
  });

  it('applies exactly 4% cess on tax after rebate and surcharge', () => {
    const draft = baseDraft({
      salary: [salarySource({ grossSalary: 2000000, tdsDeducted: 0 })],
    });
    const result = computeReturn(draft, 'NEW', rules);
    const taxAfterRebate = result.normalTax - result.rebate;
    expect(result.cess).toBe(Math.round(taxAfterRebate * 0.04));
  });

  it('never lets tax credits affect income or total-income figures', () => {
    const lowTds = baseDraft({
      salary: [salarySource({ grossSalary: 900000, tdsDeducted: 0 })],
    });
    const highTds = baseDraft({
      salary: [salarySource({ grossSalary: 900000, tdsDeducted: 90000 })],
    });
    const lowResult = computeReturn(lowTds, 'OLD', rules);
    const highResult = computeReturn(highTds, 'OLD', rules);
    expect(lowResult.grossTotalIncome).toBe(highResult.grossTotalIncome);
    expect(lowResult.totalIncome).toBe(highResult.totalIncome);
    expect(lowResult.taxCredits.total).not.toBe(highResult.taxCredits.total);
  });

  it('preserves entered amount while capping applied amount above the 80C cap', () => {
    const claim: DeductionClaim = {
      id: 'd-1',
      section: '80C',
      label: '80C',
      enteredAmount: 180000,
      oldRegimeAllowedAmount: 180000,
      newRegimeAllowedAmount: 0,
      oldRegimeAppliedAmount: 150000,
      newRegimeAppliedAmount: 0,
      sourceRefs: ['You entered this'],
    };
    const draft = baseDraft({
      salary: [salarySource()],
      deductions: [claim],
    });
    const result = computeReturn(draft, 'OLD', rules);
    const section80C = result.deductions.find((d) => d.section === '80C');
    expect(section80C?.enteredAmount).toBe(180000);
    expect(section80C?.appliedAmount).toBe(150000);
  });
});

describe('validateReturn', () => {
  it('blocks on an unreviewed other-income item and clears after review', () => {
    const draft = baseDraft({
      salary: [],
      otherSources: [otherSource({ reviewed: false })],
      regime: { selected: 'NEW', recommended: 'NEW' },
    });
    const issues = validateReturn(draft, rules);
    const blocking = issues.filter((issue) => issue.severity === 'BLOCKING');
    expect(blocking).toHaveLength(1);
    expect(blocking[0].code).toBe('UNREVIEWED_OTHER_INCOME');

    const resolved = baseDraft({
      salary: [],
      otherSources: [otherSource({ reviewed: true })],
      regime: { selected: 'NEW', recommended: 'NEW' },
    });
    const resolvedIssues = validateReturn(resolved, rules);
    expect(resolvedIssues.some((issue) => issue.severity === 'BLOCKING')).toBe(
      false,
    );
  });
});
