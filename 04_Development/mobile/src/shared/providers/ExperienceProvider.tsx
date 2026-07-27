import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'nativewind';
import { useColorScheme as useReactNativeColorScheme } from 'react-native';
import { useExperienceSettings } from '../hooks/useExperience';

// Simple translations dictionary for demo purposes
const TRANSLATIONS: Record<string, Record<string, string>> = {
  en: {
    'experience.title': 'Experience Center',
    'experience.overview': 'How YRecall looks and feels',
    'experience.description': 'Personalize how YRecall looks, feels, and speaks. From global localization to adaptive UI, craft an experience that is truly yours.',
    'experience.current': 'Current Experience',
    'experience.personalized': 'Personalized',
    'language.label': 'Language',
    'theme.label': 'Theme',
    'display.label': 'Display Density',
    'accessibility.label': 'Accessibility',
    'language.title': 'Language & Localization',
    'language.desc': 'The selected language dictates navigation, AI responses, notifications, and generated content. YRecall natively supports RTL and localized formatting.',
    'theme.title': 'Theme Management',
    'theme.sync': 'System Theme Synchronization',
    'theme.accent': 'Accent Color',
    'theme.light': 'Light',
    'theme.dark': 'Dark',
    'theme.system': 'System',
    'typography.title': 'Typography & Display',
    'typography.font': 'Font Size',
    'typography.density': 'Display Density',
    'reading.title': 'Reading & Motion',
    'reading.focus': 'Focus Reading Mode',
    'reading.focus.desc': 'Dim distractions and widen margins for articles.',
    'motion.reduce': 'Reduce Motion',
    'motion.reduce.desc': 'Disable micro-animations and parallax effects.',
    'access.title': 'Accessibility Settings',
    'access.contrast': 'High Contrast',
    'access.contrast.desc': 'Increase contrast ratios across UI elements.',
    'access.color': 'Color Blind Friendly',
    'access.color.desc': 'Avoid color-only states and indicators.',
    'access.screen': 'Screen Reader Optimization',
    'access.screen.desc': 'Enhance layout order and aria labels for TalkBack/VoiceOver.',
    'save': 'Save'
  },
  te: {
    'experience.title': 'అనుభవ కేంద్రం',
    'experience.overview': 'YRecall ఎలా కనిపిస్తుంది',
    'experience.description': 'YRecall ఎలా కనిపిస్తుందో, ఎలా అనిపిస్తుందో మరియు ఎలా మాట్లాడుతుందో వ్యక్తిగతీకరించండి. గ్లోబల్ స్థానికీకరణ నుండి అడాప్టివ్ UI వరకు, మీకంటూ ఒక అనుభవాన్ని రూపొందించుకోండి.',
    'experience.current': 'ప్రస్తుత అనుభవం',
    'experience.personalized': 'వ్యక్తిగతీకరించబడింది',
    'language.label': 'భాష',
    'theme.label': 'థీమ్',
    'display.label': 'ప్రదర్శన సాంద్రత',
    'accessibility.label': 'సౌలభ్యం',
    'language.title': 'భాష & స్థానికీకరణ',
    'language.desc': 'ఎంచుకున్న భాష నావిగేషన్, AI ప్రతిస్పందనలు, నోటిఫికేషన్‌లు మరియు రూపొందించిన కంటెంట్‌ని నిర్దేశిస్తుంది.',
    'theme.title': 'థీమ్ నిర్వహణ',
    'theme.sync': 'సిస్టమ్ థీమ్ సమకాలీకరణ',
    'theme.accent': 'యాస రంగు',
    'theme.light': 'లైట్',
    'theme.dark': 'డార్క్',
    'theme.system': 'సిస్టమ్',
    'typography.title': 'టైపోగ్రఫీ & ప్రదర్శన',
    'typography.font': 'ఫాంట్ పరిమాణం',
    'typography.density': 'ప్రదర్శన సాంద్రత',
    'reading.title': 'చదవడం & చలనం',
    'reading.focus': 'ఫోకస్ రీడింగ్ మోడ్',
    'reading.focus.desc': 'వ్యాసాల కోసం అంతరాయాలను తగ్గించండి మరియు మార్జిన్‌లను విస్తరించండి.',
    'motion.reduce': 'కదలికను తగ్గించండి',
    'motion.reduce.desc': 'మైక్రో-యానిమేషన్లు మరియు పారలాక్స్ ప్రభావాలను నిలిపివేయండి.',
    'access.title': 'సౌలభ్య సెట్టింగ్‌లు',
    'access.contrast': 'అధిక కాంట్రాస్ట్',
    'access.contrast.desc': 'UI మూలకాల అంతటా కాంట్రాస్ట్ నిష్పత్తులను పెంచండి.',
    'access.color': 'కలర్ బ్లైండ్ ఫ్రెండ్లీ',
    'access.color.desc': 'రంగు-మాత్రమే స్థితులు మరియు సూచికలను నివారించండి.',
    'access.screen': 'స్క్రీన్ రీడర్ ఆప్టిమైజేషన్',
    'access.screen.desc': 'లేఅవుట్ క్రమాన్ని మెరుగుపరచండి.',
    'save': 'సేవ్ చేయండి'
  },
  hi: {
    'experience.title': 'अनुभव केंद्र',
    'experience.overview': 'YRecall कैसा दिखता है',
    'experience.description': 'YRecall कैसा दिखता है, कैसा लगता है और कैसे बोलता है, इसे वैयक्तिकृत करें।',
    'experience.current': 'वर्तमान अनुभव',
    'experience.personalized': 'वैयक्तिकृत',
    'language.label': 'भाषा',
    'theme.label': 'थीम',
    'display.label': 'प्रदर्शन घनत्व',
    'accessibility.label': 'अभिगम्यता',
    'language.title': 'भाषा और स्थानीयकरण',
    'language.desc': 'चयनित भाषा नेविगेशन, AI प्रतिक्रियाओं, सूचनाओं और उत्पन्न सामग्री को निर्धारित करती है।',
    'theme.title': 'थीम प्रबंधन',
    'theme.sync': 'सिस्टम थीम तुल्यकालन',
    'theme.accent': 'उच्चारण रंग',
    'theme.light': 'लाइट',
    'theme.dark': 'डार्क',
    'theme.system': 'सिस्टम',
    'typography.title': 'टाइपोग्राफी और प्रदर्शन',
    'typography.font': 'फ़ॉन्ट आकार',
    'typography.density': 'प्रदर्शन घनत्व',
    'reading.title': 'पढ़ना और गति',
    'reading.focus': 'फोकस रीडिंग मोड',
    'reading.focus.desc': 'लेखों के लिए ध्यान भटकाने वाली चीजों को कम करें।',
    'motion.reduce': 'गति कम करें',
    'motion.reduce.desc': 'सूक्ष्म एनिमेशन अक्षम करें।',
    'access.title': 'अभिगम्यता सेटिंग्स',
    'access.contrast': 'उच्च कंट्रास्ट',
    'access.contrast.desc': 'यूआई तत्वों में कंट्रास्ट अनुपात बढ़ाएं।',
    'access.color': 'कलर ब्लाइंड फ्रेंडली',
    'access.color.desc': 'केवल रंग-स्थितियों से बचें।',
    'access.screen': 'स्क्रीन रीडर अनुकूलन',
    'access.screen.desc': 'लेआउट क्रम बढ़ाएं।',
    'save': 'सहेजें'
  }
};

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
  
  const [lang, setLang] = useState('en');

  useEffect(() => {
    if (settings) {
      // Handle Theme
      const themePref = settings.theme || 'system';
      if (themePref === 'system') {
        setColorScheme(systemColorScheme || 'light');
      } else {
        setColorScheme(themePref);
      }
      
      // Handle Language
      if (settings.language) {
        setLang(settings.language);
      }
    }
  }, [settings, systemColorScheme, setColorScheme]);

  const t = (key: string) => {
    if (TRANSLATIONS[lang] && TRANSLATIONS[lang][key]) {
      return TRANSLATIONS[lang][key];
    }
    if (TRANSLATIONS['en'] && TRANSLATIONS['en'][key]) {
      return TRANSLATIONS['en'][key];
    }
    return key;
  };

  return (
    <ExperienceContext.Provider value={{ t, language: lang }}>
      {children}
    </ExperienceContext.Provider>
  );
}
