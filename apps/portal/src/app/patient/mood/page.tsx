"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const moods = [
  { 
    emoji: "😊", 
    label: "Happy", 
    color: "from-emerald-400 to-green-500",
    bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
    message: "That's wonderful! We're so glad you're feeling good today.",
    followUp: "Would you like to look at some happy memories?"
  },
  { 
    emoji: "😌", 
    label: "Calm", 
    color: "from-sky-400 to-blue-500",
    bgColor: "bg-sky-50 dark:bg-sky-900/20",
    message: "Peace is a beautiful feeling. You're doing great.",
    followUp: "Would you like some gentle music?"
  },
  { 
    emoji: "😐", 
    label: "Okay", 
    color: "from-amber-400 to-orange-500",
    bgColor: "bg-amber-50 dark:bg-amber-900/20",
    message: "That's perfectly fine. Every day is different.",
    followUp: "Would you like to call someone?"
  },
  { 
    emoji: "😔", 
    label: "Sad", 
    color: "from-blue-400 to-indigo-500",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
    message: "We're sorry you're feeling sad. You are loved and not alone.",
    followUp: "Would you like to hear from your family?"
  },
  { 
    emoji: "😰", 
    label: "Worried", 
    color: "from-purple-400 to-violet-500",
    bgColor: "bg-purple-50 dark:bg-purple-900/20",
    message: "It's okay to feel worried. You are safe here.",
    followUp: "Would you like to try a calming exercise?"
  },
  { 
    emoji: "😢", 
    label: "Upset", 
    color: "from-rose-400 to-red-500",
    bgColor: "bg-rose-50 dark:bg-rose-900/20",
    message: "We understand. These feelings will pass. Sarah is thinking of you.",
    followUp: "Would you like to talk to Sarah?"
  },
];

export default function MoodCheckPage() {
  const [selectedMood, setSelectedMood] = useState<typeof moods[0] | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleMoodSelect = (mood: typeof moods[0]) => {
    setSelectedMood(mood);
  };

  const handleSubmit = () => {
    // In production, this would save to Supabase
    setSubmitted(true);
  };

  const handleReset = () => {
    setSelectedMood(null);
    setSubmitted(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white px-6 py-8 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-center"
      >
        <a 
          href="/patient" 
          className="mb-4 inline-flex items-center gap-2 text-slate-500 transition-colors hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Back Home
        </a>
      </motion.header>

      <AnimatePresence mode="wait">
        {submitted ? (
          /* Thank You Screen */
          <motion.div
            key="thanks"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="mx-auto max-w-md text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="mx-auto mb-6 flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-green-500 text-6xl shadow-xl"
            >
              ✓
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-4 text-4xl font-bold text-slate-800 dark:text-white"
            >
              Thank You!
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-8 text-xl text-slate-600 dark:text-slate-300"
            >
              We&apos;ve let Sarah know how you&apos;re feeling.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col gap-4"
            >
              <motion.a
                href="/patient"
                className="flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 py-5 text-xl font-semibold text-white shadow-lg"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="text-2xl">🏠</span>
                Go Home
              </motion.a>
              
              <button
                onClick={handleReset}
                className="py-3 text-slate-500 transition-colors hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              >
                Check in again
              </button>
            </motion.div>
          </motion.div>
        ) : selectedMood ? (
          /* Mood Selected - Confirmation */
          <motion.div
            key="selected"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="mx-auto max-w-md text-center"
          >
            {/* Selected Mood Display */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring" }}
              className={`mx-auto mb-6 flex h-40 w-40 items-center justify-center rounded-full bg-gradient-to-br ${selectedMood.color} text-7xl shadow-2xl`}
            >
              {selectedMood.emoji}
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-4 text-3xl font-bold text-slate-800 dark:text-white"
            >
              You&apos;re feeling {selectedMood.label.toLowerCase()}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-8 text-xl text-slate-600 dark:text-slate-300"
            >
              {selectedMood.message}
            </motion.p>

            {/* Follow Up Suggestion */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className={`mb-8 rounded-2xl ${selectedMood.bgColor} p-6`}
            >
              <p className="text-lg text-slate-700 dark:text-slate-200">
                {selectedMood.followUp}
              </p>
            </motion.div>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col gap-4"
            >
              <motion.button
                onClick={handleSubmit}
                className={`flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r ${selectedMood.color} py-5 text-xl font-semibold text-white shadow-lg`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                Tell Sarah
              </motion.button>

              <button
                onClick={() => setSelectedMood(null)}
                className="py-3 text-slate-500 transition-colors hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              >
                Pick a different feeling
              </button>
            </motion.div>
          </motion.div>
        ) : (
          /* Mood Selection Grid */
          <motion.div
            key="selection"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mx-auto max-w-2xl"
          >
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 text-center text-4xl font-bold text-slate-800 dark:text-white"
            >
              How are you feeling?
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-12 text-center text-xl text-slate-600 dark:text-slate-300"
            >
              Tap the emoji that matches your mood
            </motion.p>

            <motion.div 
              className="grid grid-cols-2 gap-4 md:grid-cols-3"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.08 }
                }
              }}
            >
              {moods.map((mood) => (
                <motion.button
                  key={mood.label}
                  onClick={() => handleMoodSelect(mood)}
                  variants={{
                    hidden: { opacity: 0, scale: 0.8 },
                    visible: { opacity: 1, scale: 1 }
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex flex-col items-center gap-3 rounded-3xl ${mood.bgColor} p-8 shadow-lg transition-shadow hover:shadow-xl`}
                >
                  <span className="text-6xl">{mood.emoji}</span>
                  <span className="text-xl font-semibold text-slate-700 dark:text-slate-200">
                    {mood.label}
                  </span>
                </motion.button>
              ))}
            </motion.div>

            {/* Calm Mode Link for distressed users */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-12 text-center"
            >
              <a 
                href="/patient/calm"
                className="inline-flex items-center gap-2 text-slate-500 transition-colors hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              >
                <span className="text-xl">🌿</span>
                Need a moment to relax?
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fixed Help Button */}
      <motion.button
        className="fixed bottom-8 right-8 z-50 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-rose-500 to-red-600 text-white shadow-2xl shadow-red-500/30"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <div className="text-center">
          <svg className="mx-auto h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
          </svg>
          <span className="mt-1 text-xs font-bold">HELP</span>
        </div>
      </motion.button>
    </div>
  );
}
