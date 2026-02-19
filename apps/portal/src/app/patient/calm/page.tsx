"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

// Calming nature images
const calmingImages = [
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop", // Mountains
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&h=1080&fit=crop", // Beach
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&h=1080&fit=crop", // Forest
  "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1920&h=1080&fit=crop", // Meadow
  "https://images.unsplash.com/photo-1518173946687-a4c036bc9f47?w=1920&h=1080&fit=crop", // Lake
];

// Reassuring messages
const reassuringMessages = [
  "You are safe.",
  "You are loved.",
  "Everything is okay.",
  "Your family is thinking of you.",
  "Take a deep breath.",
  "This feeling will pass.",
  "You are not alone.",
];

// Family photos for comfort
const familyPhotos = [
  {
    url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
    name: "Sarah",
  },
  {
    url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    name: "David",
  },
  {
    url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
    name: "Robert",
  },
];

export default function CalmModePage() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [breathPhase, setBreathPhase] = useState<"inhale" | "hold" | "exhale">("inhale");
  const [showBreathing, setShowBreathing] = useState(false);

  // Slowly rotate background images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % calmingImages.length);
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  // Rotate reassuring messages
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % reassuringMessages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // Breathing exercise cycle
  useEffect(() => {
    if (!showBreathing) return;
    
    const phases = [
      { phase: "inhale" as const, duration: 4000 },
      { phase: "hold" as const, duration: 4000 },
      { phase: "exhale" as const, duration: 6000 },
    ];
    
    let currentPhaseIndex = 0;
    
    const runPhase = () => {
      const current = phases[currentPhaseIndex];
      setBreathPhase(current.phase);
      currentPhaseIndex = (currentPhaseIndex + 1) % phases.length;
    };
    
    runPhase();
    const interval = setInterval(runPhase, 4670); // Average of all phases
    
    return () => clearInterval(interval);
  }, [showBreathing]);

  return (
    <div className="fixed inset-0 overflow-hidden bg-slate-900">
      {/* Background Image with Ken Burns effect */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentImageIndex}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 3 }}
          className="absolute inset-0"
        >
          <img
            src={calmingImages[currentImageIndex]}
            alt="Calming nature scene"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-8">
        
        {/* Breathing Exercise (when active) */}
        {showBreathing ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            {/* Breathing Circle */}
            <motion.div
              className="mx-auto mb-8 flex h-64 w-64 items-center justify-center rounded-full border-4 border-white/30"
              animate={{
                scale: breathPhase === "inhale" ? 1.3 : breathPhase === "hold" ? 1.3 : 1,
                borderColor: breathPhase === "inhale" 
                  ? "rgba(147, 197, 253, 0.6)" 
                  : breathPhase === "hold" 
                  ? "rgba(167, 139, 250, 0.6)" 
                  : "rgba(134, 239, 172, 0.6)",
              }}
              transition={{ duration: breathPhase === "exhale" ? 6 : 4, ease: "easeInOut" }}
            >
              <motion.div
                className="flex h-48 w-48 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm"
                animate={{
                  scale: breathPhase === "inhale" ? 1.2 : breathPhase === "hold" ? 1.2 : 0.9,
                }}
                transition={{ duration: breathPhase === "exhale" ? 6 : 4, ease: "easeInOut" }}
              >
                <span className="text-4xl font-light text-white">
                  {breathPhase === "inhale" && "Breathe In"}
                  {breathPhase === "hold" && "Hold"}
                  {breathPhase === "exhale" && "Breathe Out"}
                </span>
              </motion.div>
            </motion.div>

            <button
              onClick={() => setShowBreathing(false)}
              className="rounded-full bg-white/20 px-6 py-3 text-white backdrop-blur-sm transition-colors hover:bg-white/30"
            >
              Done Breathing
            </button>
          </motion.div>
        ) : (
          <>
            {/* Reassuring Message */}
            <AnimatePresence mode="wait">
              <motion.h1
                key={currentMessageIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 1.5 }}
                className="mb-12 text-center text-5xl font-light text-white md:text-6xl"
              >
                {reassuringMessages[currentMessageIndex]}
              </motion.h1>
            </AnimatePresence>

            {/* Family Photos */}
            <motion.div 
              className="mb-12 flex justify-center gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
            >
              {familyPhotos.map((photo, index) => (
                <motion.div
                  key={photo.name}
                  className="text-center"
                  animate={{ 
                    y: [0, -5, 0],
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity, 
                    delay: index * 0.5 
                  }}
                >
                  <img
                    src={photo.url}
                    alt={photo.name}
                    className="h-20 w-20 rounded-full border-4 border-white/50 object-cover shadow-xl md:h-24 md:w-24"
                  />
                  <p className="mt-2 text-sm font-medium text-white/80">{photo.name}</p>
                </motion.div>
              ))}
            </motion.div>

            {/* Actions */}
            <motion.div
              className="flex flex-col gap-4 sm:flex-row"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
            >
              <motion.button
                onClick={() => setShowBreathing(true)}
                className="flex items-center justify-center gap-3 rounded-full bg-white/20 px-8 py-4 text-lg font-medium text-white backdrop-blur-sm transition-all hover:bg-white/30"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-2xl">🌬️</span>
                Breathing Exercise
              </motion.button>

              <motion.a
                href="/patient"
                className="flex items-center justify-center gap-3 rounded-full bg-white px-8 py-4 text-lg font-medium text-slate-800 shadow-xl transition-all hover:bg-white/90"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-2xl">🏠</span>
                I Feel Better
              </motion.a>
            </motion.div>
          </>
        )}
      </div>

      {/* Call Caregiver Button */}
      <motion.button
        className="fixed bottom-8 right-8 z-50 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-rose-500 to-red-600 text-white shadow-2xl shadow-red-500/30"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2 }}
      >
        <div className="text-center">
          <svg className="mx-auto h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
          </svg>
          <span className="mt-1 text-xs font-bold">HELP</span>
        </div>
      </motion.button>

      {/* Subtle Back Link */}
      <motion.a
        href="/patient"
        className="fixed left-8 top-8 z-50 flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-white/70 backdrop-blur-sm transition-colors hover:bg-white/20 hover:text-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
        Home
      </motion.a>
    </div>
  );
}
