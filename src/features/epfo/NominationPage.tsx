import { useRef, useState, type ReactNode } from 'react';
import {
  ArrowRight,
  Check,
  Plus,
  Trash2,
  UserRound,
  UsersRound,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../../app/store';
import { formatDate } from '../../components/formatters';
import {
  Button,
  ButtonLink,
  LargeGlyph,
  Page,
  PageHeader,
  Status,
} from '../../components/ui';
import {
  ErrorSummary,
  FieldLabel,
  type FieldIssue,
  OtpInput,
  ValidationAlert,
} from '../../components/forms';
import {
  OutcomeMark,
  ReadinessBanner,
  ReferenceBand,
  ProgressState,
  StatusCard,
  StickyActions,
} from '../../components/patterns';
import { validateNomineeAllocation } from '../../rules/epfo';
import type { Nominee } from '../../types/domain';

type NominationStep =
  'status' | 'details' | 'allocation' | 'review' | 'submitting' | 'done';

const blankNominee = (index: number): Nominee => ({
  id: `nominee-${Date.now()}-${index}`,
  name: '',
  relationship: 'SPOUSE',
  dateOfBirth: '',
  share: 0,
});

export function NominationPage() {
  const { t, i18n } = useTranslation();
  const { persona, busy, saveNominationDraft, submitNomination } =
    useAppStore();
  const existing = persona?.epfo.nomination;
  const [step, setStep] = useState<NominationStep>(
    existing?.status === 'EFFECTIVE'
      ? 'status'
      : existing?.status === 'DRAFT'
        ? 'details'
        : 'status',
  );
  const [nominees, setNominees] = useState<Nominee[]>(
    existing?.nominees.length ? existing.nominees : [blankNominee(0)],
  );
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [detailIssues, setDetailIssues] = useState<FieldIssue[]>([]);
  const errorRef = useRef<HTMLDivElement>(null);
  if (!persona || !existing) return null;
  const allocation = validateNomineeAllocation(
    nominees.map((nominee) => nominee.share),
  );

  function update(index: number, patch: Partial<Nominee>) {
    setNominees((items) =>
      items.map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...patch } : item,
      ),
    );
  }
  function remove(index: number) {
    setNominees((items) => items.filter((_, itemIndex) => itemIndex !== index));
  }
  async function continueToAllocation() {
    const issues: FieldIssue[] = [];
    nominees.forEach((nominee, index) => {
      if (!nominee.name.trim())
        issues.push({
          id: `nominee-name-${index}`,
          message: t('epfo.nomination.issueMissingName', {
            number: index + 1,
          }),
        });
      if (!nominee.dateOfBirth)
        issues.push({
          id: `nominee-dob-${index}`,
          message: t('epfo.nomination.issueMissingDob', {
            number: index + 1,
          }),
        });
    });
    if (issues.length) {
      setDetailIssues(issues);
      queueMicrotask(() => errorRef.current?.focus());
      return;
    }
    setDetailIssues([]);
    await saveNominationDraft(nominees);
    setStep('allocation');
  }
  async function continueToReview() {
    if (!allocation.valid) {
      setError(
        t('epfo.nomination.allocationError', { total: allocation.total }),
      );
      queueMicrotask(() => errorRef.current?.focus());
      return;
    }
    setError('');
    await saveNominationDraft(nominees);
    setStep('review');
  }
  async function submit() {
    if (otp !== '123456') {
      setError(t('epfo.nomination.otpError'));
      queueMicrotask(() => errorRef.current?.focus());
      return;
    }
    setError('');
    setStep('submitting');
    try {
      await submitNomination(nominees, otp);
      setStep('done');
    } catch {
      setError(t('epfo.nomination.submitFailed'));
      setStep('review');
    }
  }

  if (step === 'done') return <NominationComplete />;
  return (
    <Page
      width="narrow"
      mode="journey"
    >
      <PageHeader
        eyebrow={t('epfo.nomination.eyebrow')}
        title={t('epfo.nomination.title')}
        subtitle={t('epfo.nomination.subtitle')}
        back="/epfo"
      />
      {step === 'status' && (
        <section>
          <LargeGlyph
            className="mb-4"
            icon={<UsersRound />}
          />
          <Status
            kind={existing.status === 'EFFECTIVE' ? 'success' : 'warning'}
          >
            {t(`epfo.nomination.status.${existing.status.toLowerCase()}`)}
          </Status>
          <h2 className="mt-2.5 mb-1.25">
            {t(
              existing.status === 'EFFECTIVE'
                ? 'epfo.nomination.effectiveTitle'
                : 'epfo.nomination.emptyTitle',
            )}
          </h2>
          <p className="text-ink-muted">
            {t(
              existing.status === 'EFFECTIVE'
                ? 'epfo.nomination.effectiveHelp'
                : 'epfo.nomination.emptyHelp',
            )}
          </p>
          {existing.status === 'EFFECTIVE' && (
            <NomineeSummary>
              {existing.nominees.map((nominee) => (
                <NomineeSummaryRow
                  key={nominee.id}
                  icon={<UserRound />}
                  name={nominee.name}
                  detail={t(
                    `epfo.nomination.relationship.${nominee.relationship.toLowerCase()}`,
                  )}
                  share={`${nominee.share}%`}
                />
              ))}
            </NomineeSummary>
          )}
          <StickyActions status={existing.reference ?? t('common.saved')}>
            <Button onClick={() => setStep('details')}>
              {t(
                existing.status === 'EFFECTIVE'
                  ? 'epfo.nomination.update'
                  : 'epfo.nomination.start',
              )}
              <ArrowRight />
            </Button>
          </StickyActions>
        </section>
      )}
      {step === 'details' && (
        <section>
          <h2>{t('epfo.nomination.detailsTitle')}</h2>
          <p className="text-ink-muted">{t('epfo.nomination.detailsHelp')}</p>
          <ErrorSummary
            ref={errorRef}
            issues={detailIssues}
          />
          <div className="grid gap-4">
            {nominees.map((nominee, index) => (
              <NomineeForm
                key={nominee.id}
                legend={t('epfo.nomination.nomineeNumber', {
                  number: index + 1,
                })}
              >
                <label htmlFor={`nominee-name-${index}`}>
                  {t('epfo.nomination.name')}
                </label>
                <input
                  id={`nominee-name-${index}`}
                  className="min-h-11.5 rounded-[7px] border border-border bg-surface px-2.5 py-2 text-ink [font:inherit]"
                  value={nominee.name}
                  onChange={(event) =>
                    update(index, { name: event.target.value })
                  }
                />
                <label htmlFor={`nominee-relation-${index}`}>
                  {t('epfo.nomination.relationshipLabel')}
                </label>
                <select
                  id={`nominee-relation-${index}`}
                  className="min-h-11.5 rounded-[7px] border border-border bg-surface px-2.5 py-2 text-ink [font:inherit]"
                  value={nominee.relationship}
                  onChange={(event) =>
                    update(index, {
                      relationship: event.target
                        .value as Nominee['relationship'],
                    })
                  }
                >
                  <option value="SPOUSE">
                    {t('epfo.nomination.relationship.spouse')}
                  </option>
                  <option value="CHILD">
                    {t('epfo.nomination.relationship.child')}
                  </option>
                  <option value="PARENT">
                    {t('epfo.nomination.relationship.parent')}
                  </option>
                  <option value="OTHER">
                    {t('epfo.nomination.relationship.other')}
                  </option>
                </select>
                <label htmlFor={`nominee-dob-${index}`}>
                  {t('epfo.nomination.dob')}
                </label>
                <input
                  id={`nominee-dob-${index}`}
                  type="date"
                  className="min-h-11.5 rounded-[7px] border border-border bg-surface px-2.5 py-2 text-ink [font:inherit]"
                  value={nominee.dateOfBirth}
                  max="2010-12-31"
                  onChange={(event) =>
                    update(index, { dateOfBirth: event.target.value })
                  }
                />
                {nominees.length > 1 && (
                  <Button
                    variant="danger"
                    size="compact"
                    className="col-start-2 justify-self-start max-[599px]:col-start-1"
                    onClick={() => remove(index)}
                  >
                    <Trash2 />
                    {t('epfo.nomination.remove')}
                  </Button>
                )}
              </NomineeForm>
            ))}
          </div>
          <Button
            variant="secondary"
            className="mt-3.5"
            onClick={() =>
              setNominees((items) => [...items, blankNominee(items.length)])
            }
          >
            <Plus />
            {t('epfo.nomination.add')}
          </Button>
          <StickyActions>
            <Button
              variant="secondary"
              onClick={() => setStep('status')}
            >
              {t('common.back')}
            </Button>
            <Button onClick={() => void continueToAllocation()}>
              {t('epfo.nomination.allocate')}
              <ArrowRight />
            </Button>
          </StickyActions>
        </section>
      )}
      {step === 'allocation' && (
        <section>
          <h2>{t('epfo.nomination.allocationTitle')}</h2>
          <p className="text-ink-muted">
            {t('epfo.nomination.allocationHelp')}
          </p>
          {error && <ValidationAlert ref={errorRef}>{error}</ValidationAlert>}
          <div
            className="my-5.5 grid grid-cols-[1fr_auto_auto] items-center gap-4 border-y border-border py-4.5 max-[599px]:grid-cols-[1fr_auto]"
            aria-live="polite"
          >
            <span>{t('epfo.nomination.total')}</span>
            <strong className="text-[2rem] [font-variant-numeric:tabular-nums]">
              {allocation.total}%
            </strong>
            <Status kind={allocation.valid ? 'success' : 'danger'}>
              {t(
                allocation.valid
                  ? 'epfo.nomination.exact'
                  : 'epfo.nomination.mustEqual',
              )}
            </Status>
          </div>
          <div className="border-t border-border">
            {nominees.map((nominee, index) => (
              <AllocationRow
                key={nominee.id}
                htmlFor={`share-${index}`}
                name={nominee.name}
                relationship={t(
                  `epfo.nomination.relationship.${nominee.relationship.toLowerCase()}`,
                )}
              >
                <span className="grid h-12 grid-cols-[1fr_38px] overflow-hidden rounded-lg border border-border bg-surface">
                  <input
                    id={`share-${index}`}
                    type="number"
                    min="0"
                    max="100"
                    value={nominee.share}
                    aria-describedby="allocation-help"
                    className="min-w-0 border-0 px-2 text-right text-[1.15rem] [font:inherit]"
                    onChange={(event) =>
                      update(index, { share: Number(event.target.value) })
                    }
                  />
                  <b className="grid place-items-center bg-surface-muted">%</b>
                </span>
              </AllocationRow>
            ))}
          </div>
          <p
            id="allocation-help"
            className="text-ink-muted"
          >
            {t('epfo.nomination.exactHelp')}
          </p>
          <StickyActions>
            <Button
              variant="secondary"
              onClick={() => setStep('details')}
            >
              {t('common.back')}
            </Button>
            <Button onClick={() => void continueToReview()}>
              {t('epfo.nomination.review')}
              <ArrowRight />
            </Button>
          </StickyActions>
        </section>
      )}
      {step === 'review' && (
        <section>
          <h2>{t('epfo.nomination.reviewTitle')}</h2>
          {error && <ValidationAlert ref={errorRef}>{error}</ValidationAlert>}
          <NomineeSummary>
            {nominees.map((nominee) => (
              <NomineeSummaryRow
                key={nominee.id}
                icon={<UserRound />}
                name={nominee.name}
                detail={
                  <>
                    {t(
                      `epfo.nomination.relationship.${nominee.relationship.toLowerCase()}`,
                    )}{' '}
                    · {formatDate(nominee.dateOfBirth, i18n.language)}
                  </>
                }
                share={`${nominee.share}%`}
              />
            ))}
          </NomineeSummary>
          <ReadinessBanner
            state="ready"
            icon={<Check />}
            status={
              <Status kind="success">{t('epfo.nomination.ready')}</Status>
            }
            title={t('epfo.nomination.totalHundred')}
            description={t('epfo.nomination.verifyHelp')}
          />
          <FieldLabel
            htmlFor="nomination-otp"
            hint={t('epfo.otpHint')}
          >
            {t('epfo.otp')}
          </FieldLabel>
          <OtpInput
            id="nomination-otp"
            value={otp}
            onChange={setOtp}
          />
          <StickyActions>
            <Button
              variant="secondary"
              onClick={() => setStep('allocation')}
            >
              {t('common.back')}
            </Button>
            <Button
              disabled={busy}
              onClick={() => void submit()}
            >
              {t('epfo.nomination.verify')}
              <ArrowRight />
            </Button>
          </StickyActions>
        </section>
      )}
      {step === 'submitting' && (
        <ProgressState
          title={t('epfo.nomination.submitting')}
          description={t('epfo.nomination.submittingHelp')}
        />
      )}
    </Page>
  );
}

