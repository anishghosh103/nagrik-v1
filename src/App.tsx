import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from './app/AppShell';
import { useAppStore } from './app/store';
import { BrandMark } from './components/ui';
import { AuthPage } from './features/auth/AuthPage';
import { ActivityPage } from './features/activity/ActivityPage';
import { HomePage } from './features/home/HomePage';
import { IdentityPage, MismatchPage } from './features/identity/IdentityPages';
import {
  ClaimPage,
  EPFOPage,
  RejectedClaimPage,
} from './features/epfo/EPFOPages';
import {
  EmploymentPage,
  EPFOProfilePage,
  KYCPage,
  ServiceHistoryPage,
} from './features/epfo/EPFORecordsPages';
import {
  ContributionIssuePage,
  PassbookPage,
} from './features/epfo/PassbookPages';
import { TransferPage } from './features/epfo/TransferPage';
import { NominationPage } from './features/epfo/NominationPage';
import { ProfilePage } from './features/profile/ProfilePage';
import { TaxHomePage } from './features/tax/TaxHomePage';
import { TaxFilingEntryPages } from './features/tax/TaxFilingEntryPages';
import { TaxIncomePages } from './features/tax/TaxIncomePages';
import { TaxIncomeDetailsPages } from './features/tax/TaxIncomeDetailsPages';
import { TaxDeductionsAndCreditsPage } from './features/tax/TaxDeductionsAndCreditsPage';
import { TaxRegimeAndBankPages } from './features/tax/TaxRegimeAndBankPages';
import { TaxSummaryPages } from './features/tax/TaxSummaryPages';
import { TaxFilingPages } from './features/tax/TaxFilingPages';
import { TaxPaymentPage } from './features/tax/TaxPaymentPage';
import {
  LatestReturnRedirect,
  NoticeDetailPage,
  NoticeImportPage,
  NoticeInboxPage,
  NoticeRemedyPage,
  NoticeResolutionPage,
  RectificationConfirmationPage,
  RectificationReviewPage,
  RefundPage,
  ReturnHistoryPage,
  ReturnStatusPage,
} from './features/tax/PostFilingPages';
import {
  GrievanceCentrePage,
  GrievanceDetailPage,
  NewGrievancePage,
} from './features/grievances/GrievancePages';

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
  if (!session?.verified) return <AuthPage />;

  return (
    <AppShell>
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
    </AppShell>
  );
}
