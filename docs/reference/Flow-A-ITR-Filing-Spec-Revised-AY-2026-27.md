# Flow A --- Guided ITR Filing (No CA Needed): Screen-by-Screen Spec

### Revised for AY 2026--27

### Companion document to Nagrik-PRD.md

**Status:** Revised full spec. Designed to let a normal individual
complete a supported return without knowing ITR form numbers, tax
schedules, section names, or needing a CA for ordinary cases.

**Design principle:** The UI asks plain-language questions. The rules
layer determines the applicable ITR path, tax regime treatment,
deductions, special-rate income, tax credits, validations, and
unsupported cases in the background.

**Accuracy principle:** The interface may simplify tax terminology, but
the tax computation must not use illustrative rates or approximate tax
rules. All rates, limits, eligibility rules, rebates, cess, set-off
rules, and validation rules must be assessment-year versioned.

---

## Build Priority Note

The flow is intentionally split into support tiers. A taxpayer must
never be allowed to file through a partially implemented path.

1.  **Tier 1 --- Must be complete and accurate**
    - Resident Individual
    - Salary / pension, including multiple employers
    - Savings, deposit/FD, dividend and common other-source income
    - Up to two house properties
    - Straightforward LTCG under section 112A where supported by the
      simple-return eligibility rules
    - Common Chapter VI-A deductions
    - TDS / TCS / advance tax / self-assessment tax reconciliation
    - Old vs new regime comparison
    - 87A rebate, surcharge/marginal relief where applicable, 4%
      Health & Education Cess
    - Refund bank account selection
    - E-verification
2.  **Tier 2 --- Full non-business individual path**
    - ITR-2-like cases
    - STCG/LTCG and broader capital-gains schedules
    - More than two house properties
    - Agricultural income above the simple-return threshold
    - Director / unlisted-share cases
    - Other supported ITR-2 situations
3.  **Tier 3 --- Presumptive business / profession**
    - Section 44AD
    - Section 44ADA
    - Section 44AE only if explicitly implemented
    - Business-specific regime history and Form 10-IEA handling
4.  **Advanced / unsupported**
    - Full books-based business/profession return
    - Foreign assets/income unless a complete foreign-asset path is
      implemented
    - Complex loss carry-forward/set-off situations not supported by
      the rules engine
    - Trusts, companies, LLPs, firms outside the explicitly supported
      presumptive path
    - Any tax situation the rules engine cannot calculate with
      certainty

If a selected situation is unsupported, stop the filing flow gracefully
and explain why. Never silently ignore an income source, deduction, tax
credit, or required schedule.

---

# Core Architecture Rules

## 1. Do Not Ask the User to Pick an ITR Form

The user should never start with "ITR-1 / ITR-2 / ITR-3 / ITR-4."

The system derives an internal filing route from: - taxpayer type -
residential status - total income - income sources - capital-gain type -
house-property count - business/profession status -
director/unlisted-share status - foreign assets/income -
brought-forward/current losses - special filing conditions

Internal result example:

```ts
type FilingRoute =
  'ITR1_LIKE' | 'ITR2_LIKE' | 'ITR4_LIKE' | 'ITR3_ADVANCED' | 'UNSUPPORTED';
```

The UI says:

> "We'll choose the right return based on your answers."

The form number may be shown later under "Filing details" for
transparency, but it is never presented as a decision the user must
understand.

---

## 2. Version Every Tax Rule by Assessment Year

No slab, limit, deduction cap, rebate, special rate, or eligibility
condition is hard-coded in components.

```ts
TaxRules.get({
  assessmentYear: '2026-27',
  taxpayerType: 'INDIVIDUAL',
  residentialStatus: 'RESIDENT',
});
```

The rules package must contain: - slab rates - standard-deduction
limits - rebate rules - cess - surcharge and marginal relief - Chapter
VI-A deduction eligibility/caps - house-property rules - capital-gain
special rates and exemptions - presumptive-tax rules - filing-route
eligibility - validation rules

---

## 3. Separate Income, Deductions, Tax and Tax Credits

Never calculate tax as:

```text
Income − deductions − TDS → tax
```

Correct conceptual order:

```text
Income under each head
→ set-off rules
→ Gross Total Income
→ eligible deductions
→ Total Income

→ normal slab-rate tax
+ special-rate tax
→ rebate where legally permitted
→ surcharge / marginal relief where applicable
→ Health & Education Cess
→ interest / fee where applicable
= Total Tax Liability

→ subtract TDS
→ subtract TCS
→ subtract advance tax
→ subtract self-assessment tax
= Final Tax Payable / Refund
```

TDS/TCS/advance tax/self-assessment tax are **tax credits**, never
deductions from income.

---

## 4. Compute Both Regimes in Parallel

For eligible non-business taxpayers, do not wait until the regime screen
to apply regime-specific rules.

Every item stores its treatment by regime:

```ts
{
  enteredAmount: 120000,
  oldRegimeAllowedAmount: 120000,
  newRegimeAllowedAmount: 0
}
```

The engine continuously computes:

```ts
const oldScenario = computeReturn(data, 'OLD');
const newScenario = computeReturn(data, 'NEW');
```

The regime-choice screen only presents the two already-valid outcomes.

For business/profession cases, regime switching is subject to the
applicable Form 10-IEA and prior-regime-history rules and must not be
presented as a free annual toggle.

---

# Screen A0 --- Entry Point

## Purpose

Start filing with identity and filing-period context already
established.

## Fields / Elements

- Taxpayer name --- read-only
- PAN --- masked
- Date of birth --- read-only if identity record is verified
- Taxpayer type --- Individual for the primary guided flow
- Assessment Year --- prominently shown, e.g. **AY 2026--27**
- Corresponding Financial Year --- shown in helper text
- Residential status --- shown if already known; otherwise collected
  on A1
- Filing status:
  - Original return
  - Revised return --- only if implemented
  - Belated return --- only if implemented
- "Start filing" button
- Disclosure: \> "We'll ask simple questions and choose the right tax
  return for you."

Do not describe the computation as "illustrative" if the user can reach
a filing outcome.

