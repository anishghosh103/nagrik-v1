import { useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  Banknote,
  Check,
  CircleDot,
  Clock3,
  FileSearch,
  Landmark,
  RefreshCw,
  Scale,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { useAppStore } from '../../app/store';
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
  DetailSheet,
  Notice,
  ReferenceBand,
  ReviewList,
  ReviewRow,
  StatusCard,
  StatusTimeline,
  StatusTimelineItem,
  StickyActions,
} from '../../components/patterns';
import {
  getDeadlineState,
  getItruAdditionalTaxRate,
} from '../../rules/tax/notices';
import type {
  FiledReturnSnapshot,
  NoticeFixtureId,
  NoticeItem,
} from '../../types/tax';

function latestOriginal(returns: FiledReturnSnapshot[]) {
  return returns.find((item) => item.filingType === 'ORIGINAL') ?? returns[0];
}

function noticeStatusKind(notice: NoticeItem) {
  return notice.state === 'RESOLVED' ? 'success' : 'warning';
}

function deadlineText(
  notice: NoticeItem,
  t: ReturnType<typeof useTranslation>['t'],
) {
  const state = getDeadlineState(notice);
  if (state.kind === 'DUE')
    return t('tax.postFiling.deadline.daysLeft', { count: state.days });
  if (state.kind === 'DUE_TODAY') return t('tax.postFiling.deadline.today');
  if (state.kind === 'OVERDUE')
    return t('tax.postFiling.deadline.overdue', { count: state.days });
  return t('tax.postFiling.deadline.elapsed', { count: state.days });
}

export function ReturnHistoryPage() {
  const { t, i18n } = useTranslation();
  const returns = useAppStore(
    (state) => state.persona?.tax?.filedReturns ?? [],
  );
  if (returns.length === 0)
    return (
      <Page width="narrow">
        <PageHeader
          eyebrow={t('tax.postFiling.returns.eyebrow')}
          title={t('tax.postFiling.returns.empty')}
          subtitle={t('tax.postFiling.returns.emptyHelp')}
          back="/tax"
        />
      </Page>
    );
  return (
    <Page width="narrow">
      <PageHeader
        eyebrow={t('tax.postFiling.returns.eyebrow')}
        title={t('tax.postFiling.returns.title')}
        subtitle={t('tax.postFiling.returns.subtitle')}
        back="/tax"
      />
      <div className="border-t border-border">
        {returns.map((filed) => (
          <Link
            key={filed.acknowledgmentNumber}
            to={`/tax/returns/${filed.acknowledgmentNumber}`}
            className="group grid grid-cols-[1fr_auto] gap-4 border-b border-border py-5 no-underline max-[599px]:grid-cols-1"
          >
            <div>
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <Status
                  kind={
                    filed.verification.status === 'VERIFIED'
                      ? 'success'
                      : 'warning'
                  }
                >
                  {filed.verification.status === 'VERIFIED'
                    ? t('tax.postFiling.returns.verified')
                    : t('tax.postFiling.returns.pending')}
                </Status>
                {filed.filingType === 'DEFECTIVE_RESPONSE' && (
                  <Status kind="info">
                    {t('tax.postFiling.returns.defectiveResponse')}
                  </Status>
                )}
              </div>
              <h2 className="my-1 text-[1.15rem]">
                {filed.acknowledgmentNumber}
              </h2>
              <p className="m-0 text-ink-muted">
                {formatDate(filed.filedAt, i18n.language)}
              </p>
            </div>
            <ArrowRight className="self-center text-primary transition-transform group-hover:translate-x-1" />
          </Link>
        ))}
      </div>
    </Page>
  );
}

