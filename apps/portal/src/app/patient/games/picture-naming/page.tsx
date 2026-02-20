"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useCallback } from "react";
import Link from "next/link";

// Common, recognizable objects
const pictures = [
  { 
    id: "apple", 
    name: "Apple", 
    image: "https://images.unsplash.com/photo-1584306670957-acf935f5033c?w=600&h=600&fit=crop",
    hints: ["It's a fruit", "Red or green", "Keeps the doctor away"],
    category: "Food"
  },
  { 
    id: "cat", 
    name: "Cat", 
    image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&h=600&fit=crop",
    hints: ["It's a pet", "Says 'meow'", "Has whiskers"],
    category: "Animals"
  },
  { 
    id: "clock", 
    name: "Clock", 
    image: "https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=600&h=600&fit=crop",
    hints: ["It tells time", "Has hands or numbers", "Hangs on walls"],
    category: "Objects"
  },
  { 
    id: "flower", 
    name: "Flower", 
    image: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=600&h=600&fit=crop",
    hints: ["Grows in gardens", "Colorful petals", "Bees love them"],
    category: "Nature"
  },
  { 
    id: "book", 
    name: "Book", 
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&h=600&fit=crop",
    hints: ["You read it", "Has pages", "Tells stories"],
    category: "Objects"
  },
  { 
    id: "car", 
    name: "Car", 
    image: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600&h=600&fit=crop",
    hints: ["Has four wheels", "You drive it", "Goes on roads"],
    category: "Vehicles"
  },
  { 
    id: "sun", 
    name: "Sun", 
    image: "https://images.unsplash.com/photo-1532978379173-523e16f371f2?w=600&h=600&fit=crop",
    hints: ["It's in the sky", "Gives us light", "Warm and bright"],
    category: "Nature"
  },
  { 
    id: "dog", 
    name: "Dog", 
    image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&h=600&fit=crop",
    hints: ["It's a pet", "Says 'woof'", "Man's best friend"],
    category: "Animals"
  },
  { 
    id: "chair", 
    name: "Chair", 
    image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=600&h=600&fit=crop",
    hints: ["You sit on it", "Has four legs", "At the table"],
    category: "Objects"
  },
  { 
    id: "bread", 
    name: "Bread", 
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&h=600&fit=crop",
    hints: ["You eat it", "Made from flour", "Toast it"],
    category: "Food"
  },
];

