"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";

// Types
interface ScheduleEvent {
  id: string;
  time: string;
  title: string;
  description: string;
  type: "visitor" | "medication" | "meal" | "activity" | "appointment";
  icon: string;
  color: string;
  completed: boolean;
  reminderSet: boolean;
}

// Mock schedule - in production from Supabase
const todaySchedule: ScheduleEvent[] = [
  {
    id: "1",
    time: "8:00 AM",
    title: "Morning Medication",
    description: "Blood pressure pill and vitamin D",
    type: "medication",
    icon: "💊",
    color: "from-blue-500 to-cyan-500",
    completed: true,
    reminderSet: true,
  },
  {
    id: "2",
    time: "9:00 AM",
    title: "Breakfast",
    description: "Oatmeal with berries",
    type: "meal",
    icon: "🍳",
    color: "from-amber-500 to-orange-500",
    completed: true,
    reminderSet: false,
  },
  {
    id: "3",
    time: "10:30 AM",
    title: "Chair Exercises",
    description: "15 minute gentle stretching",
    type: "activity",
    icon: "🧘",
    color: "from-emerald-500 to-green-500",
    completed: false,
    reminderSet: true,
  },
  {
    id: "4",
    time: "12:00 PM",
    title: "Lunch",
    description: "Soup and sandwich",
    type: "meal",
    icon: "🥗",
    color: "from-amber-500 to-orange-500",
    completed: false,
    reminderSet: false,
  },
  {
    id: "5",
    time: "2:00 PM",
    title: "Sarah is Visiting! 💜",
    description: "Your daughter is coming to see you",
    type: "visitor",
    icon: "👩",
    color: "from-pink-500 to-rose-500",
    completed: false,
    reminderSet: true,
  },
  {
    id: "6",
    time: "3:00 PM",
    title: "Afternoon Medication",
    description: "Heart medication",
    type: "medication",
    icon: "💊",
    color: "from-blue-500 to-cyan-500",
    completed: false,
    reminderSet: true,
  },
  {
    id: "7",
    time: "4:00 PM",
    title: "Video Call with David",
    description: "Weekly call with your son",
    type: "visitor",
    icon: "📱",
    color: "from-purple-500 to-indigo-500",
    completed: false,
    reminderSet: true,
  },
  {
    id: "8",
    time: "6:00 PM",
    title: "Dinner",
    description: "Chicken and vegetables",
    type: "meal",
    icon: "🍽️",
    color: "from-amber-500 to-orange-500",
    completed: false,
    reminderSet: false,
  },
  {
    id: "9",
    time: "8:00 PM",
    title: "Evening Medication",
    description: "Sleep aid if needed",
    type: "medication",
    icon: "💊",
    color: "from-blue-500 to-cyan-500",
    completed: false,
    reminderSet: true,
  },
];

// Get current time period
function getCurrentPeriod(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  return "evening";
}

// Format today's date
function formatToday(): { dayName: string; date: string } {
  const now = new Date();
  return {
    dayName: now.toLocaleDateString('en-US', { weekday: 'long' }),
    date: now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
  };
}

