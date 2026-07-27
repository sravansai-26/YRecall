import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Switch, StyleSheet } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Screen } from '../../../src/shared/components';
import { colors } from '../../../src/shared/theme/colors';
import { useRouter } from 'expo-router';
import { 
 useReminders, 
 useUpdateReminder, 
 useAutomationStats,
 useWorkflows,
 useExecutions,
 useUpdateWorkflow,
 useDeleteWorkflow
} from '../../../src/shared/hooks/useAutomation';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';

export default function AutomationCenterScreen() {
 const router = useRouter();
 const { t } = useTranslation();

 // Queries
 const { data: stats, isLoading: loadingStats } = useAutomationStats();
 const { data: workflows, isLoading: loadingWorkflows } = useWorkflows();
 const { data: executions, isLoading: loadingExecutions } = useExecutions();
 const { data: reminders, isLoading: loadingReminders } = useReminders("pending");
 
 const updateReminder = useUpdateReminder();
 const updateWorkflow = useUpdateWorkflow();
 const deleteWorkflow = useDeleteWorkflow();

 const handleToggleWorkflow = (id: string, currentStatus: boolean) => {
 updateWorkflow.mutate({ id, updates: { is_active: !currentStatus } });
 };

 const handleDeleteWorkflow = (id: string) => {
 deleteWorkflow.mutate(id);
 };

 return (
 <Screen scrollable={false}>
 {/* Dynamic Header */}
 <View className="bg-surface z-50 h-16 w-full flex-row items-center justify-between px-margin-mobile border-outline-variant/20">
 <View className="flex-row items-center">
 <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 items-center justify-center -ml-2 rounded-full">
 <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
 </TouchableOpacity>
 <Text className="font-title-lg font-bold text-on-surface ml-2">{t('automation.title')}</Text>
 </View>
 
 {/* Pulsing AI Status */}
 <View className="flex-row items-center bg-primary/10 px-3 py-1.5 rounded-full">
 <MaterialCommunityIcons name="robot-outline" size={16} color={colors.primary} />
 <Text className="text-primary font-bold text-xs ml-1.5 tracking-wider">{t('automation.aiActive')}</Text>
 </View>
 </View>

 <ScrollView className="flex-1 bg-surface-container-lowest" contentContainerStyle={{ paddingBottom: 120 }}>
 
 {/* VALUE DELIVERED DASHBOARD */}
 <View style={styles.gradientHeader} className="bg-primary-container/30">
 <View className="px-margin-mobile pt-6 pb-2">
 <Text className="font-headline-sm font-bold text-on-surface mb-1">
 {t('automation.aiAssistantWorking')}
 </Text>
 <Text className="font-body-md text-on-surface-variant mb-6">
 {t('automation.automationDesc')}
 </Text>

 <View className="flex-row flex-wrap gap-3">
 <View className="flex-1 min-w-[100px] bg-surface-container-lowest p-4 rounded-3xl shadow-sm items-center justify-center">
 {loadingStats ? <ActivityIndicator size="small" color={colors.primary} /> : (
 <Text className="font-bold text-3xl text-primary">{stats?.completed_this_week ?? 0}</Text>
 )}
 <Text className="text-[10px] text-on-surface-variant uppercase font-bold mt-1 text-center">{t('automation.actionsTaken')}</Text>
 </View>

 <View className="flex-1 min-w-[100px] bg-surface-container-lowest p-4 rounded-3xl shadow-sm items-center justify-center">
 {loadingStats ? <ActivityIndicator size="small" color={colors.primary} /> : (
 <Text className="font-bold text-3xl text-secondary">{stats?.running_automations ?? 0}</Text>
 )}
 <Text className="text-[10px] text-on-surface-variant uppercase font-bold mt-1 text-center">{t('automation.activeWorkflows')}</Text>
 </View>

 <View className="flex-1 min-w-[100px] bg-surface-container-lowest p-4 rounded-3xl shadow-sm items-center justify-center">
 {loadingStats ? <ActivityIndicator size="small" color={colors.primary} /> : (
 <Text className="font-bold text-3xl text-green-600">{stats?.success_rate ?? 0}%</Text>
 )}
 <Text className="text-[10px] text-on-surface-variant uppercase font-bold mt-1 text-center">{t('automation.successRate')}</Text>
 </View>
 </View>
 </View>
 </View>

 <View className="px-margin-mobile mt-6">
 
 {/* ACTION REQUIRED: PENDING TASKS */}
 <View className="mb-8 animate-fade-in">
 <View className="flex-row justify-between items-center mb-4">
 <View className="flex-row items-center gap-2">
 <MaterialCommunityIcons name="checkbox-marked-circle-outline" size={20} color={colors['on-surface-variant']} />
 <Text className="font-title-md text-on-surface font-bold">{t('automation.actionRequired')}</Text>
 </View>
 {reminders && reminders.length > 0 && (
 <View className="bg-error px-2 py-0.5 rounded-full">
 <Text className="text-white text-[10px] font-bold">{reminders.length}</Text>
 </View>
 )}
 </View>
 <Text className="font-body-sm text-on-surface-variant mb-4 -mt-2">
 {t('automation.tasksScheduled')}
 </Text>

 {loadingReminders ? <ActivityIndicator color={colors.primary} /> : (!reminders || reminders.length === 0) ? (
 <View className="bg-surface-container rounded-3xl p-6 items-center shadow-sm">
 <MaterialCommunityIcons name="check-all" size={32} color={colors.outline} className="mb-2 opacity-50" />
 <Text className="text-sm font-bold text-on-surface-variant">{t('automation.allCaughtUp')}</Text>
 <Text className="text-xs text-on-surface-variant mt-1">{t('automation.noPendingActions')}</Text>
 </View>
 ) : (
 reminders.slice(0, 3).map((reminder) => (
 <View key={reminder.id} className="bg-surface-container rounded-2xl p-4 flex-row items-start mb-3 shadow-sm">
 <TouchableOpacity 
 className="mt-1 mr-4 w-6 h-6 rounded-full border-2 border-primary items-center justify-center bg-primary/5"
 onPress={() => updateReminder.mutate({ id: reminder.id, updates: { status: 'completed' } })}
 />
 <View className="flex-1">
 <Text className="font-title-md text-on-surface font-medium mb-1 leading-tight">{reminder.title}</Text>
 {reminder.description && (
 <Text className="font-body-sm text-on-surface-variant mb-2 leading-tight">{reminder.description}</Text>
 )}
 <View className="flex-row items-center gap-4 mt-2">
 {reminder.due_date && (
 <View className="flex-row items-center">
 <MaterialIcons name="event" size={14} color={colors['on-surface-variant']} />
 <Text className="font-label-sm text-on-surface-variant ml-1">
 {format(new Date(reminder.due_date), 'MMM d, h:mm a')}
 </Text>
 </View>
 )}
 {reminder.created_by_automation && (
 <View className="flex-row items-center bg-primary/10 px-2 rounded-sm py-0.5">
 <MaterialCommunityIcons name="robot-outline" size={12} color={colors.primary} />
 <Text className="text-[10px] text-primary font-bold ml-1 uppercase">AI Extracted</Text>
 </View>
 )}
 </View>
 </View>
 </View>
 ))
 )}
 </View>

 {/* ACTIVE WORKFLOWS */}
 <View className="mb-8 animate-fade-in">
 <View className="flex-row justify-between items-center mb-4">
 <View className="flex-row items-center gap-2">
 <MaterialCommunityIcons name="transit-connection-variant" size={20} color={colors['on-surface-variant']} />
 <Text className="font-title-md text-on-surface font-bold">{t('automation.backgroundWorkflows')}</Text>
 </View>
 <TouchableOpacity 
 onPress={() => router.push('/automation/create')} 
 className="bg-primary/10 px-3 py-1.5 rounded-full flex-row items-center gap-1"
 >
 <MaterialIcons name="add" size={16} color={colors.primary} />
 <Text className="text-primary font-bold text-xs uppercase tracking-wider">{t('automation.new')}</Text>
 </TouchableOpacity>
 </View>
 <Text className="font-body-sm text-on-surface-variant mb-4 -mt-2">
 {t('automation.backgroundRules')}
 </Text>

 {loadingWorkflows ? <ActivityIndicator color={colors.primary} /> : (!workflows || workflows.length === 0) ? (
 <View className="bg-surface-container rounded-3xl p-8 items-center shadow-sm">
 <MaterialCommunityIcons name="robot-off-outline" size={40} color={colors.outline} className="mb-3 opacity-50" />
 <Text className="font-title-sm text-on-surface font-bold text-center mb-1">No Active Automations</Text>
 <Text className="text-xs text-on-surface-variant text-center mb-4">Setup rules to let the AI summarize meetings and organize your graph automatically.</Text>
 <TouchableOpacity onPress={() => router.push('/automation/create')} className="bg-primary px-6 py-2.5 rounded-full shadow-sm">
 <Text className="text-white font-bold">Browse Templates</Text>
 </TouchableOpacity>
 </View>
 ) : (
 workflows.map((wf) => (
 <View key={wf.id} className={`bg-surface-container-lowest rounded-2xl p-4 shadow-sm mb-3 ${wf.is_active ? ' bg-primary/5' : ''}`}>
 <View className="flex-row justify-between items-start">
 <View className="flex-1 pr-4">
 <Text className="font-title-md font-bold text-on-surface mb-1">{wf.name}</Text>
 <Text className="font-body-xs text-on-surface-variant leading-tight">{wf.description}</Text>
 </View>
 <View className="flex-row items-center gap-2">
 <Switch 
 value={wf.is_active} 
 onValueChange={() => handleToggleWorkflow(wf.id, wf.is_active)}
 trackColor={{ false: colors['surface-container-highest'], true: colors.primary }}
 thumbColor={colors['on-primary']}
 />
 <TouchableOpacity 
 onPress={() => handleDeleteWorkflow(wf.id)}
 className="w-8 h-8 rounded-full bg-error/10 items-center justify-center border-error/20"
 >
 <MaterialIcons name="delete-outline" size={16} color={colors.error} />
 </TouchableOpacity>
 </View>
 </View>
 <View className="flex-row mt-3 gap-2 border-t border-transparent pt-3">
 <Text className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">{wf.triggers[0]?.trigger_type.replace('_', ' ')}</Text>
 <MaterialIcons name="arrow-right-alt" size={14} color={colors.primary} />
 <Text className="text-[10px] text-primary font-bold uppercase tracking-widest">{wf.actions[0]?.action_type.replace('_', ' ')}</Text>
 </View>
 </View>
 ))
 )}
 </View>

 {/* ACTIVITY STREAM */}
 <View className="mb-4 animate-fade-in">
 <View className="flex-row items-center gap-2 mb-4">
 <MaterialIcons name="history" size={20} color={colors['on-surface-variant']} />
 <Text className="font-title-md text-on-surface font-bold">{t('automation.liveActivityStream')}</Text>
 </View>
 <Text className="font-body-sm text-on-surface-variant mb-4 -mt-2">
 {t('automation.liveActivityDesc')}
 </Text>

 {loadingExecutions ? <ActivityIndicator color={colors.primary} /> : (!executions || executions.length === 0) ? (
 <View className="bg-surface-container rounded-3xl p-6 items-center shadow-sm">
 <Text className="text-sm font-bold text-on-surface-variant">Stream is quiet.</Text>
 </View>
 ) : (
 <View className="border-l-2 border-outline-variant/20 ml-4 pl-4 py-2 gap-6">
 {executions.slice(0, 5).map((exec) => (
 <View key={exec.id} className="relative">
 {/* Timeline Dot */}
 <View className={`absolute -left-[23px] top-1 w-4 h-4 rounded-full border-2 border-surface bg-surface-container-lowest items-center justify-center`}>
 <View className={`w-2 h-2 rounded-full ${exec.status === 'success' ? 'bg-primary' : exec.status === 'failed' ? 'bg-error' : 'bg-secondary'}`} />
 </View>
 
 <Text className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider mb-0.5">
 {format(new Date(exec.started_at), 'MMM d, h:mm a')}
 </Text>
 <Text className="font-title-sm text-on-surface font-bold mb-1">{exec.workflow_name || 'System Task'}</Text>
 
 {exec.logs && exec.logs.length > 0 && (
 <View className="bg-surface-container p-2 rounded-xl mt-1 ">
 {exec.logs.map((l, idx) => (
 <Text key={idx} className="text-[10px] text-on-surface-variant font-mono">
 &gt; {l.message}
 </Text>
 ))}
 </View>
 )}
 {exec.error_message && (
 <View className="bg-error-container/30 p-2 rounded-xl mt-1">
 <Text className="text-xs text-error">{exec.error_message}</Text>
 </View>
 )}
 </View>
 ))}
 </View>
 )}
 </View>

 </View>
 </ScrollView>
 </Screen>
 );
}

const styles = StyleSheet.create({
 gradientHeader: {
 borderBottomWidth: 1,
 borderBottomColor: 'rgba(0,0,0,0.05)',
 }
});
