import { useEffect, useRef, type ReactNode } from 'react';
import {
  Activity,
  BadgeIndianRupee,
  CircleUserRound,
  Fingerprint,
  Home,
  Landmark,
  Languages,
  ListTodo,
  LogOut,
  type LucideIcon,
  RotateCcw,
  Scale,
  WifiOff,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '../components/cn';
import { PrototypeTag, VisuallyHidden, Wordmark } from '../components/ui';
import { setLanguage, type SupportedLanguage } from '../i18n/loadLanguage';
import { useAppStore } from './store';

const nav = [
  { to: '/home', key: 'home', Icon: Home },
  { to: '/actions', key: 'actions', Icon: ListTodo },
  { to: '/identity', key: 'identity', Icon: Fingerprint },
  { to: '/tax', key: 'tax', Icon: Landmark },
  { to: '/epfo', key: 'epfo', Icon: BadgeIndianRupee },
  { to: '/grievances', key: 'grievances', Icon: Scale },
  { to: '/activity', key: 'activity', Icon: Activity },
];

function LanguageSelect() {
  const { t, i18n } = useTranslation();
  return (
    <label className="flex items-center gap-1.5">
      <Languages
        size={17}
        aria-hidden="true"
      />
      <VisuallyHidden>{t('shell.language')}</VisuallyHidden>
      <select
        className="border-0 bg-transparent p-2 font-[650] text-ink max-[599px]:max-w-22"
        value={i18n.language}
        onChange={(event) => {
          void setLanguage(event.target.value as SupportedLanguage);
        }}
      >
        <option value="en">English</option>
        <option value="hi">हिन्दी</option>
        <option value="bn">বাংলা</option>
      </select>
    </label>
  );
}

const sidebarItemClass = (isActive: boolean) =>
  cn(
    'flex min-h-11.5 w-full cursor-pointer items-center gap-3 rounded-r-lg border-0 border-l-[3px] border-l-transparent bg-transparent px-3 py-2.25 text-left font-[620] text-ink-muted no-underline hover:bg-surface-muted/75 hover:text-ink',
    isActive && 'border-l-primary bg-surface-muted text-primary',
  );

const bottomItemClass = (isActive: boolean) =>
  cn(
    'grid min-h-12 place-items-center content-center gap-0.5 text-[0.68rem] text-ink-muted no-underline',
    isActive && 'font-bold text-primary',
  );

function NavItem({
  to,
  icon: Icon,
  label,
  variant = 'sidebar',
  onClick,
}: {
  to?: string;
  icon: LucideIcon;
  label: ReactNode;
  variant?: 'sidebar' | 'bottom';
  onClick?: () => void;
}) {
  if (onClick)
    return (
      <button
        type="button"
        className={sidebarItemClass(false)}
        onClick={onClick}
      >
        <Icon size={20} />
        <span>{label}</span>
      </button>
    );
  return (
    <NavLink
      to={to!}
      className={({ isActive }) =>
        variant === 'bottom'
          ? bottomItemClass(isActive)
          : sidebarItemClass(isActive)
      }
    >
      <Icon size={20} />
      <span>{label}</span>
    </NavLink>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const { t } = useTranslation();
  const { persona, online, error, busy, signOut } = useAppStore();
  const navigate = useNavigate();
  const location = useLocation();
  const mainRef = useRef<HTMLElement>(null);
  const hasNavigated = useRef(false);
  useEffect(() => {
    if (!hasNavigated.current) {
      hasNavigated.current = true;
      return;
    }
    window.scrollTo(0, 0);
    mainRef.current?.focus();
  }, [location.pathname]);
  return (
    <div className="min-h-screen w-full bg-canvas/68">
      <a
        href="#main-content"
        className="absolute top-3 left-3 z-90 -translate-y-20 rounded-[9px] bg-primary px-4 py-2.5 font-bold text-white no-underline transition-transform duration-150 focus:translate-y-0 focus-visible:outline-3 focus-visible:outline-accent focus-visible:outline-offset-4"
      >
        {t('shell.skipToContent')}
      </a>
      <header className="sticky top-0 z-20 flex h-18 items-center justify-between border-b border-border bg-surface/90 px-6 backdrop-blur-md max-[899px]:h-16 max-[899px]:px-5 max-[599px]:px-4">
        <NavLink
          className="no-underline"
          to="/home"
        >
          <Wordmark
            tag={<PrototypeTag>{t('common.prototype')}</PrototypeTag>}
          />
        </NavLink>
        <div className="flex items-center gap-4.5">
          <LanguageSelect />
          <NavLink
            to="/profile"
            className="flex items-center gap-1.75 border-l border-border px-2.5 py-1.75 font-[650] no-underline max-[599px]:pl-2"
            aria-label={t('shell.profileLabel', {
              name: persona?.profile.firstName ?? t('shell.demoFallback'),
            })}
          >
            <CircleUserRound size={19} />
            <span className="max-[599px]:hidden">
              {persona?.profile.firstName}
            </span>
          </NavLink>
        </div>
      </header>
      {!online && (
        <div
          className="sticky top-18 z-19 flex min-h-10 items-center justify-center gap-2.25 bg-info px-4.5 py-1.75 text-[0.85rem] text-white max-[899px]:top-16"
          role="status"
        >
          <WifiOff size={17} />
          {t('shell.offline')}
        </div>
      )}
      {error && (
        <div
          className="sticky top-18 z-19 flex min-h-10 items-center justify-center gap-2.25 bg-danger px-4.5 py-1.75 text-[0.85rem] text-white max-[899px]:top-16"
          role="alert"
        >
          {error}
          <button
            className="ml-3.5 rounded-[5px] border border-white/50 bg-transparent text-inherit"
            onClick={() => useAppStore.getState().clearError()}
          >
            {t('shell.dismiss')}
          </button>
        </div>
      )}
      <div className="grid min-h-[calc(100vh-72px)] grid-cols-[236px_minmax(0,1fr)] max-[899px]:block">
        <aside className="sticky top-18 flex h-[calc(100vh-72px)] flex-col justify-between border-r border-border px-4 pt-7 pb-5.5 max-[899px]:hidden">
          <nav
            className="grid gap-1.25"
            aria-label={t('shell.primaryNav')}
          >
            {nav.map(({ to, key, Icon }) => (
              <NavItem
                key={to}
                to={to}
                icon={Icon}
                label={t(`nav.${key}`)}
              />
            ))}
          </nav>
          <div className="grid gap-0.75 border-t border-border pt-5">
            <NavItem
              to="/profile"
              icon={CircleUserRound}
              label={t('nav.profile')}
            />
            <NavItem
              icon={RotateCcw}
              label={t('shell.resetDemo')}
              onClick={() => {
                if (confirm(t('shell.resetConfirm')))
                  void useAppStore.getState().reset();
              }}
            />
            <NavItem
              icon={LogOut}
              label={t('common.signOut')}
              onClick={() => {
                void signOut();
                navigate('/');
              }}
            />
          </div>
        </aside>
        <main
          id="main-content"
          ref={mainRef}
          tabIndex={-1}
          className="min-w-0 outline-none aria-busy:cursor-progress max-[899px]:pb-19"
          aria-busy={busy}
        >
          {children}
        </main>
      </div>
      <nav
        className="hidden max-[899px]:fixed max-[899px]:bottom-0 max-[899px]:left-0 max-[899px]:right-0 max-[899px]:z-30 max-[899px]:grid max-[899px]:min-h-16.5 max-[899px]:grid-cols-6 max-[899px]:border-t max-[899px]:border-border max-[899px]:bg-[rgba(255,252,245,0.97)] max-[899px]:p-[6px_max(10px,env(safe-area-inset-right))_calc(6px_+_env(safe-area-inset-bottom))_max(10px,env(safe-area-inset-left))] max-[899px]:shadow-[var(--shadow-sheet)]"
        aria-label={t('shell.mobileNav')}
      >
        {nav
          .filter((item) => item.key !== 'actions')
          .map(({ to, key, Icon }) => (
            <NavItem
              key={to}
              to={to}
              icon={Icon}
              label={t(`nav.${key}`)}
              variant="bottom"
            />
          ))}
      </nav>
    </div>
  );
}
