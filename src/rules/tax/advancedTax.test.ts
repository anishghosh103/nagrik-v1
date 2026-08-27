import { describe, expect, it } from 'vitest';
import { getTaxRulesConfig } from '../../data/taxRules';
import type {
  CapitalGainTransaction,
  HouseProperty,
  PresumptiveBusinessIncome,
  ReturnDraft,
  SalarySource,
  SectionId,
  SectionState,
} from '../../types/tax';
import { computeHousePropertyIncome } from './houseProperty';
import { computeCapitalGains } from './capitalGains';
import { evaluatePresumptiveBusiness } from './business';
import { determineFilingRoute } from './filingRoute';
import { computeReturn } from './compute';
import { validateReturn } from './validate';

const rules = getTaxRulesConfig('2026-27');

function draft(overrides: Partial<ReturnDraft> = {}): ReturnDraft {
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
    sectionStates: {} as Record<SectionId, SectionState>,
    notices: [],
    computation: null,
    updatedAt: '2026-08-27T00:00:00.000Z',
    ...overrides,
  };
}

function salary(grossSalary: number, tdsDeducted = 0): SalarySource {
  return {
    id: 'salary-1',
    employerName: 'Employer',
    employerTan: 'TAN123',
    grossSalary,
    salarySection17_1: grossSalary,
    perquisites17_2: 0,
    profitsInLieu17_3: 0,
    exemptAllowances: 0,
    professionalTax: 0,
    employerNps80CCD2: 0,
    tdsDeducted,
    source: 'FORM16',
    reviewed: true,
  };
}

function property(overrides: Partial<HouseProperty> = {}): HouseProperty {
  return {
    id: 'property-1',
    address: '1 Civic Lane',
    ownershipPercentage: 100,
    coOwned: false,
    use: 'SELF_OCCUPIED',
    annualRent: 0,
    unrealisedRent: 0,
    municipalTaxesPaid: 0,
    homeLoanInterest: 0,
    reviewed: true,
    ...overrides,
  };
}

function gain(
  overrides: Partial<CapitalGainTransaction> = {},
): CapitalGainTransaction {
  return {
    id: 'gain-1',
    assetType: 'LISTED_EQUITY',
    description: 'Listed share',
    purchaseDate: '2024-01-01',
    saleDate: '2025-08-01',
    saleConsideration: 325000,
    acquisitionCost: 100000,
    transferExpenses: 0,
    sttPaid: true,
    source: 'USER_ENTERED',
    reviewed: true,
    ...overrides,
  };
}

function business(
  overrides: Partial<PresumptiveBusinessIncome> = {},
): PresumptiveBusinessIncome {
  return {
    id: 'business-1',
    activity: 'SMALL_BUSINESS',
    description: 'Retail trade',
    digitalReceipts: 1000000,
    cashReceipts: 100000,
    otherReceipts: 0,
    declaredProfit: 0,
    wantsLowerProfit: false,
    goodsCarriages: [],
    form10IEAStatus: 'NOT_FILED',
    reviewed: true,
    ...overrides,
  };
}

describe('house property rules', () => {
  it('caps self-occupied interest in the old regime and disallows it in the new regime', () => {
    const homes = [property({ homeLoanInterest: 260000 })];
    const old = computeHousePropertyIncome(homes, 'OLD', rules);
    const fresh = computeHousePropertyIncome(homes, 'NEW', rules);
    expect(old.lossSetOff).toBe(200000);
    expect(old.properties[0].interestAllowed).toBe(200000);
    expect(fresh.properties[0].interestAllowed).toBe(0);
  });

  it('applies municipal tax, 30% deduction, interest, and the loss carry-forward cap', () => {
    const result = computeHousePropertyIncome(
      [
        property({
          use: 'LET_OUT',
          annualRent: 300000,
          municipalTaxesPaid: 20000,
          homeLoanInterest: 500000,
        }),
      ],
      'OLD',
      rules,
    );
    expect(result.properties[0].standardDeduction).toBe(84000);
    expect(result.lossSetOff).toBe(200000);
    expect(result.lossCarriedForward).toBe(104000);
  });
});

describe('capital-gain rules', () => {
  it('keeps 112A gains in a special-rate bucket after the ₹1.25 lakh exemption', () => {
    const result = computeCapitalGains([gain()], rules);
    expect(result.section112ATaxableGain).toBe(100000);
    expect(result.specialRateTax).toBe(12500);
    expect(result.transactions[0].section).toBe('112A');
  });

  it('classifies a short holding under 111A at 20%', () => {
    const result = computeCapitalGains(
      [gain({ purchaseDate: '2025-04-01', saleDate: '2025-08-01' })],
      rules,
    );
    expect(result.transactions[0].section).toBe('111A');
    expect(result.specialRateTax).toBe(45000);
  });
});

