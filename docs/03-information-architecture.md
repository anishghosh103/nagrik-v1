# Information architecture

## Organizing principle

Nagrik is organized around citizen tasks and outcomes, not departments, forms, or tax schedules. Income Tax and EPFO remain visible service domains, while identity, actions, activity, grievances, and profile operate across them.

The same conceptual hierarchy is used on desktop and mobile. Navigation changes shape at responsive breakpoints but does not rename or relocate core concepts unpredictably.

## Primary mobile navigation

Use five destinations:

1. **Home** — health, priority action, service summaries, and recent events.
2. **Income Tax** — drafts, filing, returns, refunds, and notices.
3. **EPFO** — balance, claims, transfers, KYC, and nomination.
4. **Activity** — unified status feed and tracked processes.
5. **Profile** — identity, connected records, bank accounts, settings, and help.

Action Centre and Financial Identity appear prominently on Home and inside Profile rather than occupying permanent bottom-navigation slots.

## Desktop navigation

```text
Overview
  Home
  Action Centre
  Activity

Services
  Income Tax
  EPFO

Account
  Financial Identity
  Profile
  Grievances

Support
  Help
  Language
  Reset demo
```

Navigation may show meaningful indicators such as a count of outstanding actions, a blocking identity issue, an in-progress return draft, or an active claim. It must not use a badge merely for decoration.

## Product hierarchy

```text
Nagrik
├── Entry and authentication
├── Home
│   ├── Identity health
│   ├── Priority action
│   ├── Income Tax summary
│   ├── EPFO summary
│   └── Recent activity
├── Action Centre
│   └── Action detail
├── Financial Identity
│   ├── Health check
│   ├── Mismatch correction
│   ├── Propagation status
│   └── Change history
├── Income Tax
│   ├── Guided filing
│   ├── Drafts and filed returns
│   ├── Refund tracking
│   ├── Notices and remedies
│   └── Tax grievances
├── EPFO
│   ├── Withdrawal claim
│   ├── Transfer
│   ├── Passbook and balance
│   ├── Nomination
│   └── EPFO grievances
├── Activity
│   ├── Unified timeline
│   └── Event detail
└── Profile and support
    ├── Personal and contact data
    ├── Bank accounts
    ├── Connected services
    ├── Language and accessibility
    ├── Privacy and session
    └── Help and reset
```

## Home hierarchy

Home answers three questions in order:

1. Is anything blocking me?
2. What should I do next?
3. What recently changed?

The priority action occupies the strongest position. Identity health follows because it can affect multiple services. Income Tax and EPFO summaries have equal domain status but are ordered by urgency. Recent activity closes the page.

## Income Tax hierarchy

```text
Income Tax Home
├── Continue current return
├── Start or choose assessment year
├── Data sources
├── Return history
│   └── Filed return detail
├── Refund tracker
├── Notices
│   └── Notice remedy
└── Grievances
```

The guided filing journey is section-based:

```text
About you
→ Income
→ Deductions
→ Tax already paid
→ Regime and bank
→ Review and file
```

Conditional sections appear inside Income. Progress must name the current section and next section rather than promise a fixed total step count.

## EPFO hierarchy

```text
EPFO Home
├── What do you want to do?
├── Balance and passbook
├── Withdraw PF
├── Transfer PF
├── Nomination
├── KYC and employment records
├── Service history
└── Grievances
```

Task-first labels remain primary. Official claim types, forms, and codes may appear under Details when needed for transparency.

## Activity and grievances

Activity is a read-oriented cross-service timeline. Action Centre is a work-oriented priority list. Grievances are durable cases with their own history. These views may link to one another but must not be conflated:

- An event says what happened.
- An action says what the user must do.
- A grievance says what issue was formally submitted and its resolution state.

## Route versus overlay rules

Use a route or full-screen journey step when the user must make a consequential decision, enter several related fields, review a complete calculation, or return to the view later by link.

Use a drawer or mobile sheet for:

- “Where did this come from?”
- “Why are we asking this?”
- Technical identifiers and secondary details.
- Short value editing.
- Language or persona selection.
- Non-destructive confirmation.

Use a dialog for destructive confirmation, session expiry, or a small blocking decision. Required information and primary actions must never exist only in the optional desktop context rail.

## Deep links and back navigation

- Every Action Centre item links directly to the affected screen and issue.
- “Fix this” opens the exact upstream section, not a generic dashboard.
- A notice refile remedy restores the original draft snapshot and affected section.
- Returning from a correction reruns dependent validation.
- Browser back and in-product back must not discard saved work.
- Changing an earlier answer may mark downstream sections `NEEDS_REVIEW` or change the route, but it should preserve compatible information.
- Persona changes return to the new persona's service entry and never reuse another persona's data.

## Navigation states

Navigation items may display:

- Needs attention
- Draft
- In progress
- Pending verification
- Completed

Labels, icons, and counts accompany colour. Status styling must remain consistent with the visual and accessibility guides.

## Recommended URL families

These route families are implementation guidance rather than a requirement for one route per screen ID.

```text
/
/login
/home
/actions/:actionId
/identity
/identity/issues/:issueId
/tax
/tax/:assessmentYear/file/:section
/tax/:assessmentYear/returns/:acknowledgment
/tax/notices/:noticeId
/epfo
/epfo/claims/:claimId
/epfo/transfer/:transferId
/epfo/passbook
/epfo/nomination
/activity
/grievances/:grievanceId
/profile
/help/:articleId
```
