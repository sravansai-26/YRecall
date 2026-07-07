import { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Button, Screen } from '../../src/shared/components';
import { colors } from '../../src/shared/theme/colors';
import { useAuthStore } from '../../src/shared/store/useAuthStore';

const PERSONAS = [
  {
    id: 'calm',
    title: 'Calm & Concise',
    desc: 'Minimalist, brief summaries. Focuses on the essentials without digital noise or unnecessary chatter.',
    badge: 'Low Cognitive Load',
    icon: 'air',
    preview: `"Your week in summary: Focus was on project 'Aurora'. You've logged 12 insights and cleared 5 main objectives. Ready for the next phase?"`
  },
  {
    id: 'analytical',
    title: 'Detailed & Analytical',
    desc: 'Data-driven, source-heavy explanations. Ideal for research, complex problem solving, and deep work.',
    badge: 'Power User',
    icon: 'analytics',
    preview: `"Data Analysis Report: Project 'Aurora' shows a 15% increase in velocity since Tuesday. Primary bottleneck identified in module C. Historical logs (ref. doc-99) suggest a logic shift. Recommendation: Review dependency tree."`
  },
  {
    id: 'creative',
    title: 'Creative & Insightful',
    desc: 'Expressive, lateral connections. Encourages exploration and uncovers patterns you might have missed.',
    badge: 'Inspiration Mode',
    icon: 'lightbulb',
    preview: `"I noticed a fascinating link between your Project 'Aurora' and that note you made three months ago about coastal ecosystems. Both prioritize fluid adaptation. Perhaps the solution to your current block lies in that older pattern?"`
  }
];

export default function OnboardingPersona() {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState('calm');
  const { setHasCompletedOnboarding } = useAuthStore();

  const selectedPersona = PERSONAS.find(p => p.id === selectedId)!;

  return (
    <Screen scrollable>
      <View className="flex-row items-center justify-between px-margin-mobile py-base h-16 w-full max-w-7xl mx-auto">
        <View className="flex-row items-center gap-2">
          <MaterialIcons name="auto-awesome" size={24} color={colors.primary} />
          <Text className="font-headline-md font-bold text-primary">YRecall</Text>
        </View>
      </View>

      <View className="flex-1 w-full max-w-4xl px-margin-mobile py-xl flex-col self-center space-y-xl">
        <View className="text-center space-y-md items-center">
          <Text className="font-display-lg-mobile md:font-display-lg text-primary text-center">
            Refine your AI Persona
          </Text>
          <Text className="font-body-md text-on-surface-variant max-w-2xl text-center mt-2">
            How should your AI interact with you? This determines the depth, tone, and complexity of every response within YRecall.
          </Text>
        </View>

        <View className="flex-col md:flex-row gap-gutter mt-xl">
          {PERSONAS.map(persona => {
            const isActive = selectedId === persona.id;
            return (
              <TouchableOpacity
                key={persona.id}
                onPress={() => setSelectedId(persona.id)}
                activeOpacity={0.8}
                className={`flex-1 p-lg rounded-[24px] bg-white border ${
                  isActive ? 'border-secondary bg-[#f0fafa]' : 'border-transparent'
                }`}
                style={{
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.1,
                  shadowRadius: 20,
                  elevation: 2,
                }}
              >
                <View className="w-12 h-12 rounded-xl bg-secondary/10 items-center justify-center mb-md">
                  <MaterialIcons name={persona.icon as any} size={32} color={colors.secondary} />
                </View>
                <Text className="font-title-sm text-primary mb-sm">{persona.title}</Text>
                <Text className="font-body-md text-on-surface-variant flex-1">
                  {persona.desc}
                </Text>
                <View className="mt-lg self-start bg-secondary/10 px-3 py-1 rounded-full">
                  <Text className="text-on-secondary-container font-label-xs">
                    {persona.badge}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <View className="rounded-[24px] bg-white p-xl mt-xxl flex-col gap-xl border border-outline-variant/30">
          <View className="flex-1 space-y-md">
            <Text className="font-title-sm text-primary mb-2">Previewing Persona</Text>
            <View className="p-lg bg-surface-container rounded-xl border border-outline-variant">
              <Text className="italic text-on-surface-variant font-body-md">
                {selectedPersona.preview}
              </Text>
            </View>
          </View>
        </View>

        <View className="pt-xl flex-col items-center mb-xxl">
          <Button
            label="Complete Setup"
            icon="arrow-forward"
            onPress={() => setHasCompletedOnboarding(true)}
          />
          <Text className="font-caption-sm text-outline mt-md">
            You can change these settings at any time in your profile.
          </Text>
        </View>
      </View>
    </Screen>
  );
}
