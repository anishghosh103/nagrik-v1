import {
  AlertTriangle,
  ArrowRight,
  Check,
  CircleDot,
  Landmark,
  LoaderCircle,
  RefreshCw,
} from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../../app/store';
import { cn } from '../../components/cn';
import { formatDate, formatMoney } from '../../components/formatters';
import {
  Button,
  ButtonLink,
  Page,
  PageHeader,
  SourceMarker,
  Status,
} from '../../components/ui';
import {
  BalanceSummary,
  DetailSheet,
  IssueExplanation,
  Notice,
  ReviewList,
  ReviewRow,
} from '../../components/patterns';
import type { MonthlyContribution } from '../../types/domain';

export function PassbookPage() {
  const { t, i18n } = useTranslation();
  const { persona, online, refreshPassbook } = useAppStore();
  const [refreshing, setRefreshing] = useState(false);
  const [refreshFailed, setRefreshFailed] = useState(false);
  const [selected, setSelected] = useState<MonthlyContribution | null>(null);
  const attempted = useRef(false);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    setRefreshFailed(false);
    try {
      await refreshPassbook();
    } catch {
      setRefreshFailed(true);
    } finally {
      setRefreshing(false);
    }
  }, [refreshPassbook]);
  useEffect(() => {
    if (!attempted.current && online) {
      attempted.current = true;
      void refresh();
    }
  }, [online, refresh]);
  if (!persona) return null;
  const passbook = persona.epfo.passbook;
  return (
    <Page>
      <PageHeader
        eyebrow={t('epfo.passbook.eyebrow')}
        title={t('epfo.passbook.title')}
        subtitle={t('epfo.passbook.subtitle')}
        back="/epfo"
      />
      <BalanceSummary
        label={t('epfo.passbook.total')}
        amount={formatMoney(persona.epfo.balance, i18n.language)}
        meta={t('epfo.passbook.captured', {
          date: formatDate(passbook.capturedAt, i18n.language),
        })}
        action={
          <Button
            variant="secondary"
            disabled={refreshing || !online}
            onClick={() => void refresh()}
          >
            {refreshing ? (
              <LoaderCircle className="animate-spin" />
            ) : (
              <RefreshCw />
            )}
            {t(
              refreshing ? 'epfo.passbook.refreshing' : 'epfo.passbook.refresh',
            )}
          </Button>
        }
      />
      {!online && (
        <Notice
          tone="info"
          icon={<CircleDot />}
          title={t('epfo.passbook.offline')}
        >
          {t('epfo.passbook.offlineHelp')}
        </Notice>
      )}
      {refreshFailed && (
        <Notice
          tone="warning"
          icon={<AlertTriangle />}
          title={t('epfo.passbook.failed')}
          actions={
            <Button
              variant="text"
              onClick={() => void refresh()}
            >
              {t('common.retry')}
            </Button>
          }
        >
          {t('epfo.passbook.failedHelp')}
        </Notice>
      )}
      {passbook.employers.map((employer) => {
        const total =
          employer.openingBalance +
          employer.contributions.reduce(
            (sum, item) => sum + item.employee + item.employer,
            0,
          );
        return (
          <section
            className="mt-8.5"
            key={employer.employmentId}
          >
            <div className="mb-3 flex items-end justify-between gap-4.5 max-[599px]:items-start">
              <div className="flex items-center gap-3 [&>svg]:text-primary">
                <Landmark />
                <span className="grid gap-0.75">
                  <h2 className="m-0">{employer.employer}</h2>
                  <SourceMarker>{t('epfo.passbook.memberSource')}</SourceMarker>
                </span>
              </div>
              <div className="grid gap-0.75 text-right">
                <small className="text-ink-muted">
                  {t('epfo.passbook.employerTotal')}
                </small>
                <strong className="text-[1.3rem] [font-variant-numeric:tabular-nums]">
                  {formatMoney(total, i18n.language)}
                </strong>
              </div>
            </div>
            <div className="overflow-x-auto rounded-[var(--radius-sheet)] border border-border bg-surface max-[599px]:overflow-visible max-[599px]:border-0 max-[599px]:bg-transparent">
              <table className="w-full border-collapse [min-width:720px] max-[599px]:[min-width:0]">
                <caption className="bg-surface-muted px-4 py-3.5 text-left font-bold">
                  {t('epfo.passbook.caption', { employer: employer.employer })}
                </caption>
                <thead className="max-[599px]:absolute max-[599px]:h-px max-[599px]:w-px max-[599px]:overflow-hidden max-[599px]:[clip:rect(0,_0,_0,_0)]">
                  <tr>
                    <th
                      scope="col"
                      className="border-t border-border px-3.25 py-3.5 text-left text-[0.77rem] text-ink-muted"
                    >
                      {t('epfo.passbook.month')}
                    </th>
                    <th
                      scope="col"
                      className="border-t border-border px-3.25 py-3.5 text-right text-[0.77rem] text-ink-muted"
                    >
                      {t('epfo.passbook.employee')}
                    </th>
                    <th
                      scope="col"
                      className="border-t border-border px-3.25 py-3.5 text-right text-[0.77rem] text-ink-muted"
                    >
                      {t('epfo.passbook.employer')}
                    </th>
                    <th
                      scope="col"
                      className="border-t border-border px-3.25 py-3.5 text-right text-[0.77rem] text-ink-muted"
                    >
                      {t('epfo.passbook.pension')}
                    </th>
                    <th
                      scope="col"
                      className="border-t border-border px-3.25 py-3.5 text-right text-[0.77rem] text-ink-muted"
                    >
                      {t('epfo.passbook.state')}
                    </th>
                  </tr>
                </thead>
                <tbody className="max-[599px]:grid max-[599px]:gap-2.5">
                  {employer.contributions.map((item) => (
                    <tr
                      key={item.id}
                      className={cn(
                        item.status === 'MISSING' && 'bg-[#fff8f1]',
                        'max-[599px]:grid max-[599px]:grid-cols-2 max-[599px]:rounded-lg max-[599px]:border max-[599px]:border-border max-[599px]:bg-surface max-[599px]:p-3',
                      )}
                    >
                      <th
                        scope="row"
                        className="border-t border-border px-3.25 py-3.5 text-left [font-variant-numeric:tabular-nums] max-[599px]:col-span-full max-[599px]:grid max-[599px]:border-t-0 max-[599px]:border-b max-[599px]:border-border max-[599px]:py-2"
                      >
                        {formatDate(item.month, i18n.language)}
                      </th>
                      <td
                        data-label={t('epfo.passbook.employee')}
                        className="border-t border-border px-3.25 py-3.5 text-right [font-variant-numeric:tabular-nums] max-[599px]:grid max-[599px]:border-t-0 max-[599px]:py-2 max-[599px]:before:text-[0.73rem] max-[599px]:before:font-medium max-[599px]:before:text-ink-muted max-[599px]:before:content-[attr(data-label)]"
                      >
                        {formatMoney(item.employee, i18n.language)}
                      </td>
                      <td
                        data-label={t('epfo.passbook.employer')}
                        className="border-t border-border px-3.25 py-3.5 text-right [font-variant-numeric:tabular-nums] max-[599px]:grid max-[599px]:border-t-0 max-[599px]:py-2 max-[599px]:before:text-[0.73rem] max-[599px]:before:font-medium max-[599px]:before:text-ink-muted max-[599px]:before:content-[attr(data-label)]"
                      >
                        {formatMoney(item.employer, i18n.language)}
                      </td>
                      <td
                        data-label={t('epfo.passbook.pension')}
                        className="border-t border-border px-3.25 py-3.5 text-right [font-variant-numeric:tabular-nums] max-[599px]:grid max-[599px]:border-t-0 max-[599px]:py-2 max-[599px]:before:text-[0.73rem] max-[599px]:before:font-medium max-[599px]:before:text-ink-muted max-[599px]:before:content-[attr(data-label)]"
                      >
                        {formatMoney(item.pension, i18n.language)}
                      </td>
                      <td
                        data-label={t('epfo.passbook.state')}
                        className="border-t border-border px-3.25 py-3.5 text-right [font-variant-numeric:tabular-nums] max-[599px]:grid max-[599px]:border-t-0 max-[599px]:py-2 max-[599px]:before:text-[0.73rem] max-[599px]:before:font-medium max-[599px]:before:text-ink-muted max-[599px]:before:content-[attr(data-label)]"
                      >
                        <Button
                          variant="text"
                          size="compact"
                          onClick={() => setSelected(item)}
                        >
                          <Status
                            kind={
                              item.status === 'POSTED' ? 'success' : 'warning'
                            }
                          >
                            {t(
                              item.status === 'POSTED'
                                ? 'epfo.passbook.posted'
                                : 'epfo.passbook.missing',
                            )}
                          </Status>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="max-[599px]:mt-2.5 max-[599px]:block">
                  <tr className="max-[599px]:flex max-[599px]:justify-between max-[599px]:border-y max-[599px]:border-border">
                    <th className="border-t border-border px-3.25 py-3.5 text-left font-bold [font-variant-numeric:tabular-nums] max-[599px]:block max-[599px]:border-t-0">
                      {t('epfo.passbook.opening')}
                    </th>
                    <td
                      colSpan={4}
                      className="border-t border-border px-3.25 py-3.5 text-right font-bold [font-variant-numeric:tabular-nums] max-[599px]:block max-[599px]:border-t-0"
                    >
                      {formatMoney(employer.openingBalance, i18n.language)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </section>
        );
      })}
      {selected && (
        <ContributionSheet
          contribution={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </Page>
  );
}

function ContributionSheet({
  contribution,
  onClose,
}: {
  contribution: MonthlyContribution;
  onClose: () => void;
}) {
  const { t, i18n } = useTranslation();
  return (
    <DetailSheet
      onClose={onClose}
      labelledBy="contribution-title"
      eyebrow={t('epfo.passbook.detailEyebrow')}
      title={formatDate(contribution.month, i18n.language)}
    >
      <ReviewList>
        <ReviewRow
          label={t('epfo.passbook.employee')}
          value={formatMoney(contribution.employee, i18n.language)}
        />
        <ReviewRow
          label={t('epfo.passbook.employer')}
          value={formatMoney(contribution.employer, i18n.language)}
        />
        <ReviewRow
          label={t('epfo.passbook.pension')}
          value={formatMoney(contribution.pension, i18n.language)}
        />
      </ReviewList>
      <p className="text-ink-muted">
        {t(
          contribution.status === 'POSTED'
            ? 'epfo.passbook.postedHelp'
            : 'epfo.passbook.missingHelp',
        )}
      </p>
      {contribution.status === 'MISSING' && (
        <ButtonLink
          wide
          to="/epfo/passbook/issue"
        >
          {t('epfo.passbook.resolve')}
          <ArrowRight />
        </ButtonLink>
      )}
    </DetailSheet>
  );
}

export function ContributionIssuePage() {
  const { t } = useTranslation();
  const persona = useAppStore((state) => state.persona);
  const issue = persona?.epfo.contributionIssue;
  if (!persona || !issue)
    return (
      <Page width="narrow">
        <PageHeader
          eyebrow={t('epfo.issue.eyebrow')}
          title={t('epfo.issue.none')}
          subtitle={t('epfo.issue.noneHelp')}
          back="/epfo/passbook"
        />
      </Page>
    );
  const employer = persona.epfo.employment.find(
    (item) => item.id === issue.employmentId,
  );
  return (
    <Page width="narrow">
      <PageHeader
        eyebrow={t('epfo.issue.eyebrow')}
        title={t('epfo.issue.title')}
        subtitle={t('epfo.issue.subtitle')}
        back="/epfo/passbook"
      />
      <IssueExplanation
        tone="warning"
        status={<Status kind="warning">{t('epfo.issue.category')}</Status>}
        title={issue.summary}
      >
        {t('epfo.issue.consequence')}
      </IssueExplanation>
      <ReviewList>
        <ReviewRow
          label={t('epfo.issue.service')}
          value={t('nav.epfo')}
        />
        <ReviewRow
          label={t('epfo.issue.employer')}
          value={employer?.employer}
        />
        <ReviewRow
          label={t('epfo.issue.categoryLabel')}
          value={t('epfo.issue.category')}
        />
      </ReviewList>
      <Notice
        tone="success"
        icon={<Check />}
        title={t('epfo.issue.prefilled')}
      >
        {t('epfo.issue.prefilledHelp')}
      </Notice>
      <Button
        disabled
        aria-describedby="grievance-deferred"
      >
        {t('epfo.issue.submit')}
      </Button>
      <p
        id="grievance-deferred"
        className="text-ink-muted"
      >
        {t('epfo.issue.deferred')}
      </p>
    </Page>
  );
}
