# Delivery plan and acceptance

## Delivery strategy

Nagrik has a broad product vision and a deep tax specification. Delivery must optimize for one accurate, demonstrable citizen outcome rather than visible but incomplete breadth.

The recommended submission spine is:

```text
Mock login as Rajesh
→ Identity Health Check
→ fix one cross-system mismatch
→ observe Income Tax and EPFO propagation
→ complete a supported salaried ITR journey
→ file and mock e-verify
→ view the result in Unified Activity
```

If the tax engine cannot meet the required accuracy in the available timeframe, the alternative submission spine is Identity plus PF withdrawal pre-validation. The application must never present a partially accurate filing outcome.

## Phase 1: submission-critical

### Product shell

- Mobile and desktop application shell.
- Prototype disclosure, mock persona selection, login, and OTP.
- Unified Home, Action Centre, Activity, Profile, language, and reset.
- Loading, error, offline, draft recovery, and cached-data states.

### Identity proof point

- Identity Health Check for both personas.
- At least one material Rajesh mismatch with downstream consequences.
- Canonical-value selection and propagation review.
- Asynchronous per-system result.
- Immediate dependent-state update without reload.
- Change event in Unified Activity.

### Supported filing path

- Resident individual and original return for AY 2026–27.
- One employer salary.
- Savings and deposit interest.
- Common 80C and 80D claims required by seeded scenario.
- Employer TDS and corresponding income reconciliation.
- Old and new regime comparison using verified versioned rules.
- Validated refund bank selection.
- Exact final calculation and human-readable validation.
- Mock filing and Aadhaar OTP verification with separate statuses.
- Acknowledgment and activity event.

### Explicit gates

- Any unimplemented income source, deduction, route, surcharge condition, special-rate situation, loss treatment, or filing type stops before calculation or filing.
- No detected AIS or tax-credit mismatch can remain unreviewed at filing.
- Reset returns both personas to deterministic seed state.

## Phase 2: product-core

- Complete Tier 1 salary and pension, common other-source income, supported properties, limited eligible 112A cases, tax credits, deductions, and bank handling.
- Post-filing return, refund, 139(9), and 143(1) support.
- PF withdrawal rule engine and claim tracking.
- Cached passbook and monthly contributions.
- Unified grievances and meaningful case statuses.
- Identity change history, connected-record detail, and audit receipt.
- Complete English, Hindi, and Bengali coverage for all Core journeys.

## Phase 3: expansion

- Broader ITR-2-like capital gains, properties, director, and unlisted-share cases.
- Eligible presumptive business and profession under implemented sections.
- Regime history and Form 10-IEA handling.
- Advanced losses, surcharge, marginal relief, and special-rate scenarios only when complete.
- PF transfer and service-overlap correction.
- Nomination.
- Advanced notice remedies, including carefully gated ITR-U.
- Search, notification preferences, and grievance escalation.

## Dependency order

1. Define shared types, design tokens, persistence namespaces, and fictional persona seeds.
2. Build the responsive application shell and shared page templates.
3. Implement APIService, reset, latency/failure simulation, and global state.
4. Implement shared identity comparison and propagation.
5. Implement Activity and Action Centre event derivation.
6. Add AY-versioned filing-route, tax, and validation rules for the exact supported scenario.
7. Build the guided filing sections and computation summaries.
8. Add mock filing, verification, confirmation, and recovery.
9. Complete localization, accessibility, resilience, and demo polish.
10. Add Core and Expansion flows only after the supported path passes every gate.

## Screen definition of done

A screen-level experience is complete when:

- It uses the correct shared page template and responsive structure.
- Default, loading, populated, empty, warning, blocking, failure, and recovery states are defined where relevant.
- Imported information displays provenance.
- Copy is plain-language and translation-key driven.
- Keyboard navigation, focus order, accessible names, errors, and announcements work.
- No required action exists only in a desktop context rail.
- It preserves or autosaves meaningful input.
- Analytics or audit events, if required, use fictional identifiers and avoid sensitive payloads.

## Journey definition of done

A journey is complete when:

- Entry eligibility and unsupported boundaries are explicit.
- Upstream changes recompute and invalidate dependent state correctly.
- The user never needs to guess technical terminology to proceed.
- Back, save and exit, resume, persona switch, offline, and reset behavior are tested.
- Every blocking issue navigates to one correction action.
- Submission prevents duplication and distinguishes pending, failed, and complete states.
- Confirmation feeds the appropriate service and Unified Activity views.

## Tax acceptance criteria

