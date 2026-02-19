"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { staggerContainer, staggerItem, smoothTransition } from "@/lib/animations";

const actions = [
  {
    name: "Add Memory",
    description: "Upload photos or stories",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
      </svg>
    ),
    color: "from-purple-500 to-indigo-600",
    href: "/memories",
  },
  {
    name: "View Family",
    description: "See family members",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
      </svg>
    ),
    color: "from-emerald-500 to-teal-600",
    href: "/family",
  },
  {
    name: "Schedule",
    description: "Manage routines & visits",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
      </svg>
    ),
    color: "from-blue-500 to-cyan-600",
    href: "/schedule",
  },
  {
    name: "Activities",
    description: "Games & brain exercises",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 6.087c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.036-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959v0a.64.64 0 01-.657.643 48.39 48.39 0 01-4.163-.3c.186 1.613.293 3.25.315 4.907a.656.656 0 01-.658.663v0c-.355 0-.676-.186-.959-.401a1.647 1.647 0 00-1.003-.349c-1.036 0-1.875 1.007-1.875 2.25s.84 2.25 1.875 2.25c.369 0 .713-.128 1.003-.349.283-.215.604-.401.959-.401v0c.31 0 .555.26.532.57a48.039 48.039 0 01-.642 5.056c1.518.19 3.058.309 4.616.354a.64.64 0 00.657-.643v0c0-.355-.186-.676-.401-.959a1.647 1.647 0 01-.349-1.003c0-1.035 1.008-1.875 2.25-1.875 1.243 0 2.25.84 2.25 1.875 0 .369-.128.713-.349 1.003-.215.283-.4.604-.4.959v0c0 .333.277.599.61.58a48.1 48.1 0 005.427-.63 48.05 48.05 0 00.582-4.717.532.532 0 00-.533-.57v0c-.355 0-.676.186-.959.401-.29.221-.634.349-1.003.349-1.035 0-1.875-1.007-1.875-2.25s.84-2.25 1.875-2.25c.37 0 .713.128 1.003.349.283.215.604.401.959.401v0a.656.656 0 00.659-.663 47.703 47.703 0 00-.31-4.82 47.642 47.642 0 01-4.163.3.64.64 0 01-.657-.643v0z" />
      </svg>
    ),
    color: "from-amber-500 to-orange-600",
    href: "/activities",
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
