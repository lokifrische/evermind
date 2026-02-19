"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";

// Calming scenes
const scenes = [
  {
    id: "ocean",
    name: "Ocean Waves",
    image: "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=1600&h=900&fit=crop",
    color: "from-sky-400 to-blue-600",
    icon: "🌊",
  },
  {
    id: "forest",
    name: "Peaceful Forest",
    image: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=1600&h=900&fit=crop",
    color: "from-emerald-400 to-green-600",
    icon: "🌲",
  },
  {
    id: "sunset",
    name: "Golden Sunset",
    image: "https://images.unsplash.com/photo-1495344517868-8ebaf0a2044a?w=1600&h=900&fit=crop",
    color: "from-amber-400 to-orange-600",
    icon: "🌅",
  },
  {
    id: "stars",
    name: "Starry Night",
    image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1600&h=900&fit=crop",
    color: "from-indigo-400 to-purple-600",
    icon: "✨",
  },
];

// Breathing exercise phases
const breathingPhases = [
  { phase: "inhale", duration: 4, instruction: "Breathe in slowly..." },
  { phase: "hold", duration: 4, instruction: "Hold gently..." },
  { phase: "exhale", duration: 6, instruction: "Breathe out slowly..." },
  { phase: "rest", duration: 2, instruction: "Rest..." },
];

