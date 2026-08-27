import { tw } from '../../styles/recipes';
import { Activity, Check, CircleDot, Clock3, Fingerprint } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../../app/store';
import { PageHeader, SourceMarker, Status } from '../../components/ui';
import { formatDate } from '../../components/formatters';

export function ActivityPage() {
  const { t, i18n } = useTranslation();
  const persona = useAppStore((state) => state.persona);
  if (!persona) return null;
  const current = persona.epfo.transfer
    ? t('activity.currentStates.transfer')
    : persona.epfo.claim
      ? t('activity.currentStates.claim')
      : persona.mismatches.some((m) => m.status !== 'RESOLVED')
        ? t('activity.currentStates.identity')
        : t('activity.currentStates.ready');
  return (
    <div className={tw('page narrow')}>
      <PageHeader
        eyebrow="Across your services"
        title={t('activity.title')}
        subtitle={t('activity.subtitle')}
      />
      <section className={tw('current-status')}>
        <p>{t('activity.current')}</p>
        <h2>{current}</h2>
        <SourceMarker>Derived from current records</SourceMarker>
      </section>
      <ol className={tw('activity-timeline')}>
        {persona.activity.map((event, index) => (
          <li key={event.id}>
            <span className={tw('activity-node', event.status.toLowerCase())}>
              {event.kind === 'IDENTITY' ? (
                <Fingerprint />
              ) : event.status === 'IN_PROGRESS' ? (
                <Clock3 />
              ) : event.status === 'COMPLETE' ? (
                <Check />
              ) : (
                <Activity />
              )}
            </span>
            <div className={tw('activity-event')}>
              <div>
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
                      : 'Nagrik'}
                </Status>
                <time>{formatDate(event.occurredAt, i18n.language)}</time>
              </div>
              <h2>{t(event.title, event.values)}</h2>
              <p>{t(event.detail, event.values)}</p>
              {index === 0 && event.status === 'IN_PROGRESS' && (
                <div className={tw('next-event')}>
                  <CircleDot />
                  {t('activity.next')}
                </div>
              )}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
