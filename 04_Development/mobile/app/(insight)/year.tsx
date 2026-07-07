import { View, Text, ScrollView, TouchableOpacity, Image, ImageBackground } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Screen, Button } from '../../src/shared/components';
import { colors } from '../../src/shared/theme/colors';
import { useRouter } from 'expo-router';
import React from 'react';

export default function YourYearInYRecall() {
  const router = useRouter();

  return (
    <Screen scrollable={true}>
      <View className="px-margin-mobile pt-6 pb-32 flex-col gap-xl">
        
        {/* Header Section */}
        <View className="flex-row items-center justify-between mb-4">
          <Text className="font-headline-md text-[32px] text-primary font-bold tracking-tight">Your Year in YRecall</Text>
          <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="bg-primary px-4 py-2 rounded-full">
            <Text className="text-white font-bold text-[12px]">Share Story</Text>
          </TouchableOpacity>
        </View>

        {/* Hero Section: Knowledge Graph Visualization */}
        <View className="bg-primary rounded-[32px] overflow-hidden p-6 md:p-12 relative flex-col items-center justify-center min-h-[400px]">
          
          <View className="z-10 items-center">
            <Text className="font-bold text-[12px] text-secondary-fixed uppercase tracking-widest mb-4">2024 Retrospective</Text>
            <Text className="font-display-lg text-[44px] md:text-[56px] text-white font-bold mb-4 text-center">Your Life in Nodes</Text>
            <Text className="text-body-md text-primary-fixed text-center max-w-lg leading-relaxed">
              We tracked 4,281 new conceptual connections in your mental model this year. Your knowledge graph grew by 32%.
            </Text>
          </View>

          {/* Abstract Stats Nodes */}
          <View className="absolute bottom-6 left-6 bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10">
            <Text className="font-bold text-[12px] text-secondary uppercase tracking-widest mb-1">Strongest Hub</Text>
            <Text className="font-title-sm font-bold text-white">Quantum Computing</Text>
          </View>
          
          <View className="absolute top-6 right-6 bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10">
            <Text className="font-bold text-[12px] text-secondary uppercase tracking-widest mb-1">New Horizon</Text>
            <Text className="font-title-sm font-bold text-white">Urban Forestry</Text>
          </View>
        </View>

        {/* Bento Grid Stats */}
        <View className="flex-col md:flex-row gap-lg">
          
          {/* Top People (Circular Avatars) */}
          <View className="flex-[2] bg-surface-container-lowest/80 border border-outline-variant p-lg rounded-[24px] shadow-sm flex-col justify-between">
            <View>
              <Text className="font-headline-md text-xl font-bold text-primary mb-1">The Inner Circle</Text>
              <Text className="text-body-md text-on-surface-variant mb-6">Your most meaningful digital interactions of 2024.</Text>
            </View>

            <View className="flex-row flex-wrap gap-4 items-center justify-around py-4">
              
              <View className="items-center gap-2">
                <View className="w-20 h-20 rounded-full border-4 border-white shadow-sm overflow-hidden">
                  <Image source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD6LHrQLywgW6GR3hhJ37KhJfVvN1ROrZ2QzBFqjD1WHvfuV8fuTVHKT5ltrx067YSBHY8Htv4mOL_FQe9desCltEiskEUqFBiEBFC1IRi-Z4-R3DhVm3oG5iAMu_M9C9AgRQEU9YqGdOUy0IhDxKFBbQQB03xruxZEspIGwKSI-LCs4jTFhfcstmCv5sKYoK_exLDoVwgtUvgM2azDCS4mA4YS4c2cymWWCyQxSE47jXpbB7kK_4V4CldImoc_fpXnXvyn22cTm6s' }} className="w-full h-full" />
                </View>
                <Text className="font-bold text-[12px] text-primary">Elena V.</Text>
              </View>

              <View className="items-center gap-2">
                <View className="w-24 h-24 rounded-full border-4 border-secondary shadow-sm overflow-hidden">
                  <Image source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBmzouNeunIhZQTBgn_5Qgd7nYjZpXAfJ-3TK6W1_ES3YB_INECLruZUjX7hQ3OZkx4hhDvCUhbk3KS7nv4PJlv7FAKdh15ilDrsUPOUhuy9nV7_XGCzVZv2BwBW9CvCm7wde0A2X3dWxmyafKm7uapH2plpR8anGhS2oiM2P40xnUfJhEPaxLTeP0-rG6VJX9Ow3lhRfiV-tsKv8ToKqtq3kmtyNxlQIzdYS8Xp_SjXExxnVSjiPR4QFtICbBRp1O6qezHxEf1vkE' }} className="w-full h-full" />
                </View>
                <Text className="font-bold text-[12px] text-secondary uppercase tracking-widest">#1 Contact</Text>
              </View>

              <View className="items-center gap-2">
                <View className="w-20 h-20 rounded-full border-4 border-white shadow-sm overflow-hidden">
                  <Image source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDBH71Tvujb7IMOqpi_v1LSz6yK5zawSEVvDM4gwtIMKh682jgwTUai7GgNiruxGv7nxEoNfpvlSNkCAqYvOnJ7-9IERjEGg5mW25SAVXfPZREWX_oZpOWBLKwXk8WHXFSQQP3XyjB1IGRvwZpuU84GRkuxxpxLpfb0OWMVZgnHPKP7wZb_qJJyJsYITuhq6D4xouqKXJIla5nSi2mRyAbWwYIFuJv9N_TFPY0k1o0dyTRd0SuSAuZ8eZeoki6CcVXQxmWr2TMJh0s' }} className="w-full h-full" />
                </View>
                <Text className="font-bold text-[12px] text-primary">Marcus J.</Text>
              </View>

              <View className="items-center gap-2">
                <View className="w-16 h-16 rounded-full border-4 border-white shadow-sm overflow-hidden">
                  <Image source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCifSHY-HN_ugBrkB7yF8wPaOx9bvh_cBKk3U4TlVChwyGr2HA_7jT-ncDJajwt8UjDAUAfeMbbKPf2gawYmhoFEza_UtuvYdsAkcliN7uXrUCPfCW2N37TmH_EIj4S1dwCJWxmAEPvZ_sLoHE0V3aypEMz-8YphS0pFLlQtlQ9xjK5XGiQ5R7HBIvYG4dtusCJ51e-MzEAUHdrmdr3Ake560dxC4e6eb3zuD3Nf9BZiZgBWe-EGOR7xReZpoPKagMxXvQQtuU3HbQ' }} className="w-full h-full" />
                </View>
                <Text className="font-bold text-[12px] text-primary">Sarah K.</Text>
              </View>
              
            </View>
          </View>

          {/* Total Recall Stat */}
          <View className="flex-[1] bg-secondary-container p-lg rounded-[24px] shadow-sm flex-col justify-between relative overflow-hidden">
            <View className="absolute top-4 right-4 opacity-10">
              <MaterialIcons name="psychology" size={120} color={colors['on-secondary-container']} />
            </View>
            <View className="mt-auto">
              <Text className="font-display-lg text-[64px] font-extrabold text-on-secondary-container leading-none mb-2">842</Text>
              <Text className="font-bold text-[18px] text-on-secondary-container">Total Recalls</Text>
              <Text className="text-[12px] text-on-secondary-container/80 mt-1">Memories retrieved via AI search</Text>
            </View>
          </View>
        </View>

        <View className="flex-col md:flex-row gap-lg">
          
          {/* Mindfulness vs. Productivity Chart */}
          <View className="flex-[1.5] bg-surface-container-lowest/80 border border-outline-variant p-lg rounded-[24px] shadow-sm flex-col">
            <View className="flex-row justify-between items-start mb-8">
              <View>
                <Text className="font-headline-md text-xl font-bold text-primary">The Balance</Text>
                <Text className="text-[12px] text-on-surface-variant mt-1">Mindfulness vs. Productivity</Text>
              </View>
              <View className="flex-row gap-4">
                <View className="flex-row items-center gap-1">
                  <View className="w-3 h-3 rounded-full bg-secondary" />
                  <Text className="font-bold text-[10px] text-on-surface-variant uppercase tracking-widest">Prod</Text>
                </View>
                <View className="flex-row items-center gap-1">
                  <View className="w-3 h-3 rounded-full bg-[#88d982]" />
                  <Text className="font-bold text-[10px] text-on-surface-variant uppercase tracking-widest">Mind</Text>
                </View>
              </View>
            </View>

            <View className="h-64 flex-row items-end justify-between gap-2 px-2 pb-6 border-b border-outline-variant/20">
              {/* Simple stacked bars */}
              <View className="flex-col items-center justify-end w-12 gap-1 h-full">
                <View className="w-full bg-[#88d982] h-[20%] rounded-t-sm" />
                <View className="w-full bg-secondary h-[40%] rounded-t-sm" />
                <Text className="absolute -bottom-6 text-[10px] font-bold text-on-surface-variant uppercase">Jan</Text>
              </View>
              <View className="flex-col items-center justify-end w-12 gap-1 h-full">
                <View className="w-full bg-[#88d982] h-[30%] rounded-t-sm" />
                <View className="w-full bg-secondary h-[50%] rounded-t-sm" />
                <Text className="absolute -bottom-6 text-[10px] font-bold text-on-surface-variant uppercase">Mar</Text>
              </View>
              <View className="flex-col items-center justify-end w-12 gap-1 h-full">
                <View className="w-full bg-[#88d982] h-[40%] rounded-t-sm" />
                <View className="w-full bg-secondary h-[60%] rounded-t-sm" />
                <Text className="absolute -bottom-6 text-[10px] font-bold text-on-surface-variant uppercase">Jun</Text>
              </View>
              <View className="flex-col items-center justify-end w-12 gap-1 h-full">
                <View className="w-full bg-[#88d982] h-[60%] rounded-t-sm" />
                <View className="w-full bg-secondary h-[40%] rounded-t-sm" />
                <Text className="absolute -bottom-6 text-[10px] font-bold text-on-surface-variant uppercase">Sep</Text>
              </View>
              <View className="flex-col items-center justify-end w-12 gap-1 h-full">
                <View className="w-full bg-[#88d982] h-[50%] rounded-t-sm" />
                <View className="w-full bg-secondary h-[70%] rounded-t-sm" />
                <Text className="absolute -bottom-6 text-[10px] font-bold text-on-surface-variant uppercase">Dec</Text>
              </View>
            </View>

            <View className="mt-8 p-4 bg-surface-container rounded-xl">
              <Text className="text-[12px] italic text-on-surface-variant">"You are most productive on Tuesdays after a morning meditation session."</Text>
            </View>
          </View>

          {/* Digital Footprint Map */}
          <View className="flex-[1] bg-surface-container-highest p-lg rounded-[24px] shadow-sm relative overflow-hidden flex-col">
            <View className="z-10 mb-auto">
              <Text className="font-headline-md text-xl font-bold text-primary">Digital Footprint</Text>
              <Text className="text-[12px] text-on-surface-variant mt-1">Your movement across the globe.</Text>
            </View>
            
            <View className="absolute inset-0 opacity-40">
              <ImageBackground source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBxcxvUhpIjK2wB02CoyJwU_SW769XiWloCuNFqTMTviYu8seR-uLpz9c6nUsCXiY4WxaGirw_qemMe6VSQk5opCWUyPX8rAEDUpzAg1JCCeA9r2ffaZobGizXyHfSTUWmZ-AdGg8FVIFxcza-lqnc_QXp1150OYJhaGwqgRSvndggxVcUjD-dqPG0PbhmJg2Cs22dP7DbsOXz2kgNDuz8ezPthHykE9x0T7YEztrMIYIqWOIJrG8jdKaY-Bzhrh6cYGTloRiS249Y' }} className="w-full h-full" resizeMode="cover" />
            </View>

            <View className="z-10 flex-col gap-3 mt-16">
              <View className="flex-row justify-between items-center bg-white/60 p-3 rounded-lg border border-white/80 shadow-sm">
                <View className="flex-row items-center gap-2">
                  <MaterialIcons name="location-on" size={16} color={colors.secondary} />
                  <Text className="text-body-md font-bold text-on-surface">Tokyo, Japan</Text>
                </View>
                <Text className="text-[12px] font-bold text-on-surface-variant">12 Days</Text>
              </View>
              <View className="flex-row justify-between items-center bg-white/60 p-3 rounded-lg border border-white/80 shadow-sm">
                <View className="flex-row items-center gap-2">
                  <MaterialIcons name="location-on" size={16} color={colors.secondary} />
                  <Text className="text-body-md font-bold text-on-surface">London, UK</Text>
                </View>
                <Text className="text-[12px] font-bold text-on-surface-variant">24 Days</Text>
              </View>
              <View className="flex-row justify-between items-center bg-white/60 p-3 rounded-lg border border-white/80 shadow-sm">
                <View className="flex-row items-center gap-2">
                  <MaterialIcons name="location-on" size={16} color={colors.secondary} />
                  <Text className="text-body-md font-bold text-on-surface">SF, CA</Text>
                </View>
                <Text className="text-[12px] font-bold text-on-surface-variant">182 Days</Text>
              </View>
            </View>

          </View>
        </View>

        {/* Viral Share CTA Section */}
        <View className="bg-primary rounded-[32px] p-6 md:p-12 items-center justify-center relative overflow-hidden mt-4 shadow-sm">
          <View className="z-10 items-center w-full">
            <Text className="font-headline-md text-[32px] font-bold text-white mb-4 text-center">This is your YRecall legacy.</Text>
            <Text className="text-body-md text-primary-fixed mb-8 text-center max-w-lg leading-relaxed">
              Share your year in knowledge with your network and see how your mind maps compare.
            </Text>
            
            <View className="flex-col sm:flex-row gap-4 w-full justify-center">
              <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="bg-secondary-fixed py-4 px-8 rounded-full flex-row items-center justify-center gap-2">
                <MaterialIcons name="share" size={20} color={colors['on-secondary-fixed']} />
                <Text className="font-bold text-[14px] text-on-secondary-fixed">Share on Instagram</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="bg-white/10 py-4 px-8 rounded-full flex-row items-center justify-center gap-2 border border-white/20">
                <MaterialIcons name="download" size={20} color={colors.white} />
                <Text className="font-bold text-[14px] text-white">Export PDF Report</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

      </View>
    </Screen>
  );
}
