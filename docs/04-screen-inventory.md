# Screen inventory

## How to use this catalogue

Screen IDs are canonical design identifiers, not a requirement for one URL per row. Presentation types are:

- **Route:** durable page with its own URL or journey state.
- **Step:** full-page guided-flow state, potentially sharing a route family.
- **Sheet:** desktop drawer or full-screen mobile bottom sheet.
- **Dialog:** short blocking confirmation or error.
- **State:** variant of the current page rather than separate navigation.
- **Action:** an operation launched from the current view rather than another rendered page.

Delivery tiers are **Submission**, **Core**, and **Expansion**. Submission is the narrow hackathon path; Core completes the central product; Expansion adds broader scenarios.

## Entry and authentication

| ID  | Experience               | Purpose                                                                      | Type   | Tier       |
| --- | ------------------------ | ---------------------------------------------------------------------------- | ------ | ---------- |
| G01 | Splash and restore       | Restore session, persona, cache, and draft without a blank screen.           | State  | Submission |
| G02 | Welcome                  | Introduce one financial identity and two services.                           | Route  | Submission |
| G03 | Prototype disclosure     | Explain simulated data, authentication, integration, and privacy boundaries. | Step   | Submission |
| G04 | Choose demo persona      | Select Ananya or Rajesh and preview the scenario.                            | Sheet  | Submission |
| G05 | Mock Aadhaar login       | Use visible fictional credentials.                                           | Step   | Submission |
| G06 | OTP verification         | Handle six-digit OTP, expiry, resend, and masked destination.                | Step   | Submission |
| G07 | Login or session error   | Recover from invalid OTP, expiry, or unavailable mock service.               | State  | Submission |
| G08 | Restore previous session | Continue saved work or start from seed state.                                | Dialog | Submission |

## Unified Home and activity

| ID  | Experience          | Purpose                                                            | Type  | Tier       |
| --- | ------------------- | ------------------------------------------------------------------ | ----- | ---------- |
| H01 | Unified Home        | Prioritize blockers, identity health, services, and recent events. | Route | Submission |
| H02 | All services        | Present Income Tax and EPFO tasks in citizen language.             | Route | Core       |
| H03 | Action Centre       | Prioritized cross-service work list.                               | Route | Submission |
| H04 | Action detail       | Explain impact, deadline, source, and one next action.             | Route | Submission |
| H05 | Unified Status Feed | Combine identity, tax, EPFO, and grievance events.                 | Route | Submission |
| H06 | Status event detail | Show event meaning, history, related record, and next event.       | Sheet | Core       |
| H07 | Notifications       | Show meaningful deadlines, updates, and alerts.                    | Route | Core       |
| H08 | Search              | Find services, actions, records, statuses, and help.               | Route | Expansion  |

## Shared financial identity

| ID  | Experience                  | Purpose                                                       | Type  | Tier       |
| --- | --------------------------- | ------------------------------------------------------------- | ----- | ---------- |
| I01 | Financial Identity overview | Summarize identity health, sources, and recent changes.       | Route | Submission |
| I02 | Identity Health Check       | Compare Aadhaar, PAN, bank, EPFO, and tax-profile values.     | Route | Submission |
| I03 | Mismatch detail             | Explain conflicting values and downstream consequences.       | Route | Submission |
| I04 | Choose correct value        | Select or enter the canonical value.                          | Step  | Submission |
| I05 | Correction requirements     | Collect only relevant verification or supporting information. | Step  | Core       |
| I06 | Review propagation          | Show precisely which simulated systems will be affected.      | Step  | Submission |
| I07 | Correction in progress      | Show per-system asynchronous propagation.                     | State | Submission |
| I08 | Correction result           | Separate updated, queued, and failed system results.          | Route | Submission |
| I09 | Identity change receipt     | Provide what changed, when, source, and destinations.         | Route | Core       |
| I10 | Identity change history     | List previous corrections and propagation outcomes.           | Route | Core       |
| I11 | Connected records           | List linked sources and verification states.                  | Route | Core       |
| I12 | Data source detail          | Explain supplied data, freshness, and refresh state.          | Sheet | Core       |

