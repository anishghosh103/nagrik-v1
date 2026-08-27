import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import {
  ArrowRight,
  Banknote,
  BriefcaseBusiness,
  Check,
  Clock3,
  Fingerprint,
  History,
  Landmark,
  ShieldCheck,
  UserRound,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link, useSearchParams } from 'react-router-dom';
import { useAppStore } from '../../app/store';
import { formatDate, formatMoney } from '../../components/formatters';
import {
  Button,
  Page,
  PageHeader,
  SourceMarker,
  Status,
} from '../../components/ui';

export function EPFOProfilePage() {
  const { t } = useTranslation();
  const persona = useAppStore((state) => state.persona);
  if (!persona) return null;
  return (
    <Page>
      <PageHeader
        eyebrow={t('epfo.profile.eyebrow')}
        title={t('epfo.profile.title')}
        subtitle={t('epfo.profile.subtitle')}
        back="/epfo"
      />
      <section className="grid grid-cols-[62px_1fr_auto] items-center gap-4.5 border-y border-border py-6 max-[599px]:grid-cols-[50px_1fr]">
        <div className="grid size-14.5 place-items-center rounded-full bg-primary text-white">
          <UserRound />
        </div>
        <div className="grid gap-1 [&>span]:text-ink-muted">
          <span>{t('epfo.profile.uan')}</span>
          <strong
            className="text-[1.35rem] tracking-[0.03em]"
            aria-label={t('epfo.profile.uanAccessible', {
              digits: persona.epfo.maskedUan.slice(-4),
            })}
          >
            {persona.epfo.maskedUan}
          </strong>
          <SourceMarker>{t('epfo.profile.source')}</SourceMarker>
        </div>
        <div className="max-[599px]:col-start-2 max-[599px]:justify-self-start">
          <Status kind="success">{t('epfo.profile.connected')}</Status>
        </div>
      </section>
      <RecordCardGrid>
        <RecordCard
          to="/epfo/kyc"
          icon={<ShieldCheck />}
          title={t('epfo.profile.kyc')}
          detail={t('epfo.profile.kycHelp', {
            count: persona.epfo.kyc.filter(
              (record) => record.status === 'VALIDATED',
            ).length,
          })}
        />
        <RecordCard
          to="/epfo/employment"
          icon={<BriefcaseBusiness />}
          title={t('epfo.profile.employment')}
          detail={t('epfo.profile.employmentHelp', {
            count: persona.epfo.employment.length,
          })}
        />
        <RecordCard
          to="/epfo/history"
          icon={<History />}
          title={t('epfo.profile.history')}
          detail={t('epfo.profile.historyHelp')}
        />
      </RecordCardGrid>
      <section className="grid grid-cols-[44px_1fr_auto] items-center gap-3.5 border-y border-border py-5">
        <span className="text-primary">
          <Banknote />
        </span>
        <div className="grid gap-1 [&>span]:text-ink-muted">
          <span>{t('epfo.bank')}</span>
          <strong
            aria-label={t('epfo.profile.bankAccessible', {
              digits: persona.epfo.bankAccount.slice(-4),
            })}
          >
            {persona.epfo.bankAccount}
          </strong>
          <SourceMarker>{t('epfo.profile.bankSource')}</SourceMarker>
        </div>
        <Status kind="success">{t('epfo.profile.validated')}</Status>
      </section>
    </Page>
  );
}

function RecordCardGrid({ children }: { children: ReactNode }) {
  return (
    <div className="my-7 grid grid-cols-3 gap-3 max-[599px]:grid-cols-1">
      {children}
    </div>
  );
}

function RecordCard({
  to,
  icon,
  title,
  detail,
}: {
  to: string;
  icon: ReactNode;
  title: ReactNode;
  detail: ReactNode;
}) {
  return (
    <Link
      to={to}
      className="grid min-h-40 grid-cols-[1fr_auto] content-between gap-5 rounded-[var(--radius-sheet)] border border-border bg-surface p-5 text-inherit no-underline max-[599px]:min-h-26.25 [&>svg:first-child]:size-7.5 [&>svg:first-child]:text-primary [&>svg:last-child]:col-start-2 [&>svg:last-child]:row-span-2 [&>svg:last-child]:self-center"
    >
      {icon}
      <span className="grid gap-1.25">
        <strong>{title}</strong>
        <small className="text-ink-muted">{detail}</small>
      </span>
      <ArrowRight />
    </Link>
  );
}

