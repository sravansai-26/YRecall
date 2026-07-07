import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Screen } from '../../src/shared/components';
import { colors } from '../../src/shared/theme/colors';
import { useRouter } from 'expo-router';
import React from 'react';

export default function GraphEditor() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* TopAppBar */}
      <View className="w-full top-0 z-50 bg-surface-container border-b border-outline-variant/10 shadow-sm h-16 px-4 flex-row justify-between items-center">
        <View className="flex-row items-center gap-4">
          <TouchableOpacity onPress={() => router.back()} className="flex-row items-center gap-2">
            <MaterialIcons name="hub" size={24} color={colors.primary} />
            <Text className="font-headline-md text-2xl font-bold text-primary">YRecall Teams</Text>
          </TouchableOpacity>
        </View>
        <View className="hidden md:flex-row items-center gap-8">
          <View className="flex-row gap-6">
            <Text className="text-primary font-bold font-label-xs uppercase tracking-widest">Project Nova</Text>
            <Text className="text-on-surface-variant font-label-xs uppercase tracking-widest">Analytics</Text>
            <Text className="text-on-surface-variant font-label-xs uppercase tracking-widest">History</Text>
          </View>
        </View>
        <View className="flex-row items-center gap-3">
          {/* Multi-user Presence */}
          <View className="flex-row -space-x-2 mr-4">
            <View className="w-8 h-8 rounded-full border-2 border-surface-container overflow-hidden shadow-[0_0_0_2px_#006a6a]">
              <Image source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA9hgppDyQH7mKIDZBtLS-LOdnLG9CeTqhaL0XIXo7uqavnaG8nveG1--58OQkAExBic9n8nliyBn1C41PYN1QMLxUkwD8XrcurI2yupRMZh1oD7WXFwM8GQwqbngTl92znCUZCmF4zqUNRRFfaCONr6T7TJphQq92jr0gyoM3SY1fgUxJMEzB1MKS2XQlA9zWoqojg0XaFOare8TSh_QTNz4A7FIADpy7zFZQaR3e_Gvs9COwIItpMo979LgZOp6BaDSJPcdREJZA' }} className="w-full h-full object-cover" />
            </View>
            <View className="w-8 h-8 rounded-full border-2 border-surface-container overflow-hidden">
              <Image source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAX0IugcGIxIH6zP3u2fQte2sL5le34r0I8tNiHYQSfUOOYSQuag3I4nPvn9y9pFnZuo4ZD4F7osrNTHa2L47TGlEPBmytNf1wRUzgXPBR5qPcpddbp5OSXe0KP1luCxBk0mnB5uGU_M6yNKWrOu3Ql-i8G6dlXY6Fgz4dDNskyMvN2gCDvzIrDg6J7bKGAhcuAzT6i7go4dzhR0vlp5KTPIPjQKAI3kBWxsBS9KqSUjpY80ObIKlfUIqxEwzaln2zdKPI_36hixPs' }} className="w-full h-full object-cover" />
            </View>
            <View className="w-8 h-8 rounded-full border-2 border-surface-container bg-secondary-container flex items-center justify-center">
              <Text className="text-[10px] font-bold text-on-secondary-container">+2</Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="flex-row items-center gap-2 px-4 py-2 bg-primary rounded-xl">
            <MaterialIcons name="groups" size={16} color="#ffffff" />
            <Text className="text-white font-label-xs uppercase tracking-widest">Presence</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View className="flex-1 flex-row relative overflow-hidden">
        
        {/* Sidebar */}
        <View className="hidden lg:flex w-[280px] bg-surface-container-low border-r border-outline-variant/10 z-40 flex-col">
          <View className="p-6 border-b border-outline-variant/10">
            <View className="self-start bg-secondary-container px-2 py-0.5 rounded mb-2">
              <Text className="text-[10px] font-bold uppercase tracking-wider text-on-secondary-container">Active Node</Text>
            </View>
            <Text className="font-headline-sm text-[20px] font-bold text-primary mb-1">Architecture.v2</Text>
            <Text className="text-caption-sm text-on-surface-variant italic">Last modified by Alex R. 2m ago</Text>
          </View>
          
          <ScrollView className="flex-1 p-3">
            <View className="mb-6">
              <Text className="font-label-xs uppercase tracking-widest text-on-surface-variant mb-3 px-3">Live Collaboration</Text>
              <View className="gap-3 px-3">
                <View className="p-3 bg-surface rounded-xl border border-outline-variant/20">
                  <View className="flex-row items-center gap-2 mb-2">
                    <View className="w-5 h-5 rounded-full bg-blue-500" />
                    <Text className="font-bold text-sm">Alex R.</Text>
                  </View>
                  <Text className="text-sm text-on-surface-variant">"Updating the latency constraints for the core cluster nodes."</Text>
                </View>
                <View className="p-3 bg-surface rounded-xl border border-outline-variant/20">
                  <View className="flex-row items-center gap-2 mb-2">
                    <View className="w-5 h-5 rounded-full bg-teal-500" />
                    <Text className="font-bold text-sm">Elena V.</Text>
                  </View>
                  <Text className="text-sm text-on-surface-variant">"Linked the Security Protocol node to this."</Text>
                </View>
              </View>
            </View>

            <View className="mb-6">
              <Text className="font-label-xs uppercase tracking-widest text-on-surface-variant mb-3 px-3">Node Connections</Text>
              <View className="flex-row flex-wrap gap-2 px-3">
                <View className="bg-surface-bright px-3 py-1 rounded-full border border-outline-variant/10 flex-row items-center gap-1">
                  <MaterialIcons name="link" size={14} color={colors['on-surface']} />
                  <Text className="text-sm">API-Gateway</Text>
                </View>
                <View className="bg-surface-bright px-3 py-1 rounded-full border border-outline-variant/10 flex-row items-center gap-1">
                  <MaterialIcons name="link" size={14} color={colors['on-surface']} />
                  <Text className="text-sm">Auth-Service</Text>
                </View>
                <View className="bg-surface-bright px-3 py-1 rounded-full border border-outline-variant/10 flex-row items-center gap-1">
                  <MaterialIcons name="link" size={14} color={colors['on-surface']} />
                  <Text className="text-sm">Cloud-Storage</Text>
                </View>
              </View>
            </View>
          </ScrollView>

          <View className="p-3 bg-surface-container-high/50">
            <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="w-full bg-primary py-3 rounded-xl items-center">
              <Text className="text-white font-bold">Commit Changes</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Main Canvas */}
        <View style={styles.canvas} className="flex-1 relative justify-center items-center">
          
          {/* Overlays */}
          <View className="absolute inset-0 p-6 z-10 pointer-events-none">
            <View className="absolute top-6 left-6">
              <View className="flex-row items-center gap-2 mb-1 opacity-60">
                <MaterialIcons name="folder-open" size={14} color="#ffffff" />
                <Text className="font-label-xs text-[11px] font-bold text-white uppercase tracking-widest">PROJECT NOVA CLUSTER</Text>
              </View>
              <View className="h-1 w-16 bg-secondary-container" />
            </View>

            <View className="absolute bottom-6 left-6 flex-row items-center gap-2 bg-primary/40 px-3 py-1.5 rounded-full border border-white/10">
              <View className="w-2 h-2 rounded-full bg-secondary-container" />
              <Text className="text-secondary-fixed font-label-xs tracking-widest uppercase">AI SYNCHRONIZED</Text>
            </View>
          </View>

          {/* Graph Nodes */}
          <View className="w-[800px] h-[600px] relative items-center justify-center">
            
            {/* SVG lines would go here natively using react-native-svg, simulating with styled views for now */}
            
            {/* Central Node */}
            <View className="absolute top-[260px] left-[340px] w-32 h-32 items-center justify-center z-20">
              <View className="absolute inset-0 bg-secondary-container/20 rounded-full" />
              <View className="w-24 h-24 bg-white/10 border-2 border-secondary-container rounded-full items-center justify-center">
                <MaterialIcons name="hub" size={32} color={colors['secondary-fixed']} />
                <Text className="text-white text-[10px] font-bold mt-1">NOVA-CORE</Text>
              </View>
            </View>

            {/* Satellite Node 1 */}
            <View className="absolute top-[120px] left-[150px] items-center z-20">
              <View className="w-16 h-16 bg-white/5 border border-white/20 rounded-xl items-center justify-center mb-2">
                <MaterialIcons name="architecture" size={24} color="rgba(255,255,255,0.8)" />
              </View>
              <Text className="text-white/60 text-[10px] font-bold">Architecture.v2</Text>
            </View>

            {/* Satellite Node 2 */}
            <View className="absolute top-[160px] left-[550px] items-center z-20">
              <View className="w-14 h-14 bg-white/5 border border-white/20 rounded-xl items-center justify-center mb-2">
                <MaterialIcons name="security" size={24} color="rgba(255,255,255,0.8)" />
              </View>
              <Text className="text-white/60 text-[10px] font-bold">Security</Text>
            </View>

            {/* Satellite Node 3 */}
            <View className="absolute top-[420px] left-[460px] items-center z-20">
              <View className="w-20 h-20 bg-white/5 border border-white/20 rounded-xl items-center justify-center mb-2">
                <MaterialIcons name="analytics" size={32} color="rgba(255,255,255,0.8)" />
              </View>
              <Text className="text-white/60 text-[10px] font-bold">Telemetry-Data</Text>
            </View>

          </View>

          {/* Toolbar Overlay */}
          <View className="absolute right-6 top-6 gap-3 z-30">
            <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="w-12 h-12 bg-primary/80 border border-white/10 rounded-full items-center justify-center">
              <MaterialIcons name="zoom-in" size={24} color="#ffffff" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="w-12 h-12 bg-primary/80 border border-white/10 rounded-full items-center justify-center">
              <MaterialIcons name="zoom-out" size={24} color="#ffffff" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="w-12 h-12 bg-primary/80 border border-white/10 rounded-full items-center justify-center">
              <MaterialIcons name="center-focus-strong" size={24} color="#ffffff" />
            </TouchableOpacity>
          </View>

        </View>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  canvas: {
    backgroundColor: '#001e40', // Simulating radial gradient center
  }
});
