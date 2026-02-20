"use client";

import { motion, AnimatePresence, Reorder } from "framer-motion";
import { useState, useCallback } from "react";
import Link from "next/link";

// Category sets for sorting
const sortingSets = [
  {
    id: "fruits-vegetables",
    title: "Fruits & Vegetables",
    categories: [
      { name: "Fruits", icon: "🍎", color: "from-red-400 to-rose-500" },
      { name: "Vegetables", icon: "🥕", color: "from-emerald-400 to-green-500" },
    ],
    items: [
      { name: "Apple", emoji: "🍎", category: "Fruits" },
      { name: "Carrot", emoji: "🥕", category: "Vegetables" },
      { name: "Banana", emoji: "🍌", category: "Fruits" },
      { name: "Broccoli", emoji: "🥦", category: "Vegetables" },
      { name: "Orange", emoji: "🍊", category: "Fruits" },
      { name: "Tomato", emoji: "🍅", category: "Vegetables" },
      { name: "Grapes", emoji: "🍇", category: "Fruits" },
      { name: "Corn", emoji: "🌽", category: "Vegetables" },
    ],
  },
  {
    id: "animals",
    title: "Farm & Wild Animals",
    categories: [
      { name: "Farm", icon: "🐄", color: "from-amber-400 to-orange-500" },
      { name: "Wild", icon: "🦁", color: "from-emerald-400 to-teal-500" },
    ],
    items: [
      { name: "Cow", emoji: "🐄", category: "Farm" },
      { name: "Lion", emoji: "🦁", category: "Wild" },
      { name: "Pig", emoji: "🐷", category: "Farm" },
      { name: "Elephant", emoji: "🐘", category: "Wild" },
      { name: "Chicken", emoji: "🐔", category: "Farm" },
      { name: "Tiger", emoji: "🐯", category: "Wild" },
      { name: "Horse", emoji: "🐴", category: "Farm" },
      { name: "Giraffe", emoji: "🦒", category: "Wild" },
    ],
  },
  {
    id: "weather",
    title: "Hot & Cold Weather",
    categories: [
      { name: "Hot Weather", icon: "☀️", color: "from-yellow-400 to-orange-500" },
      { name: "Cold Weather", icon: "❄️", color: "from-sky-400 to-blue-500" },
    ],
    items: [
      { name: "Sun", emoji: "☀️", category: "Hot Weather" },
      { name: "Snow", emoji: "❄️", category: "Cold Weather" },
      { name: "Beach", emoji: "🏖️", category: "Hot Weather" },
      { name: "Mittens", emoji: "🧤", category: "Cold Weather" },
      { name: "Ice cream", emoji: "🍦", category: "Hot Weather" },
      { name: "Snowman", emoji: "⛄", category: "Cold Weather" },
      { name: "Sunglasses", emoji: "🕶️", category: "Hot Weather" },
      { name: "Hot cocoa", emoji: "☕", category: "Cold Weather" },
    ],
  },
  {
    id: "rooms",
    title: "Kitchen & Bathroom",
    categories: [
      { name: "Kitchen", icon: "🍳", color: "from-amber-400 to-yellow-500" },
      { name: "Bathroom", icon: "🛁", color: "from-sky-400 to-cyan-500" },
    ],
    items: [
      { name: "Frying pan", emoji: "🍳", category: "Kitchen" },
      { name: "Bathtub", emoji: "🛁", category: "Bathroom" },
      { name: "Knife", emoji: "🔪", category: "Kitchen" },
      { name: "Toothbrush", emoji: "🪥", category: "Bathroom" },
      { name: "Pot", emoji: "🍲", category: "Kitchen" },
      { name: "Soap", emoji: "🧼", category: "Bathroom" },
      { name: "Fork", emoji: "🍴", category: "Kitchen" },
      { name: "Towel", emoji: "🧴", category: "Bathroom" },
    ],
  },
];

interface SortedItem {
  name: string;
  emoji: string;
  category: string;
}

