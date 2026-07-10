import { View, Text, StyleSheet, TouchableOpacity, SectionList, Modal, TouchableWithoutFeedback, SafeAreaView } from 'react-native';
import { forwardRef, useImperativeHandle, useMemo, useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../../../src/shared/theme/colors';
import { useConversations, useDeleteConversation, useUpdateConversation } from '../../../../src/shared/hooks/useAskAI';
import { format, isToday, isYesterday, subDays } from 'date-fns';

export interface HistoryModalRef {
  present: () => void;
  dismiss: () => void;
}

interface HistoryModalProps {
  onSelectConversation: (id: string) => void;
  onNewChat: () => void;
}

export const HistoryModal = forwardRef<HistoryModalRef, HistoryModalProps>(({ onSelectConversation, onNewChat }, ref) => {
  const [visible, setVisible] = useState(false);
  const { data: conversations, isLoading } = useConversations();
  const { mutate: deleteConversation } = useDeleteConversation();
  const { mutate: updateConversation } = useUpdateConversation();
  
  useImperativeHandle(ref, () => ({
    present: () => setVisible(true),
    dismiss: () => setVisible(false)
  }));

  const sections = useMemo(() => {
    if (!conversations) return [];
    
    const pinned: any[] = [];
    const today: any[] = [];
    const yesterday: any[] = [];
    const older: any[] = [];
    
    conversations.forEach(conv => {
      const date = new Date(conv.updated_at);
      if (conv.is_pinned) {
        pinned.push(conv);
      } else if (isToday(date)) {
        today.push(conv);
      } else if (isYesterday(date)) {
        yesterday.push(conv);
      } else {
        older.push(conv);
      }
    });

    const result = [];
    if (pinned.length > 0) result.push({ title: 'Pinned', data: pinned });
    if (today.length > 0) result.push({ title: 'Today', data: today });
    if (yesterday.length > 0) result.push({ title: 'Yesterday', data: yesterday });
    if (older.length > 0) result.push({ title: 'Previous 30 Days', data: older });
    
    return result;
  }, [conversations]);

  const handleSelect = (id: string) => {
    onSelectConversation(id);
    setVisible(false);
  };

  const handleCreateNew = () => {
    onNewChat();
    setVisible(false);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setVisible(false)}
    >
      <TouchableWithoutFeedback onPress={() => setVisible(false)}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.sheetContainer}>
              <View style={styles.header}>
                <Text style={styles.title}>History</Text>
                <TouchableOpacity onPress={handleCreateNew} style={styles.newButton}>
                  <MaterialIcons name="add" size={20} color={colors['on-primary']} />
                  <Text style={styles.newButtonText}>New Chat</Text>
                </TouchableOpacity>
              </View>

              {isLoading ? (
                <View style={styles.loadingContainer}>
                  <Text style={styles.loadingText}>Loading history...</Text>
                </View>
              ) : (
                <SectionList
                  sections={sections}
                  keyExtractor={item => item.id}
                  contentContainerStyle={styles.listContent}
                  renderSectionHeader={({ section: { title } }) => (
                    <Text style={styles.sectionHeader}>{title}</Text>
                  )}
                  renderItem={({ item }) => (
                    <View style={styles.row}>
                      <TouchableOpacity style={styles.item} onPress={() => handleSelect(item.id)}>
                        <MaterialIcons name="chat-bubble-outline" size={20} color={colors.outline} />
                        <Text style={styles.itemTitle} numberOfLines={1}>{item.title}</Text>
                      </TouchableOpacity>
                      <View style={styles.actions}>
                        <TouchableOpacity 
                          style={styles.actionIcon} 
                          onPress={() => updateConversation({ id: item.id, isPinned: !item.is_pinned })}
                        >
                          <MaterialIcons name={item.is_pinned ? "push-pin" : "push-pin"} size={18} color={item.is_pinned ? colors.primary : colors.outline} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionIcon} onPress={() => deleteConversation(item.id)}>
                          <MaterialIcons name="delete-outline" size={18} color={colors.error} />
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                  ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                      <Text style={styles.emptyText}>No conversation history.</Text>
                    </View>
                  }
                />
              )}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
});

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: '85%',
    paddingBottom: 20,
  },
  modalBackground: {
    backgroundColor: colors.background,
  },
  indicator: {
    backgroundColor: colors.outline,
    width: 40,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  title: {
    fontFamily: 'PublicSans_700Bold',
    fontSize: 20,
    color: colors['on-surface'],
  },
  newButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  newButtonText: {
    fontFamily: 'PublicSans_600SemiBold',
    color: colors['on-primary'],
    fontSize: 14,
    marginLeft: 4,
  },
  listContent: {
    paddingBottom: 40,
  },
  sectionHeader: {
    fontFamily: 'PublicSans_600SemiBold',
    fontSize: 14,
    color: colors['on-surface-variant'],
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  item: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemTitle: {
    fontFamily: 'PublicSans_400Regular',
    fontSize: 16,
    color: colors['on-surface'],
    marginLeft: 12,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionIcon: {
    padding: 8,
    marginLeft: 4,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    fontFamily: 'PublicSans_400Regular',
    color: colors.outline,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: 'PublicSans_400Regular',
    color: colors.outline,
  }
});
