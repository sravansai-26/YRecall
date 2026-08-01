import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Alert, Linking, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Screen } from '../../src/shared/components';
import { colors } from '../../src/shared/theme/colors';
import { useRouter } from 'expo-router';
import { apiClient } from '../../src/services/api/client';
import * as Device from 'expo-device';
import Constants from 'expo-constants';

export default function SupportHub() {
    const router = useRouter();
    
    const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
    const [faqs, setFaqs] = useState<any[]>([]);
    const [resources, setResources] = useState<any[]>([]);
    const [systemStatus, setSystemStatus] = useState<any>(null);
    
    // Bug Report State
    const [bugTitle, setBugTitle] = useState('');
    const [bugDesc, setBugDesc] = useState('');
    const [bugCategory, setBugCategory] = useState('UI Bug');
    const [bugPriority, setBugPriority] = useState('medium');
    const [showBugCategory, setShowBugCategory] = useState(false);
    const [bugLoading, setBugLoading] = useState(false);

    const bugCategories = [
        "UI Bug", "Crash", "Performance", "Sync", "Capture", "Timeline", 
        "Ask AI", "Knowledge Graph", "Notifications", "Widgets", "Settings", "Billing", "Account", "Other"
    ];

    useEffect(() => {
        loadSupportData();
    }, []);

    const loadSupportData = async () => {
        try {
            const [faqRes, resRes, statRes] = await Promise.all([
                apiClient.get('/support/faq').catch(() => ({ data: [] })),
                apiClient.get('/support/resources').catch(() => ({ data: [] })),
                apiClient.get('/support/status').catch(() => ({ data: { status: 'operational' } }))
            ]);
            setFaqs(faqRes.data || []);
            setResources(resRes.data || []);
            setSystemStatus(statRes.data || null);
        } catch (e) {
            console.error("Failed to load support data", e);
        }
    };

    const toggleFaq = (index: number) => {
        setExpandedFaq(expandedFaq === index ? null : index);
    };

    const handleBugSubmit = async () => {
        if (!bugTitle.trim() || !bugDesc.trim()) {
            Alert.alert("Missing Fields", "Please provide a title and description for the bug.");
            return;
        }

        setBugLoading(true);
        try {
            const deviceInfo = {
                osName: Device.osName,
                osVersion: Device.osVersion,
                modelName: Device.modelName,
                appVersion: Constants.expoConfig?.version || 'Unknown',
            };

            await apiClient.post('/support/bug', {
                title: bugTitle.trim(),
                description: bugDesc.trim(),
                category: bugCategory,
                priority: bugPriority,
                device_info: deviceInfo
            });

            Alert.alert("Bug Reported", "Thank you! Our engineering team will investigate this shortly.");
            setBugTitle('');
            setBugDesc('');
            setBugCategory('UI Bug');
        } catch (error) {
            Alert.alert("Error", "Failed to submit bug report. Please try again.");
            console.error(error);
        } finally {
            setBugLoading(false);
        }
    };

    return (
        <Screen scrollable={true} className="pb-24 bg-[#FCFAF7]">
            {/* TopAppBar */}
            <View className="w-full sticky top-0 z-50 bg-surface flex-row items-center justify-between px-margin-mobile md:px-margin-desktop h-16 shadow-sm">
                <View className="flex-row items-center gap-4">
                    <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2 rounded-full">
                        <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
                    </TouchableOpacity>
                    <View className="w-8 h-8 rounded-full bg-primary items-center justify-center">
                        <MaterialIcons name="psychology" size={20} color="#ffffff" />
                    </View>
                    <Text className="font-headline-md text-xl font-bold text-primary">YRecall Support</Text>
                </View>
            </View>

            <View className="max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop py-8 flex-col gap-8 w-full">
                
                {/* Emergency Support Banner */}
                {systemStatus && systemStatus.status !== 'operational' && (
                    <View className="w-full bg-error-container p-4 rounded-2xl flex-row items-start gap-3 border border-error/30">
                        <MaterialIcons name="warning" size={24} color={colors.error} />
                        <View className="flex-1 flex-col">
                            <Text className="font-bold text-error text-base">System Alert: {systemStatus.status.toUpperCase()}</Text>
                            <Text className="text-on-error-container text-sm mt-1">{systemStatus.message}</Text>
                        </View>
                    </View>
                )}

                {/* Hero Section */}
                <View className="w-full flex-col mb-4">
                    <Text className="font-headline-md text-3xl md:text-4xl font-bold text-primary">How can we help you?</Text>
                </View>

                <View className="flex-col md:flex-row gap-8">
                    
                    {/* Left Column: Learning & FAQs & Resources */}
                    <View className="flex-[2] flex-col gap-8">
                        
                        {/* Learn YRecall */}
                        <View className="bg-white rounded-[24px] p-6 shadow-sm border-[#006e6e]/10 flex-col">
                            <Text className="font-title-sm text-xl font-bold text-primary mb-6">Learn YRecall</Text>
                            <View className="flex-col sm:flex-row gap-4">
                                {/* Guide 1 */}
                                <TouchableOpacity onPress={() => router.push({ pathname: '/support/guide', params: { id: '1' }})} className="flex-1 flex-col group">
                                    <View className="w-full aspect-video rounded-xl overflow-hidden mb-3 relative bg-surface-container-high items-center justify-center">
                                        <Image source={{ uri: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=400&auto=format&fit=crop' }} className="absolute inset-0 w-full h-full opacity-80" />
                                        <View className="w-12 h-12 rounded-full bg-primary/90 items-center justify-center shadow-sm">
                                            <MaterialIcons name="menu-book" size={24} color="#ffffff" />
                                        </View>
                                    </View>
                                    <Text className="font-bold text-base text-primary mb-1">Getting Started</Text>
                                    <Text className="text-xs text-outline">5 min read</Text>
                                </TouchableOpacity>

                                {/* Guide 2 */}
                                <TouchableOpacity onPress={() => router.push({ pathname: '/support/guide', params: { id: '2' }})} className="flex-1 flex-col group">
                                    <View className="w-full aspect-video rounded-xl overflow-hidden mb-3 relative bg-surface-container-high items-center justify-center">
                                        <Image source={{ uri: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=400&auto=format&fit=crop' }} className="absolute inset-0 w-full h-full opacity-80" />
                                        <View className="w-12 h-12 rounded-full bg-primary/90 items-center justify-center shadow-sm">
                                            <MaterialIcons name="menu-book" size={24} color="#ffffff" />
                                        </View>
                                    </View>
                                    <Text className="font-bold text-base text-primary mb-1">Organize Your Life</Text>
                                    <Text className="text-xs text-outline">7 min read</Text>
                                </TouchableOpacity>
                                
                                {/* Guide 3 */}
                                <TouchableOpacity onPress={() => router.push({ pathname: '/support/guide', params: { id: '3' }})} className="flex-1 flex-col group">
                                    <View className="w-full aspect-video rounded-xl overflow-hidden mb-3 relative bg-surface-container-high items-center justify-center">
                                        <Image source={{ uri: 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=400&auto=format&fit=crop' }} className="absolute inset-0 w-full h-full opacity-80" />
                                        <View className="w-12 h-12 rounded-full bg-primary/90 items-center justify-center shadow-sm">
                                            <MaterialIcons name="menu-book" size={24} color="#ffffff" />
                                        </View>
                                    </View>
                                    <Text className="font-bold text-base text-primary mb-1">Unlock Full Power</Text>
                                    <Text className="text-xs text-outline">10 min read</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* FAQs Accordion */}
                        <View className="bg-white rounded-[24px] p-6 shadow-sm border-[#006e6e]/10 flex-col">
                            <Text className="font-title-sm text-xl font-bold text-primary mb-6">Frequently Asked Questions</Text>
                            <View className="flex-col">
                                {faqs.length === 0 ? (
                                    <ActivityIndicator color={colors.primary} className="my-4" />
                                ) : (
                                    faqs.map((faq, index) => (
                                        <View key={faq.id} className="border-b border-surface-variant pb-2 mb-2">
                                            <TouchableOpacity onPress={() => toggleFaq(index)} className="w-full flex-row justify-between items-center py-2">
                                                <Text className="font-medium text-base text-on-surface flex-1 pr-4">{faq.question}</Text>
                                                <MaterialIcons name={expandedFaq === index ? "expand-less" : "expand-more"} size={24} color={colors['on-surface']} />
                                            </TouchableOpacity>
                                            {expandedFaq === index && (
                                                <View className="pt-2 pb-4">
                                                    <View className="bg-primary/5 self-start px-2 py-1 rounded mb-2">
                                                        <Text className="text-[10px] font-bold text-primary uppercase">{faq.category}</Text>
                                                    </View>
                                                    <Text className="text-on-surface-variant text-base leading-relaxed">
                                                        {faq.answer}
                                                    </Text>
                                                </View>
                                            )}
                                        </View>
                                    ))
                                )}
                            </View>
                        </View>

                        {/* Resources */}
                        <View className="bg-white rounded-[24px] p-6 shadow-sm border-[#006e6e]/10 flex-col mb-8">
                            <Text className="font-title-sm text-xl font-bold text-primary mb-4">Resources</Text>
                            <View className="flex-row flex-wrap gap-2">
                                {resources.map((res, idx) => (
                                    <TouchableOpacity 
                                        key={idx} 
                                        onPress={() => Linking.openURL(res.url)} 
                                        className="px-4 py-2 bg-surface-container rounded-lg flex-row items-center gap-2 mb-2 mr-2 border border-outline-variant/30"
                                    >
                                        <Text className="font-medium text-sm text-primary">{res.title}</Text>
                                        <MaterialIcons name="open-in-new" size={14} color={colors.primary} />
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                    </View>

                    {/* Right Column: Contact & Bug Report */}
                    <View className="flex-[1] flex-col gap-8 min-w-[300px]">
                        
                        {/* Reach Us / Contact */}
                        <View className="bg-primary rounded-[24px] p-6 shadow-sm flex-col">
                            <Text className="font-title-sm text-xl font-bold text-white mb-3">Reach Us</Text>
                            <Text className="text-white/80 text-base mb-6 leading-relaxed">
                                Get in touch with our team for questions, partnerships, or general feedback.
                            </Text>
                            <View className="flex-col gap-3">
                                <TouchableOpacity onPress={() => router.push('/support/message')} className="w-full h-14 bg-surface rounded-xl flex-row items-center justify-center gap-2 shadow-sm">
                                    <MaterialIcons name="send" size={20} color={colors.primary} />
                                    <Text className="font-bold text-primary text-base">Send us a Message</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => router.push('/support/contact')} className="w-full h-14 border border-white/30 rounded-xl flex-row items-center justify-center gap-2">
                                    <MaterialIcons name="support-agent" size={20} color="#ffffff" />
                                    <Text className="font-bold text-white text-base">Contact Desk</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Report a Bug */}
                        <View className="bg-white rounded-[24px] p-6 shadow-sm border-[#006e6e]/10 flex-col">
                            <View className="flex-row items-center gap-2 mb-4">
                                <MaterialIcons name="bug-report" size={24} color={colors.error} />
                                <Text className="font-title-sm text-xl font-bold text-primary">Report a Bug</Text>
                            </View>
                            
                            <View className="flex-col gap-4">
                                <View className="flex-col gap-1 relative z-20">
                                    <Text className="text-xs font-bold text-outline uppercase tracking-widest">Category</Text>
                                    <TouchableOpacity 
                                        onPress={() => !bugLoading && setShowBugCategory(!showBugCategory)}
                                        className="w-full h-12 px-4 bg-surface rounded-lg border border-outline-variant flex-row items-center justify-between"
                                    >
                                        <Text className="font-body-md text-sm text-on-surface">{bugCategory}</Text>
                                        <MaterialIcons name={showBugCategory ? "expand-less" : "expand-more"} size={20} color={colors.outline} />
                                    </TouchableOpacity>
                                    
                                    {showBugCategory && (
                                        <ScrollView className="absolute top-[65px] left-0 right-0 bg-white border border-outline-variant rounded-lg shadow-lg z-30 max-h-48">
                                            {bugCategories.map((cat, idx) => (
                                                <TouchableOpacity 
                                                    key={idx}
                                                    onPress={() => { setBugCategory(cat); setShowBugCategory(false); }}
                                                    className="p-3 border-b border-surface-variant"
                                                >
                                                    <Text className="text-sm text-on-surface">{cat}</Text>
                                                </TouchableOpacity>
                                            ))}
                                        </ScrollView>
                                    )}
                                </View>

                                <View className="flex-col gap-1 z-10">
                                    <Text className="text-xs font-bold text-outline uppercase tracking-widest">Title</Text>
                                    <TextInput 
                                        value={bugTitle}
                                        onChangeText={setBugTitle}
                                        placeholder="What went wrong?"
                                        className="w-full h-12 px-4 bg-surface rounded-lg border border-[#D1CDC7] font-body-md text-sm text-on-surface"
                                        placeholderTextColor={colors.outline}
                                        editable={!bugLoading}
                                    />
                                </View>
                                
                                <View className="flex-col gap-1 z-10">
                                    <Text className="text-xs font-bold text-outline uppercase tracking-widest">Description</Text>
                                    <TextInput 
                                        value={bugDesc}
                                        onChangeText={setBugDesc}
                                        placeholder="Steps to reproduce, expected behavior, actual result..."
                                        multiline
                                        maxLength={500}
                                        textAlignVertical="top"
                                        className="w-full h-32 p-4 bg-surface rounded-lg border border-[#D1CDC7] font-body-md text-sm text-on-surface"
                                        placeholderTextColor={colors.outline}
                                        editable={!bugLoading}
                                    />
                                    <Text className="text-xs text-outline self-end mt-1">{bugDesc.length} / 500 characters</Text>
                                </View>

                                <Text className="text-xs text-outline-variant text-center my-1">
                                    Device information will be included automatically.
                                </Text>

                                <TouchableOpacity 
                                    onPress={handleBugSubmit} 
                                    disabled={bugLoading}
                                    className="w-full h-12 rounded-lg flex-row items-center justify-center gap-2"
                                    style={{ backgroundColor: bugLoading ? 'rgba(0, 51, 102, 0.5)' : '#003366' }}
                                >
                                    {bugLoading ? (
                                        <ActivityIndicator color="#ffffff" size="small" />
                                    ) : (
                                        <>
                                            <MaterialIcons name="send" size={18} color="#ffffff" />
                                            <Text className="font-bold text-white text-sm">Submit Report</Text>
                                        </>
                                    )}
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </Screen>
    );
}
