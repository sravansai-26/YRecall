import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Screen } from '../../../src/shared/components';
import { colors } from '../../../src/shared/theme/colors';

export default function GuideScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();

    const guides = {
        '1': {
            title: "Getting Started with YRecall",
            readTime: "5 min",
            progress: "100%",
            image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop",
            sections: [
                { 
                    title: "What is YRecall?", 
                    content: "YRecall is your AI Life OS, designed to help you capture, organize, and recall your digital life seamlessly. Instead of scattering your thoughts across note-taking apps, voice recorders, and bookmark managers, YRecall provides a unified, intelligent home for your entire mind. It leverages advanced on-device and cloud AI to actively understand the context behind everything you save.",
                    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop"
                },
                { 
                    title: "Your Daily Workflow", 
                    content: "Start your day by capturing quick thoughts, voice memos, or photos using our intuitive mobile widgets. You don't need to categorize them—YRecall automatically indexes and places every capture onto your Timeline. As your day progresses, you can review your Timeline to see a beautiful, chronological narrative of your ideas, meetings, and inspirations.",
                    image: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=800&auto=format&fit=crop"
                },
                { 
                    title: "First AI Conversation", 
                    content: "When you need to remember something, simply ask your AI companion. Go to the 'Ask AI' tab and type or speak: 'What was that book John recommended last week?' The AI acts as an extension of your brain, scanning your Knowledge Graph to provide an instant, accurate answer complete with citations to your original note.",
                    image: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?q=80&w=800&auto=format&fit=crop"
                }
            ]
        },
        '2': {
            title: "Organize Your Digital Life",
            readTime: "7 min",
            progress: "0%",
            image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=800&auto=format&fit=crop",
            sections: [
                { 
                    title: "Capturing Everything", 
                    content: "The true power of YRecall lies in its multi-modal capture capabilities. Use the Quick Capture widget for instant text notes, voice dictations, camera snaps, PDF uploads, and URL bookmarks. Behind the scenes, your location, the current weather, and the exact time are contextually tagged, enriching your memory without any manual effort.",
                    image: "https://images.unsplash.com/photo-1616469829581-73993eb86b02?q=80&w=800&auto=format&fit=crop"
                },
                { 
                    title: "The Knowledge Graph", 
                    content: "Unlike traditional folders, YRecall maps dynamic connections between your memories. The Knowledge Graph visualizes how a meeting note from today connects to a voice memo you recorded three months ago about the same project. This semantic linking allows you to discover hidden patterns and ideas you might have otherwise forgotten.",
                    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop"
                },
                { 
                    title: "AI Daily Brief", 
                    content: "Start your morning with the Daily Brief widget. It delivers an AI-generated, personalized summary of yesterday's key events and today's impending priorities based on your captured data. It highlights unresolved thoughts and gently nudges you to complete open loops, acting as your proactive digital assistant.",
                    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=800&auto=format&fit=crop"
                }
            ]
        },
        '3': {
            title: "Unlock the Full Power",
            readTime: "10 min",
            progress: "0%",
            image: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=800&auto=format&fit=crop",
            sections: [
                { 
                    title: "AI Personas", 
                    content: "Customize exactly how the AI talks to you. Want a formal executive assistant who gives bullet-point summaries? Or a casual, philosophical companion who brainstorms with you? Navigate to Settings > AI Preferences to select or create a persona that perfectly matches your workflow and personality.",
                    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=800&auto=format&fit=crop"
                },
                { 
                    title: "Automations & Intent Engines", 
                    content: "Take YRecall to the next level by setting up intent engines. You can instruct the AI to automatically tag any mention of 'taxes' with a 'Finance' label, or alert you if a captured meeting note contains action items. These automations run quietly in the background, continuously organizing your life.",
                    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop"
                },
                { 
                    title: "Privacy First Architecture", 
                    content: "Your most personal thoughts deserve the highest level of security. Your data is end-to-end encrypted before it ever leaves your device. If you're working on highly sensitive material, you can instantly toggle 'Privacy Mode' to pause all cloud syncing and external AI processing, keeping everything strictly local.",
                    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=800&auto=format&fit=crop"
                }
            ]
        }
    };

    const guide = guides[id as keyof typeof guides] || guides['1'];

    return (
        <Screen scrollable={true} className="pb-24 bg-[#FCFAF7]">
            {/* TopAppBar */}
            <View className="w-full sticky top-0 z-50 bg-surface flex-row items-center px-margin-mobile md:px-margin-desktop h-16 shadow-sm">
                <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2 rounded-full mr-4">
                    <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
                </TouchableOpacity>
                <Text className="font-headline-md text-xl font-bold text-primary">Learn YRecall</Text>
            </View>

            <View className="max-w-3xl mx-auto px-margin-mobile md:px-margin-desktop py-8 flex-col gap-8 w-full">
                
                {/* Hero */}
                <View className="w-full aspect-video bg-primary/10 rounded-3xl overflow-hidden items-center justify-center relative">
                    <Image source={{ uri: guide.image }} className="absolute inset-0 w-full h-full opacity-90" />
                    <View className="absolute inset-0 bg-black/20" />
                    <View className="absolute bottom-4 left-6">
                        <View className="bg-white/90 px-3 py-1 rounded-full mb-2 self-start">
                            <Text className="text-xs font-bold text-primary">{guide.readTime} read</Text>
                        </View>
                    </View>
                </View>

                <View className="flex-col gap-2">
                    <Text className="font-headline-md text-3xl font-bold text-primary">{guide.title}</Text>
                    <View className="w-full h-2 bg-surface-variant rounded-full mt-4 overflow-hidden">
                        <View className="h-full bg-primary" style={{ width: guide.progress }} />
                    </View>
                    <Text className="text-xs text-outline mt-1 font-medium">{guide.progress} completed</Text>
                </View>

                {/* Content */}
                <View className="flex-col gap-6 mt-4">
                    {guide.sections.map((section, idx) => (
                        <View key={idx} className="flex-col gap-3">
                            <Text className="font-title-sm text-xl font-bold text-on-surface">{section.title}</Text>
                            <Text className="text-base text-on-surface-variant leading-relaxed">
                                {section.content}
                            </Text>
                            <View className="w-full aspect-video bg-surface-container rounded-2xl overflow-hidden items-center justify-center border border-outline-variant/30 mt-2">
                                <Image source={{ uri: section.image }} className="w-full h-full" resizeMode="cover" />
                            </View>
                        </View>
                    ))}
                </View>

                <TouchableOpacity 
                    onPress={() => router.back()}
                    className="w-full h-14 bg-primary rounded-xl flex-row items-center justify-center gap-2 mt-8"
                >
                    <MaterialIcons name="check" size={20} color="#ffffff" />
                    <Text className="font-bold text-white text-base">Complete Guide</Text>
                </TouchableOpacity>

            </View>
        </Screen>
    );
}
