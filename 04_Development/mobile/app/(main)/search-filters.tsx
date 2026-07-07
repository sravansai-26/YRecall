import { View, Text, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Screen, Button } from '../../src/shared/components';
import { colors } from '../../src/shared/theme/colors';
import { useRouter } from 'expo-router';
import { useState } from 'react';

export default function SearchFilters() {
  const router = useRouter();
  const [mediaTypes, setMediaTypes] = useState({ voice: true, photos: true, pdfs: false, links: false });

  return (
    <Screen scrollable={false}>
      <View className="w-full bg-surface-container-lowest z-40 px-margin-mobile py-sm h-16 flex-row items-center justify-between border-b border-outline-variant/30">
        <View className="flex-row items-center gap-sm">
          <MaterialIcons 
            name="close" 
            size={24} 
            color={colors['on-surface']} 
            onPress={() => router.back()}
          />
          <Text className="font-headline-md text-title-sm text-primary">Advanced Filters</Text>
        </View>
        <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')}>
          <Text className="font-label-xs text-secondary font-semibold">Clear all</Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 w-full max-w-2xl mx-auto px-margin-mobile py-lg" contentContainerStyle={{ paddingBottom: 100 }}>
        
        {/* People Section */}
        <View className="mb-xl space-y-md">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="font-title-sm text-body-md font-bold text-primary">People</Text>
            <Text className="font-caption-sm text-on-surface-variant">Tagged in memories</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-2 px-2 pb-sm" contentContainerStyle={{ gap: 16 }}>
            <View className="items-center gap-xs">
              <View className="w-16 h-16 rounded-full border-2 border-primary items-center justify-center bg-surface-container-high">
                 <MaterialIcons name="person" size={32} color={colors.primary} />
              </View>
              <Text className="font-label-xs text-primary">Sarah</Text>
            </View>
            <View className="items-center gap-xs">
              <View className="w-16 h-16 rounded-full border-2 border-transparent items-center justify-center bg-surface-container-high">
                 <MaterialIcons name="person" size={32} color={colors.primary} />
              </View>
              <Text className="font-label-xs text-on-surface-variant">David</Text>
            </View>
            <View className="items-center gap-xs">
              <View className="w-16 h-16 rounded-full border-2 border-transparent items-center justify-center bg-surface-container-high">
                 <MaterialIcons name="person" size={32} color={colors.primary} />
              </View>
              <Text className="font-label-xs text-on-surface-variant">Elena</Text>
            </View>
            <View className="items-center gap-xs">
              <View className="w-16 h-16 rounded-full border-2 border-dashed border-outline-variant items-center justify-center bg-surface-container-lowest">
                 <MaterialIcons name="add" size={24} color={colors.outline} />
              </View>
              <Text className="font-label-xs text-outline">Add</Text>
            </View>
          </ScrollView>
        </View>

        {/* Time Range */}
        <View className="mb-xl space-y-md">
          <Text className="font-title-sm text-body-md font-bold text-primary mb-4">Time Range</Text>
          <View className="flex-row flex-wrap gap-sm mb-4">
            <View className="px-md py-sm rounded-full bg-primary shadow-sm">
              <Text className="text-on-primary font-label-xs">Last 7 Days</Text>
            </View>
            <View className="px-md py-sm rounded-full bg-surface-container-high">
              <Text className="text-on-surface-variant font-label-xs">October 2023</Text>
            </View>
            <View className="px-md py-sm rounded-full bg-surface-container-high">
              <Text className="text-on-surface-variant font-label-xs">Last 6 Months</Text>
            </View>
            <View className="px-md py-sm rounded-full bg-surface-container-high">
              <Text className="text-on-surface-variant font-label-xs">Past Year</Text>
            </View>
          </View>
          <View className="bg-surface-variant/20 p-md rounded-2xl flex-row items-center justify-between border border-outline-variant/30">
            <View className="flex-row items-center gap-sm">
              <MaterialIcons name="calendar-today" size={20} color={colors['on-surface-variant']} />
              <Text className="font-body-md text-on-surface text-caption-sm">Custom range picker...</Text>
            </View>
            <MaterialIcons name="chevron-right" size={20} color={colors.outline} />
          </View>
        </View>

        {/* Location */}
        <View className="mb-xl space-y-md">
          <Text className="font-title-sm text-body-md font-bold text-primary mb-4">Location</Text>
          <View className="flex-col md:flex-row gap-sm mb-4">
            <View className="flex-1 flex-row items-center p-md rounded-2xl bg-surface-container-high">
              <View className="w-10 h-10 rounded-full bg-white items-center justify-center mr-md shadow-sm">
                <MaterialIcons name="home" size={20} color={colors.primary} />
              </View>
              <View className="flex-1">
                <Text className="font-body-md text-on-surface font-semibold">Home</Text>
                <Text className="font-caption-sm text-on-surface-variant">Palo Alto, CA</Text>
              </View>
              <View className="w-6 h-6 rounded-full border-2 border-outline-variant items-center justify-center" />
            </View>
            <View className="flex-1 flex-row items-center p-md rounded-2xl bg-surface-container-high">
              <View className="w-10 h-10 rounded-full bg-white items-center justify-center mr-md shadow-sm">
                <MaterialIcons name="work" size={20} color={colors['on-surface-variant']} />
              </View>
              <View className="flex-1">
                <Text className="font-body-md text-on-surface font-semibold">Office</Text>
                <Text className="font-caption-sm text-on-surface-variant">San Francisco, CA</Text>
              </View>
              <View className="w-6 h-6 rounded-full border-2 border-outline-variant items-center justify-center" />
            </View>
          </View>
        </View>

        {/* Media Type */}
        <View className="mb-xl space-y-md">
          <Text className="font-title-sm text-body-md font-bold text-primary mb-4">Media Type</Text>
          <View className="flex-row flex-wrap gap-sm">
            <View className="flex-1 min-w-[45%] flex-row items-center p-md rounded-2xl bg-surface-container justify-between">
              <View className="flex-row items-center gap-sm">
                <MaterialIcons name="mic" size={20} color={colors['on-surface-variant']} />
                <Text className="font-label-xs text-on-surface">Voice</Text>
              </View>
              <Switch value={mediaTypes.voice} onValueChange={v => setMediaTypes({...mediaTypes, voice: v})} />
            </View>
            <View className="flex-1 min-w-[45%] flex-row items-center p-md rounded-2xl bg-surface-container justify-between">
              <View className="flex-row items-center gap-sm">
                <MaterialIcons name="image" size={20} color={colors['on-surface-variant']} />
                <Text className="font-label-xs text-on-surface">Photos</Text>
              </View>
              <Switch value={mediaTypes.photos} onValueChange={v => setMediaTypes({...mediaTypes, photos: v})} />
            </View>
          </View>
        </View>

      </ScrollView>

      {/* Footer */}
      <View className="p-lg bg-surface border-t border-outline-variant/30 flex-row items-center gap-md absolute bottom-0 left-0 w-full z-50">
        <Button label="Reset" variant="outline" className="flex-1" onPress={() => {}} />
        <Button label="Apply Filters" className="flex-[2]" onPress={() => router.back()} />
      </View>
    </Screen>
  );
}
