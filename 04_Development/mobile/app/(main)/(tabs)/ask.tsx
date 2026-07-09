import { View, Text, TouchableOpacity, ScrollView, TextInput, KeyboardAvoidingView, Platform, Image, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Screen } from '../../../src/shared/components';
import { colors } from '../../../src/shared/theme/colors';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../../src/shared/store/useAuthStore';
import { useAskStore } from '../../../src/shared/store/useAskStore';
import { useMessages, useChat, AIMessage } from '../../../src/shared/hooks/useAskAI';

function TypingBubble() {
  const [dots, setDots] = useState('');
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => (prev.length >= 3 ? '' : prev + '.'));
    }, 400);
    return () => clearInterval(interval);
  }, []);

  return (
    <View className="bg-primary rounded-3xl rounded-tl-sm p-4 shadow-xl border border-primary-fixed/20 self-start">
      <Text className="font-body-md text-white font-bold tracking-widest">
        Thinking{dots}
      </Text>
    </View>
  );
}

export default function AssistantHub() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { activeConversationId, setActiveConversationId } = useAskStore();
  
  const [query, setQuery] = useState('');
  const [optimisticUserMsg, setOptimisticUserMsg] = useState<string | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  
  const { data: messages, isLoading: isLoadingMessages } = useMessages(activeConversationId);
  const { mutate: sendMessage, isPending } = useChat();

  const handleSend = () => {
    if (!query.trim()) return;
    
    setOptimisticUserMsg(query.trim());
    sendMessage({ message: query.trim(), conversationId: activeConversationId }, {
      onSuccess: (data) => {
        if (!activeConversationId) {
          setActiveConversationId(data.conversation_id);
        }
        setOptimisticUserMsg(null);
      },
      onError: () => {
        setOptimisticUserMsg(null);
        require('react-native').Alert.alert('Error', 'Failed to send message.');
      }
    });
    setQuery('');
  };

  const handleNewChat = () => {
    setActiveConversationId(null);
  };

  // Auto-scroll to bottom
  useEffect(() => {
    if (messages?.length || optimisticUserMsg || isPending) {
      setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [messages, optimisticUserMsg, isPending]);

  return (
    <Screen scrollable={false}>
      {/* Top Header */}
      <View className="bg-surface z-40 h-16 w-full flex-row items-center justify-between px-margin-mobile">
        <View className="flex-row items-center gap-4">
          <TouchableOpacity onPress={() => router.push('/(main)/profile-edit')} className="w-10 h-10 rounded-full bg-surface-container-high items-center justify-center border border-outline-variant/20 overflow-hidden">
             {user?.photoURL ? (
               <Image source={{ uri: user.photoURL }} className="w-full h-full" />
             ) : (
               <MaterialIcons name="person" size={24} color={colors.primary} />
             )}
          </TouchableOpacity>
          <Text className="font-display-lg-mobile text-[36px] font-bold text-primary tracking-tight">YRecall</Text>
        </View>
        <TouchableOpacity onPress={handleNewChat} className="w-10 h-10 items-center justify-center rounded-full bg-surface-container">
          <MaterialIcons name="add" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 w-full max-w-2xl mx-auto"
      >
        <ScrollView 
          ref={scrollViewRef}
          className="flex-1 px-margin-mobile" 
          contentContainerStyle={{ paddingBottom: 120, paddingTop: 20 }}
          keyboardShouldPersistTaps="handled"
        >
          {(!messages || messages.length === 0) && !optimisticUserMsg && !isPending ? (
            <View className="flex-1 justify-center mt-12">
              {/* Header */}
              <View className="text-center py-xl items-center">
                <Text className="font-headline-md text-primary mb-2 font-bold text-center">Hello, how can I help you remember?</Text>
                <Text className="text-on-surface-variant font-body-md text-center">Search your conversations, notes, and life timeline.</Text>
              </View>

              {/* Suggested Questions */}
              <View className="flex-row flex-wrap gap-sm justify-center mb-xl">
                <TouchableOpacity onPress={() => setQuery("What did I recently learn about development?")} className="px-lg py-3 bg-white border border-outline-variant rounded-xl shadow-sm">
                  <Text className="text-on-surface-variant text-body-md">"Recent learnings"</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setQuery("Remind me of my design principles.")} className="px-lg py-3 bg-white border border-outline-variant rounded-xl shadow-sm">
                  <Text className="text-on-surface-variant text-body-md">"Design principles"</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setQuery("What are some ideas I had recently?")} className="px-lg py-3 bg-white border border-outline-variant rounded-xl shadow-sm">
                  <Text className="text-on-surface-variant text-body-md">"Recent ideas"</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View className="flex-col gap-lg">
              {messages?.map((msg) => (
                <View key={msg.id} className={`flex-col ${msg.role === 'user' ? 'items-end self-end max-w-[85%]' : 'items-start max-w-[85%]'}`}>
                  <View className={msg.role === 'user' 
                    ? "bg-surface-container-high rounded-3xl rounded-tr-sm p-lg shadow-sm border border-outline-variant/30"
                    : "bg-primary rounded-3xl rounded-tl-sm p-lg shadow-xl border border-primary-fixed/20"
                  }>
                    <Text className={`font-body-md leading-relaxed ${msg.role === 'user' ? 'text-on-surface' : 'text-white'}`}>
                      {msg.content}
                    </Text>
                    
                    {/* Sources (only for AI with citations) */}
                    {msg.role === 'assistant' && msg.citations && msg.citations.length > 0 && (
                      <View className="mt-lg pt-md border-t border-white/10 flex-col gap-sm">
                        <Text className="font-label-xs text-secondary-fixed uppercase tracking-wider">Sources</Text>
                        <View className="flex-row flex-wrap gap-xs">
                          {msg.citations.slice(0, 3).map((cit, idx) => (
                            <View key={idx} className="flex-row items-center gap-1 bg-white/10 px-2 py-1 rounded-full">
                              <MaterialIcons name="description" size={14} color={colors.white} />
                              <Text className="text-caption-sm text-white/90" numberOfLines={1} style={{ maxWidth: 120 }}>
                                {cit.content.slice(0, 20)}...
                              </Text>
                            </View>
                          ))}
                        </View>
                      </View>
                    )}
                  </View>
                </View>
              ))}

              {optimisticUserMsg && (
                <View className="flex-col items-end self-end max-w-[85%]">
                  <View className="bg-surface-container-high rounded-3xl rounded-tr-sm p-lg shadow-sm border border-outline-variant/30">
                    <Text className="font-body-md text-on-surface">{optimisticUserMsg}</Text>
                  </View>
                </View>
              )}

              {isPending && <TypingBubble />}
            </View>
          )}
        </ScrollView>

        {/* Input Bar */}
        <View className="absolute bottom-6 left-0 right-0 px-margin-mobile">
          <View className="bg-white rounded-3xl shadow-lg border border-outline-variant/20 flex-row items-end gap-3 p-2 min-h-[56px]">
            <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Voice and attachments coming in Phase 3')} className="w-10 h-10 rounded-full items-center justify-center mb-1">
              <MaterialIcons name="add-circle" size={24} color={colors['on-surface-variant']} />
            </TouchableOpacity>
            <TextInput
              className="flex-1 bg-transparent font-body-md text-primary pt-3 pb-3 max-h-[120px]"
              placeholder="Ask anything..."
              placeholderTextColor={colors.outline}
              value={query}
              onChangeText={setQuery}
              multiline
              textAlignVertical="center"
            />
            <View className="flex-row items-center gap-2 pr-2 mb-1">
              <TouchableOpacity 
                onPress={handleSend}
                disabled={isPending || !query.trim()}
                className={`w-10 h-10 rounded-full items-center justify-center shadow-sm ${isPending || !query.trim() ? 'bg-surface-container' : 'bg-primary'}`}
              >
                {isPending ? (
                   <ActivityIndicator color={colors.primary} size="small" />
                ) : (
                   <MaterialIcons name="arrow-upward" size={20} color={isPending || !query.trim() ? colors.outline : colors.white} />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}
