"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useCallback } from "react";
import Link from "next/link";

// Classic songs with recognizable opening lyrics/hooks
const songs = [
  {
    id: "somewhere-over",
    title: "Somewhere Over the Rainbow",
    artist: "Judy Garland",
    year: 1939,
    lyricHint: "🎵 'Somewhere over the ______'",
    options: ["Mountain", "River", "Rainbow", "Valley"],
    correctAnswer: "Rainbow",
    fullLyric: "Somewhere over the rainbow, way up high...",
    emoji: "🌈",
  },
  {
    id: "moon-river",
    title: "Moon River",
    artist: "Audrey Hepburn",
    year: 1961,
    lyricHint: "🎵 '______ River, wider than a mile'",
    options: ["Blue", "Moon", "Silver", "Dream"],
    correctAnswer: "Moon",
    fullLyric: "Moon River, wider than a mile...",
    emoji: "🌙",
  },
  {
    id: "what-a-wonderful",
    title: "What a Wonderful World",
    artist: "Louis Armstrong",
    year: 1967,
    lyricHint: "🎵 'I see trees of ______, red roses too'",
    options: ["Blue", "Brown", "Gold", "Green"],
    correctAnswer: "Green",
    fullLyric: "I see trees of green, red roses too...",
    emoji: "🌍",
  },
  {
    id: "yesterday",
    title: "Yesterday",
    artist: "The Beatles",
    year: 1965,
    lyricHint: "🎵 '______, all my troubles seemed so far away'",
    options: ["Today", "Yesterday", "Tomorrow", "Sunday"],
    correctAnswer: "Yesterday",
    fullLyric: "Yesterday, all my troubles seemed so far away...",
    emoji: "🎸",
  },
  {
    id: "my-way",
    title: "My Way",
    artist: "Frank Sinatra",
    year: 1969,
    lyricHint: "🎵 'And now, the end is near, and so I face the final ______'",
    options: ["Chapter", "Moment", "Curtain", "Song"],
    correctAnswer: "Curtain",
    fullLyric: "And now, the end is near, and so I face the final curtain...",
    emoji: "🎤",
  },
  {
    id: "stand-by-me",
    title: "Stand By Me",
    artist: "Ben E. King",
    year: 1961,
    lyricHint: "🎵 'When the night has come, and the ______ is dark'",
    options: ["Sky", "Land", "World", "Sea"],
    correctAnswer: "Land",
    fullLyric: "When the night has come, and the land is dark...",
    emoji: "🌃",
  },
  {
    id: "unchained-melody",
    title: "Unchained Melody",
    artist: "The Righteous Brothers",
    year: 1965,
    lyricHint: "🎵 'Oh, my love, my ______'",
    options: ["Dear", "Heart", "Darling", "Angel"],
    correctAnswer: "Darling",
    fullLyric: "Oh, my love, my darling, I've hungered for your touch...",
    emoji: "💕",
  },
  {
    id: "dancing-queen",
    title: "Dancing Queen",
    artist: "ABBA",
    year: 1976,
    lyricHint: "🎵 'You can dance, you can jive, having the time of your ______'",
    options: ["Day", "Night", "Life", "Year"],
    correctAnswer: "Life",
    fullLyric: "You can dance, you can jive, having the time of your life...",
    emoji: "💃",
  },
  {
    id: "imagine",
    title: "Imagine",
    artist: "John Lennon",
    year: 1971,
    lyricHint: "🎵 'Imagine all the people, living life in ______'",
    options: ["Joy", "Peace", "Love", "Harmony"],
    correctAnswer: "Peace",
    fullLyric: "Imagine all the people, living life in peace...",
    emoji: "☮️",
  },
  {
    id: "white-christmas",
    title: "White Christmas",
    artist: "Bing Crosby",
    year: 1942,
    lyricHint: "🎵 'I'm dreaming of a ______ Christmas'",
    options: ["Happy", "Merry", "White", "Warm"],
    correctAnswer: "White",
    fullLyric: "I'm dreaming of a white Christmas...",
    emoji: "⛄",
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

export default function NameThatTunePage() {
  const [shuffledSongs] = useState(() => shuffleArray(songs));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);

  const currentSong = shuffledSongs[currentIndex];
  const totalSongs = Math.min(shuffledSongs.length, 8); // Limit to 8 songs per game

  const handleAnswer = useCallback((answer: string) => {
    if (showResult) return;
    
    setSelectedAnswer(answer);
    setShowResult(true);

    const isCorrect = answer === currentSong.correctAnswer;
    if (isCorrect) {
      setScore((prev) => prev + (streak + 1) * 10);
      setStreak((prev) => prev + 1);
    } else {
      setStreak(0);
    }

    // Move to next after delay
    setTimeout(() => {
      if (currentIndex < totalSongs - 1) {
        setCurrentIndex((prev) => prev + 1);
        setSelectedAnswer(null);
        setShowResult(false);
      } else {
        setGameComplete(true);
      }
    }, 2500);
  }, [showResult, currentSong.correctAnswer, currentIndex, totalSongs, streak]);

  const playAgain = () => {
    setCurrentIndex(0);
    setScore(0);
    setStreak(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setGameComplete(false);
  };

  const getButtonStyle = (option: string) => {
    if (!showResult) {
      return "bg-white hover:bg-slate-50 text-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-white";
    }
    if (option === currentSong.correctAnswer) {
      return "bg-emerald-500 text-white";
    }
    if (option === selectedAnswer && option !== currentSong.correctAnswer) {
      return "bg-red-400 text-white";
    }
    return "bg-slate-200 text-slate-400 dark:bg-slate-700";
  };

  if (gameComplete) {
    const maxScore = totalSongs * 80; // Rough max with streaks
    const percentage = Math.round((score / maxScore) * 100);

    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-6 py-8">
        <motion.div
          className="max-w-sm text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <span className="text-6xl">
            {percentage >= 70 ? "🎉" : percentage >= 40 ? "🎵" : "💪"}
          </span>
          <h1 className="mt-4 text-3xl font-bold text-slate-800 dark:text-white">
            {percentage >= 70 ? "Music Master!" : percentage >= 40 ? "Nice Recall!" : "Good Try!"}
          </h1>
          <div className="mt-4 rounded-2xl bg-gradient-to-br from-rose-100 to-pink-100 px-8 py-6 dark:from-rose-900/30 dark:to-pink-900/30">
            <p className="text-lg text-rose-800 dark:text-rose-300">Final Score</p>
            <p className="text-5xl font-bold text-rose-600 dark:text-rose-400">
              {score}
            </p>
            <p className="mt-1 text-rose-700 dark:text-rose-300">points</p>
          </div>
          <p className="mt-4 text-slate-600 dark:text-slate-400">
            Those songs bring back memories! 🎶
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
          🎵 Name That Tune
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Complete the famous lyrics!
        </p>
      </motion.header>

      {/* Score & Progress */}
      <motion.div
        className="mx-auto mt-4 max-w-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-600 dark:text-slate-400">
            Song {currentIndex + 1} of {totalSongs}
          </span>
          <span className="font-semibold text-rose-600 dark:text-rose-400">
            Score: {score}
          </span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
          <motion.div
            className="h-full bg-gradient-to-r from-rose-500 to-pink-500"
            animate={{ width: `${((currentIndex) / totalSongs) * 100}%` }}
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

      {/* Song Card */}
      <motion.div
        className="mx-auto mt-6 max-w-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        key={currentSong.id}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSong.id}
            className="overflow-hidden rounded-3xl bg-white shadow-xl dark:bg-slate-800"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
          >
            {/* Song Visual */}
            <div className="relative bg-gradient-to-br from-rose-400 to-pink-600 p-8 text-center">
              <motion.span
                className="text-7xl"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {currentSong.emoji}
              </motion.span>
              <p className="mt-2 text-sm text-white/70">
                {currentSong.year}
              </p>
            </div>

            {/* Lyric Hint */}
            <div className="p-6">
              <p className="text-center text-xl font-medium text-slate-700 dark:text-slate-200">
                {currentSong.lyricHint}
              </p>

              {/* Options */}
              <div className="mt-6 grid grid-cols-2 gap-3">
                {currentSong.options.map((option) => (
                  <motion.button
                    key={option}
                    onClick={() => handleAnswer(option)}
                    disabled={showResult}
                    className={`rounded-xl px-4 py-4 text-lg font-semibold shadow-md transition-colors ${getButtonStyle(option)}`}
                    whileHover={!showResult ? { scale: 1.02 } : {}}
                    whileTap={!showResult ? { scale: 0.98 } : {}}
                  >
                    {option}
                  </motion.button>
                ))}
              </div>

              {/* Result */}
              <AnimatePresence>
                {showResult && (
                  <motion.div
                    className={`mt-6 rounded-xl p-4 text-center ${
                      selectedAnswer === currentSong.correctAnswer
                        ? "bg-emerald-100 dark:bg-emerald-900/30"
                        : "bg-amber-100 dark:bg-amber-900/30"
                    }`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <p className={`text-lg font-bold ${
                      selectedAnswer === currentSong.correctAnswer
                        ? "text-emerald-800 dark:text-emerald-300"
                        : "text-amber-800 dark:text-amber-300"
                    }`}>
                      {selectedAnswer === currentSong.correctAnswer ? "🎉 Correct!" : "💡 The answer was:"}
                    </p>
                    <p className="mt-2 text-slate-700 dark:text-slate-300">
                      &ldquo;{currentSong.fullLyric}&rdquo;
                    </p>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                      {currentSong.title} - {currentSong.artist}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Instructions */}
      <motion.div
        className="mx-auto mt-8 max-w-sm text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="rounded-2xl bg-white/60 px-4 py-3 shadow-sm dark:bg-slate-800/60">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            🎯 Build a streak for bonus points!
          </p>
        </div>
      </motion.div>

      {/* Back to Games */}
      <motion.div
        className="mx-auto mt-6 max-w-sm"
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
