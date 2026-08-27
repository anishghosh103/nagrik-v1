import type { ActionItem, PersonaSeed } from '../types/domain';

export function deriveActions(seed: PersonaSeed): ActionItem[] {
  const mismatch = seed.mismatches.find(
    (item) => item.status !== 'RESOLVED' && item.severity === 'BLOCKING',
  );
  if (mismatch)
    return [
      {
        id: `action-${mismatch.id}`,
        service: 'IDENTITY',
        severity: 'BLOCKING',
        title: 'Correct your name across connected records',
        consequence:
          'This difference can block your PF claim and delay Income Tax bank validation.',
        fixTarget: `/identity/mismatch/${mismatch.id}`,
        source: 'Aadhaar, PAN, bank, EPFO and Income Tax records',
      },
    ];
  if (!seed.epfo.claim)
    return [
      {
        id: 'action-pf-ready',
        service: 'EPFO',
        severity: 'INFO',
        title: 'Your PF claim checks are ready',
        consequence:
          'Review the checks and decide whether to submit a final settlement claim.',
        fixTarget: '/epfo/claim',
        source: 'EPFO and identity records',
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