## Conditional Logic

- Identity mismatches may show a warning with a link to Flow 0.
- A PAN/name mismatch that makes filing invalid is blocking.
- A bank mismatch is non-blocking until the refund/bank stage.
- If an in-progress draft exists:
  - "Continue where I left off"
  - "Start over"

---

# Screen A1 --- "First, a Few Things About You"

## Purpose

Determine filing eligibility and route without asking tax-form
questions.

## Questions

Use one question per card where possible.

### A1.1 Residential Status

> "Were you a resident of India for tax purposes this year?"

Options: - Resident - Resident but Not Ordinarily Resident (RNOR) -
Non-Resident - I'm not sure

"I'm not sure" opens a guided residency helper.

### A1.2 Taxpayer Type

Primary guided path: - Individual

If HUF / Firm / other types are supported elsewhere, route them there
rather than mixing their rules into the individual UX.

### A1.3 Simple Eligibility Questions

Ask:

- Were you a director in any company during the year?
- Did you hold any unlisted company shares at any time?
- Did you have any foreign asset, foreign financial interest, foreign
  bank signing authority, or foreign-source income?
- Was any tax on eligible start-up ESOP deferred?
- Do you have a loss from an earlier year that still needs to be
  adjusted or carried forward?
- Do you expect your total income to be above ₹50 lakh?
- Did you have agricultural income above ₹5,000?
- Did you receive lottery, betting, gambling, racehorse or another
  special-category income?
- Do you have income that belongs to another person but must be
  included in your return?
- Is there any income source you cannot find in this guided flow?

## Logic

Do **not** reject all "Yes" answers. Use them to select the correct
route.

Examples: - Business/profession → ITR-3-like or ITR-4-like route. - STCG
with no business income → ITR-2-like route. - More than two house
properties → ITR-2-like route. - Director/unlisted shares → ITR-2-like
if no business income. - Foreign assets/income → advanced path unless
fully implemented. - Unsupported special situation → stop with a clear
explanation.

## User-Facing Result

Do not show a tax-form decision screen.

Show:

> "Great --- we know which filing path you need. Now let's collect your
> income."

Optional secondary text:

> "Filing route: ITR-1"\
> "Why this form?"

---

# Screen A2 --- "What Did You Earn This Year?"

## Purpose

Plain-language income-source discovery.

## Multi-Select Checklist

- I had a salary or pension
- I earned bank/post-office interest
- I received dividends
- I own a house/property
- I sold shares or mutual funds
- I sold another asset
- I did freelance/professional work
- I ran a small business
- I had agricultural income
- I had another type of income

Where AIS/Form 16 data already indicates an income source, pre-select it
and show:

> "We found this in your tax records."

## Logic

- Zero options → Continue disabled.
- "Another type of income" opens a guided classifier rather than a
  blank amount field.
- Selections drive conditional sections.
- AIS/Form 26AS information that does not match selections must
  trigger a review: \> "Your tax records show another income item.
  Let's check it before continuing."

## Suggested Order

1.  Salary/Pension
2.  House Property
3.  Capital Gains
4.  Business/Profession
5.  Interest/Dividend/Other Sources
6.  Agricultural/Exempt Income
7.  Deductions
8.  Taxes Paid

---

# Screen A3 --- Salary / Pension Review

**Conditional:** salary/pension selected or detected.

## Purpose

Turn Form 16 data into a normal-language review rather than recreating
Schedule Salary.

## Structure

Support **multiple employers/pension sources**.

Each source is a separate card.

### Employer Fields

- Employer name
- Employer TAN --- hidden under "Details" unless user needs it
- Employer category where required by the return
- Gross salary
- Salary u/s 17(1), where source data provides it
- Perquisites u/s 17(2), where applicable
- Profits in lieu of salary u/s 17(3), where applicable
- Exempt allowances --- expandable
- HRA details --- shown only when relevant to old-regime calculation
- Professional tax
- Employer contribution to NPS, where applicable
- TDS deducted by employer

### Pension

If pension is selected: - Pension payer - Pension amount - Family
pension must be routed to Other Sources rather than normal salary
pension.

## Standard Deduction

Automatically calculated by the rules engine separately for old and new
regimes.

It is: - not editable - not hard-coded in the UI - shown as: \>
"Standard deduction applied automatically."

## UX

> "Your employer reported ₹X in salary and ₹Y tax already deducted. Does
> this look right?"

Actions: - Looks right - Edit - View Form 16 details

## Validation

- Large differences from Form 16 → warning, not silent acceptance.
- TDS claimed without corresponding salary income → blocking
  validation before filing.
- Professional tax and exemptions are applied only under regimes where
  legally allowed.
- Employer NPS deduction is handled independently from personal NPS
  deductions.

---

# Screen A4 --- House Property

**Conditional:** house/property selected.

## Purpose

Handle ordinary self-occupied and rented-property cases without exposing
Schedule HP terminology.

## Property List

Support at least the number of properties permitted by the chosen filing
route.

For Tier 1 simple returns, support up to two properties for AY 2026--27.

Each property card asks:

### Basic Details

- Property address
- Ownership percentage
- Co-owned? Yes/No
- Co-owner details where required
- Property type:
  - I live here / use it myself
  - Rented out
  - Deemed let-out, if advanced route supports it

### Rented Property Fields

- Annual rent received/receivable
- Rent that could not be realised
- Municipal taxes actually paid
- Ownership share

### Home Loan

> "Did you pay interest on a home loan for this property?"

If Yes: - Interest paid during the year - Lender type - Lender name -
Lender PAN/Aadhaar where legally required/applicable - Loan account
number - Loan sanction date - Other loan metadata required by the AY
form/rules

Keep these under a friendly "Loan details" drawer rather than showing
them all initially.

## Computation

### Rented Property

Conceptually:

```text
Gross Annual Value
− eligible unrealised rent treatment
− municipal taxes actually paid
= Net Annual Value

− statutory 30% deduction
− eligible interest on borrowed capital
= Income/Loss from this property
```

### Self-Occupied

