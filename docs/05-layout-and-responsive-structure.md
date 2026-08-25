# Layout and responsive structure

## Layout intent

Nagrik should feel like a calm civic-service workspace rather than an analytics dashboard. Pages prioritize the citizen's current task, preserve readable line lengths, and disclose technical context without placing it in the main decision path.

## Desktop application shell

```text
┌────────────────────────────────────────────────────────────────────────┐
│ Nagrik · Prototype        AY 2026–27       English   Rajesh ▼    Help │
├────────────────┬────────────────────────────────────┬──────────────────┤
│ Primary nav    │ Breadcrumb / Back                  │ Context panel    │
│                │ Service label                      │                  │
│ Home           │ Page title                         │ Source           │
│ Action Centre  │ One-sentence explanation           │ Why we ask       │
│ Income Tax     │                                    │ Current result   │
│ EPFO           │ Main task content                  │ Documents        │
│ Activity       │                                    │ Help             │
│                │                                    │                  │
│ Profile        │                                    │                  │
│ Language       │                                    │                  │
│ Reset demo     │                                    │                  │
├────────────────┴────────────────────────────────────┴──────────────────┤
│ Last synced / cached status                                   Privacy │
└────────────────────────────────────────────────────────────────────────┘
```

Recommended geometry:

- Maximum shell width: `1440px`.
- Primary navigation: `232–248px`.
- Main guided content: `640–760px`.
- Optional context rail: `280–320px`.
- Shell gutters: `24px` at standard desktop and `32px` at wide desktop.
- Main reading text: approximately 65–75 characters per line.

When the context rail is absent, keep the task column centered rather than stretching it. Review and calculation pages may use a wider `880–1040px` central region.

## Mobile application shell

```text
┌──────────────────────────────┐
│ ←  Nagrik       Rajesh  EN ▼ │
├──────────────────────────────┤
│ Income Tax · Income          │
│ Review your salary           │
│ We found this in Form 16.    │
│                              │
│ Main task content            │
│                              │
│ Why are we asking this?      │
├──────────────────────────────┤
│ Back               Continue │
├──────────────────────────────┤
│ Home   Tax   EPFO   Activity │
└──────────────────────────────┘
```

- Use a compact global header and five-item bottom navigation.
- Render required actions in a sticky action footer above bottom navigation.
- Open contextual help and provenance as bottom sheets.
- Convert comparison tables into field-first stacked cards.
- Apply safe-area insets to both navigation and action regions.
- Keep touch targets at least `44 × 44px`.

## Breakpoints

| Range | Structure |
|---|---|
| Below `600px` | Mobile header, stacked content, sticky actions, bottom navigation, full-screen sheets. |
| `600–899px` | Tablet header, centered content, optional compact journey rail, sheets for context. |
| `900–1199px` | Desktop sidebar and main content; context remains a drawer. |
| `1200px` and above | Sidebar, main content, and contextual right rail. |

Design and test first at approximately `390px`, then at `768px`, `1024px`, and `1440px`.

## Global header

The global header contains only persistent context:

- Nagrik wordmark.
- Visible Prototype label.
- Current assessment year inside tax journeys.
- Language selector.
- Active persona.
- Help.
- Offline or sync state.

Page actions do not belong in the global header. Persona switching requires confirmation when a draft or submission is active.

## Standard page anatomy

Every task page follows this order:

1. Back link or breadcrumb.
2. Service and journey-section label.
3. Plain-language page title.
4. One-sentence purpose or instruction.
5. Status, warning, or source when relevant.
6. Main content.
7. Optional contextual explanation.
8. Sticky actions.

```text
Income Tax / Income

Review your salary
Your employer reported the following information. Check it before continuing.

[Needs review]                                      Source: Form 16

Employer and calculation content

Autosaved                           Save and exit       Looks right
```

Titles describe the citizen's task, such as “Review your salary,” not a portal construct such as “Schedule S.”

## Page template 1: dashboard

Used by Unified Home, Income Tax Home, EPFO Home, and Action Centre.

```text
Greeting and current condition
Primary action requiring attention
Identity health
Service summary cards
Recent activity
Secondary tasks
```

The dashboard is not an equal grid of widgets. The most consequential action receives the strongest position. Charts are used only if they answer a real citizen question.

Example for Rajesh:

```text
Good morning, Rajesh
You have two items that need attention.

┌──────────────────────────────────────────────────────┐
│ Fix your bank-name mismatch                         │
│ This may delay both your PF claim and tax refund.   │
│                                      Review and fix │
└──────────────────────────────────────────────────────┘

Identity health: 3 consistent · 2 need attention

Income Tax                         EPFO
Return draft: 65%                  Claim blocked
Refund delayed                     Balance ₹4,82,300

Recent activity
```

