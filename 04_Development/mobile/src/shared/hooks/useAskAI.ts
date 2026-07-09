import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/services/api/client';
import { ApiResponse } from '@/services/api/types';

export interface Citation {
  capture_id: string;
  content: string;
  similarity_score: number;
}

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
  citations?: Citation[]; // Only attached when returning from chat mutation in our current backend, but good to have
}

export interface AIConversation {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface ChatResponse {
  conversation_id: string;
  message: AIMessage;
  citations: Citation[];
}

export const aiKeys = {
  all: ['ai'] as const,
  conversations: () => [...aiKeys.all, 'conversations'] as const,
  messages: (conversationId: string) => [...aiKeys.all, 'messages', conversationId] as const,
};

// Fetch list of conversations
export function useConversations() {
  return useQuery({
    queryKey: aiKeys.conversations(),
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<AIConversation[]>>('/ai/conversations');
      return response.data.data;
    },
  });
}

// Fetch messages for a specific conversation
export function useMessages(conversationId: string | null) {
  return useQuery({
    queryKey: aiKeys.messages(conversationId!),
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<AIMessage[]>>(`/ai/conversations/${conversationId}/messages`);
      return response.data.data;
    },
    enabled: !!conversationId,
  });
}

// Send a message
export function useChat() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ message, conversationId }: { message: string; conversationId: string | null }) => {
      const response = await apiClient.post<ApiResponse<ChatResponse>>('/ai/chat', {
        message,
        conversation_id: conversationId,
      });
      return response.data.data;
    },
    onSuccess: (data, variables) => {
      // Invalidate conversations list to update updated_at or insert new conversation
      queryClient.invalidateQueries({ queryKey: aiKeys.conversations() });
      
      // Update messages cache
      const activeConversationId = data.conversation_id;
      
      queryClient.setQueryData(aiKeys.messages(activeConversationId), (old: AIMessage[] | undefined) => {
        const newAssistantMsg: AIMessage = {
          ...data.message,
          citations: data.citations
        };
        
        // Ensure user message is also there (usually optimistic update handles this, but just in case)
        if (old) {
           return [...old, newAssistantMsg];
        }
        // If it was a new conversation, we might need to invalidate or set fresh array
        return [
           // Mock the user message since the backend doesn't return the user message object directly in the response,
           // just the assistant's. The real user message is stored, so invalidate is safer.
        ];
      });
      
      // The safest way is to just invalidate the messages query for this conversation
      queryClient.invalidateQueries({ queryKey: aiKeys.messages(activeConversationId) });
    },
  });
}
