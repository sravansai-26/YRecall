import { View, Text, ScrollView, TouchableOpacity, Switch, ActivityIndicator, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Screen } from '../../../src/shared/components';
import { colors } from '../../../src/shared/theme/colors';
import { useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { useExperienceSettings, useUpdateExperienceSettings } from '../../../src/shared/hooks/useExperience';
import { SUPPORTED_LANGUAGES, getLanguageByCode } from '../../../src/shared/i18n';
import { useTranslation } from '../../../src/shared/providers/ExperienceProvider';

export default function ExperienceCenter() {
 const router = useRouter();
 
 const { data: settings, isLoading: isSettingsLoading } = useExperienceSettings();
 const updateSettings = useUpdateExperienceSettings();
 const { t } = useTranslation();

 const [form, setForm] = useState<any>({});
 const [showLanguageModal, setShowLanguageModal] = useState(false);

 useEffect(() => {
 if (settings) {
 setForm(settings);
 }
 }, [settings]);

 const handleSave = () => {
 updateSettings.mutate(form, {
 onSuccess: () => Alert.alert('Saved', 'Experience settings updated successfully. The app will immediately adapt to your preferences.')
 });
 };

 const updateField = (key: string, value: any) => {
 setForm((prev: any) => ({ ...prev, [key]: value }));
 };

 if (isSettingsLoading) {
 return (
 <Screen scrollable={false} className="flex-1 items-center justify-center bg-surface">
 <ActivityIndicator size="large" color={colors.primary} />
 </Screen>
 );
 }

 const SectionTitle = ({ title, icon }: { title: string, icon: any }) => (
 <View className="flex-row items-center gap-2 mb-4 mt-8">
 <View className="bg-primary/10 p-2 rounded-lg">
 <MaterialIcons name={icon} size={20} color={colors.primary} />
 </View>
 <Text className="font-title-sm text-lg font-bold text-on-surface">{title}</Text>
 </View>
 );

 const ToggleSetting = ({ label, description, value, onToggle }: any) => (
 <View className="flex-row items-center justify-between py-3 ">
 <View className="flex-1 pr-4">
 <Text className="font-body-md text-base font-medium text-on-surface">{label}</Text>
 <Text className="font-body-sm text-xs text-on-surface-variant mt-0.5">{description}</Text>
 </View>
 <Switch 
 value={value} 
 onValueChange={onToggle}
 trackColor={{ false: colors['surface-container-highest'], true: colors.primary }}
 thumbColor={colors['on-primary']}
 />
 </View>
 );

 const ChoiceSelector = ({ label, options, value, onSelect }: any) => (
 <View className="mb-6 mt-2">
 <Text className="font-label-sm text-xs text-on-surface-variant font-bold mb-2 ml-1">{label}</Text>
 <View className="flex-row flex-wrap gap-2">
 {options.map((opt: {id: string, label: string}) => (
 <TouchableOpacity 
 key={opt.id}
 onPress={() => onSelect(opt.id)}
 className={`px-4 py-2 rounded-full ${value === opt.id ? 'bg-primary border-primary' : 'bg-surface-container-lowest '}`}
 >
 <Text className={`font-medium text-sm ${value === opt.id ? 'text-white' : 'text-on-surface'}`}>{opt.label}</Text>
 </TouchableOpacity>
 ))}
 </View>
 </View>
 );
 
 const InfoBadge = ({ label, value }: { label: string, value: string }) => (
 <View className="bg-white/10 rounded-xl p-3 flex-row justify-between mb-2">
 <Text className="text-white/90 text-sm">{label}</Text>
 <Text className="text-secondary-container font-bold text-sm">{value}</Text>
 </View>
 );

 return (
 <Screen scrollable={true} className="pb-32 bg-surface">
 <View className="w-full sticky top-0 z-50 bg-surface/90 flex-row items-center justify-between px-margin-mobile h-16 ">
 <View className="flex-row items-center gap-4">
 <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2 rounded-full ">
 <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
 </TouchableOpacity>
 <Text className="font-title-sm text-xl text-primary font-bold">{t('experience.title')}</Text>
 </View>
 <TouchableOpacity onPress={handleSave} className="bg-primary px-4 py-1.5 rounded-full">
 {updateSettings.isPending ? <ActivityIndicator size="small" color="white" /> : <Text className="text-white font-bold text-sm">{t('save')}</Text>}
 </TouchableOpacity>
 </View>

 <View className="max-w-2xl mx-auto px-margin-mobile w-full pb-20">
 
 {/* Intro */}
 <View className="mt-6 mb-2">
 <Text className="font-headline-sm text-2xl font-bold text-on-surface mb-2">{t('experience.title')}</Text>
 <Text className="text-on-surface-variant font-body-sm text-sm leading-relaxed">
 {t('experience.description')}
 </Text>
 </View>
 
 {/* 1. Experience Overview */}
 <View className="bg-primary p-5 rounded-[24px] mt-6 shadow-sm">
 <View className="flex-row items-center gap-4 mb-4">
 <View className="bg-secondary p-3 rounded-full">
 <MaterialIcons name="dashboard-customize" size={28} color="white" />
 </View>
 <View>
 <Text className="text-white/70 text-xs font-bold uppercase tracking-wider">{t('experience.current')}</Text>
 <Text className="text-white text-xl font-bold">{t('experience.personalized')}</Text>
 </View>
 </View>
 <InfoBadge label={t('language.label')} value={getLanguageByCode(form.language)?.name || 'English'} />
 <InfoBadge label={t('theme.label')} value={form.theme === 'light' ? t('theme.light') : form.theme === 'dark' ? t('theme.dark') : t('theme.system')} />
 <InfoBadge label={t('display.label')} value={form.display_density || 'comfortable'} />
 <InfoBadge label={t('accessibility.label')} value={form.high_contrast || form.color_blind_friendly ? 'Active' : 'Standard'} />
 </View>

 {/* 2. Language & Localization */}
 <SectionTitle title={t('language.title')} icon="translate" />
 <View className="bg-surface-container-lowest p-4 rounded-2xl">
 <Text className="text-sm text-on-surface-variant mb-4">
 {t('language.desc')}
 </Text>
 <TouchableOpacity 
 onPress={() => setShowLanguageModal(!showLanguageModal)}
 className="flex-row items-center justify-between bg-surface-container-low p-4 rounded-xl"
 >
 <View className="flex-row items-center gap-3">
 <MaterialIcons name="language" size={24} color={colors.primary} />
 <View>
 <Text className="font-bold text-on-surface">{getLanguageByCode(form.language)?.name}</Text>
 <Text className="text-xs text-on-surface-variant">{getLanguageByCode(form.language)?.nativeName}</Text>
 </View>
 </View>
 <MaterialIcons name={showLanguageModal ? "expand-less" : "expand-more"} size={24} color={colors.outline} />
 </TouchableOpacity>
 
 {showLanguageModal && (
 <View className="mt-4 max-h-64 rounded-xl overflow-hidden">
 <ScrollView nestedScrollEnabled className="bg-surface-container-lowest">
 {SUPPORTED_LANGUAGES.map((lang) => (
 <TouchableOpacity
 key={lang.code}
 onPress={() => {
 updateField('language', lang.code);
 setShowLanguageModal(false);
 }}
 className={`flex-row justify-between items-center p-4 ${form.language === lang.code ? 'bg-primary/5' : ''}`}
 >
 <View>
 <Text className={`font-medium ${form.language === lang.code ? 'text-primary font-bold' : 'text-on-surface'}`}>{lang.name}</Text>
 <Text className="text-xs text-on-surface-variant">{lang.nativeName}</Text>
 </View>
 {form.language === lang.code && <MaterialIcons name="check" size={20} color={colors.primary} />}
 </TouchableOpacity>
 ))}
 </ScrollView>
 </View>
 )}
 </View>

 {/* 3. Theme Management */}
 <SectionTitle title={t('theme.title')} icon="brightness-medium" />
 <View className="bg-surface-container-lowest p-4 rounded-2xl">
 <ChoiceSelector 
 label={t('theme.sync')} 
 options={[
 {id: 'light', label: t('theme.light')}, 
 {id: 'dark', label: t('theme.dark')}, 
 {id: 'system', label: t('theme.system')}
 ]} 
 value={form.theme} 
 onSelect={(v: string) => updateField('theme', v)} 
 />
 <View className="h-[1px] bg-outline-variant/20 mb-4" />
 <Text className="font-label-sm text-xs text-on-surface-variant font-bold mb-3 ml-1">{t('theme.accent')}</Text>
 <View className="flex-row flex-wrap gap-4 mb-2 ml-1">
 {['default', 'blue', 'green', 'purple', 'orange'].map(color => (
 <TouchableOpacity 
 key={color}
 onPress={() => updateField('accent_color', color)}
 className={`w-10 h-10 rounded-full border-2 items-center justify-center ${form.accent_color === color ? 'border-primary' : 'border-transparent'}`}
 >
 <View className={`w-8 h-8 rounded-full ${color === 'default' ? 'bg-[#5e5853]' : color === 'blue' ? 'bg-[#1a73e8]' : color === 'green' ? 'bg-[#1e8e3e]' : color === 'purple' ? 'bg-[#8430ce]' : 'bg-[#e37400]'}`} />
 </TouchableOpacity>
 ))}
 </View>
 </View>

 {/* 4. Typography & Display */}
 <SectionTitle title={t('typography.title')} icon="font-download" />
 <View className="bg-surface-container-lowest p-4 rounded-2xl">
 <ChoiceSelector 
 label={t('typography.font')} 
 options={[
 {id: 'small', label: 'Small'}, 
 {id: 'medium', label: 'Medium'}, 
 {id: 'large', label: 'Large'}, 
 {id: 'xlarge', label: 'X-Large'}
 ]} 
 value={form.font_size} 
 onSelect={(v: string) => updateField('font_size', v)} 
 />
 <ChoiceSelector 
 label={t('typography.density')} 
 options={[
 {id: 'compact', label: 'Compact'}, 
 {id: 'comfortable', label: 'Comfort'}, 
 {id: 'spacious', label: 'Spacious'}
 ]} 
 value={form.display_density} 
 onSelect={(v: string) => updateField('display_density', v)} 
 />
 </View>

 {/* 5. Reading & Motion */}
 <SectionTitle title={t('reading.title')} icon="menu-book" />
 <View className="bg-surface-container-lowest p-4 rounded-2xl">
 <ToggleSetting label={t('reading.focus')} description={t('reading.focus.desc')} value={form.reading_mode} onToggle={(v: boolean) => updateField('reading_mode', v)} />
 <ToggleSetting label={t('motion.reduce')} description={t('motion.reduce.desc')} value={form.reduce_motion} onToggle={(v: boolean) => updateField('reduce_motion', v)} />
 </View>
 
 {/* 6. Accessibility */}
 <SectionTitle title={t('access.title')} icon="accessibility-new" />
 <View className="bg-surface-container-lowest p-4 rounded-2xl mb-6">
 <ToggleSetting label={t('access.contrast')} description={t('access.contrast.desc')} value={form.high_contrast} onToggle={(v: boolean) => updateField('high_contrast', v)} />
 <ToggleSetting label={t('access.color')} description={t('access.color.desc')} value={form.color_blind_friendly} onToggle={(v: boolean) => updateField('color_blind_friendly', v)} />
 <ToggleSetting label={t('access.screen')} description={t('access.screen.desc')} value={form.screen_reader_optimization} onToggle={(v: boolean) => updateField('screen_reader_optimization', v)} />
 </View>

 </View>
 </Screen>
 );
}
