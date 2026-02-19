"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

// Mock data - in production this comes from Supabase
const familyMembers = [
  {
    id: "1",
    name: "Sarah",
    relationship: "Your Daughter",
    photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&h=600&fit=crop",
    voiceMessage: true,
  },
  {
    id: "2",
    name: "David",
    relationship: "Your Son",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=600&fit=crop",
    voiceMessage: true,
  },
  {
    id: "3",
    name: "Emma",
    relationship: "Your Granddaughter",
    photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&h=600&fit=crop",
    voiceMessage: false,
  },
  {
    id: "4",
    name: "Tommy",
    relationship: "Your Grandson",
    photo: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&h=600&fit=crop",
    voiceMessage: true,
  },
];

const todaySchedule = [
  { time: "8:00 AM", activity: "Breakfast", icon: "☕", completed: true },
  { time: "9:00 AM", activity: "Morning Medication", icon: "💊", completed: true },
  { time: "10:30 AM", activity: "Memory Activity", icon: "🧩", completed: false, current: true },
  { time: "12:00 PM", activity: "Lunch", icon: "🍽️", completed: false },
  { time: "3:00 PM", activity: "Video Call with David", icon: "📞", completed: false },
  { time: "6:00 PM", activity: "Dinner", icon: "🍝", completed: false },
];

function getTimeOfDay(): { greeting: string; emoji: string; period: string } {
  const hour = new Date().getHours();
  if (hour < 12) return { greeting: "Good Morning", emoji: "🌅", period: "Morning" };
  if (hour < 17) return { greeting: "Good Afternoon", emoji: "☀️", period: "Afternoon" };
  if (hour < 21) return { greeting: "Good Evening", emoji: "🌆", period: "Evening" };
  return { greeting: "Good Night", emoji: "🌙", period: "Night" };
}

function formatDate(): string {
  return new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric' 
  });
}

