from typing import Optional, Dict, Any, List

from ..config import settings
from .providers.base import AIProvider
from .providers.gemini import GeminiProvider
from .providers.openrouter import OpenRouterProvider
from .providers.groq import GroqProvider

class AIRouter:
    def __init__(self):
        self._providers: Dict[str, AIProvider] = {}
        
        # Initialize configured providers lazily or eagerly
        if settings.GEMINI_API_KEY:
            self._providers["gemini"] = GeminiProvider()
        if settings.OPENROUTER_API_KEY:
            self._providers["openrouter"] = OpenRouterProvider()
        if settings.GROQ_API_KEY:
            self._providers["groq"] = GroqProvider()

    def get_provider(self, provider_name: str) -> AIProvider:
        provider = self._providers.get(provider_name.lower())
        if not provider:
            # Fallback if preferred is missing but another is available
            if self._providers:
                return next(iter(self._providers.values()))
            raise ValueError(f"AI Provider '{provider_name}' is not configured and no fallback available.")
        return provider

    def generate_text(self, task: str, prompt: str, system_prompt: Optional[str] = None) -> str:
        """
        Routes a text generation request based on the task type (e.g. 'ask', 'background', 'summary').
        """
        provider_name = settings.ASK_AI_PROVIDER if task == "ask" else settings.BACKGROUND_AI_PROVIDER
        model = getattr(settings, f"{task.upper()}_MODEL", settings.BACKGROUND_MODEL)
        
        provider = self.get_provider(provider_name)
        return provider.generate_text(model=model, prompt=prompt, system_prompt=system_prompt)

    def generate_json(self, task: str, prompt: str, system_prompt: Optional[str] = None) -> Dict[str, Any]:
        """
        Routes a JSON generation request based on the task type.
        """
        provider_name = settings.ASK_AI_PROVIDER if task == "ask" else settings.BACKGROUND_AI_PROVIDER
        model = getattr(settings, f"{task.upper()}_MODEL", settings.BACKGROUND_MODEL)
        
        provider = self.get_provider(provider_name)
        try:
            return provider.generate_json(model=model, prompt=prompt, system_prompt=system_prompt)
        except Exception as e:
            fallback = "groq" if provider_name == "gemini" else "gemini"
            try:
                fb_provider = self.get_provider(fallback)
                print(f"[AIRouter Fallback] {provider_name} failed: {e}. Falling back to {fallback}")
                fb_model = settings.BACKGROUND_MODEL if fallback == "groq" else settings.ASK_MODEL
                return fb_provider.generate_json(model=fb_model, prompt=prompt, system_prompt=system_prompt)
            except:
                raise e

    def generate_vision(self, task: str, prompt: str, file_bytes: bytes, mime_type: str, expect_json: bool = False) -> Any:
        """
        Routes a vision request based on the task type.
        """
        # Groq has decommissioned its vision models, so we must force Gemini for vision
        provider_name = "gemini"
        model = "gemini-2.5-flash"
        
        provider = self.get_provider(provider_name)
        try:
            return provider.generate_vision(model=model, prompt=prompt, file_bytes=file_bytes, mime_type=mime_type, expect_json=expect_json)
        except Exception as e:
            try:
                print(f"[AIRouter Vision Fallback] Gemini failed: {e}. Falling back to OpenRouter...")
                fb_provider = self.get_provider("openrouter")
                return fb_provider.generate_vision(model="google/gemini-2.5-flash", prompt=prompt, file_bytes=file_bytes, mime_type=mime_type, expect_json=expect_json)
            except Exception as fb_e:
                raise e

    def generate_chat(self, task: str, messages: List[Dict[str, Any]], system_prompt: Optional[str] = None) -> str:
        """
        Routes a chat request.
        """
        provider_name = settings.ASK_AI_PROVIDER if task == "ask" else settings.BACKGROUND_AI_PROVIDER
        model = getattr(settings, f"{task.upper()}_MODEL", settings.ASK_MODEL if task == "ask" else settings.BACKGROUND_MODEL)
        
        provider = self.get_provider(provider_name)
        try:
            return provider.generate_chat(model=model, messages=messages, system_prompt=system_prompt)
        except Exception as e:
            fallback = "groq" if provider_name == "gemini" else "gemini"
            try:
                fb_provider = self.get_provider(fallback)
                print(f"[AIRouter Fallback] {provider_name} failed: {e}. Falling back to {fallback}")
                fb_model = settings.BACKGROUND_MODEL if fallback == "groq" else settings.ASK_MODEL
                return fb_provider.generate_chat(model=fb_model, messages=messages, system_prompt=system_prompt)
            except:
                raise e

    def generate_embedding(self, text: str) -> List[float]:
        """
        Routes an embedding request. Hardcoded to Gemini as per requirements.
        Returns a zero vector if the quota is exhausted or an error occurs.
        """
        provider = self.get_provider("gemini")
        try:
            return provider.generate_embedding(model="gemini-embedding-2", text=text)
        except Exception as e:
            print(f"[AIRouter] Embedding failed (Quota Exhausted?): {e}. Returning zero vector.")
            return [0.0] * 768 # Standard Gemini embedding size

# Singleton instance
ai_router = AIRouter()
