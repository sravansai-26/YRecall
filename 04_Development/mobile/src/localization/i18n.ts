import * as Localization from 'expo-localization';
import { createInstance } from 'i18next';
import { initReactI18next } from 'react-i18next';

import enCommon from './locales/en/common.json';

const i18n = createInstance();

void i18n.use(initReactI18next).init({
  resources: {
    en: {
      common: enCommon,
    },
  },
  lng: Localization.getLocales()[0]?.languageCode ?? 'en',
  fallbackLng: 'en',
  defaultNS: 'common',
  interpolation: {
    escapeValue: false,
  },
});

export { i18n };
