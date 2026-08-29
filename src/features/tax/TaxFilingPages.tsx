import { useState } from 'react';
import { ArrowRight, Check, CircleDot, Clock3 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../../app/store';
import {
  Button,
  ButtonLink,
  Page,
  PageHeader,
  Status,
} from '../../components/ui';
import {
  DeclarationCheck,
  FieldLabel,
  OtpInput,
  ValidationAlert,
} from '../../components/forms';
import {
  Notice,
  OutcomeMark,
  ProgressState,
  ReferenceBand,
  ReviewList,
  ReviewRow,
  StatusCard,
  StatusTimeline,
  StatusTimelineItem,
  StepProgress,
  StickyActions,
  SubmissionStage,
  SubmissionStages,
} from '../../components/patterns';
import { formatDate, formatMoney } from '../../components/formatters';
import { useReturnDraft } from './useReturnDraft';
import { filingRouteLabel, regimeLabel } from './wizard/labels';
import type { FiledReturnSnapshot } from '../../types/tax';

type Step = 'declare' | 'filing' | 'verify' | 'done';

export function TaxFilingPages({
  statusOnly = false,
}: {
  statusOnly?: boolean;
}) {
  const { t } = useTranslation();
  const persona = useAppStore((state) => state.persona);
  const fileReturn = useAppStore((state) => state.fileReturn);
  const verifyReturn = useAppStore((state) => state.verifyReturn);
  const { draft, loading, error, retry } = useReturnDraft();
  const filedReturn = persona?.tax?.filedReturns[0];
  const [step, setStep] = useState<Step>(
    filedReturn
      ? filedReturn.verification.status === 'VERIFIED'
        ? 'done'
        : 'verify'
      : 'declare',
  );
  const [declared, setDeclared] = useState(false);
  const [otp, setOtp] = useState('');
  const [formError, setFormError] = useState('');

  if (!persona) return null;

  if (!filedReturn && statusOnly)
    return (
      <Page width="narrow">
        <PageHeader
          eyebrow={t('tax.status.eyebrow')}
          title={t('tax.status.none')}
          subtitle={t('tax.status.noneHelp')}
          back="/tax"
        />
      </Page>
    );

  if (step === 'declare' && error)
    return (
      <Page width="narrow">
        <PageHeader
          eyebrow={t('tax.declare.eyebrow')}
          title={t('tax.declare.title')}
          subtitle={t('tax.declare.subtitle')}
          back="/tax/file"
        />
        <Notice
          tone="warning"
          title={t('tax.entry.error')}
          actions={<Button onClick={retry}>{t('common.retry')}</Button>}
        />
      </Page>
    );

  if (step === 'declare' && (loading || !draft))
    return <ProgressState title={t('tax.entry.loading')} />;

  async function submitFiling() {
    if (!draft || !declared) {
      setFormError(t('tax.declare.acceptRequired'));
      return;
    }
    setStep('filing');
    setFormError('');
    try {
      await fileReturn(draft);
      setStep('verify');
    } catch {
      setStep('declare');
      setFormError(t('tax.declare.filingFailed'));
    }
  }

  async function submitVerification() {
    const acknowledgmentNumber =
      persona?.tax?.filedReturns[0]?.acknowledgmentNumber;
    if (!acknowledgmentNumber) return;
    if (otp !== '123456') {
      setFormError(t('tax.verify.invalidOtp'));
      return;
    }
    setFormError('');
    try {
      await verifyReturn(acknowledgmentNumber, otp);
      setStep('done');
    } catch {
      setFormError(t('tax.verify.failed'));
    }
  }

  if (step === 'done' && persona.tax?.filedReturns[0])
    return (
      <TaxFilingStatus
        filed={persona.tax.filedReturns[0]}
        assessmentYear={persona.tax.assessmentYear}
      />
    );

  return (
    <Page
      width="narrow"
      mode="journey"
    >
      <PageHeader
        eyebrow={t('tax.declare.eyebrow')}
        title={t('tax.declare.title')}
        subtitle={t('tax.declare.subtitle')}
        back="/tax/file"
      />
      <StepProgress
        current={step === 'declare' ? 1 : step === 'filing' ? 1 : 2}
        total={2}
      />
      {step === 'declare' && draft && (
        <section>
          <ReviewList>
            <ReviewRow
              label={t('tax.declare.route')}
              value={filingRouteLabel(draft.filingRoute, t)}
            />
            <ReviewRow
              label={t('tax.declare.regime')}
              value={
                draft.regime.selected
                  ? regimeLabel(draft.regime.selected, t)
                  : ''
              }
            />
          </ReviewList>
          <DeclarationCheck
            checked={declared}
            onChange={setDeclared}
          >
            {t('tax.declare.checkboxLabel')}
          </DeclarationCheck>
          {formError && <ValidationAlert>{formError}</ValidationAlert>}
          <StickyActions>
            <Button
              disabled={!declared}
              onClick={() => void submitFiling()}
            >
              {t('tax.declare.fileButton')}
              <ArrowRight />
            </Button>
          </StickyActions>
        </section>
      )}
      {step === 'filing' && (
        <ProgressState
          title={t('tax.declare.filingInProgress')}
          description={t('tax.declare.filingHelp')}
        >
          <SubmissionStages>
            <SubmissionStage
              status="done"
              icon={<Check />}
            >
              {t('tax.declare.stageSealed')}
            </SubmissionStage>
            <SubmissionStage
              status="active"
              icon={<Clock3 />}
            >
              {t('tax.declare.stageAcknowledgment')}
            </SubmissionStage>
            <SubmissionStage icon={<CircleDot />}>
              {t('tax.declare.stageActivity')}
            </SubmissionStage>
          </SubmissionStages>
        </ProgressState>
      )}
      {step === 'verify' && (
        <section>
          <p className="text-ink-muted">{t('tax.verify.help')}</p>
          <FieldLabel
            htmlFor="tax-otp"
            hint={t('tax.verify.otpHint')}
          >
            {t('tax.verify.otpLabel')}
          </FieldLabel>
          <OtpInput
            id="tax-otp"
            value={otp}
            onChange={setOtp}
          />
          {formError && <ValidationAlert>{formError}</ValidationAlert>}
          <StickyActions>
            <Button onClick={() => void submitVerification()}>
              {t('tax.verify.submit')}
              <ArrowRight />
            </Button>
          </StickyActions>
        </section>
      )}
    </Page>
  );
}

function TaxFilingStatus({
  filed,
  assessmentYear,
}: {
  filed: FiledReturnSnapshot;
  assessmentYear: string;
}) {
  const { t, i18n } = useTranslation();
  const outcomeAmount =
    filed.computation.refund > 0
      ? filed.computation.refund
      : filed.computation.taxPayable;
  const outcomeLabel =
    filed.computation.refund > 0
      ? t('tax.status.refund')
      : filed.computation.taxPayable > 0
        ? t('tax.status.payable')
        : t('tax.status.nil');
  return (
    <Page
      width="narrow"
      mode="completion"
    >
      <PageHeader
        eyebrow={t('tax.status.eyebrow')}
        title={t('tax.status.filedTitle')}
        subtitle={t('tax.status.filedSubtitle', { ay: assessmentYear })}
        back="/tax"
      />
      <OutcomeMark icon={<Check />} />
      <ReferenceBand
        label={t('tax.status.acknowledgment')}
        reference={filed.acknowledgmentNumber}
        meta={`${t('tax.status.filedOn')} ${formatDate(filed.filedAt, i18n.language)}`}
      />
      <StatusCard
        status={
          <Status
            kind={
              filed.verification.status === 'VERIFIED' ? 'success' : 'warning'
            }
          >
            {filed.verification.status === 'VERIFIED'
              ? t('tax.status.verified')
              : t('tax.status.pendingVerification')}
          </Status>
        }
        title={`${outcomeLabel}: ${formatMoney(outcomeAmount, i18n.language)}`}
      >
        {t('tax.status.disclaimer')}
      </StatusCard>
      <StatusTimeline>
        <StatusTimelineItem
          state="complete"
          icon={<Check />}
          title={t('tax.status.timelineFiled')}
          meta={formatDate(filed.filedAt, i18n.language)}
        />
        <StatusTimelineItem
          state={
            filed.verification.status === 'VERIFIED' ? 'complete' : 'current'
          }
          icon={
            filed.verification.status === 'VERIFIED' ? <Check /> : <Clock3 />
          }
          title={t('tax.status.timelineVerification')}
          meta={
            filed.verification.verifiedAt
              ? formatDate(filed.verification.verifiedAt, i18n.language)
              : t('tax.status.notStarted')
          }
        />
        <StatusTimelineItem
          icon={<CircleDot />}
          title={
            filed.computation.refund > 0
              ? t('tax.status.timelineRefund')
              : t('tax.status.timelineClosed')
          }
          meta={t('tax.status.notStarted')}
        />
      </StatusTimeline>
      <ButtonLink
        wide
        to="/activity"
      >
        {t('tax.status.viewActivity')}
        <ArrowRight />
      </ButtonLink>
    </Page>
  );
}
