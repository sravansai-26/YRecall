import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../../../src/shared/theme/colors';
import Animated, { useAnimatedStyle, withSpring, useSharedValue } from 'react-native-reanimated';
import { useAskStore } from '../../../../src/shared/store/useAskStore';
import { useConversations } from '../../../../src/shared/hooks/useAskAI';

import { useRouter } from 'expo-router';

interface ChatHeaderProps {
  onNewChat: () => void;
  onOpenHistory: () => void;
}

export function ChatHeader({ onNewChat, onOpenHistory }: ChatHeaderProps) {
  const scale = useSharedValue(1);
  const router = useRouter();
  
  const { activeConversationId } = useAskStore();
  const { data: conversations } = useConversations();
  
  const activeConversation = conversations?.find(c => c.id === activeConversationId);
  const displayTitle = activeConversation?.title || 'YRecall';

  const handlePressIn = () => {
    scale.value = withSpring(0.9);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }]
  }));

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <TouchableOpacity 
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <MaterialIcons name="arrow-back" size={24} color={colors['on-surface']} />
        </TouchableOpacity>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>AI</Text>
        </View>
        <Text style={styles.title} numberOfLines={1}>{displayTitle}</Text>
      </View>
      <View style={styles.rightActions}>
        <TouchableOpacity 
          onPress={onOpenHistory}
          style={styles.actionButton}
        >
          <MaterialIcons name="history" size={24} color={colors['on-surface']} />
        </TouchableOpacity>
        <Animated.View style={animatedStyle}>
          <TouchableOpacity 
            onPress={onNewChat}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            style={styles.newChatButton}
          >
            <MaterialIcons name="add" size={24} color={colors['on-surface']} />
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
    backgroundColor: colors.background,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    marginRight: 16,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -8,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors['surface-container-high'],
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: 'PublicSans_700Bold',
    fontSize: 12,
    color: colors['on-surface'],
  },
  title: {
    fontFamily: 'PublicSans_600SemiBold',
    fontSize: 18,
    color: colors['on-surface'],
    flex: 1,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  newChatButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors['surface-container-low'],
  }
});
