import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Screen, Button } from '../../src/shared/components';
import { colors } from '../../src/shared/theme/colors';
import { useRouter } from 'expo-router';
import React from 'react';

export default function TeamsCentral() {
  const router = useRouter();

  return (
    <Screen scrollable={true}>
      {/* TopAppBar */}
      <View className="fixed top-0 w-full z-50 bg-surface h-16 flex-row justify-between items-center px-margin-mobile border-b border-outline-variant/30">
        <View className="flex-row items-center gap-4">
          <TouchableOpacity className="p-2 rounded-full " onPress={() => router.back()}>
            <MaterialIcons name="menu" size={24} color={colors.primary} />
          </TouchableOpacity>
          <Text className="font-headline-md text-xl font-bold text-primary">Team Workspace</Text>
        </View>
        <View className="flex-row items-center gap-4">
          <View className="flex-row items-center gap-2 hidden md:flex">
            <Text className="font-body-md text-on-surface-variant font-medium">8 Online</Text>
            <View className="w-2 h-2 rounded-full bg-secondary" />
          </View>
          <Image 
            source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuARJsIg_-b20GIQ2XjEmpOTNo_W7ixqlwohKwrGL6nMmEdBF2m1XH6Ru8IKEpFI00ItciZgB16kiCadYIW89pQc5hF4jKe2KbQX8KSamhDWMhPyyVnu6Q41TzCUnTLSPcBBqlewUJUtazcnoPn_NZ0gGvODHYlbXN615hKN2FKDxLlEJCxVC9lKNEbwOzuQwwAVSn7ULKw2fzGupgHjrIvAPo6QvQyhQ_9PAmHd-3ZLiBk-jSygMWhCZvMPHZW-EMedRY3V17szhXs' }}
            className="w-10 h-10 rounded-full border-2 border-outline-variant"
          />
        </View>
      </View>

      <View className="px-margin-mobile pt-6 pb-32 flex-col gap-xl">
        
        {/* Dashboard Hero */}
        <View className="flex-col gap-4 md:flex-row justify-between items-start md:items-end">
          <View>
            <Text className="font-display-lg text-[44px] text-primary font-bold leading-tight">Good morning, Alex</Text>
            <Text className="font-body-md text-on-surface-variant">The AI Life OS has indexed 12 new items since your last login.</Text>
          </View>
          <View className="flex-row gap-3">
            <Button variant="primary" label="Add Project" />
            <Button variant="outline" label="Invite Team" onPress={() => router.push('/(teams)/invite')} />
          </View>
        </View>

        <View className="flex-col md:flex-row flex-wrap gap-6 mt-4">
          
          {/* Activity Feed */}
          <View className="flex-col md:w-[60%] bg-surface-container-lowest rounded-[24px] p-6 shadow-sm border border-outline-variant/30 h-[520px]">
            <View className="flex-row items-center justify-between mb-6">
              <View className="flex-row items-center gap-2">
                <MaterialIcons name="analytics" size={24} color={colors.primary} />
                <Text className="font-title-sm text-lg font-bold text-primary">Activity</Text>
              </View>
              <View className="bg-surface-container px-3 py-1 rounded-lg">
                <Text className="text-caption-sm text-outline">Real-time</Text>
              </View>
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
              <View className="flex-col gap-4">
                
                {/* Highlighted Item */}
                <View className="bg-secondary-container/30 border border-secondary/10 p-4 rounded-xl flex-row items-start gap-4">
                  <View className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center">
                    <MaterialIcons name="edit-note" size={20} color={colors['on-secondary-container']} />
                  </View>
                  <View className="flex-1">
                    <Text className="font-body-md text-on-surface"><Text className="font-bold">Marcus Chen</Text> added a new project note</Text>
                    <Text className="text-caption-sm text-on-surface-variant mt-1 italic">"Finalized the architectural constraints for the Q4 roadmap. Intelligence layers are now prioritized."</Text>
                    <Text className="text-caption-sm text-outline mt-2">2m ago • Project Alpha</Text>
                  </View>
                </View>

                {/* Regular Items */}
                <View className="p-4 rounded-xl flex-row items-start gap-4 ">
                  <Image source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDohCG7iVuymoQZc4qmXLI8PgcK3itN05wKM97MUety9qbjOWoNUBPmXEDvfAG_p2WbW4Y_eFZ8kBx0zb4W4cfIg3pYv550RoEDK4-KKtJlok6exw73fxRKJfhj2qXIL3LDiQ7hDKthPYjTiNqeK8iDlXD9jlXts2SqTe_U66wwYpvRt38v2EvfqQjKPWATqeE4egb-cP44t-HCHRaF00UgLiIY0RwE76c559bApWcBcBGEWBjvcE2jaDwG9tpZgj4HyCxuZxPTi9E' }} className="w-10 h-10 rounded-full" />
                  <View className="flex-1">
                    <Text className="font-body-md text-on-surface"><Text className="font-bold">Elena Rodriguez</Text> approved the design system tokens</Text>
                    <Text className="text-caption-sm text-outline mt-1">15m ago • Brand Identity</Text>
                  </View>
                </View>

                <View className="p-4 rounded-xl flex-row items-start gap-4 ">
                  <View className="w-10 h-10 rounded-full bg-tertiary-container flex items-center justify-center">
                    <MaterialIcons name="hub" size={20} color={colors['on-tertiary-container']} />
                  </View>
                  <View className="flex-1">
                    <Text className="font-body-md text-on-surface"><Text className="font-bold">System AI</Text> updated the knowledge graph</Text>
                    <Text className="text-caption-sm text-outline mt-1">1h ago • Knowledge Sync</Text>
                  </View>
                </View>

                <View className="p-4 rounded-xl flex-row items-start gap-4 ">
                  <Image source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBWacdj2tW8GXB_6JFd4z0uFr1TA7wU87NUbzraBr5ieLw8TqA_TVCWVaZ_u2sa4Pqdz3G5sHTs89gV825ef9X5oF-3OB93hTgOul2JbHtq2kxhXJhg4_q8lg8S9p9IabDd7F8ZZvRX2yyPsktkRc3RAAZSd4iEreO2TT6efsdVG3Tok9fdgXmdl3P8DuC0L-9VidF2lowBg3IMABtEed2-ChUOLBaT48fJsp6f8BW5HzVCJgxN1bRLhOsSqosefh6zZNvVUdeNvTQ' }} className="w-10 h-10 rounded-full" />
                  <View className="flex-1">
                    <Text className="font-body-md text-on-surface"><Text className="font-bold">Jordan Lee</Text> uploaded 4 new assets</Text>
                    <Text className="text-caption-sm text-outline mt-1">3h ago • Marketing Ops</Text>
                  </View>
                </View>
              </View>
            </ScrollView>
          </View>

          {/* Knowledge Graph Widget */}
          <View className="flex-col flex-1 bg-primary-container rounded-[24px] p-6 shadow-sm border border-outline-variant/30 h-[520px]">
            <View className="mb-6">
              <Text className="font-title-sm text-lg text-on-primary-container font-bold mb-1">Knowledge Graph</Text>
              <Text className="text-caption-sm text-on-primary-container/70">Visualizing team connections and documentation clusters</Text>
            </View>

            <View className="flex-1 bg-primary/20 rounded-xl border border-white/10 items-center justify-center">
              <View className="w-24 h-24 rounded-full border border-secondary-fixed/50 items-center justify-center bg-primary/40">
                <MaterialIcons name="share" size={40} color={colors.secondary} />
              </View>
              <Text className="text-caption-sm text-secondary font-bold tracking-widest uppercase mt-4">Live Pulse</Text>
            </View>

            <View className="flex-row gap-4 mt-6">
              <View className="flex-1 bg-white/10 p-3 rounded-lg border border-white/10">
                <Text className="text-caption-sm text-on-primary-container/60 mb-1">Entities</Text>
                <Text className="text-title-sm font-bold text-on-primary-container">1,284</Text>
              </View>
              <View className="flex-1 bg-white/10 p-3 rounded-lg border border-white/10">
                <Text className="text-caption-sm text-on-primary-container/60 mb-1">Clusters</Text>
                <Text className="text-title-sm font-bold text-on-primary-container">42</Text>
              </View>
            </View>
          </View>

        </View>

        {/* Member List Card & Shared Collections row */}
        <View className="flex-col md:flex-row flex-wrap gap-6 mt-2">
          
          {/* Members */}
          <View className="flex-col md:w-[35%] bg-surface-container-lowest rounded-[24px] p-6 shadow-sm border border-outline-variant/30">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="font-title-sm text-lg font-bold text-primary">Members</Text>
              <View className="bg-secondary-container/30 px-3 py-1 rounded-full">
                <Text className="text-caption-sm font-bold text-secondary">8 online</Text>
              </View>
            </View>

            <View className="flex-col gap-4">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-3">
                  <View className="relative">
                    <Image source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAxyjHDUAo5GJYB_WJHJNvk-wj2LaDLlT8Ea5C5up3dy7Ko5qZmP03gs5Dg_hMxpN7i5YjpdW2AfC2X9Wskyp7EJSSqB2TU-yevz9jRZC7kNHqJyihf6nAfza26_lhiyOaLiA7yxqM7OxZRbXdBUVc9H7lNM2KygXyhvDwzPA72Q5aAQzZOTOxZupbWZKJYhnWEsmAPwtyesFNT86XwpHfsU_yAQ79Iw9ZU01OxohJ3EMzJ6t-7oPDtImnvPjqnh2kxbuE59El8clM' }} className="w-12 h-12 rounded-full" />
                    <View className="absolute bottom-0 right-0 w-3 h-3 bg-secondary rounded-full border-2 border-white" />
                  </View>
                  <View>
                    <Text className="font-body-md text-on-surface font-semibold">Alex Rivers</Text>
                    <Text className="text-caption-sm text-outline">Lead Architect</Text>
                  </View>
                </View>
                <MaterialIcons name="more-vert" size={24} color={colors.outline} />
              </View>

              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-3">
                  <View className="relative">
                    <Image source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuApaVO_Oszr1HoRIn5vKF48oRI2UjK1UuxcXRSMIyj6-W9IgNq67FZzY6wLXfJckHXorEbMadmtUV6e_id4Gdln6EtAfee1_yNVscx0gRagtDXI5kAH8JpjdRTYDcPNHbdVMzVrEcJgCcXSkyJAKPaiVTM4ArYECL_ErtepuA2j8i5wVtzNsQwrrPzGwz-V6hIZ5aRRdooAXjpBX6rC9OlmbuQaLLQpQnwMc981L5_jLtq2o5EYDBRtkT2u1Onws102wCrnssqNjXY' }} className="w-12 h-12 rounded-full" />
                    <View className="absolute bottom-0 right-0 w-3 h-3 bg-secondary rounded-full border-2 border-white" />
                  </View>
                  <View>
                    <Text className="font-body-md text-on-surface font-semibold">Sarah Jenkins</Text>
                    <Text className="text-caption-sm text-outline">Product Design</Text>
                  </View>
                </View>
                <MaterialIcons name="more-vert" size={24} color={colors.outline} />
              </View>
            </View>

            <View className="pt-4 mt-4 border-t border-outline-variant/30">
              <Text className="text-caption-sm text-outline mb-2">Recently active</Text>
              <View className="flex-row items-center -space-x-3">
                <Image source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDX1imuPs0zfJD7mtEtdmXETnVpWZeWXQensKwoj2Wp4-VYV4liVDb2_yD14fLfKmGcQYO9ScM9FDXZKfnf9hz795q1FRzUWged_i6qldEDeVSv9e9wQNuGhcyDvs7haieVKsELntGNbNC9q7TCdxE2cQIizUMoukp123RBYVpObpZloBUw6ckGNOsV8l44iu6fuS1eOLWjJSsuMGQjz__5KuinFvcKtIwUCF6bgiGNtCJE9wQeAKxzERyJAAMthacVfVJ1qbpYqMc' }} className="w-10 h-10 rounded-full border-2 border-white" />
                <Image source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCTz4TpaunzyyEaii9aMFrnFZerw-5kL92faLegKjFeDmDF7Tl8mMbX_Hq4PKmI81Jtji_Yam8-vF6EgviNRBLXf_cAwD3mDkWUrXZJJJ6jpxfhnwoAuPhfElq4NPKn1l_csSIqrDnHOtw3ibiPkwYMBQ6QzmHquwKGcnsM4rAwSfSO9H1FjegX3FB_iojluvD9K-QpPyxLHEDIznX1fy_aKaTxK57SCbOcgNXtHc_LivZIhpgzz48l_V7ptVTvNuKCehEMnmmPS0w' }} className="w-10 h-10 rounded-full border-2 border-white" />
                <Image source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBNqLBN0LVPN0KZIufwwbfDfOBiSUfHJVQR51vQ-dSC1RFkbWkhIBujkSnDp2oShunLcnqv6wBKCRn2HEJYZbMyJjr0OssGGW-2_2VwN2tPC6c4oGECRUX_JofsqtTyYAMatkBfSbquI8g0DnwcLYmnThD82BL1cTWOiqkhAePhgntptjh7JQNhVWx6hOFY5gZTeAPbyMQK23Cof1763_SX8uZw7UpBv232AbFZIW270O4MsgelxURFjId2WwWhqnioAnZF1cgsPDs' }} className="w-10 h-10 rounded-full border-2 border-white" />
                <View className="w-10 h-10 rounded-full border-2 border-white bg-surface-container-highest flex items-center justify-center">
                  <Text className="text-caption-sm font-bold text-on-surface-variant">+5</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Shared Collections */}
          <View className="flex-col flex-1 bg-surface-container-low rounded-[24px] p-6 overflow-hidden">
            <View className="flex-row items-center justify-between mb-6">
              <Text className="font-title-sm text-lg font-bold text-primary">Shared Collections</Text>
              <View className="flex-row gap-2">
                <View className="w-8 h-8 rounded-full bg-surface-container-highest items-center justify-center"><MaterialIcons name="chevron-left" size={20} color={colors['on-surface-variant']} /></View>
                <View className="w-8 h-8 rounded-full bg-surface-container-highest items-center justify-center"><MaterialIcons name="chevron-right" size={20} color={colors['on-surface-variant']} /></View>
              </View>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
              
              <View className="w-60 bg-surface-container-lowest p-4 rounded-2xl shadow-sm border border-outline-variant/20 mr-4">
                <View className="w-full h-32 bg-secondary-container/30 rounded-xl mb-4 items-center justify-center relative overflow-hidden">
                  <Image source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCSo29wJ10VePNf14Fau_WVbNK88Q1ovHobZ7QZ_cI6Bb5tU6s0QbS8mV4n-yY5a3R29CD8tdrHz2WjriAjJRFpF2DQW07Golj3Ofy8FsoN07z8CDNtuZO9zn8wwVV_B2TLuIe-GLo0b61GYkMFPB7aWmoiXMitkiFtGRErAQ4yvZfFgVWyy5sFMuKYDagyQO2uZrVffXE_pbDxKoMA4Ovxjt323rdYSlrUR8QpoI5RssV7nT7_H_o1G3PyjVE10I_7MWrhv-uyBcQ' }} className="absolute inset-0 w-full h-full opacity-50" />
                  <MaterialIcons name="architecture" size={32} color={colors.secondary} />
                </View>
                <Text className="font-body-md font-bold text-primary">Q4 Design Assets</Text>
                <Text className="text-caption-sm text-outline mt-1">248 items • Updated yesterday</Text>
              </View>

              <View className="w-60 bg-surface-container-lowest p-4 rounded-2xl shadow-sm border border-outline-variant/20 mr-4">
                <View className="w-full h-32 bg-primary-container/30 rounded-xl mb-4 items-center justify-center relative overflow-hidden">
                  <Image source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuChxKK-WtxrFP_q_OX9Na8Xq2H7VOJ73krMYmm8kOzP0TJWmee_4t4VULpN54pD8-JHYrsAJW7CLnmd7_8QDjP67PvZ375qHri_uXEXMT8aTmdCavoG952Sp0FYb4PgTLuRp49PMK42XQYKbvyCJyoCZ7Cz6rWX9tKYBWxhcGgy3L-SI6gUi4ZAMRSTWiEwiKloRpslxwcO-m3Jz_yBuoZ6BMjIluiPcljtUycCxu-JHFaBiIi-66Rf4p8THoluJ1vXua7GXVca-bI' }} className="absolute inset-0 w-full h-full opacity-50" />
                  <MaterialIcons name="folder-zip" size={32} color={colors.primary} />
                </View>
                <Text className="font-body-md font-bold text-primary">Client Feedback Hub</Text>
                <Text className="text-caption-sm text-outline mt-1">12 folders • Updated 2h ago</Text>
              </View>

              <View className="w-60 bg-surface-container-lowest p-4 rounded-2xl shadow-sm border border-outline-variant/20">
                <View className="w-full h-32 bg-surface-variant rounded-xl mb-4 items-center justify-center relative overflow-hidden">
                  <Image source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDEdS2qULPLtdn29DEAYN6VEVtIlPn2qcOFTtJ5-LM2C1XhVbA266pTUl7ygWeQrY1usMnWdzeYc5im9zID18xgfqCfxmyf7sJgIW5UHIG5-ECtKmW8pydPEZGwT4Bm-95mbCuMvaYz0nJckCgAH_qG9ruAdzEAxlQssC1ePsFXUpr0weYrkBwRmHpOv-910NFszX5VBTBECMFIZF3owEA2vCjVhtzV1REBL0UzAerCre3jHntr6Cr9rt0lfeZ93sUT0mvT3_fB1-Y' }} className="absolute inset-0 w-full h-full opacity-50" />
                  <MaterialIcons name="description" size={32} color={colors['on-surface-variant']} />
                </View>
                <Text className="font-body-md font-bold text-primary">Technical Specs</Text>
                <Text className="text-caption-sm text-outline mt-1">85 documents • New entries</Text>
              </View>

            </ScrollView>
          </View>
        </View>
      </View>

      {/* Floating Action Button */}
      <TouchableOpacity onPress={() => require('react-native').Alert.alert('Coming Soon', 'Backend integration pending')} className="absolute bottom-10 right-6 w-14 h-14 rounded-full bg-primary items-center justify-center shadow-lg">
        <MaterialIcons name="add" size={32} color={colors.white || '#ffffff'} />
      </TouchableOpacity>
    </Screen>
  );
}
