import { cloneSeed } from '../data/personas';
import { deriveActions } from '../rules/identity';
import {
  validateNomineeAllocation,
  validatePFClaim,
  validatePFTransfer,
} from '../rules/epfo';
import {
  compareRegimes as compareRegimesRule,
  computeReturn as computeReturnRule,
  determineFilingRoute as determineFilingRouteRule,
  validateReturn as validateReturnRule,
} from '../rules/tax';
import { getTaxRulesConfig } from '../data/taxRules';
import type { APIService } from './APIService';
import type {
  ClaimSubmission,
  ClaimType,
  IdentitySource,
  MockSession,
  Nominee,
  NominationRecord,
  PersonaId,
  PersonaSeed,
  PFClaim,
  PFTransfer,
  PFTransferInput,
  PropagationDestination,
  PropagationResult,
  ResolveMismatchInput,
  RetryPropagationInput,
} from '../types/domain';
import { personaSeedSchema } from '../types/domain';
import type { FiledReturnSnapshot, ReturnDraft, TaxRegime } from '../types/tax';

const SCHEMA_VERSION = 5;
const SESSION_KEY = 'nagrik:app:session';
const keyFor = (id: PersonaId, version = SCHEMA_VERSION) =>
  `nagrik:persona:${id}:state:v${version}`;
const destinations: IdentitySource[] = [
  'AADHAAR',
  'PAN',
  'BANK',
  'EPFO',
  'INCOME_TAX',
];

/** Constructor-only test seams. The production singleton is created without these options. */
export interface LocalAPITestFailures {
  propagationOnce?: Partial<Record<IdentitySource, 'QUEUED' | 'FAILED'>>;
  claimValidationOnce?: boolean;
  claimSubmissionOnce?: boolean;
  passbookRefreshOnce?: boolean;
  transferSubmissionOnce?: boolean;
  nominationSubmissionOnce?: boolean;
}

function wait(ms = 220) {
  return new Promise<void>((resolve) =>
    window.setTimeout(resolve, import.meta.env.MODE === 'test' ? 0 : ms),
  );
}

function requireOnline() {
  if (typeof navigator !== 'undefined' && !navigator.onLine)
    throw new Error('OFFLINE');
}

export class LocalAPIService implements APIService {
  private pendingSessions = new Map<string, MockSession>();
  private claimRequests = new Map<PersonaId, Promise<ClaimSubmission>>();
  private transferRequests = new Map<PersonaId, Promise<PFTransfer>>();
  private nominationRequests = new Map<PersonaId, Promise<NominationRecord>>();
  private taxFileRequests = new Map<
    PersonaId,
    Promise<{
      acknowledgmentNumber: string;
      filedAt: string;
      rulesVersion: string;
      regime: TaxRegime;
    }>
  >();
  private failures: LocalAPITestFailures;

  constructor(failures: LocalAPITestFailures = {}) {
    this.failures = structuredClone(failures);
  }

