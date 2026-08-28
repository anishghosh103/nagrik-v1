import type { ReactNode } from 'react';
import {
  Activity,
  ArrowRight,
  BadgeIndianRupee,
  CheckCircle2,
  Fingerprint,
  Flag,
  Landmark,
  ShieldAlert,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useAppStore } from '../../app/store';
import { cn } from '../../components/cn';
import {
  Eyebrow,
  Page,
  PageHeader,
  SectionHeading,
  SectionKicker,
  SourceMarker,
  Status,
} from '../../components/ui';
import { formatDate, formatMoney } from '../../components/formatters';
import { identityHealth } from '../../rules/identity';

export function HomePage({ actionsOnly = false }: { actionsOnly?: boolean }) {
  const { t, i18n } = useTranslation();
  const persona = useAppStore((state) => state.persona);
  if (!persona) return null;
  const health = identityHealth(persona);
  const action = persona.actions[0];
  const taxFiled = persona.tax?.filedReturns[0];
  const openTaxNotice = persona.tax?.draft?.notices.find(
    (notice) => notice.state !== 'RESOLVED',
  );
  const delayedRefund = persona.tax?.filedReturns.find(
    (filed) => filed.refund?.status === 'DELAYED',
  );
  if (actionsOnly)
    return (
      <Page width="narrow">
        <PageHeader
          eyebrow="Across your services"
          title={t('nav.actions')}
          subtitle="Outstanding work is derived from the records that need your attention."
        />
        {action ? (
          <ActionCard action={action} />
        ) : (
          <section className="border-y border-border py-12 text-center [&>svg]:mx-auto [&>svg]:size-10.5 [&>svg]:text-success">
            <CheckCircle2 />
            <h2>Nothing needs your attention</h2>
            <p>
              Your connected records and submitted requests have no outstanding
              demo action.
            </p>
          </section>
        )}
      </Page>
    );
  return (
    <Page mode="dashboard">
      <PageHeader
        eyebrow={`${t('home.eyebrow')}, ${persona.profile.firstName}`}
        title={t('home.title')}
        subtitle={t('home.subtitle')}
      />
      {action && (
        <section aria-labelledby="priority-title">
          <SectionKicker icon={<Flag size={16} />}>
            {t('home.priority')}
          </SectionKicker>
          <ActionCard action={action} />
        </section>
      )}
      <div className="mt-2 mb-10.5 grid grid-cols-[0.9fr_1.1fr] border-y border-border max-[599px]:block max-[599px]:border-0">
        <Link
          to="/identity"
          className="grid grid-cols-[112px_1fr_auto] items-center gap-4.5 border-r border-border py-7 pr-6 no-underline max-[599px]:mb-3.5 max-[599px]:grid-cols-[92px_1fr_auto] max-[599px]:rounded-[var(--radius-sheet)] max-[599px]:border max-[599px]:bg-surface max-[599px]:px-3.5 max-[599px]:py-4.5 [&>svg]:text-primary"
        >
          <ScoreRing score={health} />
          <div>
            <Eyebrow>{t('home.identity')}</Eyebrow>
            <h2 className="my-1 text-[1.2rem]">
              {health === 100 ? t('home.healthy') : t('home.issue')}
            </h2>
            <p className="m-0 text-ink-muted">5 {t('home.connected')}</p>
          </div>
          <ArrowRight />
        </Link>
        <section className="pl-6 max-[599px]:border max-[599px]:border-border max-[599px]:bg-surface max-[599px]:px-3.5 max-[599px]:pl-3.5">
          <ServiceRow
            icon={<Landmark />}
            tone="tax"
            label="Income Tax"
            title={
              openTaxNotice
                ? `Section ${openTaxNotice.section} notice needs a response`
                : delayedRefund
                  ? 'Refund bank check needed'
                  : taxFiled
                    ? taxFiled.verification.status === 'VERIFIED'
                      ? 'Filed and verified'
                      : 'Filed — verification needed'
                    : persona.tax?.draft
                      ? 'Continue your return'
                      : 'Start your return'
            }
            meta={
              taxFiled ? (
                <p className="m-0 text-ink-muted [font-variant-numeric:tabular-nums]">
                  {formatMoney(
                    taxFiled.computation.refund > 0
                      ? taxFiled.computation.refund
                      : taxFiled.computation.taxPayable,
                    i18n.language,
                  )}
                </p>
              ) : (
                <SourceMarker>Income Tax profile</SourceMarker>
              )
            }
            status={
              <Status
                kind={
                  openTaxNotice || delayedRefund
                    ? 'warning'
                    : taxFiled
                      ? taxFiled.verification.status === 'VERIFIED'
                        ? 'success'
                        : 'warning'
                      : 'info'
                }
              >
                {openTaxNotice
                  ? 'Action needed'
                  : delayedRefund
                    ? 'Delayed'
                    : taxFiled
                      ? taxFiled.verification.status === 'VERIFIED'
                        ? 'Verified'
                        : 'Pending'
                      : persona.tax?.draft
                        ? 'In progress'
                        : 'Ready'}
              </Status>
            }
          />
          <ServiceRow
            icon={<BadgeIndianRupee />}
            tone="pf"
            label="EPFO"
            title={
              persona.epfo.claim
                ? 'Claim received'
                : health === 100
                  ? 'Claim checks ready'
                  : 'Claim is blocked'
            }
            meta={
              <p className="m-0 text-ink-muted [font-variant-numeric:tabular-nums]">
                {formatMoney(persona.epfo.balance, i18n.language)}
              </p>
            }
            status={
              <Status
                kind={
                  persona.epfo.claim
                    ? 'info'
                    : health === 100
                      ? 'success'
                      : 'danger'
                }
              >
                {persona.epfo.claim
                  ? 'Tracking'
                  : health === 100
                    ? 'Ready'
                    : 'Blocked'}
              </Status>
            }
          />
        </section>
      </div>
      <section>
        <SectionHeading
          eyebrow="Traceable by design"
          title={t('home.recent')}
          action={
            <Link
              to="/activity"
              className="flex items-center gap-1.25 font-[650] text-primary no-underline"
            >
              View all <ArrowRight size={17} />
            </Link>
          }
        />
        <div className="border-t border-border">
          {persona.activity.slice(0, 3).map((event) => (
            <ActivityPreviewRow
              key={event.id}
              icon={
                event.kind === 'IDENTITY' ? (
                  <Fingerprint />
                ) : event.kind === 'INCOME_TAX' ? (
                  <Landmark />
                ) : (
                  <Activity />
                )
              }
              title={t(event.title, event.values)}
              detail={t(event.detail, event.values)}
              time={formatDate(event.occurredAt, i18n.language)}
            />
          ))}
        </div>
      </section>
    </Page>
  );
}

