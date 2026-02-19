"use client";

import { Sidebar } from "./sidebar";
import { CommandPalette } from "./command-palette";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-[var(--background)]">
      <CommandPalette />
      <Sidebar />
      <main className="flex-1 overflow-y-auto gradient-bg">
        <div className="mx-auto max-w-6xl px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