export function ReturnStatusPage() {
  const { t, i18n } = useTranslation();
  const { acknowledgmentNumber } = useParams();
  const persona = useAppStore((state) => state.persona);
  const refresh = useAppStore((state) => state.refreshFiledReturnStatus);
  const [busy, setBusy] = useState(false);
  const filed = persona?.tax?.filedReturns.find(
    (item) => item.acknowledgmentNumber === acknowledgmentNumber,
  );
  if (!filed)
    return (
      <Navigate
        to="/tax/returns"
        replace
      />
    );
  const currentTitle =
    filed.verification.status === 'PENDING'
      ? t('tax.postFiling.tracker.verificationNeeded')
      : filed.processing.status === 'PROCESSED'
        ? t('tax.postFiling.tracker.processed')
        : t('tax.postFiling.tracker.processing');
  const next = filed.refund
    ? filed.refund.status === 'DELAYED'
      ? t('tax.postFiling.tracker.nextBank')
      : filed.refund.status === 'CREDITED'
        ? t('tax.postFiling.tracker.complete')
        : t('tax.postFiling.tracker.nextRefund')
    : t('tax.postFiling.tracker.complete');
  async function checkStatus() {
    setBusy(true);
    try {
      await refresh(filed!.acknowledgmentNumber);
    } finally {
      setBusy(false);
    }
  }
  return (
    <Page width="narrow">
      <PageHeader
        eyebrow={t('tax.postFiling.tracker.eyebrow')}
        title={currentTitle}
        subtitle={next}
        back="/tax/returns"
      />
      <ReferenceBand
        label={t('tax.status.acknowledgment')}
        reference={filed.acknowledgmentNumber}
        meta={`${t('tax.status.filedOn')} ${formatDate(filed.filedAt, i18n.language)}`}
      />
      <StatusCard
        status={
          <Status
            kind={
              filed.verification.status === 'PENDING' ? 'warning' : 'success'
            }
          >
            {currentTitle}
          </Status>
        }
        title={t('tax.postFiling.tracker.nextTitle')}
      >
        {next}
      </StatusCard>
      <StatusTimeline>
        {filed.processing.events.map((event) => (
          <StatusTimelineItem
            key={event.id}
            state="complete"
            icon={<Check />}
            title={t(`tax.postFiling.events.${event.kind}`)}
            meta={formatDate(event.occurredAt, i18n.language)}
          />
        ))}
        {filed.processing.status !== 'PROCESSED' && (
          <StatusTimelineItem
            state="current"
            icon={<Clock3 />}
            title={t('tax.postFiling.events.PROCESSED')}
            meta={t('tax.postFiling.tracker.expectedEstimate')}
          />
        )}
      </StatusTimeline>
      <div className="grid gap-3 sm:grid-cols-2">
        {filed.refund && (
          <ButtonLink
            variant="secondary"
            to={`/tax/returns/${filed.acknowledgmentNumber}/refund`}
          >
            <Banknote /> {t('tax.postFiling.tracker.viewRefund')}
          </ButtonLink>
        )}
        <ButtonLink
          variant="secondary"
          to="/tax/notices"
        >
          <FileSearch /> {t('tax.postFiling.tracker.viewNotices')}
        </ButtonLink>
      </div>
      {filed.verification.status === 'VERIFIED' &&
        !(filed.refund?.status === 'DELAYED') &&
        filed.refund?.status !== 'CREDITED' && (
          <Button
            className="mt-4"
            disabled={busy}
            onClick={() => void checkStatus()}
          >
            <RefreshCw /> {t('tax.postFiling.tracker.refresh')}
          </Button>
        )}
    </Page>
  );
}