## Income Tax service landing

| ID  | Experience               | Purpose                                                        | Type  | Tier       |
| --- | ------------------------ | -------------------------------------------------------------- | ----- | ---------- |
| T01 | Income Tax Home          | Show draft, current outcome, refund, notices, and actions.     | Route | Submission |
| T02 | Choose assessment year   | Select a supported year with corresponding financial year.     | Sheet | Core       |
| T03 | Return and draft history | List draft, filed, verified, and processed returns.            | Route | Core       |
| T04 | Existing draft detail    | Continue, inspect, or explicitly discard a draft.              | Route | Submission |
| T05 | Filed return detail      | Show acknowledgment, route, regime, outcome, and verification. | Route | Core       |
| T06 | Tax data sources         | List Form 16, AIS, Form 26AS, and payment snapshots.           | Route | Core       |
| T07 | Filing support boundary  | Explain supported, advanced, and unsupported handling.         | Route | Submission |

## Guided filing: setup and income discovery

| ID   | Experience              | Purpose                                                               | Type  | Tier       |
| ---- | ----------------------- | --------------------------------------------------------------------- | ----- | ---------- |
| A00  | Filing entry            | Confirm identity, AY, filing type, and draft state.                   | Step  | Submission |
| A01  | About you               | Collect residency and eligibility facts without form terminology.     | Step  | Submission |
| A01A | Residency helper        | Guide “I’m not sure” to a supported determination.                    | Step  | Core       |
| A01B | Special circumstances   | Ask about director status, foreign interests, losses, and complexity. | Step  | Core       |
| A01C | Filing path result      | Confirm that Nagrik selected a path; optionally disclose the form.    | State | Submission |
| A01D | Unsupported case        | Explain why accurate guided filing cannot continue and preserve data. | Route | Submission |
| A02  | Income-source discovery | Ask what happened during the year with detected sources preselected.  | Step  | Submission |
| A02A | Other-income classifier | Classify an unlisted source rather than accepting a blind amount.     | Step  | Core       |
| A02B | Detected-income review  | Resolve source records that contradict the user's selections.         | Step  | Submission |

## Guided filing: salary and pension

| ID   | Experience                  | Purpose                                                        | Type  | Tier       |
| ---- | --------------------------- | -------------------------------------------------------------- | ----- | ---------- |
| A03  | Salary and pension overview | List multiple employer and pension sources.                    | Step  | Submission |
| A03A | Salary source review        | Review salary components, exemptions, NPS, and TDS.            | Step  | Submission |
| A03B | Add or edit employer        | Enter employer and salary information.                         | Sheet | Core       |
| A03C | Salary exemptions           | Collect HRA and other relevant regime-aware details.           | Sheet | Core       |
| A03D | Pension source review       | Distinguish normal pension from family pension.                | Step  | Core       |
| A03E | Form 16 detail              | Show imported fields and provenance.                           | Sheet | Submission |
| A03F | Salary difference review    | Resolve a material difference without silently overwriting it. | Step  | Core       |

## Guided filing: house property

| ID   | Experience              | Purpose                                                      | Type  | Tier |
| ---- | ----------------------- | ------------------------------------------------------------ | ----- | ---- |
| A04  | Property overview       | List supported properties and their computed outcomes.       | Step  | Core |
| A04A | Property details        | Collect address, ownership, use, and co-ownership.           | Step  | Core |
| A04B | Rental income           | Collect rent, unrealized rent, and municipal taxes.          | Step  | Core |
| A04C | Home-loan details       | Progressively collect interest and required lender metadata. | Step  | Core |
| A04D | Property calculation    | Explain property income or loss.                             | Step  | Core |
| A04E | Property-loss treatment | Explain used and carried-forward amounts by regime.          | Sheet | Core |
| A04F | Property route change   | Preserve data when count or complexity changes route.        | State | Core |

## Guided filing: capital gains

