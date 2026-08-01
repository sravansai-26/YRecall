import os
import requests
import sys
from dotenv import load_dotenv

load_dotenv()

key = os.getenv("OPENROUTER_API_KEY")
headers = {
    "Authorization": f"Bearer {key}",
    "Content-Type": "application/json"
}
payload = {
    "model": "google/gemini-2.5-flash:free",
    "messages": [{"role": "user", "content": "Hello"}]
}
r = requests.post("https://openrouter.ai/api/v1/chat/completions", headers=headers, json=payload)
print(r.status_code)
print(r.text)
