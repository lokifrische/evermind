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

import { useState, useEffect, useCallback, useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '../../src/components/layout/Screen';
import { Text } from '../../src/components/ui/Text';
import { Button } from '../../src/components/ui/Button';
import { useAccessibility } from '../../src/contexts/AccessibilityContext';
import { useData } from '../../src/contexts/DataContext';
import { colors, spacing, borderRadius, MIN_TOUCH_TARGET } from '../../src/constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Fallback family photos for Memory Match (used if no Supabase data)
const fallbackFamilyPhotos = [
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
  const { familyMembers } = useData();
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<string[]>([]);
  const [matches, setMatches] = useState(0);
  const [moves, setMoves] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [gridSize] = useState(4); // 4x3 = 12 cards = 6 pairs

  // Use Supabase family members if available, otherwise fallback
  const familyPhotos = useMemo(() => {
    if (familyMembers.length > 0) {
      return familyMembers.map(m => ({
        id: m.id,
        name: m.name,
        url: m.photo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(m.name)}&size=200&background=random`,
      }));
    }
    return fallbackFamilyPhotos;
  }, [familyMembers]);

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
  }, [familyPhotos]);

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

// ==================== Picture Naming Game ====================

const pictureItems = [
  { id: '1', name: 'Apple', image: 'https://images.unsplash.com/photo-1584306670957-acf935f5033c?w=400&h=400&fit=crop', hint: "A red or green fruit" },
  { id: '2', name: 'Cat', image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=400&fit=crop', hint: "A furry pet that says meow" },
  { id: '3', name: 'Clock', image: 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=400&h=400&fit=crop', hint: "It tells you what time it is" },
  { id: '4', name: 'Flower', image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400&h=400&fit=crop', hint: "Grows in gardens, colorful petals" },
  { id: '5', name: 'Dog', image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=400&fit=crop', hint: "Man's best friend" },
  { id: '6', name: 'Book', image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=400&fit=crop', hint: "You read stories in this" },
];

function PictureNamingGame() {
  const { themeColors, triggerHaptic } = useAccessibility();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [gameComplete, setGameComplete] = useState(false);

  const currentItem = pictureItems[currentIndex];
  const options = useMemo(() => {
    const wrong = pictureItems.filter(p => p.id !== currentItem.id).slice(0, 3);
    return shuffleArray([currentItem, ...wrong]);
  }, [currentIndex]);

  const handleAnswer = (answer: string) => {
    if (answer === currentItem.name) {
      triggerHaptic('success');
      setFeedback('correct');
      setScore(s => s + 1);
    } else {
      triggerHaptic('error');
      setFeedback('wrong');
    }
    
    setTimeout(() => {
      setFeedback(null);
      setShowHint(false);
      if (currentIndex < pictureItems.length - 1) {
        setCurrentIndex(i => i + 1);
      } else {
        setGameComplete(true);
      }
    }, 1000);
  };

  const restart = () => {
    setCurrentIndex(0);
    setScore(0);
    setGameComplete(false);
    setShowHint(false);
    setFeedback(null);
  };

  if (gameComplete) {
    return (
      <View style={styles.celebrationContainer}>
        <Ionicons name="trophy" size={80} color={colors.games.main} />
        <Text variant="h1" center style={{ marginTop: spacing.lg }}>
          🎉 Great Job! 🎉
        </Text>
        <Text variant="bodyLarge" center color={themeColors.textSecondary} style={{ marginTop: spacing.md }}>
          You scored {score} out of {pictureItems.length}!
        </Text>
        <Button
          title="Play Again"
          variant="primary"
          size="large"
          onPress={restart}
          color={colors.games.main}
          style={{ marginTop: spacing.xl }}
        />
      </View>
    );
  }

  return (
    <View style={styles.gameContainer}>
      <View style={styles.scoreRow}>
        <View style={styles.scoreItem}>
          <Text variant="h2" color={colors.games.main}>{score}</Text>
          <Text variant="caption" color={themeColors.textSecondary}>Score</Text>
        </View>
        <View style={styles.scoreItem}>
          <Text variant="h2" color={themeColors.text}>{currentIndex + 1}/{pictureItems.length}</Text>
          <Text variant="caption" color={themeColors.textSecondary}>Picture</Text>
        </View>
      </View>

      <View style={[pictureStyles.imageContainer, feedback === 'correct' && { borderColor: colors.success }, feedback === 'wrong' && { borderColor: colors.error }]}>
        <Image source={{ uri: currentItem.image }} style={pictureStyles.image} />
      </View>

      <Text variant="h3" center style={{ marginTop: spacing.lg }}>What is this?</Text>

      {showHint && (
        <Text variant="body" center color={colors.games.main} style={{ marginTop: spacing.sm }}>
          💡 {currentItem.hint}
        </Text>
      )}

      <View style={pictureStyles.optionsGrid}>
        {options.map((option) => (
          <TouchableOpacity
            key={option.id}
            onPress={() => handleAnswer(option.name)}
            style={[pictureStyles.optionButton, feedback && option.name === currentItem.name && pictureStyles.correctOption]}
            disabled={!!feedback}
          >
            <Text variant="h3" center>{option.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {!showHint && !feedback && (
        <TouchableOpacity onPress={() => setShowHint(true)} style={{ marginTop: spacing.md }}>
          <Text variant="body" color={colors.games.main}>Need a hint?</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const pictureStyles = StyleSheet.create({
  imageContainer: {
    width: SCREEN_WIDTH - spacing.xl * 2,
    height: SCREEN_WIDTH - spacing.xl * 2,
    maxHeight: 280,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    borderWidth: 4,
    borderColor: 'transparent',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.md,
    marginTop: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  optionButton: {
    width: (SCREEN_WIDTH - spacing.lg * 3) / 2,
    paddingVertical: spacing.lg,
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: colors.gray[200],
    minHeight: MIN_TOUCH_TARGET,
  },
  correctOption: {
    borderColor: colors.success,
    backgroundColor: '#D1FAE5',
  },
});

// ==================== Daily Word Game ====================

const wordPuzzles = [
  { word: 'HEART', hint: 'It beats inside you' },
  { word: 'SMILE', hint: 'What happy faces do' },
  { word: 'BREAD', hint: 'Baked food for sandwiches' },
  { word: 'WATER', hint: 'You drink this every day' },
  { word: 'HOUSE', hint: 'A place to call home' },
  { word: 'MUSIC', hint: 'What you listen to' },
];

function DailyWordGame() {
  const { themeColors, triggerHaptic } = useAccessibility();
  const [puzzle] = useState(() => wordPuzzles[Math.floor(Math.random() * wordPuzzles.length)]);
  const [guessedLetters, setGuessedLetters] = useState<Set<string>>(new Set());
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing');

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const maxWrong = 6;
  const wrongGuesses = [...guessedLetters].filter(l => !puzzle.word.includes(l));
  const isWon = puzzle.word.split('').every(l => guessedLetters.has(l));
  const isLost = wrongGuesses.length >= maxWrong;

  useEffect(() => {
    if (isWon && gameStatus === 'playing') {
      triggerHaptic('success');
      setGameStatus('won');
    } else if (isLost && gameStatus === 'playing') {
      triggerHaptic('error');
      setGameStatus('lost');
    }
  }, [isWon, isLost]);

  const handleLetterPress = (letter: string) => {
    if (guessedLetters.has(letter) || gameStatus !== 'playing') return;
    triggerHaptic('light');
    setGuessedLetters(prev => new Set([...prev, letter]));
  };

  const restart = () => {
    setGuessedLetters(new Set());
    setGameStatus('playing');
  };

  return (
    <View style={styles.gameContainer}>
      <Text variant="body" center color={themeColors.textSecondary}>
        💡 {puzzle.hint}
      </Text>

      {/* Word Display */}
      <View style={wordStyles.wordContainer}>
        {puzzle.word.split('').map((letter, index) => (
          <View key={index} style={wordStyles.letterBox}>
            <Text variant="h1">
              {guessedLetters.has(letter) || gameStatus !== 'playing' ? letter : '_'}
            </Text>
          </View>
        ))}
      </View>

      {/* Wrong Guesses Counter */}
      <View style={wordStyles.livesContainer}>
        {[...Array(maxWrong)].map((_, i) => (
          <Ionicons
            key={i}
            name={i < wrongGuesses.length ? 'heart-dislike' : 'heart'}
            size={24}
            color={i < wrongGuesses.length ? colors.gray[300] : colors.error}
          />
        ))}
      </View>

      {gameStatus !== 'playing' ? (
        <View style={styles.celebrationContainer}>
          <Ionicons
            name={gameStatus === 'won' ? 'trophy' : 'sad'}
            size={64}
            color={gameStatus === 'won' ? colors.games.main : colors.gray[400]}
          />
          <Text variant="h2" center style={{ marginTop: spacing.md }}>
            {gameStatus === 'won' ? '🎉 You Got It!' : `The word was: ${puzzle.word}`}
          </Text>
          <Button
            title="Play Again"
            variant="primary"
            size="large"
            onPress={restart}
            color={colors.games.main}
            style={{ marginTop: spacing.xl }}
          />
        </View>
      ) : (
        <View style={wordStyles.keyboard}>
          {alphabet.map((letter) => (
            <TouchableOpacity
              key={letter}
              onPress={() => handleLetterPress(letter)}
              disabled={guessedLetters.has(letter)}
              style={[
                wordStyles.keyButton,
                guessedLetters.has(letter) && {
                  backgroundColor: puzzle.word.includes(letter) ? '#D1FAE5' : colors.gray[200],
                },
              ]}
            >
              <Text
                variant="h3"
                color={guessedLetters.has(letter) ? colors.gray[400] : themeColors.text}
              >
                {letter}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

const wordStyles = StyleSheet.create({
  wordContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
    marginVertical: spacing.xl,
  },
  letterBox: {
    width: 48,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: colors.games.main,
  },
  livesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.xs,
    marginBottom: spacing.lg,
  },
  keyboard: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
  },
  keyButton: {
    width: 36,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.gray[200],
  },
});

// ==================== Sorting Game ====================

const sortingCategories = [
  {
    title: 'Fruits & Vegetables',
    categories: ['Fruit', 'Vegetable'],
    items: [
      { name: 'Apple 🍎', category: 'Fruit' },
      { name: 'Carrot 🥕', category: 'Vegetable' },
      { name: 'Banana 🍌', category: 'Fruit' },
      { name: 'Broccoli 🥦', category: 'Vegetable' },
      { name: 'Orange 🍊', category: 'Fruit' },
      { name: 'Tomato 🍅', category: 'Vegetable' },
    ],
  },
];

function SortingGame() {
  const { themeColors, triggerHaptic } = useAccessibility();
  const [puzzle] = useState(sortingCategories[0]);
  const [unsorted, setUnsorted] = useState(() => shuffleArray([...puzzle.items]));
  const [sorted, setSorted] = useState<Record<string, typeof puzzle.items>>({
    [puzzle.categories[0]]: [],
    [puzzle.categories[1]]: [],
  });
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [gameComplete, setGameComplete] = useState(false);

  const handleSort = (item: typeof puzzle.items[0], category: string) => {
    if (item.category === category) {
      triggerHaptic('success');
      setFeedback('correct');
      setUnsorted(prev => prev.filter(i => i.name !== item.name));
      setSorted(prev => ({
        ...prev,
        [category]: [...prev[category], item],
      }));
      if (unsorted.length === 1) {
        setTimeout(() => setGameComplete(true), 500);
      }
    } else {
      triggerHaptic('error');
      setFeedback('wrong');
    }
    setTimeout(() => setFeedback(null), 500);
  };

  if (gameComplete) {
    return (
      <View style={styles.celebrationContainer}>
        <Ionicons name="trophy" size={80} color={colors.games.main} />
        <Text variant="h1" center style={{ marginTop: spacing.lg }}>
          🎉 All Sorted! 🎉
        </Text>
        <Text variant="bodyLarge" center color={themeColors.textSecondary} style={{ marginTop: spacing.md }}>
          Great job organizing everything!
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.gameContainer}>
      <Text variant="h3" center style={{ marginBottom: spacing.lg }}>{puzzle.title}</Text>

      {/* Category Boxes */}
      <View style={sortStyles.categoriesRow}>
        {puzzle.categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            onPress={() => unsorted[0] && handleSort(unsorted[0], cat)}
            style={[sortStyles.categoryBox, feedback === 'correct' && sorted[cat].length > 0 && { borderColor: colors.success }]}
          >
            <Text variant="h3" center>{cat}</Text>
            <View style={sortStyles.sortedItems}>
              {sorted[cat].map((item, i) => (
                <Text key={i} variant="caption">{item.name}</Text>
              ))}
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Current Item */}
      {unsorted.length > 0 && (
        <View style={sortStyles.currentItem}>
          <Text variant="body" color={themeColors.textSecondary}>Tap where this belongs:</Text>
          <View style={[sortStyles.itemCard, feedback === 'wrong' && { borderColor: colors.error }]}>
            <Text variant="h2">{unsorted[0].name}</Text>
          </View>
        </View>
      )}

      {/* Queue */}
      <View style={sortStyles.queue}>
        <Text variant="caption" color={themeColors.textSecondary}>
          {unsorted.length} items left
        </Text>
      </View>
    </View>
  );
}

const sortStyles = StyleSheet.create({
  categoriesRow: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  categoryBox: {
    flex: 1,
    minHeight: 150,
    padding: spacing.md,
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: colors.gray[200],
    alignItems: 'center',
  },
  sortedItems: {
    marginTop: spacing.sm,
    alignItems: 'center',
  },
  currentItem: {
    marginTop: spacing.xl,
    alignItems: 'center',
  },
  itemCard: {
    marginTop: spacing.md,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    backgroundColor: colors.games.light,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: colors.games.main,
  },
  queue: {
    marginTop: spacing.lg,
    alignItems: 'center',
  },
});

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

  const renderGame = () => {
    switch (game) {
      case 'memory-match':
        return <MemoryMatchGame />;
      case 'picture-naming':
        return <PictureNamingGame />;
      case 'daily-word':
        return <DailyWordGame />;
      case 'sorting':
        return <SortingGame />;
      default:
        return <ComingSoonGame title={gameTitle} />;
    }
  };

  return (
    <Screen showBack title={gameTitle} showMic={false}>
      {renderGame()}
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
