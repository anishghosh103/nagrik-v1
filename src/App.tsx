import { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from './app/AppShell';
import { useAppStore } from './app/store';
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

function HydrationScreen() {
  return (
    <main
      className="hydration"
      aria-live="polite"
    >
      <div
        className="brand-mark"
        aria-hidden="true"
      >
        न
      </div>
      <p>Restoring your private demo workspace…</p>
      <div className="loading-line" />
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
