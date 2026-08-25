import { useEffect, useState } from 'react'
import { AlertTriangle, ArrowRight, BadgeIndianRupee, Banknote, Check, CheckCircle2, CircleDot, Clock3, LoaderCircle, ShieldCheck } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { useAppStore } from '../../app/store'
import { PageHeader, SourceMarker, Status } from '../../components/ui'
import { formatDate, formatMoney } from '../../components/formatters'
import type { ClaimSubmission, ClaimValidation } from '../../types/domain'

export function EPFOPage() {
  const { i18n } = useTranslation()
  const persona = useAppStore((state) => state.persona)
  if (!persona) return null
  return <div className="page"><PageHeader eyebrow="PF & EPFO" title="What would you like to do?" subtitle="Start with your goal. Nagrik will check the connected records needed for it." />
    <section className="balance-band"><div><p>Last known PF balance</p><strong>{formatMoney(persona.epfo.balance, i18n.language)}</strong><small>Cached {formatDate(persona.epfo.lastUpdatedAt, i18n.language)}</small></div><BadgeIndianRupee /></section>
    <div className="task-list"><Link to="/epfo/claim"><span className="task-number">01</span><span><strong>Withdraw my PF</strong><small>Run identity, KYC, bank and service checks before filling a claim.</small></span><ArrowRight /></Link><button disabled><span className="task-number">02</span><span><strong>Transfer my PF</strong><small>Coming in the next vertical slice</small></span></button><button disabled><span className="task-number">03</span><span><strong>View contribution passbook</strong><small>Coming in the next vertical slice</small></span></button></div>
    <section className="kyc-strip"><h2>Connected EPFO profile</h2><div><span><Check />Aadhaar KYC</span><span><Check />PAN KYC</span><span><Check />Bank KYC</span></div><SourceMarker>EPFO snapshot · {persona.epfo.maskedUan}</SourceMarker></section>
  </div>
}

type ClaimStep = 'checking' | 'checks' | 'details' | 'review' | 'submitting' | 'done'

export function ClaimPage({ statusOnly = false }: { statusOnly?: boolean }) {
  const { t, i18n } = useTranslation()
  const { persona, busy, validateClaim, submitClaim } = useAppStore()
  const [validation, setValidation] = useState<ClaimValidation | null>(null)
  const [step, setStep] = useState<ClaimStep>(persona?.epfo.claim || statusOnly ? 'done' : 'checking')
  const [amount, setAmount] = useState(120000)
  const [declared, setDeclared] = useState(false)
  const [otp, setOtp] = useState('')
  const [submission, setSubmission] = useState<ClaimSubmission | undefined>(persona?.epfo.claim)
  const [formError, setFormError] = useState('')

  useEffect(() => {
    if (step !== 'checking') return
    let active = true
    void validateClaim().then((result) => { if (active) { setValidation(result); setStep('checks') } }).catch(() => { if (active) setFormError('Checks are temporarily unavailable. Retry safely.') })
    return () => { active = false }
  }, [step, validateClaim])

  if (!persona) return null
  const savedSubmission = submission ?? persona.epfo.claim
  if (step === 'done' && savedSubmission) return <ClaimStatus submission={savedSubmission} />
  const currentNumber = step === 'checking' || step === 'checks' ? 1 : step === 'details' ? 2 : step === 'review' ? 3 : 4

  async function sendClaim() {
    if (!declared || otp !== '123456') { setFormError('Accept the declaration and enter the visible mock OTP 123456.'); return }
    setStep('submitting'); setFormError('')
    try { const result = await submitClaim(amount, otp); setSubmission(result); setStep('done') }
    catch { setStep('review') }
  }

  return <div className="page narrow journey-page"><PageHeader eyebrow="PF & EPFO · Final settlement" title={t('epfo.title')} subtitle={t('epfo.subtitle')} back="/epfo" /><div className="journey-progress"><span>Step {currentNumber} of 4</span><div><i className="on" /><i className={currentNumber >= 2 ? 'on' : ''} /><i className={currentNumber >= 3 ? 'on' : ''} /><i className={currentNumber >= 4 ? 'on' : ''} /></div></div>
    {step === 'checking' && <section className="checking-state" aria-live="polite"><div className="scan-icon"><ShieldCheck /><span /></div><h2>Checking seven claim rules</h2><p>Identity, KYC, bank and service history are being checked together.</p>{formError && <div className="validation-error">{formError}<button className="button secondary" onClick={() => setStep('checking')}>Retry</button></div>}<div className="skeleton-lines"><i /><i /><i /></div></section>}
    {step === 'checks' && validation && <section><div className={validation.ready ? 'readiness-banner ready' : 'readiness-banner blocked'}>{validation.ready ? <CheckCircle2 /> : <AlertTriangle />}<div><Status kind={validation.ready ? 'success' : 'danger'}>{validation.ready ? '7 of 7 checks passed' : '1 of 7 checks failed'}</Status><h2>{validation.ready ? t('epfo.ready') : t('epfo.blocked')}</h2><p>{t('epfo.notGuarantee')}</p></div></div><RuleChecklist validation={validation} />{validation.ready ? <div className="sticky-action"><span>Checked {formatDate(validation.checkedAt, i18n.language)}</span><button className="button primary" onClick={() => setStep('details')}>Enter claim details<ArrowRight /></button></div> : <div className="sticky-action"><span>Your progress is saved</span><Link className="button primary" to={validation.results.find((r) => !r.passed)?.fixTarget ?? '/identity'}>Fix the name mismatch<ArrowRight /></Link></div>}</section>}
    {step === 'details' && <section><div className="amount-context"><span>{t('epfo.balance')}</span><strong>{formatMoney(persona.epfo.balance, i18n.language)}</strong><small>This is a cached estimate, not a settlement quote.</small></div><label className="field-label" htmlFor="claim-amount">{t('epfo.claimAmount')}</label><div className="money-input"><span>₹</span><input id="claim-amount" type="number" min="1000" max={persona.epfo.balance} value={amount} onChange={(e) => setAmount(Number(e.target.value))} /></div><div className="bank-confirm"><Banknote /><div><span>{t('epfo.bank')}</span><strong>Account {persona.epfo.bankAccount}</strong><SourceMarker>EPFO bank KYC</SourceMarker></div><Status kind="success">Validated</Status></div><div className="sticky-action"><button className="button secondary" onClick={() => setStep('checks')}>Back</button><button className="button primary" disabled={amount < 1000 || amount > persona.epfo.balance} onClick={() => setStep('review')}>Review claim<ArrowRight /></button></div></section>}
    {step === 'review' && <section><h2>Review and mock verify</h2><div className="claim-review"><div><span>Claim type</span><strong>Final PF settlement</strong></div><div><span>Amount requested</span><strong>{formatMoney(amount, i18n.language)}</strong></div><div><span>Bank account</span><strong>{persona.epfo.bankAccount}</strong></div><div><span>Readiness</span><Status kind="success">7 checks passed</Status></div></div><label className="declaration"><input type="checkbox" checked={declared} onChange={(e) => setDeclared(e.target.checked)} /><span>{t('epfo.declaration')}</span></label><label className="field-label" htmlFor="claim-otp">{t('epfo.otp')} <small>{t('epfo.otpHint')}</small></label><input id="claim-otp" className="otp-input" maxLength={6} inputMode="numeric" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} />{formError && <div className="validation-error" role="alert">{formError}</div>}<div className="sticky-action"><button className="button secondary" onClick={() => setStep('details')}>Back</button><button className="button primary" disabled={busy} onClick={() => void sendClaim()}>{t('epfo.submit')}<ArrowRight /></button></div></section>}
    {step === 'submitting' && <section className="propagation-progress"><LoaderCircle className="spinner" /><h2>Sending your mock claim</h2><p>Duplicate submission is prevented while this request is in progress.</p><div className="submission-stages"><span className="done"><Check />Details sealed</span><span className="active"><LoaderCircle />Reference being created</span><span><CircleDot />Activity awaiting update</span></div></section>}
  </div>
}

