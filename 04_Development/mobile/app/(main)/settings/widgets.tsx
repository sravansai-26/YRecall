import { View, Text, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Screen } from '../../../src/shared/components';
import { colors } from '../../../src/shared/theme/colors';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';

export default function WidgetSettings() {
  const router = useRouter();
  
  const [widgetStyle, setWidgetStyle] = useState('compact');
  const [mainAction, setMainAction] = useState('quick');
  const [showAiInsights, setShowAiInsights] = useState(true);
  const [privacyMasking, setPrivacyMasking] = useState(false);

  const actions = {
    'quick': { icon: 'bolt', title: 'Quick Capture', desc: 'Instant text entry with AI auto-tagging' },
    'voice': { icon: 'mic', title: 'Voice Memo', desc: 'Record and transcribe instantly' },
    'photo': { icon: 'camera-enhance', title: 'Photo Scan', desc: 'OCR and image intelligence capture' },
    'smart': { icon: 'subject', title: 'Smart Text', desc: 'Analyze clipboard content automatically' },
  } as const;

  return (
    <Screen scrollable={true} className="pb-24">
      {/* TopAppBar */}
      <View className="w-full sticky top-0 z-50 bg-surface flex-row items-center justify-between px-margin-mobile md:px-margin-desktop h-16">
        <View className="flex-row items-center gap-4">
          <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2 rounded-full ">
            <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
          </TouchableOpacity>
          <Text className="font-headline-md text-2xl text-primary font-bold">Widget Settings</Text>
        </View>
      </View>

      <View className="max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop py-6 flex-col md:flex-row gap-8 w-full">
        
        {/* Selection & Customization Column */}
        <View className="flex-col gap-8 flex-1 w-full md:w-[60%]">
          
          {/* Section: Widget Type */}
          <View className="flex-col">
            <Text className="font-title-sm text-xl font-bold text-on-surface mb-4">Widget Style</Text>
            <View className="flex-row gap-4">
              <TouchableOpacity 
                onPress={() => setWidgetStyle('compact')}
                className={`flex-1 flex-col items-center justify-center p-6 rounded-xl border-2 transition-all ${widgetStyle === 'compact' ? 'border-primary bg-surface-container' : 'border-transparent bg-surface-container-low '}`}
              >
                <MaterialIcons name="view-compact" size={36} color={widgetStyle === 'compact' ? colors.primary : colors['on-surface-variant']} />
                <Text className={`font-body-md text-base mt-2 ${widgetStyle === 'compact' ? 'font-semibold text-primary' : 'text-on-surface-variant'}`}>Compact</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => setWidgetStyle('expanded')}
                className={`flex-1 flex-col items-center justify-center p-6 rounded-xl border-2 transition-all ${widgetStyle === 'expanded' ? 'border-primary bg-surface-container' : 'border-transparent bg-surface-container-low '}`}
              >
                <MaterialIcons name="view-quilt" size={36} color={widgetStyle === 'expanded' ? colors.primary : colors['on-surface-variant']} />
                <Text className={`font-body-md text-base mt-2 ${widgetStyle === 'expanded' ? 'font-semibold text-primary' : 'text-on-surface-variant'}`}>Expanded</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Section: Action Customization */}
          <View className="flex-col">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="font-title-sm text-xl font-bold text-on-surface">Action Customization</Text>
              <View className="px-3 py-1 bg-secondary-container rounded-full">
                <Text className="text-on-secondary-container text-[10px] uppercase font-bold tracking-wider">Main Button</Text>
              </View>
            </View>
            <View className="bg-white rounded-[24px] p-2 shadow-sm border border-outline-variant/30 flex-col gap-1">
              {(Object.keys(actions) as Array<keyof typeof actions>).map((key) => {
                const action = actions[key];
                return (
                  <TouchableOpacity 
                    key={key}
                    onPress={() => setMainAction(key)}
                    className="flex-row items-center justify-between p-4  rounded-xl"
                  >
                    <View className="flex-row items-center gap-4">
                      <View className={`w-12 h-12 rounded-full flex items-center justify-center ${mainAction === key ? 'bg-primary-container' : 'bg-surface-container'}`}>
                        <MaterialIcons name={action.icon as any} size={24} color={mainAction === key ? colors['on-primary-container'] : colors.primary} />
                      </View>
                      <View className="flex-col">
                        <Text className="font-body-md text-base font-semibold text-on-surface">{action.title}</Text>
                        <Text className="font-caption-sm text-xs text-on-surface-variant">{action.desc}</Text>
                      </View>
                    </View>
                    <MaterialIcons name={mainAction === key ? "radio-button-checked" : "radio-button-unchecked"} size={24} color={mainAction === key ? colors.primary : colors['outline-variant']} />
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Section: Intelligence & Privacy */}
          <View className="bg-white rounded-[24px] p-6 shadow-md border border-outline-variant/30 relative">
            <View className="flex-row items-center gap-2 mb-6">
              <MaterialIcons name="auto-awesome" size={24} color={colors.secondary} />
              <Text className="font-title-sm text-xl font-bold text-secondary">AI Intelligence Layer</Text>
            </View>
            
            <View className="flex-col gap-6">
              <View className="flex-row items-center justify-between">
                <View className="flex-col">
                  <Text className="font-body-md text-base font-semibold text-on-surface">Show AI Insights</Text>
                  <Text className="font-caption-sm text-xs text-on-surface-variant">Display contextual summaries in the widget</Text>
                </View>
                <Switch 
                  value={showAiInsights}
                  onValueChange={setShowAiInsights}
                  trackColor={{ false: colors['surface-container-highest'], true: colors.secondary }}
                  thumbColor="#ffffff"
                />
              </View>
              
              <View className="flex-row items-center justify-between">
                <View className="flex-col">
                  <Text className="font-body-md text-base font-semibold text-on-surface">Privacy Masking</Text>
                  <Text className="font-caption-sm text-xs text-on-surface-variant">Hide sensitive content on lockscreen</Text>
                </View>
                <Switch 
                  value={privacyMasking}
                  onValueChange={setPrivacyMasking}
                  trackColor={{ false: colors['surface-container-highest'], true: colors.secondary }}
                  thumbColor="#ffffff"
                />
              </View>
            </View>
          </View>
          
          <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="w-full mt-4 h-14 bg-primary rounded-2xl flex-row items-center justify-center gap-2 shadow-md">
            <Text className="font-bold text-white text-base">Apply Widget Configuration</Text>
          </TouchableOpacity>

        </View>

        {/* Preview Area Column */}
        <View className="flex-col w-full md:w-[40%] sticky top-20">
          <Text className="font-title-sm text-xl font-bold text-on-surface mb-4">Live Preview</Text>
          
          <View className="relative bg-surface-dim rounded-[48px] p-6 border-[8px] border-on-surface aspect-[9/19] shadow-2xl flex-col justify-start overflow-hidden">
            {/* Phone Notch Mockup */}
            <View className="absolute top-0 left-1/2 -ml-16 w-32 h-6 bg-on-surface rounded-b-2xl" />
            
            <View className="mt-8 flex-col items-center">
              <Text className="text-4xl font-bold text-on-surface opacity-80">09:41</Text>
              <Text className="text-sm font-medium text-on-surface opacity-60">Tuesday, Oct 24</Text>
            </View>

            {/* Widget Preview */}
            <View className="mt-12 bg-white/70 rounded-[24px] p-4 shadow-xl border border-white/40">
              <View className="flex-row items-center justify-between mb-4">
                <View className="flex-row items-center gap-2">
                  <View className="w-8 h-8 rounded-lg bg-primary-container items-center justify-center">
                    <MaterialIcons name="history" size={16} color="#ffffff" />
                  </View>
                  <Text className="text-xs font-bold text-primary">YRecall</Text>
                </View>
                <Text className="text-[10px] font-medium text-on-surface-variant opacity-60 uppercase">Widget</Text>
              </View>
              
              <View className="flex-col gap-2">
                <View className="w-full h-12 bg-primary rounded-xl flex-row items-center justify-center gap-2 shadow-sm">
                  <MaterialIcons name={actions[mainAction as keyof typeof actions].icon as any} size={20} color="#ffffff" />
                  <Text className="font-semibold text-white text-sm">{actions[mainAction as keyof typeof actions].title}</Text>
                </View>

                {showAiInsights && (
                  <View className="p-3 bg-secondary/10 rounded-lg border border-secondary/20 mt-2">
                    <View className="flex-row items-center gap-1 mb-1">
                      <MaterialIcons name="auto-awesome" size={12} color={colors.secondary} />
                      <Text className="text-[10px] font-bold text-secondary uppercase tracking-tight">AI Insight</Text>
                    </View>
                    <Text className="text-xs text-on-surface opacity-80 leading-snug">"You mentioned a meeting with Sarah today at 3 PM."</Text>
                  </View>
                )}
              </View>
            </View>
            
            {/* Mock bottom icons */}
            <View className="absolute bottom-6 left-6 right-6 flex-row justify-around opacity-40">
              <View className="w-12 h-12 rounded-xl bg-on-surface-variant" />
              <View className="w-12 h-12 rounded-xl bg-on-surface-variant" />
              <View className="w-12 h-12 rounded-xl bg-on-surface-variant" />
              <View className="w-12 h-12 rounded-xl bg-on-surface-variant" />
            </View>
            <View className="absolute bottom-2 left-1/2 -ml-16 w-32 h-1 bg-on-surface rounded-full opacity-20" />
          </View>
        </View>

      </View>
    </Screen>
  );
}
