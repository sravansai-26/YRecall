import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Screen } from '../../src/shared/components';
import { colors } from '../../src/shared/theme/colors';
import { useRouter } from 'expo-router';
import React from 'react';

export default function FamilySpace() {
  const router = useRouter();

  return (
    <Screen scrollable={true}>
      <View className="w-full top-0 sticky z-50 bg-surface flex-row justify-between items-center h-16 px-margin-mobile border-b border-outline-variant/30">
        <View className="flex-row items-center gap-4">
          <TouchableOpacity onPress={() => router.back()}>
            <MaterialIcons name="menu" size={24} color={colors.primary} />
          </TouchableOpacity>
          <Text className="font-headline-md text-2xl text-primary tracking-tight">YRecall</Text>
        </View>
        <View className="flex-row items-center gap-4">
          <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="bg-primary text-white px-4 py-2 rounded-xl flex-row items-center gap-2">
            <MaterialIcons name="person-add" size={16} color={colors.white || '#ffffff'} />
            <Text className="font-label-xs text-white">Join/Invite</Text>
          </TouchableOpacity>
          <View className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary-fixed-dim">
            <Image 
              source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA2Bn6pLp2AGRxOBAws_oGhlfol_a0veNHfarv1GMkIF-eS0DK5SwdacjpH7eDxtdseYJRA5czrIUMr0m-3129H0S4vz2Mk5i4BYx_zyOTOkR2o-BZf8cKlkgeoSWvPYpYgRZAlqQg0zD7SGrkq6FfpmMEr4_9FLDSryCFB9uWPkyPVEwJBFBcEpQRC91cV63AHVe7YJkIWIkPtSTl6esFewXa5pEeqrusF2LKbWUG6x2ILv2WZiw2fZASArmXF8CX_ygaaGKrprtU' }}
              className="w-full h-full object-cover"
            />
          </View>
        </View>
      </View>

      <View className="max-w-[1440px] mx-auto px-margin-mobile py-6 flex-col gap-6">
        
        {/* Header */}
        <View className="flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
          <View>
            <Text className="font-headline-md text-[32px] text-primary mb-2">Family Space</Text>
            <Text className="text-body-md text-on-surface-variant max-w-xl">
              A shared sanctuary for your collective memories, documents, and family wisdom.
            </Text>
          </View>
          <View className="flex-row -space-x-3 items-center">
            <Image source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC4B0pd3SwEF077HXdeqV8rgxrhodDeQpszborsSULuUmIrClk91TJoQ74WLMD9Vw0r7L69-9HgkJGWsLZ9ifRu2bHSJbcveJOPOrDMczQTHbYNxSyRAW3vblI5WlWPZsHdZyeUtO7gsuNAvk1g0lC2NE1Xxtvl37QLqHEQOxDy_8j1yy6iqmizqD-cK4qHYN0CX9vEiN2HPUCpoi9sqDU3CHTdZG02XsYIeEW9ZmWZibVUC0U7y4tbtko4metnM126D4yP72eV7bs' }} className="w-12 h-12 rounded-full border-4 border-surface" />
            <Image source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD-_udNQ-GZNwQ_m1SXPfkk7Zz0253KwGXKIsk6sujrUHYjbh9q1W5mGYrIQ-2fQIWn6GFnj5ksv6ZNnw8xjSgr_JQRswie7jQ6PLzxah17IXTtz_mxXmHBFHTOJae9D4222WsMIT9-BwCd9bvptEaeEowttsjbxVkYIunlCSPO0OZNqDSCM0UwafN1iTUDzGkvUT0-t6V9msQzsFxjHFeagaofj_F3vavtDSWxyCK1eIv4-3zcr5PQXGFH_Tsr_yHUqN9ngutT3RU' }} className="w-12 h-12 rounded-full border-4 border-surface" />
            <Image source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuASW_1gUgGIoYbLzLeU05WxA_PeaxTyebcQMdOEfcatRbu3WAdm6DvG9zcRpN08WToE3pJL2aFt3Iw5aPR0a9bS-8bstdN6FQQuTBDMMxGn0u2XX2dxsHSiyJ_0H9Qm1f3qQumhbINK16gG6DWWJVewETXWTHfyd-L4wi5OAgk3XItl4GlcTr1OCcietwLZvXeYoyT804rn1I0nYe5uLqaoF_wB2oQ_uZJXp5Udrgx-rC2evGyRR6Qbl1QjRVgBPgMUhuQJooPIZrI' }} className="w-12 h-12 rounded-full border-4 border-surface" />
            <View className="w-12 h-12 rounded-full bg-secondary-container items-center justify-center border-4 border-surface">
              <Text className="text-on-secondary-container font-bold text-sm">+2</Text>
            </View>
          </View>
        </View>

        <View className="flex-col lg:flex-row flex-wrap gap-6">
          
          {/* Family Knowledge Graph */}
          <View className="flex-col lg:w-[65%] bg-white/70 rounded-[24px] p-6 border border-outline-variant/50 shadow-sm relative overflow-hidden h-[450px]">
            <View className="flex-row justify-between items-start mb-6 z-10">
              <View>
                <View className="flex-row items-center gap-2">
                  <MaterialIcons name="hub" size={24} color={colors.secondary} />
                  <Text className="font-title-sm text-lg text-primary font-bold">Family Knowledge Graph</Text>
                </View>
                <Text className="text-caption-sm text-on-surface-variant mt-1">Exploring connections between events, people, and lore.</Text>
              </View>
              <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')}>
                <Text className="text-label-xs font-bold text-secondary ">Expand View</Text>
              </TouchableOpacity>
            </View>

            <View className="absolute inset-0 items-center justify-center">
              {/* Simulated Nodes */}
              <View className="absolute top-20 left-10 bg-white p-3 rounded-xl shadow-lg border border-outline-variant flex-row items-center gap-2">
                <MaterialIcons name="home" size={20} color={colors.tertiary} />
                <Text className="text-sm font-medium">Summer House '98</Text>
              </View>
              <View className="absolute top-40 right-10 bg-white p-3 rounded-xl shadow-lg border border-outline-variant flex-row items-center gap-2">
                <MaterialIcons name="menu-book" size={20} color={colors.primary} />
                <Text className="text-sm font-medium">Grandma's Recipes</Text>
              </View>
              <View className="absolute bottom-20 left-[30%] bg-white p-3 rounded-xl shadow-lg border border-outline-variant flex-row items-center gap-2">
                <MaterialIcons name="favorite" size={20} color={colors.error} />
                <Text className="text-sm font-medium">Wedding Anniversary</Text>
              </View>
              <View className="absolute bg-secondary-container p-4 rounded-full shadow-xl border-2 border-secondary items-center justify-center">
                <MaterialIcons name="groups" size={32} color={colors['on-secondary-container']} />
              </View>
            </View>
          </View>

          {/* Shared Folders */}
          <View className="flex-col flex-1 bg-white/70 rounded-[24px] p-6 border border-outline-variant/50 shadow-sm h-[450px]">
            <View className="flex-row items-center gap-2 mb-6">
              <MaterialIcons name="folder-shared" size={24} color={colors.primary} />
              <Text className="font-title-sm text-lg text-primary font-bold">Shared Collections</Text>
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
              <View className="flex-col gap-2">
                <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="flex-row items-center p-3 rounded-xl ">
                  <View className="w-12 h-12 bg-primary-container rounded-lg items-center justify-center mr-4">
                    <MaterialIcons name="photo-library" size={24} color={colors['on-primary-container']} />
                  </View>
                  <View className="flex-1">
                    <Text className="font-body-md font-semibold text-primary">Vacation Photos</Text>
                    <Text className="text-caption-sm text-on-surface-variant">1,240 items • Updated 2h ago</Text>
                  </View>
                  <MaterialIcons name="chevron-right" size={24} color={colors.outline} />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="flex-row items-center p-3 rounded-xl ">
                  <View className="w-12 h-12 bg-secondary-container rounded-lg items-center justify-center mr-4">
                    <MaterialIcons name="description" size={24} color={colors['on-secondary-container']} />
                  </View>
                  <View className="flex-1">
                    <Text className="font-body-md font-semibold text-primary">Household Docs</Text>
                    <Text className="text-caption-sm text-on-surface-variant">42 items • Updated 3d ago</Text>
                  </View>
                  <MaterialIcons name="chevron-right" size={24} color={colors.outline} />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="flex-row items-center p-3 rounded-xl ">
                  <View className="w-12 h-12 bg-tertiary-fixed rounded-lg items-center justify-center mr-4">
                    <MaterialIcons name="movie" size={24} color={colors['on-tertiary-fixed-variant']} />
                  </View>
                  <View className="flex-1">
                    <Text className="font-body-md font-semibold text-primary">Home Movies</Text>
                    <Text className="text-caption-sm text-on-surface-variant">12 items • Updated 1w ago</Text>
                  </View>
                  <MaterialIcons name="chevron-right" size={24} color={colors.outline} />
                </TouchableOpacity>
              </View>
            </ScrollView>

            <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="w-full mt-4 py-3 border-2 border-dashed border-outline-variant rounded-xl items-center">
              <Text className="font-label-xs font-bold text-on-surface-variant">+ Create New Collection</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="flex-col md:flex-row flex-wrap gap-6 mt-2 pb-16">
          
          {/* Memory Highlight */}
          <View className="flex-col md:w-[40%] bg-white/70 rounded-[24px] border border-outline-variant/50 shadow-sm overflow-hidden">
            <View className="h-64 w-full relative">
              <Image source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBMjKFwVZOHW2i_HelX6IsA4f50Qb08RD88TNoFjxrfWE9UaosDPSwtzm2u2u1-TCePo-0PUrMUoPL3n6pRZVklNYDpncOVKkWNnbLwcncDgpbu0TeO8it5XbOmTAY4YJ7wKtgOu7iGdG55mSISB9XgkMWgwnyAfe9t1pS1_A5uX47oe-rIfxJ_1SQiOhGaznURV020PyizQJleMRuOUREAyGSw3bMR6VVK2_vFRqfgiqi59knDnE-dMxJn0-VsNOHPooLLsN1H4wA' }} className="w-full h-full object-cover" />
              <View className="absolute top-4 left-4 bg-white/80 px-3 py-1 rounded-full flex-row items-center gap-1">
                <MaterialIcons name="auto-awesome" size={14} color={colors.primary} />
                <Text className="text-[10px] font-bold text-primary tracking-widest">AI RECALL</Text>
              </View>
            </View>
            <View className="p-6">
              <Text className="text-caption-sm text-secondary font-bold uppercase tracking-widest">Memory of the Day</Text>
              <Text className="font-title-sm text-lg font-bold text-primary mt-1">Picnic at Willow Creek</Text>
              <Text className="text-body-md text-on-surface-variant mt-2 italic">
                "Remember when Lucas forgot the basket and we ended up eating sandwiches on the dashboard? One of our funniest mishaps."
              </Text>
              <View className="mt-4 flex-row items-center gap-2">
                <MaterialIcons name="favorite" size={18} color={colors.secondary} />
                <Text className="text-sm font-medium text-on-surface">Liked by Mom and 2 others</Text>
              </View>
            </View>
          </View>

          {/* Collaborative Timeline */}
          <View className="flex-col flex-1 bg-white/70 rounded-[24px] border border-outline-variant/50 shadow-sm p-6">
            <View className="flex-row justify-between items-center mb-6">
              <View className="flex-row items-center gap-2">
                <MaterialIcons name="event-note" size={24} color={colors.primary} />
                <Text className="font-title-sm text-lg font-bold text-primary">Shared Timeline</Text>
              </View>
              <View className="flex-row gap-2">
                <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="p-2 bg-surface-container rounded-full">
                  <MaterialIcons name="filter-list" size={20} color={colors['on-surface']} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="p-2 bg-surface-container rounded-full">
                  <MaterialIcons name="add" size={20} color={colors['on-surface']} />
                </TouchableOpacity>
              </View>
            </View>

            <View className="flex-col gap-8 pl-12 border-l-2 border-outline-variant relative">
              
              <View className="relative">
                <View className="absolute -left-[60px] top-0 w-10 h-10 bg-primary rounded-full items-center justify-center border-4 border-surface z-10">
                  <MaterialIcons name="flight" size={18} color={colors.white || '#ffffff'} />
                </View>
                <Text className="text-[10px] text-secondary font-bold tracking-widest uppercase">NEXT MONTH</Text>
                <Text className="font-body-md font-bold text-primary mt-1">Summer Trip to Amalfi Coast</Text>
                <Text className="text-caption-sm text-on-surface-variant">Shared by Sarah • 4 people attending</Text>
                <View className="flex-row gap-2 mt-2">
                  <View className="bg-surface-container-high px-3 py-1 rounded-full border border-outline-variant">
                    <Text className="text-xs font-medium text-on-surface">Flight Info</Text>
                  </View>
                  <View className="bg-surface-container-high px-3 py-1 rounded-full border border-outline-variant">
                    <Text className="text-xs font-medium text-on-surface">Hotel Booking</Text>
                  </View>
                </View>
              </View>

              <View className="relative">
                <View className="absolute -left-[60px] top-0 w-10 h-10 bg-secondary rounded-full items-center justify-center border-4 border-surface z-10">
                  <MaterialIcons name="cake" size={18} color={colors.white || '#ffffff'} />
                </View>
                <Text className="text-[10px] text-secondary font-bold tracking-widest uppercase">LAST WEEK</Text>
                <Text className="font-body-md font-bold text-primary mt-1">Dad's 60th Birthday Bash</Text>
                <Text className="text-caption-sm text-on-surface-variant">85 new memories captured</Text>
                <View className="flex-row -space-x-2 mt-3">
                  <Image source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAM93lYTPpOLA8Ol--6QA8z78MS-JvC40YcBFL7QW8uIrym9ruZshdrEDKIhCHqAAgYMo5DBtfHiz3LLMQKyu959xenPCOK-egMJBW51pWIkOEN0xwfG2SZwj3EcKYmIKPsvLCEoqONq9L-SelfuG94S7SsNI7Oqp1u0imWtTX6vl4ghyB32G_5VDUbDEmrQtYc0UnBTTST457kIWyue2qDCbI5suqzlLtnGnt4zKC90V8tY1FCrFhCH4eYwMUfv7x8WqihSbd1Vok' }} className="w-8 h-8 rounded-lg border-2 border-white" />
                  <Image source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA-RAJykWRG0D6Pje1kGbEF3in-5rhT0OJJ9Uud1fV49OAOj-vy4Mt7rhTAv7jnqw5f2F-zioYeKWy2BXIF3f7XibIVv_t8OJA6DsVKFd282g_pE3Wft3K1qpISoodWaAms8bmPK6hgb-s0oR4b_EcysM-ISB4RgzD0UejwrE1jh2txBOmhck2mnOWoNpDTluVeD63P8IHZayElt2nNdzOqGWmuEe0OHYhR-MJaOQd1kjg3h9JTgsQKEjA_714_htFTmEYEpOgc3B0' }} className="w-8 h-8 rounded-lg border-2 border-white" />
                  <View className="w-8 h-8 rounded-lg border-2 border-white bg-surface-variant items-center justify-center">
                    <Text className="text-[10px] font-bold text-on-surface">+83</Text>
                  </View>
                </View>
              </View>

            </View>
          </View>

        </View>
      </View>
      
      {/* FAB */}
      <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="absolute bottom-6 right-6 w-14 h-14 bg-primary rounded-full shadow-lg items-center justify-center">
        <MaterialIcons name="add" size={28} color="#ffffff" />
      </TouchableOpacity>
    </Screen>
  );
}
