import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Screen, AIBentoCard } from '../../src/shared/components';
import { colors } from '../../src/shared/theme/colors';
import { useRouter } from 'expo-router';

export default function ProjectProfile() {
  const router = useRouter();

  return (
    <Screen scrollable={true}>
      {/* Top Navigation */}
      <View className="fixed top-0 w-full z-50 bg-surface/80 h-20 flex-row justify-between items-center px-margin-mobile">
        <View className="flex-row items-center gap-sm">
          <TouchableOpacity 
            className="p-2 rounded-full "
            onPress={() => router.back()}
          >
            <MaterialIcons name="arrow-back" size={24} color={colors['on-surface-variant']} />
          </TouchableOpacity>
          <MaterialIcons name="memory" size={28} color={colors.primary} />
          <Text className="font-display-lg-mobile text-[36px] font-bold text-primary tracking-tight">YRecall</Text>
        </View>
        <View className="flex-row items-center gap-4">
          <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="w-10 h-10 rounded-full items-center justify-center bg-surface-container-highest">
            <MaterialIcons name="notifications" size={24} color={colors['on-surface-variant']} />
          </TouchableOpacity>
        </View>
      </View>

      <View className="px-margin-mobile pt-6 pb-32">
        {/* Hero: Project Status & Progress */}
        <View className="mb-xl">
          <View className="flex-col md:flex-row md:items-end justify-between gap-md mb-lg">
            <View>
              <View className="flex-row items-center gap-2 mb-2">
                <View className="px-3 py-1 bg-secondary-container rounded-full">
                  <Text className="text-on-secondary-container text-label-xs font-bold uppercase tracking-wider">In Progress</Text>
                </View>
                <Text className="text-on-surface-variant text-body-md">Redesign Project: Q3</Text>
              </View>
              <Text className="font-headline-md text-[32px] text-primary font-bold">Unified Experience Overhaul</Text>
            </View>
            <View className="flex-col gap-2 mt-4 md:mt-0 w-full md:w-64">
              <View className="flex-row justify-between w-full">
                <Text className="text-label-xs font-bold text-on-surface-variant uppercase">Project Completion</Text>
                <Text className="font-bold text-primary text-label-xs">68%</Text>
              </View>
              <View className="w-full h-3 bg-surface-container-high rounded-full overflow-hidden">
                <View className="h-full bg-primary w-[68%] rounded-full" />
              </View>
            </View>
          </View>
        </View>

        {/* Bento Grid Layout */}
        <View className="flex-col gap-lg">
          <AIBentoCard title="AI Status Summary">
            <Text className="text-body-md text-on-surface-variant leading-relaxed mb-4">
              Based on recent <Text className="font-bold text-primary">Design Reviews (Aug 14)</Text> and <Text className="font-bold text-primary">Brainstorming Session #4</Text>, the project has shifted focus towards mobile-first navigation. Technical debt in the legacy CSS framework was identified as a primary blocker, but the core design system tokens are now successfully integrated into the staging environment.
            </Text>
            <View className="flex-row flex-wrap gap-2">
              <View className="px-3 py-1.5 bg-secondary/10 rounded-full flex-row items-center gap-1">
                <MaterialIcons name="psychology" size={14} color={colors.secondary} />
                <Text className="text-secondary text-label-xs font-bold uppercase">Recall: "Mobile-first priority"</Text>
              </View>
              <View className="px-3 py-1.5 bg-secondary/10 rounded-full flex-row items-center gap-1">
                <MaterialIcons name="history" size={14} color={colors.secondary} />
                <Text className="text-secondary text-label-xs font-bold uppercase">Memory: "Design Review #3"</Text>
              </View>
              </View>
          </AIBentoCard>

          {/* Team Section (Small Card) */}
          <View className="bg-white rounded-[24px] p-lg shadow-sm border border-surface-container-highest flex-col justify-between">
            <View>
              <Text className="font-title-sm text-primary font-bold text-lg mb-4">Project Team</Text>
              <View className="flex-col gap-4">
                <View className="flex-row items-center gap-4">
                  <View className="w-10 h-10 rounded-full overflow-hidden bg-surface-container">
                    <Image source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA3B7c8ckQ2rfDrF44Hs9CN9-324SqvUTB-U-T6y92rMBBjJDPtmjKehSdruub6y2H1X6pwfM0lPoK6qhszeRIZ7Bow3xkOe2DJf5u4RFX5oit3X5uq4shkk9SlXQy6vToXWNNYWr4NXVGziHU7AINIvKpNgy5sAFFBOCXDbPHKjClFRvE7fLoWCF370UjoPD9bZQ9NrRhYBamKZylb63FJVhTZxdO_Ybcv5z2qSKaH6iELrY9MSRczR-zgTD5gakCrrGvamMHiqyA' }} className="w-full h-full" />
                  </View>
                  <View>
                    <Text className="font-bold text-on-surface">Alex Rivera</Text>
                    <Text className="text-caption-sm text-on-surface-variant">Lead Designer</Text>
                  </View>
                </View>
                <View className="flex-row items-center gap-4">
                  <View className="w-10 h-10 rounded-full overflow-hidden bg-surface-container">
                    <Image source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDP2YqQzAr6lItDduSHHvMd9O55Ff8kiJd1Vow2qEzQgqlE5ynaboNKOFOvGPfZidhhjuzxGiH_592iBjv3Ug7InObV2-Gtw3btxOm1sx1H1dGAWXEfh_XvD3pS4P5qWla2mL6TKKzJywPiCzC-k4N7sws3u3WJwT9CrCebG6vsYHeT9bzWu7I9cS97UDKc4nhIlBYtrLwpo_Z7fVr-fk3fDcoLZIvYHA3IzerLgvX2cnGSwTzQTA-Vt6J7NwTyr6DuSdnzKfw4gXQ' }} className="w-full h-full" />
                  </View>
                  <View>
                    <Text className="font-bold text-on-surface">Jordan Chen</Text>
                    <Text className="text-caption-sm text-on-surface-variant">Tech Lead</Text>
                  </View>
                </View>
              </View>
            </View>
            <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="w-full mt-6 py-3 bg-surface-container-high rounded-full items-center">
              <Text className="text-on-surface font-bold text-xs uppercase tracking-wider">Manage Team</Text>
            </TouchableOpacity>
          </View>

          {/* Key Milestones (Tall Card) */}
          <View className="bg-white rounded-[24px] p-lg shadow-sm border border-surface-container-highest">
            <Text className="font-title-sm text-primary font-bold text-lg mb-6">Key Milestones</Text>
            <View className="flex-col gap-6 relative">
               {/* Vertical Line */}
               <View className="absolute left-[7px] top-4 bottom-0 w-0.5 bg-surface-container-high" />
               
               <View className="relative pl-8">
                 <View className="absolute left-0 top-1 w-4 h-4 rounded-full bg-primary border-[4px] border-primary/20 z-10" />
                 <Text className="text-label-xs text-primary font-bold uppercase mb-1">July 22</Text>
                 <Text className="font-bold text-on-surface mb-1">Conceptual Design Sign-off</Text>
                 <Text className="text-caption-sm text-on-surface-variant">Completed after 3 rounds of review.</Text>
               </View>

               <View className="relative pl-8">
                 <View className="absolute left-0 top-1 w-4 h-4 rounded-full bg-secondary-container border-2 border-primary z-10" />
                 <Text className="text-label-xs text-on-surface-variant font-bold uppercase mb-1">Aug 28</Text>
                 <Text className="font-bold text-on-surface mb-1">Interactive Prototype</Text>
                 <Text className="text-caption-sm text-on-surface-variant">Currently in final polishing phase.</Text>
               </View>

               <View className="relative pl-8">
                 <View className="absolute left-0 top-1 w-4 h-4 rounded-full bg-surface-container-highest border-2 border-outline z-10" />
                 <Text className="text-label-xs text-on-surface-variant font-bold uppercase mb-1">Sep 15</Text>
                 <Text className="font-bold text-on-surface mb-1">Beta User Testing</Text>
                 <Text className="text-caption-sm text-on-surface-variant">Scheduled with internal groups.</Text>
               </View>
            </View>
          </View>

          {/* Related Resources */}
          <View className="bg-white rounded-[24px] p-lg shadow-sm border border-surface-container-highest">
            <Text className="font-title-sm text-primary font-bold text-lg mb-4">Related Resources</Text>
            <View className="flex-col gap-2">
              <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="flex-row items-center gap-4 p-3 rounded-xl border border-outline-variant/30 ">
                <MaterialIcons name="description" size={24} color={colors.primary} />
                <View className="flex-1">
                  <Text className="font-bold text-on-surface">PRD_v2_Final.pdf</Text>
                  <Text className="text-caption-sm text-on-surface-variant">Project Requirements</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="flex-row items-center gap-4 p-3 rounded-xl border border-outline-variant/30 ">
                <MaterialIcons name="table-chart" size={24} color={colors.secondary} />
                <View className="flex-1">
                  <Text className="font-bold text-on-surface">Budget_Q3.xlsx</Text>
                  <Text className="text-caption-sm text-on-surface-variant">Resource Allocation</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="flex-row items-center gap-4 p-3 rounded-xl border border-outline-variant/30 ">
                <MaterialIcons name="link" size={24} color={colors.primary} />
                <View className="flex-1">
                  <Text className="font-bold text-on-surface">Figma Design System</Text>
                  <Text className="text-caption-sm text-on-surface-variant">Main Library</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="flex-row items-center gap-4 p-3 rounded-xl border border-outline-variant/30 ">
                <MaterialIcons name="folder-open" size={24} color={colors['on-surface-variant']} />
                <View className="flex-1">
                  <Text className="font-bold text-on-surface">Asset_Package.zip</Text>
                  <Text className="text-caption-sm text-on-surface-variant">Exported SVGs</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Connected Memories Card */}
          <View className="bg-primary rounded-[24px] p-lg shadow-sm">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="font-title-sm text-white font-bold text-lg">Connected Memories</Text>
              <MaterialIcons name="psychology" size={24} color={colors['on-primary-container']} />
            </View>
            <View className="flex-col gap-2">
              <View className="bg-primary-container p-4 rounded-xl border border-on-primary-container/20">
                <Text className="text-white italic opacity-90">"We should simplify the hero section to emphasize the AI output more than the controls."</Text>
                <Text className="mt-2 text-caption-sm text-on-primary-container">— Design Review (Aug 04)</Text>
              </View>
              <View className="bg-primary-container p-4 rounded-xl border border-on-primary-container/20">
                <Text className="text-white italic opacity-90">"Can the progress bar be dynamic based on Jira tickets?"</Text>
                <Text className="mt-2 text-caption-sm text-on-primary-container">— Sprint Planning (July 20)</Text>
              </View>
            </View>
          </View>

        </View>
      </View>
    </Screen>
  );
}
