"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Link from "next/link";

// Types
interface Memory {
  id: string;
  type: "photo" | "video" | "story";
  title: string;
  date: string;
  year: number;
  decade: string;
  thumbnail: string;
  tags: string[];
  hasAudio: boolean;
  lifePeriod?: string;
}

// Mock memories - in production from Supabase
const memories: Memory[] = [
  {
    id: "1",
    type: "photo",
    title: "Sarah's Wedding Day",
    date: "June 15, 2019",
    year: 2019,
    decade: "2010s",
    thumbnail: "https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=400&fit=crop",
    tags: ["Sarah", "Wedding", "Family"],
    hasAudio: true,
    lifePeriod: "Recent Years",
  },
  {
    id: "2",
    type: "photo",
    title: "Christmas at Home",
    date: "December 25, 2018",
    year: 2018,
    decade: "2010s",
    thumbnail: "https://images.unsplash.com/photo-1512389142860-9c449e58a814?w=400&h=400&fit=crop",
    tags: ["Christmas", "Family", "Home"],
    hasAudio: false,
    lifePeriod: "Recent Years",
  },
  {
    id: "3",
    type: "story",
    title: "How We Met",
    date: "Recorded Feb 2024",
    year: 2024,
    decade: "2020s",
    thumbnail: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400&h=400&fit=crop",
    tags: ["Love Story", "Robert"],
    hasAudio: true,
    lifePeriod: "Recent Years",
  },
  {
    id: "4",
    type: "photo",
    title: "David's Graduation",
    date: "May 20, 2010",
    year: 2010,
    decade: "2010s",
    thumbnail: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=400&fit=crop",
    tags: ["David", "Graduation", "College"],
    hasAudio: true,
    lifePeriod: "Recent Years",
  },
  {
    id: "5",
    type: "photo",
    title: "Beach Vacation",
    date: "July 1998",
    year: 1998,
    decade: "1990s",
    thumbnail: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=400&fit=crop",
    tags: ["Vacation", "Beach", "Family"],
    hasAudio: false,
    lifePeriod: "Middle Years",
  },
  {
    id: "6",
    type: "photo",
    title: "First Home",
    date: "September 1985",
    year: 1985,
    decade: "1980s",
    thumbnail: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&h=400&fit=crop",
    tags: ["Home", "New Beginning"],
    hasAudio: true,
    lifePeriod: "Middle Years",
  },
  {
    id: "7",
    type: "photo",
    title: "Our Wedding Day",
    date: "April 12, 1975",
    year: 1975,
    decade: "1970s",
    thumbnail: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=400&h=400&fit=crop",
    tags: ["Wedding", "Robert", "Love"],
    hasAudio: true,
    lifePeriod: "Early Years",
  },
  {
    id: "8",
    type: "photo",
    title: "Childhood in Ohio",
    date: "1955",
    year: 1955,
    decade: "1950s",
    thumbnail: "https://images.unsplash.com/photo-1489710437720-ebb67ec84dd2?w=400&h=400&fit=crop",
    tags: ["Childhood", "Ohio", "Family"],
    hasAudio: true,
    lifePeriod: "Childhood",
  },
];

// Filter options
const filterOptions = {
  types: ["All", "Photos", "Videos", "Stories"],
  lifePeriods: ["All Periods", "Recent Years", "Middle Years", "Early Years", "Childhood"],
  people: ["Everyone", "Sarah", "David", "Emma", "Tommy", "Robert"],
};

// Memory prompts for the day
const todayPrompt = {
  text: "What was your favorite holiday tradition?",
  icon: "🎄",
};

