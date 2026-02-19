"use client";

import { motion } from "framer-motion";
import { DashboardLayout, PageWrapper } from "@/components";
import { staggerContainer, staggerItem, smoothTransition } from "@/lib/animations";

const games = [
  {
    id: "1",
    name: "Family Faces",
    description: "Match family members to their names",
    icon: "👨‍👩‍👧‍👦",
    color: "from-rose-500 to-pink-600",
    bgColor: "bg-rose-50 dark:bg-rose-950/30",
    difficulty: "Easy",
    duration: "5-10 min",
    lastPlayed: "Today",
    accuracy: 92,
    timesPlayed: 24,
  },
  {
    id: "2",
    name: "Memory Lane",
    description: "Remember events from photos",
    icon: "🖼️",
    color: "from-purple-500 to-violet-600",
    bgColor: "bg-purple-50 dark:bg-purple-950/30",
    difficulty: "Medium",
    duration: "10-15 min",
    lastPlayed: "Yesterday",
    accuracy: 88,
    timesPlayed: 18,
  },
  {
    id: "3",
    name: "Daily Trivia",
    description: "Fun facts about family history",
    icon: "💡",
    color: "from-amber-500 to-orange-600",
    bgColor: "bg-amber-50 dark:bg-amber-950/30",
    difficulty: "Easy",
    duration: "5 min",
    lastPlayed: "2 days ago",
    accuracy: 95,
    timesPlayed: 45,
  },
  {
    id: "4",
    name: "Word Garden",
    description: "Relaxing word association game",
    icon: "🌸",
    color: "from-emerald-500 to-teal-600",
    bgColor: "bg-emerald-50 dark:bg-emerald-950/30",
    difficulty: "Easy",
    duration: "5-10 min",
    lastPlayed: "3 days ago",
    accuracy: 90,
    timesPlayed: 32,
  },
  {
    id: "5",
    name: "Melody Memory",
    description: "Listen to songs from the past",
    icon: "🎵",
    color: "from-blue-500 to-cyan-600",
    bgColor: "bg-blue-50 dark:bg-blue-950/30",
    difficulty: "Easy",
    duration: "10 min",
    lastPlayed: "1 week ago",
    accuracy: 85,
    timesPlayed: 12,
  },
  {
    id: "6",
    name: "Story Sequence",
    description: "Put story events in order",
    icon: "📖",
    color: "from-indigo-500 to-purple-600",
    bgColor: "bg-indigo-50 dark:bg-indigo-950/30",
    difficulty: "Medium",
    duration: "15 min",
    lastPlayed: "1 week ago",
    accuracy: 78,
    timesPlayed: 8,
  },
];

const weeklyProgress = [
  { day: "Mon", games: 3, accuracy: 90 },
  { day: "Tue", games: 2, accuracy: 88 },
  { day: "Wed", games: 4, accuracy: 92 },
  { day: "Thu", games: 2, accuracy: 85 },
  { day: "Fri", games: 3, accuracy: 94 },
  { day: "Sat", games: 1, accuracy: 91 },
  { day: "Sun", games: 0, accuracy: 0 },
];

