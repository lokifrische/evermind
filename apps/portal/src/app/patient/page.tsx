"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";

// Types
interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  photo: string;
  hasNewMessage: boolean;
}

interface DailyHighlight {
  type: "memory" | "message" | "prompt";
  title: string;
  subtitle: string;
  action: string;
  href: string;
  icon: string;
}

// Mock data - in production this comes from Supabase
const userData = {
  name: "Margaret",
  preferredName: "Maggie",
  photo: "https://images.unsplash.com/photo-1566616213894-2d4e1baee5d8?w=400&h=400&fit=crop",
};

const familyMembers: FamilyMember[] = [
  {
    id: "1",
    name: "Sarah",
    relationship: "Your Daughter",
    photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop",
    hasNewMessage: true,
  },
  {
    id: "2",
    name: "David",
    relationship: "Your Son",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop",
    hasNewMessage: true,
  },
  {
    id: "3",
    name: "Emma",
    relationship: "Your Granddaughter",
    photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=300&fit=crop",
    hasNewMessage: false,
  },
  {
    id: "4",
    name: "Tommy",
    relationship: "Your Grandson",
    photo: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&h=300&fit=crop",
    hasNewMessage: true,
  },
];

// Daily highlights - rotating content
const dailyHighlights: DailyHighlight[] = [
  {
    type: "memory",
    title: "10 years ago today",
    subtitle: "Sarah's college graduation 🎓",
    action: "View Memory",
    href: "/patient/memories?highlight=today",
    icon: "📅",
  },
  {
    type: "message",
    title: "New message from David",
    subtitle: "Sent this morning",
    action: "Listen Now",
    href: "/patient/family/messages",
    icon: "💌",
  },
  {
    type: "prompt",
    title: "Share a memory",
    subtitle: "What was your favorite vacation?",
    action: "Record Story",
    href: "/patient/memories/record",
    icon: "🎙️",
  },
];

// Main 2x2 grid tiles - fixed positions, fixed colors
const mainTiles = [
  {
    id: "memories",
    label: "Memories",
    icon: "📸",
    href: "/patient/memories",
    bgGradient: "from-purple-500 to-indigo-600",
    shadowColor: "shadow-purple-500/30",
    hasNotification: false,
  },
  {
    id: "family",
    label: "Family",
    icon: "👨‍👩‍👧‍👦",
    href: "/patient/family",
    bgGradient: "from-pink-500 to-rose-600",
    shadowColor: "shadow-pink-500/30",
    hasNotification: true, // New messages
  },
  {
    id: "games",
    label: "Games",
    icon: "🧩",
    href: "/patient/games",
    bgGradient: "from-amber-500 to-orange-600",
    shadowColor: "shadow-amber-500/30",
    hasNotification: false,
  },
  {
    id: "talk",
    label: "Talk to Me",
    icon: "💬",
    href: "/patient/talk",
    bgGradient: "from-emerald-500 to-teal-600",
    shadowColor: "shadow-emerald-500/30",
    hasNotification: false,
  },
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
    day: 'numeric',
    year: 'numeric'
  });
}

