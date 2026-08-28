import type { TFunction } from 'i18next';
import type {
  DeductionSection,
  FilingRoute,
  TaxRegime,
} from '../../../types/tax';

export function deductionSectionLabel(
  section: DeductionSection,
  t: TFunction,
): string {
  switch (section) {
    case '80C':
      return t('tax.deductions.claim80C');
    case '80D':
      return t('tax.deductions.claim80D');
    case '80TTA':
      return t('tax.deductions.claimSavingsInterest');
    case '80TTB':
      return t('tax.deductions.claimSeniorInterest');
  }
}

export function regimeLabel(regime: TaxRegime, t: TFunction): string {
  return regime === 'NEW'
    ? t('tax.savingsOption.optionB')
    : t('tax.savingsOption.optionA');
}

export function filingRouteLabel(route: FilingRoute, t: TFunction): string {
  switch (route) {
    case 'ITR1_LIKE':
      return t('tax.aboutYou.pathSimple');
    case 'ITR2_LIKE':
      return t('tax.aboutYou.pathBroader');
    case 'ITR4_LIKE':
      return t('tax.aboutYou.pathBusiness');
    case 'ITR3_ADVANCED':
      return t('tax.aboutYou.pathAdvanced');
    case 'UNSUPPORTED':
      return t('tax.aboutYou.pathUnsupported');
  }
}
