import { tw } from '../../styles/recipes';
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
import { Button, PageHeader, SourceMarker, Status } from '../../components/ui';

export function EPFOProfilePage() {
  const { t } = useTranslation();
  const persona = useAppStore((state) => state.persona);
  if (!persona) return null;
  return (
    <div className={tw('page')}>
      <PageHeader
        eyebrow={t('epfo.profile.eyebrow')}
        title={t('epfo.profile.title')}
        subtitle={t('epfo.profile.subtitle')}
        back="/epfo"
      />
      <section className={tw('profile-identity-band')}>
        <div className={tw('profile-monogram')}>
          <UserRound />
        </div>
        <div>
          <span>{t('epfo.profile.uan')}</span>
          <strong
            aria-label={t('epfo.profile.uanAccessible', {
              digits: persona.epfo.maskedUan.slice(-4),
            })}
          >
            {persona.epfo.maskedUan}
          </strong>
          <SourceMarker>{t('epfo.profile.source')}</SourceMarker>
        </div>
        <Status kind="success">{t('epfo.profile.connected')}</Status>
      </section>
      <div className={tw('record-card-grid')}>
        <Link to="/epfo/kyc">
          <ShieldCheck />
          <span>
            <strong>{t('epfo.profile.kyc')}</strong>
            <small>
              {t('epfo.profile.kycHelp', {
                count: persona.epfo.kyc.filter(
                  (record) => record.status === 'VALIDATED',
                ).length,
              })}
            </small>
          </span>
          <ArrowRight />
        </Link>
        <Link to="/epfo/employment">
          <BriefcaseBusiness />
          <span>
            <strong>{t('epfo.profile.employment')}</strong>
            <small>
              {t('epfo.profile.employmentHelp', {
                count: persona.epfo.employment.length,
              })}
            </small>
          </span>
          <ArrowRight />
        </Link>
        <Link to="/epfo/history">
          <History />
          <span>
            <strong>{t('epfo.profile.history')}</strong>
            <small>{t('epfo.profile.historyHelp')}</small>
          </span>
          <ArrowRight />
        </Link>
      </div>
      <section className={tw('bank-record')}>
        <Banknote />
        <div>
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
    </div>
  );
}

