import type { ReactNode } from 'react'
import { Activity, BadgeIndianRupee, CircleUserRound, Fingerprint, Home, Languages, ListTodo, LogOut, RotateCcw, ShieldCheck, WifiOff } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAppStore } from './store'

const nav = [
  { to: '/home', key: 'home', Icon: Home }, { to: '/actions', key: 'actions', Icon: ListTodo },
  { to: '/identity', key: 'identity', Icon: Fingerprint }, { to: '/epfo', key: 'epfo', Icon: BadgeIndianRupee },
  { to: '/activity', key: 'activity', Icon: Activity },
]

function LanguageSelect() {
  const { i18n } = useTranslation()
  return <label className="language-control"><Languages size={17} aria-hidden="true" /><span className="sr-only">Language</span><select value={i18n.language} onChange={(event) => { void i18n.changeLanguage(event.target.value); localStorage.setItem('nagrik:language', event.target.value) }}><option value="en">English</option><option value="hi">हिन्दी</option><option value="bn">বাংলা</option></select></label>
}

export function AppShell({ children }: { children: ReactNode }) {
  const { t } = useTranslation()
  const { persona, online, error, busy, signOut } = useAppStore()
  const navigate = useNavigate()
  return <div className="app-frame">
    <header className="global-header">
      <NavLink className="wordmark" to="/home"><span className="brand-mark" aria-hidden="true">न</span><span>Nagrik</span><span className="prototype-tag">{t('common.prototype')}</span></NavLink>
      <div className="header-tools"><LanguageSelect /><NavLink to="/profile" className="persona-chip" aria-label={`${persona?.profile.firstName ?? 'Demo'} profile`}><CircleUserRound size={19} /><span>{persona?.profile.firstName}</span></NavLink></div>
    </header>
    {!online && <div className="offline-banner" role="status"><WifiOff size={17} />You’re offline. Saved information is available, but corrections and claims need a connection.</div>}
    {error && <div className="error-banner" role="alert">{error}<button onClick={() => useAppStore.getState().clearError()}>Dismiss</button></div>}
    <div className="shell-grid">
      <aside className="sidebar">
        <nav aria-label="Primary navigation">{nav.map(({ to, key, Icon }) => <NavLink key={to} to={to} className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}><Icon size={20} /><span>{t(`nav.${key}`)}</span></NavLink>)}</nav>
        <div className="sidebar-bottom">
          <NavLink to="/profile" className="nav-item"><CircleUserRound size={20} /><span>{t('nav.profile')}</span></NavLink>
          <button className="nav-item" onClick={() => { if (confirm('Reset only this persona to its original fictional scenario?')) void useAppStore.getState().reset() }}><RotateCcw size={19} /><span>Reset demo</span></button>
          <button className="nav-item" onClick={() => { void signOut(); navigate('/') }}><LogOut size={19} /><span>{t('common.signOut')}</span></button>
        </div>
      </aside>
      <main id="main-content" className="main-content" aria-busy={busy}>{children}</main>
      <aside className="context-rail"><p className="context-label"><ShieldCheck size={17} />Prototype privacy</p><h2>Fictional by design</h2><p>No real Aadhaar, PAN, UAN, bank or OTP data is used. Authentication, propagation and submission are simulated on this device.</p><div className="ledger-note"><span>{t('common.saved')}</span><strong>{new Intl.DateTimeFormat(i18nLocale(), { dateStyle: 'medium', timeStyle: 'short' }).format(new Date())}</strong></div></aside>
    </div>
    <nav className="bottom-nav" aria-label="Mobile navigation">{nav.filter((item) => item.key !== 'actions').map(({ to, key, Icon }) => <NavLink key={to} to={to} className={({ isActive }) => isActive ? 'active' : ''}><Icon size={20} /><span>{t(`nav.${key}`)}</span></NavLink>)}</nav>
  </div>
}

function i18nLocale() { return document.documentElement.lang || 'en-IN' }
