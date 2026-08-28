import {
  ArrowRight,
  Check,
  CheckCircle2,
  Fingerprint,
  Landmark,
  LoaderCircle,
  Pencil,
} from 'lucide-react';
import { useState, type CSSProperties, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useAppStore } from '../../app/store';
import { cn } from '../../components/cn';
import { formatDate } from '../../components/formatters';
import {
  DeclarationCheck,
  FieldLabel,
  OtpInput,
  ValidationAlert,
} from '../../components/forms';
import {
  IssueExplanation,
  Notice,
  OutcomeMark,
  ProgressState,
  StepProgress,
} from '../../components/patterns';
import {
  ArrowLink,
  Button,
  ButtonLink,
  Page,
  PageHeader,
  SourceMarker,
  Status,
} from '../../components/ui';
import {
  FIELD_AUTHORITY,
  IDENTITY_FIELDS,
  identityHealth,
} from '../../rules/identity';
import type {
  IdentityField,
  IdentitySource,
  PersonaSeed,
  UserDocumentSource,
} from '../../types/domain';

const documentSources: UserDocumentSource[] = ['AADHAAR', 'PAN', 'BANK'];
const connectedServices: IdentitySource[] = ['EPFO', 'INCOME_TAX'];
const sourceNameKeys: Record<IdentitySource, string> = {
  AADHAAR: 'identity.sourceAadhaar',
  PAN: 'identity.sourcePan',
  BANK: 'identity.sourceBank',
  EPFO: 'identity.sourceEpfo',
  INCOME_TAX: 'identity.sourceIncomeTax',
};
const fieldNameKeys: Record<IdentityField, string> = {
  name: 'identity.fieldName',
  mobile: 'identity.fieldMobile',
  bankAccount: 'identity.fieldBankAccount',
  dateOfBirth: 'identity.fieldDateOfBirth',
};
const documentTitleKeys: Record<UserDocumentSource, string> = {
  AADHAAR: 'identity.documentAadhaar',
  PAN: 'identity.documentPan',
  BANK: 'identity.documentBank',
};

type DocumentFieldKey =
  'maskedNumber' | 'name' | 'dateOfBirth' | 'mobile' | 'bankAccount' | 'ifsc';

interface DocumentFieldConfig {
  key: DocumentFieldKey;
  labelKey: string;
  type: 'text' | 'date' | 'tel';
}

const documentFieldConfigs: Record<UserDocumentSource, DocumentFieldConfig[]> =
  {
    AADHAAR: [
      {
        key: 'maskedNumber',
        labelKey: 'identity.aadhaarNumberLabel',
        type: 'text',
      },
      { key: 'name', labelKey: 'identity.fieldName', type: 'text' },
      {
        key: 'dateOfBirth',
        labelKey: 'identity.fieldDateOfBirth',
        type: 'date',
      },
      { key: 'mobile', labelKey: 'identity.fieldMobile', type: 'tel' },
    ],
    PAN: [
      {
        key: 'maskedNumber',
        labelKey: 'identity.panNumberLabel',
        type: 'text',
      },
    ],
    BANK: [
      {
        key: 'bankAccount',
        labelKey: 'identity.accountNumberLabel',
        type: 'text',
      },
      { key: 'ifsc', labelKey: 'identity.ifscLabel', type: 'text' },
    ],
  };

function getDocumentFieldValue(
  persona: PersonaSeed,
  source: UserDocumentSource,
  key: DocumentFieldKey,
): string {
  if (key === 'maskedNumber')
    return persona.identity.documents[source as 'AADHAAR' | 'PAN'].maskedNumber;
  if (key === 'ifsc') return persona.identity.documents.BANK.ifsc;
  return persona.identity.valuesBySource[source][key] ?? '';
}

function isServiceSynced(persona: PersonaSeed, source: IdentitySource) {
  return IDENTITY_FIELDS.every((field) => {
    const value = persona.identity.valuesBySource[source][field];
    return value === undefined || value === persona.identity.canonical[field];
  });
}

