import { apiClient } from '../../../src/services/api/client';

export interface VoiceSettings {
    id?: string;
    
    // 2. Recording Preferences
    recording_quality?: string;
    auto_gain?: boolean;
    noise_reduction?: boolean;
    echo_cancellation?: boolean;
    silence_detection?: boolean;
    automatic_stop?: boolean;
    max_recording_length?: number;
    sample_rate?: number;

    // 3. Speech Recognition
    recognition_language?: string;
    auto_language_detection?: boolean;
    recognition_accuracy?: string;
    streaming_recognition?: boolean;
    offline_recognition?: boolean;
    confidence_threshold?: number;

    // 4. Voice Intelligence
    auto_transcribe?: boolean;
    auto_summary?: boolean;
    auto_entity_extraction?: boolean;
    auto_action_detection?: boolean;
    auto_reminder_detection?: boolean;
    auto_kg_linking?: boolean;
    auto_timeline_generation?: boolean;
    auto_tagging?: boolean;

    // 5. Ask AI Voice
    continuous_listening?: boolean;
    push_to_talk?: boolean;
    wake_phrase_enabled?: boolean;
    response_voice?: string;
    response_speed?: number;
    response_pitch?: number;
    voice_feedback?: boolean;
    hands_free_mode?: boolean;

    // 6. Voice Playback
    playback_speed?: number;
    pause_between_sentences?: boolean;
    background_playback?: boolean;
    auto_resume?: boolean;

    // 7. Voice Memory Behaviour
    store_original_audio?: boolean;
    store_transcript?: boolean;
    compress_audio?: boolean;
    auto_delete_original?: boolean;
    retention_days?: number;

    // 8. Search Integration
    search_audio?: boolean;
    search_transcript?: boolean;
    search_speaker?: boolean;
    search_semantic?: boolean;

    // 9. Privacy
    encrypt_voice_files?: boolean;
    allow_ai_processing?: boolean;
    local_processing_preference?: boolean;
    cloud_processing_preference?: boolean;
    delete_temp_audio?: boolean;
    microphone_permission?: boolean;
    voice_history_enabled?: boolean;
}

export interface VoiceStats {
    voice_memories_count: number;
    average_accuracy: number;
    storage_used_bytes: number;
    average_processing_time_ms: number;
    audio_files_count: number;
    transcripts_count: number;
    temp_files_bytes: number;
}

export const voiceApi = {
    getSettings: () => apiClient.get<VoiceSettings>('/voice/settings'),
    updateSettings: (data: Partial<VoiceSettings>) => apiClient.put<VoiceSettings>('/voice/settings', data),
    getStats: () => apiClient.get<VoiceStats>('/voice/stats'),
};
