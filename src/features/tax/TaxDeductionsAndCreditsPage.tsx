import { useEffect, useState } from 'react';
import { ArrowRight, Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../app/store';
import { Button, Page, PageHeader } from '../../components/ui';
import { FieldLabel } from '../../components/forms';
import {
  Notice,
  ProgressState,
  ReviewList,
  ReviewRow,
  StepProgress,
  StickyActions,
} from '../../components/patterns';
import { formatMoney } from '../../components/formatters';
import { useReturnDraft } from './useReturnDraft';
import {
  deductionClaimsFrom,
  markSectionComplete,
  taxCreditsFrom,
} from './taxDraft';
import type {
  ReturnDraft,
  TaxRulesConfig,
  TaxSourceSnapshot,
} from '../../types/tax';

type Step = 'deductions' | 'credits';

export function TaxDeductionsAndCreditsPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const getTaxRules = useAppStore((state) => state.getTaxRules);
  const { draft, sources, loading, save, setDraft } = useReturnDraft();
  const [step, setStep] = useState<Step>('deductions');
  const [rules, setRules] = useState<TaxRulesConfig | null>(null);
  const [amount80C, setAmount80C] = useState<number | null>(null);
  const [amount80D, setAmount80D] = useState<number | null>(null);
  const [advanceChallan, setAdvanceChallan] = useState('');
  const [advancePaidOn, setAdvancePaidOn] = useState('');
  const [advanceAmount, setAdvanceAmount] = useState(0);
  const [syncedSources, setSyncedSources] = useState<TaxSourceSnapshot | null>(
    null,
  );

  useEffect(() => {
    void getTaxRules('2026-27').then(setRules);
  }, [getTaxRules]);

  if (sources && sources !== syncedSources) {
    setSyncedSources(sources);
    const sum = (section: '80C' | '80D') =>
      sources.suggestedDeductions
        .filter((item) => item.section === section)
        .reduce((total, item) => total + item.amount, 0);
    setAmount80C(sum('80C'));
    setAmount80D(sum('80D'));
  }

  if (loading || !draft || !rules || amount80C === null || amount80D === null)
    return <ProgressState title={t('tax.entry.loading')} />;

  const cap80C = rules.deductionCaps.section80C;
  const cap80D = rules.deductionCaps.section80D.nonSenior;

  async function continueToCredits() {
    if (!draft || amount80C === null || amount80D === null) return;
    const deductions = deductionClaimsFrom([
      {
        section: '80C',
        label: '80C',
        enteredAmount: amount80C,
        sourceRefs: [t('tax.deductions.userEntered')],
      },
      {
        section: '80D',
        label: '80D',
        enteredAmount: amount80D,
        sourceRefs: [t('tax.deductions.userEntered')],
      },
    ]);
    await save(markSectionComplete({ ...draft, deductions }, 'DEDUCTIONS'));
    setStep('credits');
  }

  async function finish() {
    if (!draft) return;
    const imported = taxCreditsFrom(draft.salary, draft.otherSources);
    const taxCredits = {
      ...imported,
      tcs: draft.taxCredits.tcs,
      advanceTax: draft.taxCredits.advanceTax,
      selfAssessmentTax: draft.taxCredits.selfAssessmentTax,
    };
    const next: ReturnDraft = markSectionComplete(
      { ...draft, taxCredits },
      'TAX_CREDITS',
    );
    await save(next);
    navigate('/tax/file/regime');
  }

  function addAdvanceTax() {
    if (
      !draft ||
      !advanceChallan.trim() ||
      !advancePaidOn ||
      advanceAmount <= 0
    )
      return;
    setDraft({
      ...draft,
      taxCredits: {
        ...draft.taxCredits,
        advanceTax: [
          ...draft.taxCredits.advanceTax,
          {
            challanNumber: advanceChallan.trim().toUpperCase(),
            paidOn: advancePaidOn,
            amount: advanceAmount,
          },
        ],
      },
      computation: null,
    });
    setAdvanceChallan('');
    setAdvancePaidOn('');
    setAdvanceAmount(0);
  }

  return (
    <Page
      width="narrow"
      mode="journey"
    >
      <PageHeader
        eyebrow={t('tax.deductions.eyebrow')}
        title={t('tax.deductions.title')}
        subtitle={t('tax.deductions.subtitle')}
        back="/tax/file/income-details"
      />
      <StepProgress
        current={step === 'deductions' ? 1 : 2}
        total={2}
      />
      {step === 'deductions' && (
        <section>
          <FieldLabel
            htmlFor="ded-80c"
            hint={t('tax.deductions.cap', {
              amount: formatMoney(cap80C, i18n.language),
            })}
          >
            {t('tax.deductions.section80C')}
          </FieldLabel>
          <input
            id="ded-80c"
            type="number"
            min={0}
            value={amount80C}
            onChange={(event) => setAmount80C(Number(event.target.value))}
            className="h-12 w-full rounded-[9px] border border-border bg-surface px-3.5 [font-variant-numeric:tabular-nums]"
          />
          {amount80C > cap80C && (
            <Notice
              tone="info"
              title={t('tax.deductions.cappedTitle')}
            >
              {t('tax.deductions.cappedBody', {
                entered: formatMoney(amount80C, i18n.language),
                cap: formatMoney(cap80C, i18n.language),
              })}
            </Notice>
          )}
          <FieldLabel
            htmlFor="ded-80d"
            hint={t('tax.deductions.cap', {
              amount: formatMoney(cap80D, i18n.language),
            })}
          >
            {t('tax.deductions.section80D')}
          </FieldLabel>
          <input
            id="ded-80d"
            type="number"
            min={0}
            value={amount80D}
            onChange={(event) => setAmount80D(Number(event.target.value))}
            className="h-12 w-full rounded-[9px] border border-border bg-surface px-3.5 [font-variant-numeric:tabular-nums]"
          />
          {amount80D > cap80D && (
            <Notice
              tone="info"
              title={t('tax.deductions.cappedTitle')}
            >
              {t('tax.deductions.cappedBody', {
                entered: formatMoney(amount80D, i18n.language),
                cap: formatMoney(cap80D, i18n.language),
              })}
            </Notice>
          )}
          <Notice
            tone="neutral"
            title={t('tax.deductions.regimeNoteTitle')}
          >
            {t('tax.deductions.regimeNoteBody')}
          </Notice>
          <StickyActions>
            <Button onClick={() => void continueToCredits()}>
              {t('common.continue')}
              <ArrowRight />
            </Button>
          </StickyActions>
        </section>
      )}
      {step === 'credits' && (
        <section>
          <p className="text-ink-muted">{t('tax.credits.intro')}</p>
          <ReviewList>
            {draft.salary
              .filter((source) => source.tdsDeducted > 0)
              .map((source) => (
                <ReviewRow
                  key={source.id}
                  label={t('tax.credits.salaryTds', {
                    employer: source.employerName,
                  })}
                  value={formatMoney(source.tdsDeducted, i18n.language)}
                />
              ))}
            {draft.otherSources
              .filter(
                (item) =>
                  item.reviewed && !item.disputed && item.tdsDeducted > 0,
              )
              .map((item) => (
                <ReviewRow
                  key={item.id}
                  label={t('tax.credits.otherTds', { payer: item.payerName })}
                  value={formatMoney(item.tdsDeducted, i18n.language)}
                />
              ))}
          </ReviewList>
          {draft.taxCredits.advanceTax.length > 0 && (
            <ReviewList>
              {draft.taxCredits.advanceTax.map((payment) => (
                <ReviewRow
                  key={payment.challanNumber}
                  label={t('tax.credits.advanceTax', {
                    date: payment.paidOn,
                  })}
                  value={formatMoney(payment.amount, i18n.language)}
                />
              ))}
            </ReviewList>
          )}
          <details className="my-4 rounded-lg border border-border bg-surface-muted p-3.5">
            <summary className="font-bold">
              {t('tax.credits.addAdvanceTax')}
            </summary>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <FieldLabel htmlFor="advance-challan">
                  {t('tax.payment.challanNumber')}
                </FieldLabel>
                <input
                  id="advance-challan"
                  className="h-12 w-full rounded-[9px] border border-border bg-surface px-3.5"
                  value={advanceChallan}
                  onChange={(event) => setAdvanceChallan(event.target.value)}
                />
              </div>
              <div>
                <FieldLabel htmlFor="advance-date">
                  {t('tax.payment.paidOn')}
                </FieldLabel>
                <input
                  id="advance-date"
                  type="date"
                  max="2026-03-31"
                  className="h-12 w-full rounded-[9px] border border-border bg-surface px-3.5"
                  value={advancePaidOn}
                  onChange={(event) => setAdvancePaidOn(event.target.value)}
                />
              </div>
              <div>
                <FieldLabel htmlFor="advance-amount">
                  {t('tax.credits.amount')}
                </FieldLabel>
                <input
                  id="advance-amount"
                  type="number"
                  min={0}
                  className="h-12 w-full rounded-[9px] border border-border bg-surface px-3.5"
                  value={advanceAmount}
                  onChange={(event) =>
                    setAdvanceAmount(Number(event.target.value))
                  }
                />
              </div>
            </div>
            <Button
              className="mt-3"
              size="compact"
              variant="secondary"
              disabled={
                !advanceChallan.trim() || !advancePaidOn || advanceAmount <= 0
              }
              onClick={addAdvanceTax}
            >
              <Plus /> {t('tax.credits.addPayment')}
            </Button>
          </details>
          <Notice
            tone="info"
            title={t('tax.credits.notDeductionTitle')}
          >
            {t('tax.credits.notDeductionBody')}
          </Notice>
          <StickyActions>
            <Button
              variant="secondary"
              onClick={() => setStep('deductions')}
            >
              {t('common.back')}
            </Button>
            <Button onClick={() => void finish()}>
              {t('common.continue')}
              <ArrowRight />
            </Button>
          </StickyActions>
        </section>
      )}
    </Page>
  );
}