export function RefundPage() {
  const { t, i18n } = useTranslation();
  const { acknowledgmentNumber } = useParams();
  const persona = useAppStore((state) => state.persona);
  const revalidate = useAppStore((state) => state.revalidateRefundBank);
  const [busy, setBusy] = useState(false);
  const filed = persona?.tax?.filedReturns.find(
    (item) => item.acknowledgmentNumber === acknowledgmentNumber,
  );
  if (!filed?.refund)
    return (
      <Navigate
        to="/tax/returns"
        replace
      />
    );
  const refund = filed.refund;
  const delayed = refund.status === 'DELAYED';
  return (
    <Page width="narrow">
      <PageHeader
        eyebrow={t('tax.postFiling.refund.eyebrow')}
        title={
          delayed
            ? t('tax.postFiling.refund.delayedTitle')
            : t('tax.postFiling.refund.title')
        }
        subtitle={
          delayed
            ? t('tax.postFiling.refund.delayedHelp')
            : t(`tax.postFiling.refund.status.${refund.status}`)
        }
        back={`/tax/returns/${filed.acknowledgmentNumber}`}
      />
      <div className="mb-7 border-y border-border py-7">
        <p className="m-0 text-ink-muted">
          {t('tax.postFiling.refund.amount')}
        </p>
        <strong className="block text-[clamp(2.8rem,8vw,4.8rem)] leading-none text-primary [font-variant-numeric:tabular-nums]">
          {formatMoney(refund.amount, i18n.language)}
        </strong>
      </div>
      <ReviewList>
        <ReviewRow
          label={t('tax.postFiling.refund.bank')}
          value={`${refund.bankName} · ${refund.maskedAccountNumber}`}
        />
        <ReviewRow
          label={t('tax.postFiling.refund.current')}
          value={t(`tax.postFiling.refund.status.${refund.status}`)}
        />
      </ReviewList>
      {delayed ? (
        <Notice
          tone="warning"
          icon={<AlertTriangle />}
          title={t('tax.postFiling.refund.bankCauseTitle')}
        >
          {t('tax.postFiling.refund.bankCauseHelp')}
        </Notice>
      ) : (
        <Notice
          tone="info"
          icon={<Clock3 />}
          title={t('tax.postFiling.refund.expectedTitle')}
        >
          {refund.expectedNextEventOn
            ? t('tax.postFiling.refund.expectedOn', {
                date: formatDate(refund.expectedNextEventOn, i18n.language),
              })
            : t('tax.postFiling.refund.expectedEstimate')}
        </Notice>
      )}
      {delayed && (
        <StickyActions>
          <Button
            disabled={busy}
            onClick={() => {
              setBusy(true);
              void revalidate(filed.acknowledgmentNumber).finally(() =>
                setBusy(false),
              );
            }}
          >
            <RefreshCw /> {t('tax.postFiling.refund.revalidate')}
          </Button>
        </StickyActions>
      )}
    </Page>
  );
}

export function NoticeInboxPage() {
  const { t } = useTranslation();
  const notices = useAppStore(
    (state) => state.persona?.tax?.draft?.notices ?? [],
  );
  return (
    <Page width="narrow">
      <PageHeader
        eyebrow={t('tax.postFiling.notices.eyebrow')}
        title={t('tax.postFiling.notices.title')}
        subtitle={t('tax.postFiling.notices.subtitle')}
        back="/tax"
      />
      <ButtonLink to="/tax/notices/import">
        <FileSearch /> {t('tax.postFiling.notices.import')}
      </ButtonLink>
      <div className="mt-7 border-t border-border">
        {notices.length === 0 ? (
          <div className="py-12 text-center text-ink-muted">
            <FileSearch className="mx-auto mb-3 size-10 text-primary" />
            <h2>{t('tax.postFiling.notices.empty')}</h2>
            <p>{t('tax.postFiling.notices.emptyHelp')}</p>
          </div>
        ) : (
          notices.map((notice) => (
            <Link
              key={notice.id}
              to={`/tax/notices/${notice.id}`}
              className="grid grid-cols-[1fr_auto] items-center gap-4 border-b border-border py-5 no-underline"
            >
              <div>
                <Status kind={noticeStatusKind(notice)}>
                  {notice.state === 'RESOLVED'
                    ? t('tax.postFiling.notices.resolved')
                    : deadlineText(notice, t)}
                </Status>
                <h2 className="my-2 text-[1.16rem]">
                  {t('tax.postFiling.notices.section', {
                    section: notice.section,
                  })}
                </h2>
                <SourceMarker>{notice.source.reference}</SourceMarker>
              </div>
              <ArrowRight className="text-primary" />
            </Link>
          ))
        )}
      </div>
    </Page>
  );
}

const fixtureIds: NoticeFixtureId[] = [
  'DEFECTIVE_WRONG_FORM',
  'DEMAND_CONFIRMED',
  'TDS_CREDIT_OMITTED',
  'UPDATED_RETURN_CANDIDATE',
];

