import type {
  GrievanceCategory,
  GrievanceEscalation,
  GrievanceOutcome,
  GrievanceService,
  GrievanceStatus,
} from '../types/domain';

export const GRIEVANCE_SERVICES: GrievanceService[] = [
  'INCOME_TAX',
  'EPFO',
  'IDENTITY',
];

export const GRIEVANCE_CATEGORIES_BY_SERVICE: Record<
  GrievanceService,
  GrievanceCategory[]
> = {
  INCOME_TAX: [
    'REFUND_DELAY',
    'NOTICE_DISAGREEMENT',
    'PAYMENT_MISMATCH',
    'PORTAL_ACCESS',
    'OTHER',
  ],
  EPFO: [
    'CONTRIBUTION_MISMATCH',
    'CLAIM_DELAY',
    'KYC_CORRECTION',
    'TRANSFER_DELAY',
    'OTHER',
  ],
  IDENTITY: ['IDENTITY_MISMATCH', 'PROPAGATION_FAILURE', 'OTHER'],
};

const SERVICE_KEYWORDS: Record<GrievanceService, string[]> = {
  INCOME_TAX: [
    'tax',
    'itr',
    'refund',
    'notice',
    'return',
    'tds',
    'challan',
    'income tax',
    'demand',
  ],
  EPFO: [
    'pf',
    'epfo',
    'uan',
    'provident',
    'employer',
    'passbook',
    'claim',
    'pension',
    'transfer',
    'nomination',
    'contribution',
    'withdrawal',
  ],
  IDENTITY: [
    'aadhaar',
    'pan card',
    'bank account',
    'mismatch',
    'spelling',
    'mobile number',
    'kyc',
    'name',
  ],
};

const CATEGORY_KEYWORDS: Record<GrievanceCategory, string[]> = {
  REFUND_DELAY: ['refund', 'delay', 'not credited', 'pending refund'],
  NOTICE_DISAGREEMENT: [
    'notice',
    'disagree',
    'wrong demand',
    '143',
    '139',
    'incorrect notice',
  ],
  PAYMENT_MISMATCH: [
    'payment',
    'challan',
    'paid',
    'not reflecting',
    'not showing',
  ],
  PORTAL_ACCESS: ['login', 'otp', 'portal', 'access', 'error', 'website'],
  CONTRIBUTION_MISMATCH: [
    'contribution',
    'missing',
    'not credited',
    'passbook',
    'not posted',
    'not deposit',
  ],
  CLAIM_DELAY: ['claim', 'withdrawal', 'settlement', 'rejected', 'delay'],
  KYC_CORRECTION: [
    'kyc',
    'aadhaar',
    'pan',
    'bank',
    'correction',
    'update record',
  ],
  TRANSFER_DELAY: ['transfer', 'previous employer', 'old pf', 'old account'],
  IDENTITY_MISMATCH: [
    'mismatch',
    'different name',
    'spelling',
    'wrong name',
    'name differs',
  ],
  PROPAGATION_FAILURE: [
    'not updated',
    'failed to update',
    'still shows old',
    'did not update',
  ],
  OTHER: [],
};

export function suggestService(description: string): GrievanceService {
  const text = description.toLowerCase();
  let best: GrievanceService = 'EPFO';
  let bestScore = 0;
  for (const service of GRIEVANCE_SERVICES) {
    const score = SERVICE_KEYWORDS[service].filter((keyword) =>
      text.includes(keyword),
    ).length;
    if (score > bestScore) {
      bestScore = score;
      best = service;
    }
  }
  return best;
}

export function suggestCategory(
  service: GrievanceService,
  description: string,
): GrievanceCategory {
  const text = description.toLowerCase();
  let best: GrievanceCategory = 'OTHER';
  let bestScore = 0;
  for (const category of GRIEVANCE_CATEGORIES_BY_SERVICE[service]) {
    const score = CATEGORY_KEYWORDS[category].filter((keyword) =>
      text.includes(keyword),
    ).length;
    if (score > bestScore) {
      bestScore = score;
      best = category;
    }
  }
  return best;
}

const OUTCOME_BY_CATEGORY: Record<GrievanceCategory, GrievanceOutcome> = {
  REFUND_DELAY: 'RESOLVED',
  NOTICE_DISAGREEMENT: 'NO_CHANGE',
  PAYMENT_MISMATCH: 'RESOLVED',
  PORTAL_ACCESS: 'RESOLVED',
  CONTRIBUTION_MISMATCH: 'NO_CHANGE',
  CLAIM_DELAY: 'RESOLVED',
  KYC_CORRECTION: 'RESOLVED',
  TRANSFER_DELAY: 'RESOLVED',
  IDENTITY_MISMATCH: 'RESOLVED',
  PROPAGATION_FAILURE: 'NO_CHANGE',
  OTHER: 'NO_CHANGE',
};

/** Deterministic prototype outcome per category, chosen at disposal time. */
export function scriptedOutcome(category: GrievanceCategory): GrievanceOutcome {
  return OUTCOME_BY_CATEGORY[category];
}

export function isEscalationEligible(
  status: GrievanceStatus,
  outcome: GrievanceOutcome | undefined,
  escalation: GrievanceEscalation | undefined,
): boolean {
  return status === 'DISPOSED' && outcome === 'NO_CHANGE' && !escalation;
}

export function currentMeaningKey(
  status: GrievanceStatus,
  outcome: GrievanceOutcome | undefined,
  escalation: GrievanceEscalation | undefined,
): string {
  if (escalation?.status === 'RESOLVED')
    return 'grievances.meaning.escalationResolved';
  if (escalation?.status === 'IN_REVIEW')
    return 'grievances.meaning.escalationInReview';
  if (status === 'DISPOSED')
    return outcome === 'RESOLVED'
      ? 'grievances.meaning.disposedResolved'
      : 'grievances.meaning.disposedNoChange';
  if (status === 'IN_REVIEW') return 'grievances.meaning.inReview';
  return 'grievances.meaning.acknowledged';
}