  private migrate(id: PersonaId, raw: unknown): PersonaSeed | null {
    if (!raw || typeof raw !== 'object') return null;
    const legacy = raw as Partial<PersonaSeed>;
    if (legacy.id !== id) return null;
    const seed = cloneSeed(id);
    const legacyTax = legacy.tax;
    const migrateDraft = (candidate: unknown): ReturnDraft | null => {
      if (!candidate || typeof candidate !== 'object') return null;
      const old = candidate as ReturnDraft;
      const now = new Date().toISOString();
      return {
        ...old,
        rulesVersion: getTaxRulesConfig(old.assessmentYear).rulesVersion,
        properties: Array.isArray(old.properties) ? old.properties : [],
        capitalGains: Array.isArray(old.capitalGains) ? old.capitalGains : [],
        business: old.business ?? null,
        losses:
          old.losses && typeof old.losses === 'object'
            ? old.losses
            : {
                housePropertyCarriedForward: 0,
                capitalLossCarriedForward: 0,
              },
        filingDate: old.filingDate ?? now.slice(0, 10),
        sectionStates: {
          ...old.sectionStates,
          HOUSE_PROPERTY: old.sectionStates?.HOUSE_PROPERTY ?? {
            status: 'NOT_STARTED',
            blockingIssues: [],
          },
          CAPITAL_GAINS: old.sectionStates?.CAPITAL_GAINS ?? {
            status: 'NOT_STARTED',
            blockingIssues: [],
          },
          BUSINESS: old.sectionStates?.BUSINESS ?? {
            status: 'NOT_STARTED',
            blockingIssues: [],
          },
        },
        computation: null,
        updatedAt: now,
      };
    };
    const migratedDraft = migrateDraft(legacyTax?.draft);
    const migratedFiledReturns = (legacyTax?.filedReturns ?? []).flatMap(
      (filed) => {
        const draft = migrateDraft(filed.draft);
        if (!draft) return [];
        const rules = getTaxRulesConfig(draft.assessmentYear);
        const computation = computeReturnRule(draft, filed.regime, rules);
        return [
          {
            ...filed,
            rulesVersion: rules.rulesVersion,
            draft: { ...draft, computation: null },
            computation,
          },
        ];
      },
    );
    const migrated = {
      ...seed,
      ...legacy,
      schemaVersion: SCHEMA_VERSION,
      epfo: {
        ...seed.epfo,
        ...legacy.epfo,
        employment:
          legacy.epfo?.employment?.map((employment, index) => ({
            ...(seed.epfo.employment[index] ?? seed.epfo.employment[0]),
            ...employment,
          })) ?? seed.epfo.employment,
        kyc: legacy.epfo?.kyc ?? seed.epfo.kyc,
        passbook: legacy.epfo?.passbook ?? seed.epfo.passbook,
        claimHistory: legacy.epfo?.claimHistory ?? seed.epfo.claimHistory,
        nomination: legacy.epfo?.nomination ?? seed.epfo.nomination,
      },
      identityChanges: (legacy.identityChanges ?? []).map((change) => ({
        ...change,
        destinationResults:
          change.destinationResults ??
          change.destinations.map((source) => ({
            source,
            status: 'UPDATED' as const,
          })),
        status: change.status ?? ('SUCCESS' as const),
      })),
      tax: legacyTax
        ? {
            ...seed.tax!,
            ...legacyTax,
            rulesVersion: getTaxRulesConfig(legacyTax.assessmentYear)
              .rulesVersion,
            draft: migratedDraft,
            filedReturns: migratedFiledReturns,
          }
        : seed.tax,
    };
    const parsed = personaSeedSchema.safeParse(migrated);
    return parsed.success ? (parsed.data as PersonaSeed) : null;
  }

  private read(id: PersonaId): PersonaSeed {
    const raw = localStorage.getItem(keyFor(id));
    if (raw) {
      const parsed = personaSeedSchema.safeParse(JSON.parse(raw));
      if (parsed.success && parsed.data.schemaVersion === SCHEMA_VERSION) {
        const data = parsed.data as PersonaSeed;
        data.actions = deriveActions(data);
        return data;
      }
    }
    for (const version of [4, 3, 2, 1]) {
      const legacyRaw = localStorage.getItem(keyFor(id, version));
      if (legacyRaw) {
        const migrated = this.migrate(id, JSON.parse(legacyRaw));
        if (migrated) {
          this.write(migrated);
          return migrated;
        }
      }
    }
    const seed = cloneSeed(id);
    seed.actions = deriveActions(seed);
    this.write(seed);
    return seed;
  }

  private write(seed: PersonaSeed) {
    seed.actions = deriveActions(seed);
    localStorage.setItem(keyFor(seed.id), JSON.stringify(seed));
  }

  async login(personaId: PersonaId): Promise<MockSession> {
    await wait();
    requireOnline();
    const session: MockSession = {
      id: `mock-session-${personaId}-${Date.now()}`,
      personaId,
      verified: false,
      otpExpiresAt: new Date(Date.now() + 90_000).toISOString(),
    };
    this.pendingSessions.set(session.id, session);
    return session;
  }