- Annual value = zero.
- Interest deduction is calculated according to the selected regime
  and applicable statutory conditions/caps.
- Do not automatically apply the old-regime ₹2 lakh treatment to the
  new regime.

### Loss Set-Off

House-property loss must pass through a dedicated set-off rules layer.

Do not assume: \> "All negative house-property income can reduce
salary."

For the old regime, apply the applicable current-year inter-head set-off
cap and carry-forward treatment.

For the new regime, apply the new-regime restrictions separately.

## UX

> "This property resulted in a ₹X taxable income."

or

> "This property has a ₹X tax loss. We can use ₹Y this year; ₹Z must be
> carried forward."

---

# Screen A5 --- Capital Gains

**Conditional:** shares/mutual funds/other asset selected.

## Purpose

Support only transaction types the tax engine can calculate accurately.

Do not use "illustrative" capital-gain rates.

## First Question

> "What did you sell?"

Options: - Listed shares - Equity-oriented mutual fund - Property -
Gold - Other investment/asset

Unsupported asset classes route to the advanced flow.

## Simple Equity Transaction Fields

Per transaction / imported row: - Asset type - Description/security -
Purchase date - Sale date - Sale consideration - Cost of acquisition -
Transfer expenses where applicable - STT / qualifying transaction
information where required - ISIN/security identifiers where required by
the filing schedule - Grandfathering-related fields for
pre-applicable-date acquisitions, if supported

## Logic

The rules engine determines: - short-term vs long-term - applicable
section - normal-rate vs special-rate treatment - exemption threshold -
applicable special rate - grandfathering treatment - loss
set-off/carry-forward

Do not calculate capital gains by simply adding gain to slab income.

Internally maintain:

```ts
{
  normalRateIncome,
  specialRateIncome: [
    { section: "111A", amount: ... },
    { section: "112A", amount: ... }
  ]
}
```

## ITR Route Logic

For AY 2026--27: - straightforward LTCG u/s 112A within the
simple-return eligibility threshold may remain in the simple route if
all other conditions are satisfied - STCG routes away from ITR-1-like
handling - broader capital gains use ITR-2-like handling if no
business/profession income exists

## AIS Import

AIS capital-gain entries may create starter rows, but AIS values are not
assumed to be the final taxable gain.

Show:

> "AIS tells us a sale happened. We still need to confirm what you paid
> for it so we can calculate the gain correctly."

---

# Screen A6 --- Business / Freelance Income

**Conditional:** freelance/profession or small business selected.

## Purpose

Provide a simple path only where presumptive taxation is legally
available.

Never assume every freelancer can declare 50% or every business can
declare 6%/8%.

## Step A6.1 --- Classify the Activity

> "Which best describes what you do?"

- Professional service
- Small business/trading
- Commission/brokerage/agency work
- Goods-carriage business
- Something else

For "Professional service," ask the actual profession/category because
section 44ADA applies only to specified professions.

## Step A6.2 --- Eligibility

Collect: - resident status - entity/taxpayer type - gross
receipts/turnover - cash receipts - non-cash/digital receipts - whether
user wants to declare income below the presumptive amount - any
disqualifying activity - number/details of goods carriages if 44AE is
implemented

### 44AD

Apply only if eligible.

The rules engine must enforce the AY-specific turnover threshold,
including the higher threshold where cash receipts stay within the
statutory percentage.

Presumptive income: - eligible digital/non-cash turnover at applicable
presumptive rate - eligible cash turnover at applicable presumptive rate

Do not ask merely "Mostly digital?" Use actual amounts or percentages so
the threshold and presumptive income can be computed correctly.

### 44ADA

Apply only to eligible specified professions.

The rules engine enforces: - eligible taxpayer/profession - standard
gross-receipt threshold - higher threshold where cash receipts remain
within the statutory percentage - presumptive income percentage

### 44AE

Only show if fully implemented.

If not implemented: \> "Goods-carriage presumptive income needs the
advanced business flow."

## Lower-Profit Declaration

If the user wants to declare less than the presumptive amount, do not
simply accept the lower figure.

Explain:

> "Declaring a lower profit can require books of account or an audit
> depending on your situation. This needs the advanced filing flow."

## Expenses

For a valid presumptive path, do not ask the user to itemise ordinary
business expenses.

Copy:

> "Because you're using the simplified presumptive method, you don't
> need to enter every business expense here."

## Regime History

Business/profession users require: - current regime - whether Form
10-IEA was filed previously - whether opting out/re-entering in the
current year - due-date validation where applicable

Do not show an unrestricted annual old/new toggle.

---

# Screen A7 --- Interest, Dividend & Other Income

## Purpose

Replace the narrow "bank interest" screen with a complete ordinary Other
Sources review.

## Imported Sources

Use AIS/Form 26AS/source data to prefill where possible.

Cards may include: - Savings-account interest - Deposit/FD/RD interest -
Post-office interest - Cooperative-bank interest - Income-tax refund
interest - Dividend income - Family pension - Interest from
loans/unsecured loans - Other ordinary taxable income - Special-category
income → advanced route where required

## Per-Source Fields

- Payer/bank name
- masked account/reference
- income type
- amount
- TDS, if any
- "Where did this number come from?" source link

## Savings Interest Deduction

Do **not** deduct 80TTA directly from income on this screen.

Instead calculate deduction eligibility for the old regime:

### Non-Senior Eligible Taxpayer

- 80TTA applies only to eligible savings-account interest
- cap comes from AY rules
- FD/deposit interest is not included in 80TTA

### Resident Senior Citizen

- evaluate 80TTB instead of 80TTA
- apply to eligible deposit interest according to current rules
- cap comes from AY rules

Show:

> "You may qualify for an interest deduction under the old tax regime.
> We've included it in the regime comparison."

## AIS Mismatch / Dispute

If AIS contains a suspicious or misclassified item:

> "Your AIS shows ₹40,000 as 'other income' from a mutual-fund
> redemption. A sale is not always fully taxable as income. Let's review
> it."

Actions: - Review as capital gain - Keep as other income - Mark as
disputed - Learn why

Never silently exclude an AIS item.