function ScoreRing({ score }: { score: number }) {
  return (
    <div
      className="grid size-26 place-content-center rounded-full text-center max-[599px]:size-21"
      style={{
        background: `radial-gradient(circle closest-side, var(--color-canvas) 76%, transparent 77% 100%), conic-gradient(var(--color-primary) ${score * 3.6}deg, var(--color-surface-muted) 0)`,
      }}
    >
      <span className="text-[2rem] leading-none font-[720] max-[599px]:text-[1.6rem]">
        {score}
      </span>
      <small className="text-ink-muted">/ 100</small>
    </div>
  );
}

function ServiceRow({
  icon,
  tone,
  label,
  title,
  meta,
  status,
}: {
  icon: ReactNode;
  tone: 'tax' | 'pf';
  label: ReactNode;
  title: ReactNode;
  meta: ReactNode;
  status: ReactNode;
}) {
  return (
    <div className="grid min-h-30.5 grid-cols-[42px_1fr_auto] items-center gap-3.25 py-4.5 max-[599px]:min-h-28 max-[599px]:grid-cols-[38px_1fr]">
      <span
        className={cn(
          'grid size-10 place-items-center rounded-[9px] [&>svg]:size-5.25',
          tone === 'tax'
            ? 'bg-[#e6eef1] text-info'
            : 'bg-[#e5efe8] text-success',
        )}
      >
        {icon}
      </span>
      <div>
        <Eyebrow>{label}</Eyebrow>
        <h3 className="mt-0.75 mb-1.75">{title}</h3>
        {meta}
      </div>
      <div className="max-[599px]:col-start-2">{status}</div>
    </div>
  );
}

function ActivityPreviewRow({
  icon,
  title,
  detail,
  time,
}: {
  icon: ReactNode;
  title: ReactNode;
  detail: ReactNode;
  time: ReactNode;
}) {
  return (
    <div className="grid grid-cols-[44px_1fr] gap-4 border-b border-border py-5">
      <span className="grid size-10 place-items-center rounded-full border border-border bg-surface text-primary [&>svg]:size-4.75">
        {icon}
      </span>
      <div>
        <h3 className="mt-0 mb-0.5">{title}</h3>
        <p className="m-0 text-ink-muted">{detail}</p>
        <time className="text-[0.75rem] text-ink-muted">{time}</time>
      </div>
    </div>
  );
}

function ActionCard({
  action,
}: {
  action: NonNullable<
    ReturnType<typeof useAppStore.getState>['persona']
  >['actions'][number];
}) {
  const { t } = useTranslation();
  return (
    <Link
      to={action.fixTarget}
      className="mb-8 grid grid-cols-[48px_1fr_auto] items-center gap-4.5 rounded-[var(--radius-sheet)] border border-border border-l-5 border-l-danger bg-surface p-5.5 text-inherit no-underline transition-[border-color,transform] duration-180 hover:border-danger hover:-translate-y-0.5 max-[599px]:grid-cols-[42px_1fr] max-[599px]:gap-3 max-[599px]:px-3.75 max-[599px]:py-4.5"
    >
      <span className="grid size-11.5 place-items-center rounded-full bg-[#f7e7e2] text-danger max-[599px]:size-10">
        <ShieldAlert />
      </span>
      <div>
        <Status kind={action.severity === 'BLOCKING' ? 'danger' : 'info'}>
          {action.service === 'IDENTITY'
            ? 'Affects 2 services'
            : 'Ready to review'}
        </Status>
        <h2 className="mt-1.75 mb-1.25">{t(action.title, action.values)}</h2>
        <p className="mb-2.5 text-ink-muted">
          {t(action.consequence, action.values)}
        </p>
        <SourceMarker>{t(action.source, action.values)}</SourceMarker>
      </div>
      <span className="flex items-center gap-2 font-bold whitespace-nowrap text-primary max-[599px]:col-start-2">
        Open task
        <ArrowRight />
      </span>
    </Link>
  );
}
