import { describe, expect, it } from 'vitest';
import {
  createSimulatedNotice,
  getDeadlineState,
  getItruAdditionalTaxRate,
  remedyForFixture,
} from './notices';

describe('post-filing notice rules', () => {
  it('selects one remedy from fixture facts', () => {
    expect(remedyForFixture('DEFECTIVE_WRONG_FORM')).toBe('REFILE');
    expect(remedyForFixture('DEMAND_CONFIRMED')).toBe('PAY');
    expect(remedyForFixture('TDS_CREDIT_OMITTED')).toBe('RECTIFY');
    expect(remedyForFixture('UPDATED_RETURN_CANDIDATE')).toBe('ITR_U');
  });

  it('creates a hard fifteen-day 139(9) deadline and exact target', () => {
    const now = new Date('2026-08-28T00:00:00.000Z');
    const notice = createSimulatedNotice('DEFECTIVE_WRONG_FORM', 'ACK-1', now);
    expect(notice.responseDeadline).toBe('2026-09-12T00:00:00.000Z');
    expect(getDeadlineState(notice, now)).toEqual({ kind: 'DUE', days: 15 });
    expect(notice.discrepancies[0].target?.sectionId).toBe('CAPITAL_GAINS');
  });

  it('handles due-today and overdue boundaries', () => {
    const notice = createSimulatedNotice(
      'DEFECTIVE_WRONG_FORM',
      'ACK-1',
      new Date('2026-08-28T00:00:00.000Z'),
    );
    expect(
      getDeadlineState(notice, new Date('2026-09-12T00:00:00.000Z')).kind,
    ).toBe('DUE_TODAY');
    expect(
      getDeadlineState(notice, new Date('2026-09-14T00:00:00.000Z')),
    ).toEqual({ kind: 'OVERDUE', days: 2 });
  });

  it('gates ITR-U and exposes all four statutory bands', () => {
    expect(
      getItruAdditionalTaxRate('2026-27', new Date('2026-08-28T00:00:00Z')),
    ).toBeNull();
    expect(
      getItruAdditionalTaxRate('2022-23', new Date('2024-01-01T00:00:00Z')),
    ).toBe(25);
    expect(
      getItruAdditionalTaxRate('2022-23', new Date('2024-05-01T00:00:00Z')),
    ).toBe(50);
    expect(
      getItruAdditionalTaxRate('2022-23', new Date('2025-05-01T00:00:00Z')),
    ).toBe(60);
    expect(
      getItruAdditionalTaxRate('2022-23', new Date('2026-05-01T00:00:00Z')),
    ).toBe(70);
  });
});