A disputed item remains visible in the review/status system.

---

# Screen A8 --- Agricultural & Exempt Income

**Conditional:** detected or selected.

## Purpose

Keep non-taxable/exempt amounts visible without mixing them into taxable
income.

## Fields

Examples: - Agricultural income - Exempt allowances/income not already
handled under salary - Other exempt income supported by the selected ITR
route

## Logic

- Agricultural income above the simple-return eligibility threshold
  changes the filing route.
- Apply partial-integration rules where legally required.
- Exempt income is shown on the final review but is not blindly
  included in taxable income.

---

# Screen A9 --- "Tax-Saving Payments & Deductions"

## Purpose

Discover deductions through normal life events rather than a wall of
section numbers.

## Intro

> "Tell us about payments or investments that may reduce your tax. We'll
> apply only the ones allowed under your tax regime."

## Cards

### "I invested or paid for common tax-saving items"

Maps to eligible 80C-family claims: - employee PF contribution - PPF -
eligible life-insurance premium - ELSS - eligible tuition fees -
eligible principal repayment - other supported 80C items

Show aggregate statutory cap automatically.

### "I contributed to NPS"

Handle separately: - 80CCD(1) - 80CCD(1B) - employer contribution
80CCD(2)

Collect PRAN/details where required.

Do not combine employer NPS with the user's personal 80C amount.

### "I paid health-insurance or eligible medical costs"

80D guided questions: - self/spouse/dependent children - parents -
age/senior-citizen status - preventive health check-up where
applicable - insurer/policy details required by the current return

### "I paid interest on an education loan"

80E details.

### "I made donations"

80G / supported donation deductions: - donee - PAN/registration
details - amount - cash/non-cash - qualifying percentage/category where
available

### "I pay rent but don't receive HRA"

80GG: - eligibility questions - Form 10BA information/status - do not
allow incompatible HRA + 80GG treatment

### "Disability or specified medical treatment applies"

80DD / 80DDB / 80U: - only when user opts in - collect legally required
certificate/Form 10-IA/UDID/dependent details - apply fixed/actual
limits through rules engine

### "I have another eligible deduction"

Advanced deduction selector: - 80CCC - 80CCH - 80EE / 80EEA / 80EEB
where still applicable to the taxpayer's qualifying loan/date - 80GGA -
80GGC - other deductions implemented by the rules layer

## Regime Treatment

Every deduction is stored once but evaluated separately under each
regime.

Example UI:

> **Old regime:** ₹1,76,200 deductions available\
> **New regime:** ₹42,000 deductions available

Do not tell the user "only standard deduction is available under the new
regime." Some deductions, including qualifying employer NPS treatment,
may still be available.

## Supporting Metadata

Current ITR validations may require policy numbers, document
identifiers, PRAN, Form acknowledgements, lender details, donee details,
etc.

Collect these only after the user selects the relevant deduction.

Progressive disclosure is mandatory.

---

# Screen A10 --- "Tax Already Paid"

## Purpose

Reconcile tax credits separately from taxable income.

## Data Sources

Prefill from: - Form 16 - Form 16A / other TDS records - Form 26AS - AIS
where appropriate - saved challan data

## Sections

### TDS from Salary

Per employer: - employer - TAN - income corresponding to TDS - TDS
deducted - TDS claimed

### TDS Other Than Salary

Per deductor: - deductor - TAN/PAN where applicable - income/receipt -
TDS deducted - TDS claimed

### TCS

Per collector: - collector - amount - TCS credit

### Advance Tax

Per challan: - BSR/challan identifiers as required - date - amount

### Self-Assessment Tax

Per challan: - challan identifiers - date - amount

## UX

> "We found ₹72,400 of tax already paid in your records."

Then:

> "This does not reduce your income. It reduces the tax you still need
> to pay."

## Validation

- Claimed TDS should reconcile with corresponding income/receipt.
- Duplicate credits blocked.
- Credit exceeding source record → warning/block according to
  validation rule.
- Unmatched credit → explicit review.
- Never automatically delete a tax credit because its related income
  is missing; ask the user to resolve the mismatch.

---

# Screen A11 --- "Which Tax Regime Saves You More?"

## Purpose

Present a decision, not a tax-law lesson.

## Eligibility

### Non-Business Individual

If eligible, calculate both regimes and allow the user to choose for the
year.

### Business/Profession

Respect regime history and Form 10-IEA rules.

If the user cannot freely switch:

> "Because you have business/professional income, tax rules limit how
> often you can switch regimes."

Show only legally available choices.

## Comparison Cards

### New Regime

- Total income
- deductions/exemptions allowed
- tax before rebate
- rebate
- surcharge/marginal relief if applicable
- cess
- total tax

### Old Regime

Same structure.

## Recommendation

> "Based on everything you entered, the **New Regime saves you
> ₹18,420**."

Recommended option preselected.

User may override only if legally permitted.

## AY 2026--27 New-Regime Rules

Rules engine must use the AY 2026--27 notified slabs:

- Up to ₹4,00,000 --- Nil
- ₹4,00,001--₹8,00,000 --- 5%
- ₹8,00,001--₹12,00,000 --- 10%
- ₹12,00,001--₹16,00,000 --- 15%
- ₹16,00,001--₹20,00,000 --- 20%
- ₹20,00,001--₹24,00,000 --- 25%
- Above ₹24,00,000 --- 30%

87A for the new regime must be implemented using the AY-specific
statutory eligibility and rebate rules, including the applicable maximum
rebate and total-income threshold.

Do not assume the rebate can erase every kind of special-rate tax. The
rules engine must apply the statutory restrictions for special-rate
income.

## Old-Regime Rules

Use the AY-specific old-regime slabs based on: - age category -
residential status - applicable taxpayer rules

Apply only old-regime-permitted deductions/exemptions.

## Cess

Apply **4% Health & Education Cess** on income tax plus surcharge, where
applicable.

## Surcharge / Marginal Relief

If the product supports income above the surcharge thresholds, implement
the full surcharge and marginal-relief rules, including
special-rate-income surcharge caps.

