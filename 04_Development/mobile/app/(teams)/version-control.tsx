import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Screen, Button } from '../../src/shared/components';
import { colors } from '../../src/shared/theme/colors';
import { useRouter } from 'expo-router';
import React from 'react';

export default function VersionControl() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Top Navigation */}
      <View className="w-full top-0 z-50 bg-surface-container border-b border-outline-variant/10 shadow-sm h-16 px-4 flex-row justify-between items-center">
        <View className="flex-row items-center gap-4">
          <TouchableOpacity onPress={() => router.back()} className="flex-row items-center gap-2">
            <MaterialIcons name="hub" size={24} color={colors.primary} />
            <Text className="font-headline-md text-2xl font-bold text-primary">YRecall Teams</Text>
          </TouchableOpacity>
        </View>
        <View className="hidden md:flex-row items-center gap-8">
          <View className="flex-row gap-6">
            <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')}><Text className="text-primary font-bold">Conflicts</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')}><Text className="text-on-surface-variant ">Graph</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')}><Text className="text-on-surface-variant ">Library</Text></TouchableOpacity>
          </View>
          <View className="flex-row items-center gap-2 px-3 py-1 bg-surface-bright rounded-full border border-outline-variant/20">
            <View className="w-2 h-2 rounded-full bg-secondary" />
            <Text className="font-label-xs uppercase text-on-surface-variant">Presence</Text>
          </View>
        </View>
        <View className="flex-row items-center gap-3">
          <View className="relative">
            <Image source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCeyvt_2RQ1DwTiTW9AverwnHOw0uAOeU0RPvG0VSwHw-iqWS7duPW-6bdMTDjYBxq38MVGA50dkkKAD-wWMX1QhW1m_V6ENcpd5-k5TpjNLweZ4eIz8jS7v0SfuPh2r2FOZ2gIIQctHe2dH_Ljt6a7KqaH7MQ4l8AvPdIeiC1An1vH7i35wG7AC0mrxLH4xm0ni6tpWB4UFGCGD_8jeezSNOg48nmdz8fjwOqFo1H2TlF5wTl6pCe3WP9FHf655hddQ-9dLsg82oI' }} className="w-8 h-8 rounded-full border-2 border-secondary object-cover" />
            <View className="absolute bottom-0 right-0 w-3 h-3 bg-secondary border-2 border-surface-container rounded-full" />
          </View>
        </View>
      </View>

      <View className="flex-1 flex-row">
        
        {/* Navigation Drawer (Sidebar) */}
        <View className="hidden lg:flex w-[280px] bg-surface-container-low border-r border-outline-variant/10 p-3 flex-col gap-1">
          <View className="flex-row items-center gap-3 mb-8 p-3 bg-surface-container rounded-xl">
            <Image source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDhUFhRmeh_Clm_vLgaQ6GaRi-PmGCTKmovRcIvK7kLCA--D2Vpscn_t-mEWK1UBPtyyXokhzpIfO6O3FILjs5mWq9aszzNZB9Lj6_NfSMsOiCQusB8dDc_GsYfE5xy6jLkEPbcfDR5cC_2UKEvohgpy2BR9Vde6tv3f32UNtqsTgfclP68l8c6O2LP-cWtH15yRQ3O8q09GkQMVcWfDSuVkk1YVe1kHraJ8dc1MGm8rKuMLwaL4TS8PuhkAusDovlsb6zfFa4EPA8' }} className="w-10 h-10 rounded-lg object-cover" />
            <View>
              <Text className="font-headline-sm font-bold text-primary">Engineering Alpha</Text>
              <Text className="text-body-sm text-on-surface-variant">12 Active Members</Text>
            </View>
          </View>

          <View className="flex-col gap-1">
            <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="flex-row items-center gap-3 px-4 py-3 text-on-surface-variant rounded-xl ">
              <MaterialIcons name="cloud-sync" size={20} color={colors['on-surface-variant']} />
              <Text className="font-body-md text-on-surface-variant">Shared Space</Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="flex-row items-center gap-3 px-4 py-3 bg-primary rounded-xl">
              <MaterialIcons name="person-search" size={20} color="#ffffff" />
              <Text className="font-body-md text-white">Conflict Resolver</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="flex-row items-center gap-3 px-4 py-3 text-on-surface-variant rounded-xl ">
              <MaterialIcons name="psychology" size={20} color={colors['on-surface-variant']} />
              <Text className="font-body-md text-on-surface-variant">AI Insights</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="flex-row items-center gap-3 px-4 py-3 text-on-surface-variant rounded-xl ">
              <MaterialIcons name="inventory-2" size={20} color={colors['on-surface-variant']} />
              <Text className="font-body-md text-on-surface-variant">Archive</Text>
            </TouchableOpacity>
          </View>

          <View className="mt-auto p-4 bg-white/80 rounded-xl border border-primary/10">
            <View className="flex-row items-center gap-2 mb-2">
              <MaterialIcons name="auto-awesome" size={14} color={colors['on-secondary-container']} />
              <Text className="font-label-xs text-[10px] uppercase text-on-secondary-container">AI Synchronized</Text>
            </View>
            <Text className="text-body-sm text-on-surface-variant leading-tight">Graph integrity verified at 09:42 AM.</Text>
          </View>
        </View>

        {/* Main Content Area */}
        <ScrollView className="flex-1 bg-surface" contentContainerStyle={{ padding: 24, paddingBottom: 80 }}>
          <View className="max-w-[1200px] mx-auto w-full">
            
            {/* Conflict Detection Alert Banner */}
            <View className="bg-error-container p-6 rounded-xl flex-col md:flex-row md:items-center justify-between gap-4 border-l-4 border-error mb-8">
              <View className="flex-row items-start gap-4">
                <View className="bg-white/30 p-2 rounded-full">
                  <MaterialIcons name="warning" size={24} color={colors['on-error-container']} />
                </View>
                <View className="flex-1">
                  <Text className="font-headline-sm text-xl font-bold text-on-error-container">3 Semantic Divergences detected</Text>
                  <Text className="font-body-md text-on-error-container mt-1 opacity-90">Project Nova: Inconsistent property values found in "Carbon Capture Module V2".</Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="bg-primary px-6 py-2 rounded-full">
                <Text className="text-white font-label-xs uppercase">Review All</Text>
              </TouchableOpacity>
            </View>

            <View className="flex-col xl:flex-row gap-8">
              
              {/* Left: Comparison View */}
              <View className="flex-[2] flex-col gap-6">
                <View className="flex-row items-center justify-between mb-2">
                  <View className="flex-row items-center gap-2">
                    <MaterialIcons name="difference" size={24} color={colors.primary} />
                    <Text className="font-headline-sm text-xl text-primary font-bold">Node Divergence: Deployment Timeline</Text>
                  </View>
                  <View className="px-3 py-1 bg-surface-container-highest border border-outline-variant/30 rounded">
                    <Text className="text-xs text-primary font-mono">ID: N-402-DELTA</Text>
                  </View>
                </View>

                {/* Side-by-Side Comparison */}
                <View className="flex-col md:flex-row gap-6">
                  
                  {/* Version A */}
                  <View className="flex-1 bg-white/80 rounded-xl overflow-hidden border border-primary/10 flex-col">
                    <View className="bg-surface-container-high p-4 border-b border-outline-variant/10 flex-row items-center justify-between">
                      <View className="flex-row items-center gap-3">
                        <Image source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDjyS9R7UKfv7JZMaWWRmqjXEQ2KQA_0YjVeHYeoARnG54tQc5_zZCZ085BOz6D-2lgoCFx7cpevzYYwYKDruJnxaX1fyvNh0Gr0xbUBA6clVnT0FLTA3XDrcAwfgT6KlIry1ngfjCMZgVaURxcca2ZUBZysUxbitGvvmo5TBbLVpVr3UyGF2xNCF5E3FhbUeflVcWyKjJz9Ezy-flLP4oBb2ylfLKX3um9sWANNMc7PLU59aB3LOkvOfC1F9Oh348k1M0zysFMB38' }} className="w-8 h-8 rounded-full object-cover" />
                        <View>
                          <Text className="font-label-xs text-on-surface uppercase">Alex R.</Text>
                          <Text className="text-[10px] text-on-surface-variant uppercase">Proposed: 2h ago</Text>
                        </View>
                      </View>
                      <View className="px-2 py-0.5 bg-secondary/10 border border-secondary/20 rounded">
                        <Text className="text-[10px] font-bold text-secondary uppercase">VERSION A</Text>
                      </View>
                    </View>
                    <View className="p-6 flex-1 gap-4">
                      <View className="p-4 bg-white border border-outline-variant/10 rounded-lg">
                        <Text className="text-on-surface-variant font-label-xs text-xs mb-2 uppercase">PHASE 1: PROTOTYPE</Text>
                        <Text className="text-body-md text-on-surface">Development phase is scheduled to conclude in <Text className="bg-error/10 line-through text-error">Q3 2024</Text>.</Text>
                        <Text className="text-body-md text-on-surface mt-2">Hardware stress tests indicate a requirement for <Text className="bg-error/10 line-through text-error">12kw</Text> base power.</Text>
                      </View>
                      <View className="p-4 bg-white border border-outline-variant/10 rounded-lg opacity-60">
                        <Text className="text-on-surface-variant font-label-xs text-xs mb-2 uppercase">PHASE 2: PILOT</Text>
                        <Text className="text-body-md text-on-surface">Awaiting stakeholder approval for regional expansion.</Text>
                      </View>
                    </View>
                    <View className="p-4 bg-surface-container-low border-t border-outline-variant/10 items-center">
                      <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="w-full py-2 bg-white border border-primary rounded-lg items-center">
                        <Text className="text-primary font-label-xs uppercase">Keep Version A</Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Version B */}
                  <View className="flex-1 bg-white/80 rounded-xl overflow-hidden border-2 border-secondary/30 flex-col shadow-sm">
                    <View className="bg-secondary-container p-4 border-b border-outline-variant/10 flex-row items-center justify-between">
                      <View className="flex-row items-center gap-3">
                        <Image source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBiQXuuuKl3kh14gSu3acLv0qyFN31A8qlRlg5Z5H7M_9x36Qf5iCIdBh7xUtw_WNt1Qq42Rzf2HbOTf-AIufXlppgG3fAYo7OzgoOdqx4HehJrzs2uNTIkxBMe1pl_JFsgfPdVI_X_fitnIfZHj38jtK2eyycE9dI2-N7UvUKHPaYtLc5tlEuHyjDtQqYEvObD9Kjb6Uc3GbEGh37ANiPMoJPCznyTnzDI8F2ciznA9lmp94TpIbd9GRLNMZWeA4gz96UsG5ZfKn4' }} className="w-8 h-8 rounded-full object-cover" />
                        <View>
                          <Text className="font-label-xs text-on-secondary-container uppercase">Sarah J.</Text>
                          <Text className="text-[10px] text-on-secondary-container/80 uppercase">Proposed: 45m ago</Text>
                        </View>
                      </View>
                      <View className="px-2 py-0.5 bg-primary rounded">
                        <Text className="text-[10px] font-bold text-white uppercase">VERSION B</Text>
                      </View>
                    </View>
                    <View className="p-6 flex-1 gap-4">
                      <View className="p-4 bg-white border border-secondary/20 rounded-lg">
                        <Text className="text-on-surface-variant font-label-xs text-xs mb-2 uppercase">PHASE 1: PROTOTYPE</Text>
                        <Text className="text-body-md text-on-surface">Development phase is scheduled to conclude in <Text className="bg-[#90efef]/30 font-bold text-secondary">Q4 2024</Text>.</Text>
                        <Text className="text-body-md text-on-surface mt-2">Hardware stress tests indicate a requirement for <Text className="bg-[#90efef]/30 font-bold text-secondary">15.5kw</Text> base power.</Text>
                      </View>
                      <View className="p-4 bg-white border border-outline-variant/10 rounded-lg">
                        <Text className="text-on-surface-variant font-label-xs text-xs mb-2 uppercase">PHASE 2: PILOT</Text>
                        <Text className="text-body-md text-on-surface">Updated: Stakeholder approval secured for <Text className="bg-[#90efef]/30 font-bold text-secondary">North Atlantic cluster</Text>.</Text>
                      </View>
                    </View>
                    <View className="p-4 bg-surface-container-low border-t border-outline-variant/10 items-center">
                      <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="w-full py-2 bg-primary rounded-lg items-center">
                        <Text className="text-white font-label-xs uppercase">Keep Version B</Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                </View>

                {/* Central Actions */}
                <View className="flex-row flex-wrap items-center justify-center gap-4 py-6 border-y border-outline-variant/10">
                  <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="flex-row items-center gap-2 px-8 py-3 bg-primary rounded-xl">
                    <MaterialIcons name="call-merge" size={20} color="#ffffff" />
                    <Text className="text-white font-bold">Merge Versions</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="flex-row items-center gap-2 px-6 py-3 border border-primary rounded-xl">
                    <MaterialIcons name="forum" size={20} color={colors.primary} />
                    <Text className="text-primary font-bold">Open Discussion</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Right: Intelligence & History */}
              <View className="flex-1 flex-col gap-6">
                
                {/* AI Suggestion Card */}
                <View className="bg-white/80 rounded-xl p-6 relative overflow-hidden border border-primary/10">
                  <View className="absolute top-0 left-0 w-1 h-full bg-secondary" />
                  <View className="flex-row items-center gap-2 mb-4">
                    <MaterialIcons name="smart-toy" size={20} color={colors.secondary} />
                    <Text className="font-label-xs text-secondary uppercase tracking-widest">AI Insight</Text>
                  </View>
                  <Text className="text-body-md text-on-surface leading-relaxed italic mb-4">
                    "The divergence in power requirements stems from Sarah J.'s recent integration of the Cryo-Processor logs. Version B reflects more accurate real-world telemetry."
                  </Text>
                  <View className="p-3 bg-secondary/5 rounded-lg border border-secondary/10 mb-4">
                    <Text className="text-[11px] text-on-surface-variant font-mono">Recommendation: Adopt Version B for electrical specs, Merge Version A for phrasing on Phase 1 timeline.</Text>
                  </View>
                  <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="items-center">
                    <Text className="text-secondary font-label-xs text-[10px] uppercase">View Technical Trace</Text>
                  </TouchableOpacity>
                </View>

                {/* Version Control History Timeline */}
                <View className="bg-white/80 rounded-xl p-6 border border-primary/10">
                  <View className="flex-row items-center gap-2 mb-6">
                    <MaterialIcons name="history" size={20} color={colors.primary} />
                    <Text className="font-headline-sm font-bold text-primary">Edit Timeline</Text>
                  </View>

                  <View className="flex-col gap-6 relative pl-3 border-l-2 border-outline-variant/30">
                    
                    <View className="relative">
                      <View className="absolute -left-[19px] top-1 w-3 h-3 rounded-full bg-secondary border-2 border-white" />
                      <Text className="text-xs font-label-xs text-on-surface-variant uppercase">OCT 14, 08:52 AM</Text>
                      <View className="flex-row items-center gap-2 mt-1">
                        <Image source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAvBwKvWVckXB5SLhqEog5aq69dXlSrrDDd6x98xzV6ecQiNq9lYFb2vp3j8ax11SX5F4zaMY_T0jgGq5x7Vfua8oR30tP02VSZ5dKRGE3y9s8Fnx_AidWsoqm52kCAtwbPxch_-v7V8gAFLiWgrrX3RnZA00eFJqACGR2eFdOplP0LuKvDv22TjLGjGiEXF8bemmUX70qGW5sB_zAqifBdPLh2c0tLFfUQdqZu6fcgmEZkXAYu41NnmkSNDxzEt9eO8Z2S-jOdhfw' }} className="w-5 h-5 rounded-full" />
                        <Text className="text-sm font-bold text-on-surface">Sarah J. <Text className="font-normal text-on-surface-variant">updated electrical load.</Text></Text>
                      </View>
                      <Text className="text-[10px] text-on-surface-variant mt-1 italic">"Refined based on bench test #402 results."</Text>
                    </View>

                    <View className="relative opacity-70">
                      <View className="absolute -left-[17px] top-1.5 w-2 h-2 rounded-full bg-outline" />
                      <Text className="text-xs font-label-xs text-on-surface-variant uppercase">OCT 14, 06:15 AM</Text>
                      <View className="flex-row items-center gap-2 mt-1">
                        <Image source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBuW8GCuDsblQv4lyoXN8OJ5ZLEApUV6UDFVoYl1rKCGxMKdSfysLls6nyUoZcouuSPddjaQBNrNz_uUNvFKgICSBRj0Z5Kllue4ft8vFegsX8k2ucXktWZeN-KWr0UXuNepXjMF-87Dz1NLbUAPDE7M1V1J_F9RFraMsbg-2JqBxgWba-QobIMYckewt4FKKUg9c7nmm4hnAoQx2FIcPKhzUzEeryN49u3ETlcfKg6uQNTk0BSQhkfmH9GnKSdqLYuL24wYFFQjK8' }} className="w-5 h-5 rounded-full" />
                        <Text className="text-sm font-bold text-on-surface">Alex R. <Text className="font-normal text-on-surface-variant">drafted initial specs.</Text></Text>
                      </View>
                    </View>

                    <View className="relative opacity-50">
                      <View className="absolute -left-[17px] top-1.5 w-2 h-2 rounded-full bg-outline" />
                      <Text className="text-xs font-label-xs text-on-surface-variant uppercase">OCT 12, 04:00 PM</Text>
                      <View className="flex-row items-center gap-2 mt-1">
                        <View className="w-5 h-5 rounded-full bg-surface-variant items-center justify-center">
                          <MaterialIcons name="auto-awesome" size={10} color={colors['on-surface-variant']} />
                        </View>
                        <Text className="text-sm font-bold text-on-surface">AI System <Text className="font-normal text-on-surface-variant">initialized node.</Text></Text>
                      </View>
                    </View>

                  </View>

                  <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="w-full mt-8 py-3 bg-surface-container-high rounded-lg items-center">
                    <Text className="text-on-surface-variant font-label-xs text-[10px] uppercase">Full Version History</Text>
                  </TouchableOpacity>
                </View>

              </View>
            </View>

          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  }
});
