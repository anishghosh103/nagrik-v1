import { beforeEach, describe, expect, it } from 'vitest';
import { PERSONA_SEEDS } from '../data/personas';
import { getTaxRulesConfig } from '../data/taxRules';
import { LocalAPIService } from './LocalAPIService';
import type { ReturnDraft, SectionId, SectionState } from '../types/tax';

const SECTION_IDS: SectionId[] = [
  'ELIGIBILITY',
  'INCOME_SOURCES',
  'SALARY',
  'HOUSE_PROPERTY',
  'CAPITAL_GAINS',
  'BUSINESS',
  'INTEREST',
  'DEDUCTIONS',
  'TAX_CREDITS',
  'REGIME',
  'BANK',
];

function emptySectionStates(): Record<SectionId, SectionState> {
  const states = {} as Record<SectionId, SectionState>;
  for (const id of SECTION_IDS)
    states[id] = { status: 'NOT_STARTED', blockingIssues: [] };
  return states;
}

function buildDraftFromSeed(personaId: 'ananya' | 'rajesh'): ReturnDraft {
  const rules = getTaxRulesConfig('2026-27');
  const sources = PERSONA_SEEDS[personaId].tax!.sources;
  return {
    assessmentYear: '2026-27',
    rulesVersion: rules.rulesVersion,
    filingType: 'ORIGINAL',
    filingRoute: 'ITR1_LIKE',
    residentialStatus: 'RESIDENT',
    eligibilityAnswers: {
      residentialStatus: 'RESIDENT',
      isDirector: false,
      holdsUnlistedShares: false,
      hasForeignAssetsOrIncome: false,
      hasDeferredEsopTax: false,
      hasCarryForwardLoss: false,
      expectsIncomeAboveFiftyLakh: false,
      agriculturalIncomeAmount: 0,
      hasSpecialCategoryIncome: false,
      hasIncomeBelongingToAnotherPerson: false,
      hasUnclassifiableIncomeSource: false,
    },
    salary: structuredClone(sources.salary),
    properties: [],
    capitalGains: [],
    business: null,
    otherSources: structuredClone(sources.otherSources).map((item) => ({
      ...item,
      reviewed: true,
      disputed: false,
    })),
    exemptIncome: [],
    deductions: [],
    taxCredits: {
      salaryTds: [],
      otherTds: [],
      tcs: [],
      advanceTax: [],
      selfAssessmentTax: [],
    },
    regime: { selected: 'NEW', recommended: 'NEW' },
    bankAccounts: structuredClone(sources.bankAccounts).map((account) => ({
      ...account,
      validationStatus: 'VALIDATED' as const,
    })),
    refundAccountId: sources.bankAccounts[0]?.id ?? null,
    aisReviewItems: [],
    losses: {
      housePropertyCarriedForward: 0,
      capitalLossCarriedForward: 0,
    },
    filingDate: '2026-08-27',
    validationIssues: [],
    sectionStates: emptySectionStates(),
    notices: [],
    computation: null,
    updatedAt: '2026-08-24T00:00:00.000Z',
  };
}

