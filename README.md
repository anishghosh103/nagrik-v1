# Nagrik

Nagrik is a mobile-first prototype for one shared financial identity across guided Income Tax and EPFO services. It helps citizens identify cross-system mismatches, correct information once, understand ordinary tax and PF tasks in plain language, and track actions and statuses in one place.

Nagrik is not an official government product. Authentication, Aadhaar OTP, PAN, bank, Income Tax, EPFO, filing, payment, claim, and propagation interactions are simulated with fictional data.

## Documentation

The canonical product and implementation guidance begins at [docs/README.md](./docs/README.md). It includes:

- Product definition and scope
- Personas and end-to-end journeys
- Information architecture and comprehensive screen inventory
- Responsive layout and visual design system
- UX, localization, and accessibility standards
- Technical architecture, delivery phases, and acceptance criteria

## Development

Requirements: a current Node.js version supported by Vite and pnpm.

```bash
pnpm install
pnpm dev
```

Additional checks:

```bash
pnpm lint
pnpm build
```

## Current state

The repository currently contains the React, TypeScript, and Vite application foundation plus the complete planning documentation. Runtime screens and domain logic remain to be implemented.