describe('presumptive business rules', () => {
  it('calculates 44AD at 6% for digital and 8% for other receipts', () => {
    const result = evaluatePresumptiveBusiness(business(), 'RESIDENT', rules);
    expect(result.eligible).toBe(true);
    expect(result.result?.section).toBe('44AD');
    expect(result.result?.minimumPresumptiveIncome).toBe(68000);
  });

  it('calculates 44ADA at 50% and routes a lower-profit declaration away', () => {
    const eligible = evaluatePresumptiveBusiness(
      business({
        activity: 'SPECIFIED_PROFESSION',
        profession: 'TECHNICAL_CONSULTANCY',
        digitalReceipts: 2000000,
        cashReceipts: 0,
      }),
      'RESIDENT',
      rules,
    );
    const lower = evaluatePresumptiveBusiness(
      business({ wantsLowerProfit: true }),
      'RESIDENT',
      rules,
    );
    expect(eligible.result?.minimumPresumptiveIncome).toBe(1000000);
    expect(lower.reason).toBe('LOWER_PROFIT');
  });

  it('calculates 44AE separately for light and heavy goods vehicles', () => {
    const result = evaluatePresumptiveBusiness(
      business({
        activity: 'GOODS_CARRIAGE',
        goodsCarriages: [
          {
            id: 'light',
            registrationNumber: 'MH12AB1234',
            heavyGoodsVehicle: false,
            tonnageCapacity: 10,
            monthsOwned: 12,
          },
          {
            id: 'heavy',
            registrationNumber: 'MH12AB5678',
            heavyGoodsVehicle: true,
            tonnageCapacity: 15,
            monthsOwned: 6,
          },
        ],
      }),
      'RESIDENT',
      rules,
    );
    expect(result.result?.section).toBe('44AE');
    expect(result.result?.minimumPresumptiveIncome).toBe(180000);
  });
});

describe('routing, surcharge, interest, and payment gate', () => {
  it('uses ITR-1 for limited 112A, ITR-2 for 111A, and ITR-4 for presumptive income', () => {
    expect(
      determineFilingRoute(
        draft({
          capitalGains: [
            gain({ saleConsideration: 200000, acquisitionCost: 100000 }),
          ],
        }),
        rules,
      ),
    ).toBe('ITR1_LIKE');
    expect(
      determineFilingRoute(
        draft({
          capitalGains: [
            gain({ purchaseDate: '2025-04-01', saleDate: '2025-08-01' }),
          ],
        }),
        rules,
      ),
    ).toBe('ITR2_LIKE');
    expect(determineFilingRoute(draft({ business: business() }), rules)).toBe(
      'ITR4_LIKE',
    );
  });

  it('applies surcharge and marginal relief immediately above ₹50 lakh', () => {
    const result = computeReturn(
      draft({ salary: [salary(5075001)] }),
      'NEW',
      rules,
    );
    expect(result.totalIncome).toBe(5000001);
    expect(result.surcharge).toBeGreaterThan(0);
    expect(result.marginalRelief).toBeGreaterThan(0);
  });

  it('computes 234A, 234B, 234C and 234F for a late unpaid return', () => {
    const result = computeReturn(
      draft({ salary: [salary(2000000)], filingDate: '2026-12-03' }),
      'NEW',
      rules,
    );
    expect(result.interestAndFee.section234A).toBeGreaterThan(0);
    expect(result.interestAndFee.section234B).toBeGreaterThan(0);
    expect(result.interestAndFee.section234C).toBeGreaterThan(0);
    expect(result.interestAndFee.lateFee234F).toBe(5000);
  });

  it('stops 234A and 234B accrual on self-assessment tax once paid', () => {
    const unpaidDraft = draft({
      salary: [salary(2000000)],
      filingDate: '2026-12-03',
    });
    const unpaid = computeReturn(unpaidDraft, 'NEW', rules);
    const taxBeforeInterest =
      unpaid.totalTaxLiability - unpaid.interestAndFee.total;
    const paidBeforeDue = draft({
      salary: [salary(2000000)],
      filingDate: '2026-12-03',
      taxCredits: {
        ...unpaidDraft.taxCredits,
        selfAssessmentTax: [
          {
            challanNumber: 'SELF-ASSESSMENT-EARLY',
            paidOn: '2026-08-30',
            amount: taxBeforeInterest,
          },
        ],
      },
    });
    const paid = computeReturn(paidBeforeDue, 'NEW', rules);
    expect(paid.interestAndFee.section234A).toBe(0);
    expect(paid.interestAndFee.section234B).toBeLessThan(
      unpaid.interestAndFee.section234B,
    );
    expect(paid.interestAndFee.section234C).toBe(
      unpaid.interestAndFee.section234C,
    );
  });

  it('blocks filing until self-assessment tax clears the selected balance', () => {
    const initial = draft({
      salary: [salary(2000000)],
      regime: { selected: 'NEW', recommended: 'NEW' },
    });
    const computation = computeReturn(initial, 'NEW', rules);
    const readyToValidate = {
      ...initial,
      computation: {
        OLD: computeReturn(initial, 'OLD', rules),
        NEW: computation,
      },
    };
    expect(
      validateReturn(readyToValidate, rules).some(
        (issue) => issue.code === 'OUTSTANDING_SELF_ASSESSMENT_TAX',
      ),
    ).toBe(true);

    const paid = {
      ...initial,
      taxCredits: {
        ...initial.taxCredits,
        selfAssessmentTax: [
          {
            challanNumber: 'SELF-ASSESSMENT-001',
            paidOn: initial.filingDate,
            amount: computation.taxPayable,
          },
        ],
      },
    };
    const paidComputation = computeReturn(paid, 'NEW', rules);
    const paidAndReady = {
      ...paid,
      computation: {
        OLD: computeReturn(paid, 'OLD', rules),
        NEW: paidComputation,
      },
    };
    expect(paidComputation.taxPayable).toBe(0);
    expect(
      validateReturn(paidAndReady, rules).some(
        (issue) => issue.code === 'OUTSTANDING_SELF_ASSESSMENT_TAX',
      ),
    ).toBe(false);
  });
});
