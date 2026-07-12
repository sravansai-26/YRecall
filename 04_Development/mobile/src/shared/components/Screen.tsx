import type { ReactNode } from 'react';
import { ScrollView, View, Platform, KeyboardAvoidingView } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

interface ScreenProps {
  children: ReactNode;
  scrollable?: boolean;
  className?: string;
  noSafeArea?: boolean;
  avoidKeyboard?: boolean; // New prop to enable keyboard avoidance
}

export default function Screen({
  children,
  scrollable = true,
  className = '',
  noSafeArea = false,
  avoidKeyboard = false, // Default false to maintain backward compatibility
}: ScreenProps) {
  const insets = useSafeAreaInsets();
  
  const content = scrollable ? (
    <ScrollView
      className={`flex-1 ${className}`}
      contentContainerStyle={{ 
        paddingBottom: Math.max(insets.bottom, 120),
        flexGrow: 1,
      }}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
    >
      {children}
    </ScrollView>
  ) : (
    <View className={`flex-1 ${className}`}>{children}</View>
  );

  // If keyboard avoidance is requested, wrap with KeyboardAvoidingView
  const wrappedContent = avoidKeyboard ? (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      {content}
    </KeyboardAvoidingView>
  ) : (
    content
  );

  if (noSafeArea) {
    return <View className="flex-1 bg-background">{wrappedContent}</View>;
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      {wrappedContent}
    </SafeAreaView>
  );
}