export function NoticeImportPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const importNotice = useAppStore((state) => state.importNotice);
  const verified = useAppStore((state) =>
    state.persona?.tax?.filedReturns.some(
      (filed) => filed.verification.status === 'VERIFIED',
    ),
  );
  const [busy, setBusy] = useState<NoticeFixtureId | null>(null);
  async function choose(fixtureId: NoticeFixtureId) {
    setBusy(fixtureId);
    try {
      const notice = await importNotice(fixtureId);
      navigate(`/tax/notices/${notice.id}`);
    } finally {
      setBusy(null);
    }
  }
  return (
    <Page width="narrow">
      <PageHeader
        eyebrow={t('tax.postFiling.import.eyebrow')}
        title={t('tax.postFiling.import.title')}
        subtitle={t('tax.postFiling.import.subtitle')}
        back="/tax/notices"
      />
      <Notice
        tone="info"
        icon={<FileSearch />}
        title={t('tax.postFiling.import.prototypeTitle')}
      >
        {t('tax.postFiling.import.prototypeHelp')}
      </Notice>
      {!verified && (
        <Notice
          tone="warning"
          icon={<AlertTriangle />}
          title={t('tax.postFiling.import.needsReturn')}
        >
          {t('tax.postFiling.import.needsReturnHelp')}
        </Notice>
      )}
      <div className="mt-6 grid gap-3">
        {fixtureIds.map((fixtureId) => (
          <button
            key={fixtureId}
            type="button"
            disabled={!verified || busy !== null}
            onClick={() => void choose(fixtureId)}
            className="group grid min-h-24 cursor-pointer grid-cols-[48px_1fr_auto] items-center gap-4 rounded-[var(--radius-sheet)] border border-border bg-surface p-4 text-left shadow-[0_8px_28px_rgba(30,45,35,0.04)] transition hover:-translate-y-0.5 hover:border-primary disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span className="grid size-12 place-items-center rounded-full bg-canvas text-primary">
              <Landmark />
            </span>
            <span>
              <strong className="block">
                {t(`tax.postFiling.fixtures.${fixtureId}.title`)}
              </strong>
              <small className="text-ink-muted">
                {t(`tax.postFiling.fixtures.${fixtureId}.help`)}
              </small>
            </span>
            <ArrowRight className="text-primary transition-transform group-hover:translate-x-1" />
          </button>
        ))}
      </div>
    </Page>
  );
}

export function NoticeDetailPage() {
  const { t, i18n } = useTranslation();
  const { noticeId } = useParams();
  const [sheetOpen, setSheetOpen] = useState(false);
  const notice = useAppStore((state) =>
    state.persona?.tax?.draft?.notices.find((item) => item.id === noticeId),
  );
  if (!notice)
    return (
      <Navigate
        to="/tax/notices"
        replace
      />
    );
  const resolved = notice.state === 'RESOLVED';
  return (
    <Page width="narrow">
      <PageHeader
        eyebrow={t('tax.postFiling.detail.eyebrow', {
          section: notice.section,
        })}
        title={
          resolved
            ? t('tax.postFiling.detail.resolvedTitle')
            : t(`tax.postFiling.remedies.${notice.remedy}.title`)
        }
        subtitle={
          resolved
            ? t('tax.postFiling.detail.resolvedHelp')
            : t(`tax.postFiling.remedies.${notice.remedy}.help`)
        }
        back="/tax/notices"
      />
      <div className="mb-6 flex flex-wrap items-center gap-3 border-y border-border py-5">
        <Status kind={noticeStatusKind(notice)}>
          {resolved
            ? t('tax.postFiling.notices.resolved')
            : deadlineText(notice, t)}
        </Status>
        <SourceMarker>{notice.source.reference}</SourceMarker>
      </div>
      <ReviewList>
        <ReviewRow
          label={t('tax.postFiling.detail.issued')}
          value={formatDate(notice.issuedOn, i18n.language)}
        />
        {notice.responseDeadline && (
          <ReviewRow
            label={t('tax.postFiling.detail.deadline')}
            value={formatDate(notice.responseDeadline, i18n.language)}
          />
        )}
        <ReviewRow
          label={t('tax.postFiling.detail.return')}
          value={notice.linkedAcknowledgmentNumber}
        />
      </ReviewList>
      <Button
        variant="secondary"
        wide
        onClick={() => setSheetOpen(true)}
      >
        <Scale /> {t('tax.postFiling.detail.compare')}
      </Button>
      <section className="mt-7 border-l-4 border-primary bg-surface px-5 py-5">
        <p className="m-0 text-[0.78rem] font-bold tracking-[0.12em] text-primary uppercase">
          {t('tax.postFiling.detail.oneAction')}
        </p>
        <h2 className="mt-2">
          {t(`tax.postFiling.remedies.${notice.remedy}.action`)}
        </h2>
        <p className="text-ink-muted">
          {t('tax.postFiling.detail.systemDecided')}
        </p>
      </section>
      <StickyActions>
        <ButtonLink
          wide
          to={`/tax/notices/${notice.id}/remedy`}
          variant={resolved ? 'secondary' : 'primary'}
        >
          {resolved
            ? t('tax.postFiling.detail.viewResolution')
            : t(`tax.postFiling.remedies.${notice.remedy}.action`)}
          <ArrowRight />
        </ButtonLink>
      </StickyActions>
      {sheetOpen && (
        <DetailSheet
          onClose={() => setSheetOpen(false)}
          labelledBy="notice-discrepancy-title"
          eyebrow={t('tax.postFiling.detail.comparisonEyebrow')}
          title={t('tax.postFiling.detail.comparisonTitle')}
          closeLabel={t('common.close')}
        >
          <div className="grid gap-4">
            {notice.discrepancies.map((item) => (
              <article
                key={item.id}
                className="rounded-[var(--radius-sheet)] border border-border bg-surface p-4"
              >
                <h3 className="mt-0">{t(item.labelKey)}</h3>
                {item.code !== 'WRONG_FORM' && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <small className="text-ink-muted">
                        {t('tax.postFiling.detail.youFiled')}
                      </small>
                      <strong className="block">
                        {formatMoney(item.declaredAmount, i18n.language)}
                      </strong>
                    </div>
                    <div>
                      <small className="text-ink-muted">
                        {t('tax.postFiling.detail.department')}
                      </small>
                      <strong className="block">
                        {formatMoney(item.departmentAmount, i18n.language)}
                      </strong>
                    </div>
                  </div>
                )}
                <SourceMarker>{item.source}</SourceMarker>
              </article>
            ))}
          </div>
        </DetailSheet>
      )}
    </Page>
  );
}