export function KYCPage() {
  const { t, i18n } = useTranslation();
  const persona = useAppStore((state) => state.persona);
  if (!persona) return null;
  const icons = { AADHAAR: Fingerprint, PAN: Landmark, BANK: Banknote };
  return (
    <Page width="narrow">
      <PageHeader
        eyebrow={t('epfo.kyc.eyebrow')}
        title={t('epfo.kyc.title')}
        subtitle={t('epfo.kyc.subtitle')}
        back="/epfo/profile"
      />
      <LedgerList>
        {persona.epfo.kyc.map((record) => {
          const Icon = icons[record.kind];
          return (
            <LedgerRow
              key={record.kind}
              icon={<Icon />}
              title={t(`epfo.kyc.${record.kind.toLowerCase()}`)}
              value={record.maskedValue}
              meta={
                <SourceMarker>
                  {t('epfo.kyc.updated', {
                    date: formatDate(record.updatedAt, i18n.language),
                  })}
                </SourceMarker>
              }
              status={
                <Status
                  kind={record.status === 'VALIDATED' ? 'success' : 'warning'}
                >
                  {t(
                    record.status === 'VALIDATED'
                      ? 'epfo.profile.validated'
                      : 'epfo.kyc.attention',
                  )}
                </Status>
              }
            />
          );
        })}
      </LedgerList>
      <aside className="flex items-start gap-2.5 rounded-lg bg-surface-muted p-3.5 text-[0.85rem] text-ink-muted [&>svg]:shrink-0 [&>svg]:text-info">
        <ShieldCheck />
        <span>{t('epfo.kyc.prototype')}</span>
      </aside>
    </Page>
  );
}

function LedgerList({ children }: { children: ReactNode }) {
  return <div className="mb-7 border-t border-border">{children}</div>;
}

function LedgerRow({
  icon,
  title,
  value,
  meta,
  status,
}: {
  icon: ReactNode;
  title: ReactNode;
  value: ReactNode;
  meta: ReactNode;
  status: ReactNode;
}) {
  return (
    <article className="grid min-h-28 grid-cols-[46px_1fr_auto] items-center gap-3.75 border-b border-border max-[599px]:grid-cols-[38px_1fr]">
      <span className="grid size-10.5 place-items-center rounded-full bg-surface-muted text-primary [&>svg]:size-5.25">
        {icon}
      </span>
      <div className="grid gap-1">
        <h2 className="m-0 text-[1.12rem]">{title}</h2>
        <strong>{value}</strong>
        {meta}
      </div>
      <div className="max-[599px]:col-start-2">{status}</div>
    </article>
  );
}

