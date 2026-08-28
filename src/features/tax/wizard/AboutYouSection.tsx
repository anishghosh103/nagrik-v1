import { useTranslation } from 'react-i18next';
import { useAppStore } from '../../../app/store';
import { ChoiceCard, ChoiceGroup, FieldLabel } from '../../../components/forms';
import { Notice } from '../../../components/patterns';
import { SectionHeading } from '../../../components/ui';
import type {
  EligibilityAnswers,
  ResidentialStatus,
  ReturnDraft,
  ValidationIssue,
} from '../../../types/tax';

const inputClass =
  'h-12 w-full rounded-[9px] border border-border bg-surface px-3.5 [font-variant-numeric:tabular-nums]';

export function AboutYouSection({
  draft,
  setDraft,
  issues,
}: {
  draft: ReturnDraft;
  setDraft: (next: ReturnDraft) => void;
  issues: ValidationIssue[] | null;
}) {
  const { t } = useTranslation();
  const persona = useAppStore((state) => state.persona);
  const answers = draft.eligibilityAnswers;
  const routeUnsupported = (issues ?? []).some(
    (issue) => issue.code === 'FILING_ROUTE_NOT_SUPPORTED',
  );

  function updateAnswers(patch: Partial<EligibilityAnswers>) {
    const nextAnswers = { ...answers, ...patch };
    setDraft({
      ...draft,
      eligibilityAnswers: nextAnswers,
      residentialStatus: nextAnswers.residentialStatus,
      computation: null,
    });
  }

  return (
    <section
      id="about-you"
      tabIndex={-1}
    >
      <SectionHeading title={t('tax.aboutYou.title')} />
      <p className="text-ink-muted">{t('tax.aboutYou.subtitle')}</p>
      {persona && (
        <p className="text-ink-muted">
          {t('tax.aboutYou.taxpayer', { name: persona.profile.fullName })} ·{' '}
          {t('tax.aboutYou.pan', { pan: persona.profile.maskedPan })}
        </p>
      )}
      <div className="mb-4">
        <FieldLabel
          htmlFor="filing-date"
          hint={t('tax.aboutYou.dueDate')}
        >
          {t('tax.aboutYou.filingDateLabel')}
        </FieldLabel>
        <input
          id="filing-date"
          type="date"
          min="2026-04-01"
          max="2026-12-31"
          value={draft.filingDate}
          onChange={(event) =>
            setDraft({
              ...draft,
              filingDate: event.target.value,
              computation: null,
            })
          }
          className={inputClass}
        />
      </div>
      <ChoiceGroup legend={t('tax.aboutYou.residencyLegend')}>
        {(
          [
            ['RESIDENT', t('tax.aboutYou.residentOption')],
            ['RNOR', t('tax.aboutYou.rnorOption')],
            ['NON_RESIDENT', t('tax.aboutYou.nonResidentOption')],
            ['NOT_SURE', t('tax.aboutYou.notSureOption')],
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
              onChange={() => updateAnswers({ residentialStatus: value })}
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
          className="mt-2"
        >
          {t('tax.aboutYou.notSureHelp')}
        </Notice>
      )}
      {/* <details className="my-5 rounded-lg border border-border bg-surface-muted p-4">
        <summary className="cursor-pointer font-bold">
          {t('tax.aboutYou.specialTitle')}
          {specialCount > 0 && (
            <span className="ml-2 font-normal text-ink-muted">
              ({specialCount})
            </span>
          )}
        </summary>
        <p className="text-ink-muted">{t('tax.aboutYou.specialSubtitle')}</p>
        <div className="grid gap-2.5">
          {(
            [
              ['isDirector', t('tax.aboutYou.director')],
              ['holdsUnlistedShares', t('tax.aboutYou.unlistedShares')],
              ['hasForeignAssetsOrIncome', t('tax.aboutYou.foreign')],
              ['hasDeferredEsopTax', t('tax.aboutYou.esop')],
              ['hasCarryForwardLoss', t('tax.aboutYou.carryForwardLoss')],
              ['expectsIncomeAboveFiftyLakh', t('tax.aboutYou.aboveFiftyLakh')],
              ['hasSpecialCategoryIncome', t('tax.aboutYou.specialCategory')],
              [
                'hasIncomeBelongingToAnotherPerson',
                t('tax.aboutYou.anotherPerson'),
              ],
              [
                'hasUnclassifiableIncomeSource',
                t('tax.aboutYou.unclassifiable'),
              ],
            ] as [keyof EligibilityAnswers, string][]
          ).map(([key, label]) => (
            <label
              key={key}
              className="grid cursor-pointer grid-cols-[22px_1fr] items-center gap-3 rounded-lg bg-surface p-3.5"
            >
              <input
                type="checkbox"
                checked={Boolean(answers[key])}
                onChange={(event) =>
                  updateAnswers({
                    [key]: event.target.checked,
                  } as Partial<EligibilityAnswers>)
                }
                className="size-4.5 accent-primary"
              />
              <span>{label}</span>
            </label>
          ))}
        </div>
        <FieldLabel htmlFor="agri-income">
          {t('tax.aboutYou.agriculturalIncome')}
        </FieldLabel>
        <input
          id="agri-income"
          type="number"
          min={0}
          value={answers.agriculturalIncomeAmount}
          onChange={(event) =>
            updateAnswers({
              agriculturalIncomeAmount: Number(event.target.value),
            })
          }
          className={inputClass}
        />
      </details> */}
      {routeUnsupported && (
        <Notice
          tone="warning"
          title={t('tax.validation.routeUnsupportedTitle')}
          className="mt-2"
        >
          {t('tax.validation.routeUnsupportedMessage')}
        </Notice>
      )}
    </section>
  );
}