export function NoticeRemedyPage() {
  const { t, i18n } = useTranslation();
  const { noticeId } = useParams();
  const navigate = useNavigate();
  const notice = useAppStore((state) =>
    state.persona?.tax?.draft?.notices.find((item) => item.id === noticeId),
  );
  const assessmentYear = useAppStore(
    (state) => state.persona?.tax?.assessmentYear ?? '2026-27',
  );
  const start = useAppStore((state) => state.startNoticeRemedy);
  const pay = useAppStore((state) => state.submitNoticePayment);
  const [busy, setBusy] = useState(false);
  if (!notice)
    return (
      <Navigate
        to="/tax/notices"
        replace
      />
    );
  if (notice.state === 'RESOLVED')
    return (
      <Navigate
        to={`/tax/notices/${notice.id}/resolution`}
        replace
      />
    );
  if (notice.remedy === 'RECTIFY')
    return (
      <Navigate
        to={`/tax/notices/${notice.id}/${
          notice.action.status === 'SUBMITTED'
            ? 'rectify-confirmation'
            : 'rectify-review'
        }`}
        replace
      />
    );
  const discrepancy = notice.discrepancies[0];
  const demand = discrepancy?.departmentAmount ?? 0;
  async function run() {
    setBusy(true);
    try {
      if (notice!.remedy === 'REFILE') {
        await start(notice!.id);
        navigate(
          `${discrepancy?.target?.route ?? '/tax/file'}&notice=${encodeURIComponent(notice!.id)}`,
        );
        return;
      }
      if (notice!.remedy === 'PAY') {
        await pay(notice!.id);
        navigate(`/tax/notices/${notice!.id}/resolution`);
        return;
      }
    } finally {
      setBusy(false);
    }
  }
  if (notice.remedy === 'ITR_U') {
    const currentRate = getItruAdditionalTaxRate(assessmentYear);
    return (
      <Page width="narrow">
        <PageHeader
          eyebrow={t('tax.postFiling.itru.eyebrow')}
          title={t('tax.postFiling.itru.title')}
          subtitle={t('tax.postFiling.itru.subtitle')}
          back={`/tax/notices/${notice.id}`}
        />
        <Notice
          tone="warning"
          icon={<AlertTriangle />}
          title={t('tax.postFiling.itru.notDefault')}
        >
          {t('tax.postFiling.itru.notDefaultHelp')}
        </Notice>
        <div className="my-6 grid grid-cols-2 gap-px overflow-hidden rounded-[var(--radius-sheet)] border border-border bg-border sm:grid-cols-4">
          {[25, 50, 60, 70].map((rate, index) => (
            <div
              key={rate}
              className="bg-surface p-4 text-center"
            >
              <strong className="block text-2xl text-primary">{rate}%</strong>
              <small className="text-ink-muted">
                {t('tax.postFiling.itru.band', { number: index + 1 })}
              </small>
            </div>
          ))}
        </div>
        <StatusCard
          status={<Status kind="warning">{assessmentYear}</Status>}
          title={
            currentRate
              ? t('tax.postFiling.itru.currentRate', { rate: currentRate })
              : t('tax.postFiling.itru.unavailable')
          }
        >
          {t('tax.postFiling.itru.handoff')}
        </StatusCard>
      </Page>
    );
  }
  return (
    <Page
      width="narrow"
      mode="journey"
    >
      <PageHeader
        eyebrow={t('tax.postFiling.remedy.eyebrow')}
        title={t(`tax.postFiling.remedies.${notice.remedy}.title`)}
        subtitle={t(`tax.postFiling.remedies.${notice.remedy}.review`)}
        back={`/tax/notices/${notice.id}`}
      />
      {notice.remedy === 'PAY' && (
        <div className="mb-7 border-y border-border py-7">
          <p className="m-0 text-ink-muted">
            {t('tax.postFiling.remedy.demand')}
          </p>
          <strong className="text-4xl text-primary">
            {formatMoney(demand, i18n.language)}
          </strong>
        </div>
      )}
      <Notice
        tone="info"
        icon={notice.remedy === 'REFILE' ? <FileSearch /> : <CircleDot />}
        title={t('tax.postFiling.remedy.savedTitle')}
      >
        {t('tax.postFiling.remedy.savedHelp')}
      </Notice>
      <StickyActions>
        <Button
          wide
          disabled={busy}
          onClick={() => void run()}
        >
          {t(`tax.postFiling.remedies.${notice.remedy}.action`)}
          <ArrowRight />
        </Button>
      </StickyActions>
    </Page>
  );
}

