# Visual design system

## Direction: warm civic editorial

Nagrik combines the clarity of a service manual, the exactness of a financial ledger, and the familiarity of a passbook. It should feel trustworthy and human without mimicking a government portal or generic banking dashboard.

The memorable visual idea is **traceable information**: fine ledger rules, visible source stamps, and connected status markers make it clear where a value came from and where a correction travels.

Avoid official emblems, Ashoka Chakra imagery, department logos, a literal tricolour theme, or language implying endorsement.

## Colour tokens

Suggested light-theme foundation:

| Token | Value | Use |
|---|---:|---|
| `--color-canvas` | `#F6F2E8` | Warm rice-paper application background. |
| `--color-surface` | `#FFFCF5` | Main working surfaces. |
| `--color-surface-muted` | `#EDE8DC` | Secondary rows and disabled regions. |
| `--color-ink` | `#17231D` | Primary text and strong rules. |
| `--color-ink-muted` | `#5F675F` | Supporting text. |
| `--color-border` | `#D8D2C3` | Default borders and ledger rules. |
| `--color-primary` | `#225E4B` | Primary actions and selected states. |
| `--color-primary-strong` | `#174536` | Hover and high-emphasis primary states. |
| `--color-accent` | `#D99A22` | Selective highlights and priority markers. |
| `--color-info` | `#38657A` | Imported-source and informational states. |
| `--color-warning` | `#A95A32` | Needs-review states. |
| `--color-danger` | `#A33F3F` | Blocking issues and destructive actions. |
| `--color-success` | `#33735A` | Completed and validated states. |

Colour is always paired with iconography and text. Verify contrast for text, icons, focus rings, input borders, and disabled states. Do not reduce warning or success states to tinted pills without explanation.

## Typography

Use multilingual type designed for Indian scripts. A practical direction is the Anek family with appropriate Latin, Devanagari, and Bengali builds, bundled or loaded with resilient fallbacks. Avoid requiring a decorative English-only face for essential hierarchy.

Recommended scale:

| Role | Desktop | Mobile | Weight/behavior |
|---|---:|---:|---|
| Outcome amount | `48–56px` | `40–44px` | Strong, tabular numerals. |
| Page title | `34–40px` | `27–30px` | Compact line height. |
| Section heading | `22–24px` | `20–22px` | Clear hierarchy. |
| Card heading | `18–20px` | `18px` | Medium/semibold. |
| Body | `16–18px` | `16px` | At least `1.5` line height. |
| Supporting | `14–15px` | `14px` | Never essential at low contrast. |

Use tabular numerals for calculations, balances, deadlines, references, and comparative tables. Preserve Indian digit grouping. Masked identifiers must remain screen-reader understandable through explicit accessible labels.

## Spacing

Use an `8px` base rhythm with limited half steps:

```text
4, 8, 12, 16, 24, 32, 40, 48, 64, 80
```

- Related label and value: `4–8px`.
- Fields in a group: `16–24px`.
- Sections: `32–48px`.
- Page title to primary content: `24–32px`.
- Mobile page gutters: `16–20px`.

Whitespace should clarify grouping, not make high-density review screens excessively long.

## Surfaces and elevation

- Prefer fine borders and tonal shifts to large shadows.
- Default card radius: `12px`; controls: `8–10px`; dialogs/sheets: `16px`.
- Use shadow only for temporary elevation such as sheets, menus, and sticky regions.
- Reserve white or near-white surfaces for active working areas.
- A subtle paper grain or fine ruled texture may appear on large backgrounds but must not interfere with text.
- Avoid nesting several rounded cards inside one another.

## Buttons

Button hierarchy:

- **Primary:** filled deep green, one per action region.
- **Secondary:** bordered or low-tonal surface.
- **Tertiary:** text action with clear hover and focus treatment.
- **Danger:** blocking red, only for destructive operations.

