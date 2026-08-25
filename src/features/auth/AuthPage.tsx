import { useEffect, useState } from 'react'
import { ArrowLeft, ArrowRight, Check, Eye, Fingerprint, KeyRound, Landmark, LockKeyhole, ShieldCheck } from 'lucide-react'
import { apiService } from '../../services/LocalAPIService'
import type { MockSession, PersonaId } from '../../types/domain'
import { useAppStore } from '../../app/store'

export function AuthPage() {
  const authenticate = useAppStore((state) => state.authenticate)
  const [step, setStep] = useState<'welcome' | 'persona' | 'login' | 'otp'>('welcome')
  const [persona, setPersona] = useState<PersonaId>('rajesh')
  const [pending, setPending] = useState<MockSession | null>(null)
  const [otp, setOtp] = useState('')
  const [seconds, setSeconds] = useState(90)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (step !== 'otp') return
    const timer = window.setInterval(() => setSeconds((value) => Math.max(0, value - 1)), 1000)
    return () => clearInterval(timer)
  }, [step, pending])

  async function sendOtp() {
    setBusy(true); setError('')
    try { const session = await apiService.login(persona); setPending(session); setSeconds(90); setStep('otp') }
    catch { setError('The mock login service is unavailable. Check your connection and try again.') }
    finally { setBusy(false) }
  }

  async function verify() {
    if (!pending) return
    setBusy(true); setError('')
    try { await authenticate(await apiService.verifyOtp(pending.id, otp)); history.replaceState(null, '', '/home') }
    catch (cause) { setError(cause instanceof Error && cause.message === 'OTP_EXPIRED' ? 'This mock OTP expired. Request a new one.' : 'That code does not match. Use the visible fictional OTP 123456.') }
    finally { setBusy(false) }
  }

  return <main className="auth-page">
    <div className="auth-mast">
      <div className="wordmark auth-wordmark"><span className="brand-mark">न</span><span>Nagrik</span><span className="prototype-tag">Prototype</span></div>
      <div className="auth-illustration" aria-hidden="true"><div className="identity-orbit"><Fingerprint size={52} /><span className="orbit-dot dot-a" /><span className="orbit-dot dot-b" /><span className="orbit-dot dot-c" /></div><div className="trace-line" /><div className="trace-services"><span><Landmark size={20} />Income Tax</span><span><ShieldCheck size={20} />EPFO</span></div></div>
      <div><p className="eyebrow">One identity · connected outcomes</p><h1>Your financial records should work together.</h1><p className="auth-lede">See what needs attention, fix it once, and follow what changes across services.</p></div>
      <div className="prototype-disclosure"><Eye size={19} /><p><strong>A safe, fictional prototype.</strong> Login, integrations, corrections and submissions are simulated. Nothing is sent to a government service.</p></div>
    </div>
    <section className="auth-panel" aria-live="polite">
      {step !== 'welcome' && <button className="back-button" onClick={() => setStep(step === 'otp' ? 'login' : step === 'login' ? 'persona' : 'welcome')}><ArrowLeft size={18} />Back</button>}
      <div className="step-dots" aria-label={`Step ${step === 'welcome' ? 1 : step === 'persona' ? 2 : step === 'login' ? 3 : 4} of 4`}><i className="on" /><i className={step !== 'welcome' ? 'on' : ''} /><i className={step === 'login' || step === 'otp' ? 'on' : ''} /><i className={step === 'otp' ? 'on' : ''} /></div>
      {step === 'welcome' && <><p className="panel-number">01 — Welcome</p><h2>Start with a guided demo</h2><p>Choose a fictional citizen and experience the same application with healthy or mismatched records.</p><ul className="trust-list"><li><Check />Visible source records</li><li><Check />Plain-language rule checks</li><li><Check />Device-only persistence</li></ul><button className="button primary wide" onClick={() => setStep('persona')}>Choose a demo citizen<ArrowRight size={18} /></button></>}
      {step === 'persona' && <><p className="panel-number">02 — Demo citizen</p><h2>Whose journey will you explore?</h2><p>Both profiles have the same data shape. Only their record states differ.</p><div className="persona-options">
        <button className={persona === 'rajesh' ? 'persona-option selected' : 'persona-option'} onClick={() => setPersona('rajesh')}><span className="avatar">RK</span><span><strong>Rajesh Kumar</strong><small>Name mismatch blocks his PF claim</small></span><Check className="selection-check" /></button>
        <button className={persona === 'ananya' ? 'persona-option selected' : 'persona-option'} onClick={() => setPersona('ananya')}><span className="avatar">AS</span><span><strong>Ananya Sen</strong><small>Connected records are healthy</small></span><Check className="selection-check" /></button>
      </div><button className="button primary wide" onClick={() => setStep('login')}>Continue as {persona === 'rajesh' ? 'Rajesh' : 'Ananya'}<ArrowRight size={18} /></button></>}
      {step === 'login' && <><p className="panel-number">03 — Mock Aadhaar login</p><h2>Review the fictional credentials</h2><p>No real identifier is accepted or needed.</p><div className="credential-card"><span>Aadhaar number</span><strong>{persona === 'rajesh' ? 'XXXX XXXX 7712' : 'XXXX XXXX 1038'}</strong><span>Mobile</span><strong>•••• ••4210</strong></div><div className="safety-note"><LockKeyhole size={18} />Stored only in this browser for the demo.</div><button className="button primary wide" disabled={busy} onClick={() => void sendOtp()}>{busy ? 'Sending mock OTP…' : 'Send mock OTP'}<ArrowRight size={18} /></button></>}
      {step === 'otp' && <><p className="panel-number">04 — Verification</p><h2>Enter the mock OTP</h2><p>Sent to the fictional mobile ending in 4210.</p><label className="field-label" htmlFor="otp">Six-digit OTP</label><input id="otp" className="otp-input" inputMode="numeric" autoComplete="one-time-code" maxLength={6} value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} placeholder="••••••" /><div className="otp-helper"><span><KeyRound size={16} />Demo code: <strong>123456</strong></span><span>{seconds > 0 ? `Expires in ${seconds}s` : 'Expired'}</span></div>{error && <div className="validation-error" role="alert">{error}</div>}<button className="button primary wide" disabled={busy || otp.length !== 6 || seconds === 0} onClick={() => void verify()}>{busy ? 'Verifying…' : 'Enter Nagrik'}<ArrowRight size={18} /></button>{seconds === 0 && <button className="button text wide" onClick={() => void sendOtp()}>Resend mock OTP</button>}</>}
    </section>
  </main>
}
