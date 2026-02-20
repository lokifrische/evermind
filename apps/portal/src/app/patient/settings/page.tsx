"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";

// Settings state
interface Settings {
  fontSize: "standard" | "large" | "extra-large" | "maximum";
  contrast: "standard" | "high";
  reducedMotion: boolean;
  soundEffects: boolean;
  voiceGuidance: boolean;
  autoReadMessages: boolean;
}

const fontSizeOptions = [
  { value: "standard", label: "Standard", preview: "Aa" },
  { value: "large", label: "Large", preview: "Aa" },
  { value: "extra-large", label: "Extra Large", preview: "Aa" },
  { value: "maximum", label: "Maximum", preview: "Aa" },
];

export default function PatientSettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    fontSize: "large",
    contrast: "standard",
    reducedMotion: false,
    soundEffects: true,
    voiceGuidance: true,
    autoReadMessages: false,
  });

  const updateSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen px-6 py-8 pt-20 pb-32">
      {/* Header */}
      <motion.header
        className="text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
          ⚙️ Settings
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Customize your experience
        </p>
      </motion.header>

      {/* Settings Sections */}
      <div className="mx-auto mt-8 max-w-sm space-y-6">
        {/* Font Size */}
        <motion.section
          className="rounded-2xl bg-white p-5 shadow-sm dark:bg-slate-800"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-800 dark:text-white">
            <span>🔤</span> Text Size
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Make text easier to read
          </p>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {fontSizeOptions.map((option) => (
              <motion.button
                key={option.value}
                onClick={() => updateSetting("fontSize", option.value as Settings["fontSize"])}
                className={`rounded-xl py-4 text-center transition-colors ${
                  settings.fontSize === option.value
                    ? "bg-sky-500 text-white shadow-md"
                    : "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300"
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className={`font-bold ${
                  option.value === "standard" ? "text-base" :
                  option.value === "large" ? "text-lg" :
                  option.value === "extra-large" ? "text-xl" : "text-2xl"
                }`}>
                  {option.preview}
                </span>
                <span className="mt-1 block text-sm">{option.label}</span>
              </motion.button>
            ))}
          </div>
        </motion.section>

        {/* Contrast */}
        <motion.section
          className="rounded-2xl bg-white p-5 shadow-sm dark:bg-slate-800"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-800 dark:text-white">
            <span>🌓</span> Contrast
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Make colors easier to see
          </p>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <motion.button
              onClick={() => updateSetting("contrast", "standard")}
              className={`rounded-xl py-4 text-center transition-colors ${
                settings.contrast === "standard"
                  ? "bg-sky-500 text-white shadow-md"
                  : "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300"
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="text-2xl">☀️</span>
              <span className="mt-1 block">Standard</span>
            </motion.button>
            <motion.button
              onClick={() => updateSetting("contrast", "high")}
              className={`rounded-xl py-4 text-center transition-colors ${
                settings.contrast === "high"
                  ? "bg-slate-900 text-white shadow-md"
                  : "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300"
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="text-2xl">🌙</span>
              <span className="mt-1 block">High Contrast</span>
            </motion.button>
          </div>
        </motion.section>

        {/* Toggle Settings */}
        <motion.section
          className="rounded-2xl bg-white p-5 shadow-sm dark:bg-slate-800"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-800 dark:text-white">
            <span>🎛️</span> Features
          </h2>
          
          <div className="mt-4 space-y-4">
            {/* Reduced Motion */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-800 dark:text-white">
                  Reduce Animations
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Calmer screen movement
                </p>
              </div>
              <motion.button
                onClick={() => updateSetting("reducedMotion", !settings.reducedMotion)}
                className={`relative h-8 w-14 rounded-full transition-colors ${
                  settings.reducedMotion ? "bg-sky-500" : "bg-slate-300 dark:bg-slate-600"
                }`}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  className="absolute top-1 h-6 w-6 rounded-full bg-white shadow-md"
                  animate={{ left: settings.reducedMotion ? "calc(100% - 28px)" : "4px" }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              </motion.button>
            </div>

            {/* Sound Effects */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-800 dark:text-white">
                  Sound Effects
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Helpful audio cues
                </p>
              </div>
              <motion.button
                onClick={() => updateSetting("soundEffects", !settings.soundEffects)}
                className={`relative h-8 w-14 rounded-full transition-colors ${
                  settings.soundEffects ? "bg-sky-500" : "bg-slate-300 dark:bg-slate-600"
                }`}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  className="absolute top-1 h-6 w-6 rounded-full bg-white shadow-md"
                  animate={{ left: settings.soundEffects ? "calc(100% - 28px)" : "4px" }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              </motion.button>
            </div>

            {/* Voice Guidance */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-800 dark:text-white">
                  Voice Guidance
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Spoken instructions
                </p>
              </div>
              <motion.button
                onClick={() => updateSetting("voiceGuidance", !settings.voiceGuidance)}
                className={`relative h-8 w-14 rounded-full transition-colors ${
                  settings.voiceGuidance ? "bg-sky-500" : "bg-slate-300 dark:bg-slate-600"
                }`}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  className="absolute top-1 h-6 w-6 rounded-full bg-white shadow-md"
                  animate={{ left: settings.voiceGuidance ? "calc(100% - 28px)" : "4px" }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              </motion.button>
            </div>

            {/* Auto-Read Messages */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-800 dark:text-white">
                  Auto-Read Messages
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Read messages aloud automatically
                </p>
              </div>
              <motion.button
                onClick={() => updateSetting("autoReadMessages", !settings.autoReadMessages)}
                className={`relative h-8 w-14 rounded-full transition-colors ${
                  settings.autoReadMessages ? "bg-sky-500" : "bg-slate-300 dark:bg-slate-600"
                }`}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  className="absolute top-1 h-6 w-6 rounded-full bg-white shadow-md"
                  animate={{ left: settings.autoReadMessages ? "calc(100% - 28px)" : "4px" }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              </motion.button>
            </div>
          </div>
        </motion.section>

        {/* Need Help */}
        <motion.section
          className="rounded-2xl bg-gradient-to-r from-pink-100 to-purple-100 p-5 dark:from-pink-900/30 dark:to-purple-900/30"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center gap-4">
            <span className="text-4xl">💜</span>
            <div>
              <p className="font-semibold text-slate-800 dark:text-white">
                Need Help?
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Ask Sarah or your caregiver to help adjust these settings.
              </p>
            </div>
          </div>
          <Link href="/patient/family/call">
            <motion.button
              className="mt-4 w-full rounded-xl bg-white py-3 font-semibold text-pink-600 shadow-sm dark:bg-slate-800 dark:text-pink-400"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              📞 Call Sarah
            </motion.button>
          </Link>
        </motion.section>

        {/* Version Info */}
        <motion.div
          className="text-center text-sm text-slate-400 dark:text-slate-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p>Evermind Patient Mode v1.0</p>
          <p>Made with 💜 for you</p>
        </motion.div>
      </div>
    </div>
  );
}
