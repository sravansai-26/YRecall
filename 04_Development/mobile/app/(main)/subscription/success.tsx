import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Screen } from '../../../src/shared/components';
import { colors } from '../../../src/shared/theme/colors';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';

export default function PremiumSuccess() {
  const router = useRouter();
  
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -20,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        })
      ])
    ).start();
  }, []);

  return (
    <Screen className="bg-background">
      {/* Header */}
      <View className="w-full max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop py-6 flex-row justify-start items-center">
        <View className="flex-row items-center gap-2">
          <MaterialIcons name="auto-awesome" size={32} color={colors.primary} />
          <Text className="font-headline-md text-3xl font-bold text-primary">YRecall</Text>
        </View>
      </View>

      {/* Main Content */}
      <View className="flex-1 flex-col items-center justify-center w-full px-margin-mobile max-w-2xl mx-auto text-center py-12">
        
        {/* Simulation Notice */}
        <View className="bg-tertiary-container px-4 py-2 rounded-lg mb-8 w-full max-w-md mx-auto items-center flex-row justify-center gap-2">
          <MaterialIcons name="info-outline" size={16} color={colors['on-tertiary-container']} />
          <Text className="text-on-tertiary-container text-xs font-bold uppercase tracking-widest">UI Demo / Simulation Only</Text>
        </View>
        
        {/* Celebration Illustration */}
        <Animated.View 
          style={{ transform: [{ translateY: floatAnim }] }}
          className="relative w-64 h-64 md:w-80 md:h-80 mb-12 items-center justify-center"
        >
          {/* Background Glow */}
          <View className="absolute inset-0 bg-secondary-fixed opacity-30 rounded-full" style={{ transform: [{ scale: 1.2 }] }} />
          
          <View className="w-full h-full rounded-full border border-secondary/20 items-center justify-center p-4 bg-surface-container-lowest shadow-lg overflow-hidden relative">
             <Image source={{ uri: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=400&auto=format&fit=crop' }} className="absolute inset-0 w-full h-full opacity-50" />
             <MaterialIcons name="psychology" size={120} color={colors.secondary} />
          </View>
          
          {/* Floating Chips */}
          <View className="absolute -top-4 -right-4 bg-primary px-4 py-2 rounded-full shadow-md z-10">
            <Text className="text-white text-[10px] font-bold">Unlimited Recall</Text>
          </View>
          <View className="absolute bottom-12 -left-12 bg-secondary-container px-4 py-2 rounded-full shadow-md z-10">
            <Text className="text-on-secondary-container text-[10px] font-bold">AI Insights Unlocked</Text>
          </View>
        </Animated.View>

        {/* Copy Section */}
        <View className="flex-col items-center">
          <Text className="font-headline-md text-4xl md:text-5xl text-primary mb-4 font-bold text-center">
            Welcome to YRecall Premium
          </Text>
          <Text className="font-body-md text-base text-on-surface-variant max-w-lg mx-auto mb-12 leading-relaxed text-center">
            Your digital brain is now limitless. All premium features are unlocked and ready to use. Harness the power of complete digital memory.
          </Text>
        </View>

        {/* Action Section */}
        <View className="flex-col gap-4 w-full max-w-xs mx-auto">
          <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="bg-primary h-14 rounded-xl shadow-lg flex-row items-center justify-center gap-2  transition-all">
            <Text className="text-white font-bold text-base">Explore Premium Features</Text>
            <MaterialIcons name="arrow-forward" size={20} color="#ffffff" />
          </TouchableOpacity>
          <TouchableOpacity 
            className="bg-surface-container-high h-14 rounded-xl items-center justify-center  transition-colors"
            onPress={() => router.push('/(main)/(tabs)')}
          >
            <Text className="text-primary font-bold text-base">Back to Home</Text>
          </TouchableOpacity>
        </View>

        {/* Footer Notice */}
        <View className="mt-16 flex-row items-center justify-center gap-2">
          <MaterialIcons name="mail" size={18} color={colors['on-surface-variant']} />
          <Text className="text-xs text-on-surface-variant">
            A confirmation email has been sent to <Text className="font-bold text-primary">julianne.v@yrecall.ai</Text>
          </Text>
        </View>

      </View>
    </Screen>
  );
}