export default function CalmModePage() {
  const [selectedScene, setSelectedScene] = useState(scenes[0]);
  const [showBreathing, setShowBreathing] = useState(false);
  const [breathPhaseIndex, setBreathPhaseIndex] = useState(0);
  const [breathProgress, setBreathProgress] = useState(0);
  const [isBreathing, setIsBreathing] = useState(false);

  const currentBreathPhase = breathingPhases[breathPhaseIndex];

  // Breathing exercise timer
  useEffect(() => {
    if (!isBreathing) return;

    const phaseDuration = currentBreathPhase.duration * 1000;
    const interval = 50;
    let elapsed = 0;

    const timer = setInterval(() => {
      elapsed += interval;
      setBreathProgress((elapsed / phaseDuration) * 100);

      if (elapsed >= phaseDuration) {
        setBreathPhaseIndex((prev) => (prev + 1) % breathingPhases.length);
        setBreathProgress(0);
        elapsed = 0;
      }
    }, interval);

    return () => clearInterval(timer);
  }, [isBreathing, breathPhaseIndex, currentBreathPhase.duration]);

  const startBreathing = () => {
    setShowBreathing(true);
    setIsBreathing(true);
    setBreathPhaseIndex(0);
    setBreathProgress(0);
  };

  const stopBreathing = () => {
    setIsBreathing(false);
  };

  return (
    <div className="fixed inset-0 z-50">
      {/* Background Scene */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedScene.id}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
        >
          <img
            src={selectedScene.image}
            alt={selectedScene.name}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20" />
        </motion.div>
      </AnimatePresence>

      {/* Exit Button */}
      <Link href="/patient">
        <motion.button
          className="absolute left-4 top-4 z-50 flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-white backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.3)" }}
          whileTap={{ scale: 0.98 }}
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          <span className="font-medium">Home</span>
        </motion.button>
      </Link>

      {/* Main Content */}
      <AnimatePresence mode="wait">
        {!showBreathing ? (
          <motion.div
            key="selection"
            className="relative flex h-full flex-col items-center justify-center px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Title */}
            <motion.div
              className="text-center"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
            >
              <h1 className="text-4xl font-bold text-white drop-shadow-lg">
                🌿 Calm Mode
              </h1>
              <p className="mt-2 text-xl text-white/80">
                Take a moment. You&apos;re safe here.
              </p>
            </motion.div>

            {/* Scene Selector */}
            <motion.div
              className="mt-8 flex gap-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {scenes.map((scene) => (
                <motion.button
                  key={scene.id}
                  onClick={() => setSelectedScene(scene)}
                  className={`flex h-16 w-16 items-center justify-center rounded-full text-3xl shadow-lg transition-all ${
                    selectedScene.id === scene.id
                      ? "bg-white scale-110"
                      : "bg-white/30 backdrop-blur-sm"
                  }`}
                  whileHover={{ scale: selectedScene.id === scene.id ? 1.1 : 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {scene.icon}
                </motion.button>
              ))}
            </motion.div>

            <p className="mt-4 text-white/80">{selectedScene.name}</p>

            {/* Start Breathing Button */}
            <motion.button
              onClick={startBreathing}
              className={`mt-12 rounded-2xl bg-gradient-to-r ${selectedScene.color} px-10 py-5 text-xl font-semibold text-white shadow-xl`}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              🧘 Start Breathing Exercise
            </motion.button>

            {/* Reassurance */}
            <motion.p
              className="mt-12 max-w-xs text-center text-lg text-white/70"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              Everything is okay. Take deep breaths. You are loved. 💜
            </motion.p>
          </motion.div>
        ) : (
          <motion.div
            key="breathing"
            className="relative flex h-full flex-col items-center justify-center px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Breathing Circle */}
            <div className="relative flex h-64 w-64 items-center justify-center">
              {/* Progress Ring */}
              <svg className="absolute h-full w-full -rotate-90">
                <circle
                  cx="128"
                  cy="128"
                  r="120"
                  fill="none"
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth="8"
                />
                <motion.circle
                  cx="128"
                  cy="128"
                  r="120"
                  fill="none"
                  stroke="white"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={754} // 2 * PI * 120
                  strokeDashoffset={754 - (754 * breathProgress) / 100}
                />
              </svg>

              {/* Breathing indicator */}
              <motion.div
                className="flex h-48 w-48 items-center justify-center rounded-full bg-white/30 backdrop-blur-sm"
                animate={{
                  scale: currentBreathPhase.phase === "inhale" ? [1, 1.15] :
                         currentBreathPhase.phase === "exhale" ? [1.15, 1] :
                         currentBreathPhase.phase === "hold" ? 1.15 : 1,
                }}
                transition={{ duration: currentBreathPhase.duration, ease: "easeInOut" }}
              >
                <span className="text-6xl">
                  {currentBreathPhase.phase === "inhale" && "🌬️"}
                  {currentBreathPhase.phase === "hold" && "✨"}
                  {currentBreathPhase.phase === "exhale" && "💨"}
                  {currentBreathPhase.phase === "rest" && "😌"}
                </span>
              </motion.div>
            </div>

            {/* Instruction */}
            <motion.h2
              key={currentBreathPhase.phase}
              className="mt-8 text-3xl font-semibold text-white"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {currentBreathPhase.instruction}
            </motion.h2>

            {/* Timer */}
            <p className="mt-2 text-xl text-white/70">
              {Math.ceil(currentBreathPhase.duration - (currentBreathPhase.duration * breathProgress / 100))}
            </p>

            {/* Controls */}
            <div className="mt-12 flex gap-4">
              <motion.button
                onClick={() => {
                  stopBreathing();
                  setShowBreathing(false);
                }}
                className="rounded-2xl bg-white/20 px-8 py-4 font-semibold text-white backdrop-blur-sm"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Done
              </motion.button>
            </div>

            {/* Encouragement */}
            <motion.p
              className="mt-8 text-lg text-white/60"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              You&apos;re doing great. Keep breathing. 💜
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Call for Help - Always Visible */}
      <motion.div
        className="absolute bottom-8 left-0 right-0 flex justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <Link href="/patient/family/call">
          <motion.button
            className="flex items-center gap-3 rounded-full bg-white/90 px-6 py-3 font-semibold text-slate-700 shadow-lg"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="text-xl">📞</span>
            Call Sarah
          </motion.button>
        </Link>
      </motion.div>
    </div>
  );
}