function RuleChecklist({ validation }: { validation: ClaimValidation }) {
  const { t } = useTranslation()
  const failed = validation.results.filter((rule) => !rule.passed)
  const passed = validation.results.filter((rule) => rule.passed)
  return <div className="rule-groups">{failed.length > 0 && <section><h3>{t('epfo.failed')}</h3>{failed.map((rule) => <div className="rule-row failed" key={rule.code}><span className="rule-icon"><AlertTriangle /></span><div><strong>{t(rule.messageKey)}</strong><SourceMarker>{rule.sourceRefs.join(' + ')}</SourceMarker><details><summary>Technical detail</summary><code>{rule.code}</code></details></div><Status kind="danger">Blocking</Status></div>)}</section>}<section><h3>{t('epfo.passed')}</h3>{passed.map((rule) => <div className="rule-row" key={rule.code}><span className="rule-icon"><Check /></span><div><strong>{t(rule.messageKey)}</strong><SourceMarker>{rule.sourceRefs.join(' + ')}</SourceMarker><details><summary>Technical detail</summary><code>{rule.code}</code></details></div><Status kind="success">Passed</Status></div>)}</section></div>
}

function ClaimStatus({ submission }: { submission: ClaimSubmission }) {
  const { t, i18n } = useTranslation()
  return <div className="page narrow completion-page"><PageHeader eyebrow="PF & EPFO · Claim status" title={t('epfo.received')} subtitle={t('epfo.expected')} back="/epfo" /><div className="outcome-mark"><Check /></div><div className="reference-band"><span>{t('epfo.reference')}</span><strong>{submission.reference}</strong><small>Submitted {formatDate(submission.submittedAt, i18n.language)}</small></div><section className="status-now"><Status kind="info">Claim received</Status><h2>EPFO validation is next</h2><p>The prototype has recorded your claim once. No real EPFO system was contacted.</p></section><ol className="status-timeline"><li className="complete"><span><Check /></span><div><strong>Claim received</strong><small>{formatDate(submission.submittedAt, i18n.language)}</small></div></li><li className="current"><span><Clock3 /></span><div><strong>Validation</strong><small>Expected next · about 9 days</small></div></li><li><span><CircleDot /></span><div><strong>Decision</strong><small>Not started</small></div></li><li><span><CircleDot /></span><div><strong>Payment</strong><small>Not started</small></div></li></ol><Link className="button primary wide" to="/activity">View in Unified Activity<ArrowRight /></Link></div>
}