Buttons use specific verbs: “Review and fix,” “Looks right,” “Compare regimes,” “File and verify.” Avoid generic “Submit” when a clearer outcome exists.

Minimum interactive height is `44px`; primary mobile actions should generally be `48–52px`.

## Inputs

- Labels remain visible above fields; placeholders do not replace labels.
- Prefix or suffix currency visually while exposing a coherent accessible value.
- Format Indian currency after entry without moving the caret unexpectedly.
- Place help and requirements before the user encounters an error.
- Show inline errors near fields and an error summary for page-level validation.
- Differentiate verified imported values, editable values, and calculated read-only values.

## Status language

Every status treatment combines icon, label, and optional explanation:

| Status | Suggested icon | Example label |
|---|---|---|
| Complete | Check | Verified |
| In progress | Clock/loader | Updating EPFO |
| Needs review | Flag | Check this value |
| Blocking | Stop/error | Filing cannot continue |
| Queued | Upload/cloud | Will retry online |
| Stale | Refresh | Review after recalculation |

Small status badges may summarize state; full consequences appear in adjacent copy or detail views.

## Source markers

Source markers are a distinctive Nagrik element. They use a restrained stamp-like treatment, a source icon, and accessible text:

- Form 16
- AIS
- Form 26AS
- EPFO record
- Identity record
- You entered this

Source markers never imply that imported data is automatically correct. Selecting one opens source detail and freshness information.

## Financial ledgers

- Use horizontal rules to show calculation order.
- Align labels left and amounts right.
- Keep tax credits separate from deductions.
- Use expandable rows for formulas and statutory treatment.
- Distinguish “entered,” “allowed,” and “applied” amounts.
- Present unavailable deductions under “Not used under your selected regime,” not as vanished data.
- Make refund and payable outcomes textual as well as numeric.

## Iconography

Use a cohesive outlined icon family with robust shapes at `16–24px`. Domain icons should communicate task—document, bank, employer, transfer, claim, timeline—rather than decorate every heading. Do not use emoji as production status indicators.

## Motion

Motion demonstrates state change:

- Identity propagation moves through source destinations in sequence.
- Recalculated rows briefly highlight the changed value.
- Timeline events reveal in order when first loaded.
- Autosave confirms with a quiet text transition.
- Mobile sheets enter from the physical lower edge.

Prefer `160–240ms` transitions for controls and `300–450ms` for meaningful state sequences. Respect `prefers-reduced-motion`, and never delay a submission result for decorative animation.

## Structural components

- `AppShell`
- `GlobalHeader`
- `DesktopSidebar`
- `MobileBottomNav`
- `PageHeader`
- `JourneyProgress`
- `ContextPanel`
- `StickyActionBar`
- `ServiceCard`
- `ActionCard`
- `ReviewCard`
- `SourceMarker`
- `StatusIndicator`
- `ValidationMessage`
- `MoneyBreakdown`
- `ComparisonTable`
- `Timeline`
- `EmptyState`
- `LoadingSkeleton`
- `OfflineBanner`
- `ConfirmationSheet`

## Domain components

- `IdentityComparison`
- `PropagationTracker`
- `IncomeSourceCard`
- `EmployerCard`
- `DeductionClaimCard`
- `TaxCreditCard`
- `RegimeComparison`
- `ReturnCalculation`
- `RuleCheckList`
- `ClaimReadiness`
- `PassbookLedger`
- `NoticeDiff`
- `GrievanceTimeline`

## Anti-patterns

- Purple gradients, glassmorphism, or generic fintech hero styling.
- A uniform grid of interchangeable floating cards.
- Excessive pills, shadows, rounded containers, and decorative icons.
- Colour-only status or tiny low-contrast supporting text.
- Long government-form layouts with every technical field visible.
- Approximate charts where an exact financial amount is available.
- Celebration effects that trivialize financial submission or legal declaration.
- Visual imitation of official portals or branding.
