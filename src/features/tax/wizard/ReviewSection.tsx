import { AlertTriangle, ArrowRight, Check, Info } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  AmountContext,
  ProgressState,
  ReviewList,
  ReviewRow,
  RuleGroup,
  RuleList,
  RuleRow,
  StickyActions,
} from '../../../components/patterns';
import { Button, SectionHeading, Status } from '../../../components/ui';
import { formatMoney } from '../../../components/formatters';
import { SECTION_ID_TO_ANCHOR, type WizardAnchor } from './anchors';
import { deductionSectionLabel } from './labels';
import type {
  RegimeComparison,
  ReturnDraft,
  ValidationIssue,
} from '../../../types/tax';

export function ReviewSection({
  draft,
  comparison,
  issues,
  onBack,
  onIssueClick,
}: {
  draft: ReturnDraft;
  comparison: RegimeComparison | null;
  issues: ValidationIssue[] | null;
  onBack: () => void;
  onIssueClick: (anchor: WizardAnchor) => void;
}) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const selected = draft.regime.selected;
  const computation =
    selected && comparison
      ? selected === 'NEW'
        ? comparison.new
        : comparison.old
      : null;

  const blocking = issues?.filter(
    (issue) =>
      issue.severity === 'BLOCKING' || issue.severity === 'ROUTE_CHANGE',
  );
  const canContinue = issues !== null && (blocking?.length ?? 0) === 0;

  return (
    <section
      id="review"
      tabIndex={-1}
    >
      <SectionHeading title={t('tax.review.title')} />
      <p className="text-ink-muted">{t('tax.review.subtitle')}</p>

      {!computation ? (
        <p className="text-ink-muted">{t('tax.review.chooseRegimeFirst')}</p>
      ) : (
        <>
          <ReviewList>
            <ReviewRow
              label={t('tax.review.salaryIncome')}
              value={formatMoney(computation.income.salary, i18n.language)}
            />
            {(draft.properties.length > 0 ||
              computation.income.houseProperty !== 0) && (
              <ReviewRow
                label={t('tax.review.housePropertyIncome')}
                value={formatMoney(
                  computation.income.houseProperty,
                  i18n.language,
                )}
              />
            )}
            {draft.business && (
              <ReviewRow
                label={t('tax.review.businessIncome')}
                value={formatMoney(computation.income.business, i18n.language)}
              />
            )}
            <ReviewRow
              label={t('tax.review.otherIncome')}
              value={formatMoney(
                computation.income.otherSources,
                i18n.language,
              )}
            />
            {draft.capitalGains.length > 0 && (
              <ReviewRow
                label={t('tax.review.capitalGainIncome')}
                value={formatMoney(
                  computation.income.capitalGains,
                  i18n.language,
                )}
              />
            )}
            <ReviewRow
              label={t('tax.review.grossTotalIncome')}
              value={formatMoney(computation.grossTotalIncome, i18n.language)}
            />
            {computation.deductions.map((deduction) => (
              <ReviewRow
                key={deduction.section}
                label={deductionSectionLabel(deduction.section, t)}
                value={formatMoney(deduction.appliedAmount, i18n.language)}
              />
            ))}
            <ReviewRow
              label={t('tax.review.totalIncome')}
              value={formatMoney(computation.totalIncome, i18n.language)}
            />
            <ReviewRow
              label={t('tax.review.normalTax')}
              value={formatMoney(computation.normalTax, i18n.language)}
            />
            {computation.specialRateTax > 0 && (
              <ReviewRow
                label={t('tax.review.specialRateTax')}
                value={formatMoney(computation.specialRateTax, i18n.language)}
              />
            )}
            <ReviewRow
              label={t('tax.review.rebate')}
              value={formatMoney(computation.rebate, i18n.language)}
            />
            {computation.surcharge > 0 && (
              <ReviewRow
                label={t('tax.review.surcharge')}
                value={formatMoney(computation.surcharge, i18n.language)}
              />
            )}
            {computation.marginalRelief > 0 && (
              <ReviewRow
                label={t('tax.review.marginalRelief')}
                value={formatMoney(-computation.marginalRelief, i18n.language)}
              />
            )}
            <ReviewRow
              label={t('tax.review.cess')}
              value={formatMoney(computation.cess, i18n.language)}
            />
            {computation.interestAndFee.section234A > 0 && (
              <ReviewRow
                label={t('tax.review.interest234A')}
                value={formatMoney(
                  computation.interestAndFee.section234A,
                  i18n.language,
                )}
              />
            )}
            {computation.interestAndFee.section234B > 0 && (
              <ReviewRow
                label={t('tax.review.interest234B')}
                value={formatMoney(
                  computation.interestAndFee.section234B,
                  i18n.language,
                )}
              />
            )}
            {computation.interestAndFee.section234C > 0 && (
              <ReviewRow
                label={t('tax.review.interest234C')}
                value={formatMoney(
                  computation.interestAndFee.section234C,
                  i18n.language,
                )}
              />
            )}
            {computation.interestAndFee.lateFee234F > 0 && (
              <ReviewRow
                label={t('tax.review.lateFee234F')}
                value={formatMoney(
                  computation.interestAndFee.lateFee234F,
                  i18n.language,
                )}
              />
            )}
            <ReviewRow
              label={t('tax.review.totalLiability')}
              value={formatMoney(computation.totalTaxLiability, i18n.language)}
            />
            <ReviewRow
              label={t('tax.review.taxCredits')}
              value={formatMoney(computation.taxCredits.total, i18n.language)}
            />
          </ReviewList>
          <AmountContext
            label={
              computation.refund > 0
                ? t('tax.review.refundLabel')
                : t('tax.review.payableLabel')
            }
            amount={formatMoney(
              computation.refund > 0
                ? computation.refund
                : computation.taxPayable,
              i18n.language,
            )}
          />
        </>
      )}

      {issues === null ? (
        <ProgressState title={t('tax.validation.checking')} />
      ) : (
        <RuleList>
          {issues.filter((issue) => issue.severity !== 'INFO').length > 0 && (
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
                          issue.severity === 'WARNING' ? 'warning' : 'danger'
                        }
                      >
                        {issue.severity}
                      </Status>
                    }
                    onClick={() =>
                      onIssueClick(SECTION_ID_TO_ANCHOR[issue.sectionId])
                    }
                  >
                    <strong>{t(issue.messageKey)}</strong>
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
                  status={<Status kind="info">{t('common.details')}</Status>}
                >
                  <strong>{t(issue.messageKey)}</strong>
                </RuleRow>
              ))}
            {issues.length === 0 && (
              <RuleRow
                passed
                icon={<Check />}
                status={
                  <Status kind="success">{t('tax.validation.ready')}</Status>
                }
              >
                <strong>{t('tax.validation.allReady')}</strong>
              </RuleRow>
            )}
          </RuleGroup>
        </RuleList>
      )}

      <StickyActions>
        <Button
          variant="secondary"
          onClick={onBack}
        >
          {t('common.back')}
        </Button>
        <Button
          disabled={!canContinue || !computation}
          onClick={() =>
            computation && computation.taxPayable > 0
              ? navigate('/tax/file/payment')
              : navigate('/tax/file/declare')
          }
        >
          {computation && computation.taxPayable > 0
            ? t('tax.review.payNow')
            : t('tax.validation.continueToDeclaration')}
          <ArrowRight />
        </Button>
      </StickyActions>
    </section>
  );
}
