import json
import os
import re

en_dict = {
  "settings": {
    "title": "Settings",
    "account": "Account & Privacy",
    "experience": "Experience & Appearance",
    "experienceDesc": "Themes, Language & Accessibility",
    "notifications": "Notifications",
    "notificationsDesc": "Configure push alerts and reminders",
    "privacy": "Data & Security",
    "billing": "Billing & Subscription",
    "billingDesc": "Manage plans and history",
    "help": "Help & Support",
    "premiumMember": "Premium Member",
    "basicUser": "Basic User - Upgrade to Premium/Pro Plans",
    "neuralNetwork": "Neural Network",
    "interactiveGraph": "Interactive Graph",
    "exploreGraph": "Explore your connected memories",
    "graphSettings": "Graph Settings",
    "graphSettingsDesc": "AI Preferences & Rules",
    "intelligenceExp": "Intelligence & Experience",
    "aiPersona": "AI Persona",
    "aiPersonaDesc": "Sophisticated & Academic",
    "voice": "Voice",
    "voiceDesc": "Natural British (Female)",
    "memoryFilters": "Memory Filters",
    "memoryFiltersDesc": "Only include positive sentiments",
    "automationCenter": "Automation Center",
    "automationDesc": "Workflows, AI Tasks & Reminders",
    "security": "Security",
    "biometrics": "Biometrics",
    "biometricsDesc": "Enabled for app entry",
    "encryption": "Data Protection & Encryption",
    "encryptionDesc": "End-to-end active",
    "system": "System",
    "dataStorage": "Data & Storage",
    "dataStorageDesc": "Cloud Sync active • 1.2GB stored",
    "importExport": "Import / Export",
    "importExportDesc": "Data portability",
    "widgetConfig": "Widget Configuration",
    "widgetConfigDesc": "System widgets setup",
    "restorePurchases": "Restore Purchases",
    "signOut": "Sign Out",
    "deleteAccount": "Delete Account"
  }
}

hi_dict = {
  "settings": {
    "title": "सेटिंग्स",
    "account": "खाता और गोपनीयता",
    "experience": "अनुभव और दिखावट",
    "experienceDesc": "थीम, भाषा और पहुँच",
    "notifications": "सूचनाएं",
    "notificationsDesc": "पुश अलर्ट और रिमाइंडर कॉन्फ़िगर करें",
    "privacy": "डेटा और सुरक्षा",
    "billing": "बिलिंग और सदस्यता",
    "billingDesc": "प्लान और इतिहास प्रबंधित करें",
    "help": "सहायता और समर्थन",
    "premiumMember": "प्रीमियम सदस्य",
    "basicUser": "बेसिक उपयोगकर्ता - प्रीमियम/प्रो प्लान में अपग्रेड करें",
    "neuralNetwork": "न्यूरल नेटवर्क",
    "interactiveGraph": "इंटरएक्टिव ग्राफ़",
    "exploreGraph": "अपनी जुड़ी यादों का अन्वेषण करें",
    "graphSettings": "ग्राफ़ सेटिंग्स",
    "graphSettingsDesc": "AI प्राथमिकताएँ और नियम",
    "intelligenceExp": "इंटेलिजेंस और अनुभव",
    "aiPersona": "AI पर्सोना",
    "aiPersonaDesc": "परिष्कृत और अकादमिक",
    "voice": "आवाज़",
    "voiceDesc": "नेचुरल ब्रिटिश (महिला)",
    "memoryFilters": "मेमोरी फ़िल्टर",
    "memoryFiltersDesc": "केवल सकारात्मक भावनाएं शामिल करें",
    "automationCenter": "ऑटोमेशन सेंटर",
    "automationDesc": "वर्कफ़्लो, AI कार्य और अनुस्मारक",
    "security": "सुरक्षा",
    "biometrics": "बायोमेट्रिक्स",
    "biometricsDesc": "ऐप प्रवेश के लिए सक्षम",
    "encryption": "डेटा संरक्षण और एन्क्रिप्शन",
    "encryptionDesc": "एंड-टू-एंड सक्रिय",
    "system": "सिस्टम",
    "dataStorage": "डेटा और स्टोरेज",
    "dataStorageDesc": "क्लाउड सिंक सक्रिय • 1.2GB संग्रहीत",
    "importExport": "आयात / निर्यात",
    "importExportDesc": "डेटा पोर्टेबिलिटी",
    "widgetConfig": "विजेट कॉन्फ़िगरेशन",
    "widgetConfigDesc": "सिस्टम विजेट सेटअप",
    "restorePurchases": "खरीदारी पुनर्स्थापित करें",
    "signOut": "साइन आउट",
    "deleteAccount": "खाता हटाएं"
  }
}

