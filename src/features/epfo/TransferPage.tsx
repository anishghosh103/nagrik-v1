import { useEffect, useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  Check,
  CircleDot,
  Clock3,
  MoveRight,
  ShieldCheck,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../../app/store';
import { formatDate, formatMoney } from '../../components/formatters';
import {
  Button,
  ButtonLink,
  LargeGlyph,
  Page,
  PageHeader,
  SourceMarker,
  Status,
} from '../../components/ui';
import {
  ChoiceCard,
  ChoiceGroup,
  DeclarationCheck,
  FieldLabel,
  OtpInput,
  ValidationAlert,
} from '../../components/forms';
import {
  AmountContext,
  OutcomeMark,
  ProgressState,
  ReadinessBanner,
  ReferenceBand,
  RuleGroup,
  RuleList,
  RuleRow,
  StatusCard,
  StatusTimeline,
  StatusTimelineItem,
  StickyActions,
} from '../../components/patterns';
import type { PFTransfer, TransferValidation } from '../../types/domain';

type TransferStep =
  | 'intro'
  | 'employments'
  | 'checking'
  | 'validation'
  | 'review'
  | 'submitting'
  | 'done';

export function TransferPage({ statusOnly = false }: { statusOnly?: boolean }) {
  const { t, i18n } = useTranslation();
  const { persona, busy, validateTransfer, saveTransferDraft, submitTransfer } =
    useAppStore();
  const previous = persona?.epfo.employment.find((item) => !item.current);
  const current = persona?.epfo.employment.find((item) => item.current);
  const draft = persona?.epfo.transferDraft;
  const [sourceId, setSourceId] = useState(
    draft?.sourceEmploymentId ?? previous?.id ?? '',
  );
  const [destinationId, setDestinationId] = useState(
    draft?.destinationEmploymentId ?? current?.id ?? '',
  );
  const [step, setStep] = useState<TransferStep>(
    persona?.epfo.transfer || statusOnly ? 'done' : 'intro',
  );
  const [validation, setValidation] = useState<TransferValidation | null>(null);
  const [declared, setDeclared] = useState(false);
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [submission, setSubmission] = useState<PFTransfer | undefined>(
    persona?.epfo.transfer,
  );

  useEffect(() => {
    if (step !== 'checking' || !sourceId || !destinationId) return;
    let active = true;
    void validateTransfer(sourceId, destinationId)
      .then((result) => {
        if (active) {
          setValidation(result);
          setStep('validation');
        }
      })
      .catch(() => {
        if (active) {
          setError(t('epfo.transfer.checkFailed'));
          setStep('employments');
        }
      });
    return () => {
      active = false;
    };
  }, [destinationId, sourceId, step, t, validateTransfer]);
  if (!persona) return null;
  const saved = submission ?? persona.epfo.transfer;
  if (step === 'done' && saved) return <TransferStatus transfer={saved} />;
  const source = persona.epfo.employment.find((item) => item.id === sourceId);
  const destination = persona.epfo.employment.find(
    (item) => item.id === destinationId,
  );

  async function review() {
    const input = {
      sourceEmploymentId: sourceId,
      destinationEmploymentId: destinationId,
      declarationAccepted: false,
      otp: '',
    };
    await saveTransferDraft(input);
    setStep('checking');
  }
  async function submit() {
    if (!declared || otp !== '123456') {
      setError(t('epfo.transfer.verifyError'));
      return;
    }
    setError('');
    setStep('submitting');
    try {
      const result = await submitTransfer({
        sourceEmploymentId: sourceId,
        destinationEmploymentId: destinationId,
        declarationAccepted: true,
        otp,
      });
      setSubmission(result);
      setStep('done');
    } catch {
      setError(t('epfo.transfer.submitFailed'));
      setStep('review');
    }
  }

  return (
    <Page
      width="narrow"
      mode="journey"
    >
      <PageHeader
        eyebrow={t('epfo.transfer.eyebrow')}
        title={t('epfo.transfer.title')}
        subtitle={t('epfo.transfer.subtitle')}
        back="/epfo"
      />
      {step === 'intro' && (
        <section className="text-left">
          <LargeGlyph
            className="mb-5"
            icon={<MoveRight />}
          />
          <h2>{t('epfo.transfer.introTitle')}</h2>
          <p>{t('epfo.transfer.introHelp')}</p>
          <ul className="my-5.5 grid gap-2.5 pl-5.5">
            <li>{t('epfo.transfer.introOne')}</li>
            <li>{t('epfo.transfer.introTwo')}</li>
            <li>{t('epfo.transfer.introThree')}</li>
          </ul>
          <StickyActions status={t('common.saved')}>
            <Button onClick={() => setStep('employments')}>
              {t('epfo.transfer.start')}
              <ArrowRight />
            </Button>
          </StickyActions>
        </section>
      )}
      {step === 'employments' && (
        <section>
          <h2>{t('epfo.transfer.choose')}</h2>
          <p className="text-ink-muted">{t('epfo.transfer.chooseHelp')}</p>
          {error && <ValidationAlert>{error}</ValidationAlert>}
          <ChoiceGroup legend={t('epfo.transfer.previous')}>
            {persona.epfo.employment
              .filter((item) => !item.current)
              .map((item) => (
                <ChoiceCard
                  key={item.id}
                  selected={sourceId === item.id}
                >
                  <input
                    type="radio"
                    name="source"
                    checked={sourceId === item.id}
                    onChange={() => setSourceId(item.id)}
                  />
                  <span>
                    <strong>{item.employer}</strong>
                    <small>
                      {formatDate(item.joinedOn, i18n.language)} —{' '}
                      {item.exitedOn
                        ? formatDate(item.exitedOn, i18n.language)
                        : t('epfo.employment.notRecorded')}
                    </small>
                  </span>
                  <Check />
                </ChoiceCard>
              ))}
          </ChoiceGroup>
          <ChoiceGroup legend={t('epfo.transfer.current')}>
            {persona.epfo.employment
              .filter((item) => item.current)
              .map((item) => (
                <ChoiceCard
                  key={item.id}
                  selected={destinationId === item.id}
                >
                  <input
                    type="radio"
                    name="destination"
                    checked={destinationId === item.id}
                    onChange={() => setDestinationId(item.id)}
                  />
                  <span>
                    <strong>{item.employer}</strong>
                    <small>
                      {formatDate(item.joinedOn, i18n.language)} —{' '}
                      {t('epfo.employment.current')}
                    </small>
                  </span>
                  <Check />
                </ChoiceCard>
              ))}
          </ChoiceGroup>
          <StickyActions>
            <Button
              variant="secondary"
              onClick={() => setStep('intro')}
            >
              {t('common.back')}
            </Button>
            <Button
              disabled={!sourceId || !destinationId}
              onClick={() => void review()}
            >
              {t('epfo.transfer.runChecks')}
              <ArrowRight />
            </Button>
          </StickyActions>
        </section>
      )}
      {step === 'checking' && (
        <ProgressState
          title={t('epfo.transfer.checking')}
          description={t('epfo.transfer.checkingHelp')}
        />
      )}
      {step === 'validation' && validation && (
        <section>
          <ReadinessBanner
            state={validation.ready ? 'ready' : 'blocked'}
            icon={validation.ready ? <ShieldCheck /> : <AlertTriangle />}
            status={
              <Status kind={validation.ready ? 'success' : 'danger'}>
                {t(
                  validation.ready
                    ? 'epfo.transfer.ready'
                    : 'epfo.transfer.blocked',
                )}
              </Status>
            }
            title={t(
              validation.ready
                ? 'epfo.transfer.readyTitle'
                : 'epfo.transfer.blockedTitle',
            )}
            description={t('epfo.transfer.notGuarantee')}
          />
          <RuleList>
            <RuleGroup title={t('epfo.transfer.checks')}>
              {validation.results.map((rule) => (
                <RuleRow
                  key={rule.code}
                  passed={rule.passed}
                  icon={rule.passed ? <Check /> : <AlertTriangle />}
                  status={
                    <Status kind={rule.passed ? 'success' : 'danger'}>
                      {t(
                        rule.passed
                          ? 'epfo.claim.passed'
                          : 'epfo.claim.blocking',
                      )}
                    </Status>
                  }
                >
                  <strong>{t(rule.messageKey)}</strong>
                  <SourceMarker>{rule.sourceRefs.join(' + ')}</SourceMarker>
                </RuleRow>
              ))}
            </RuleGroup>
          </RuleList>
          <StickyActions>
            <Button
              variant="secondary"
              onClick={() => setStep('employments')}
            >
              {t('common.back')}
            </Button>
            {validation.ready ? (
              <Button onClick={() => setStep('review')}>
                {t('epfo.transfer.review')}
                <ArrowRight />
              </Button>
            ) : (
              <ButtonLink
                to={
                  validation.results.find((rule) => !rule.passed)?.fixTarget ??
                  '/epfo/employment'
                }
              >
                {t('epfo.transfer.fix')}
                <ArrowRight />
              </ButtonLink>
            )}
          </StickyActions>
        </section>
      )}
      {step === 'review' && source && destination && (
        <section>
          <h2>{t('epfo.transfer.reviewTitle')}</h2>
          <div className="my-5.5 grid grid-cols-[1fr_46px_1fr] items-center gap-3 max-[599px]:grid-cols-1">
            <article className="grid min-h-32.5 content-center gap-1.75 rounded-[var(--radius-sheet)] border border-border bg-surface p-4.25">
              <span className="text-ink-muted">{t('epfo.transfer.from')}</span>
              <strong>{source.employer}</strong>
              <small className="text-ink-muted">{source.memberId}</small>
            </article>
            <MoveRight className="justify-self-center text-primary max-[599px]:rotate-90" />
            <article className="grid min-h-32.5 content-center gap-1.75 rounded-[var(--radius-sheet)] border border-border bg-surface p-4.25">
              <span className="text-ink-muted">{t('epfo.transfer.to')}</span>
              <strong>{destination.employer}</strong>
              <small className="text-ink-muted">{destination.memberId}</small>
            </article>
          </div>
          <AmountContext
            label={t('epfo.transfer.transferable')}
            amount={formatMoney(source.balance, i18n.language)}
            meta={t('epfo.transfer.estimate')}
          />
          <DeclarationCheck
            checked={declared}
            onChange={setDeclared}
          >
            {t('epfo.transfer.declaration')}
          </DeclarationCheck>
          <FieldLabel
            htmlFor="transfer-otp"
            hint={t('epfo.otpHint')}
          >
            {t('epfo.otp')}
          </FieldLabel>
          <OtpInput
            id="transfer-otp"
            value={otp}
            onChange={setOtp}
          />
          {error && <ValidationAlert>{error}</ValidationAlert>}
          <StickyActions>
            <Button
              variant="secondary"
              onClick={() => setStep('validation')}
            >
              {t('common.back')}
            </Button>
            <Button
              disabled={busy}
              onClick={() => void submit()}
            >
              {t('epfo.transfer.submit')}
              <ArrowRight />
            </Button>
          </StickyActions>
        </section>
      )}
      {step === 'submitting' && (
        <ProgressState
          title={t('epfo.transfer.submitting')}
          description={t('epfo.transfer.submittingHelp')}
        />
      )}
    </Page>
  );
}

function TransferStatus({ transfer }: { transfer: PFTransfer }) {
  const { t, i18n } = useTranslation();
  return (
    <Page
      width="narrow"
      mode="completion"
    >
      <PageHeader
        eyebrow={t('epfo.transfer.statusEyebrow')}
        title={t('epfo.transfer.received')}
        subtitle={t('epfo.transfer.receivedHelp')}
        back="/epfo"
      />
      <OutcomeMark
        variant="pending"
        icon={<Clock3 />}
      />
      <ReferenceBand
        label={t('epfo.transfer.reference')}
        reference={transfer.reference}
        meta={t('epfo.transfer.submitted', {
          date: formatDate(transfer.submittedAt, i18n.language),
        })}
      />
      <StatusCard
        status={
          <Status kind="info">{t('epfo.transfer.statusEmployer')}</Status>
        }
        title={t('epfo.transfer.statusEmployerTitle')}
      >
        {t('epfo.transfer.statusEmployerHelp')}
      </StatusCard>
      <StatusTimeline>
        <StatusTimelineItem
          state="complete"
          icon={<Check />}
          title={t('epfo.transfer.received')}
          meta={formatDate(transfer.submittedAt, i18n.language)}
        />
        <StatusTimelineItem
          state="current"
          icon={<Clock3 />}
          title={t('epfo.transfer.employerReview')}
          meta={t('epfo.transfer.expectedEmployer')}
        />
        <StatusTimelineItem
          icon={<CircleDot />}
          title={t('epfo.transfer.epfoProcessing')}
          meta={t('epfo.transfer.notStarted')}
        />
        <StatusTimelineItem
          icon={<CircleDot />}
          title={t('epfo.transfer.complete')}
          meta={t('epfo.transfer.notStarted')}
        />
      </StatusTimeline>
      <ButtonLink
        wide
        to="/activity"
      >
        {t('epfo.transfer.track')}
        <ArrowRight />
      </ButtonLink>
    </Page>
  );
}
