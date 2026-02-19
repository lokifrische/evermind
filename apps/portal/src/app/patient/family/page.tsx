"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

// Mock data - in production this comes from Supabase
const familyMembers = [
  {
    id: "1",
    name: "Sarah",
    relationship: "Your Daughter",
    photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&h=800&fit=crop",
    funFact: "She loves gardening and visits every Tuesday",
    voiceIntro: true,
  },
  {
    id: "2",
    name: "David",
    relationship: "Your Son",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=800&fit=crop",
    funFact: "He's a teacher and calls every Sunday",
    voiceIntro: true,
  },
  {
    id: "3",
    name: "Robert",
    relationship: "Your Husband",
    photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&h=800&fit=crop",
    funFact: "You married in 1965. He loves jazz music.",
    voiceIntro: true,
    isSpecial: true,
  },
  {
    id: "4",
    name: "Emma",
    relationship: "Your Granddaughter",
    photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=800&h=800&fit=crop",
    funFact: "She's 16 and loves to paint",
    voiceIntro: true,
  },
  {
    id: "5",
    name: "Tommy",
    relationship: "Your Grandson",
    photo: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800&h=800&fit=crop",
    funFact: "He's 8 and plays soccer",
    voiceIntro: true,
  },
  {
    id: "6",
    name: "Lucy",
    relationship: "Your Sister",
    photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&h=800&fit=crop",
    funFact: "She lives in Florida and calls on Fridays",
    voiceIntro: false,
  },
];

export default function PatientFamilyPage() {
  const [selectedMember, setSelectedMember] = useState<typeof familyMembers[0] | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const playVoiceIntro = () => {
    setIsPlaying(true);
    // Simulate voice playing
    setTimeout(() => setIsPlaying(false), 3000);
  };

  return (
    <div className="min-h-screen px-6 py-8">
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
        <h1 className="text-4xl font-bold text-slate-800 dark:text-white">
          Your Family
        </h1>
        <p className="mt-2 text-xl text-slate-600 dark:text-slate-300">
          The people who love you
        </p>
      </motion.header>

      {/* Family Grid */}
      <motion.div 
        className="mx-auto grid max-w-4xl grid-cols-2 gap-4 md:grid-cols-3"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
          }
        }}
      >
        {familyMembers.map((member) => (
          <motion.button
            key={member.id}
            onClick={() => setSelectedMember(member)}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className={`group relative overflow-hidden rounded-3xl bg-white shadow-xl transition-shadow hover:shadow-2xl dark:bg-slate-800 ${
              member.isSpecial ? "ring-4 ring-amber-400 ring-offset-2" : ""
            }`}
          >
            {/* Photo */}
            <div className="aspect-square overflow-hidden">
              <img
                src={member.photo}
                alt={member.name}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            </div>

            {/* Name & Relationship */}
            <div className="absolute bottom-0 left-0 right-0 p-4 text-left text-white">
              <h3 className="text-2xl font-bold">{member.name}</h3>
              <p className="text-sm text-white/80">{member.relationship}</p>
            </div>

            {/* Special badge */}
            {member.isSpecial && (
              <div className="absolute right-3 top-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-400 text-xl shadow-lg">
                  💍
                </span>
              </div>
            )}

            {/* Voice indicator */}
            {member.voiceIntro && (
              <div className="absolute left-3 top-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-sky-600 shadow-lg">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
                  </svg>
                </span>
              </div>
            )}
          </motion.button>
        ))}
      </motion.div>

      {/* Selected Member Modal */}
      <AnimatePresence>
        {selectedMember && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6 backdrop-blur-sm"
            onClick={() => setSelectedMember(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-slate-800"
            >
              {/* Large Photo */}
              <div className="relative aspect-square">
                <img
                  src={selectedMember.photo}
                  alt={selectedMember.name}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                
                {/* Close button */}
                <button
                  onClick={() => setSelectedMember(null)}
                  className="absolute right-4 top-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-colors hover:bg-white/30"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                {/* Name Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                  <motion.h2 
                    className="text-5xl font-bold"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    {selectedMember.name}
                  </motion.h2>
                  <motion.p 
                    className="mt-2 text-2xl text-white/90"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    {selectedMember.relationship}
                  </motion.p>
                </div>
              </div>

              {/* Details */}
              <div className="p-8">
                {/* Fun Fact */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mb-6 rounded-2xl bg-amber-50 p-5 dark:bg-amber-900/20"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">💡</span>
                    <p className="text-lg text-amber-900 dark:text-amber-100">
                      {selectedMember.funFact}
                    </p>
                  </div>
                </motion.div>

                {/* Voice Introduction Button */}
                {selectedMember.voiceIntro && (
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    onClick={playVoiceIntro}
                    disabled={isPlaying}
                    className={`flex w-full items-center justify-center gap-4 rounded-2xl py-6 text-xl font-semibold text-white shadow-lg transition-all ${
                      isPlaying
                        ? "bg-emerald-500 shadow-emerald-500/30"
                        : "bg-gradient-to-r from-sky-500 to-blue-600 shadow-sky-500/30 hover:shadow-xl"
                    }`}
                  >
                    {isPlaying ? (
                      <>
                        <motion.div
                          className="flex gap-1"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ repeat: Infinity, duration: 0.5 }}
                        >
                          <span className="h-4 w-1 rounded-full bg-white" style={{ animation: "pulse 0.5s ease-in-out infinite" }} />
                          <span className="h-4 w-1 rounded-full bg-white" style={{ animation: "pulse 0.5s ease-in-out infinite 0.1s" }} />
                          <span className="h-4 w-1 rounded-full bg-white" style={{ animation: "pulse 0.5s ease-in-out infinite 0.2s" }} />
                        </motion.div>
                        Playing...
                      </>
                    ) : (
                      <>
                        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
                        </svg>
                        Hear {selectedMember.name} say hello
                      </>
                    )}
                  </motion.button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Navigation Hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-12 text-center"
      >
        <p className="text-slate-500 dark:text-slate-400">
          Tap any photo to learn more
        </p>
      </motion.div>
    </div>
  );
}
