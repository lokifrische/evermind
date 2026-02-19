"use client";

import { motion } from "framer-motion";
import { useState } from "react";

interface WelcomeBannerProps {
  userName: string;
  patientName: string;
}

export function WelcomeBanner({ userName, patientName }: WelcomeBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <motion.div
      className="mb-8 overflow-hidden rounded-xl border border-indigo-200 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 dark:border-indigo-900 dark:from-indigo-950/50 dark:via-purple-950/50 dark:to-pink-950/50"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative px-6 py-5">
        {/* Decorative elements */}
        <div className="absolute right-0 top-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-gradient-to-br from-indigo-400/20 to-purple-400/20 blur-2xl" />
        <div className="absolute left-1/2 bottom-0 h-24 w-24 translate-y-8 rounded-full bg-gradient-to-br from-purple-400/20 to-pink-400/20 blur-2xl" />
        
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.div
              className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-xl shadow-lg"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              👋
            </motion.div>
            <div>
              <h2 className="text-lg font-semibold text-indigo-900 dark:text-indigo-100">
                Welcome back, {userName}!
              </h2>
              <p className="text-sm text-indigo-700 dark:text-indigo-300">
                {patientName} has been active today. Check out the latest updates below.
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <motion.button
              className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-600"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              View Activity
            </motion.button>
            <button
              onClick={() => setDismissed(true)}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-indigo-600 transition-colors hover:bg-indigo-100 dark:text-indigo-400 dark:hover:bg-indigo-900/50"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
