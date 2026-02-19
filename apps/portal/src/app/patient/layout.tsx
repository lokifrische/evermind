"use client";

import { motion } from "framer-motion";

interface PatientLayoutProps {
  children: React.ReactNode;
}

/**
 * Patient Mode Layout
 * 
 * Designed for people with cognitive decline:
 * - No complex navigation
 * - Large, calming interface
 * - Minimal cognitive load
 * - Always-visible help button
 */
export default function PatientLayout({ children }: PatientLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-amber-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Main Content */}
      <main className="relative min-h-screen">
        {children}
      </main>

      {/* Fixed Help Button - Always Visible */}
      <motion.button
        className="fixed bottom-8 right-8 z-50 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-rose-500 to-red-600 text-white shadow-2xl shadow-red-500/30"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <div className="text-center">
          <svg className="mx-auto h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
          </svg>
          <span className="mt-1 text-xs font-bold">HELP</span>
        </div>
      </motion.button>

      {/* Caregiver Mode Switch (subtle) */}
      <motion.a
        href="/"
        className="fixed bottom-8 left-8 z-50 flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm text-slate-500 shadow-lg backdrop-blur-sm transition-colors hover:bg-white hover:text-slate-700 dark:bg-slate-800/80 dark:text-slate-400 dark:hover:bg-slate-800"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        Caregiver
      </motion.a>
    </div>
  );
}