| ID   | Experience             | Purpose                                                         | Type  | Tier      |
| ---- | ---------------------- | --------------------------------------------------------------- | ----- | --------- |
| A05  | Capital-gains overview | List detected, imported, and entered disposals.                 | Step  | Expansion |
| A05A | Choose asset type      | Select shares, funds, property, gold, or another asset.         | Step  | Expansion |
| A05B | Transaction detail     | Collect acquisition, disposal, cost, expense, and identifiers.  | Step  | Expansion |
| A05C | AIS sale review        | Confirm cost and other information AIS cannot establish.        | Step  | Core      |
| A05D | Gain calculation       | Explain holding period, section, rate bucket, and taxable gain. | Step  | Expansion |
| A05E | Capital-loss treatment | Explain set-off and carry-forward.                              | Sheet | Expansion |
| A05F | Unsupported asset      | Move safely to an advanced or unsupported route.                | State | Core      |

## Guided filing: business and profession

| ID   | Experience                | Purpose                                                         | Type  | Tier      |
| ---- | ------------------------- | --------------------------------------------------------------- | ----- | --------- |
| A06  | Work-type classification  | Identify profession, business, agency, or goods carriage.       | Step  | Expansion |
| A06A | Activity detail           | Determine whether the activity can use presumptive rules.       | Step  | Expansion |
| A06B | Receipts and turnover     | Collect actual total, cash, and non-cash amounts.               | Step  | Expansion |
| A06C | Presumptive eligibility   | Explain eligible route and governing conditions.                | Step  | Expansion |
| A06D | Presumptive-income review | Show the AY-specific calculation.                               | Step  | Expansion |
| A06E | Lower-profit warning      | Route declarations requiring books or audit to advanced filing. | State | Expansion |
| A06F | Regime history            | Collect Form 10-IEA and prior regime information.               | Step  | Expansion |
| A06G | Advanced business route   | Preserve data and provide a clear handoff.                      | Route | Expansion |

## Guided filing: other and exempt income

| ID   | Experience                      | Purpose                                                         | Type  | Tier       |
| ---- | ------------------------------- | --------------------------------------------------------------- | ----- | ---------- |
| A07  | Other-income overview           | List interest, dividends, family pension, and ordinary sources. | Step  | Submission |
| A07A | Income-source detail            | Review payer, amount, TDS, and source.                          | Sheet | Submission |
| A07B | Add other income                | Add a supported source manually.                                | Sheet | Core       |
| A07C | AIS mismatch detail             | Explain the reported value and suspected classification.        | Step  | Submission |
| A07D | Reclassify AIS entry            | Send an item to the correct income section with data preserved. | Step  | Submission |
| A07E | Dispute AIS entry               | Retain a visible disputed item in review and status.            | Step  | Submission |
| A07F | Interest-deduction explanation  | Explain potential 80TTA or 80TTB treatment by regime.           | Sheet | Core       |
| A08  | Exempt-income overview          | Keep exempt and taxable income visibly separate.                | Step  | Core       |
| A08A | Agricultural-income detail      | Determine thresholds, route, and partial integration.           | Step  | Core       |
| A08B | Other exempt income             | Enter implemented exempt-income categories.                     | Sheet | Core       |
| A08C | Partial-integration explanation | Explain when agricultural income affects tax.                   | Sheet | Expansion  |

## Guided filing: deductions

| ID   | Experience                       | Purpose                                                  | Type  | Tier       |
| ---- | -------------------------------- | -------------------------------------------------------- | ----- | ---------- |
| A09  | Tax-saving payments              | Discover deductions through life events.                 | Step  | Submission |
| A09A | 80C investments                  | Review PF, PPF, insurance, ELSS, tuition, and principal. | Step  | Submission |
| A09B | Personal NPS                     | Handle 80CCD(1) and 80CCD(1B).                           | Step  | Core       |
| A09C | Employer NPS                     | Handle 80CCD(2) separately.                              | Step  | Core       |
| A09D | Health insurance                 | Collect 80D family, age, and policy facts.               | Step  | Submission |
| A09E | Education loan                   | Collect 80E information.                                 | Sheet | Core       |
| A09F | Donations                        | Collect donee, payment, and qualification metadata.      | Step  | Core       |
| A09G | Rent without HRA                 | Determine 80GG eligibility and Form 10BA requirements.   | Step  | Core       |
| A09H | Disability and medical treatment | Handle 80DD, 80DDB, and 80U progressively.               | Step  | Expansion  |
| A09I | Additional deductions            | Select only deductions implemented by the rules layer.   | Step  | Expansion  |
| A09J | Deduction-cap explanation        | Preserve entered and allowed values and explain the cap. | Sheet | Submission |
| A09K | Deduction regime treatment       | Compare each claim's old/new availability.               | Sheet | Submission |

