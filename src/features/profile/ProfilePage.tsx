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
import { setLanguage, type SupportedLanguage } from '../../i18n/loadLanguage';
import type { PersonaId } from '../../types/domain';

export function ProfilePage() {
  const { t, i18n } = useTranslation();
  const { persona, busy, switchPersona, reset, signOut } = useAppStore();
  const navigate = useNavigate();
  if (!persona) return null;
  async function switchTo(id: PersonaId) {
    if (id === persona?.id || !confirm(t('profile.switchConfirm'))) return;
    await switchPersona(id);
    navigate('/home');
  }
  return (
    <Page width="narrow">
      <PageHeader
        eyebrow={t('profile.eyebrow')}
        title={t('profile.title')}
        subtitle={t('profile.subtitle')}
      />
      <section className="flex items-center gap-4.5 border-y border-border py-5.5">
        <span className="grid size-15.5 place-items-center rounded-full bg-primary text-[1.3rem] font-[750] text-white">
          {persona.profile.firstName[0]}
          {persona.profile.fullName.split(' ')[1]?.[0]}
        </span>
        <div>
          <h2 className="mt-0 mb-0.5">{persona.profile.fullName}</h2>
          <p className="mt-0 mb-1.5 text-ink-muted">
            {persona.profile.city} · {t('profile.fictionalCitizen')}
          </p>
          <SourceMarker>
            <span
              aria-label={t('common.maskedAccessible', {
                label: t('identity.sourceAadhaar'),
                digits: persona.profile.maskedAadhaar.slice(-4),
              })}
            >
              {persona.profile.maskedAadhaar}
            </span>
          </SourceMarker>
        </div>
      </section>
      <div className="my-7">
        <SettingsRow
          icon={<UserRound />}
          label={t('profile.demoCitizenLabel')}
          hint={t('profile.demoCitizenHint')}
        >
          <select
            className="border-0 bg-transparent p-2 font-[650] text-ink max-[599px]:max-w-30"
            disabled={busy}
            value={persona.id}
            onChange={(e) => void switchTo(e.target.value as PersonaId)}
          >
            <option value="rajesh">Rajesh Kumar</option>
            <option value="ananya">Ananya Sen</option>
            <option value="priya">Priya Menon</option>
          </select>
        </SettingsRow>
        <SettingsRow
          icon={<Languages />}
          label={t('profile.languageLabel')}
          hint={t('profile.languageHint')}
        >
          <select
            className="border-0 bg-transparent p-2 font-[650] text-ink max-[599px]:max-w-30"
            value={i18n.language}
            onChange={(e) => {
              void setLanguage(e.target.value as SupportedLanguage);
            }}
          >
            <option value="en">English</option>
            <option value="hi">हिन्दी</option>
            <option value="bn">বাংলা</option>
          </select>
        </SettingsRow>
        <SettingsRow
          icon={<ShieldCheck />}
          label={t('profile.privacyLabel')}
          hint={t('profile.privacyHint')}
        >
          <span>{t('profile.deviceOnly')}</span>
        </SettingsRow>
      </div>
      <Notice
        icon={<ShieldCheck />}
        title={t('profile.boundariesTitle')}
      >
        {t('profile.boundariesBody')}
      </Notice>
      <div className="mt-7 flex justify-between max-[599px]:grid max-[599px]:gap-2.5">
        <Button
          variant="secondary"
          className="max-[599px]:w-full"
          onClick={() => {
            if (confirm(t('profile.resetConfirm'))) void reset();
          }}
        >
          <RotateCcw size={18} />
          {t('profile.resetButton')}
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
