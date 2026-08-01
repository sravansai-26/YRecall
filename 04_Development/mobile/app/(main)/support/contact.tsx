import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, Linking } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Clipboard from 'expo-clipboard';
import { Screen } from '../../../src/shared/components';
import { colors } from '../../../src/shared/theme/colors';

export default function ContactDesk() {
    const router = useRouter();

    const emails = [
        {
            title: "Professional Contact Desk",
            email: "contact@buildwithsravan.dev",
            description: "For professional inquiries, partnerships, and business discussions."
        },
        {
            title: "LYFSpot Corporate Desk",
            email: "lyfspot@zohomail.in",
            description: "For corporate billing, enterprise support, and official communications."
        },
        {
            title: "LYFSpot Inbound Desk",
            email: "lyfspot26@gmail.com",
            description: "General support, feedback, and inbound inquiries."
        }
    ];

    const handleCopy = async (email: string) => {
        await Clipboard.setStringAsync(email);
        Alert.alert('Copied', `${email} has been copied to your clipboard.`);
    };

    const handleEmail = (email: string) => {
        Linking.openURL(`mailto:${email}`);
    };

    return (
        <Screen scrollable={true} className="pb-24 bg-[#FCFAF7]">
            {/* TopAppBar */}
            <View className="w-full sticky top-0 z-50 bg-surface flex-row items-center px-margin-mobile md:px-margin-desktop h-16 shadow-sm">
                <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2 rounded-full mr-4">
                    <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
                </TouchableOpacity>
                <Text className="font-headline-md text-xl font-bold text-primary">Support Desks</Text>
            </View>

            <View className="max-w-3xl mx-auto px-margin-mobile md:px-margin-desktop py-8 flex-col gap-8 w-full">
                <View className="flex-col gap-2 mb-4">
                    <Text className="font-headline-md text-3xl font-bold text-primary">Contact Us</Text>
                    <Text className="text-on-surface-variant text-base">
                        Reach out to the appropriate desk below. We strive to respond to all inquiries within 24 hours.
                    </Text>
                </View>

                {emails.map((item, index) => (
                    <View key={index} className="bg-white rounded-2xl p-6 shadow-sm border-[#006e6e]/10 flex-col">
                        <View className="flex-row items-center gap-3 mb-2">
                            <View className="w-10 h-10 rounded-full bg-primary/10 items-center justify-center">
                                <MaterialIcons name="mail" size={20} color={colors.primary} />
                            </View>
                            <Text className="font-title-sm text-lg font-bold text-on-surface">{item.title}</Text>
                        </View>
                        <Text className="text-on-surface-variant text-sm mb-6 ml-13">
                            {item.description}
                        </Text>
                        
                        <View className="flex-row items-center justify-between bg-surface-container-lowest border border-outline-variant rounded-xl p-4">
                            <Text className="font-body-md text-base text-primary font-medium">{item.email}</Text>
                            <View className="flex-row gap-2">
                                <TouchableOpacity onPress={() => handleCopy(item.email)} className="p-2 rounded-full bg-surface-container hover:bg-surface-variant">
                                    <MaterialIcons name="content-copy" size={20} color={colors['on-surface-variant']} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => handleEmail(item.email)} className="p-2 rounded-full bg-primary">
                                    <MaterialIcons name="open-in-new" size={20} color="#ffffff" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                ))}
            </View>
        </Screen>
    );
}