  async verifyOtp(sessionId: string, otp: string): Promise<MockSession> {
    await wait();
    requireOnline();
    const pending = this.pendingSessions.get(sessionId);
    if (!pending) throw new Error('SESSION_NOT_FOUND');
    if (new Date(pending.otpExpiresAt).getTime() < Date.now())
      throw new Error('OTP_EXPIRED');
    if (otp !== '123456') throw new Error('INVALID_OTP');
    const session = {
      ...pending,
      verified: true,
      token: `mock-token-${pending.personaId}`,
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    this.pendingSessions.delete(sessionId);
    return session;
  }

  async getSession() {
    await wait(120);
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as MockSession) : null;
  }

  async clearSession() {
    await wait(80);
    localStorage.removeItem(SESSION_KEY);
  }
  async getPersona(id: PersonaId) {
    await wait();
    return structuredClone(this.read(id));
  }
  async getIdentityRecord(id: PersonaId) {
    return (await this.getPersona(id)).identity;
  }
  async getMismatches(id: PersonaId) {
    return (await this.getPersona(id)).mismatches;
  }
  async getEPFOProfile(id: PersonaId) {
    return (await this.getPersona(id)).epfo;
  }
  async getPassbook(id: PersonaId) {
    await wait(100);
    return structuredClone(this.read(id).epfo.passbook);
  }
  async refreshPassbook(id: PersonaId) {
    await wait(520);
    requireOnline();
    if (this.failures.passbookRefreshOnce) {
      this.failures.passbookRefreshOnce = false;
      throw new Error('SERVICE_UNAVAILABLE');
    }
    const seed = this.read(id);
    const now = new Date().toISOString();
    seed.epfo.passbook.capturedAt = now;
    seed.epfo.lastUpdatedAt = now;
    this.write(seed);
    return structuredClone(seed.epfo.passbook);
  }
  async updateEmploymentExit(
    id: PersonaId,
    employmentId: string,
    exitedOn: string,
  ) {
    await wait(260);
    requireOnline();
    const seed = this.read(id);
    const employment = seed.epfo.employment.find(
      (item) => item.id === employmentId,
    );
    if (!employment) throw new Error('EMPLOYMENT_NOT_FOUND');
    employment.exitedOn = exitedOn;
    const now = new Date().toISOString();
    seed.epfo.lastUpdatedAt = now;
    seed.activity.unshift({
      id: `act-employment-${employmentId}-${now}`,
      kind: 'EPFO',
      title: 'activity.events.serviceDatesUpdated',
      detail: 'activity.events.serviceDatesUpdatedDetail',
      values: { employer: employment.employer },
      status: 'COMPLETE',
      occurredAt: now,
    });
    this.write(seed);
    return structuredClone(seed.epfo);
  }
  async validateClaim(id: PersonaId, type: ClaimType) {
    await wait();
    void type;
    requireOnline();
    if (this.failures.claimValidationOnce) {
      this.failures.claimValidationOnce = false;
      throw new Error('SERVICE_UNAVAILABLE');
    }
    return validatePFClaim(this.read(id));
  }
  async getActions(id: PersonaId) {
    return (await this.getPersona(id)).actions;
  }
  async getActivity(id: PersonaId) {
    return (await this.getPersona(id)).activity;
  }

  async validateTransfer(
    id: PersonaId,
    sourceEmploymentId: string,
    destinationEmploymentId: string,
  ) {
    await wait(240);
    requireOnline();
    return validatePFTransfer(
      this.read(id),
      sourceEmploymentId,
      destinationEmploymentId,
    );
  }

  async saveTransferDraft(id: PersonaId, transfer: PFTransferInput) {
    const seed = this.read(id);
    seed.epfo.transferDraft = {
      ...transfer,
      updatedAt: new Date().toISOString(),
    };
    this.write(seed);
  }

  async submitTransfer(
    id: PersonaId,
    transfer: PFTransferInput,
  ): Promise<PFTransfer> {
    const existing = this.transferRequests.get(id);
    if (existing) return existing;
    const request = this.performTransferSubmission(id, transfer).finally(() =>
      this.transferRequests.delete(id),
    );
    this.transferRequests.set(id, request);
    return request;
  }

