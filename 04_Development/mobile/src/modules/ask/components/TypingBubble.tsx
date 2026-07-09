import { View, StyleSheet } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  useSharedValue, 
  withSequence,
  withDelay
} from 'react-native-reanimated';
import { useEffect } from 'react';
import { colors } from '../../../../src/shared/theme/colors';

export function TypingBubble() {
  const dot1 = useSharedValue(0.3);
  const dot2 = useSharedValue(0.3);
  const dot3 = useSharedValue(0.3);

  useEffect(() => {
    const config = { duration: 400 };
    dot1.value = withRepeat(withSequence(withTiming(1, config), withTiming(0.3, config)), -1, true);
    dot2.value = withDelay(200, withRepeat(withSequence(withTiming(1, config), withTiming(0.3, config)), -1, true));
    dot3.value = withDelay(400, withRepeat(withSequence(withTiming(1, config), withTiming(0.3, config)), -1, true));
  }, []);

  const style1 = useAnimatedStyle(() => ({ opacity: dot1.value, transform: [{ scale: dot1.value * 0.5 + 0.5 }] }));
  const style2 = useAnimatedStyle(() => ({ opacity: dot2.value, transform: [{ scale: dot2.value * 0.5 + 0.5 }] }));
  const style3 = useAnimatedStyle(() => ({ opacity: dot3.value, transform: [{ scale: dot3.value * 0.5 + 0.5 }] }));

  return (
    <View style={styles.container}>
      <View style={styles.bubble}>
        <Animated.View style={[styles.dot, style1]} />
        <Animated.View style={[styles.dot, style2]} />
        <Animated.View style={[styles.dot, style3]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    width: '100%',
  },
  bubble: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginLeft: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  }
});
