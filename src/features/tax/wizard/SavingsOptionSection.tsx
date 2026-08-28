import { Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { SectionHeading } from '../../../components/ui';
import { ChoiceCard, ChoiceGroup } from '../../../components/forms';
import { Notice, ReviewList, ReviewRow } from '../../../components/patterns';
import { formatMoney } from '../../../components/formatters';
import { oldRegimeAvailableForBusiness } from '../../../rules/tax';
import type {
  RegimeComparison,
  ReturnDraft,
  TaxRegime,
} from '../../../types/tax';

function outcomeLabel(
  regime: RegimeComparison['old'],
  t: (key: string, opts?: Record<string, unknown>) => string,
  language: string,
) {
  if (regime.refund > 0)
    return t('tax.savingsOption.refundOutcome', {
      amount: formatMoney(regime.refund, language),
    });
  if (regime.taxPayable > 0)
    return t('tax.savingsOption.payableOutcome', {
      amount: formatMoney(regime.taxPayable, language),
    });
  return t('tax.savingsOption.nilOutcome');
}

export function SavingsOptionSection({
  draft,
  setDraft,
  comparison,
}: {
  draft: ReturnDraft;
  setDraft: (next: ReturnDraft) => void;
  comparison: RegimeComparison | null;
}) {
  const { t, i18n } = useTranslation();
  const oldAvailable = oldRegimeAvailableForBusiness(draft.business);
  const chosenRegime: TaxRegime | null =
    draft.regime.selected && (draft.regime.selected !== 'OLD' || oldAvailable)
      ? draft.regime.selected
      : null;
  const displayRegime: TaxRegime =
    chosenRegime ?? comparison?.recommended ?? 'NEW';

  function choose(regime: TaxRegime) {
    setDraft({
      ...draft,
      regime: {
        selected: regime,
        recommended: comparison?.recommended ?? draft.regime.recommended,
      },
      computation: comparison
        ? { OLD: comparison.old, NEW: comparison.new }
        : draft.computation,
    });
  }

  return (
    <section
      id="savings-option"
      tabIndex={-1}
    >
      <SectionHeading title={t('tax.savingsOption.title')} />
      <p className="text-ink-muted">{t('tax.savingsOption.subtitle')}</p>
      {!comparison ? (
        <p className="text-ink-muted">{t('tax.validation.checking')}</p>
      ) : (
        <>
          <Notice
            tone="success"
            title={t('tax.savingsOption.recommendationTitle')}
          >
            {outcomeLabel(
              comparison[comparison.recommended === 'NEW' ? 'new' : 'old'],
              t,
              i18n.language,
            )}
          </Notice>
          <ChoiceGroup legend={t('tax.savingsOption.chooseLegend')}>
            {(oldAvailable
              ? (['NEW', 'OLD'] as TaxRegime[])
              : (['NEW'] as TaxRegime[])
            ).map((regime) => {
              const result = regime === 'NEW' ? comparison.new : comparison.old;
              return (
                <ChoiceCard
                  key={regime}
                  selected={chosenRegime === regime}
                >
                  <input
                    type="radio"
                    name="regime"
                    checked={chosenRegime === regime}
                    onChange={() => choose(regime)}
                  />
                  <span>
                    <strong>
                      {regime === 'NEW'
                        ? t('tax.savingsOption.optionB')
                        : t('tax.savingsOption.optionA')}
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
              title={t('tax.savingsOption.businessRestrictionTitle')}
            >
              {t('tax.savingsOption.businessRestrictionBody')}
            </Notice>
          )}
          {chosenRegime &&
            (() => {
              const chosen =
                displayRegime === 'NEW' ? comparison.new : comparison.old;
              return (
                <ReviewList>
                  <ReviewRow
                    label={t('tax.savingsOption.taxBeforeRebate')}
                    value={formatMoney(chosen.normalTax, i18n.language)}
                  />
                  <ReviewRow
                    label={t('tax.savingsOption.rebate')}
                    value={formatMoney(chosen.rebate, i18n.language)}
                  />
                  <ReviewRow
                    label={t('tax.savingsOption.cess')}
                    value={formatMoney(chosen.cess, i18n.language)}
                  />
                  {(chosen.surcharge > 0 || chosen.marginalRelief > 0) && (
                    <ReviewRow
                      label={t('tax.savingsOption.surchargeRelief')}
                      value={formatMoney(
                        chosen.surcharge - chosen.marginalRelief,
                        i18n.language,
                      )}
                    />
                  )}
                </ReviewList>
              );
            })()}
        </>
      )}
    </section>
  );
}
