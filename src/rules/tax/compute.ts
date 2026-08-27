import type {
  AgeCategory,
  RegimeComparison,
  ReturnComputation,
  ReturnDraft,
  TaxRegime,
  TaxRulesConfig,
} from '../../types/tax';
import { computeSalaryIncome } from './salary';
import { computeOtherSourcesIncome } from './otherSources';
import { computeEligibleDeductions } from './deductions';
import { computeHousePropertyIncome } from './houseProperty';
import { computeCapitalGains } from './capitalGains';
import {
  evaluatePresumptiveBusiness,
  oldRegimeAvailableForBusiness,
} from './business';
import { computeSurchargeAndMarginalRelief } from './surcharge';
import { computeInterestAndFee } from './interest';

function ageCategoryFor(): AgeCategory {
  return 'NON_SENIOR';
}

export function computeNormalRateTax(
  taxableIncome: number,
  regime: TaxRegime,
  ageCategory: AgeCategory,
  rules: TaxRulesConfig,
): number {
  const regimeConfig = regime === 'OLD' ? rules.oldRegime : rules.newRegime;
  const slab =
    regimeConfig.slabs.find((item) => item.ageCategory === ageCategory) ??
    regimeConfig.slabs[0];
  let tax = 0;
  let lowerBound = 0;
  for (const band of slab.bands) {
    const upperBound = band.upTo ?? Infinity;
    if (taxableIncome > lowerBound)
      tax += (Math.min(taxableIncome, upperBound) - lowerBound) * band.rate;
    lowerBound = upperBound;
    if (taxableIncome <= upperBound) break;
  }
  return Math.round(tax);
}

function compute87A(
  totalIncome: number,
  normalTax: number,
  regime: TaxRegime,
  isResident: boolean,
  rules: TaxRulesConfig,
): number {
  if (!isResident) return 0;
  const config =
    regime === 'OLD' ? rules.oldRegime.rebate87A : rules.newRegime.rebate87A;
  if (totalIncome <= config.thresholdTotalIncome)
    return Math.min(normalTax, config.maxRebate);
  if (regime === 'NEW') {
    const excessIncome = totalIncome - config.thresholdTotalIncome;
    return Math.max(0, normalTax - excessIncome);
  }
  return 0;
}

function creditTotals(
  draft: ReturnDraft,
  detectedSalaryTds: number,
  detectedOtherTds: number,
) {
  const salaryTds =
    draft.taxCredits.salaryTds.length > 0
      ? draft.taxCredits.salaryTds.reduce((sum, item) => sum + item.amount, 0)
      : detectedSalaryTds;
  const otherTds =
    draft.taxCredits.otherTds.length > 0
      ? draft.taxCredits.otherTds.reduce((sum, item) => sum + item.amount, 0)
      : detectedOtherTds;
  const tcs = draft.taxCredits.tcs.reduce((sum, item) => sum + item.amount, 0);
  const advanceTax = draft.taxCredits.advanceTax.reduce(
    (sum, item) => sum + item.amount,
    0,
  );
  const selfAssessmentTax = draft.taxCredits.selfAssessmentTax.reduce(
    (sum, item) => sum + item.amount,
    0,
  );
  return {
    tdsAndTcs: salaryTds + otherTds + tcs,
    total: salaryTds + otherTds + tcs + advanceTax + selfAssessmentTax,
  };
}

