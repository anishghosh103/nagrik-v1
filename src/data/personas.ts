import type { PersonaSeed } from '../types/domain'
import { personaSeedSchema } from '../types/domain'

const baseTime = '2026-08-24T09:30:00.000Z'

const ananya: PersonaSeed = {
  id: 'ananya', schemaVersion: 1,
  profile: { fullName: 'Ananya Sen', firstName: 'Ananya', city: 'Kolkata', maskedAadhaar: 'XXXX XXXX 1038', maskedPan: 'ANE•••42Q' },
  identity: {
    personaId: 'ananya', canonical: { name: 'Ananya Sen', mobile: '•••• ••4210', bankAccount: '•••• 4821' }, updatedAt: baseTime,
    valuesBySource: {
      AADHAAR: { name: 'Ananya Sen', mobile: '•••• ••4210' }, PAN: { name: 'Ananya Sen' }, BANK: { name: 'Ananya Sen', bankAccount: '•••• 4821' },
      EPFO: { name: 'Ananya Sen', mobile: '•••• ••4210', bankAccount: '•••• 4821' }, INCOME_TAX: { name: 'Ananya Sen', bankAccount: '•••• 4821' },
    },
  },
  epfo: { personaId: 'ananya', maskedUan: 'XXXX XXXX 2291', balance: 428650, bankAccount: '•••• 4821', aadhaarKyc: true, panKyc: true, bankKyc: true, employment: [{ id: 'emp-a-1', employer: 'Jorasanko Learning Pvt Ltd', joinedOn: '2018-07-12', exitedOn: '2025-04-30' }], lastUpdatedAt: baseTime },
  mismatches: [], identityChanges: [], actions: [],
  activity: [{ id: 'act-a-1', kind: 'SESSION', title: 'Financial identity checked', detail: 'All connected records are consistent.', status: 'COMPLETE', occurredAt: baseTime }],
}

const rajesh: PersonaSeed = {
  id: 'rajesh', schemaVersion: 1,
  profile: { fullName: 'Rajesh Kumar', firstName: 'Rajesh', city: 'Pune', maskedAadhaar: 'XXXX XXXX 7712', maskedPan: 'RJK•••19M' },
  identity: {
    personaId: 'rajesh', canonical: { name: 'Rajesh Kumar', mobile: '•••• ••4210', bankAccount: '•••• 9032' }, updatedAt: baseTime,
    valuesBySource: {
      AADHAAR: { name: 'Rajesh Kumar', mobile: '•••• ••4210' }, PAN: { name: 'Rajesh K' }, BANK: { name: 'Rajesh Kumar Sharma', bankAccount: '•••• 9032' },
      EPFO: { name: 'Rajesh K.', mobile: '•••• ••9073', bankAccount: '•••• 9032' }, INCOME_TAX: { name: 'R Kumar', bankAccount: '•••• 9032' },
    },
  },
  epfo: { personaId: 'rajesh', maskedUan: 'XXXX XXXX 6473', balance: 312480, bankAccount: '•••• 9032', aadhaarKyc: true, panKyc: true, bankKyc: true, employment: [{ id: 'emp-r-1', employer: 'Deccan Fabrication Works', joinedOn: '2016-06-01', exitedOn: '2025-05-31' }], lastUpdatedAt: baseTime },
  mismatches: [{ id: 'mismatch-name', field: 'name', valuesBySource: { AADHAAR: 'Rajesh Kumar', PAN: 'Rajesh K', BANK: 'Rajesh Kumar Sharma', EPFO: 'Rajesh K.', INCOME_TAX: 'R Kumar' }, severity: 'BLOCKING', affectedServices: ['INCOME_TAX', 'EPFO'], status: 'OPEN' }],
  identityChanges: [], actions: [],
  activity: [{ id: 'act-r-1', kind: 'EPFO', title: 'PF claim pre-check needs attention', detail: 'A name mismatch is blocking the claim.', status: 'INFO', occurredAt: baseTime }],
}

export const PERSONA_SEEDS: Record<'ananya' | 'rajesh', PersonaSeed> = {
  ananya: personaSeedSchema.parse(ananya) as PersonaSeed,
  rajesh: personaSeedSchema.parse(rajesh) as PersonaSeed,
}

export function cloneSeed(id: 'ananya' | 'rajesh'): PersonaSeed {
  return structuredClone(PERSONA_SEEDS[id])
}
