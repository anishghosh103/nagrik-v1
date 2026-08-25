import type { PersonaSeed } from '../types/domain'
import { personaSeedSchema } from '../types/domain'

const baseTime = '2026-08-24T09:30:00.000Z'
const historyTime = '2025-11-18T08:10:00.000Z'

const ananya: PersonaSeed = {
  id: 'ananya', schemaVersion: 3,
  profile: { fullName: 'Ananya Sen', firstName: 'Ananya', city: 'Kolkata', maskedAadhaar: 'XXXX XXXX 1038', maskedPan: 'ANE•••42Q' },
  identity: {
    personaId: 'ananya', canonical: { name: 'Ananya Sen', mobile: '•••• ••4210', bankAccount: '•••• 4821' }, updatedAt: baseTime,
    valuesBySource: {
      AADHAAR: { name: 'Ananya Sen', mobile: '•••• ••4210' }, PAN: { name: 'Ananya Sen' }, BANK: { name: 'Ananya Sen', bankAccount: '•••• 4821' },
      EPFO: { name: 'Ananya Sen', mobile: '•••• ••4210', bankAccount: '•••• 4821' }, INCOME_TAX: { name: 'Ananya Sen', bankAccount: '•••• 4821' },
    },
  },
  epfo: {
    personaId: 'ananya', maskedUan: 'XXXX XXXX 2291', balance: 428650, bankAccount: '•••• 4821', aadhaarKyc: true, panKyc: true, bankKyc: true,
    employment: [
      { id: 'emp-a-1', memberId: 'WB/KOL/•••/019', employer: 'Jorasanko Learning Pvt Ltd', joinedOn: '2018-07-12', exitedOn: '2022-09-30', current: false, balance: 180000 },
      { id: 'emp-a-2', memberId: 'WB/KOL/•••/088', employer: 'Bengal Learning Studio', joinedOn: '2022-10-10', current: true, balance: 248650 },
    ],
    kyc: [
      { kind: 'AADHAAR', maskedValue: 'XXXX XXXX 1038', status: 'VALIDATED', updatedAt: baseTime },
      { kind: 'PAN', maskedValue: 'ANE•••42Q', status: 'VALIDATED', updatedAt: baseTime },
      { kind: 'BANK', maskedValue: 'Account ending 4821', status: 'VALIDATED', updatedAt: baseTime },
    ],
    passbook: { capturedAt: baseTime, employers: [
      { employmentId: 'emp-a-1', employer: 'Jorasanko Learning Pvt Ltd', openingBalance: 158400, contributions: [
        { id: 'a-2022-07', month: '2022-07-01', employee: 5400, employer: 3660, pension: 1740, status: 'POSTED' },
        { id: 'a-2022-08', month: '2022-08-01', employee: 5400, employer: 3660, pension: 1740, status: 'POSTED' },
      ] },
      { employmentId: 'emp-a-2', employer: 'Bengal Learning Studio', openingBalance: 226010, contributions: [
        { id: 'a-2026-05', month: '2026-05-01', employee: 5660, employer: 3910, pension: 1750, status: 'POSTED' },
        { id: 'a-2026-06', month: '2026-06-01', employee: 5660, employer: 3910, pension: 1750, status: 'POSTED' },
      ] },
    ] },
    claimHistory: [{ id: 'history-a-settled', personaId: 'ananya', reference: 'EPFO-HIST-A-01', type: 'FINAL_SETTLEMENT', amount: 42000, submittedAt: '2024-07-01T08:10:00.000Z', decidedAt: '2024-07-10T08:10:00.000Z', status: 'SETTLED', source: { system: 'EPFO', reference: 'EPFO-HIST-A-01', capturedAt: baseTime } }],
    nomination: { status: 'EFFECTIVE', nominees: [{ id: 'nom-a-1', name: 'Ishaan Sen', relationship: 'SPOUSE', dateOfBirth: '1992-03-14', share: 100 }], updatedAt: baseTime, reference: 'NOM-A-2291' },
    lastUpdatedAt: baseTime,
  },
  mismatches: [], identityChanges: [], actions: [],
  activity: [{ id: 'act-a-1', kind: 'SESSION', title: 'activity.events.identityChecked', detail: 'activity.events.identityHealthy', status: 'COMPLETE', occurredAt: baseTime }],
}

