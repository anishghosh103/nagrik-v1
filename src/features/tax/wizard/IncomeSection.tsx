import { Landmark, PiggyBank } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { formatMoney } from '../../../components/formatters';
import { Notice } from '../../../components/patterns';
import {
  Button,
  SectionHeading,
  SourceMarker,
  Status,
} from '../../../components/ui';
import type {
  OtherSourceIncome,
  ReturnDraft,
  SalarySource,
} from '../../../types/tax';

export function IncomeSection({
  draft,
  setDraft,
}: {
  draft: ReturnDraft;
  setDraft: (next: ReturnDraft) => void;
}) {
  const { t, i18n } = useTranslation();

  function updateSalary(id: string, patch: Partial<SalarySource>) {
    setDraft({
      ...draft,
      salary: draft.salary.map((source) =>
        source.id === id ? { ...source, ...patch } : source,
      ),
      computation: null,
    });
  }

  function updateOtherSource(id: string, patch: Partial<OtherSourceIncome>) {
    setDraft({
      ...draft,
      otherSources: draft.otherSources.map((item) =>
        item.id === id ? { ...item, ...patch } : item,
      ),
      computation: null,
    });
  }

  return (
    <section
      id="income"
      tabIndex={-1}
    >
      <SectionHeading title={t('tax.income.title')} />
      <p className="text-ink-muted">{t('tax.income.subtitle')}</p>

      <div className="my-2">
        {draft.salary.length === 0 ? (
          <p className="text-ink-muted">{t('tax.income.noSalary')}</p>
        ) : (
          draft.salary.map((source) => (
            <div
              key={source.id}
              id={source.id}
              className="mb-5 grid grid-cols-[42px_1fr] gap-3.5 border-b border-border py-4"
            >
              <Landmark className="text-primary" />
              <div>
                <h3 className="mt-0 mb-1">{source.employerName}</h3>
                <p className="text-ink-muted">
                  {t('tax.income.salarySummary', {
                    gross: formatMoney(source.grossSalary, i18n.language),
                    tds: formatMoney(source.tdsDeducted, i18n.language),
                  })}
                </p>
                <SourceMarker>{t('tax.income.form16Source')}</SourceMarker>
                <details className="mt-3 text-[0.85rem] text-ink-muted">
                  <summary>{t('tax.income.viewDetails')}</summary>
                  <p>
                    {t('tax.income.exemptAllowances')}:{' '}
                    {formatMoney(source.exemptAllowances, i18n.language)}
                  </p>
                  <p>
                    {t('tax.income.professionalTax')}:{' '}
                    {formatMoney(source.professionalTax, i18n.language)}
                  </p>
                </details>
                <div className="mt-3">
                  {source.reviewed ? (
                    <Status kind="success">
                      {t('tax.income.looksRightConfirmed')}
                    </Status>
                  ) : (
                    <Button
                      variant="secondary"
                      onClick={() =>
                        updateSalary(source.id, { reviewed: true })
                      }
                    >
                      {t('tax.income.looksRight')}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}

        {draft.otherSources.length === 0 ? (
          <p className="text-ink-muted">{t('tax.income.noOtherIncome')}</p>
        ) : (
          draft.otherSources.map((item) => (
            <div
              key={item.id}
              id={item.id}
              className="mb-5 grid grid-cols-[42px_1fr] gap-3.5 border-b border-border pb-5"
            >
              <PiggyBank className="text-primary" />
              <div>
                <h3 className="mt-0 mb-1">{item.payerName}</h3>
                <p className="text-ink-muted">
                  {formatMoney(item.amount, i18n.language)}
                  {item.tdsDeducted > 0 &&
                    ` · ${t('tax.income.tdsAmount', { amount: formatMoney(item.tdsDeducted, i18n.language) })}`}
                </p>
                <SourceMarker>{t('tax.income.aisSource')}</SourceMarker>
                {!item.reviewed && !item.disputed && (
                  <Notice
                    tone="warning"
                    title={t('tax.income.aisReviewTitle')}
                    className="mt-2"
                  >
                    <p className="mb-3">{t('tax.income.aisReviewHelp')}</p>
                    <div className="flex gap-2.5">
                      <Button
                        onClick={() =>
                          updateOtherSource(item.id, { reviewed: true })
                        }
                      >
                        {t('tax.income.keepAsOther')}
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={() =>
                          updateOtherSource(item.id, { disputed: true })
                        }
                      >
                        {t('tax.income.markDisputed')}
                      </Button>
                    </div>
                  </Notice>
                )}
                {item.disputed && (
                  <Status kind="warning">
                    {t('tax.income.disputedStatus')}
                  </Status>
                )}
                {item.reviewed && !item.disputed && (
                  <Status kind="success">
                    {t('tax.income.reviewedStatus')}
                  </Status>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {draft.otherSources.length > 0 && (
        <Notice
          tone="info"
          title={t('tax.income.interestDeductionTitle')}
        >
          {t('tax.income.interestDeductionHelp')}
        </Notice>
      )}
    </section>
  );
}
