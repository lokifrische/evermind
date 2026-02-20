"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useCallback, useEffect } from "react";
import Link from "next/link";

// Problem types
type Operation = "+" | "-" | "×";

interface MathProblem {
  num1: number;
  num2: number;
  operation: Operation;
  answer: number;
  options: number[];
}

// Generate a problem
function generateProblem(difficulty: "easy" | "medium"): MathProblem {
  const operations: Operation[] = difficulty === "easy" ? ["+", "-"] : ["+", "-", "×"];
  const operation = operations[Math.floor(Math.random() * operations.length)];
  
  let num1: number, num2: number, answer: number;
  
  if (difficulty === "easy") {
    if (operation === "+") {
      num1 = Math.floor(Math.random() * 10) + 1;
      num2 = Math.floor(Math.random() * 10) + 1;
      answer = num1 + num2;
    } else {
      num1 = Math.floor(Math.random() * 15) + 5;
      num2 = Math.floor(Math.random() * num1);
      answer = num1 - num2;
    }
  } else {
    if (operation === "+") {
      num1 = Math.floor(Math.random() * 50) + 10;
      num2 = Math.floor(Math.random() * 50) + 10;
      answer = num1 + num2;
    } else if (operation === "-") {
      num1 = Math.floor(Math.random() * 50) + 20;
      num2 = Math.floor(Math.random() * num1);
      answer = num1 - num2;
    } else {
      num1 = Math.floor(Math.random() * 10) + 2;
      num2 = Math.floor(Math.random() * 10) + 2;
      answer = num1 * num2;
    }
  }
  
  // Generate wrong options
  const wrongOptions = new Set<number>();
  while (wrongOptions.size < 3) {
    let wrong: number;
    const variance = difficulty === "easy" ? 5 : 15;
    wrong = answer + Math.floor(Math.random() * variance * 2) - variance;
    if (wrong !== answer && wrong > 0) {
      wrongOptions.add(wrong);
    }
  }
  
  // Shuffle options
  const options = [...Array.from(wrongOptions), answer].sort(() => Math.random() - 0.5);
  
  return { num1, num2, operation, answer, options };
}

