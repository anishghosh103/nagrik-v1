import type {
  BusinessIncomeResult,
  PresumptiveBusinessIncome,
  TaxRulesConfig,
} from '../../types/tax';

export interface PresumptiveEligibility {
  eligible: boolean;
  reason:
    | 'ELIGIBLE'
    | 'NON_RESIDENT'
    | 'ACTIVITY_NOT_ELIGIBLE'
    | 'PROFESSION_REQUIRED'
    | 'RECEIPTS_ABOVE_LIMIT'
    | 'TOO_MANY_VEHICLES'
    | 'LOWER_PROFIT';
  result: BusinessIncomeResult | null;
}

export function evaluatePresumptiveBusiness(
  business: PresumptiveBusinessIncome,
  residentialStatus: string,
  rules: TaxRulesConfig,
): PresumptiveEligibility {
  if (residentialStatus !== 'RESIDENT')
    return { eligible: false, reason: 'NON_RESIDENT', result: null };
  if (business.wantsLowerProfit)
    return { eligible: false, reason: 'LOWER_PROFIT', result: null };

  const grossReceipts =
    business.digitalReceipts + business.cashReceipts + business.otherReceipts;
  const cashShare =
    grossReceipts > 0 ? business.cashReceipts / grossReceipts : 0;
  const lowCash = cashShare <= rules.presumptive.cashReceiptThresholdRate;

  if (business.activity === 'SMALL_BUSINESS') {
    const limit = lowCash
      ? rules.presumptive.section44AD.digitalTurnoverLimit
      : rules.presumptive.section44AD.standardTurnoverLimit;
    if (grossReceipts > limit)
      return { eligible: false, reason: 'RECEIPTS_ABOVE_LIMIT', result: null };
    const minimum = Math.round(
      business.digitalReceipts * rules.presumptive.section44AD.digitalRate +
        (business.cashReceipts + business.otherReceipts) *
          rules.presumptive.section44AD.otherRate,
    );
    return {
      eligible: true,
      reason: 'ELIGIBLE',
      result: {
        section: '44AD',
        grossReceipts,
        minimumPresumptiveIncome: minimum,
        taxableIncome: Math.max(minimum, business.declaredProfit),
      },
    };
  }

  if (business.activity === 'SPECIFIED_PROFESSION') {
    if (!business.profession)
      return { eligible: false, reason: 'PROFESSION_REQUIRED', result: null };
    const limit = lowCash
      ? rules.presumptive.section44ADA.digitalReceiptLimit
      : rules.presumptive.section44ADA.standardReceiptLimit;
    if (grossReceipts > limit)
      return { eligible: false, reason: 'RECEIPTS_ABOVE_LIMIT', result: null };
    const minimum = Math.round(
      grossReceipts * rules.presumptive.section44ADA.rate,
    );
    return {
      eligible: true,
      reason: 'ELIGIBLE',
      result: {
        section: '44ADA',
        grossReceipts,
        minimumPresumptiveIncome: minimum,
        taxableIncome: Math.max(minimum, business.declaredProfit),
      },
    };
  }

  if (business.activity === 'GOODS_CARRIAGE') {
    if (
      business.goodsCarriages.length > rules.presumptive.section44AE.maxVehicles
    )
      return { eligible: false, reason: 'TOO_MANY_VEHICLES', result: null };
    const minimum = Math.round(
      business.goodsCarriages.reduce((sum, vehicle) => {
        const monthly =
          vehicle.heavyGoodsVehicle &&
          vehicle.tonnageCapacity >
            rules.presumptive.section44AE.heavyTonnageThreshold
            ? Math.max(0, vehicle.tonnageCapacity) *
              rules.presumptive.section44AE.heavyVehicleMonthlyAmountPerTonne
            : rules.presumptive.section44AE.lightVehicleMonthlyAmount;
        return sum + monthly * Math.min(12, Math.max(0, vehicle.monthsOwned));
      }, 0),
    );
    return {
      eligible: business.goodsCarriages.length > 0,
      reason:
        business.goodsCarriages.length > 0
          ? 'ELIGIBLE'
          : 'ACTIVITY_NOT_ELIGIBLE',
      result:
        business.goodsCarriages.length > 0
          ? {
              section: '44AE',
              grossReceipts,
              minimumPresumptiveIncome: minimum,
              taxableIncome: Math.max(minimum, business.declaredProfit),
            }
          : null,
    };
  }

  return { eligible: false, reason: 'ACTIVITY_NOT_ELIGIBLE', result: null };
}

export function oldRegimeAvailableForBusiness(
  business: PresumptiveBusinessIncome | null,
): boolean {
  if (!business) return true;
  return (
    business.form10IEAStatus === 'FILED_TO_OPT_OUT' ||
    business.form10IEAStatus === 'PREVIOUSLY_OPTED_OLD'
  );
}
