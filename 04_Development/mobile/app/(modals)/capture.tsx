import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Screen } from '../../src/shared/components';
import { colors } from '../../src/shared/theme/colors';

export default function CaptureScreen() {
  return (
    <Screen scrollable={false}>
      {/* Top Header */}
      <View className="bg-surface z-40 h-16 w-full flex-row items-center justify-between px-margin-mobile">
        <View className="flex-row items-center gap-md">
          <View className="w-10 h-10 rounded-full bg-secondary-container items-center justify-center border border-outline-variant">
             <MaterialIcons name="person" size={24} color={colors['on-secondary-container']} />
          </View>
          <Text className="font-headline-md font-bold text-primary">YRecall</Text>
        </View>
        <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="w-10 h-10 items-center justify-center rounded-full ">
          <MaterialIcons name="notifications" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 w-full max-w-xl mx-auto px-margin-mobile pt-16" contentContainerStyle={{ paddingBottom: 120, alignItems: 'center' }}>
        {/* Header Text */}
        <View className="text-center mb-xl items-center">
          <Text className="font-headline-md text-[32px] text-primary mb-sm font-bold">What's on your mind?</Text>
          <Text className="text-on-surface-variant font-body-md text-center">Capture everything, YRecall handles the rest.</Text>
        </View>

        {/* Waveform placeholder */}
        <View className="w-full max-w-md h-32 flex-row items-center justify-center gap-[6px] mb-xxl">
          {[16, 24, 40, 32, 48, 56, 44, 36, 20, 12, 28, 40].map((height, i) => (
            <View key={i} className="w-[6px] bg-secondary rounded-full opacity-80" style={{ height }} />
          ))}
        </View>

        {/* Capture Grid */}
        <View className="flex-row flex-wrap justify-between w-full mb-xxl gap-y-6">
          {[
            { icon: 'edit-note', label: 'Text' },
            { icon: 'mic', label: 'Voice' },
            { icon: 'photo-camera', label: 'Photo' },
            { icon: 'description', label: 'Document' },
            { icon: 'link', label: 'Link' },
            { icon: 'document-scanner', label: 'Scan' },
            { icon: 'content-paste', label: 'Clipboard' },
            { icon: 'location-on', label: 'Location' },
          ].map((item, index) => (
            <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} key={index} className="flex-col items-center gap-sm w-[22%]">
              <View className="w-16 h-16 rounded-2xl bg-white/70 border border-outline-variant items-center justify-center shadow-sm">
                <MaterialIcons name={item.icon as any} size={28} color={colors.primary} />
              </View>
              <Text className="font-label-xs text-on-surface-variant mt-2">{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tactile Button */}
        <View className="items-center gap-md">
          <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="w-24 h-24 rounded-full bg-primary items-center justify-center shadow-lg border-4 border-white/20">
            <MaterialIcons name="center-focus-strong" size={40} color={colors.white} />
          </TouchableOpacity>
          <Text className="font-label-xs font-bold text-primary uppercase tracking-widest mt-4">Hold to Quick Capture</Text>
        </View>
      </ScrollView>
    </Screen>
  );
}
