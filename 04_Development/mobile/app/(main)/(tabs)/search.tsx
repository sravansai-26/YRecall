import { View, Text, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Screen } from '../../../src/shared/components';
import { colors } from '../../../src/shared/theme/colors';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useAuthStore } from '../../../src/shared/store/useAuthStore';
import { Image } from 'react-native';

export default function SearchIndex() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [query, setQuery] = useState('');

  return (
    <Screen scrollable={false}>
      <View className="w-full bg-surface z-40 px-margin-mobile py-sm h-16 flex-row items-center justify-between">
        <View className="flex-row items-center gap-md">
          <MaterialIcons 
            name="arrow-back" 
            size={24} 
            color={colors.primary} 
            onPress={() => router.back()}
          />
          <Text className="font-title-sm font-bold text-primary">Recall</Text>
        </View>
        <TouchableOpacity onPress={() => router.push('/(main)/profile-edit')} className="w-10 h-10 rounded-full overflow-hidden border border-outline-variant bg-surface-container-high items-center justify-center">
           {user?.photoURL ? (
             <Image source={{ uri: user.photoURL }} className="w-full h-full" />
           ) : (
             <MaterialIcons name="person" size={24} color={colors.primary} />
           )}
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 w-full max-w-3xl mx-auto px-margin-mobile pt-lg" contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Search Bar */}
        <View className="mb-xl relative">
          <View className="absolute inset-y-0 left-0 pl-md justify-center z-10">
            <MaterialIcons name="search" size={24} color={colors.outline} />
          </View>
          <TextInput
            className="w-full h-[56px] pl-[52px] pr-[52px] bg-white rounded-xl border border-outline-variant font-body-md text-primary"
            placeholder="Search your life..."
            placeholderTextColor={colors['outline-variant']}
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={() => router.push('/(tabs)/search/results')}
          />
          <View className="absolute inset-y-0 right-0 pr-md justify-center z-10">
            <TouchableOpacity onPress={() => router.push('/(tabs)/search/filters')}>
              <MaterialIcons name="tune" size={24} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Semantic Filters */}
        <View className="mb-xl">
          <Text className="font-label-xs text-on-surface-variant uppercase tracking-wider mb-md">Semantic Filters</Text>
          <View className="flex-row flex-wrap gap-sm">
            <View className="flex-row items-center gap-xs px-md py-sm bg-tertiary-fixed/20 border border-tertiary-fixed rounded-full">
              <MaterialIcons name="group" size={18} color={colors['on-tertiary-fixed']} />
              <Text className="font-label-xs text-on-tertiary-fixed">People</Text>
            </View>
            <View className="flex-row items-center gap-xs px-md py-sm bg-secondary-container/30 border border-outline-variant rounded-full">
              <MaterialIcons name="location-on" size={18} color={colors['on-secondary-container']} />
              <Text className="font-label-xs text-on-secondary-container">Places</Text>
            </View>
            <View className="flex-row items-center gap-xs px-md py-sm bg-white border border-outline-variant rounded-full">
              <MaterialIcons name="photo-library" size={18} color={colors['on-surface-variant']} />
              <Text className="font-label-xs text-on-surface-variant">Photos</Text>
            </View>
            <View className="flex-row items-center gap-xs px-md py-sm bg-white border border-outline-variant rounded-full">
              <MaterialIcons name="description" size={18} color={colors['on-surface-variant']} />
              <Text className="font-label-xs text-on-surface-variant">Docs</Text>
            </View>
          </View>
        </View>

        {/* Suggested Queries */}
        <View className="mb-xl">
          <View className="flex-row items-center justify-between mb-md">
            <Text className="font-label-xs text-on-surface-variant uppercase tracking-wider">Suggested Queries</Text>
            <MaterialIcons name="auto-awesome" size={18} color={colors.secondary} />
          </View>
          <View className="flex-col md:flex-row gap-md">
            <TouchableOpacity className="bg-white/70 p-lg rounded-2xl border-l-4 border-l-secondary-fixed-dim" onPress={() => router.push('/(tabs)/search/results')}>
              <Text className="font-body-md text-primary">"What did I talk about with Sarah yesterday?"</Text>
              <View className="mt-md flex-row items-center gap-xs">
                <MaterialIcons name="history-edu" size={16} color={colors.outline} />
                <Text className="font-caption-sm text-outline">From Journal</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity className="bg-white/70 p-lg rounded-2xl border-l-4 border-l-tertiary-fixed-dim" onPress={() => router.push('/(tabs)/search/results')}>
              <Text className="font-body-md text-primary">"Find the document about the solar project."</Text>
              <View className="mt-md flex-row items-center gap-xs">
                <MaterialIcons name="description" size={16} color={colors.outline} />
                <Text className="font-caption-sm text-outline">Found in Files</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Searches */}
        <View className="mb-xl">
          <View className="flex-row items-center justify-between mb-md">
            <Text className="font-label-xs text-on-surface-variant uppercase tracking-wider">Recent Searches</Text>
            <Text className="text-primary font-label-xs">Clear All</Text>
          </View>
          <View className="space-y-xs gap-2">
            <View className="flex-row items-center justify-between py-md px-sm rounded-lg">
              <View className="flex-row items-center gap-md">
                <MaterialIcons name="history" size={24} color={colors.outline} />
                <Text className="font-body-md text-primary">Quarterly budget review notes</Text>
              </View>
              <MaterialIcons name="close" size={18} color={colors.error} />
            </View>
            <View className="flex-row items-center justify-between py-md px-sm rounded-lg">
              <View className="flex-row items-center gap-md">
                <MaterialIcons name="history" size={24} color={colors.outline} />
                <Text className="font-body-md text-primary">Restaurant recommendations in Paris</Text>
              </View>
              <MaterialIcons name="close" size={18} color={colors.error} />
            </View>
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}