## Guided filing: tax credits and payment

| ID   | Experience              | Purpose                                                   | Type  | Tier       |
| ---- | ----------------------- | --------------------------------------------------------- | ----- | ---------- |
| A10  | Tax already paid        | Reconcile TDS, TCS, advance tax, and self-assessment tax. | Step  | Submission |
| A10A | Salary TDS detail       | Match employer credit with salary.                        | Sheet | Submission |
| A10B | Other TDS detail        | Match non-salary credit with the corresponding receipt.   | Sheet | Core       |
| A10C | TCS detail              | Review collector-level credit.                            | Sheet | Core       |
| A10D | Advance-tax challan     | Review or enter required identifiers and amount.          | Sheet | Core       |
| A10E | Self-assessment challan | Review or enter payment details.                          | Sheet | Core       |
| A10F | Tax-credit mismatch     | Resolve missing income, duplication, or excess claims.    | Step  | Submission |
| A10G | Outstanding-tax payment | Simulate the required payment before filing.              | Step  | Core       |
| A10H | Payment result          | Confirm credit and trigger recomputation.                 | State | Core       |

## Guided filing: regime, bank, and calculation

| ID   | Experience                    | Purpose                                                           | Type  | Tier       |
| ---- | ----------------------------- | ----------------------------------------------------------------- | ----- | ---------- |
| A11  | Old versus new regime         | Compare complete legal outcomes and recommend savings.            | Step  | Submission |
| A11A | Regime calculation detail     | Show tax, deductions, rebate, surcharge, and cess.                | Sheet | Submission |
| A11B | Regime difference explanation | Explain the items responsible for the difference.                 | Sheet | Submission |
| A11C | Switching restriction         | Explain business-user Form 10-IEA constraints.                    | State | Expansion  |
| A12  | Bank accounts                 | Review known accounts and validation status.                      | Step  | Submission |
| A12A | Add bank account              | Enter masked account information and IFSC.                        | Step  | Core       |
| A12B | Validate bank account         | Show validation and PAN-linkage results.                          | State | Submission |
| A12C | Select refund account         | Nominate an eligible validated account.                           | Step  | Submission |
| A12D | Bank identity mismatch        | Link directly to identity correction.                             | State | Submission |
| A13  | Final tax summary             | Explain income, deductions, tax, credits, and outcome.            | Step  | Submission |
| A13A | Income breakdown              | Show heads, adjustments, and set-off.                             | Sheet | Submission |
| A13B | Deduction breakdown           | Distinguish applied and unused claims.                            | Sheet | Submission |
| A13C | Tax breakdown                 | Show normal, special, rebate, surcharge, cess, interest, and fee. | Sheet | Submission |
| A13D | Tax-credit breakdown          | Explain every credit used after liability.                        | Sheet | Submission |
| A13E | Losses and carry-forward      | Explain current use and future preservation.                      | Sheet | Core       |

## Guided filing: validation and completion

