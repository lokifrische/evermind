"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useCallback } from "react";
import Link from "next/link";

// Spot the difference puzzles
const puzzles = [
  {
    id: 1,
    name: "Kitchen Scene",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop",
    differences: [
      { id: 1, x: 25, y: 30, found: false, hint: "Look at the counter" },
      { id: 2, x: 65, y: 45, found: false, hint: "Check the window" },
      { id: 3, x: 80, y: 70, found: false, hint: "Near the bottom right" },
    ],
  },
  {
    id: 2,
    name: "Garden View",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop",
    differences: [
      { id: 1, x: 30, y: 25, found: false, hint: "Look at the flowers" },
      { id: 2, x: 70, y: 50, found: false, hint: "Check the fence" },
      { id: 3, x: 50, y: 80, found: false, hint: "In the grass" },
    ],
  },
  {
    id: 3,
    name: "Living Room",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop",
    differences: [
      { id: 1, x: 20, y: 40, found: false, hint: "Look at the couch" },
      { id: 2, x: 55, y: 20, found: false, hint: "Check the wall" },
      { id: 3, x: 85, y: 60, found: false, hint: "Near the lamp" },
    ],
  },
];

interface Difference {
  id: number;
  x: number;
  y: number;
  found: boolean;
  hint: string;
}

