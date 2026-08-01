import os
import requests
import json
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("GROQ_API_KEY")
base_url = "https://api.groq.com/openai/v1"
headers = {
    "Authorization": f"Bearer {api_key}",
    "Content-Type": "application/json"
}

payload = {
    "model": "llama-3.3-70b-versatile",
    "messages": [{"role": "system", "content": "return json"}, {"role": "user", "content": "Hello"}],
    "response_format": {"type": "json_object"}
}
try:
    r = requests.post(f"{base_url}/chat/completions", headers=headers, json=payload)
    print("3.3 Status:", r.status_code)
except Exception as e:
    pass

payload["model"] = "llama-3.1-8b-instant"
try:
    r = requests.post(f"{base_url}/chat/completions", headers=headers, json=payload)
    print("3.1-8b Status:", r.status_code)
except Exception as e:
    pass