If not implemented, users who cross the supported threshold must be
routed to the advanced flow rather than shown an approximate result.

---

# Screen A12 --- Bank Accounts & Refund Account

## Purpose

Review bank accounts once and nominate a valid refund account.

## Fields

List known Indian bank accounts:

```text
HDFC Bank ••••4821     Validated
SBI       ••••9032     Needs validation
```

Per account: - account number --- masked after entry - IFSC - bank
name - account type where required - validation status - PAN
linkage/status if available from identity layer

## Refund Selection

If refund is expected:

> "Where should we send your refund?"

Radio-select one eligible validated account.

If tax is payable, still collect/review bank-account information
required by the applicable return, but do not frame it only as a refund
field.

## Validation

- invalid IFSC → block selection
- account-validation failure → explain next action
- PAN/bank mismatch → link to Flow 0
- allow another account to be added
- do not silently replace an account

---

# Screen A13 --- Summary & Final Tax Calculation

## Purpose

Show exactly how the final number was produced in normal language.

## Section 1 --- Income

Example:

```text
Salary                                  ₹9,40,000
House property                           -₹80,000
Savings interest                           ₹6,200
FD interest                               ₹18,000
Dividend                                   ₹4,000
Capital gains — normal rate                    ₹0
Capital gains — special rate              ₹40,000
Business/profession                            ₹0
────────────────────────────────────────────────
Gross / adjusted income                  ₹9,28,200
```

The actual aggregation must follow statutory head-of-income and set-off
rules rather than simply adding every displayed number.

## Section 2 --- Deductions

```text
80C                                      -₹1,20,000
80TTA / 80TTB                              -₹6,200
NPS                                        -₹50,000
Other eligible deductions                       ₹0
────────────────────────────────────────────────
Total Income                             ₹7,52,000
```

Only deductions allowed under the selected regime appear as "applied."

Unavailable deductions may appear under:

> "Not used under your selected regime"

## Section 3 --- Tax Calculation

```text
Tax on normal income                       ₹XX,XXX
Tax on special-rate income                  ₹X,XXX
Rebate                                     -₹X,XXX
Surcharge / marginal relief                     ₹0
Health & Education Cess                     ₹X,XXX
Interest / fee, if applicable               ₹X,XXX
────────────────────────────────────────────────
Total tax liability                        ₹XX,XXX
```

## Section 4 --- Tax Already Paid

```text
Salary TDS                                -₹XX,XXX
Other TDS                                  -₹X,XXX
TCS                                             ₹0
Advance tax                                     ₹0
Self-assessment tax                             ₹0
────────────────────────────────────────────────
Total tax credits                          ₹XX,XXX
```

## Section 5 --- Outcome

Large, unambiguous result:

> **Refund: ₹3,200**

or

> **Tax still to pay: ₹8,450**

If tax is still payable: - do not allow final filing until the
payment/self-assessment-tax step is completed where required - after
payment, refresh tax credits and recompute

## Other Review Items

- selected regime
- internal ITR form/route
- residential status
- bank account
- AIS items disputed/reclassified
- losses used/carried forward
- exempt income
- filing type
- each section has an "Edit" link

## Completion Validation

"Continue to declaration" is disabled until: - every selected/detected
income section is reviewed - all blocking mismatches are resolved -
filing route remains valid - required deduction metadata is complete -
tax-credit reconciliation passes required validations - bank
requirements are satisfied - outstanding self-assessment tax is handled
where required

---

# Screen A14 --- "One Last Check"

## Purpose

Replace cryptic validation errors with a human-readable pre-submit
check.

## Checks

Group results:

### Ready

- Income reviewed
- Deductions reviewed
- Tax credits matched
- Bank account ready
- Tax regime selected

### Needs Attention

Examples:

> "Your employer TDS is ₹48,000, but the salary from this employer is
> missing."

> "You claimed an NPS deduction but your PRAN is missing."

> "One home-loan deduction needs lender details."

> "Your AIS shows a share sale that has not been reviewed."

Each message has one action:

**Fix this →**

No error codes as the primary user-facing message.

Technical validation code may be shown under "Details."

---

# Screen A15 --- Declaration & E-Verification

## Purpose

Complete filing without forcing the user to understand DSC/utility
terminology.

## Declaration

Required checkbox:

> "I declare that the information in this return is correct and complete
> to the best of my knowledge."

Collect any additional capacity/representative fields required by the
applicable return.

## E-Verification Options

Primary recommended method:

### Aadhaar OTP

- Aadhaar-linked mobile shown masked
- Send OTP
- 6-digit OTP
- expiry/resend handling

If the production product supports additional official verification
methods, expose them under:

> "Use another verification method"

For the prototype, Aadhaar OTP may be the only implemented method if
clearly labelled as a prototype interaction.

## Submit Logic

1.  Run final validation again.
2.  Freeze the return snapshot.
3.  Submit/file.
4.  Receive acknowledgment.
5.  E-verify.
6.  Store filing and verification status separately.

Do not mark a return "fully completed" if filing succeeded but
verification is still pending.

---

# Screen A16 --- Confirmation & What Happens Next

## Purpose

Close the loop without making the user interpret tax-portal statuses.

## Fields

- Return filed successfully
- Assessment Year
- ITR form/route
- acknowledgment number
- filing date/time
- verification status
- selected regime
- refund/payable result
- refund bank account if applicable

## Next Actions

If refund expected:

> "Your return is filed and verified. We'll track the refund and tell
> you if anything needs attention."

If no refund/payable:

> "Your return is filed and verified. Nothing else is needed right now."

If verification pending:

> "Your return was filed, but verification is still required."

Actions: - Track return - Download acknowledgment - View filed return -
Go to Unified Status Feed

---

# Screen A17 --- "About This Notice"

**Conditional:** user has an unresolved notice (139(9) defective, or 143(1)
with a demand or discrepancy).

## Purpose

Turn a department notice into one plain-language explanation and exactly one
required action --- never a decision the user has to interpret themselves.

## Ingestion

