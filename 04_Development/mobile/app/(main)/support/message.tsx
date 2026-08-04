import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ActivityIndicator, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Screen } from '../../../src/shared/components';
import { colors } from '../../../src/shared/theme/colors';
import { apiClient } from '../../../src/services/api/client';


export default function ReachUs() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [subject, setSubject] = useState('General Question');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);

    const subjects = [
        "General Question",
        "Feature Request",
        "Business Inquiry",
        "Partnership",
        "Career",
        "Technical Support",
        "Feedback",
        "Other"
    ];

    const isValid = name.trim().length > 0 && email.includes('@') && message.trim().length >= 10;

    const handleSubmit = async () => {
        if (!isValid) return;
        setLoading(true);
        try {
            await apiClient.post('/support/contact', {
                name: name.trim(),
                email: email.trim(),
                subject: subject,
                message: message.trim(),
                attachments: []
            });
            Alert.alert(
                "Message Sent",
                "Thank you for reaching out! We've sent a confirmation to your email.",
                [{ text: "OK", onPress: () => router.back() }]
            );
        } catch (error) {
            Alert.alert("Error", "Failed to send message. Please try again.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Screen scrollable={true} className="pb-40 bg-[#FCFAF7]">
            {/* TopAppBar */}
            <View className="w-full sticky top-0 z-50 bg-surface flex-row items-center px-margin-mobile md:px-margin-desktop h-16 shadow-sm">
                <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2 rounded-full mr-4">
                    <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
                </TouchableOpacity>
                <Text className="font-headline-md text-xl font-bold text-primary">Reach Us</Text>
            </View>

            <View className="max-w-2xl mx-auto px-margin-mobile md:px-margin-desktop py-8 flex-col gap-6 w-full">
                <View className="flex-col gap-2 mb-2">
                    <Text className="font-headline-md text-3xl font-bold text-primary">Send us a Message</Text>
                    <Text className="text-on-surface-variant text-base">
                        Fill out the form below and our team will get back to you shortly.
                    </Text>
                </View>

                <View className="flex-col gap-4">
                    <View className="flex-col gap-1">
                        <Text className="text-sm font-bold text-on-surface">Full Name</Text>
                        <TextInput 
                            value={name}
                            onChangeText={setName}
                            placeholder="John Doe"
                            className="w-full h-14 px-4 bg-white rounded-xl border border-outline-variant font-body-md text-base text-on-surface"
                            placeholderTextColor={colors.outline}
                            editable={!loading}
                        />
                    </View>

                    <View className="flex-col gap-1">
                        <Text className="text-sm font-bold text-on-surface">Email Address</Text>
                        <TextInput 
                            value={email}
                            onChangeText={setEmail}
                            placeholder="john@example.com"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            className="w-full h-14 px-4 bg-white rounded-xl border border-outline-variant font-body-md text-base text-on-surface"
                            placeholderTextColor={colors.outline}
                            editable={!loading}
                        />
                    </View>

                    <View className="flex-col gap-1 relative z-10">
                        <Text className="text-sm font-bold text-on-surface">Subject</Text>
                        <TouchableOpacity 
                            onPress={() => !loading && setShowDropdown(!showDropdown)}
                            className="w-full h-14 px-4 bg-white rounded-xl border border-outline-variant flex-row items-center justify-between"
                        >
                            <Text className="font-body-md text-base text-on-surface">{subject}</Text>
                            <MaterialIcons name={showDropdown ? "expand-less" : "expand-more"} size={24} color={colors.outline} />
                        </TouchableOpacity>
                        
                        {showDropdown && (
                            <View className="absolute top-[80px] left-0 right-0 bg-white border border-outline-variant rounded-xl shadow-lg z-20 overflow-hidden">
                                {subjects.map((sub, idx) => (
                                    <TouchableOpacity 
                                        key={idx}
                                        onPress={() => { setSubject(sub); setShowDropdown(false); }}
                                        className="p-4 border-b border-surface-variant"
                                    >
                                        <Text className="text-base text-on-surface">{sub}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                    </View>

                    <View className="flex-col gap-1 z-0">
                        <Text className="text-sm font-bold text-on-surface">Message</Text>
                        <TextInput 
                            value={message}
                            onChangeText={setMessage}
                            placeholder="How can we help you?"
                            multiline
                            maxLength={500}
                            textAlignVertical="top"
                            className="w-full h-40 p-4 bg-white rounded-xl border border-outline-variant font-body-md text-base text-on-surface"
                            placeholderTextColor={colors.outline}
                            editable={!loading}
                        />
                        <Text className="text-xs text-outline self-end mt-1">{message.length} / 500 characters</Text>
                    </View>

                    <TouchableOpacity 
                        onPress={handleSubmit} 
                        disabled={!isValid || loading}
                        className="w-full h-14 rounded-xl flex-row items-center justify-center gap-2 mt-4"
                        style={{ backgroundColor: (!isValid || loading) ? 'rgba(0, 51, 102, 0.5)' : '#003366' }}
                    >
                        {loading ? (
                            <ActivityIndicator color="#ffffff" />
                        ) : (
                            <>
                                <MaterialIcons name="send" size={20} color="#ffffff" />
                                <Text className="font-bold text-white text-base">Send Message</Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </Screen>
    );
}
