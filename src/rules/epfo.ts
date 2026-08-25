import type { ClaimValidation, PersonaSeed, RuleResult } from '../types/domain'

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
