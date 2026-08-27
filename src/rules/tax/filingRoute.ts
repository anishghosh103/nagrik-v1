import type { FilingRoute, ReturnDraft, TaxRulesConfig } from '../../types/tax';
import { evaluatePresumptiveBusiness } from './business';
import { computeCapitalGains, isSupportedCapitalGain } from './capitalGains';
import { computeHousePropertyIncome } from './houseProperty';

/**
 * Routes this build can actually take a taxpayer through end to end. This is
 * a build-support gate, separate from route-engine correctness below: a
 * A genuine >₹50L draft resolves to the supported ITR2_LIKE path, while
 * unsupported complexity and non-presumptive business stop before
 * computation rather than showing an approximate result.
 */
export const SUPPORTED_FILING_ROUTES: FilingRoute[] = [
  'ITR1_LIKE',
  'ITR2_LIKE',
  'ITR4_LIKE',
];

export function isRouteSupportedInThisBuild(route: FilingRoute): boolean {
  return SUPPORTED_FILING_ROUTES.includes(route);
}

function hasUnsupportedComplexity(draft: ReturnDraft): boolean {
  const answers = draft.eligibilityAnswers;
  return (
    answers.residentialStatus !== 'RESIDENT' ||
    answers.isDirector ||
    answers.holdsUnlistedShares ||
    answers.hasForeignAssetsOrIncome ||
    answers.hasDeferredEsopTax ||
    answers.hasCarryForwardLoss ||
    answers.hasSpecialCategoryIncome ||
    answers.hasIncomeBelongingToAnotherPerson ||
    answers.hasUnclassifiableIncomeSource
  );
}

function hasBusinessOrProfessionIncome(draft: ReturnDraft): boolean {
  return draft.business !== null;
}

function isEligibleForPresumptiveReturn(
  draft: ReturnDraft,
  rules: TaxRulesConfig,
): boolean {
  if (!draft.business) return false;
  const business = evaluatePresumptiveBusiness(
    draft.business,
    draft.eligibilityAnswers.residentialStatus,
    rules,
  );
  if (!business.eligible) return false;
  return isEligibleForSimpleIndividualReturn(draft, rules, true);
}

function estimateTotalIncome(
  draft: ReturnDraft,
  rules: TaxRulesConfig,
): number {
  const salary = draft.salary.reduce((sum, item) => sum + item.grossSalary, 0);
  const other = draft.otherSources.reduce((sum, item) => sum + item.amount, 0);
  const property = computeHousePropertyIncome(draft.properties, 'OLD', rules);
  const capital = computeCapitalGains(draft.capitalGains, rules);
  const business = draft.business
    ? (evaluatePresumptiveBusiness(
        draft.business,
        draft.eligibilityAnswers.residentialStatus,
        rules,
      ).result?.taxableIncome ?? 0)
    : 0;
  return (
    salary +
    other +
    property.amountIncludedInGrossTotalIncome +
    capital.totalGainIncludedInIncome +
    business
  );
}

function isEligibleForSimpleIndividualReturn(
  draft: ReturnDraft,
  rules: TaxRulesConfig,
  allowBusiness = false,
): boolean {
  const answers = draft.eligibilityAnswers;
  if (answers.residentialStatus !== 'RESIDENT') return false;
  if (answers.isDirector || answers.holdsUnlistedShares) return false;
  if (answers.expectsIncomeAboveFiftyLakh) return false;
  if (estimateTotalIncome(draft, rules) > rules.filingRoute.itr1IncomeCap)
    return false;
  if (
    answers.agriculturalIncomeAmount >
    rules.filingRoute.agriculturalIncomeThreshold
  )
    return false;
  if (draft.properties.length > rules.filingRoute.maxHouseProperties)
    return false;
  if (draft.business && !allowBusiness) return false;
  const capital = computeCapitalGains(draft.capitalGains, rules);
  if (draft.capitalGains.some((item) => !isSupportedCapitalGain(item)))
    return false;
  if (capital.transactions.some((item) => item.section === '111A'))
    return false;
  if (capital.totalGainIncludedInIncome > rules.filingRoute.ltcg112AThreshold)
    return false;
  return true;
}

export function determineFilingRoute(
  draft: ReturnDraft,
  rules: TaxRulesConfig,
): FilingRoute {
  if (hasUnsupportedComplexity(draft)) return 'UNSUPPORTED';
  if (draft.capitalGains.some((item) => !isSupportedCapitalGain(item)))
    return 'UNSUPPORTED';
  if (hasBusinessOrProfessionIncome(draft))
    return isEligibleForPresumptiveReturn(draft, rules)
      ? 'ITR4_LIKE'
      : 'ITR3_ADVANCED';
  if (isEligibleForSimpleIndividualReturn(draft, rules)) return 'ITR1_LIKE';
  return 'ITR2_LIKE';
}

export function explainFilingRoute(route: FilingRoute): string {
  switch (route) {
    case 'ITR1_LIKE':
      return 'tax.filingRoute.explainItr1';
    case 'ITR2_LIKE':
      return 'tax.filingRoute.explainItr2';
    case 'ITR4_LIKE':
      return 'tax.filingRoute.explainItr4';
    case 'ITR3_ADVANCED':
      return 'tax.filingRoute.explainItr3';
    case 'UNSUPPORTED':
      return 'tax.filingRoute.explainUnsupported';
  }
}
