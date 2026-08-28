import type { ActionItem, PersonaSeed } from '../types/domain';

export function deriveActions(seed: PersonaSeed): ActionItem[] {
  const notice = seed.tax?.draft?.notices.find(
    (item) => item.state !== 'RESOLVED',
  );
  if (notice)
    return [
      {
        id: `action-${notice.id}`,
        service: 'INCOME_TAX',
        severity: 'BLOCKING',
        title: 'actions.taxNotice.title',
        consequence:
          notice.action.status === 'SUBMITTED'
            ? 'actions.taxNotice.consequenceSubmitted'
            : 'actions.taxNotice.consequenceDefault',
        fixTarget: `/tax/notices/${notice.id}`,
        source: 'actions.taxNotice.source',
        values: {
          section: notice.section,
          reference: notice.source.reference,
        },
      },
    ];
  const delayedRefund = seed.tax?.filedReturns.find(
    (filed) => filed.refund?.status === 'DELAYED',
  );
  if (delayedRefund)
    return [
      {
        id: `action-refund-${delayedRefund.acknowledgmentNumber}`,
        service: 'INCOME_TAX',
        severity: 'WARNING',
        title: 'actions.refundDelayed.title',
        consequence: 'actions.refundDelayed.consequence',
        fixTarget: `/tax/returns/${delayedRefund.acknowledgmentNumber}/refund`,
        source: 'actions.refundDelayed.source',
      },
    ];
  const mismatch = seed.mismatches.find(
    (item) => item.status !== 'RESOLVED' && item.severity === 'BLOCKING',
  );
  if (mismatch)
    return [
      {
        id: `action-${mismatch.id}`,
        service: 'IDENTITY',
        severity: 'BLOCKING',
        title: 'actions.identityMismatch.title',
        consequence: 'actions.identityMismatch.consequence',
        fixTarget: `/identity/mismatch/${mismatch.id}`,
        source: 'actions.identityMismatch.source',
      },
    ];
  if (!seed.epfo.claim)
    return [
      {
        id: 'action-pf-ready',
        service: 'EPFO',
        severity: 'INFO',
        title: 'actions.pfReady.title',
        consequence: 'actions.pfReady.consequence',
        fixTarget: '/epfo/claim',
        source: 'actions.pfReady.source',
      },
    ];
  if (seed.tax?.draft && seed.tax.filedReturns.length === 0)
    return [
      {
        id: 'action-tax-draft',
        service: 'INCOME_TAX',
        severity: 'INFO',
        title: 'actions.taxDraft.title',
        consequence: 'actions.taxDraft.consequence',
        fixTarget: '/tax/file',
        source: 'actions.taxDraft.source',
      },
    ];
  return [];
}

export function identityHealth(seed: PersonaSeed): number {
  const open = seed.mismatches.filter(
    (item) => item.status !== 'RESOLVED',
  ).length;
  return Math.max(0, 100 - open * 28);
}
