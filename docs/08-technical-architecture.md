# Technical architecture

## Architecture goals

- Keep the prototype fully client-side and easy to host.
- Make loading, persistence, propagation, and failure behavior real within the prototype.
- Isolate mock storage behind a stable service contract.
- Separate domain rules from React components.
- Version tax behavior by assessment year.
- Preserve a future path to authenticated stateless APIs.

## Runtime shape

```text
React routes and page templates
        ↓
Domain hooks / journey controllers
        ↓
Rules engines and validation
        ↓
APIService contract
        ↓
LocalStorage repositories + static seed snapshots
```

React components render state and collect intent. They must not contain tax slabs, filing-route conditions, EPFO claim rules, or persona-specific branches.

## Suggested frontend organization

```text
src/
├── app/                 application shell, routing, providers
├── components/          shared structural and UI primitives
├── features/
│   ├── auth/
│   ├── home/
│   ├── identity/
│   ├── income-tax/
│   ├── epfo/
│   ├── activity/
│   ├── grievances/
│   └── profile/
├── rules/
│   ├── tax/
│   ├── filing-route/
│   ├── validation/
│   └── epfo/
├── services/            APIService and local adapters
├── data/                fictional persona seed JSON
├── i18n/                translation resources and formatters
├── styles/              tokens, global styles, utilities
└── types/               shared domain contracts
```

Feature modules remain physically separate while consuming shared identity, activity, service, and design-system contracts.

## APIService boundary

All reads and writes pass through one asynchronous service facade organized by domain. Every method returns a Promise and may simulate latency or failure so pages exercise genuine loading and recovery behavior.

Representative contract:

```ts
interface NagrikAPIService {
  login(credentials: MockCredentials): Promise<MockSession>;

  getIdentityRecord(userId: string): Promise<IdentityRecord>;
  getMismatches(userId: string): Promise<IdentityMismatch[]>;
  resolveMismatch(input: ResolveMismatchInput): Promise<PropagationResult>;

  getExistingReturnDraft(
    userId: string,
    assessmentYear: string,
  ): Promise<ReturnDraft | null>;
  saveReturnDraft(userId: string, draft: ReturnDraft): Promise<void>;
  getFormSixteenSources(
    userId: string,
    assessmentYear: string,
  ): Promise<SalarySource[]>;
  getAisSummary(
    userId: string,
    assessmentYear: string,
  ): Promise<AISReviewItem[]>;
  getForm26ASSummary(
    userId: string,
    assessmentYear: string,
  ): Promise<TaxCredits>;
  getTaxRules(assessmentYear: string): Promise<TaxRulesConfig>;
  determineFilingRoute(data: ReturnDraft): Promise<FilingRoute>;
  computeReturn(
    data: ReturnDraft,
    regime: TaxRegime,
  ): Promise<ReturnComputation>;
  compareRegimes(data: ReturnDraft): Promise<RegimeComparison>;
  validateReturn(data: ReturnDraft): Promise<ValidationIssue[]>;
  fileReturn(userId: string, data: ReturnDraft): Promise<FileReturnResult>;
  verifyReturn(input: VerifyReturnInput): Promise<VerificationResult>;

  getPassbook(userId: string): Promise<Passbook>;
  validateClaim(userId: string, type: ClaimType): Promise<ClaimValidation>;
  submitClaim(userId: string, claim: PFClaim): Promise<ClaimSubmission>;

  parseNotice(
    userId: string,
    document: MockNoticeDocument,
  ): Promise<NoticeItem>;
  resolveNoticeAction(userId: string, noticeId: string): Promise<NoticeRemedy>;
}
```

Today, implementations use static seed data and localStorage. A future service adapter can replace method bodies with authenticated HTTP calls while preserving callers and return shapes.

## Seed and persistence model

- Static JSON files are the immutable default for each persona.
- First launch copies the active persona snapshot into namespaced localStorage.
- Reset removes only the selected persona's mutable namespace and restores its seed.
- Schema shape is identical across personas.
- Stored data includes a schema version and supports explicit migration or reset.
- Fictional identifiers must be visibly mock and must not contain real personal data.

Suggested storage namespaces:

```text
nagrik:app
nagrik:persona:{personaId}:identity
nagrik:persona:{personaId}:tax:{assessmentYear}:draft
nagrik:persona:{personaId}:epfo
nagrik:persona:{personaId}:activity
```

## State and propagation

Use a single application-level source for active persona, identity, drafts, service records, and activity events. A successful mismatch resolution produces:

1. An identity change record.
2. A per-destination propagation result.
3. Updated source values.
4. Invalidation of affected return, claim, bank, or refund validations.
5. New Activity and Action Centre state.

UI components subscribe to shared state so dependent screens update without reload. Propagation must not be recreated independently inside Income Tax and EPFO components.

## Filing routes

```ts
type FilingRoute =
  'ITR1_LIKE' | 'ITR2_LIKE' | 'ITR4_LIKE' | 'ITR3_ADVANCED' | 'UNSUPPORTED';
```

The route engine evaluates taxpayer type, residency, income, properties, capital gains, business activity, director status, unlisted shares, foreign interests, losses, and special conditions against AY-specific configuration.

```ts
function determineFilingRoute(data: ReturnDraft): FilingRoute {
  if (hasUnsupportedComplexity(data)) return 'UNSUPPORTED';
  if (hasBusinessOrProfessionIncome(data)) {
    return isEligibleForPresumptiveReturn(data) ? 'ITR4_LIKE' : 'ITR3_ADVANCED';
  }
  return isEligibleForSimpleIndividualReturn(data) ? 'ITR1_LIKE' : 'ITR2_LIKE';
}
```

