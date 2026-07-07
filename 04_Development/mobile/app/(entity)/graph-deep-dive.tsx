import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Screen } from '../../src/shared/components';
import { colors } from '../../src/shared/theme/colors';
import { useRouter } from 'expo-router';

export default function KnowledgeGraphDeepDive() {
  const router = useRouter();

  return (
    <Screen scrollable={true}>
      {/* Top Header */}
      <View className="bg-surface z-50 h-16 w-full flex-row items-center justify-between px-margin-mobile">
        <View className="flex-row items-center gap-md">
          <TouchableOpacity 
            className="p-2 rounded-full "
            onPress={() => router.back()}
          >
            <MaterialIcons name="arrow-back" size={24} color={colors['on-surface-variant']} />
          </TouchableOpacity>
          <View className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center overflow-hidden">
             <Image 
                source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAxQXHkLXsLwQVgx-fdAJNpBqbPhKcmLU0G_GfbN20-ZXVR0lQZ-gtUAOXshAhu4NProh30x6FZLrGwWB3nO2otq0PS-C086y1axtgD4FbcCzsxwImL_oniZ_8mF5z0mZ-3LILmv6zeMmJm1-rsnICi0sLbDXTJ0iKNlOvY6HLSLcZiArR9t3LhJ7shXbVJjUbO8LPW2rUH8Y-amGbONb87pUq0joiJi5CTkHn_YstXTOhtYncET4BSU4TZ5BQtOtEy06fslUfdJN4' }} 
                className="w-full h-full"
             />
          </View>
          <Text className="text-title-sm font-bold text-primary">YRecall</Text>
        </View>
        <View className="flex-row items-center gap-sm">
          <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="p-2 rounded-full ">
            <MaterialIcons name="search" size={24} color={colors['on-surface-variant']} />
          </TouchableOpacity>
        </View>
      </View>

      <View className="px-margin-mobile py-lg">
        {/* Entity Deep Dive Header */}
        <View className="flex-col gap-md mb-xl">
          <View className="flex-row items-center gap-sm flex-wrap">
            <View className="bg-secondary-container px-3 py-1 rounded-full">
              <Text className="text-on-secondary-container font-label-xs font-bold">Active Entity</Text>
            </View>
            <View className="flex-row items-center gap-1">
              <MaterialIcons name="calendar-today" size={14} color={colors['on-surface-variant']} />
              <Text className="text-on-surface-variant text-caption-sm">Last updated 2h ago</Text>
            </View>
          </View>
          <Text className="text-headline-md font-bold text-primary">Project Nova</Text>
          <Text className="text-body-md text-on-surface-variant mb-4">
            Deep exploration of strategic initiatives, cross-functional dependencies, and historical milestones for the next-generation platform launch.
          </Text>
          
          <View className="flex-row gap-sm">
            <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="h-14 px-lg bg-surface-container border border-outline-variant rounded-xl flex-row items-center justify-center gap-sm flex-1">
              <MaterialIcons name="share" size={20} color={colors.primary} />
              <Text className="font-bold text-primary">Share</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="h-14 px-lg bg-primary rounded-xl flex-row items-center justify-center gap-sm flex-1">
              <MaterialIcons name="edit" size={20} color={colors.white} />
              <Text className="font-bold text-white">Edit Entity</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Interactive Knowledge Graph Section Placeholder */}
        <View className="w-full aspect-square rounded-[24px] bg-surface-container-low border border-outline-variant/30 shadow-sm relative overflow-hidden mb-xl">
           <View className="absolute top-1/2 left-1/2 -mt-16 -ml-16 z-20">
             <View className="w-32 h-32 rounded-full bg-primary items-center justify-center shadow-xl border-4 border-primary/20">
               <Text className="font-bold text-white text-center">Project{'\n'}Nova</Text>
             </View>
           </View>
           {/* Orbiting Nodes */}
           <View className="absolute top-[20%] left-[10%] z-10 bg-white/70 px-4 py-2 rounded-full flex-row items-center gap-2 border border-outline-variant shadow-sm">
             <View className="w-6 h-6 rounded-full overflow-hidden bg-secondary-container">
               <Image source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDH-GxftyMZwSWSXTSL13yCnyF9gR2sWyJ0Bag2Uk5jZO5nbFPKLeJDCLyCRO4NHqInVfmakk3lxA8Cf0h6ojx_l_v0pydXcz6hpbbAuCPs6QvMyNx7JBFChiGsr-7sNgdTijF5Pcy0rQBWJOlV1e8aycBSGe3d-_s6SduQkSTytIXj5bX4Rsc1uCXkntlKJf-C8rjdoEDCSeZQY_7qPv-ia1IvbRdYaSXLSQSMLDyRJ-b6QgpT6pWsttzBuZvV8xiXcT2MY7wQ7GA' }} className="w-full h-full" />
             </View>
             <Text className="font-bold text-primary text-xs">Sarah Jenkins</Text>
           </View>
           <View className="absolute top-[30%] right-[10%] z-10 bg-white/70 px-4 py-2 rounded-full flex-row items-center gap-2 border border-outline-variant shadow-sm">
             <MaterialIcons name="map" size={16} color={colors.secondary} />
             <Text className="font-bold text-primary text-xs">Q3 Roadmap</Text>
           </View>
           <View className="absolute bottom-[20%] left-[20%] z-10 bg-white/70 px-4 py-2 rounded-full flex-row items-center gap-2 border border-outline-variant shadow-sm">
             <MaterialIcons name="mic" size={16} color={colors.secondary} />
             <Text className="font-bold text-primary text-xs">Lake Tahoe Sync</Text>
           </View>
        </View>

        {/* Related Memories Feed */}
        <View className="mb-24">
          <View className="flex-row items-center justify-between mb-lg">
            <Text className="text-title-sm font-bold text-primary">Related Memories</Text>
            <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="flex-row items-center">
               <Text className="text-on-primary-container font-label-xs font-bold">View all 24</Text>
               <MaterialIcons name="chevron-right" size={16} color={colors['on-primary-container']} />
            </TouchableOpacity>
          </View>
          
          <View className="flex-col gap-lg">
            {/* Voice Note Memory */}
            <View className="bg-white rounded-[24px] p-lg shadow-sm border border-outline-variant/30 flex-col gap-md">
               <View className="flex-row justify-between items-start">
                 <View className="flex-row gap-sm items-center">
                    <View className="w-10 h-10 rounded-full bg-secondary-container items-center justify-center">
                      <MaterialIcons name="mic" size={20} color={colors['on-secondary-container']} />
                    </View>
                    <View>
                      <Text className="font-bold text-primary">Strategic Alignment</Text>
                      <Text className="text-caption-sm text-on-surface-variant">Voice Note • Oct 12</Text>
                    </View>
                 </View>
                 <View className="px-2 py-1 bg-tertiary-container/10 rounded">
                   <Text className="text-label-xs text-on-tertiary-container">High Priority</Text>
                 </View>
               </View>
               <Text className="text-body-md text-on-surface-variant italic">"...the core pillar for Project Nova revolves around decentralized memory retrieval..."</Text>
               <View className="flex-row items-center gap-md">
                 <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="w-12 h-12 rounded-full bg-primary items-center justify-center">
                   <MaterialIcons name="play-arrow" size={24} color={colors.white} />
                 </TouchableOpacity>
                 <View className="flex-1 h-2 bg-surface-container rounded-full overflow-hidden">
                   <View className="w-1/3 h-full bg-secondary" />
                 </View>
                 <Text className="text-caption-sm text-on-surface-variant">04:22</Text>
               </View>
            </View>

            {/* Document Card */}
            <View className="bg-white rounded-[24px] p-lg shadow-sm border border-outline-variant/30 flex-col gap-md">
               <View className="w-full h-40 rounded-xl bg-surface-container overflow-hidden">
                  <Image source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBfqwgF9k0yNyqzmu0wKENX03B--k8N4CtoboFLT3slU4H0K6xgNJ7Dd7jigZmxM5wFCEQLm65gOzHenclzq8Ww009VbxEG9I18jUTUnxgrSM-BePSizBTP6L_bKuDle0MkYgoEf0aljM3liQjKWIrBaQ8B1oJAOHTgdyM4F3y438UrewWdH0rAJ4xeTlcVR5Rc2AFNBhxTwgeR0DqHfLnWQdN76LJuTtsOyi0d04HMbDf0YykKxVrFgr_Q0-EivEE8xDI7D5fteZU' }} className="w-full h-full" />
               </View>
               <View>
                 <Text className="font-bold text-primary">Nova Architecture Doc</Text>
                 <Text className="text-caption-sm text-on-surface-variant">PDF • 1.2 MB</Text>
               </View>
               <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="w-full py-3 rounded-xl border border-outline items-center justify-center">
                 <Text className="text-primary font-bold">Preview</Text>
               </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      {/* FAB Add */}
      <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="absolute bottom-6 right-6 w-[64px] h-[64px] rounded-[20px] bg-primary shadow-xl items-center justify-center z-40">
        <MaterialIcons name="add" size={32} color={colors.white} />
      </TouchableOpacity>
    </Screen>
  );
}