te_dict = {
  "settings": {
    "title": "సెట్టింగ్‌లు",
    "account": "ఖాతా & గోప్యత",
    "experience": "అనుభవం & ప్రదర్శన",
    "experienceDesc": "థీమ్‌లు, భాష & ప్రాప్యత",
    "notifications": "నోటిఫికేషన్‌లు",
    "notificationsDesc": "పుష్ హెచ్చరికలు మరియు రిమైండర్‌లను కాన్ఫిగర్ చేయండి",
    "privacy": "డేటా & భద్రత",
    "billing": "బిల్లింగ్ & చందా",
    "billingDesc": "ప్లాన్‌లు మరియు చరిత్రను నిర్వహించండి",
    "help": "సహాయం & మద్దతు",
    "premiumMember": "ప్రీమియం సభ్యుడు",
    "basicUser": "ప్రాథమిక వినియోగదారు - ప్రీమియం/ప్రో ప్లాన్‌లకు అప్‌గ్రేడ్ చేయండి",
    "neuralNetwork": "న్యూరల్ నెట్‌వర్క్",
    "interactiveGraph": "ఇంటరాక్టివ్ గ్రాఫ్",
    "exploreGraph": "మీ కనెక్ట్ చేయబడిన జ్ఞాపకాలను అన్వేషించండి",
    "graphSettings": "గ్రాఫ్ సెట్టింగ్‌లు",
    "graphSettingsDesc": "AI ప్రాధాన్యతలు & నియమాలు",
    "intelligenceExp": "ఇంటెలిజెన్స్ & అనుభవం",
    "aiPersona": "AI పర్సోనా",
    "aiPersonaDesc": "అత్యాధునిక & అకడమిక్",
    "voice": "వాయిస్",
    "voiceDesc": "సహజ బ్రిటిష్ (స్త్రీ)",
    "memoryFilters": "మెమరీ ఫిల్టర్‌లు",
    "memoryFiltersDesc": "సానుకూల భావాలను మాత్రమే చేర్చండి",
    "automationCenter": "ఆటోమేషన్ సెంటర్",
    "automationDesc": "వర్క్‌ఫ్లోలు, AI టాస్క్‌లు & రిమైండర్‌లు",
    "security": "భద్రత",
    "biometrics": "బయోమెట్రిక్స్",
    "biometricsDesc": "యాప్ ఎంట్రీ కోసం ప్రారంభించబడింది",
    "encryption": "డేటా రక్షణ & గుప్తీకరణ",
    "encryptionDesc": "ఎండ్-టు-ఎండ్ యాక్టివ్",
    "system": "సిస్టమ్",
    "dataStorage": "డేటా & నిల్వ",
    "dataStorageDesc": "క్లౌడ్ సింక్ యాక్టివ్ • 1.2GB నిల్వ చేయబడింది",
    "importExport": "దిగుమతి / ఎగుమతి",
    "importExportDesc": "డేటా పోర్టబిలిటీ",
    "widgetConfig": "విడ్జెట్ ఆకృతీకరణ",
    "widgetConfigDesc": "సిస్టమ్ విడ్జెట్ల సెటప్",
    "restorePurchases": "కొనుగోళ్లను పునరుద్ధరించండి",
    "signOut": "సైన్ అవుట్ చేయండి",
    "deleteAccount": "ఖాతాను తొలగించండి"
  }
}

base_path = r"C:\Users\Sravan\Projects\YRecall\04_Development\mobile\src\shared\i18n\locales"

for lang, data_dict in [("en", en_dict), ("hi", hi_dict), ("te", te_dict)]:
    path = os.path.join(base_path, f"{lang}.json")
    with open(path, "r", encoding="utf-8") as f:
        existing = json.load(f)
    
    # Merge keys
    for k, v in data_dict.items():
        if k not in existing:
            existing[k] = v
        else:
            if isinstance(v, dict) and isinstance(existing[k], dict):
                existing[k].update(v)
            else:
                existing[k] = v
                
    with open(path, "w", encoding="utf-8") as f:
        json.dump(existing, f, ensure_ascii=False, indent=2)

print("Settings translations updated successfully!")