export default function SpotDifferencePage() {
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);
  const [differences, setDifferences] = useState<Difference[]>(
    puzzles[0].differences.map(d => ({ ...d }))
  );
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);
  const [taps, setTaps] = useState(0);
  const [feedback, setFeedback] = useState<{ x: number; y: number; correct: boolean } | null>(null);
  const [puzzleComplete, setPuzzleComplete] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);

  const currentPuzzle = puzzles[currentPuzzleIndex];
  const foundCount = differences.filter(d => d.found).length;
  const totalDifferences = differences.length;

  // Get next unfound difference for hint
  const getHint = () => {
    const unfound = differences.find(d => !d.found);
    return unfound?.hint || "All found!";
  };

  // Handle tap on image
  const handleImageTap = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (puzzleComplete) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setTaps(prev => prev + 1);

    // Check if near any difference (within 12% tolerance)
    const tolerance = 12;
    let found = false;
    
    setDifferences(prev => {
      const newDiffs = prev.map(diff => {
        if (!diff.found && Math.abs(diff.x - x) < tolerance && Math.abs(diff.y - y) < tolerance) {
          found = true;
          setScore(s => s + 50);
          return { ...diff, found: true };
        }
        return diff;
      });
      return newDiffs;
    });

    // Show feedback
    setFeedback({ x, y, correct: found });
    setTimeout(() => setFeedback(null), 800);

    // Check if all found
    if (found) {
      setTimeout(() => {
        const allFound = differences.filter(d => d.found).length + 1 >= totalDifferences;
        if (allFound) {
          setPuzzleComplete(true);
        }
      }, 100);
    }
  }, [puzzleComplete, differences, totalDifferences]);

  // Next puzzle
  const nextPuzzle = () => {
    if (currentPuzzleIndex < puzzles.length - 1) {
      const nextIndex = currentPuzzleIndex + 1;
      setCurrentPuzzleIndex(nextIndex);
      setDifferences(puzzles[nextIndex].differences.map(d => ({ ...d })));
      setPuzzleComplete(false);
      setShowHint(false);
    } else {
      setGameComplete(true);
    }
  };

  // Play again
  const playAgain = () => {
    setCurrentPuzzleIndex(0);
    setDifferences(puzzles[0].differences.map(d => ({ ...d })));
    setScore(0);
    setTaps(0);
    setPuzzleComplete(false);
    setGameComplete(false);
    setShowHint(false);
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
            All Puzzles Complete!
          </h1>
          <div className="mt-4 rounded-2xl bg-gradient-to-br from-purple-100 to-pink-100 px-8 py-6 dark:from-purple-900/30 dark:to-pink-900/30">
            <p className="text-lg text-purple-800 dark:text-purple-300">Final Score</p>
            <p className="text-5xl font-bold text-purple-600 dark:text-purple-400">
              {score}
            </p>
            <p className="mt-1 text-purple-700 dark:text-purple-300">
              in {taps} taps
            </p>
          </div>
          <p className="mt-4 text-slate-600 dark:text-slate-400">
            Great observation skills! 👀
          </p>
          <div className="mt-8 flex gap-4">
            <motion.button
              onClick={playAgain}
              className="flex-1 rounded-xl bg-purple-500 py-4 font-semibold text-white shadow-lg"
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
    <div className="min-h-screen px-6 py-8 pt-20 pb-32">
      {/* Header */}
      <motion.header
        className="text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
          👀 Spot the Difference
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Find the hidden circles!
        </p>
      </motion.header>

      {/* Progress */}
      <motion.div
        className="mx-auto mt-4 max-w-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-600 dark:text-slate-400">
            Puzzle {currentPuzzleIndex + 1} of {puzzles.length}: {currentPuzzle.name}
          </span>
          <span className="font-semibold text-purple-600 dark:text-purple-400">
            Score: {score}
          </span>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <span className="text-sm text-slate-500">Found:</span>
          {differences.map((diff, i) => (
            <motion.div
              key={i}
              className={`h-4 w-4 rounded-full ${
                diff.found ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-600"
              }`}
              animate={diff.found ? { scale: [1, 1.3, 1] } : {}}
              transition={{ duration: 0.3 }}
            />
          ))}
          <span className="ml-auto text-sm text-slate-500">{foundCount}/{totalDifferences}</span>
        </div>
      </motion.div>

      {/* Puzzle Image */}
      <motion.div
        className="mx-auto mt-6 max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div
          className="relative aspect-[4/3] cursor-pointer overflow-hidden rounded-2xl shadow-xl"
          onClick={handleImageTap}
        >
          <img
            src={currentPuzzle.image}
            alt={currentPuzzle.name}
            className="h-full w-full object-cover"
          />
          
          {/* Hidden difference markers (invisible until found) */}
          {differences.map((diff) => (
            <AnimatePresence key={diff.id}>
              {diff.found && (
                <motion.div
                  className="absolute flex items-center justify-center"
                  style={{ left: `${diff.x}%`, top: `${diff.y}%`, transform: "translate(-50%, -50%)" }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                >
                  <div className="h-12 w-12 rounded-full border-4 border-emerald-500 bg-emerald-500/30" />
                  <span className="absolute text-2xl">✓</span>
                </motion.div>
              )}
            </AnimatePresence>
          ))}

          {/* Tap feedback */}
          <AnimatePresence>
            {feedback && (
              <motion.div
                className="pointer-events-none absolute"
                style={{ left: `${feedback.x}%`, top: `${feedback.y}%`, transform: "translate(-50%, -50%)" }}
                initial={{ scale: 0, opacity: 1 }}
                animate={{ scale: 1.5, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className={`h-12 w-12 rounded-full border-4 ${
                  feedback.correct ? "border-emerald-500 bg-emerald-500/30" : "border-red-400 bg-red-400/30"
                }`} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Puzzle Complete Overlay */}
          <AnimatePresence>
            {puzzleComplete && (
              <motion.div
                className="absolute inset-0 flex flex-col items-center justify-center bg-emerald-500/90"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.span
                  className="text-6xl"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", bounce: 0.5 }}
                >
                  🎉
                </motion.span>
                <motion.p
                  className="mt-4 text-2xl font-bold text-white"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  All Found!
                </motion.p>
                <motion.button
                  onClick={nextPuzzle}
                  className="mt-6 rounded-xl bg-white px-8 py-3 font-semibold text-emerald-600 shadow-lg"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {currentPuzzleIndex < puzzles.length - 1 ? "Next Puzzle →" : "See Results"}
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Hint Button */}
        {!puzzleComplete && (
          <motion.div
            className="mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {!showHint ? (
              <motion.button
                onClick={() => setShowHint(true)}
                className="w-full rounded-xl bg-amber-100 px-4 py-3 text-amber-800 transition-colors hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-300"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                💡 Need a hint?
              </motion.button>
            ) : (
              <div className="rounded-xl bg-amber-100 px-4 py-3 text-center dark:bg-amber-900/30">
                <p className="text-sm font-medium text-amber-600 dark:text-amber-400">Hint:</p>
                <p className="text-lg text-amber-800 dark:text-amber-300">{getHint()}</p>
              </div>
            )}
          </motion.div>
        )}
      </motion.div>

      {/* Instructions */}
      <motion.div
        className="mx-auto mt-6 max-w-md text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="rounded-2xl bg-white/60 px-4 py-3 shadow-sm dark:bg-slate-800/60">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            👆 Tap on the image where you think a difference is hiding!
          </p>
        </div>
      </motion.div>

      {/* Back to Games */}
      <motion.div
        className="mx-auto mt-4 max-w-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
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
