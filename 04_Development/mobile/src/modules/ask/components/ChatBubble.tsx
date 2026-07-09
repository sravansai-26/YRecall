import { View, Text, StyleSheet } from 'react-native';
import Markdown from 'react-native-markdown-display';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { colors } from '../../../../src/shared/theme/colors';
import { CitationCard } from './CitationCard';

interface Citation {
  content: string;
}

interface ChatBubbleProps {
  role: 'user' | 'assistant';
  content: string;
  citations?: Citation[];
}

export function ChatBubble({ role, content, citations }: ChatBubbleProps) {
  const isUser = role === 'user';

  return (
    <Animated.View entering={FadeInUp.duration(400).springify()} style={[styles.container, isUser ? styles.containerUser : styles.containerAssistant]}>
      <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleAssistant]}>
        {isUser ? (
          <Text style={styles.userText}>{content}</Text>
        ) : (
          <Markdown
            style={{
              body: { color: colors['on-surface'], fontSize: 16, lineHeight: 26, fontFamily: 'PublicSans_400Regular' },
              heading1: { color: colors['on-surface'], fontSize: 24, fontFamily: 'PublicSans_700Bold', marginVertical: 12, letterSpacing: -0.5 },
              heading2: { color: colors['on-surface'], fontSize: 20, fontFamily: 'PublicSans_600SemiBold', marginVertical: 10, letterSpacing: -0.3 },
              heading3: { color: colors['on-surface'], fontSize: 18, fontFamily: 'PublicSans_600SemiBold', marginVertical: 8 },
              strong: { color: colors['on-surface'], fontFamily: 'PublicSans_700Bold' },
              em: { color: colors['on-surface'], fontStyle: 'italic' },
              link: { color: colors.primary, textDecorationLine: 'underline' },
              list_item: { marginVertical: 4 },
              bullet_list: { marginBottom: 12 },
              ordered_list: { marginBottom: 12 },
              code_inline: { backgroundColor: colors['surface-container-high'], paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, fontFamily: 'monospace', fontSize: 14 },
              code_block: { backgroundColor: colors['surface-container-highest'], padding: 16, borderRadius: 12, marginVertical: 12, fontFamily: 'monospace', color: colors['on-surface'], fontSize: 14 },
              paragraph: { marginTop: 0, marginBottom: 12 }
            }}
          >
            {content}
          </Markdown>
        )}
        
        {/* Citations */}
        {!isUser && citations && citations.length > 0 && (
          <CitationCard citations={citations} />
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    width: '100%',
  },
  containerUser: {
    alignItems: 'flex-end',
  },
  containerAssistant: {
    alignItems: 'flex-start',
  },
  bubble: {
    maxWidth: '90%',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  bubbleUser: {
    backgroundColor: colors['secondary-container'],
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 4,
  },
  bubbleAssistant: {
    backgroundColor: 'transparent',
    maxWidth: '100%',
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  userText: {
    fontFamily: 'PublicSans_400Regular',
    fontSize: 16,
    lineHeight: 24,
    color: colors['on-secondary-container'],
  }
});