  private async performTransferSubmission(
    id: PersonaId,
    transfer: PFTransferInput,
  ): Promise<PFTransfer> {
    await this.saveTransferDraft(id, transfer);
    await wait(480);
    requireOnline();
    const seed = this.read(id);
    if (seed.epfo.transfer) return seed.epfo.transfer;
    if (this.failures.transferSubmissionOnce) {
      this.failures.transferSubmissionOnce = false;
      throw new Error('SERVICE_UNAVAILABLE');
    }
    const validation = validatePFTransfer(
      seed,
      transfer.sourceEmploymentId,
      transfer.destinationEmploymentId,
    );
    if (!validation.ready) throw new Error('TRANSFER_NOT_READY');
    if (!transfer.declarationAccepted || transfer.otp !== '123456')
      throw new Error('TRANSFER_CONFIRMATION_REQUIRED');
    const source = seed.epfo.employment.find(
      (item) => item.id === transfer.sourceEmploymentId,
    );
    if (!source) throw new Error('EMPLOYMENT_NOT_FOUND');
    const now = new Date().toISOString();
    const result: PFTransfer = {
      id: `transfer-${id}`,
      personaId: id,
      reference: id === 'rajesh' ? 'NGR-TR-260825-6473' : 'NGR-TR-260825-2291',
      sourceEmploymentId: transfer.sourceEmploymentId,
      destinationEmploymentId: transfer.destinationEmploymentId,
      amount: source.balance,
      submittedAt: now,
      status: 'EMPLOYER_REVIEW',
    };
    seed.epfo.transfer = result;
    seed.epfo.transferDraft = undefined;
    seed.activity.unshift({
      id: `act-transfer-${id}`,
      kind: 'EPFO',
      title: 'activity.events.transferReceived',
      detail: 'activity.events.transferReceivedDetail',
      values: { reference: result.reference },
      status: 'IN_PROGRESS',
      occurredAt: now,
    });
    this.write(seed);
    return result;
  }

  async saveNominationDraft(id: PersonaId, nominees: Nominee[]) {
    const seed = this.read(id);
    seed.epfo.nomination = {
      ...seed.epfo.nomination,
      status: 'DRAFT',
      nominees: structuredClone(nominees),
      updatedAt: new Date().toISOString(),
      reference: undefined,
    };
    this.write(seed);
    return structuredClone(seed.epfo.nomination);
  }

  async submitNomination(
    id: PersonaId,
    nominees: Nominee[],
    otp: string,
  ): Promise<NominationRecord> {
    const existing = this.nominationRequests.get(id);
    if (existing) return existing;
    const request = this.performNominationSubmission(id, nominees, otp).finally(
      () => this.nominationRequests.delete(id),
    );
    this.nominationRequests.set(id, request);
    return request;
  }

  private async performNominationSubmission(
    id: PersonaId,
    nominees: Nominee[],
    otp: string,
  ) {
    await this.saveNominationDraft(id, nominees);
    await wait(420);
    requireOnline();
    if (this.failures.nominationSubmissionOnce) {
      this.failures.nominationSubmissionOnce = false;
      throw new Error('SERVICE_UNAVAILABLE');
    }
    if (
      !validateNomineeAllocation(nominees.map((nominee) => nominee.share)).valid
    )
      throw new Error('NOMINATION_ALLOCATION_INVALID');
    if (otp !== '123456') throw new Error('INVALID_OTP');
    const seed = this.read(id);
    const now = new Date().toISOString();
    seed.epfo.nomination = {
      status: 'EFFECTIVE',
      nominees: structuredClone(nominees),
      updatedAt: now,
      reference: id === 'rajesh' ? 'NGR-NOM-6473' : 'NGR-NOM-2291',
    };
    seed.activity.unshift({
      id: `act-nomination-${id}-${now}`,
      kind: 'EPFO',
      title: 'activity.events.nominationEffective',
      detail: 'activity.events.nominationEffectiveDetail',
      status: 'COMPLETE',
      occurredAt: now,
    });
    this.write(seed);
    return structuredClone(seed.epfo.nomination);
  }

