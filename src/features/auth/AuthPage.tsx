import { Select } from '@base-ui/react/select';
import {
  ArrowLeft,
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
import { useAppStore } from '../../app/store';
import { apiService } from '../../services/LocalAPIService';
import type { MockSession, PersonaId } from '../../types/domain';

const MOCK_ACCOUNTS: Record<
  PersonaId,
  { name: string; aadhaar: string; description: string }
> = {
  rajesh: {
    name: 'Rajesh Kumar',
    aadhaar: '444444447712',
    description: 'Name mismatch blocks his PF claim',
  },
  ananya: {
    name: 'Ananya Sen',
    aadhaar: '444444441038',
    description: 'Connected records are healthy',
  },
};

const MOCK_ACCOUNT_OPTIONS = (Object.keys(MOCK_ACCOUNTS) as PersonaId[]).map(
  (value) => ({
    value,
    label: MOCK_ACCOUNTS[value].name,
    description: MOCK_ACCOUNTS[value].description,
  }),
);

function isValidIdentifier(value: string) {
  return value.length === 10 || value.length === 12;
}

function formatAadhaar(value: string) {
  return value.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
}

export function AuthPage() {
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
      setError('Enter a 10-digit mobile number or a 12-digit Aadhaar number.');
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
      setError(
        'The mock login service is unavailable. Check your connection and try again.',
      );
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
          ? 'This mock OTP expired. Request a new one.'
          : 'That code does not match. Use the visible fictional OTP 123456.',
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-mast">
        <div className="wordmark auth-wordmark">
          <span className="brand-mark">न</span>
          <span>Nagrik</span>
          <span className="prototype-tag">Prototype</span>
        </div>
        <div
          className="auth-illustration"
          aria-hidden="true"
        >
          <div className="identity-orbit">
            <Fingerprint size={52} />
            <span className="orbit-dot dot-a" />
            <span className="orbit-dot dot-b" />
            <span className="orbit-dot dot-c" />
          </div>
          <div className="trace-line" />
          <div className="trace-services">
            <span>
              <Landmark size={20} />
              Income Tax
            </span>
            <span>
              <ShieldCheck size={20} />
              EPFO
            </span>
          </div>
        </div>
        <div>
          <p className="eyebrow">One identity · connected outcomes</p>
          <h1>Your financial records should work together.</h1>
          <p className="auth-lede">
            See what needs attention, fix it once, and follow what changes
            across services.
          </p>
        </div>
        <div className="prototype-disclosure">
          <Eye size={19} />
          <p>
            <strong>A safe, fictional prototype.</strong> Login, integrations,
            corrections and submissions are simulated. Nothing is sent to a
            government service.
          </p>
        </div>
      </div>
      <section
        className="auth-panel"
        aria-live="polite"
      >
        {step === 'otp' && (
          <button
            className="back-button"
            onClick={() => {
              setStep('identifier');
              setError('');
            }}
          >
            <ArrowLeft size={18} />
            Back
          </button>
        )}
        <div
          className="step-dots"
          aria-label={`Step ${step === 'identifier' ? 1 : 2} of 2`}
        >
          <i className="on" />
          <i className={step === 'otp' ? 'on' : ''} />
        </div>

        {step === 'identifier' && (
          <>
            <p className="panel-number">Identify yourself</p>
            <h2>Sign in to your records</h2>
            <p>
              Use a mobile number or Aadhaar number. For this prototype, you can
              pick a mock account to fill the field.
            </p>

            <label
              className="field-label"
              htmlFor="identifier"
            >
              Mobile or Aadhaar number
            </label>
            <input
              id="identifier"
              className="identifier-input"
              inputMode="numeric"
              autoComplete="username"
              maxLength={12}
              value={identifier}
              onChange={(event) => updateIdentifier(event.target.value)}
              placeholder="10 or 12 digit number"
              aria-describedby="identifier-help"
              aria-invalid={
                Boolean(identifier) && !isValidIdentifier(identifier)
              }
            />
            <p
              id="identifier-help"
              className="identifier-help"
            >
              {identifier.length === 12
                ? `Aadhaar · ${formatAadhaar(identifier)}`
                : identifier.length === 10
                  ? 'Mobile number ready'
                  : 'No real identifier is needed for this demo.'}
            </p>

            {error && (
              <div
                className="validation-error"
                role="alert"
              >
                {error}
              </div>
            )}
            <button
              className="button primary wide"
              disabled={busy || !isValidIdentifier(identifier)}
              onClick={() => void sendOtp()}
            >
              {busy ? 'Sending mock OTP…' : 'Send OTP'}
              <ArrowRight size={18} />
            </button>
            <div className="mock-account-select">
              <Select.Root
                items={MOCK_ACCOUNT_OPTIONS}
                value={selectedAccount || null}
                onValueChange={chooseAccount}
              >
                <Select.Trigger
                  className="mock-account-trigger"
                  aria-label="Choose a mock account"
                >
                  <Select.Value
                    className="mock-account-value"
                    placeholder="Choose a citizen"
                  />
                  <Select.Icon className="mock-account-icon">
                    <ChevronsUpDown size={19} />
                  </Select.Icon>
                </Select.Trigger>
                <Select.Portal>
                  <Select.Positioner
                    className="mock-account-positioner"
                    sideOffset={7}
                    alignItemWithTrigger={false}
                  >
                    <Select.Popup className="mock-account-popup">
                      <Select.List className="mock-account-list">
                        {MOCK_ACCOUNT_OPTIONS.map((account) => (
                          <Select.Item
                            key={account.value}
                            value={account.value}
                            className="mock-account-item"
                          >
                            <Select.ItemText className="mock-account-item-copy">
                              <strong>{account.label}</strong>
                              <small>{account.description}</small>
                            </Select.ItemText>
                            <Select.ItemIndicator className="mock-account-indicator">
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
          </>
        )}

        {step === 'otp' && (
          <>
            <p className="panel-number">Verification</p>
            <h2>Enter the OTP</h2>
            <p>
              We sent a six-digit code for the{' '}
              {identifier.length === 10 ? 'mobile number' : 'Aadhaar number'}{' '}
              ending in {identifier.slice(-4)}.
            </p>
            <label
              className="field-label"
              htmlFor="otp"
            >
              Six-digit OTP
            </label>
            <input
              id="otp"
              className="otp-input"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              value={otp}
              onChange={(event) =>
                setOtp(event.target.value.replace(/\D/g, ''))
              }
              placeholder="••••••"
              autoFocus
            />
            <div className="otp-helper">
              <span>
                <KeyRound size={16} />
                Demo OTP: <strong>123456</strong>
              </span>
              <span>{seconds > 0 ? `Expires in ${seconds}s` : 'Expired'}</span>
            </div>
            {error && (
              <div
                className="validation-error"
                role="alert"
              >
                {error}
              </div>
            )}
            <button
              className="button primary wide"
              disabled={busy || otp.length !== 6 || seconds === 0}
              onClick={() => void verify()}
            >
              {busy ? 'Verifying…' : 'Enter Nagrik'}
              <ArrowRight size={18} />
            </button>
            {seconds === 0 && (
              <button
                className="button text wide"
                onClick={() => void sendOtp()}
              >
                Resend mock OTP
              </button>
            )}
          </>
        )}
      </section>
    </main>
  );
}
