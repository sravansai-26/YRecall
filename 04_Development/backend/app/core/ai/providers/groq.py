import json
import requests
from typing import Optional, Dict, Any, List

from .base import AIProvider
from ...config import settings

class GroqProvider(AIProvider):
    def __init__(self):
        self.api_key = settings.GROQ_API_KEY
        if not self.api_key:
            raise ValueError("GROQ_API_KEY is not configured in .env")
        
        self.base_url = "https://api.groq.com/openai/v1"
        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }

    def generate_text(self, model: str, prompt: str, system_prompt: Optional[str] = None) -> str:
        messages = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        messages.append({"role": "user", "content": prompt})
        
        payload = {
            "model": model,
            "messages": messages,
        }
        
        response = requests.post(f"{self.base_url}/chat/completions", headers=self.headers, json=payload)
        response.raise_for_status()
        return response.json()["choices"][0]["message"]["content"]

    def generate_json(self, model: str, prompt: str, system_prompt: Optional[str] = None) -> Dict[str, Any]:
        messages = []
        
        # Groq requires the word 'json' to be in the prompt for json_object mode
        safe_sys = system_prompt or ""
        if "json" not in safe_sys.lower() and "json" not in prompt.lower():
            safe_sys += "\n\nYou must return your output in JSON format."
            
        if safe_sys:
            messages.append({"role": "system", "content": safe_sys})
        messages.append({"role": "user", "content": prompt})
        
        payload = {
            "model": model,
            "messages": messages,
            "response_format": {"type": "json_object"}
        }
        
        response = requests.post(f"{self.base_url}/chat/completions", headers=self.headers, json=payload)
        response.raise_for_status()
        text = response.json()["choices"][0]["message"]["content"]
        
        return json.loads(text)

    def generate_chat(self, model: str, messages: List[Dict[str, Any]], system_prompt: Optional[str] = None) -> str:
        formatted_messages = []
        if system_prompt:
            formatted_messages.append({"role": "system", "content": system_prompt})
            
        for msg in messages:
            if "content" in msg:
                formatted_messages.append({"role": msg["role"], "content": msg["content"]})
            elif "parts" in msg:
                text = ""
                for part in msg["parts"]:
                    if isinstance(part, dict) and "text" in part:
                        text += part["text"] + "\n"
                    elif hasattr(part, "text"):
                        text += part.text + "\n"
                formatted_messages.append({"role": msg["role"], "content": text})
                
        payload = {
            "model": model,
            "messages": formatted_messages,
        }
        
        response = requests.post(f"{self.base_url}/chat/completions", headers=self.headers, json=payload)
        response.raise_for_status()
        return response.json()["choices"][0]["message"]["content"]

    def generate_vision(self, model: str, prompt: str, file_bytes: bytes, mime_type: str, expect_json: bool = False) -> Any:
        import base64
        base64_image = base64.b64encode(file_bytes).decode('utf-8')
        
        # Groq text models (like llama-3.3-70b-versatile) do not support vision payloads.
        # We must explicitly use a vision model.
        vision_model = "llama-3.2-11b-vision-preview"
        
        # Ensure json requirement is met for Groq if expect_json is true
        if expect_json and "json" not in prompt.lower():
            prompt += "\n\nYou must return your output in JSON format."
            
        messages = [
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": prompt},
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:{mime_type};base64,{base64_image}"
                        }
                    }
                ]
            }
        ]
        
        payload = {
            "model": vision_model,
            "messages": messages,
        }
        
        if expect_json:
            payload["response_format"] = {"type": "json_object"}
            
        response = requests.post(f"{self.base_url}/chat/completions", headers=self.headers, json=payload)
        response.raise_for_status()
        text = response.json()["choices"][0]["message"]["content"]
        
        if expect_json:
            return json.loads(text)
        return text

    def generate_embedding(self, model: str, text: str) -> List[float]:
        # Groq doesn't typically provide embedding models in their free tier
        # So we fall back to a dummy or error if needed, but normally we use nomic via openrouter or huggingface
        raise NotImplementedError("Embeddings are not supported by the Groq provider natively here.")