  async resolveMismatch(
    input: ResolveMismatchInput,
  ): Promise<PropagationResult> {
    await wait(420);
    requireOnline();
    const seed = this.read(input.personaId);
    const mismatch = seed.mismatches.find(
      (item) => item.id === input.mismatchId,
    );
    if (!mismatch) throw new Error('MISMATCH_NOT_FOUND');
    const now = new Date().toISOString();
    const fromValues = [
      ...new Set(Object.values(mismatch.valuesBySource).filter(Boolean)),
    ] as string[];
    seed.identity.canonical[mismatch.field] = input.canonicalValue;
    seed.identity.updatedAt = now;
    const destinationResults: PropagationDestination[] = destinations.map(
      (source) => ({
        source,
        status: this.failures.propagationOnce?.[source] ?? 'UPDATED',
      }),
    );
    this.failures.propagationOnce = undefined;
    for (const result of destinationResults)
      if (result.status === 'UPDATED')
        seed.identity.valuesBySource[result.source][mismatch.field] =
          input.canonicalValue;
    const complete = destinationResults.every(
      (item) => item.status === 'UPDATED',
    );
    if (complete) seed.epfo.lastUpdatedAt = now;
    mismatch.status = complete ? 'RESOLVED' : 'PARTIAL';
    const change = {
      id: `change-${input.mismatchId}`,
      field: mismatch.field,
      fromValues,
      toValue: input.canonicalValue,
      destinations,
      destinationResults,
      status: complete ? ('SUCCESS' as const) : ('PARTIAL' as const),
      changedAt: now,
    };
    seed.identityChanges.unshift(change);
    if (complete) this.addIdentityActivity(seed, now);
    this.write(seed);
    return {
      change,
      destinations: destinationResults,
      status: complete ? 'SUCCESS' : 'PARTIAL',
    };
  }

  async retryPropagation(
    input: RetryPropagationInput,
  ): Promise<PropagationResult> {
    await wait(320);
    requireOnline();
    const seed = this.read(input.personaId);
    const mismatch = seed.mismatches.find(
      (item) => item.id === input.mismatchId,
    );
    const change = seed.identityChanges.find(
      (item) => item.id === `change-${input.mismatchId}`,
    );
    if (!mismatch || !change) throw new Error('PROPAGATION_NOT_FOUND');
    const incomplete = change.destinationResults.filter(
      (item) => item.status !== 'UPDATED',
    );
    if (incomplete.length === 0)
      return {
        change,
        destinations: change.destinationResults,
        status: 'SUCCESS',
      };
    const now = new Date().toISOString();
    for (const result of incomplete) {
      result.status = 'UPDATED';
      seed.identity.valuesBySource[result.source][change.field] =
        change.toValue;
    }
    change.status = 'SUCCESS';
    change.changedAt = now;
    mismatch.status = 'RESOLVED';
    seed.identity.updatedAt = now;
    seed.epfo.lastUpdatedAt = now;
    this.addIdentityActivity(seed, now);
    this.write(seed);
    return {
      change,
      destinations: change.destinationResults,
      status: 'SUCCESS',
    };
  }

  private addIdentityActivity(seed: PersonaSeed, occurredAt: string) {
    const id = 'act-identity-name-propagated';
    if (seed.activity.some((event) => event.id === id)) return;
    seed.activity.unshift({
      id,
      kind: 'IDENTITY',
      title: 'activity.events.correctionComplete',
      detail: 'activity.events.correctionDetail',
      status: 'COMPLETE',
      occurredAt,
    });
  }

  async saveClaimDraft(personaId: PersonaId, claim: PFClaim) {
    const seed = this.read(personaId);
    seed.epfo.claimDraft = { ...claim, updatedAt: new Date().toISOString() };
    this.write(seed);
  }

  async submitClaim(
    personaId: PersonaId,
    claim: PFClaim,
  ): Promise<ClaimSubmission> {
    const existing = this.claimRequests.get(personaId);
    if (existing) return existing;
    const request = this.performClaimSubmission(personaId, claim).finally(() =>
      this.claimRequests.delete(personaId),
    );
    this.claimRequests.set(personaId, request);
    return request;
  }

