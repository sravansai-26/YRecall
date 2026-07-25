from sqlalchemy import Column, String, DateTime, ForeignKey, Boolean, Integer, Float
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.sql import func
import uuid
from ...core.database import Base

class VoiceSettings(Base):
    __tablename__ = "voice_settings"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    
    # 2. Recording Preferences
    recording_quality = Column(String, default="high") # high, medium, low
    auto_gain = Column(Boolean, default=True)
    noise_reduction = Column(Boolean, default=True)
    echo_cancellation = Column(Boolean, default=True)
    silence_detection = Column(Boolean, default=True)
    automatic_stop = Column(Boolean, default=False)
    max_recording_length = Column(Integer, default=60) # minutes
    sample_rate = Column(Integer, default=44100) # hz

    # 3. Speech Recognition
    recognition_language = Column(String, default="en-US")
    auto_language_detection = Column(Boolean, default=True)
    recognition_accuracy = Column(String, default="balanced") # fast, balanced, highly_accurate
    streaming_recognition = Column(Boolean, default=True)
    offline_recognition = Column(Boolean, default=False)
    confidence_threshold = Column(Float, default=0.8)

    # 4. Voice Intelligence
    auto_transcribe = Column(Boolean, default=True)
    auto_summary = Column(Boolean, default=True)
    auto_entity_extraction = Column(Boolean, default=True)
    auto_action_detection = Column(Boolean, default=True)
    auto_reminder_detection = Column(Boolean, default=True)
    auto_kg_linking = Column(Boolean, default=True)
    auto_timeline_generation = Column(Boolean, default=True)
    auto_tagging = Column(Boolean, default=True)

    # 5. Ask AI Voice
    continuous_listening = Column(Boolean, default=False)
    push_to_talk = Column(Boolean, default=True)
    wake_phrase_enabled = Column(Boolean, default=False)
    response_voice = Column(String, default="nova") # standard options
    response_speed = Column(Float, default=1.0)
    response_pitch = Column(Float, default=1.0)
    voice_feedback = Column(Boolean, default=True)
    hands_free_mode = Column(Boolean, default=False)

    # 6. Voice Playback
    playback_speed = Column(Float, default=1.0)
    pause_between_sentences = Column(Boolean, default=False)
    background_playback = Column(Boolean, default=True)
    auto_resume = Column(Boolean, default=True)

    # 7. Voice Memory Behaviour
    store_original_audio = Column(Boolean, default=True)
    store_transcript = Column(Boolean, default=True)
    compress_audio = Column(Boolean, default=True)
    auto_delete_original = Column(Boolean, default=False)
    retention_days = Column(Integer, default=365) # 0 for infinite

    # 8. Search Integration
    search_audio = Column(Boolean, default=True)
    search_transcript = Column(Boolean, default=True)
    search_speaker = Column(Boolean, default=True)
    search_semantic = Column(Boolean, default=True)

    # 9. Privacy
    encrypt_voice_files = Column(Boolean, default=True)
    allow_ai_processing = Column(Boolean, default=True)
    local_processing_preference = Column(Boolean, default=False)
    cloud_processing_preference = Column(Boolean, default=True)
    delete_temp_audio = Column(Boolean, default=True)
    microphone_permission = Column(Boolean, default=False)
    voice_history_enabled = Column(Boolean, default=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