export function RectificationReviewPage() {
  const { t, i18n } = useTranslation();
  const { noticeId } = useParams();
  const navigate = useNavigate();
  const notice = useAppStore((state) =>
    state.persona?.tax?.draft?.notices.find((item) => item.id === noticeId),
  );
  const rectify = useAppStore((state) => state.submitRectification);
  const [busy, setBusy] = useState(false);
  if (!notice)
    return (
      <Navigate
        to="/tax/notices"
        replace
      />
    );
  if (notice.state === 'RESOLVED')
    return (
      <Navigate
        to={`/tax/notices/${notice.id}/resolution`}
        replace
      />
    );
  if (notice.remedy !== 'RECTIFY')
    return (
      <Navigate
        to={`/tax/notices/${notice.id}/remedy`}
        replace
      />
    );
  if (notice.action.status === 'SUBMITTED')
    return (
      <Navigate
        to={`/tax/notices/${notice.id}/rectify-confirmation`}
        replace
      />
    );
  const discrepancy = notice.discrepancies[0];
  async function submit() {
    setBusy(true);
    try {
      await rectify(notice!.id);
      navigate(`/tax/notices/${notice!.id}/rectify-confirmation`);
    } finally {
      setBusy(false);
    }
  }
  return (
    <Page
      width="narrow"
      mode="journey"
    >
      <PageHeader
        eyebrow={t('tax.postFiling.rectification.reviewEyebrow')}
        title={t('tax.postFiling.remedies.RECTIFY.title')}
        subtitle={t('tax.postFiling.remedies.RECTIFY.review')}
        back={`/tax/notices/${notice.id}`}
      />
      {discrepancy && (
        <ReviewList>
          <ReviewRow
            label={t('tax.postFiling.detail.youFiled')}
            value={formatMoney(discrepancy.declaredAmount, i18n.language)}
          />
          <ReviewRow
            label={t('tax.postFiling.detail.department')}
            value={formatMoney(discrepancy.departmentAmount, i18n.language)}
          />
        </ReviewList>
      )}
      <Notice
        tone="info"
        icon={<CircleDot />}
        title={t('tax.postFiling.remedy.savedTitle')}
      >
        {t('tax.postFiling.remedy.savedHelp')}
      </Notice>
      <StickyActions>
        <Button
          wide
          disabled={busy}
          onClick={() => void submit()}
        >
          {t('tax.postFiling.remedies.RECTIFY.action')}
          <ArrowRight />
        </Button>
      </StickyActions>
    </Page>
  );
}

