import { MaterialIcons } from '@expo/vector-icons';
import { Pressable, Text, StyleSheet, Platform, View } from 'react-native';
import Animated, { useAnimatedKeyboard, useAnimatedStyle, withTiming, interpolate, Extrapolation, runOnJS } from 'react-native-reanimated';
import { useSegments } from 'expo-router';
import { colors } from '../theme/colors';

export type BottomNavRoute = 'home' | 'timeline' | 'ask' | 'search' | 'profile' | 'settings' | 'capture';

interface BottomNavBarProps {
  activeRoute: BottomNavRoute;
  onNavigate: (route: BottomNavRoute) => void;
}

export default function BottomNavBar({
  activeRoute,
  onNavigate,
}: BottomNavBarProps) {
  const keyboard = useAnimatedKeyboard();
  const segments = useSegments();
  
  // Only hide on the ask screen natively to prevent layout jumps on other tabs
  const isAskScreen = segments[segments.length - 1] === 'ask';

  // The animatedStyle was intentionally removed to ensure the tab bar is always visible.
  // Using an empty array or object instead of animatedStyle to keep the JSX the same.
  const animatedStyle = {};

  const routesLeft = [
    { id: 'home', label: 'Home', icon: 'home' },
    { id: 'timeline', label: 'Recall', icon: 'timeline' },
  ] as const;

  const routesRight = [
    { id: 'ask', label: 'Ask AI', icon: 'auto-awesome' },
    { id: 'settings', label: 'Settings', icon: 'settings' },
  ] as const;

  const renderRoute = (route: any) => {
    const isActive = activeRoute === route.id;
    return (
      <Pressable
        key={route.id}
        onPress={() => onNavigate(route.id)}
        style={[
          styles.navItem,
          isActive && styles.navItemActive,
        ]}
      >
        <MaterialIcons
          name={route.icon as any}
          size={24}
          color={
            isActive
              ? colors['on-secondary-container']
              : colors['on-surface-variant']
          }
        />
        <Text
          style={[
            styles.navText,
            isActive ? styles.navTextActive : styles.navTextInactive,
          ]}
          numberOfLines={1}
        >
          {route.label}
        </Text>
      </Pressable>
    );
  };

  return (
    <View style={styles.wrapper}>
      <Animated.View style={[styles.container, animatedStyle]}>
        <View style={styles.sideContainer}>
          {routesLeft.map(renderRoute)}
        </View>
        <View style={styles.spacer} />
        <View style={styles.sideContainer}>
          {routesRight.map(renderRoute)}
        </View>
      </Animated.View>

      <Animated.View style={[styles.captureButtonWrapper, animatedStyle]}>
        <Pressable 
          onPress={() => onNavigate('capture')}
        >
          <View style={styles.captureButton}>
            <MaterialIcons name="add" size={32} color={colors['on-primary']} />
          </View>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: 'transparent',
  },
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: colors['surface-container-low'],
    paddingBottom: 28,
    paddingTop: 12,
    paddingHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 10,
  },
  spacer: {
    width: 80, // Space for the floating button
  },
  sideContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  captureButtonWrapper: {
    position: 'absolute',
    top: -28,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 99,
    elevation: 99,
  },
  captureButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 12,
  },
  navItem: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    paddingVertical: 6,
    flex: 1,
  },
  navItemActive: {
    transform: [{ scale: 0.95 }],
    borderRadius: 16,
    backgroundColor: colors['secondary-container'],
  },
  navText: {
    fontFamily: 'PublicSans_600SemiBold',
    fontSize: 10,
    marginTop: 4,
  },
  navTextActive: {
    color: colors['on-secondary-container'],
  },
  navTextInactive: {
    color: colors['on-surface-variant'],
  },
});
