import type { OtherSourceIncome } from '../../types/tax';

export function computeOtherSourcesIncome(items: OtherSourceIncome[]): {
  taxableOtherSources: number;
  totalTds: number;
  savingsInterest: number;
  depositInterest: number;
} {
  // Unreviewed or disputed items are never silently included — they surface
  // instead as a BLOCKING validation issue (see rules/tax/validate.ts).
  const reviewed = items.filter((item) => item.reviewed && !item.disputed);
  const taxableOtherSources = reviewed.reduce(
    (sum, item) => sum + item.amount,
    0,
  );
  const totalTds = reviewed.reduce((sum, item) => sum + item.tdsDeducted, 0);
  const savingsInterest = reviewed
    .filter((item) => item.category === 'SAVINGS_INTEREST')
    .reduce((sum, item) => sum + item.amount, 0);
  const depositInterest = reviewed
    .filter((item) => item.category === 'DEPOSIT_INTEREST')
    .reduce((sum, item) => sum + item.amount, 0);
  return { taxableOtherSources, totalTds, savingsInterest, depositInterest };
}
