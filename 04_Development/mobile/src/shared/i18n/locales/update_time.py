import json
import os
import re

en_dict = {
  "timeline": {
    "today": "Today",
    "yesterday": "Yesterday",
    "thisWeek": "This Week",
    "thisMonth": "This Month",
    "earlier": "Earlier",
    "searchPlaceholder": "Search timeline...",
    "emptyTitle": "No memories found.",
    "emptyDesc": "Capture your first memory to see it appear here in your timeline.",
    "filters": {
      "all": "All",
      "image": "Image",
      "voice": "Voice",
      "note": "Note",
      "url": "URL",
      "document": "Document",
      "automation": "Automation"
    }
  }
}

hi_dict = {
  "timeline": {
    "today": "आज",
    "yesterday": "कल",
    "thisWeek": "इस सप्ताह",
    "thisMonth": "इस महीने",
    "earlier": "पहले",
    "searchPlaceholder": "टाइमलाइन खोजें...",
    "emptyTitle": "कोई यादें नहीं मिलीं।",
    "emptyDesc": "अपनी टाइमलाइन में देखने के लिए अपनी पहली याद कैप्चर करें।",
    "filters": {
      "all": "सभी",
      "image": "छवि",
      "voice": "आवाज़",
      "note": "नोट",
      "url": "URL",
      "document": "दस्तावेज़",
      "automation": "स्वचालन"
    }
  }
}

te_dict = {
  "timeline": {
    "today": "నేడు",
    "yesterday": "నిన్న",
    "thisWeek": "ఈ వారం",
    "thisMonth": "ఈ నెల",
    "earlier": "గతంలో",
    "searchPlaceholder": "టైమ్‌లైన్ శోధించండి...",
    "emptyTitle": "జ్ఞాపకాలు కనుగొనబడలేదు.",
    "emptyDesc": "మీ టైమ్‌లైన్‌లో చూడటానికి మీ మొదటి జ్ఞాపకాన్ని క్యాప్చర్ చేయండి.",
    "filters": {
      "all": "అన్నీ",
      "image": "చిత్రం",
      "voice": "వాయిస్",
      "note": "గమనిక",
      "url": "URL",
      "document": "పత్రం",
      "automation": "ఆటోమేషన్"
    }
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

print("Timeline translations updated successfully!")
