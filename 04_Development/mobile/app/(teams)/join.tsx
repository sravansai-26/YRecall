import { View, Text, ScrollView, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Screen, Button } from '../../src/shared/components';
import { colors } from '../../src/shared/theme/colors';
import { useRouter } from 'expo-router';
import React from 'react';

export default function TeamsJoin() {
  const router = useRouter();

  return (
    <Screen scrollable={true}>
      <View className="px-margin-mobile pt-16 pb-32 flex-col gap-xl">
        
        {/* Background Blobs (Simulated with absolute positioning) */}
        <View className="absolute top-0 right-0 w-64 h-64 bg-secondary-fixed-dim/20 rounded-full blur-3xl -z-10" />
        <View className="absolute bottom-40 left-0 w-64 h-64 bg-primary-fixed-dim/20 rounded-full blur-3xl -z-10" />

        {/* Hero Section */}
        <View className="items-center text-center gap-4 mb-8">
          <View className="bg-secondary-container px-4 py-2 rounded-full">
            <Text className="text-on-secondary-container font-label-xs uppercase font-bold tracking-widest">Mission Update</Text>
          </View>
          
          <Text className="font-display-lg text-[44px] text-primary font-bold text-center leading-tight">
            Welcome to <Text className="text-secondary italic">Project Nova</Text> Team
          </Text>
          
          <Text className="text-body-md text-on-surface-variant text-center max-w-sm mx-auto">
            You've been invited to the core engineering workspace. Here, we coordinate high-frequency deployments and manage the AI Life OS ecosystem.
          </Text>
        </View>

        {/* Bento Grid */}
        <View className="flex-col md:flex-row flex-wrap gap-6">
          
          {/* Card 1: Role Definition */}
          <View className="flex-col md:flex-1 bg-white p-6 rounded-[24px] shadow-sm flex-1">
            <View className="w-12 h-12 bg-primary-container items-center justify-center rounded-xl mb-4">
              <MaterialIcons name="shield" size={24} color={colors['on-primary-container']} />
            </View>
            <Text className="font-headline-md text-2xl font-bold text-primary mb-2">Your Role: Architect</Text>
            <Text className="text-body-md text-on-surface-variant mb-6">
              As a core member of Project Nova, you have full write access to the neural logic pathways and priority access to the global GPU clusters.
            </Text>
            <View className="flex-row flex-wrap gap-2">
              <View className="bg-surface-container-high px-3 py-1 rounded-full"><Text className="text-caption-sm text-on-surface-variant">Admin Controls</Text></View>
              <View className="bg-surface-container-high px-3 py-1 rounded-full"><Text className="text-caption-sm text-on-surface-variant">Deploy Access</Text></View>
              <View className="bg-surface-container-high px-3 py-1 rounded-full"><Text className="text-caption-sm text-on-surface-variant">SLA Manager</Text></View>
            </View>
          </View>

          {/* Card 2: Interactive AI Signal */}
          <View className="flex-col md:flex-1 bg-primary rounded-[24px] overflow-hidden justify-end h-64 md:h-auto min-h-[250px]">
            <View className="p-6 bg-gradient-to-t from-black/60 to-transparent absolute inset-0 justify-end">
              <Text className="font-title-sm text-lg font-bold text-white">System Pulse</Text>
              <Text className="text-label-xs text-white/80">Real-time health monitoring of Project Nova's infrastructure.</Text>
            </View>
          </View>

          {/* Card 3: Communication Guidelines */}
          <View className="flex-col md:w-[40%] bg-white p-6 rounded-[24px] shadow-sm">
            <View className="flex-row items-center gap-2 mb-4">
              <MaterialIcons name="chat-bubble" size={24} color={colors.secondary} />
              <Text className="font-title-sm text-lg font-bold text-primary">Guidelines</Text>
            </View>
            <View className="flex-col gap-3">
              <View className="flex-row items-start gap-2">
                <MaterialIcons name="check-circle" size={18} color={colors.secondary} />
                <Text className="text-body-md text-on-surface-variant">Asynchronous first for deep work.</Text>
              </View>
              <View className="flex-row items-start gap-2">
                <MaterialIcons name="check-circle" size={18} color={colors.secondary} />
                <Text className="text-body-md text-on-surface-variant">Daily sync at 09:00 UTC.</Text>
              </View>
            </View>
          </View>

          {/* Card 4: Team DNA */}
          <View className="flex-col md:flex-1 bg-white rounded-[24px] shadow-sm overflow-hidden flex-row">
            <View className="flex-1 p-6 justify-center">
              <Text className="font-headline-md text-2xl font-bold text-primary mb-2">Team DNA</Text>
              <Text className="text-body-md text-on-surface-variant">
                We value radical transparency and high-fidelity feedback. Project Nova isn't just a workspace; it's a living intelligence.
              </Text>
            </View>
            <View className="flex-1 min-h-[200px] bg-surface-container-highest">
              <Image source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBjGnN63aem47L-DiCtrvlxi30CIzc9imeSVypxjCZW-nlonpIa4oUQ7g2D8xx9cd9i_MJtXOF36UF529mNbbZvbACFiCJFVBJ8hNvfWoH42EX4TJPBhgYxoNMV-MnMEbzLyIO13IUG9Vo0wmMZFkSv_XHYN2TRqob-dsSK6zD70-qpW7zPFQjLCzmkZfInykJ4VkWHTAw67ljPOpLMB91zfa4a_3FSMODvS0__CYzVUD9iQNKEeBx0sJlzFFG4vLV9Bdmp0jx6czg' }} className="w-full h-full object-cover" />
            </View>
          </View>

        </View>

        {/* Footer Actions */}
        <View className="mt-12 items-center gap-6">
          <Button 
            variant="primary" 
            label="Get Started" 
            icon="arrow-forward"
            onPress={() => router.push('/teams/shared')} 
          />
          <Text className="text-caption-sm text-on-surface-variant text-center">
            By entering, you agree to the Nova Workspace Protocol 2.4.
          </Text>
        </View>

      </View>
    </Screen>
  );
}
