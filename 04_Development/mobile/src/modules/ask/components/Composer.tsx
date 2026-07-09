import { View, TextInput, TouchableOpacity, StyleSheet, Keyboard, Platform, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../../../src/shared/theme/colors';
import { useState, useEffect, forwardRef, useImperativeHandle, useRef } from 'react';
import Animated, { useAnimatedStyle, withTiming, useSharedValue, Easing, withSpring } from 'react-native-reanimated';

export interface ComposerRef {
  focus: () => void;
}

interface ComposerProps {
  onSend: (message: string) => void;
  isPending: boolean;
}

export const Composer = forwardRef<ComposerRef, ComposerProps>(({ onSend, isPending }, ref) => {
  const [query, setQuery] = useState('');
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const textInputRef = useRef<TextInput>(null);

  useImperativeHandle(ref, () => ({
    focus: () => {
      textInputRef.current?.focus();
    }
  }));

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    
    const showSub = Keyboard.addListener(showEvent, () => setKeyboardVisible(true));
    const hideSub = Keyboard.addListener(hideEvent, () => setKeyboardVisible(false));
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const scale = useSharedValue(1);

  const handleSend = () => {
    const trimmed = query.trim();
    if (!trimmed || isPending) return;
    onSend(trimmed);
    setQuery('');
  };

  const hasText = query.trim().length > 0;

  const handlePressIn = () => {
    scale.value = withSpring(0.9, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  const animatedSendStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }]
  }));

  return (
    <View style={styles.outerContainer}>
      <View style={styles.inputContainer}>
        
        {/* Attachment Button */}
        <TouchableOpacity style={styles.iconButton}>
          <MaterialIcons name="add" size={24} color={colors.outline} />
        </TouchableOpacity>
        
        {/* Input Field */}
        <TextInput
          ref={textInputRef}
          style={styles.textInput}
          placeholder="Message YRecall..."
          placeholderTextColor={colors.outline}
          value={query}
          onChangeText={setQuery}
          multiline
          maxLength={2000}
        />
        
        {/* Actions Container */}
        <View style={styles.actionsContainer}>
          {!hasText && !isPending ? (
            <TouchableOpacity style={styles.iconButton}>
              <MaterialIcons name="mic" size={24} color={colors.outline} />
            </TouchableOpacity>
          ) : (
            <Animated.View style={animatedSendStyle}>
              <Pressable 
                onPress={handleSend}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                disabled={isPending || !hasText}
                style={[
                  styles.sendButton,
                  isPending || !hasText ? styles.sendButtonDisabled : styles.sendButtonActive
                ]}
              >
                <MaterialIcons 
                  name={isPending ? "more-horiz" : "arrow-upward"} 
                  size={24} 
                  color={isPending || !hasText ? colors['on-surface-variant'] : colors.white} 
                />
              </Pressable>
            </Animated.View>
          )}
        </View>

      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  outerContainer: {
    backgroundColor: colors.background,
    paddingTop: 8,
    paddingBottom: 12,
    paddingHorizontal: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: colors.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    minHeight: 48,
    paddingHorizontal: 6,
    paddingVertical: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  textInput: {
    flex: 1,
    fontFamily: 'PublicSans_400Regular',
    fontSize: 16,
    color: colors['on-surface'],
    minHeight: 36,
    maxHeight: 120,
    paddingTop: 8,
    paddingBottom: 8,
    paddingHorizontal: 8,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  sendButtonDisabled: {
    backgroundColor: colors['surface-container-high'],
    shadowOpacity: 0,
    elevation: 0,
  },
  sendButtonActive: {
    backgroundColor: colors.primary,
  }
});
