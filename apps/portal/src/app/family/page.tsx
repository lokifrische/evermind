import { DashboardLayout } from "@/components";

const familyMembers = [
  {
    id: "1",
    name: "Sarah",
    relationship: "Daughter",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
    lastContact: "2 hours ago",
    status: "online",
    isPrimary: true,
  },
  {
    id: "2",
    name: "David",
    relationship: "Son",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
    lastContact: "Yesterday",
    status: "offline",
    isPrimary: false,
  },
  {
    id: "3",
    name: "Emma",
    relationship: "Granddaughter",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop",
    lastContact: "3 days ago",
    status: "offline",
    isPrimary: false,
  },
  {
    id: "4",
    name: "Jake",
    relationship: "Grandson",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&h=200&fit=crop",
    lastContact: "1 week ago",
    status: "offline",
    isPrimary: false,
  },
];

const recentMessages = [
  {
    id: "1",
    from: "Emma & Jake",
    type: "voice",
    preview: "Hi Grandma! We miss you...",
    time: "3 hours ago",
    listened: false,
  },
  {
    id: "2",
    from: "David",
    type: "video",
    preview: "Quick hello from the office",
    time: "Yesterday",
    listened: true,
  },
  {
    id: "3",
    from: "Sarah",
    type: "voice",
    preview: "Reminder about Sunday dinner",
    time: "2 days ago",
    listened: true,
  },
];

export default function FamilyPage() {
  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Family</h1>
          <p className="mt-1 text-[var(--muted-foreground)]">
            Keep Margaret connected with loved ones
          </p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--card)] px-4 py-2.5 text-sm font-medium transition-colors hover:bg-[var(--muted)]">
            <svg className="h-5 w-5 text-[var(--muted-foreground)]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
            </svg>
            Invite Family
          </button>
          <button className="flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-600">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
            </svg>
            Start Call
          </button>
        </div>
      </div>

      {/* Two column layout */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Family Members */}
        <div className="lg:col-span-2">
          <h2 className="mb-4 text-lg font-semibold">Family Circle</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {familyMembers.map((member) => (
              <div
                key={member.id}
                className="flex items-center gap-4 rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-[var(--shadow-sm)] transition-all hover:shadow-[var(--shadow)] hover:border-[var(--primary)]/30"
              >
                <div className="relative">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="h-14 w-14 rounded-full object-cover"
                  />
                  <span
                    className={`absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-[var(--card)] ${
                      member.status === "online" ? "bg-emerald-500" : "bg-zinc-300 dark:bg-zinc-600"
                    }`}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{member.name}</h3>
                    {member.isPrimary && (
                      <span className="rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                        Primary
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-[var(--muted-foreground)]">{member.relationship}</p>
                  <p className="text-xs text-[var(--muted-foreground)]">
                    Last contact: {member.lastContact}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--muted)] text-[var(--muted-foreground)] transition-colors hover:bg-emerald-100 hover:text-emerald-600 dark:hover:bg-emerald-900/30 dark:hover:text-emerald-400">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
                    </svg>
                  </button>
                  <button className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--muted)] text-[var(--muted-foreground)] transition-colors hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-blue-900/30 dark:hover:text-blue-400">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Scheduled Calls */}
          <h2 className="mb-4 mt-8 text-lg font-semibold">Scheduled Calls</h2>
          <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-[var(--shadow-sm)]">
            <div className="flex items-center gap-4 border-b border-[var(--border)] px-6 py-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Call with David</h3>
                <p className="text-sm text-[var(--muted-foreground)]">Today at 3:00 PM</p>
              </div>
              <button className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-600">
                Join Now
              </button>
            </div>
            <div className="flex items-center gap-4 px-6 py-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[var(--muted)] text-[var(--muted-foreground)]">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Weekly Family Call</h3>
                <p className="text-sm text-[var(--muted-foreground)]">Sunday at 2:00 PM</p>
              </div>
              <span className="text-sm text-[var(--muted-foreground)]">In 4 days</span>
            </div>
          </div>
        </div>

        {/* Messages Sidebar */}
        <div>
          <h2 className="mb-4 text-lg font-semibold">Recent Messages</h2>
          <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-[var(--shadow-sm)]">
            <div className="divide-y divide-[var(--border)]">
              {recentMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start gap-3 px-4 py-4 transition-colors hover:bg-[var(--muted)]/50 ${
                    !message.listened ? "bg-blue-50/50 dark:bg-blue-950/20" : ""
                  }`}
                >
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                    message.type === "voice"
                      ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                      : "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
                  }`}>
                    {message.type === "voice" ? (
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{message.from}</p>
                      {!message.listened && (
                        <span className="h-2 w-2 rounded-full bg-blue-500" />
                      )}
                    </div>
                    <p className="text-sm text-[var(--muted-foreground)] truncate">{message.preview}</p>
                    <p className="text-xs text-[var(--muted-foreground)]">{message.time}</p>
                  </div>
                  <button className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--primary)] text-white transition-colors hover:bg-[var(--primary)]/90">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
            <div className="border-t border-[var(--border)] px-4 py-3">
              <button className="text-sm font-medium text-[var(--primary)] hover:underline">
                View all messages →
              </button>
            </div>
          </div>

          {/* Record Message */}
          <div className="mt-4 rounded-xl border border-dashed border-[var(--border)] bg-[var(--muted)]/30 p-6 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--primary)]">
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
              </svg>
            </div>
            <p className="mt-3 font-medium">Record a Message</p>
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
              Send a voice or video message to Margaret
            </p>
            <button className="mt-4 rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--primary)]/90">
              Start Recording
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
