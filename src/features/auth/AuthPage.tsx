import { Select } from '@base-ui/react/select';
import {
  ArrowRight,
  Check,
  ChevronsUpDown,
  Eye,
  Fingerprint,
  KeyRound,
  Landmark,
  ShieldCheck,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../../app/store';
import {
  Button,
  BackButton,
  Eyebrow,
  PrototypeTag,
  Wordmark,
} from '../../components/ui';
import { FieldLabel, OtpInput, ValidationAlert } from '../../components/forms';
import { StepProgress } from '../../components/patterns';
import { apiService } from '../../services/LocalAPIService';
import type { MockSession, PersonaId } from '../../types/domain';

const MOCK_ACCOUNTS: Record<
  PersonaId,
  { name: string; aadhaar: string; descriptionKey: string }
> = {
  rajesh: {
    name: 'Rajesh Kumar',
    aadhaar: '444444447712',
    descriptionKey: 'auth.mockRajeshDescription',
  },
  ananya: {
    name: 'Ananya Sen',
    aadhaar: '444444441038',
    descriptionKey: 'auth.mockAnanyaDescription',
  },
};

function useMockAccountOptions() {
  const { t } = useTranslation();
  return (Object.keys(MOCK_ACCOUNTS) as PersonaId[]).map((value) => ({
    value,
    label: MOCK_ACCOUNTS[value].name,
    description: t(MOCK_ACCOUNTS[value].descriptionKey),
  }));
}

function isValidIdentifier(value: string) {
  return value.length === 10 || value.length === 12;
}

function formatAadhaar(value: string) {
  return value.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
}

function IdentityIllustration() {
  const { t } = useTranslation();
  return (
    <div
      className="relative my-3 grid h-40 place-items-center max-[899px]:hidden [@media(min-width:900px)_and_(max-height:1100px)]:my-2 [@media(min-width:900px)_and_(max-height:1100px)]:h-35"
      aria-hidden="true"
    >
      <div className="relative grid size-26 -translate-y-3.5 place-items-center rounded-full border border-white/35 text-accent shadow-[0_0_0_20px_rgba(255,255,255,0.025)]">
        <Fingerprint size={52} />
        <span className="absolute top-2 right-2.5 size-2.75 rounded-full bg-[#efc979] shadow-[0_0_0_5px_rgba(239,201,121,0.12)]" />
        <span className="absolute bottom-8 -left-1.25 size-2.75 rounded-full bg-[#efc979] shadow-[0_0_0_5px_rgba(239,201,121,0.12)]" />
        <span className="absolute -right-1.25 bottom-7 size-2.75 rounded-full bg-[#efc979] shadow-[0_0_0_5px_rgba(239,201,121,0.12)]" />
      </div>
      <div className="absolute bottom-6 h-px w-82.5 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.5),transparent)]" />
      <div className="absolute -bottom-0.75 flex gap-22 [&>span]:flex [&>span]:items-center [&>span]:gap-1.75 [&>span]:text-[0.76rem] [&>span]:text-white/70">
        <span>
          <Landmark size={20} />
          {t('auth.illustrationTax')}
        </span>
        <span>
          <ShieldCheck size={20} />
          {t('auth.illustrationEpfo')}
        </span>
      </div>
    </div>
  );
}

function MockAccountPicker({
  value,
  onChange,
}: {
  value: PersonaId | '';
  onChange: (value: PersonaId | null) => void;
}) {
  const { t } = useTranslation();
  const options = useMockAccountOptions();
  return (
    <div className="mt-3.5 w-full [@media(min-width:900px)_and_(max-height:1100px)]:mt-3">
      <Select.Root
        items={options}
        value={value || null}
        onValueChange={onChange}
      >
        <Select.Trigger
          aria-label={t('auth.chooseMockAccount')}
          className="flex h-14 w-full cursor-pointer items-center justify-between gap-3 rounded-[9px] border border-border bg-surface py-2.25 pr-2.75 pl-3.75 text-left text-ink shadow-[0_5px_18px_rgba(23,35,29,0.045)] transition-[border-color,box-shadow] duration-180 hover:border-[#bdb5a3] data-[popup-open]:border-primary data-[popup-open]:shadow-[0_0_0_4px_rgba(38,91,67,0.08)] data-[popup-open]:[&_[data-slot=mock-icon]]:bg-primary data-[popup-open]:[&_[data-slot=mock-icon]]:text-white"
        >
          <Select.Value
            placeholder={t('auth.choosePlaceholder')}
            className="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap text-[1rem] font-[650] data-[placeholder]:font-semibold data-[placeholder]:text-ink-muted"
          />
          <Select.Icon
            data-slot="mock-icon"
            className="grid size-8.5 shrink-0 place-items-center rounded-[7px] bg-surface-muted text-primary transition-[background,color] duration-180"
          >
            <ChevronsUpDown size={19} />
          </Select.Icon>
        </Select.Trigger>
        <Select.Portal>
          <Select.Positioner
            sideOffset={7}
            alignItemWithTrigger={false}
            className="z-60 outline-none"
          >
            <Select.Popup className="w-[var(--anchor-width)] rounded-[10px] border border-border bg-surface p-1.5 text-ink shadow-[0_18px_48px_rgba(23,35,29,0.16),0_3px_10px_rgba(23,35,29,0.08)] [transform-origin:var(--transform-origin)] transition-[opacity,transform] duration-160 data-[ending-style]:-translate-y-1 data-[ending-style]:scale-98 data-[ending-style]:opacity-0 data-[starting-style]:-translate-y-1 data-[starting-style]:scale-98 data-[starting-style]:opacity-0">
              <Select.List className="outline-none">
                {options.map((account) => (
                  <Select.Item
                    key={account.value}
                    value={account.value}
                    className="flex min-h-15.5 cursor-default items-center justify-between gap-3.5 rounded-[7px] py-2.5 pr-2.75 pl-3.25 outline-none select-none data-[highlighted]:bg-surface-muted data-[highlighted]:text-primary-strong data-[selected]:text-primary"
                  >
                    <Select.ItemText className="grid min-w-0 gap-px [&_small]:font-medium [&_small]:text-[0.84rem] [&_small]:leading-[1.35] [&_small]:text-ink-muted [&_strong]:font-bold">
                      <strong>{account.label}</strong>
                      <small>{account.description}</small>
                    </Select.ItemText>
                    <Select.ItemIndicator className="grid size-7 shrink-0 place-items-center rounded-full bg-[#e5efe8] text-success">
                      <Check size={18} />
                    </Select.ItemIndicator>
                  </Select.Item>
                ))}
              </Select.List>
            </Select.Popup>
          </Select.Positioner>
        </Select.Portal>
      </Select.Root>
    </div>
  );
}

export function AuthPage() {
  const { t } = useTranslation();
  const authenticate = useAppStore((state) => state.authenticate);
  const [step, setStep] = useState<'identifier' | 'otp'>('identifier');
  const [persona, setPersona] = useState<PersonaId>('rajesh');
  const [selectedAccount, setSelectedAccount] = useState<PersonaId | ''>('');
  const [identifier, setIdentifier] = useState('');
  const [pending, setPending] = useState<MockSession | null>(null);
  const [otp, setOtp] = useState('');
  const [seconds, setSeconds] = useState(90);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (step !== 'otp') return;
    const timer = window.setInterval(
      () => setSeconds((value) => Math.max(0, value - 1)),
      1000,
    );
    return () => clearInterval(timer);
  }, [step, pending]);

  function chooseAccount(value: PersonaId | null) {
    if (!value) {
      setSelectedAccount('');
      return;
    }
    setSelectedAccount(value);
    setPersona(value);
    setIdentifier(MOCK_ACCOUNTS[value].aadhaar);
    setError('');
  }

  function updateIdentifier(value: string) {
    const digits = value.replace(/\D/g, '').slice(0, 12);
    setIdentifier(digits);
    setError('');

    const matchingAccount = (Object.keys(MOCK_ACCOUNTS) as PersonaId[]).find(
      (id) => MOCK_ACCOUNTS[id].aadhaar === digits,
    );
    setSelectedAccount(matchingAccount ?? '');
    if (matchingAccount) setPersona(matchingAccount);
  }

  async function sendOtp() {
    if (!isValidIdentifier(identifier)) {
      setError(t('auth.identifierInvalid'));
      return;
    }
    setBusy(true);
    setError('');
    try {
      const session = await apiService.login(persona);
      setPending(session);
      setOtp('');
      setSeconds(90);
      setStep('otp');
    } catch {
      setError(t('auth.loginUnavailable'));
    } finally {
      setBusy(false);
    }
  }

  async function verify() {
    if (!pending) return;
    setBusy(true);
    setError('');
    try {
      await authenticate(await apiService.verifyOtp(pending.id, otp));
      history.replaceState(null, '', '/home');
    } catch (cause) {
      setError(
        cause instanceof Error && cause.message === 'OTP_EXPIRED'
          ? t('auth.otpExpired')
          : t('auth.otpMismatch'),
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="grid min-h-screen grid-cols-[minmax(420px,1.15fr)_minmax(400px,0.85fr)] max-[899px]:grid-cols-1">
      <div className="relative flex min-h-screen flex-col justify-between gap-14 overflow-hidden p-[clamp(32px,4.5vw,72px)] text-[#fdfaf1] [background:var(--color-primary-strong)] after:absolute after:-top-32.5 after:-right-45 after:size-105 after:rounded-full after:border after:border-white/8 after:shadow-[0_0_0_54px_rgba(255,255,255,0.025),0_0_0_110px_rgba(255,255,255,0.02)] after:content-[''] max-[899px]:min-h-0 max-[899px]:p-[32px_7vw] max-[599px]:p-[28px_20px_34px] [@media(min-width:900px)_and_(max-height:1100px)]:py-[clamp(24px,4vh,40px)]">
        <Wordmark
          tone="inverse"
          tag={
            <PrototypeTag tone="inverse">{t('common.prototype')}</PrototypeTag>
          }
        />
        <IdentityIllustration />
        <div>
          <Eyebrow tone="inverse">{t('auth.heroEyebrow')}</Eyebrow>
          <h1 className="max-w-200 text-[clamp(2.5rem,4vw,4rem)] text-white max-[899px]:text-[clamp(2.5rem,8vw,4rem)] max-[599px]:text-[2.45rem] [@media(min-width:900px)_and_(max-height:1100px)]:mb-2.5 [@media(min-width:900px)_and_(max-height:1100px)]:text-[clamp(2.35rem,3.5vw,3.6rem)]">
            {t('auth.heroTitle')}
          </h1>
          <p className="max-w-155 text-[1.08rem] text-white/74 max-[599px]:text-[1rem] [@media(min-width:900px)_and_(max-height:1100px)]:mb-0 [@media(min-width:900px)_and_(max-height:1100px)]:text-[1rem]">
            {t('auth.heroBody')}
          </p>
        </div>
        <div className="flex gap-2.5 border-t border-white/16 pt-4 text-[0.8rem] text-white/72 max-[599px]:pt-4.5 [&>p]:m-0 [&>p]:max-w-145 [&_strong]:text-white [@media(min-width:900px)_and_(max-height:1100px)]:pt-3">
          <Eye size={19} />
          <p>
            <strong>{t('auth.safeTitle')}</strong> {t('auth.safeBody')}
          </p>
        </div>
      </div>
      <section
        className="w-full max-w-170 place-self-center justify-self-center p-[clamp(28px,5vw,72px)] max-[899px]:max-w-170 max-[899px]:p-[44px_7vw_70px] max-[599px]:p-[36px_20px_65px] [&>h2]:mb-2 [&>h2]:text-[clamp(1.7rem,2.5vw,2.15rem)] [&>p:not(:first-of-type)]:mb-5.5 [&>p:not(:first-of-type)]:text-ink-muted [@media(min-width:900px)_and_(max-height:1100px)]:p-[clamp(24px,4vh,40px)_clamp(72px,5vw,80px)] [@media(min-width:900px)_and_(max-height:1100px)]:[&>p:not(:first-of-type)]:mb-4.5"
        aria-live="polite"
      >
        {step === 'otp' && (
          <BackButton
            onClick={() => {
              setStep('identifier');
              setError('');
            }}
          />
        )}
        <StepProgress
          current={step === 'identifier' ? 1 : 2}
          total={2}
          variant="compact"
          label={t('auth.stepLabel', {
            current: step === 'identifier' ? 1 : 2,
            total: 2,
          })}
        />

        {step === 'identifier' && (
          <>
            <Eyebrow>{t('auth.identifyEyebrow')}</Eyebrow>
            <h2>{t('auth.signInTitle')}</h2>
            <p>{t('auth.signInBody')}</p>

            <FieldLabel htmlFor="identifier">
              {t('auth.identifierLabel')}
            </FieldLabel>
            <input
              id="identifier"
              className="h-14 w-full rounded-[9px] border border-border bg-surface px-3.75 py-2.25 text-[1.08rem] tracking-[0.035em] [font-variant-numeric:tabular-nums] transition-[border-color,box-shadow] duration-180 focus:border-primary focus:shadow-[0_0_0_4px_rgba(38,91,67,0.08)] aria-[invalid=true]:border-danger"
              inputMode="numeric"
              autoComplete="username"
              maxLength={12}
              value={identifier}
              onChange={(event) => updateIdentifier(event.target.value)}
              placeholder={t('auth.identifierPlaceholder')}
              aria-describedby="identifier-help"
              aria-invalid={
                Boolean(identifier) && !isValidIdentifier(identifier)
              }
            />
            <p
              id="identifier-help"
              className="my-1.5 mb-4.5 min-h-5 text-[0.78rem] text-ink-muted [font-variant-numeric:tabular-nums] [@media(min-width:900px)_and_(max-height:1100px)]:mb-3.5"
            >
              {identifier.length === 12
                ? t('auth.aadhaarReady', { value: formatAadhaar(identifier) })
                : identifier.length === 10
                  ? t('auth.mobileReady')
                  : t('auth.noRealIdentifier')}
            </p>

            {error && <ValidationAlert>{error}</ValidationAlert>}
            <Button
              wide
              disabled={busy || !isValidIdentifier(identifier)}
              onClick={() => void sendOtp()}
            >
              {busy ? t('auth.sendingOtp') : t('auth.sendOtp')}
              <ArrowRight size={18} />
            </Button>
            <MockAccountPicker
              value={selectedAccount}
              onChange={chooseAccount}
            />
          </>
        )}

        {step === 'otp' && (
          <>
            <Eyebrow>{t('auth.verificationEyebrow')}</Eyebrow>
            <h2>{t('auth.otpTitle')}</h2>
            <p>
              {t('auth.otpSentTo', {
                kind:
                  identifier.length === 10
                    ? t('auth.kindMobile')
                    : t('auth.kindAadhaar'),
                last4: identifier.slice(-4),
              })}
            </p>
            <FieldLabel htmlFor="otp">{t('auth.otpFieldLabel')}</FieldLabel>
            <OtpInput
              id="otp"
              value={otp}
              onChange={setOtp}
              placeholder="••••••"
              autoFocus
            />
            <div className="my-5 flex justify-between text-[0.8rem] text-ink-muted max-[599px]:items-start max-[599px]:gap-2 [&>span]:flex [&>span]:items-center [&>span]:gap-1.5 max-[599px]:[&>span:last-child]:whitespace-nowrap">
              <span>
                <KeyRound size={16} />
                {t('auth.demoOtpLabel')} <strong>123456</strong>
              </span>
              <span>
                {seconds > 0
                  ? t('auth.expiresIn', { seconds })
                  : t('auth.expired')}
              </span>
            </div>
            {error && <ValidationAlert>{error}</ValidationAlert>}
            <Button
              wide
              disabled={busy || otp.length !== 6 || seconds === 0}
              onClick={() => void verify()}
            >
              {busy ? t('auth.verifying') : t('auth.enterNagrik')}
              <ArrowRight size={18} />
            </Button>
            {seconds === 0 && (
              <Button
                variant="text"
                wide
                onClick={() => void sendOtp()}
              >
                {t('auth.resendOtp')}
              </Button>
            )}
          </>
        )}
      </section>
    </main>
  );
}
