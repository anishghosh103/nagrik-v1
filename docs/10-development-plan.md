# Comprehensive development plan

## How to use this plan

Implement Nagrik as dependency-ordered vertical journeys built on shared identity, rules, service, design, and status foundations. Before starting a numbered section, read every item in its **Required references** table. Screen IDs are design identifiers: consult the linked screen-inventory section to determine whether an experience is a route, step, sheet, dialog, action, or state.

The source precedence and requirement language defined in the documentation index apply throughout. Tax rules and official validations must be independently verified before enabling a filing outcome.

### Current implementation status

Last reviewed: **August 28, 2026**. This tracker describes repository state, not just design intent. Update it when a task crosses its documented exit gate.

Status meanings:

- **Done:** implemented and verified for the currently implemented Identity-to-PF boundary.
- **Partial:** useful implementation exists, but one or more requirements or release gates in the section remain open.
- **Not started:** no functional implementation exists beyond navigation copy or a disabled placeholder.

| Section                                      | Status      | Completed work                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | Remaining work                                                                                                                                                                                                                                                                                                               |
| -------------------------------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1. Target platform architecture              | **Done**    | React routes → Zustand controllers → identity/EPFO rules → `APIService` → LocalStorage is implemented.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | Extend the same layering to future domains.                                                                                                                                                                                                                                                                                  |
| 2. Technology and dependency setup           | **Partial** | Documented runtime and test dependencies, pnpm 11 pinning, Vitest, Playwright, and axe are configured.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | Move feature styling to CSS Modules where appropriate.                                                                                                                                                                                                                                                                       |
| 3. Source organization and module boundaries | **Partial** | `app`, `components`, `features`, `rules`, `services`, `data`, `i18n`, `styles`, and `types` boundaries exist for identity and EPFO journeys.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | Add tax, grievance, and notice modules only with their journeys.                                                                                                                                                                                                                                                             |
| 4. Foundation workstream                     | **Partial** | Session hydration, persona state, schema-versioned LocalStorage, online detection, deterministic reset, first-slice Zod contracts, and identical-shaped fictional persona seeds are implemented.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | Add draft recovery, migrations, queued writes, richer failure states, and contracts/seeds for later domains.                                                                                                                                                                                                                 |
| 5. Design-system workstream                  | **Partial** | Warm civic-editorial tokens, global shell, desktop navigation, mobile bottom navigation, context rail, sticky actions, source markers, statuses, responsive identity layouts, and reduced motion are implemented.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | Complete reusable sheets/dialogs, all seven templates, and explicit validation at 768, 1024, and 1440 px.                                                                                                                                                                                                                    |
| 6. Shared platform workstream                | **Partial** | Prototype disclosure, persona choice, fictional credentials, OTP expiry/resend, session restoration, sign-out, Home, derived Action Centre, and Identity/PF Activity are implemented.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | Add restore/recovery dialogs, action deadlines/detail states, notifications/search, and future-domain Activity sources.                                                                                                                                                                                                      |
| 7. Financial Identity workstream             | **Partial** | Desktop source matrix, mobile field-first comparison, mismatch explanation, canonical selection, destination review, simulated propagation, dependent PF revalidation, receipt, Home/action update, and Activity update are implemented.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | Add requirements capture, partial propagation, queued/failed destination results, retry, source detail, connected records, and full change history screens.                                                                                                                                                                  |
| 8.1 EPFO Home, profile, KYC, and employment  | **Done**    | Task-first EPFO landing, fictional UAN, structured KYC and bank records, employment history with service-date correction, and combined service history are implemented.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | —                                                                                                                                                                                                                                                                                                                            |
| 8.2 PF withdrawal and Claim Doctor           | **Done**    | Dedicated claim type and eligibility, seven named rules, issue-detail sheet, correction link, claim details, bank confirmation, readiness, review, mock OTP, safe retry, idempotent submission, confirmation, tracking, Activity handoff, and C15 rejection explanation are implemented.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | —                                                                                                                                                                                                                                                                                                                            |
| 8.3–8.5 Passbook, transfer, nomination       | **Done**    | Cached employer/monthly passbook with background refresh and preserved-data failure, contribution-resolution handoff now filing directly into the shared Grievance Centre, validated/idempotent transfer with employer/EPFO timeline, and exact-100% nomination with mock verification are implemented.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | —                                                                                                                                                                                                                                                                                                                            |
| 9. Income Tax workstream                     | **Partial** | The AY 2026–27 guided filing spine now supports `ITR1_LIKE`, `ITR2_LIKE`, and `ITR4_LIKE` outcomes backed by verified, versioned rules. Implemented heads include salary/pension (9.5), house property with regime-aware interest and loss treatment (9.6), supported listed-equity/equity-fund capital gains with 111A/112A buckets and loss set-off (9.7), and presumptive 44AD/44ADA/44AE income with receipt, vehicle, lower-profit, and Form 10-IEA routing (9.8). The statutory pipeline includes rebate, surcharge caps and marginal relief, cess, 234A/B/C interest, 234F fee, TDS/TCS/advance/self-assessment credits, an exact simulated payment flow, and a filing blocker while tax remains payable. Existing setup, other-source interest, deductions, regime comparison, bank/refund, validation, mock filing, and e-verification remain integrated.                                                                                                                                                                                      | Agricultural/exempt-income schedules beyond the routing question and the full advanced breadth of 9.9–9.11 remain open. Unsupported assets and `ITR3_ADVANCED` situations preserve entered data and stop at an explicit handoff instead of estimating. Sections 10 (post-filing/notices) and 11 (grievances) are unaffected. |
| 10. Post-filing and notices                  | **Partial** | Return history, status tracker with a real processing/refund event timeline, and cause-aware delayed-refund tracking with a bank-linkage revalidate action are implemented. A notices inbox supports simulated import across four 139(9)/143(1) fixtures, a filed-vs-department discrepancy comparison sheet, one system-decided remedy per notice (REFILE, PAY, RECTIFY, ITR-U), exact-section reopening with focus management for REFILE, dedicated rectification review (P11) and confirmation (P12) screens, idempotent payment, and a resolution screen. Open notices and delayed refunds surface as Action Centre actions and Activity events. Covered by unit tests (deadline math, ITR-U rate bands, idempotent import/payment, rectify and refile round trips) and end-to-end tests across all four remedy paths verifying navigation through each dedicated screen, and localized into English, Hindi, and Bengali.                                                                                                                           | Component and visual-regression coverage at the standard breakpoints remains open (tracked under Section 14, not specific to this section).                                                                                                                                                                                  |
| 11. Unified grievances                       | **Done**    | A shared Grievance Centre spans Income Tax, EPFO, and identity: choose-service (with an "I'm not sure" option), plain-language description, keyword-based service/category suggestion, optional fictional evidence, review, idempotent submission with a reference, and a case-detail timeline that translates technical statuses into plain language (including the disposed-without-change example from the content guidelines). The EPFO missing-contribution handoff now files directly into a pre-categorized case instead of stopping at a deferred placeholder. A scripted per-category outcome drives simulated review progress, and a disposed case with no record change can be escalated to a second, resolved review. Open, no-change grievances surface as an Action Centre item and every transition posts a Unified Activity event. Covered by rule and service unit tests and two end-to-end journeys (pre-categorized escalation to resolution; freeform filing with category suggestion), localized into English, Hindi, and Bengali. | Component/visual-regression coverage at the standard breakpoints remains open (tracked under Section 14, not specific to this section).                                                                                                                                                                                      |
| 12. Localization                             | **Partial** | i18next, English/Hindi/Bengali resources, language persistence, locale-aware dates/currency, and flexible layouts are implemented.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | Move remaining inline English copy and all rule explanations into complete Hindi and Bengali resources; perform visual review in each language.                                                                                                                                                                              |
| 13. Accessibility                            | **Partial** | Semantic landmarks/headings, labelled controls, status text with icons, comparison semantics, live regions, contrast, reflow, reduced motion, and automated axe smoke coverage are implemented.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | Add skip navigation, route-focus handling, full error summaries, masked-value accessible names, and manual keyboard/screen-reader/zoom verification.                                                                                                                                                                         |
| 14. Testing                                  | **Partial** | Forty-three unit/service tests cover schemas and migration, identity/PF rules and persistence, tax routing and computation, house-property loss treatment, 111A/112A gains, 44AD/44ADA/44AE income, surcharge/marginal relief, 234A/B/C and 234F, dated self-assessment payments, and the outstanding-payment gate. Playwright specifications cover the core citizen journeys across configured breakpoints, including direct reload and axe scans.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | Add component/visual baselines and recovery, partial propagation, offline, switch, reset, keyboard, and broader tax-route E2E coverage.                                                                                                                                                                                      |
| 15. CI/CD and release operations             | **Partial** | Type-check, lint, unit, build, and E2E scripts exist and pass locally; direct routes are supported by the SPA build.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | Add pull-request CI, hosted preview, incognito/direct-link validation on the host, and stable demo deployment.                                                                                                                                                                                                               |
| 16–18. Milestones and release gates          | **Partial** | The core M0 Rajesh journey and Ananya healthy state run end to end locally.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | Close the Partial items above before declaring M0 released or the definition of done satisfied.                                                                                                                                                                                                                              |

