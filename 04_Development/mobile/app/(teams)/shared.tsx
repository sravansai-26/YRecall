import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Screen, Button } from '../../src/shared/components';
import { colors } from '../../src/shared/theme/colors';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';

export default function TeamsSharedSetup() {
  const router = useRouter();
  const [selectedLayer, setSelectedLayer] = useState<'shared' | 'private'>('shared');

  return (
    <Screen scrollable={true}>
      {/* Custom Header for Setup */}
      <View className="fixed top-0 w-full z-50 bg-surface/90 h-16 flex-row justify-between items-center px-margin-mobile border-b border-outline-variant/30">
        <View className="flex-row items-center gap-2">
          <MaterialIcons name="hub" size={24} color={colors.primary} />
          <Text className="font-headline-md text-xl font-bold text-primary">Team Workspace</Text>
        </View>
        <View className="flex-row items-center gap-4">
          <View className="hidden md:flex flex-col items-end mr-4">
            <Text className="text-[10px] font-bold uppercase tracking-wider text-outline">Setup Wizard</Text>
            <Text className="text-body-md text-on-surface-variant">Step 4 of 5</Text>
          </View>
          <View className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center overflow-hidden border border-outline-variant">
            <Image 
              source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDmiwUSDNduL5COVoTejGRCMm1B7UVGTsUnu-rWTzWuYgWdb2r_OwA-aPvSErt_FJSQ52g2OVQmoB9IpCKoANxWu4gPbVt4Hc_W8zEya4EjCh_0Ck828p1EPQqMfhVEvyeSE7FG_ke2_lidgUhhEfRp88yoTexyBB2Gh8CnDZrfrFRni8_aUT39Mcfpwp2LhBA0CONTvcoPZQc9KXxSy8xqsNAET3g2Fd2SOfEulVgz7qy8B09W7eZmI4Q2stq2I9z7buBnB3uo2nw' }}
              className="w-full h-full object-cover"
            />
          </View>
        </View>
      </View>

      <View className="px-margin-mobile pt-6 pb-32 flex-col gap-6 w-full max-w-5xl mx-auto">
        
        {/* Progress Indicator */}
        <View className="mb-4">
          <View className="flex-row justify-between items-center mb-1">
            <Text className="text-[10px] font-bold text-primary uppercase">Workspace Configuration</Text>
            <Text className="text-[10px] font-bold text-primary">80% Complete</Text>
          </View>
          <View className="w-full h-2 bg-surface-container-high rounded-full overflow-hidden">
            <View className="h-full bg-primary w-[80%]" />
          </View>
        </View>

        <View className="flex-col lg:flex-row gap-6">
          
          {/* Left Column */}
          <View className="flex-col lg:w-[58%] gap-6">
            
            {/* Intelligence Architecture */}
            <View className="p-6 rounded-[24px] bg-white shadow-sm border border-surface-container-highest">
              <View className="flex-row items-center gap-2 mb-4">
                <View className="bg-tertiary-fixed rounded-lg p-2">
                  <MaterialIcons name="psychology" size={24} color={colors['on-tertiary-container']} />
                </View>
                <Text className="font-title-sm text-lg text-primary font-bold">Intelligence Architecture</Text>
              </View>
              
              <Text className="text-body-md text-on-surface-variant mb-6">
                Define how the AI processes and retains team knowledge. Shared Memory enables collective learning across all members.
              </Text>

              <View className="flex-col gap-3">
                <TouchableOpacity 
                  className={`p-4 rounded-xl border flex-row items-start gap-3 ${selectedLayer === 'shared' ? 'bg-primary-container/10 border-primary' : 'bg-transparent border-outline-variant'}`}
                  onPress={() => setSelectedLayer('shared')}
                >
                  <View className={`w-5 h-5 rounded-full border-2 items-center justify-center mt-0.5 ${selectedLayer === 'shared' ? 'border-primary' : 'border-outline-variant'}`}>
                    {selectedLayer === 'shared' && <View className="w-2.5 h-2.5 rounded-full bg-primary" />}
                  </View>
                  <View className="flex-1">
                    <Text className="font-title-sm font-bold text-on-surface mb-1">Shared Memory Layer</Text>
                    <Text className="text-caption-sm text-on-surface-variant">The AI learns from all team interactions, creating a central repository of wisdom accessible to everyone.</Text>
                  </View>
                  <MaterialIcons name="info" size={20} color={colors['tertiary-fixed-dim']} />
                </TouchableOpacity>

                <TouchableOpacity 
                  className={`p-4 rounded-xl border flex-row items-start gap-3 ${selectedLayer === 'private' ? 'bg-primary-container/10 border-primary' : 'bg-transparent border-outline-variant'}`}
                  onPress={() => setSelectedLayer('private')}
                >
                  <View className={`w-5 h-5 rounded-full border-2 items-center justify-center mt-0.5 ${selectedLayer === 'private' ? 'border-primary' : 'border-outline-variant'}`}>
                    {selectedLayer === 'private' && <View className="w-2.5 h-2.5 rounded-full bg-primary" />}
                  </View>
                  <View className="flex-1">
                    <Text className="font-title-sm font-bold text-on-surface mb-1">Private Sovereignty Layer</Text>
                    <Text className="text-caption-sm text-on-surface-variant">Individual AI instances with zero data leakage. Knowledge is siloed and only shared via explicit broadcast.</Text>
                  </View>
                  <MaterialIcons name="lock" size={20} color={colors['tertiary-fixed-dim']} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Knowledge Import */}
            <View className="p-6 rounded-[24px] bg-white shadow-sm border border-surface-container-highest">
              <View className="flex-row items-center gap-2 mb-4">
                <View className="bg-primary-fixed rounded-lg p-2">
                  <MaterialIcons name="storage" size={24} color={colors.primary} />
                </View>
                <Text className="font-title-sm text-lg text-primary font-bold">Knowledge Import</Text>
              </View>
              
              <Text className="text-body-md text-on-surface-variant mb-6">
                Sync your existing ecosystem to give the AI context. We never store raw documents, only semantic embeddings.
              </Text>

              <View className="flex-col md:flex-row gap-4">
                <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="flex-1 p-4 rounded-2xl border border-outline-variant flex-col items-center justify-center ">
                  <View className="w-12 h-12 rounded-xl bg-surface-container-highest items-center justify-center mb-2">
                    <MaterialIcons name="description" size={24} color={colors['on-surface']} />
                  </View>
                  <Text className="text-[10px] font-bold text-primary tracking-widest uppercase">Notion</Text>
                  <Text className="text-[10px] text-on-surface-variant mt-1">Connect Workspace</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="flex-1 p-4 rounded-2xl border border-outline-variant flex-col items-center justify-center ">
                  <View className="w-12 h-12 rounded-xl bg-surface-container-highest items-center justify-center mb-2">
                    <MaterialIcons name="forum" size={24} color={colors['on-surface']} />
                  </View>
                  <Text className="text-[10px] font-bold text-primary tracking-widest uppercase">Slack</Text>
                  <Text className="text-[10px] text-on-surface-variant mt-1">Ingest Channels</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="flex-1 p-4 rounded-2xl border border-outline-variant flex-col items-center justify-center ">
                  <View className="w-12 h-12 rounded-xl bg-surface-container-highest items-center justify-center mb-2">
                    <MaterialIcons name="cloud-upload" size={24} color={colors['on-surface']} />
                  </View>
                  <Text className="text-[10px] font-bold text-primary tracking-widest uppercase">G-Drive</Text>
                  <Text className="text-[10px] text-on-surface-variant mt-1">Select Folders</Text>
                </TouchableOpacity>
              </View>
            </View>

          </View>

          {/* Right Column */}
          <View className="flex-col flex-1 gap-6">
            
            {/* Visualizer Card */}
            <View className="rounded-[24px] overflow-hidden h-64 md:h-80 relative shadow-sm">
              <View className="bg-primary/20 absolute inset-0 z-0" />
              <View className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent p-6 flex-col justify-end z-10">
                <Text className="text-white font-title-sm text-lg font-bold mb-2">Neural Network Syncing...</Text>
                
                <View className="flex-row items-center gap-2">
                  <View className="flex-row -space-x-2">
                    <Image source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDrrlq7VXqOyEgvgmouKz7dtM2LA5SLB3t2rJN8afe26z-Q2mPnrILmx3ioT0z8C56km9KbRsRuMAVO786dItQoamj8Ja9qQwfLjH7qxppwKInzO04txvrz-YUG-NukJgrrdC8yDBglhS9a_dKQtxkBs3fg3DLLAtlZLTmKYFFk0AkGni7HanDjytEHenGzGxEhb8ijRs13swCi6v5eVZ44icTrx_ml7Uiviy3Sx2Lmmk-1xff4zSuXBoC0VodnAiZUNpcWeILju1k' }} className="w-6 h-6 rounded-full border-2 border-primary" />
                    <Image source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA9pv5MO2454nj_5SXXZqx-hVlgMSsiKCixrm785PkU6Sf7a5slDvr9Wa8wVuGUGwMxTVDVfPlO3FXq-1212j7etIe1WuB5FCr_1rz3zbZIRvfCBKp7j5KX-RDgQNr_yRFYQ71ccXLDlkDyTXFuM9TNnWn2Z-uGAeFeOLHSvsJ6rYFdJ72Knk6I9L7y08J4nXDcfDf25tqysQXj1AfWQJyV3Rfd8hx7oFQ5sJRDdwQYxfsiuxVu6fv1mxCYKDwZHbuACYa1999qc9A' }} className="w-6 h-6 rounded-full border-2 border-primary" />
                    <View className="w-6 h-6 rounded-full border-2 border-primary bg-primary-container items-center justify-center">
                      <Text className="text-[8px] text-white font-bold">+12</Text>
                    </View>
                  </View>
                  <Text className="text-white/80 text-caption-sm ml-2">Connecting Engineering & Design...</Text>
                </View>
              </View>
            </View>

            {/* Action Card */}
            <View className="p-6 rounded-[24px] bg-secondary-container/30 border border-secondary-fixed flex-col gap-6">
              <View>
                <Text className="font-title-sm text-lg font-bold text-on-secondary-container mb-2">Almost there, Alex</Text>
                <Text className="text-body-md text-on-secondary-fixed-variant">
                  By choosing <Text className="font-bold">Shared Memory</Text>, your team will see a 40% reduction in repeated questions within the first 48 hours.
                </Text>
              </View>

              <View className="flex-col gap-3">
                <Button 
                  variant="primary" 
                  label="Finalize Workspace" 
                  icon="arrow-forward"
                  onPress={() => router.push('/teams/central')} 
                />
                <Button 
                  variant="outline" 
                  label="Save and Exit" 
                />
              </View>
            </View>

            {/* Status Chip */}
            <View className="flex-row items-center justify-between px-4 py-2 bg-surface-container rounded-full">
              <View className="flex-row items-center gap-2">
                <View className="w-2 h-2 rounded-full bg-tertiary" />
                <Text className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">AI Core Status: Ready</Text>
              </View>
              <Text className="text-[10px] font-medium text-on-surface-variant">Latency: 24ms</Text>
            </View>

          </View>

        </View>

      </View>
    </Screen>
  );
}
