import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useVideoPlayer, VideoView } from 'expo-video';
import { Screen } from '../../src/shared/components';
import { colors } from '../../src/shared/theme/colors';
import { useAuthStore } from '../../src/shared/store/useAuthStore';

export default function SplashScreenComponent() {
  const router = useRouter();
  const { isLoading, hasCompletedOnboarding, user } = useAuthStore();
  const [minTimePassed, setMinTimePassed] = React.useState(false);

  // Use the exact webm video provided by the user
  const assetId = require('../../assets/animations/oboarding-video-org-final.webm');
  
  const player = useVideoPlayer(assetId, player => {
    player.loop = false;
    player.play();
  });

  useEffect(() => {
    // Exactly 10 seconds duration as requested
    const timeout = setTimeout(() => {
      setMinTimePassed(true);
    }, 10000);

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    // Only navigate when BOTH minimum animation time has passed AND initialization is complete
    if (minTimePassed && !isLoading) {
      if (!hasCompletedOnboarding) {
        router.replace('/(onboarding)/intro-1');
      } else if (!user) {
        router.replace('/(auth)');
      } else {
        router.replace('/(main)/(tabs)');
      }
    }
  }, [minTimePassed, isLoading, hasCompletedOnboarding, user, router]);

  return (
    <Screen preset="fixed" backgroundColor={colors.surface}>
      <View style={styles.container}>
        <VideoView
          player={player}
          style={styles.video}
          contentFit="cover"
          nativeControls={false}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  video: {
    width: '120%', 
    height: '120%',
  },
});
