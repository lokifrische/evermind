"use client";

import { motion } from "framer-motion";
import { DashboardLayout, PageWrapper } from "@/components";
import { staggerContainer, staggerItem, smoothTransition } from "@/lib/animations";

const todaySchedule = [
  {
    id: "1",
    time: "9:00 AM",
    title: "Morning Check-in",
    type: "routine",
    description: "Daily wellness check and morning greeting",
    icon: "☀️",
    completed: true,
  },
  {
    id: "2",
    time: "10:00 AM",
    title: "Memory Game",
    type: "activity",
    description: "Family Faces - 10 minutes",
    icon: "🧩",
    completed: true,
  },
  {
    id: "3",
    time: "11:30 AM",
    title: "Photo Memories",
    type: "memory",
    description: "This Day in History slideshow",
    icon: "📸",
    completed: false,
    current: true,
  },
  {
    id: "4",
    time: "3:00 PM",
    title: "Video Call with David",
    type: "call",
    description: "Weekly catch-up call",
    icon: "📹",
    completed: false,
  },
  {
    id: "5",
    time: "5:00 PM",
    title: "Daily Trivia",
    type: "activity",
    description: "Fun family facts quiz",
    icon: "💡",
    completed: false,
  },
  {
    id: "6",
    time: "7:00 PM",
    title: "Evening Wind-down",
    type: "routine",
    description: "Relaxing music and memories",
    icon: "🌙",
    completed: false,
  },
];

const upcomingEvents = [
  {
    id: "1",
    date: "Tomorrow",
    title: "Weekly Family Call",
    time: "2:00 PM",
    type: "call",
    participants: ["Sarah", "David", "Emma", "Jake"],
  },
  {
    id: "2",
    date: "Friday",
    title: "Progress Report Review",
    time: "9:00 AM",
    type: "report",
    participants: ["Sarah"],
  },
  {
    id: "3",
    date: "Saturday",
    title: "Birthday Memory Day",
    time: "10:00 AM",
    type: "special",
    participants: ["All Family"],
  },
];

const typeColors: Record<string, string> = {
  routine: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  activity: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  memory: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  call: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  report: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
  special: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
};

