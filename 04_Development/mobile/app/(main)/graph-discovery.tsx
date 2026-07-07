import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Screen } from '../../src/shared/components';
import { colors } from '../../src/shared/theme/colors';
import { useRouter } from 'expo-router';

export default function KnowledgeGraphDiscovery() {
  const router = useRouter();

  return (
    <Screen scrollable={false}>
      {/* Top Header */}
      <View className="bg-surface/80 z-50 h-16 w-full flex-row items-center justify-between px-margin-mobile">
        <View className="flex-row items-center gap-md">
          <TouchableOpacity 
            className="p-2 rounded-full "
            onPress={() => router.back()}
          >
            <MaterialIcons name="arrow-back" size={24} color={colors['on-surface-variant']} />
          </TouchableOpacity>
          <Text className="font-title-sm font-bold text-primary">Discovery Mode</Text>
        </View>
        <View className="flex-row items-center gap-sm">
          <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="p-2 rounded-full ">
            <MaterialIcons name="search" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <View className="flex-1 relative bg-surface overflow-hidden">
        {/* Animated Subtle Background Pattern Placeholder */}
        <View className="absolute inset-0 opacity-10 pointer-events-none" />

        {/* Central Smart Hub */}
        <View className="absolute top-1/2 left-1/2 -mt-12 -ml-12 z-20">
          <View className="w-24 h-24 rounded-full bg-primary items-center justify-center shadow-xl border-4 border-white">
            <MaterialIcons name="psychology" size={32} color={colors.white} />
          </View>
        </View>

        {/* Category Cluster: People */}
        <View className="absolute top-1/4 left-1/4">
          <View className="w-24 h-24 rounded-full bg-white items-center justify-center shadow-md border border-secondary-container/30">
            <MaterialIcons name="groups" size={32} color={colors['on-secondary-container']} />
            <Text className="font-title-sm text-primary text-xs mt-1">People</Text>
          </View>
          <View className="absolute -top-12 -right-8 p-sm bg-white rounded-xl shadow-sm border border-outline-variant/30 flex-row items-center gap-xs">
            <View className="w-6 h-6 rounded-full bg-secondary-container/40 items-center justify-center">
              <MaterialIcons name="person" size={12} color={colors.secondary} />
            </View>
            <Text className="text-caption-sm font-medium">Sarah Chen</Text>
          </View>
        </View>

        {/* Category Cluster: Projects */}
        <View className="absolute bottom-1/3 right-1/4">
          <View className="w-28 h-28 rounded-full bg-white items-center justify-center shadow-md border border-tertiary-fixed/30">
            <MaterialIcons name="terminal" size={32} color={colors['on-tertiary-container']} />
            <Text className="font-title-sm text-primary text-xs mt-1">Projects</Text>
          </View>
          <View className="absolute -bottom-10 right-0 p-sm bg-white rounded-xl shadow-sm border border-outline-variant/30 flex-row items-center gap-xs">
            <View className="w-6 h-6 rounded-full bg-tertiary-container/20 items-center justify-center">
              <MaterialIcons name="edit-note" size={12} color={colors['tertiary-container']} />
            </View>
            <Text className="text-caption-sm font-medium">YRecall Arch.</Text>
          </View>
        </View>

        {/* Category Cluster: Places */}
        <View className="absolute top-1/2 right-4">
          <View className="w-20 h-20 rounded-full bg-white items-center justify-center shadow-md border border-outline-variant/30">
            <MaterialIcons name="map" size={24} color={colors['primary-container']} />
            <Text className="font-title-sm text-primary text-xs mt-1">Places</Text>
          </View>
        </View>

        {/* Floating Action Buttons */}
        <View className="absolute bottom-24 right-6 flex-col gap-md z-30">
          <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="w-14 h-14 rounded-2xl bg-white shadow-xl border border-outline-variant/30 items-center justify-center">
            <MaterialIcons name="sync" size={24} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="w-14 h-14 rounded-2xl bg-primary shadow-xl items-center justify-center">
            <MaterialIcons name="filter-list" size={24} color={colors.white} />
          </TouchableOpacity>
        </View>

        {/* View Controls */}
        <View className="absolute bottom-6 left-1/2 -ml-[120px] bg-white/70 p-1 rounded-full flex-row gap-1 z-30 border border-outline-variant/30">
          <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="px-4 py-2 bg-primary rounded-full">
            <Text className="text-caption-sm font-medium text-white">Nodes</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="px-4 py-2 rounded-full">
            <Text className="text-caption-sm font-medium text-on-surface-variant">List View</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="px-4 py-2 rounded-full">
            <Text className="text-caption-sm font-medium text-on-surface-variant">Time</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Screen>
  );
}
