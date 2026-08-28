import { useEffect, useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
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
import { ChoiceCard, ChoiceGroup } from '../../components/forms';
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
import { markSectionComplete } from './taxDraft';
import type { RegimeComparison, ReturnDraft, TaxRegime } from '../../types/tax';
import { oldRegimeAvailableForBusiness } from '../../rules/tax';

type Step = 'regime' | 'bank';

function outcomeLabel(
  regime: RegimeComparison['old'],
  t: (key: string, opts?: Record<string, unknown>) => string,
  language: string,
) {
  if (regime.refund > 0)
    return t('tax.regime.refundOutcome', {
      amount: formatMoney(regime.refund, language),
    });
  if (regime.taxPayable > 0)
    return t('tax.regime.payableOutcome', {
      amount: formatMoney(regime.taxPayable, language),
    });
  return t('tax.regime.nilOutcome');
}

export function TaxRegimeAndBankPages() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const compareRegimes = useAppStore((state) => state.compareRegimes);
  const validateTaxBankAccount = useAppStore(
    (state) => state.validateTaxBankAccount,
  );
  const { draft, loading, save, setDraft } = useReturnDraft();
  const [step, setStep] = useState<Step>('regime');
  const [comparison, setComparison] = useState<RegimeComparison | null>(null);
  const [selectedRegime, setSelectedRegime] = useState<TaxRegime | null>(null);
  const [refundAccountId, setRefundAccountId] = useState<string | null>(null);
  const [busyAccountId, setBusyAccountId] = useState<string | null>(null);
  const [syncedRefundDraft, setSyncedRefundDraft] =
    useState<ReturnDraft | null>(null);

  useEffect(() => {
    if (!draft || comparison) return;
    void compareRegimes(draft).then((result) => {
      setComparison(result);
      setSelectedRegime(
        draft.regime.selected === 'OLD' &&
          !oldRegimeAvailableForBusiness(draft.business)
          ? 'NEW'
          : (draft.regime.selected ?? result.recommended),
      );
    });
  }, [draft, comparison, compareRegimes]);

  if (draft && draft !== syncedRefundDraft) {
    setSyncedRefundDraft(draft);
    if (draft.refundAccountId) setRefundAccountId(draft.refundAccountId);
  }

  if (loading || !draft || !comparison || !selectedRegime)
    return <ProgressState title={t('tax.entry.loading')} />;

  async function handleValidate(accountId: string) {
    setBusyAccountId(accountId);
    const account = await validateTaxBankAccount(accountId);
    setBusyAccountId(null);
    if (!draft) return;
    setDraft({
      ...draft,
      bankAccounts: draft.bankAccounts.map((item) =>
        item.id === account.id ? account : item,
      ),
    });
  }

  async function finish() {
    if (!draft || !comparison || !selectedRegime) return;
    let next: ReturnDraft = {
      ...draft,
      regime: { selected: selectedRegime, recommended: comparison.recommended },
      refundAccountId,
      computation: { OLD: comparison.old, NEW: comparison.new },
    };
    next = markSectionComplete(next, 'REGIME');
    next = markSectionComplete(next, 'BANK');
    await save(next);
    navigate('/tax/file/summary');
  }

  const validatedAccounts = draft.bankAccounts.filter(
    (account) => account.validationStatus === 'VALIDATED',
  );
  const oldAvailable = oldRegimeAvailableForBusiness(draft.business);
  const chosenComputation =
    selectedRegime === 'NEW' ? comparison.new : comparison.old;

  return (
    <Page
      width="narrow"
      mode="journey"
    >
      <PageHeader
        eyebrow={t('tax.regime.eyebrow')}
        title={t('tax.regime.title')}
        subtitle={t('tax.regime.subtitle')}
        back="/tax/file/deductions"
      />
      <StepProgress
        current={step === 'regime' ? 1 : 2}
        total={2}
      />
      {step === 'regime' && (
        <section>
          <Notice
            tone="success"
            title={t('tax.regime.recommendationTitle')}
          >
            {outcomeLabel(
              comparison[comparison.recommended === 'NEW' ? 'new' : 'old'],
              t,
              i18n.language,
            )}
          </Notice>
          <ChoiceGroup legend={t('tax.regime.chooseLegend')}>
            {(oldAvailable
              ? (['NEW', 'OLD'] as TaxRegime[])
              : (['NEW'] as TaxRegime[])
            ).map((regime) => {
              const result = regime === 'NEW' ? comparison.new : comparison.old;
              return (
                <ChoiceCard
                  key={regime}
                  selected={selectedRegime === regime}
                >
                  <input
                    type="radio"
                    name="regime"
                    checked={selectedRegime === regime}
                    onChange={() => setSelectedRegime(regime)}
                  />
                  <span>
                    <strong>
                      {regime === 'NEW'
                        ? t('tax.regime.newRegime')
                        : t('tax.regime.oldRegime')}
                    </strong>
                    <small>{outcomeLabel(result, t, i18n.language)}</small>
                  </span>
                  <Check />
                </ChoiceCard>
              );
            })}
          </ChoiceGroup>
          {!oldAvailable && (
            <Notice
              tone="info"
              title={t('tax.regime.businessRestrictionTitle')}
            >
              {t('tax.regime.businessRestrictionBody')}
            </Notice>
          )}
          <ReviewList>
            <ReviewRow
              label={t('tax.regime.taxBeforeRebate')}
              value={formatMoney(
                (selectedRegime === 'NEW' ? comparison.new : comparison.old)
                  .normalTax,
                i18n.language,
              )}
            />
            <ReviewRow
              label={t('tax.regime.rebate')}
              value={formatMoney(
                (selectedRegime === 'NEW' ? comparison.new : comparison.old)
                  .rebate,
                i18n.language,
              )}
            />
            <ReviewRow
              label={t('tax.regime.cess')}
              value={formatMoney(
                (selectedRegime === 'NEW' ? comparison.new : comparison.old)
                  .cess,
                i18n.language,
              )}
            />
            {(chosenComputation.surcharge > 0 ||
              chosenComputation.marginalRelief > 0) && (
              <ReviewRow
                label={t('tax.regime.surchargeRelief')}
                value={formatMoney(
                  chosenComputation.surcharge -
                    chosenComputation.marginalRelief,
                  i18n.language,
                )}
              />
            )}
          </ReviewList>
          <StickyActions>
            <Button onClick={() => setStep('bank')}>
              {t('common.continue')}
              <ArrowRight />
            </Button>
          </StickyActions>
        </section>
      )}
      {step === 'bank' && (
        <section>
          <ChoiceGroup
            legend={
              chosenComputation.refund > 0
                ? t('tax.bank.chooseRefund')
                : t('tax.bank.chooseAccount')
            }
          >
            {draft.bankAccounts.map((account) => (
              <ChoiceCard
                key={account.id}
                selected={refundAccountId === account.id}
              >
                <input
                  type="radio"
                  name="refund-account"
                  disabled={account.validationStatus !== 'VALIDATED'}
                  checked={refundAccountId === account.id}
                  onChange={() => setRefundAccountId(account.id)}
                />
                <span>
                  <strong>
                    {account.bankName}{' '}
                    <span
                      aria-label={t('common.maskedAccessible', {
                        label: t('tax.bank.accountLabel'),
                        digits: account.maskedAccountNumber.slice(-4),
                      })}
                    >
                      {account.maskedAccountNumber}
                    </span>
                  </strong>
                  <small>
                    <Status
                      kind={
                        account.validationStatus === 'VALIDATED'
                          ? 'success'
                          : 'warning'
                      }
                    >
                      {account.validationStatus === 'VALIDATED'
                        ? t('tax.bank.validated')
                        : t('tax.bank.needsValidation')}
                    </Status>
                  </small>
                </span>
                {account.validationStatus !== 'VALIDATED' && (
                  <Button
                    size="compact"
                    disabled={busyAccountId === account.id}
                    onClick={() => void handleValidate(account.id)}
                  >
                    {t('tax.bank.validate')}
                  </Button>
                )}
              </ChoiceCard>
            ))}
          </ChoiceGroup>
          <SourceMarker>{t('tax.bank.source')}</SourceMarker>
          <StickyActions>
            <Button
              variant="secondary"
              onClick={() => setStep('regime')}
            >
              {t('common.back')}
            </Button>
            <Button
              disabled={validatedAccounts.length === 0 || !refundAccountId}
              onClick={() => void finish()}
            >
              {t('common.continue')}
              <ArrowRight />
            </Button>
          </StickyActions>
        </section>
      )}
    </Page>
  );
}
