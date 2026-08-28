import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../../app/store';
import { Button, Page, PageHeader } from '../../components/ui';
import {
  ProgressState,
  StepProgress,
  StickyActions,
} from '../../components/patterns';
import { useReturnDraft } from './useReturnDraft';
import type { WizardAnchor } from './wizard/anchors';
import { AboutYouSection } from './wizard/AboutYouSection';
import { IncomeSection } from './wizard/IncomeSection';
import { PropertyInvestmentsBusinessSection } from './wizard/PropertyInvestmentsBusinessSection';
import { DeductionsSection } from './wizard/DeductionsSection';
import { SavingsOptionSection } from './wizard/SavingsOptionSection';
import { RefundAccountSection } from './wizard/RefundAccountSection';
import { ReviewSection } from './wizard/ReviewSection';
import type {
  RegimeComparison,
  TaxRulesConfig,
  ValidationIssue,
} from '../../types/tax';

const STEP_ORDER: WizardAnchor[] = [
  'about-you',
  'income',
  'extras',
  'claims',
  'savings-option',
  'refund-account',
  'review',
];

export function TaxFilingWizardPage() {
  const { t } = useTranslation();
  const getTaxRules = useAppStore((state) => state.getTaxRules);
  const saveTaxDraft = useAppStore((state) => state.saveTaxDraft);
  const validateReturn = useAppStore((state) => state.validateReturn);
  const compareRegimes = useAppStore((state) => state.compareRegimes);
  const { draft, sources, loading, setDraft } = useReturnDraft();
  const [rules, setRules] = useState<TaxRulesConfig | null>(null);
  const [issues, setIssues] = useState<ValidationIssue[] | null>(null);
  const [comparison, setComparison] = useState<RegimeComparison | null>(null);
  const [step, setStep] = useState<WizardAnchor>('about-you');

  useEffect(() => {
    void getTaxRules('2026-27').then(setRules);
  }, [getTaxRules]);

  useEffect(() => {
    if (!draft) return;
    const timer = window.setTimeout(() => {
      void saveTaxDraft(draft);
      void validateReturn(draft).then(setIssues);
      void compareRegimes(draft).then((result) => {
        setComparison(result);
        if (
          draft.regime.selected &&
          (!draft.computation ||
            draft.computation.OLD.totalTaxLiability !==
              result.old.totalTaxLiability ||
            draft.computation.NEW.totalTaxLiability !==
              result.new.totalTaxLiability)
        ) {
          setDraft({
            ...draft,
            computation: { OLD: result.old, NEW: result.new },
            regime: { ...draft.regime, recommended: result.recommended },
          });
        }
      });
    }, 500);
    return () => window.clearTimeout(timer);
  }, [draft, saveTaxDraft, validateReturn, compareRegimes, setDraft]);

  if (loading || !draft || !rules || !sources)
    return <ProgressState title={t('tax.entry.loading')} />;

  const stepIndex = STEP_ORDER.indexOf(step);
  const goTo = (anchor: WizardAnchor) => setStep(anchor);
  const goNext = () => setStep(STEP_ORDER[stepIndex + 1]);
  const goBack = () => setStep(STEP_ORDER[stepIndex - 1]);

  const hasBlocking = (sectionIds: string[]) =>
    (issues ?? []).some(
      (issue) =>
        sectionIds.includes(issue.sectionId) &&
        (issue.severity === 'BLOCKING' || issue.severity === 'ROUTE_CHANGE'),
    );

  const aboutYouReady = !hasBlocking(['ELIGIBILITY']);
  const incomeReady =
    draft.salary.every((source) => source.reviewed) &&
    draft.otherSources.every((item) => item.reviewed || item.disputed);
  const extrasReady = true;
  const savingsReady = Boolean(draft.regime.selected);
  const refundReady = Boolean(
    draft.refundAccountId &&
    draft.bankAccounts.find((account) => account.id === draft.refundAccountId)
      ?.validationStatus === 'VALIDATED',
  );

  const stepReady: Record<WizardAnchor, boolean> = {
    'about-you': aboutYouReady,
    income: incomeReady,
    extras: extrasReady,
    claims: true,
    'savings-option': savingsReady,
    'refund-account': refundReady,
    review: true,
  };

  return (
    <Page width="narrow">
      <PageHeader
        eyebrow={t('tax.wizardNav.eyebrow')}
        title={t('tax.wizardNav.title')}
        subtitle={t('tax.wizardNav.subtitle')}
        back="/tax"
      />
      <StepProgress
        current={stepIndex + 1}
        total={STEP_ORDER.length}
      />
      {step === 'about-you' && (
        <AboutYouSection
          draft={draft}
          setDraft={setDraft}
          issues={issues}
        />
      )}
      {step === 'income' && (
        <IncomeSection
          draft={draft}
          setDraft={setDraft}
        />
      )}
      {step === 'extras' && (
        <PropertyInvestmentsBusinessSection
          draft={draft}
          setDraft={setDraft}
          issues={issues}
        />
      )}
      {step === 'claims' && (
        <DeductionsSection
          draft={draft}
          setDraft={setDraft}
          sources={sources}
          rules={rules}
        />
      )}
      {step === 'savings-option' && (
        <SavingsOptionSection
          draft={draft}
          setDraft={setDraft}
          comparison={comparison}
        />
      )}
      {step === 'refund-account' && (
        <RefundAccountSection
          draft={draft}
          setDraft={setDraft}
          comparison={comparison}
        />
      )}
      {step === 'review' && (
        <ReviewSection
          draft={draft}
          comparison={comparison}
          issues={issues}
          onBack={goBack}
          onIssueClick={goTo}
        />
      )}
      {step !== 'review' && (
        <StickyActions>
          {stepIndex > 0 && (
            <Button
              variant="secondary"
              onClick={goBack}
            >
              {t('common.back')}
            </Button>
          )}
          <Button
            disabled={!stepReady[step]}
            onClick={goNext}
          >
            {t('common.continue')}
            <ArrowRight />
          </Button>
        </StickyActions>
      )}
    </Page>
  );
}