## Page template 2: guided journey

Used for filing, PF withdrawal, transfer, nomination, and grievances.

```text
Journey rail        Main task                 Context rail

About you  ✓        Page heading              Where it came from
Income     ●        Question or form          Why we ask
Deductions ○        Validation                Current effect
Tax paid   ○        Section summary           Help
Review     ○        Sticky actions
```

Progress names meaningful sections. Do not use a fixed “step X of Y” when conditional screens can change the total. On mobile show the current section, current task, and next section in a compact progress header.

## Page template 3: review and correct

Used for identity mismatches, salary import, AIS entries, TDS, and service-date overlaps.

Required sequence:

1. What a source reported.
2. What Nagrik currently understands.
3. Why they differ or require review.
4. The consequence of leaving the issue unresolved.
5. A single resolution action.

Source labels remain adjacent to values. Imported and user-entered values must not look identical without provenance.

## Page template 4: calculation

Used for regime comparison, property income, capital gain, PF balance, and final tax summary.

```text
Salary                                      ₹9,40,000
House-property loss                          −₹80,000
Interest                                      ₹24,200
─────────────────────────────────────────────────────
Gross total income                           ₹8,84,200
```

- Right-align monetary values.
- Use tabular numerals and Indian grouping.
- Use a true minus sign for negative amounts.
- Let rows expand to calculation details.
- Separate normal-rate and special-rate tax.
- Do not use charts as a substitute for exact values.

## Page template 5: status and timeline

Used for activity, filings, refunds, PF claims, corrections, and grievances.

```text
Current status
Plain-language meaning
Expected next event or deadline
One action, if required

Event timeline
Related record
```

Timeline events use icon, label, date, and explanation. Colour alone never communicates status.

## Page template 6: final review

Used before filing, claims, transfers, nominations, and grievances.

```text
Ready
✓ Income reviewed
✓ Tax credits matched
✓ Bank account validated

Needs attention
! AIS share sale has not been reviewed             Fix this →
! NPS claim is missing PRAN                        Fix this →
```

Every blocking item links to the exact corrective location. Readiness summaries remain scannable and do not reproduce the entire form.

## Page template 7: completion

Completion pages contain:

- Success, pending, or partial-success state.
- Outcome amount when relevant.
- Reference or acknowledgment number.
- Filing and verification status separately.
- Expected next event and timeline.
- Primary tracking action.
- Secondary view or download action.

Use restrained acknowledgement rather than celebratory confetti for financial operations.

## Identity comparison layout

Desktop may use a source matrix:

```text
Field          Aadhaar         PAN          Bank          EPFO
Name           Rajesh Kumar    Rajesh K     Rajesh...     Rajesh K.
Mobile         ••••4210        ••••4210     —             ••••9073
Bank account   —               ••••4821     ••••4821      ••••9032
```

Mobile groups by field:

```text
Name                                           Needs attention

Aadhaar        Rajesh Kumar
PAN            Rajesh K
Bank           Rajesh Kumar Sharma
EPFO           Rajesh K.

May block PF claims and bank validation.
Review and fix →
```

## Forms and progressive disclosure

- Use one conceptual question per page for unfamiliar eligibility decisions.
- Group three to six familiar, related fields on one page.
- Use list-and-editor patterns for employers, properties, assets, accounts, and nominees.
- Hide TAN, PRAN, ISIN, lender PAN, challan, and acknowledgment identifiers until relevant.
- Provide “I'm not sure” and a guided helper for difficult classifications.
- Show a compact section summary after complex entry.
- Autosave after meaningful changes and display a quiet confirmation.

## Context rail and sheets

The desktop context rail may show source provenance, why a question matters, regime effect, document guidance, current calculation, or help. It must never contain the only required action or blocking information.

At smaller breakpoints, context becomes a bottom sheet. Sheets have a clear heading, close control, logical focus management, and a full-screen form on small mobile devices when input is required.

## Sticky action footer

Desktop example:

```text
Autosaved 10 seconds ago            Save and exit        Continue
```

Mobile example:

```text
Back                                            Continue
```

- Show one visually dominant primary action.
- Explain why a disabled action cannot continue.
- Keep irreversible submission distinct from ordinary continuation.
- Account for bottom navigation and safe-area height.

## Loading and error placement

Skeletons should preserve final layout geometry. Cached content remains in place during refresh. Inline source failures appear next to the affected region; full-page errors are reserved for failures that make the entire task unavailable. Retry must not duplicate filing, payment, claim, or grievance submissions.
