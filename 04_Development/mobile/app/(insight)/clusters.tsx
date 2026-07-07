import { View, Text, ScrollView, TouchableOpacity, ImageBackground } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Screen, Button } from '../../src/shared/components';
import { colors } from '../../src/shared/theme/colors';
import { useRouter } from 'expo-router';
import React from 'react';

export default function SemanticClusters() {
  const router = useRouter();

  return (
    <Screen scrollable={true}>
      <View className="px-margin-mobile pt-6 pb-32 flex-col gap-xl">
        
        {/* Hero Section */}
        <View className="mb-4">
          <Text className="font-headline-md text-[32px] md:text-[44px] text-primary font-bold tracking-tight mb-2">Semantic Clusters</Text>
          <Text className="font-body-md text-on-surface-variant max-w-2xl leading-relaxed">
            Discover the invisible threads connecting your projects, people, and locations. Your life as a coherent knowledge graph.
          </Text>
        </View>

        {/* Bento Grid Layout */}
        <View className="flex-col gap-lg md:flex-row">
          
          {/* Connection Heatmap */}
          <View className="flex-[2] bg-surface-container-lowest/80 border border-outline-variant p-lg rounded-[24px] shadow-sm flex-col">
            <View className="flex-row justify-between items-start mb-6">
              <View>
                <Text className="font-headline-md text-xl font-bold text-primary">Connection Heatmap</Text>
                <Text className="text-body-sm text-on-surface-variant mt-1">Project-Location-People Overlap</Text>
              </View>
              <View className="bg-secondary-container/30 px-3 py-1.5 rounded-full">
                <Text className="text-[10px] text-on-secondary-container font-bold uppercase tracking-widest">Monthly View</Text>
              </View>
            </View>

            {/* Simulated Heatmap Grid */}
            <View className="flex-row flex-wrap gap-1 md:gap-2 h-64 md:h-80 mb-4 justify-center">
              {Array.from({ length: 42 }).map((_, i) => {
                const heatLevels = [
                  'bg-primary/10', 'bg-primary/30', 'bg-primary/50',
                  'bg-secondary/40', 'bg-secondary/70', 'bg-secondary', 'bg-primary-container'
                ];
                const bgClass = heatLevels[Math.floor(Math.random() * heatLevels.length)];
                return (
                  <View key={i} className={`w-[12%] md:w-[8%] h-[15%] md:h-[12%] rounded-md ${bgClass}`} />
                );
              })}
            </View>

            <View className="flex-row justify-between items-center mt-auto border-t border-outline-variant/30 pt-4">
              <Text className="text-[10px] text-on-surface-variant uppercase tracking-widest font-bold">Sparse</Text>
              <View className="flex-row gap-1">
                <View className="w-3 h-3 bg-primary/10 rounded-sm" />
                <View className="w-3 h-3 bg-primary/30 rounded-sm" />
                <View className="w-3 h-3 bg-primary/50 rounded-sm" />
                <View className="w-3 h-3 bg-secondary/70 rounded-sm" />
                <View className="w-3 h-3 bg-primary-container rounded-sm" />
              </View>
              <Text className="text-[10px] text-on-surface-variant uppercase tracking-widest font-bold">Dense</Text>
            </View>
          </View>

          {/* Side Card: Quick Stats */}
          <View className="flex-[1] flex-col gap-lg">
            
            {/* Strongest Node */}
            <View className="bg-primary-container text-on-primary-container rounded-[24px] p-lg shadow-sm">
              <MaterialIcons name="hub" size={32} color={colors.white} />
              <Text className="font-headline-md text-[18px] font-bold text-white mt-4">Strongest Node</Text>
              <Text className="font-display-lg text-[32px] font-extrabold text-white my-1">Nova Project</Text>
              <Text className="text-body-sm text-white/80 leading-relaxed mb-6">
                Contributing to 42% of all new semantic connections this quarter.
              </Text>
              <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="w-full bg-white py-3 rounded-xl items-center justify-center">
                <Text className="text-primary-container font-bold text-[14px]">Explore Node</Text>
              </TouchableOpacity>
            </View>

            {/* Top Clusters */}
            <View className="bg-surface-container-lowest/80 border border-outline-variant p-lg rounded-[24px] shadow-sm flex-1">
              <Text className="font-bold text-[10px] text-on-surface-variant uppercase tracking-widest mb-6">Top Clusters</Text>
              
              <View className="flex-col gap-4">
                <View className="flex-row justify-between items-center">
                  <View className="flex-row items-center gap-3">
                    <View className="w-2 h-2 rounded-full bg-secondary" />
                    <Text className="font-body-md font-bold text-on-surface">Design Ops</Text>
                  </View>
                  <View className="bg-surface-variant px-2 py-1 rounded">
                    <Text className="text-[10px] font-bold text-on-surface">88%</Text>
                  </View>
                </View>

                <View className="flex-row justify-between items-center">
                  <View className="flex-row items-center gap-3">
                    <View className="w-2 h-2 rounded-full bg-primary" />
                    <Text className="font-body-md font-bold text-on-surface">Life Strategy</Text>
                  </View>
                  <View className="bg-surface-variant px-2 py-1 rounded">
                    <Text className="text-[10px] font-bold text-on-surface">64%</Text>
                  </View>
                </View>

                <View className="flex-row justify-between items-center">
                  <View className="flex-row items-center gap-3">
                    <View className="w-2 h-2 rounded-full bg-[#003d0b]" />
                    <Text className="font-body-md font-bold text-on-surface">Health Sync</Text>
                  </View>
                  <View className="bg-surface-variant px-2 py-1 rounded">
                    <Text className="text-[10px] font-bold text-on-surface">32%</Text>
                  </View>
                </View>
              </View>

            </View>
          </View>
        </View>

        {/* Growth of Wisdom */}
        <View className="bg-surface-container-lowest/80 border border-outline-variant p-lg rounded-[24px] shadow-sm mt-2 flex-col">
          <View className="flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <View>
              <Text className="font-headline-md text-xl font-bold text-primary">Growth of Wisdom</Text>
              <Text className="text-body-md text-on-surface-variant mt-1">Cumulative semantic connections formed over time.</Text>
            </View>
            <View className="flex-row items-baseline gap-2">
              <Text className="font-display-lg text-[32px] md:text-[44px] text-secondary font-bold">+1,240</Text>
              <Text className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">NEW LINKS</Text>
            </View>
          </View>

          {/* Simple Chart Representation using border bottom shape */}
          <View className="h-48 relative border-b border-outline-variant/30 flex-row items-end justify-between px-2 pb-8">
             <View className="w-3 h-3 bg-primary rounded-full mb-[20px]" />
             <View className="w-3 h-3 bg-primary rounded-full mb-[50px]" />
             <View className="w-3 h-3 bg-secondary rounded-full mb-[80px]" />
             <View className="w-4 h-4 bg-secondary rounded-full mb-[130px] shadow-lg animate-pulse" />
             <View className="w-3 h-3 bg-secondary-container rounded-full mb-[160px]" />

             {/* Line approximation */}
             <View className="absolute inset-0 top-10 pointer-events-none opacity-20 border-t-[4px] border-secondary" style={{ borderRadius: '50% 50% 0 0', transform: [{ scaleY: 0.5 }] }} />
          </View>
          <View className="flex-row justify-between mt-2 px-1">
            <Text className="text-[10px] text-on-surface-variant/60 font-bold uppercase tracking-widest">JAN</Text>
            <Text className="text-[10px] text-on-surface-variant/60 font-bold uppercase tracking-widest">MAR</Text>
            <Text className="text-[10px] text-on-surface-variant/60 font-bold uppercase tracking-widest">MAY</Text>
            <Text className="text-[10px] text-on-surface-variant/60 font-bold uppercase tracking-widest">JUL</Text>
            <Text className="text-[10px] text-on-surface-variant/60 font-bold uppercase tracking-widest">SEP</Text>
          </View>
        </View>

        {/* The Project Nova Impact (Deep Dive) */}
        <View className="flex-col md:flex-row gap-lg mt-2">
          
          <View className="flex-1 bg-surface-container-lowest/80 border border-outline-variant p-lg rounded-[24px] flex-col justify-center shadow-sm">
            <Text className="font-headline-md text-xl font-bold text-primary mb-4">The Project Nova Impact</Text>
            <Text className="font-body-md text-on-surface-variant leading-relaxed mb-6">
              Analyzing the ripple effect of your primary focus. Nova didn't just occupy time; it acted as a catalyst for 14 ancillary sub-projects and connected you with 28 new professional contacts across 3 global regions.
            </Text>
            
            <View className="flex-row gap-4 mt-auto">
              <View className="flex-1 p-4 bg-surface-container-highest rounded-[16px]">
                <Text className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest mb-1">Focus Intensity</Text>
                <Text className="font-headline-md text-[18px] font-bold text-primary">High (9.4/10)</Text>
              </View>
              <View className="flex-1 p-4 bg-surface-container-highest rounded-[16px]">
                <Text className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest mb-1">Success Propensity</Text>
                <Text className="font-headline-md text-[18px] font-bold text-secondary">82%</Text>
              </View>
            </View>
          </View>

          <View className="flex-1 h-80 rounded-[24px] overflow-hidden shadow-sm relative">
            <ImageBackground 
              source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBfMpXiSYyTxH8o60Ulfs68YxN7_4-XjOK-7sTUJ2Tk5s_8sA4Yw3YZjxqLQMIsbpxcT0NInHDVYwOtf_RmSA3ZlpJDeS8CRvZCGBCLGNN17uc404cA7mVzGUOBB7UbdHF3jsS94u7V8OnTumJZmf6sJYeMSvO1m2kNUKaf3XFN9qi2ZnyVD-o_r1WpB8Dwi0j6K9eVSr-fqbhHxXxho4rlL5dUz2KS1WtaSmcb8xp2Wtl_jCitTg4oU58kxpmBV-1GQq4VNwKO_4U' }}
              className="w-full h-full"
              resizeMode="cover"
            >
              <View className="absolute inset-0 bg-primary/40 flex items-center justify-end p-lg">
                <Text className="text-white font-body-md italic text-center w-full shadow-sm">
                  "Complexity is the baseline. Clarity is the breakthrough."
                </Text>
              </View>
            </ImageBackground>
          </View>
          
        </View>

        {/* Call to Action Section */}
        <View className="bg-secondary p-lg rounded-[32px] flex-col md:flex-row items-center justify-between gap-lg mt-4 relative overflow-hidden">
          <View className="flex-1 z-10 items-center md:items-start">
            <Text className="font-headline-md text-[24px] md:text-[32px] font-bold text-white mb-2 text-center md:text-left">Synthesize New Connections?</Text>
            <Text className="font-body-md text-white/90 text-center md:text-left max-w-lg leading-relaxed">
              Let the AI run a deep scan across your fragmented notes and meeting transcripts to find hidden synergies.
            </Text>
          </View>
          <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="z-10 px-8 py-4 bg-white rounded-full shadow-sm items-center justify-center mt-4 md:mt-0">
            <Text className="text-secondary font-bold text-[14px]">Run Semantic Deep-Scan</Text>
          </TouchableOpacity>
        </View>

      </View>
    </Screen>
  );
}