export function EmploymentPage() {
  const { t, i18n } = useTranslation();
  const { persona, busy, updateEmploymentExit } = useAppStore();
  const [params] = useSearchParams();
  const requested = params.get('fix');
  const [editing, setEditing] = useState<string | null>(requested);
  const [date, setDate] = useState('2025-05-14');
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    if (requested) document.getElementById(`employment-${requested}`)?.focus();
  }, [requested]);
  if (!persona) return null;
  async function save(id: string) {
    await updateEmploymentExit(id, date);
    setEditing(null);
    setSaved(true);
  }
  return (
    <Page width="narrow">
      <PageHeader
        eyebrow={t('epfo.employment.eyebrow')}
        title={t('epfo.employment.title')}
        subtitle={t('epfo.employment.subtitle')}
        back="/epfo/profile"
      />
      {saved && (
        <div
          className="mb-5 flex items-center gap-2.25 border-l-4 border-success bg-[#f2f8f3] p-3.5 text-success"
          role="status"
        >
          <Check />
          {t('epfo.employment.saved')}
        </div>
      )}
      <ol className="m-0 list-none p-0">
        {persona.epfo.employment.map((record) => (
          <li
            key={record.id}
            id={`employment-${record.id}`}
            tabIndex={-1}
            className="relative grid grid-cols-[48px_1fr] gap-3.75 pb-7 after:absolute after:top-11.25 after:bottom-0 after:left-5.25 after:w-px after:bg-border last:after:hidden max-[599px]:grid-cols-[40px_1fr] max-[599px]:gap-2.25 max-[599px]:after:left-4.75"
          >
            <span className="z-1 grid size-11 place-items-center rounded-full border border-border bg-canvas text-primary max-[599px]:size-9.5">
              <BriefcaseBusiness />
            </span>
            <article className="rounded-[var(--radius-sheet)] border border-border bg-surface p-5 max-[599px]:p-3.75">
              <div className="mb-2 flex items-end justify-between max-[599px]:items-center">
                <div>
                  <h2 className="m-0">{record.employer}</h2>
                  <small className="text-ink-muted">{record.memberId}</small>
                </div>
                <Status kind={record.current ? 'info' : 'success'}>
                  {t(
                    record.current
                      ? 'epfo.employment.current'
                      : 'epfo.employment.previous',
                  )}
                </Status>
              </div>
              <dl className="my-4.5 grid grid-cols-3 border-y border-border max-[599px]:grid-cols-1">
                <div className="grid gap-1 py-3.25 pr-2.5">
                  <dt className="text-[0.78rem] text-ink-muted">
                    {t('epfo.employment.joined')}
                  </dt>
                  <dd className="m-0 font-bold">
                    {formatDate(record.joinedOn, i18n.language)}
                  </dd>
                </div>
                <div className="grid gap-1 py-3.25 pr-2.5">
                  <dt className="text-[0.78rem] text-ink-muted">
                    {t('epfo.employment.exited')}
                  </dt>
                  <dd className="m-0 font-bold">
                    {record.exitedOn
                      ? formatDate(record.exitedOn, i18n.language)
                      : t('epfo.employment.notRecorded')}
                  </dd>
                </div>
                <div className="grid gap-1 py-3.25 pr-2.5">
                  <dt className="text-[0.78rem] text-ink-muted">
                    {t('epfo.employment.balance')}
                  </dt>
                  <dd className="m-0 font-bold">
                    {formatMoney(record.balance, i18n.language)}
                  </dd>
                </div>
              </dl>
              {editing === record.id ? (
                <div className="mb-4 grid gap-2 bg-surface-muted p-4">
                  <label
                    htmlFor={`exit-${record.id}`}
                    className="font-bold"
                  >
                    {t('epfo.employment.correctExit')}
                  </label>
                  <input
                    id={`exit-${record.id}`}
                    type="date"
                    className="min-h-11.5 rounded-[7px] border border-border bg-surface px-2.5 py-2 text-ink [font:inherit]"
                    value={date}
                    max={
                      persona.epfo.employment.find((item) => item.current)
                        ?.joinedOn
                    }
                    onChange={(event) => setDate(event.target.value)}
                  />
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="secondary"
                      onClick={() => setEditing(null)}
                    >
                      {t('common.cancel')}
                    </Button>
                    <Button
                      disabled={busy || !date}
                      onClick={() => void save(record.id)}
                    >
                      {t('common.save')}
                    </Button>
                  </div>
                </div>
              ) : (
                !record.current && (
                  <Button
                    variant="text"
                    size="compact"
                    onClick={() => setEditing(record.id)}
                  >
                    {t('epfo.employment.correctDates')}
                  </Button>
                )
              )}
              <SourceMarker>{t('epfo.employment.source')}</SourceMarker>
            </article>
          </li>
        ))}
      </ol>
    </Page>
  );
}

