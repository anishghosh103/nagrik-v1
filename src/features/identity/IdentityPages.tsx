import { useMemo, useState } from 'react';
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
import { PageHeader, SourceMarker, Status } from '../../components/ui';
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
const sourceNames: Record<IdentitySource, string> = {
  AADHAAR: 'Aadhaar',
  PAN: 'PAN',
  BANK: 'Bank',
  EPFO: 'EPFO',
  INCOME_TAX: 'Income Tax',
};
const fieldNames: Record<IdentityField, string> = {
  name: 'Name',
  mobile: 'Mobile',
  bankAccount: 'Bank account',
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
    <div className="page wide-page">
      <PageHeader
        eyebrow="Financial identity · Health check"
        title={t('identity.title')}
        subtitle={t('identity.subtitle')}
      />
      <section className="identity-summary">
        <div>
          <div className="score-inline">
            <strong>{health}</strong>
            <span>/ 100</span>
          </div>
          <p>{t('identity.score')}</p>
        </div>
        <div className="connection-summary">
          <span>
            <Fingerprint />
            <b>Aadhaar-led identity</b>
          </span>
          <span className="connection-line" />
          <span>
            <Landmark />
            <b>5 connected records</b>
          </span>
        </div>
        <Status kind={openMismatch ? 'danger' : 'success'}>
          {openMismatch ? t('identity.attention') : t('identity.consistent')}
        </Status>
      </section>
      <div
        className="comparison-desktop"
        role="region"
        aria-label="Identity source comparison"
        tabIndex={0}
      >
        <table>
          <caption className="sr-only">
            Values held by each connected identity source
          </caption>
          <thead>
            <tr>
              <th>{t('identity.field')}</th>
              {sources.map((source) => (
                <th key={source}>
                  <SourceMarker>{sourceNames[source]}</SourceMarker>
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
                  className={mismatch ? 'mismatch-row' : ''}
                >
                  <th>
                    {fieldNames[field]}
                    {mismatch && (
                      <Status kind="danger">{t('identity.attention')}</Status>
                    )}
                  </th>
                  {sources.map((source) => (
                    <td key={source}>
                      {persona.identity.valuesBySource[source][field] ?? (
                        <span aria-label="Not available">—</span>
                      )}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="comparison-mobile">
        {fields.map((field) => {
          const mismatch = persona.mismatches.find(
            (item) => item.field === field && item.status !== 'RESOLVED',
          );
          return (
            <section
              className={mismatch ? 'field-card mismatch-row' : 'field-card'}
              key={field}
            >
              <div className="field-card-head">
                <h2>{fieldNames[field]}</h2>
                <Status kind={mismatch ? 'danger' : 'success'}>
                  {mismatch
                    ? t('identity.attention')
                    : t('identity.consistent')}
                </Status>
              </div>
              {sources.map(
                (source) =>
                  persona.identity.valuesBySource[source][field] && (
                    <div
                      className="field-value"
                      key={source}
                    >
                      <SourceMarker>{sourceNames[source]}</SourceMarker>
                      <span>
                        {persona.identity.valuesBySource[source][field]}
                      </span>
                    </div>
                  ),
              )}
              {mismatch && (
                <Link
                  className="arrow-link"
                  to={`/identity/mismatch/${mismatch.id}`}
                >
                  {t('common.review')}
                  <ArrowRight />
                </Link>
              )}
            </section>
          );
        })}
      </div>
      {openMismatch ? (
        <Link
          className="mismatch-callout"
          to={`/identity/mismatch/${openMismatch.id}`}
        >
          <span>
            <CircleDot />
            <b>Name mismatch</b>
          </span>
          <p>May block your PF claim and delay Income Tax bank validation.</p>
          <span className="arrow-link">
            {t('common.review')}
            <ArrowRight />
          </span>
        </Link>
      ) : (
        <section className="success-callout">
          <CheckCircle2 />
          <div>
            <h2>{t('identity.success')}</h2>
            <p>{t('identity.successBody')}</p>
            {persona.identityChanges[0] && (
              <small>
                {t('common.lastUpdated')}{' '}
                {formatDate(
                  persona.identityChanges[0].changedAt,
                  i18n.language,
                )}
              </small>
            )}
          </div>
          <Link
            className="button secondary"
            to="/epfo/claim"
          >
            {t('identity.viewPf')}
            <ArrowRight />
          </Link>
        </section>
      )}
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
      <div className="page narrow">
        <PageHeader
          eyebrow="Financial identity"
          title="This difference is no longer open"
          subtitle="Return to the health check to see current values."
          back="/identity"
        />
      </div>
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
    <div className="page narrow journey-page">
      <PageHeader
        eyebrow="Financial identity · Correct and propagate"
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
      <div className="journey-progress">
        <span>Step {stepNumber} of 4</span>
        <div>
          <i className="on" />
          <i className={stepNumber >= 2 ? 'on' : ''} />
          <i className={stepNumber >= 3 ? 'on' : ''} />
          <i className={stepNumber >= 4 ? 'on' : ''} />
        </div>
      </div>
      {step === 'choose' && (
        <section>
          <div className="issue-explanation">
            <Status kind="danger">Blocking</Status>
            <h2>Connected records use four different versions</h2>
            <p>
              Nagrik will treat your choice as canonical and send it to each
              simulated destination.
            </p>
          </div>
          <fieldset className="choice-list">
            <legend>{t('identity.canonical')}</legend>
            {choices.map((choice) => (
              <label
                className={value === choice ? 'choice selected' : 'choice'}
                key={choice}
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
                    {
                      sourceNames[
                        (Object.entries(mismatch.valuesBySource).find(
                          ([, v]) => v === choice,
                        )?.[0] ?? 'AADHAAR') as IdentitySource
                      ]
                    }{' '}
                    record
                  </small>
                </span>
                <Check />
              </label>
            ))}
          </fieldset>
          <div className="sticky-action">
            <span>{t('common.saved')}</span>
            <button
              className="button primary"
              onClick={() => setStep('review')}
            >
              Review destinations
              <ArrowRight />
            </button>
          </div>
        </section>
      )}
      {step === 'review' && (
        <section>
          <div className="review-value">
            <span>Canonical name</span>
            <strong>{value}</strong>
            <button
              className="button text"
              onClick={() => setStep('choose')}
            >
              Change
            </button>
          </div>
          <h2>{t('identity.propagation')}</h2>
          <div className="destination-list">
            {sources.map((source, index) => (
              <div key={source}>
                <span className="destination-index">0{index + 1}</span>
                <span>
                  <strong>{sourceNames[source]}</strong>
                  <small>
                    Replace “{mismatch.valuesBySource[source]}” with “{value}”
                  </small>
                </span>
                <Status kind="info">Will update</Status>
              </div>
            ))}
          </div>
          <div className="simulation-note">
            <FileCheck2 />
            This creates a local change receipt. No real system will be
            contacted.
          </div>
          <div className="sticky-action">
            <button
              className="button secondary"
              onClick={() => setStep('choose')}
            >
              Back
            </button>
            <button
              className="button primary"
              disabled={busy}
              onClick={() => void propagate()}
            >
              {t('identity.confirm')}
              <ArrowRight />
            </button>
          </div>
        </section>
      )}
      {step === 'progress' && (
        <section
          className="propagation-progress"
          aria-live="polite"
        >
          <LoaderCircle className="spinner" />
          <h2>Updating connected records</h2>
          <p>Keeping the chosen name traceable across each destination.</p>
          <div className="destination-list animating">
            {sources.map((source, index) => (
              <div
                style={{ animationDelay: `${index * 90}ms` }}
                key={source}
              >
                <span className="destination-index">
                  <LoaderCircle />
                </span>
                <span>
                  <strong>{sourceNames[source]}</strong>
                  <small>Propagation in progress</small>
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
      {step === 'result' && (
        <section className="result-panel">
          <div className="outcome-mark">
            <Check />
          </div>
          <Status kind="success">5 records updated</Status>
          <div className="receipt">
            <div className="receipt-head">
              <span>{t('identity.receipt')}</span>
              <strong>{change?.id ?? 'Saved change'}</strong>
            </div>
            <dl>
              <div>
                <dt>{t('identity.changedFrom')}</dt>
                <dd>{change?.fromValues.join(' · ')}</dd>
              </div>
              <div>
                <dt>{t('identity.changedTo')}</dt>
                <dd>{change?.toValue ?? value}</dd>
              </div>
              <div>
                <dt>Completed</dt>
                <dd>
                  {change
                    ? formatDate(change.changedAt, i18n.language)
                    : 'Saved'}
                </dd>
              </div>
            </dl>
            {sources.map((source) => (
              <div
                className="receipt-row"
                key={source}
              >
                <SourceMarker>{sourceNames[source]}</SourceMarker>
                <Status kind="success">Updated</Status>
              </div>
            ))}
          </div>
          <Link
            className="button primary wide"
            to="/epfo/claim"
          >
            {t('identity.viewPf')}
            <ArrowRight />
          </Link>
          <Link
            className="button text wide"
            to="/activity"
          >
            View change in Activity
          </Link>
        </section>
      )}
    </div>
  );
}
