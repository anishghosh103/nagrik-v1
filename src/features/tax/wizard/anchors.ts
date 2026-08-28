import type { SectionId } from '../../../types/tax';

export type WizardAnchor =
  | 'about-you'
  | 'income'
  | 'extras'
  | 'claims'
  | 'savings-option'
  | 'refund-account'
  | 'review';

export const SECTION_ID_TO_ANCHOR: Record<SectionId, WizardAnchor> = {
  ELIGIBILITY: 'about-you',
  INCOME_SOURCES: 'income',
  SALARY: 'income',
  INTEREST: 'income',
  HOUSE_PROPERTY: 'extras',
  CAPITAL_GAINS: 'extras',
  BUSINESS: 'extras',
  DEDUCTIONS: 'claims',
  TAX_CREDITS: 'claims',
  REGIME: 'savings-option',
  BANK: 'refund-account',
};