  private async performClaimSubmission(
    personaId: PersonaId,
    claim: PFClaim,
  ): Promise<ClaimSubmission> {
    await this.saveClaimDraft(personaId, claim);
    await wait(480);
    requireOnline();
    const seed = this.read(personaId);
    if (seed.epfo.claim) return seed.epfo.claim;
    if (this.failures.claimSubmissionOnce) {
      this.failures.claimSubmissionOnce = false;
      throw new Error('SERVICE_UNAVAILABLE');
    }
    const validation = validatePFClaim(seed);
    if (!validation.ready) throw new Error('CLAIM_NOT_READY');
    if (
      !claim.bankConfirmed ||
      !claim.declarationAccepted ||
      claim.otp !== '123456'
    )
      throw new Error('CLAIM_CONFIRMATION_REQUIRED');
    const now = new Date().toISOString();
    const references: Record<PersonaId, string> = {
      rajesh: 'NGR-PF-260825-1042',
      ananya: 'NGR-PF-260825-1186',
    };
    const submission: ClaimSubmission = {
      id: `claim-${personaId}`,
      personaId,
      reference: references[personaId],
      type: claim.type,
      amount: claim.amount,
      submittedAt: now,
      status: 'RECEIVED',
    };
    seed.epfo.claim = submission;
    seed.epfo.claimDraft = undefined;
    seed.epfo.lastUpdatedAt = now;
    if (!seed.activity.some((event) => event.id === `act-claim-${personaId}`))
      seed.activity.unshift({
        id: `act-claim-${personaId}`,
        kind: 'EPFO',
        title: 'activity.events.claimReceived',
        detail: 'activity.events.claimReceivedDetail',
        values: { reference: submission.reference },
        status: 'IN_PROGRESS',
        occurredAt: now,
      });
    this.write(seed);
    return submission;
  }

  async getTaxRules(assessmentYear: string) {
    await wait(150);
    return getTaxRulesConfig(assessmentYear);
  }

  async getTaxSources(id: PersonaId, assessmentYear: string) {
    await wait(200);
    requireOnline();
    const seed = this.read(id);
    if (!seed.tax || seed.tax.assessmentYear !== assessmentYear)
      throw new Error('ASSESSMENT_YEAR_NOT_SUPPORTED');
    return structuredClone(seed.tax.sources);
  }

  async getExistingReturnDraft(id: PersonaId, assessmentYear: string) {
    const seed = this.read(id);
    if (!seed.tax || seed.tax.assessmentYear !== assessmentYear) return null;
    return seed.tax.draft ? structuredClone(seed.tax.draft) : null;
  }

  async saveReturnDraft(id: PersonaId, draft: ReturnDraft) {
    const seed = this.read(id);
    if (!seed.tax) throw new Error('TAX_RECORD_NOT_FOUND');
    seed.tax.draft = structuredClone({
      ...draft,
      updatedAt: new Date().toISOString(),
    });
    this.write(seed);
  }

  async determineFilingRoute(draft: ReturnDraft) {
    await wait(120);
    const rules = getTaxRulesConfig(draft.assessmentYear);
    return determineFilingRouteRule(draft, rules);
  }

  async computeReturn(draft: ReturnDraft, regime: TaxRegime) {
    await wait(180);
    const rules = getTaxRulesConfig(draft.assessmentYear);
    return computeReturnRule(draft, regime, rules);
  }

  async compareRegimes(draft: ReturnDraft) {
    await wait(220);
    const rules = getTaxRulesConfig(draft.assessmentYear);
    return compareRegimesRule(draft, rules);
  }

  async validateReturn(draft: ReturnDraft) {
    await wait(160);
    const rules = getTaxRulesConfig(draft.assessmentYear);
    return validateReturnRule(draft, rules);
  }

  async validateTaxBankAccount(id: PersonaId, accountId: string) {
    await wait(300);
    requireOnline();
    const seed = this.read(id);
    const draft = seed.tax?.draft;
    if (!draft) throw new Error('DRAFT_NOT_FOUND');
    const account = draft.bankAccounts.find((item) => item.id === accountId);
    if (!account) throw new Error('BANK_ACCOUNT_NOT_FOUND');
    account.validationStatus = 'VALIDATED';
    draft.updatedAt = new Date().toISOString();
    this.write(seed);
    return structuredClone(account);
  }

