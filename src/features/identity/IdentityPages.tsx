import { useMemo, useState, type CSSProperties, type ReactNode } from 'react';
import {
  ArrowRight,
  Check,
  CheckCircle2,
  CircleDot,
  FileCheck2,
  Fingerprint,
  Landmark,
  LoaderCircle,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import { useAppStore } from '../../app/store';
import { cn } from '../../components/cn';
import {
  ArrowLink,
  Button,
  ButtonLink,
  Page,
  PageHeader,
  SourceMarker,
  Status,
} from '../../components/ui';
import { ChoiceGroup, ChoiceCard } from '../../components/forms';
import {
  IssueExplanation,
  Notice,
  OutcomeMark,
  ProgressState,
  StepProgress,
  StickyActions,
} from '../../components/patterns';
import { formatDate } from '../../components/formatters';
import { identityHealth } from '../../rules/identity';
import type { IdentityField, IdentitySource } from '../../types/domain';

const sources: IdentitySource[] = [
  'AADHAAR',
  'PAN',
  'BANK',
  'EPFO',
  'INCOME_TAX',
];
const fields: IdentityField[] = ['name', 'mobile', 'bankAccount'];
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
};

export function IdentityPage() {
  const { t, i18n } = useTranslation();
  const persona = useAppStore((state) => state.persona);
  if (!persona) return null;
  const openMismatch = persona.mismatches.find(
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
        <Status kind={openMismatch ? 'danger' : 'success'}>
          {openMismatch ? t('identity.attention') : t('identity.consistent')}
        </Status>
      </section>
      <div
        className="overflow-x-auto rounded-[var(--radius-sheet)] border border-border bg-surface max-[599px]:hidden"
        role="region"
        aria-label={t('identity.comparisonRegion')}
        tabIndex={0}
      >
        <table className="w-full border-collapse [min-width:780px]">
          <caption className="absolute -m-px h-px w-px overflow-hidden border-0 p-0 whitespace-nowrap [clip:rect(0,_0,_0,_0)]">
            {t('identity.tableCaption')}
          </caption>
          <thead>
            <tr>
              <th className="border-b border-border bg-surface-muted px-3.5 py-4.5 text-left align-top text-[0.78rem]">
                {t('identity.field')}
              </th>
              {sources.map((source) => (
                <th
                  key={source}
                  className="border-b border-border bg-surface-muted px-3.5 py-4.5 text-left align-top text-[0.78rem]"
                >
                  <SourceMarker>{t(sourceNameKeys[source])}</SourceMarker>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {fields.map((field) => {
              const mismatch = persona.mismatches.find(
                (item) => item.field === field && item.status !== 'RESOLVED',
              );
              return (
                <tr
                  key={field}
                  className={cn(mismatch && 'bg-[#fff7ef]')}
                >
                  <th className="w-37.5 border-b border-border px-3.5 py-4.5 text-left align-top">
                    {t(fieldNameKeys[field])}
                    {mismatch && (
                      <div className="mt-1">
                        <Status kind="danger">{t('identity.attention')}</Status>
                      </div>
                    )}
                  </th>
                  {sources.map((source) => {
                    const fieldValue =
                      persona.identity.valuesBySource[source][field];
                    return (
                      <td
                        key={source}
                        className={cn(
                          'border-b border-border px-3.5 py-4.5 text-left align-top',
                          mismatch && 'font-[650] text-danger',
                        )}
                      >
                        {fieldValue ? (
                          field === 'name' ? (
                            fieldValue
                          ) : (
                            <span
                              aria-label={t('common.maskedAccessible', {
                                label: t(fieldNameKeys[field]),
                                digits: fieldValue.slice(-4),
                              })}
                            >
                              {fieldValue}
                            </span>
                          )
                        ) : (
                          <span aria-label={t('identity.notAvailable')}>—</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="hidden max-[599px]:grid max-[599px]:gap-3">
        {fields.map((field) => {
          const mismatch = persona.mismatches.find(
            (item) => item.field === field && item.status !== 'RESOLVED',
          );
          return (
            <ComparisonCard
              key={field}
              mismatch={Boolean(mismatch)}
              title={t(fieldNameKeys[field])}
              status={
                <Status kind={mismatch ? 'danger' : 'success'}>
                  {mismatch
                    ? t('identity.attention')
                    : t('identity.consistent')}
                </Status>
              }
              action={
                mismatch && (
                  <ArrowLink
                    className="mt-4"
                    to={`/identity/mismatch/${mismatch.id}`}
                  >
                    {t('common.review')}
                  </ArrowLink>
                )
              }
            >
              {sources.map((source) => {
                const fieldValue =
                  persona.identity.valuesBySource[source][field];
                if (!fieldValue) return null;
                return (
                  <ComparisonRow
                    key={source}
                    source={
                      <SourceMarker>{t(sourceNameKeys[source])}</SourceMarker>
                    }
                    value={
                      field === 'name' ? (
                        fieldValue
                      ) : (
                        <span
                          aria-label={t('common.maskedAccessible', {
                            label: t(fieldNameKeys[field]),
                            digits: fieldValue.slice(-4),
                          })}
                        >
                          {fieldValue}
                        </span>
                      )
                    }
                  />
                );
              })}
            </ComparisonCard>
          );
        })}
      </div>
      {openMismatch ? (
        <Link
          className="mt-6.5 grid grid-cols-[160px_1fr_auto] items-center gap-4.5 border-b border-danger py-5.5 px-1 no-underline max-[599px]:grid-cols-1 max-[599px]:gap-2.25"
          to={`/identity/mismatch/${openMismatch.id}`}
        >
          <span className="flex items-center gap-2 text-danger">
            <CircleDot />
            <b>{t('identity.nameMismatch')}</b>
          </span>
          <p className="m-0 text-ink-muted">{t('identity.mismatchWarning')}</p>
          <span className="inline-flex items-center gap-2 font-bold whitespace-nowrap text-primary">
            {t('common.review')}
            <ArrowRight size={18} />
          </span>
        </Link>
      ) : (
        <Notice
          tone="success"
          icon={<CheckCircle2 />}
          title={t('identity.success')}
          actions={
            <ButtonLink
              variant="secondary"
              to="/epfo/claim"
            >
              {t('identity.viewPf')}
              <ArrowRight />
            </ButtonLink>
          }
        >
          <p className="m-0">{t('identity.successBody')}</p>
          {persona.identityChanges[0] && (
            <small className="text-ink-muted">
              {t('common.lastUpdated')}{' '}
              {formatDate(persona.identityChanges[0].changedAt, i18n.language)}
            </small>
          )}
        </Notice>
      )}
    </Page>
  );
}

function ComparisonCard({
  mismatch,
  title,
  status,
  children,
  action,
}: {
  mismatch: boolean;
  title: ReactNode;
  status: ReactNode;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <section
      className={cn(
        'rounded-[var(--radius-sheet)] border-t border-r border-b border-border bg-surface p-4',
        mismatch
          ? 'border-l-4 border-l-danger bg-[#fff8f1]'
          : 'border-l border-l-border',
      )}
    >
      <div className="mb-3 flex items-center justify-between">
        <h2 className="m-0 text-[1.1rem]">{title}</h2>
        {status}
      </div>
      {children}
      {action}
    </section>
  );
}

function ComparisonRow({
  source,
  value,
}: {
  source: ReactNode;
  value: ReactNode;
}) {
  return (
    <div className="flex justify-between gap-3 border-b border-border py-2.25">
      {source}
      <span>{value}</span>
    </div>
  );
}

type Step = 'choose' | 'review' | 'progress' | 'result';

export function MismatchPage() {
  const { mismatchId = '' } = useParams();
  const { t, i18n } = useTranslation();
  const { persona, busy, resolveMismatch } = useAppStore();
  const mismatch = persona?.mismatches.find((item) => item.id === mismatchId);
  const change = persona?.identityChanges.find(
    (item) => item.field === mismatch?.field,
  );
  const [step, setStep] = useState<Step>(
    mismatch?.status === 'RESOLVED' ? 'result' : 'choose',
  );
  const choices = useMemo(
    () =>
      mismatch
        ? [...new Set(Object.values(mismatch.valuesBySource).filter(Boolean))]
        : [],
    [mismatch],
  );
  const [value, setValue] = useState(
    choices[0] ?? persona?.identity.canonical.name ?? '',
  );
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

  async function propagate() {
    setStep('progress');
    try {
      await resolveMismatch(mismatchId, value);
      setStep('result');
    } catch {
      setStep('review');
    }
  }

  const stepNumber =
    step === 'choose' ? 1 : step === 'review' ? 2 : step === 'progress' ? 3 : 4;
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
            : t('identity.mismatchTitle')
        }
        subtitle={
          step === 'result'
            ? t('identity.successBody')
            : t('identity.mismatchSubtitle')
        }
        back="/identity"
      />
      <StepProgress
        current={stepNumber}
        total={4}
      />
      {step === 'choose' && (
        <section>
          <IssueExplanation
            status={<Status kind="danger">{t('identity.blocking')}</Status>}
            title={t('identity.fourVersionsTitle')}
          >
            {t('identity.fourVersionsBody')}
          </IssueExplanation>
          <ChoiceGroup legend={t('identity.canonical')}>
            {choices.map((choice) => (
              <ChoiceCard
                key={choice}
                selected={value === choice}
              >
                <input
                  type="radio"
                  name="canonical"
                  value={choice}
                  checked={value === choice}
                  onChange={(e) => setValue(e.target.value)}
                />
                <span>
                  <strong>{choice}</strong>
                  <small>
                    {t('identity.recordFrom', {
                      source: t(
                        sourceNameKeys[
                          (Object.entries(mismatch.valuesBySource).find(
                            ([, v]) => v === choice,
                          )?.[0] ?? 'AADHAAR') as IdentitySource
                        ],
                      ),
                    })}
                  </small>
                </span>
                <Check />
              </ChoiceCard>
            ))}
          </ChoiceGroup>
          <StickyActions status={t('common.saved')}>
            <Button onClick={() => setStep('review')}>
              {t('identity.reviewDestinations')}
              <ArrowRight />
            </Button>
          </StickyActions>
        </section>
      )}
      {step === 'review' && (
        <section>
          <div className="mb-7.5 grid grid-cols-[1fr_auto_auto] items-center gap-4 border-y border-border py-3.5 max-[599px]:grid-cols-[1fr_auto]">
            <span className="text-ink-muted">
              {t('identity.canonicalName')}
            </span>
            <strong className="text-[1.25rem]">{value}</strong>
            <Button
              variant="text"
              className="max-[599px]:col-span-full max-[599px]:justify-self-start"
              onClick={() => setStep('choose')}
            >
              {t('identity.change')}
            </Button>
          </div>
          <h2>{t('identity.propagation')}</h2>
          <DestinationList>
            {sources.map((source, index) => (
              <DestinationRow
                key={source}
                index={`0${index + 1}`}
                title={t(sourceNameKeys[source])}
                detail={t('identity.replaceValue', {
                  from: mismatch.valuesBySource[source],
                  to: value,
                })}
                status={<Status kind="info">{t('identity.willUpdate')}</Status>}
              />
            ))}
          </DestinationList>
          <Notice
            variant="inline"
            tone="info"
            icon={<FileCheck2 />}
          >
            {t('identity.receiptNotice')}
          </Notice>
          <StickyActions>
            <Button
              variant="secondary"
              onClick={() => setStep('choose')}
            >
              {t('common.back')}
            </Button>
            <Button
              disabled={busy}
              onClick={() => void propagate()}
            >
              {t('identity.confirm')}
              <ArrowRight />
            </Button>
          </StickyActions>
        </section>
      )}
      {step === 'progress' && (
        <ProgressState
          title={t('identity.updatingTitle')}
          description={t('identity.updatingDescription')}
        >
          <DestinationList animating>
            {sources.map((source, index) => (
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
                  value: change?.toValue ?? value,
                },
                {
                  label: t('identity.completedLabel'),
                  value: change
                    ? formatDate(change.changedAt, i18n.language)
                    : t('identity.savedFallback'),
                },
              ]}
            />
            {sources.map((source) => (
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
