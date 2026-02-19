"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

// Card type
interface Card {
  id: string;
  pairId: string;
  image: string;
  name: string;
  isFlipped: boolean;
  isMatched: boolean;
}

// Family photos for the game (using actual family members)
const familyPhotos = [
  { id: "sarah", name: "Sarah", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop" },
  { id: "david", name: "David", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop" },
  { id: "emma", name: "Emma", image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop" },
  { id: "tommy", name: "Tommy", image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&h=200&fit=crop" },
];

// Grid sizes
const gridSizes = {
  easy: { cols: 2, rows: 2, pairs: 2 },
  medium: { cols: 3, rows: 2, pairs: 3 },
  hard: { cols: 4, rows: 3, pairs: 6 },
};

// Shuffle function
function shuffle<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export default function MemoryMatchGame() {
  const [difficulty, setDifficulty] = useState<keyof typeof gridSizes>("easy");
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<string[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [moves, setMoves] = useState(0);

  const grid = gridSizes[difficulty];

  // Initialize game
  const initGame = useCallback(() => {
    const selectedPhotos = shuffle(familyPhotos).slice(0, grid.pairs);
    const gamCards: Card[] = [];
    
    selectedPhotos.forEach((photo) => {
      // Add two cards for each photo (pair)
      gamCards.push({
        id: `${photo.id}-1`,
        pairId: photo.id,
        image: photo.image,
        name: photo.name,
        isFlipped: false,
        isMatched: false,
      });
      gamCards.push({
        id: `${photo.id}-2`,
        pairId: photo.id,
        image: photo.image,
        name: photo.name,
        isFlipped: false,
        isMatched: false,
      });
    });

    setCards(shuffle(gamCards));
    setFlippedCards([]);
    setMatchedPairs([]);
    setGameComplete(false);
    setMoves(0);
  }, [grid.pairs]);

  // Initialize on mount and difficulty change
  useEffect(() => {
    initGame();
  }, [initGame]);

  // Check for match when two cards are flipped
  useEffect(() => {
    if (flippedCards.length === 2) {
      setIsChecking(true);
      setMoves((m) => m + 1);

      const [first, second] = flippedCards;
      const firstCard = cards.find((c) => c.id === first);
      const secondCard = cards.find((c) => c.id === second);

      if (firstCard && secondCard && firstCard.pairId === secondCard.pairId) {
        // Match! Keep them visible longer for satisfaction
        setTimeout(() => {
          setMatchedPairs((prev) => [...prev, firstCard.pairId]);
          setCards((prev) =>
            prev.map((card) =>
              card.pairId === firstCard.pairId
                ? { ...card, isMatched: true }
                : card
            )
          );
          setFlippedCards([]);
          setIsChecking(false);
        }, 1000);
      } else {
        // No match - keep visible for 3-4 seconds (longer for elderly users)
        setTimeout(() => {
          setFlippedCards([]);
          setIsChecking(false);
        }, 3000);
      }
    }
  }, [flippedCards, cards]);

  // Check for game complete
  useEffect(() => {
    if (matchedPairs.length === grid.pairs && grid.pairs > 0) {
      setTimeout(() => setGameComplete(true), 500);
    }
  }, [matchedPairs, grid.pairs]);

  // Handle card click
  const handleCardClick = (cardId: string) => {
    if (isChecking) return;
    if (flippedCards.includes(cardId)) return;
    if (flippedCards.length >= 2) return;
    
    const card = cards.find((c) => c.id === cardId);
    if (card?.isMatched) return;

    setFlippedCards((prev) => [...prev, cardId]);
  };

  const isCardFlipped = (cardId: string) => {
    const card = cards.find((c) => c.id === cardId);
    return flippedCards.includes(cardId) || card?.isMatched;
  };

  return (
    <div className="flex min-h-screen flex-col px-6 py-8 pt-20">
      {/* Header */}
      <motion.header
        className="text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
          🃏 Memory Match
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Find the matching pairs
        </p>
      </motion.header>

      {/* Difficulty Selector */}
      <motion.div
        className="mx-auto mt-4 flex gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {(Object.keys(gridSizes) as Array<keyof typeof gridSizes>).map((d) => (
          <button
            key={d}
            onClick={() => setDifficulty(d)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              difficulty === d
                ? "bg-purple-500 text-white shadow-md"
                : "bg-white text-slate-600 shadow-sm dark:bg-slate-800 dark:text-slate-300"
            }`}
          >
            {d === "easy" && "2×2"}
            {d === "medium" && "3×2"}
            {d === "hard" && "4×3"}
          </button>
        ))}
      </motion.div>

      {/* Game Board */}
      <motion.div
        className="mx-auto mt-6 flex w-full max-w-sm flex-1 items-center justify-center"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div
          className="grid gap-3"
          style={{
            gridTemplateColumns: `repeat(${grid.cols}, minmax(0, 1fr))`,
          }}
        >
          {cards.map((card) => (
            <motion.button
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              className="relative aspect-square w-full overflow-hidden rounded-2xl shadow-lg"
              style={{ minWidth: difficulty === "hard" ? "70px" : "80px" }}
              whileHover={!isCardFlipped(card.id) ? { scale: 1.05 } : {}}
              whileTap={!isCardFlipped(card.id) ? { scale: 0.95 } : {}}
              initial={{ rotateY: 0 }}
              animate={{ rotateY: isCardFlipped(card.id) ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Card Back */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600"
                style={{
                  backfaceVisibility: "hidden",
                  rotateY: 0,
                }}
              >
                <span className="text-4xl">?</span>
              </motion.div>

              {/* Card Front */}
              <motion.div
                className="absolute inset-0 overflow-hidden rounded-2xl"
                style={{
                  backfaceVisibility: "hidden",
                  rotateY: 180,
                }}
              >
                <img
                  src={card.image}
                  alt={card.name}
                  className="h-full w-full object-cover"
                />
                {card.isMatched && (
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center bg-emerald-500/80"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <span className="text-4xl">✓</span>
                  </motion.div>
                )}
              </motion.div>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Progress */}
      <motion.div
        className="mx-auto mt-4 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <p className="text-lg text-slate-600 dark:text-slate-400">
          Pairs found: <span className="font-bold text-purple-600">{matchedPairs.length}</span> / {grid.pairs}
        </p>
      </motion.div>

      {/* New Game Button */}
      <motion.div
        className="mx-auto mt-4 max-w-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <motion.button
          onClick={initGame}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white py-4 text-slate-700 shadow-sm dark:bg-slate-800 dark:text-slate-200"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="text-xl">🔄</span>
          <span className="font-semibold">New Game</span>
        </motion.button>
      </motion.div>

      {/* Game Complete Modal */}
      <AnimatePresence>
        {gameComplete && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full max-w-sm overflow-hidden rounded-3xl bg-white p-8 text-center shadow-2xl dark:bg-slate-800"
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
            >
              {/* Celebration */}
              <motion.div
                className="text-6xl"
                animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5 }}
              >
                🎉
              </motion.div>
              <h2 className="mt-4 text-2xl font-bold text-slate-800 dark:text-white">
                Well Done!
              </h2>
              <p className="mt-2 text-slate-600 dark:text-slate-400">
                You found all the pairs!
              </p>
              
              <div className="mt-6 flex gap-3">
                <motion.button
                  onClick={initGame}
                  className="flex-1 rounded-2xl bg-purple-500 py-4 font-semibold text-white shadow-lg"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Play Again
                </motion.button>
                <Link href="/patient/games" className="flex-1">
                  <motion.button
                    className="w-full rounded-2xl bg-slate-200 py-4 font-semibold text-slate-700 dark:bg-slate-700 dark:text-slate-200"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Done
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Home Button */}
      <div className="h-24" /> {/* Spacer for bottom nav */}
    </div>
  );
}