Upload or auto-fetch the notice. Parse: notice type, section, issue date,
response deadline, and --- for 143(1) --- the line-by-line CPC-computed vs
filed-return diff.

## Diff Display

Reuse the AIS-mismatch card pattern from Screen A7 rather than reproducing
notice text:

> "You declared ₹X. [Source] shows ₹Y."

One card per discrepancy. Plain language first; section numbers appear only
under "Details."

## Remedy Resolution

The system decides the remedy. The user is never asked to choose between
rectification, revision, or a defective-return response.

- **139(9) defective** → single action: **"Fix and refile →"**. Reopens the
  _specific_ upstream section that caused the defect (for example, jumps to
  Screen A5 if the defect is "capital gains present, wrong form"),
  pre-filled, using the existing back-navigation/recompute rules (Rule 8)
  rather than a blank restart.
- **143(1) demand, CPC's figure is correct** → single action: **"Pay and
  close out →"**. Routes to self-assessment tax payment (Screen A10 /
  A13 outstanding-tax flow).
- **143(1) demand, CPC's figure looks wrong** → single action: **"Request
  rectification →"** (section 154). Offered only when the discrepancy
  matches a recognised "mistake apparent from the record" pattern (for
  example, a credit CPC failed to account for). Otherwise route to the
  advanced/unsupported flow rather than guess.
- **ITR-U (section 139(8A))** is never offered as a default remedy. Surface
  it only when the other three paths are closed, and show its escalating
  additional-tax cost (25% / 50% / 60% / 70%) before it can be selected.

## Deadlines

Always show a countdown, not just a date:

> "11 days left to respond."

Enforce the applicable hard deadline as a real date, not general text:
139(9) response window (15 days from issue), revised return under 139(5)
(till the statutory year-end date), rectification (154) has no fixed
statutory window but should still show elapsed time since the notice.

## State Tracking

Do not introduce a separate case-state machine. Extend the existing section
completion-state model (Rule 7) with notice-specific states:

```ts
type NoticeState = 'NOTICE_RECEIVED' | 'ACTION_REQUIRED' | 'RESOLVED';
```

A notice moves to `RESOLVED` only once the corresponding action (refile,
payment, or rectification request) has actually been completed --- never on
dismissal alone.

---

# Cross-Cutting Rules

## 1. AIS / Form 26AS / Form 16 Reconciliation

Imported data is evidence, not unquestionable truth.

Every imported item has: - source - amount - category - source
identifier - user-reviewed flag - included/reclassified/disputed status

Never silently drop mismatched data.

---

## 2. "I Don't Know" Must Be a Valid Answer

For questions ordinary taxpayers may not understand, provide: - "I'm not
sure" - a short explainer - a guided determination

Do not force the user to guess tax terminology.

Examples: - residential status - whether a mutual fund is
equity-oriented - whether work qualifies for presumptive professional
taxation - whether an amount is family pension

---

## 3. Progressive Disclosure

Default screen = only questions needed now.

Technical fields such as: - TAN - lender PAN - PRAN - Form 10-IA
acknowledgment - Form 10BA - ISIN - challan identifiers

appear only when relevant.

---

## 4. Explain the "Why"

Every prefilled number supports:

> "Where did this come from?"

Possible source labels: - Form 16 - AIS - Form 26AS - EPFO/imported
record - You entered this

---

## 5. No Silent Clamping

If a deduction exceeds a statutory cap:

Bad: \> silently store ₹1,50,000

Good: \> "You entered ₹1,80,000. The maximum amount we can use here is
₹1,50,000, so ₹1,50,000 will be applied."

Preserve both: - `enteredAmount` - `allowedAmount`

---

## 6. Regime-Aware Explanations

Never tell the user an expense "doesn't count" globally when it merely
does not count in one regime.

Say:

> "This helps under the old regime, but not under the new regime."

---

## 7. Completion State

Each section tracks:

```ts
{
  status: "NOT_STARTED" | "NEEDS_REVIEW" | "COMPLETE" | "BLOCKED",
  reviewedAt?: string,
  blockingIssues: ValidationIssue[]
}
```

A section becoming stale after an upstream edit returns to
`NEEDS_REVIEW`.

---

## 8. Back Navigation

Changing an earlier answer: - recalculates downstream values - may
change filing route - may invalidate a regime - may reopen previously
completed sections

Never force the user to restart unless identity/persona changes.

---

## 9. Persona Switch

Switching taxpayer/persona mid-flow: - save current draft if
appropriate - return to A0 for the new persona - never carry income/tax
data between personas

---

## 10. Draft Saving

Autosave after every meaningful step.

Draft includes: - AY - rules-version - identity/persona ID - filing
route - answers - imported source snapshot IDs - calculation snapshot -
completion states

If tax rules/version changes before submission: \> "Tax rules were
updated. We recalculated your return --- please review the highlighted
changes."

---

## 11. Internationalisation

All static copy is translation-key driven.

Initial languages: - English - Hindi - Bengali

Dynamic monetary values are formatted consistently in the Indian
numbering system.

Technical section numbers can remain visible as secondary labels, but
explanations must be translated.

---

## 12. Accessibility

- No information conveyed only by colour.
- Every warning has text and icon.
- Keyboard-accessible controls.
- Screen-reader labels for masked PAN/bank data.
- Error summary at top plus inline error.
- Currency inputs announce rupee value clearly.

---

# Tax Engine --- Required Computation Pipeline