export function computeReturn(
  draft: ReturnDraft,
  regime: TaxRegime,
  rules: TaxRulesConfig,
): ReturnComputation {
  const ageCategory = ageCategoryFor();
  const salary = computeSalaryIncome(draft.salary, regime, rules);
  const otherSources = computeOtherSourcesIncome(draft.otherSources);
  const houseProperty = computeHousePropertyIncome(
    draft.properties,
    regime,
    rules,
  );
  const capitalGains = computeCapitalGains(draft.capitalGains, rules);
  const business = draft.business
    ? evaluatePresumptiveBusiness(
        draft.business,
        draft.eligibilityAnswers.residentialStatus,
        rules,
      ).result
    : null;
  const normalGrossIncome = Math.max(
    0,
    salary.taxableSalary +
      otherSources.taxableOtherSources +
      houseProperty.amountIncludedInGrossTotalIncome +
      (business?.taxableIncome ?? 0),
  );
  const grossTotalIncome =
    normalGrossIncome + capitalGains.totalGainIncludedInIncome;
  const deductions = computeEligibleDeductions(
    draft.deductions,
    regime,
    ageCategory,
    otherSources.savingsInterest,
    otherSources.depositInterest,
    rules,
  );
  const deductionTotal = deductions.reduce(
    (sum, item) => sum + item.appliedAmount,
    0,
  );
  const normalTaxableIncome = Math.max(0, normalGrossIncome - deductionTotal);
  const totalIncome =
    normalTaxableIncome + capitalGains.totalGainIncludedInIncome;
  const normalTaxBeforeRebate = computeNormalRateTax(
    normalTaxableIncome,
    regime,
    ageCategory,
    rules,
  );
  const rebate = compute87A(
    totalIncome,
    normalTaxBeforeRebate,
    regime,
    draft.eligibilityAnswers.residentialStatus === 'RESIDENT',
    rules,
  );
  const normalTaxAfterRebate = Math.max(0, normalTaxBeforeRebate - rebate);
  const specialRateTax = capitalGains.specialRateTax;
  const surchargeResult = computeSurchargeAndMarginalRelief({
    totalIncome,
    normalTax: normalTaxAfterRebate,
    specialRateTax,
    regime,
    rules,
    taxAtIncome: (income) => {
      const specialIncome = Math.min(
        capitalGains.totalGainIncludedInIncome,
        income,
      );
      const normalIncome = Math.max(0, income - specialIncome);
      const shortGain = Math.min(
        capitalGains.section111ATaxableGain,
        specialIncome,
      );
      const longGain = Math.max(
        0,
        Math.min(
          capitalGains.section112ATaxableGain,
          specialIncome - shortGain,
        ),
      );
      return {
        normalTax: computeNormalRateTax(
          normalIncome,
          regime,
          ageCategory,
          rules,
        ),
        specialRateTax: Math.round(
          shortGain * rules.capitalGains.section111ARate +
            longGain * rules.capitalGains.section112ARate,
        ),
      };
    },
  });
  const cess = Math.round(surchargeResult.taxPlusSurcharge * rules.cessRate);
  const taxBeforeInterest = surchargeResult.taxPlusSurcharge + cess;
  const credits = creditTotals(draft, salary.totalTds, otherSources.totalTds);
  const interestAndFee = computeInterestAndFee({
    draft,
    totalIncome,
    taxBeforeInterest,
    tdsAndTcs: credits.tdsAndTcs,
    rules,
  });
  const totalTaxLiability = taxBeforeInterest + interestAndFee.total;
  const balance = totalTaxLiability - credits.total;

  return {
    regime,
    income: {
      salary: salary.taxableSalary,
      houseProperty: houseProperty.amountIncludedInGrossTotalIncome,
      housePropertyLossSetOff: houseProperty.lossSetOff,
      housePropertyLossCarriedForward: houseProperty.lossCarriedForward,
      business: business?.taxableIncome ?? 0,
      otherSources: otherSources.taxableOtherSources,
      capitalGains: capitalGains.totalGainIncludedInIncome,
    },
    houseProperties: houseProperty.properties,
    capitalGains: capitalGains.transactions,
    business,
    grossTotalIncome,
    deductions,
    totalIncome,
    normalTax: normalTaxBeforeRebate,
    specialRateTax,
    rebate,
    surcharge: surchargeResult.surcharge,
    marginalRelief: surchargeResult.marginalRelief,
    cess,
    interestAndFee,
    totalTaxLiability,
    taxCredits: { total: credits.total },
    taxPayable: Math.max(0, balance),
    refund: Math.max(0, -balance),
  };
}

export function compareRegimes(
  draft: ReturnDraft,
  rules: TaxRulesConfig,
): RegimeComparison {
  const fresh = computeReturn(structuredClone(draft), 'NEW', rules);
  const oldAvailable = oldRegimeAvailableForBusiness(draft.business);
  const old = computeReturn(structuredClone(draft), 'OLD', rules);
  const oldNet = old.taxPayable - old.refund;
  const newNet = fresh.taxPayable - fresh.refund;
  const recommended: TaxRegime =
    !oldAvailable || newNet <= oldNet ? 'NEW' : 'OLD';
  return {
    old,
    new: fresh,
    recommended,
    differenceAmount: Math.abs(oldNet - newNet),
  };
}
