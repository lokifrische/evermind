"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { staggerContainer, staggerItem, smoothTransition } from "@/lib/animations";

const actions = [
  {
    name: "Add Memory",
    description: "Upload photos or create a story",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
      </svg>
    ),
    color: "from-purple-500 to-indigo-600",
    href: "/memories/new",
  },
  {
    name: "Start Video Call",
    description: "Connect with your loved one",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
      </svg>
    ),
    color: "from-emerald-500 to-teal-600",
    href: "/family/call",
  },
  {
    name: "Send Message",
    description: "Record a voice or video message",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
      </svg>
    ),
    color: "from-blue-500 to-cyan-600",
    href: "/family/message",
  },
  {
    name: "Invite Family",
    description: "Share a link to contribute",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
      </svg>
    ),
    color: "from-amber-500 to-orange-600",
    href: "/family/invite",
  },
];

export function QuickActions() {
  return (
    <motion.div 
      className="grid grid-cols-2 gap-4 md:grid-cols-4"
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      {actions.map((action) => (
        <motion.div
          key={action.name}
          variants={staggerItem}
          transition={smoothTransition}
        >
          <Link href={action.href}>
            <motion.div
              className="group flex flex-col items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 text-center shadow-[var(--shadow-sm)] cursor-pointer"
              whileHover={{ 
                scale: 1.03,
                boxShadow: "0 10px 40px -10px rgba(0,0,0,0.15)",
                borderColor: "rgba(99, 102, 241, 0.3)",
              }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <motion.div 
                className={`flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${action.color} text-white shadow-lg`}
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              >
                {action.icon}
              </motion.div>
              <div>
                <p className="font-medium">{action.name}</p>
                <p className="mt-1 text-xs text-[var(--muted-foreground)]">{action.description}</p>
              </div>
            </motion.div>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
}
