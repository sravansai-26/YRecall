import json
from typing import Optional, Dict, Any, List
from google import genai
from google.genai import types

from .base import AIProvider
from ...config import settings

class GeminiProvider(AIProvider):
    def __init__(self):
        if not settings.GEMINI_API_KEY:
            raise ValueError("GEMINI_API_KEY is not configured")
        self.client = genai.Client(api_key=settings.GEMINI_API_KEY)

    def generate_text(self, model: str, prompt: str, system_prompt: Optional[str] = None) -> str:
        contents = prompt
        config = None
        if system_prompt:
            config = types.GenerateContentConfig(system_instruction=system_prompt)
            
        response = self.client.models.generate_content(
            model=model,
            contents=contents,
            config=config
        )
        return response.text

    def generate_json(self, model: str, prompt: str, system_prompt: Optional[str] = None) -> Dict[str, Any]:
        config = types.GenerateContentConfig(
            response_mime_type="application/json",
            system_instruction=system_prompt
        )
        
        response = self.client.models.generate_content(
            model=model,
            contents=prompt,
            config=config
        )
        text = response.text
        if "```json" in text:
            text = text.split("```json")[1].split("```")[0].strip()
        elif "```" in text:
            text = text.split("```")[1].split("```")[0].strip()
            
        return json.loads(text)

    def generate_vision(self, model: str, prompt: str, file_bytes: bytes, mime_type: str, expect_json: bool = False) -> Any:
        config = None
        if expect_json:
            config = types.GenerateContentConfig(response_mime_type="application/json")
            
        contents = [
            types.Part.from_bytes(data=file_bytes, mime_type=mime_type),
            prompt
        ]
        
        response = self.client.models.generate_content(
            model=model,
            contents=contents,
            config=config
        )
        
        text = response.text
        if expect_json:
            if "```json" in text:
                text = text.split("```json")[1].split("```")[0].strip()
            elif "```" in text:
                text = text.split("```")[1].split("```")[0].strip()
            return json.loads(text)
            
        return text

    def generate_chat(self, model: str, messages: List[Dict[str, Any]], system_prompt: Optional[str] = None) -> str:
        config = None
        if system_prompt:
            config = types.GenerateContentConfig(system_instruction=system_prompt)
            
        # messages are in format [{"role": "user"/"assistant", "content": "text"}]
        # Gemini needs [{"role": "user"/"model", "parts": [{"text": "text"}]}]
        contents = []
        for msg in messages:
            role = "model" if msg["role"] == "assistant" else "user"
            
            # If msg already has 'parts', use it directly (useful for attachments)
            if "parts" in msg:
                contents.append({"role": role, "parts": msg["parts"]})
            else:
                contents.append({"role": role, "parts": [{"text": msg["content"]}]})
                
        response = self.client.models.generate_content(
            model=model,
            contents=contents,
            config=config
        )
        return response.text

    def generate_embedding(self, model: str, text: str) -> List[float]:
        result = self.client.models.embed_content(
            model=model,
            contents=text
        )
        return result.embeddings[0].values