  async fileReturn(id: PersonaId, draft: ReturnDraft) {
    const existing = this.taxFileRequests.get(id);
    if (existing) return existing;
    const request = this.performFileReturn(id, draft).finally(() =>
      this.taxFileRequests.delete(id),
    );
    this.taxFileRequests.set(id, request);
    return request;
  }

  private async performFileReturn(id: PersonaId, draft: ReturnDraft) {
    await this.saveReturnDraft(id, draft);
    await wait(520);
    requireOnline();
    const seed = this.read(id);
    const tax = seed.tax;
    if (!tax) throw new Error('TAX_RECORD_NOT_FOUND');
    if (tax.filedReturns.length > 0) {
      const filed = tax.filedReturns[0];
      return {
        acknowledgmentNumber: filed.acknowledgmentNumber,
        filedAt: filed.filedAt,
        rulesVersion: filed.rulesVersion,
        regime: filed.regime,
      };
    }
    const rules = getTaxRulesConfig(draft.assessmentYear);
    const issues = validateReturnRule(draft, rules);
    if (
      issues.some(
        (issue) =>
          issue.severity === 'BLOCKING' || issue.severity === 'ROUTE_CHANGE',
      )
    )
      throw new Error('RETURN_NOT_READY');
    const regime = draft.regime.selected;
    if (!regime) throw new Error('RETURN_NOT_READY');
    const computation = computeReturnRule(draft, regime, rules);
    const now = new Date().toISOString();
    const references: Record<PersonaId, string> = {
      rajesh: 'NGR-ITR-260825-4471',
      ananya: 'NGR-ITR-260825-3382',
    };
    const snapshot: FiledReturnSnapshot = {
      acknowledgmentNumber: references[id],
      filedAt: now,
      rulesVersion: draft.rulesVersion,
      regime,
      draft: structuredClone(draft),
      computation,
      verification: { status: 'PENDING' },
    };
    tax.filedReturns.push(snapshot);
    seed.activity.unshift({
      id: `act-tax-filed-${id}-${tax.assessmentYear}`,
      kind: 'INCOME_TAX',
      title: 'activity.events.taxFiled',
      detail: 'activity.events.taxFiledDetail',
      values: { reference: snapshot.acknowledgmentNumber },
      status: 'IN_PROGRESS',
      occurredAt: now,
    });
    this.write(seed);
    return {
      acknowledgmentNumber: snapshot.acknowledgmentNumber,
      filedAt: snapshot.filedAt,
      rulesVersion: snapshot.rulesVersion,
      regime: snapshot.regime,
    };
  }

  async verifyReturn(
    id: PersonaId,
    input: { acknowledgmentNumber: string; otp: string },
  ) {
    await wait(320);
    requireOnline();
    if (input.otp !== '123456') throw new Error('INVALID_OTP');
    const seed = this.read(id);
    const filed = seed.tax?.filedReturns.find(
      (item) => item.acknowledgmentNumber === input.acknowledgmentNumber,
    );
    if (!filed) throw new Error('FILED_RETURN_NOT_FOUND');
    const now = new Date().toISOString();
    filed.verification = {
      status: 'VERIFIED',
      method: 'AADHAAR_OTP',
      verifiedAt: now,
    };
    const activityId = `act-tax-filed-${id}-${seed.tax?.assessmentYear}`;
    const event = seed.activity.find((item) => item.id === activityId);
    if (event) event.status = 'COMPLETE';
    this.write(seed);
    return { status: 'VERIFIED' as const, verifiedAt: now };
  }

  async resetPersona(id: PersonaId) {
    await wait();
    localStorage.removeItem(keyFor(id));
    localStorage.removeItem(keyFor(id, 3));
    localStorage.removeItem(keyFor(id, 2));
    localStorage.removeItem(keyFor(id, 1));
    const seed = cloneSeed(id);
    seed.actions = deriveActions(seed);
    this.write(seed);
    return structuredClone(seed);
  }
}

export const apiService = new LocalAPIService();