| ID   | Experience              | Purpose                                                         | Type   | Tier       |
| ---- | ----------------------- | --------------------------------------------------------------- | ------ | ---------- |
| A14  | One last check          | Group ready and needs-attention validation results.             | Step   | Submission |
| A14A | Validation issue detail | Explain one issue with one “Fix this” action.                   | Sheet  | Submission |
| A15  | Declaration             | Capture declaration and required representative capacity.       | Step   | Submission |
| A15A | Verification method     | Select implemented verification; recommend mock Aadhaar OTP.    | Step   | Submission |
| A15B | E-verification OTP      | Handle destination, send, expiry, resend, and entry.            | Step   | Submission |
| A15C | Filing in progress      | Separate filing and verification stages.                        | State  | Submission |
| A15D | Filing failed           | Explain the failed stage and safe retry.                        | State  | Submission |
| A15E | Verification pending    | Make clear that filing is not fully complete.                   | Route  | Core       |
| A16  | Filing confirmation     | Show acknowledgment, result, regime, account, and next actions. | Route  | Submission |
| A16A | Filed return snapshot   | Show frozen input, computation, and rules version.              | Route  | Core       |
| A16B | Download acknowledgment | Generate or display the fictional acknowledgment.               | Action | Submission |

## Post-filing Income Tax support

| ID  | Experience                 | Purpose                                                    | Type  | Tier      |
| --- | -------------------------- | ---------------------------------------------------------- | ----- | --------- |
| P01 | Return-status tracker      | Translate filing through processing into a timeline.       | Route | Core      |
| P02 | Return-status detail       | Explain current status and next expected event.            | Sheet | Core      |
| P03 | Refund tracker             | Show amount, bank, cause, and expected progress.           | Route | Core      |
| P04 | Refund-delay detail        | Explain bank mismatch or processing delay and action.      | Route | Core      |
| P05 | Tax-demand detail          | Explain a demand and its origin.                           | Route | Core      |
| P06 | Notices inbox              | List active and resolved notices with deadlines.           | Route | Core      |
| P07 | Notice upload or import    | Add a simulated notice for parsing.                        | Step  | Core      |
| A17 | About this notice          | Translate 139(9) or 143(1) into one required action.       | Route | Core      |
| P08 | Notice discrepancy         | Compare filed and department values line by line.          | Sheet | Core      |
| P09 | Notice remedy              | Present the system-decided refile, pay, or rectify action. | Step  | Core      |
| P10 | Fix and refile             | Reopen the exact affected section prefilled.               | Step  | Core      |
| P11 | Rectification review       | Review a recognized section 154 request.                   | Step  | Expansion |
| P12 | Rectification confirmation | Confirm request and tracking state.                        | Route | Expansion |
| P13 | ITR-U cost warning         | Show eligibility and escalating additional-tax cost.       | Step  | Expansion |
| P14 | Notice-resolution status   | Resolve only after corrective action completes.            | Route | Core      |

## EPFO landing and profile

| ID  | Experience              | Purpose                                                       | Type  | Tier |
| --- | ----------------------- | ------------------------------------------------------------- | ----- | ---- |
| E01 | EPFO Home               | Summarize balance, claim, KYC, and priority action.           | Route | Core |
| E02 | What do you want to do? | Present withdrawal, transfer, passbook, and nomination tasks. | Route | Core |
| E03 | EPFO profile            | Show fictional UAN, employment, KYC, and bank.                | Route | Core |
| E04 | Employment history      | List employers, join dates, and exit dates.                   | Route | Core |
| E05 | EPFO KYC status         | Show Aadhaar, PAN, and bank validation.                       | Route | Core |
| E06 | EPFO service history    | List claims, transfers, nominations, and grievances.          | Route | Core |

## PF withdrawal

| ID  | Experience                | Purpose                                                       | Type  | Tier |
| --- | ------------------------- | ------------------------------------------------------------- | ----- | ---- |
| C01 | Choose withdrawal type    | Select a supported citizen goal.                              | Step  | Core |
| C02 | Claim eligibility         | Determine legal and service eligibility before claim entry.   | Step  | Core |
| C03 | Claim pre-validation      | Run named identity, KYC, bank, and service rules.             | Step  | Core |
| C04 | Validation result         | Separate passed and failed checks.                            | Step  | Core |
| C05 | Claim-issue detail        | Explain one failed rule and its consequence.                  | Sheet | Core |
| C06 | Fix claim issue           | Launch the relevant identity, bank, or employment correction. | Step  | Core |
| C07 | Claim details             | Collect amount, reason, and required information.             | Step  | Core |
| C08 | Bank confirmation         | Confirm the validated destination account.                    | Step  | Core |
| C09 | Claim readiness           | Show a transparent checklist, not a guarantee.                | Step  | Core |
| C10 | Claim review              | Review claim, checks, bank, and declaration.                  | Step  | Core |
| C11 | Claim declaration and OTP | Confirm and mock e-verify.                                    | Step  | Core |
| C12 | Submission progress       | Show asynchronous stages and retry state.                     | State | Core |
| C13 | Claim confirmation        | Show reference and expected timeline.                         | Route | Core |
| C14 | Claim-status tracker      | Translate claim events into plain language.                   | Route | Core |
| C15 | Rejected-claim detail     | Explain a prior rejection and correction.                     | Route | Core |

