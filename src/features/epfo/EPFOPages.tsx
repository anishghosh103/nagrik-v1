import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  BadgeIndianRupee,
  Banknote,
  Check,
  CircleDot,
  Clock3,
  FileWarning,
  ShieldCheck,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useAppStore } from '../../app/store';
import {
  Button,
  ButtonLink,
  Page,
  PageHeader,
  SectionHeading,
  SourceMarker,
  Status,
} from '../../components/ui';
import {
  ChoiceCard,
  ChoiceGroup,
  FieldLabel,
  OtpInput,
} from '../../components/forms';
import {
  AmountContext,
  DetailSheet,
  OutcomeMark,
  ProgressState,
  ReadinessBanner,
  ReferenceBand,
  ReviewList,
  ReviewRow,
  RuleGroup,
  RuleList,
  RuleRow,
  SkeletonLines,
  StatusCard,
  StatusTimeline,
  StatusTimelineItem,
  StepProgress,
  StickyActions,
  SubmissionStage,
  SubmissionStages,
  BalanceSummary,
} from '../../components/patterns';
import { formatDate, formatMoney } from '../../components/formatters';
import type { ClaimSubmission, ClaimValidation } from '../../types/domain';

export function EPFOPage() {
  const { t, i18n } = useTranslation();
  const persona = useAppStore((state) => state.persona);
  if (!persona) return null;
  return (
    <Page>
      <PageHeader
        eyebrow={t('epfo.home.eyebrow')}
        title={t('epfo.home.title')}
        subtitle={t('epfo.home.subtitle')}
      />
      <BalanceSummary
        to="/epfo/passbook"
        icon={<BadgeIndianRupee />}
        label={t('epfo.home.balance')}
        amount={formatMoney(persona.epfo.balance, i18n.language)}
        meta={t('epfo.home.cached', {
          date: formatDate(persona.epfo.passbook.capturedAt, i18n.language),
        })}
      />
      <TaskList>
        <TaskItem
          to="/epfo/claim"
          number="01"
          title={t('epfo.home.withdraw')}
          detail={t('epfo.home.withdrawHelp')}
        />
        <TaskItem
          to="/epfo/transfer"
          number="02"
          title={t('epfo.home.transfer')}
          detail={t('epfo.home.transferHelp')}
        />
        <TaskItem
          to="/epfo/passbook"
          number="03"
          title={t('epfo.home.passbook')}
          detail={t('epfo.home.passbookHelp')}
        />
        <TaskItem
          to="/epfo/nomination"
          number="04"
          title={t('epfo.home.nomination')}
          detail={t('epfo.home.nominationHelp')}
        />
      </TaskList>
      <section className="rounded-[var(--radius-sheet)] bg-surface-muted p-5">
        <SectionHeading
          title={t('epfo.home.profile')}
          action={
            <Link
              to="/epfo/profile"
              className="flex items-center gap-1.25 font-[650] text-primary no-underline"
            >
              {t('common.details')}
              <ArrowRight size={17} />
            </Link>
          }
        />
        <div className="mb-3.5 flex flex-wrap gap-5 max-[599px]:grid max-[599px]:gap-2">
          {persona.epfo.kyc.map((record) => (
            <span
              key={record.kind}
              className="flex items-center gap-1.5 text-[0.86rem] font-[650] [&>svg]:size-4.25 [&>svg]:text-success"
            >
              <Check />
              {t('epfo.home.kycStatus', { kind: record.kind })}
            </span>
          ))}
        </div>
        <SourceMarker>
          <span
            aria-label={t('epfo.profile.uanAccessible', {
              digits: persona.epfo.maskedUan.slice(-4),
            })}
          >
            {t('epfo.home.snapshotLabel', { uan: persona.epfo.maskedUan })}
          </span>
        </SourceMarker>
      </section>
    </Page>
  );
}

function TaskList({ children }: { children: ReactNode }) {
  return <div className="my-7 grid">{children}</div>;
}

function TaskItem({
  to,
  number,
  title,
  detail,
}: {
  to: string;
  number: ReactNode;
  title: ReactNode;
  detail: ReactNode;
}) {
  return (
    <Link
      to={to}
      className="grid min-h-23 grid-cols-[42px_1fr_24px] items-center gap-3.75 border-b border-border px-0 py-2.5 text-left no-underline hover:text-primary"
    >
      <span className="font-[750] text-primary [font-variant-numeric:tabular-nums]">
        {number}
      </span>
      <span className="grid">
        <strong>{title}</strong>
        <small className="text-ink-muted">{detail}</small>
      </span>
      <ArrowRight />
    </Link>
  );
}

