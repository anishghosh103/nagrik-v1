import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../../../app/store';
import { ChoiceCard, ChoiceGroup } from '../../../components/forms';
import {
  Button,
  SectionHeading,
  SourceMarker,
  Status,
} from '../../../components/ui';
import type { RegimeComparison, ReturnDraft } from '../../../types/tax';

export function RefundAccountSection({
  draft,
  setDraft,
  comparison,
}: {
  draft: ReturnDraft;
  setDraft: (next: ReturnDraft) => void;
  comparison: RegimeComparison | null;
}) {
  const { t } = useTranslation();
  const validateTaxBankAccount = useAppStore(
    (state) => state.validateTaxBankAccount,
  );
  const [busyAccountId, setBusyAccountId] = useState<string | null>(null);

  const selectedRegime = draft.regime.selected;
  const chosen = comparison
    ? selectedRegime === 'OLD'
      ? comparison.old
      : comparison.new
    : null;

  async function handleValidate(accountId: string) {
    setBusyAccountId(accountId);
    const account = await validateTaxBankAccount(accountId);
    setBusyAccountId(null);
    setDraft({
      ...draft,
      bankAccounts: draft.bankAccounts.map((item) =>
        item.id === account.id ? account : item,
      ),
    });
  }

  return (
    <section
      id="refund-account"
      tabIndex={-1}
    >
      <SectionHeading title={t('tax.refundAccount.title')} />
      <p className="text-ink-muted">{t('tax.refundAccount.subtitle')}</p>
      <ChoiceGroup
        legend={
          chosen && chosen.refund > 0
            ? t('tax.refundAccount.chooseRefund')
            : t('tax.refundAccount.chooseAccount')
        }
      >
        {draft.bankAccounts.map((account) => (
          <ChoiceCard
            key={account.id}
            selected={draft.refundAccountId === account.id}
            className="flex"
          >
            <input
              type="radio"
              name="refund-account"
              disabled={account.validationStatus !== 'VALIDATED'}
              checked={draft.refundAccountId === account.id}
              onChange={() =>
                setDraft({ ...draft, refundAccountId: account.id })
              }
            />
            <span className="inline-flex flex-1">
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
                  className="!inline-flex"
                >
                  {account.validationStatus === 'VALIDATED'
                    ? t('tax.refundAccount.validated')
                    : t('tax.refundAccount.needsValidation')}
                </Status>
              </small>
            </span>
            {account.validationStatus !== 'VALIDATED' && (
              <Button
                disabled={busyAccountId === account.id}
                onClick={() => void handleValidate(account.id)}
                className="shrink-0"
              >
                {t('tax.refundAccount.validate')}
              </Button>
            )}
          </ChoiceCard>
        ))}
      </ChoiceGroup>
      <SourceMarker>{t('tax.refundAccount.source')}</SourceMarker>
    </section>
  );
}
