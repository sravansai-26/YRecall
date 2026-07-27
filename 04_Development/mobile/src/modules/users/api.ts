import { apiClient } from '../../services/api/client';

export interface UserProfileData {
 user: {
 id: string;
 firebase_uid: string;
 email: string;
 display_name: string;
 photo_url: string;
 username: string;
 bio: string;
 timezone: string;
 language: string;
 country: string;
 occupation: string;
 website: string;
 social_links: Record<string, any> | null;
 birthday: string;
 last_login: string;
 last_sync: string;
 current_streak: number;
 created_at: string;
 updated_at: string;
 };
 statistics: {
 timeline_memories: number;
 captures_total: number;
 workspaces: number;
 ai_conversations: number;
 knowledge_graph_entities: number;
 storage_used_bytes: number;
 };
 persona?: {
 name: string;
 communication_style: string;
 learning_style: string;
 productivity_profile: string;
 };
}

export const fetchUserProfile = async (): Promise<UserProfileData> => {
 const { data } = await apiClient.get('/users/me/profile');
 return data;
};

export const updateUserProfile = async (updates: Partial<UserProfileData['user']>): Promise<UserProfileData['user']> => {
 const { data } = await apiClient.patch('/users/me', updates);
 return data;
};