1. The user never manually chooses an ITR form.
2. Filing route changes automatically and preserves compatible data.
3. Unsupported income or complexity is never ignored.
4. Imported salary, AIS, Form 26AS, and payment values show their source.
5. TDS, TCS, advance tax, and self-assessment tax are tax credits, not deductions.
6. Income heads, loss set-off, deductions, normal-rate tax, special-rate tax, rebate, surcharge, marginal relief, cess, interest, credits, and balance follow the statutory order.
7. Old and new regimes are computed independently from the same claims.
8. Regime-specific exclusions are explained rather than globally invalidated.
9. Entered, allowed, and applied deduction amounts are preserved.
10. 87A and special-rate treatment are applied only when legally supported.
11. Surcharge and marginal relief are fully implemented for a route or that route is blocked.
12. The calculation uses an AY-specific verified rules version.
13. Tax credits reconcile with corresponding income where required.
14. Outstanding self-assessment tax blocks filing when applicable.
15. Every detected or selected income section is reviewed before filing.
16. Bank validation and refund-account selection are separate from tax calculation.
17. Final review explains every material amount.
18. Filing and e-verification statuses remain separate.
19. A filed snapshot freezes inputs, computation, and rules version.
20. Notice remedies reopen the correct upstream state and resolve only after action completion.

## Identity and EPFO acceptance criteria

- Identity values are compared by field and source.
- A correction shows its destinations before propagation.
- Partial propagation and retry are representable.
- Dependent tax, bank, refund, KYC, and claim states revalidate.
- Claim rules are named, independent, and return human-readable codes.
- Claim readiness is a transparent checklist and never an approval guarantee.
- Bank, identity, service dates, and eligibility are checked before submission.
- Passbook refresh never replaces cached data with a blank page.
- Claims, transfers, corrections, and grievances appear in Activity immediately.

## Responsive acceptance

Test at minimum:

- `390px`: no horizontal page scroll; bottom navigation and sticky actions do not overlap.
- `768px`: sheets, navigation, and content width remain usable.
- `1024px`: sidebar plus main content works without cramped calculations.
- `1440px`: context rail appears without making text lines excessive.

Tables must transform into meaningful cards on mobile. Financial rows maintain label-value association. Dialogs, sheets, and menus remain within viewport and preserve focus.

## Accessibility acceptance

- Supported journeys meet WCAG 2.2 AA expectations.
- Full keyboard completion is possible.
- Route and sheet transitions place focus predictably.
- Error summaries and inline errors are programmatically associated.
- Status is never colour-only.
- Masked identifiers have meaningful accessible names.
- Currency values and calculation relationships are announced coherently.
- Content reflows at zoom and increased text size.
- Motion follows `prefers-reduced-motion`.

## Localization acceptance

- The selected submission journey is complete in English, Hindi, and Bengali.
- Static strings are not embedded directly in components.
- Dynamic messages use translated templates.
- Amounts and dates use consistent Indian formatting.
- Longer translations do not clip navigation, buttons, validation, or tables.
- Technical identifiers remain readable with translated explanations.

## Resilience acceptance

- Artificial API latency exercises skeletons and pending states.
- Reload restores persona, draft, and compatible journey position.
- Offline mode preserves cached content and identifies unavailable actions.
- Queueable changes expose their retry state.
- Non-queueable submissions explain why they need connectivity.
- Duplicate filing, verification, claim, payment, and grievance actions are prevented.
- Schema or rules-version changes have an explicit migration, recalculation, or reset path.

## Demo and reviewer safety

- Prototype status remains visible.
- Demo credentials are available near login and in the project README before deployment.
- No real personal information exists in code, UI, documentation examples, or video.
- Both personas can be reset at any time.
- The hosted build opens without access requests or downloads.
- The main journey works from a clean incognito session.
- Expansion features are hidden or honestly labelled; they must not appear functional when they are not.

## Verification activities

- Unit-test tax, filing-route, validation, and EPFO rule engines with boundary cases.
- Unit-test old/new regime independence and credit ordering.
- Test localStorage persona isolation, reset, schema version, and draft restoration.
- Test identity propagation invalidation across both services.
- Component-test source disclosure, validation navigation, calculations, and timelines.
- End-to-end test Ananya's clean path and Rajesh's mismatch path.
- Run automated accessibility checks and manual keyboard/screen-reader smoke tests.
- Review every monetary example against the computation output rather than static copy.

## Key risks and mitigations

| Risk | Mitigation |
|---|---|
| Broad scope produces incomplete journeys | Enforce phase gates and hide unfinished routes. |
| Tax arithmetic is visibly wrong | Narrow support and test versioned pure rules. |
| UI implies official integration | Persistent disclosure and fictional records. |
| Persona state contaminates another user | Namespaced persistence and switch tests. |
| Reviewers alter the prepared demo | Always-available deterministic reset. |
| Localization is only superficial | Translate the selected journey end to end. |
| Portal-style density harms mobile use | Use task templates, sheets, and field-first cards. |
| Simulated network states lose actions | Cache, explicit queue state, and duplicate prevention. |
