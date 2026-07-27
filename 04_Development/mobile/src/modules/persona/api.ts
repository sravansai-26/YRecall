import { apiClient } from '../../../src/services/api/client';

export interface UserPersona {
 id?: string;
 communication_style?: string;
 thinking_style?: string;
 productivity_style?: string;
 personality?: string;
 occupation?: string;
 industry?: string;
 role?: string;
 country?: string;
 age_group?: string;
 education_level?: string;
 interests?: string[];
 preferred_language?: string;
 preferred_ai_tone?: string;
 notification_preference?: string;
 work_schedule?: string;
 sleep_schedule?: string;
 timezone?: string;
 memory_goals?: string;
 long_term_goals?: string;
 preferred_summary_size?: string;
 
 // Behavior config
 learning_speed?: string;
 creative_level?: string;
 analytical_level?: string;
 reasoning_depth?: string;
 
 // Memory config
 capture_priority?: string;
 relationship_discovery?: string;
 auto_categorization?: string;
 entity_importance?: string;
 memory_retention?: string;
 timeline_preferences?: string;
 graph_expansion?: string;
}

export interface UserGoal {
 id: string;
 title: string;
 category?: string;
 description?: string;
 target_date?: string;
 status: string;
}

export interface UserPreferences {
 theme: string;
 language: string;
 units: string;
 calendar: string;
 privacy: string;
 ai_verbosity: string;
 response_style: string;
 emoji_preference: string;
 markdown_preference: string;
 voice_preference?: string;
}

export interface UserBehavior {
 data: Record<string, any>;
}

export interface PersonaProfile {
 persona: UserPersona | null;
 preferences: UserPreferences | null;
 goals: UserGoal[];
 behavior: UserBehavior | null;
}

export const personaApi = {
 getProfile: () => apiClient.get<PersonaProfile>('/persona/profile'),
 
 updatePersona: (data: Partial<UserPersona>) => 
 apiClient.put<{success: boolean, persona: UserPersona}>('/persona/persona', data),
 
 resetLearning: () => apiClient.post<{success: boolean}>('/persona/reset-learning', {}),
};
