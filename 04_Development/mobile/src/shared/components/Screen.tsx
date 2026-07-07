import type { ReactNode } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

interface ScreenProps {
  children: ReactNode;
  scrollable?: boolean;
  className?: string;
  noSafeArea?: boolean;
}

export default function Screen({
  children,
  scrollable = true,
  className = '',
  noSafeArea = false,
}: ScreenProps) {
  const insets = useSafeAreaInsets();
  
  const content = scrollable ? (
    <ScrollView
      className={`flex-1 ${className}`}
      contentContainerStyle={{ paddingBottom: Math.max(insets.bottom, 120) }}
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  ) : (
    <View className={`flex-1 ${className}`}>{children}</View>
  );

  if (noSafeArea) {
    return <View className="flex-1 bg-background">{content}</View>;
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      {content}
    </SafeAreaView>
  );
}