export function ServiceHistoryPage() {
  const { t, i18n } = useTranslation();
  const persona = useAppStore((state) => state.persona);
  if (!persona) return null;
  return (
    <Page width="narrow">
      <PageHeader
        eyebrow={t('epfo.history.eyebrow')}
        title={t('epfo.history.title')}
        subtitle={t('epfo.history.subtitle')}
        back="/epfo/profile"
      />
      <HistoryList>
        {persona.epfo.claim && (
          <HistoryCard
            icon={<Clock3 />}
            status={<Status kind="info">{t('epfo.history.claim')}</Status>}
            title={t('epfo.received')}
            detail={
              <>
                {persona.epfo.claim.reference} ·{' '}
                {formatDate(persona.epfo.claim.submittedAt, i18n.language)}
              </>
            }
            action={
              <Link
                to="/epfo/claim/status"
                aria-label={t('epfo.track')}
              >
                <ArrowRight />
              </Link>
            }
          />
        )}
        {persona.epfo.transfer && (
          <HistoryCard
            icon={<Clock3 />}
            status={<Status kind="info">{t('epfo.history.transfer')}</Status>}
            title={t('epfo.transfer.statusEmployer')}
            detail={
              <>
                {persona.epfo.transfer.reference} ·{' '}
                {formatDate(persona.epfo.transfer.submittedAt, i18n.language)}
              </>
            }
            action={
              <Link
                to="/epfo/transfer/status"
                aria-label={t('epfo.transfer.track')}
              >
                <ArrowRight />
              </Link>
            }
          />
        )}
        {persona.epfo.claimHistory.map((claim) => (
          <HistoryCard
            key={claim.id}
            icon={<History />}
            status={
              <Status kind={claim.status === 'REJECTED' ? 'danger' : 'success'}>
                {t(`epfo.history.${claim.status.toLowerCase()}`)}
              </Status>
            }
            title={t(
              claim.status === 'REJECTED'
                ? 'epfo.history.priorRejected'
                : 'epfo.history.priorSettled',
            )}
            detail={
              <>
                {claim.reference} · {formatDate(claim.decidedAt, i18n.language)}
              </>
            }
            action={
              claim.status === 'REJECTED' ? (
                <Link
                  to="/epfo/claims/rejected"
                  aria-label={t('common.details')}
                >
                  <ArrowRight />
                </Link>
              ) : (
                <Check />
              )
            }
          />
        ))}
        <HistoryCard
          icon={<HistoryGlyph icon={<UserRound />} />}
          status={
            <Status
              kind={
                persona.epfo.nomination.status === 'EFFECTIVE'
                  ? 'success'
                  : 'warning'
              }
            >
              {t('epfo.history.nomination')}
            </Status>
          }
          title={t(
            `epfo.nomination.status.${persona.epfo.nomination.status.toLowerCase()}`,
          )}
          detail={t('epfo.history.nominationUpdated', {
            date: formatDate(persona.epfo.nomination.updatedAt, i18n.language),
          })}
          action={
            <Link
              to="/epfo/nomination"
              aria-label={t('common.details')}
            >
              <ArrowRight />
            </Link>
          }
        />
      </HistoryList>
    </Page>
  );
}

function HistoryList({ children }: { children: ReactNode }) {
  return <div className="border-t border-border">{children}</div>;
}

function HistoryCard({
  icon,
  status,
  title,
  detail,
  action,
}: {
  icon: ReactNode;
  status: ReactNode;
  title: ReactNode;
  detail: ReactNode;
  action: ReactNode;
}) {
  return (
    <article className="grid min-h-28 grid-cols-[44px_1fr_30px] items-center gap-3.5 border-b border-border [&>svg]:size-10 [&>svg]:text-primary">
      {icon}
      <div>
        {status}
        <h2 className="mt-2 mb-0.75 text-[1.1rem]">{title}</h2>
        <p className="m-0 text-ink-muted">{detail}</p>
      </div>
      <span className="text-primary">{action}</span>
    </article>
  );
}

function HistoryGlyph({ icon }: { icon: ReactNode }) {
  return (
    <span className="grid size-10 place-items-center text-primary [&>svg]:size-5.75">
      {icon}
    </span>
  );
}
