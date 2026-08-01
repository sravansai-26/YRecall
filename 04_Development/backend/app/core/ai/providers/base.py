from abc import ABC, abstractmethod
from typing import Optional, Dict, Any, List

class AIProvider(ABC):
    """
    Abstract base class for AI providers.
    All providers (Gemini, OpenRouter, etc.) must implement these methods.
    """
    
    @abstractmethod
    def generate_text(self, model: str, prompt: str, system_prompt: Optional[str] = None) -> str:
        """Generates plain text response."""
        pass
        
    @abstractmethod
    def generate_json(self, model: str, prompt: str, system_prompt: Optional[str] = None) -> Dict[str, Any]:
        """Generates a JSON response and returns a parsed dictionary."""
        pass
        
    @abstractmethod
    def generate_vision(self, model: str, prompt: str, file_bytes: bytes, mime_type: str, expect_json: bool = False) -> Any:
        """Analyzes media (image/audio) and returns either text or a parsed JSON dict based on expect_json."""
        pass
        
    @abstractmethod
    def generate_chat(self, model: str, messages: List[Dict[str, Any]], system_prompt: Optional[str] = None) -> str:
        """Generates a chat response from a list of messages."""
        pass
        
    @abstractmethod
    def generate_embedding(self, model: str, text: str) -> List[float]:
        """Generates embeddings for a given text."""
        pass
