# Personas and user journeys

## Persona model

The prototype uses two visible demo personas. They have exactly the same data structure; only their values and record states differ. Components and rules must respond to data, never to a hard-coded persona name.

Switching personas saves or discards the current draft according to the user's choice, returns the new persona to the applicable service entry screen, and never carries tax, claim, bank, or verification data between personas.

## Ananya: consistent profile

Ananya demonstrates that Nagrik remains useful without an active crisis.

- Her identity values are materially consistent across sources.
- Her EPFO KYC and bank account are valid.
- Her passbook has recent cached contribution data.
- Her Income Tax sources represent a straightforward salary-and-interest return.
- Her primary actions are to continue filing, review a clean calculation, or check status.

Her home screen should feel calm: identity health is positive, service summaries are compact, and no artificial warning is introduced merely to make the interface look active.

## Rajesh: inconsistent profile

Rajesh is the primary problem-solving scenario.

- His name differs across Aadhaar, PAN, bank, EPFO, and Income Tax profile records.
- His EPFO mobile number is outdated.
- His EPFO bank record points to an old account.
- A PF claim is blocked or was previously rejected because of a mismatch.
- AIS includes a suspicious or misclassified mutual-fund redemption.
- His refund is delayed by bank validation or linkage.

Rajesh demonstrates the full loop: detect, explain, correct, propagate, revalidate, submit, and track.

## Journey 1: identity correction and propagation

1. Rajesh signs in with mock Aadhaar credentials.
2. Home reports that a name or bank mismatch affects both EPFO and Income Tax.
3. Identity Health Check compares the values by source.
4. Mismatch Detail explains the downstream risks.
5. Rajesh chooses the correct canonical value and reviews affected systems.
6. The prototype simulates asynchronous propagation per system.
7. The Identity Health score updates immediately.
8. The PF pre-check reruns and the refund status becomes cause-aware.
9. A change receipt records what changed, when, and where it propagated.

Success means the correction is reflected through shared state rather than separate hard-coded success screens.

## Journey 2: ordinary salaried return

The recommended submission path is a resident individual with one employer, savings or deposit interest, common deductions, employer TDS, and no unsupported complexity.

```text
Entry
→ taxpayer and eligibility facts
→ income-source discovery
→ salary review
→ interest review
→ tax-saving payments
→ tax already paid
→ old/new regime comparison
→ bank account
→ final calculation
→ human-readable validation
→ declaration and mock e-verification
→ confirmation and tracking
```

At no point must the user choose an ITR form or understand Schedule S, Schedule OS, Schedule VI-A, Part B-TTI, or section 115BAC.

## Journey 3: AIS mismatch resolution

1. An imported AIS item appears with source and reported amount.
2. Nagrik explains that a gross asset sale is not necessarily taxable income.
3. The user reviews the transaction as a capital gain, keeps it as other income, or marks it disputed.
4. Reclassification opens the relevant section with compatible information prefilled.
5. A disputed item remains visible in review and status; it is never silently excluded.
6. The final pre-submit check blocks an unreviewed detected item.

## Journey 4: route change or unsupported case

1. A user discloses a fact such as foreign assets, unsupported business income, complex losses, or an unimplemented asset transaction.
2. The route engine evaluates the complete return facts.
3. Compatible data is preserved.
4. The UI explains why the simple path cannot calculate the case with certainty.
5. The user is routed to an implemented advanced path or stopped with a clear handoff message.

The system must not hide the answer, ignore the income, or continue with an approximate result.

## Journey 5: freelancer or small business

1. The user identifies the activity in normal language.
2. Nagrik determines whether it is an eligible profession, business, commission activity, or goods-carriage case.
3. The user enters actual total, cash, and non-cash receipts.
4. The rules engine checks AY-specific 44AD, 44ADA, or implemented 44AE eligibility.
5. Regime history and Form 10-IEA restrictions are applied.
6. Eligible users see a presumptive calculation; ineligible users keep their data and move to the advanced route.

## Journey 6: PF withdrawal

1. The user chooses “Withdraw PF” from a task-first EPFO entry screen.
2. Eligibility, identity, KYC, bank, and service-history rules run before claim entry is enabled.
3. Each failed rule has a plain-language reason and one correction action.
4. Identity corrections reuse the shared propagation flow.
5. The pre-check reruns and shows transparent readiness, not a black-box promise.
6. The user reviews claim details, confirms the bank account, declares, and uses mock OTP.
7. Confirmation provides a reference and expected timeline.
8. Unified Activity tracks the claim.

## Journey 7: PF transfer

1. The user selects old and current employment records.
2. Nagrik detects missing exit dates or overlapping service dates.
3. Identity and KYC checks run alongside service-history validation.
4. Correctable problems link directly to their source.
5. The user reviews source, destination, and transferable balance before mock verification.
6. Status explains employer and EPFO processing stages.

## Journey 8: passbook resilience

1. EPFO Home immediately shows the last known cached balance and its timestamp.
2. The user views employer and monthly contribution history.
3. A background refresh updates data quietly when successful.
4. On timeout, the cached passbook remains visible with a retry action.
5. A missing contribution can be escalated into a pre-categorized grievance.

## Journey 9: nomination

1. The user reviews current nomination status.
2. Nominee details are entered progressively.
3. Shares are allocated and must total exactly 100%.
4. Review precedes mock e-verification.
5. Confirmation states whether nomination is effective or still pending.

## Journey 10: post-filing refund or notice

For a refund, the tracker shows amount, selected bank account, current cause-aware status, and expected next event.

For a 139(9) or 143(1) notice:

1. The notice is simulated as imported or uploaded.
2. The system parses section, issue date, deadline, and discrepancies.
3. Filed and department values appear as a line-by-line comparison.
4. The system selects one supported remedy: refile, pay, or rectify.
5. “Fix and refile” reopens the exact upstream section with saved data.
6. ITR-U is never the default and shows additional-tax consequences before selection.
7. A notice resolves only when the corrective action completes.

## Journey 11: unified grievance

1. The user describes the problem in normal language.
2. Nagrik recommends the relevant service and category.
3. Supporting evidence is added only when relevant.
4. Review shows the category, description, evidence, and expected process.
5. The submitted grievance appears in Unified Activity.
6. Technical statuses such as “disposed” are translated into the actual outcome and escalation option.

## Shared recovery journeys

- **Draft recovery:** restore an autosaved journey after interruption.
- **Rules update:** recompute and mark affected sections for review when the AY rules version changes.
- **Offline action:** queue a safe action, show it as pending, and retry without duplicating submission.
- **Persona reset:** restore seed data after a clear confirmation.
- **Verification pending:** distinguish a filed return or submitted request from completed verification.
