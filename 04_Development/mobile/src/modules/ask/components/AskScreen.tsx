import { View, KeyboardAvoidingView, Platform, StyleSheet, Keyboard } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAskStore } from '../../../../src/shared/store/useAskStore';
import { useMessages, useChat } from '../../../../src/shared/hooks/useAskAI';
import { useState, useRef } from 'react';

import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { HistoryModal, HistoryModalRef } from './HistoryModal';
import { ChatHeader } from './ChatHeader';
import { ConversationList } from './ConversationList';
import { Composer, ComposerRef } from './Composer';

export function AskScreen() {
  const insets = useSafeAreaInsets();
  const { activeConversationId, setActiveConversationId } = useAskStore();
  const [optimisticUserMsg, setOptimisticUserMsg] = useState<string | null>(null);
  const composerRef = useRef<ComposerRef>(null);
  
  const historyModalRef = useRef<HistoryModalRef>(null);
  
  const { data: messages } = useMessages(activeConversationId);
  const { mutate: sendMessage, isPending } = useChat();

  const handleSend = (messageText: string, attachedCaptureIds: string[] = []) => {
    setOptimisticUserMsg(messageText);
    sendMessage({ message: messageText, conversationId: activeConversationId, attachedCaptureIds }, {
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

  const handleOpenHistory = () => {
    Keyboard.dismiss();
    setTimeout(() => {
      historyModalRef.current?.present();
    }, 150);
  };

  const handleSelectConversation = (id: string) => {
    setActiveConversationId(id);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]} className="bg-background">
      <ChatHeader onNewChat={handleNewChat} onOpenHistory={handleOpenHistory} />
      
      <KeyboardAvoidingView 
        style={styles.flexContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={styles.contentContainer}>
          <ConversationList 
            messages={messages || []}
            optimisticUserMsg={optimisticUserMsg}
            isPending={isPending}
            onSuggestionSelect={(text) => handleSend(text)}
          />
          <Composer ref={composerRef} onSend={handleSend} isPending={isPending} />
        </View>
      </KeyboardAvoidingView>

      <HistoryModal 
        ref={historyModalRef} 
        onSelectConversation={handleSelectConversation}
        onNewChat={handleNewChat}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flexContainer: {
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