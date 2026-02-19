"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Link from "next/link";

// Types
interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  photo: string;
  hasNewMessage: boolean;
  lastMessage?: string;
  canCall: boolean;
}

interface PhotoFeedItem {
  id: string;
  senderId: string;
  senderName: string;
  senderPhoto: string;
  image: string;
  caption: string;
  timestamp: string;
  liked: boolean;
}

// Mock data
const familyMembers: FamilyMember[] = [
  {
    id: "sarah",
    name: "Sarah",
    relationship: "Your Daughter",
    photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop",
    hasNewMessage: true,
    lastMessage: "Hi Mom! Can't wait to see you today!",
    canCall: true,
  },
  {
    id: "david",
    name: "David",
    relationship: "Your Son",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop",
    hasNewMessage: true,
    lastMessage: "Love you, Mom! 💜",
    canCall: true,
  },
  {
    id: "emma",
    name: "Emma",
    relationship: "Your Granddaughter",
    photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=300&fit=crop",
    hasNewMessage: false,
    canCall: true,
  },
  {
    id: "tommy",
    name: "Tommy",
    relationship: "Your Grandson",
    photo: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&h=300&fit=crop",
    hasNewMessage: true,
    lastMessage: "Grandma, I drew a picture for you!",
    canCall: true,
  },
];

const photoFeed: PhotoFeedItem[] = [
  {
    id: "1",
    senderId: "sarah",
    senderName: "Sarah",
    senderPhoto: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    image: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&h=600&fit=crop",
    caption: "Beautiful sunset from my garden! 🌅",
    timestamp: "2 hours ago",
    liked: false,
  },
  {
    id: "2",
    senderId: "tommy",
    senderName: "Tommy",
    senderPhoto: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop",
    image: "https://images.unsplash.com/photo-1535572290543-960a8046f5af?w=600&h=600&fit=crop",
    caption: "Look what I made at school! 🎨",
    timestamp: "Yesterday",
    liked: true,
  },
  {
    id: "3",
    senderId: "david",
    senderName: "David",
    senderPhoto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    image: "https://images.unsplash.com/photo-1490730141103-6cac27abb37f?w=600&h=600&fit=crop",
    caption: "Sunday brunch with the family!",
    timestamp: "3 days ago",
    liked: true,
  },
];

// Tabs
type TabType = "family" | "messages" | "photos";

