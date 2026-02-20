"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";

// All messages from family
const allMessages = [
  {
    id: 1,
    from: "David",
    fromId: "david",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
    text: "Love you, Mom! The kids drew pictures for you.",
    date: "Today",
    time: "2:30 PM",
    hasAudio: true,
    isNew: true,
  },
  {
    id: 2,
    from: "Sarah",
    fromId: "sarah",
    photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
    text: "Hi Mom! Can't wait to see you today! I'm bringing your favorite cookies.",
    date: "Today",
    time: "10:15 AM",
    hasAudio: true,
    isNew: true,
  },
  {
    id: 3,
    from: "Tommy",
    fromId: "tommy",
    photo: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&h=200&fit=crop",
    text: "Grandma! I drew a picture for you! It's you and me!",
    date: "Today",
    time: "9:00 AM",
    hasAudio: true,
    isNew: false,
  },
  {
    id: 4,
    from: "Emma",
    fromId: "emma",
    photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop",
    text: "Hi Grandma! I love you! Look at my new painting!",
    date: "Yesterday",
    time: "4:45 PM",
    hasAudio: true,
    isNew: false,
  },
  {
    id: 5,
    from: "Sarah",
    fromId: "sarah",
    photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
    text: "The garden is blooming beautifully. I took some photos for you!",
    date: "Yesterday",
    time: "11:30 AM",
    hasAudio: false,
    isNew: false,
  },
  {
    id: 6,
    from: "David",
    fromId: "david",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
    text: "Remember when you taught me to ride a bike? Best memory ever.",
    date: "3 days ago",
    time: "7:00 PM",
    hasAudio: true,
    isNew: false,
  },
];

export default function FamilyMessagesPage() {
  const [playingId, setPlayingId] = useState<number | null>(null);

  const playMessage = (id: number) => {
    setPlayingId(id);
    setTimeout(() => setPlayingId(null), 3000);
  };

  const newMessages = allMessages.filter(m => m.isNew);
  const olderMessages = allMessages.filter(m => !m.isNew);

  return (
    <div className="min-h-screen px-6 py-8 pt-20 pb-32">
      {/* Header */}
      <motion.header
        className="text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
          💌 Messages
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          From your loved ones
        </p>
      </motion.header>

      {/* New Messages */}
      {newMessages.length > 0 && (
        <motion.section
          className="mx-auto mt-8 max-w-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="mb-4 flex items-center gap-2 font-semibold text-slate-800 dark:text-white">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-pink-500 text-xs font-bold text-white">
              {newMessages.length}
            </span>
            New Messages
          </h2>
          <div className="space-y-3">
            {newMessages.map((message, index) => (
              <motion.div
                key={message.id}
                className="overflow-hidden rounded-2xl bg-gradient-to-r from-pink-50 to-purple-50 shadow-sm dark:from-pink-900/20 dark:to-purple-900/20"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + index * 0.1 }}
              >
                <div className="p-4">
                  <div className="flex items-start gap-4">
                    <Link href={`/patient/family/${message.fromId}`}>
                      <motion.div
                        className="relative h-14 w-14 overflow-hidden rounded-full ring-2 ring-pink-400"
                        whileHover={{ scale: 1.05 }}
                      >
                        <img
                          src={message.photo}
                          alt={message.from}
                          className="h-full w-full object-cover"
                        />
                      </motion.div>
                    </Link>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <Link href={`/patient/family/${message.fromId}`}>
                          <span className="font-semibold text-slate-800 dark:text-white">
                            {message.from}
                          </span>
                        </Link>
                        <span className="text-sm text-slate-500">
                          {message.time}
                        </span>
                      </div>
                      <p className="mt-1 text-slate-700 dark:text-slate-300">
                        {message.text}
                      </p>
                    </div>
                  </div>
                  {message.hasAudio && (
                    <motion.button
                      onClick={() => playMessage(message.id)}
                      className={`mt-3 flex w-full items-center justify-center gap-2 rounded-xl py-3 font-medium ${
                        playingId === message.id
                          ? "bg-purple-500 text-white"
                          : "bg-white text-purple-600 dark:bg-slate-800 dark:text-purple-400"
                      }`}
                      whileTap={{ scale: 0.98 }}
                    >
                      {playingId === message.id ? (
                        <>
                          <motion.div
                            className="flex gap-1"
                            animate={{ opacity: [1, 0.5, 1] }}
                            transition={{ duration: 1, repeat: Infinity }}
                          >
                            <span className="h-4 w-1 rounded bg-white" />
                            <span className="h-6 w-1 rounded bg-white" />
                            <span className="h-3 w-1 rounded bg-white" />
                          </motion.div>
                          Playing...
                        </>
                      ) : (
                        <>🔊 Listen to {message.from}</>
                      )}
                    </motion.button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}

      {/* Earlier Messages */}
      <motion.section
        className="mx-auto mt-8 max-w-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="mb-4 font-semibold text-slate-600 dark:text-slate-400">
          Earlier
        </h2>
        <div className="space-y-3">
          {olderMessages.map((message, index) => (
            <motion.div
              key={message.id}
              className="overflow-hidden rounded-2xl bg-white shadow-sm dark:bg-slate-800"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
            >
              <div className="p-4">
                <div className="flex items-start gap-4">
                  <Link href={`/patient/family/${message.fromId}`}>
                    <motion.div
                      className="h-12 w-12 overflow-hidden rounded-full"
                      whileHover={{ scale: 1.05 }}
                    >
                      <img
                        src={message.photo}
                        alt={message.from}
                        className="h-full w-full object-cover"
                      />
                    </motion.div>
                  </Link>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <Link href={`/patient/family/${message.fromId}`}>
                        <span className="font-medium text-slate-800 dark:text-white">
                          {message.from}
                        </span>
                      </Link>
                      <span className="text-sm text-slate-400">
                        {message.date}
                      </span>
                    </div>
                    <p className="mt-1 text-slate-600 dark:text-slate-400">
                      {message.text}
                    </p>
                  </div>
                </div>
                {message.hasAudio && (
                  <motion.button
                    onClick={() => playMessage(message.id)}
                    className={`mt-3 flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-medium ${
                      playingId === message.id
                        ? "bg-purple-500 text-white"
                        : "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
                    }`}
                    whileTap={{ scale: 0.98 }}
                  >
                    {playingId === message.id ? (
                      <>Playing...</>
                    ) : (
                      <>🔊 Listen</>
                    )}
                  </motion.button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Back to Family */}
      <motion.div
        className="mx-auto mt-8 max-w-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <Link href="/patient/family">
          <motion.button
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-100 py-3 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Back to Family
          </motion.button>
        </Link>
      </motion.div>
    </div>
  );
}
