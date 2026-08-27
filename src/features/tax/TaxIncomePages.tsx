import { useState } from 'react';
import { ArrowRight, Check, Landmark, PiggyBank } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
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
  StepProgress,
  StickyActions,
} from '../../components/patterns';
import { formatMoney } from '../../components/formatters';
import { useReturnDraft } from './useReturnDraft';
import { markSectionComplete } from './taxDraft';
import type {
  OtherSourceIncome,
  ReturnDraft,
  SalarySource,
} from '../../types/tax';

type IncomeStep = 'discovery' | 'salary' | 'interest';

export function TaxIncomePages() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { draft, loading, save, setDraft } = useReturnDraft();
  const [step, setStep] = useState<IncomeStep>('discovery');

  if (loading || !draft)
    return <ProgressState title={t('tax.entry.loading')} />;

  function updateSalary(id: string, patch: Partial<SalarySource>) {
    if (!draft) return;
    const salary = draft.salary.map((source) =>
      source.id === id ? { ...source, ...patch } : source,
    );
    setDraft({ ...draft, salary });
  }

  function updateOtherSource(id: string, patch: Partial<OtherSourceIncome>) {
    if (!draft) return;
    const otherSources = draft.otherSources.map((item) =>
      item.id === id ? { ...item, ...patch } : item,
    );
    setDraft({ ...draft, otherSources });
  }

  async function finish() {
    if (!draft) return;
    let next: ReturnDraft = markSectionComplete(draft, 'INCOME_SOURCES');
    next = markSectionComplete(next, 'SALARY');
    next = markSectionComplete(next, 'INTEREST');
    await save(next);
    navigate('/tax/file/income-details');
  }

  const stepNumber = step === 'discovery' ? 1 : step === 'salary' ? 2 : 3;

  return (
    <Page
      width="narrow"
      mode="journey"
    >
      <PageHeader
        eyebrow={t('tax.income.eyebrow')}
        title={t('tax.income.title')}
        subtitle={t('tax.income.subtitle')}
        back="/tax/file"
      />
      <StepProgress
        current={stepNumber}
        total={3}
      />
      {step === 'discovery' && (
        <section>
          <ChoiceGroup legend={t('tax.income.discoveryLegend')}>
            <ChoiceCard selected={draft.salary.length > 0}>
              <input
                type="checkbox"
                checked={draft.salary.length > 0}
                readOnly
              />
              <span>
                <strong>{t('tax.income.hadSalary')}</strong>
                <small>{t('tax.income.detected')}</small>
              </span>
              <Check />
            </ChoiceCard>
            <ChoiceCard selected={draft.otherSources.length > 0}>
              <input
                type="checkbox"
                checked={draft.otherSources.length > 0}
                readOnly
              />
              <span>
                <strong>{t('tax.income.hadInterest')}</strong>
                <small>{t('tax.income.detected')}</small>
              </span>
              <Check />
            </ChoiceCard>
          </ChoiceGroup>
          <StickyActions>
            <Button onClick={() => setStep('salary')}>
              {t('common.continue')}
              <ArrowRight />
            </Button>
          </StickyActions>
        </section>
      )}
      {step === 'salary' && (
        <section>
          {draft.salary.map((source) => (
            <div
              key={source.id}
              className="mb-5 grid grid-cols-[42px_1fr] gap-3.5 border-b border-border pb-5"
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
                  <summary>{t('tax.income.viewForm16')}</summary>
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
                      size="compact"
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
          ))}
          <StickyActions>
            <Button
              variant="secondary"
              onClick={() => setStep('discovery')}
            >
              {t('common.back')}
            </Button>
            <Button
              disabled={draft.salary.some((source) => !source.reviewed)}
              onClick={() => setStep('interest')}
            >
              {t('common.continue')}
              <ArrowRight />
            </Button>
          </StickyActions>
        </section>
      )}
      {step === 'interest' && (
        <section>
          {draft.otherSources.map((item) => (
            <div
              key={item.id}
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
                <SourceMarker>{item.source}</SourceMarker>
                {!item.reviewed && !item.disputed && (
                  <Notice
                    tone="warning"
                    title={t('tax.income.aisReviewTitle')}
                  >
                    <p className="mb-3">{t('tax.income.aisReviewHelp')}</p>
                    <div className="flex gap-2.5">
                      <Button
                        size="compact"
                        onClick={() =>
                          updateOtherSource(item.id, { reviewed: true })
                        }
                      >
                        {t('tax.income.keepAsOther')}
                      </Button>
                      <Button
                        variant="secondary"
                        size="compact"
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
          ))}
          <Notice
            tone="info"
            title={t('tax.income.interestDeductionTitle')}
          >
            {t('tax.income.interestDeductionHelp')}
          </Notice>
          <StickyActions>
            <Button
              variant="secondary"
              onClick={() => setStep('salary')}
            >
              {t('common.back')}
            </Button>
            <Button
              disabled={draft.otherSources.some(
                (item) => !item.reviewed && !item.disputed,
              )}
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
