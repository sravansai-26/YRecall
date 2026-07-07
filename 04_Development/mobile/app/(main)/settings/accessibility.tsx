import { View, Text, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Screen } from '../../../src/shared/components';
import { colors } from '../../../src/shared/theme/colors';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { useAuthStore } from '../../../src/shared/store/useAuthStore';
import { Image } from 'react-native';

export default function AccessibilitySettings() {
  const router = useRouter();
  const { user } = useAuthStore();
  
  const [cognitiveShield, setCognitiveShield] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [hapticLevel, setHapticLevel] = useState('standard');

  return (
    <Screen scrollable={true} className="pb-24">
      {/* TopAppBar */}
      <View className="flex-1 w-full sticky top-0 z-50 bg-surface flex-row items-center justify-between px-margin-mobile md:px-margin-desktop h-16 border-b border-outline-variant/30">
        <View className="flex-row items-center gap-4">
          <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2 rounded-full ">
            <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
          </TouchableOpacity>
          <Text className="font-headline-md text-2xl font-bold text-primary">Inclusive Intelligence</Text>
        </View>
        <View className="flex-row items-center gap-3">
          <MaterialIcons name="psychology" size={24} color={colors.primary} />
          <TouchableOpacity onPress={() => router.push('/(main)/profile-edit')} className="w-8 h-8 rounded-full bg-primary-container items-center justify-center overflow-hidden border border-outline-variant/30">
            {user?.photoURL ? (
              <Image source={{ uri: user.photoURL }} className="w-full h-full" />
            ) : (
              <MaterialIcons name="person" size={20} color={colors['on-primary-container']} />
            )}
          </TouchableOpacity>
        </View>
      </View>

      <View className="max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop py-6">
        
        <View className="mb-10">
          <Text className="font-display-lg text-4xl font-bold text-on-surface mb-2">Refine your interface</Text>
          <Text className="font-body-md text-base text-on-surface-variant max-w-2xl leading-relaxed">
            Tailor the YRecall experience to your sensory and cognitive preferences. These settings prioritize clarity, reducing friction for every interaction.
          </Text>
        </View>

        <View className="flex-col gap-6">
          
          {/* Voice First Mode */}
          <View className="w-full bg-surface-container-lowest border border-outline-variant rounded-[24px] p-8 flex-col justify-between group overflow-hidden relative shadow-sm">
            <View className="z-10 flex-col">
              <View className="flex-row items-center gap-2 mb-4">
                <View className="bg-secondary-fixed px-2 py-0.5 rounded">
                  <Text className="text-on-secondary-fixed text-[10px] font-bold uppercase">Experimental</Text>
                </View>
                <Text className="font-headline-md text-2xl font-bold text-on-surface">Voice First Mode</Text>
              </View>
              <Text className="font-body-md text-base text-on-surface-variant mb-6 max-w-md">
                Transform YRecall into a conversational intelligence. Optimized for zero-glance environments and full auditory feedback.
              </Text>
              <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="bg-primary px-6 py-3 rounded-full flex-row items-center justify-center gap-2 self-start ">
                <MaterialIcons name="mic" size={20} color="#ffffff" />
                <Text className="text-white font-bold text-base">Enable Voice Interface</Text>
              </TouchableOpacity>
            </View>

            <View className="mt-8 flex-row items-center gap-6 z-10">
              <View className="flex-row items-center gap-1 h-[40px]">
                <View className="w-1 bg-secondary rounded-full h-2" />
                <View className="w-1 bg-secondary rounded-full h-6" />
                <View className="w-1 bg-secondary rounded-full h-10" />
                <View className="w-1 bg-secondary rounded-full h-4" />
                <View className="w-1 bg-secondary rounded-full h-2" />
              </View>
              <Text className="font-body-md text-sm text-secondary font-medium">Awaiting activation...</Text>
            </View>

            <View className="absolute -right-8 -bottom-8 opacity-5">
              <MaterialIcons name="hearing" size={200} color={colors.primary} />
            </View>
          </View>

          {/* Cognitive Load Reduction */}
          <View className="w-full bg-primary-container rounded-[24px] p-8 flex-col justify-between">
            <View className="flex-col">
              <MaterialIcons name="auto-awesome" size={36} color={colors['secondary-fixed-dim']} className="mb-4" />
              <Text className="font-headline-md text-2xl font-bold text-white mb-2">Cognitive Shield</Text>
              <Text className="text-sm text-on-primary-container leading-relaxed">
                Simplifies complex layouts, hides non-essential metadata, and introduces calm transitions for neurodivergent users.
              </Text>
            </View>
            <View className="mt-6 flex-row items-center gap-3">
              <Switch 
                value={cognitiveShield}
                onValueChange={setCognitiveShield}
                trackColor={{ false: colors['on-primary-fixed-variant'], true: colors.secondary }}
                thumbColor="#ffffff"
              />
              <Text className="text-sm font-medium text-white">Activate Shield</Text>
            </View>
          </View>

          {/* Typography & Contrast Controls */}
          <View className="w-full border border-outline-variant bg-surface-container-low rounded-[24px] p-6 flex-col">
            <View className="flex-row justify-between items-start mb-6">
              <View className="flex-col">
                <Text className="font-headline-md text-2xl font-bold text-on-surface">Visual Presentation</Text>
                <Text className="text-sm text-on-surface-variant">Adjust scale and readability markers.</Text>
              </View>
              <MaterialIcons name="text-fields" size={24} color={colors.outline} />
            </View>

            <View className="flex-col gap-6">
              <View className="flex-col">
                <View className="flex-row justify-between mb-2">
                  <Text className="text-xs font-bold uppercase tracking-widest text-on-surface">Typography Scale</Text>
                  <Text className="text-xs font-bold uppercase tracking-widest text-secondary">110%</Text>
                </View>
                {/* Custom Slider Track Mock */}
                <View className="w-full h-2 bg-surface-container-high rounded-lg flex-row items-center">
                  <View className="absolute w-[40%] h-full bg-secondary rounded-lg" />
                  <View className="absolute left-[40%] -ml-2 w-4 h-4 bg-secondary rounded-full" />
                </View>
                <View className="flex-row justify-between mt-2">
                  <Text className="text-[10px] uppercase font-bold text-outline">Standard</Text>
                  <Text className="text-[10px] uppercase font-bold text-outline">Large</Text>
                  <Text className="text-[10px] uppercase font-bold text-outline">Extra Large</Text>
                </View>
              </View>

              <View className="flex-row items-center justify-between p-4 bg-surface-container-lowest border border-outline-variant rounded-xl">
                <View className="flex-col flex-1 pr-4">
                  <Text className="font-bold text-base text-on-surface">High Contrast Mode</Text>
                  <Text className="text-sm text-on-surface-variant">Increases luminance ratio to 7:1</Text>
                </View>
                <Switch 
                  value={highContrast}
                  onValueChange={setHighContrast}
                  trackColor={{ false: colors['outline-variant'], true: colors.secondary }}
                  thumbColor="#ffffff"
                />
              </View>
            </View>
          </View>

          {/* Haptic Feedback */}
          <View className="w-full border border-outline-variant bg-surface-container-low rounded-[24px] p-6 flex-col">
            <View className="flex-row justify-between items-start mb-6">
              <View className="flex-col">
                <Text className="font-headline-md text-2xl font-bold text-on-surface">Haptic Engine</Text>
                <Text className="text-sm text-on-surface-variant">Tactile confirmation for neural recalls.</Text>
              </View>
              <MaterialIcons name="vibration" size={24} color={colors.outline} />
            </View>

            <View className="flex-row flex-wrap gap-4">
              
              <TouchableOpacity 
                onPress={() => setHapticLevel('subtle')}
                className={`flex-1 min-w-[120px] p-4 rounded-xl flex-col gap-2 items-center justify-center border transition-all ${hapticLevel === 'subtle' ? 'bg-secondary-container border-secondary' : 'bg-surface-container-lowest border-outline-variant '}`}
              >
                <Text className={`text-xs font-bold uppercase tracking-widest ${hapticLevel === 'subtle' ? 'text-on-secondary-container' : 'text-outline'}`}>Subtle</Text>
                <View className="flex-row gap-1 h-4 items-end">
                  <View className={`w-1 h-1 rounded-full ${hapticLevel === 'subtle' ? 'bg-white' : 'bg-outline-variant'}`} />
                  <View className={`w-1 h-2 rounded-full ${hapticLevel === 'subtle' ? 'bg-white' : 'bg-outline-variant'}`} />
                </View>
              </TouchableOpacity>

              <TouchableOpacity 
                onPress={() => setHapticLevel('standard')}
                className={`flex-1 min-w-[120px] p-4 rounded-xl flex-col gap-2 items-center justify-center border transition-all ${hapticLevel === 'standard' ? 'bg-secondary-container border-secondary' : 'bg-surface-container-lowest border-outline-variant '}`}
              >
                <Text className={`text-xs font-bold uppercase tracking-widest ${hapticLevel === 'standard' ? 'text-on-secondary-container' : 'text-outline'}`}>Standard</Text>
                <View className="flex-row gap-1 h-4 items-end">
                  <View className={`w-1 h-2 rounded-full ${hapticLevel === 'standard' ? 'bg-white' : 'bg-outline-variant'}`} />
                  <View className={`w-1 h-3 rounded-full ${hapticLevel === 'standard' ? 'bg-white' : 'bg-outline-variant'}`} />
                  <View className={`w-1 h-2 rounded-full ${hapticLevel === 'standard' ? 'bg-white' : 'bg-outline-variant'}`} />
                </View>
              </TouchableOpacity>

              <TouchableOpacity 
                onPress={() => setHapticLevel('sharp')}
                className={`flex-1 min-w-[120px] p-4 rounded-xl flex-col gap-2 items-center justify-center border transition-all ${hapticLevel === 'sharp' ? 'bg-secondary-container border-secondary' : 'bg-surface-container-lowest border-outline-variant '}`}
              >
                <Text className={`text-xs font-bold uppercase tracking-widest ${hapticLevel === 'sharp' ? 'text-on-secondary-container' : 'text-outline'}`}>Sharp</Text>
                <View className="flex-row gap-1 h-4 items-center">
                  <View className={`w-1 h-4 rounded-full ${hapticLevel === 'sharp' ? 'bg-white' : 'bg-outline-variant'}`} />
                </View>
              </TouchableOpacity>

              <TouchableOpacity 
                onPress={() => setHapticLevel('none')}
                className={`flex-1 min-w-[120px] p-4 rounded-xl flex-col gap-2 items-center justify-center border transition-all ${hapticLevel === 'none' ? 'bg-secondary-container border-secondary' : 'bg-surface-container-lowest border-outline-variant '}`}
              >
                <Text className={`text-xs font-bold uppercase tracking-widest ${hapticLevel === 'none' ? 'text-on-secondary-container' : 'text-outline'}`}>None</Text>
                <MaterialIcons name="block" size={16} color={hapticLevel === 'none' ? "#ffffff" : colors['outline-variant']} />
              </TouchableOpacity>

            </View>
          </View>

          {/* Screen Reader Data Table */}
          <View className="w-full border border-outline-variant bg-surface-container-lowest rounded-[24px] overflow-hidden flex-col">
            <View className="p-6 border-b border-outline-variant flex-row justify-between items-center">
              <View className="flex-col flex-1 pr-4">
                <Text className="font-headline-md text-2xl font-bold text-on-surface">Screen Reader Optimization</Text>
                <Text className="text-sm text-on-surface-variant">Enhanced ARIA tagging and linearized data presentation for assistive technologies.</Text>
              </View>
              <MaterialIcons name="table-chart" size={28} color={colors.secondary} />
            </View>
            <View className="p-6 bg-surface-container-low flex-col gap-4">
              <View className="flex-row items-center gap-4">
                <Text className="text-xs font-bold uppercase tracking-widest text-outline">Preview of Linearized Intelligence</Text>
                <View className="flex-1 h-[1px] bg-outline-variant" />
              </View>
              
              <View className="bg-surface p-4 border border-outline-variant rounded shadow-sm flex-row items-start gap-4">
                <MaterialIcons name="info" size={24} color={colors.secondary} />
                <View className="flex-col">
                  <Text className="text-[13px] text-on-surface leading-relaxed">
                    [Screen-Reader-Node: Entry 04]{'\n'}
                    <Text className="font-bold">Subject:</Text> Project Apollo Update{'\n'}
                    <Text className="font-bold">Confidence:</Text> 94% (High){'\n'}
                    <Text className="font-bold">Action:</Text> User queried timeline changes at 14:00 GMT. System generated 4 alternate pathways.
                  </Text>
                </View>
              </View>

              <View className="flex-row justify-between items-center px-2">
                <Text className="text-sm text-on-surface-variant italic">Data is being exposed via semantic linear structure.</Text>
                <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')}>
                  <Text className="text-secondary font-bold text-xs uppercase tracking-widest ">Toggle Full ARIA Labels</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

        </View>

        {/* Footer Help Section */}
        <View className="mt-12 bg-on-surface text-surface-bright p-8 rounded-[24px] flex-col md:flex-row justify-between items-center gap-8">
          <View className="max-w-md flex-col">
            <Text className="font-headline-md text-2xl font-bold text-white mb-2">Need an Inclusive Review?</Text>
            <Text className="text-sm text-white/80 leading-relaxed">
              Our AI can analyze your current usage patterns and suggest accessibility settings tailored specifically to your interaction profile.
            </Text>
          </View>
          <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="bg-surface px-8 py-4 rounded-full ">
            <Text className="text-on-surface font-bold text-base">Run Inclusive Audit</Text>
          </TouchableOpacity>
        </View>

      </View>
    </Screen>
  );
}
