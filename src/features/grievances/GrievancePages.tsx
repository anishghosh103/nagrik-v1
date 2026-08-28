import { useEffect, useState } from 'react';
import {
  ArrowRight,
  Check,
  CircleDot,
  Clock3,
  FileWarning,
  Scale,
  X,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  Link,
  Navigate,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import { useAppStore } from '../../app/store';
import { formatDate } from '../../components/formatters';
import {
  Button,
  ButtonLink,
  Page,
  PageHeader,
  Status,
} from '../../components/ui';
import { ChoiceCard, ChoiceGroup, FieldLabel } from '../../components/forms';
import {
  Notice,
  OutcomeMark,
  ProgressState,
  ReferenceBand,
  ReviewList,
  ReviewRow,
  StatusCard,
  StatusTimeline,
  StatusTimelineItem,
  StepProgress,
  StickyActions,
} from '../../components/patterns';
import {
  GRIEVANCE_CATEGORIES_BY_SERVICE,
  currentMeaningKey,
  isEscalationEligible,
  suggestCategory,
  suggestService,
} from '../../rules/grievances';
import type {
  GrievanceCase,
  GrievanceCategory,
  GrievanceService,
} from '../../types/domain';

const inputClass =
  'h-12 w-full rounded-[9px] border border-border bg-surface px-3.5';
const textareaClass =
  'min-h-32 w-full rounded-[9px] border border-border bg-surface p-3.5 leading-relaxed';

function serviceLabel(
  t: ReturnType<typeof useTranslation>['t'],
  service: GrievanceService,
) {
  return t(
    service === 'INCOME_TAX'
      ? 'nav.tax'
      : service === 'EPFO'
        ? 'nav.epfo'
        : 'nav.identity',
  );
}

function statusTone(grievance: GrievanceCase): 'success' | 'info' | 'warning' {
  if (grievance.escalation?.status === 'RESOLVED') return 'success';
  if (grievance.escalation?.status === 'IN_REVIEW') return 'info';
  if (grievance.status === 'DISPOSED')
    return grievance.outcome === 'RESOLVED' ? 'success' : 'warning';
  return 'info';
}

function statusLabelKey(grievance: GrievanceCase): string {
  if (grievance.escalation?.status === 'RESOLVED') return 'ESCALATION_RESOLVED';
  if (grievance.escalation?.status === 'IN_REVIEW') return 'ESCALATED';
  return grievance.status;
}

export function GrievanceCentrePage() {
  const { t, i18n } = useTranslation();
  const grievances = useAppStore((state) => state.persona?.grievances ?? []);
  return (
    <Page width="narrow">
      <PageHeader
        eyebrow={t('grievances.centre.eyebrow')}
        title={t('grievances.centre.title')}
        subtitle={t('grievances.centre.subtitle')}
      />
      <ButtonLink to="/grievances/new">
        <Scale /> {t('grievances.centre.file')}
      </ButtonLink>
      <div className="mt-7 border-t border-border">
        {grievances.length === 0 ? (
          <div className="py-12 text-center text-ink-muted">
            <FileWarning className="mx-auto mb-3 size-10 text-primary" />
            <h2>{t('grievances.centre.empty')}</h2>
            <p>{t('grievances.centre.emptyHelp')}</p>
          </div>
        ) : (
          grievances.map((grievance) => (
            <Link
              key={grievance.id}
              to={`/grievances/${grievance.id}`}
              className="grid grid-cols-[1fr_auto] items-center gap-4 border-b border-border py-5 no-underline"
            >
              <div>
                <Status kind={statusTone(grievance)}>
                  {t(`grievances.status.${statusLabelKey(grievance)}`)}
                </Status>
                <h2 className="my-2 text-[1.16rem]">
                  {t(`grievances.categories.${grievance.category}.title`)}
                </h2>
                <p className="m-0 text-ink-muted">
                  {serviceLabel(t, grievance.service)} ·{' '}
                  {t('grievances.centre.submittedOn', {
                    date: formatDate(grievance.submittedAt, i18n.language),
                  })}
                </p>
              </div>
              <ArrowRight className="text-primary" />
            </Link>
          ))
        )}
      </div>
    </Page>
  );
}

type WizardStep =
  | 'service'
  | 'describe'
  | 'category'
  | 'evidence'
  | 'review'
  | 'submitting'
  | 'done';

const STEP_NUMBER: Record<
  Exclude<WizardStep, 'submitting' | 'done'>,
  number
> = {
  service: 1,
  describe: 2,
  category: 3,
  evidence: 4,
  review: 5,
};

export function NewGrievancePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const persona = useAppStore((state) => state.persona);
  const submitGrievance = useAppStore((state) => state.submitGrievance);
  const issue = persona?.epfo.contributionIssue;
  const isPrefill =
    searchParams.get('source') === 'contribution-issue' && !!issue;

  const [service, setService] = useState<GrievanceService | 'UNSURE' | null>(
    isPrefill ? 'EPFO' : null,
  );
  const [description, setDescription] = useState(
    isPrefill ? (issue?.summary ?? '') : '',
  );
  const [category, setCategory] = useState<GrievanceCategory | null>(
    isPrefill ? 'CONTRIBUTION_MISMATCH' : null,
  );
  const [evidenceDraft, setEvidenceDraft] = useState('');
  const [evidence, setEvidence] = useState<string[]>([]);
  const [step, setStep] = useState<WizardStep>(
    isPrefill ? 'review' : 'service',
  );
  const [error, setError] = useState('');
  const [result, setResult] = useState<GrievanceCase | null>(null);

  useEffect(() => {
    if (!persona) return;
    const alreadyTracked = persona.grievances.some(
      (item) =>
        item.source?.kind === 'CONTRIBUTION_ISSUE' &&
        item.source.reference === issue?.contributionId,
    );
    if (isPrefill && alreadyTracked)
      navigate('/epfo/passbook/issue', { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!persona) return null;

  const effectiveService: GrievanceService =
    service && service !== 'UNSURE' ? service : suggestService(description);
  const backTarget = isPrefill ? '/epfo/passbook/issue' : '/grievances';

  async function submit() {
    if (!category) return;
    setStep('submitting');
    setError('');
    try {
      const created = await submitGrievance({
        service: effectiveService,
        category,
        description,
        evidence,
        source:
          isPrefill && issue
            ? { kind: 'CONTRIBUTION_ISSUE', reference: issue.contributionId }
            : undefined,
      });
      setResult(created);
      setStep('done');
    } catch {
      setError(t('grievances.wizard.submitFailed'));
      setStep('review');
    }
  }

  if (step === 'done' && result)
    return (
      <Page
        width="narrow"
        mode="completion"
      >
        <PageHeader
          eyebrow={t('grievances.confirmation.eyebrow')}
          title={t('grievances.confirmation.title')}
          subtitle={t('grievances.confirmation.subtitle')}
        />
        <OutcomeMark
          variant="pending"
          icon={<Check />}
        />
        <ReferenceBand
          label={t('common.saved')}
          reference={result.reference}
        />
        <Notice
          tone="info"
          icon={<Clock3 />}
        >
          {t(`grievances.process.${result.service}`)}
        </Notice>
        <div className="mt-6 grid gap-3">
          <ButtonLink to={`/grievances/${result.id}`}>
            {t('grievances.confirmation.viewCase')} <ArrowRight />
          </ButtonLink>
          <ButtonLink
            variant="secondary"
            to="/activity"
          >
            {t('grievances.confirmation.viewActivity')}
          </ButtonLink>
        </div>
      </Page>
    );

  const headerStep: Exclude<WizardStep, 'submitting' | 'done'> =
    step === 'submitting'
      ? 'review'
      : (step as Exclude<WizardStep, 'submitting' | 'done'>);

  return (
    <Page
      width="narrow"
      mode="journey"
    >
      <PageHeader
        eyebrow={t('grievances.wizard.eyebrow')}
        title={t(`grievances.wizard.${headerStep}Title`)}
        subtitle={t(`grievances.wizard.${headerStep}Help`)}
        back={backTarget}
      />
      <StepProgress
        current={STEP_NUMBER[headerStep]}
        total={5}
      />
      {step === 'submitting' && (
        <ProgressState title={t('grievances.wizard.submitting')} />
      )}
      {isPrefill && step === 'review' && (
        <Notice
          tone="success"
          icon={<Check />}
          title={t('grievances.wizard.prefilledTitle')}
        >
          {t('grievances.wizard.prefilledHelp')}
        </Notice>
      )}
      {step === 'service' && (
        <>
          <ChoiceGroup legend={t('grievances.wizard.serviceTitle')}>
            {(['INCOME_TAX', 'EPFO', 'IDENTITY'] as GrievanceService[]).map(
              (option) => (
                <ChoiceCard
                  key={option}
                  selected={service === option}
                >
                  <input
                    type="radio"
                    checked={service === option}
                    onChange={() => setService(option)}
                    name="grievance-service"
                  />
                  <span>
                    <strong>{serviceLabel(t, option)}</strong>
                  </span>
                  <Check />
                </ChoiceCard>
              ),
            )}
            <ChoiceCard selected={service === 'UNSURE'}>
              <input
                type="radio"
                checked={service === 'UNSURE'}
                onChange={() => setService('UNSURE')}
                name="grievance-service"
              />
              <span>
                <strong>{t('grievances.wizard.unsure')}</strong>
                <small>{t('grievances.wizard.unsureHelp')}</small>
              </span>
              <Check />
            </ChoiceCard>
          </ChoiceGroup>
          <StickyActions>
            <Button
              disabled={!service}
              onClick={() => setStep('describe')}
            >
              {t('common.continue')} <ArrowRight />
            </Button>
          </StickyActions>
        </>
      )}
      {step === 'describe' && (
        <>
          <FieldLabel htmlFor="grievance-description">
            {t('grievances.wizard.describeTitle')}
          </FieldLabel>
          <textarea
            id="grievance-description"
            className={textareaClass}
            value={description}
            placeholder={t('grievances.wizard.describePlaceholder')}
            onChange={(event) => setDescription(event.target.value)}
          />
          <StickyActions>
            <Button
              disabled={description.trim().length < 8}
              onClick={() => {
                if (!category)
                  setCategory(suggestCategory(effectiveService, description));
                setStep('category');
              }}
            >
              {t('grievances.wizard.describeContinue')} <ArrowRight />
            </Button>
          </StickyActions>
        </>
      )}
      {step === 'category' && (
        <>
          <Notice
            tone="info"
            icon={<CircleDot />}
          >
            {service === 'UNSURE' &&
              t('grievances.wizard.categoryDetectedService', {
                service: serviceLabel(t, effectiveService),
              })}
          </Notice>
          <ChoiceGroup legend={t('grievances.wizard.categoryTitle')}>
            {GRIEVANCE_CATEGORIES_BY_SERVICE[effectiveService].map((option) => (
              <ChoiceCard
                key={option}
                selected={category === option}
              >
                <input
                  type="radio"
                  checked={category === option}
                  onChange={() => setCategory(option)}
                  name="grievance-category"
                />
                <span>
                  <strong>{t(`grievances.categories.${option}.title`)}</strong>
                  <small>{t(`grievances.categories.${option}.help`)}</small>
                </span>
                <Check />
              </ChoiceCard>
            ))}
          </ChoiceGroup>
          <StickyActions>
            <Button
              disabled={!category}
              onClick={() => setStep('evidence')}
            >
              {t('common.continue')} <ArrowRight />
            </Button>
          </StickyActions>
        </>
      )}
      {step === 'evidence' && (
        <>
          <FieldLabel htmlFor="grievance-evidence">
            {t('grievances.wizard.evidenceTitle')}
          </FieldLabel>
          <div className="flex gap-2.5">
            <input
              id="grievance-evidence"
              className={inputClass}
              value={evidenceDraft}
              placeholder={t('grievances.wizard.evidencePlaceholder')}
              onChange={(event) => setEvidenceDraft(event.target.value)}
            />
            <Button
              variant="secondary"
              disabled={!evidenceDraft.trim()}
              onClick={() => {
                setEvidence((current) => [...current, evidenceDraft.trim()]);
                setEvidenceDraft('');
              }}
            >
              {t('grievances.wizard.evidenceAdd')}
            </Button>
          </div>
          <div className="mt-4.5 grid gap-2">
            {evidence.length === 0 ? (
              <p className="text-ink-muted">
                {t('grievances.wizard.evidenceEmpty')}
              </p>
            ) : (
              evidence.map((label, index) => (
                <div
                  key={`${label}-${index}`}
                  className="flex items-center justify-between gap-3 rounded-[9px] border border-border bg-surface px-3.5 py-2.5"
                >
                  <span>{label}</span>
                  <button
                    type="button"
                    aria-label={t('grievances.wizard.evidenceRemove')}
                    onClick={() =>
                      setEvidence((current) =>
                        current.filter((_, i) => i !== index),
                      )
                    }
                    className="grid size-8 cursor-pointer place-items-center rounded-full border-0 bg-transparent text-ink-muted"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))
            )}
          </div>
          <StickyActions>
            <Button onClick={() => setStep('review')}>
              {t('common.continue')} <ArrowRight />
            </Button>
          </StickyActions>
        </>
      )}
      {step === 'review' && category && (
        <>
          <ReviewList>
            <ReviewRow
              label={t('grievances.wizard.reviewService')}
              value={serviceLabel(t, effectiveService)}
            />
            <ReviewRow
              label={t('grievances.wizard.reviewCategory')}
              value={t(`grievances.categories.${category}.title`)}
            />
            <ReviewRow
              label={t('grievances.wizard.reviewEvidence')}
              value={
                evidence.length === 0
                  ? t('grievances.wizard.reviewEvidenceNone')
                  : t('grievances.wizard.reviewEvidenceCount', {
                      count: evidence.length,
                    })
              }
            />
          </ReviewList>
          <h3>{t('grievances.wizard.reviewDescription')}</h3>
          <p className="text-ink-muted">{description}</p>
          <Notice
            tone="info"
            icon={<Clock3 />}
          >
            {t(`grievances.process.${effectiveService}`)}
          </Notice>
          {error && <p className="text-danger">{error}</p>}
          <StickyActions>
            <Button onClick={() => void submit()}>
              {t('grievances.wizard.submit')} <ArrowRight />
            </Button>
          </StickyActions>
        </>
      )}
    </Page>
  );
}

export function GrievanceDetailPage() {
  const { t, i18n } = useTranslation();
  const { grievanceId } = useParams();
  const grievance = useAppStore((state) =>
    state.persona?.grievances.find((item) => item.id === grievanceId),
  );
  const refreshGrievanceStatus = useAppStore(
    (state) => state.refreshGrievanceStatus,
  );
  const escalateGrievance = useAppStore((state) => state.escalateGrievance);
  const [busy, setBusy] = useState(false);

  if (!grievance)
    return (
      <Navigate
        to="/grievances"
        replace
      />
    );

  const canRefresh =
    grievance.status !== 'DISPOSED' ||
    grievance.escalation?.status === 'IN_REVIEW';
  const canEscalate = isEscalationEligible(
    grievance.status,
    grievance.outcome,
    grievance.escalation,
  );

  return (
    <Page width="narrow">
      <PageHeader
        eyebrow={t('grievances.detail.eyebrow', {
          reference: grievance.reference,
        })}
        title={t(`grievances.categories.${grievance.category}.title`)}
        subtitle={t(`grievances.categories.${grievance.category}.help`)}
        back="/grievances"
      />
      <div className="mb-6 flex flex-wrap items-center gap-3 border-y border-border py-5">
        <Status kind={statusTone(grievance)}>
          {t(`grievances.status.${statusLabelKey(grievance)}`)}
        </Status>
        <span className="text-ink-muted">
          {serviceLabel(t, grievance.service)}
        </span>
      </div>
      <ReviewList>
        <ReviewRow
          label={t('grievances.detail.filedOn')}
          value={formatDate(grievance.submittedAt, i18n.language)}
        />
        <ReviewRow
          label={t('grievances.detail.category')}
          value={t(`grievances.categories.${grievance.category}.title`)}
        />
      </ReviewList>
      <Notice
        tone="neutral"
        title={t('grievances.detail.yourDescription')}
      >
        {grievance.description}
      </Notice>
      <h3 className="mt-6">{t('grievances.detail.evidence')}</h3>
      {grievance.evidence.length === 0 ? (
        <p className="text-ink-muted">{t('grievances.detail.evidenceNone')}</p>
      ) : (
        <ul>
          {grievance.evidence.map((item) => (
            <li key={item.id}>{item.label}</li>
          ))}
        </ul>
      )}
      <StatusCard
        tone={statusTone(grievance) === 'success' ? 'success' : 'info'}
        status={
          <Status kind={statusTone(grievance)}>
            {t(`grievances.status.${statusLabelKey(grievance)}`)}
          </Status>
        }
        title={t('grievances.detail.currentMeaning')}
      >
        {t(
          currentMeaningKey(
            grievance.status,
            grievance.outcome,
            grievance.escalation,
          ),
        )}
      </StatusCard>
      <StatusTimeline>
        {grievance.timeline.map((entry) => (
          <StatusTimelineItem
            key={entry.id}
            state="complete"
            icon={<Check />}
            title={t(`grievances.timeline.${entry.kind}`)}
            meta={formatDate(entry.occurredAt, i18n.language)}
          />
        ))}
      </StatusTimeline>
      {canEscalate && (
        <Notice
          tone="warning"
          icon={<Scale />}
        >
          {t('grievances.detail.escalateHelp')}
        </Notice>
      )}
      {grievance.escalation?.status === 'IN_REVIEW' && (
        <Notice tone="info">{t('grievances.detail.escalatedNotice')}</Notice>
      )}
      <StickyActions>
        {canEscalate && (
          <Button
            variant="secondary"
            disabled={busy}
            onClick={() => {
              setBusy(true);
              void escalateGrievance(grievance.id).finally(() =>
                setBusy(false),
              );
            }}
          >
            {busy
              ? t('grievances.detail.escalating')
              : t('grievances.detail.escalate')}
          </Button>
        )}
        {canRefresh && (
          <Button
            disabled={busy}
            onClick={() => {
              setBusy(true);
              void refreshGrievanceStatus(grievance.id).finally(() =>
                setBusy(false),
              );
            }}
          >
            {busy
              ? t('grievances.detail.checking')
              : t('grievances.detail.checkUpdates')}
          </Button>
        )}
      </StickyActions>
    </Page>
  );
}
