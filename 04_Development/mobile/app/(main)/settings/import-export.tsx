import { View, Text, ScrollView, TouchableOpacity, Image, TextInput } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Screen } from '../../../src/shared/components';
import { colors } from '../../../src/shared/theme/colors';
import { useRouter } from 'expo-router';
import React from 'react';

export default function ImportSyncHub() {
  const router = useRouter();

  return (
    <Screen scrollable={true} className="pb-24">
      {/* TopAppBar */}
      <View className="w-full sticky top-0 z-50 bg-surface flex-row items-center justify-between px-margin-mobile h-16">
        <View className="flex-row items-center gap-4">
          <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2 rounded-full ">
            <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
          </TouchableOpacity>
          <Text className="font-title-sm text-xl text-primary font-bold">Import & Sync</Text>
        </View>
      </View>

      <View className="max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop py-6">
        
        {/* Welcome Header */}
        <View className="mb-8">
          <Text className="font-display-lg-mobile md:font-display-lg text-4xl font-bold text-primary mb-4">Bring your world to YRecall</Text>
          <Text className="font-body-md text-base text-on-surface-variant max-w-2xl mb-6">
            Consolidate your digital existence. Connect your primary knowledge bases and let the AI life OS weave your memories together.
          </Text>
          
          <View className="relative w-full max-w-md">
            <View className="absolute left-4 top-4 z-10">
              <MaterialIcons name="search" size={24} color={colors.outline} />
            </View>
            <TextInput 
              className="w-full h-14 pl-12 pr-4 bg-surface-container-low border border-outline-variant/50 rounded-xl font-body-md text-base text-on-surface" 
              placeholder="Search for more integrations..." 
              placeholderTextColor={colors['on-surface-variant']}
            />
          </View>
        </View>

        {/* Sources Bento Grid */}
        <View className="flex-col gap-6">
          
          {/* Google Drive (Connected) */}
          <View className="w-full md:flex-1 bg-white/70 p-6 rounded-[24px] shadow-sm border border-white flex-col justify-between">
            <View className="flex-row justify-between items-start mb-12">
              <View className="w-14 h-14 bg-white rounded-2xl items-center justify-center shadow-sm">
                <Image source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDgoQm63QZuRY1Q_JtsRvrGnbow1A2Lky-cP3AJUZzxNrQokvUxKZ0J6__CA1uSFTodZ-5sk83KOkgrlVRnWz2gOzY6lZfmAXBOiBy8p2lemlKAaftVhkYt5dmnR9CoqMBNPsAE3slRjITAuYz8T_V9p-PdxtxSyLtaSafiOULaoT8D4t1Jf-9P9MeGXpf00opsgZG5v-XSQjViqGaECW1fxcRtIsbqKPViTOQ8dhumYHblfVNUPq1Cx7NA_i9QWXX6T2aSn7pplLA' }} className="w-8 h-8" resizeMode="contain" />
              </View>
              <View className="bg-tertiary-fixed px-3 py-1 rounded-full">
                <Text className="text-on-tertiary-fixed font-label-xs text-xs font-bold">Connected</Text>
              </View>
            </View>
            <View className="flex-col">
              <Text className="font-title-sm text-xl text-on-surface font-bold mb-1">Google Drive</Text>
              <Text className="font-caption-sm text-xs text-on-surface-variant">Last synced 2 minutes ago</Text>
            </View>
          </View>

          {/* Apple Notes (Syncing) */}
          <View className="w-full md:flex-1 bg-white/70 p-6 rounded-[24px] shadow-sm border border-white flex-col justify-between">
            <View className="flex-row justify-between items-start mb-12">
              <View className="w-14 h-14 bg-white rounded-2xl items-center justify-center shadow-sm">
                <Image source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB36Fs_77JX8QxM3CwseP2kqiIm4AANaF_YQboGyqSh2Dv_IFrhGzefDM7CM0FyIew5hmDx3vuy6YP-GZ7biXjnjDH0keh4dPNutEuCIGAYw8kjhjH8oiNqbUIP1zmZplQASvZvvU9akewq5DXPUKFaOmulQlK3OZ8dtwxPLpQi4OEgr5IEaDvGCbVwfyaI6F_FjaH25RI47o0fR34SBcLLLppkYCu96fxf_zYJqfkFDaSlw_k38LO6Smj0MCuZYOTzDI1YmJaYcuo' }} className="w-8 h-8" resizeMode="contain" />
              </View>
              <View className="flex-row items-center gap-1 bg-secondary-container px-3 py-1 rounded-full">
                <MaterialIcons name="sync" size={14} color={colors['on-secondary-container']} />
                <Text className="text-on-secondary-container font-label-xs text-xs font-bold">Syncing 85%</Text>
              </View>
            </View>
            <View className="flex-col">
              <Text className="font-title-sm text-xl text-on-surface font-bold mb-1">Apple Notes</Text>
              <Text className="font-caption-sm text-xs text-on-surface-variant">Importing 4,208 snippets...</Text>
            </View>
          </View>

          {/* Notion (Action Required) */}
          <View className="w-full md:flex-1 bg-white/70 p-6 rounded-[24px] shadow-sm border border-error/20 flex-col justify-between">
            <View className="flex-row justify-between items-start mb-12">
              <View className="w-14 h-14 bg-white rounded-2xl items-center justify-center shadow-sm">
                <Image source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDI3dDMI3RJ1Sg-K3rs9_sqsv3AnGG6pVXdm0t6TeKoK2UHVB2IwuyjVzXuzAycqPvK0ST1gBAhxk-zEIP6fFMkUtNODclKLWhpJbGspk66l7XYhWRasEr4jXHeIhLHAka0ciEZNDHH7kSvallJDdLJF-ys16ugGiyJJy4zz04VIXYS3DrQgfjk8Txjz0PbO4cXT3OkzcTA5Mfl9WDXWnRgMTVtkLCHoYMwFIZLxhQEVuWlERTbMa9vc9botIKryeOiK1J-HiCXEJM' }} className="w-8 h-8" resizeMode="contain" />
              </View>
              <View className="bg-error-container px-3 py-1 rounded-full">
                <Text className="text-on-error-container font-label-xs text-xs font-bold">Action Required</Text>
              </View>
            </View>
            <View className="flex-col">
              <Text className="font-title-sm text-xl text-on-surface font-bold mb-1">Notion</Text>
              <Text className="font-caption-sm text-xs text-on-surface-variant">Token expired. Re-authenticate.</Text>
            </View>
          </View>

          {/* Obsidian (Not Connected - Large Feature Card) */}
          <View className="w-full md:w-[65%] lg:w-[66%] bg-white/70 p-6 rounded-[24px] shadow-sm border border-white flex-col md:flex-row gap-6 items-center overflow-hidden relative">
            <View className="flex-1 flex-col z-10 w-full">
              <View className="w-14 h-14 bg-white rounded-2xl items-center justify-center shadow-sm mb-6">
                <Image source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCkD4Fxq6T5Tq5ez-sXJt6-8jFYK16o7mgC1H6CvnYkcjUUWvh3H9aho1l1F2eM-k4Hy2gMSpQuxcF5JMp1v-2j5vF1zDsDZ19Ur59Gcc4fW5rS6ugmTxny0M0ozztQY2xnoNUZjhbTTe-8hA6PzmZQdGMXCBjfh4dOm-iIHSTOvQYydb2rI3I70dy_0BG0WWG70FFhMcPCAtXL_2Zh_-HCHAJm108HAzqN1WUozoSye1g5nbV_RTQ0lwy7Vh2m4pMYxhXoyuONFOo' }} className="w-8 h-8" resizeMode="contain" />
              </View>
              <Text className="font-headline-md text-3xl text-on-surface font-bold mb-4">Obsidian</Text>
              <Text className="font-body-md text-base text-on-surface-variant mb-6 pr-4">
                Import your entire local vault. We support WikiLinks, Backlinks, and even your custom canvas layouts.
              </Text>
              <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="h-12 px-8 bg-primary rounded-xl items-center justify-center self-start">
                <Text className="text-white font-medium text-base">Connect Vault</Text>
              </TouchableOpacity>
            </View>
            <View className="flex-1 w-full h-48 md:h-full relative min-h-[200px] bg-surface-container-high/50 rounded-xl">
              {/* Abstract visualization placeholder */}
            </View>
          </View>
          </View>

        {/* AI Sync Progress Section */}
        <View className="mt-12 p-6 md:p-8 bg-primary-container rounded-[32px] overflow-hidden flex-col md:flex-row justify-between items-center gap-8">
          <View className="max-w-xl flex-col w-full z-10">
            <View className="flex-row items-center gap-2 mb-4">
              <MaterialIcons name="auto-awesome" size={20} color={colors['on-primary-container']} />
              <Text className="font-label-xs text-xs uppercase tracking-widest font-bold text-on-primary-container">AI Intelligence Layer</Text>
            </View>
            <Text className="font-headline-md text-3xl font-bold text-white mb-4">Indexing your digital life</Text>
            <Text className="font-body-md text-base text-on-primary-container mb-6 leading-relaxed">
              Our neural engine is currently processing your connected sources to build a semantic map of your knowledge. This allows for natural language recall and cross-platform insights.
            </Text>
            
            <View className="w-full bg-white/10 h-2 rounded-full overflow-hidden mb-2">
              <View className="bg-secondary-fixed h-full w-[68%]" />
            </View>
            <View className="flex-row justify-between">
              <Text className="font-label-xs text-xs text-on-primary-container">32,492 entities processed</Text>
              <Text className="font-label-xs text-xs text-on-primary-container">68% Complete</Text>
            </View>
          </View>
          <View className="w-48 h-48 items-center justify-center bg-primary/20 rounded-full border border-primary/30 shrink-0">
            <MaterialIcons name="schema" size={80} color={colors['on-primary-container']} />
          </View>
        </View>

      </View>
    </Screen>
  );
}