// Shuffle array
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export default function SortingGamePage() {
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [unsortedItems, setUnsortedItems] = useState<SortedItem[]>(() => 
    shuffleArray(sortingSets[0].items)
  );
  const [sortedItems, setSortedItems] = useState<Record<string, SortedItem[]>>({
    [sortingSets[0].categories[0].name]: [],
    [sortingSets[0].categories[1].name]: [],
  });
  const [feedback, setFeedback] = useState<{ item: string; correct: boolean } | null>(null);
  const [score, setScore] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);

  const currentSet = sortingSets[currentSetIndex];

  // Handle dropping an item into a category
  const handleSort = useCallback((item: SortedItem, targetCategory: string) => {
    const isCorrect = item.category === targetCategory;
    
    setFeedback({ item: item.name, correct: isCorrect });
    
    if (isCorrect) {
      setScore((prev) => prev + 1);
      setUnsortedItems((prev) => prev.filter((i) => i.name !== item.name));
      setSortedItems((prev) => ({
        ...prev,
        [targetCategory]: [...prev[targetCategory], item],
      }));
      
      // Check if set is complete
      setTimeout(() => {
        setFeedback(null);
        if (unsortedItems.length === 1) {
          // This was the last item
          if (currentSetIndex < sortingSets.length - 1) {
            // Move to next set
            setTimeout(() => {
              const nextSet = sortingSets[currentSetIndex + 1];
              setCurrentSetIndex(currentSetIndex + 1);
              setUnsortedItems(shuffleArray(nextSet.items));
              setSortedItems({
                [nextSet.categories[0].name]: [],
                [nextSet.categories[1].name]: [],
              });
            }, 500);
          } else {
            // Game complete
            setGameComplete(true);
          }
        }
      }, 800);
    } else {
      setTimeout(() => setFeedback(null), 1000);
    }
  }, [unsortedItems.length, currentSetIndex]);

  const playAgain = () => {
    setCurrentSetIndex(0);
    setUnsortedItems(shuffleArray(sortingSets[0].items));
    setSortedItems({
      [sortingSets[0].categories[0].name]: [],
      [sortingSets[0].categories[1].name]: [],
    });
    setScore(0);
    setGameComplete(false);
    setFeedback(null);
  };

  if (gameComplete) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-6 py-8">
        <motion.div
          className="max-w-sm text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <span className="text-6xl">🏆</span>
          <h1 className="mt-4 text-3xl font-bold text-slate-800 dark:text-white">
            All Sorted!
          </h1>
          <div className="mt-4 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 px-8 py-6 dark:from-amber-900/30 dark:to-orange-900/30">
            <p className="text-lg text-amber-800 dark:text-amber-300">You sorted</p>
            <p className="text-5xl font-bold text-amber-600 dark:text-amber-400">
              {score}
            </p>
            <p className="text-amber-700 dark:text-amber-300">items correctly!</p>
          </div>
          <p className="mt-4 text-slate-600 dark:text-slate-400">
            Great job putting everything in its place!
          </p>
          <div className="mt-8 flex gap-4">
            <motion.button
              onClick={playAgain}
              className="flex-1 rounded-xl bg-sky-500 py-4 font-semibold text-white shadow-lg"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Play Again
            </motion.button>
            <Link href="/patient/games" className="flex-1">
              <motion.button
                className="w-full rounded-xl bg-slate-100 py-4 font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                More Games
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-8 pt-20">
      {/* Header */}
      <motion.header
        className="text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
          📦 Sort It Out
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          {currentSet.title}
        </p>
      </motion.header>

      {/* Progress */}
      <motion.div
        className="mx-auto mt-4 max-w-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400">
          <span>Set {currentSetIndex + 1} of {sortingSets.length}</span>
          <span>Score: {score}</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
          <motion.div
            className="h-full bg-gradient-to-r from-amber-500 to-orange-500"
            animate={{ width: `${((currentSetIndex * 8 + (8 - unsortedItems.length)) / (sortingSets.length * 8)) * 100}%` }}
          />
        </div>
      </motion.div>

      {/* Categories (Drop Zones) */}
      <motion.div
        className="mx-auto mt-6 grid max-w-lg grid-cols-2 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {currentSet.categories.map((category) => (
          <motion.div
            key={category.name}
            className={`min-h-[200px] rounded-2xl bg-gradient-to-br ${category.color} p-4 shadow-lg`}
            whileHover={{ scale: 1.02 }}
          >
            <div className="mb-3 flex items-center justify-center gap-2">
              <span className="text-2xl">{category.icon}</span>
              <h2 className="text-lg font-bold text-white">{category.name}</h2>
            </div>
            
            {/* Sorted Items */}
            <div className="flex flex-wrap justify-center gap-2">
              <AnimatePresence>
                {sortedItems[category.name]?.map((item) => (
                  <motion.div
                    key={item.name}
                    className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/90 text-2xl shadow-md"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring" }}
                  >
                    {item.emoji}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Drop hint */}
            {sortedItems[category.name]?.length === 0 && (
              <p className="mt-4 text-center text-sm text-white/70">
                Tap items below to sort here
              </p>
            )}
          </motion.div>
        ))}
      </motion.div>

      {/* Feedback */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            className={`mx-auto mt-4 max-w-sm rounded-xl px-4 py-2 text-center ${
              feedback.correct 
                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300" 
                : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
            }`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            {feedback.correct ? "✓ Correct!" : "✗ Try the other category"}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Unsorted Items */}
      <motion.div
        className="mx-auto mt-6 max-w-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <p className="mb-3 text-center text-sm font-medium text-slate-600 dark:text-slate-400">
          Tap an item, then tap where it belongs:
        </p>
        
        <div className="flex flex-wrap justify-center gap-3">
          <AnimatePresence>
            {unsortedItems.map((item) => (
              <motion.div
                key={item.name}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5, y: -50 }}
                className="group relative"
              >
                <motion.button
                  className="flex h-20 w-20 flex-col items-center justify-center rounded-2xl bg-white shadow-lg dark:bg-slate-800"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="text-3xl">{item.emoji}</span>
                  <span className="mt-1 text-xs font-medium text-slate-600 dark:text-slate-400">
                    {item.name}
                  </span>
                </motion.button>

                {/* Category Choice Buttons (appear on hover/tap) */}
                <motion.div
                  className="absolute -top-2 left-1/2 flex -translate-x-1/2 gap-1 opacity-0 transition-opacity group-hover:opacity-100"
                  initial={false}
                >
                  {currentSet.categories.map((category) => (
                    <motion.button
                      key={category.name}
                      onClick={() => handleSort(item, category.name)}
                      className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${category.color} text-lg shadow-md`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {category.icon}
                    </motion.button>
                  ))}
                </motion.div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        
        {unsortedItems.length === 0 && (
          <motion.p
            className="text-center text-lg text-emerald-600 dark:text-emerald-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Set complete! 🎉
          </motion.p>
        )}
      </motion.div>

      {/* Instructions */}
      <motion.div
        className="mx-auto mt-8 max-w-sm text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <div className="rounded-2xl bg-white/60 px-4 py-3 shadow-sm dark:bg-slate-800/60">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            💡 Hover over items to see sorting buttons
          </p>
        </div>
      </motion.div>

      {/* Back to Games */}
      <motion.div
        className="mx-auto mt-6 max-w-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        <Link href="/patient/games">
          <motion.button
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-100 py-3 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Back to Games
          </motion.button>
        </Link>
      </motion.div>
    </div>
  );
}
