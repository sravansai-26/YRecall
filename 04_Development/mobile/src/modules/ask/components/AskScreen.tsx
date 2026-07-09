import { View, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAskStore } from '../../../../src/shared/store/useAskStore';
import { useMessages, useChat } from '../../../../src/shared/hooks/useAskAI';
import { useState, useRef } from 'react';

import { ChatHeader } from './ChatHeader';
import { ConversationList } from './ConversationList';
import { Composer, ComposerRef } from './Composer';

export function AskScreen() {
  const insets = useSafeAreaInsets();
  const { activeConversationId, setActiveConversationId } = useAskStore();
  const [optimisticUserMsg, setOptimisticUserMsg] = useState<string | null>(null);
  const composerRef = useRef<ComposerRef>(null);
  
  const { data: messages } = useMessages(activeConversationId);
  const { mutate: sendMessage, isPending } = useChat();

  const handleSend = (messageText: string) => {
    setOptimisticUserMsg(messageText);
    sendMessage({ message: messageText, conversationId: activeConversationId }, {
      onSuccess: (data) => {
        if (!activeConversationId) {
          setActiveConversationId(data.conversation_id);
        }
        setOptimisticUserMsg(null);
      },
      onError: (error: any) => {
        setOptimisticUserMsg(null);
        
        let errorMessage = 'Failed to send message.';
        if (error.response) {
          if (error.response.status >= 500) {
             errorMessage = `HTTP ${error.response.status}\n\n${error.response.data?.detail || 'Server Error'}\n\nSupabase connection closed or backend failure.`;
          } else {
             errorMessage = `HTTP ${error.response.status}\n\n${error.response.data?.detail || 'API Error'}`;
          }
        } else if (error.request) {
          errorMessage = 'Network Error. Could not reach the backend.';
        } else {
          errorMessage = error.message;
        }
        console.error('[AskAI] Error:', error);
        require('react-native').Alert.alert('Error', errorMessage);
      }
    });
  };

  const handleNewChat = () => {
    setActiveConversationId(null);
    setTimeout(() => {
      composerRef.current?.focus();
    }, 100);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]} className="bg-background">
      <ChatHeader onNewChat={handleNewChat} />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        // FIX: Remove the 80px offset on Android so it sits perfectly flush (0 gap)
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        style={styles.container}
      >
        <View style={styles.contentContainer}>
          <ConversationList 
            messages={messages || []}
            optimisticUserMsg={optimisticUserMsg}
            isPending={isPending}
            onSuggestionSelect={handleSend}
          />
          <Composer ref={composerRef} onSend={handleSend} isPending={isPending} />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    width: '100%',
    maxWidth: 768,
    alignSelf: 'center',
    justifyContent: 'space-between',
  }
});