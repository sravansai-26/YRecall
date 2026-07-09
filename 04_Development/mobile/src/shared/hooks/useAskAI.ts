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
  citations?: Citation[];
  status?: 'sending' | 'streaming' | 'completed' | 'failed';
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
    mutationFn: async ({ message, conversationId }: { message: string; conversationId: string | null; optimisticId?: string }) => {
      const response = await apiClient.post<ApiResponse<ChatResponse>>('/ai/chat', {
        message,
        conversation_id: conversationId,
      });
      return response.data.data;
    },
    onMutate: async ({ message, conversationId, optimisticId }) => {
      if (!conversationId) return { previousMessages: [] };
      
      await queryClient.cancelQueries({ queryKey: aiKeys.messages(conversationId) });
      const previousMessages = queryClient.getQueryData<AIMessage[]>(aiKeys.messages(conversationId));
      
      const userMessage: AIMessage = {
        id: optimisticId || Date.now().toString(),
        role: 'user',
        content: message,
        created_at: new Date().toISOString(),
        status: 'completed'
      };

      const assistantPlaceholder: AIMessage = {
        id: `assistant-${optimisticId || Date.now()}`,
        role: 'assistant',
        content: '',
        created_at: new Date().toISOString(),
        status: 'sending'
      };
      
      queryClient.setQueryData<AIMessage[]>(aiKeys.messages(conversationId), (old) => {
        return [...(old || []), userMessage, assistantPlaceholder];
      });
      
      return { previousMessages };
    },
    onError: (err, newMsg, context) => {
      if (newMsg.conversationId) {
        queryClient.setQueryData<AIMessage[]>(aiKeys.messages(newMsg.conversationId), (old) => {
          if (!old) return old;
          // Mark the last assistant message as failed
          const updated = [...old];
          const lastMsg = updated[updated.length - 1];
          if (lastMsg && lastMsg.role === 'assistant' && lastMsg.status === 'sending') {
            lastMsg.status = 'failed';
          }
          return updated;
        });
      }
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: aiKeys.conversations() });
      
      const activeConversationId = data.conversation_id;
      
      // We safely invalidate to get the true server state including the user message ID
      queryClient.invalidateQueries({ queryKey: aiKeys.messages(activeConversationId) });
    },
  });
}