export default function MathGamePage() {
  const [difficulty, setDifficulty] = useState<"easy" | "medium">("easy");
  const [problem, setProblem] = useState<MathProblem | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [problemCount, setProblemCount] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const totalProblems = 10;

  // Generate first problem
  useEffect(() => {
    setProblem(generateProblem(difficulty));
  }, [difficulty]);

  const handleAnswer = useCallback((answer: number) => {
    if (showResult || !problem) return;
    
    setSelectedAnswer(answer);
    setShowResult(true);

    const isCorrect = answer === problem.answer;
    if (isCorrect) {
      setScore((prev) => prev + (streak + 1) * 10);
      setStreak((prev) => prev + 1);
    } else {
      setStreak(0);
    }

    setTimeout(() => {
      const newCount = problemCount + 1;
      setProblemCount(newCount);
      
      if (newCount >= totalProblems) {
        setGameComplete(true);
      } else {
        setProblem(generateProblem(difficulty));
        setSelectedAnswer(null);
        setShowResult(false);
      }
    }, 1500);
  }, [showResult, problem, streak, problemCount, difficulty]);

  const getButtonStyle = (option: number) => {
    if (!showResult) {
      return "bg-white hover:bg-slate-50 text-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-white";
    }
    if (option === problem?.answer) {
      return "bg-emerald-500 text-white";
    }
    if (option === selectedAnswer && option !== problem?.answer) {
      return "bg-red-400 text-white";
    }
    return "bg-slate-200 text-slate-400 dark:bg-slate-700";
  };

  const playAgain = () => {
    setProblem(generateProblem(difficulty));
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setStreak(0);
    setProblemCount(0);
    setGameComplete(false);
  };

  const changeDifficulty = (newDifficulty: "easy" | "medium") => {
    setDifficulty(newDifficulty);
    playAgain();
  };

  if (gameComplete) {
    const maxScore = totalProblems * 100; // Max with perfect streak
    const percentage = Math.round((score / maxScore) * 100);
    
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-6 py-8">
        <motion.div
          className="max-w-sm text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <span className="text-6xl">
            {percentage >= 70 ? "🌟" : percentage >= 40 ? "👍" : "💪"}
          </span>
          <h1 className="mt-4 text-3xl font-bold text-slate-800 dark:text-white">
            {percentage >= 70 ? "Math Master!" : percentage >= 40 ? "Good Work!" : "Nice Try!"}
          </h1>
          <div className="mt-4 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 px-8 py-6 dark:from-emerald-900/30 dark:to-teal-900/30">
            <p className="text-lg text-emerald-800 dark:text-emerald-300">You scored</p>
            <p className="text-5xl font-bold text-emerald-600 dark:text-emerald-400">
              {score}
            </p>
            <p className="text-emerald-700 dark:text-emerald-300">points</p>
          </div>
          <p className="mt-4 text-slate-600 dark:text-slate-400">
            Mental math keeps your mind sharp! 🧠
          </p>
          <div className="mt-8 flex gap-4">
            <motion.button
              onClick={playAgain}
              className="flex-1 rounded-xl bg-emerald-500 py-4 font-semibold text-white shadow-lg"
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

  if (!problem) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-xl text-slate-600">Loading...</div>
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
          🔢 Quick Math
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Solve the problems!
        </p>
      </motion.header>

      {/* Difficulty Toggle */}
      <motion.div
        className="mx-auto mt-4 flex max-w-xs gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {(["easy", "medium"] as const).map((d) => (
          <button
            key={d}
            onClick={() => changeDifficulty(d)}
            className={`flex-1 rounded-full py-2 text-sm font-semibold transition-colors ${
              difficulty === d
                ? "bg-emerald-500 text-white shadow-md"
                : "bg-white text-slate-600 shadow-sm dark:bg-slate-800 dark:text-slate-300"
            }`}
          >
            {d === "easy" ? "Easy" : "Medium"}
          </button>
        ))}
      </motion.div>

      {/* Progress */}
      <motion.div
        className="mx-auto mt-4 max-w-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-600 dark:text-slate-400">
            Problem {problemCount + 1} of {totalProblems}
          </span>
          <span className="font-semibold text-emerald-600 dark:text-emerald-400">
            Score: {score}
          </span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
          <motion.div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-500"
            animate={{ width: `${(problemCount / totalProblems) * 100}%` }}
          />
        </div>
        {streak > 1 && (
          <motion.p
            className="mt-2 text-center text-sm font-medium text-amber-600 dark:text-amber-400"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            🔥 {streak} in a row!
          </motion.p>
        )}
      </motion.div>

      {/* Problem Card */}
      <motion.div
        className="mx-auto mt-8 max-w-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        key={problemCount}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={problemCount}
            className="overflow-hidden rounded-3xl bg-white shadow-xl dark:bg-slate-800"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            {/* Problem Display */}
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-8 text-center">
              <motion.div
                className="text-6xl font-bold text-white"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
              >
                {problem.num1} {problem.operation} {problem.num2}
              </motion.div>
              <p className="mt-2 text-2xl text-white/80">= ?</p>
            </div>

            {/* Answer Options */}
            <div className="grid grid-cols-2 gap-3 p-6">
              {problem.options.map((option, index) => (
                <motion.button
                  key={`${problemCount}-${option}`}
                  onClick={() => handleAnswer(option)}
                  disabled={showResult}
                  className={`rounded-2xl py-6 text-3xl font-bold shadow-md transition-colors ${getButtonStyle(option)}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  whileHover={!showResult ? { scale: 1.02 } : {}}
                  whileTap={!showResult ? { scale: 0.98 } : {}}
                >
                  {option}
                </motion.button>
              ))}
            </div>

            {/* Result Feedback */}
            <AnimatePresence>
              {showResult && (
                <motion.div
                  className={`p-4 text-center ${
                    selectedAnswer === problem.answer
                      ? "bg-emerald-100 dark:bg-emerald-900/30"
                      : "bg-amber-100 dark:bg-amber-900/30"
                  }`}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <p className={`text-lg font-bold ${
                    selectedAnswer === problem.answer
                      ? "text-emerald-800 dark:text-emerald-300"
                      : "text-amber-800 dark:text-amber-300"
                  }`}>
                    {selectedAnswer === problem.answer 
                      ? `✓ Correct! +${(streak + 1) * 10} points` 
                      : `The answer was ${problem.answer}`}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>
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
            🎯 Build a streak for bonus points!
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
