import React from 'react';
import { View, Text, ScrollView, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Screen } from '../../src/shared/components';
import { colors } from '../../src/shared/theme/colors';

export default function PrivacyPolicyScreen() {
 const router = useRouter();

 return (
 <Screen scrollable={false}>
 <View className="w-full flex-row items-center px-margin-mobile py-base h-16 bg-surface">
 <MaterialIcons 
 name="arrow-back" 
 size={24} 
 color={colors.primary} 
 onPress={() => router.back()}
 className="mr-4"
 />
 <Text className="font-title-lg text-[20px] font-medium text-primary">
 Privacy Policy
 </Text>
 </View>

 <ScrollView className="flex-1 px-margin-mobile" contentContainerStyle={{ paddingBottom: 80 }}>
 <View className="mt-4 mb-8">
 <Text className="font-body-sm text-on-surface-variant mb-6">
 Last Updated: August 2026
 </Text>

 <Text className="font-title-md font-bold text-on-surface mb-2 mt-4">1. Information We Collect</Text>
 <Text className="font-body-md text-on-surface mb-4 leading-relaxed">
 When you use YRecall, we collect:
 {"\n"}• Account Data: Your email address, name, and profile picture (handled via Firebase Authentication and Google Sign-In).
 {"\n"}• Captures: Notes, text, photos, audio, videos, URLs, and documents (PDF, DOCX) you upload to your second brain.
 {"\n"}• Device & Metadata: Contextual information such as upload timestamps, device environment details, and location data associated with captures.
 </Text>

 <Text className="font-title-md font-bold text-on-surface mb-2 mt-4">2. How We Process AI Data</Text>
 <Text className="font-body-md text-on-surface mb-4 leading-relaxed">
 To build your personal knowledge graph, YRecall securely transmits your captures to trusted external AI providers, including Gemini, Groq, and OpenRouter. These models process your data to generate summaries, tags, entities, embeddings, and answers. These third parties act as processors and are bound by confidentiality.
 </Text>

 <Text className="font-title-md font-bold text-on-surface mb-2 mt-4">3. Data Storage & Third Parties</Text>
 <Text className="font-body-md text-on-surface mb-4 leading-relaxed">
 We use specialized infrastructure to secure your data:
 {"\n"}• Supabase (PostgreSQL & pgvector): Stores your structured data, knowledge graph, vector embeddings, and search indices.
 {"\n"}• Supabase Storage: Securely hosts your media and document files.
 {"\n"}• Firebase: Manages authentication identity and access tokens securely.
 {"\n"}• Resend: Used to deliver transactional emails to your inbox.
 </Text>

 <Text className="font-title-md font-bold text-on-surface mb-2 mt-4">4. Security & Retention</Text>
 <Text className="font-body-md text-on-surface mb-4 leading-relaxed">
 Your data is encrypted in transit and at rest in our databases. We retain your information as long as your account is active. If you delete a capture, it is removed from our operational databases.
 </Text>

 <Text className="font-title-md font-bold text-on-surface mb-2 mt-4">5. Your Privacy Rights</Text>
 <Text className="font-body-md text-on-surface mb-4 leading-relaxed">
 You have the right to access, correct, or delete your personal data. You can delete your account entirely, which will trigger the removal of your captures and knowledge graph from our systems.
 </Text>

 <Text className="font-title-md font-bold text-on-surface mb-2 mt-4">6. Contact Us</Text>
 <Text className="font-body-md text-on-surface mb-4 leading-relaxed">
 For privacy-related inquiries, data requests, or to report a grievance, please contact us at <Text onPress={() => Linking.openURL('mailto:privacy@yrecall.app')} className="text-primary font-bold">privacy@yrecall.app</Text>.
 </Text>
 
 <View className="mt-8 p-4 bg-surface-container rounded-xl">
 <Text className="font-label-sm text-outline text-center">
 * Pending Final Legal Review *
 </Text>
 </View>
 </View>
 </ScrollView>
 </Screen>
 );
}