Route conditions belong in versioned rules, not React conditionals.

## Tax computation pipeline

The conceptual order is mandatory:

```text
Income by head
→ loss set-off
→ Gross Total Income
→ eligible deductions
→ Total Income
→ normal-rate tax + special-rate tax
→ rebate
→ surcharge and marginal relief
→ Health and Education Cess
→ interest and fee
→ Total Tax Liability
→ TDS, TCS, advance tax, and self-assessment credits
→ tax payable or refund
```

TDS and other credits never reduce income. Special-rate income remains separate from normal slab-rate income. Old and new regimes are computed in parallel from the same entered claims with different allowed treatment.

Representative result:

```ts
interface ReturnComputation {
  grossTotalIncome: number;
  deductions: DeductionResult[];
  totalIncome: number;
  normalTax: number;
  specialRateTax: number;
  rebate: number;
  surcharge: number;
  marginalRelief: number;
  cess: number;
  interestAndFee: InterestFeeResult;
  totalTaxLiability: number;
  taxCredits: TaxCreditResult;
  taxPayable: number;
  refund: number;
}
```

## AY-versioned rules

No slab, cap, rebate, standard deduction, surcharge, special rate, eligibility rule, validation, or filing-route limit is hard-coded in a component.

```ts
TaxRules.get({
  assessmentYear: '2026-27',
  taxpayerType: 'INDIVIDUAL',
  residentialStatus: 'RESIDENT',
});
```

A filed snapshot stores the exact rules version. If an unfiled draft opens under a newer compatible version, recompute and mark affected sections for review.

AY 2026–27 values described in the product source are implementation assumptions until verified against the official department schema and validation package.

## Return draft

```ts
interface ReturnDraft {
  assessmentYear: string;
  rulesVersion: string;
  taxpayer: TaxpayerProfile;
  filingType: FilingType;
  filingRoute: FilingRoute;
  incomeProfile: IncomeProfile;
  salary: SalarySource[];
  properties: HouseProperty[];
  capitalGains: CapitalGainTransaction[];
  business?: BusinessIncome;
  otherSources: OtherSourceIncome[];
  exemptIncome: ExemptIncome[];
  deductions: DeductionClaim[];
  taxCredits: TaxCredits;
  regime: TaxRegimeSelection;
  bankAccounts: BankAccount[];
  aisReviewItems: AISReviewItem[];
  losses: LossState;
  validationIssues: ValidationIssue[];
  sectionStates: Record<string, SectionState>;
  notices: NoticeItem[];
  computation?: ReturnComputation;
}
```

Store `enteredAmount` separately from `allowedAmount` and `appliedAmount` wherever caps or regime rules apply.

## Validation

```ts
type ValidationSeverity = 'INFO' | 'WARNING' | 'BLOCKING' | 'ROUTE_CHANGE';

interface ValidationIssue {
  id: string;
  code: string;
  severity: ValidationSeverity;
  sectionId: string;
  titleKey: string;
  messageKey: string;
  sourceRefs?: string[];
  fixTarget?: { route: string; focusId?: string };
}
```

Validation runs during entry, after upstream changes, before declaration, and immediately before filing. React renders messages and navigation targets; rules decide severity and applicability.

## EPFO rule engine

Claim validation runs independent named rules such as:

- `NAME_MATCH`
- `PAN_KYC_VALID`
- `AADHAAR_KYC_VALID`
- `BANK_KYC_MATCH`
- `SERVICE_EXIT_PRESENT`
- `DATE_OVERLAP`
- `CLAIM_ELIGIBILITY`

Each rule returns pass/fail, severity, plain-language reason key, source references, and fix target. A readiness display summarizes these results but does not guarantee approval.

## Notice model

```ts
type NoticeState = 'NOTICE_RECEIVED' | 'ACTION_REQUIRED' | 'RESOLVED';

interface NoticeItem {
  id: string;
  section: '139(9)' | '143(1)';
  issuedOn: string;
  responseDeadline?: string;
  discrepancies: NoticeDiscrepancy[];
  remedy: 'REFILE' | 'PAY' | 'RECTIFY' | 'ITR_U';
  state: NoticeState;
}
```

The rules service selects one supported remedy. Notice state becomes `RESOLVED` only after the linked corrective action completes.

## Authentication and verification

Prototype login may return a realistic-shaped opaque mock token, but it is only a client-side session flag. Do not sign a token with a client secret or imply cryptographic identity verification.

Return filing and e-verification are separate operations and statuses. The same separation applies to claim submission and any subsequent verification.

## Resilience and idempotency

- Reads prefer fresh data but may return cached data with freshness metadata.
- Safe local changes autosave immediately.
- Queueable operations store operation ID, payload hash, created time, and retry state.
- Filing, payment, verification, claim, and grievance submission must not be replayed blindly.
- Temporary failure preserves the last successful display.
- Error states distinguish unavailable service, invalid data, expired session, and unknown failure.

## Internationalization

- UI copy uses stable translation keys.
- Rules return codes and structured values, not prewritten English sentences.
- A presentation layer maps codes to localized titles and explanations.
- Amount, date, time, countdown, and list formatting use locale-aware helpers.

## Testing boundaries

- Pure rules engines receive deterministic unit tests.
- APIService adapters receive persistence, latency, failure, reset, and isolation tests.
- Journey controllers receive route-change and stale-section tests.
- React tests cover rendering, focus, validation navigation, responsive semantics, and accessible naming.
- End-to-end tests cover the two seeded personas and the complete supported submission path.
