import type { TaxRegime, TaxRulesConfig } from '../../types/tax';

function rateForIncome(
  totalIncome: number,
  regime: TaxRegime,
  rules: TaxRulesConfig,
): number {
  let rate = 0;
  for (const band of rules.surcharge.thresholds) {
    if (totalIncome > band.above)
      rate = regime === 'OLD' ? band.oldRate : band.newRate;
  }
  return rate;
}

function surchargeOn(
  normalTax: number,
  specialRateTax: number,
  rate: number,
  rules: TaxRulesConfig,
): number {
  return Math.round(
    normalTax * rate +
      specialRateTax * Math.min(rate, rules.surcharge.specialRateIncomeCap),
  );
}

export interface SurchargeResult {
  surcharge: number;
  marginalRelief: number;
  taxPlusSurcharge: number;
}

export function computeSurchargeAndMarginalRelief(input: {
  totalIncome: number;
  normalTax: number;
  specialRateTax: number;
  regime: TaxRegime;
  rules: TaxRulesConfig;
  taxAtIncome: (income: number) => {
    normalTax: number;
    specialRateTax: number;
  };
}): SurchargeResult {
  const { totalIncome, normalTax, specialRateTax, regime, rules } = input;
  const rate = rateForIncome(totalIncome, regime, rules);
  const surcharge = surchargeOn(normalTax, specialRateTax, rate, rules);
  if (rate === 0)
    return {
      surcharge: 0,
      marginalRelief: 0,
      taxPlusSurcharge: normalTax + specialRateTax,
    };

  const threshold = [...rules.surcharge.thresholds]
    .reverse()
    .find((band) => totalIncome > band.above)?.above;
  if (threshold === undefined)
    return {
      surcharge,
      marginalRelief: 0,
      taxPlusSurcharge: normalTax + specialRateTax + surcharge,
    };

  const thresholdTaxes = input.taxAtIncome(threshold);
  const thresholdRate = rateForIncome(threshold, regime, rules);
  const thresholdSurcharge = surchargeOn(
    thresholdTaxes.normalTax,
    thresholdTaxes.specialRateTax,
    thresholdRate,
    rules,
  );
  const currentTaxAndSurcharge = normalTax + specialRateTax + surcharge;
  const maximumWithRelief =
    thresholdTaxes.normalTax +
    thresholdTaxes.specialRateTax +
    thresholdSurcharge +
    (totalIncome - threshold);
  const marginalRelief = Math.max(
    0,
    Math.round(currentTaxAndSurcharge - maximumWithRelief),
  );
  return {
    surcharge,
    marginalRelief,
    taxPlusSurcharge: currentTaxAndSurcharge - marginalRelief,
  };
}
