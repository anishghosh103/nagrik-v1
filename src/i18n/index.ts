import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en';
import { setLanguage } from './loadLanguage';

const storedLanguage = localStorage.getItem('nagrik:language') ?? 'en';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
  },
  lng: storedLanguage,
  fallbackLng: 'en',
  partialBundledLanguages: true,
  interpolation: { escapeValue: false },
});

if (storedLanguage === 'hi' || storedLanguage === 'bn') {
  void setLanguage(storedLanguage);
}
