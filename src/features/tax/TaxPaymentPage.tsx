import { useState } from 'react';
import { ArrowRight, Check, ReceiptIndianRupee } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../app/store';
import {
  Button,
  Page,
  PageHeader,
  SourceMarker,
  Status,
} from '../../components/ui';
import { FieldLabel, ValidationAlert } from '../../components/forms';
import {
  AmountContext,
  Notice,
  ProgressState,
  ReviewList,
  ReviewRow,
  StickyActions,
} from '../../components/patterns';
import { formatMoney } from '../../components/formatters';
import { useReturnDraft } from './useReturnDraft';

const inputClass =
  'h-12 w-full rounded-[9px] border border-border bg-surface px-3.5 [font-variant-numeric:tabular-nums]';

export function TaxPaymentPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const compareRegimes = useAppStore((state) => state.compareRegimes);
  const { draft, loading, save } = useReturnDraft();
  const [challanNumber, setChallanNumber] = useState('');
  const [paidOn, setPaidOn] = useState('');
  const [error, setError] = useState('');
  const [paying, setPaying] = useState(false);
  const [complete, setComplete] = useState(false);

  if (loading || !draft)
    return <ProgressState title={t('tax.entry.loading')} />;
  const regime = draft.regime.selected;
  const computation = regime ? draft.computation?.[regime] : null;
  if (!regime || !computation) return null;

  const allPayments = [
    ...draft.taxCredits.advanceTax.map((item) => ({
      ...item,
      kind: 'ADVANCE',
    })),
    ...draft.taxCredits.selfAssessmentTax.map((item) => ({
      ...item,
      kind: 'SELF_ASSESSMENT',
    })),
  ];

  async function recordPayment() {
    if (!draft || !regime || !computation) return;
    if (!challanNumber.trim() || !paidOn) {
      setError(t('tax.payment.required'));
      return;
    }
    if (
      allPayments.some(
        (item) =>
          item.challanNumber.trim().toUpperCase() ===
          challanNumber.trim().toUpperCase(),
      )
    ) {
      setError(t('tax.payment.duplicate'));
      return;
    }
    setPaying(true);
    setError('');
    const next = {
      ...draft,
      taxCredits: {
        ...draft.taxCredits,
        selfAssessmentTax: [
          ...draft.taxCredits.selfAssessmentTax,
          {
            challanNumber: challanNumber.trim().toUpperCase(),
            paidOn,
            amount: computation.taxPayable,
          },
        ],
      },
      computation: null,
    };
    const comparison = await compareRegimes(next);
    await save({
      ...next,
      computation: { OLD: comparison.old, NEW: comparison.new },
      regime: { ...next.regime, recommended: comparison.recommended },
    });
    setPaying(false);
    setComplete(true);
  }

  if (complete)
    return (
      <Page
        width="narrow"
        mode="completion"
      >
        <PageHeader
          eyebrow={t('tax.payment.eyebrow')}
          title={t('tax.payment.completeTitle')}
          subtitle={t('tax.payment.completeHelp')}
          back="/tax/file"
        />
        <div className="my-8 grid justify-items-center gap-3 text-center">
          <span className="grid size-16 place-items-center rounded-full bg-success-soft text-success">
            <Check className="size-8" />
          </span>
          <Status kind="success">{t('tax.payment.credited')}</Status>
        </div>
        <Button
          wide
          onClick={() => navigate('/tax/file')}
        >
          {t('tax.payment.returnToSummary')} <ArrowRight />
        </Button>
      </Page>
    );

  return (
    <Page
      width="narrow"
      mode="journey"
    >
      <PageHeader
        eyebrow={t('tax.payment.eyebrow')}
        title={t('tax.payment.title')}
        subtitle={t('tax.payment.subtitle')}
        back="/tax/file/summary"
      />
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
        {allPayments.map((item) => (
          <ReviewRow
            key={`${item.kind}-${item.challanNumber}`}
            label={
              item.kind === 'ADVANCE'
                ? t('tax.payment.advanceTax')
                : t('tax.payment.selfAssessmentTax')
            }
            value={formatMoney(item.amount, i18n.language)}
          />
        ))}
      </ReviewList>
      <SourceMarker>{t('tax.payment.source')}</SourceMarker>
      {computation.taxPayable > 0 ? (
        <>
          <AmountContext
            label={t('tax.payment.amountRequired')}
            amount={formatMoney(computation.taxPayable, i18n.language)}
          />
          <Notice
            tone="warning"
            title={t('tax.payment.blockingTitle')}
          >
            {t('tax.payment.blockingHelp')}
          </Notice>
          <div className="mt-5 rounded-[var(--radius-sheet)] border border-border bg-surface p-4.5">
            <div className="mb-2 flex items-center gap-2 font-bold">
              <ReceiptIndianRupee className="size-5 text-primary" />
              {t('tax.payment.challanTitle')}
            </div>
            <FieldLabel htmlFor="payment-challan">
              {t('tax.payment.challanNumber')}
            </FieldLabel>
            <input
              id="payment-challan"
              className={inputClass}
              value={challanNumber}
              onChange={(event) => setChallanNumber(event.target.value)}
            />
            <FieldLabel htmlFor="payment-date">
              {t('tax.payment.paidOn')}
            </FieldLabel>
            <input
              id="payment-date"
              className={inputClass}
              type="date"
              max={draft.filingDate}
              value={paidOn}
              onChange={(event) => setPaidOn(event.target.value)}
            />
          </div>
          {error && <ValidationAlert>{error}</ValidationAlert>}
          <StickyActions>
            <Button
              disabled={paying}
              onClick={() => void recordPayment()}
            >
              {t('tax.payment.simulate')} <ArrowRight />
            </Button>
          </StickyActions>
        </>
      ) : (
        <Notice
          tone="success"
          title={t('tax.payment.noneTitle')}
        >
          {t('tax.payment.noneHelp')}
        </Notice>
      )}
    </Page>
  );
}