function BankConfirmation({
  icon,
  label,
  value,
  meta,
  status,
}: {
  icon: ReactNode;
  label: ReactNode;
  value: ReactNode;
  meta: ReactNode;
  status: ReactNode;
}) {
  return (
    <div className="mt-7 grid grid-cols-[42px_1fr_auto] items-center gap-3.5 border-y border-border py-5 max-[599px]:grid-cols-[36px_1fr]">
      <span className="text-primary">{icon}</span>
      <div className="grid gap-1">
        <span className="text-[0.82rem] text-ink-muted">{label}</span>
        <strong>{value}</strong>
        {meta}
      </div>
      <div className="max-[599px]:col-start-2">{status}</div>
    </div>
  );
}

type ClaimStep =
  | 'type'
  | 'eligibility'
  | 'checking'
  | 'checks'
  | 'details'
  | 'review'
  | 'submitting'
  | 'done';

export function ClaimPage({ statusOnly = false }: { statusOnly?: boolean }) {
  const { t, i18n } = useTranslation();
  const { persona, busy, validateClaim, submitClaim } = useAppStore();
  const [validation, setValidation] = useState<ClaimValidation | null>(null);
  const [step, setStep] = useState<ClaimStep>(
    persona?.epfo.claim || statusOnly ? 'done' : 'type',
  );
  const [amount, setAmount] = useState(120000);
  const [declared, setDeclared] = useState(false);
  const [otp, setOtp] = useState('');
  const [submission, setSubmission] = useState<ClaimSubmission | undefined>(
    persona?.epfo.claim,
  );
  const [formError, setFormError] = useState('');
  const [issueOpen, setIssueOpen] = useState(false);

  useEffect(() => {
    if (step !== 'checking') return;
    let active = true;
    void validateClaim()
      .then((result) => {
        if (active) {
          setValidation(result);
          setStep('checks');
        }
      })
      .catch(() => {
        if (active) setFormError(t('epfo.claim.checksUnavailable'));
      });
    return () => {
      active = false;
    };
  }, [step, validateClaim, t]);

  if (!persona) return null;
  const savedSubmission = submission ?? persona.epfo.claim;
  if (step === 'done' && savedSubmission)
    return <ClaimStatus reference={savedSubmission.reference} />;
  const currentNumber =
    step === 'type'
      ? 1
      : step === 'eligibility' || step === 'checking' || step === 'checks'
        ? 2
        : step === 'details'
          ? 3
          : 4;

  async function sendClaim() {
    if (!declared || otp !== '123456') {
      setFormError(t('epfo.claim.otpDeclarationError'));
      return;
    }
    setStep('submitting');
    setFormError('');
    try {
      const result = await submitClaim(amount, otp);
      setSubmission(result);
      setStep('done');
    } catch {
      setStep('review');
      setFormError(t('epfo.claim.submitFailed'));
    }
  }

  return (
    <Page
      width="narrow"
      mode="journey"
    >
      <PageHeader
        eyebrow={t('epfo.claim.finalSettlementEyebrow')}
        title={t('epfo.title')}
        subtitle={t('epfo.subtitle')}
        back="/epfo"
      />
      <StepProgress
        current={currentNumber}
        total={4}
      />
      {step === 'type' && (
        <section>
          <h2>{t('epfo.claim.chooseType')}</h2>
          <p className="text-ink-muted">{t('epfo.claim.chooseTypeHelp')}</p>
          <ChoiceGroup legend={t('epfo.claim.supportedType')}>
            <ChoiceCard selected>
              <input
                type="radio"
                checked
                readOnly
                name="claim-type"
              />
              <span>
                <strong>{t('epfo.claim.finalSettlement')}</strong>
                <small>{t('epfo.claim.finalSettlementHelp')}</small>
              </span>
              <Check />
            </ChoiceCard>
            <div className="grid gap-0.75 rounded-[9px] border border-dashed border-border p-4 text-ink-muted">
              <span>{t('epfo.claim.otherTypes')}</span>
              <small className="max-w-155">
                {t('epfo.claim.otherTypesHelp')}
              </small>
            </div>
          </ChoiceGroup>
          <StickyActions status={t('common.saved')}>
            <Button onClick={() => setStep('eligibility')}>
              {t('epfo.claim.checkEligibility')}
              <ArrowRight />
            </Button>
          </StickyActions>
        </section>
      )}
      {step === 'eligibility' && (
        <section>
          <ShieldCheck className="mb-4.5 size-13.5 text-primary" />
          <div>
            <Status kind="info">{t('epfo.claim.eligibility')}</Status>
            <h2 className="mt-2.25 mb-1.25">
              {t('epfo.claim.eligibilityTitle')}
            </h2>
            <p className="text-ink-muted">{t('epfo.claim.eligibilityHelp')}</p>
            <ul className="my-5.5 grid gap-2.5 pl-5.5">
              <li>{t('epfo.claim.exitPresent')}</li>
              <li>{t('epfo.claim.kycChecked')}</li>
              <li>{t('epfo.claim.identityChecked')}</li>
            </ul>
          </div>
          <StickyActions>
            <Button
              variant="secondary"
              onClick={() => setStep('type')}
            >
              {t('common.back')}
            </Button>
            <Button onClick={() => setStep('checking')}>
              {t('epfo.run')}
              <ArrowRight />
            </Button>
          </StickyActions>
        </section>
      )}
      {step === 'checking' && (
        <ProgressState
          variant="scan"
          icon={<ShieldCheck />}
          title={t('epfo.claim.checkingTitle')}
          description={t('epfo.claim.checkingDescription')}
        >
          {formError && (
            <div
              role="alert"
              className="my-3.5 border-l-4 border-danger bg-[#fff3ef] px-3.5 py-3 font-semibold text-danger"
            >
              {formError}
              <Button
                variant="secondary"
                onClick={() => setStep('checking')}
              >
                {t('common.retry')}
              </Button>
            </div>
          )}
          <SkeletonLines />
        </ProgressState>
      )}
      {step === 'checks' && validation && (
        <section>
          <ReadinessBanner
            state={validation.ready ? 'ready' : 'blocked'}
            status={
              <Status kind={validation.ready ? 'success' : 'danger'}>
                {validation.ready
                  ? t('epfo.claim.allPassed')
                  : t('epfo.claim.oneFailed')}
              </Status>
            }
            title={validation.ready ? t('epfo.ready') : t('epfo.blocked')}
            description={t('epfo.notGuarantee')}
          />
          <RuleChecklist
            validation={validation}
            onIssue={() => setIssueOpen(true)}
          />
          {validation.ready ? (
            <StickyActions
              status={t('epfo.claim.checked', {
                date: formatDate(validation.checkedAt, i18n.language),
              })}
            >
              <Button onClick={() => setStep('details')}>
                {t('epfo.claim.enterDetails')}
                <ArrowRight />
              </Button>
            </StickyActions>
          ) : (
            <StickyActions>
              <Button
                variant="secondary"
                onClick={() => setIssueOpen(true)}
              >
                {t('common.details')}
              </Button>
              <Button onClick={() => setStep('details')}>
                {t('epfo.claim.continueAnyway')}
                <ArrowRight />
              </Button>
            </StickyActions>
          )}
          {issueOpen && (
            <ClaimIssueSheet
              validation={validation}
              onClose={() => setIssueOpen(false)}
            />
          )}
        </section>
      )}
      {step === 'details' && (
        <section>
          <AmountContext
            label={t('epfo.balance')}
            amount={formatMoney(persona.epfo.balance, i18n.language)}
            meta={t('epfo.claim.cachedEstimateMeta')}
          />
          <FieldLabel htmlFor="claim-amount">
            {t('epfo.claimAmount')}
          </FieldLabel>
          <div className="grid h-15 grid-cols-[48px_1fr] overflow-hidden rounded-[9px] border border-border bg-surface">
            <span className="grid place-items-center border-r border-border text-[1.3rem]">
              ₹
            </span>
            <input
              id="claim-amount"
              type="number"
              min="1000"
              max={persona.epfo.balance}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="min-w-0 border-0 bg-transparent px-3.5 py-2.5 text-[1.35rem] [font-variant-numeric:tabular-nums]"
            />
          </div>
          <BankConfirmation
            icon={<Banknote />}
            label={t('epfo.bank')}
            value={t('epfo.claim.bankAccountValue', {
              account: persona.epfo.bankAccount,
            })}
            meta={<SourceMarker>{t('epfo.profile.bankSource')}</SourceMarker>}
            status={
              <Status kind="success">{t('epfo.profile.validated')}</Status>
            }
          />
          <StickyActions>
            <Button
              variant="secondary"
              onClick={() => setStep('checks')}
            >
              {t('common.back')}
            </Button>
            <Button
              disabled={amount < 1000 || amount > persona.epfo.balance}
              onClick={() => setStep('review')}
            >
              {t('epfo.claim.reviewClaimButton')}
              <ArrowRight />
            </Button>
          </StickyActions>
        </section>
      )}
      {step === 'review' && (
        <section>
          <h2>{t('epfo.claim.reviewAndVerifyTitle')}</h2>
          <ReviewList>
            <ReviewRow
              label={t('epfo.claim.claimTypeLabel')}
              value={t('epfo.claim.finalSettlement')}
            />
            <ReviewRow
              label={t('epfo.claim.amountRequestedLabel')}
              value={formatMoney(amount, i18n.language)}
            />
            <ReviewRow
              label={t('identity.fieldBankAccount')}
              value={persona.epfo.bankAccount}
            />
            <ReviewRow
              label={t('epfo.claim.readinessLabel')}
              value={
                validation?.ready === false ? (
                  <Status kind="warning">{t('epfo.claim.oneFailed')}</Status>
                ) : (
                  <Status kind="success">
                    {t('epfo.claim.checksPassedShort')}
                  </Status>
                )
              }
            />
          </ReviewList>
          <label className="grid cursor-pointer grid-cols-[22px_1fr] gap-3 rounded-lg bg-surface-muted p-4">
            <input
              type="checkbox"
              checked={declared}
              onChange={(e) => setDeclared(e.target.checked)}
              className="mt-0.75 size-4.75 accent-primary"
            />
            <span>{t('epfo.declaration')}</span>
          </label>
          <FieldLabel
            htmlFor="claim-otp"
            hint={t('epfo.otpHint')}
          >
            {t('epfo.otp')}
          </FieldLabel>
          <OtpInput
            id="claim-otp"
            value={otp}
            onChange={setOtp}
          />
          {formError && (
            <div
              role="alert"
              className="my-3.5 border-l-4 border-danger bg-[#fff3ef] px-3.5 py-3 font-semibold text-danger"
            >
              {formError}
            </div>
          )}
          <StickyActions>
            <Button
              variant="secondary"
              onClick={() => setStep('details')}
            >
              {t('common.back')}
            </Button>
            <Button
              disabled={busy}
              onClick={() => void sendClaim()}
            >
              {t('epfo.submit')}
              <ArrowRight />
            </Button>
          </StickyActions>
        </section>
      )}
      {step === 'submitting' && (
        <ProgressState
          title={t('epfo.claim.sendingTitle')}
          description={t('epfo.claim.sendingDescription')}
        >
          <SubmissionStages>
            <SubmissionStage
              status="done"
              icon={<Check />}
            >
              {t('epfo.claim.stageSealed')}
            </SubmissionStage>
            <SubmissionStage
              status="active"
              icon={<Clock3 />}
            >
              {t('epfo.claim.stageReference')}
            </SubmissionStage>
            <SubmissionStage icon={<CircleDot />}>
              {t('epfo.claim.stageActivity')}
            </SubmissionStage>
          </SubmissionStages>
        </ProgressState>
      )}
    </Page>
  );
}

