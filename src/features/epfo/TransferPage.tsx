import { useEffect, useState } from 'react'
import { AlertTriangle, ArrowRight, Check, CircleDot, Clock3, LoaderCircle, MoveRight, ShieldCheck } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { useAppStore } from '../../app/store'
import { formatDate, formatMoney } from '../../components/formatters'
import { PageHeader, SourceMarker, Status } from '../../components/ui'
import type { PFTransfer, TransferValidation } from '../../types/domain'

type TransferStep = 'intro' | 'employments' | 'checking' | 'validation' | 'review' | 'submitting' | 'done'

export function TransferPage({ statusOnly = false }: { statusOnly?: boolean }) {
  const { t, i18n } = useTranslation()
  const { persona, busy, validateTransfer, saveTransferDraft, submitTransfer } = useAppStore()
  const previous = persona?.epfo.employment.find((item) => !item.current)
  const current = persona?.epfo.employment.find((item) => item.current)
  const draft = persona?.epfo.transferDraft
  const [sourceId, setSourceId] = useState(draft?.sourceEmploymentId ?? previous?.id ?? '')
  const [destinationId, setDestinationId] = useState(draft?.destinationEmploymentId ?? current?.id ?? '')
  const [step, setStep] = useState<TransferStep>(persona?.epfo.transfer || statusOnly ? 'done' : 'intro')
  const [validation, setValidation] = useState<TransferValidation | null>(null)
  const [declared, setDeclared] = useState(false)
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [submission, setSubmission] = useState<PFTransfer | undefined>(persona?.epfo.transfer)

  useEffect(() => {
    if (step !== 'checking' || !sourceId || !destinationId) return
    let active = true
    void validateTransfer(sourceId, destinationId).then((result) => { if (active) { setValidation(result); setStep('validation') } }).catch(() => { if (active) { setError(t('epfo.transfer.checkFailed')); setStep('employments') } })
    return () => { active = false }
  }, [destinationId, sourceId, step, t, validateTransfer])
  if (!persona) return null
  const saved = submission ?? persona.epfo.transfer
  if (step === 'done' && saved) return <TransferStatus transfer={saved} />
  const source = persona.epfo.employment.find((item) => item.id === sourceId)
  const destination = persona.epfo.employment.find((item) => item.id === destinationId)

  async function review() {
    const input = { sourceEmploymentId: sourceId, destinationEmploymentId: destinationId, declarationAccepted: false, otp: '' }
    await saveTransferDraft(input); setStep('checking')
  }
  async function submit() {
    if (!declared || otp !== '123456') { setError(t('epfo.transfer.verifyError')); return }
    setError(''); setStep('submitting')
    try { const result = await submitTransfer({ sourceEmploymentId: sourceId, destinationEmploymentId: destinationId, declarationAccepted: true, otp }); setSubmission(result); setStep('done') }
    catch { setError(t('epfo.transfer.submitFailed')); setStep('review') }
  }

  return <div className="page narrow journey-page"><PageHeader eyebrow={t('epfo.transfer.eyebrow')} title={t('epfo.transfer.title')} subtitle={t('epfo.transfer.subtitle')} back="/epfo" />
    {step === 'intro' && <section className="journey-intro"><span className="large-glyph"><MoveRight /></span><h2>{t('epfo.transfer.introTitle')}</h2><p>{t('epfo.transfer.introHelp')}</p><ul><li>{t('epfo.transfer.introOne')}</li><li>{t('epfo.transfer.introTwo')}</li><li>{t('epfo.transfer.introThree')}</li></ul><div className="sticky-action"><span>{t('common.saved')}</span><button className="button primary" onClick={() => setStep('employments')}>{t('epfo.transfer.start')}<ArrowRight /></button></div></section>}
    {step === 'employments' && <section><h2>{t('epfo.transfer.choose')}</h2><p className="section-intro">{t('epfo.transfer.chooseHelp')}</p>{error && <div className="validation-error" role="alert">{error}</div>}<fieldset className="choice-list"><legend>{t('epfo.transfer.previous')}</legend>{persona.epfo.employment.filter((item) => !item.current).map((item) => <label className={`choice ${sourceId === item.id ? 'selected' : ''}`} key={item.id}><input type="radio" name="source" checked={sourceId === item.id} onChange={() => setSourceId(item.id)} /><span><strong>{item.employer}</strong><small>{formatDate(item.joinedOn, i18n.language)} — {item.exitedOn ? formatDate(item.exitedOn, i18n.language) : t('epfo.employment.notRecorded')}</small></span><Check /></label>)}</fieldset><fieldset className="choice-list"><legend>{t('epfo.transfer.current')}</legend>{persona.epfo.employment.filter((item) => item.current).map((item) => <label className={`choice ${destinationId === item.id ? 'selected' : ''}`} key={item.id}><input type="radio" name="destination" checked={destinationId === item.id} onChange={() => setDestinationId(item.id)} /><span><strong>{item.employer}</strong><small>{formatDate(item.joinedOn, i18n.language)} — {t('epfo.employment.current')}</small></span><Check /></label>)}</fieldset><div className="sticky-action"><button className="button secondary" onClick={() => setStep('intro')}>{t('common.back')}</button><button className="button primary" disabled={!sourceId || !destinationId} onClick={() => void review()}>{t('epfo.transfer.runChecks')}<ArrowRight /></button></div></section>}
    {step === 'checking' && <section className="checking-state" aria-live="polite"><LoaderCircle className="spinner" /><h2>{t('epfo.transfer.checking')}</h2><p>{t('epfo.transfer.checkingHelp')}</p></section>}
    {step === 'validation' && validation && <section><div className={validation.ready ? 'readiness-banner ready' : 'readiness-banner blocked'}>{validation.ready ? <ShieldCheck /> : <AlertTriangle />}<div><Status kind={validation.ready ? 'success' : 'danger'}>{t(validation.ready ? 'epfo.transfer.ready' : 'epfo.transfer.blocked')}</Status><h2>{t(validation.ready ? 'epfo.transfer.readyTitle' : 'epfo.transfer.blockedTitle')}</h2><p>{t('epfo.transfer.notGuarantee')}</p></div></div><div className="rule-groups"><section><h3>{t('epfo.transfer.checks')}</h3>{validation.results.map((rule) => <div className={`rule-row ${rule.passed ? '' : 'failed'}`} key={rule.code}><span className="rule-icon">{rule.passed ? <Check /> : <AlertTriangle />}</span><div><strong>{t(rule.messageKey)}</strong><SourceMarker>{rule.sourceRefs.join(' + ')}</SourceMarker></div><Status kind={rule.passed ? 'success' : 'danger'}>{t(rule.passed ? 'epfo.claim.passed' : 'epfo.claim.blocking')}</Status></div>)}</section></div><div className="sticky-action"><button className="button secondary" onClick={() => setStep('employments')}>{t('common.back')}</button>{validation.ready ? <button className="button primary" onClick={() => setStep('review')}>{t('epfo.transfer.review')}<ArrowRight /></button> : <Link className="button primary" to={validation.results.find((rule) => !rule.passed)?.fixTarget ?? '/epfo/employment'}>{t('epfo.transfer.fix')}<ArrowRight /></Link>}</div></section>}
    {step === 'review' && source && destination && <section><h2>{t('epfo.transfer.reviewTitle')}</h2><div className="transfer-route"><article><span>{t('epfo.transfer.from')}</span><strong>{source.employer}</strong><small>{source.memberId}</small></article><MoveRight /><article><span>{t('epfo.transfer.to')}</span><strong>{destination.employer}</strong><small>{destination.memberId}</small></article></div><div className="amount-context"><span>{t('epfo.transfer.transferable')}</span><strong>{formatMoney(source.balance, i18n.language)}</strong><small>{t('epfo.transfer.estimate')}</small></div><label className="declaration"><input type="checkbox" checked={declared} onChange={(event) => setDeclared(event.target.checked)} /><span>{t('epfo.transfer.declaration')}</span></label><label className="field-label" htmlFor="transfer-otp">{t('epfo.otp')} <small>{t('epfo.otpHint')}</small></label><input id="transfer-otp" className="otp-input" maxLength={6} inputMode="numeric" value={otp} onChange={(event) => setOtp(event.target.value.replace(/\D/g, ''))} />{error && <div className="validation-error" role="alert">{error}</div>}<div className="sticky-action"><button className="button secondary" onClick={() => setStep('validation')}>{t('common.back')}</button><button className="button primary" disabled={busy} onClick={() => void submit()}>{t('epfo.transfer.submit')}<ArrowRight /></button></div></section>}
    {step === 'submitting' && <section className="propagation-progress" aria-live="polite"><LoaderCircle className="spinner" /><h2>{t('epfo.transfer.submitting')}</h2><p>{t('epfo.transfer.submittingHelp')}</p></section>}
  </div>
}