describe('LocalAPIService vertical slice', () => {
  let service: LocalAPIService;
  beforeEach(() => {
    localStorage.clear();
    service = new LocalAPIService();
  });

  it('isolates persona persistence and resets deterministically', async () => {
    await service.resolveMismatch({
      personaId: 'rajesh',
      mismatchId: 'mismatch-name',
      canonicalValue: 'Rajesh Kumar',
    });
    expect((await service.getMismatches('rajesh'))[0].status).toBe('RESOLVED');
    expect((await service.getPersona('ananya')).identityChanges).toHaveLength(
      0,
    );
    await service.resetPersona('rajesh');
    expect((await service.getMismatches('rajesh'))[0].status).toBe('OPEN');
  });

  it('migrates a version-two persona without discarding identity state', async () => {
    const legacy = structuredClone(PERSONA_SEEDS.rajesh) as unknown as {
      schemaVersion: number;
      epfo: {
        kyc?: unknown;
        passbook?: unknown;
        nomination?: unknown;
        employment: Array<Record<string, unknown>>;
      };
    };
    legacy.schemaVersion = 2;
    delete legacy.epfo.kyc;
    delete legacy.epfo.passbook;
    delete legacy.epfo.nomination;
    legacy.epfo.employment = legacy.epfo.employment.map((record) => {
      const copy = { ...record };
      delete copy.memberId;
      delete copy.current;
      delete copy.balance;
      return copy;
    });
    localStorage.setItem(
      'nagrik:persona:rajesh:state:v2',
      JSON.stringify(legacy),
    );
    const migrated = await service.getPersona('rajesh');
    expect(migrated.schemaVersion).toBe(6);
    expect(migrated.identity.canonical.name).toBe('Rajesh Kumar');
    expect(migrated.epfo.passbook.employers.length).toBeGreaterThan(0);
  });

  it('propagates a correction and replaces the blocking action', async () => {
    const result = await service.resolveMismatch({
      personaId: 'rajesh',
      mismatchId: 'mismatch-name',
      canonicalValue: 'Rajesh Kumar',
    });
    const persona = await service.getPersona('rajesh');
    expect(result.destinations.every((item) => item.status === 'UPDATED')).toBe(
      true,
    );
    expect(
      Object.values(persona.identity.valuesBySource).every(
        (source) => source.name === 'Rajesh Kumar',
      ),
    ).toBe(true);
    expect(persona.actions[0].id).toBe('action-pf-ready');
    expect(
      (await service.validateClaim('rajesh', 'FINAL_SETTLEMENT')).ready,
    ).toBe(true);
    expect(persona.activity[0].kind).toBe('IDENTITY');
  });

  it('blocks an unready claim and prevents duplicate submission', async () => {
    const claim = {
      type: 'FINAL_SETTLEMENT' as const,
      amount: 120000,
      bankConfirmed: true,
      declarationAccepted: true,
      otp: '123456',
    };
    await expect(service.submitClaim('rajesh', claim)).rejects.toThrow(
      'CLAIM_NOT_READY',
    );
    await service.resolveMismatch({
      personaId: 'rajesh',
      mismatchId: 'mismatch-name',
      canonicalValue: 'Rajesh Kumar',
    });
    const first = await service.submitClaim('rajesh', claim);
    const duplicate = await service.submitClaim('rajesh', claim);
    expect(duplicate.reference).toBe(first.reference);
    expect(
      (await service.getActivity('rajesh')).filter(
        (event) => event.title === 'activity.events.claimReceived',
      ),
    ).toHaveLength(1);
  });

  it('restores a verified mock session', async () => {
    const pending = await service.login('rajesh');
    await expect(service.verifyOtp(pending.id, '000000')).rejects.toThrow(
      'INVALID_OTP',
    );
    const verified = await service.verifyOtp(pending.id, '123456');
    expect(verified.verified).toBe(true);
    expect((await service.getSession())?.personaId).toBe('rajesh');
  });

  it('preserves cached passbook data when refresh fails', async () => {
    service = new LocalAPIService({ passbookRefreshOnce: true });
    const cached = await service.getPassbook('rajesh');
    await expect(service.refreshPassbook('rajesh')).rejects.toThrow(
      'SERVICE_UNAVAILABLE',
    );
    expect(await service.getPassbook('rajesh')).toEqual(cached);
    expect((await service.refreshPassbook('rajesh')).employers).toEqual(
      cached.employers,
    );
  });

  it('revalidates service dates and submits one transfer', async () => {
    await service.resolveMismatch({
      personaId: 'rajesh',
      mismatchId: 'mismatch-name',
      canonicalValue: 'Rajesh Kumar',
    });
    expect(
      (await service.validateTransfer('rajesh', 'emp-r-1', 'emp-r-2')).ready,
    ).toBe(false);
    await service.updateEmploymentExit('rajesh', 'emp-r-1', '2025-05-14');
    expect(
      (await service.validateTransfer('rajesh', 'emp-r-1', 'emp-r-2')).ready,
    ).toBe(true);
    const input = {
      sourceEmploymentId: 'emp-r-1',
      destinationEmploymentId: 'emp-r-2',
      declarationAccepted: true,
      otp: '123456',
    };
    const first = await service.submitTransfer('rajesh', input);
    const duplicate = await service.submitTransfer('rajesh', input);
    expect(duplicate.reference).toBe(first.reference);
    expect(
      (await service.getActivity('rajesh')).filter(
        (event) => event.title === 'activity.events.transferReceived',
      ),
    ).toHaveLength(1);
  });

  it('autosaves and verifies an exact nomination allocation', async () => {
    const nominees = [
      {
        id: 'n-1',
        name: 'Meera Kumar',
        relationship: 'SPOUSE' as const,
        dateOfBirth: '1988-04-12',
        share: 60,
      },
      {
        id: 'n-2',
        name: 'Asha Kumar',
        relationship: 'PARENT' as const,
        dateOfBirth: '1962-01-20',
        share: 40,
      },
    ];
    expect((await service.saveNominationDraft('rajesh', nominees)).status).toBe(
      'DRAFT',
    );
    await expect(
      service.submitNomination(
        'rajesh',
        nominees.map((item, index) => ({
          ...item,
          share: index === 0 ? 50 : 40,
        })),
        '123456',
      ),
    ).rejects.toThrow('NOMINATION_ALLOCATION_INVALID');
    const result = await service.submitNomination('rajesh', nominees, '123456');
    expect(result.status).toBe('EFFECTIVE');
    expect(result.reference).toBe('NGR-NOM-6473');
  });

  it('round-trips a saved Income Tax return draft', async () => {
    expect(await service.getExistingReturnDraft('ananya', '2026-27')).toBe(
      null,
    );
    const draft = buildDraftFromSeed('ananya');
    await service.saveReturnDraft('ananya', draft);
    const loaded = await service.getExistingReturnDraft('ananya', '2026-27');
    expect(loaded?.regime.selected).toBe('NEW');
    expect(loaded?.salary).toHaveLength(1);
  });

  it('keeps filing and e-verification as separate statuses', async () => {
    const draft = buildDraftFromSeed('ananya');
    const filed = await service.fileReturn('ananya', draft);
    expect(filed.acknowledgmentNumber).toBe('NGR-ITR-260825-3382');
    await expect(
      service.verifyReturn('ananya', {
        acknowledgmentNumber: filed.acknowledgmentNumber,
        otp: '000000',
      }),
    ).rejects.toThrow('INVALID_OTP');
    const verified = await service.verifyReturn('ananya', {
      acknowledgmentNumber: filed.acknowledgmentNumber,
      otp: '123456',
    });
    expect(verified.status).toBe('VERIFIED');
  });

  it('files an Income Tax return once and resubmits idempotently', async () => {
    const draft = buildDraftFromSeed('ananya');
    const first = await service.fileReturn('ananya', draft);
    const duplicate = await service.fileReturn('ananya', draft);
    expect(duplicate.acknowledgmentNumber).toBe(first.acknowledgmentNumber);
    const persona = await service.getPersona('ananya');
    expect(persona.tax?.filedReturns).toHaveLength(1);
    expect(
      persona.activity.filter((event) => event.kind === 'INCOME_TAX'),
    ).toHaveLength(1);
  });

  it('tracks and recovers a cause-aware delayed refund', async () => {
    const draft = buildDraftFromSeed('rajesh');
    const filed = await service.fileReturn('rajesh', draft);
    await service.verifyReturn('rajesh', {
      acknowledgmentNumber: filed.acknowledgmentNumber,
      otp: '123456',
    });
    let snapshot = (await service.getFiledReturns('rajesh'))[0];
    expect(snapshot.refund?.status).toBe('DELAYED');
    expect(snapshot.refund?.delayReason).toBe('BANK_LINKAGE');
    snapshot = await service.revalidateRefundBank(
      'rajesh',
      filed.acknowledgmentNumber,
    );
    expect(snapshot.refund?.status).toBe('PROCESSING');
    expect(snapshot.refund?.delayReason).toBeUndefined();
    snapshot = await service.refreshFiledReturnStatus(
      'rajesh',
      filed.acknowledgmentNumber,
    );
    expect(snapshot.processing.status).toBe('PROCESSED');
  });

  it('imports notices idempotently and resolves a payment only once', async () => {
    const filed = await service.fileReturn(
      'ananya',
      buildDraftFromSeed('ananya'),
    );
    await service.verifyReturn('ananya', {
      acknowledgmentNumber: filed.acknowledgmentNumber,
      otp: '123456',
    });
    const first = await service.importNotice('ananya', 'DEMAND_CONFIRMED');
    const duplicate = await service.importNotice('ananya', 'DEMAND_CONFIRMED');
    expect(duplicate.id).toBe(first.id);
    expect(await service.getNotices('ananya')).toHaveLength(1);
    const paid = await service.submitNoticePayment('ananya', first.id);
    const paidAgain = await service.submitNoticePayment('ananya', first.id);
    expect(paidAgain.action.reference).toBe(paid.action.reference);
    expect(paid.state).toBe('RESOLVED');
  });

  it('keeps rectification pending until the simulated order arrives', async () => {
    const filed = await service.fileReturn(
      'ananya',
      buildDraftFromSeed('ananya'),
    );
    await service.verifyReturn('ananya', {
      acknowledgmentNumber: filed.acknowledgmentNumber,
      otp: '123456',
    });
    const notice = await service.importNotice('ananya', 'TDS_CREDIT_OMITTED');
    const submitted = await service.submitRectification('ananya', notice.id);
    expect(submitted.action.status).toBe('SUBMITTED');
    expect(submitted.state).toBe('ACTION_REQUIRED');
    const resolved = await service.refreshNoticeOutcome('ananya', notice.id);
    expect(resolved.action.status).toBe('COMPLETED');
    expect(resolved.state).toBe('RESOLVED');
  });

  it('reopens the exact 139(9) section and resolves after refiling and verification', async () => {
    const filed = await service.fileReturn(
      'ananya',
      buildDraftFromSeed('ananya'),
    );
    await service.verifyReturn('ananya', {
      acknowledgmentNumber: filed.acknowledgmentNumber,
      otp: '123456',
    });
    const notice = await service.importNotice('ananya', 'DEFECTIVE_WRONG_FORM');
    await service.startNoticeRemedy('ananya', notice.id);
    const reopened = (await service.getExistingReturnDraft(
      'ananya',
      '2026-27',
    ))!;
    expect(reopened.filingType).toBe('DEFECTIVE_RESPONSE');
    expect(reopened.responseToNoticeId).toBe(notice.id);
    expect(reopened.sectionStates.CAPITAL_GAINS.status).toBe('NEEDS_REVIEW');
    reopened.sectionStates.CAPITAL_GAINS.status = 'COMPLETE';
    const response = await service.fileReturn('ananya', reopened);
    expect(response.acknowledgmentNumber).toMatch(/-R1$/);
    expect((await service.getNotices('ananya'))[0].state).toBe(
      'ACTION_REQUIRED',
    );
    await service.verifyReturn('ananya', {
      acknowledgmentNumber: response.acknowledgmentNumber,
      otp: '123456',
    });
    expect((await service.getNotices('ananya'))[0].state).toBe('RESOLVED');
    expect((await service.getFiledReturns('ananya'))[0].draft.salary).toEqual(
      reopened.salary,
    );
  });

  it('migrates a version-three persona without discarding identity or tax state', async () => {
    const legacy = structuredClone(PERSONA_SEEDS.rajesh) as unknown as {
      schemaVersion: number;
      tax?: unknown;
    };
    legacy.schemaVersion = 3;
    delete legacy.tax;
    localStorage.setItem(
      'nagrik:persona:rajesh:state:v3',
      JSON.stringify(legacy),
    );
    const migrated = await service.getPersona('rajesh');
    expect(migrated.schemaVersion).toBe(6);
    expect(migrated.identity.canonical.name).toBe('Rajesh Kumar');
    expect(migrated.tax?.assessmentYear).toBe('2026-27');
    expect(migrated.tax?.sources.salary.length).toBeGreaterThan(0);
  });
});
