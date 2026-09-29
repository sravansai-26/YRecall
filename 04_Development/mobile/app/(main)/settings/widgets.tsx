import { View, Text, TouchableOpacity, ActivityIndicator, Alert, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Screen } from '../../../src/shared/components';
import { colors } from '../../../src/shared/theme/colors';
import { useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { useWidgetPreferences, useUpdateWidgetPreferences } from '../../../src/modules/widgets/api';

export default function WidgetSettings() {
    const router = useRouter();
    
    const { data: preferences, isLoading } = useWidgetPreferences();
    const updatePreferences = useUpdateWidgetPreferences();

    const [selectedWidget, setSelectedWidget] = useState('search');

    useEffect(() => {
        if (preferences?.global_config?.selected_widget) {
            setSelectedWidget(preferences.global_config.selected_widget);
        }
    }, [preferences]);

    const handleSave = async () => {
        try {
            await updatePreferences.mutateAsync({
                selected_widget: selectedWidget
            });
            Alert.alert('Saved', 'Widget configuration saved to the engine. Active widgets will refresh on their next cycle.');
        } catch (e) {
            Alert.alert('Error', 'Failed to save configuration');
        }
    };

    const WIDGETS = [
        { id: 'search', title: 'YRecall Search', desc: 'Instantly search your memories and knowledge base from your home screen.', icon: 'search' },
        { id: 'capture', title: 'YRecall Quick Capture', desc: 'One-tap access to voice, text, or photo capture.', icon: 'bolt' },
        { id: 'brief', title: 'YRecall Daily Brief', desc: 'Your personalized AI summary of the day, updated every morning.', icon: 'auto-awesome' },
        { id: 'timeline', title: 'YRecall Timeline', desc: 'Glance at your most recent captured memories and events.', icon: 'history' },
    ];

    if (isLoading) {
        return (
            <Screen scrollable={false} className="items-center justify-center">
                <ActivityIndicator size="large" color={colors.primary} />
            </Screen>
        );
    }

    const renderWidgetPreview = () => {
        switch (selectedWidget) {
            case 'search':
                return (
                    <View className="bg-[#FFF8F1] rounded-[32px] p-4 shadow-xl w-[90%] flex-row items-center justify-between border border-black/5">
                        <View className="flex-row items-center gap-2 flex-1 pl-2">
                            <MaterialIcons name="search" size={24} color="#44474E" />
                            <Text className="text-[#44474E] text-base ml-1">Search your memory...</Text>
                        </View>
                        <View className="flex-row items-center gap-4 pr-1">
                            <MaterialIcons name="mic-none" size={26} color="#003D0B" />
                            <Image source={require('../../../assets/logos/yr-logo-widget.png')} style={{ width: 22, height: 22 }} />
                        </View>
                    </View>
                );
            case 'capture':
                return (
                    <View className="bg-[#FFF8F1] rounded-3xl p-5 shadow-xl w-[90%] border border-black/5">
                        <View className="flex-row items-center justify-between mb-8">
                            <Text className="text-[#1A1C1E] font-bold text-base">Capture</Text>
                            <Image source={require('../../../assets/logos/yr-logo-widget.png')} style={{ width: 18, height: 18 }} />
                        </View>
                        <View className="flex-row justify-between px-2">
                            <View className="items-center">
                                <View className="w-14 h-14 rounded-full bg-[#E8E1DA] items-center justify-center mb-2 shadow-sm">
                                    <MaterialIcons name="edit" size={24} color="#003D0B" />
                                </View>
                                <Text className="text-[12px] font-medium text-[#44474E]">Note</Text>
                            </View>
                            <View className="items-center">
                                <View className="w-14 h-14 rounded-full bg-[#E8E1DA] items-center justify-center mb-2 shadow-sm">
                                    <MaterialIcons name="mic-none" size={24} color="#003D0B" />
                                </View>
                                <Text className="text-[12px] font-medium text-[#44474E]">Voice</Text>
                            </View>
                            <View className="items-center">
                                <View className="w-14 h-14 rounded-full bg-[#E8E1DA] items-center justify-center mb-2 shadow-sm">
                                    <MaterialIcons name="camera-alt" size={24} color="#003D0B" />
                                </View>
                                <Text className="text-[12px] font-medium text-[#44474E]">Camera</Text>
                            </View>
                        </View>
                    </View>
                );
            case 'brief':
                return (
                    <View className="bg-[#FFF8F1] rounded-[28px] p-5 shadow-xl w-[90%] h-64 border border-black/5 flex-col justify-between">
                        <View className="flex-col">
                            <View className="flex-row items-center justify-between mb-8">
                                <View className="flex-row items-center gap-2">
                                    <MaterialIcons name="lightbulb-outline" size={20} color="#003D0B" />
                                    <Text className="font-bold text-[#1A1C1E] text-base">Morning Brief</Text>
                                </View>
                                <Image source={require('../../../assets/logos/yr-logo-widget.png')} style={{ width: 18, height: 18 }} />
                            </View>
                            <Text className="text-[#1A1C1E] text-[15px] leading-[22px] font-normal">
                                You have captured 1 memories. Your AI companion is analyzing your latest thoughts.
                            </Text>
                        </View>
                        <Text className="text-[#44474E] text-[11px]">Updated about 22 hours ago</Text>
                    </View>
                );
            case 'timeline':
                return (
                    <View className="bg-[#FFF8F1] rounded-[28px] p-5 shadow-xl w-[90%] h-72 border border-black/5 flex-col justify-between">
                        <View className="flex-col">
                            <View className="flex-row items-center justify-between mb-8">
                                <View className="flex-row items-center gap-2">
                                    <MaterialIcons name="access-time" size={20} color="#003D0B" />
                                    <Text className="font-bold text-[#1A1C1E] text-base">Recent Memories</Text>
                                </View>
                                <Image source={require('../../../assets/logos/yr-logo-widget.png')} style={{ width: 18, height: 18 }} />
                            </View>
                            
                            <View className="flex-col gap-5 px-1">
                                <View className="flex-row items-center gap-4">
                                    <View className="w-2.5 h-2.5 rounded-full bg-[#003D0B]" />
                                    <Text className="text-[#1A1C1E] text-[15px]">Backend Deployment</Text>
                                </View>
                                <View className="flex-row items-center gap-4">
                                    <View className="w-2.5 h-2.5 rounded-full bg-[#E8E1DA]" />
                                    <Text className="text-[#44474E] text-[15px]">Testing Notes 2</Text>
                                </View>
                                <View className="flex-row items-center gap-4">
                                    <View className="w-2.5 h-2.5 rounded-full bg-[#E8E1DA]" />
                                    <Text className="text-[#44474E] text-[15px]">Testing Notes</Text>
                                </View>
                            </View>
                        </View>
                        <Text className="text-[#44474E] text-[11px]">Syncing...</Text>
                    </View>
                );
            default:
                return null;
        }
    };

    return (
        <Screen scrollable={true} className="pb-24">
            {/* TopAppBar */}
            <View className="w-full sticky top-0 z-50 bg-surface flex-row items-center justify-between px-margin-mobile md:px-margin-desktop h-16">
                <View className="flex-row items-center gap-4">
                    <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2 rounded-full ">
                        <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
                    </TouchableOpacity>
                    <Text className="font-headline-md text-2xl text-primary font-bold">Widget Settings</Text>
                </View>
            </View>

            <View className="max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop py-6 flex-col md:flex-row gap-8 w-full">
                
                {/* Selection & Customization Column */}
                <View className="flex-col gap-8 flex-1 w-full md:w-[60%]">
                    
                    {/* Guide Section */}
                    <View className="bg-primary/10 rounded-[24px] p-6">
                        <View className="flex-row items-center gap-3 mb-3">
                            <MaterialIcons name="info-outline" size={24} color={colors.primary} />
                            <Text className="font-bold text-primary text-lg">Using Widgets</Text>
                        </View>
                        <Text className="text-on-surface-variant text-sm leading-relaxed">
                            Widgets allow you to access YRecall instantly from your device's home screen. Long-press on an empty space on your home screen to add a widget, then select YRecall from the list. Choose one of the active widgets below to configure what appears.
                        </Text>
                    </View>

                    {/* Widget Selection */}
                    <View className="flex-col">
                        <Text className="font-title-sm text-xl font-bold text-on-surface mb-4">Select Active Widget</Text>
                        <View className="bg-white rounded-[24px] p-2 shadow-sm flex-col gap-1">
                            {WIDGETS.map((widget) => (
                                <TouchableOpacity 
                                    key={widget.id}
                                    onPress={() => setSelectedWidget(widget.id)}
                                    className="flex-row items-center justify-between p-4 rounded-xl active:bg-surface-container"
                                >
                                    <View className="flex-row items-center gap-4 flex-1 pr-4">
                                        <View className={`w-12 h-12 rounded-full flex items-center justify-center ${selectedWidget === widget.id ? 'bg-primary-container' : 'bg-surface-container'}`}>
                                            <MaterialIcons name={widget.icon as any} size={24} color={selectedWidget === widget.id ? colors['on-primary-container'] : colors.primary} />
                                        </View>
                                        <View className="flex-col flex-1">
                                            <Text className="font-body-md text-base font-semibold text-on-surface">{widget.title}</Text>
                                            <Text className="font-caption-sm text-xs text-on-surface-variant leading-snug mt-0.5">{widget.desc}</Text>
                                        </View>
                                    </View>
                                    <MaterialIcons name={selectedWidget === widget.id ? "radio-button-checked" : "radio-button-unchecked"} size={24} color={selectedWidget === widget.id ? colors.primary : colors['outline-variant']} />
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                    
                    <TouchableOpacity onPress={handleSave} disabled={updatePreferences.isPending} className={`w-full mt-4 h-14 rounded-2xl flex-row items-center justify-center gap-2 shadow-md ${updatePreferences.isPending ? 'bg-surface-variant' : 'bg-primary'}`}>
                        {updatePreferences.isPending ? <ActivityIndicator color={colors['on-surface-variant']} /> : <Text className={`font-bold text-base ${updatePreferences.isPending ? 'text-on-surface-variant' : 'text-white'}`}>Save Widget Preference</Text>}
                    </TouchableOpacity>

                </View>

                {/* Preview Area Column */}
                <View className="flex-col w-full md:w-[40%] sticky top-20">
                    <Text className="font-title-sm text-xl font-bold text-on-surface mb-4">Live Preview</Text>
                    
                    <View className="relative bg-surface-dim rounded-[48px] p-6 border-[8px] border-on-surface aspect-[9/19] shadow-2xl flex-col justify-start overflow-hidden">
                        {/* Phone Notch Mockup */}
                        <View className="absolute top-0 left-1/2 -ml-16 w-32 h-6 bg-on-surface rounded-b-2xl z-10" />
                        
                        <View className="mt-8 flex-col items-center">
                            <Text className="text-4xl font-bold text-on-surface opacity-80">09:41</Text>
                            <Text className="text-sm font-medium text-on-surface opacity-60">Tuesday, Oct 24</Text>
                        </View>

                        {/* Widget Preview Container */}
                        <View className="mt-12 w-full flex-row justify-center">
                            {renderWidgetPreview()}
                        </View>
                        
                        {/* Mock bottom icons */}
                        <View className="absolute bottom-8 left-6 right-6 flex-row justify-between opacity-40">
                            <View className="w-12 h-12 rounded-2xl bg-on-surface-variant" />
                            <View className="w-12 h-12 rounded-2xl bg-on-surface-variant" />
                            <View className="w-12 h-12 rounded-2xl bg-on-surface-variant" />
                            <View className="w-12 h-12 rounded-2xl bg-on-surface-variant" />
                        </View>
                        <View className="absolute bottom-2 left-1/2 -ml-16 w-32 h-1 bg-on-surface rounded-full opacity-20" />
                    </View>
                </View>

            </View>
        </Screen>
    );
}