function TransferStatus({ transfer }: { transfer: PFTransfer }) {
  const { t, i18n } = useTranslation()
  return <div className="page narrow completion-page"><PageHeader eyebrow={t('epfo.transfer.statusEyebrow')} title={t('epfo.transfer.received')} subtitle={t('epfo.transfer.receivedHelp')} back="/epfo" /><div className="outcome-mark pending-mark"><Clock3 /></div><div className="reference-band"><span>{t('epfo.transfer.reference')}</span><strong>{transfer.reference}</strong><small>{t('epfo.transfer.submitted', { date: formatDate(transfer.submittedAt, i18n.language) })}</small></div><section className="status-now"><Status kind="info">{t('epfo.transfer.statusEmployer')}</Status><h2>{t('epfo.transfer.statusEmployerTitle')}</h2><p>{t('epfo.transfer.statusEmployerHelp')}</p></section><ol className="status-timeline"><li className="complete"><span><Check /></span><div><strong>{t('epfo.transfer.received')}</strong><small>{formatDate(transfer.submittedAt, i18n.language)}</small></div></li><li className="current"><span><Clock3 /></span><div><strong>{t('epfo.transfer.employerReview')}</strong><small>{t('epfo.transfer.expectedEmployer')}</small></div></li><li><span><CircleDot /></span><div><strong>{t('epfo.transfer.epfoProcessing')}</strong><small>{t('epfo.transfer.notStarted')}</small></div></li><li><span><CircleDot /></span><div><strong>{t('epfo.transfer.complete')}</strong><small>{t('epfo.transfer.notStarted')}</small></div></li></ol><Link className="button primary wide" to="/activity">{t('epfo.transfer.track')}<ArrowRight /></Link></div>
}