export default function SchedulePage() {
  return (
    <DashboardLayout>
      <PageWrapper>
        {/* Header */}
        <motion.div 
          className="mb-8 flex items-center justify-between"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={smoothTransition}
        >
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Schedule</h1>
            <p className="mt-1 text-[var(--muted-foreground)]">
              Margaret&apos;s daily routine and upcoming events
            </p>
          </div>
          <motion.button 
            className="flex items-center gap-2 rounded-lg bg-[var(--primary)] px-4 py-2.5 text-sm font-medium text-white"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add Event
          </motion.button>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Today's Schedule */}
          <div className="lg:col-span-2">
            <motion.div 
              className="rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-[var(--shadow-sm)] overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={smoothTransition}
            >
              <div className="border-b border-[var(--border)] bg-gradient-to-r from-indigo-50 to-purple-50 px-6 py-4 dark:from-indigo-950/30 dark:to-purple-950/30">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold">Today&apos;s Schedule</h2>
                    <p className="text-sm text-[var(--muted-foreground)]">Wednesday, February 19</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      2 completed
                    </span>
                    <span className="text-[var(--muted-foreground)]">•</span>
                    <span className="text-[var(--muted-foreground)]">4 remaining</span>
                  </div>
                </div>
              </div>
              
              <motion.div 
                className="divide-y divide-[var(--border)]"
                variants={staggerContainer}
                initial="initial"
                animate="animate"
              >
                {todaySchedule.map((item, index) => (
                  <motion.div 
                    key={item.id}
                    variants={staggerItem}
                    transition={{ ...smoothTransition, delay: index * 0.05 }}
                    className={`flex items-center gap-4 px-6 py-4 transition-colors ${
                      item.current 
                        ? "bg-indigo-50/50 dark:bg-indigo-950/20" 
                        : "hover:bg-[var(--muted)]/50"
                    }`}
                  >
                    {/* Time */}
                    <div className="w-20 flex-shrink-0">
                      <span className={`text-sm font-medium ${
                        item.completed 
                          ? "text-[var(--muted-foreground)] line-through" 
                          : item.current 
                            ? "text-indigo-600 dark:text-indigo-400"
                            : ""
                      }`}>
                        {item.time}
                      </span>
                    </div>

                    {/* Timeline dot */}
                    <div className="relative flex flex-col items-center">
                      <motion.div 
                        className={`h-4 w-4 rounded-full border-2 ${
                          item.completed 
                            ? "border-emerald-500 bg-emerald-500" 
                            : item.current
                              ? "border-indigo-500 bg-indigo-500"
                              : "border-[var(--border)] bg-[var(--card)]"
                        }`}
                        initial={item.current ? { scale: 1 } : {}}
                        animate={item.current ? { scale: [1, 1.2, 1] } : {}}
                        transition={item.current ? { duration: 2, repeat: Infinity } : {}}
                      >
                        {item.completed && (
                          <svg className="h-3 w-3 text-white m-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                        )}
                      </motion.div>
                    </div>

                    {/* Icon */}
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--muted)] text-xl">
                      {item.icon}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className={`font-medium ${item.completed ? "text-[var(--muted-foreground)] line-through" : ""}`}>
                          {item.title}
                        </h3>
                        {item.current && (
                          <span className="rounded-full bg-indigo-500 px-2 py-0.5 text-xs font-medium text-white">
                            Now
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-[var(--muted-foreground)] truncate">{item.description}</p>
                    </div>

                    {/* Type badge */}
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${typeColors[item.type]}`}>
                      {item.type}
                    </span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Quick Add */}
            <motion.div 
              className="mt-4 rounded-xl border border-dashed border-[var(--border)] bg-[var(--muted)]/30 p-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--primary)]">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">Add to Schedule</h3>
                  <p className="text-sm text-[var(--muted-foreground)]">
                    Schedule a call, activity, or reminder for Margaret
                  </p>
                </div>
                <button className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-sm font-medium transition-colors hover:bg-[var(--muted)]">
                  Add Event
                </button>
              </div>
            </motion.div>
          </div>

          {/* Upcoming Events */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...smoothTransition, delay: 0.2 }}
          >
            <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-[var(--shadow-sm)] overflow-hidden">
              <div className="border-b border-[var(--border)] px-6 py-4">
                <h2 className="text-lg font-semibold">Upcoming</h2>
              </div>
              <div className="divide-y divide-[var(--border)]">
                {upcomingEvents.map((event) => (
                  <motion.div 
                    key={event.id}
                    className="px-6 py-4 hover:bg-[var(--muted)]/50 transition-colors cursor-pointer"
                    whileHover={{ x: 4 }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-[var(--primary)]">{event.date}</span>
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${typeColors[event.type]}`}>
                        {event.type}
                      </span>
                    </div>
                    <h3 className="font-medium">{event.title}</h3>
                    <p className="text-sm text-[var(--muted-foreground)]">{event.time}</p>
                    <div className="mt-2 flex items-center gap-1">
                      {event.participants.slice(0, 3).map((p, i) => (
                        <span 
                          key={i}
                          className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 text-xs font-medium text-white"
                          style={{ marginLeft: i > 0 ? -8 : 0 }}
                        >
                          {p[0]}
                        </span>
                      ))}
                      {event.participants.length > 3 && (
                        <span className="ml-1 text-xs text-[var(--muted-foreground)]">
                          +{event.participants.length - 3} more
                        </span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Routine Templates */}
            <div className="mt-4 rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-[var(--shadow-sm)]">
              <h3 className="mb-3 font-semibold">Routine Templates</h3>
              <div className="space-y-2">
                <motion.button 
                  className="flex w-full items-center gap-3 rounded-lg bg-[var(--muted)] p-3 text-left transition-colors hover:bg-[var(--muted)]/80"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="text-xl">🌅</span>
                  <div>
                    <p className="font-medium text-sm">Morning Routine</p>
                    <p className="text-xs text-[var(--muted-foreground)]">5 activities</p>
                  </div>
                </motion.button>
                <motion.button 
                  className="flex w-full items-center gap-3 rounded-lg bg-[var(--muted)] p-3 text-left transition-colors hover:bg-[var(--muted)]/80"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="text-xl">🌙</span>
                  <div>
                    <p className="font-medium text-sm">Evening Wind-down</p>
                    <p className="text-xs text-[var(--muted-foreground)]">3 activities</p>
                  </div>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </PageWrapper>
    </DashboardLayout>
  );
}
