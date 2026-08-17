import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Screen, Button } from '../../src/shared/components';
import { colors } from '../../src/shared/theme/colors';
import { useRouter } from 'expo-router';
import React from 'react';

export default function TeamsStartWorkspace() {
 const router = useRouter();

 return (
 <Screen scrollable={true}>
 {/* Header Section */}
 <View className="px-margin-mobile pt-4 flex-row items-center">
   <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 items-center justify-center rounded-full bg-surface-container-low">
     <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
   </TouchableOpacity>
 </View>

 <View className="px-margin-mobile pt-2 pb-32 flex-col gap-xl">
 
 {/* Value Proposition */}
 <View className="flex-col gap-6 items-start mt-4">
 <View className="flex-row items-center gap-1 bg-secondary-container/30 px-3 py-1.5 rounded-full">
 <MaterialIcons name="hub" size={14} color={colors.secondary} />
 <Text className="text-secondary font-bold text-[10px] uppercase tracking-widest">Collective Intelligence</Text>
 </View>

 <Text className="font-display-lg text-[44px] text-primary font-bold leading-tight">
 Amplify your team’s <Text className="text-secondary">shared memory.</Text>
 </Text>

 <Text className="text-body-md text-on-surface-variant leading-relaxed">
 Bridge the gap between individual insights and collective power. Our AI Life OS for teams creates a persistent, collaborative graph of every interaction, document, and decision.
 </Text>

 <View className="flex-row gap-4 mt-2">
 <Button variant="primary" label="Start Your Team" icon="arrow-forward" onPress={() => router.push('/(teams)/identity')} />
 </View>
 </View>



 {/* Workspace Selection Bento Grid */}
 <View className="mt-8 flex-col gap-6">
 <View className="flex-row items-center gap-2 mb-2">
 <MaterialIcons name="tab" size={24} color={colors.secondary} />
 <Text className="font-headline-md text-[24px] font-bold text-primary">Choose Your Foundation</Text>
 </View>

 <View className="flex-col gap-4 md:flex-row">
 
 {/* Personal Workspace */}
 <TouchableOpacity onPress={() => router.push('/(main)/workspaces' as any)} className="flex-1 bg-white p-6 rounded-[24px] shadow-sm ">
 <View className="flex-row items-start justify-between mb-6">
 <View className="w-14 h-14 rounded-2xl bg-surface-container-low flex items-center justify-center">
 <MaterialIcons name="person" size={32} color={colors.primary} />
 </View>
 <View className="bg-surface-container px-3 py-1 rounded-full">
 <Text className="text-on-surface-variant font-bold text-[10px] uppercase">Standard</Text>
 </View>
 </View>

 <Text className="font-headline-md text-xl font-bold text-primary mb-2">Personal Space</Text>
 <Text className="text-body-md text-on-surface-variant mb-6">
 Your private sanctuary for thought, task management, and personal knowledge graphs. AI tailored specifically to your habits.
 </Text>

 <View className="flex-col gap-3">
 <View className="flex-row items-center gap-2">
 <MaterialIcons name="check-circle" size={18} color={colors.secondary} />
 <Text className="text-body-md text-on-surface-variant">Private Knowledge Graph</Text>
 </View>
 <View className="flex-row items-center gap-2">
 <MaterialIcons name="check-circle" size={18} color={colors.secondary} />
 <Text className="text-body-md text-on-surface-variant">Personal Routine Optimization</Text>
 </View>
 </View>
 </TouchableOpacity>

 {/* Team Workspace (Highlighted) */}
 <TouchableOpacity 
 className="flex-1 bg-white p-6 rounded-[24px] shadow-sm border-2 border-primary relative overflow-hidden"
 onPress={() => router.push('/(teams)/identity')}
 >
 <View className="absolute top-0 right-0 w-32 h-32 bg-secondary-container/20 blur-3xl -z-10" />
 
 <View className="flex-row items-start justify-between mb-6">
 <View className="w-14 h-14 rounded-2xl bg-primary-container flex items-center justify-center">
 <MaterialIcons name="groups" size={32} color={colors['on-primary-container']} />
 </View>
 <View className="bg-secondary-container px-3 py-1 rounded-full">
 <Text className="text-on-secondary-container font-bold text-[10px] uppercase">Collaborative</Text>
 </View>
 </View>

 <Text className="font-headline-md text-xl font-bold text-primary mb-2">Team Workspace</Text>
 <Text className="text-body-md text-on-surface-variant mb-6">
 Shared memory for high-performing teams. Synchronize minds with collaborative graphs and automated documentation.
 </Text>

 <View className="flex-col gap-3 mb-6">
 <View className="flex-row items-center gap-2">
 <MaterialIcons name="auto-awesome" size={18} color={colors.secondary} />
 <Text className="text-body-md text-on-surface-variant">Cross-Member Contextual Search</Text>
 </View>
 <View className="flex-row items-center gap-2">
 <MaterialIcons name="auto-awesome" size={18} color={colors.secondary} />
 <Text className="text-body-md text-on-surface-variant">Collaborative Intelligence Layer</Text>
 </View>
 </View>

 </TouchableOpacity>

 </View>
 </View>

 {/* Benefits Section */}
 <View className="bg-surface-container-low p-8 rounded-[32px] flex-col gap-8 mt-4">
 <View className="flex-col gap-2">
 <MaterialIcons name="memory" size={32} color={colors.secondary} />
 <Text className="font-headline-md text-[18px] font-bold text-primary mt-2">Shared Memory</Text>
 <Text className="text-body-md text-on-surface-variant">Every chat, file, and decision is cataloged into a persistent knowledge base accessible by every member.</Text>
 </View>
 
 <View className="flex-col gap-2">
 <MaterialIcons name="hub" size={32} color={colors.secondary} />
 <Text className="font-headline-md text-[18px] font-bold text-primary mt-2">Collaborative Graphs</Text>
 <Text className="text-body-md text-on-surface-variant">Visualize how ideas connect across departments. Break silos by surfacing relevant work from other team members.</Text>
 </View>
 
 <View className="flex-col gap-2">
 <MaterialIcons name="psychology" size={32} color={colors.secondary} />
 <Text className="font-headline-md text-[18px] font-bold text-primary mt-2">AI Synthesizer</Text>
 <Text className="text-body-md text-on-surface-variant">The OS automatically generates summaries of meetings and long-form threads, keeping everyone aligned instantly.</Text>
 </View>
 </View>

 </View>
 </Screen>
 );
}
