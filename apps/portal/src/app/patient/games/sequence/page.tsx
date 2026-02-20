"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useCallback, useEffect } from "react";
import Link from "next/link";

// Colors for the game
const gameColors = [
  { id: "red", color: "bg-red-500", activeColor: "bg-red-300", name: "Red" },
  { id: "blue", color: "bg-blue-500", activeColor: "bg-blue-300", name: "Blue" },
  { id: "green", color: "bg-green-500", activeColor: "bg-green-300", name: "Green" },
  { id: "yellow", color: "bg-yellow-500", activeColor: "bg-yellow-300", name: "Yellow" },
];

type GameState = "watching" | "playing" | "success" | "failed" | "complete";

export default function SequencePage() {
  const [sequence, setSequence] = useState<string[]>([]);
  const [playerInput, setPlayerInput] = useState<string[]>([]);
  const [gameState, setGameState] = useState<GameState>("watching");
  const [activeColor, setActiveColor] = useState<string | null>(null);
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [showingIndex, setShowingIndex] = useState(-1);

  // Start a new game
  const startGame = useCallback(() => {
    const firstColor = gameColors[Math.floor(Math.random() * gameColors.length)].id;
    setSequence([firstColor]);
    setPlayerInput([]);
    setLevel(1);
    setScore(0);
    setGameState("watching");
  }, []);

  // Add to sequence and show it
  const nextLevel = useCallback(() => {
    const newColor = gameColors[Math.floor(Math.random() * gameColors.length)].id;
    setSequence((prev) => [...prev, newColor]);
    setPlayerInput([]);
    setLevel((prev) => prev + 1);
    setGameState("watching");
  }, []);

  // Play the sequence
  useEffect(() => {
    if (gameState !== "watching" || sequence.length === 0) return;

    let index = 0;
    const playSequence = () => {
      if (index < sequence.length) {
        setShowingIndex(index);
        setActiveColor(sequence[index]);
        
        setTimeout(() => {
          setActiveColor(null);
          index++;
          setTimeout(playSequence, 300);
        }, 600);
      } else {
        setShowingIndex(-1);
        setGameState("playing");
      }
    };

    // Small delay before starting
    setTimeout(playSequence, 500);
  }, [gameState, sequence]);

  // Handle player input
  const handleColorPress = useCallback((colorId: string) => {
    if (gameState !== "playing") return;

    setActiveColor(colorId);
    setTimeout(() => setActiveColor(null), 200);

    const newInput = [...playerInput, colorId];
    setPlayerInput(newInput);

    const currentIndex = newInput.length - 1;

    // Check if correct
    if (sequence[currentIndex] !== colorId) {
      // Wrong!
      setGameState("failed");
      if (score > highScore) {
        setHighScore(score);
      }
      return;
    }

    // Check if sequence complete
    if (newInput.length === sequence.length) {
      // Success!
      setScore((prev) => prev + level * 10);
      
      if (level >= 10) {
        // Game complete!
        setGameState("complete");
        if (score + level * 10 > highScore) {
          setHighScore(score + level * 10);
        }
      } else {
        setGameState("success");
        setTimeout(nextLevel, 1000);
      }
    }
  }, [gameState, playerInput, sequence, level, score, highScore, nextLevel]);

  // Initial start
  useEffect(() => {
    startGame();
  }, [startGame]);

  return (
    <div className="flex min-h-screen flex-col px-6 py-8 pt-20 pb-32">
      {/* Header */}
      <motion.header
        className="text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
          🎨 Color Sequence
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Watch and repeat the pattern
        </p>
      </motion.header>

      {/* Score Display */}
      <motion.div
        className="mx-auto mt-4 flex max-w-sm justify-between text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="rounded-xl bg-white px-6 py-3 shadow-sm dark:bg-slate-800">
          <p className="text-xs text-slate-500 dark:text-slate-400">Level</p>
          <p className="text-2xl font-bold text-slate-800 dark:text-white">{level}</p>
        </div>
        <div className="rounded-xl bg-white px-6 py-3 shadow-sm dark:bg-slate-800">
          <p className="text-xs text-slate-500 dark:text-slate-400">Score</p>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{score}</p>
        </div>
        <div className="rounded-xl bg-white px-6 py-3 shadow-sm dark:bg-slate-800">
          <p className="text-xs text-slate-500 dark:text-slate-400">Best</p>
          <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{highScore}</p>
        </div>
      </motion.div>

      {/* Status Message */}
      <motion.div
        className="mx-auto mt-6 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <AnimatePresence mode="wait">
          {gameState === "watching" && (
            <motion.div
              key="watching"
              className="rounded-xl bg-amber-100 px-6 py-3 dark:bg-amber-900/30"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
            >
              <p className="text-lg font-semibold text-amber-800 dark:text-amber-300">
                👀 Watch the pattern...
              </p>
              <p className="text-sm text-amber-600 dark:text-amber-400">
                Color {showingIndex + 1} of {sequence.length}
              </p>
            </motion.div>
          )}
          {gameState === "playing" && (
            <motion.div
              key="playing"
              className="rounded-xl bg-sky-100 px-6 py-3 dark:bg-sky-900/30"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
            >
              <p className="text-lg font-semibold text-sky-800 dark:text-sky-300">
                🎯 Your turn! Repeat it.
              </p>
              <p className="text-sm text-sky-600 dark:text-sky-400">
                {playerInput.length} of {sequence.length}
              </p>
            </motion.div>
          )}
          {gameState === "success" && (
            <motion.div
              key="success"
              className="rounded-xl bg-emerald-100 px-6 py-3 dark:bg-emerald-900/30"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
            >
              <p className="text-lg font-semibold text-emerald-800 dark:text-emerald-300">
                🎉 Perfect! +{level * 10} points
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Color Buttons */}
      <motion.div
        className="mx-auto mt-8 grid max-w-xs grid-cols-2 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        {gameColors.map((color) => (
          <motion.button
            key={color.id}
            onClick={() => handleColorPress(color.id)}
            disabled={gameState !== "playing"}
            className={`aspect-square rounded-3xl shadow-lg transition-all ${
              activeColor === color.id ? color.activeColor : color.color
            } ${gameState === "playing" ? "cursor-pointer" : "cursor-default"}`}
            whileHover={gameState === "playing" ? { scale: 1.02 } : {}}
            whileTap={gameState === "playing" ? { scale: 0.95 } : {}}
            animate={activeColor === color.id ? { scale: 1.1 } : { scale: 1 }}
          >
            <span className="sr-only">{color.name}</span>
          </motion.button>
        ))}
      </motion.div>

      {/* Progress Dots */}
      <motion.div
        className="mx-auto mt-6 flex justify-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {sequence.map((colorId, index) => {
          const color = gameColors.find((c) => c.id === colorId);
          const isCompleted = index < playerInput.length;
          const isCurrent = index === playerInput.length && gameState === "playing";
          
          return (
            <motion.div
              key={index}
              className={`h-4 w-4 rounded-full ${
                isCompleted 
                  ? color?.color 
                  : isCurrent 
                  ? "bg-slate-400 dark:bg-slate-500" 
                  : "bg-slate-200 dark:bg-slate-700"
              }`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1 }}
            />
          );
        })}
      </motion.div>

      {/* Failed State */}
      <AnimatePresence>
        {gameState === "failed" && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full max-w-sm rounded-3xl bg-white p-8 text-center shadow-2xl dark:bg-slate-800"
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
            >
              <span className="text-6xl">💫</span>
              <h2 className="mt-4 text-2xl font-bold text-slate-800 dark:text-white">
                Good Try!
              </h2>
              <p className="mt-2 text-slate-600 dark:text-slate-400">
                You reached level {level}
              </p>
              <div className="mt-4 rounded-xl bg-slate-100 px-6 py-4 dark:bg-slate-700">
                <p className="text-3xl font-bold text-slate-800 dark:text-white">
                  Score: {score}
                </p>
              </div>
              <div className="mt-6 flex gap-4">
                <motion.button
                  onClick={startGame}
                  className="flex-1 rounded-xl bg-sky-500 py-4 font-semibold text-white shadow-lg"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Try Again
                </motion.button>
                <Link href="/patient/games" className="flex-1">
                  <motion.button
                    className="w-full rounded-xl bg-slate-200 py-4 font-semibold text-slate-700 dark:bg-slate-600 dark:text-slate-200"
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

      {/* Complete State */}
      <AnimatePresence>
        {gameState === "complete" && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full max-w-sm rounded-3xl bg-white p-8 text-center shadow-2xl dark:bg-slate-800"
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
            >
              <motion.span
                className="text-6xl"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5, repeat: 3 }}
              >
                🏆
              </motion.span>
              <h2 className="mt-4 text-2xl font-bold text-slate-800 dark:text-white">
                Amazing Memory!
              </h2>
              <p className="mt-2 text-slate-600 dark:text-slate-400">
                You completed all 10 levels!
              </p>
              <div className="mt-4 rounded-xl bg-gradient-to-r from-amber-100 to-yellow-100 px-6 py-4 dark:from-amber-900/30 dark:to-yellow-900/30">
                <p className="text-4xl font-bold text-amber-600">
                  {score + level * 10}
                </p>
                <p className="text-amber-700 dark:text-amber-400">points</p>
              </div>
              <div className="mt-6 flex gap-4">
                <motion.button
                  onClick={startGame}
                  className="flex-1 rounded-xl bg-sky-500 py-4 font-semibold text-white shadow-lg"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Play Again
                </motion.button>
                <Link href="/patient/games" className="flex-1">
                  <motion.button
                    className="w-full rounded-xl bg-slate-200 py-4 font-semibold text-slate-700 dark:bg-slate-600 dark:text-slate-200"
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

      {/* Instructions */}
      <motion.div
        className="mx-auto mt-auto max-w-sm pt-8 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <div className="rounded-2xl bg-white/60 px-4 py-3 shadow-sm dark:bg-slate-800/60">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            🧠 Watch the colors light up, then tap them in the same order!
          </p>
        </div>
      </motion.div>

      {/* Back to Games */}
      <motion.div
        className="mx-auto mt-4 max-w-sm"
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