```ts
function computeReturn(
  input: ReturnInput,
  regime: TaxRegime,
): ReturnComputation {
  const salary = computeSalary(input.salary, regime);
  const houseProperty = computeHouseProperty(input.properties, regime);
  const capitalGains = computeCapitalGains(input.capitalGains, regime);
  const business = computeBusinessIncome(input.business, regime);
  const otherSources = computeOtherSources(input.otherSources, regime);

  const incomeHeads = combineIncomeHeads({
    salary,
    houseProperty,
    capitalGains,
    business,
    otherSources,
  });

  const afterSetOff = applyLossSetOffRules(incomeHeads, input.losses, regime);

  const grossTotalIncome = computeGrossTotalIncome(afterSetOff);

  const deductions = computeEligibleDeductions({
    grossTotalIncome,
    claims: input.deductions,
    regime,
    taxpayer: input.taxpayer,
  });

  const totalIncome = computeTotalIncome(grossTotalIncome, deductions);

  const normalTax = computeNormalRateTax(totalIncome, afterSetOff, regime);
  const specialRateTax = computeSpecialRateTax(
    afterSetOff.specialRateIncome,
    regime,
  );

  const taxBeforeRebate = normalTax + specialRateTax;

  const rebate = compute87A({
    taxpayer: input.taxpayer,
    regime,
    totalIncome,
    normalTax,
    specialRateTax,
    taxBeforeRebate,
  });

  const taxAfterRebate = taxBeforeRebate - rebate;

  const surchargeResult = computeSurchargeAndMarginalRelief({
    taxAfterRebate,
    totalIncome,
    specialRateIncome: afterSetOff.specialRateIncome,
    regime,
  });

  const cess = computeHealthEducationCess(surchargeResult.taxPlusSurcharge);

  const interestAndFee = computeInterestAndFee(input, {
    totalIncome,
    tax: surchargeResult.taxPlusSurcharge + cess,
  });

  const totalTaxLiability =
    surchargeResult.taxPlusSurcharge + cess + interestAndFee.total;

  const taxCredits = computeTaxCredits({
    salaryTds: input.taxCredits.salaryTds,
    otherTds: input.taxCredits.otherTds,
    tcs: input.taxCredits.tcs,
    advanceTax: input.taxCredits.advanceTax,
    selfAssessmentTax: input.taxCredits.selfAssessmentTax,
  });

  const balance = totalTaxLiability - taxCredits.total;

  return {
    grossTotalIncome,
    deductions,
    totalIncome,
    normalTax,
    specialRateTax,
    rebate,
    surcharge: surchargeResult.surcharge,
    marginalRelief: surchargeResult.marginalRelief,
    cess,
    interestAndFee,
    totalTaxLiability,
    taxCredits,
    taxPayable: Math.max(balance, 0),
    refund: Math.max(-balance, 0),
  };
}
```

---

# Filing Route Engine

```ts
function determineFilingRoute(data: ReturnData): FilingRoute {
  if (hasUnsupportedComplexity(data)) return 'UNSUPPORTED';

  if (hasBusinessOrProfessionIncome(data)) {
    if (isEligibleForPresumptiveReturn(data)) return 'ITR4_LIKE';
    return 'ITR3_ADVANCED';
  }

  if (isEligibleForSimpleIndividualReturn(data)) {
    return 'ITR1_LIKE';
  }

  return 'ITR2_LIKE';
}
```

For AY 2026--27 the simple individual eligibility rules must account
for, among other things: - resident individual status - total-income
limit - salary/pension - up to two house properties - ordinary
other-source income - agricultural-income threshold - limited LTCG u/s
112A within the applicable threshold - exclusions such as STCG, director
status, unlisted shares, foreign assets/income, relevant loss situations
and other statutory exclusions

The route engine must use the official AY-specific validation
configuration rather than component-level conditionals.

---

# Validation Severity Model

```ts
type ValidationSeverity = 'INFO' | 'WARNING' | 'BLOCKING' | 'ROUTE_CHANGE';
```

### INFO

> "We applied the standard deduction automatically."

### WARNING

> "This salary differs from the Form 16 amount."

User can continue after acknowledging.

### BLOCKING

> "You claimed this TDS credit but the related income is missing."

Must fix before filing.

### ROUTE_CHANGE

> "This share sale requires the capital-gains filing path. We've updated
> your return --- your information is saved."

The user is moved to the correct guided path without losing compatible
data.

---

# Required Data Model Additions

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

interface NoticeItem {
  id: string;
  section: '139(9)' | '143(1)';
  issuedOn: string;
  responseDeadline: string;
  discrepancies: {
    label: string;
    declaredAmount: number;
    departmentAmount: number;
  }[];
  remedy: 'REFILE' | 'PAY' | 'RECTIFY' | 'ITR_U';
  state: NoticeState;
}
```

---

# APIService Additions / Changes

Suggested API surface:

```ts
getIdentityRecord(userId);
getExistingReturnDraft(userId, assessmentYear);
saveReturnDraft(userId, draft);

getFormSixteenSources(userId, assessmentYear);
getAisSummary(userId, assessmentYear);
getForm26ASSummary(userId, assessmentYear);
getTaxPaymentSummary(userId, assessmentYear);

classifyIncomeSource(input);
determineFilingRoute(returnData);
getTaxRules(assessmentYear);

computeReturn(returnData, regime);
compareRegimes(returnData);

validateReturn(returnData);
validateBankAccount(account);
validateTaxCredits(returnData);

reclassifyAisEntry(userId, entryId, targetCategory);
disputeAisEntry(userId, entryId);

createSelfAssessmentTaxPayment(returnId, amount); // production/integration path
fileReturn(userId, returnData);
verifyReturn(userId, acknowledgmentNumber, method, payload);

getFiledReturnStatus(userId, acknowledgmentNumber);

