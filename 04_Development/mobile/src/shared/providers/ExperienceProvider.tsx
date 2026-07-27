import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'nativewind';
import { useColorScheme as useReactNativeColorScheme, I18nManager } from 'react-native';
import { useExperienceSettings } from '../hooks/useExperience';
import i18n from '../i18n/config';
import { useTranslation as useI18nTranslation } from 'react-i18next';
import { getLanguageByCode } from '../i18n';

type ExperienceContextType = {
 t: (key: string) => string;
 language: string;
};

const ExperienceContext = createContext<ExperienceContextType>({
 t: (key) => key,
 language: 'en'
});

export const useTranslation = () => useContext(ExperienceContext);

export function ExperienceProvider({ children }: { children: React.ReactNode }) {
 const { data: settings } = useExperienceSettings();
 const { setColorScheme } = useColorScheme();
 const systemColorScheme = useReactNativeColorScheme();
 const { t: i18nT } = useI18nTranslation();
 
 const [lang, setLang] = useState('en');

 useEffect(() => {
 if (settings) {
 // Handle Theme
 const themePref = settings.theme || 'system';
 if (themePref === 'system') {
 setColorScheme(systemColorScheme || 'light');
 } else {
 setColorScheme(themePref as any);
 }
 
 // Handle Language
 if (settings.language && settings.language !== lang) {
 setLang(settings.language);
 i18n.changeLanguage(settings.language);
 
 // Handle RTL
 const languageInfo = getLanguageByCode(settings.language);
 if (languageInfo && languageInfo.rtl !== I18nManager.isRTL) {
 I18nManager.forceRTL(languageInfo.rtl);
 // RTL changes require app reload, but this sets it for the next launch
 }
 }
 }
 }, [settings, systemColorScheme, setColorScheme, lang]);

 return (
 <ExperienceContext.Provider value={{ t: i18nT, language: lang }}>
 {children}
 </ExperienceContext.Provider>
 );
}
