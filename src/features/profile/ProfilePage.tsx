import type { ReactNode } from 'react';
import {
  Languages,
  LogOut,
  RotateCcw,
  ShieldCheck,
  UserRound,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../app/store';
import { Button, Page, PageHeader, SourceMarker } from '../../components/ui';
import { Notice } from '../../components/patterns';
import type { PersonaId } from '../../types/domain';

export function ProfilePage() {
  const { t, i18n } = useTranslation();
  const { persona, busy, switchPersona, reset, signOut } = useAppStore();
  const navigate = useNavigate();
  if (!persona) return null;
  async function switchTo(id: PersonaId) {
    if (
      id === persona?.id ||
      !confirm(
        'Switch demo citizen? Saved data remains isolated for each persona.',
      )
    )
      return;
    await switchPersona(id);
    navigate('/home');
  }
  return (
    <Page width="narrow">
      <PageHeader
        eyebrow="Profile and settings"
        title="Your demo workspace"
        subtitle="Manage the active fictional citizen, language, privacy and reset controls."
      />
      <section className="flex items-center gap-4.5 border-y border-border py-5.5">
        <span className="grid size-15.5 place-items-center rounded-full bg-primary text-[1.3rem] font-[750] text-white">
          {persona.profile.firstName[0]}
          {persona.profile.fullName.split(' ')[1]?.[0]}
        </span>
        <div>
          <h2 className="mt-0 mb-0.5">{persona.profile.fullName}</h2>
          <p className="mt-0 mb-1.5 text-ink-muted">
            {persona.profile.city} · Fictional citizen
          </p>
          <SourceMarker>{persona.profile.maskedAadhaar}</SourceMarker>
        </div>
      </section>
      <div className="my-7">
        <SettingsRow
          icon={<UserRound />}
          label="Demo citizen"
          hint="Switch without carrying claim or identity data"
        >
          <select
            className="border-0 bg-transparent p-2 font-[650] text-ink max-[599px]:max-w-30"
            disabled={busy}
            value={persona.id}
            onChange={(e) => void switchTo(e.target.value as PersonaId)}
          >
            <option value="rajesh">Rajesh Kumar</option>
            <option value="ananya">Ananya Sen</option>
          </select>
        </SettingsRow>
        <SettingsRow
          icon={<Languages />}
          label="Language"
          hint="Journey copy updates immediately"
        >
          <select
            className="border-0 bg-transparent p-2 font-[650] text-ink max-[599px]:max-w-30"
            value={i18n.language}
            onChange={(e) => {
              void i18n.changeLanguage(e.target.value);
              localStorage.setItem('nagrik:language', e.target.value);
            }}
          >
            <option value="en">English</option>
            <option value="hi">हिन्दी</option>
            <option value="bn">বাংলা</option>
          </select>
        </SettingsRow>
        <SettingsRow
          icon={<ShieldCheck />}
          label="Prototype privacy"
          hint="Data stays in localStorage on this device"
        >
          <span>Device only</span>
        </SettingsRow>
      </div>
      <Notice
        icon={<ShieldCheck />}
        title="Simulation boundaries"
      >
        Nagrik does not authenticate identity, contact government services, or
        transmit the fictional identifiers shown here. Corrections and
        submissions exist only in this browser.
      </Notice>
      <div className="mt-7 flex justify-between max-[599px]:grid max-[599px]:gap-2.5">
        <Button
          variant="secondary"
          className="max-[599px]:w-full"
          onClick={() => {
            if (
              confirm(
                'Reset only this citizen to their original fictional scenario?',
              )
            )
              void reset();
          }}
        >
          <RotateCcw size={18} />
          Reset this demo
        </Button>
        <Button
          variant="text"
          className="max-[599px]:w-full"
          onClick={() => {
            void signOut();
            navigate('/');
          }}
        >
          <LogOut size={18} />
          {t('common.signOut')}
        </Button>
      </div>
    </Page>
  );
}

function SettingsRow({
  icon,
  label,
  hint,
  children,
}: {
  icon: ReactNode;
  label: ReactNode;
  hint: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="flex min-h-19 items-center justify-between gap-4.5 border-b border-border max-[599px]:items-start max-[599px]:py-3.75">
      <div className="grid grid-cols-[32px_1fr] items-center gap-2.5 max-[599px]:grid-cols-[28px_1fr] [&>svg]:text-primary">
        {icon}
        <span className="grid">
          <strong>{label}</strong>
          <small className="text-ink-muted">{hint}</small>
        </span>
      </div>
      {children}
    </section>
  );
}