## PF transfer

| ID  | Experience                   | Purpose                                     | Type  | Tier      |
| --- | ---------------------------- | ------------------------------------------- | ----- | --------- |
| D01 | Transfer introduction        | Explain transfer purpose and prerequisites. | Step  | Expansion |
| D02 | Select previous employment   | Choose the source member record.            | Step  | Expansion |
| D03 | Select current employment    | Choose the destination record.              | Step  | Expansion |
| D04 | Employment-date check        | Detect overlaps and missing exit dates.     | Step  | Expansion |
| D05 | Transfer validation          | Check identity, KYC, bank, and history.     | Step  | Expansion |
| D06 | Fix transfer issue           | Correct the specific failed source record.  | Step  | Expansion |
| D07 | Transfer review              | Review employers and transferable balance.  | Step  | Expansion |
| D08 | Transfer declaration and OTP | Confirm and mock e-verify.                  | Step  | Expansion |
| D09 | Transfer confirmation        | Show reference and timeline.                | Route | Expansion |
| D10 | Transfer status              | Track employer and EPFO stages.             | Route | Expansion |

## Passbook and balance

| ID  | Experience              | Purpose                                          | Type  | Tier      |
| --- | ----------------------- | ------------------------------------------------ | ----- | --------- |
| E10 | PF balance              | Show cached balance immediately with timestamp.  | Route | Core      |
| E11 | Passbook                | Show contribution history by employer.           | Route | Core      |
| E12 | Monthly contributions   | Present employee, employer, and pension amounts. | Route | Core      |
| E13 | Contribution detail     | Explain one contribution or adjustment.          | Sheet | Core      |
| E14 | Employer balance        | Summarize one employment record.                 | Route | Core      |
| E15 | Passbook refreshing     | Retain cache during background refresh.          | State | Core      |
| E16 | Passbook refresh failed | Preserve data and offer retry.                   | State | Core      |
| E17 | Contribution mismatch   | Start a categorized resolution or grievance.     | Route | Expansion |

## Nomination

| ID  | Experience              | Purpose                                          | Type  | Tier      |
| --- | ----------------------- | ------------------------------------------------ | ----- | --------- |
| N01 | Nomination status       | Show whether an effective nomination exists.     | Route | Expansion |
| N02 | Nominee list            | Add, edit, and remove nominees.                  | Step  | Expansion |
| N03 | Nominee details         | Collect relevant identity and relationship data. | Step  | Expansion |
| N04 | Share allocation        | Allocate percentage across nominees.             | Step  | Expansion |
| N05 | Allocation validation   | Require an exact 100% total.                     | State | Expansion |
| N06 | Nomination review       | Review nominees and shares.                      | Step  | Expansion |
| N07 | Nomination verification | Mock e-verify the nomination.                    | Step  | Expansion |
| N08 | Nomination confirmation | Show effective or pending status.                | Route | Expansion |

## Unified grievances

