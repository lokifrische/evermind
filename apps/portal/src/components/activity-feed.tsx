"use client";

import { motion } from "framer-motion";
import { staggerContainer, staggerItem, smoothTransition } from "@/lib/animations";

interface Activity {
  id: string;
  type: "memory" | "call" | "game" | "message";
  title: string;
  description: string;
  time: string;
  user?: string;
}

const mockActivities: Activity[] = [
  {
    id: "1",
    type: "memory",
    title: "New memory added",
    description: "Sarah added 3 photos from 'Christmas 2024'",
    time: "10 minutes ago",
    user: "Sarah",
  },
  {
    id: "2",
    type: "call",
    title: "Video call completed",
    description: "Mom had a 15-minute call with David",
    time: "1 hour ago",
    user: "David",
  },
  {
    id: "3",
    type: "game",
    title: "Activity completed",
    description: "Completed 'Family Faces' game with 92% accuracy",
    time: "2 hours ago",
  },
  {
    id: "4",
    type: "message",
    title: "Voice message received",
    description: "New message from grandkids",
    time: "3 hours ago",
    user: "Emma & Jake",
  },
  {
    id: "5",
    type: "memory",
    title: "Memory viewed",
    description: "Watched 'Wedding Anniversary' slideshow",
    time: "5 hours ago",
  },
];

const activityIcons: Record<Activity["type"], React.ReactNode> = {
  memory: (
    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
      </svg>
    </div>
  ),
  call: (
    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
      </svg>
    </div>
  ),
  game: (
    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 6.087c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.036-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959v0a.64.64 0 01-.657.643 48.39 48.39 0 01-4.163-.3c.186 1.613.293 3.25.315 4.907a.656.656 0 01-.658.663v0c-.355 0-.676-.186-.959-.401a1.647 1.647 0 00-1.003-.349c-1.036 0-1.875 1.007-1.875 2.25s.84 2.25 1.875 2.25c.369 0 .713-.128 1.003-.349.283-.215.604-.401.959-.401v0c.31 0 .555.26.532.57a48.039 48.039 0 01-.642 5.056c1.518.19 3.058.309 4.616.354a.64.64 0 00.657-.643v0c0-.355-.186-.676-.401-.959a1.647 1.647 0 01-.349-1.003c0-1.035 1.008-1.875 2.25-1.875 1.243 0 2.25.84 2.25 1.875 0 .369-.128.713-.349 1.003-.215.283-.4.604-.4.959v0c0 .333.277.599.61.58a48.1 48.1 0 005.427-.63 48.05 48.05 0 00.582-4.717.532.532 0 00-.533-.57v0c-.355 0-.676.186-.959.401-.29.221-.634.349-1.003.349-1.035 0-1.875-1.007-1.875-2.25s.84-2.25 1.875-2.25c.37 0 .713.128 1.003.349.283.215.604.401.959.401v0a.656.656 0 00.659-.663 47.703 47.703 0 00-.31-4.82 47.642 47.642 0 01-4.163.3.64.64 0 01-.657-.643v0z" />
      </svg>
    </div>
  ),
  message: (
    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
      </svg>
    </div>
  ),
};

export function ActivityFeed() {
  return (
    <motion.div 
      className="rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-[var(--shadow-sm)] overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={smoothTransition}
    >
      <div className="border-b border-[var(--border)] px-6 py-4">
        <h3 className="text-lg font-semibold">Recent Activity</h3>
      </div>
      <motion.div 
        className="divide-y divide-[var(--border)]"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        {mockActivities.map((activity, index) => (
          <motion.div 
            key={activity.id} 
            className="flex items-start gap-4 px-6 py-4 transition-colors hover:bg-[var(--muted)]/50 cursor-pointer"
            variants={staggerItem}
            transition={{ ...smoothTransition, delay: index * 0.05 }}
            whileHover={{ x: 4 }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.05 + 0.2, type: "spring", stiffness: 400 }}
            >
              {activityIcons[activity.type]}
            </motion.div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">{activity.title}</p>
              <p className="text-sm text-[var(--muted-foreground)] truncate">{activity.description}</p>
            </div>
            <span className="text-xs text-[var(--muted-foreground)] whitespace-nowrap">{activity.time}</span>
          </motion.div>
        ))}
      </motion.div>
      <motion.div 
        className="border-t border-[var(--border)] px-6 py-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <motion.button 
          className="text-sm font-medium text-[var(--primary)] hover:underline"
          whileHover={{ x: 4 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          View all activity →
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
