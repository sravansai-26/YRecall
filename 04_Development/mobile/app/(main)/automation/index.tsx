import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Screen } from '../../../src/shared/components';
import { colors } from '../../../src/shared/theme/colors';
import { useRouter } from 'expo-router';
import { useReminders, useSuggestions, useUpdateReminder, useAcceptSuggestion, useDismissSuggestion } from '../../../src/shared/hooks/useAutomation';
import { format } from 'date-fns';

export default function AutomationCenterScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'tasks' | 'workflows'>('tasks');

  const { data: reminders, isLoading: loadingReminders } = useReminders("pending");
  const { data: suggestions, isLoading: loadingSuggestions } = useSuggestions();
  
  const updateReminder = useUpdateReminder();
  const acceptSuggestion = useAcceptSuggestion();
  const dismissSuggestion = useDismissSuggestion();

  return (
    <Screen scrollable={false}>
      {/* Top Header */}
      <View className="bg-surface z-50 h-16 w-full flex-row items-center px-margin-mobile border-b border-outline-variant/30">
        <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 items-center justify-center -ml-2 rounded-full">
          <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text className="font-title-lg font-bold text-primary ml-2">Automation Center</Text>
      </View>

      <View className="flex-1 w-full max-w-4xl mx-auto">
        {/* Tabs */}
        <View className="flex-row border-b border-outline-variant/30 mt-4 px-margin-mobile">
          <TouchableOpacity 
            onPress={() => setActiveTab('tasks')}
            className={`flex-1 pb-3 items-center border-b-2 ${activeTab === 'tasks' ? 'border-primary' : 'border-transparent'}`}
          >
            <Text className={`font-label-lg ${activeTab === 'tasks' ? 'text-primary font-bold' : 'text-on-surface-variant'}`}>AI Tasks</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => setActiveTab('workflows')}
            className={`flex-1 pb-3 items-center border-b-2 ${activeTab === 'workflows' ? 'border-primary' : 'border-transparent'}`}
          >
            <Text className={`font-label-lg ${activeTab === 'workflows' ? 'text-primary font-bold' : 'text-on-surface-variant'}`}>Workflows</Text>
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1 p-margin-mobile" contentContainerStyle={{ paddingBottom: 100 }}>
          {activeTab === 'tasks' && (
            <View className="gap-6">
              
              {/* AI Suggestions */}
              {suggestions && suggestions.length > 0 && (
                <View>
                  <Text className="font-title-sm text-primary font-bold mb-4">Suggested Actions</Text>
                  {suggestions.map((suggestion) => (
                    <View key={suggestion.id} className="bg-primary-container/20 rounded-2xl p-4 mb-3 border border-primary/20">
                      <View className="flex-row items-start justify-between">
                        <View className="flex-1 pr-4">
                          <View className="flex-row items-center mb-2">
                            <MaterialCommunityIcons name="robot-outline" size={16} color={colors.primary} className="mr-2" />
                            <Text className="font-label-sm text-primary uppercase tracking-wider">AI Suggestion</Text>
                          </View>
                          <Text className="font-title-md text-on-surface font-medium mb-1">
                            {suggestion.proposed_configuration?.title || 'Automated Task'}
                          </Text>
                          <Text className="font-body-md text-on-surface-variant mb-3">
                            {suggestion.reasoning}
                          </Text>
                        </View>
                      </View>
                      <View className="flex-row gap-3">
                        <TouchableOpacity 
                          className="bg-primary px-4 py-2 rounded-full"
                          onPress={() => acceptSuggestion.mutate(suggestion.id)}
                          disabled={acceptSuggestion.isPending}
                        >
                          <Text className="text-on-primary font-label-md">Accept</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                          className="bg-surface-container-high px-4 py-2 rounded-full"
                          onPress={() => dismissSuggestion.mutate(suggestion.id)}
                          disabled={dismissSuggestion.isPending}
                        >
                          <Text className="text-on-surface font-label-md">Dismiss</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                </View>
              )}

              {/* Active Reminders */}
              <View>
                <Text className="font-title-sm text-on-surface-variant font-bold mb-4">Pending Tasks</Text>
                
                {loadingReminders ? (
                  <ActivityIndicator color={colors.primary} />
                ) : reminders?.length === 0 ? (
                  <View className="py-10 items-center justify-center">
                    <MaterialCommunityIcons name="check-all" size={48} color={colors.outline} className="mb-4 opacity-50" />
                    <Text className="font-body-lg text-on-surface-variant">No pending tasks.</Text>
                  </View>
                ) : (
                  reminders?.map((reminder) => (
                    <View key={reminder.id} className="bg-surface-container rounded-2xl p-4 mb-3 flex-row items-start border border-outline-variant/30">
                      <TouchableOpacity 
                        className="mt-1 mr-4 w-6 h-6 rounded-full border-2 border-outline items-center justify-center"
                        onPress={() => updateReminder.mutate({ id: reminder.id, updates: { status: 'completed' } })}
                      >
                      </TouchableOpacity>
                      <View className="flex-1">
                        <Text className="font-title-md text-on-surface font-medium mb-1">{reminder.title}</Text>
                        {reminder.description && (
                          <Text className="font-body-md text-on-surface-variant mb-2">{reminder.description}</Text>
                        )}
                        <View className="flex-row items-center gap-4">
                          {reminder.due_date && (
                            <View className="flex-row items-center">
                              <MaterialIcons name="event" size={14} color={colors['on-surface-variant']} />
                              <Text className="font-label-sm text-on-surface-variant ml-1">
                                {format(new Date(reminder.due_date), 'MMM d, h:mm a')}
                              </Text>
                            </View>
                          )}
                          {reminder.priority === 'high' && (
                            <View className="bg-error-container/50 px-2 py-0.5 rounded-sm">
                              <Text className="text-error font-label-xs">High Priority</Text>
                            </View>
                          )}
                          {reminder.created_by_automation && (
                            <MaterialCommunityIcons name="robot-outline" size={14} color={colors.primary} />
                          )}
                        </View>
                      </View>
                    </View>
                  ))
                )}
              </View>

            </View>
          )}

          {activeTab === 'workflows' && (
            <View className="py-10 items-center justify-center">
              <MaterialCommunityIcons name="transit-connection-variant" size={64} color={colors.outline} className="mb-6 opacity-50" />
              <Text className="font-title-md text-on-surface font-bold text-center mb-2">Workflow Builder</Text>
              <Text className="font-body-md text-on-surface-variant text-center max-w-[280px]">
                Create custom automation sequences triggered by your captures or schedules.
              </Text>
              
              <TouchableOpacity className="bg-surface-container-high px-6 py-3 rounded-full mt-8">
                <Text className="font-label-lg text-primary">Create Workflow (Coming soon)</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </View>
    </Screen>
  );
}
