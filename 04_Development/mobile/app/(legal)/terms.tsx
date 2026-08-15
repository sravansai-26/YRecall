import React from 'react';
import { View, Text, ScrollView, Platform, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Screen } from '../../src/shared/components';
import { colors } from '../../src/shared/theme/colors';

export default function TermsOfServiceScreen() {
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
 Terms of Service
 </Text>
 </View>

 <ScrollView className="flex-1 px-margin-mobile" contentContainerStyle={{ paddingBottom: 80 }}>
 <View className="mt-4 mb-8">
 <Text className="font-body-sm text-on-surface-variant mb-6">
 Last Updated: August 2026
 </Text>

 <Text className="font-title-md font-bold text-on-surface mb-2 mt-4">1. Introduction</Text>
 <Text className="font-body-md text-on-surface mb-4 leading-relaxed">
 Welcome to YRecall. These Terms of Service ("Terms") govern your access to and use of the YRecall mobile application and associated services provided by LYFSpot. By creating an account, you agree to these Terms.
 </Text>

 <Text className="font-title-md font-bold text-on-surface mb-2 mt-4">2. Account Creation & Authentication</Text>
 <Text className="font-body-md text-on-surface mb-4 leading-relaxed">
 You may register using Google Sign-In or an email and password. You are responsible for safeguarding your account credentials. We use Firebase Authentication to securely manage your login process.
 </Text>

 <Text className="font-title-md font-bold text-on-surface mb-2 mt-4">3. AI-Powered Functionality</Text>
 <Text className="font-body-md text-on-surface mb-4 leading-relaxed">
 YRecall utilizes advanced AI models (including Gemini, Groq, and OpenRouter) to generate summaries, tags, entities, insights, and answers based on the content you capture. By using the Service, you acknowledge that AI-generated information may not always be accurate. You should verify critical information independently.
 </Text>

 <Text className="font-title-md font-bold text-on-surface mb-2 mt-4">4. User Content & Captures</Text>
 <Text className="font-body-md text-on-surface mb-4 leading-relaxed">
 You retain ownership of all notes, photos, documents, audio, and other content you capture using YRecall. You grant YRecall a license to store, process, and analyze this content solely for the purpose of providing the service to you, including building your personal knowledge graph.
 </Text>

 <Text className="font-title-md font-bold text-on-surface mb-2 mt-4">5. Third-Party Services</Text>
 <Text className="font-body-md text-on-surface mb-4 leading-relaxed">
 The Service integrates with third-party providers such as Supabase for database storage, Firebase for authentication, and Resend for transactional emails. Your use of YRecall is also subject to the operational constraints of these providers.
 </Text>

 <Text className="font-title-md font-bold text-on-surface mb-2 mt-4">6. Acceptable Use</Text>
 <Text className="font-body-md text-on-surface mb-4 leading-relaxed">
 You agree not to use YRecall to store or process illegal material, infringe on intellectual property, or attempt to compromise the security of the application. Violation of these rules may result in immediate account termination.
 </Text>

 <Text className="font-title-md font-bold text-on-surface mb-2 mt-4">7. Disclaimers and Limitations of Liability</Text>
 <Text className="font-body-md text-on-surface mb-4 leading-relaxed">
 YRecall is provided "as is" without warranties of any kind. LYFSpot shall not be liable for any data loss, service interruptions, or damages arising from your reliance on AI-generated insights.
 </Text>

 <Text className="font-title-md font-bold text-on-surface mb-2 mt-4">8. Contact Information</Text>
 <Text className="font-body-md text-on-surface mb-4 leading-relaxed">
 For general support or questions about these Terms, please contact us at <Text onPress={() => Linking.openURL('mailto:support@yrecall.app')} className="text-primary font-bold">support@yrecall.app</Text>.
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
