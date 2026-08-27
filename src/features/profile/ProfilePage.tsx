import { tw } from '../../styles/recipes';
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
import { Button, PageHeader, SourceMarker } from '../../components/ui';
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
    <div className={tw('page narrow')}>
      <PageHeader
        eyebrow="Profile and settings"
        title="Your demo workspace"
        subtitle="Manage the active fictional citizen, language, privacy and reset controls."
      />
      <section className={tw('profile-card')}>
        <span className={tw('profile-avatar')}>
          {persona.profile.firstName[0]}
          {persona.profile.fullName.split(' ')[1]?.[0]}
        </span>
        <div>
          <h2>{persona.profile.fullName}</h2>
          <p>{persona.profile.city} · Fictional citizen</p>
          <SourceMarker>{persona.profile.maskedAadhaar}</SourceMarker>
        </div>
      </section>
      <div className={tw('settings-list')}>
        <section>
          <div>
            <UserRound />
            <span>
              <strong>Demo citizen</strong>
              <small>Switch without carrying claim or identity data</small>
            </span>
          </div>
          <select
            disabled={busy}
            value={persona.id}
            onChange={(e) => void switchTo(e.target.value as PersonaId)}
          >
            <option value="rajesh">Rajesh Kumar</option>
            <option value="ananya">Ananya Sen</option>
          </select>
        </section>
        <section>
          <div>
            <Languages />
            <span>
              <strong>Language</strong>
              <small>Journey copy updates immediately</small>
            </span>
          </div>
          <select
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
        </section>
        <section>
          <div>
            <ShieldCheck />
            <span>
              <strong>Prototype privacy</strong>
              <small>Data stays in localStorage on this device</small>
            </span>
          </div>
          <span>Device only</span>
        </section>
      </div>
      <section className={tw('privacy-panel')}>
        <ShieldCheck />
        <div>
          <h2>Simulation boundaries</h2>
          <p>
            Nagrik does not authenticate identity, contact government services,
            or transmit the fictional identifiers shown here. Corrections and
            submissions exist only in this browser.
          </p>
        </div>
      </section>
      <div className={tw('profile-actions')}>
        <Button
          variant="secondary"
          onClick={() => {
            if (
              confirm(
                'Reset only this citizen to their original fictional scenario?',
              )
            )
              void reset();
          }}
        >
          <RotateCcw />
          Reset this demo
        </Button>
        <Button
          variant="text"
          onClick={() => {
            void signOut();
            navigate('/');
          }}
        >
          <LogOut />
          {t('common.signOut')}
        </Button>
      </div>
    </div>
  );
}