| ID  | Experience             | Purpose                                                   | Type  | Tier      |
| --- | ---------------------- | --------------------------------------------------------- | ----- | --------- |
| R01 | Grievance Centre       | Combine tax, EPFO, and identity cases.                    | Route | Core      |
| R02 | Grievance detail       | Show submitted information, updates, and current meaning. | Route | Core      |
| R03 | Choose service         | Identify tax, EPFO, or cross-service issue.               | Step  | Core      |
| R04 | Describe the problem   | Capture normal-language description.                      | Step  | Core      |
| R05 | Suggested category     | Recommend a category with explanation.                    | Step  | Core      |
| R06 | Add evidence           | Attach fictional supporting material when relevant.       | Step  | Core      |
| R07 | Grievance review       | Review category, narrative, evidence, and contact data.   | Step  | Core      |
| R08 | Grievance confirmation | Show reference and expected response.                     | Route | Core      |
| R09 | Grievance timeline     | Translate technical case statuses.                        | Route | Core      |
| R10 | Reopen or escalate     | Handle an unresolved or incorrectly closed case.          | Step  | Expansion |

## Profile, settings, and help

| ID  | Experience                 | Purpose                                              | Type   | Tier       |
| --- | -------------------------- | ---------------------------------------------------- | ------ | ---------- |
| S01 | Profile                    | Summarize citizen and connected services.            | Route  | Submission |
| S02 | Personal information       | Review name, DOB, masked PAN, and Aadhaar.           | Route  | Core       |
| S03 | Contact information        | Compare mobile and email across systems.             | Route  | Core       |
| S04 | Bank accounts              | Manage known accounts outside a service flow.        | Route  | Core       |
| S05 | Connected services         | Show simulated connection and refresh state.         | Route  | Core       |
| S06 | Language                   | Choose English, Hindi, or Bengali.                   | Sheet  | Submission |
| S07 | Accessibility              | Control supported presentation preferences.          | Route  | Core       |
| S08 | Notification preferences   | Configure meaningful alerts.                         | Route  | Expansion  |
| S09 | Privacy and data use       | Explain local persistence and fictional data.        | Route  | Submission |
| S10 | Session and security       | Show mock session information and sign out.          | Route  | Core       |
| S11 | Reset demo data            | Restore selected persona's seed state.               | Action | Submission |
| S12 | Reset confirmation         | Explain exactly what will be removed.                | Dialog | Submission |
| S13 | About Nagrik               | State purpose, prototype status, and limitations.    | Route  | Submission |
| L01 | Help Centre                | Search by task and outcome.                          | Route  | Core       |
| L02 | Help article               | Explain a single topic in plain language.            | Route  | Core       |
| L03 | Tax terms                  | Explain essential tax concepts secondarily.          | Route  | Core       |
| L04 | EPFO terms                 | Explain UAN, KYC, claims, transfers, and passbook.   | Route  | Core       |
| L05 | Data-source explainer      | Explain Form 16, AIS, Form 26AS, and EPFO records.   | Route  | Core       |
| L06 | Contact and escalation     | Route to the relevant grievance or official channel. | Route  | Core       |
| L07 | Frequently asked questions | Cover prototype behavior and common concerns.        | Route  | Core       |

## Shared system states

| ID  | Experience               | Purpose                                                   | Type   | Tier       |
| --- | ------------------------ | --------------------------------------------------------- | ------ | ---------- |
| X01 | Offline                  | Show cache, pending actions, and limitations.             | State  | Submission |
| X02 | Service unavailable      | Preserve last-known information and retry safely.         | State  | Submission |
| X03 | Queued-action detail     | Explain what will retry and prevent duplicate submission. | Sheet  | Core       |
| X04 | Sync conflict            | Resolve local draft versus refreshed source data.         | Step   | Core       |
| X05 | Rules updated            | Explain recalculation and sections requiring review.      | State  | Core       |
| X06 | Draft recovery           | Restore interrupted work.                                 | Dialog | Submission |
| X07 | Not found                | Recover from invalid or stale links.                      | Route  | Core       |
| X08 | Unexpected error         | Offer safe retry, home, and reset options.                | State  | Submission |
| X09 | Consent required         | Explain data access required for an action.               | Step   | Core       |
| X10 | Destructive confirmation | Confirm deletion, reset, or removal.                      | Dialog | Submission |

## Consolidation guidance

The catalogue represents screen-level experiences, not the recommended routed-page count. A practical build should consolidate short editors and explanations into sheets. The submission can remain coherent with approximately 25–30 routed pages while preserving these states and behaviors through shared templates.
