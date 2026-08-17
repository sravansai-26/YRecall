import React, { useState, memo } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, FlatList, TextInput, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Screen } from '../../src/shared/components';
import { colors } from '../../src/shared/theme/colors';
import { useRouter } from 'expo-router';
import { useWorkspaces, useCreateWorkspace } from '../../src/modules/workspaces/api';
import { useWorkspaceStore } from '../../src/modules/workspaces/store';

const WorkspaceFooter = memo(() => {
 const router = useRouter();

 return (
 <View className="flex-row items-center justify-center gap-4 mt-4">
   <TouchableOpacity onPress={() => router.push('/(teams)/start')} className="flex-1 p-4 border-dashed rounded-xl items-center justify-center gap-2 border-outline-variant">
     <MaterialIcons name="add" size={24} color={colors.primary} />
     <Text className="font-title-sm text-primary">Create</Text>
   </TouchableOpacity>
   <TouchableOpacity onPress={() => router.push('/(teams)/join')} className="flex-1 p-4 border-dashed rounded-xl items-center justify-center gap-2 border-outline-variant">
     <MaterialIcons name="group-add" size={24} color={colors.secondary} />
     <Text className="font-title-sm text-secondary">Join</Text>
   </TouchableOpacity>
 </View>
 );
});

export default function WorkspacesScreen() {
 const router = useRouter();
 const { data: workspaces, isLoading } = useWorkspaces();
 const { activeWorkspaceId, setActiveWorkspaceId } = useWorkspaceStore();
 const handleSelect = (id: string | null) => {
 setActiveWorkspaceId(id);
 router.back();
 };

 const getWorkspaceIcon = (item: any) => {
   if (!item.id) return 'person'; // Personal workspace
   if (item.description) {
     const match = item.description.match(/Focus:\s*([a-zA-Z]+)/);
     if (match) {
       switch(match[1].toLowerCase()) {
         case 'marketing': return 'campaign';
         case 'engineering': return 'groups';
         case 'sales': return 'payments';
         case 'product': return 'inventory-2';
         case 'design': return 'draw';
         case 'executive': return 'stars';
       }
     }
   }
   return 'work';
 };

 return (
 <Screen scrollable={false}>
 <View className="flex-row items-center p-4 ">
 <TouchableOpacity onPress={() => router.back()} className="mr-4">
 <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
 </TouchableOpacity>
 <Text className="font-title-lg text-primary">Switch Workspace</Text>
 </View>

 <KeyboardAvoidingView 
 className="flex-1 p-4" 
 behavior={Platform.OS === 'ios' ? 'padding' : undefined}
 keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
 >
 {isLoading ? (
 <ActivityIndicator color={colors.primary} />
 ) : (
 <FlatList
 data={[{ id: null, name: 'Personal Workspace' }, ...(workspaces || [])]}
 keyExtractor={(item) => item.id || 'personal'}
 ListFooterComponent={
 <WorkspaceFooter />
 }
 contentContainerStyle={{ flexGrow: 1 }}
 renderItem={({ item }) => (
 <TouchableOpacity
 onPress={() => handleSelect(item.id)}
 className={`p-4 rounded-xl mb-2 flex-row justify-between items-center ${activeWorkspaceId === item.id ? 'bg-primary/10 border-primary' : 'bg-surface-container'}`}
 >
 <View className="flex-row items-center gap-3 flex-1 pr-4">
 {item.avatar ? (
   <Image source={{ uri: item.avatar }} className="w-8 h-8 rounded-full bg-surface-container-low" />
 ) : (
   <MaterialIcons name={getWorkspaceIcon(item)} size={24} color={activeWorkspaceId === item.id ? colors.primary : colors.secondary} />
 )}
 <Text className={`font-title-sm flex-shrink ${activeWorkspaceId === item.id ? 'text-primary' : 'text-on-surface'}`} numberOfLines={1} adjustsFontSizeToFit>
 {item.name}
 </Text>
 </View>
 <View className="flex-row items-center gap-3">
 {item.id && (
 <TouchableOpacity
 onPress={() => {
   setActiveWorkspaceId(item.id);
   router.push('/(teams)/team-space');
 }}
 className="p-2"
 >
 <MaterialIcons name="settings" size={20} color={colors.secondary} />
 </TouchableOpacity>
 )}
 {activeWorkspaceId === item.id && (
 <MaterialIcons name="check" size={20} color={colors.primary} />
 )}
 </View>
 </TouchableOpacity>
 )}
 />
 )}
 </KeyboardAvoidingView>
 </Screen>
 );
}