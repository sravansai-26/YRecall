import json
import os
import re

en_dict = {
  "automation": {
    "title": "Operations Hub",
    "aiActive": "AI ACTIVE",
    "aiAssistantWorking": "Your AI Assistant is working.",
    "automationDesc": "The Automation Center processes your captures in the background to build your knowledge graph, summarize meetings, and prepare your daily briefs without any manual effort.",
    "actionsTaken": "ACTIONS TAKEN THIS WEEK",
    "activeWorkflows": "ACTIVE WORKFLOWS",
    "successRate": "SUCCESS RATE",
    "actionRequired": "Action Required",
    "tasksScheduled": "Tasks the AI has extracted for you or scheduled for your review.",
    "allCaughtUp": "You're all caught up.",
    "noPendingActions": "No pending actions required.",
    "backgroundWorkflows": "Background Workflows",
    "backgroundRules": "The rules that govern how AI processes your incoming data.",
    "financeTracker": "Finance Tracker",
    "financeTrackerDesc": "Tag captures containing \"invoice\" or \"receipt\" as Finance.",
    "dailySyncSummary": "Daily Sync Summary",
    "dailySyncSummaryDesc": "Summarizes all voice captures recorded today at 5 PM.",
    "liveActivityStream": "Live Activity Stream",
    "liveActivityDesc": "A real-time log of what the AI is executing right now.",
    "new": "NEW"
  }
}

hi_dict = {
  "automation": {
    "title": "ऑपरेशंस हब",
    "aiActive": "AI सक्रिय",
    "aiAssistantWorking": "आपका AI असिस्टेंट काम कर रहा है।",
    "automationDesc": "ऑटोमेशन सेंटर आपके ज्ञान ग्राफ को बनाने, बैठकों को संक्षेप में प्रस्तुत करने और बिना किसी मैन्युअल प्रयास के आपके दैनिक ब्रीफ तैयार करने के लिए पृष्ठभूमि में आपके कैप्चर को संसाधित करता है।",
    "actionsTaken": "इस सप्ताह की गई कार्रवाइयां",
    "activeWorkflows": "सक्रिय वर्कफ़्लो",
    "successRate": "सफलता दर",
    "actionRequired": "कार्रवाई आवश्यक है",
    "tasksScheduled": "वे कार्य जो AI ने आपके लिए निकाले हैं या आपकी समीक्षा के लिए निर्धारित किए हैं।",
    "allCaughtUp": "आप सभी काम कर चुके हैं।",
    "noPendingActions": "कोई लंबित कार्रवाई आवश्यक नहीं है।",
    "backgroundWorkflows": "पृष्ठभूमि वर्कफ़्लो",
    "backgroundRules": "वे नियम जो नियंत्रित करते हैं कि AI आपके आने वाले डेटा को कैसे संसाधित करता है।",
    "financeTracker": "वित्त ट्रैकर",
    "financeTrackerDesc": "\"चालान\" या \"रसीद\" वाले कैप्चर को वित्त के रूप में टैग करें।",
    "dailySyncSummary": "दैनिक सिंक सारांश",
    "dailySyncSummaryDesc": "आज शाम 5 बजे रिकॉर्ड किए गए सभी वॉयस कैप्चर का सारांश देता है।",
    "liveActivityStream": "लाइव गतिविधि स्ट्रीम",
    "liveActivityDesc": "AI अभी क्या निष्पादित कर रहा है, उसका रीयल-टाइम लॉग।",
    "new": "नया"
  }
}

te_dict = {
  "automation": {
    "title": "ఆపరేషన్స్ హబ్",
    "aiActive": "AI యాక్టివ్",
    "aiAssistantWorking": "మీ AI అసిస్టెంట్ పని చేస్తోంది.",
    "automationDesc": "ఆటోమేషన్ సెంటర్ మీ నాలెడ్జ్ గ్రాఫ్‌ను రూపొందించడానికి, సమావేశాలను సంగ్రహించడానికి మరియు ఎటువంటి మాన్యువల్ ప్రయత్నం లేకుండా మీ రోజువారీ బ్రీఫ్‌లను సిద్ధం చేయడానికి నేపథ్యంలో మీ క్యాప్చర్‌లను ప్రాసెస్ చేస్తుంది.",
    "actionsTaken": "ఈ వారం తీసుకున్న చర్యలు",
    "activeWorkflows": "క్రియాశీల వర్క్‌ఫ్లోలు",
    "successRate": "విజయ రేటు",
    "actionRequired": "చర్య అవసరం",
    "tasksScheduled": "AI మీ కోసం సంగ్రహించిన పనులు లేదా మీ సమీక్ష కోసం షెడ్యూల్ చేయబడినవి.",
    "allCaughtUp": "మీరు పనులన్నీ పూర్తి చేశారు.",
    "noPendingActions": "పెండింగ్ చర్యలు ఏవీ అవసరం లేదు.",
    "backgroundWorkflows": "నేపథ్య వర్క్‌ఫ్లోలు",
    "backgroundRules": "AI మీ ఇన్‌కమింగ్ డేటాను ఎలా ప్రాసెస్ చేస్తుందో నియంత్రించే నియమాలు.",
    "financeTracker": "ఫైనాన్స్ ట్రాకర్",
    "financeTrackerDesc": "\"ఇన్‌వాయిస్\" లేదా \"రశీదు\" ఉన్న క్యాప్చర్‌లను ఫైనాన్స్‌గా ట్యాగ్ చేయండి.",
    "dailySyncSummary": "రోజువారీ సమకాలీకరణ సారాంశం",
    "dailySyncSummaryDesc": "ఈరోజు సాయంత్రం 5 గంటలకు రికార్డ్ చేయబడిన అన్ని వాయిస్ క్యాప్చర్‌లను సంగ్రహిస్తుంది.",
    "liveActivityStream": "లైవ్ యాక్టివిటీ స్ట్రీమ్",
    "liveActivityDesc": "AI ప్రస్తుతం ఏమి చేస్తోందో తెలిపే నిజ-సమయ లాగ్.",
    "new": "కొత్తది"
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

print("Automation translations updated successfully!")