const rajesh: PersonaSeed = {
  id: 'rajesh', schemaVersion: 3,
  profile: { fullName: 'Rajesh Kumar', firstName: 'Rajesh', city: 'Pune', maskedAadhaar: 'XXXX XXXX 7712', maskedPan: 'RJK•••19M' },
  identity: {
    personaId: 'rajesh', canonical: { name: 'Rajesh Kumar', mobile: '•••• ••4210', bankAccount: '•••• 9032' }, updatedAt: baseTime,
    valuesBySource: {
      AADHAAR: { name: 'Rajesh Kumar', mobile: '•••• ••4210' }, PAN: { name: 'Rajesh K' }, BANK: { name: 'Rajesh Kumar Sharma', bankAccount: '•••• 9032' },
      EPFO: { name: 'Rajesh K.', mobile: '•••• ••9073', bankAccount: '•••• 9032' }, INCOME_TAX: { name: 'R Kumar', bankAccount: '•••• 9032' },
    },
  },
  epfo: {
    personaId: 'rajesh', maskedUan: 'XXXX XXXX 6473', balance: 312480, bankAccount: '•••• 9032', aadhaarKyc: true, panKyc: true, bankKyc: true,
    employment: [
      { id: 'emp-r-1', memberId: 'MH/PUN/•••/147', employer: 'Deccan Fabrication Works', joinedOn: '2016-06-01', exitedOn: '2025-05-31', current: false, balance: 196200 },
      { id: 'emp-r-2', memberId: 'MH/PUN/•••/312', employer: 'Mula Engineering Services', joinedOn: '2025-05-15', current: true, balance: 116280 },
    ],
    kyc: [
      { kind: 'AADHAAR', maskedValue: 'XXXX XXXX 7712', status: 'VALIDATED', updatedAt: baseTime },
      { kind: 'PAN', maskedValue: 'RJK•••19M', status: 'VALIDATED', updatedAt: baseTime },
      { kind: 'BANK', maskedValue: 'Account ending 9032', status: 'VALIDATED', updatedAt: baseTime },
    ],
    passbook: { capturedAt: baseTime, employers: [
      { employmentId: 'emp-r-1', employer: 'Deccan Fabrication Works', openingBalance: 175600, contributions: [
        { id: 'r-2025-03', month: '2025-03-01', employee: 5200, employer: 3440, pension: 1710, status: 'POSTED' },
        { id: 'r-2025-04', month: '2025-04-01', employee: 5200, employer: 3440, pension: 1710, status: 'POSTED' },
      ] },
      { employmentId: 'emp-r-2', employer: 'Mula Engineering Services', openingBalance: 101880, contributions: [
        { id: 'r-2026-05', month: '2026-05-01', employee: 4800, employer: 3200, pension: 1600, status: 'MISSING' },
        { id: 'r-2026-06', month: '2026-06-01', employee: 4800, employer: 3200, pension: 1600, status: 'POSTED' },
      ] },
    ] },
    contributionIssue: { employmentId: 'emp-r-2', contributionId: 'r-2026-05', category: 'MISSING_CONTRIBUTION', summary: 'May 2026 contribution is not shown as posted.' },
    claimHistory: [{ id: 'history-r-c15', personaId: 'rajesh', reference: 'EPFO-HIST-R-15', type: 'FINAL_SETTLEMENT', amount: 96000, submittedAt: historyTime, decidedAt: '2025-11-26T08:10:00.000Z', status: 'REJECTED', reasonCode: 'C15', reasonKey: 'epfo.history.c15Reason', source: { system: 'EPFO', reference: 'EPFO-HIST-R-15', capturedAt: baseTime } }],
    nomination: { status: 'NOT_STARTED', nominees: [], updatedAt: baseTime },
    lastUpdatedAt: baseTime,
  },
  mismatches: [{ id: 'mismatch-name', field: 'name', valuesBySource: { AADHAAR: 'Rajesh Kumar', PAN: 'Rajesh K', BANK: 'Rajesh Kumar Sharma', EPFO: 'Rajesh K.', INCOME_TAX: 'R Kumar' }, severity: 'BLOCKING', affectedServices: ['INCOME_TAX', 'EPFO'], status: 'OPEN' }],
  identityChanges: [], actions: [],
  activity: [{ id: 'act-r-1', kind: 'EPFO', title: 'activity.events.precheckAttention', detail: 'activity.events.nameBlocksClaim', status: 'INFO', occurredAt: baseTime }],
}

export const PERSONA_SEEDS: Record<'ananya' | 'rajesh', PersonaSeed> = {
  ananya: personaSeedSchema.parse(ananya) as PersonaSeed,
  rajesh: personaSeedSchema.parse(rajesh) as PersonaSeed,
}

export function cloneSeed(id: 'ananya' | 'rajesh'): PersonaSeed {
  return structuredClone(PERSONA_SEEDS[id])
}