parseNotice(userId, noticeDocument);
resolveNoticeAction(userId, noticeId); // returns the single system-decided remedy
```

---

# Screen Count Summary

## Always / Core

- A0 --- Entry
- A1 --- Eligibility & taxpayer facts
- A2 --- Income-source discovery
- A9 --- Deductions
- A10 --- Tax already paid
- A11 --- Regime comparison/selection
- A12 --- Bank accounts
- A13 --- Summary
- A14 --- Final validation
- A15 --- Declaration/e-verification
- A16 --- Confirmation

**11 core screens**

## Conditional

- A3 --- Salary/Pension
- A4 --- House Property
- A5 --- Capital Gains
- A6 --- Business/Freelance
- A7 --- Interest/Dividend/Other Sources
- A8 --- Agricultural/Exempt Income
- A17 --- About This Notice

**7 conditional screens**

**Maximum primary screen count: 18**, but a normal salaried user
typically sees far fewer because irrelevant income sections are skipped.

---

# Example: Normal Salaried User

A typical user with: - one employer - savings/FD interest - 80C
investments - health insurance - employer TDS - no house/capital
gains/business income

sees:

```text
Start
→ A few things about you
→ What did you earn?
→ Salary review
→ Interest review
→ Tax-saving payments
→ Tax already paid
→ Old vs new regime comparison
→ Bank accounts
→ Final summary
→ One last check
→ E-verify
→ Done
```

At no point does the user need to understand: - Schedule S - Schedule
OS - Schedule VI-A - Part B-TTI - TDS schedules - section 115BAC - which
ITR form to choose

Those remain implementation concepts.

---

# Example: Freelancer

```text
Start
→ Eligibility
→ Income sources
→ “I did freelance/professional work”
→ What kind of work?
→ Is the profession eligible for presumptive taxation?
→ Receipts + cash/non-cash split
→ System checks 44ADA eligibility
→ Other income
→ Deductions
→ Tax paid
→ Regime eligibility/history + 10-IEA handling
→ Summary
→ Validation
→ E-verify
```

If not eligible for presumptive filing:

> "Your work needs the advanced business return because the simplified
> presumptive rules don't apply. Your information is saved --- continue
> to the advanced flow."

---

# Acceptance Criteria

The flow is complete only if all of the following are true:

1.  User never needs to choose an ITR form manually.
2.  Filing route changes automatically when answers require it.
3.  No unsupported income can be silently ignored.
4.  Salary supports multiple employers.
5.  Pension and family pension are classified correctly.
6.  House property supports AY-specific property-count and
    unrealised-rent requirements.
7.  Home-loan interest is regime-aware.
8.  House-property losses use proper set-off/carry-forward rules.
9.  Capital gains are separated into normal-rate and special-rate
    buckets.
10. Capital-gain rates are not illustrative.
11. 80TTA/80TTB are age/residency/regime-aware and not treated as
    unconditional interest reductions.
12. Deductions are regime-aware.
13. Employer NPS is handled separately from personal 80C/NPS claims.
14. Required deduction metadata is collected progressively.
15. Presumptive business/profession eligibility is validated before
    applying 44AD/44ADA/44AE.
16. Cash/non-cash receipt thresholds are computed from amounts, not a
    "mostly digital" toggle.
17. Business users receive correct Form 10-IEA/regime-switch handling.
18. TDS is never subtracted from taxable income.
19. TDS, TCS, advance tax and self-assessment tax are handled as tax
    credits.
20. Tax credits reconcile with corresponding income where required.
21. 87A is applied only where legally eligible.
22. Special-rate income receives correct rebate treatment.
23. Surcharge and marginal relief are implemented or the user is routed
    out before an inaccurate result is shown.
24. 4% Health & Education Cess is applied correctly.
25. Tax payable/refund is calculated only after tax credits.
26. Outstanding self-assessment tax blocks final filing where payment is
    required.
27. Bank accounts are reviewed separately from the tax calculation.
28. Final summary explains every rupee in normal language.
29. Imported AIS/Form 16/Form 26AS data always shows its source.
30. AIS mismatches are reviewed, reclassified or disputed --- never
    silently deleted.
31. Every relevant conditional section must be reviewed before
    submission.
32. Upstream edits invalidate/recompute affected downstream sections.
33. The tax rules are assessment-year versioned.
34. The filing snapshot stores the rules version used.
35. Final validation uses human-readable messages with one-click
    navigation to the problem.
36. Filing and e-verification statuses are tracked separately.
37. The user can complete an ordinary supported return without knowing
    tax-form terminology or needing a CA.
38. A post-filing notice (139(9)/143(1)) is translated into plain language
    with a line-by-line diff against the filed return, never shown as raw
    notice text.
39. The system determines the single correct remedy (refile / pay / rectify)
    for a notice; the user is never asked to interpret the notice and choose.
40. "Fix and refile" reopens the specific upstream section that caused a
    defective-return notice, pre-filled, rather than restarting the return.
41. ITR-U is never presented as a default remedy and always shows its
    escalating additional-tax cost before selection.

---

# AY 2026--27 Reference Assumptions Used by This Spec

The implementation rules should be verified against the official Income
Tax Department schema/validation package whenever the rules version is
updated.

This revision is designed around official AY 2026--27 guidance available
as of August 2026, including:

- ITR-1 supports eligible resident individuals with total income up to
  ₹50 lakh, salary/pension, up to two house properties, ordinary other
  sources, agricultural income up to ₹5,000, and qualifying LTCG u/s
  112A up to ₹1.25 lakh.
- STCG and broader capital-gain situations route away from ITR-1.
- ITR-2 covers individuals/HUFs without business/profession income
  where ITR-1 does not apply.
- ITR-4 covers eligible presumptive business/profession cases under
  sections 44AD/44ADA/44AE subject to its eligibility rules.
- 44AD uses AY-specific turnover thresholds, including the enhanced
  threshold where cash receipts do not exceed the statutory
  percentage.
- 44ADA similarly uses its normal/enhanced gross-receipt thresholds.
- Business/profession taxpayers have special old/new regime switching
  rules involving Form 10-IEA.
- AY 2026--27 new-regime slabs begin with Nil up to ₹4 lakh and
  progress through 5%, 10%, 15%, 20%, 25% and 30% bands.
- The new-regime section 87A framework for AY 2026--27 uses the
  AY-specific ₹12 lakh total-income threshold / maximum rebate
  framework subject to statutory restrictions.
- Health & Education Cess remains 4% on income tax plus surcharge.
- 80TTA and 80TTB are separate taxpayer-specific interest deductions
  and are not unconditional deductions under both regimes.
- Current validation rules require additional supporting metadata for
  a number of deductions and schedules; the UI should collect that
  metadata only when relevant.

---

# Product Copy Principle

The final product should feel like this:

> "Tell us what happened this year. We'll work out the tax rules."

Not this:

> "Select Schedule S, Schedule HP, Schedule CG, Schedule VI-A and Part
> B-TTI."

The rules engine should be as rigorous as the tax form.

The interface should not feel like a tax form.
