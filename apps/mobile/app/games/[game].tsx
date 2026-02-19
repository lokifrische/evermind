/**
 * Game Screen
 * 
 * Renders different games based on the route parameter
 * Currently implements: Memory Match
 * 
 * Per spec:
 * - Uses user's own family photos
 * - Configurable grid sizes
 * - Extended card visibility
 * - Celebration feedback
 */

import { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '../../src/components/layout/Screen';
import { Text } from '../../src/components/ui/Text';
import { Button } from '../../src/components/ui/Button';
import { useAccessibility } from '../../src/contexts/AccessibilityContext';
import { colors, spacing, borderRadius, MIN_TOUCH_TARGET } from '../../src/constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Mock family photos for Memory Match
const familyPhotos = [
  { id: '1', name: 'Sarah', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop' },
  { id: '2', name: 'David', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop' },
  { id: '3', name: 'Robert', url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop' },
  { id: '4', name: 'Emma', url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop' },
  { id: '5', name: 'Tommy', url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&h=200&fit=crop' },
  { id: '6', name: 'Lucy', url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop' },
];

interface Card {
  id: string;
  photoId: string;
  name: string;
  url: string;
  isFlipped: boolean;
  isMatched: boolean;
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function MemoryMatchGame() {
  const { triggerHaptic, themeColors } = useAccessibility();
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<string[]>([]);
  const [matches, setMatches] = useState(0);
  const [moves, setMoves] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [gridSize] = useState(4); // 4x3 = 12 cards = 6 pairs

  const initializeGame = useCallback(() => {
    // Use first 6 photos for 4x3 grid
    const selectedPhotos = familyPhotos.slice(0, 6);
    
    // Create pairs
    const cardPairs: Card[] = [];
    selectedPhotos.forEach((photo, index) => {
      cardPairs.push({
        id: `${photo.id}-a`,
        photoId: photo.id,
        name: photo.name,
        url: photo.url,
        isFlipped: false,
        isMatched: false,
      });
      cardPairs.push({
        id: `${photo.id}-b`,
        photoId: photo.id,
        name: photo.name,
        url: photo.url,
        isFlipped: false,
        isMatched: false,
      });
    });

    setCards(shuffleArray(cardPairs));
    setFlippedCards([]);
    setMatches(0);
    setMoves(0);
    setGameComplete(false);
  }, []);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  const handleCardPress = (card: Card) => {
    if (card.isFlipped || card.isMatched || flippedCards.length >= 2) return;

    triggerHaptic('light');

    // Flip the card
    setCards((prev) =>
      prev.map((c) => (c.id === card.id ? { ...c, isFlipped: true } : c))
    );

    const newFlipped = [...flippedCards, card.id];
    setFlippedCards(newFlipped);

    // Check for match when 2 cards are flipped
    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);

      const [firstId, secondId] = newFlipped;
      const firstCard = cards.find((c) => c.id === firstId);
      const secondCard = cards.find((c) => c.id === secondId);

      if (firstCard && secondCard && firstCard.photoId === secondCard.photoId) {
        // Match found!
        triggerHaptic('success');
        setMatches((m) => m + 1);
        
        setCards((prev) =>
          prev.map((c) =>
            c.photoId === firstCard.photoId ? { ...c, isMatched: true } : c
          )
        );
        setFlippedCards([]);

        // Check for game completion
        if (matches + 1 === 6) {
          setGameComplete(true);
          triggerHaptic('success');
        }
      } else {
        // No match - flip back after delay (extended visibility per spec)
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              newFlipped.includes(c.id) && !c.isMatched
                ? { ...c, isFlipped: false }
                : c
            )
          );
          setFlippedCards([]);
        }, 1500); // Extended visibility for cognitive support
      }
    }
  };

  const cardSize = (SCREEN_WIDTH - spacing.lg * 2 - spacing.sm * 3) / 4;

  if (gameComplete) {
    return (
      <View style={styles.celebrationContainer}>
        <Ionicons name="trophy" size={80} color={colors.games.main} />
        <Text variant="h1" center style={{ marginTop: spacing.lg }}>
          🎉 Wonderful! 🎉
        </Text>
        <Text variant="bodyLarge" center color={themeColors.textSecondary} style={{ marginTop: spacing.md }}>
          You found all the matches in {moves} moves!
        </Text>
        <Button
          title="Play Again"
          variant="primary"
          size="large"
          onPress={initializeGame}
          color={colors.games.main}
          style={{ marginTop: spacing.xl }}
        />
      </View>
    );
  }

  return (
    <View style={styles.gameContainer}>
      {/* Score */}
      <View style={styles.scoreRow}>
        <View style={styles.scoreItem}>
          <Text variant="h2" color={colors.games.main}>{matches}</Text>
          <Text variant="caption" color={themeColors.textSecondary}>Matches</Text>
        </View>
        <View style={styles.scoreItem}>
          <Text variant="h2" color={themeColors.text}>{moves}</Text>
          <Text variant="caption" color={themeColors.textSecondary}>Moves</Text>
        </View>
      </View>

      {/* Card Grid */}
      <View style={styles.grid}>
        {cards.map((card) => (
          <TouchableOpacity
            key={card.id}
            onPress={() => handleCardPress(card)}
            style={[
              styles.card,
              { width: cardSize, height: cardSize },
              card.isMatched && styles.cardMatched,
            ]}
            accessible
            accessibilityRole="button"
            accessibilityLabel={card.isFlipped || card.isMatched ? card.name : 'Hidden card'}
            disabled={card.isMatched}
          >
            {card.isFlipped || card.isMatched ? (
              <Image source={{ uri: card.url }} style={styles.cardImage} />
            ) : (
              <View style={[styles.cardBack, { backgroundColor: colors.games.main }]}>
                <Ionicons name="help" size={32} color={colors.white} />
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Hint */}
      <Text variant="body" center color={themeColors.textSecondary} style={styles.hint}>
        Find matching pairs of family photos
      </Text>
    </View>
  );
}

// Placeholder for other games
function ComingSoonGame({ title }: { title: string }) {
  const { themeColors } = useAccessibility();
  
  return (
    <View style={styles.comingSoon}>
      <Ionicons name="construct" size={64} color={colors.gray[400]} />
      <Text variant="h2" center style={{ marginTop: spacing.lg }}>
        {title}
      </Text>
      <Text variant="body" center color={themeColors.textSecondary} style={{ marginTop: spacing.sm }}>
        Coming soon!
      </Text>
    </View>
  );
}

export default function GameScreen() {
  const { game } = useLocalSearchParams<{ game: string }>();
  const router = useRouter();

  const gameTitle = {
    'memory-match': 'Memory Match',
    'word-association': 'Word Association',
    'picture-naming': 'Picture Naming',
    'jigsaw': 'Jigsaw Puzzle',
    'story-completion': 'Story Completion',
    'name-that-tune': 'Name That Tune',
    'daily-word': 'Daily Word',
    'sorting': 'Sorting Game',
    'spot-difference': 'Spot the Difference',
    'sound-matching': 'Sound Matching',
    'music-lane': 'Musical Memory Lane',
  }[game || ''] || 'Game';

  return (
    <Screen showBack title={gameTitle} showMic={false}>
      {game === 'memory-match' ? (
        <MemoryMatchGame />
      ) : (
        <ComingSoonGame title={gameTitle} />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  gameContainer: {
    flex: 1,
    alignItems: 'center',
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.xl * 2,
    marginBottom: spacing.xl,
  },
  scoreItem: {
    alignItems: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  card: {
    borderRadius: borderRadius.md,
    overflow: 'hidden',
  },
  cardBack: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: borderRadius.md,
  },
  cardImage: {
    width: '100%',
    height: '100%',
    borderRadius: borderRadius.md,
  },
  cardMatched: {
    opacity: 0.5,
  },
  hint: {
    marginTop: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  celebrationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  comingSoon: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
});
