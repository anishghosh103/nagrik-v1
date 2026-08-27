import type {
  CapitalGainResult,
  CapitalGainTransaction,
  TaxRulesConfig,
} from '../../types/tax';

export interface CapitalGainsComputation {
  transactions: CapitalGainResult[];
  totalGainIncludedInIncome: number;
  section111ATaxableGain: number;
  section112ATaxableGain: number;
  specialRateTax: number;
  carriedForwardLoss: number;
}

function holdingMonths(purchaseDate: string, saleDate: string): number {
  const purchase = new Date(`${purchaseDate}T00:00:00Z`);
  const sale = new Date(`${saleDate}T00:00:00Z`);
  if (!Number.isFinite(purchase.getTime()) || !Number.isFinite(sale.getTime()))
    return 0;
  const months =
    (sale.getUTCFullYear() - purchase.getUTCFullYear()) * 12 +
    sale.getUTCMonth() -
    purchase.getUTCMonth();
  return Math.max(
    0,
    sale.getUTCDate() < purchase.getUTCDate() ? months - 1 : months,
  );
}

export function isSupportedCapitalGain(item: CapitalGainTransaction): boolean {
  return item.assetType !== 'UNSUPPORTED' && item.sttPaid;
}

export function computeCapitalGains(
  items: CapitalGainTransaction[],
  rules: TaxRulesConfig,
): CapitalGainsComputation {
  const classified = items.filter(isSupportedCapitalGain).map((item) => {
    const months = holdingMonths(item.purchaseDate, item.saleDate);
    const section =
      months >= rules.capitalGains.listedHoldingMonths ? '112A' : '111A';
    return {
      item,
      months,
      section,
      gain: Math.round(
        item.saleConsideration - item.acquisitionCost - item.transferExpenses,
      ),
    } as const;
  });

  let shortTerm = classified
    .filter((item) => item.section === '111A')
    .reduce((sum, item) => sum + item.gain, 0);
  let longTerm = classified
    .filter((item) => item.section === '112A')
    .reduce((sum, item) => sum + item.gain, 0);

  if (shortTerm < 0 && longTerm > 0) {
    const offset = Math.min(Math.abs(shortTerm), longTerm);
    shortTerm += offset;
    longTerm -= offset;
  }
  const netShort = Math.max(0, shortTerm);
  const netLong = Math.max(0, longTerm);
  const section112ATaxableGain = Math.max(
    0,
    netLong - rules.capitalGains.section112AExemption,
  );
  const section111ATaxableGain = netShort;
  const specialRateTax = Math.round(
    section111ATaxableGain * rules.capitalGains.section111ARate +
      section112ATaxableGain * rules.capitalGains.section112ARate,
  );
  let remaining112AExemption = rules.capitalGains.section112AExemption;

  const transactions: CapitalGainResult[] = classified.map((entry) => {
    const positiveGain = Math.max(0, entry.gain);
    let taxableGain = positiveGain;
    const rate =
      entry.section === '111A'
        ? rules.capitalGains.section111ARate
        : rules.capitalGains.section112ARate;
    if (entry.section === '112A') {
      const exempt = Math.min(positiveGain, remaining112AExemption);
      remaining112AExemption -= exempt;
      taxableGain -= exempt;
    }
    return {
      transactionId: entry.item.id,
      section: entry.section,
      holdingPeriodMonths: entry.months,
      gain: entry.gain,
      taxableGain,
      rate,
      tax: Math.round(taxableGain * rate),
    };
  });

  return {
    transactions,
    totalGainIncludedInIncome: netShort + netLong,
    section111ATaxableGain,
    section112ATaxableGain,
    specialRateTax,
    carriedForwardLoss: Math.max(0, -shortTerm) + Math.max(0, -longTerm),
  };
}
