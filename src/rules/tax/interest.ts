import type { ReturnDraft, TaxRulesConfig } from '../../types/tax';

export interface InterestFeeResult {
  section234A: number;
  section234B: number;
  section234C: number;
  lateFee234F: number;
  total: number;
}

function parseDate(value: string): Date {
  return new Date(`${value}T00:00:00Z`);
}

function roundedInterest(base: number, months: number, rate: number): number {
  const roundedBase = Math.floor(Math.max(0, base) / 100) * 100;
  return Math.round(roundedBase * months * rate);
}

function interestWithDatedPayments(input: {
  base: number;
  start: string;
  end: string;
  payments: { paidOn: string; amount: number }[];
  rate: number;
}): number {
  const start = parseDate(input.start);
  const end = parseDate(input.end);
  if (end < start) return 0;

  const relevantPayments = input.payments
    .filter((payment) => payment.paidOn <= input.end)
    .toSorted((left, right) => left.paidOn.localeCompare(right.paidOn));
  let balance = Math.max(
    0,
    input.base -
      relevantPayments
        .filter((payment) => payment.paidOn < input.start)
        .reduce((sum, payment) => sum + payment.amount, 0),
  );
  let interest = 0;
  let month = new Date(
    Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), 1),
  );
  const finalMonth = new Date(
    Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), 1),
  );

  while (month <= finalMonth && balance > 0) {
    interest += roundedInterest(balance, 1, input.rate);
    const nextMonth = new Date(
      Date.UTC(month.getUTCFullYear(), month.getUTCMonth() + 1, 1),
    );
    const paidDuringMonth = relevantPayments
      .filter((payment) => {
        const paidOn = parseDate(payment.paidOn);
        return paidOn >= start && paidOn >= month && paidOn < nextMonth;
      })
      .reduce((sum, payment) => sum + payment.amount, 0);
    balance = Math.max(0, balance - paidDuringMonth);
    month = nextMonth;
  }
  return interest;
}

function paidBy(
  payments: { paidOn: string; amount: number }[],
  date: string,
): number {
  return payments
    .filter((payment) => payment.paidOn <= date)
    .reduce((sum, payment) => sum + payment.amount, 0);
}

export function computeInterestAndFee(input: {
  draft: ReturnDraft;
  totalIncome: number;
  taxBeforeInterest: number;
  tdsAndTcs: number;
  rules: TaxRulesConfig;
}): InterestFeeResult {
  const { draft, totalIncome, taxBeforeInterest, tdsAndTcs, rules } = input;
  const advanceTax = draft.taxCredits.advanceTax;
  const advanceTaxTotal = advanceTax.reduce(
    (sum, item) => sum + item.amount,
    0,
  );
  const selfAssessmentTax = draft.taxCredits.selfAssessmentTax;
  const assessedTax = Math.max(0, taxBeforeInterest - tdsAndTcs);
  const dueDate = rules.interestAndFees.nonAuditFilingDueDate;
  const isLate = draft.filingDate > dueDate;
  const lateInterestStart = new Date(parseDate(dueDate).getTime() + 86_400_000)
    .toISOString()
    .slice(0, 10);
  const section234A = isLate
    ? interestWithDatedPayments({
        base: assessedTax - advanceTaxTotal,
        start: lateInterestStart,
        end: draft.filingDate,
        payments: selfAssessmentTax,
        rate: rules.interestAndFees.interestRatePerMonth,
      })
    : 0;

  const section234B =
    assessedTax >= rules.interestAndFees.advanceTaxThreshold &&
    advanceTaxTotal < assessedTax * 0.9
      ? interestWithDatedPayments({
          base: assessedTax - advanceTaxTotal,
          start: rules.interestAndFees.financialYearStart,
          end: draft.filingDate,
          payments: selfAssessmentTax,
          rate: rules.interestAndFees.interestRatePerMonth,
        })
      : 0;

  const isPresumptive = draft.business !== null;
  const instalments = isPresumptive
    ? [{ date: '2026-03-15', share: 1, months: 1 }]
    : [
        { date: '2025-06-15', share: 0.15, months: 3 },
        { date: '2025-09-15', share: 0.45, months: 3 },
        { date: '2025-12-15', share: 0.75, months: 3 },
        { date: '2026-03-15', share: 1, months: 1 },
      ];
  const section234C =
    assessedTax < rules.interestAndFees.advanceTaxThreshold
      ? 0
      : instalments.reduce((sum, instalment) => {
          const shortfall =
            assessedTax * instalment.share -
            paidBy(advanceTax, instalment.date);
          return (
            sum +
            roundedInterest(
              shortfall,
              instalment.months,
              rules.interestAndFees.interestRatePerMonth,
            )
          );
        }, 0);

  const lateFee234F = isLate
    ? totalIncome <= rules.interestAndFees.lateFeeIncomeThreshold
      ? rules.interestAndFees.lateFeeBelowThreshold
      : rules.interestAndFees.lateFeeAboveThreshold
    : 0;
  return {
    section234A,
    section234B,
    section234C,
    lateFee234F,
    total: section234A + section234B + section234C + lateFee234F,
  };
}
