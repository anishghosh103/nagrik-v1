# UX, content, and accessibility guidelines

## Core interaction rule

The citizen provides facts; Nagrik interprets system and tax rules. The experience should feel like:

> Tell us what happened this year. We'll work out the applicable rules.

It should not feel like:

> Select a return form, schedule, section, or grievance taxonomy.

## Plain-language content

- Lead with the outcome or task.
- Use one idea per sentence and familiar verbs.
- Introduce technical names only after the plain-language explanation.
- Put form numbers, sections, TAN, PRAN, ISIN, challan IDs, and rule codes under Details unless required for input.
- Explain why information is needed before asking for unusual metadata.
- Refer to the citizen as “you” and the product as “Nagrik” or “we” where responsibility is clear.
- Do not claim approval, verification, filing, payment, propagation, or delivery that the prototype did not simulate explicitly.

Examples:

| Avoid                           | Prefer                                                                      |
| ------------------------------- | --------------------------------------------------------------------------- |
| Select ITR-1 or ITR-2           | We'll choose the right return from your answers.                            |
| Validation failed: TDS schedule | Your employer TDS is present, but the related salary is missing.            |
| AIS mismatch                    | Your tax records show an amount that has not been reviewed.                 |
| Disposed                        | The office closed this grievance without changing your contribution record. |
| Submit                          | File and verify / Send grievance / Submit claim.                            |

## Progressive disclosure

The default page contains only information required for the current decision. Reveal technical or exceptional fields when triggered by the user's answers.

Examples include:

- TAN after the user opens employer details.
- PRAN after selecting NPS.
- Lender metadata after declaring home-loan interest.
- Donee and payment metadata after selecting donations.
- ISIN and grandfathering data only for applicable securities.
- Challan identifiers only when reviewing or adding a tax payment.

Progressive disclosure must not hide a legal consequence, blocking warning, or required action.

## “I'm not sure” behavior

Offer “I'm not sure” for concepts a normal citizen may not confidently classify, including residency, equity orientation, family pension, presumptive profession eligibility, and unfamiliar income.

Selecting it opens a short guided determination. If the product still cannot decide confidently, preserve the answer and route to an advanced or unsupported path. Never force a guess to continue.

## Data provenance

Every imported value stores and displays:

- Source name.
- Source identifier or record reference where safe.
- Snapshot or freshness date.
- Original amount and category.
- User-review state.
- Included, reclassified, disputed, or excluded-by-rule state.

“Where did this come from?” opens a contextual explanation. Imported data is evidence rather than unquestionable truth.

## Corrections and clamping

Never silently modify, cap, remove, or recategorize a user's value.

When a statutory cap applies, preserve both values:

> You entered ₹1,80,000. The maximum amount available here is ₹1,50,000, so ₹1,50,000 will be applied.

Use `enteredAmount`, `allowedAmount`, and where necessary `appliedAmount`. A regime-specific restriction must be described as regime-specific rather than globally invalid.

## Validation model

Validation has four severities:

- **INFO:** explains automatic treatment and does not require acknowledgement.
- **WARNING:** identifies a discrepancy; the user can continue after review or acknowledgement.
- **BLOCKING:** prevents submission until corrected.
- **ROUTE_CHANGE:** updates the filing or service path while preserving compatible data.

Every issue includes:

- Plain-language title.
- What was detected.
- Why it matters.
- Source or technical code under Details.
- Exactly one primary correction action.

Page-level validation provides an error summary at the top and inline messages at affected fields. Focus moves to the error summary after failed submission and returns to the relevant control when the user chooses “Fix this.”

## Completion and stale state

Each journey section tracks:

```ts
type SectionStatus = 'NOT_STARTED' | 'NEEDS_REVIEW' | 'COMPLETE' | 'BLOCKED';
```

- A source import begins as `NEEDS_REVIEW`.
- A section becomes `COMPLETE` only after required review and validation.
- An upstream change marks affected downstream sections `NEEDS_REVIEW`.
- A blocking issue marks the relevant section `BLOCKED`.
- Completion timestamps support audit and autosave feedback.