export function IdentityPage() {
  const { t, i18n } = useTranslation();
  const persona = useAppStore((state) => state.persona);
  if (!persona) return null;
  const openMismatches = persona.mismatches.filter(
    (item) => item.status !== 'RESOLVED',
  );
  const health = identityHealth(persona);
  return (
    <Page width="wide">
      <PageHeader
        eyebrow={t('identity.healthCheckEyebrow')}
        title={t('identity.title')}
        subtitle={t('identity.subtitle')}
      />
      <section className="mb-7 grid grid-cols-[140px_1fr_auto] items-center gap-6 border-y border-border py-5 max-[599px]:grid-cols-[1fr_auto]">
        <div>
          <div className="flex items-baseline gap-0.75">
            <strong className="text-[2.4rem] leading-none [font-variant-numeric:tabular-nums]">
              {health}
            </strong>
            <span className="text-ink-muted">/ 100</span>
          </div>
          <p className="mt-1.25 mb-0 text-ink-muted">{t('identity.score')}</p>
        </div>
        <div className="flex items-center gap-3 max-[599px]:col-span-full max-[599px]:order-3 max-[599px]:justify-center max-[599px]:border-t max-[599px]:border-border max-[599px]:pt-3.5">
          <span className="grid justify-items-center gap-1.25 text-[0.75rem] [&>svg]:text-primary">
            <Fingerprint />
            <b>{t('identity.aadhaarLed')}</b>
          </span>
          <span className="relative h-px min-w-15 bg-border after:absolute after:top-[-3px] after:right-[45%] after:size-1.75 after:rounded-full after:bg-accent" />
          <span className="grid justify-items-center gap-1.25 text-[0.75rem] [&>svg]:text-primary">
            <Landmark />
            <b>{t('identity.connectedRecords')}</b>
          </span>
        </div>
        <Status kind={openMismatches.length > 0 ? 'danger' : 'success'}>
          {openMismatches.length > 0
            ? t('identity.attention')
            : t('identity.consistent')}
        </Status>
      </section>
      <div className="grid items-start gap-7 min-[900px]:grid-cols-[1fr_340px]">
        <div>
          <h2 className="mt-0 mb-3.5 text-[0.78rem] tracking-[0.1em] text-ink-muted uppercase">
            {t('identity.documentsTitle')}
          </h2>
          <div className="grid gap-4">
            {documentSources.map((source) => (
              <DocumentCard
                key={source}
                source={source}
                persona={persona}
              />
            ))}
          </div>
          <h2 className="mt-7.5 mb-3.5 text-[0.78rem] tracking-[0.1em] text-ink-muted uppercase">
            {t('identity.connectedServices')}
          </h2>
          <div className="overflow-hidden rounded-[var(--radius-sheet)] border border-border bg-surface">
            {connectedServices.map((source) => {
              const synced = isServiceSynced(persona, source);
              const firstIssue = openMismatches.find(
                (item) => item.valuesBySource[source] !== undefined,
              );
              return (
                <a
                  key={source}
                  href={firstIssue ? `#alert-${firstIssue.field}` : undefined}
                  className={cn(
                    'flex items-center justify-between gap-3 border-b border-border px-4.5 py-3.5 no-underline last:border-b-0',
                    !firstIssue && 'pointer-events-none',
                  )}
                >
                  <SourceMarker>{t(sourceNameKeys[source])}</SourceMarker>
                  <Status kind={synced ? 'success' : 'danger'}>
                    {synced
                      ? t('identity.connectedServiceSynced')
                      : t('identity.connectedServiceNeedsSync')}
                  </Status>
                </a>
              );
            })}
          </div>
        </div>
        <div>
          <h2 className="mt-0 mb-3.5 text-[0.78rem] tracking-[0.1em] text-ink-muted uppercase">
            {t('identity.alertsTitle')}
          </h2>
          {openMismatches.length === 0 ? (
            <Notice
              tone="success"
              icon={<CheckCircle2 />}
              title={t('identity.success')}
            >
              <p className="m-0">{t('identity.successBody')}</p>
              {persona.identityChanges[0] && (
                <small className="text-ink-muted">
                  {t('common.lastUpdated')}{' '}
                  {formatDate(
                    persona.identityChanges[0].changedAt,
                    i18n.language,
                  )}
                </small>
              )}
            </Notice>
          ) : (
            <div className="grid gap-3">
              {openMismatches.map((mismatch) => {
                const authority = FIELD_AUTHORITY[mismatch.field];
                return (
                  <div
                    key={mismatch.id}
                    id={`alert-${mismatch.field}`}
                    className={cn(
                      'rounded-[var(--radius-sheet)] border border-border bg-surface p-4',
                      'border-l-4',
                      mismatch.severity === 'BLOCKING'
                        ? 'border-l-danger'
                        : 'border-l-warning',
                    )}
                  >
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <strong>{t(fieldNameKeys[mismatch.field])}</strong>
                      <Status
                        kind={
                          mismatch.severity === 'BLOCKING'
                            ? 'danger'
                            : 'warning'
                        }
                      >
                        {t('identity.attention')}
                      </Status>
                    </div>
                    <p className="mt-0 mb-3 text-[0.86rem] text-ink-muted">
                      {t('identity.authorityBody', {
                        source: t(sourceNameKeys[authority]),
                      })}
                    </p>
                    <ArrowLink to={`/identity/mismatch/${mismatch.id}`}>
                      {t('identity.verifyAndSync')}
                    </ArrowLink>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Page>
  );
}

function DocumentCard({
  source,
  persona,
}: {
  source: UserDocumentSource;
  persona: PersonaSeed;
}) {
  const { t } = useTranslation();
  const updateIdentityDocument = useAppStore(
    (state) => state.updateIdentityDocument,
  );
  const busy = useAppStore((state) => state.busy);
  const configs = documentFieldConfigs[source];
  const [phase, setPhase] = useState<'view' | 'details' | 'otp'>('view');
  const [draft, setDraft] = useState<Record<string, string>>({});
  const [declarationAccepted, setDeclarationAccepted] = useState(false);
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [saved, setSaved] = useState<{ synced: boolean } | null>(null);

  function startEditing() {
    const initial: Record<string, string> = {};
    for (const config of configs)
      initial[config.key] = getDocumentFieldValue(persona, source, config.key);
    setDraft(initial);
    setDeclarationAccepted(false);
    setOtp('');
    setError('');
    setSaved(null);
    setPhase('details');
  }

  function continueToOtp() {
    if (!declarationAccepted) {
      setError(t('identity.declarationRequired'));
      return;
    }
    setError('');
    setPhase('otp');
  }

  async function verifyAndSave() {
    if (otp !== '123456') {
      setError(t('epfo.claim.otpDeclarationError'));
      return;
    }
    const fields: Record<string, string> = {};
    for (const config of configs) {
      const value = draft[config.key];
      if (value !== getDocumentFieldValue(persona, source, config.key))
        fields[config.key] = value;
    }
    const synced = Object.keys(fields).some(
      (key) => FIELD_AUTHORITY[key as IdentityField] === source,
    );
    try {
      await updateIdentityDocument(source, fields, declarationAccepted, otp);
      setPhase('view');
      setSaved({ synced });
    } catch {
      setError(t('epfo.claim.otpDeclarationError'));
    }
  }

  return (
    <section className="rounded-[var(--radius-sheet)] border border-border bg-surface p-4.5">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="m-0 text-[1.05rem]">{t(documentTitleKeys[source])}</h3>
        {phase === 'view' && (
          <Button
            variant="text"
            size="compact"
            onClick={startEditing}
          >
            <Pencil size={16} />
            {t('identity.editDocument')}
          </Button>
        )}
      </div>
      {phase === 'details' && (
        <div>
          {configs.map((config) => (
            <div key={config.key}>
              <FieldLabel htmlFor={`${source}-${config.key}`}>
                {t(config.labelKey)}
              </FieldLabel>
              <input
                id={`${source}-${config.key}`}
                type={config.type}
                value={draft[config.key] ?? ''}
                onChange={(event) =>
                  setDraft((prev) => ({
                    ...prev,
                    [config.key]: event.target.value,
                  }))
                }
                className="h-11 w-full rounded-[9px] border border-border bg-surface px-3 py-2"
              />
            </div>
          ))}
          <div className="mt-4">
            <DeclarationCheck
              checked={declarationAccepted}
              onChange={setDeclarationAccepted}
            >
              {t('identity.editDeclaration', {
                document: t(documentTitleKeys[source]),
              })}
            </DeclarationCheck>
          </div>
          {error && <ValidationAlert>{error}</ValidationAlert>}
          <div className="mt-4 grid grid-cols-2 gap-3">
            <Button
              variant="secondary"
              onClick={() => setPhase('view')}
            >
              {t('identity.cancelEdit')}
            </Button>
            <Button onClick={continueToOtp}>
              {t('identity.continueToVerify')}
            </Button>
          </div>
        </div>
      )}
      {phase === 'otp' && (
        <div>
          <p className="mt-0 mb-4 text-[0.86rem] text-ink-muted">
            {t('identity.otpSentBody', {
              document: t(documentTitleKeys[source]),
            })}
          </p>
          <FieldLabel
            htmlFor={`${source}-otp`}
            hint={t('identity.otpHint')}
          >
            {t('identity.otp')}
          </FieldLabel>
          <OtpInput
            id={`${source}-otp`}
            value={otp}
            onChange={setOtp}
            autoFocus
          />
          {error && <ValidationAlert>{error}</ValidationAlert>}
          <div className="mt-4 grid grid-cols-2 gap-3">
            <Button
              variant="secondary"
              onClick={() => {
                setOtp('');
                setError('');
                setPhase('details');
              }}
            >
              {t('common.back')}
            </Button>
            <Button
              disabled={busy}
              onClick={() => void verifyAndSave()}
            >
              {t('identity.verifyAndSave')}
            </Button>
          </div>
        </div>
      )}
      {phase === 'view' && (
        <>
          <dl className="m-0 grid gap-2.5">
            {configs.map((config) => (
              <div
                key={config.key}
                className="flex items-center justify-between gap-3 border-b border-border pb-2.5 last:border-b-0 last:pb-0"
              >
                <dt className="text-ink-muted">{t(config.labelKey)}</dt>
                <dd className="m-0 font-[650]">
                  {getDocumentFieldValue(persona, source, config.key) || '—'}
                </dd>
              </div>
            ))}
          </dl>
          {saved && (
            <p className="mt-3 mb-0 text-[0.82rem] text-success">
              {t('identity.editSaved')}
              {saved.synced && <> · {t('identity.editAlsoSynced')}</>}
            </p>
          )}
        </>
      )}
    </section>
  );
}

type Step = 'review' | 'progress' | 'result';

export function MismatchPage() {
  const { mismatchId = '' } = useParams();
  const { t, i18n } = useTranslation();
  const { persona, busy, verifyAndSyncField } = useAppStore();
  const mismatch = persona?.mismatches.find((item) => item.id === mismatchId);
  const change = persona?.identityChanges.find(
    (item) => item.field === mismatch?.field,
  );
  const [step, setStep] = useState<Step>(
    mismatch?.status === 'RESOLVED' ? 'result' : 'review',
  );
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  if (!persona || !mismatch)
    return (
      <Page width="narrow">
        <PageHeader
          eyebrow={t('identity.noLongerOpenEyebrow')}
          title={t('identity.noLongerOpenTitle')}
          subtitle={t('identity.noLongerOpenSubtitle')}
          back="/identity"
        />
      </Page>
    );

  const authority = FIELD_AUTHORITY[mismatch.field];
  const canonicalValue =
    mismatch.field === 'bankAccount'
      ? persona.identity.documents.BANK.maskedAccountNumber
      : (persona.identity.valuesBySource[authority][mismatch.field] ?? '');

  async function verify() {
    if (otp !== '123456') {
      setError(t('epfo.claim.otpDeclarationError'));
      return;
    }
    setStep('progress');
    setError('');
    try {
      await verifyAndSyncField(mismatchId, otp);
      setStep('result');
    } catch {
      setStep('review');
      setError(t('epfo.claim.otpDeclarationError'));
    }
  }

  const stepNumber = step === 'review' ? 1 : step === 'progress' ? 2 : 3;
  return (
    <Page
      width="narrow"
      mode="journey"
    >
      <PageHeader
        eyebrow={t('identity.correctEyebrow')}
        title={
          step === 'result'
            ? t('identity.success')
            : t('identity.authorityTitle', {
                source: t(sourceNameKeys[authority]),
              })
        }
        subtitle={
          step === 'result'
            ? t('identity.successBody')
            : t('identity.authorityBody', {
                source: t(sourceNameKeys[authority]),
              })
        }
        back="/identity"
      />
      <StepProgress
        current={stepNumber}
        total={3}
      />
      {step === 'review' && (
        <section>
          <IssueExplanation
            tone={mismatch.severity === 'BLOCKING' ? 'danger' : 'warning'}
            status={
              <Status
                kind={mismatch.severity === 'BLOCKING' ? 'danger' : 'warning'}
              >
                {t('identity.blocking')}
              </Status>
            }
            title={t(fieldNameKeys[mismatch.field])}
          >
            {t('identity.authorityBody', {
              source: t(sourceNameKeys[authority]),
            })}
          </IssueExplanation>
          <h2>{t('identity.propagation')}</h2>
          <DestinationList>
            {connectedServices.map((source, index) => (
              <DestinationRow
                key={source}
                index={`0${index + 1}`}
                title={t(sourceNameKeys[source])}
                detail={t('identity.replaceValue', {
                  from: mismatch.valuesBySource[source] ?? '—',
                  to: canonicalValue,
                })}
                status={<Status kind="info">{t('identity.willUpdate')}</Status>}
              />
            ))}
          </DestinationList>
          {/* <Notice
            variant="inline"
            tone="info"
            icon={<FileCheck2 />}
          >
            {t('identity.receiptNotice')}
          </Notice> */}
          <FieldLabel
            htmlFor="verify-otp"
            hint={t('identity.otpHint')}
          >
            {t('identity.otp')}
          </FieldLabel>
          <OtpInput
            id="verify-otp"
            value={otp}
            onChange={setOtp}
          />
          {error && <ValidationAlert>{error}</ValidationAlert>}
          <Button
            disabled={busy}
            className="mt-4 w-full"
            onClick={() => void verify()}
          >
            {t('identity.confirm')}
            <ArrowRight />
          </Button>
        </section>
      )}
      {step === 'progress' && (
        <ProgressState
          title={t('identity.updatingTitle')}
          description={t('identity.updatingDescription')}
        >
          <DestinationList animating>
            {connectedServices.map((source, index) => (
              <DestinationRow
                key={source}
                style={{ animationDelay: `${index * 90}ms` }}
                animating
                icon={
                  <LoaderCircle
                    size={18}
                    className="animate-spin"
                  />
                }
                title={t(sourceNameKeys[source])}
                detail={t('identity.propagationInProgress')}
              />
            ))}
          </DestinationList>
        </ProgressState>
      )}
      {step === 'result' && (
        <section className="text-center">
          <OutcomeMark icon={<Check />} />
          <Status kind="success">{t('identity.recordsUpdated')}</Status>
          <ReceiptCard>
            <ReceiptHead
              label={t('identity.receipt')}
              value={change?.id ?? t('identity.savedChangeFallback')}
            />
            <ReceiptDetails
              rows={[
                {
                  label: t('identity.changedFrom'),
                  value: change?.fromValues.join(' · '),
                },
                {
                  label: t('identity.changedTo'),
                  value: change?.toValue ?? canonicalValue,
                },
                {
                  label: t('identity.completedLabel'),
                  value: change
                    ? formatDate(change.changedAt, i18n.language)
                    : t('identity.savedFallback'),
                },
              ]}
            />
            {connectedServices.map((source) => (
              <ReceiptRow
                key={source}
                label={<SourceMarker>{t(sourceNameKeys[source])}</SourceMarker>}
                status={
                  <Status kind="success">{t('identity.updatedStatus')}</Status>
                }
              />
            ))}
          </ReceiptCard>
          <ButtonLink
            wide
            to="/epfo/claim"
          >
            {t('identity.viewPf')}
            <ArrowRight />
          </ButtonLink>
          <ButtonLink
            variant="text"
            wide
            to="/activity"
          >
            {t('identity.viewChangeActivity')}
          </ButtonLink>
        </section>
      )}
    </Page>
  );
}

function DestinationList({
  animating,
  children,
}: {
  animating?: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        'mt-3 mb-5 border-t border-border',
        animating && 'text-left',
      )}
    >
      {children}
    </div>
  );
}

function DestinationRow({
  index,
  icon,
  title,
  detail,
  status,
  style,
  animating,
}: {
  index?: ReactNode;
  icon?: ReactNode;
  title: ReactNode;
  detail: ReactNode;
  status?: ReactNode;
  style?: CSSProperties;
  animating?: boolean;
}) {
  return (
    <div
      style={style}
      className={cn(
        'grid min-h-18 grid-cols-[44px_1fr_auto] items-center gap-3 border-b border-border max-[599px]:grid-cols-[34px_1fr] max-[599px]:py-2.5',
        animating && 'animate-[row-in_0.4s_ease_forwards] opacity-0',
      )}
    >
      {icon ?? (
        <span className="font-[750] text-primary [font-variant-numeric:tabular-nums]">
          {index}
        </span>
      )}
      <span className="grid">
        <strong>{title}</strong>
        <small className="text-ink-muted">{detail}</small>
      </span>
      {status && <div className="max-[599px]:col-start-2">{status}</div>}
    </div>
  );
}

function ReceiptCard({ children }: { children: ReactNode }) {
  return (
    <div className="my-6.5 overflow-hidden rounded-[var(--radius-sheet)] border border-border bg-surface text-left">
      {children}
    </div>
  );
}

function ReceiptHead({ label, value }: { label: ReactNode; value: ReactNode }) {
  return (
    <div className="flex justify-between border-b border-border bg-surface-muted px-4.5 py-3.75 max-[599px]:grid max-[599px]:gap-0.75">
      <span className="text-[0.75rem] tracking-[0.1em] uppercase">{label}</span>
      <strong className="text-[0.8rem] [font-variant-numeric:tabular-nums]">
        {value}
      </strong>
    </div>
  );
}

function ReceiptDetails({
  rows,
}: {
  rows: { label: ReactNode; value: ReactNode }[];
}) {
  return (
    <dl className="m-0 px-4.5 py-1">
      {rows.map((row, index) => (
        <div
          key={index}
          className="grid grid-cols-[1fr_1.5fr] gap-3.75 border-b border-border py-3.25 max-[599px]:grid-cols-1 max-[599px]:gap-0.75"
        >
          <dt className="text-ink-muted">{row.label}</dt>
          <dd className="m-0 text-right font-[650] max-[599px]:text-left">
            {row.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function ReceiptRow({
  label,
  status,
}: {
  label: ReactNode;
  status: ReactNode;
}) {
  return (
    <div className="flex justify-between border-b border-border px-4.5 py-2.5">
      {label}
      {status}
    </div>
  );
}
