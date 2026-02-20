"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

// Family member data
const familyData: Record<string, {
  name: string;
  relationship: string;
  fullRelationship: string;
  photo: string;
  bio: string;
  facts: string[];
  sharedMemories: { title: string; date: string; image: string }[];
  recentMessages: { text: string; date: string; hasAudio: boolean }[];
  recentPhotos: { image: string; caption: string }[];
}> = {
  sarah: {
    name: "Sarah",
    relationship: "Daughter",
    fullRelationship: "Your Daughter",
    photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
    bio: "Sarah is your firstborn. She was born on March 15, 1978. She works as a nurse at the local hospital and loves gardening, just like you taught her.",
    facts: [
      "Born March 15, 1978",
      "Married to Michael",
      "Works as a nurse",
      "Lives 20 minutes away",
      "Visits every Tuesday and Saturday",
      "Favorite flower: Sunflowers",
    ],
    sharedMemories: [
      { title: "Sarah's Wedding", date: "June 2019", image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=300&fit=crop" },
      { title: "Mother's Day Brunch", date: "May 2023", image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop" },
      { title: "Beach Trip", date: "Summer 2022", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop" },
    ],
    recentMessages: [
      { text: "Hi Mom! Can't wait to see you today! I'm bringing your favorite cookies.", date: "Today", hasAudio: true },
      { text: "The garden is blooming beautifully. I took some photos for you!", date: "Yesterday", hasAudio: false },
      { text: "Love you so much, Mom. Talk soon!", date: "2 days ago", hasAudio: true },
    ],
    recentPhotos: [
      { image: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400&h=400&fit=crop", caption: "From my garden 🌸" },
      { image: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400&h=400&fit=crop", caption: "Sunday morning coffee ☕" },
    ],
  },
  david: {
    name: "David",
    relationship: "Son",
    fullRelationship: "Your Son",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    bio: "David is your son, born on November 22, 1980. He's an engineer and father of two wonderful kids - Emma and Tommy, your grandchildren!",
    facts: [
      "Born November 22, 1980",
      "Married to Jennifer",
      "Works as an engineer",
      "Father of Emma and Tommy",
      "Lives an hour away",
      "Calls every Sunday",
      "Loves cooking your recipes",
    ],
    sharedMemories: [
      { title: "David's Graduation", date: "May 2010", image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=300&fit=crop" },
      { title: "Christmas Together", date: "Dec 2023", image: "https://images.unsplash.com/photo-1512389142860-9c449e58a814?w=400&h=300&fit=crop" },
      { title: "Family Reunion", date: "July 2022", image: "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=400&h=300&fit=crop" },
    ],
    recentMessages: [
      { text: "Love you, Mom! The kids drew pictures for you.", date: "Today", hasAudio: true },
      { text: "Remember when you taught me to ride a bike? Best memory ever.", date: "3 days ago", hasAudio: true },
    ],
    recentPhotos: [
      { image: "https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=400&h=400&fit=crop", caption: "Made your apple pie recipe! 🥧" },
    ],
  },
  emma: {
    name: "Emma",
    relationship: "Granddaughter",
    fullRelationship: "Your Granddaughter (David's Daughter)",
    photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop",
    bio: "Emma is your granddaughter, David and Jennifer's daughter. She's 14 years old and loves art, music, and visiting her grandma!",
    facts: [
      "Age: 14 years old",
      "David's daughter",
      "Loves drawing and painting",
      "Plays the piano",
      "Wants to be an artist",
      "Your 'little artist'",
    ],
    sharedMemories: [
      { title: "Emma's Art Show", date: "April 2024", image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&h=300&fit=crop" },
      { title: "Baking Together", date: "Dec 2023", image: "https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=400&h=300&fit=crop" },
    ],
    recentMessages: [
      { text: "Hi Grandma! I love you! Look at my new painting!", date: "Yesterday", hasAudio: true },
    ],
    recentPhotos: [
      { image: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=400&h=400&fit=crop", caption: "My new painting for you! 🎨" },
    ],
  },
  tommy: {
    name: "Tommy",
    relationship: "Grandson",
    fullRelationship: "Your Grandson (David's Son)",
    photo: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=400&fit=crop",
    bio: "Tommy is your grandson, David and Jennifer's son. He's 10 years old and full of energy! He loves soccer, video games, and grandma's cookies.",
    facts: [
      "Age: 10 years old",
      "David's son",
      "Plays soccer",
      "Loves your cookies",
      "Always makes you laugh",
      "Your 'little helper'",
    ],
    sharedMemories: [
      { title: "Tommy's Soccer Game", date: "Oct 2024", image: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=400&h=300&fit=crop" },
      { title: "Birthday Party", date: "Aug 2024", image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&h=300&fit=crop" },
    ],
    recentMessages: [
      { text: "Grandma! I drew a picture for you! It's you and me!", date: "Today", hasAudio: true },
      { text: "I scored a goal today! Wish you were there!", date: "Last week", hasAudio: true },
    ],
    recentPhotos: [
      { image: "https://images.unsplash.com/photo-1535572290543-960a8046f5af?w=400&h=400&fit=crop", caption: "My drawing for you! ❤️" },
    ],
  },
};

type TabType = "about" | "messages" | "photos" | "memories";

export default function FamilyMemberPage() {
  const params = useParams();
  const memberId = params.id as string;
  const member = familyData[memberId];
  const [activeTab, setActiveTab] = useState<TabType>("about");
  const [playingMessage, setPlayingMessage] = useState<number | null>(null);

  // Handle unknown member
  if (!member) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-6 py-8">
        <span className="text-6xl">😕</span>
        <h1 className="mt-4 text-2xl font-bold text-slate-800 dark:text-white">
          Person not found
        </h1>
        <Link href="/patient/family" className="mt-6">
          <motion.button
            className="rounded-xl bg-sky-500 px-6 py-3 font-semibold text-white"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Back to Family
          </motion.button>
        </Link>
      </div>
    );
  }

  const playMessage = (index: number) => {
    setPlayingMessage(index);
    setTimeout(() => setPlayingMessage(null), 3000);
  };

  return (
    <div className="min-h-screen px-6 py-8 pt-20 pb-32">
      {/* Profile Header */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <motion.div
          className="mx-auto h-32 w-32 overflow-hidden rounded-full border-4 border-white shadow-xl"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring" }}
        >
          <img
            src={member.photo}
            alt={member.name}
            className="h-full w-full object-cover"
          />
        </motion.div>
        <h1 className="mt-4 text-3xl font-bold text-slate-800 dark:text-white">
          {member.name}
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          {member.fullRelationship}
        </p>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        className="mx-auto mt-6 flex max-w-sm justify-center gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Link href="/patient/family/call">
          <motion.button
            className="flex h-16 w-16 flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-500/30"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
            </svg>
            <span className="mt-1 text-xs font-medium">Call</span>
          </motion.button>
        </Link>
        <motion.button
          className="flex h-16 w-16 flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-lg shadow-purple-500/30"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
          </svg>
          <span className="mt-1 text-xs font-medium">Video</span>
        </motion.button>
        <motion.button
          className="flex h-16 w-16 flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 text-white shadow-lg shadow-pink-500/30"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="text-2xl">❤️</span>
          <span className="mt-1 text-xs font-medium">Love</span>
        </motion.button>
      </motion.div>

      {/* Tab Navigation */}
      <motion.div
        className="mx-auto mt-8 flex max-w-sm gap-1 rounded-2xl bg-white p-1 shadow-sm dark:bg-slate-800"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {[
          { id: "about" as TabType, label: "About", icon: "👤" },
          { id: "messages" as TabType, label: "Messages", icon: "💌" },
          { id: "photos" as TabType, label: "Photos", icon: "📷" },
          { id: "memories" as TabType, label: "Memories", icon: "💭" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "bg-sky-500 text-white shadow-md"
                : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700"
            }`}
          >
            <span className="mr-1">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </motion.div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {/* About Tab */}
        {activeTab === "about" && (
          <motion.div
            key="about"
            className="mx-auto mt-6 max-w-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {/* Bio */}
            <div className="rounded-2xl bg-white p-5 shadow-sm dark:bg-slate-800">
              <p className="text-lg leading-relaxed text-slate-700 dark:text-slate-300">
                {member.bio}
              </p>
            </div>

            {/* Quick Facts */}
            <div className="mt-4 rounded-2xl bg-white p-5 shadow-sm dark:bg-slate-800">
              <h3 className="mb-3 font-semibold text-slate-800 dark:text-white">
                💡 Things to Remember
              </h3>
              <ul className="space-y-2">
                {member.facts.map((fact, index) => (
                  <motion.li
                    key={index}
                    className="flex items-start gap-3 text-slate-600 dark:text-slate-400"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <span className="text-sky-500">•</span>
                    {fact}
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}

        {/* Messages Tab */}
        {activeTab === "messages" && (
          <motion.div
            key="messages"
            className="mx-auto mt-6 max-w-sm space-y-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {member.recentMessages.map((message, index) => (
              <motion.div
                key={index}
                className="rounded-2xl bg-white p-4 shadow-sm dark:bg-slate-800"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <p className="text-slate-700 dark:text-slate-300">{message.text}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-sm text-slate-500">{message.date}</span>
                  {message.hasAudio && (
                    <motion.button
                      onClick={() => playMessage(index)}
                      className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium ${
                        playingMessage === index
                          ? "bg-purple-500 text-white"
                          : "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
                      }`}
                      whileTap={{ scale: 0.95 }}
                    >
                      {playingMessage === index ? (
                        <>
                          <motion.div
                            className="flex gap-0.5"
                            animate={{ opacity: [1, 0.5, 1] }}
                            transition={{ duration: 1, repeat: Infinity }}
                          >
                            <span className="h-3 w-0.5 rounded bg-white" />
                            <span className="h-4 w-0.5 rounded bg-white" />
                            <span className="h-2 w-0.5 rounded bg-white" />
                          </motion.div>
                          Playing
                        </>
                      ) : (
                        <>🔊 Listen</>
                      )}
                    </motion.button>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Photos Tab */}
        {activeTab === "photos" && (
          <motion.div
            key="photos"
            className="mx-auto mt-6 max-w-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="grid grid-cols-2 gap-3">
              {member.recentPhotos.map((photo, index) => (
                <motion.div
                  key={index}
                  className="overflow-hidden rounded-2xl bg-white shadow-sm dark:bg-slate-800"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <img
                    src={photo.image}
                    alt={photo.caption}
                    className="aspect-square w-full object-cover"
                  />
                  <p className="p-3 text-sm text-slate-600 dark:text-slate-400">
                    {photo.caption}
                  </p>
                </motion.div>
              ))}
            </div>
            {member.recentPhotos.length === 0 && (
              <div className="py-12 text-center">
                <span className="text-5xl">📷</span>
                <p className="mt-4 text-slate-500">No photos yet</p>
              </div>
            )}
          </motion.div>
        )}

        {/* Memories Tab */}
        {activeTab === "memories" && (
          <motion.div
            key="memories"
            className="mx-auto mt-6 max-w-sm space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {member.sharedMemories.map((memory, index) => (
              <motion.div
                key={index}
                className="overflow-hidden rounded-2xl bg-white shadow-sm dark:bg-slate-800"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <img
                  src={memory.image}
                  alt={memory.title}
                  className="aspect-video w-full object-cover"
                />
                <div className="p-4">
                  <h3 className="font-semibold text-slate-800 dark:text-white">
                    {memory.title}
                  </h3>
                  <p className="text-sm text-slate-500">{memory.date}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reassurance Footer */}
      <motion.div
        className="mx-auto mt-8 max-w-sm text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="rounded-2xl bg-gradient-to-r from-pink-50 to-purple-50 px-6 py-4 dark:from-pink-900/20 dark:to-purple-900/20">
          <p className="text-lg text-slate-600 dark:text-slate-300">
            {member.name} <span className="font-bold text-pink-600">loves you</span> very much 💜
          </p>
        </div>
      </motion.div>
    </div>
  );
}
