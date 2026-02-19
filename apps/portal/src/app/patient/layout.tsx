"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, createContext, useContext } from "react";

interface PatientLayoutProps {
  children: React.ReactNode;
}

// Accessibility Context
interface AccessibilitySettings {
  fontSize: "standard" | "large" | "extra-large" | "maximum";
  contrast: "standard" | "high";
  reducedMotion: boolean;
  hapticFeedback: boolean;
  audioFeedback: boolean;
}

const AccessibilityContext = createContext<{
  settings: AccessibilitySettings;
  updateSettings: (settings: Partial<AccessibilitySettings>) => void;
}>({
  settings: {
    fontSize: "large",
    contrast: "standard",
    reducedMotion: false,
    hapticFeedback: true,
    audioFeedback: true,
  },
  updateSettings: () => {},
});

export function useAccessibility() {
  return useContext(AccessibilityContext);
}

// Navigation items - 2x2 grid sections + Home center
const navItems = [
  { href: "/patient/memories", label: "Memories", icon: "📸", color: "from-purple-500 to-indigo-600" },
  { href: "/patient/family", label: "Family", icon: "👨‍👩‍👧‍👦", color: "from-pink-500 to-rose-600" },
  { href: "/patient/games", label: "Games", icon: "🧩", color: "from-amber-500 to-orange-600" },
  { href: "/patient/talk", label: "Talk to Me", icon: "💬", color: "from-emerald-500 to-teal-600" },
];

/**
 * Patient Mode Layout
 * 
 * Designed for people with cognitive decline:
 * - Persistent bottom navigation (max 2 taps to any feature)
 * - Home button always visible and distinct
 * - Large touch targets (60dp+)
 * - No complex gestures required
 * - Calm, consistent transitions
 */
