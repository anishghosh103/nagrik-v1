import type { TaxRulesConfig } from '../types/tax';

/** Verified against the Income Tax Department's AY 2026-27 help pages,
 * notified ITR schemas, and validation rules published through August 2026. */
export const TAX_RULES_VERSION = 'ay2026-27.v2-verified-2026-08-27';

const AY_2026_27: TaxRulesConfig = {
  assessmentYear: '2026-27',
  rulesVersion: TAX_RULES_VERSION,
  verified: true,
  newRegime: {
    slabs: [
      {
        ageCategory: 'NON_SENIOR',
        bands: [
          { upTo: 400000, rate: 0 },
          { upTo: 800000, rate: 0.05 },
          { upTo: 1200000, rate: 0.1 },
          { upTo: 1600000, rate: 0.15 },
          { upTo: 2000000, rate: 0.2 },
          { upTo: 2400000, rate: 0.25 },
          { upTo: null, rate: 0.3 },
        ],
      },
    ],
    standardDeduction: 75000,
    // Full erasure of normal-rate tax up to the threshold: tax on exactly
    // ₹12,00,000 under the bands above is ₹60,000, so maxRebate matches.
    rebate87A: { thresholdTotalIncome: 1200000, maxRebate: 60000 },
  },
  oldRegime: {
    slabs: [
      {
        ageCategory: 'NON_SENIOR',
        bands: [
          { upTo: 250000, rate: 0 },
          { upTo: 500000, rate: 0.05 },
          { upTo: 1000000, rate: 0.2 },
          { upTo: null, rate: 0.3 },
        ],
      },
    ],
    standardDeduction: 50000,
    rebate87A: { thresholdTotalIncome: 500000, maxRebate: 12500 },
  },
  cessRate: 0.04,
  deductionCaps: {
    section80C: 150000,
    section80D: {
      nonSenior: 25000,
      senior: 50000,
      nonSeniorParents: 25000,
      seniorParents: 50000,
    },
    section80TTA: 10000,
    section80TTB: 50000,
  },
  filingRoute: {
    itr1IncomeCap: 5000000,
    agriculturalIncomeThreshold: 5000,
    ltcg112AThreshold: 125000,
    maxHouseProperties: 2,
  },
  houseProperty: {
    letOutStandardDeductionRate: 0.3,
    oldRegimeSelfOccupiedInterestCap: 200000,
    oldRegimeInterHeadLossSetOffCap: 200000,
    lossCarryForwardYears: 8,
  },
  capitalGains: {
    listedHoldingMonths: 12,
    section111ARate: 0.2,
    section112ARate: 0.125,
    section112AExemption: 125000,
  },
  presumptive: {
    cashReceiptThresholdRate: 0.05,
    section44AD: {
      standardTurnoverLimit: 20000000,
      digitalTurnoverLimit: 30000000,
      digitalRate: 0.06,
      otherRate: 0.08,
    },
    section44ADA: {
      standardReceiptLimit: 5000000,
      digitalReceiptLimit: 7500000,
      rate: 0.5,
    },
    section44AE: {
      maxVehicles: 10,
      heavyTonnageThreshold: 12,
      lightVehicleMonthlyAmount: 7500,
      heavyVehicleMonthlyAmountPerTonne: 1000,
    },
  },
  surcharge: {
    thresholds: [
      { above: 5000000, oldRate: 0.1, newRate: 0.1 },
      { above: 10000000, oldRate: 0.15, newRate: 0.15 },
      { above: 20000000, oldRate: 0.25, newRate: 0.25 },
      { above: 50000000, oldRate: 0.37, newRate: 0.25 },
    ],
    specialRateIncomeCap: 0.15,
  },
  interestAndFees: {
    nonAuditFilingDueDate: '2026-08-31',
    financialYearStart: '2026-04-01',
    interestRatePerMonth: 0.01,
    advanceTaxThreshold: 10000,
    lateFeeIncomeThreshold: 500000,
    lateFeeBelowThreshold: 1000,
    lateFeeAboveThreshold: 5000,
  },
};

const CONFIGS: Record<string, TaxRulesConfig> = {
  '2026-27': AY_2026_27,
};

export function getTaxRulesConfig(assessmentYear: string): TaxRulesConfig {
  const config = CONFIGS[assessmentYear];
  if (!config) throw new Error('ASSESSMENT_YEAR_NOT_SUPPORTED');
  return structuredClone(config);
}
