import { describe, expect, it } from 'vitest';
import {
  currentMeaningKey,
  isEscalationEligible,
  scriptedOutcome,
  suggestCategory,
  suggestService,
} from './grievances';

describe('grievance suggestion rules', () => {
  it('detects the EPFO service from a plain-language description', () => {
    expect(
      suggestService('My May contribution is missing from my PF passbook'),
    ).toBe('EPFO');
  });

  it('detects the Income Tax service from a plain-language description', () => {
    expect(
      suggestService('My refund has not been credited after I filed my return'),
    ).toBe('INCOME_TAX');
  });

  it('falls back to EPFO when nothing matches', () => {
    expect(suggestService('Something is wrong')).toBe('EPFO');
  });

  it('suggests the closest category for the detected service', () => {
    expect(
      suggestCategory('EPFO', 'My contribution is missing from the passbook'),
    ).toBe('CONTRIBUTION_MISMATCH');
    expect(suggestCategory('EPFO', 'Nothing specific')).toBe('OTHER');
  });
});

describe('grievance escalation and status meaning', () => {
  it('is escalation eligible only after a no-change disposal with no escalation yet', () => {
    expect(isEscalationEligible('DISPOSED', 'NO_CHANGE', undefined)).toBe(true);
    expect(isEscalationEligible('DISPOSED', 'RESOLVED', undefined)).toBe(false);
    expect(isEscalationEligible('IN_REVIEW', undefined, undefined)).toBe(false);
    expect(
      isEscalationEligible('DISPOSED', 'NO_CHANGE', {
        requestedAt: '2026-01-01T00:00:00.000Z',
        status: 'IN_REVIEW',
      }),
    ).toBe(false);
  });

  it('produces the disposed-without-change meaning key for the contribution demo', () => {
    expect(scriptedOutcome('CONTRIBUTION_MISMATCH')).toBe('NO_CHANGE');
    expect(currentMeaningKey('DISPOSED', 'NO_CHANGE', undefined)).toBe(
      'grievances.meaning.disposedNoChange',
    );
  });
});
