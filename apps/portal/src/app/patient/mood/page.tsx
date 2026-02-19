"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Link from "next/link";

// Mood options
const moods = [
  { id: "great", emoji: "😄", label: "Great!", color: "from-emerald-500 to-green-600" },
  { id: "good", emoji: "🙂", label: "Good", color: "from-sky-500 to-blue-600" },
  { id: "okay", emoji: "😐", label: "Okay", color: "from-amber-500 to-orange-600" },
  { id: "sad", emoji: "😢", label: "Sad", color: "from-purple-500 to-indigo-600" },
  { id: "worried", emoji: "😟", label: "Worried", color: "from-rose-500 to-red-600" },
];

// Follow-up activities based on mood
const moodActivities = {
  great: [
    { label: "Share a memory", icon: "📸", href: "/patient/memories/record" },
    { label: "Play a game", icon: "🧩", href: "/patient/games" },
  ],
  good: [
    { label: "Look at photos", icon: "📷", href: "/patient/memories" },
    { label: "Call someone", icon: "📞", href: "/patient/family/call" },
  ],
  okay: [
    { label: "Listen to music", icon: "🎵", href: "/patient/games/music" },
    { label: "Watch memories", icon: "▶️", href: "/patient/memories/slideshow" },
  ],
  sad: [
    { label: "Call Sarah", icon: "📞", href: "/patient/family/call" },
    { label: "Calming mode", icon: "🌿", href: "/patient/calm" },
  ],
  worried: [
    { label: "Talk to me", icon: "💬", href: "/patient/talk" },
    { label: "Calming mode", icon: "🌿", href: "/patient/calm" },
  ],
};

export default function MoodCheckInPage() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const handleMoodSelect = (moodId: string) => {
    setSelectedMood(moodId);
  };

  const handleSave = () => {
    setSaved(true);
    // In production: save to Supabase, alert caregiver if needed
  };

  const getActivities = () => {
    if (!selectedMood) return [];
    return moodActivities[selectedMood as keyof typeof moodActivities] || [];
  };

  return (
    <div className="flex min-h-screen flex-col px-6 py-8 pt-20">
      {/* Header */}
      <motion.header
        className="text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
          How Are You Feeling?
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          It's okay to feel any way. Just tap how you feel.
        </p>
      </motion.header>

      <AnimatePresence mode="wait">
        {!saved ? (
          <motion.div
            key="selection"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Mood Selection */}
            <motion.div
              className="mx-auto mt-8 grid max-w-sm gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {moods.map((mood, index) => (
                <motion.button
                  key={mood.id}
                  onClick={() => handleMoodSelect(mood.id)}
                  className={`flex items-center gap-5 rounded-2xl p-5 shadow-lg transition-all ${
                    selectedMood === mood.id
                      ? `bg-gradient-to-r ${mood.color} text-white`
                      : "bg-white text-slate-700 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-200"
                  }`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <span className="text-5xl">{mood.emoji}</span>
                  <span className="text-2xl font-semibold">{mood.label}</span>
                  {selectedMood === mood.id && (
                    <motion.div
                      className="ml-auto flex h-8 w-8 items-center justify-center rounded-full bg-white/20"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                    >
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </motion.div>
                  )}
                </motion.button>
              ))}
            </motion.div>

            {/* Save Button */}
            <AnimatePresence>
              {selectedMood && (
                <motion.div
                  className="mx-auto mt-8 max-w-sm"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                >
                  <motion.button
                    onClick={handleSave}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 py-5 text-xl font-semibold text-white shadow-lg shadow-sky-500/30"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    Save My Mood
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            key="saved"
            className="mx-auto mt-8 flex max-w-sm flex-1 flex-col items-center justify-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Thank You */}
            <motion.div
              className="text-center"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", bounce: 0.5 }}
            >
              <span className="text-7xl">
                {moods.find((m) => m.id === selectedMood)?.emoji}
              </span>
              <h2 className="mt-4 text-2xl font-bold text-slate-800 dark:text-white">
                Thank You! 💜
              </h2>
              <p className="mt-2 text-slate-600 dark:text-slate-400">
                {selectedMood === "great" || selectedMood === "good"
                  ? "That's wonderful to hear!"
                  : "It's okay. We're here for you."}
              </p>
            </motion.div>

            {/* Suggested Activities */}
            <div className="mt-8 w-full space-y-3">
              <p className="text-center text-sm font-medium text-slate-500 dark:text-slate-400">
                Would you like to...
              </p>
              {getActivities().map((activity, index) => (
                <motion.div
                  key={activity.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <Link href={activity.href}>
                    <motion.button
                      className="flex w-full items-center gap-4 rounded-2xl bg-white px-5 py-4 shadow-lg dark:bg-slate-800"
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <span className="text-3xl">{activity.icon}</span>
                      <span className="text-lg font-semibold text-slate-700 dark:text-slate-200">
                        {activity.label}
                      </span>
                      <svg className="ml-auto h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                      </svg>
                    </motion.button>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Home Button */}
            <motion.div
              className="mt-8 w-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <Link href="/patient">
                <motion.button
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-200 py-4 text-slate-700 dark:bg-slate-700 dark:text-slate-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span>🏠</span>
                  Go Home
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
