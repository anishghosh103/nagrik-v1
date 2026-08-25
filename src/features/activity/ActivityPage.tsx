import { Activity, Check, CircleDot, Clock3, Fingerprint } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useAppStore } from '../../app/store'
import { PageHeader, SourceMarker, Status } from '../../components/ui'
import { formatDate } from '../../components/formatters'

export function ActivityPage() {
  const { t, i18n } = useTranslation()
  const persona = useAppStore((state) => state.persona)
  if (!persona) return null
  const current = persona.epfo.claim ? 'PF claim received — validation is expected next.' : persona.mismatches.some((m) => m.status !== 'RESOLVED') ? 'Identity correction is needed before the PF claim can continue.' : 'PF claim checks are ready to review.'
  return <div className="page narrow"><PageHeader eyebrow="Across your services" title={t('activity.title')} subtitle={t('activity.subtitle')} />
    <section className="current-status"><p>{t('activity.current')}</p><h2>{current}</h2><SourceMarker>Derived from current records</SourceMarker></section>
    <ol className="activity-timeline">{persona.activity.map((event, index) => <li key={event.id}><span className={`activity-node ${event.status.toLowerCase()}`}>{event.kind === 'IDENTITY' ? <Fingerprint /> : event.status === 'IN_PROGRESS' ? <Clock3 /> : event.status === 'COMPLETE' ? <Check /> : <Activity />}</span><div className="activity-event"><div><Status kind={event.status === 'COMPLETE' ? 'success' : event.status === 'IN_PROGRESS' ? 'info' : 'warning'}>{event.kind === 'IDENTITY' ? 'Identity' : event.kind === 'EPFO' ? 'PF & EPFO' : 'Nagrik'}</Status><time>{formatDate(event.occurredAt, i18n.language)}</time></div><h2>{event.title}</h2><p>{event.detail}</p>{index === 0 && event.status === 'IN_PROGRESS' && <div className="next-event"><CircleDot />Next expected event: EPFO validation</div>}</div></li>)}</ol>
  </div>
}
