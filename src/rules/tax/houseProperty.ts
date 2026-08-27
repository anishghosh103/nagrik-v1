import type {
  HouseProperty,
  HousePropertyResult,
  TaxRegime,
  TaxRulesConfig,
} from '../../types/tax';

export interface HousePropertyComputation {
  properties: HousePropertyResult[];
  headIncome: number;
  amountIncludedInGrossTotalIncome: number;
  lossSetOff: number;
  lossCarriedForward: number;
}

export function computeHousePropertyIncome(
  properties: HouseProperty[],
  regime: TaxRegime,
  rules: TaxRulesConfig,
): HousePropertyComputation {
  let remainingSelfOccupiedInterest =
    regime === 'OLD' ? rules.houseProperty.oldRegimeSelfOccupiedInterestCap : 0;

  const results = properties.map((property): HousePropertyResult => {
    const share =
      Math.min(100, Math.max(0, property.ownershipPercentage)) / 100;
    if (property.use === 'SELF_OCCUPIED') {
      const interestAllowed = Math.min(
        property.homeLoanInterest * share,
        remainingSelfOccupiedInterest,
      );
      remainingSelfOccupiedInterest -= interestAllowed;
      return {
        propertyId: property.id,
        grossAnnualValue: 0,
        netAnnualValue: 0,
        standardDeduction: 0,
        interestAllowed,
        incomeOrLoss: -interestAllowed,
      };
    }

    const grossAnnualValue =
      Math.max(0, property.annualRent - property.unrealisedRent) * share;
    const municipalTaxes = Math.min(
      grossAnnualValue,
      Math.max(0, property.municipalTaxesPaid * share),
    );
    const netAnnualValue = Math.max(0, grossAnnualValue - municipalTaxes);
    const standardDeduction =
      netAnnualValue * rules.houseProperty.letOutStandardDeductionRate;
    const interestAllowed = Math.max(0, property.homeLoanInterest * share);
    return {
      propertyId: property.id,
      grossAnnualValue: Math.round(grossAnnualValue),
      netAnnualValue: Math.round(netAnnualValue),
      standardDeduction: Math.round(standardDeduction),
      interestAllowed: Math.round(interestAllowed),
      incomeOrLoss: Math.round(
        netAnnualValue - standardDeduction - interestAllowed,
      ),
    };
  });

  const headIncome = results.reduce((sum, item) => sum + item.incomeOrLoss, 0);
  if (headIncome >= 0) {
    return {
      properties: results,
      headIncome,
      amountIncludedInGrossTotalIncome: headIncome,
      lossSetOff: 0,
      lossCarriedForward: 0,
    };
  }

  if (regime === 'NEW') {
    return {
      properties: results,
      headIncome,
      amountIncludedInGrossTotalIncome: 0,
      lossSetOff: 0,
      lossCarriedForward: 0,
    };
  }

  const totalLoss = Math.abs(headIncome);
  const lossSetOff = Math.min(
    totalLoss,
    rules.houseProperty.oldRegimeInterHeadLossSetOffCap,
  );
  return {
    properties: results,
    headIncome,
    amountIncludedInGrossTotalIncome: -lossSetOff,
    lossSetOff,
    lossCarriedForward: totalLoss - lossSetOff,
  };
}
