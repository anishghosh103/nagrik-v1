import i18n from 'i18next';

export type SupportedLanguage = 'en' | 'hi' | 'bn';

// 'en' is always registered synchronously by src/i18n/index.ts's init() call,
// so it never needs to be fetched here.
type LazyLanguage = Exclude<SupportedLanguage, 'en'>;

async function loadBundle(lang: LazyLanguage) {
  switch (lang) {
    case 'hi':
      return (await import('./locales/hi')).default;
    case 'bn':
      return (await import('./locales/bn')).default;
  }
}

export async function setLanguage(lang: SupportedLanguage) {
  if (lang !== 'en' && !i18n.hasResourceBundle(lang, 'translation')) {
    const bundle = await loadBundle(lang);
    i18n.addResourceBundle(lang, 'translation', bundle);
  }
  await i18n.changeLanguage(lang);
  localStorage.setItem('nagrik:language', lang);
}
