import type {
  AgeCategory,
  DeductionClaim,
  DeductionResult,
  TaxRegime,
  TaxRulesConfig,
} from '../../types/tax';

export function computeEligibleDeductions(
  claims: DeductionClaim[],
  regime: TaxRegime,
  ageCategory: AgeCategory,
  savingsInterest: number,
  depositInterest: number,
  rules: TaxRulesConfig,
): DeductionResult[] {
  const results: DeductionResult[] = [];

  const section80C = claims.filter((claim) => claim.section === '80C');
  if (section80C.length > 0) {
    const entered = section80C.reduce((sum, c) => sum + c.enteredAmount, 0);
    const allowed = regime === 'OLD' ? rules.deductionCaps.section80C : 0;
    results.push({
      section: '80C',
      label: '80C',
      enteredAmount: entered,
      allowedAmount: allowed,
      appliedAmount: Math.min(entered, allowed),
    });
  }

  const section80D = claims.filter((claim) => claim.section === '80D');
  if (section80D.length > 0) {
    const entered = section80D.reduce((sum, c) => sum + c.enteredAmount, 0);
    const cap =
      ageCategory === 'NON_SENIOR'
        ? rules.deductionCaps.section80D.nonSenior
        : rules.deductionCaps.section80D.senior;
    const allowed = regime === 'OLD' ? cap : 0;
    results.push({
      section: '80D',
      label: '80D',
      enteredAmount: entered,
      allowedAmount: allowed,
      appliedAmount: Math.min(entered, allowed),
    });
  }

  // 80TTA (non-senior, savings-account interest only) vs 80TTB (senior,
  // all eligible deposit interest) — both old-regime only.
  if (regime === 'OLD') {
    if (ageCategory === 'NON_SENIOR' && savingsInterest > 0) {
      const allowed = rules.deductionCaps.section80TTA;
      results.push({
        section: '80TTA',
        label: '80TTA',
        enteredAmount: savingsInterest,
        allowedAmount: allowed,
        appliedAmount: Math.min(savingsInterest, allowed),
      });
    } else if (
      ageCategory !== 'NON_SENIOR' &&
      savingsInterest + depositInterest > 0
    ) {
      const total = savingsInterest + depositInterest;
      const allowed = rules.deductionCaps.section80TTB;
      results.push({
        section: '80TTB',
        label: '80TTB',
        enteredAmount: total,
        allowedAmount: allowed,
        appliedAmount: Math.min(total, allowed),
      });
    }
  }

  return results;
}
