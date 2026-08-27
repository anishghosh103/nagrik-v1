import type { SalarySource, TaxRegime, TaxRulesConfig } from '../../types/tax';

export function computeSalaryIncome(
  sources: SalarySource[],
  regime: TaxRegime,
  rules: TaxRulesConfig,
): { taxableSalary: number; standardDeduction: number; totalTds: number } {
  const reviewed = sources.filter((source) => source.reviewed);
  const grossTotal = reviewed.reduce((sum, s) => sum + s.grossSalary, 0);
  const exemptTotal = reviewed.reduce((sum, s) => sum + s.exemptAllowances, 0);
  // Professional tax is deductible only under the old regime.
  const professionalTaxTotal =
    regime === 'OLD'
      ? reviewed.reduce((sum, s) => sum + s.professionalTax, 0)
      : 0;
  const standardDeduction =
    reviewed.length > 0
      ? regime === 'OLD'
        ? rules.oldRegime.standardDeduction
        : rules.newRegime.standardDeduction
      : 0;
  const taxableSalary = Math.max(
    0,
    grossTotal - exemptTotal - professionalTaxTotal - standardDeduction,
  );
  const totalTds = reviewed.reduce((sum, s) => sum + s.tdsDeducted, 0);
  return { taxableSalary, standardDeduction, totalTds };
}
