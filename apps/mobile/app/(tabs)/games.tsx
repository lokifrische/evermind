/**
 * Games Tab Screen
 * 
 * Per spec:
 * - Memory matching game using family photos
 * - Word association, story completion, picture naming
 * - Daily word game
 * - Name That Tune, Sound matching
 * - Musical Memory Lane
 * - Jigsaw puzzles, sorting games, spot the difference
 * - Session fatigue warning
 * - Passive game analytics
 */

import { View, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '../../src/components/layout/Screen';
import { Text } from '../../src/components/ui/Text';
import { Card } from '../../src/components/ui/Card';
import { useAccessibility } from '../../src/contexts/AccessibilityContext';
import { colors, spacing, MIN_TOUCH_TARGET, borderRadius } from '../../src/constants/theme';

// Game definitions per spec
const games = [
  {
    id: 'memory-match',
    title: 'Memory Match',
    description: 'Match pairs using family photos',
    icon: 'grid',
    color: colors.games.main,
    backgroundColor: colors.games.light,
    difficulty: 'Easy',
  },
  {
    id: 'word-association',
    title: 'Word Association',
    description: 'Connect related words',
    icon: 'text',
    color: '#8B5CF6',
    backgroundColor: '#EDE9FE',
    difficulty: 'Easy',
  },
  {
    id: 'picture-naming',
    title: 'Picture Naming',
    description: 'Name what you see',
    icon: 'image',
    color: '#10B981',
    backgroundColor: '#D1FAE5',
    difficulty: 'Easy',
  },
  {
    id: 'jigsaw',
    title: 'Jigsaw Puzzle',
    description: 'Put the pieces together',
    icon: 'extension-puzzle',
    color: '#EC4899',
    backgroundColor: '#FCE7F3',
    difficulty: 'Medium',
  },
  {
    id: 'story-completion',
    title: 'Story Completion',
    description: 'Fill in the blanks',
    icon: 'book',
    color: '#3B82F6',
    backgroundColor: '#DBEAFE',
    difficulty: 'Medium',
  },
  {
    id: 'name-that-tune',
    title: 'Name That Tune',
    description: 'Guess the song',
    icon: 'musical-notes',
    color: '#F59E0B',
    backgroundColor: '#FEF3C7',
    difficulty: 'Easy',
  },
  {
    id: 'daily-word',
    title: 'Daily Word',
    description: 'Quick word puzzle',
    icon: 'sparkles',
    color: '#6366F1',
    backgroundColor: '#E0E7FF',
    difficulty: 'Easy',
    isDaily: true,
  },
  {
    id: 'sorting',
    title: 'Sorting Game',
    description: 'Put things in order',
    icon: 'swap-vertical',
    color: '#14B8A6',
    backgroundColor: '#CCFBF1',
    difficulty: 'Easy',
  },
  {
    id: 'spot-difference',
    title: 'Spot the Difference',
    description: 'Find what changed',
    icon: 'search',
    color: '#F97316',
    backgroundColor: '#FFEDD5',
    difficulty: 'Medium',
  },
  {
    id: 'sound-matching',
    title: 'Sound Matching',
    description: 'Match sounds to pictures',
    icon: 'volume-high',
    color: '#84CC16',
    backgroundColor: '#ECFCCB',
    difficulty: 'Easy',
  },
  {
    id: 'music-lane',
    title: 'Musical Memory Lane',
    description: 'Listen to your favorite songs',
    icon: 'headset',
    color: '#A855F7',
    backgroundColor: '#F3E8FF',
    difficulty: 'Relaxing',
  },
];

export default function GamesScreen() {
  const router = useRouter();
  const { themeColors, triggerHaptic } = useAccessibility();

  const handleGamePress = (gameId: string) => {
    triggerHaptic('medium');
    router.push(`/games/${gameId}`);
  };

  const dailyGame = games.find((g) => g.isDaily);
  const regularGames = games.filter((g) => !g.isDaily);

  const renderGameCard = (game: typeof games[0], isLarge = false) => (
    <TouchableOpacity
      key={game.id}
      onPress={() => handleGamePress(game.id)}
      style={[
        styles.gameCard,
        { backgroundColor: game.backgroundColor },
        isLarge && styles.gameCardLarge,
      ]}
      accessible
      accessibilityRole="button"
      accessibilityLabel={`${game.title}, ${game.description}, ${game.difficulty} difficulty`}
    >
      <View style={[styles.gameIconContainer, { backgroundColor: game.color }]}>
        <Ionicons name={game.icon as any} size={isLarge ? 40 : 32} color={colors.white} />
      </View>
      <View style={styles.gameContent}>
        <Text variant={isLarge ? 'h2' : 'h3'} weight="bold" numberOfLines={1}>
          {game.title}
        </Text>
        <Text variant="body" color={themeColors.textSecondary} numberOfLines={2}>
          {game.description}
        </Text>
        <View style={[styles.difficultyBadge, { backgroundColor: game.color + '20' }]}>
          <Text variant="caption" weight="semibold" color={game.color}>
            {game.difficulty}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <Screen title="Games" showMic padded={false}>
      <FlatList
        data={[{ type: 'daily' }, { type: 'games' }]}
        keyExtractor={(item) => item.type}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
          if (item.type === 'daily' && dailyGame) {
            return (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Ionicons name="sunny" size={24} color={colors.games.main} />
                  <Text variant="h3" weight="bold" style={{ marginLeft: spacing.sm }}>
                    Today's Game
                  </Text>
                </View>
                {renderGameCard(dailyGame, true)}
              </View>
            );
          }
          
          if (item.type === 'games') {
            return (
              <View style={styles.section}>
                <Text variant="h3" weight="bold" style={styles.sectionTitle}>
                  All Games
                </Text>
                <View style={styles.gamesGrid}>
                  {regularGames.map((game) => renderGameCard(game))}
                </View>
              </View>
            );
          }
          
          return null;
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    marginBottom: spacing.md,
  },
  gamesGrid: {
    gap: spacing.md,
  },
  gameCard: {
    flexDirection: 'row',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    minHeight: MIN_TOUCH_TARGET + 20,
    alignItems: 'center',
  },
  gameCardLarge: {
    padding: spacing.lg,
    minHeight: 140,
  },
  gameIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameContent: {
    flex: 1,
    marginLeft: spacing.md,
  },
  difficultyBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 8,
    marginTop: spacing.xs,
  },
});