function RuleChecklist({
  validation,
  onIssue,
}: {
  validation: ClaimValidation;
  onIssue: () => void;
}) {
  const { t } = useTranslation();
  const failed = validation.results.filter((rule) => !rule.passed);
  const passed = validation.results.filter((rule) => rule.passed);
  return (
    <RuleList>
      {failed.length > 0 && (
        <RuleGroup title={t('epfo.failed')}>
          {failed.map((rule) => (
            <RuleRow
              key={rule.code}
              passed={false}
              icon={<AlertTriangle />}
              status={<Status kind="danger">{t('epfo.claim.blocking')}</Status>}
              onClick={onIssue}
            >
              <strong>{t(rule.messageKey)}</strong>
              <SourceMarker>{rule.sourceRefs.join(' + ')}</SourceMarker>
              <small className="font-bold text-primary">
                {t('common.details')}
              </small>
            </RuleRow>
          ))}
        </RuleGroup>
      )}
      <RuleGroup title={t('epfo.passed')}>
        {passed.map((rule) => (
          <RuleRow
            key={rule.code}
            passed
            icon={<Check />}
            status={<Status kind="success">{t('epfo.claim.passed')}</Status>}
          >
            <strong>{t(rule.messageKey)}</strong>
            <SourceMarker>{rule.sourceRefs.join(' + ')}</SourceMarker>
            <details className="text-[0.73rem] text-ink-muted">
              <summary>{t('epfo.claim.technicalDetail')}</summary>
              <code className="text-ink">{rule.code}</code>
            </details>
          </RuleRow>
        ))}
      </RuleGroup>
    </RuleList>
  );
}

