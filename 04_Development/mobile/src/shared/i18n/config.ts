import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translation resources
import en from './locales/en.json';
import te from './locales/te.json';
import hi from './locales/hi.json';
import { SUPPORTED_LANGUAGES } from './index';

// Initialize i18next
const resources = {
 en: { translation: en },
 te: { translation: te },
 hi: { translation: hi },
};

i18n
 .use(initReactI18next)
 .init({
 compatibilityJSON: 'v3',
 resources,
 lng: 'en', // default language
 fallbackLng: 'en',
 interpolation: {
 escapeValue: false, // React already escapes values
 },
 react: {
 useSuspense: false,
 },
 });

export default i18n;
