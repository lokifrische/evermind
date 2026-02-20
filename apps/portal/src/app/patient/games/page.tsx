"use client";

import { motion } from "framer-motion";
import Link from "next/link";

// Available games
const games = [
  {
    id: "memory-match",
    name: "Memory Match",
    description: "Match pairs of family photos",
    icon: "🃏",
    bgGradient: "from-purple-500 to-indigo-600",
    shadowColor: "shadow-purple-500/30",
    href: "/patient/games/memory-match",
    difficulty: "Easy",
  },
  {
    id: "word-game",
    name: "Daily Word",
    description: "Quick word puzzle",
    icon: "📝",
    bgGradient: "from-emerald-500 to-teal-600",
    shadowColor: "shadow-emerald-500/30",
    href: "/patient/games/word-game",
    difficulty: "Easy",
  },
  {
    id: "trivia",
    name: "Memory Trivia",
    description: "Test your knowledge",
    icon: "🧠",
    bgGradient: "from-sky-500 to-blue-600",
    shadowColor: "shadow-sky-500/30",
    href: "/patient/games/trivia",
    difficulty: "Fun",
  },
  {
    id: "picture-naming",
    name: "Name That!",
    description: "Name familiar objects",
    icon: "🖼️",
    bgGradient: "from-amber-500 to-orange-600",
    shadowColor: "shadow-amber-500/30",
    href: "/patient/games/picture-naming",
    difficulty: "Easy",
  },
  {
    id: "sequence",
    name: "Color Sequence",
    description: "Watch & repeat patterns",
    icon: "🎨",
    bgGradient: "from-rose-500 to-red-600",
    shadowColor: "shadow-rose-500/30",
    href: "/patient/games/sequence",
    difficulty: "Fun",
  },
  {
    id: "name-that-tune",
    name: "Name That Tune",
    description: "Songs from your era",
    icon: "🎵",
    bgGradient: "from-pink-500 to-rose-600",
    shadowColor: "shadow-pink-500/30",
    href: "/patient/games/name-that-tune",
    difficulty: "Fun",
  },
  {
    id: "sorting",
    name: "Sort It Out",
    description: "Put things in categories",
    icon: "📦",
    bgGradient: "from-cyan-500 to-teal-600",
    shadowColor: "shadow-cyan-500/30",
    href: "/patient/games/sorting",
    difficulty: "Easy",
  },
  {
    id: "jigsaw",
    name: "Simple Puzzle",
    description: "Easy jigsaw puzzles",
    icon: "🧩",
    bgGradient: "from-violet-500 to-purple-600",
    shadowColor: "shadow-violet-500/30",
    href: "/patient/games/jigsaw",
    difficulty: "Easy",
  },
];

// Featured music playlist
const musicHighlight = {
  title: "Musical Memory Lane",
  subtitle: "Listen to songs from your era",
  icon: "🎶",
  href: "/patient/games/music",
};

export default function GamesPage() {
  return (
    <div className="min-h-screen px-6 py-8 pt-20">
      {/* Header */}
      <motion.header
        className="text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
          🧩 Games & Activities
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          No rush, just fun! Take your time.
        </p>
      </motion.header>

      {/* Games Grid */}
      <motion.div
        className="mx-auto mt-8 grid max-w-sm grid-cols-2 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {games.map((game, index) => (
          <Link key={game.id} href={game.href}>
            <motion.div
              className={`relative flex flex-col items-center justify-center rounded-3xl bg-gradient-to-br ${game.bgGradient} p-6 shadow-xl ${game.shadowColor} aspect-square`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + index * 0.05 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <span className="text-5xl drop-shadow-lg">{game.icon}</span>
              <span className="mt-3 text-center text-lg font-bold text-white drop-shadow-sm">
                {game.name}
              </span>
              <span className="mt-1 text-center text-xs text-white/80">
                {game.description}
              </span>
              {/* Difficulty badge */}
              <span className="absolute right-2 top-2 rounded-full bg-white/20 px-2 py-0.5 text-xs font-medium text-white backdrop-blur-sm">
                {game.difficulty}
              </span>
            </motion.div>
          </Link>
        ))}
      </motion.div>

      {/* Music Feature */}
      <motion.div
        className="mx-auto mt-8 max-w-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Link href={musicHighlight.href}>
          <motion.div
            className="flex items-center gap-4 rounded-2xl bg-gradient-to-r from-rose-100 to-pink-100 px-5 py-4 shadow-lg dark:from-rose-900/30 dark:to-pink-900/30"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 text-3xl shadow-lg">
              {musicHighlight.icon}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-slate-800 dark:text-white">
                {musicHighlight.title}
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {musicHighlight.subtitle}
              </p>
            </div>
            <svg className="h-6 w-6 text-rose-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </motion.div>
        </Link>
      </motion.div>

      {/* Encouragement */}
      <motion.footer
        className="mx-auto mt-8 max-w-xs text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <div className="rounded-2xl bg-white/60 px-6 py-4 shadow-sm dark:bg-slate-800/60">
          <p className="text-slate-600 dark:text-slate-400">
            🎯 No scores. No pressure.<br/>
            Just enjoy and have fun!
          </p>
        </div>
      </motion.footer>
    </div>
  );
}