#### Completed Identity-to-PF vertical slice

- [x] Install documented runtime and verification dependencies.
- [x] Replace the Vite starter with routing, providers, error boundary, session hydration, and responsive application shell.
- [x] Add warm civic-editorial design tokens and source/status primitives.
- [x] Define first-slice Zod contracts for sessions, personas, identity, EPFO, actions, activity, rules, propagation, and claims.
- [x] Seed identical-shaped fictional Ananya and Rajesh profiles.
- [x] Persist persona state behind asynchronous `APIService` methods with simulated latency and deterministic per-persona reset.
- [x] Restore verified sessions and isolate persona data.
- [x] Implement visible fictional credentials, mock Aadhaar login, OTP expiry/resend, and OTP `123456` verification.
- [x] Derive Home priority, identity health, service summaries, actions, and Activity from domain state.
- [x] Render desktop identity source matrix and mobile field-first comparisons.
- [x] Correct Rajesh's name, propagate it to five simulated sources, create a receipt, rerun PF rules, and update Home and Activity without reload.
- [x] Implement `NAME_MATCH`, `PAN_KYC_VALID`, `AADHAAR_KYC_VALID`, `BANK_KYC_MATCH`, `SERVICE_EXIT_PRESENT`, `DATE_OVERLAP`, and `CLAIM_ELIGIBILITY`.
- [x] Block Rajesh's claim before correction and make the readiness checklist pass after correction.
- [x] Collect claim amount, confirm the validated bank destination, review the declaration, and mock-verify with OTP `123456`.
- [x] Prevent duplicate claim submission and create a reference, confirmation, status timeline, and Unified Activity event.
- [x] Preserve Ananya's healthy scenario without adding an artificial warning.
- [x] Complete EPFO profile, KYC, employment, service history, rejected-claim, passbook, transfer, and nomination experiences.
- [x] Preserve cached passbook data during offline or failed refresh and prepare a categorized contribution-resolution handoff.
- [x] Detect and correct transfer date overlap, validate identity/KYC, and track an idempotent mock transfer.
- [x] Enforce exact 100% nominee allocation and mock-verify an effective nomination.
- [x] Add English, Hindi, and Bengali switching with persisted language preference and locale-aware financial formatting.
- [x] Add offline disclosure, cached timestamps, loading/skeleton states, safe submission retry messaging, and reduced-motion behavior.
- [x] Configure and pass TypeScript, ESLint, Vitest, production build, Playwright mobile/desktop journeys, and axe serious/critical checks.

#### Open work before M0 release

- [ ] Add partial/queued/failed identity propagation with safe retry.
- [ ] Complete every submitted-path string and rule explanation in Hindi and Bengali.
- [ ] Finish route focus, skip navigation, error summaries, accessible masked values, and manual keyboard/screen-reader verification.
- [ ] Add component and visual checks at 390, 768, 1024, and 1440 px.
- [ ] Add reload-during-correction, offline recovery, persona switch, reset, and duplicate-click browser scenarios.
- [x] Add dedicated rejected-claim and service-unavailable claim recovery experiences.
- [ ] Add CI and deploy a preview; verify credentials, reset, direct links, and incognito access on the deployed host.

### Required references

