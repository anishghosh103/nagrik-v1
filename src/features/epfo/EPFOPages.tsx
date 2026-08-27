import { tw } from '../../styles/recipes';
import { useEffect, useRef, useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  BadgeIndianRupee,
  Banknote,
  Check,
  CheckCircle2,
  CircleDot,
  Clock3,
  FileWarning,
  LoaderCircle,
  ShieldCheck,
  X,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useAppStore } from '../../app/store';
import {
  Button,
  ButtonLink,
  PageHeader,
  SourceMarker,
  Status,
} from '../../components/ui';
import { formatDate, formatMoney } from '../../components/formatters';
import type { ClaimSubmission, ClaimValidation } from '../../types/domain';

export function EPFOPage() {
  const { t, i18n } = useTranslation();
  const persona = useAppStore((state) => state.persona);
  if (!persona) return null;
  return (
    <div className={tw('page')}>
      <PageHeader
        eyebrow={t('epfo.home.eyebrow')}
        title={t('epfo.home.title')}
        subtitle={t('epfo.home.subtitle')}
      />
      <Link
        className={tw('balance-band balance-link')}
        to="/epfo/passbook"
      >
        <div>
          <p>{t('epfo.home.balance')}</p>
          <strong>{formatMoney(persona.epfo.balance, i18n.language)}</strong>
          <small>
            {t('epfo.home.cached', {
              date: formatDate(persona.epfo.passbook.capturedAt, i18n.language),
            })}
          </small>
        </div>
        <BadgeIndianRupee />
      </Link>
      <div className={tw('task-list')}>
        <Link to="/epfo/claim">
          <span className={tw('task-number')}>01</span>
          <span>
            <strong>{t('epfo.home.withdraw')}</strong>
            <small>{t('epfo.home.withdrawHelp')}</small>
          </span>
          <ArrowRight />
        </Link>
        <Link to="/epfo/transfer">
          <span className={tw('task-number')}>02</span>
          <span>
            <strong>{t('epfo.home.transfer')}</strong>
            <small>{t('epfo.home.transferHelp')}</small>
          </span>
          <ArrowRight />
        </Link>
        <Link to="/epfo/passbook">
          <span className={tw('task-number')}>03</span>
          <span>
            <strong>{t('epfo.home.passbook')}</strong>
            <small>{t('epfo.home.passbookHelp')}</small>
          </span>
          <ArrowRight />
        </Link>
        <Link to="/epfo/nomination">
          <span className={tw('task-number')}>04</span>
          <span>
            <strong>{t('epfo.home.nomination')}</strong>
            <small>{t('epfo.home.nominationHelp')}</small>
          </span>
          <ArrowRight />
        </Link>
      </div>
      <section className={tw('kyc-strip')}>
        <div className={tw('section-title-row')}>
          <h2>{t('epfo.home.profile')}</h2>
          <Link to="/epfo/profile">
            {t('common.details')}
            <ArrowRight size={17} />
          </Link>
        </div>
        <div>
          {persona.epfo.kyc.map((record) => (
            <span key={record.kind}>
              <Check />
              {record.kind} KYC
            </span>
          ))}
        </div>
        <SourceMarker>
          <span
            aria-label={t('epfo.profile.uanAccessible', {
              digits: persona.epfo.maskedUan.slice(-4),
            })}
          >
            EPFO snapshot · {persona.epfo.maskedUan}
          </span>
        </SourceMarker>
      </section>
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
        if (active)
          setFormError('Checks are temporarily unavailable. Retry safely.');
      });
    return () => {
      active = false;
    };
  }, [step, validateClaim]);

  if (!persona) return null;
  const savedSubmission = submission ?? persona.epfo.claim;
  if (step === 'done' && savedSubmission)
    return <ClaimStatus submission={savedSubmission} />;
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
      setFormError(
        'Accept the declaration and enter the visible mock OTP 123456.',
      );
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
    <div className={tw('page narrow journey-page')}>
      <PageHeader
        eyebrow="PF & EPFO · Final settlement"
        title={t('epfo.title')}
        subtitle={t('epfo.subtitle')}
        back="/epfo"
      />
      <div className={tw('journey-progress')}>
        <span>Step {currentNumber} of 4</span>
        <div>
          <i className={tw('on')} />
          <i className={tw(currentNumber >= 2 && 'on')} />
          <i className={tw(currentNumber >= 3 && 'on')} />
          <i className={tw(currentNumber >= 4 && 'on')} />
        </div>
      </div>
      {step === 'type' && (
        <section>
          <h2>{t('epfo.claim.chooseType')}</h2>
          <p className={tw('section-intro')}>
            {t('epfo.claim.chooseTypeHelp')}
          </p>
          <fieldset className={tw('choice-list')}>
            <legend>{t('epfo.claim.supportedType')}</legend>
            <label className={tw('choice selected')}>
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
            </label>
            <div className={tw('unavailable-choice')}>
              <span>{t('epfo.claim.otherTypes')}</span>
              <small>{t('epfo.claim.otherTypesHelp')}</small>
            </div>
          </fieldset>
          <div className={tw('sticky-action')}>
            <span>{t('common.saved')}</span>
            <Button onClick={() => setStep('eligibility')}>
              {t('epfo.claim.checkEligibility')}
              <ArrowRight />
            </Button>
          </div>
        </section>
      )}
      {step === 'eligibility' && (
        <section className={tw('eligibility-card')}>
          <ShieldCheck />
          <div>
            <Status kind="info">{t('epfo.claim.eligibility')}</Status>
            <h2>{t('epfo.claim.eligibilityTitle')}</h2>
            <p>{t('epfo.claim.eligibilityHelp')}</p>
            <ul>
              <li>{t('epfo.claim.exitPresent')}</li>
              <li>{t('epfo.claim.kycChecked')}</li>
              <li>{t('epfo.claim.identityChecked')}</li>
            </ul>
          </div>
          <div className={tw('sticky-action')}>
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
          </div>
        </section>
      )}
      {step === 'checking' && (
        <section
          className={tw('checking-state')}
          aria-live="polite"
        >
          <div className={tw('scan-icon')}>
            <ShieldCheck />
            <span />
          </div>
          <h2>Checking seven claim rules</h2>
          <p>
            Identity, KYC, bank and service history are being checked together.
          </p>
          {formError && (
            <div className={tw('validation-error')}>
              {formError}
              <Button
                variant="secondary"
                onClick={() => setStep('checking')}
              >
                Retry
              </Button>
            </div>
          )}
          <div className={tw('skeleton-lines')}>
            <i />
            <i />
            <i />
          </div>
        </section>
      )}
      {step === 'checks' && validation && (
        <section>
          <div
            className={tw(
              'readiness-banner',
              validation.ready ? 'ready' : 'blocked',
            )}
          >
            {validation.ready ? <CheckCircle2 /> : <AlertTriangle />}
            <div>
              <Status kind={validation.ready ? 'success' : 'danger'}>
                {validation.ready
                  ? t('epfo.claim.allPassed')
                  : t('epfo.claim.oneFailed')}
              </Status>
              <h2>{validation.ready ? t('epfo.ready') : t('epfo.blocked')}</h2>
              <p>{t('epfo.notGuarantee')}</p>
            </div>
          </div>
          <RuleChecklist
            validation={validation}
            onIssue={() => setIssueOpen(true)}
          />
          {validation.ready ? (
            <div className={tw('sticky-action')}>
              <span>
                {t('epfo.claim.checked', {
                  date: formatDate(validation.checkedAt, i18n.language),
                })}
              </span>
              <Button onClick={() => setStep('details')}>
                {t('epfo.claim.enterDetails')}
                <ArrowRight />
              </Button>
            </div>
          ) : (
            <div className={tw('sticky-action')}>
              <Button
                variant="secondary"
                onClick={() => setIssueOpen(true)}
              >
                {t('common.details')}
              </Button>
              <ButtonLink
                to={
                  validation.results.find((r) => !r.passed)?.fixTarget ??
                  '/identity'
                }
              >
                {t('epfo.claim.fixMismatch')}
                <ArrowRight />
              </ButtonLink>
            </div>
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
          <div className={tw('amount-context')}>
            <span>{t('epfo.balance')}</span>
            <strong>{formatMoney(persona.epfo.balance, i18n.language)}</strong>
            <small>This is a cached estimate, not a settlement quote.</small>
          </div>
          <label
            className={tw('field-label')}
            htmlFor="claim-amount"
          >
            {t('epfo.claimAmount')}
          </label>
          <div className={tw('money-input')}>
            <span>₹</span>
            <input
              id="claim-amount"
              type="number"
              min="1000"
              max={persona.epfo.balance}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
            />
          </div>
          <div className={tw('bank-confirm')}>
            <Banknote />
            <div>
              <span>{t('epfo.bank')}</span>
              <strong>Account {persona.epfo.bankAccount}</strong>
              <SourceMarker>EPFO bank KYC</SourceMarker>
            </div>
            <Status kind="success">Validated</Status>
          </div>
          <div className={tw('sticky-action')}>
            <Button
              variant="secondary"
              onClick={() => setStep('checks')}
            >
              Back
            </Button>
            <Button
              disabled={amount < 1000 || amount > persona.epfo.balance}
              onClick={() => setStep('review')}
            >
              Review claim
              <ArrowRight />
            </Button>
          </div>
        </section>
      )}
      {step === 'review' && (
        <section>
          <h2>Review and mock verify</h2>
          <div className={tw('claim-review')}>
            <div>
              <span>Claim type</span>
              <strong>Final PF settlement</strong>
            </div>
            <div>
              <span>Amount requested</span>
              <strong>{formatMoney(amount, i18n.language)}</strong>
            </div>
            <div>
              <span>Bank account</span>
              <strong>{persona.epfo.bankAccount}</strong>
            </div>
            <div>
              <span>Readiness</span>
              <Status kind="success">7 checks passed</Status>
            </div>
          </div>
          <label className={tw('declaration')}>
            <input
              type="checkbox"
              checked={declared}
              onChange={(e) => setDeclared(e.target.checked)}
            />
            <span>{t('epfo.declaration')}</span>
          </label>
          <label
            className={tw('field-label')}
            htmlFor="claim-otp"
          >
            {t('epfo.otp')} <small>{t('epfo.otpHint')}</small>
          </label>
          <input
            id="claim-otp"
            className={tw('otp-input')}
            maxLength={6}
            inputMode="numeric"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
          />
          {formError && (
            <div
              className={tw('validation-error')}
              role="alert"
            >
              {formError}
            </div>
          )}
          <div className={tw('sticky-action')}>
            <Button
              variant="secondary"
              onClick={() => setStep('details')}
            >
              Back
            </Button>
            <Button
              disabled={busy}
              onClick={() => void sendClaim()}
            >
              {t('epfo.submit')}
              <ArrowRight />
            </Button>
          </div>
        </section>
      )}
      {step === 'submitting' && (
        <section className={tw('propagation-progress')}>
          <LoaderCircle className={tw('spinner')} />
          <h2>Sending your mock claim</h2>
          <p>
            Duplicate submission is prevented while this request is in progress.
          </p>
          <div className={tw('submission-stages')}>
            <span className={tw('done')}>
              <Check />
              Details sealed
            </span>
            <span className={tw('active')}>
              <LoaderCircle />
              Reference being created
            </span>
            <span>
              <CircleDot />
              Activity awaiting update
            </span>
          </div>
        </section>
      )}
    </div>
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
    <div className={tw('rule-groups')}>
      {failed.length > 0 && (
        <section>
          <h3>{t('epfo.failed')}</h3>
          {failed.map((rule) => (
            <button
              className={tw('rule-row failed rule-button')}
              key={rule.code}
              onClick={onIssue}
            >
              <span className={tw('rule-icon')}>
                <AlertTriangle />
              </span>
              <span className={tw('rule-copy')}>
                <strong>{t(rule.messageKey)}</strong>
                <SourceMarker>{rule.sourceRefs.join(' + ')}</SourceMarker>
                <small>{t('common.details')}</small>
              </span>
              <Status kind="danger">{t('epfo.claim.blocking')}</Status>
            </button>
          ))}
        </section>
      )}
      <section>
        <h3>{t('epfo.passed')}</h3>
        {passed.map((rule) => (
          <div
            className={tw('rule-row')}
            key={rule.code}
          >
            <span className={tw('rule-icon')}>
              <Check />
            </span>
            <div>
              <strong>{t(rule.messageKey)}</strong>
              <SourceMarker>{rule.sourceRefs.join(' + ')}</SourceMarker>
              <details>
                <summary>{t('epfo.claim.technicalDetail')}</summary>
                <code>{rule.code}</code>
              </details>
            </div>
            <Status kind="success">{t('epfo.claim.passed')}</Status>
          </div>
        ))}
      </section>
    </div>
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
  const closeRef = useRef<HTMLButtonElement>(null);
  const failed = validation.results.find((rule) => !rule.passed);
  useEffect(() => {
    closeRef.current?.focus();
  }, []);
  if (!failed) return null;
  return (
    <div
      className={tw('sheet-backdrop')}
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className={tw('detail-sheet')}
        role="dialog"
        aria-modal="true"
        aria-labelledby="claim-issue-title"
      >
        <button
          ref={closeRef}
          className={tw('icon-button sheet-close')}
          onClick={onClose}
          aria-label={t('common.close')}
        >
          <X />
        </button>
        <p className={tw('eyebrow')}>{t('epfo.claim.issueEyebrow')}</p>
        <h2 id="claim-issue-title">{t(failed.messageKey)}</h2>
        <p>{t('epfo.claim.issueConsequence')}</p>
        <SourceMarker>{failed.sourceRefs.join(' + ')}</SourceMarker>
        <details open>
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
      </section>
    </div>
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
      <div className={tw('page narrow')}>
        <PageHeader
          eyebrow={t('epfo.history.eyebrow')}
          title={t('epfo.history.none')}
          subtitle={t('epfo.history.noneHelp')}
          back="/epfo/history"
        />
      </div>
    );
  return (
    <div className={tw('page narrow')}>
      <PageHeader
        eyebrow={t('epfo.history.eyebrow')}
        title={t('epfo.history.rejected')}
        subtitle={t('epfo.history.rejectedHelp')}
        back="/epfo/history"
      />
      <section className={tw('rejection-panel')}>
        <FileWarning />
        <div>
          <Status kind="danger">{t('epfo.history.decision')}</Status>
          <h2>{t(claim.reasonKey ?? 'epfo.history.c15Reason')}</h2>
          <p>{t('epfo.history.c15Help')}</p>
        </div>
      </section>
      <div className={tw('claim-review')}>
        <div>
          <span>{t('epfo.reference')}</span>
          <strong>{claim.reference}</strong>
        </div>
        <div>
          <span>{t('epfo.history.decided')}</span>
          <strong>{formatDate(claim.decidedAt, i18n.language)}</strong>
        </div>
        <div>
          <span>{t('epfo.claimAmount')}</span>
          <strong>{formatMoney(claim.amount, i18n.language)}</strong>
        </div>
        <div>
          <span>{t('epfo.history.code')}</span>
          <strong>{claim.reasonCode}</strong>
        </div>
      </div>
      <ButtonLink to="/identity">
        {t('epfo.history.fix')}
        <ArrowRight />
      </ButtonLink>
    </div>
  );
}

function ClaimStatus({ submission }: { submission: ClaimSubmission }) {
  const { t, i18n } = useTranslation();
  return (
    <div className={tw('page narrow completion-page')}>
      <PageHeader
        eyebrow="PF & EPFO · Claim status"
        title={t('epfo.received')}
        subtitle={t('epfo.expected')}
        back="/epfo"
      />
      <div className={tw('outcome-mark')}>
        <Check />
      </div>
      <div className={tw('reference-band')}>
        <span>{t('epfo.reference')}</span>
        <strong>{submission.reference}</strong>
        <small>
          Submitted {formatDate(submission.submittedAt, i18n.language)}
        </small>
      </div>
      <section className={tw('status-now')}>
        <Status kind="info">Claim received</Status>
        <h2>EPFO validation is next</h2>
        <p>
          The prototype has recorded your claim once. No real EPFO system was
          contacted.
        </p>
      </section>
      <ol className={tw('status-timeline')}>
        <li className={tw('complete')}>
          <span>
            <Check />
          </span>
          <div>
            <strong>Claim received</strong>
            <small>{formatDate(submission.submittedAt, i18n.language)}</small>
          </div>
        </li>
        <li className={tw('current')}>
          <span>
            <Clock3 />
          </span>
          <div>
            <strong>Validation</strong>
            <small>Expected next · about 9 days</small>
          </div>
        </li>
        <li>
          <span>
            <CircleDot />
          </span>
          <div>
            <strong>Decision</strong>
            <small>Not started</small>
          </div>
        </li>
        <li>
          <span>
            <CircleDot />
          </span>
          <div>
            <strong>Payment</strong>
            <small>Not started</small>
          </div>
        </li>
      </ol>
      <ButtonLink
        wide
        to="/activity"
      >
        View in Unified Activity
        <ArrowRight />
      </ButtonLink>
    </div>
  );
}
