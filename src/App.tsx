import { lazy, Suspense, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from './app/AppShell';
import { useAppStore } from './app/store';
import { BrandMark } from './components/ui';
import { ProgressState } from './components/patterns';
import { HomePage } from './features/home/HomePage';

const AuthPage = lazy(() =>
  import('./features/auth/AuthPage').then((m) => ({ default: m.AuthPage })),
);
const ActivityPage = lazy(() =>
  import('./features/activity/ActivityPage').then((m) => ({
    default: m.ActivityPage,
  })),
);
const IdentityPage = lazy(() =>
  import('./features/identity/IdentityPages').then((m) => ({
    default: m.IdentityPage,
  })),
);
const MismatchPage = lazy(() =>
  import('./features/identity/IdentityPages').then((m) => ({
    default: m.MismatchPage,
  })),
);
const ClaimPage = lazy(() =>
  import('./features/epfo/EPFOPages').then((m) => ({
    default: m.ClaimPage,
  })),
);
const EPFOPage = lazy(() =>
  import('./features/epfo/EPFOPages').then((m) => ({
    default: m.EPFOPage,
  })),
);
const RejectedClaimPage = lazy(() =>
  import('./features/epfo/EPFOPages').then((m) => ({
    default: m.RejectedClaimPage,
  })),
);
const EmploymentPage = lazy(() =>
  import('./features/epfo/EPFORecordsPages').then((m) => ({
    default: m.EmploymentPage,
  })),
);
const EPFOProfilePage = lazy(() =>
  import('./features/epfo/EPFORecordsPages').then((m) => ({
    default: m.EPFOProfilePage,
  })),
);
const KYCPage = lazy(() =>
  import('./features/epfo/EPFORecordsPages').then((m) => ({
    default: m.KYCPage,
  })),
);
const ServiceHistoryPage = lazy(() =>
  import('./features/epfo/EPFORecordsPages').then((m) => ({
    default: m.ServiceHistoryPage,
  })),
);
const ContributionIssuePage = lazy(() =>
  import('./features/epfo/PassbookPages').then((m) => ({
    default: m.ContributionIssuePage,
  })),
);
const PassbookPage = lazy(() =>
  import('./features/epfo/PassbookPages').then((m) => ({
    default: m.PassbookPage,
  })),
);
const TransferPage = lazy(() =>
  import('./features/epfo/TransferPage').then((m) => ({
    default: m.TransferPage,
  })),
);
const NominationPage = lazy(() =>
  import('./features/epfo/NominationPage').then((m) => ({
    default: m.NominationPage,
  })),
);
const ProfilePage = lazy(() =>
  import('./features/profile/ProfilePage').then((m) => ({
    default: m.ProfilePage,
  })),
);
const TaxHomePage = lazy(() =>
  import('./features/tax/TaxHomePage').then((m) => ({
    default: m.TaxHomePage,
  })),
);
const TaxFilingEntryPages = lazy(() =>
  import('./features/tax/TaxFilingEntryPages').then((m) => ({
    default: m.TaxFilingEntryPages,
  })),
);
const TaxIncomePages = lazy(() =>
  import('./features/tax/TaxIncomePages').then((m) => ({
    default: m.TaxIncomePages,
  })),
);
const TaxIncomeDetailsPages = lazy(() =>
  import('./features/tax/TaxIncomeDetailsPages').then((m) => ({
    default: m.TaxIncomeDetailsPages,
  })),
);
const TaxDeductionsAndCreditsPage = lazy(() =>
  import('./features/tax/TaxDeductionsAndCreditsPage').then((m) => ({
    default: m.TaxDeductionsAndCreditsPage,
  })),
);
const TaxRegimeAndBankPages = lazy(() =>
  import('./features/tax/TaxRegimeAndBankPages').then((m) => ({
    default: m.TaxRegimeAndBankPages,
  })),
);
const TaxSummaryPages = lazy(() =>
  import('./features/tax/TaxSummaryPages').then((m) => ({
    default: m.TaxSummaryPages,
  })),
);
const TaxFilingPages = lazy(() =>
  import('./features/tax/TaxFilingPages').then((m) => ({
    default: m.TaxFilingPages,
  })),
);
const TaxPaymentPage = lazy(() =>
  import('./features/tax/TaxPaymentPage').then((m) => ({
    default: m.TaxPaymentPage,
  })),
);
const LatestReturnRedirect = lazy(() =>
  import('./features/tax/PostFilingPages').then((m) => ({
    default: m.LatestReturnRedirect,
  })),
);
const NoticeDetailPage = lazy(() =>
  import('./features/tax/PostFilingPages').then((m) => ({
    default: m.NoticeDetailPage,
  })),
);
const NoticeImportPage = lazy(() =>
  import('./features/tax/PostFilingPages').then((m) => ({
    default: m.NoticeImportPage,
  })),
);
const NoticeInboxPage = lazy(() =>
  import('./features/tax/PostFilingPages').then((m) => ({
    default: m.NoticeInboxPage,
  })),
);
const NoticeRemedyPage = lazy(() =>
  import('./features/tax/PostFilingPages').then((m) => ({
    default: m.NoticeRemedyPage,
  })),
);
const NoticeResolutionPage = lazy(() =>
  import('./features/tax/PostFilingPages').then((m) => ({
    default: m.NoticeResolutionPage,
  })),
);
const RectificationConfirmationPage = lazy(() =>
  import('./features/tax/PostFilingPages').then((m) => ({
    default: m.RectificationConfirmationPage,
  })),
);
const RectificationReviewPage = lazy(() =>
  import('./features/tax/PostFilingPages').then((m) => ({
    default: m.RectificationReviewPage,
  })),
);
const RefundPage = lazy(() =>
  import('./features/tax/PostFilingPages').then((m) => ({
    default: m.RefundPage,
  })),
);
const ReturnHistoryPage = lazy(() =>
  import('./features/tax/PostFilingPages').then((m) => ({
    default: m.ReturnHistoryPage,
  })),
);
const ReturnStatusPage = lazy(() =>
  import('./features/tax/PostFilingPages').then((m) => ({
    default: m.ReturnStatusPage,
  })),
);
const GrievanceCentrePage = lazy(() =>
  import('./features/grievances/GrievancePages').then((m) => ({
    default: m.GrievanceCentrePage,
  })),
);
const GrievanceDetailPage = lazy(() =>
  import('./features/grievances/GrievancePages').then((m) => ({
    default: m.GrievanceDetailPage,
  })),
);
const NewGrievancePage = lazy(() =>
  import('./features/grievances/GrievancePages').then((m) => ({
    default: m.NewGrievancePage,
  })),
);

function HydrationScreen() {
  const { t } = useTranslation();
  return (
    <main
      className="grid min-h-screen place-content-center justify-items-center gap-3.5"
      aria-live="polite"
    >
      <BrandMark />
      <p className="text-ink-muted">{t('common.hydrating')}</p>
      <div className="h-0.75 w-55 overflow-hidden bg-border after:block after:h-full after:w-[45%] after:animate-[loading_1s_ease-in-out_infinite_alternate] after:bg-primary" />
    </main>
  );
}

export default function App() {
  const { status, session, hydrate, setOnline } = useAppStore();
  useEffect(() => {
    void hydrate();
    const online = () => setOnline(true);
    const offline = () => setOnline(false);
    window.addEventListener('online', online);
    window.addEventListener('offline', offline);
    return () => {
      window.removeEventListener('online', online);
      window.removeEventListener('offline', offline);
    };
  }, [hydrate, setOnline]);

  if (status === 'hydrating') return <HydrationScreen />;
  if (!session?.verified)
    return (
      <Suspense fallback={<HydrationScreen />}>
        <AuthPage />
      </Suspense>
    );

  return (
    <AppShell>
      <Suspense fallback={<ProgressState variant="spinner" />}>
        <Routes>
          <Route
            path="/home"
            element={<HomePage />}
          />
          <Route
            path="/actions"
            element={<HomePage actionsOnly />}
          />
          <Route
            path="/identity"
            element={<IdentityPage />}
          />
          <Route
            path="/identity/mismatch/:mismatchId"
            element={<MismatchPage />}
          />
          <Route
            path="/epfo"
            element={<EPFOPage />}
          />
          <Route
            path="/epfo/profile"
            element={<EPFOProfilePage />}
          />
          <Route
            path="/epfo/kyc"
            element={<KYCPage />}
          />
          <Route
            path="/epfo/employment"
            element={<EmploymentPage />}
          />
          <Route
            path="/epfo/history"
            element={<ServiceHistoryPage />}
          />
          <Route
            path="/epfo/passbook"
            element={<PassbookPage />}
          />
          <Route
            path="/epfo/passbook/issue"
            element={<ContributionIssuePage />}
          />
          <Route
            path="/epfo/claim"
            element={<ClaimPage />}
          />
          <Route
            path="/epfo/claim/status"
            element={<ClaimPage statusOnly />}
          />
          <Route
            path="/epfo/claims/rejected"
            element={<RejectedClaimPage />}
          />
          <Route
            path="/epfo/transfer"
            element={<TransferPage />}
          />
          <Route
            path="/epfo/transfer/status"
            element={<TransferPage statusOnly />}
          />
          <Route
            path="/epfo/nomination"
            element={<NominationPage />}
          />
          <Route
            path="/tax"
            element={<TaxHomePage />}
          />
          <Route
            path="/tax/file"
            element={<TaxFilingEntryPages />}
          />
          <Route
            path="/tax/file/income"
            element={<TaxIncomePages />}
          />
          <Route
            path="/tax/file/income-details"
            element={<TaxIncomeDetailsPages />}
          />
          <Route
            path="/tax/file/deductions"
            element={<TaxDeductionsAndCreditsPage />}
          />
          <Route
            path="/tax/file/regime"
            element={<TaxRegimeAndBankPages />}
          />
          <Route
            path="/tax/file/summary"
            element={<TaxSummaryPages />}
          />
          <Route
            path="/tax/file/payment"
            element={<TaxPaymentPage />}
          />
          <Route
            path="/tax/file/declare"
            element={<TaxFilingPages />}
          />
          <Route
            path="/tax/file/status"
            element={<LatestReturnRedirect />}
          />
          <Route
            path="/tax/returns"
            element={<ReturnHistoryPage />}
          />
          <Route
            path="/tax/returns/:acknowledgmentNumber"
            element={<ReturnStatusPage />}
          />
          <Route
            path="/tax/returns/:acknowledgmentNumber/refund"
            element={<RefundPage />}
          />
          <Route
            path="/tax/notices"
            element={<NoticeInboxPage />}
          />
          <Route
            path="/tax/notices/import"
            element={<NoticeImportPage />}
          />
          <Route
            path="/tax/notices/:noticeId"
            element={<NoticeDetailPage />}
          />
          <Route
            path="/tax/notices/:noticeId/remedy"
            element={<NoticeRemedyPage />}
          />
          <Route
            path="/tax/notices/:noticeId/rectify-review"
            element={<RectificationReviewPage />}
          />
          <Route
            path="/tax/notices/:noticeId/rectify-confirmation"
            element={<RectificationConfirmationPage />}
          />
          <Route
            path="/tax/notices/:noticeId/resolution"
            element={<NoticeResolutionPage />}
          />
          <Route
            path="/grievances"
            element={<GrievanceCentrePage />}
          />
          <Route
            path="/grievances/new"
            element={<NewGrievancePage />}
          />
          <Route
            path="/grievances/:grievanceId"
            element={<GrievanceDetailPage />}
          />
          <Route
            path="/activity"
            element={<ActivityPage />}
          />
          <Route
            path="/profile"
            element={<ProfilePage />}
          />
          <Route
            path="*"
            element={
              <Navigate
                to="/home"
                replace
              />
            }
          />
        </Routes>
      </Suspense>
    </AppShell>
  );
}