function NomineeSummary({ children }: { children: ReactNode }) {
  return <div className="my-5.5 border-t border-border">{children}</div>;
}

function NomineeSummaryRow({
  icon,
  name,
  detail,
  share,
}: {
  icon: ReactNode;
  name: ReactNode;
  detail: ReactNode;
  share: ReactNode;
}) {
  return (
    <div className="grid min-h-19 grid-cols-[38px_1fr_auto] items-center gap-3 border-b border-border [&>svg]:text-primary">
      {icon}
      <span className="grid">
        <strong>{name}</strong>
        <small className="text-ink-muted">{detail}</small>
      </span>
      <b className="text-[1.15rem] [font-variant-numeric:tabular-nums]">
        {share}
      </b>
    </div>
  );
}

function NomineeForm({
  legend,
  children,
}: {
  legend: ReactNode;
  children: ReactNode;
}) {
  return (
    <fieldset className="grid grid-cols-[1fr_1.5fr] gap-x-4 gap-y-2.5 rounded-[var(--radius-sheet)] border border-border bg-surface p-4.5 max-[599px]:grid-cols-1 [&>label]:self-center [&>label]:font-[650]">
      <legend className="px-2 font-[750]">{legend}</legend>
      {children}
    </fieldset>
  );
}

function AllocationRow({
  htmlFor,
  name,
  relationship,
  children,
}: {
  htmlFor: string;
  name: ReactNode;
  relationship: ReactNode;
  children: ReactNode;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="grid min-h-20.5 grid-cols-[1fr_130px] items-center gap-3.75 border-b border-border max-[599px]:grid-cols-[1fr_105px]"
    >
      <span className="grid">
        <strong>{name}</strong>
        <small className="text-ink-muted">{relationship}</small>
      </span>
      {children}
    </label>
  );
}

function NominationComplete() {
  const { t, i18n } = useTranslation();
  const nomination = useAppStore((state) => state.persona?.epfo.nomination);
  if (!nomination) return null;
  return (
    <Page
      width="narrow"
      mode="completion"
    >
      <PageHeader
        eyebrow={t('epfo.nomination.completeEyebrow')}
        title={t('epfo.nomination.completeTitle')}
        subtitle={t('epfo.nomination.completeHelp')}
        back="/epfo"
      />
      <OutcomeMark icon={<Check />} />
      <ReferenceBand
        label={t('epfo.nomination.reference')}
        reference={nomination.reference}
        meta={t('epfo.nomination.effectiveOn', {
          date: formatDate(nomination.updatedAt, i18n.language),
        })}
      />
      <StatusCard
        tone="success"
        status={
          <Status kind="success">
            {t('epfo.nomination.status.effective')}
          </Status>
        }
        title={t('epfo.nomination.legallyRecorded')}
      >
        {t('epfo.nomination.prototype')}
      </StatusCard>
      <ButtonLink
        wide
        to="/epfo/history"
      >
        {t('epfo.nomination.viewHistory')}
        <ArrowRight />
      </ButtonLink>
    </Page>
  );
}
