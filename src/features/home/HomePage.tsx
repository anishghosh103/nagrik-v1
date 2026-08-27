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
import { PageHeader, SourceMarker, Status } from '../../components/ui';
import { formatDate, formatMoney } from '../../components/formatters';
import { identityHealth } from '../../rules/identity';

export function HomePage({ actionsOnly = false }: { actionsOnly?: boolean }) {
  const { t, i18n } = useTranslation();
  const persona = useAppStore((state) => state.persona);
  if (!persona) return null;
  const health = identityHealth(persona);
  const action = persona.actions[0];
  if (actionsOnly)
    return (
      <div className="page narrow">
        <PageHeader
          eyebrow="Across your services"
          title={t('nav.actions')}
          subtitle="Outstanding work is derived from the records that need your attention."
        />
        {action ? (
          <ActionCard action={action} />
        ) : (
          <section className="empty-ledger">
            <CheckCircle2 />
            <h2>Nothing needs your attention</h2>
            <p>
              Your connected records and submitted requests have no outstanding
              demo action.
            </p>
          </section>
        )}
      </div>
    );
  return (
    <div className="page dashboard-page">
      <PageHeader
        eyebrow={`${t('home.eyebrow')}, ${persona.profile.firstName}`}
        title={t('home.title')}
        subtitle={t('home.subtitle')}
      />
      {action && (
        <section aria-labelledby="priority-title">
          <div className="section-kicker">
            <Flag size={16} />
            <span>{t('home.priority')}</span>
            <span className="rule" />
          </div>
          <ActionCard action={action} />
        </section>
      )}
      <div className="dashboard-grid">
        <Link
          to="/identity"
          className="identity-score-card"
        >
          <div
            className="score-ring"
            style={{ '--score': `${health * 3.6}deg` } as React.CSSProperties}
          >
            <span>{health}</span>
            <small>/ 100</small>
          </div>
          <div>
            <p className="card-eyebrow">{t('home.identity')}</p>
            <h2>{health === 100 ? t('home.healthy') : t('home.issue')}</h2>
            <p>5 {t('home.connected')}</p>
          </div>
          <ArrowRight />
        </Link>
        <section className="service-ledger">
          <div className="service-row">
            <span className="service-icon tax">
              <Landmark />
            </span>
            <div>
              <p className="card-eyebrow">Income Tax</p>
              <h3>
                {health === 100
                  ? 'Bank record ready'
                  : 'Bank validation may be delayed'}
              </h3>
              <SourceMarker>Income Tax profile</SourceMarker>
            </div>
            <Status kind={health === 100 ? 'success' : 'warning'}>
              {health === 100 ? 'Ready' : 'Review'}
            </Status>
          </div>
          <div className="service-row">
            <span className="service-icon pf">
              <BadgeIndianRupee />
            </span>
            <div>
              <p className="card-eyebrow">EPFO</p>
              <h3>
                {persona.epfo.claim
                  ? 'Claim received'
                  : health === 100
                    ? 'Claim checks ready'
                    : 'Claim is blocked'}
              </h3>
              <p className="money-small">
                {formatMoney(persona.epfo.balance, i18n.language)}
              </p>
            </div>
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
          </div>
        </section>
      </div>
      <section className="recent-section">
        <div className="section-title-row">
          <div>
            <p className="eyebrow">Traceable by design</p>
            <h2>{t('home.recent')}</h2>
          </div>
          <Link to="/activity">
            View all <ArrowRight size={17} />
          </Link>
        </div>
        <div className="mini-timeline">
          {persona.activity.slice(0, 3).map((event) => (
            <div
              key={event.id}
              className="timeline-row"
            >
              <span className="timeline-icon">
                {event.kind === 'IDENTITY' ? <Fingerprint /> : <Activity />}
              </span>
              <div>
                <h3>{event.title}</h3>
                <p>{event.detail}</p>
                <time>{formatDate(event.occurredAt, i18n.language)}</time>
              </div>
            </div>
          ))}
        </div>
      </section>
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
  return (
    <Link
      to={action.fixTarget}
      className="priority-card"
    >
      <span className="priority-icon">
        <ShieldAlert />
      </span>
      <div>
        <Status kind={action.severity === 'BLOCKING' ? 'danger' : 'info'}>
          {action.service === 'IDENTITY'
            ? 'Affects 2 services'
            : 'Ready to review'}
        </Status>
        <h2>{action.title}</h2>
        <p>{action.consequence}</p>
        <SourceMarker>{action.source}</SourceMarker>
      </div>
      <span className="priority-action">
        Open task
        <ArrowRight />
      </span>
    </Link>
  );
}
