import { View, StyleSheet } from 'react-native';
import { useRef, useEffect } from 'react';
import { FlashList } from '@shopify/flash-list';
import { ChatBubble } from './ChatBubble';
import { TypingBubble } from './TypingBubble';
import { EmptyState } from './EmptyState';
import { AIMessage } from '../../../../src/shared/hooks/useAskAI';

interface ConversationListProps {
  messages: AIMessage[];
  optimisticUserMsg: string | null;
  isPending: boolean;
  onSuggestionSelect: (query: string) => void;
}

export function ConversationList({ 
  messages, 
  optimisticUserMsg, 
  isPending,
  onSuggestionSelect 
}: ConversationListProps) {
  const flashListRef = useRef<any>(null);

  const handleContentSizeChange = () => {
    if (messages.length > 0 || optimisticUserMsg || isPending) {
      flashListRef.current?.scrollToEnd({ animated: true });
    }
  };

  // FIX: Ensure empty state never flashes by keeping layout locked during active mutations
  const isEmpty = !messages?.length && !optimisticUserMsg && !isPending;

  if (isEmpty) {
    return <EmptyState onSelectQuery={onSuggestionSelect} />;
  }

  const data: any[] = [...(messages || [])];
  
  if (optimisticUserMsg) {
    data.push({
      id: 'optimistic-user',
      role: 'user',
      content: optimisticUserMsg,
      status: 'completed',
    });
  }

  if (isPending) {
    data.push({
      id: 'optimistic-assistant',
      role: 'assistant',
      content: '',
      status: 'sending',
    });
  }

  const renderItem = ({ item }: { item: any }) => {
    if (item.status === 'sending') {
      return (
        <View style={styles.messageWrapper}>
          <TypingBubble />
        </View>
      );
    }

    return (
      <View style={styles.messageWrapper}>
        <ChatBubble 
          role={item.role as 'user' | 'assistant'}
          content={item.content}
          citations={item.citations}
        />
      </View>
    );
  };
return (
    <View style={styles.container}>
      <FlashList
        ref={flashListRef}
        data={data}
        renderItem={renderItem}
        contentContainerStyle={styles.contentContainerStyle}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        onContentSizeChange={handleContentSizeChange}
        onLayout={handleContentSizeChange}
        {...({
          estimatedItemSize: 100,
          maintainVisibleContentPosition: {
            autoscrollToTopThreshold: 0
          }
        } as any)}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainerStyle: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 24,
  },
  messageWrapper: {
    marginBottom: 24,
  }
});