export default function PatientLayout({ children }: PatientLayoutProps) {
  const pathname = usePathname();
  const isHome = pathname === "/patient";
  
  const [settings, setSettings] = useState<AccessibilitySettings>({
    fontSize: "large",
    contrast: "standard",
    reducedMotion: false,
    hapticFeedback: true,
    audioFeedback: true,
  });

  const updateSettings = (newSettings: Partial<AccessibilitySettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  // Font size classes based on settings
  const fontSizeClass = {
    standard: "text-base",
    large: "text-lg",
    "extra-large": "text-xl",
    maximum: "text-2xl",
  }[settings.fontSize];

  // Animation settings
  const transition = settings.reducedMotion 
    ? { duration: 0 } 
    : { duration: 0.3, ease: "easeOut" as const };

  return (
    <AccessibilityContext.Provider value={{ settings, updateSettings }}>
      <div className={`min-h-screen bg-gradient-to-b from-sky-50 via-white to-amber-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 ${fontSizeClass} ${settings.contrast === "high" ? "contrast-high" : ""}`}>
        {/* Top Safe Area */}
        <div className="h-safe-top bg-gradient-to-b from-sky-50 to-transparent dark:from-slate-900" />
        
        {/* Main Content - with padding for bottom nav */}
        <main className="relative min-h-screen pb-32">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={settings.reducedMotion ? {} : { opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={settings.reducedMotion ? {} : { opacity: 0, x: -20 }}
              transition={transition}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Persistent Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg shadow-[0_-4px_20px_rgba(0,0,0,0.1)] dark:bg-slate-900/95 dark:shadow-[0_-4px_20px_rgba(0,0,0,0.3)]">
          <div className="safe-bottom mx-auto max-w-lg">
            <div className="flex items-end justify-around px-2 py-2">
              {/* Memories */}
              <NavItem 
                item={navItems[0]} 
                isActive={pathname.startsWith("/patient/memories")}
                reducedMotion={settings.reducedMotion}
              />
              
              {/* Family */}
              <NavItem 
                item={navItems[1]} 
                isActive={pathname.startsWith("/patient/family")}
                reducedMotion={settings.reducedMotion}
              />
              
              {/* Home Button - Center, Larger, Always Distinct */}
              <Link href="/patient" className="relative -mt-4">
                <motion.div
                  className={`flex h-20 w-20 flex-col items-center justify-center rounded-full shadow-lg ${
                    isHome 
                      ? "bg-gradient-to-br from-sky-500 to-blue-600 shadow-sky-500/40" 
                      : "bg-white shadow-slate-200 dark:bg-slate-800 dark:shadow-slate-700"
                  }`}
                  whileHover={settings.reducedMotion ? {} : { scale: 1.05 }}
                  whileTap={settings.reducedMotion ? {} : { scale: 0.95 }}
                >
                  <span className="text-3xl">{isHome ? "🏠" : "🏠"}</span>
                  <span className={`mt-0.5 text-xs font-bold ${isHome ? "text-white" : "text-slate-600 dark:text-slate-300"}`}>
                    Home
                  </span>
                </motion.div>
                {/* Pulse ring on home */}
                {isHome && !settings.reducedMotion && (
                  <motion.div
                    className="absolute inset-0 rounded-full bg-sky-500"
                    animate={{ scale: [1, 1.3], opacity: [0.5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                )}
              </Link>
              
              {/* Games */}
              <NavItem 
                item={navItems[2]} 
                isActive={pathname.startsWith("/patient/games")}
                reducedMotion={settings.reducedMotion}
              />
              
              {/* Talk to Me */}
              <NavItem 
                item={navItems[3]} 
                isActive={pathname.startsWith("/patient/talk")}
                reducedMotion={settings.reducedMotion}
              />
            </div>
          </div>
        </nav>

        {/* Fixed Help Button - Always Visible */}
        <motion.button
          className="fixed right-4 top-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-rose-500 to-red-600 text-white shadow-lg shadow-red-500/30"
          whileHover={settings.reducedMotion ? {} : { scale: 1.05 }}
          whileTap={settings.reducedMotion ? {} : { scale: 0.95 }}
          initial={settings.reducedMotion ? {} : { opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          aria-label="Get Help"
        >
          <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
          </svg>
        </motion.button>

        {/* Back Button - Only show when not on home */}
        {!isHome && (
          <motion.div
            className="fixed left-4 top-4 z-50"
            initial={settings.reducedMotion ? {} : { opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Link href="/patient">
              <motion.button
                className="flex items-center gap-2 rounded-full bg-white/90 px-4 py-3 text-slate-700 shadow-lg backdrop-blur-sm dark:bg-slate-800/90 dark:text-slate-200"
                whileHover={settings.reducedMotion ? {} : { scale: 1.02 }}
                whileTap={settings.reducedMotion ? {} : { scale: 0.98 }}
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
                <span className="font-semibold">Back</span>
              </motion.button>
            </Link>
          </motion.div>
        )}

        {/* Caregiver Mode Switch (very subtle, bottom left corner above nav) */}
        <motion.a
          href="/"
          className="fixed bottom-36 left-4 z-40 flex items-center gap-2 rounded-full bg-white/60 px-3 py-1.5 text-xs text-slate-400 backdrop-blur-sm transition-colors hover:bg-white hover:text-slate-600 dark:bg-slate-800/60 dark:hover:bg-slate-800"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 3 }}
        >
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Caregiver
        </motion.a>
      </div>
    </AccessibilityContext.Provider>
  );
}

// Individual Nav Item Component
function NavItem({ 
  item, 
  isActive, 
  reducedMotion 
}: { 
  item: typeof navItems[0]; 
  isActive: boolean;
  reducedMotion: boolean;
}) {
  return (
    <Link href={item.href}>
      <motion.div
        className={`flex h-16 w-16 flex-col items-center justify-center rounded-2xl transition-colors ${
          isActive 
            ? `bg-gradient-to-br ${item.color} shadow-lg` 
            : "bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800"
        }`}
        whileHover={reducedMotion ? {} : { scale: 1.05 }}
        whileTap={reducedMotion ? {} : { scale: 0.95 }}
      >
        <span className="text-2xl">{item.icon}</span>
        <span className={`mt-0.5 text-xs font-medium ${isActive ? "text-white" : "text-slate-600 dark:text-slate-400"}`}>
          {item.label}
        </span>
      </motion.div>
    </Link>
  );
}
