import type {
  ReturnDraft,
  TaxRulesConfig,
  ValidationIssue,
} from '../../types/tax';
import { determineFilingRoute } from './filingRoute';
import { isRouteSupportedInThisBuild } from './filingRoute';
import { evaluatePresumptiveBusiness } from './business';
import { computeOtherSourcesIncome } from './otherSources';
import { computeEligibleDeductions } from './deductions';

export function validateReturn(
  draft: ReturnDraft,
  rules: TaxRulesConfig,
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  for (const source of draft.salary) {
    if (!source.reviewed) {
      issues.push({
        id: `tax-unreviewed-salary-${source.id}`,
        code: 'UNREVIEWED_SALARY_SOURCE',
        severity: 'BLOCKING',
        sectionId: 'SALARY',
        titleKey: 'tax.validation.unreviewedSalaryTitle',
        messageKey: 'tax.validation.unreviewedSalaryMessage',
        sourceRefs: [source.employerName],
        fixTarget: { route: '/tax/file/income', focusId: source.id },
      });
    }
    if (source.tdsDeducted > 0 && source.grossSalary === 0) {
      issues.push({
        id: `tax-tds-without-salary-${source.id}`,
        code: 'TDS_WITHOUT_SALARY',
        severity: 'BLOCKING',
        sectionId: 'SALARY',
        titleKey: 'tax.validation.tdsWithoutSalaryTitle',
        messageKey: 'tax.validation.tdsWithoutSalaryMessage',
        sourceRefs: [source.employerName],
        fixTarget: { route: '/tax/file/income', focusId: source.id },
      });
    }
  }

  for (const item of draft.otherSources) {
    if (!item.reviewed && !item.disputed) {
      issues.push({
        id: `tax-unreviewed-other-${item.id}`,
        code: 'UNREVIEWED_OTHER_INCOME',
        severity: 'BLOCKING',
        sectionId: 'INTEREST',
        titleKey: 'tax.validation.unreviewedOtherTitle',
        messageKey: 'tax.validation.unreviewedOtherMessage',
        sourceRefs: [item.payerName],
        fixTarget: { route: '/tax/file/income', focusId: item.id },
      });
    }
  }

  for (const property of draft.properties) {
    if (!property.reviewed || !property.address.trim()) {
      issues.push({
        id: `tax-property-review-${property.id}`,
        code: 'HOUSE_PROPERTY_REVIEW_REQUIRED',
        severity: 'BLOCKING',
        sectionId: 'HOUSE_PROPERTY',
        titleKey: 'tax.validation.propertyReviewTitle',
        messageKey: 'tax.validation.propertyReviewMessage',
        fixTarget: { route: '/tax/file/income-details', focusId: property.id },
      });
    }
    if (
      property.homeLoanInterest > 0 &&
      (!property.lenderName?.trim() || !property.loanAccountNumber?.trim())
    ) {
      issues.push({
        id: `tax-property-loan-${property.id}`,
        code: 'HOME_LOAN_METADATA_REQUIRED',
        severity: 'BLOCKING',
        sectionId: 'HOUSE_PROPERTY',
        titleKey: 'tax.validation.loanDetailsTitle',
        messageKey: 'tax.validation.loanDetailsMessage',
        fixTarget: { route: '/tax/file/income-details', focusId: property.id },
      });
    }
  }

  for (const gain of draft.capitalGains) {
    if (!gain.reviewed || !gain.description.trim() || !gain.sttPaid) {
      issues.push({
        id: `tax-capital-review-${gain.id}`,
        code: 'CAPITAL_GAIN_REVIEW_REQUIRED',
        severity: 'BLOCKING',
        sectionId: 'CAPITAL_GAINS',
        titleKey: 'tax.validation.capitalReviewTitle',
        messageKey: 'tax.validation.capitalReviewMessage',
        fixTarget: { route: '/tax/file/income-details', focusId: gain.id },
      });
    }
  }

  if (draft.business) {
    const business = evaluatePresumptiveBusiness(
      draft.business,
      draft.eligibilityAnswers.residentialStatus,
      rules,
    );
    if (!draft.business.reviewed || !business.eligible) {
      issues.push({
        id: 'tax-business-review',
        code: 'PRESUMPTIVE_BUSINESS_NOT_READY',
        severity: 'BLOCKING',
        sectionId: 'BUSINESS',
        titleKey: 'tax.validation.businessReviewTitle',
        messageKey: 'tax.validation.businessReviewMessage',
        fixTarget: {
          route: '/tax/file/income-details',
          focusId: draft.business.id,
        },
      });
    }
  }

  // Deduction caps are enforced at the aggregate section level (not per
  // claim) — recompute the old-regime result (all Phase-1 sections are
  // old-regime-only) to see whether any section's entered total was capped.
  const otherSources = computeOtherSourcesIncome(draft.otherSources);
  const deductionResults = computeEligibleDeductions(
    draft.deductions,
    'OLD',
    'NON_SENIOR',
    otherSources.savingsInterest,
    otherSources.depositInterest,
    rules,
  );
  for (const result of deductionResults) {
    if (result.enteredAmount > result.appliedAmount) {
      issues.push({
        id: `tax-deduction-capped-${result.section}`,
        code: 'DEDUCTION_CAPPED',
        severity: 'INFO',
        sectionId: 'DEDUCTIONS',
        titleKey: 'tax.validation.deductionCappedTitle',
        messageKey: 'tax.validation.deductionCappedMessage',
        sourceRefs: [result.label],
      });
    }
  }

  if (draft.salary.some((source) => source.reviewed)) {
    issues.push({
      id: 'tax-standard-deduction-applied',
      code: 'STANDARD_DEDUCTION_APPLIED',
      severity: 'INFO',
      sectionId: 'SALARY',
      titleKey: 'tax.validation.standardDeductionTitle',
      messageKey: 'tax.validation.standardDeductionMessage',
    });
  }

  if (!draft.regime.selected) {
    issues.push({
      id: 'tax-no-regime-selected',
      code: 'NO_REGIME_SELECTED',
      severity: 'BLOCKING',
      sectionId: 'REGIME',
      titleKey: 'tax.validation.noRegimeTitle',
      messageKey: 'tax.validation.noRegimeMessage',
      fixTarget: { route: '/tax/file/regime' },
    });
  }

  const selectedComputation =
    draft.regime.selected && draft.computation
      ? draft.computation[draft.regime.selected]
      : null;
  const refundExpected = (selectedComputation?.refund ?? 0) > 0;
  const hasValidatedAccount = draft.bankAccounts.some(
    (account) => account.validationStatus === 'VALIDATED',
  );
  if (refundExpected && !hasValidatedAccount) {
    issues.push({
      id: 'tax-refund-account-not-validated',
      code: 'REFUND_ACCOUNT_NOT_VALIDATED',
      severity: 'BLOCKING',
      sectionId: 'BANK',
      titleKey: 'tax.validation.bankNotValidatedTitle',
      messageKey: 'tax.validation.bankNotValidatedMessage',
      fixTarget: { route: '/tax/file/regime' },
    });
  }

  const recomputedRoute = determineFilingRoute(draft, rules);
  if (recomputedRoute !== draft.filingRoute) {
    issues.push({
      id: 'tax-filing-route-changed',
      code: 'FILING_ROUTE_CHANGED',
      severity: 'ROUTE_CHANGE',
      sectionId: 'ELIGIBILITY',
      titleKey: 'tax.validation.routeChangedTitle',
      messageKey: 'tax.validation.routeChangedMessage',
      fixTarget: { route: '/tax/file' },
    });
  }

  if (!isRouteSupportedInThisBuild(recomputedRoute)) {
    issues.push({
      id: 'tax-route-not-supported',
      code: 'FILING_ROUTE_NOT_SUPPORTED',
      severity: 'BLOCKING',
      sectionId: 'ELIGIBILITY',
      titleKey: 'tax.validation.routeUnsupportedTitle',
      messageKey: 'tax.validation.routeUnsupportedMessage',
      fixTarget: { route: '/tax/file' },
    });
  }

  const challanNumbers = [
    ...draft.taxCredits.advanceTax,
    ...draft.taxCredits.selfAssessmentTax,
  ].map((payment) => payment.challanNumber.trim().toUpperCase());
  if (new Set(challanNumbers).size !== challanNumbers.length) {
    issues.push({
      id: 'tax-duplicate-challan',
      code: 'DUPLICATE_TAX_PAYMENT',
      severity: 'BLOCKING',
      sectionId: 'TAX_CREDITS',
      titleKey: 'tax.validation.duplicatePaymentTitle',
      messageKey: 'tax.validation.duplicatePaymentMessage',
      fixTarget: { route: '/tax/file/payment' },
    });
  }

  if ((selectedComputation?.taxPayable ?? 0) > 0) {
    issues.push({
      id: 'tax-outstanding-self-assessment',
      code: 'OUTSTANDING_SELF_ASSESSMENT_TAX',
      severity: 'BLOCKING',
      sectionId: 'TAX_CREDITS',
      titleKey: 'tax.validation.outstandingTaxTitle',
      messageKey: 'tax.validation.outstandingTaxMessage',
      fixTarget: { route: '/tax/file/payment' },
    });
  }

  return issues;
}
