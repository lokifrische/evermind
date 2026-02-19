"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Link from "next/link";

// Contacts for calling
const contacts = [
  {
    id: "sarah",
    name: "Sarah",
    relationship: "Your Daughter",
    photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
    autoAnswer: true,
  },
  {
    id: "david",
    name: "David",
    relationship: "Your Son",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    autoAnswer: false,
  },
  {
    id: "emma",
    name: "Emma",
    relationship: "Granddaughter",
    photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop",
    autoAnswer: false,
  },
  {
    id: "tommy",
    name: "Tommy",
    relationship: "Grandson",
    photo: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=400&fit=crop",
    autoAnswer: false,
  },
];

type CallState = "idle" | "calling" | "connected" | "ended";

export default function CallPage() {
  const [callState, setCallState] = useState<CallState>("idle");
  const [selectedContact, setSelectedContact] = useState<typeof contacts[0] | null>(null);

  // Start call
  const startCall = (contact: typeof contacts[0]) => {
    setSelectedContact(contact);
    setCallState("calling");
    
    // Simulate connection
    setTimeout(() => {
      setCallState("connected");
    }, 3000);
  };

  // End call
  const endCall = () => {
    setCallState("ended");
    setTimeout(() => {
      setCallState("idle");
      setSelectedContact(null);
    }, 2000);
  };

  return (
    <div className="min-h-screen px-6 py-8 pt-20">
      <AnimatePresence mode="wait">
        {/* Contact Selection */}
        {callState === "idle" && (
          <motion.div
            key="select"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <header className="text-center">
              <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
                📞 Call Someone
              </h1>
              <p className="mt-2 text-slate-600 dark:text-slate-400">
                Tap on their face to call
              </p>
            </header>

            {/* Contact Grid */}
            <div className="mx-auto mt-8 grid max-w-sm grid-cols-2 gap-4">
              {contacts.map((contact, index) => (
                <motion.button
                  key={contact.id}
                  onClick={() => startCall(contact)}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  className="group relative overflow-hidden rounded-3xl bg-white shadow-xl dark:bg-slate-800"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="aspect-square">
                    <img
                      src={contact.photo}
                      alt={contact.name}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-emerald-500/0 transition-colors group-hover:bg-emerald-500/40">
                      <motion.div
                        className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500 text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100"
                        whileHover={{ scale: 1.1 }}
                      >
                        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                        </svg>
                      </motion.div>
                    </div>
                  </div>
                  <div className="p-4 text-center">
                    <p className="text-xl font-bold text-slate-800 dark:text-white">
                      {contact.name}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {contact.relationship}
                    </p>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Calling State */}
        {callState === "calling" && selectedContact && (
          <motion.div
            key="calling"
            className="flex flex-col items-center justify-center py-12"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            {/* Photo with rings */}
            <div className="relative">
              <motion.div
                className="absolute inset-0 rounded-full border-4 border-emerald-400"
                animate={{ scale: [1, 1.4], opacity: [0.8, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <motion.div
                className="absolute inset-0 rounded-full border-4 border-emerald-400"
                animate={{ scale: [1, 1.4], opacity: [0.8, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
              />
              <img
                src={selectedContact.photo}
                alt={selectedContact.name}
                className="h-48 w-48 rounded-full object-cover shadow-2xl"
              />
            </div>

            <h2 className="mt-8 text-3xl font-bold text-slate-800 dark:text-white">
              Calling {selectedContact.name}...
            </h2>
            <p className="mt-2 text-slate-600 dark:text-slate-400">
              Please wait while we connect you
            </p>

            {/* End Call Button */}
            <motion.button
              onClick={endCall}
              className="mt-12 flex h-20 w-20 items-center justify-center rounded-full bg-red-500 shadow-xl shadow-red-500/40"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <svg className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 3.75L18 6m0 0l2.25 2.25M18 6l2.25-2.25M18 6l-2.25 2.25m1.5 13.5c-8.284 0-15-6.716-15-15V4.5A2.25 2.25 0 014.5 2.25h1.372c.516 0 .966.351 1.091.852l1.106 4.423c.11.44-.054.902-.417 1.173l-1.293.97a1.062 1.062 0 00-.38 1.21 12.035 12.035 0 007.143 7.143c.441.162.928-.004 1.21-.38l.97-1.293a1.125 1.125 0 011.173-.417l4.423 1.106c.5.125.852.575.852 1.091V19.5a2.25 2.25 0 01-2.25 2.25h-2.25z" />
              </svg>
            </motion.button>
          </motion.div>
        )}

        {/* Connected State */}
        {callState === "connected" && selectedContact && (
          <motion.div
            key="connected"
            className="fixed inset-0 z-50 bg-slate-900"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Video (simulated) */}
            <img
              src={selectedContact.photo}
              alt={selectedContact.name}
              className="h-full w-full object-cover"
            />
            
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />

            {/* Connected indicator */}
            <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-emerald-500 px-3 py-1 text-sm text-white">
              <div className="h-2 w-2 animate-pulse rounded-full bg-white" />
              Connected
            </div>

            {/* Name */}
            <div className="absolute bottom-32 left-0 right-0 text-center">
              <h2 className="text-3xl font-bold text-white">
                {selectedContact.name}
              </h2>
              <p className="text-white/70">{selectedContact.relationship}</p>
            </div>

            {/* End Call Button */}
            <div className="absolute bottom-8 left-0 right-0 flex justify-center">
              <motion.button
                onClick={endCall}
                className="flex h-20 w-20 items-center justify-center rounded-full bg-red-500 shadow-2xl"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 3.75L18 6m0 0l2.25 2.25M18 6l2.25-2.25M18 6l-2.25 2.25m1.5 13.5c-8.284 0-15-6.716-15-15V4.5A2.25 2.25 0 014.5 2.25h1.372c.516 0 .966.351 1.091.852l1.106 4.423c.11.44-.054.902-.417 1.173l-1.293.97a1.062 1.062 0 00-.38 1.21 12.035 12.035 0 007.143 7.143c.441.162.928-.004 1.21-.38l.97-1.293a1.125 1.125 0 011.173-.417l4.423 1.106c.5.125.852.575.852 1.091V19.5a2.25 2.25 0 01-2.25 2.25h-2.25z" />
                </svg>
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Call Ended */}
        {callState === "ended" && selectedContact && (
          <motion.div
            key="ended"
            className="flex flex-col items-center justify-center py-12"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <img
              src={selectedContact.photo}
              alt={selectedContact.name}
              className="h-32 w-32 rounded-full object-cover shadow-xl grayscale"
            />
            <h2 className="mt-6 text-2xl font-bold text-slate-800 dark:text-white">
              Call Ended
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              with {selectedContact.name}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Back to Family */}
      {callState === "idle" && (
        <motion.div
          className="mx-auto mt-8 max-w-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Link href="/patient/family">
            <motion.button
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white py-4 text-slate-700 shadow-sm dark:bg-slate-800 dark:text-slate-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
              Back to Family
            </motion.button>
          </Link>
        </motion.div>
      )}
    </div>
  );
}