export function KYCPage() {
  const { t, i18n } = useTranslation();
  const persona = useAppStore((state) => state.persona);
  if (!persona) return null;
  const icons = { AADHAAR: Fingerprint, PAN: Landmark, BANK: Banknote };
  return (
    <div className={tw('page narrow')}>
      <PageHeader
        eyebrow={t('epfo.kyc.eyebrow')}
        title={t('epfo.kyc.title')}
        subtitle={t('epfo.kyc.subtitle')}
        back="/epfo/profile"
      />
      <div className={tw('record-ledger')}>
        {persona.epfo.kyc.map((record) => {
          const Icon = icons[record.kind];
          return (
            <article key={record.kind}>
              <span className={tw('record-icon')}>
                <Icon />
              </span>
              <div>
                <h2>{t(`epfo.kyc.${record.kind.toLowerCase()}`)}</h2>
                <strong>{record.maskedValue}</strong>
                <SourceMarker>
                  {t('epfo.kyc.updated', {
                    date: formatDate(record.updatedAt, i18n.language),
                  })}
                </SourceMarker>
              </div>
              <Status
                kind={record.status === 'VALIDATED' ? 'success' : 'warning'}
              >
                {t(
                  record.status === 'VALIDATED'
                    ? 'epfo.profile.validated'
                    : 'epfo.kyc.attention',
                )}
              </Status>
            </article>
          );
        })}
      </div>
      <aside className={tw('simulation-note')}>
        <ShieldCheck />
        <span>{t('epfo.kyc.prototype')}</span>
      </aside>
    </div>
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
    <div className={tw('page narrow')}>
      <PageHeader
        eyebrow={t('epfo.employment.eyebrow')}
        title={t('epfo.employment.title')}
        subtitle={t('epfo.employment.subtitle')}
        back="/epfo/profile"
      />
      {saved && (
        <div
          className={tw('success-inline')}
          role="status"
        >
          <Check />
          {t('epfo.employment.saved')}
        </div>
      )}
      <ol className={tw('employment-timeline')}>
        {persona.epfo.employment.map((record) => (
          <li
            key={record.id}
            id={`employment-${record.id}`}
            tabIndex={-1}
          >
            <span className={tw('employment-node')}>
              <BriefcaseBusiness />
            </span>
            <article>
              <div className={tw('section-title-row')}>
                <div>
                  <h2>{record.employer}</h2>
                  <small>{record.memberId}</small>
                </div>
                <Status kind={record.current ? 'info' : 'success'}>
                  {t(
                    record.current
                      ? 'epfo.employment.current'
                      : 'epfo.employment.previous',
                  )}
                </Status>
              </div>
              <dl>
                <div>
                  <dt>{t('epfo.employment.joined')}</dt>
                  <dd>{formatDate(record.joinedOn, i18n.language)}</dd>
                </div>
                <div>
                  <dt>{t('epfo.employment.exited')}</dt>
                  <dd>
                    {record.exitedOn
                      ? formatDate(record.exitedOn, i18n.language)
                      : t('epfo.employment.notRecorded')}
                  </dd>
                </div>
                <div>
                  <dt>{t('epfo.employment.balance')}</dt>
                  <dd>{formatMoney(record.balance, i18n.language)}</dd>
                </div>
              </dl>
              {editing === record.id ? (
                <div className={tw('inline-edit')}>
                  <label htmlFor={`exit-${record.id}`}>
                    {t('epfo.employment.correctExit')}
                  </label>
                  <input
                    id={`exit-${record.id}`}
                    type="date"
                    value={date}
                    max={
                      persona.epfo.employment.find((item) => item.current)
                        ?.joinedOn
                    }
                    onChange={(event) => setDate(event.target.value)}
                  />
                  <div>
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
                  <button
                    className={tw('text-button')}
                    onClick={() => setEditing(record.id)}
                  >
                    {t('epfo.employment.correctDates')}
                  </button>
                )
              )}
              <SourceMarker>{t('epfo.employment.source')}</SourceMarker>
            </article>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function ServiceHistoryPage() {
  const { t, i18n } = useTranslation();
  const persona = useAppStore((state) => state.persona);
  if (!persona) return null;
  return (
    <div className={tw('page narrow')}>
      <PageHeader
        eyebrow={t('epfo.history.eyebrow')}
        title={t('epfo.history.title')}
        subtitle={t('epfo.history.subtitle')}
        back="/epfo/profile"
      />
      <div className={tw('service-history-list')}>
        {persona.epfo.claim && (
          <article>
            <Clock3 />
            <div>
              <Status kind="info">{t('epfo.history.claim')}</Status>
              <h2>{t('epfo.received')}</h2>
              <p>
                {persona.epfo.claim.reference} ·{' '}
                {formatDate(persona.epfo.claim.submittedAt, i18n.language)}
              </p>
            </div>
            <Link
              to="/epfo/claim/status"
              aria-label={t('epfo.track')}
            >
              <ArrowRight />
            </Link>
          </article>
        )}
        {persona.epfo.transfer && (
          <article>
            <Clock3 />
            <div>
              <Status kind="info">{t('epfo.history.transfer')}</Status>
              <h2>{t('epfo.transfer.statusEmployer')}</h2>
              <p>
                {persona.epfo.transfer.reference} ·{' '}
                {formatDate(persona.epfo.transfer.submittedAt, i18n.language)}
              </p>
            </div>
            <Link
              to="/epfo/transfer/status"
              aria-label={t('epfo.transfer.track')}
            >
              <ArrowRight />
            </Link>
          </article>
        )}
        {persona.epfo.claimHistory.map((claim) => (
          <article key={claim.id}>
            <History />
            <div>
              <Status kind={claim.status === 'REJECTED' ? 'danger' : 'success'}>
                {t(`epfo.history.${claim.status.toLowerCase()}`)}
              </Status>
              <h2>
                {t(
                  claim.status === 'REJECTED'
                    ? 'epfo.history.priorRejected'
                    : 'epfo.history.priorSettled',
                )}
              </h2>
              <p>
                {claim.reference} · {formatDate(claim.decidedAt, i18n.language)}
              </p>
            </div>
            {claim.status === 'REJECTED' ? (
              <Link
                to="/epfo/claims/rejected"
                aria-label={t('common.details')}
              >
                <ArrowRight />
              </Link>
            ) : (
              <Check />
            )}
          </article>
        ))}
        <article>
          <UsersRoundIcon />
          <div>
            <Status
              kind={
                persona.epfo.nomination.status === 'EFFECTIVE'
                  ? 'success'
                  : 'warning'
              }
            >
              {t('epfo.history.nomination')}
            </Status>
            <h2>
              {t(
                `epfo.nomination.status.${persona.epfo.nomination.status.toLowerCase()}`,
              )}
            </h2>
            <p>
              {t('epfo.history.nominationUpdated', {
                date: formatDate(
                  persona.epfo.nomination.updatedAt,
                  i18n.language,
                ),
              })}
            </p>
          </div>
          <Link
            to="/epfo/nomination"
            aria-label={t('common.details')}
          >
            <ArrowRight />
          </Link>
        </article>
      </div>
    </div>
  );
}

function UsersRoundIcon() {
  return (
    <span className={tw('history-glyph')}>
      <UserRound />
    </span>
  );
}
