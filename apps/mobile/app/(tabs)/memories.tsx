/**
 * Memories Tab Screen
 * 
 * Per spec:
 * - Timeline view with vertical scrollable cards
 * - Thumbnails, titles, dates, and tags
 * - Date headers while scrolling
 * - Filter toggle buttons (type, life period, people)
 * - Caregiver-curated named collections
 */

import { useState, useMemo } from 'react';
import { View, StyleSheet, Image, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '../../src/components/layout/Screen';
import { Text } from '../../src/components/ui/Text';
import { Card } from '../../src/components/ui/Card';
import { Button } from '../../src/components/ui/Button';
import { useAccessibility } from '../../src/contexts/AccessibilityContext';
import { useData } from '../../src/contexts/DataContext';
import { colors, spacing, MIN_TOUCH_TARGET } from '../../src/constants/theme';

// Fallback mock memories data
const fallbackMemories = [
  {
    id: '1',
    title: 'Christmas 2024',
    description: 'The whole family together for the holidays',
    type: 'album',
    date: '2024-12-25',
    imageUrl: 'https://images.unsplash.com/photo-1482517967863-00e15c9b44be?w=400&h=300&fit=crop',
    tags: ['Family', 'Holiday'],
  },
  {
    id: '2',
    title: 'Wedding Anniversary',
    description: 'Celebrating 60 years of love',
    type: 'story',
    date: '2024-09-15',
    imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=300&fit=crop',
    tags: ['Robert', 'Anniversary'],
  },
  {
    id: '3',
    title: 'Grandkids Visit',
    description: 'Emma and Tommy came to stay',
    type: 'album',
    date: '2024-08-10',
    imageUrl: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=400&h=300&fit=crop',
    tags: ['Emma', 'Tommy', 'Summer'],
  },
  {
    id: '4',
    title: 'Family Vacation 2023',
    description: 'Trip to the beach',
    type: 'album',
    date: '2023-07-20',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop',
    tags: ['Vacation', 'Beach'],
  },
  {
    id: '5',
    title: 'Our First Home',
    description: 'The house on Maple Street',
    type: 'story',
    date: '1968-06-01',
    imageUrl: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?w=400&h=300&fit=crop',
    tags: ['Home', 'Robert'],
  },
];

const filterOptions = ['All', 'Albums', 'Stories', 'Family', 'Places'];

export default function MemoriesScreen() {
  const router = useRouter();
  const { themeColors, triggerHaptic } = useAccessibility();
  const { memories: supabaseMemories } = useData();
  const [activeFilter, setActiveFilter] = useState('All');

  // Use Supabase data if available, otherwise fallback
  const memoriesData = useMemo(() => {
    if (supabaseMemories.length > 0) {
      return supabaseMemories.map(m => ({
        id: m.id,
        title: m.title,
        description: m.description || '',
        type: m.type,
        date: m.created_at,
        imageUrl: m.thumbnail_url || 'https://images.unsplash.com/photo-1482517967863-00e15c9b44be?w=400&h=300&fit=crop',
        tags: [], // Tags would come from a separate query
      }));
    }
    return fallbackMemories;
  }, [supabaseMemories]);

  const handleFilterPress = (filter: string) => {
    triggerHaptic('light');
    setActiveFilter(filter);
  };

  const handleMemoryPress = (id: string) => {
    triggerHaptic('medium');
    router.push(`/memories/${id}`);
  };

  const handleRecordPress = () => {
    triggerHaptic('medium');
    router.push('/memories/record');
  };

  const renderMemoryCard = ({ item }: { item: typeof fallbackMemories[0] }) => (
    <Card
      onPress={() => handleMemoryPress(item.id)}
      style={styles.memoryCard}
      accessibilityLabel={`Memory: ${item.title}, ${item.description}`}
    >
      <Image source={{ uri: item.imageUrl }} style={styles.memoryImage} />
      <View style={styles.memoryContent}>
        <View style={styles.memoryHeader}>
          <Text variant="h3" numberOfLines={1} style={{ flex: 1 }}>
            {item.title}
          </Text>
          <Ionicons
            name={item.type === 'album' ? 'images' : 'mic'}
            size={20}
            color={colors.memories.main}
          />
        </View>
        <Text variant="body" color={themeColors.textSecondary} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={styles.tagRow}>
          {item.tags.slice(0, 3).map((tag) => (
            <View key={tag} style={styles.tag}>
              <Text variant="caption" color={colors.memories.main}>
                {tag}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </Card>
  );

  return (
    <Screen title="Memories" showMic padded={false} scrollable={false}>
      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        <FlatList
          horizontal
          data={filterOptions}
          keyExtractor={(item) => item}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterList}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handleFilterPress(item)}
              style={[
                styles.filterButton,
                activeFilter === item && styles.filterButtonActive,
              ]}
              accessible
              accessibilityRole="button"
              accessibilityState={{ selected: activeFilter === item }}
            >
              <Text
                variant="body"
                weight={activeFilter === item ? 'semibold' : 'normal'}
                color={activeFilter === item ? colors.white : themeColors.text}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Memory List */}
      <FlatList
        data={memoriesData}
        keyExtractor={(item) => item.id}
        renderItem={renderMemoryCard}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
      />

      {/* Record Story Button */}
      <View style={styles.recordButtonContainer}>
        <Button
          title="Record a Story"
          variant="primary"
          size="large"
          icon={<Ionicons name="mic" size={24} color={colors.white} />}
          onPress={handleRecordPress}
          color={colors.memories.main}
          fullWidth
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  filterContainer: {
    paddingVertical: spacing.md,
  },
  filterList: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  filterButton: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    backgroundColor: colors.gray[100],
    minHeight: MIN_TOUCH_TARGET - 12,
    justifyContent: 'center',
  },
  filterButtonActive: {
    backgroundColor: colors.memories.main,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 100, // Space for button
  },
  memoryCard: {
    flexDirection: 'row',
    overflow: 'hidden',
  },
  memoryImage: {
    width: 120,
    height: 120,
    borderRadius: 12,
  },
  memoryContent: {
    flex: 1,
    paddingLeft: spacing.md,
    justifyContent: 'center',
  },
  memoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  tagRow: {
    flexDirection: 'row',
    marginTop: spacing.sm,
    gap: spacing.xs,
  },
  tag: {
    backgroundColor: colors.memories.light,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 12,
  },
  recordButtonContainer: {
    position: 'absolute',
    bottom: spacing.lg,
    left: spacing.lg,
    right: spacing.lg,
  },
});
