import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { formatMoney } from '../../../components/formatters';
import { FieldLabel } from '../../../components/forms';
import { Notice, ReviewList, ReviewRow } from '../../../components/patterns';
import { Button, SectionHeading } from '../../../components/ui';
import type {
  ReturnDraft,
  TaxRulesConfig,
  TaxSourceSnapshot,
} from '../../../types/tax';
import { deductionClaimsFrom, taxCreditsFrom } from '../taxDraft';

const inputClass =
  'h-12 w-full rounded-[9px] border border-border bg-surface px-3.5 [font-variant-numeric:tabular-nums]';

export function DeductionsSection({
  draft,
  setDraft,
  sources,
  rules,
}: {
  draft: ReturnDraft;
  setDraft: (next: ReturnDraft) => void;
  sources: TaxSourceSnapshot;
  rules: TaxRulesConfig;
}) {
  const { t, i18n } = useTranslation();
  const [amount80C, setAmount80C] = useState<number | null>(null);
  const [amount80D, setAmount80D] = useState<number | null>(null);
  const [advanceChallan, setAdvanceChallan] = useState('');
  const [advancePaidOn, setAdvancePaidOn] = useState('');
  const [advanceAmount, setAdvanceAmount] = useState(0);

  const cap80C = rules.deductionCaps.section80C;
  const cap80D = rules.deductionCaps.section80D.nonSenior;

  if (amount80C === null || amount80D === null) {
    const sum = (section: '80C' | '80D') =>
      sources.suggestedDeductions
        .filter((item) => item.section === section)
        .reduce((total, item) => total + item.amount, 0);
    setAmount80C(sum('80C'));
    setAmount80D(sum('80D'));
  }

  useEffect(() => {
    if (amount80C === null || amount80D === null) return;
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
    if (JSON.stringify(deductions) === JSON.stringify(draft.deductions)) return;
    setDraft({ ...draft, deductions, computation: null });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amount80C, amount80D]);

  useEffect(() => {
    const derived = taxCreditsFrom(draft.salary, draft.otherSources);
    if (
      JSON.stringify(derived.salaryTds) ===
        JSON.stringify(draft.taxCredits.salaryTds) &&
      JSON.stringify(derived.otherTds) ===
        JSON.stringify(draft.taxCredits.otherTds)
    )
      return;
    setDraft({
      ...draft,
      taxCredits: {
        ...draft.taxCredits,
        salaryTds: derived.salaryTds,
        otherTds: derived.otherTds,
      },
      computation: null,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft.salary, draft.otherSources]);

  function addAdvanceTax() {
    if (!advanceChallan.trim() || !advancePaidOn || advanceAmount <= 0) return;
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

  if (amount80C === null || amount80D === null) return null;

  return (
    <section
      id="claims"
      tabIndex={-1}
    >
      <SectionHeading title={t('tax.deductions.title')} />
      <p className="text-ink-muted">{t('tax.deductions.subtitle')}</p>
      <FieldLabel
        htmlFor="ded-80c"
        hint={t('tax.deductions.cap', {
          amount: formatMoney(cap80C, i18n.language),
        })}
      >
        {t('tax.deductions.claim80C')}
      </FieldLabel>
      <input
        id="ded-80c"
        type="number"
        min={0}
        value={amount80C}
        onChange={(event) => setAmount80C(Number(event.target.value))}
        className={inputClass}
      />
      {amount80C > cap80C && (
        <Notice
          tone="info"
          title={t('tax.deductions.cappedTitle')}
          className="mt-2"
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
        {t('tax.deductions.claim80D')}
      </FieldLabel>
      <input
        id="ded-80d"
        type="number"
        min={0}
        value={amount80D}
        onChange={(event) => setAmount80D(Number(event.target.value))}
        className={inputClass}
      />
      {amount80D > cap80D && (
        <Notice
          tone="info"
          title={t('tax.deductions.cappedTitle')}
          className="mt-2"
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

      <p className="mt-7 text-ink-muted">{t('tax.credits.intro')}</p>
      <ReviewList>
        {draft.taxCredits.salaryTds.map((item) => (
          <ReviewRow
            key={`${item.tan}-${item.employerName}`}
            label={t('tax.credits.salaryTds', { employer: item.employerName })}
            value={formatMoney(item.amount, i18n.language)}
          />
        ))}
        {draft.taxCredits.otherTds.map((item) => (
          <ReviewRow
            key={item.payerName}
            label={t('tax.credits.otherTds', { payer: item.payerName })}
            value={formatMoney(item.amount, i18n.language)}
          />
        ))}
      </ReviewList>
      {draft.taxCredits.advanceTax.length > 0 && (
        <ReviewList>
          {draft.taxCredits.advanceTax.map((payment) => (
            <ReviewRow
              key={payment.challanNumber}
              label={t('tax.credits.advanceTax', { date: payment.paidOn })}
              value={formatMoney(payment.amount, i18n.language)}
            />
          ))}
        </ReviewList>
      )}
      <details className="my-4 rounded-lg border border-border bg-surface-muted p-3.5">
        <summary className="cursor-pointer font-bold">
          {t('tax.credits.addAdvanceTax')}
        </summary>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <FieldLabel htmlFor="advance-challan">
              {t('tax.payment.challanNumber')}
            </FieldLabel>
            <input
              id="advance-challan"
              className={inputClass}
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
              className={inputClass}
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
              className={inputClass}
              value={advanceAmount}
              onChange={(event) => setAdvanceAmount(Number(event.target.value))}
            />
          </div>
        </div>
        <Button
          className="mt-3"
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
    </section>
  );
}
