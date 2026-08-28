import type {
  NoticeFixtureId,
  NoticeItem,
  NoticeRemedy,
} from '../../types/tax';

export interface DeadlineState {
  kind: 'DUE' | 'DUE_TODAY' | 'OVERDUE' | 'ELAPSED';
  days: number;
}

const DAY = 86_400_000;

function addDays(value: Date, days: number) {
  return new Date(value.getTime() + days * DAY).toISOString();
}

export function getDeadlineState(
  notice: NoticeItem,
  now = new Date(),
): DeadlineState {
  if (!notice.responseDeadline) {
    return {
      kind: 'ELAPSED',
      days: Math.max(
        0,
        Math.floor((now.getTime() - new Date(notice.issuedOn).getTime()) / DAY),
      ),
    };
  }
  const days = Math.ceil(
    (new Date(notice.responseDeadline).getTime() - now.getTime()) / DAY,
  );
  if (days < 0) return { kind: 'OVERDUE', days: Math.abs(days) };
  if (days === 0) return { kind: 'DUE_TODAY', days: 0 };
  return { kind: 'DUE', days };
}

export function getItruAdditionalTaxRate(
  assessmentYear: string,
  now = new Date(),
): 25 | 50 | 60 | 70 | null {
  const startYear = Number(assessmentYear.slice(0, 4));
  const windowStart = new Date(Date.UTC(startYear + 1, 2, 31, 23, 59, 59));
  if (now <= windowStart) return null;
  const months =
    (now.getUTCFullYear() - windowStart.getUTCFullYear()) * 12 +
    now.getUTCMonth() -
    windowStart.getUTCMonth();
  if (months < 12) return 25;
  if (months < 24) return 50;
  if (months < 36) return 60;
  if (months < 48) return 70;
  return null;
}

export function remedyForFixture(fixtureId: NoticeFixtureId): NoticeRemedy {
  if (fixtureId === 'DEFECTIVE_WRONG_FORM') return 'REFILE';
  if (fixtureId === 'DEMAND_CONFIRMED') return 'PAY';
  if (fixtureId === 'TDS_CREDIT_OMITTED') return 'RECTIFY';
  return 'ITR_U';
}

export function createSimulatedNotice(
  fixtureId: NoticeFixtureId,
  acknowledgmentNumber: string,
  now = new Date(),
): NoticeItem {
  const importedAt = now.toISOString();
  const id = `notice-${fixtureId.toLowerCase()}-${acknowledgmentNumber}`;
  const common = {
    id,
    linkedAcknowledgmentNumber: acknowledgmentNumber,
    fixtureId,
    issuedOn: importedAt,
    importedAt,
    source: {
      kind: 'SIMULATED_IMPORT' as const,
      reference: `DEMO-${fixtureId.replaceAll('_', '-')}`,
    },
    remedy: remedyForFixture(fixtureId),
    state: 'ACTION_REQUIRED' as const,
    action: { status: 'NOT_STARTED' as const },
  };

  if (fixtureId === 'DEFECTIVE_WRONG_FORM')
    return {
      ...common,
      section: '139(9)',
      responseDeadline: addDays(now, 15),
      discrepancies: [
        {
          id: `${id}-wrong-form`,
          code: 'WRONG_FORM',
          labelKey: 'tax.postFiling.discrepancies.wrongForm',
          declaredAmount: 0,
          departmentAmount: 0,
          source: 'CPC',
          target: {
            sectionId: 'CAPITAL_GAINS',
            route: '/tax/file/income-details?step=capital',
            focusId: 'capital-gains-heading',
          },
        },
      ],
    };

  if (fixtureId === 'DEMAND_CONFIRMED')
    return {
      ...common,
      section: '143(1)',
      responseDeadline: addDays(now, 30),
      discrepancies: [
        {
          id: `${id}-demand`,
          code: 'UNPAID_DEMAND',
          labelKey: 'tax.postFiling.discrepancies.demand',
          declaredAmount: 0,
          departmentAmount: 12400,
          source: 'CPC',
        },
      ],
    };

  if (fixtureId === 'TDS_CREDIT_OMITTED')
    return {
      ...common,
      section: '143(1)',
      discrepancies: [
        {
          id: `${id}-credit`,
          code: 'TDS_CREDIT_MISSING',
          labelKey: 'tax.postFiling.discrepancies.credit',
          declaredAmount: 18000,
          departmentAmount: 0,
          source: 'CPC',
        },
      ],
    };

  return {
    ...common,
    section: '143(1)',
    discrepancies: [
      {
        id: `${id}-omitted`,
        code: 'OMITTED_INCOME',
        labelKey: 'tax.postFiling.discrepancies.omittedIncome',
        declaredAmount: 0,
        departmentAmount: 220000,
        source: 'CPC',
      },
    ],
  };
}