Do not force a complete restart unless the persona or taxpayer identity changes.

## Drafts and autosave

- Autosave after every meaningful step or debounced field group.
- Show a quiet “Saved” timestamp, not repeated toast notifications.
- Persist the assessment year, rules version, identity/persona ID, source snapshots, route, answers, computation, and section states.
- On return, state precisely where the draft resumes.
- If rules change, recompute and highlight affected sections rather than silently updating the final number.
- Never carry drafts between personas.

## Loading, offline, and failure

Every asynchronous operation defines:

1. Initial loading.
2. Cached or stale display where available.
3. Success.
4. Recoverable failure.
5. Empty result.
6. Offline or queued action when supported.

Skeletons approximate final content geometry. Cached data includes “last updated” information. Failure copy explains which information may be stale and what remains safe to do.

Submission endpoints require idempotent behavior in production. The prototype must at least prevent duplicate clicks and distinguish “still processing” from “failed.”

## Status and deadlines

- State current meaning before historical events.
- Show deadlines as both date and time remaining where legally appropriate.
- Use careful estimates: “expected in about 9 days” rather than a guarantee.
- Separate filed, verified, processed, refund issued, and refund credited.
- Separate claim received, validating, employer action, EPFO processing, approved, paid, and rejected.
- A notice or grievance resolves only when its corrective or administrative outcome occurs, not when the user dismisses it.

## Localization

Initial languages are English, Hindi, and Bengali.

- All static copy uses translation keys.
- Dynamic messages are composed from translated templates rather than English string concatenation.
- Format money with Indian grouping and appropriate locale behavior.
- Keep PAN, UAN, section numbers, and official identifiers readable while translating their explanation.
- Allow layouts to grow vertically and controls to accommodate longer labels.
- Do not embed text inside raster images.
- The submitted journey must be translated end to end; untranslated expansion areas should be hidden or clearly unavailable.

## Accessibility baseline

Target WCAG 2.2 AA behavior for supported journeys.

### Structure and navigation

- Use landmarks, one primary page heading, and logical heading order.
- Provide a skip link on desktop.
- Preserve focus when routes, sheets, or validation states change.
- Support keyboard access for every control, table action, drawer, and dialog.
- Use visible high-contrast focus indicators.

### Forms

- Associate every input with a persistent label and any help or error text.
- Group related radio buttons and checkboxes with fieldsets and legends.
- Announce Indian currency values coherently.
- Describe format requirements before entry.
- Do not disable Continue without adjacent explanation.
- Avoid time limits; OTP expiry must be announced and resend available.

### Visual communication

- Do not communicate state only through colour, position, animation, or shape.
- Keep body text at least `16px` on mobile and supporting text at least `14px`.
- Maintain text and non-text contrast.
- Support browser zoom and text reflow without horizontal page scrolling.
- Use reduced motion when requested.

### Tables and comparisons

- Give tables captions and scoped headers.
- Expose row labels with monetary values to screen readers.
- On mobile, preserve the semantic relationship when transforming a table into cards.
- Provide a textual recommendation and savings amount for regime comparison.

### Masked sensitive values

Visual masking such as `••••4821` needs an accessible label such as “HDFC Bank account ending in 4821.” Never expose complete fictional identifiers unnecessarily.

## Prototype honesty and safety

- Display a persistent Prototype label.
- State that authentication, filing, verification, propagation, payment, and integrations are simulated.
- Never use real PAN, Aadhaar, bank, OTP, payment, UAN, or notice data.
- Do not use official logos or language suggesting endorsement.
- Use plausible-shaped fictional data without matching real-format examples that could belong to a person.
- Make Reset demo data available and explain the scope before executing it.

## Content checklist for every screen

- Does the title describe the citizen's task?
- Is the next action clear?
- Is the source of imported information visible?
- Is the consequence of a warning explained?
- Is technical terminology secondary?
- Is simulation disclosed where relevant?
- Are loading, empty, failure, and recovery states defined?
- Does the content remain understandable without colour or iconography?
- Can the user continue without guessing an unfamiliar classification?