export default function PatientSchedulePage() {
  const [events, setEvents] = useState(todaySchedule);
  const [currentTime, setCurrentTime] = useState(new Date());
  const today = formatToday();
  const period = getCurrentPeriod();

  // Update current time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Find next upcoming event
  const getNextEvent = () => {
    const now = new Date();
    for (const event of events) {
      if (!event.completed) {
        return event;
      }
    }
    return null;
  };

  const nextEvent = getNextEvent();

  // Toggle event completion
  const toggleComplete = (eventId: string) => {
    setEvents((prev) =>
      prev.map((e) =>
        e.id === eventId ? { ...e, completed: !e.completed } : e
      )
    );
  };

  // Count events
  const completedCount = events.filter((e) => e.completed).length;
  const totalCount = events.length;

  return (
    <div className="min-h-screen px-6 py-8 pt-20 pb-32">
      {/* Header */}
      <motion.header
        className="text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
          📅 Today&apos;s Schedule
        </h1>
        <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">
          {today.dayName}, {today.date}
        </p>
      </motion.header>

      {/* Current Time */}
      <motion.div
        className="mx-auto mt-4 max-w-sm text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div className="inline-flex items-center gap-2 rounded-full bg-sky-100 px-4 py-2 dark:bg-sky-900/30">
          <motion.div
            className="h-2 w-2 rounded-full bg-sky-500"
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span className="text-lg font-semibold text-sky-700 dark:text-sky-300">
            {currentTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
          </span>
          <span className="text-sky-600 dark:text-sky-400">
            Good {period}!
          </span>
        </div>
      </motion.div>

      {/* Progress */}
      <motion.div
        className="mx-auto mt-6 max-w-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-600 dark:text-slate-400">Today&apos;s Progress</span>
          <span className="font-semibold text-emerald-600 dark:text-emerald-400">
            {completedCount} of {totalCount} done ✓
          </span>
        </div>
        <div className="mt-2 h-3 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
          <motion.div
            className="h-full bg-gradient-to-r from-emerald-500 to-green-500"
            initial={{ width: 0 }}
            animate={{ width: `${(completedCount / totalCount) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </motion.div>

      {/* Next Up Highlight */}
      {nextEvent && (
        <motion.div
          className="mx-auto mt-6 max-w-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <p className="mb-2 text-center text-sm font-medium text-slate-500 dark:text-slate-400">
            ⏰ Coming Up Next
          </p>
          <motion.div
            className={`overflow-hidden rounded-2xl bg-gradient-to-r ${nextEvent.color} p-5 text-white shadow-lg`}
            animate={{ scale: [1, 1.01, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <div className="flex items-center gap-4">
              <span className="text-4xl">{nextEvent.icon}</span>
              <div className="flex-1">
                <p className="text-2xl font-bold">{nextEvent.time}</p>
                <p className="text-lg font-semibold">{nextEvent.title}</p>
                <p className="text-white/80">{nextEvent.description}</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Full Schedule */}
      <motion.div
        className="mx-auto mt-8 max-w-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="mb-4 text-lg font-semibold text-slate-800 dark:text-white">
          Full Day
        </h2>
        <div className="space-y-3">
          {events.map((event, index) => (
            <motion.div
              key={event.id}
              className={`flex items-center gap-4 rounded-2xl p-4 transition-colors ${
                event.completed
                  ? "bg-slate-100 dark:bg-slate-800/50"
                  : "bg-white shadow-sm dark:bg-slate-800"
              }`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + index * 0.03 }}
            >
              {/* Checkbox */}
              <motion.button
                onClick={() => toggleComplete(event.id)}
                className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                  event.completed
                    ? "border-emerald-500 bg-emerald-500 text-white"
                    : "border-slate-300 bg-white dark:border-slate-600 dark:bg-slate-700"
                }`}
                whileTap={{ scale: 0.9 }}
              >
                {event.completed && (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                )}
              </motion.button>

              {/* Icon */}
              <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${event.color} text-2xl shadow-sm ${event.completed ? "opacity-50" : ""}`}>
                {event.icon}
              </div>

              {/* Details */}
              <div className={`flex-1 ${event.completed ? "opacity-50" : ""}`}>
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-slate-800 dark:text-white">
                    {event.time}
                  </p>
                  {event.reminderSet && (
                    <span className="text-amber-500" title="Reminder set">🔔</span>
                  )}
                </div>
                <p className={`font-medium ${event.completed ? "line-through" : ""} text-slate-700 dark:text-slate-300`}>
                  {event.title}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {event.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Reassurance */}
      <motion.div
        className="mx-auto mt-8 max-w-sm text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <div className="rounded-2xl bg-gradient-to-r from-purple-50 to-pink-50 px-6 py-4 dark:from-purple-900/20 dark:to-pink-900/20">
          <p className="text-slate-600 dark:text-slate-300">
            💜 Don&apos;t worry about remembering everything. 
            <br />We&apos;ll remind you when it&apos;s time.
          </p>
        </div>
      </motion.div>

      {/* Quick Links */}
      <motion.div
        className="mx-auto mt-6 flex max-w-sm justify-center gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
      >
        <Link href="/patient/family/call">
          <motion.button
            className="flex items-center gap-2 rounded-xl bg-emerald-100 px-4 py-3 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span>📞</span> Call Sarah
          </motion.button>
        </Link>
        <Link href="/patient/talk">
          <motion.button
            className="flex items-center gap-2 rounded-xl bg-sky-100 px-4 py-3 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span>💬</span> Ask Me
          </motion.button>
        </Link>
      </motion.div>
    </div>
  );
}