export default function PatientHomePage() {
  const [currentFamilyIndex, setCurrentFamilyIndex] = useState(0);
  const [showSchedule, setShowSchedule] = useState(false);
  const timeOfDay = getTimeOfDay();
  const currentFamily = familyMembers[currentFamilyIndex];

  // Rotate family member every 30 seconds when not interacting
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFamilyIndex((prev) => (prev + 1) % familyMembers.length);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const nextFamily = () => {
    setCurrentFamilyIndex((prev) => (prev + 1) % familyMembers.length);
  };

  const prevFamily = () => {
    setCurrentFamilyIndex((prev) => (prev - 1 + familyMembers.length) % familyMembers.length);
  };

  return (
    <div className="flex min-h-screen flex-col px-8 py-12">
      {/* Time & Date - Orientation */}
      <motion.header 
        className="text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="inline-flex items-center gap-3 rounded-full bg-white/60 px-6 py-3 shadow-sm backdrop-blur-sm dark:bg-slate-800/60">
          <span className="text-3xl">{timeOfDay.emoji}</span>
          <div className="text-left">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{timeOfDay.period}</p>
            <p className="text-lg font-semibold text-slate-700 dark:text-slate-200">{formatDate()}</p>
          </div>
        </div>
      </motion.header>

      {/* Main Greeting */}
      <motion.div 
        className="mt-8 text-center"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <h1 className="text-4xl font-bold tracking-tight text-slate-800 dark:text-white md:text-5xl">
          {timeOfDay.greeting}, <span className="text-sky-600 dark:text-sky-400">Margaret</span>
        </h1>
        <p className="mt-3 text-xl text-slate-600 dark:text-slate-300">
          You are safe and loved. Here&apos;s your family.
        </p>
      </motion.div>

      {/* Family Member Card */}
      <motion.div 
        className="mx-auto mt-10 w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <div className="relative">
          {/* Navigation Arrows */}
          <button
            onClick={prevFamily}
            className="absolute left-0 top-1/2 z-10 -translate-x-4 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-slate-600 shadow-lg transition-transform hover:scale-110 dark:bg-slate-700 dark:text-slate-300"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <button
            onClick={nextFamily}
            className="absolute right-0 top-1/2 z-10 translate-x-4 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-slate-600 shadow-lg transition-transform hover:scale-110 dark:bg-slate-700 dark:text-slate-300"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>

          {/* Family Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentFamily.id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden rounded-3xl bg-white shadow-2xl shadow-slate-200/50 dark:bg-slate-800 dark:shadow-slate-900/50"
            >
              {/* Photo */}
              <div className="relative aspect-square">
                <img
                  src={currentFamily.photo}
                  alt={currentFamily.name}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                {/* Name Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h2 className="text-4xl font-bold">{currentFamily.name}</h2>
                  <p className="mt-1 text-xl text-white/90">{currentFamily.relationship}</p>
                </div>
              </div>

              {/* Voice Message Button */}
              {currentFamily.voiceMessage && (
                <div className="p-6">
                  <motion.button
                    className="flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 py-5 text-xl font-semibold text-white shadow-lg shadow-sky-500/30"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
                    </svg>
                    Hear from {currentFamily.name}
                  </motion.button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Dots Indicator */}
          <div className="mt-6 flex justify-center gap-2">
            {familyMembers.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentFamilyIndex(index)}
                className={`h-3 w-3 rounded-full transition-all ${
                  index === currentFamilyIndex
                    ? "w-8 bg-sky-500"
                    : "bg-slate-300 hover:bg-slate-400 dark:bg-slate-600"
                }`}
              />
            ))}
          </div>
        </div>
      </motion.div>

      {/* Today's Schedule Toggle */}
      <motion.div 
        className="mx-auto mt-10 w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <motion.button
          onClick={() => setShowSchedule(!showSchedule)}
          className="flex w-full items-center justify-between rounded-2xl bg-white/80 px-6 py-5 shadow-lg backdrop-blur-sm transition-colors hover:bg-white dark:bg-slate-800/80 dark:hover:bg-slate-800"
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-2xl dark:bg-amber-900/30">
              📅
            </div>
            <div className="text-left">
              <p className="text-lg font-semibold text-slate-800 dark:text-white">Today&apos;s Schedule</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {todaySchedule.filter(s => !s.completed).length} activities remaining
              </p>
            </div>
          </div>
          <motion.div
            animate={{ rotate: showSchedule ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <svg className="h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </motion.div>
        </motion.button>

        {/* Schedule Dropdown */}
        <AnimatePresence>
          {showSchedule && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4 overflow-hidden rounded-2xl bg-white shadow-lg dark:bg-slate-800"
            >
              <div className="divide-y divide-slate-100 dark:divide-slate-700">
                {todaySchedule.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`flex items-center gap-4 px-6 py-4 ${
                      item.current
                        ? "bg-sky-50 dark:bg-sky-900/20"
                        : item.completed
                        ? "opacity-50"
                        : ""
                    }`}
                  >
                    <span className="text-3xl">{item.icon}</span>
                    <div className="flex-1">
                      <p className={`text-lg font-medium ${
                        item.completed 
                          ? "text-slate-400 line-through dark:text-slate-500" 
                          : "text-slate-800 dark:text-white"
                      }`}>
                        {item.activity}
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{item.time}</p>
                    </div>
                    {item.completed && (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                      </div>
                    )}
                    {item.current && (
                      <span className="rounded-full bg-sky-500 px-3 py-1 text-xs font-bold text-white">
                        NOW
                      </span>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Quick Actions */}
      <motion.div 
        className="mx-auto mt-10 grid w-full max-w-md grid-cols-2 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <motion.a
          href="/patient/family"
          className="flex flex-col items-center gap-3 rounded-2xl bg-white/80 p-6 shadow-lg backdrop-blur-sm transition-colors hover:bg-white dark:bg-slate-800/80 dark:hover:bg-slate-800"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-100 to-rose-100 text-4xl dark:from-pink-900/30 dark:to-rose-900/30">
            👨‍👩‍👧‍👦
          </div>
          <span className="text-lg font-semibold text-slate-800 dark:text-white">My Family</span>
        </motion.a>

        <motion.a
          href="/patient/memories"
          className="flex flex-col items-center gap-3 rounded-2xl bg-white/80 p-6 shadow-lg backdrop-blur-sm transition-colors hover:bg-white dark:bg-slate-800/80 dark:hover:bg-slate-800"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-100 to-indigo-100 text-4xl dark:from-purple-900/30 dark:to-indigo-900/30">
            📸
          </div>
          <span className="text-lg font-semibold text-slate-800 dark:text-white">Memories</span>
        </motion.a>

        <motion.a
          href="/patient/activities"
          className="flex flex-col items-center gap-3 rounded-2xl bg-white/80 p-6 shadow-lg backdrop-blur-sm transition-colors hover:bg-white dark:bg-slate-800/80 dark:hover:bg-slate-800"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 text-4xl dark:from-amber-900/30 dark:to-orange-900/30">
            🧩
          </div>
          <span className="text-lg font-semibold text-slate-800 dark:text-white">Activities</span>
        </motion.a>

        <motion.button
          className="flex flex-col items-center gap-3 rounded-2xl bg-white/80 p-6 shadow-lg backdrop-blur-sm transition-colors hover:bg-white dark:bg-slate-800/80 dark:hover:bg-slate-800"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 text-4xl dark:from-emerald-900/30 dark:to-teal-900/30">
            😊
          </div>
          <span className="text-lg font-semibold text-slate-800 dark:text-white">How I Feel</span>
        </motion.button>
      </motion.div>

      {/* Reassurance Footer */}
      <motion.footer
        className="mt-auto pt-10 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <p className="text-lg text-slate-500 dark:text-slate-400">
          💜 Sarah will visit at <span className="font-semibold text-slate-700 dark:text-slate-200">2:00 PM</span>
        </p>
      </motion.footer>
    </div>
  );
}
