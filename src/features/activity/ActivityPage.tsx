import type { ReactNode } from 'react';
import {
  Activity,
  ArrowRight,
  Check,
  CircleDot,
  Clock3,
  Fingerprint,
  Landmark,
  Scale,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../../app/store';
import { cn } from '../../components/cn';
import { formatDate } from '../../components/formatters';
import {
  ButtonLink,
  Page,
  PageHeader,
  SourceMarker,
  Status,
} from '../../components/ui';

export function ActivityPage() {
  const { t, i18n } = useTranslation();
  const persona = useAppStore((state) => state.persona);
  if (!persona) return null;
  const filedReturn = persona.tax?.filedReturns[0];
  const openNotice = persona.tax?.draft?.notices.some(
    (notice) => notice.state !== 'RESOLVED',
  );
  const delayedRefund = persona.tax?.filedReturns.some(
    (filed) => filed.refund?.status === 'DELAYED',
  );
  const current = openNotice
    ? t('activity.currentStates.taxNotice')
    : delayedRefund
      ? t('activity.currentStates.refundDelayed')
      : persona.epfo.transfer
        ? t('activity.currentStates.transfer')
        : persona.epfo.claim
          ? t('activity.currentStates.claim')
          : persona.mismatches.some((m) => m.status !== 'RESOLVED')
            ? t('activity.currentStates.identity')
            : filedReturn && filedReturn.verification.status === 'PENDING'
              ? t('activity.currentStates.taxVerificationPending')
              : persona.tax?.draft && !filedReturn
                ? t('activity.currentStates.taxDraftInProgress')
                : t('activity.currentStates.ready');
  return (
    <Page width="narrow">
      <PageHeader
        eyebrow="Across your services"
        title={t('activity.title')}
        subtitle={t('activity.subtitle')}
      />
      <section className="mb-8 border-y border-border py-5">
        <p className="mb-1 text-ink-muted">{t('activity.current')}</p>
        <h2 className="mb-3">{current}</h2>
        <SourceMarker>Derived from current records</SourceMarker>
      </section>
      <ButtonLink
        variant="secondary"
        to="/grievances"
        className="mb-7"
      >
        <Scale /> {t('grievances.centre.title')}
        <ArrowRight />
      </ButtonLink>
      <ol className="m-0 list-none p-0">
        {persona.activity.map((event, index) => (
          <TimelineEvent
            key={event.id}
            status={
              event.status.toLowerCase() as 'complete' | 'in_progress' | 'info'
            }
            icon={
              event.kind === 'IDENTITY' ? (
                <Fingerprint />
              ) : event.kind === 'INCOME_TAX' ? (
                <Landmark />
              ) : event.kind === 'GRIEVANCE' ? (
                <Scale />
              ) : event.status === 'IN_PROGRESS' ? (
                <Clock3 />
              ) : event.status === 'COMPLETE' ? (
                <Check />
              ) : (
                <Activity />
              )
            }
            header={
              <Status
                kind={
                  event.status === 'COMPLETE'
                    ? 'success'
                    : event.status === 'IN_PROGRESS'
                      ? 'info'
                      : 'warning'
                }
              >
                {event.kind === 'IDENTITY'
                  ? t('nav.identity')
                  : event.kind === 'EPFO'
                    ? t('nav.epfo')
                    : event.kind === 'INCOME_TAX'
                      ? t('nav.tax')
                      : event.kind === 'GRIEVANCE'
                        ? t('grievances.centre.title')
                        : 'Nagrik'}
              </Status>
            }
            time={formatDate(event.occurredAt, i18n.language)}
            title={t(event.title, event.values)}
            detail={t(event.detail, event.values)}
            next={
              index === 0 && event.status === 'IN_PROGRESS' ? (
                <>
                  <CircleDot />
                  {t('activity.next')}
                </>
              ) : undefined
            }
          />
        ))}
      </ol>
    </Page>
  );
}

function TimelineEvent({
  status,
  icon,
  header,
  time,
  title,
  detail,
  next,
}: {
  status: 'complete' | 'in_progress' | 'info';
  icon: ReactNode;
  header: ReactNode;
  time: ReactNode;
  title: ReactNode;
  detail: ReactNode;
  next?: ReactNode;
}) {
  return (
    <li className="relative grid grid-cols-[50px_1fr] gap-3.75 pb-6.5 before:absolute before:top-10.5 before:left-5.25 before:h-[calc(100%-22px)] before:w-px before:bg-border last:before:hidden max-[599px]:grid-cols-[42px_1fr] max-[599px]:gap-2.5 max-[599px]:before:left-4.5">
      <span
        className={cn(
          'z-1 grid size-10.75 place-items-center rounded-full border border-border bg-surface text-primary max-[599px]:size-9.5 [&>svg]:size-5',
          status === 'complete' && 'border-success bg-success text-white',
          status === 'in_progress' && 'border-info text-info',
        )}
      >
        {icon}
      </span>
      <div className="border-b border-border pb-5.5">
        <div className="flex justify-between gap-3 max-[599px]:grid">
          {header}
          <time className="text-[0.76rem] text-ink-muted">{time}</time>
        </div>
        <h2 className="mt-2.25 mb-1">{title}</h2>
        <p className="m-0 text-ink-muted">{detail}</p>
        {next && (
          <div className="mt-3 flex items-center gap-1.75 text-[0.82rem] text-info">
            {next}
          </div>
        )}
      </div>
    </li>
  );
}
