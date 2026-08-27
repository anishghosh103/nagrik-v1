import { beforeEach, describe, expect, it } from 'vitest';
import { PERSONA_SEEDS } from '../data/personas';
import { LocalAPIService } from './LocalAPIService';

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
    expect(migrated.schemaVersion).toBe(3);
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
});