| File and section                                                                                   | Why it is required                                                                    |
| -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| [Documentation index — Source material and precedence](./README.md#source-material-and-precedence) | Resolves conflicts between product, tax-accuracy, prototype, and design requirements. |
| [Documentation index — Requirement language](./README.md#requirement-language)                     | Defines Must, Should, May, Prototype, and Production.                                 |
| [Documentation index — Canonical identifiers](./README.md#canonical-identifiers)                   | Defines how screen IDs and shared terminology are used.                               |
| [Delivery plan — Delivery strategy](./09-delivery-plan-and-acceptance.md#delivery-strategy)        | Establishes accuracy-before-breadth and the primary release spine.                    |

## 1. Target platform architecture

Build a client-side React platform with feature modules above journey controllers, rules engines, a single asynchronous `APIService`, and LocalStorage-backed fictional data.

```text
React routes and page templates
→ feature controllers and shared state
→ domain rules and validation
→ APIService contract
→ LocalStorage repositories and seed snapshots
```

React components collect user intent and render results. They must not contain tax slabs, claim rules, persona branches, or direct persistence calls.

### Required references

| File and section                                                                                   | Why it is required                                                                       |
| -------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| [Technical architecture — Architecture goals](./08-technical-architecture.md#architecture-goals)   | Defines client-only scope, service isolation, rule separation, and future swap boundary. |
| [Technical architecture — Runtime shape](./08-technical-architecture.md#runtime-shape)             | Defines the required layering.                                                           |
| [Product definition — Product pillars](./01-product-definition.md#product-pillars)                 | Establishes the cross-domain capabilities the architecture must serve.                   |
| [Information architecture — Product hierarchy](./03-information-architecture.md#product-hierarchy) | Defines top-level application domains and ownership.                                     |
| [Delivery plan — Dependency order](./09-delivery-plan-and-acceptance.md#dependency-order)          | Defines the required implementation sequence.                                            |

## 2. Technology and dependency setup

Use React 19, TypeScript, and Vite. Add:

```text
react-router-dom
zustand
zod
react-hook-form
@hookform/resolvers
i18next
react-i18next
lucide-react
```

Add development dependencies:

```text
vitest
@testing-library/react
@testing-library/user-event
@testing-library/jest-dom
jsdom
@playwright/test
@axe-core/playwright
```

Use CSS custom properties and CSS Modules. Use native `Intl` formatters. Do not add a general UI framework or Tailwind; implement the documented visual language directly.

### Required references

| File and section                                                                                                           | Why it is required                                                     |
| -------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| [Technical architecture — Suggested frontend organization](./08-technical-architecture.md#suggested-frontend-organization) | Defines feature and infrastructure module boundaries.                  |
| [Technical architecture — Internationalization](./08-technical-architecture.md#internationalization)                       | Determines i18n architecture and structured rule output.               |
| [Technical architecture — Testing boundaries](./08-technical-architecture.md#testing-boundaries)                           | Determines required testing layers and dependencies.                   |
| [Visual design system — Anti-patterns](./06-visual-design-system.md#anti-patterns)                                         | Prevents framework defaults from producing the wrong visual direction. |
| [UX guidelines — Localization](./07-ux-content-accessibility.md#localization)                                              | Defines formatter and translation requirements.                        |

## 3. Source organization and module boundaries

Create this structure:

```text
src/
├── app/                 routing, shell, providers, store
├── components/          shared structural and UI primitives
├── features/            auth, home, identity, tax, EPFO, activity, grievances, profile
├── rules/               identity, tax, route, validation, EPFO, notice rules
├── services/            APIService, local adapter, repositories
├── data/                personas, AY rules, content fixtures
├── i18n/                English, Hindi, Bengali resources
├── styles/              tokens and global foundations
└── types/               shared domain contracts
```

Each feature owns its routes, screens, feature hooks, schemas, and feature-only components. Shared components must remain domain-neutral. Shared identity, actions, activity, and services are consumed through explicit contracts rather than cross-feature imports of internal modules.

### Required references

| File and section                                                                                                           | Why it is required                                                        |
| -------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| [Technical architecture — Suggested frontend organization](./08-technical-architecture.md#suggested-frontend-organization) | Canonical source-tree recommendation.                                     |
| [Information architecture — Product hierarchy](./03-information-architecture.md#product-hierarchy)                         | Maps product domains to feature modules.                                  |
| [Information architecture — Route versus overlay rules](./03-information-architecture.md#route-versus-overlay-rules)       | Determines whether feature experiences become routes, sheets, or dialogs. |
| [Screen inventory — How to use this catalogue](./04-screen-inventory.md#how-to-use-this-catalogue)                         | Defines screen types, delivery tiers, and stable identifiers.             |

## 4. Foundation workstream

### 4.1 Application infrastructure

Implement routing, providers, error boundaries, session hydration, active persona state, LocalStorage schema versions, online/offline detection, seed initialization, deterministic reset, draft recovery, and translation initialization.

Exit criteria:

- Both personas hydrate through `APIService`.
- Reload restores compatible state.
- Reset affects only the selected persona.
- Each route has loading, error, and recovery behavior.
- No screen imports seed JSON or LocalStorage directly.

#### Required references

| File and section                                                                                                 | Why it is required                                                              |
| ---------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| [Technical architecture — Seed and persistence model](./08-technical-architecture.md#seed-and-persistence-model) | Defines seed initialization, namespaces, isolation, reset, and schema versions. |
| [Technical architecture — Resilience and idempotency](./08-technical-architecture.md#resilience-and-idempotency) | Defines cached reads, queued operations, and duplicate prevention.              |
| [UX guidelines — Drafts and autosave](./07-ux-content-accessibility.md#drafts-and-autosave)                      | Defines resume, autosave, rules-update, and persona-switch behavior.            |
| [UX guidelines — Loading, offline, and failure](./07-ux-content-accessibility.md#loading-offline-and-failure)    | Defines all required asynchronous states.                                       |
| [Screen inventory — Shared system states](./04-screen-inventory.md#shared-system-states)                         | Provides X01–X10 implementation coverage.                                       |

### 4.2 Domain contracts

Define typed entities for session, persona, identity, mismatch, propagation, actions, activity, return drafts and computations, tax rules, validation, notices, EPFO profile and employment, claims, transfers, passbooks, nominations, and grievances.

Every persisted entity must have stable IDs, persona ownership, timestamps, source metadata where applicable, and a schema or rules version.

#### Required references

| File and section                                                                                   | Why it is required                                   |
| -------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| [Technical architecture — APIService boundary](./08-technical-architecture.md#apiservice-boundary) | Defines the primary service-facing contracts.        |
| [Technical architecture — Return draft](./08-technical-architecture.md#return-draft)               | Defines the tax draft aggregate.                     |
| [Technical architecture — Validation](./08-technical-architecture.md#validation)                   | Defines issue severity and correction targets.       |
| [Technical architecture — Notice model](./08-technical-architecture.md#notice-model)               | Defines notice and remedy state.                     |
| [UX guidelines — Data provenance](./07-ux-content-accessibility.md#data-provenance)                | Defines source metadata required on imported values. |

### 4.3 Persona seed data

Create immutable, identical-shaped fictional seed records for Ananya and Rajesh. Ananya represents consistent records and clean journeys. Rajesh contains cross-system name, mobile, bank, claim, AIS, and refund issues. Components must never branch on persona name.

#### Required references

| File and section                                                                                                 | Why it is required                                    |
| ---------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| [Personas — Persona model](./02-personas-and-user-journeys.md#persona-model)                                     | Defines shared-shape and switching rules.             |
| [Personas — Ananya](./02-personas-and-user-journeys.md#ananya-consistent-profile)                                | Defines the clean scenario.                           |
| [Personas — Rajesh](./02-personas-and-user-journeys.md#rajesh-inconsistent-profile)                              | Defines the mismatch scenario.                        |
| [Technical architecture — Seed and persistence model](./08-technical-architecture.md#seed-and-persistence-model) | Defines immutability and LocalStorage initialization. |
| [UX guidelines — Prototype honesty and safety](./07-ux-content-accessibility.md#prototype-honesty-and-safety)    | Defines fictional-data and disclosure requirements.   |

## 5. Design-system workstream

### 5.1 Visual foundations

Implement the warm civic-editorial direction using the documented colours, multilingual typography, spacing, borders, surfaces, financial numerals, source markers, status language, and restrained motion.

#### Required references

| File and section                                                                                     | Why it is required                                           |
| ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| [Visual design system — Direction](./06-visual-design-system.md#direction-warm-civic-editorial)      | Defines the design concept and government-branding boundary. |
| [Visual design system — Colour tokens](./06-visual-design-system.md#colour-tokens)                   | Canonical palette and semantic roles.                        |
| [Visual design system — Typography](./06-visual-design-system.md#typography)                         | Defines multilingual type and monetary numerals.             |
| [Visual design system — Spacing](./06-visual-design-system.md#spacing)                               | Defines layout rhythm.                                       |
| [Visual design system — Surfaces and elevation](./06-visual-design-system.md#surfaces-and-elevation) | Defines card, border, radius, and shadow behavior.           |
| [Visual design system — Motion](./06-visual-design-system.md#motion)                                 | Defines purposeful motion and reduced-motion behavior.       |

### 5.2 Application shell and responsive layouts

Build the global header, desktop sidebar, mobile bottom navigation, page header, optional context rail, sticky action footer, and responsive sheet/dialog behavior. Validate at 390, 768, 1024, and 1440 pixels.

#### Required references

| File and section                                                                                        | Why it is required                                 |
| ------------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| [Layout — Desktop application shell](./05-layout-and-responsive-structure.md#desktop-application-shell) | Defines desktop regions and dimensions.            |
| [Layout — Mobile application shell](./05-layout-and-responsive-structure.md#mobile-application-shell)   | Defines mobile navigation and sticky actions.      |
| [Layout — Breakpoints](./05-layout-and-responsive-structure.md#breakpoints)                             | Defines responsive transitions.                    |
| [Layout — Global header](./05-layout-and-responsive-structure.md#global-header)                         | Defines persistent header controls.                |
| [Layout — Context rail and sheets](./05-layout-and-responsive-structure.md#context-rail-and-sheets)     | Defines contextual information across breakpoints. |
| [Layout — Sticky action footer](./05-layout-and-responsive-structure.md#sticky-action-footer)           | Defines action hierarchy and placement.            |

### 5.3 Components and page templates

Build shared structural and domain-neutral components before feature pages. Implement the seven canonical templates: dashboard, guided journey, review and correct, calculation, status and timeline, final review, and completion.

#### Required references

| File and section                                                                                        | Why it is required                   |
| ------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| [Visual design system — Structural components](./06-visual-design-system.md#structural-components)      | Canonical shared-component list.     |
| [Visual design system — Domain components](./06-visual-design-system.md#domain-components)              | Canonical feature-component list.    |
| [Layout — Standard page anatomy](./05-layout-and-responsive-structure.md#standard-page-anatomy)         | Defines common hierarchy.            |
| [Layout — Page template 1](./05-layout-and-responsive-structure.md#page-template-1-dashboard)           | Dashboard behavior.                  |
| [Layout — Page template 2](./05-layout-and-responsive-structure.md#page-template-2-guided-journey)      | Guided-flow behavior.                |
| [Layout — Page template 3](./05-layout-and-responsive-structure.md#page-template-3-review-and-correct)  | Mismatch and source-review behavior. |
| [Layout — Page template 4](./05-layout-and-responsive-structure.md#page-template-4-calculation)         | Financial ledger behavior.           |
| [Layout — Page template 5](./05-layout-and-responsive-structure.md#page-template-5-status-and-timeline) | Status tracking behavior.            |
| [Layout — Page template 6](./05-layout-and-responsive-structure.md#page-template-6-final-review)        | Validation review behavior.          |
| [Layout — Page template 7](./05-layout-and-responsive-structure.md#page-template-7-completion)          | Confirmation behavior.               |

## 6. Shared platform workstream

### 6.1 Authentication and session

Build Welcome, prototype disclosure, visible fictional credentials, persona selection, mock Aadhaar login, OTP expiry/resend, restoration, sign-out, and session recovery.

#### Required references

| File and section                                                                                                           | Why it is required                            |
| -------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| [Screen inventory — Entry and authentication](./04-screen-inventory.md#entry-and-authentication)                           | Defines G01–G08.                              |
| [Technical architecture — Authentication and verification](./08-technical-architecture.md#authentication-and-verification) | Defines mock-token and verification honesty.  |
| [Personas — Persona model](./02-personas-and-user-journeys.md#persona-model)                                               | Defines switching and isolation.              |
| [UX guidelines — Prototype honesty and safety](./07-ux-content-accessibility.md#prototype-honesty-and-safety)              | Defines disclosures and sensitive-data rules. |

### 6.2 Unified Home and Action Centre

Derive the most important action, identity health, service summaries, and recent events from domain state. Action Centre items contain service, severity, consequence, deadline, source, exact fix target, and resolution state.

#### Required references

| File and section                                                                                                     | Why it is required                        |
| -------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| [Information architecture — Home hierarchy](./03-information-architecture.md#home-hierarchy)                         | Defines priority ordering.                |
| [Screen inventory — Unified Home and activity](./04-screen-inventory.md#unified-home-and-activity)                   | Defines H01–H08.                          |
| [Layout — Page template 1](./05-layout-and-responsive-structure.md#page-template-1-dashboard)                        | Defines dashboard composition.            |
| [Product definition — Unified action and status layer](./01-product-definition.md#4-unified-action-and-status-layer) | Defines cross-service purpose.            |
| [UX guidelines — Validation model](./07-ux-content-accessibility.md#validation-model)                                | Defines severity and one-action behavior. |

### 6.3 Unified Activity

Generate events from identity, tax, EPFO, notice, and grievance operations. Keep Activity as a history of events and Action Centre as outstanding work.

#### Required references

| File and section                                                                                               | Why it is required                    |
| -------------------------------------------------------------------------------------------------------------- | ------------------------------------- |
| [Information architecture — Activity and grievances](./03-information-architecture.md#activity-and-grievances) | Defines event/action/case boundaries. |
| [Layout — Page template 5](./05-layout-and-responsive-structure.md#page-template-5-status-and-timeline)        | Defines status page anatomy.          |
| [UX guidelines — Status and deadlines](./07-ux-content-accessibility.md#status-and-deadlines)                  | Defines status meaning and estimates. |
| [Screen inventory — Unified Home and activity](./04-screen-inventory.md#unified-home-and-activity)             | Defines feed and event screens.       |

## 7. Financial Identity workstream

### 7.1 Identity comparison

Compare Aadhaar, PAN, bank, EPFO, and Income Tax values by field and source. Desktop uses a source matrix; mobile uses field-first cards.

#### Required references

| File and section                                                                                          | Why it is required                   |
| --------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| [Product definition — Shared financial identity](./01-product-definition.md#1-shared-financial-identity)  | Defines identity product behavior.   |
| [Screen inventory — Shared financial identity](./04-screen-inventory.md#shared-financial-identity)        | Defines I01–I12.                     |
| [Layout — Identity comparison layout](./05-layout-and-responsive-structure.md#identity-comparison-layout) | Defines desktop/mobile presentation. |
| [UX guidelines — Data provenance](./07-ux-content-accessibility.md#data-provenance)                       | Defines source metadata.             |

### 7.2 Correction and propagation

Implement mismatch detail, canonical-value selection, requirements, destination review, asynchronous propagation, partial results, dependent revalidation, change receipt, and Activity update.

#### Required references

| File and section                                                                                                                    | Why it is required                        |
| ----------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| [Personas — Journey 1](./02-personas-and-user-journeys.md#journey-1-identity-correction-and-propagation)                            | Canonical end-to-end correction journey.  |
| [Technical architecture — State and propagation](./08-technical-architecture.md#state-and-propagation)                              | Defines state mutations and invalidation. |
| [Layout — Page template 3](./05-layout-and-responsive-structure.md#page-template-3-review-and-correct)                              | Defines correction presentation.          |
| [Visual design system — Source markers](./06-visual-design-system.md#source-markers)                                                | Defines provenance styling.               |
| [Delivery plan — Identity and EPFO acceptance criteria](./09-delivery-plan-and-acceptance.md#identity-and-epfo-acceptance-criteria) | Defines completion gates.                 |

## 8. EPFO workstream

### 8.1 EPFO Home, profile, KYC, and employment

Build task-first EPFO navigation, profile, fictional UAN, KYC, bank record, employment history, and service history.

#### Required references

| File and section                                                                                           | Why it is required                        |
| ---------------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| [Product definition — Preventive EPFO assistance](./01-product-definition.md#3-preventive-epfo-assistance) | Defines the preventive task model.        |
| [Information architecture — EPFO hierarchy](./03-information-architecture.md#epfo-hierarchy)               | Defines domain navigation.                |
| [Screen inventory — EPFO landing and profile](./04-screen-inventory.md#epfo-landing-and-profile)           | Defines E01–E06.                          |
| [Personas — Rajesh](./02-personas-and-user-journeys.md#rajesh-inconsistent-profile)                        | Defines KYC, bank, and employment issues. |

### 8.2 PF withdrawal and Claim Doctor

Implement eligibility, named pre-validation rules, issue correction, claim entry, bank confirmation, transparent readiness, review, mock OTP, submission, tracking, and rejection explanation.

#### Required references

| File and section                                                                                                                    | Why it is required                              |
| ----------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------- |
| [Personas — Journey 6](./02-personas-and-user-journeys.md#journey-6-pf-withdrawal)                                                  | Canonical withdrawal journey.                   |
| [Screen inventory — PF withdrawal](./04-screen-inventory.md#pf-withdrawal)                                                          | Defines C01–C15.                                |
| [Technical architecture — EPFO rule engine](./08-technical-architecture.md#epfo-rule-engine)                                        | Defines independent named checks and outputs.   |
| [Layout — Page template 6](./05-layout-and-responsive-structure.md#page-template-6-final-review)                                    | Defines claim readiness and correction actions. |
| [Delivery plan — Identity and EPFO acceptance criteria](./09-delivery-plan-and-acceptance.md#identity-and-epfo-acceptance-criteria) | Defines rule, cache, and tracking gates.        |

### 8.3 Passbook and balance

Build cached balance, employer totals, monthly contributions, background refresh, stale timestamp, preserved-data failure, and contribution-grievance entry.

#### Required references

| File and section                                                                                              | Why it is required                    |
| ------------------------------------------------------------------------------------------------------------- | ------------------------------------- |
| [Personas — Journey 8](./02-personas-and-user-journeys.md#journey-8-passbook-resilience)                      | Canonical resilient passbook journey. |
| [Screen inventory — Passbook and balance](./04-screen-inventory.md#passbook-and-balance)                      | Defines E10–E17.                      |
| [Layout — Page template 4](./05-layout-and-responsive-structure.md#page-template-4-calculation)               | Defines ledger presentation.          |
| [UX guidelines — Loading, offline, and failure](./07-ux-content-accessibility.md#loading-offline-and-failure) | Defines refresh and cache behavior.   |
| [Visual design system — Financial ledgers](./06-visual-design-system.md#financial-ledgers)                    | Defines amounts and rows.             |

### 8.4 PF transfer

Implement employer selection, date-overlap detection, identity/KYC validation, transfer review, verification, confirmation, and employer/EPFO timeline after withdrawal is stable.

#### Required references

| File and section                                                                                        | Why it is required                        |
| ------------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| [Personas — Journey 7](./02-personas-and-user-journeys.md#journey-7-pf-transfer)                        | Canonical transfer journey.               |
| [Screen inventory — PF transfer](./04-screen-inventory.md#pf-transfer)                                  | Defines D01–D10.                          |
| [Technical architecture — EPFO rule engine](./08-technical-architecture.md#epfo-rule-engine)            | Defines date and identity rule structure. |
| [Layout — Page template 5](./05-layout-and-responsive-structure.md#page-template-5-status-and-timeline) | Defines transfer tracking.                |

### 8.5 Nomination

Implement current status, nominee list, details, share allocation, exact 100% validation, review, verification, and effective/pending confirmation.

#### Required references

| File and section                                                                               | Why it is required                      |
| ---------------------------------------------------------------------------------------------- | --------------------------------------- |
| [Personas — Journey 9](./02-personas-and-user-journeys.md#journey-9-nomination)                | Canonical nomination journey.           |
| [Screen inventory — Nomination](./04-screen-inventory.md#nomination)                           | Defines N01–N08.                        |
| [UX guidelines — Validation model](./07-ux-content-accessibility.md#validation-model)          | Defines blocking percentage validation. |
| [Layout — Page template 7](./05-layout-and-responsive-structure.md#page-template-7-completion) | Defines completion state.               |

## 9. Income Tax workstream

### 9.1 AY-versioned tax rules

Create versioned configuration for filing routes, slabs, standard deductions, Chapter VI-A rules, rebates, cess, surcharge and marginal relief, house property, capital gains, loss set-off, presumptive taxation, interest and fees, and validation. Verify each enabled rule against official AY-specific material before use.

#### Required references

| File and section                                                                                                                                                                             | Why it is required                                                                             |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| [Technical architecture — AY-versioned rules](./08-technical-architecture.md#ay-versioned-rules)                                                                                             | Defines configuration and filed-snapshot version requirements.                                 |
| [Technical architecture — Tax computation pipeline](./08-technical-architecture.md#tax-computation-pipeline)                                                                                 | Establishes statutory calculation order.                                                       |
| [Product definition — Guided Income Tax filing](./01-product-definition.md#2-guided-income-tax-filing)                                                                                       | Defines citizen-facing purpose and accuracy boundaries.                                        |
| [Delivery plan — Tax acceptance criteria](./09-delivery-plan-and-acceptance.md#tax-acceptance-criteria)                                                                                      | Defines the release gate for tax behavior.                                                     |
| [`Flow-A-ITR-Filing-Spec-Revised-AY-2026-27.md`](./reference/Flow-A-ITR-Filing-Spec-Revised-AY-2026-27.md) — “Core Architecture Rules,” “Tax Engine,” and “AY 2026–27 Reference Assumptions” | Original detailed source; verify its assumptions against official rules before implementation. |

### 9.2 Filing-route engine

Determine `ITR1_LIKE`, `ITR2_LIKE`, `ITR4_LIKE`, `ITR3_ADVANCED`, or `UNSUPPORTED` from the complete taxpayer situation. Route logic belongs in AY rules, never in components.

#### Required references

| File and section                                                                                                                                                                                          | Why it is required                                                    |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| [Technical architecture — Filing routes](./08-technical-architecture.md#filing-routes)                                                                                                                    | Defines route type and decision shape.                                |
| [Personas — Journey 4](./02-personas-and-user-journeys.md#journey-4-route-change-or-unsupported-case)                                                                                                     | Defines user experience for route changes and unsupported complexity. |
| [Screen inventory — Guided filing: setup and income discovery](./04-screen-inventory.md#guided-filing-setup-and-income-discovery)                                                                         | Defines A00–A02B route and eligibility screens.                       |
| [Information architecture — Deep links and back navigation](./03-information-architecture.md#deep-links-and-back-navigation)                                                                              | Defines preservation and revalidation after route change.             |
| [`Flow-A-ITR-Filing-Spec-Revised-AY-2026-27.md`](./reference/Flow-A-ITR-Filing-Spec-Revised-AY-2026-27.md) — “Core Architecture Rules: Do Not Ask the User to Pick an ITR Form” and “Filing Route Engine” | Original eligibility requirements.                                    |

### 9.3 Tax computation engine

Implement pure functions for income heads, set-off, Gross Total Income, deductions, Total Income, normal and special-rate tax, rebate, surcharge and marginal relief, cess, interest and fee, credits, payable, and refund. Compute regimes independently from shared input.

#### Required references

| File and section                                                                                                                                                                                                                         | Why it is required                                                          |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| [Technical architecture — Tax computation pipeline](./08-technical-architecture.md#tax-computation-pipeline)                                                                                                                             | Canonical computation order and result shape.                               |
| [Visual design system — Financial ledgers](./06-visual-design-system.md#financial-ledgers)                                                                                                                                               | Defines how entered, allowed, applied, and calculated values are presented. |
| [UX guidelines — Corrections and clamping](./07-ux-content-accessibility.md#corrections-and-clamping)                                                                                                                                    | Prevents silent caps or lost user input.                                    |
| [Delivery plan — Tax acceptance criteria](./09-delivery-plan-and-acceptance.md#tax-acceptance-criteria)                                                                                                                                  | Defines required computation behavior.                                      |
| [`Flow-A-ITR-Filing-Spec-Revised-AY-2026-27.md`](./reference/Flow-A-ITR-Filing-Spec-Revised-AY-2026-27.md) — “Separate Income, Deductions, Tax and Tax Credits,” “Compute Both Regimes in Parallel,” and “Required Computation Pipeline” | Original detailed computation source.                                       |

### 9.4 Filing setup and income discovery

Build AY entry, filing type, residency, taxpayer circumstances, special eligibility questions, income-source discovery, detected-source review, and unsupported-case handling.

#### Required references

| File and section                                                                                                                    | Why it is required                      |
| ----------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------- |
| [Personas — Journey 2](./02-personas-and-user-journeys.md#journey-2-ordinary-salaried-return)                                       | Defines the ordinary guided path.       |
| [Personas — Journey 4](./02-personas-and-user-journeys.md#journey-4-route-change-or-unsupported-case)                               | Defines route-change behavior.          |
| [Screen inventory — Guided filing: setup and income discovery](./04-screen-inventory.md#guided-filing-setup-and-income-discovery)   | Defines A00–A02B.                       |
| [Layout — Page template 2](./05-layout-and-responsive-structure.md#page-template-2-guided-journey)                                  | Defines journey structure and progress. |
| [UX guidelines — “I'm not sure” behavior](./07-ux-content-accessibility.md#im-not-sure-behavior)                                    | Defines uncertain-answer handling.      |
| [`Flow-A-ITR-Filing-Spec-Revised-AY-2026-27.md`](./reference/Flow-A-ITR-Filing-Spec-Revised-AY-2026-27.md) — Screens A0, A1, and A2 | Original field-level requirements.      |

### 9.5 Salary and pension

Support multiple employers, normal pension, family-pension routing, imported Form 16 review, regime-aware exemptions, standard deduction, employer NPS, TDS, and material-difference review.

#### Required references

| File and section                                                                                                       | Why it is required                                     |
| ---------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| [Screen inventory — Guided filing: salary and pension](./04-screen-inventory.md#guided-filing-salary-and-pension)      | Defines A03–A03F.                                      |
| [Layout — Page template 3](./05-layout-and-responsive-structure.md#page-template-3-review-and-correct)                 | Defines import review and correction.                  |
| [UX guidelines — Data provenance](./07-ux-content-accessibility.md#data-provenance)                                    | Defines Form 16 source display.                        |
| [Delivery plan — Tax acceptance criteria](./09-delivery-plan-and-acceptance.md#tax-acceptance-criteria)                | Defines credit and calculation gates.                  |
| [`Flow-A-ITR-Filing-Spec-Revised-AY-2026-27.md`](./reference/Flow-A-ITR-Filing-Spec-Revised-AY-2026-27.md) — Screen A3 | Original salary, pension, and validation requirements. |

### 9.6 House property

Support route-appropriate property count, ownership, self-occupied and rented treatment, municipal taxes, home-loan metadata, regime-aware interest, loss set-off, and carry-forward explanations.

#### Required references

| File and section                                                                                                       | Why it is required                                 |
| ---------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| [Screen inventory — Guided filing: house property](./04-screen-inventory.md#guided-filing-house-property)              | Defines A04–A04F.                                  |
| [Layout — Page template 4](./05-layout-and-responsive-structure.md#page-template-4-calculation)                        | Defines property calculation presentation.         |
| [UX guidelines — Progressive disclosure](./07-ux-content-accessibility.md#progressive-disclosure)                      | Defines lender and loan metadata disclosure.       |
| [Technical architecture — AY-versioned rules](./08-technical-architecture.md#ay-versioned-rules)                       | Requires regime and AY rule isolation.             |
| [`Flow-A-ITR-Filing-Spec-Revised-AY-2026-27.md`](./reference/Flow-A-ITR-Filing-Spec-Revised-AY-2026-27.md) — Screen A4 | Original property and loss-treatment requirements. |

### 9.7 Capital gains

Support only asset classes the engine can compute accurately. Preserve normal-rate and special-rate buckets, imported sale evidence, acquisition data, holding-period classification, gain calculation, set-off, carry-forward, and unsupported routing.

#### Required references

| File and section                                                                                                       | Why it is required                                             |
| ---------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| [Personas — Journey 3](./02-personas-and-user-journeys.md#journey-3-ais-mismatch-resolution)                           | Defines sale review and reclassification.                      |
| [Screen inventory — Guided filing: capital gains](./04-screen-inventory.md#guided-filing-capital-gains)                | Defines A05–A05F.                                              |
| [Technical architecture — Tax computation pipeline](./08-technical-architecture.md#tax-computation-pipeline)           | Requires special-rate separation.                              |
| [UX guidelines — Data provenance](./07-ux-content-accessibility.md#data-provenance)                                    | Defines imported transaction evidence.                         |
| [`Flow-A-ITR-Filing-Spec-Revised-AY-2026-27.md`](./reference/Flow-A-ITR-Filing-Spec-Revised-AY-2026-27.md) — Screen A5 | Original capital-gain fields, classification, and route logic. |

### 9.8 Business and profession

Classify activity, collect actual cash and non-cash receipts, determine 44AD/44ADA/implemented 44AE eligibility, explain lower-profit cases, apply regime history and Form 10-IEA restrictions, and preserve data during advanced handoff.

#### Required references

| File and section                                                                                                                                 | Why it is required                                                |
| ------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------- |
| [Personas — Journey 5](./02-personas-and-user-journeys.md#journey-5-freelancer-or-small-business)                                                | Canonical business journey.                                       |
| [Screen inventory — Guided filing: business and profession](./04-screen-inventory.md#guided-filing-business-and-profession)                      | Defines A06–A06G.                                                 |
| [Technical architecture — Filing routes](./08-technical-architecture.md#filing-routes)                                                           | Defines presumptive versus advanced routing.                      |
| [UX guidelines — “I'm not sure” behavior](./07-ux-content-accessibility.md#im-not-sure-behavior)                                                 | Defines profession-classification help.                           |
| [`Flow-A-ITR-Filing-Spec-Revised-AY-2026-27.md`](./reference/Flow-A-ITR-Filing-Spec-Revised-AY-2026-27.md) — Screen A6 and “Example: Freelancer” | Original presumptive eligibility and regime-history requirements. |

### 9.9 Other, agricultural, and exempt income

Implement interest, dividends, family pension, ordinary sources, AIS mismatch actions, 80TTA/80TTB evaluation, agricultural income, exempt income, partial integration, and route consequences.

#### Required references

| File and section                                                                                                               | Why it is required                                            |
| ------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------- |
| [Personas — Journey 3](./02-personas-and-user-journeys.md#journey-3-ais-mismatch-resolution)                                   | Defines imported mismatch treatment.                          |
| [Screen inventory — Guided filing: other and exempt income](./04-screen-inventory.md#guided-filing-other-and-exempt-income)    | Defines A07–A08C.                                             |
| [UX guidelines — Data provenance](./07-ux-content-accessibility.md#data-provenance)                                            | Defines included, reclassified, and disputed state.           |
| [UX guidelines — Corrections and clamping](./07-ux-content-accessibility.md#corrections-and-clamping)                          | Prevents silent exclusion and incorrect deduction display.    |
| [`Flow-A-ITR-Filing-Spec-Revised-AY-2026-27.md`](./reference/Flow-A-ITR-Filing-Spec-Revised-AY-2026-27.md) — Screens A7 and A8 | Original category, deduction, and exempt-income requirements. |

### 9.10 Deductions

Build life-event discovery for 80C, personal and employer NPS, 80D, education loans, donations, rent without HRA, disability/medical treatment, and implemented advanced deductions. Preserve entered, allowed, and regime-applied amounts.

#### Required references

| File and section                                                                                                       | Why it is required                                        |
| ---------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| [Screen inventory — Guided filing: deductions](./04-screen-inventory.md#guided-filing-deductions)                      | Defines A09–A09K.                                         |
| [UX guidelines — Progressive disclosure](./07-ux-content-accessibility.md#progressive-disclosure)                      | Defines metadata collection timing.                       |
| [UX guidelines — Corrections and clamping](./07-ux-content-accessibility.md#corrections-and-clamping)                  | Defines cap and regime explanations.                      |
| [Visual design system — Financial ledgers](./06-visual-design-system.md#financial-ledgers)                             | Defines applied and unused display.                       |
| [`Flow-A-ITR-Filing-Spec-Revised-AY-2026-27.md`](./reference/Flow-A-ITR-Filing-Spec-Revised-AY-2026-27.md) — Screen A9 | Original deduction eligibility and metadata requirements. |

### 9.11 Tax credits and payment

Reconcile salary TDS, other TDS, TCS, advance tax, and self-assessment tax separately from income. Block duplication and required mismatches. Refresh computation after a simulated payment.

#### Required references

| File and section                                                                                                            | Why it is required                                   |
| --------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| [Screen inventory — Guided filing: tax credits and payment](./04-screen-inventory.md#guided-filing-tax-credits-and-payment) | Defines A10–A10H.                                    |
| [Technical architecture — Tax computation pipeline](./08-technical-architecture.md#tax-computation-pipeline)                | Defines credit ordering.                             |
| [UX guidelines — Validation model](./07-ux-content-accessibility.md#validation-model)                                       | Defines mismatch severity.                           |
| [Delivery plan — Tax acceptance criteria](./09-delivery-plan-and-acceptance.md#tax-acceptance-criteria)                     | Defines reconciliation and payment gates.            |
| [`Flow-A-ITR-Filing-Spec-Revised-AY-2026-27.md`](./reference/Flow-A-ITR-Filing-Spec-Revised-AY-2026-27.md) — Screen A10     | Original source, field, and validation requirements. |

### 9.12 Regime comparison, bank, calculation, and filing

Build regime comparison, legally available choice, bank validation and refund nomination, full ledger summary, final validation, declaration, mock verification, frozen snapshot, acknowledgment, and confirmation.

#### Required references

| File and section                                                                                                                      | Why it is required                                                             |
| ------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| [Screen inventory — Guided filing: regime, bank, and calculation](./04-screen-inventory.md#guided-filing-regime-bank-and-calculation) | Defines A11–A13E.                                                              |
| [Screen inventory — Guided filing: validation and completion](./04-screen-inventory.md#guided-filing-validation-and-completion)       | Defines A14–A16B.                                                              |
| [Layout — Page template 4](./05-layout-and-responsive-structure.md#page-template-4-calculation)                                       | Defines calculation presentation.                                              |
| [Layout — Page template 6](./05-layout-and-responsive-structure.md#page-template-6-final-review)                                      | Defines pre-submit validation.                                                 |
| [Layout — Page template 7](./05-layout-and-responsive-structure.md#page-template-7-completion)                                        | Defines filing confirmation.                                                   |
| [Technical architecture — Authentication and verification](./08-technical-architecture.md#authentication-and-verification)            | Defines separate filing and verification state.                                |
| [`Flow-A-ITR-Filing-Spec-Revised-AY-2026-27.md`](./reference/Flow-A-ITR-Filing-Spec-Revised-AY-2026-27.md) — Screens A11 through A16  | Original calculation, bank, validation, filing, and confirmation requirements. |

## 10. Post-filing and notice workstream

### 10.1 Return and refund tracking

Build return history, frozen snapshot, filing and verification timeline, refund amount and bank, cause-aware delay, deadline or expected next event, and follow-up actions.

#### Required references

| File and section                                                                                             | Why it is required                    |
| ------------------------------------------------------------------------------------------------------------ | ------------------------------------- |
| [Personas — Journey 10](./02-personas-and-user-journeys.md#journey-10-post-filing-refund-or-notice)          | Canonical refund and notice journey.  |
| [Screen inventory — Post-filing Income Tax support](./04-screen-inventory.md#post-filing-income-tax-support) | Defines P01–P14 and A17.              |
| [UX guidelines — Status and deadlines](./07-ux-content-accessibility.md#status-and-deadlines)                | Defines status and estimate language. |
| [Layout — Page template 5](./05-layout-and-responsive-structure.md#page-template-5-status-and-timeline)      | Defines tracker anatomy.              |

### 10.2 Notice parsing and remedy

Support simulated 139(9) and 143(1) ingestion, deadline extraction, filed-versus-department diffs, one system-decided remedy, exact upstream reopening, rectification when recognized, and carefully gated ITR-U.

#### Required references

| File and section                                                                                                             | Why it is required                                  |
| ---------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------- |
| [Technical architecture — Notice model](./08-technical-architecture.md#notice-model)                                         | Defines state and remedy contracts.                 |
| [Personas — Journey 10](./02-personas-and-user-journeys.md#journey-10-post-filing-refund-or-notice)                          | Defines end-to-end resolution.                      |
| [Screen inventory — Post-filing Income Tax support](./04-screen-inventory.md#post-filing-income-tax-support)                 | Defines notice screens and tiers.                   |
| [Information architecture — Deep links and back navigation](./03-information-architecture.md#deep-links-and-back-navigation) | Defines exact-section reopening.                    |
| [`Flow-A-ITR-Filing-Spec-Revised-AY-2026-27.md`](./reference/Flow-A-ITR-Filing-Spec-Revised-AY-2026-27.md) — Screen A17      | Original notice, deadline, and remedy requirements. |

## 11. Unified grievance workstream

Create a shared grievance engine for Income Tax, EPFO, and cross-service identity problems. Infer or select service, recommend category, collect fictional evidence, review, submit, track, translate status, and support escalation when implemented.

### Required references

| File and section                                                                                               | Why it is required                       |
| -------------------------------------------------------------------------------------------------------------- | ---------------------------------------- |
| [Personas — Journey 11](./02-personas-and-user-journeys.md#journey-11-unified-grievance)                       | Canonical grievance journey.             |
| [Screen inventory — Unified grievances](./04-screen-inventory.md#unified-grievances)                           | Defines R01–R10.                         |
| [Information architecture — Activity and grievances](./03-information-architecture.md#activity-and-grievances) | Separates cases from actions and events. |
| [UX guidelines — Status and deadlines](./07-ux-content-accessibility.md#status-and-deadlines)                  | Defines meaningful case-status copy.     |
| [Layout — Page template 5](./05-layout-and-responsive-structure.md#page-template-5-status-and-timeline)        | Defines grievance tracking.              |

## 12. Localization workstream

Implement English, Hindi, and Bengali from the start. Keep static copy in resources, map structured rule codes to localized content, use locale-aware formatters, allow longer labels, and complete each released journey in all required languages.

### Required references

| File and section                                                                                        | Why it is required                             |
| ------------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| [UX guidelines — Localization](./07-ux-content-accessibility.md#localization)                           | Canonical localization requirements.           |
| [Technical architecture — Internationalization](./08-technical-architecture.md#internationalization)    | Defines code/message separation.               |
| [Visual design system — Typography](./06-visual-design-system.md#typography)                            | Defines multilingual font requirements.        |
| [Layout — Breakpoints](./05-layout-and-responsive-structure.md#breakpoints)                             | Defines layouts that must survive longer copy. |
| [Delivery plan — Localization acceptance](./09-delivery-plan-and-acceptance.md#localization-acceptance) | Defines release gates.                         |

## 13. Accessibility workstream

Target WCAG 2.2 AA. Implement landmarks, headings, skip navigation, keyboard completion, route and sheet focus, form descriptions, error summaries, live status announcements, currency and identifier names, table/card semantic equivalence, zoom/reflow, contrast, and reduced motion.

### Required references

| File and section                                                                                          | Why it is required                   |
| --------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| [UX guidelines — Accessibility baseline](./07-ux-content-accessibility.md#accessibility-baseline)         | Canonical accessibility rules.       |
| [UX guidelines — Forms](./07-ux-content-accessibility.md#forms)                                           | Form-specific accessibility.         |
| [UX guidelines — Tables and comparisons](./07-ux-content-accessibility.md#tables-and-comparisons)         | Responsive semantic requirements.    |
| [UX guidelines — Masked sensitive values](./07-ux-content-accessibility.md#masked-sensitive-values)       | Accessible identity and bank naming. |
| [Visual design system — Motion](./06-visual-design-system.md#motion)                                      | Reduced-motion behavior.             |
| [Delivery plan — Accessibility acceptance](./09-delivery-plan-and-acceptance.md#accessibility-acceptance) | Release gates.                       |

## 14. Testing workstream

### 14.1 Unit and service tests

Test pure identity, filing-route, tax, EPFO, nomination, notice, and formatting rules. Test persona isolation, seed initialization, schema migration, reset, persistence, failure, cache, queue, partial propagation, and duplicate prevention at the service boundary.

#### Required references

| File and section                                                                                                 | Why it is required                                                      |
| ---------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| [Technical architecture — Testing boundaries](./08-technical-architecture.md#testing-boundaries)                 | Defines unit, adapter, controller, component, and E2E responsibilities. |
| [Technical architecture — Resilience and idempotency](./08-technical-architecture.md#resilience-and-idempotency) | Supplies failure and duplicate-prevention cases.                        |
| [Delivery plan — Verification activities](./09-delivery-plan-and-acceptance.md#verification-activities)          | Defines minimum automated and manual coverage.                          |
| [Delivery plan — Tax acceptance criteria](./09-delivery-plan-and-acceptance.md#tax-acceptance-criteria)          | Supplies tax test expectations.                                         |

### 14.2 Component, accessibility, and visual tests

Test provenance, validation navigation, calculations, comparisons, timelines, OTP, sticky actions, dialogs, sheets, accessible naming, focus, and responsive variants at 390, 768, 1024, and 1440 pixels.

#### Required references

| File and section                                                                                                          | Why it is required                     |
| ------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| [Delivery plan — Responsive acceptance](./09-delivery-plan-and-acceptance.md#responsive-acceptance)                       | Defines target viewports and behavior. |
| [Delivery plan — Accessibility acceptance](./09-delivery-plan-and-acceptance.md#accessibility-acceptance)                 | Defines automated and manual gates.    |
| [Layout — Loading and error placement](./05-layout-and-responsive-structure.md#loading-and-error-placement)               | Defines state placement.               |
| [UX guidelines — Content checklist for every screen](./07-ux-content-accessibility.md#content-checklist-for-every-screen) | Provides screen-review checklist.      |

### 14.3 End-to-end journeys

Cover Ananya clean use, Rajesh correction, PF withdrawal, passbook failure, supported return, AIS reclassification, unsupported route, draft recovery, verification pending, refund delay, notice remedy, grievance, persona switching, reset, and offline recovery.

#### Required references

| File and section                                                                                              | Why it is required                            |
| ------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| [Personas and user journeys](./02-personas-and-user-journeys.md)                                              | Canonical E2E scenarios.                      |
| [Delivery plan — Journey definition of done](./09-delivery-plan-and-acceptance.md#journey-definition-of-done) | Defines journey completeness.                 |
| [Delivery plan — Resilience acceptance](./09-delivery-plan-and-acceptance.md#resilience-acceptance)           | Defines recovery scenarios.                   |
| [Screen inventory](./04-screen-inventory.md)                                                                  | Maps each journey to canonical screen states. |

## 15. CI/CD and release operations

Run type checking, linting, unit tests, component tests, production build, accessibility smoke tests, and critical Playwright journeys on every pull request. Provide preview deployments, a stable demo environment, and later a production-like integration environment.

Validate direct-route refresh, fictional credentials, persona reset, incognito access, mobile/desktop behavior, disclosure, absence of real data, and all submission links before release.

### Required references

| File and section                                                                                              | Why it is required                                      |
| ------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| [Delivery plan — Demo and reviewer safety](./09-delivery-plan-and-acceptance.md#demo-and-reviewer-safety)     | Defines hosting and review requirements.                |
| [Delivery plan — Screen definition of done](./09-delivery-plan-and-acceptance.md#screen-definition-of-done)   | Defines feature-level CI expectations.                  |
| [Delivery plan — Resilience acceptance](./09-delivery-plan-and-acceptance.md#resilience-acceptance)           | Defines release recovery behavior.                      |
| [Product definition — Non-goals](./01-product-definition.md#non-goals)                                        | Defines real-integration and sensitive-data boundaries. |
| [UX guidelines — Prototype honesty and safety](./07-ux-content-accessibility.md#prototype-honesty-and-safety) | Defines disclosure and data review.                     |

## 16. Delivery milestones

Assuming three engineers with design and QA support, plan approximately 14–18 weeks for the complete mocked platform. A solo build should expect roughly two to three times longer.

| Milestone |         Duration | Deliverable                                                 |
| --------- | ---------------: | ----------------------------------------------------------- |
| M0        |           3 days | Submission: identity plus PF Claim Doctor and Activity.     |
| M1        |        1–2 weeks | Shell, design system, services, state, seeds, and i18n.     |
| M2        |        1–2 weeks | Shared identity, propagation, audit, actions, and activity. |
| M3        |        2–3 weeks | PF withdrawal, passbook, and tracking.                      |
| M4        |        4–5 weeks | Accurate Tier 1 guided Income Tax filing.                   |
| M5        |          2 weeks | Refunds, notices, and unified grievances.                   |
| M6        |          2 weeks | PF transfer and nomination.                                 |
| M7        |        4–6 weeks | Tier 2 and presumptive Income Tax routes.                   |
| M8        | Separate program | Real authentication, APIs, security, audit, and operations. |

### Required references

| File and section                                                                             | Why it is required                            |
| -------------------------------------------------------------------------------------------- | --------------------------------------------- |
| [Product definition — Scope model](./01-product-definition.md#scope-model)                   | Defines Submission, Core, and Expansion.      |
| [Delivery plan — Phase 1](./09-delivery-plan-and-acceptance.md#phase-1-submission-critical)  | Defines submission deliverables.              |
| [Delivery plan — Phase 2](./09-delivery-plan-and-acceptance.md#phase-2-product-core)         | Defines product-core capabilities.            |
| [Delivery plan — Phase 3](./09-delivery-plan-and-acceptance.md#phase-3-expansion)            | Defines advanced scope.                       |
| [Screen inventory — Consolidation guidance](./04-screen-inventory.md#consolidation-guidance) | Prevents treating every screen ID as a route. |

## 17. Immediate submission plan: August 25–28, 2026

Because the repository remains a starter and tax accuracy cannot be compressed safely, the immediate vertical release is Identity plus PF Claim Doctor.

### August 25

- [x] Install dependencies and create application infrastructure.
- [x] Implement shell, tokens, shared components, first-slice types, seeds, service, login, and Home.

### August 26

- [x] Implement the successful Identity Health Check, correction, propagation, Action Centre, and Activity path.
- [ ] Add partial propagation and retry behavior.

### August 27

- [x] Implement PF Claim Doctor, bank confirmation, readiness, mock OTP, submission, and tracking.
- [x] Implement responsive mobile and desktop behavior and automated accessibility smoke coverage.
- [ ] Complete every submitted-path string in Hindi and Bengali and finish manual accessibility verification.

### August 28

- [x] Pass local type-check, lint, unit, production build, mobile/desktop E2E, and axe checks.
- [ ] Fix remaining M0 release-gate defects only.
- [ ] Validate hosting, incognito access, reset, credentials, links, and both personas.
- [ ] Record and submit; add no new feature scope.

### Required references

| File and section                                                                                          | Why it is required                                  |
| --------------------------------------------------------------------------------------------------------- | --------------------------------------------------- |
| [Delivery plan — Delivery strategy](./09-delivery-plan-and-acceptance.md#delivery-strategy)               | Defines the permitted alternative submission spine. |
| [Delivery plan — Phase 1](./09-delivery-plan-and-acceptance.md#phase-1-submission-critical)               | Defines submission foundation and gates.            |
| [Personas — Journey 1](./02-personas-and-user-journeys.md#journey-1-identity-correction-and-propagation)  | Identity demo sequence.                             |
| [Personas — Journey 6](./02-personas-and-user-journeys.md#journey-6-pf-withdrawal)                        | PF demo sequence.                                   |
| [Screen inventory — Shared financial identity](./04-screen-inventory.md#shared-financial-identity)        | Identity screens.                                   |
| [Screen inventory — PF withdrawal](./04-screen-inventory.md#pf-withdrawal)                                | Claim screens.                                      |
| [Delivery plan — Demo and reviewer safety](./09-delivery-plan-and-acceptance.md#demo-and-reviewer-safety) | Final-release checklist.                            |

## 18. Definition of done and release gates

A feature is released only when its supported boundary is explicit; data flows through `APIService`; both personas work without name-based branches; provenance is visible; loading, cached, empty, failure, and retry states exist; changes persist intentionally; dependent state invalidates correctly; blocking issues have one fix action; mobile, keyboard, and screen-reader behavior work; required languages are complete; reset is deterministic; and domain rules have automated coverage.

Treat a vertical citizen journey, not an individual screen, as the unit of delivery.

### Required references

| File and section                                                                                                                    | Why it is required                 |
| ----------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| [Delivery plan — Screen definition of done](./09-delivery-plan-and-acceptance.md#screen-definition-of-done)                         | Screen completion gate.            |
| [Delivery plan — Journey definition of done](./09-delivery-plan-and-acceptance.md#journey-definition-of-done)                       | Vertical-journey completion gate.  |
| [Delivery plan — Tax acceptance criteria](./09-delivery-plan-and-acceptance.md#tax-acceptance-criteria)                             | Tax-specific gate.                 |
| [Delivery plan — Identity and EPFO acceptance criteria](./09-delivery-plan-and-acceptance.md#identity-and-epfo-acceptance-criteria) | Identity and EPFO gate.            |
| [Delivery plan — Responsive acceptance](./09-delivery-plan-and-acceptance.md#responsive-acceptance)                                 | Layout gate.                       |
| [Delivery plan — Accessibility acceptance](./09-delivery-plan-and-acceptance.md#accessibility-acceptance)                           | Accessibility gate.                |
| [Delivery plan — Localization acceptance](./09-delivery-plan-and-acceptance.md#localization-acceptance)                             | Language gate.                     |
| [Delivery plan — Resilience acceptance](./09-delivery-plan-and-acceptance.md#resilience-acceptance)                                 | Recovery and persistence gate.     |
| [UX guidelines — Content checklist for every screen](./07-ux-content-accessibility.md#content-checklist-for-every-screen)           | Final screen-level content review. |
