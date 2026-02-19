"use client";

import { motion } from "framer-motion";
import { smoothTransition } from "@/lib/animations";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  delay?: number;
}

export function StatCard({ title, value, subtitle, icon, trend, delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...smoothTransition, delay }}
      whileHover={{ 
        y: -4,
        boxShadow: "0 12px 40px -12px rgba(0,0,0,0.15)",
      }}
      className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow-sm)] transition-colors"
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-[var(--muted-foreground)]">{title}</p>
          <motion.p 
            className="text-3xl font-semibold tracking-tight"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: delay + 0.2, type: "spring", stiffness: 300 }}
          >
            {value}
          </motion.p>
          {subtitle && (
            <p className="text-sm text-[var(--muted-foreground)]">{subtitle}</p>
          )}
          {trend && (
            <motion.p 
              className={`flex items-center gap-1 text-sm ${trend.isPositive ? "text-emerald-500" : "text-rose-500"}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: delay + 0.3 }}
            >
              <motion.span
                initial={{ rotate: trend.isPositive ? 45 : -45 }}
                animate={{ rotate: 0 }}
                transition={{ delay: delay + 0.4, type: "spring" }}
              >
                {trend.isPositive ? (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                  </svg>
                ) : (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 4.5l15 15m0 0V8.25m0 11.25H8.25" />
                  </svg>
                )}
              </motion.span>
              {Math.abs(trend.value)}% from last week
            </motion.p>
          )}
        </div>
        <motion.div 
          className="flex h-12 w-12 items-center justify-center rounded-lg bg-[var(--muted)]"
          whileHover={{ scale: 1.1, rotate: 10 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          {icon}
        </motion.div>
      </div>
    </motion.div>
  );
}

// Skeleton loader for stat cards
export function StatCardSkeleton() {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow-sm)]">
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <div className="h-4 w-24 animate-pulse rounded bg-[var(--muted)]" />
          <div className="h-8 w-16 animate-pulse rounded bg-[var(--muted)]" />
          <div className="h-4 w-32 animate-pulse rounded bg-[var(--muted)]" />
        </div>
        <div className="h-12 w-12 animate-pulse rounded-lg bg-[var(--muted)]" />
      </div>
    </div>
  );
}
