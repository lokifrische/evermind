"use client";

import { motion } from "framer-motion";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <motion.div
      className={`animate-pulse rounded bg-[var(--muted)] ${className}`}
      initial={{ opacity: 0.5 }}
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity }}
    />
  );
}

export function QuickActionsSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="flex flex-col items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--card)] p-6"
        >
          <Skeleton className="h-14 w-14 rounded-xl" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-3 w-28" />
        </div>
      ))}
    </div>
  );
}

export function StatGridSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6"
        >
          <div className="flex items-start justify-between">
            <div className="space-y-3">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-4 w-32" />
            </div>
            <Skeleton className="h-12 w-12 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ActivityFeedSkeleton() {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card)]">
      <div className="border-b border-[var(--border)] px-6 py-4">
        <Skeleton className="h-6 w-32" />
      </div>
      <div className="divide-y divide-[var(--border)]">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-start gap-4 px-6 py-4">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-48" />
            </div>
            <Skeleton className="h-3 w-20" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function MemoryGridSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)]"
        >
          <Skeleton className="aspect-[4/3] w-full" />
          <div className="p-4 space-y-3">
            <Skeleton className="h-5 w-32" />
            <div className="flex justify-between">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function FamilyMembersSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 rounded-xl border border-[var(--border)] bg-[var(--card)] p-4"
        >
          <Skeleton className="h-14 w-14 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-3 w-32" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-9 w-9 rounded-lg" />
            <Skeleton className="h-9 w-9 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}
