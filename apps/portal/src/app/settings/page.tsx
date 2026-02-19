"use client";

import { motion } from "framer-motion";
import { DashboardLayout, PageWrapper } from "@/components";
import { smoothTransition } from "@/lib/animations";

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <PageWrapper>
        {/* Header */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={smoothTransition}
        >
          <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
          <p className="mt-1 text-[var(--muted-foreground)]">
            Manage Margaret&apos;s experience and preferences
          </p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Section */}
            <motion.div 
              className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow-sm)]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={smoothTransition}
            >
              <h2 className="mb-4 text-lg font-semibold">Profile</h2>
              <div className="flex items-start gap-6">
                <div className="relative">
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-purple-400 to-indigo-600 text-3xl font-semibold text-white">
                    MG
                  </div>
                  <button className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-[var(--primary)] text-white shadow-lg transition-transform hover:scale-110">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                    </svg>
                  </button>
                </div>
                <div className="flex-1 space-y-4">
                  <div>
                    <label className="text-sm font-medium text-[var(--muted-foreground)]">Name</label>
                    <input 
                      type="text" 
                      defaultValue="Margaret" 
                      className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm focus:border-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-[var(--muted-foreground)]">Nickname</label>
                    <input 
                      type="text" 
                      defaultValue="Mom / Grandma" 
                      className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm focus:border-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Accessibility */}
            <motion.div 
              className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow-sm)]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...smoothTransition, delay: 0.1 }}
            >
              <h2 className="mb-4 text-lg font-semibold">Accessibility</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Large Text</p>
                    <p className="text-sm text-[var(--muted-foreground)]">Increase text size throughout the app</p>
                  </div>
                  <button className="relative h-6 w-11 rounded-full bg-[var(--primary)] transition-colors">
                    <span className="absolute right-1 top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-all" />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">High Contrast</p>
                    <p className="text-sm text-[var(--muted-foreground)]">Increase color contrast for better visibility</p>
                  </div>
                  <button className="relative h-6 w-11 rounded-full bg-[var(--muted)] transition-colors">
                    <span className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-all" />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Voice Navigation</p>
                    <p className="text-sm text-[var(--muted-foreground)]">Enable voice commands and responses</p>
                  </div>
                  <button className="relative h-6 w-11 rounded-full bg-[var(--primary)] transition-colors">
                    <span className="absolute right-1 top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-all" />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Reduce Motion</p>
                    <p className="text-sm text-[var(--muted-foreground)]">Minimize animations and transitions</p>
                  </div>
                  <button className="relative h-6 w-11 rounded-full bg-[var(--muted)] transition-colors">
                    <span className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-all" />
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Notifications */}
            <motion.div 
              className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow-sm)]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...smoothTransition, delay: 0.2 }}
            >
              <h2 className="mb-4 text-lg font-semibold">Notifications</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Activity Alerts</p>
                    <p className="text-sm text-[var(--muted-foreground)]">Get notified when activities are completed</p>
                  </div>
                  <button className="relative h-6 w-11 rounded-full bg-[var(--primary)] transition-colors">
                    <span className="absolute right-1 top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-all" />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Call Reminders</p>
                    <p className="text-sm text-[var(--muted-foreground)]">Remind caregivers of scheduled calls</p>
                  </div>
                  <button className="relative h-6 w-11 rounded-full bg-[var(--primary)] transition-colors">
                    <span className="absolute right-1 top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-all" />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Weekly Reports</p>
                    <p className="text-sm text-[var(--muted-foreground)]">Email summary every Sunday</p>
                  </div>
                  <button className="relative h-6 w-11 rounded-full bg-[var(--primary)] transition-colors">
                    <span className="absolute right-1 top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-all" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...smoothTransition, delay: 0.2 }}
          >
            {/* Care Team */}
            <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow-sm)]">
              <h3 className="mb-4 font-semibold">Care Team</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
                    alt="Sarah"
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-medium">Sarah</p>
                    <p className="text-xs text-[var(--muted-foreground)]">Primary Caregiver</p>
                  </div>
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                    Admin
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"
                    alt="David"
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-medium">David</p>
                    <p className="text-xs text-[var(--muted-foreground)]">Family Member</p>
                  </div>
                  <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                    Member
                  </span>
                </div>
              </div>
              <button className="mt-4 w-full rounded-lg border border-[var(--border)] py-2 text-sm font-medium transition-colors hover:bg-[var(--muted)]">
                Manage Team
              </button>
            </div>

            {/* Subscription */}
            <div className="rounded-xl border border-[var(--border)] bg-gradient-to-br from-indigo-50 to-purple-50 p-6 dark:from-indigo-950/30 dark:to-purple-950/30">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-indigo-900 dark:text-indigo-100">Family Plan</h3>
                  <p className="text-sm text-indigo-700 dark:text-indigo-300">$14.99/month</p>
                </div>
              </div>
              <ul className="space-y-2 text-sm text-indigo-800 dark:text-indigo-200">
                <li className="flex items-center gap-2">
                  <svg className="h-4 w-4 text-emerald-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  Unlimited memories
                </li>
                <li className="flex items-center gap-2">
                  <svg className="h-4 w-4 text-emerald-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  Video calling
                </li>
                <li className="flex items-center gap-2">
                  <svg className="h-4 w-4 text-emerald-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  AI companion
                </li>
                <li className="flex items-center gap-2">
                  <svg className="h-4 w-4 text-emerald-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  5 family members
                </li>
              </ul>
              <button className="mt-4 w-full rounded-lg bg-indigo-600 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700">
                Manage Subscription
              </button>
            </div>

            {/* Danger Zone */}
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-6 dark:border-rose-900 dark:bg-rose-950/30">
              <h3 className="mb-2 font-semibold text-rose-900 dark:text-rose-100">Danger Zone</h3>
              <p className="mb-4 text-sm text-rose-700 dark:text-rose-300">
                Irreversible actions that affect all data
              </p>
              <button className="w-full rounded-lg border border-rose-300 bg-white py-2 text-sm font-medium text-rose-700 transition-colors hover:bg-rose-100 dark:border-rose-800 dark:bg-rose-950 dark:text-rose-300 dark:hover:bg-rose-900">
                Delete Account
              </button>
            </div>
          </motion.div>
        </div>
      </PageWrapper>
    </DashboardLayout>
  );
}
