"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

// Simple, familiar words for cognitive support
const wordBank = [
  { word: "HEART", hint: "It beats inside you" },
  { word: "SMILE", hint: "What happy faces do" },
  { word: "BREAD", hint: "Baked food for sandwiches" },
  { word: "CHAIR", hint: "Something you sit on" },
  { word: "WATER", hint: "You drink this every day" },
  { word: "HOUSE", hint: "A place to call home" },
  { word: "MUSIC", hint: "What you listen to" },
  { word: "FLOWER", hint: "Beautiful plant in gardens" },
  { word: "SUNNY", hint: "A bright, clear day" },
  { word: "APPLE", hint: "A red or green fruit" },
  { word: "DANCE", hint: "Moving to music" },
  { word: "SLEEP", hint: "What you do at night" },
];

// Keyboard layout
const keyboardRows = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["Z", "X", "C", "V", "B", "N", "M"],
];

interface LetterGuess {
  letter: string;
  status: "correct" | "present" | "absent" | "empty";
}

export default function WordGamePage() {
  const [currentWord, setCurrentWord] = useState(wordBank[0]);
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState("");
  const [gameStatus, setGameStatus] = useState<"playing" | "won" | "lost">("playing");
  const [showHint, setShowHint] = useState(false);
  const [usedLetters, setUsedLetters] = useState<Record<string, "correct" | "present" | "absent">>({});
  const [shake, setShake] = useState(false);
  const maxGuesses = 6;
  const wordLength = currentWord.word.length;

  // Initialize with random word
  useEffect(() => {
    const randomWord = wordBank[Math.floor(Math.random() * wordBank.length)];
    setCurrentWord(randomWord);
  }, []);

  // Check guess against word
  const checkGuess = useCallback((guess: string): LetterGuess[] => {
    const result: LetterGuess[] = [];
    const wordLetters = currentWord.word.split("");
    const guessLetters = guess.split("");
    const remainingLetters = [...wordLetters];

    // First pass: mark correct letters
    guessLetters.forEach((letter, i) => {
      if (letter === wordLetters[i]) {
        result[i] = { letter, status: "correct" };
        remainingLetters[i] = "";
      } else {
        result[i] = { letter, status: "absent" };
      }
    });

    // Second pass: mark present letters
    guessLetters.forEach((letter, i) => {
      if (result[i].status !== "correct") {
        const remainingIndex = remainingLetters.indexOf(letter);
        if (remainingIndex !== -1) {
          result[i] = { letter, status: "present" };
          remainingLetters[remainingIndex] = "";
        }
      }
    });

    return result;
  }, [currentWord.word]);

  // Update used letters keyboard
  const updateUsedLetters = useCallback((guess: string, results: LetterGuess[]) => {
    const newUsed = { ...usedLetters };
    results.forEach((result) => {
      // Skip empty status (unfilled cells)
      if (result.status === "empty") return;
      
      const current = newUsed[result.letter];
      // Correct overrides everything, present overrides absent
      if (result.status === "correct" || (result.status === "present" && current !== "correct") || !current) {
        newUsed[result.letter] = result.status;
      }
    });
    setUsedLetters(newUsed);
  }, [usedLetters]);

  // Submit guess
  const submitGuess = useCallback(() => {
    if (currentGuess.length !== wordLength) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    const results = checkGuess(currentGuess);
    updateUsedLetters(currentGuess, results);
    setGuesses((prev) => [...prev, currentGuess]);
    
    if (currentGuess === currentWord.word) {
      setGameStatus("won");
    } else if (guesses.length + 1 >= maxGuesses) {
      setGameStatus("lost");
    }
    
    setCurrentGuess("");
  }, [currentGuess, wordLength, checkGuess, updateUsedLetters, currentWord.word, guesses.length]);

  // Handle key press
  const handleKeyPress = useCallback((key: string) => {
    if (gameStatus !== "playing") return;

    if (key === "ENTER") {
      submitGuess();
    } else if (key === "BACK") {
      setCurrentGuess((prev) => prev.slice(0, -1));
    } else if (currentGuess.length < wordLength && /^[A-Z]$/.test(key)) {
      setCurrentGuess((prev) => prev + key);
    }
  }, [gameStatus, submitGuess, currentGuess.length, wordLength]);

  // Play again
  const playAgain = () => {
    const newWord = wordBank[Math.floor(Math.random() * wordBank.length)];
    setCurrentWord(newWord);
    setGuesses([]);
    setCurrentGuess("");
    setGameStatus("playing");
    setShowHint(false);
    setUsedLetters({});
  };

  // Get row display with proper coloring
  const getRowDisplay = (rowIndex: number): LetterGuess[] => {
    if (rowIndex < guesses.length) {
      return checkGuess(guesses[rowIndex]);
    }
    if (rowIndex === guesses.length) {
      return currentGuess.padEnd(wordLength, " ").split("").map((l) => ({ 
        letter: l === " " ? "" : l, 
        status: "empty" as const 
      }));
    }
    return Array(wordLength).fill({ letter: "", status: "empty" as const });
  };

  // Get cell background color
  const getCellBg = (status: LetterGuess["status"]) => {
    switch (status) {
      case "correct": return "bg-emerald-500 border-emerald-500 text-white";
      case "present": return "bg-amber-500 border-amber-500 text-white";
      case "absent": return "bg-slate-400 border-slate-400 text-white";
      default: return "bg-white border-slate-300 text-slate-800 dark:bg-slate-800 dark:border-slate-600 dark:text-white";
    }
  };

  // Get key background color
  const getKeyBg = (key: string) => {
    const status = usedLetters[key];
    switch (status) {
      case "correct": return "bg-emerald-500 text-white";
      case "present": return "bg-amber-500 text-white";
      case "absent": return "bg-slate-400 text-white dark:bg-slate-600";
      default: return "bg-white text-slate-800 dark:bg-slate-700 dark:text-white";
    }
  };

  return (
    <div className="min-h-screen px-4 py-8 pt-20">
      {/* Header */}
      <motion.header
        className="text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
          📝 Daily Word
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Guess the {wordLength}-letter word
        </p>
      </motion.header>

      {/* Hint Button */}
      <motion.div 
        className="mx-auto mt-4 max-w-xs"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <AnimatePresence mode="wait">
          {!showHint ? (
            <motion.button
              key="hint-button"
              onClick={() => setShowHint(true)}
              className="w-full rounded-xl bg-amber-100 px-4 py-3 text-amber-800 transition-colors hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              exit={{ opacity: 0 }}
            >
              💡 Need a hint?
            </motion.button>
          ) : (
            <motion.div
              key="hint-text"
              className="rounded-xl bg-amber-100 px-4 py-3 text-center dark:bg-amber-900/30"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <p className="text-sm font-medium text-amber-600 dark:text-amber-400">Hint:</p>
              <p className="text-lg text-amber-800 dark:text-amber-300">{currentWord.hint}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Game Board */}
      <motion.div
        className={`mx-auto mt-6 max-w-xs ${shake ? "animate-shake" : ""}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="space-y-2">
          {Array.from({ length: maxGuesses }).map((_, rowIndex) => (
            <motion.div
              key={rowIndex}
              className="flex justify-center gap-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + rowIndex * 0.05 }}
            >
              {getRowDisplay(rowIndex).map((cell, cellIndex) => (
                <motion.div
                  key={cellIndex}
                  className={`flex h-14 w-14 items-center justify-center rounded-lg border-2 text-2xl font-bold transition-colors ${getCellBg(cell.status)}`}
                  initial={cell.status !== "empty" && rowIndex === guesses.length - 1 ? { rotateX: 0 } : {}}
                  animate={cell.status !== "empty" && rowIndex === guesses.length - 1 ? { rotateX: 360 } : {}}
                  transition={{ delay: cellIndex * 0.1, duration: 0.5 }}
                >
                  {cell.letter}
                </motion.div>
              ))}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Result Message */}
      <AnimatePresence>
        {gameStatus !== "playing" && (
          <motion.div
            className="mx-auto mt-6 max-w-xs text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
          >
            {gameStatus === "won" ? (
              <div className="rounded-2xl bg-emerald-100 px-6 py-4 dark:bg-emerald-900/30">
                <p className="text-2xl">🎉</p>
                <p className="mt-2 text-lg font-bold text-emerald-800 dark:text-emerald-300">
                  Wonderful!
                </p>
                <p className="text-emerald-600 dark:text-emerald-400">
                  You got it in {guesses.length} {guesses.length === 1 ? "try" : "tries"}!
                </p>
              </div>
            ) : (
              <div className="rounded-2xl bg-rose-100 px-6 py-4 dark:bg-rose-900/30">
                <p className="text-2xl">💭</p>
                <p className="mt-2 text-lg font-bold text-rose-800 dark:text-rose-300">
                  The word was: {currentWord.word}
                </p>
                <p className="text-rose-600 dark:text-rose-400">
                  Great effort! Try another?
                </p>
              </div>
            )}
            <motion.button
              onClick={playAgain}
              className="mt-4 rounded-xl bg-sky-500 px-8 py-3 font-semibold text-white shadow-lg"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Play Again
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Keyboard */}
      {gameStatus === "playing" && (
        <motion.div
          className="mx-auto mt-6 max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {keyboardRows.map((row, rowIndex) => (
            <div key={rowIndex} className="mb-2 flex justify-center gap-1">
              {rowIndex === 2 && (
                <motion.button
                  onClick={() => handleKeyPress("ENTER")}
                  className="flex h-12 items-center justify-center rounded-lg bg-emerald-500 px-3 text-sm font-bold text-white shadow-md"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  ENTER
                </motion.button>
              )}
              {row.map((key) => (
                <motion.button
                  key={key}
                  onClick={() => handleKeyPress(key)}
                  className={`flex h-12 w-9 items-center justify-center rounded-lg text-lg font-bold shadow-md transition-colors ${getKeyBg(key)}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {key}
                </motion.button>
              ))}
              {rowIndex === 2 && (
                <motion.button
                  onClick={() => handleKeyPress("BACK")}
                  className="flex h-12 items-center justify-center rounded-lg bg-slate-300 px-3 text-slate-700 shadow-md dark:bg-slate-600 dark:text-white"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9.75L14.25 12m0 0l2.25 2.25M14.25 12l2.25-2.25M14.25 12L12 14.25m-2.58 4.92l-6.375-6.375a1.125 1.125 0 010-1.59L9.42 4.83c.211-.211.498-.33.796-.33H19.5a2.25 2.25 0 012.25 2.25v10.5a2.25 2.25 0 01-2.25 2.25h-9.284c-.298 0-.585-.119-.796-.33z" />
                  </svg>
                </motion.button>
              )}
            </div>
          ))}
        </motion.div>
      )}

      {/* Instructions */}
      <motion.div
        className="mx-auto mt-8 max-w-xs text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        <div className="rounded-2xl bg-white/60 px-4 py-3 shadow-sm dark:bg-slate-800/60">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            <span className="inline-block h-4 w-4 rounded bg-emerald-500 align-middle" /> = Right spot
            <span className="mx-2">•</span>
            <span className="inline-block h-4 w-4 rounded bg-amber-500 align-middle" /> = Wrong spot
          </p>
        </div>
      </motion.div>

      {/* Back to Games */}
      <motion.div
        className="mx-auto mt-6 max-w-xs"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
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

      {/* CSS for shake animation */}
      <style jsx global>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
          20%, 40%, 60%, 80% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}