export default function PatientHomePage() {
  const [currentHighlight, setCurrentHighlight] = useState(0);
  const timeOfDay = getTimeOfDay();

  // Rotate highlights every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHighlight((prev) => (prev + 1) % dailyHighlights.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const highlight = dailyHighlights[currentHighlight];

  return (
    <div className="flex min-h-screen flex-col px-6 py-8 pt-20">
      {/* Time-of-Day Greeting with Photo */}
      <motion.header 
        className="text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* User Photo */}
        <motion.div 
          className="mx-auto mb-4 h-24 w-24 overflow-hidden rounded-full border-4 border-white shadow-xl"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
        >
          <img
            src={userData.photo}
            alt={userData.name}
            className="h-full w-full object-cover"
          />
        </motion.div>

        {/* Greeting */}
        <h1 className="text-3xl font-bold tracking-tight text-slate-800 dark:text-white md:text-4xl">
          {timeOfDay.greeting},{" "}
          <span className="text-sky-600 dark:text-sky-400">{userData.preferredName}</span>
          <span className="ml-2">{timeOfDay.emoji}</span>
        </h1>

        {/* Date - Orientation */}
        <motion.div 
          className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 shadow-sm backdrop-blur-sm dark:bg-slate-800/70"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <span className="text-lg font-medium text-slate-600 dark:text-slate-300">
            {formatDate()}
          </span>
        </motion.div>
      </motion.header>

      {/* Main 2x2 Tile Grid */}
      <motion.div 
        className="mx-auto mt-8 grid w-full max-w-sm grid-cols-2 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        {mainTiles.map((tile, index) => (
          <Link key={tile.id} href={tile.href}>
            <motion.div
              className={`relative flex aspect-square flex-col items-center justify-center rounded-3xl bg-gradient-to-br ${tile.bgGradient} p-4 shadow-xl ${tile.shadowColor}`}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
            >
              {/* Notification Glow */}
              {tile.hasNotification && (
                <>
                  <motion.div
                    className="absolute -right-1 -top-1 h-5 w-5 rounded-full bg-red-500 shadow-lg"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <motion.div
                    className="absolute inset-0 rounded-3xl border-2 border-white/50"
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </>
              )}
              
              <span className="text-6xl drop-shadow-lg">{tile.icon}</span>
              <span className="mt-3 text-xl font-bold text-white drop-shadow-sm">
                {tile.label}
              </span>
            </motion.div>
          </Link>
        ))}
      </motion.div>

      {/* Daily Highlight Strip */}
      <motion.div 
        className="mx-auto mt-8 w-full max-w-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentHighlight}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
          >
            <Link href={highlight.href}>
              <motion.div
                className="flex items-center gap-4 rounded-2xl bg-white/80 px-5 py-4 shadow-lg backdrop-blur-sm transition-colors hover:bg-white dark:bg-slate-800/80 dark:hover:bg-slate-800"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-sky-100 to-blue-100 text-3xl dark:from-sky-900/30 dark:to-blue-900/30">
                  {highlight.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-800 dark:text-white truncate">
                    {highlight.title}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
                    {highlight.subtitle}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <span className="rounded-full bg-sky-500 px-3 py-1.5 text-xs font-bold text-white">
                    {highlight.action}
                  </span>
                </div>
              </motion.div>
            </Link>
          </motion.div>
        </AnimatePresence>

        {/* Highlight Dots */}
        <div className="mt-3 flex justify-center gap-2">
          {dailyHighlights.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentHighlight(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentHighlight
                  ? "w-6 bg-sky-500"
                  : "w-2 bg-slate-300 hover:bg-slate-400 dark:bg-slate-600"
              }`}
              aria-label={`View highlight ${index + 1}`}
            />
          ))}
        </div>
      </motion.div>

      {/* Who Loves You - Family Quick View */}
      <motion.div 
        className="mx-auto mt-8 w-full max-w-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1 }}
      >
        <p className="mb-4 text-center text-sm font-medium text-slate-500 dark:text-slate-400">
          💜 People who love you
        </p>
        <div className="flex justify-center gap-3">
          {familyMembers.slice(0, 4).map((member, index) => (
            <Link key={member.id} href={`/patient/family/${member.id}`}>
              <motion.div
                className="relative"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.1 + index * 0.1 }}
              >
                <div className="h-16 w-16 overflow-hidden rounded-full border-3 border-white shadow-lg dark:border-slate-700">
                  <img
                    src={member.photo}
                    alt={member.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                {member.hasNewMessage && (
                  <motion.div
                    className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-md"
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    💌
                  </motion.div>
                )}
                <p className="mt-1 text-center text-xs font-medium text-slate-600 dark:text-slate-400">
                  {member.name}
                </p>
              </motion.div>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Reassurance Message */}
      <motion.footer
        className="mt-auto pt-8 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <div className="mx-auto max-w-xs rounded-2xl bg-gradient-to-r from-purple-50 to-pink-50 px-6 py-4 dark:from-purple-900/20 dark:to-pink-900/20">
          <p className="text-lg text-slate-600 dark:text-slate-300">
            You are <span className="font-bold text-purple-600 dark:text-purple-400">safe</span> and{" "}
            <span className="font-bold text-pink-600 dark:text-pink-400">loved</span> 💜
          </p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Sarah is visiting at 2:00 PM
          </p>
        </div>
      </motion.footer>
    </div>
  );
}
