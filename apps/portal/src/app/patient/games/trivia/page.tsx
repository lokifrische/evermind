"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useCallback } from "react";
import Link from "next/link";

// Trivia questions - nostalgic, simple, fun
const triviaQuestions = [
  {
    id: 1,
    question: "Who was the first man to walk on the moon?",
    options: ["Neil Armstrong", "Buzz Aldrin", "John Glenn", "Alan Shepard"],
    correct: "Neil Armstrong",
    hint: "He said 'One small step for man...'",
    year: 1969,
    category: "History",
    emoji: "🌙",
  },
  {
    id: 2,
    question: "What movie features the song 'Somewhere Over the Rainbow'?",
    options: ["The Sound of Music", "The Wizard of Oz", "Mary Poppins", "Cinderella"],
    correct: "The Wizard of Oz",
    hint: "Dorothy and her dog Toto...",
    year: 1939,
    category: "Movies",
    emoji: "🎬",
  },
  {
    id: 3,
    question: "Which President was known as 'The Great Communicator'?",
    options: ["John F. Kennedy", "Ronald Reagan", "Bill Clinton", "Barack Obama"],
    correct: "Ronald Reagan",
    hint: "He was also a Hollywood actor",
    year: 1980,
    category: "History",
    emoji: "🏛️",
  },
  {
    id: 4,
    question: "What year did Elvis Presley have his first #1 hit?",
    options: ["1952", "1954", "1956", "1958"],
    correct: "1956",
    hint: "'Heartbreak Hotel' topped the charts",
    year: 1956,
    category: "Music",
    emoji: "🎸",
  },
  {
    id: 5,
    question: "What was the most popular TV show in 1970?",
    options: ["M*A*S*H", "Rowan & Martin's Laugh-In", "Gunsmoke", "The Brady Bunch"],
    correct: "Rowan & Martin's Laugh-In",
    hint: "A comedy variety show",
    year: 1970,
    category: "TV",
    emoji: "📺",
  },
  {
    id: 6,
    question: "Which actress starred in 'Breakfast at Tiffany's'?",
    options: ["Marilyn Monroe", "Elizabeth Taylor", "Audrey Hepburn", "Grace Kelly"],
    correct: "Audrey Hepburn",
    hint: "She also starred in 'Roman Holiday'",
    year: 1961,
    category: "Movies",
    emoji: "🎬",
  },
  {
    id: 7,
    question: "What was invented in 1876?",
    options: ["Light Bulb", "Telephone", "Automobile", "Radio"],
    correct: "Telephone",
    hint: "Alexander Graham Bell's invention",
    year: 1876,
    category: "Inventions",
    emoji: "📞",
  },
  {
    id: 8,
    question: "Which band sang 'Let It Be'?",
    options: ["The Rolling Stones", "The Beatles", "The Beach Boys", "The Who"],
    correct: "The Beatles",
    hint: "The Fab Four from Liverpool",
    year: 1970,
    category: "Music",
    emoji: "🎵",
  },
  {
    id: 9,
    question: "What dessert is made with ladyfingers and mascarpone?",
    options: ["Cheesecake", "Tiramisu", "Panna Cotta", "Cannoli"],
    correct: "Tiramisu",
    hint: "It's Italian and means 'pick me up'",
    year: 0,
    category: "Food",
    emoji: "🍰",
  },
  {
    id: 10,
    question: "What is the capital of Italy?",
    options: ["Milan", "Venice", "Rome", "Florence"],
    correct: "Rome",
    hint: "Where the Colosseum is located",
    year: 0,
    category: "Geography",
    emoji: "🌍",
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

export default function TriviaPage() {
  const [questions] = useState(() => shuffleArray(triviaQuestions).slice(0, 8));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);

  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;

  const handleAnswer = useCallback((answer: string) => {
    if (showResult) return;
    
    setSelectedAnswer(answer);
    setShowResult(true);

    if (answer === currentQuestion.correct) {
      setScore((prev) => prev + (showHint ? 5 : 10));
    }

    setTimeout(() => {
      if (currentIndex < totalQuestions - 1) {
        setCurrentIndex((prev) => prev + 1);
        setSelectedAnswer(null);
        setShowResult(false);
        setShowHint(false);
      } else {
        setGameComplete(true);
      }
    }, 2500);
  }, [showResult, currentQuestion.correct, showHint, currentIndex, totalQuestions]);

  const getButtonStyle = (option: string) => {
    if (!showResult) {
      return "bg-white hover:bg-slate-50 text-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-white border-2 border-slate-200 dark:border-slate-700";
    }
    if (option === currentQuestion.correct) {
      return "bg-emerald-500 text-white border-2 border-emerald-500";
    }
    if (option === selectedAnswer && option !== currentQuestion.correct) {
      return "bg-red-400 text-white border-2 border-red-400";
    }
    return "bg-slate-200 text-slate-400 border-2 border-slate-200 dark:bg-slate-700 dark:border-slate-700";
  };

  const playAgain = () => {
    setCurrentIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setShowHint(false);
    setGameComplete(false);
  };

  if (gameComplete) {
    const percentage = Math.round((score / (totalQuestions * 10)) * 100);
    
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-6 py-8">
        <motion.div
          className="max-w-sm text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <span className="text-6xl">
            {percentage >= 70 ? "🏆" : percentage >= 40 ? "⭐" : "👏"}
          </span>
          <h1 className="mt-4 text-3xl font-bold text-slate-800 dark:text-white">
            {percentage >= 70 ? "Excellent!" : percentage >= 40 ? "Well Done!" : "Good Try!"}
          </h1>
          <div className="mt-4 rounded-2xl bg-gradient-to-br from-sky-100 to-blue-100 px-8 py-6 dark:from-sky-900/30 dark:to-blue-900/30">
            <p className="text-lg text-sky-800 dark:text-sky-300">You scored</p>
            <p className="text-5xl font-bold text-sky-600 dark:text-sky-400">
              {score}
            </p>
            <p className="text-sky-700 dark:text-sky-300">out of {totalQuestions * 10}</p>
          </div>
          <p className="mt-4 text-slate-600 dark:text-slate-400">
            Great job exercising your memory! 🧠
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
    <div className="min-h-screen px-6 py-8 pt-20 pb-32">
      {/* Header */}
      <motion.header
        className="text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
          🧠 Memory Trivia
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Test your knowledge!
        </p>
      </motion.header>

      {/* Progress */}
      <motion.div
        className="mx-auto mt-4 max-w-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-600 dark:text-slate-400">
            Question {currentIndex + 1} of {totalQuestions}
          </span>
          <span className="font-semibold text-sky-600 dark:text-sky-400">
            Score: {score}
          </span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
          <motion.div
            className="h-full bg-gradient-to-r from-sky-500 to-blue-500"
            animate={{ width: `${((currentIndex) / totalQuestions) * 100}%` }}
          />
        </div>
      </motion.div>

      {/* Question Card */}
      <motion.div
        className="mx-auto mt-6 max-w-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        key={currentQuestion.id}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion.id}
            className="overflow-hidden rounded-3xl bg-white shadow-xl dark:bg-slate-800"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
          >
            {/* Category Badge */}
            <div className="bg-gradient-to-r from-sky-500 to-blue-600 p-6 text-center">
              <span className="text-5xl">{currentQuestion.emoji}</span>
              <p className="mt-2 text-sm font-medium text-white/80">
                {currentQuestion.category}
                {currentQuestion.year > 0 && ` • ${currentQuestion.year}`}
              </p>
            </div>

            {/* Question */}
            <div className="p-6">
              <p className="text-center text-xl font-medium text-slate-800 dark:text-white">
                {currentQuestion.question}
              </p>

              {/* Hint */}
              {!showHint && !showResult && (
                <motion.button
                  onClick={() => setShowHint(true)}
                  className="mx-auto mt-4 block text-sm text-amber-600 underline dark:text-amber-400"
                  whileTap={{ scale: 0.98 }}
                >
                  💡 Need a hint? (5 points instead of 10)
                </motion.button>
              )}

              <AnimatePresence>
                {showHint && !showResult && (
                  <motion.div
                    className="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-center text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    💡 {currentQuestion.hint}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Options */}
              <div className="mt-6 space-y-3">
                {currentQuestion.options.map((option, index) => (
                  <motion.button
                    key={option}
                    onClick={() => handleAnswer(option)}
                    disabled={showResult}
                    className={`w-full rounded-xl px-5 py-4 text-left text-lg font-medium transition-colors ${getButtonStyle(option)}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                    whileHover={!showResult ? { scale: 1.01 } : {}}
                    whileTap={!showResult ? { scale: 0.99 } : {}}
                  >
                    <span className="mr-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                      {String.fromCharCode(65 + index)}
                    </span>
                    {option}
                  </motion.button>
                ))}
              </div>

              {/* Result Feedback */}
              <AnimatePresence>
                {showResult && (
                  <motion.div
                    className={`mt-6 rounded-xl p-4 text-center ${
                      selectedAnswer === currentQuestion.correct
                        ? "bg-emerald-100 dark:bg-emerald-900/30"
                        : "bg-amber-100 dark:bg-amber-900/30"
                    }`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <p className={`text-lg font-bold ${
                      selectedAnswer === currentQuestion.correct
                        ? "text-emerald-800 dark:text-emerald-300"
                        : "text-amber-800 dark:text-amber-300"
                    }`}>
                      {selectedAnswer === currentQuestion.correct 
                        ? `🎉 Correct! +${showHint ? 5 : 10} points` 
                        : `The answer was: ${currentQuestion.correct}`}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
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
