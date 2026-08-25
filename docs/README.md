# Nagrik product documentation

This directory is the canonical product, experience, and implementation guide for Nagrik: a mobile-first prototype that combines a shared financial-identity layer with guided Income Tax and EPFO services.

Nagrik is not an official government product. All Aadhaar, PAN, bank, tax, EPFO, OTP, claim, and payment information used by the prototype must be fictional.

## Recommended reading order

1. [Product definition](./01-product-definition.md) — problem, proposition, scope, and success criteria.
2. [Personas and user journeys](./02-personas-and-user-journeys.md) — intended users and end-to-end experiences.
3. [Information architecture](./03-information-architecture.md) — navigation, hierarchy, and service boundaries.
4. [Screen inventory](./04-screen-inventory.md) — canonical catalogue of screens and screen-level experiences.
5. [Layout and responsive structure](./05-layout-and-responsive-structure.md) — application shell and page templates.
6. [Visual design system](./06-visual-design-system.md) — visual direction, tokens, and component language.
7. [UX, content, and accessibility](./07-ux-content-accessibility.md) — interaction and writing standards.
8. [Technical architecture](./08-technical-architecture.md) — frontend structure, rules engines, state, and service boundary.
9. [Delivery plan and acceptance](./09-delivery-plan-and-acceptance.md) — priorities, definition of done, and quality gates.
10. [Comprehensive development plan](./10-development-plan.md) — dependency-ordered implementation workstreams with required references for every section.

## Source material and precedence

This set synthesizes two planning sources:

- `Nagrik-PRD.md`, which defines the cross-service product, identity layer, personas, EPFO scope, prototype architecture, and hackathon constraints.
- `Flow-A-ITR-Filing-Spec-Revised-AY-2026-27.md`, which defines the guided Income Tax journey, supported-case boundaries, screen behavior, computation pipeline, filing routes, and validation requirements.

When requirements conflict, use this order:

1. Accuracy and safety requirements in the revised ITR specification.
2. Explicit prototype boundaries and non-goals in the Nagrik PRD.
3. The consolidated decisions in this documentation set.
4. Visual examples, which are illustrative rather than legal or tax authority.

Tax rules, thresholds, eligibility conditions, schemas, and validation packages must be verified against official AY-specific sources before any filing-capable release. This documentation does not itself constitute tax advice.

## Requirement language

- **Must**: required for a supported journey to be considered complete.
- **Should**: recommended product or design behavior; deviations require a reason.
- **May**: optional or dependent on delivery scope.
- **Prototype**: simulated locally and disclosed to the user.
- **Production**: requires authenticated government or financial-system integration and is not claimed by the prototype.

## Canonical identifiers

Screen IDs in the screen inventory are stable design identifiers. They do not require one URL per ID: a screen-level experience may be implemented as a route, full-screen mobile step, drawer, sheet, or dialog as specified. Filing-route names, validation severities, section states, and notice states in the architecture guide are also canonical shared terminology.