function ClaimIssueSheet({
  validation,
  onClose,
}: {
  validation: ClaimValidation;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const failed = validation.results.find((rule) => !rule.passed);
  if (!failed) return null;
  return (
    <DetailSheet
      onClose={onClose}
      labelledBy="claim-issue-title"
      eyebrow={t('epfo.claim.issueEyebrow')}
      title={t(failed.messageKey)}
    >
      <p className="text-ink-muted">{t('epfo.claim.issueConsequence')}</p>
      <SourceMarker>{failed.sourceRefs.join(' + ')}</SourceMarker>
      <details
        open
        className="my-6 border-y border-border py-3.5"
      >
        <summary>{t('epfo.claim.technicalDetail')}</summary>
        <code>{failed.code}</code>
      </details>
      <ButtonLink
        wide
        to={failed.fixTarget ?? '/identity'}
      >
        {t('epfo.claim.fixMismatch')}
        <ArrowRight />
      </ButtonLink>
    </DetailSheet>
  );
}

export function RejectedClaimPage() {
  const { t, i18n } = useTranslation();
  const persona = useAppStore((state) => state.persona);
  const claim = persona?.epfo.claimHistory.find(
    (item) => item.status === 'REJECTED',
  );
  if (!claim)
    return (
      <Page width="narrow">
        <PageHeader
          eyebrow={t('epfo.history.eyebrow')}
          title={t('epfo.history.none')}
          subtitle={t('epfo.history.noneHelp')}
          back="/epfo/history"
        />
      </Page>
    );
  return (
    <Page width="narrow">
      <PageHeader
        eyebrow={t('epfo.history.eyebrow')}
        title={t('epfo.history.rejected')}
        subtitle={t('epfo.history.rejectedHelp')}
        back="/epfo/history"
      />
      <section className="grid grid-cols-[52px_1fr] gap-4.5 rounded-[var(--radius-sheet)] border border-[#ddb9ad] bg-[#fff3ef] p-5.5 [&>svg]:size-10.5 [&>svg]:text-danger">
        <FileWarning />
        <div>
          <Status kind="danger">{t('epfo.history.decision')}</Status>
          <h2 className="mt-2.25 mb-1.25">
            {t(claim.reasonKey ?? 'epfo.history.c15Reason')}
          </h2>
          <p className="m-0 text-ink-muted">{t('epfo.history.c15Help')}</p>
        </div>
      </section>
      <ReviewList>
        <ReviewRow
          label={t('epfo.reference')}
          value={claim.reference}
        />
        <ReviewRow
          label={t('epfo.history.decided')}
          value={formatDate(claim.decidedAt, i18n.language)}
        />
        <ReviewRow
          label={t('epfo.claimAmount')}
          value={formatMoney(claim.amount, i18n.language)}
        />
        <ReviewRow
          label={t('epfo.history.code')}
          value={claim.reasonCode}
        />
      </ReviewList>
      <ButtonLink to="/identity">
        {t('epfo.history.fix')}
        <ArrowRight />
      </ButtonLink>
    </Page>
  );
}

function ClaimStatus({ reference }: { reference: string }) {
  const { t, i18n } = useTranslation();
  const persona = useAppStore((state) => state.persona);
  const busy = useAppStore((state) => state.busy);
  const refreshClaimStatus = useAppStore((state) => state.refreshClaimStatus);
  const resubmitClaim = useAppStore((state) => state.resubmitClaim);
  if (!persona) return null;

  const live =
    persona.epfo.claim?.reference === reference
      ? persona.epfo.claim
      : undefined;
  const settled = persona.epfo.claimHistory.find(
    (entry) => entry.reference === reference && entry.status === 'SETTLED',
  );

  if (settled)
    return (
      <Page
        width="narrow"
        mode="completion"
      >
        <PageHeader
          eyebrow={t('epfo.claim.statusEyebrow')}
          title={t('epfo.claim.settledTitle')}
          subtitle={t('epfo.claim.settledHelp')}
          back="/epfo"
        />
        <OutcomeMark icon={<Check />} />
        <ReferenceBand
          label={t('epfo.reference')}
          reference={settled.reference}
          meta={t('epfo.claim.submittedMeta', {
            date: formatDate(settled.submittedAt, i18n.language),
          })}
        />
        <StatusCard
          tone="success"
          status={
            <Status kind="success">{t('epfo.claim.settledStatus')}</Status>
          }
          title={t('epfo.claim.settledTitle')}
        >
          {t('epfo.claim.settledHelp')}
        </StatusCard>
        <StatusTimeline>
          <StatusTimelineItem
            state="complete"
            icon={<Check />}
            title={t('epfo.claim.timelineReceived')}
            meta={formatDate(settled.submittedAt, i18n.language)}
          />
          <StatusTimelineItem
            state="complete"
            icon={<Check />}
            title={t('epfo.claim.timelineValidation')}
            meta={undefined}
          />
          <StatusTimelineItem
            state="complete"
            icon={<Check />}
            title={t('epfo.claim.timelineDecision')}
            meta={undefined}
          />
          <StatusTimelineItem
            state="complete"
            icon={<Check />}
            title={t('epfo.claim.timelinePayment')}
            meta={formatDate(settled.decidedAt, i18n.language)}
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

  if (!live) return null;

  const validationDone = live.stage !== 'IDENTITY_CHECK';
  const decisionCurrent = live.stage === 'SETTLEMENT';
  const stageTitleKey =
    live.stage === 'IDENTITY_CHECK'
      ? 'epfo.claim.stageIdentityTitle'
      : live.stage === 'ELIGIBILITY_CHECK'
        ? 'epfo.claim.stageEligibilityTitle'
        : 'epfo.claim.stageSettlementTitle';

  return (
    <Page
      width="narrow"
      mode="completion"
    >
      <PageHeader
        eyebrow={t('epfo.claim.statusEyebrow')}
        title={t('epfo.received')}
        subtitle={t('epfo.expected')}
        back="/epfo"
      />
      <OutcomeMark icon={<Check />} />
      <ReferenceBand
        label={t('epfo.reference')}
        reference={live.reference}
        meta={t('epfo.claim.submittedMeta', {
          date: formatDate(live.submittedAt, i18n.language),
        })}
      />
      {live.status === 'ISSUE' && live.issue ? (
        <>
          <StatusCard
            status={<Status kind="danger">{t('epfo.claim.issueFound')}</Status>}
            title={t(live.issue.messageKey)}
          >
            <SourceMarker>{live.issue.sourceRefs.join(' + ')}</SourceMarker>
          </StatusCard>
          <div className="mt-6 grid gap-3">
            <ButtonLink to={live.issue.fixTarget ?? '/identity'}>
              {t('epfo.claim.fixMismatch')}
              <ArrowRight />
            </ButtonLink>
            <Button
              variant="secondary"
              disabled={busy}
              onClick={() => void resubmitClaim()}
            >
              {t('epfo.claim.resubmit')}
            </Button>
          </div>
        </>
      ) : (
        <>
          <StatusCard
            status={
              <Status kind="info">{t('epfo.claim.receivedStatus')}</Status>
            }
            title={t(stageTitleKey)}
          >
            {t('epfo.claim.recordedOnce')}
          </StatusCard>
          <StatusTimeline>
            <StatusTimelineItem
              state="complete"
              icon={<Check />}
              title={t('epfo.claim.timelineReceived')}
              meta={formatDate(live.submittedAt, i18n.language)}
            />
            <StatusTimelineItem
              state={validationDone ? 'complete' : 'current'}
              icon={validationDone ? <Check /> : <Clock3 />}
              title={t('epfo.claim.timelineValidation')}
              meta={
                validationDone
                  ? undefined
                  : t('epfo.claim.timelineValidationMeta')
              }
            />
            <StatusTimelineItem
              state={decisionCurrent ? 'current' : undefined}
              icon={decisionCurrent ? <Clock3 /> : <CircleDot />}
              title={t('epfo.claim.timelineDecision')}
              meta={t('epfo.claim.timelineNotStarted')}
            />
            <StatusTimelineItem
              icon={<CircleDot />}
              title={t('epfo.claim.timelinePayment')}
              meta={t('epfo.claim.timelineNotStarted')}
            />
          </StatusTimeline>
          <div className="mt-6 grid gap-3">
            <Button
              disabled={busy}
              onClick={() => void refreshClaimStatus()}
            >
              {t('epfo.claim.checkUpdates')}
              <ArrowRight />
            </Button>
            <ButtonLink
              variant="secondary"
              to="/activity"
            >
              {t('tax.status.viewActivity')}
            </ButtonLink>
          </div>
        </>
      )}
    </Page>
  );
}