export default function MemoriesPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);

  // Filter memories
  const filteredMemories = memories.filter((m) => {
    if (activeFilter === "All") return true;
    if (activeFilter === "Photos") return m.type === "photo";
    if (activeFilter === "Videos") return m.type === "video";
    if (activeFilter === "Stories") return m.type === "story";
    return true;
  });

  // Group by decade for timeline
  const groupedByDecade = filteredMemories.reduce((acc, memory) => {
    if (!acc[memory.decade]) acc[memory.decade] = [];
    acc[memory.decade].push(memory);
    return acc;
  }, {} as Record<string, Memory[]>);

  return (
    <div className="min-h-screen px-6 py-8 pt-20">
      {/* Header */}
      <motion.header
        className="text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
          📸 Your Memories
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Stories from your beautiful life
        </p>
      </motion.header>

      {/* Record New Memory Button */}
      <motion.div
        className="mx-auto mt-6 max-w-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Link href="/patient/memories/record">
          <motion.button
            className="flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-600 py-5 text-xl font-semibold text-white shadow-lg shadow-purple-500/30"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="text-3xl">🎙️</span>
            Record a Story
          </motion.button>
        </Link>
      </motion.div>

      {/* Today's Prompt */}
      <motion.div
        className="mx-auto mt-4 max-w-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Link href="/patient/memories/record?prompt=holiday">
          <motion.div
            className="flex items-center gap-4 rounded-2xl bg-amber-50 px-5 py-4 shadow-sm dark:bg-amber-900/20"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <span className="text-3xl">{todayPrompt.icon}</span>
            <div className="flex-1">
              <p className="text-xs font-medium text-amber-600 dark:text-amber-400">
                Today&apos;s Prompt
              </p>
              <p className="font-medium text-slate-700 dark:text-slate-200">
                {todayPrompt.text}
              </p>
            </div>
            <svg className="h-5 w-5 text-amber-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </motion.div>
        </Link>
      </motion.div>

      {/* Filter Buttons */}
      <motion.div
        className="mx-auto mt-6 max-w-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex gap-2 overflow-x-auto pb-2">
          {filterOptions.types.map((filter) => (
            <motion.button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`flex-shrink-0 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors ${
                activeFilter === filter
                  ? "bg-sky-500 text-white shadow-md"
                  : "bg-white text-slate-600 shadow-sm hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-300"
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {filter}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Slideshow Button */}
      <motion.div
        className="mx-auto mt-4 max-w-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <Link href="/patient/memories/slideshow">
          <motion.button
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-white py-3 text-slate-700 shadow-sm dark:bg-slate-800 dark:text-slate-200"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <span className="text-xl">▶️</span>
            <span className="font-medium">Watch Slideshow</span>
          </motion.button>
        </Link>
      </motion.div>

      {/* Timeline */}
      <motion.div
        className="mx-auto mt-8 max-w-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        {Object.entries(groupedByDecade)
          .sort(([a], [b]) => (b > a ? 1 : -1))
          .map(([decade, decadeMemories], decadeIndex) => (
            <div key={decade} className="mb-8">
              {/* Decade Header */}
              <motion.div
                className="sticky top-16 z-10 mb-4 flex items-center gap-2 bg-gradient-to-r from-sky-50/95 to-transparent py-2 backdrop-blur-sm dark:from-slate-900/95"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + decadeIndex * 0.1 }}
              >
                <div className="h-1 w-8 rounded-full bg-sky-500" />
                <h2 className="text-lg font-bold text-sky-600 dark:text-sky-400">
                  {decade}
                </h2>
              </motion.div>

              {/* Memory Grid */}
              <div className="grid grid-cols-2 gap-3">
                {decadeMemories.map((memory, memIndex) => (
                  <motion.div
                    key={memory.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8 + decadeIndex * 0.1 + memIndex * 0.05 }}
                  >
                    <motion.button
                      onClick={() => setSelectedMemory(memory)}
                      className="group relative aspect-square w-full overflow-hidden rounded-2xl shadow-lg"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <img
                        src={memory.thumbnail}
                        alt={memory.title}
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                      
                      {/* Type Badge */}
                      <div className="absolute left-2 top-2">
                        <span className="rounded-full bg-white/90 px-2 py-0.5 text-xs font-medium text-slate-700">
                          {memory.type === "story" && "🎙️"}
                          {memory.type === "photo" && "📷"}
                          {memory.type === "video" && "🎬"}
                        </span>
                      </div>

                      {/* Has Audio Indicator */}
                      {memory.hasAudio && (
                        <div className="absolute right-2 top-2">
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-500 text-xs text-white">
                            🔊
                          </span>
                        </div>
                      )}

                      {/* Title */}
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <p className="font-semibold text-white drop-shadow-lg">
                          {memory.title}
                        </p>
                        <p className="text-xs text-white/80">{memory.date}</p>
                      </div>
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
      </motion.div>

      {/* Memory Detail Modal */}
      <AnimatePresence>
        {selectedMemory && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedMemory(null)}
          >
            <motion.div
              className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-slate-800"
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Image */}
              <div className="relative aspect-square">
                <img
                  src={selectedMemory.thumbnail}
                  alt={selectedMemory.title}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                {/* Close Button */}
                <button
                  onClick={() => setSelectedMemory(null)}
                  className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                {/* Title Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h2 className="text-2xl font-bold">{selectedMemory.title}</h2>
                  <p className="mt-1 text-white/80">{selectedMemory.date}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="p-6">
                {selectedMemory.hasAudio && (
                  <motion.button
                    className="flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-600 py-4 text-lg font-semibold text-white shadow-lg"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
                    </svg>
                    Listen to the Story
                  </motion.button>
                )}

                {/* Tags */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {selectedMemory.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600 dark:bg-slate-700 dark:text-slate-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
