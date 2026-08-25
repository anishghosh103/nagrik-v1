import { useRef, useState } from 'react'
import { ArrowRight, Check, LoaderCircle, Plus, Trash2, UserRound, UsersRound } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { useAppStore } from '../../app/store'
import { formatDate } from '../../components/formatters'
import { PageHeader, Status } from '../../components/ui'
import { validateNomineeAllocation } from '../../rules/epfo'
import type { Nominee } from '../../types/domain'

type NominationStep = 'status' | 'details' | 'allocation' | 'review' | 'submitting' | 'done'

const blankNominee = (index: number): Nominee => ({ id: `nominee-${Date.now()}-${index}`, name: '', relationship: 'SPOUSE', dateOfBirth: '', share: 0 })

export function NominationPage() {
  const { t, i18n } = useTranslation()
  const { persona, busy, saveNominationDraft, submitNomination } = useAppStore()
  const existing = persona?.epfo.nomination
  const [step, setStep] = useState<NominationStep>(existing?.status === 'EFFECTIVE' ? 'status' : existing?.status === 'DRAFT' ? 'details' : 'status')
  const [nominees, setNominees] = useState<Nominee[]>(existing?.nominees.length ? existing.nominees : [blankNominee(0)])
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const errorRef = useRef<HTMLDivElement>(null)
  if (!persona || !existing) return null
  const allocation = validateNomineeAllocation(nominees.map((nominee) => nominee.share))

  function update(index: number, patch: Partial<Nominee>) { setNominees((items) => items.map((item, itemIndex) => itemIndex === index ? { ...item, ...patch } : item)) }
  function remove(index: number) { setNominees((items) => items.filter((_, itemIndex) => itemIndex !== index)) }
  async function continueToAllocation() {
    if (nominees.some((nominee) => !nominee.name.trim() || !nominee.dateOfBirth)) { setError(t('epfo.nomination.detailsError')); errorRef.current?.focus(); return }
    setError(''); await saveNominationDraft(nominees); setStep('allocation')
  }
  async function continueToReview() {
    if (!allocation.valid) { setError(t('epfo.nomination.allocationError', { total: allocation.total })); queueMicrotask(() => errorRef.current?.focus()); return }
    setError(''); await saveNominationDraft(nominees); setStep('review')
  }
  async function submit() {
    if (otp !== '123456') { setError(t('epfo.nomination.otpError')); queueMicrotask(() => errorRef.current?.focus()); return }
    setError(''); setStep('submitting')
    try { await submitNomination(nominees, otp); setStep('done') } catch { setError(t('epfo.nomination.submitFailed')); setStep('review') }
  }

  if (step === 'done') return <NominationComplete />
  return <div className="page narrow journey-page"><PageHeader eyebrow={t('epfo.nomination.eyebrow')} title={t('epfo.nomination.title')} subtitle={t('epfo.nomination.subtitle')} back="/epfo" />
    {step === 'status' && <section className="nomination-status"><span className="large-glyph"><UsersRound /></span><Status kind={existing.status === 'EFFECTIVE' ? 'success' : 'warning'}>{t(`epfo.nomination.status.${existing.status.toLowerCase()}`)}</Status><h2>{t(existing.status === 'EFFECTIVE' ? 'epfo.nomination.effectiveTitle' : 'epfo.nomination.emptyTitle')}</h2><p>{t(existing.status === 'EFFECTIVE' ? 'epfo.nomination.effectiveHelp' : 'epfo.nomination.emptyHelp')}</p>{existing.status === 'EFFECTIVE' && <div className="nominee-summary">{existing.nominees.map((nominee) => <div key={nominee.id}><UserRound /><span><strong>{nominee.name}</strong><small>{t(`epfo.nomination.relationship.${nominee.relationship.toLowerCase()}`)}</small></span><b>{nominee.share}%</b></div>)}</div>}<div className="sticky-action"><span>{existing.reference ?? t('common.saved')}</span><button className="button primary" onClick={() => setStep('details')}>{t(existing.status === 'EFFECTIVE' ? 'epfo.nomination.update' : 'epfo.nomination.start')}<ArrowRight /></button></div></section>}
    {step === 'details' && <section><h2>{t('epfo.nomination.detailsTitle')}</h2><p className="section-intro">{t('epfo.nomination.detailsHelp')}</p>{error && <div ref={errorRef} className="validation-error" role="alert" tabIndex={-1}>{error}</div>}<div className="nominee-forms">{nominees.map((nominee, index) => <fieldset key={nominee.id}><legend>{t('epfo.nomination.nomineeNumber', { number: index + 1 })}</legend><label htmlFor={`nominee-name-${index}`}>{t('epfo.nomination.name')}</label><input id={`nominee-name-${index}`} value={nominee.name} onChange={(event) => update(index, { name: event.target.value })} /><label htmlFor={`nominee-relation-${index}`}>{t('epfo.nomination.relationshipLabel')}</label><select id={`nominee-relation-${index}`} value={nominee.relationship} onChange={(event) => update(index, { relationship: event.target.value as Nominee['relationship'] })}><option value="SPOUSE">{t('epfo.nomination.relationship.spouse')}</option><option value="CHILD">{t('epfo.nomination.relationship.child')}</option><option value="PARENT">{t('epfo.nomination.relationship.parent')}</option><option value="OTHER">{t('epfo.nomination.relationship.other')}</option></select><label htmlFor={`nominee-dob-${index}`}>{t('epfo.nomination.dob')}</label><input id={`nominee-dob-${index}`} type="date" value={nominee.dateOfBirth} max="2010-12-31" onChange={(event) => update(index, { dateOfBirth: event.target.value })} />{nominees.length > 1 && <button className="text-button danger-text" onClick={() => remove(index)}><Trash2 />{t('epfo.nomination.remove')}</button>}</fieldset>)}</div><button className="button secondary add-nominee" onClick={() => setNominees((items) => [...items, blankNominee(items.length)])}><Plus />{t('epfo.nomination.add')}</button><div className="sticky-action"><button className="button secondary" onClick={() => setStep('status')}>{t('common.back')}</button><button className="button primary" onClick={() => void continueToAllocation()}>{t('epfo.nomination.allocate')}<ArrowRight /></button></div></section>}
    {step === 'allocation' && <section><h2>{t('epfo.nomination.allocationTitle')}</h2><p className="section-intro">{t('epfo.nomination.allocationHelp')}</p>{error && <div ref={errorRef} className="validation-error" role="alert" tabIndex={-1}>{error}</div>}<div className="allocation-total" aria-live="polite"><span>{t('epfo.nomination.total')}</span><strong>{allocation.total}%</strong><Status kind={allocation.valid ? 'success' : 'danger'}>{t(allocation.valid ? 'epfo.nomination.exact' : 'epfo.nomination.mustEqual')}</Status></div><div className="allocation-list">{nominees.map((nominee, index) => <label key={nominee.id} htmlFor={`share-${index}`}><span><strong>{nominee.name}</strong><small>{t(`epfo.nomination.relationship.${nominee.relationship.toLowerCase()}`)}</small></span><span className="percentage-input"><input id={`share-${index}`} type="number" min="0" max="100" value={nominee.share} aria-describedby="allocation-help" onChange={(event) => update(index, { share: Number(event.target.value) })} /><b>%</b></span></label>)}</div><p id="allocation-help" className="field-help">{t('epfo.nomination.exactHelp')}</p><div className="sticky-action"><button className="button secondary" onClick={() => setStep('details')}>{t('common.back')}</button><button className="button primary" onClick={() => void continueToReview()}>{t('epfo.nomination.review')}<ArrowRight /></button></div></section>}
    {step === 'review' && <section><h2>{t('epfo.nomination.reviewTitle')}</h2>{error && <div ref={errorRef} className="validation-error" role="alert" tabIndex={-1}>{error}</div>}<div className="nominee-summary review">{nominees.map((nominee) => <div key={nominee.id}><UserRound /><span><strong>{nominee.name}</strong><small>{t(`epfo.nomination.relationship.${nominee.relationship.toLowerCase()}`)} · {formatDate(nominee.dateOfBirth, i18n.language)}</small></span><b>{nominee.share}%</b></div>)}</div><div className="readiness-banner ready"><Check /><div><Status kind="success">{t('epfo.nomination.ready')}</Status><h2>{t('epfo.nomination.totalHundred')}</h2><p>{t('epfo.nomination.verifyHelp')}</p></div></div><label className="field-label" htmlFor="nomination-otp">{t('epfo.otp')} <small>{t('epfo.otpHint')}</small></label><input id="nomination-otp" className="otp-input" maxLength={6} inputMode="numeric" value={otp} onChange={(event) => setOtp(event.target.value.replace(/\D/g, ''))} /><div className="sticky-action"><button className="button secondary" onClick={() => setStep('allocation')}>{t('common.back')}</button><button className="button primary" disabled={busy} onClick={() => void submit()}>{t('epfo.nomination.verify')}<ArrowRight /></button></div></section>}
    {step === 'submitting' && <section className="propagation-progress" aria-live="polite"><LoaderCircle className="spinner" /><h2>{t('epfo.nomination.submitting')}</h2><p>{t('epfo.nomination.submittingHelp')}</p></section>}
  </div>
}

function NominationComplete() {
  const { t, i18n } = useTranslation()
  const nomination = useAppStore((state) => state.persona?.epfo.nomination)
  if (!nomination) return null
  return <div className="page narrow completion-page"><PageHeader eyebrow={t('epfo.nomination.completeEyebrow')} title={t('epfo.nomination.completeTitle')} subtitle={t('epfo.nomination.completeHelp')} back="/epfo" /><div className="outcome-mark"><Check /></div><div className="reference-band"><span>{t('epfo.nomination.reference')}</span><strong>{nomination.reference}</strong><small>{t('epfo.nomination.effectiveOn', { date: formatDate(nomination.updatedAt, i18n.language) })}</small></div><section className="status-now success-border"><Status kind="success">{t('epfo.nomination.status.effective')}</Status><h2>{t('epfo.nomination.legallyRecorded')}</h2><p>{t('epfo.nomination.prototype')}</p></section><Link className="button primary wide" to="/epfo/history">{t('epfo.nomination.viewHistory')}<ArrowRight /></Link></div>
}
