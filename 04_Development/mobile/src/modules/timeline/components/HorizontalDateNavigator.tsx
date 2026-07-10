import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { format, subDays, isSameDay } from 'date-fns';
import { colors } from '../../../../src/shared/theme/colors';

interface HorizontalDateNavigatorProps {
  selectedDate: Date | null;
  onSelectDate: (date: Date | null) => void;
}

export function HorizontalDateNavigator({ selectedDate, onSelectDate }: HorizontalDateNavigatorProps) {
  const scrollViewRef = useRef<ScrollView>(null);
  
  const today = new Date();
  
  // Generate last 14 days
  const days = Array.from({ length: 14 }).map((_, i) => subDays(today, i)).reverse();

  useEffect(() => {
    // Scroll to the end (today) on mount
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, []);

  return (
    <View className="mb-4 mt-2">
      <ScrollView 
        ref={scrollViewRef}
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
      >
        <TouchableOpacity
          onPress={() => onSelectDate(null)}
          className={`h-16 px-6 items-center justify-center rounded-2xl border ${!selectedDate ? 'bg-primary border-primary' : 'bg-surface-container-low border-outline-variant/30'}`}
        >
          <Text className={`font-title-sm font-bold ${!selectedDate ? 'text-on-primary' : 'text-on-surface-variant'}`}>
            All Time
          </Text>
        </TouchableOpacity>

        {days.map((date, index) => {
          const isSelected = selectedDate && isSameDay(selectedDate, date);
          const isToday = isSameDay(today, date);
          
          return (
            <TouchableOpacity
              key={index}
              onPress={() => onSelectDate(date)}
              className={`h-16 min-w-[64px] items-center justify-center rounded-2xl border px-3 ${isSelected ? 'bg-primary border-primary' : 'bg-surface-container-low border-outline-variant/30'}`}
            >
              <Text className={`font-label-xs mb-1 uppercase tracking-wider ${isSelected ? 'text-on-primary/80' : 'text-on-surface-variant/70'}`}>
                {isToday ? 'Today' : format(date, 'EEE')}
              </Text>
              <Text className={`font-title-lg font-bold ${isSelected ? 'text-on-primary' : 'text-on-surface'}`}>
                {format(date, 'd')}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}
