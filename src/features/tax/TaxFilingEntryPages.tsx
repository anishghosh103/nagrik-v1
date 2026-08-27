import { useState } from 'react';
import { ArrowRight, FileWarning, ShieldQuestion } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../app/store';
import {
  Button,
  Page,
  PageHeader,
  SourceMarker,
  Status,
} from '../../components/ui';
import { ChoiceCard, ChoiceGroup, FieldLabel } from '../../components/forms';
import {
  Notice,
  ProgressState,
  StepProgress,
  StickyActions,
} from '../../components/patterns';
import { useReturnDraft } from './useReturnDraft';
import { markSectionComplete } from './taxDraft';
import { isRouteSupportedInThisBuild } from '../../rules/tax';
import type {
  EligibilityAnswers,
  FilingRoute,
  ResidentialStatus,
  ReturnDraft,
} from '../../types/tax';

type EntryStep = 'entry' | 'eligibility' | 'routed' | 'unsupported';

export function TaxFilingEntryPages() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const persona = useAppStore((state) => state.persona);
  const determineFilingRoute = useAppStore(
    (state) => state.determineFilingRoute,
  );
  const { draft, loading, save } = useReturnDraft();
  const [step, setStep] = useState<EntryStep>('entry');
  const [answers, setAnswers] = useState<EligibilityAnswers | null>(null);
  const [route, setRoute] = useState<FilingRoute | null>(null);
  const [checking, setChecking] = useState(false);
  const [syncedDraft, setSyncedDraft] = useState<ReturnDraft | null>(null);

  if (draft && draft !== syncedDraft) {
    setSyncedDraft(draft);
    setAnswers(draft.eligibilityAnswers);
  }

  if (!persona || loading || !draft || !answers)
    return <ProgressState title={t('tax.entry.loading')} />;

  function updateAnswer<K extends keyof EligibilityAnswers>(
    key: K,
    value: EligibilityAnswers[K],
  ) {
    setAnswers((current) => (current ? { ...current, [key]: value } : current));
  }

  async function runEligibilityCheck() {
    if (!answers || !draft) return;
    setChecking(true);
    const patched = { ...draft, eligibilityAnswers: answers };
    const resolvedRoute = await determineFilingRoute(patched);
    setRoute(resolvedRoute);
    setChecking(false);
    if (isRouteSupportedInThisBuild(resolvedRoute)) {
      await save(
        markSectionComplete(
          { ...patched, filingRoute: resolvedRoute },
          'ELIGIBILITY',
        ),
      );
      setStep('routed');
    } else {
      await save({ ...patched, filingRoute: resolvedRoute });
      setStep('unsupported');
    }
  }

  return (
    <Page
      width="narrow"
      mode="journey"
    >
      <PageHeader
        eyebrow={t('tax.entry.eyebrow')}
        title={t('tax.entry.title')}
        subtitle={t('tax.entry.subtitle')}
        back="/tax"
      />
      <StepProgress
        current={step === 'entry' ? 1 : 2}
        total={2}
      />
      {step === 'entry' && (
        <section>
          <p className="text-ink-muted">{t('tax.entry.confirmHelp')}</p>
          <SourceMarker>
            {t('tax.entry.assessmentYear', { ay: draft.assessmentYear })}
          </SourceMarker>
          <p className="mt-3.5">
            {t('tax.entry.taxpayer', { name: persona.profile.fullName })}
          </p>
          <p className="text-ink-muted">
            {t('tax.entry.pan', { pan: persona.profile.maskedPan })}
          </p>
          <FieldLabel
            htmlFor="filing-date"
            hint={t('tax.entry.dueDate')}
          >
            {t('tax.entry.filingDate')}
          </FieldLabel>
          <input
            id="filing-date"
            type="date"
            min="2026-04-01"
            max="2026-12-31"
            value={draft.filingDate}
            onChange={(event) =>
              void save({
                ...draft,
                filingDate: event.target.value,
                computation: null,
              })
            }
            className="h-12 w-full rounded-[9px] border border-border bg-surface px-3.5"
          />
          <StickyActions>
            <Button onClick={() => setStep('eligibility')}>
              {t('tax.entry.start')}
              <ArrowRight />
            </Button>
          </StickyActions>
        </section>
      )}
      {step === 'eligibility' && answers && (
        <section>
          <h2>{t('tax.eligibility.residencyQuestion')}</h2>
          <ChoiceGroup legend={t('tax.eligibility.residencyLegend')}>
            {(
              [
                ['RESIDENT', t('tax.eligibility.resident')],
                ['RNOR', t('tax.eligibility.rnor')],
                ['NON_RESIDENT', t('tax.eligibility.nonResident')],
                ['NOT_SURE', t('tax.eligibility.notSure')],
              ] as [ResidentialStatus, string][]
            ).map(([value, label]) => (
              <ChoiceCard
                key={value}
                selected={answers.residentialStatus === value}
              >
                <input
                  type="radio"
                  name="residency"
                  checked={answers.residentialStatus === value}
                  onChange={() => updateAnswer('residentialStatus', value)}
                />
                <span>
                  <strong>{label}</strong>
                </span>
              </ChoiceCard>
            ))}
          </ChoiceGroup>
          {answers.residentialStatus === 'NOT_SURE' && (
            <Notice
              tone="info"
              title={t('tax.eligibility.notSureTitle')}
            >
              {t('tax.eligibility.notSureHelp')}
            </Notice>
          )}
          <h2>{t('tax.eligibility.specialQuestion')}</h2>
          <div className="grid gap-2.5">
            {(
              [
                ['isDirector', t('tax.eligibility.director')],
                ['holdsUnlistedShares', t('tax.eligibility.unlistedShares')],
                ['hasForeignAssetsOrIncome', t('tax.eligibility.foreign')],
                ['hasDeferredEsopTax', t('tax.eligibility.esop')],
                ['hasCarryForwardLoss', t('tax.eligibility.carryForwardLoss')],
                [
                  'expectsIncomeAboveFiftyLakh',
                  t('tax.eligibility.aboveFiftyLakh'),
                ],
                [
                  'hasSpecialCategoryIncome',
                  t('tax.eligibility.specialCategory'),
                ],
                [
                  'hasIncomeBelongingToAnotherPerson',
                  t('tax.eligibility.anotherPerson'),
                ],
                [
                  'hasUnclassifiableIncomeSource',
                  t('tax.eligibility.unclassifiable'),
                ],
              ] as [keyof EligibilityAnswers, string][]
            ).map(([key, label]) => (
              <label
                key={key}
                className="grid cursor-pointer grid-cols-[22px_1fr] items-center gap-3 rounded-lg bg-surface-muted p-3.5"
              >
                <input
                  type="checkbox"
                  checked={Boolean(answers[key])}
                  onChange={(event) =>
                    updateAnswer(
                      key,
                      event.target.checked as EligibilityAnswers[typeof key],
                    )
                  }
                  className="size-4.5 accent-primary"
                />
                <span>{label}</span>
              </label>
            ))}
          </div>
          <FieldLabel htmlFor="agri-income">
            {t('tax.eligibility.agriculturalIncome')}
          </FieldLabel>
          <input
            id="agri-income"
            type="number"
            min={0}
            value={answers.agriculturalIncomeAmount}
            onChange={(event) =>
              updateAnswer(
                'agriculturalIncomeAmount',
                Number(event.target.value),
              )
            }
            className="h-12 w-full rounded-[9px] border border-border bg-surface px-3.5 [font-variant-numeric:tabular-nums]"
          />
          <StickyActions>
            <Button
              variant="secondary"
              onClick={() => setStep('entry')}
            >
              {t('common.back')}
            </Button>
            <Button
              disabled={checking}
              onClick={() => void runEligibilityCheck()}
            >
              {t('tax.eligibility.continue')}
              <ArrowRight />
            </Button>
          </StickyActions>
        </section>
      )}
      {step === 'routed' && route && (
        <section className="text-center">
          <ShieldQuestion className="mx-auto mb-4.5 size-13.5 text-primary" />
          <Status kind="success">{t('tax.routed.status')}</Status>
          <h2 className="mt-2.25 mb-1.25">{t('tax.routed.title')}</h2>
          <p className="text-ink-muted">{t('tax.routed.subtitle')}</p>
          <details className="my-5 border-y border-border py-3.5 text-left">
            <summary>{t('tax.routed.why')}</summary>
            <p className="text-ink-muted">{t('tax.routed.route', { route })}</p>
          </details>
          <Button
            wide
            onClick={() => navigate('/tax/file/income')}
          >
            {t('common.continue')}
            <ArrowRight />
          </Button>
        </section>
      )}
      {step === 'unsupported' && route && (
        <section className="grid grid-cols-[52px_1fr] gap-4.5 rounded-[var(--radius-sheet)] border border-[#ddb9ad] bg-[#fff3ef] p-5.5 [&>svg]:size-10.5 [&>svg]:text-danger">
          <FileWarning />
          <div>
            <Status kind="danger">{t('tax.unsupported.status')}</Status>
            <h2 className="mt-2.25 mb-1.25">{t('tax.unsupported.title')}</h2>
            <p className="m-0 text-ink-muted">{t('tax.unsupported.body')}</p>
          </div>
        </section>
      )}
    </Page>
  );
}