export function RectificationConfirmationPage() {
  const { t } = useTranslation();
  const { noticeId } = useParams();
  const navigate = useNavigate();
  const notice = useAppStore((state) =>
    state.persona?.tax?.draft?.notices.find((item) => item.id === noticeId),
  );
  const refresh = useAppStore((state) => state.refreshNoticeOutcome);
  const [busy, setBusy] = useState(false);
  if (!notice)
    return (
      <Navigate
        to="/tax/notices"
        replace
      />
    );
  if (notice.state === 'RESOLVED')
    return (
      <Navigate
        to={`/tax/notices/${notice.id}/resolution`}
        replace
      />
    );
  if (notice.remedy !== 'RECTIFY')
    return (
      <Navigate
        to={`/tax/notices/${notice.id}/remedy`}
        replace
      />
    );
  if (notice.action.status !== 'SUBMITTED')
    return (
      <Navigate
        to={`/tax/notices/${notice.id}/rectify-review`}
        replace
      />
    );
  async function checkOutcome() {
    setBusy(true);
    try {
      await refresh(notice!.id);
      navigate(`/tax/notices/${notice!.id}/resolution`);
    } finally {
      setBusy(false);
    }
  }
  return (
    <Page
      width="narrow"
      mode="journey"
    >
      <PageHeader
        eyebrow={t('tax.postFiling.rectification.confirmationEyebrow')}
        title={t('tax.postFiling.remedy.rectificationSubmitted')}
        subtitle={t('tax.postFiling.remedies.RECTIFY.help')}
        back={`/tax/notices/${notice.id}`}
      />
      {notice.action.reference && (
        <ReferenceBand
          label={t('tax.postFiling.resolution.reference')}
          reference={notice.action.reference}
        />
      )}
      <Notice
        tone="info"
        icon={<Clock3 />}
      >
        {t('tax.postFiling.remedy.rectificationPending', {
          reference: notice.action.reference,
        })}
      </Notice>
      <StickyActions>
        <Button
          wide
          disabled={busy}
          onClick={() => void checkOutcome()}
        >
          {t('tax.postFiling.remedy.checkOutcome')}
          <ArrowRight />
        </Button>
      </StickyActions>
    </Page>
  );
}

export function NoticeResolutionPage() {
  const { t } = useTranslation();
  const { noticeId } = useParams();
  const notice = useAppStore((state) =>
    state.persona?.tax?.draft?.notices.find((item) => item.id === noticeId),
  );
  if (!notice)
    return (
      <Navigate
        to="/tax/notices"
        replace
      />
    );
  return (
    <Page
      width="narrow"
      mode="completion"
    >
      <PageHeader
        eyebrow={t('tax.postFiling.resolution.eyebrow')}
        title={
          notice.state === 'RESOLVED'
            ? t('tax.postFiling.resolution.title')
            : t('tax.postFiling.resolution.pendingTitle')
        }
        subtitle={t('tax.postFiling.resolution.subtitle', {
          section: notice.section,
        })}
        back="/tax/notices"
      />
      <div className="mx-auto mb-5 grid size-18 place-items-center rounded-full bg-success text-white">
        <Check className="size-8" />
      </div>
      {notice.action.reference && (
        <ReferenceBand
          label={t('tax.postFiling.resolution.reference')}
          reference={notice.action.reference}
        />
      )}
      <StatusCard
        tone="success"
        status={<Status kind="success">{notice.state}</Status>}
        title={t(`tax.postFiling.remedies.${notice.remedy}.complete`)}
      />
      <ButtonLink
        className="mt-6"
        wide
        to="/activity"
      >
        {t('tax.status.viewActivity')} <ArrowRight />
      </ButtonLink>
    </Page>
  );
}

export function LatestReturnRedirect() {
  const returns = useAppStore(
    (state) => state.persona?.tax?.filedReturns ?? [],
  );
  const latest = latestOriginal(returns);
  return latest ? (
    <Navigate
      to={`/tax/returns/${latest.acknowledgmentNumber}`}
      replace
    />
  ) : (
    <Navigate
      to="/tax/returns"
      replace
    />
  );
}
