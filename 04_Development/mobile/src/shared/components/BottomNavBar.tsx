import { MaterialIcons } from '@expo/vector-icons';
import { Pressable, Text, View, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

export type BottomNavRoute = 'home' | 'timeline' | 'ask' | 'search' | 'settings' | 'profile';

interface BottomNavBarProps {
  activeRoute: BottomNavRoute;
  onNavigate: (route: BottomNavRoute) => void;
}

export default function BottomNavBar({
  activeRoute,
  onNavigate,
}: BottomNavBarProps) {
  const routes = [
    { id: 'home', label: 'Home', icon: 'home' },
    { id: 'timeline', label: 'Timeline', icon: 'timeline' },
    { id: 'ask', label: 'Ask', icon: 'chat-bubble' },
    { id: 'search', label: 'Search', icon: 'search' },
    { id: 'settings', label: 'Settings', icon: 'settings' },
    { id: 'profile', label: 'Graph', icon: 'hub' },
  ] as const;

  return (
    <View style={styles.container}>
      {routes.map((route) => {
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
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    backgroundColor: colors['surface-container-low'],
    paddingHorizontal: 8,
    paddingBottom: 32,
    paddingTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 5,
  },
  navItem: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    flex: 1,
  },
  navItemActive: {
    transform: [{ scale: 0.9 }],
    borderRadius: 9999,
    backgroundColor: colors['secondary-container'],
  },
  navText: {
    fontFamily: 'PublicSans_500Medium',
    fontSize: 9,
    marginTop: 4,
  },
  navTextActive: {
    color: colors['on-secondary-container'],
  },
  navTextInactive: {
    color: colors['on-surface-variant'],
  },
});