// Shuffle array
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export default function PictureNamingPage() {
  const [shuffledPictures] = useState(() => shuffleArray(pictures));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);

  const currentPicture = shuffledPictures[currentIndex];
  const totalPictures = shuffledPictures.length;

  const showNextHint = () => {
    if (hintsUsed < currentPicture.hints.length) {
      setHintsUsed(hintsUsed + 1);
    }
  };

  const checkAnswer = useCallback(() => {
    const normalizedInput = userInput.trim().toLowerCase();
    const normalizedAnswer = currentPicture.name.toLowerCase();
    
    if (normalizedInput === normalizedAnswer) {
      setFeedback("correct");
      setScore((prev) => prev + Math.max(3 - hintsUsed, 1)); // More points for fewer hints
      
      setTimeout(() => {
        goToNext();
      }, 1500);
    } else {
      setFeedback("incorrect");
      setTimeout(() => setFeedback(null), 1000);
    }
  }, [userInput, currentPicture.name, hintsUsed]);

  const goToNext = () => {
    if (currentIndex < totalPictures - 1) {
      setCurrentIndex(currentIndex + 1);
      setHintsUsed(0);
      setShowAnswer(false);
      setUserInput("");
      setFeedback(null);
    } else {
      setGameComplete(true);
    }
  };

  const revealAnswer = () => {
    setShowAnswer(true);
    setTimeout(() => {
      goToNext();
    }, 2000);
  };

  const playAgain = () => {
    setCurrentIndex(0);
    setHintsUsed(0);
    setShowAnswer(false);
    setScore(0);
    setGameComplete(false);
    setUserInput("");
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
          <span className="text-6xl">🎉</span>
          <h1 className="mt-4 text-3xl font-bold text-slate-800 dark:text-white">
            All Done!
          </h1>
          <div className="mt-4 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 px-8 py-6 dark:from-emerald-900/30 dark:to-teal-900/30">
            <p className="text-lg text-emerald-800 dark:text-emerald-300">You scored</p>
            <p className="text-5xl font-bold text-emerald-600 dark:text-emerald-400">
              {score}
            </p>
            <p className="text-emerald-700 dark:text-emerald-300">points</p>
          </div>
          <p className="mt-4 text-slate-600 dark:text-slate-400">
            Great job naming all the pictures!
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
    <div className="min-h-screen px-6 py-8 pt-20">
      {/* Header */}
      <motion.header
        className="text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
          🖼️ Name That!
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          What do you see in the picture?
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
          <span>Picture {currentIndex + 1} of {totalPictures}</span>
          <span>Score: {score}</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
          <motion.div
            className="h-full bg-gradient-to-r from-sky-500 to-blue-500"
            initial={{ width: 0 }}
            animate={{ width: `${((currentIndex) / totalPictures) * 100}%` }}
          />
        </div>
      </motion.div>

      {/* Picture Card */}
      <motion.div
        className="mx-auto mt-6 max-w-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        key={currentPicture.id}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPicture.id}
            className="overflow-hidden rounded-3xl bg-white shadow-xl dark:bg-slate-800"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            {/* Image */}
            <div className="relative aspect-square">
              <img
                src={currentPicture.image}
                alt="What is this?"
                className="h-full w-full object-cover"
              />
              <div className="absolute left-3 top-3">
                <span className="rounded-full bg-black/50 px-3 py-1 text-sm font-medium text-white backdrop-blur-sm">
                  {currentPicture.category}
                </span>
              </div>
              
              {/* Correct Overlay */}
              <AnimatePresence>
                {feedback === "correct" && (
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center bg-emerald-500/80"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-center text-white"
                    >
                      <span className="text-6xl">✓</span>
                      <p className="mt-2 text-2xl font-bold">Correct!</p>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Answer Reveal Overlay */}
              <AnimatePresence>
                {showAnswer && (
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center bg-sky-500/90"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <motion.div
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      className="text-center text-white"
                    >
                      <p className="text-xl">It's a</p>
                      <p className="text-4xl font-bold">{currentPicture.name}</p>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Input Area */}
            <div className="p-6">
              {/* Hints */}
              <div className="mb-4 space-y-2">
                {currentPicture.hints.slice(0, hintsUsed).map((hint, index) => (
                  <motion.div
                    key={index}
                    className="rounded-lg bg-amber-50 px-3 py-2 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    💡 {hint}
                  </motion.div>
                ))}
              </div>

              {/* Text Input */}
              <div className="relative">
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && userInput.trim() && checkAnswer()}
                  placeholder="Type the name..."
                  className={`w-full rounded-2xl border-2 px-5 py-4 text-center text-xl font-semibold transition-colors focus:outline-none ${
                    feedback === "incorrect"
                      ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                      : "border-slate-200 bg-slate-50 focus:border-sky-500 dark:border-slate-600 dark:bg-slate-900"
                  }`}
                  autoComplete="off"
                />
                {feedback === "incorrect" && (
                  <motion.p
                    className="mt-2 text-center text-red-500"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    Try again!
                  </motion.p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-4 flex gap-3">
                <motion.button
                  onClick={showNextHint}
                  disabled={hintsUsed >= currentPicture.hints.length}
                  className="flex-1 rounded-xl bg-amber-100 py-3 font-medium text-amber-800 disabled:opacity-50 dark:bg-amber-900/30 dark:text-amber-300"
                  whileHover={{ scale: hintsUsed < currentPicture.hints.length ? 1.02 : 1 }}
                  whileTap={{ scale: hintsUsed < currentPicture.hints.length ? 0.98 : 1 }}
                >
                  💡 Hint ({currentPicture.hints.length - hintsUsed} left)
                </motion.button>
                <motion.button
                  onClick={checkAnswer}
                  disabled={!userInput.trim()}
                  className="flex-1 rounded-xl bg-emerald-500 py-3 font-semibold text-white disabled:opacity-50"
                  whileHover={{ scale: userInput.trim() ? 1.02 : 1 }}
                  whileTap={{ scale: userInput.trim() ? 0.98 : 1 }}
                >
                  Check ✓
                </motion.button>
              </div>

              {/* Skip Button */}
              <motion.button
                onClick={revealAnswer}
                className="mt-3 w-full rounded-xl py-2 text-slate-500 transition-colors hover:text-slate-700 dark:hover:text-slate-300"
                whileTap={{ scale: 0.98 }}
              >
                I don't know → Show me
              </motion.button>
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Back to Games */}
      <motion.div
        className="mx-auto mt-6 max-w-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
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
