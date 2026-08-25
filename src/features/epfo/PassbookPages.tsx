import { useCallback, useEffect, useRef, useState } from 'react'
import { AlertTriangle, ArrowRight, Check, CircleDot, Landmark, LoaderCircle, RefreshCw, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { useAppStore } from '../../app/store'
import { formatDate, formatMoney } from '../../components/formatters'
import { PageHeader, SourceMarker, Status } from '../../components/ui'
import type { MonthlyContribution } from '../../types/domain'

export function PassbookPage() {
  const { t, i18n } = useTranslation()
  const { persona, online, refreshPassbook } = useAppStore()
  const [refreshing, setRefreshing] = useState(false)
  const [refreshFailed, setRefreshFailed] = useState(false)
  const [selected, setSelected] = useState<MonthlyContribution | null>(null)
  const attempted = useRef(false)

  const refresh = useCallback(async () => {
    setRefreshing(true); setRefreshFailed(false)
    try { await refreshPassbook() } catch { setRefreshFailed(true) } finally { setRefreshing(false) }
  }, [refreshPassbook])
  useEffect(() => { if (!attempted.current && online) { attempted.current = true; void refresh() } }, [online, refresh])
  if (!persona) return null
  const passbook = persona.epfo.passbook
  return <div className="page"><PageHeader eyebrow={t('epfo.passbook.eyebrow')} title={t('epfo.passbook.title')} subtitle={t('epfo.passbook.subtitle')} back="/epfo" />
    <section className="balance-band passbook-balance"><div><p>{t('epfo.passbook.total')}</p><strong>{formatMoney(persona.epfo.balance, i18n.language)}</strong><small>{t('epfo.passbook.captured', { date: formatDate(passbook.capturedAt, i18n.language) })}</small></div><button className="button secondary" disabled={refreshing || !online} onClick={() => void refresh()}>{refreshing ? <LoaderCircle className="spinner-small" /> : <RefreshCw />}{t(refreshing ? 'epfo.passbook.refreshing' : 'epfo.passbook.refresh')}</button></section>
    {!online && <div className="cache-notice" role="status"><CircleDot /><div><strong>{t('epfo.passbook.offline')}</strong><span>{t('epfo.passbook.offlineHelp')}</span></div></div>}
    {refreshFailed && <div className="cache-notice warning" role="alert"><AlertTriangle /><div><strong>{t('epfo.passbook.failed')}</strong><span>{t('epfo.passbook.failedHelp')}</span></div><button className="text-button" onClick={() => void refresh()}>{t('common.retry')}</button></div>}
    {passbook.employers.map((employer) => { const total = employer.openingBalance + employer.contributions.reduce((sum, item) => sum + item.employee + item.employer, 0); return <section className="passbook-employer" key={employer.employmentId}><div className="employer-ledger-head"><div><Landmark /><span><h2>{employer.employer}</h2><SourceMarker>{t('epfo.passbook.memberSource')}</SourceMarker></span></div><div><small>{t('epfo.passbook.employerTotal')}</small><strong>{formatMoney(total, i18n.language)}</strong></div></div><div className="financial-table"><table><caption>{t('epfo.passbook.caption', { employer: employer.employer })}</caption><thead><tr><th scope="col">{t('epfo.passbook.month')}</th><th scope="col">{t('epfo.passbook.employee')}</th><th scope="col">{t('epfo.passbook.employer')}</th><th scope="col">{t('epfo.passbook.pension')}</th><th scope="col">{t('epfo.passbook.state')}</th></tr></thead><tbody>{employer.contributions.map((item) => <tr key={item.id} className={item.status === 'MISSING' ? 'missing-row' : ''}><th scope="row">{formatDate(item.month, i18n.language)}</th><td data-label={t('epfo.passbook.employee')}>{formatMoney(item.employee, i18n.language)}</td><td data-label={t('epfo.passbook.employer')}>{formatMoney(item.employer, i18n.language)}</td><td data-label={t('epfo.passbook.pension')}>{formatMoney(item.pension, i18n.language)}</td><td data-label={t('epfo.passbook.state')}><button className="status-button" onClick={() => setSelected(item)}><Status kind={item.status === 'POSTED' ? 'success' : 'warning'}>{t(item.status === 'POSTED' ? 'epfo.passbook.posted' : 'epfo.passbook.missing')}</Status></button></td></tr>)}</tbody><tfoot><tr><th>{t('epfo.passbook.opening')}</th><td colSpan={4}>{formatMoney(employer.openingBalance, i18n.language)}</td></tr></tfoot></table></div></section> })}
    {selected && <ContributionSheet contribution={selected} onClose={() => setSelected(null)} />}
  </div>
}

function ContributionSheet({ contribution, onClose }: { contribution: MonthlyContribution; onClose: () => void }) {
  const { t, i18n } = useTranslation()
  const close = useRef<HTMLButtonElement>(null)
  useEffect(() => { close.current?.focus() }, [])
  return <div className="sheet-backdrop" role="presentation"><section className="detail-sheet" role="dialog" aria-modal="true" aria-labelledby="contribution-title"><button ref={close} className="icon-button sheet-close" onClick={onClose} aria-label={t('common.close')}><X /></button><p className="eyebrow">{t('epfo.passbook.detailEyebrow')}</p><h2 id="contribution-title">{formatDate(contribution.month, i18n.language)}</h2><div className="claim-review"><div><span>{t('epfo.passbook.employee')}</span><strong>{formatMoney(contribution.employee, i18n.language)}</strong></div><div><span>{t('epfo.passbook.employer')}</span><strong>{formatMoney(contribution.employer, i18n.language)}</strong></div><div><span>{t('epfo.passbook.pension')}</span><strong>{formatMoney(contribution.pension, i18n.language)}</strong></div></div><p>{t(contribution.status === 'POSTED' ? 'epfo.passbook.postedHelp' : 'epfo.passbook.missingHelp')}</p>{contribution.status === 'MISSING' && <Link className="button primary wide" to="/epfo/passbook/issue">{t('epfo.passbook.resolve')}<ArrowRight /></Link>}</section></div>
}

export function ContributionIssuePage() {
  const { t } = useTranslation()
  const persona = useAppStore((state) => state.persona)
  const issue = persona?.epfo.contributionIssue
  if (!persona || !issue) return <div className="page narrow"><PageHeader eyebrow={t('epfo.issue.eyebrow')} title={t('epfo.issue.none')} subtitle={t('epfo.issue.noneHelp')} back="/epfo/passbook" /></div>
  const employer = persona.epfo.employment.find((item) => item.id === issue.employmentId)
  return <div className="page narrow"><PageHeader eyebrow={t('epfo.issue.eyebrow')} title={t('epfo.issue.title')} subtitle={t('epfo.issue.subtitle')} back="/epfo/passbook" /><section className="issue-explanation"><Status kind="warning">{t('epfo.issue.category')}</Status><h2>{issue.summary}</h2><p>{t('epfo.issue.consequence')}</p></section><div className="claim-review"><div><span>{t('epfo.issue.service')}</span><strong>{t('nav.epfo')}</strong></div><div><span>{t('epfo.issue.employer')}</span><strong>{employer?.employer}</strong></div><div><span>{t('epfo.issue.categoryLabel')}</span><strong>{t('epfo.issue.category')}</strong></div></div><aside className="handoff-panel"><Check /><div><h2>{t('epfo.issue.prefilled')}</h2><p>{t('epfo.issue.prefilledHelp')}</p></div></aside><button className="button primary" disabled aria-describedby="grievance-deferred">{t('epfo.issue.submit')}</button><p id="grievance-deferred" className="field-help">{t('epfo.issue.deferred')}</p></div>
}
