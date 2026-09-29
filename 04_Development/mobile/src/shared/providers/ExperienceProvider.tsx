import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { useColorScheme, vars } from 'nativewind';
import { useColorScheme as useReactNativeColorScheme, I18nManager, View } from 'react-native';
import { useExperienceSettings } from '../hooks/useExperience';
import i18n from '../i18n/config';
import { useTranslation as useI18nTranslation } from 'react-i18next';
import { getLanguageByCode } from '../i18n';

type ExperienceContextType = {
  t: (key: string) => string;
  language: string;
  readingMode: boolean;
  reduceMotion: boolean;
  highContrast: boolean;
  colorBlindFriendly: boolean;
  screenReaderOptimization: boolean;
};

const ExperienceContext = createContext<ExperienceContextType>({
  t: (key) => key,
  language: 'en',
  readingMode: false,
  reduceMotion: false,
  highContrast: false,
  colorBlindFriendly: false,
  screenReaderOptimization: false,
});

export const useTranslation = () => useContext(ExperienceContext);
export const useExperience = () => useContext(ExperienceContext);

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

  const themeVars = useMemo(() => {
    let fontScale = 1;
    if (settings?.font_size === 'small') fontScale = 0.85;
    if (settings?.font_size === 'large') fontScale = 1.15;
    if (settings?.font_size === 'xlarge') fontScale = 1.3;

    let spacingScale = 1;
    if (settings?.display_density === 'compact') spacingScale = 0.8;
    if (settings?.display_density === 'spacious') spacingScale = 1.25;

    return vars({
      '--fs-display-lg': `${44 * fontScale}px`,
      '--lh-display-lg': `${52 * fontScale}px`,
      '--fs-headline-md': `${32 * fontScale}px`,
      '--lh-headline-md': `${40 * fontScale}px`,
      '--fs-title-sm': `${20 * fontScale}px`,
      '--lh-title-sm': `${28 * fontScale}px`,
      '--fs-body-md': `${16 * fontScale}px`,
      '--lh-body-md': `${24 * fontScale}px`,
      '--fs-caption-sm': `${12 * fontScale}px`,
      '--lh-caption-sm': `${16 * fontScale}px`,
      '--fs-label-xs': `${11 * fontScale}px`,
      '--lh-label-xs': `${16 * fontScale}px`,
      
      '--spacing-base': `${8 * spacingScale}px`,
      '--spacing-xs': `${4 * spacingScale}px`,
      '--spacing-sm': `${8 * spacingScale}px`,
      '--spacing-md': `${16 * spacingScale}px`,
      '--spacing-lg': `${24 * spacingScale}px`,
      '--spacing-xl': `${32 * spacingScale}px`,
      '--spacing-xxl': `${48 * spacingScale}px`,
      '--spacing-gutter': `${16 * spacingScale}px`,
      '--spacing-margin-mobile': `${20 * spacingScale}px`,
      '--spacing-margin-desktop': `${40 * spacingScale}px`,
    });
  }, [settings?.font_size, settings?.display_density]);

  return (
    <ExperienceContext.Provider 
      value={{ 
        t: i18nT, 
        language: lang,
        readingMode: settings?.reading_mode || false,
        reduceMotion: settings?.reduce_motion || false,
        highContrast: settings?.high_contrast || false,
        colorBlindFriendly: settings?.color_blind_friendly || false,
        screenReaderOptimization: settings?.screen_reader_optimization || false
      }}
    >
      <View style={[{ flex: 1 }, themeVars as any]}>
        {children}
      </View>
    </ExperienceContext.Provider>
  );
}
