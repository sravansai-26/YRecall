import json
import time
import requests
import base64
from typing import Optional, Dict, Any, List

from .base import AIProvider
from ...config import settings

class OpenRouterProvider(AIProvider):
    def __init__(self):
        if not settings.OPENROUTER_API_KEY:
            raise ValueError("OPENROUTER_API_KEY is not configured")
        self.api_key = settings.OPENROUTER_API_KEY
        self.base_url = "https://openrouter.ai/api/v1/chat/completions"
        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
            "HTTP-Referer": settings.APP_URL,
            "X-Title": settings.APP_NAME,
        }

    def _execute_with_retries(self, payload: dict, max_retries: int = 3) -> dict:
        for attempt in range(max_retries):
            try:
                response = requests.post(self.base_url, headers=self.headers, json=payload, timeout=60)
                if response.status_code == 200:
                    return response.json()
                elif response.status_code == 429:
                    time.sleep((attempt + 1) * 2) # Exponential backoff
                    continue
                else:
                    raise ValueError(f"OpenRouter Error {response.status_code}: {response.text}")
            except requests.exceptions.RequestException as e:
                if attempt == max_retries - 1:
                    raise ValueError(f"OpenRouter connection failed after retries: {e}")
                time.sleep((attempt + 1) * 2)
        raise ValueError("OpenRouter request failed after all retries")

    def generate_text(self, model: str, prompt: str, system_prompt: Optional[str] = None) -> str:
        messages = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        messages.append({"role": "user", "content": prompt})

        payload = {
            "model": model,
            "messages": messages,
            "max_tokens": 4000
        }
        
        response_data = self._execute_with_retries(payload)
        return response_data["choices"][0]["message"]["content"]

    def generate_json(self, model: str, prompt: str, system_prompt: Optional[str] = None) -> Dict[str, Any]:
        messages = []
        
        # Add instruction to strictly return JSON
        sys_prompt = system_prompt or "You are a helpful assistant."
        sys_prompt += "\nOutput ONLY valid JSON. Do not include markdown formatting or extra text."
        messages.append({"role": "system", "content": sys_prompt})
        
        messages.append({"role": "user", "content": prompt})

        payload = {
            "model": model,
            "messages": messages,
            "response_format": {"type": "json_object"},
            "max_tokens": 4000
        }
        
        try:
            response_data = self._execute_with_retries(payload)
            content = response_data["choices"][0]["message"]["content"]
            
            # Clean markdown if model ignored response_format
            if "```json" in content:
                content = content.split("```json")[1].split("```")[0].strip()
            elif "```" in content:
                content = content.split("```")[1].split("```")[0].strip()
                
            return json.loads(content)
        except json.JSONDecodeError as e:
            # Fallback if json parsing fails
            raise ValueError(f"OpenRouter failed to return valid JSON: {e}")

    def generate_vision(self, model: str, prompt: str, file_bytes: bytes, mime_type: str, expect_json: bool = False) -> Any:
        base64_image = base64.b64encode(file_bytes).decode('utf-8')
        data_uri = f"data:{mime_type};base64,{base64_image}"
        
        sys_prompt = "You are a helpful assistant."
        payload = {
            "model": model,
            "messages": [
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": prompt},
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": data_uri
                            }
                        }
                    ]
                }
            ],
            "max_tokens": 4000
        }
        
        if expect_json:
            sys_prompt += "\nOutput ONLY valid JSON."
            payload["messages"].insert(0, {"role": "system", "content": sys_prompt})
            payload["response_format"] = {"type": "json_object"}
            
        response_data = self._execute_with_retries(payload)
        content = response_data["choices"][0]["message"]["content"]
        
        if expect_json:
            if "```json" in content:
                content = content.split("```json")[1].split("```")[0].strip()
            elif "```" in content:
                content = content.split("```")[1].split("```")[0].strip()
            return json.loads(content)
            
        return content

    def generate_chat(self, model: str, messages: List[Dict[str, Any]], system_prompt: Optional[str] = None) -> str:
        api_msgs = []
        if system_prompt:
            api_msgs.append({"role": "system", "content": system_prompt})
            
        for msg in messages:
            # Note: For Gemini compatibility, we accept parts or content.
            # Convert 'parts' back to 'content' if it exists.
            if "parts" in msg:
                content = ""
                for part in msg["parts"]:
                    if "text" in part:
                        content += part["text"] + "\n"
                api_msgs.append({"role": msg["role"], "content": content.strip()})
            else:
                api_msgs.append({"role": msg["role"], "content": msg["content"]})
                
        payload = {
            "model": model,
            "messages": api_msgs,
            "max_tokens": 4000
        }
        
        response_data = self._execute_with_retries(payload)
        return response_data["choices"][0]["message"]["content"]

    def generate_embedding(self, model: str, text: str) -> List[float]:
        raise NotImplementedError("Embeddings are not natively supported through this OpenRouter implementation. Use Gemini.")
