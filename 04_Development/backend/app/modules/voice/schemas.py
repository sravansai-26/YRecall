from pydantic import BaseModel
from uuid import UUID
from typing import Optional
from datetime import datetime

class VoiceSettingsBase(BaseModel):
    # 2. Recording Preferences
    recording_quality: Optional[str] = None
    auto_gain: Optional[bool] = None
    noise_reduction: Optional[bool] = None
    echo_cancellation: Optional[bool] = None
    silence_detection: Optional[bool] = None
    automatic_stop: Optional[bool] = None
    max_recording_length: Optional[int] = None
    sample_rate: Optional[int] = None

    # 3. Speech Recognition
    recognition_language: Optional[str] = None
    auto_language_detection: Optional[bool] = None
    recognition_accuracy: Optional[str] = None
    streaming_recognition: Optional[bool] = None
    offline_recognition: Optional[bool] = None
    confidence_threshold: Optional[float] = None

    # 4. Voice Intelligence
    auto_transcribe: Optional[bool] = None
    auto_summary: Optional[bool] = None
    auto_entity_extraction: Optional[bool] = None
    auto_action_detection: Optional[bool] = None
    auto_reminder_detection: Optional[bool] = None
    auto_kg_linking: Optional[bool] = None
    auto_timeline_generation: Optional[bool] = None
    auto_tagging: Optional[bool] = None

    # 5. Ask AI Voice
    continuous_listening: Optional[bool] = None
    push_to_talk: Optional[bool] = None
    wake_phrase_enabled: Optional[bool] = None
    response_voice: Optional[str] = None
    response_speed: Optional[float] = None
    response_pitch: Optional[float] = None
    voice_feedback: Optional[bool] = None
    hands_free_mode: Optional[bool] = None

    # 6. Voice Playback
    playback_speed: Optional[float] = None
    pause_between_sentences: Optional[bool] = None
    background_playback: Optional[bool] = None
    auto_resume: Optional[bool] = None

    # 7. Voice Memory Behaviour
    store_original_audio: Optional[bool] = None
    store_transcript: Optional[bool] = None
    compress_audio: Optional[bool] = None
    auto_delete_original: Optional[bool] = None
    retention_days: Optional[int] = None

    # 8. Search Integration
    search_audio: Optional[bool] = None
    search_transcript: Optional[bool] = None
    search_speaker: Optional[bool] = None
    search_semantic: Optional[bool] = None

    # 9. Privacy
    encrypt_voice_files: Optional[bool] = None
    allow_ai_processing: Optional[bool] = None
    local_processing_preference: Optional[bool] = None
    cloud_processing_preference: Optional[bool] = None
    delete_temp_audio: Optional[bool] = None
    microphone_permission: Optional[bool] = None
    voice_history_enabled: Optional[bool] = None

class VoiceSettingsUpdate(VoiceSettingsBase):
    pass

class VoiceSettingsResponse(VoiceSettingsBase):
    id: UUID
    user_id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class VoiceStatsResponse(BaseModel):
    voice_memories_count: int
    average_accuracy: float
    storage_used_bytes: int
    average_processing_time_ms: int
    audio_files_count: int
    transcripts_count: int
    temp_files_bytes: int
