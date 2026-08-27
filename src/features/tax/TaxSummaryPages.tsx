import { useEffect, useState } from 'react';
import { AlertTriangle, ArrowRight, Check, Info } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { useAppStore } from '../../app/store';
import { Button, Page, PageHeader, Status } from '../../components/ui';
import {
  AmountContext,
  ProgressState,
  ReviewList,
  ReviewRow,
  RuleGroup,
  RuleList,
  RuleRow,
  StepProgress,
  StickyActions,
} from '../../components/patterns';
import { formatMoney } from '../../components/formatters';
import { useReturnDraft } from './useReturnDraft';
import type { ValidationIssue } from '../../types/tax';

type Step = 'summary' | 'validation';

export function TaxSummaryPages() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const validateReturn = useAppStore((state) => state.validateReturn);
  const { draft, loading } = useReturnDraft();
  const [step, setStep] = useState<Step>('summary');
  const [issues, setIssues] = useState<ValidationIssue[] | null>(null);

  useEffect(() => {
    if (step !== 'validation' || !draft) return;
    void validateReturn(draft).then(setIssues);
  }, [step, draft, validateReturn]);

  if (loading || !draft)
    return <ProgressState title={t('tax.entry.loading')} />;

  const selected = draft.regime.selected;
  const computation = selected ? draft.computation?.[selected] : null;
  if (!computation) return null;

  const blocking = issues?.filter(
    (issue) =>
      issue.severity === 'BLOCKING' || issue.severity === 'ROUTE_CHANGE',
  );
  const canContinue = issues !== null && (blocking?.length ?? 0) === 0;

  return (
    <Page
      width="narrow"
      mode="journey"
    >
      <PageHeader
        eyebrow={t('tax.summary.eyebrow')}
        title={t('tax.summary.title')}
        subtitle={t('tax.summary.subtitle')}
        back="/tax/file/regime"
      />
      <StepProgress
        current={step === 'summary' ? 1 : 2}
        total={2}
      />
      {step === 'summary' && (
        <section>
          <ReviewList>
            <ReviewRow
              label={t('tax.summary.salaryIncome')}
              value={formatMoney(computation.income.salary, i18n.language)}
            />
            {(draft.properties.length > 0 ||
              computation.income.houseProperty !== 0) && (
              <ReviewRow
                label={t('tax.summary.housePropertyIncome')}
                value={formatMoney(
                  computation.income.houseProperty,
                  i18n.language,
                )}
              />
            )}
            {draft.business && (
              <ReviewRow
                label={t('tax.summary.businessIncome')}
                value={formatMoney(computation.income.business, i18n.language)}
              />
            )}
            <ReviewRow
              label={t('tax.summary.otherIncome')}
              value={formatMoney(
                computation.income.otherSources,
                i18n.language,
              )}
            />
            {draft.capitalGains.length > 0 && (
              <ReviewRow
                label={t('tax.summary.capitalGainIncome')}
                value={formatMoney(
                  computation.income.capitalGains,
                  i18n.language,
                )}
              />
            )}
            <ReviewRow
              label={t('tax.summary.grossTotalIncome')}
              value={formatMoney(computation.grossTotalIncome, i18n.language)}
              action={
                <Link
                  to="/tax/file/income"
                  className="text-primary"
                >
                  {t('common.details')}
                </Link>
              }
            />
            {computation.deductions.map((deduction) => (
              <ReviewRow
                key={deduction.section}
                label={deduction.section}
                value={formatMoney(deduction.appliedAmount, i18n.language)}
              />
            ))}
            <ReviewRow
              label={t('tax.summary.totalIncome')}
              value={formatMoney(computation.totalIncome, i18n.language)}
            />
            <ReviewRow
              label={t('tax.summary.normalTax')}
              value={formatMoney(computation.normalTax, i18n.language)}
            />
            {computation.specialRateTax > 0 && (
              <ReviewRow
                label={t('tax.summary.specialRateTax')}
                value={formatMoney(computation.specialRateTax, i18n.language)}
              />
            )}
            <ReviewRow
              label={t('tax.summary.rebate')}
              value={formatMoney(computation.rebate, i18n.language)}
            />
            {computation.surcharge > 0 && (
              <ReviewRow
                label={t('tax.summary.surcharge')}
                value={formatMoney(computation.surcharge, i18n.language)}
              />
            )}
            {computation.marginalRelief > 0 && (
              <ReviewRow
                label={t('tax.summary.marginalRelief')}
                value={formatMoney(-computation.marginalRelief, i18n.language)}
              />
            )}
            <ReviewRow
              label={t('tax.summary.cess')}
              value={formatMoney(computation.cess, i18n.language)}
            />
            {computation.interestAndFee.section234A > 0 && (
              <ReviewRow
                label={t('tax.summary.interest234A')}
                value={formatMoney(
                  computation.interestAndFee.section234A,
                  i18n.language,
                )}
              />
            )}
            {computation.interestAndFee.section234B > 0 && (
              <ReviewRow
                label={t('tax.summary.interest234B')}
                value={formatMoney(
                  computation.interestAndFee.section234B,
                  i18n.language,
                )}
              />
            )}
            {computation.interestAndFee.section234C > 0 && (
              <ReviewRow
                label={t('tax.summary.interest234C')}
                value={formatMoney(
                  computation.interestAndFee.section234C,
                  i18n.language,
                )}
              />
            )}
            {computation.interestAndFee.lateFee234F > 0 && (
              <ReviewRow
                label={t('tax.summary.lateFee234F')}
                value={formatMoney(
                  computation.interestAndFee.lateFee234F,
                  i18n.language,
                )}
              />
            )}
            <ReviewRow
              label={t('tax.summary.totalLiability')}
              value={formatMoney(computation.totalTaxLiability, i18n.language)}
            />
            <ReviewRow
              label={t('tax.summary.taxCredits')}
              value={formatMoney(computation.taxCredits.total, i18n.language)}
            />
          </ReviewList>
          <AmountContext
            label={
              computation.refund > 0
                ? t('tax.summary.refundLabel')
                : t('tax.summary.payableLabel')
            }
            amount={formatMoney(
              computation.refund > 0
                ? computation.refund
                : computation.taxPayable,
              i18n.language,
            )}
          />
          <StickyActions>
            <Button
              onClick={() =>
                computation.taxPayable > 0
                  ? navigate('/tax/file/payment')
                  : setStep('validation')
              }
            >
              {computation.taxPayable > 0
                ? t('tax.summary.payNow')
                : t('common.continue')}
              <ArrowRight />
            </Button>
          </StickyActions>
        </section>
      )}
      {step === 'validation' && (
        <section>
          {issues === null ? (
            <ProgressState title={t('tax.validation.checking')} />
          ) : (
            <>
              <RuleList>
                {issues.filter((issue) => issue.severity !== 'INFO').length >
                  0 && (
                  <RuleGroup title={t('tax.validation.needsAttention')}>
                    {issues
                      .filter((issue) => issue.severity !== 'INFO')
                      .map((issue) => (
                        <RuleRow
                          key={issue.id}
                          passed={false}
                          icon={<AlertTriangle />}
                          status={
                            <Status
                              kind={
                                issue.severity === 'WARNING'
                                  ? 'warning'
                                  : 'danger'
                              }
                            >
                              {issue.severity}
                            </Status>
                          }
                        >
                          <strong>{t(issue.messageKey)}</strong>
                          {issue.fixTarget && (
                            <Link
                              to={issue.fixTarget.route}
                              className="text-[0.82rem] font-bold text-primary"
                            >
                              {t('tax.validation.fixThis')}
                            </Link>
                          )}
                        </RuleRow>
                      ))}
                  </RuleGroup>
                )}
                <RuleGroup title={t('tax.validation.ready')}>
                  {issues
                    .filter((issue) => issue.severity === 'INFO')
                    .map((issue) => (
                      <RuleRow
                        key={issue.id}
                        passed
                        icon={<Info />}
                        status={
                          <Status kind="info">{t('common.details')}</Status>
                        }
                      >
                        <strong>{t(issue.messageKey)}</strong>
                      </RuleRow>
                    ))}
                  {issues.length === 0 && (
                    <RuleRow
                      passed
                      icon={<Check />}
                      status={
                        <Status kind="success">
                          {t('tax.validation.ready')}
                        </Status>
                      }
                    >
                      <strong>{t('tax.validation.allReady')}</strong>
                    </RuleRow>
                  )}
                </RuleGroup>
              </RuleList>
              <StickyActions>
                <Button
                  variant="secondary"
                  onClick={() => setStep('summary')}
                >
                  {t('common.back')}
                </Button>
                <Button
                  disabled={!canContinue}
                  onClick={() => navigate('/tax/file/declare')}
                >
                  {t('tax.validation.continueToDeclaration')}
                  <ArrowRight />
                </Button>
              </StickyActions>
            </>
          )}
        </section>
      )}
    </Page>
  );
}