export default function FamilyPage() {
  const [activeTab, setActiveTab] = useState<TabType>("family");
  const [playingMessage, setPlayingMessage] = useState<string | null>(null);
  const [photoFeedState, setPhotoFeedState] = useState(photoFeed);

  // Like a photo
  const toggleLike = (photoId: string) => {
    setPhotoFeedState((prev) =>
      prev.map((p) => (p.id === photoId ? { ...p, liked: !p.liked } : p))
    );
  };

  // Play voice message
  const playMessage = (memberId: string) => {
    setPlayingMessage(memberId);
    // Simulate playing
    setTimeout(() => setPlayingMessage(null), 3000);
  };

  return (
    <div className="min-h-screen px-6 py-8 pt-20">
      {/* Header */}
      <motion.header
        className="text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
          👨‍👩‍👧‍👦 Your Family
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          People who love you
        </p>
      </motion.header>

      {/* Tab Navigation */}
      <motion.div
        className="mx-auto mt-6 flex max-w-sm gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {[
          { id: "family" as TabType, label: "Family", icon: "👨‍👩‍👧‍👦" },
          { id: "messages" as TabType, label: "Messages", icon: "💌" },
          { id: "photos" as TabType, label: "Photos", icon: "📷" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 rounded-2xl px-4 py-3 text-sm font-semibold transition-colors ${
              activeTab === tab.id
                ? "bg-pink-500 text-white shadow-lg shadow-pink-500/30"
                : "bg-white text-slate-600 shadow-sm dark:bg-slate-800 dark:text-slate-300"
            }`}
          >
            <span className="mr-1">{tab.icon}</span> {tab.label}
          </button>
        ))}
      </motion.div>

      {/* Family Grid */}
      <AnimatePresence mode="wait">
        {activeTab === "family" && (
          <motion.div
            key="family"
            className="mx-auto mt-6 grid max-w-sm grid-cols-2 gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {familyMembers.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + index * 0.05 }}
              >
                <Link href={`/patient/family/${member.id}`}>
                  <motion.div
                    className="relative overflow-hidden rounded-3xl bg-white shadow-xl dark:bg-slate-800"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* Photo */}
                    <div className="relative aspect-square">
                      <img
                        src={member.photo}
                        alt={member.name}
                        className="h-full w-full object-cover"
                      />
                      {member.hasNewMessage && (
                        <motion.div
                          className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-white shadow-lg"
                          animate={{ scale: [1, 1.15, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          💌
                        </motion.div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-4 text-center">
                      <p className="text-xl font-bold text-slate-800 dark:text-white">
                        {member.name}
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {member.relationship}
                      </p>
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Messages View */}
        {activeTab === "messages" && (
          <motion.div
            key="messages"
            className="mx-auto mt-6 max-w-sm space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {familyMembers
              .filter((m) => m.hasNewMessage)
              .map((member, index) => (
                <motion.div
                  key={member.id}
                  className="overflow-hidden rounded-2xl bg-white shadow-lg dark:bg-slate-800"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center gap-4 p-4">
                    <div className="relative">
                      <img
                        src={member.photo}
                        alt={member.name}
                        className="h-16 w-16 rounded-full object-cover shadow-md"
                      />
                      <motion.div
                        className="absolute -right-1 -top-1 h-5 w-5 rounded-full bg-red-500"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-slate-800 dark:text-white">
                        {member.name}
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {member.lastMessage}
                      </p>
                    </div>
                  </div>

                  {/* Play Button */}
                  <motion.button
                    onClick={() => playMessage(member.id)}
                    className={`flex w-full items-center justify-center gap-3 py-4 transition-colors ${
                      playingMessage === member.id
                        ? "bg-purple-500 text-white"
                        : "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
                    }`}
                    whileTap={{ scale: 0.98 }}
                  >
                    {playingMessage === member.id ? (
                      <>
                        <motion.div
                          className="flex items-center gap-1"
                          animate={{ opacity: [1, 0.5, 1] }}
                          transition={{ duration: 1, repeat: Infinity }}
                        >
                          <span className="h-2 w-1 rounded bg-white" />
                          <span className="h-4 w-1 rounded bg-white" />
                          <span className="h-3 w-1 rounded bg-white" />
                          <span className="h-5 w-1 rounded bg-white" />
                          <span className="h-2 w-1 rounded bg-white" />
                        </motion.div>
                        <span className="font-semibold">Playing...</span>
                      </>
                    ) : (
                      <>
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
                        </svg>
                        <span className="font-semibold">Listen to Message</span>
                      </>
                    )}
                  </motion.button>
                </motion.div>
              ))}

            {/* No messages */}
            {familyMembers.filter((m) => m.hasNewMessage).length === 0 && (
              <div className="py-12 text-center">
                <span className="text-6xl">📭</span>
                <p className="mt-4 text-xl text-slate-600 dark:text-slate-400">
                  No new messages right now
                </p>
              </div>
            )}
          </motion.div>
        )}

        {/* Photo Feed */}
        {activeTab === "photos" && (
          <motion.div
            key="photos"
            className="mx-auto mt-6 max-w-sm space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {photoFeedState.map((photo, index) => (
              <motion.div
                key={photo.id}
                className="overflow-hidden rounded-2xl bg-white shadow-lg dark:bg-slate-800"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {/* Sender Info */}
                <div className="flex items-center gap-3 p-4">
                  <img
                    src={photo.senderPhoto}
                    alt={photo.senderName}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-white">
                      {photo.senderName}
                    </p>
                    <p className="text-xs text-slate-500">{photo.timestamp}</p>
                  </div>
                </div>

                {/* Photo */}
                <img
                  src={photo.image}
                  alt={photo.caption}
                  className="w-full"
                />

                {/* Caption & Actions */}
                <div className="p-4">
                  <p className="text-slate-700 dark:text-slate-200">
                    {photo.caption}
                  </p>
                  
                  {/* Reaction Buttons */}
                  <div className="mt-4 flex gap-2">
                    <motion.button
                      onClick={() => toggleLike(photo.id)}
                      className={`flex h-12 w-12 items-center justify-center rounded-full text-2xl transition-colors ${
                        photo.liked
                          ? "bg-red-100 dark:bg-red-900/30"
                          : "bg-slate-100 dark:bg-slate-700"
                      }`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {photo.liked ? "❤️" : "🤍"}
                    </motion.button>
                    <motion.button
                      className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-2xl dark:bg-slate-700"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      😊
                    </motion.button>
                    <motion.button
                      className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-2xl dark:bg-slate-700"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      👍
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Call Button (floating) */}
      <motion.div
        className="fixed bottom-36 right-4"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
      >
        <Link href="/patient/family/call">
          <motion.button
            className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-green-600 shadow-xl shadow-emerald-500/40"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
            </svg>
          </motion.button>
        </Link>
      </motion.div>

      {/* Spacer for bottom nav */}
      <div className="h-24" />
    </div>
  );
}
