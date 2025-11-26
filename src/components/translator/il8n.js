import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import translationEN from './locales/en/translation.json';
import translationES from './locales/es/translation.json'; // spanish
import translationFR from './locales/fn/translation.json';
import translationZH from './locales/zh/translation.json'; // chinesh

const resources = {
  en: {
    translation: translationEN,
  },
  fr: {
    translation: translationFR,
  },
  es: {
    translation: translationES,
  },
  zh: {
    translation: translationZH,
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    supportedLngs: ['en', 'fr', 'es', 'zh'],
    detection: {
      order: ['localStorage', 'navigator'],
    },
  });

export default i18n;