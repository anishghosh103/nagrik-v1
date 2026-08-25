import type { ClaimValidation, PersonaSeed, RuleResult, TransferValidation } from '../types/domain'

export function validatePFClaim(seed: PersonaSeed): ClaimValidation {
  const hasNameMismatch = seed.mismatches.some((m) => m.field === 'name' && m.status !== 'RESOLVED')
  const employment = seed.epfo.employment[0]
  const rules: RuleResult[] = [
    { code: 'NAME_MATCH', passed: !hasNameMismatch, severity: 'BLOCKING', messageKey: hasNameMismatch ? 'rules.name.fail' : 'rules.name.pass', sourceRefs: ['Identity record', 'EPFO profile'], fixTarget: hasNameMismatch ? '/identity/mismatch/mismatch-name' : undefined },
    { code: 'PAN_KYC_VALID', passed: seed.epfo.panKyc, severity: 'BLOCKING', messageKey: 'rules.pan.pass', sourceRefs: ['EPFO KYC'] },
    { code: 'AADHAAR_KYC_VALID', passed: seed.epfo.aadhaarKyc, severity: 'BLOCKING', messageKey: 'rules.aadhaar.pass', sourceRefs: ['EPFO KYC'] },
    { code: 'BANK_KYC_MATCH', passed: seed.epfo.bankKyc, severity: 'BLOCKING', messageKey: 'rules.bank.pass', sourceRefs: ['EPFO bank KYC'] },
    { code: 'SERVICE_EXIT_PRESENT', passed: Boolean(employment?.exitedOn), severity: 'BLOCKING', messageKey: 'rules.exit.pass', sourceRefs: ['Service history'] },
    { code: 'DATE_OVERLAP', passed: true, severity: 'WARNING', messageKey: 'rules.overlap.pass', sourceRefs: ['Service history'] },
    { code: 'CLAIM_ELIGIBILITY', passed: Boolean(employment?.exitedOn), severity: 'BLOCKING', messageKey: 'rules.eligibility.pass', sourceRefs: ['Employment record'] },
  ]
  return { type: 'FINAL_SETTLEMENT', ready: rules.every((rule) => rule.passed || rule.severity !== 'BLOCKING'), checkedAt: new Date().toISOString(), results: rules }
}

export function validatePFTransfer(seed: PersonaSeed, sourceEmploymentId: string, destinationEmploymentId: string): TransferValidation {
  const source = seed.epfo.employment.find((item) => item.id === sourceEmploymentId)
  const destination = seed.epfo.employment.find((item) => item.id === destinationEmploymentId)
  const hasNameMismatch = seed.mismatches.some((mismatch) => mismatch.field === 'name' && mismatch.status !== 'RESOLVED')
  const hasOverlap = Boolean(source?.exitedOn && destination && new Date(destination.joinedOn) <= new Date(source.exitedOn))
  const results: RuleResult[] = [
    { code: 'TRANSFER_EMPLOYMENTS_SELECTED', passed: Boolean(source && destination && source.id !== destination.id), severity: 'BLOCKING', messageKey: source && destination && source.id !== destination.id ? 'rules.transfer.selectionPass' : 'rules.transfer.selectionFail', sourceRefs: ['EPFO employment history'], fixTarget: '/epfo/transfer' },
    { code: 'SERVICE_EXIT_PRESENT', passed: Boolean(source?.exitedOn), severity: 'BLOCKING', messageKey: source?.exitedOn ? 'rules.exit.pass' : 'rules.exit.fail', sourceRefs: ['EPFO service history'], fixTarget: source ? `/epfo/employment?fix=${source.id}` : '/epfo/employment' },
    { code: 'DATE_OVERLAP', passed: !hasOverlap, severity: 'BLOCKING', messageKey: hasOverlap ? 'rules.overlap.fail' : 'rules.overlap.pass', sourceRefs: ['EPFO service history'], fixTarget: source ? `/epfo/employment?fix=${source.id}` : '/epfo/employment' },
    { code: 'NAME_MATCH', passed: !hasNameMismatch, severity: 'BLOCKING', messageKey: hasNameMismatch ? 'rules.name.fail' : 'rules.name.pass', sourceRefs: ['Identity record', 'EPFO profile'], fixTarget: hasNameMismatch ? '/identity/mismatch/mismatch-name' : undefined },
    { code: 'AADHAAR_KYC_VALID', passed: seed.epfo.aadhaarKyc, severity: 'BLOCKING', messageKey: 'rules.aadhaar.pass', sourceRefs: ['EPFO KYC'], fixTarget: '/epfo/kyc' },
    { code: 'PAN_KYC_VALID', passed: seed.epfo.panKyc, severity: 'BLOCKING', messageKey: 'rules.pan.pass', sourceRefs: ['EPFO KYC'], fixTarget: '/epfo/kyc' },
  ]
  return { ready: results.every((rule) => rule.passed || rule.severity !== 'BLOCKING'), checkedAt: new Date().toISOString(), results }
}

export function validateNomineeAllocation(shares: number[]) {
  const total = shares.reduce((sum, share) => sum + share, 0)
  return { total, valid: shares.length > 0 && total === 100 }
}