export default function ActivitiesPage() {
  const maxGames = Math.max(...weeklyProgress.map(d => d.games));

  return (
    <DashboardLayout>
      <PageWrapper>
        {/* Header */}
        <motion.div 
          className="mb-8 flex items-center justify-between"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={smoothTransition}
        >
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Activities</h1>
            <p className="mt-1 text-[var(--muted-foreground)]">
              Brain games designed for cognitive wellness
            </p>
          </div>
          <motion.button 
            className="flex items-center gap-2 rounded-lg bg-[var(--primary)] px-4 py-2.5 text-sm font-medium text-white"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Configure Games
          </motion.button>
        </motion.div>

        {/* Stats Overview */}
        <motion.div 
          className="mb-8 grid gap-4 md:grid-cols-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...smoothTransition, delay: 0.1 }}
        >
          <div className="rounded-xl border border-[var(--border)] bg-gradient-to-br from-emerald-50 to-teal-50 p-6 dark:from-emerald-950/30 dark:to-teal-950/30">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500 text-2xl shadow-lg">
                🏆
              </div>
              <div>
                <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">This Week</p>
                <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">15 Games</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-[var(--border)] bg-gradient-to-br from-purple-50 to-indigo-50 p-6 dark:from-purple-950/30 dark:to-indigo-950/30">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500 text-2xl shadow-lg">
                🎯
              </div>
              <div>
                <p className="text-sm font-medium text-purple-700 dark:text-purple-300">Avg. Accuracy</p>
                <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">89%</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-[var(--border)] bg-gradient-to-br from-amber-50 to-orange-50 p-6 dark:from-amber-950/30 dark:to-orange-950/30">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500 text-2xl shadow-lg">
                🔥
              </div>
              <div>
                <p className="text-sm font-medium text-amber-700 dark:text-amber-300">Day Streak</p>
                <p className="text-2xl font-bold text-amber-900 dark:text-amber-100">6 Days</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Weekly Progress Chart */}
        <motion.div 
          className="mb-8 rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow-sm)]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...smoothTransition, delay: 0.2 }}
        >
          <h3 className="mb-4 text-lg font-semibold">Weekly Progress</h3>
          <div className="flex items-end justify-between gap-2 h-32">
            {weeklyProgress.map((day, index) => (
              <div key={day.day} className="flex flex-1 flex-col items-center gap-2">
                <motion.div 
                  className="w-full rounded-t-lg bg-gradient-to-t from-indigo-500 to-purple-500"
                  initial={{ height: 0 }}
                  animate={{ height: day.games > 0 ? `${(day.games / maxGames) * 100}%` : 4 }}
                  transition={{ delay: 0.3 + index * 0.05, duration: 0.5, ease: "easeOut" }}
                  style={{ minHeight: day.games > 0 ? 20 : 4 }}
                />
                <span className="text-xs text-[var(--muted-foreground)]">{day.day}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Games Grid */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
        >
          {games.map((game, index) => (
            <motion.div
              key={game.id}
              variants={staggerItem}
              transition={{ ...smoothTransition, delay: index * 0.05 }}
              whileHover={{ y: -4, boxShadow: "0 12px 40px -12px rgba(0,0,0,0.15)" }}
              className={`group cursor-pointer rounded-xl border border-[var(--border)] ${game.bgColor} p-6 shadow-[var(--shadow-sm)] transition-colors`}
            >
              <div className="flex items-start justify-between">
                <motion.div 
                  className={`flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${game.color} text-2xl shadow-lg`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  {game.icon}
                </motion.div>
                <span className="rounded-full bg-white/80 px-2.5 py-0.5 text-xs font-medium text-zinc-700 dark:bg-black/30 dark:text-zinc-300">
                  {game.difficulty}
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-semibold">{game.name}</h3>
                <p className="mt-1 text-sm text-[var(--muted-foreground)]">{game.description}</p>
              </div>
              <div className="mt-4 flex items-center justify-between text-sm">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1 text-[var(--muted-foreground)]">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {game.duration}
                  </span>
                  <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {game.accuracy}%
                  </span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-[var(--border)]">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[var(--muted-foreground)]">Last played {game.lastPlayed}</span>
                  <motion.button 
                    className={`rounded-lg bg-gradient-to-r ${game.color} px-3 py-1.5 text-sm font-medium text-white shadow-sm`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Play
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Recommendation Banner */}
        <motion.div 
          className="mt-8 rounded-xl border border-indigo-200 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 p-6 dark:border-indigo-900 dark:from-indigo-950/50 dark:via-purple-950/50 dark:to-pink-950/50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-2xl shadow-lg">
              ✨
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-indigo-900 dark:text-indigo-100">AI Recommendation</h3>
              <p className="mt-1 text-sm text-indigo-700 dark:text-indigo-300">
                Based on Margaret&apos;s progress, we recommend trying &quot;Family Faces&quot; today. She&apos;s been doing great with facial recognition!
              </p>
            </div>
            <motion.button 
              className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white shadow-sm"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Start Game
            </motion.button>
          </div>
        </motion.div>
      </PageWrapper>
    </DashboardLayout>
  );
}
