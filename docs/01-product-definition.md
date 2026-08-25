# Product definition

## Product summary

Nagrik is a citizen-facing financial-services assistant that offers one shared identity, one action centre, and one status feed across simulated Income Tax e-Filing and EPFO services.

The central product insight is that many apparently separate failures begin with the same problem: a citizen's name, PAN, Aadhaar-linked contact details, bank account, or employment information is recorded differently across systems. Nagrik detects those inconsistencies before they cause a rejected claim, delayed refund, filing error, or confusing notice. The citizen corrects a value once, reviews where it will be propagated, and sees the effect across dependent journeys.

The interface then removes institutional terminology from routine tasks. Instead of asking a taxpayer to select an ITR form or schedule, Nagrik asks what happened during the year and derives the correct supported route. Instead of allowing an EPFO claim and reporting a vague rejection later, it runs named eligibility and identity checks before submission.

## Problem statement

Indian citizens often encounter multiple versions of their financial identity across Aadhaar, PAN, banks, EPFO, employers, and Income Tax records. Existing portals treat authentication, KYC correction, filing, claims, notices, and status communication as separate processes. Citizens discover inconsistencies late, receive technical or ambiguous messages, and frequently seek professional help for otherwise ordinary tasks.

The effects include:

- PF withdrawal or transfer rejection caused by name, bank, KYC, or service-history mismatches.
- Refund delay caused by an invalid, unvalidated, or differently named bank account.
- Incorrect interpretation of AIS entries, especially asset sales presented as gross receipts or other income.
- Filing errors caused by choosing the wrong return form or misunderstanding tax schedules.
- Fragmented status tracking across services and grievance systems.
- Blank screens or lost context when a portal or network is unavailable.

## Core hypothesis

If identity consistency is checked once and task-oriented guided flows are layered above existing services, many preventable failures can be identified before submission. A shared identity and status layer can demonstrate this improvement without pretending to replace government backends.

## Product pillars

### 1. Shared financial identity

- Compare identity and bank information across simulated sources.
- Explain each mismatch and its downstream consequences.
- Allow a canonical correction to be reviewed and propagated.
- Keep an auditable change receipt and propagation status.
- Immediately invalidate or refresh dependent journey state.

### 2. Guided Income Tax filing

- Ask plain-language questions rather than requiring ITR-form selection.
- Import simulated Form 16, AIS, Form 26AS, and payment information with provenance.
- Route only supported cases to a complete and accurate computation.
- Compare legally available old and new regime outcomes.
- Explain every rupee in the final liability, credit, refund, or amount payable.
- Track filing and e-verification separately.

### 3. Preventive EPFO assistance

- Present tasks such as withdrawal or transfer before portal terminology.
- Run identity, KYC, bank, eligibility, and service-history checks before submission.
- Provide one correction action for each blocking problem.
- Show cached passbook information rather than a blank failure.
- Track claims, transfers, nominations, and grievances in plain language.

### 4. Unified action and status layer

- Prioritize work across Income Tax, EPFO, identity, and grievances.
- Translate technical statuses into current meaning and next action.
- Show deadlines and expected next events.
- Preserve the last known state through temporary failures.

## Target users

Nagrik is designed for ordinary Indian citizens who can provide facts about their financial year but are not expected to understand tax schedules, filing-form eligibility, EPFO rejection rules, or grievance taxonomies. The primary journey targets a resident individual with common salary and financial income. The experience must remain usable on a mobile device, with intermittent connectivity, and in English, Hindi, or Bengali.

## Goals

### Prototype goals

- Deliver one polished, credible journey that can be demonstrated end to end.
- Make the identity correction visibly affect more than one simulated service.
- Demonstrate real rules, validation, state, and resilience thinking rather than static screens.
- Disclose every mock interaction and avoid real personal information.
- Make the primary path comprehensible without a CA or portal expert.

### Longer-term product goals

- Reduce preventable EPFO claim rejection.
- Reduce professional dependence for ordinary supported tax returns.
- Provide one source of pending actions and statuses.
- Establish an API-level integration model that can sit above existing systems.
- Preserve provenance and auditability for cross-system corrections.

## Non-goals

- Real Aadhaar, PAN, bank, Income Tax, EPFO, payment, or OTP integration.
- A production authentication or authorization system.
- Support for every ITR form, tax situation, EPFO service, or grievance route.
- Approximate tax computation for an unsupported case.
- Rebuilding government systems or presenting Nagrik as government-endorsed.
- Storing real personal or financial information in seed data, screenshots, recordings, or code.

## Product principles

1. **Ask for facts, not forms.** Internal routes and sections are system concepts.
2. **Accuracy before breadth.** A partially implemented route must never reach filing.
3. **Imported data is evidence.** It can be accepted, corrected, reclassified, or disputed, but never silently removed.
4. **Explain the source and the consequence.** Every value and warning should answer where it came from and why it matters.
5. **Prevent failure early.** Validate before submission whenever possible.
6. **Keep one next action.** Citizens should not have to interpret technical remedies.
7. **Never lose context.** Autosave, preserve cached state, and retain compatible information after route changes.
8. **Be explicit about simulation.** The prototype should look credible without claiming real verification or integration.

## Scope model

The complete product vision includes the identity foundation, guided filing, post-filing tax support, PF withdrawal, PF transfer, passbook, nomination, and unified grievances. Delivery must be tiered.

- **Submission-critical:** shared shell, personas, identity correction, one complete supported filing journey, status feed, resilience, and reset.
- **Product-core:** full Tier 1 tax coverage, post-filing support, PF withdrawal, passbook, and grievance tracking.
- **Expansion:** broader ITR-2-like cases, presumptive business routes, PF transfer, nomination, and advanced notice remedies.

The broad PRD and revised tax specification create a deliberate scope tension. The product vision is broad, while accurate Tier 1 tax filing is itself substantial. The correct resolution is to narrow the supported scenario, not to dilute computation or validation. Unsupported answers must cause a clear route change or graceful stop.

## Success criteria

- A citizen fixes one identity inconsistency and sees the result across dependent services.
- A supported taxpayer completes a return without choosing a form or schedule.
- No detected income, credit, mismatch, or blocking validation is silently ignored.
- A final tax or claim result is internally consistent and explainable.
- Every asynchronous screen has loading, cached, retry, or recovery behavior.
- Status communication tells the citizen what is happening and what to do next.
- The app works at mobile width, supports keyboard and screen readers, and does not rely on colour alone.
- Reviewers can restore the intended demo state at any time.
