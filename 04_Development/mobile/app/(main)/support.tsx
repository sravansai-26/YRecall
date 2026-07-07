import { View, Text, ScrollView, TouchableOpacity, TextInput, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Screen } from '../../src/shared/components';
import { colors } from '../../src/shared/theme/colors';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';

export default function SupportHub() {
  const router = useRouter();
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    if (expandedFaq === index) {
      setExpandedFaq(null);
    } else {
      setExpandedFaq(index);
    }
  };

  return (
    <Screen scrollable={true} className="pb-24 bg-[#FCFAF7]">
      {/* TopAppBar */}
      <View className="w-full sticky top-0 z-50 bg-surface flex-row items-center justify-between px-margin-mobile md:px-margin-desktop h-16 shadow-sm border-b border-outline-variant/30">
        <View className="flex-row items-center gap-4">
          <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2 rounded-full ">
            <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
          </TouchableOpacity>
          <View className="w-8 h-8 rounded-full bg-primary items-center justify-center">
            <MaterialIcons name="psychology" size={20} color="#ffffff" />
          </View>
          <Text className="font-headline-md text-xl font-bold text-primary">YRecall Support</Text>
        </View>
      </View>

      <View className="max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop py-12 flex-col gap-8 w-full">
        
        {/* Hero Search Section */}
        <View className="w-full max-w-2xl mx-auto flex-col items-center mb-8">
          <Text className="font-headline-md text-3xl md:text-4xl font-bold text-primary mb-6">How can we help you?</Text>
          <View className="relative w-full mb-6">
            <View className="absolute left-4 top-4 z-10">
              <MaterialIcons name="search" size={24} color={colors.outline} />
            </View>
            <TextInput 
              placeholder="Search tutorials, FAQs, or features..."
              className="w-full h-14 pl-12 pr-4 bg-surface rounded-xl border border-[#D1CDC7] font-body-md text-base text-on-surface shadow-sm "
              placeholderTextColor={colors.outline}
            />
          </View>
          <View className="flex-row flex-wrap justify-center gap-2">
            <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="px-3 py-1.5 bg-secondary-container/20 rounded-full border border-secondary-container/30">
              <Text className="font-label-caps text-xs text-on-secondary-container font-medium">Knowledge Graph</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="px-3 py-1.5 bg-secondary-container/20 rounded-full border border-secondary-container/30">
              <Text className="font-label-caps text-xs text-on-secondary-container font-medium">Privacy Mode</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="px-3 py-1.5 bg-secondary-container/20 rounded-full border border-secondary-container/30">
              <Text className="font-label-caps text-xs text-on-secondary-container font-medium">Exporting Data</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="flex-col md:flex-row gap-8">
          
          {/* Left Column: Tutorials & FAQs */}
          <View className="flex-[2] flex-col gap-8">
            
            {/* Tutorials Bento */}
            <View className="bg-white rounded-[24px] p-6 shadow-sm border border-[#006e6e]/20 flex-col">
              <View className="flex-row justify-between items-center mb-6">
                <Text className="font-title-sm text-xl font-bold text-primary">Mastering YRecall</Text>
                <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="flex-row items-center gap-1 ">
                  <Text className="text-on-secondary-container text-xs font-bold">View all</Text>
                  <MaterialIcons name="arrow-forward" size={16} color={colors['on-secondary-container']} />
                </TouchableOpacity>
              </View>

              <View className="flex-col sm:flex-row gap-4">
                {/* Tutorial Card 1 */}
                <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="flex-1 flex-col group ">
                  <View className="w-full aspect-video rounded-xl overflow-hidden mb-2 relative bg-surface-container-high items-center justify-center">
                     <Image source={{ uri: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=400&auto=format&fit=crop' }} className="absolute inset-0 w-full h-full opacity-80" />
                     <View className="w-12 h-12 rounded-full bg-primary/80 items-center justify-center">
                        <MaterialIcons name="play-arrow" size={24} color="#ffffff" />
                     </View>
                  </View>
                  <Text className="font-bold text-base text-primary mb-1">Understanding your Knowledge Graph</Text>
                  <Text className="text-xs text-outline">4 min • Beginner</Text>
                </TouchableOpacity>

                {/* Tutorial Card 2 */}
                <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="flex-1 flex-col group ">
                  <View className="w-full aspect-video rounded-xl overflow-hidden mb-2 relative bg-surface-container-high items-center justify-center">
                     <Image source={{ uri: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=400&auto=format&fit=crop' }} className="absolute inset-0 w-full h-full opacity-80" />
                     <View className="w-12 h-12 rounded-full bg-primary/80 items-center justify-center">
                        <MaterialIcons name="play-arrow" size={24} color="#ffffff" />
                     </View>
                  </View>
                  <Text className="font-bold text-base text-primary mb-1">Setting up Proactive Notifications</Text>
                  <Text className="text-xs text-outline">6 min • Intermediate</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* FAQs Accordion */}
            <View className="bg-white rounded-[24px] p-6 shadow-sm border border-outline-variant/30 flex-col">
              <Text className="font-title-sm text-xl font-bold text-primary mb-6">Frequently Asked Questions</Text>
              
              <View className="flex-col">
                {/* FAQ 1 */}
                <View className="border-b border-surface-variant pb-2 mb-2">
                  <TouchableOpacity onPress={() => toggleFaq(0)} className="w-full flex-row justify-between items-center py-2 ">
                    <Text className="font-medium text-base text-on-surface">How secure is my personal recall data?</Text>
                    <MaterialIcons name={expandedFaq === 0 ? "expand-less" : "expand-more"} size={24} color={colors['on-surface']} />
                  </TouchableOpacity>
                  {expandedFaq === 0 && (
                    <Text className="pt-2 pb-2 text-on-surface-variant text-base leading-relaxed">
                      We use end-to-end encryption for all synced data. Your 'Mind' is stored locally by default, only syncing to our secure nodes if you explicitly enable Proactive AI services.
                    </Text>
                  )}
                </View>

                {/* FAQ 2 */}
                <View className="border-b border-surface-variant pb-2 mb-2">
                  <TouchableOpacity onPress={() => toggleFaq(1)} className="w-full flex-row justify-between items-center py-2 ">
                    <Text className="font-medium text-base text-on-surface">Can I export my Knowledge Graph to other apps?</Text>
                    <MaterialIcons name={expandedFaq === 1 ? "expand-less" : "expand-more"} size={24} color={colors['on-surface']} />
                  </TouchableOpacity>
                  {expandedFaq === 1 && (
                    <Text className="pt-2 pb-2 text-on-surface-variant text-base leading-relaxed">
                      Yes, YRecall supports standard JSON and Markdown exports. Visit Settings {'>'} Data Privacy to initiate a full archive export at any time.
                    </Text>
                  )}
                </View>

                {/* FAQ 3 */}
                <View className="border-b border-surface-variant pb-2">
                  <TouchableOpacity onPress={() => toggleFaq(2)} className="w-full flex-row justify-between items-center py-2 ">
                    <Text className="font-medium text-base text-on-surface">What is the difference between Timeline and History?</Text>
                    <MaterialIcons name={expandedFaq === 2 ? "expand-less" : "expand-more"} size={24} color={colors['on-surface']} />
                  </TouchableOpacity>
                  {expandedFaq === 2 && (
                    <Text className="pt-2 pb-2 text-on-surface-variant text-base leading-relaxed">
                      History is a raw log of inputs, while Timeline uses AI to synthesize events into meaningful contexts and narratives about your daily life.
                    </Text>
                  )}
                </View>
              </View>
            </View>
          </View>

          {/* Right Column: Contact & Bug Report */}
          <View className="flex-[1] flex-col gap-8 min-w-[300px]">
            
            {/* Contact Support */}
            <View className="bg-primary rounded-[24px] p-6 shadow-sm flex-col">
              <Text className="font-title-sm text-xl font-bold text-white mb-3">Need Human Help?</Text>
              <Text className="text-white/80 text-base mb-6 leading-relaxed">Our support team is available 24/7 for Enterprise users and 9-5 for Personal users.</Text>
              <View className="flex-col gap-3">
                <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="w-full h-14 bg-surface rounded-xl flex-row items-center justify-center gap-2 ">
                  <MaterialIcons name="chat-bubble" size={20} color={colors.primary} />
                  <Text className="font-bold text-primary text-base">Start Live Chat</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="w-full h-14 border border-white/30 rounded-xl flex-row items-center justify-center gap-2 ">
                  <MaterialIcons name="mail" size={20} color="#ffffff" />
                  <Text className="font-bold text-white text-base">Email Support</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Report a Bug */}
            <View className="bg-white rounded-[24px] p-6 shadow-sm border border-[#006e6e]/20 flex-col">
              <View className="flex-row items-center gap-2 mb-4">
                <MaterialIcons name="bug-report" size={24} color={colors.error} />
                <Text className="font-title-sm text-xl font-bold text-primary">Report a Bug</Text>
              </View>
              
              <View className="flex-col gap-4">
                <View className="flex-col gap-1">
                  <Text className="text-xs font-bold text-outline uppercase tracking-widest">Issue Category</Text>
                  <View className="w-full h-12 bg-surface border border-[#D1CDC7] rounded-lg px-3 justify-center">
                    <Text className="text-on-surface">Interface Glitch</Text>
                  </View>
                </View>

                <View className="flex-col gap-1">
                  <Text className="text-xs font-bold text-outline uppercase tracking-widest">Description</Text>
                  <TextInput 
                    className="w-full h-24 bg-surface border border-[#D1CDC7] rounded-lg p-3 text-on-surface font-body-md"
                    placeholder="What happened?"
                    multiline
                    textAlignVertical="top"
                    placeholderTextColor={colors.outline}
                  />
                </View>

                <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="w-full h-12 bg-primary-container rounded-lg items-center justify-center ">
                  <Text className="font-bold text-on-primary-container text-base">Submit Report</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Community Help */}
            <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="bg-white rounded-[24px] p-6 shadow-sm flex-row items-center justify-between  border border-outline-variant/30">
              <View className="flex-col">
                <Text className="font-bold text-primary text-base">Community Forum</Text>
                <Text className="text-xs text-outline">Learn from other YRecall users</Text>
              </View>
              <MaterialIcons name="forum" size={24} color={colors['on-secondary-container']} />
            </TouchableOpacity>

          </View>

        </View>
      </View>
    </Screen>
  );
}
