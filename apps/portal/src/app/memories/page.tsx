import { DashboardLayout } from "@/components";

const memories = [
  {
    id: "1",
    title: "Christmas 2024",
    type: "album",
    thumbnail: "https://images.unsplash.com/photo-1482517967863-00e15c9b44be?w=400&h=300&fit=crop",
    itemCount: 24,
    lastViewed: "2 days ago",
  },
  {
    id: "2",
    title: "Wedding Anniversary",
    type: "story",
    thumbnail: "https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=300&fit=crop",
    itemCount: 12,
    lastViewed: "5 days ago",
  },
  {
    id: "3",
    title: "Grandkids Visit",
    type: "album",
    thumbnail: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=400&h=300&fit=crop",
    itemCount: 18,
    lastViewed: "1 week ago",
  },
  {
    id: "4",
    title: "Family Vacation 2023",
    type: "album",
    thumbnail: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop",
    itemCount: 45,
    lastViewed: "2 weeks ago",
  },
  {
    id: "5",
    title: "Our First Home",
    type: "story",
    thumbnail: "https://images.unsplash.com/photo-1449844908441-8829872d2607?w=400&h=300&fit=crop",
    itemCount: 8,
    lastViewed: "3 weeks ago",
  },
  {
    id: "6",
    title: "Birthday Celebrations",
    type: "album",
    thumbnail: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=400&h=300&fit=crop",
    itemCount: 32,
    lastViewed: "1 month ago",
  },
];

export default function MemoriesPage() {
  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Memories</h1>
          <p className="mt-1 text-[var(--muted-foreground)]">
            Stories and photo collections for Margaret
          </p>
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-[var(--primary)] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[var(--primary)]/90">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Memory
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6 flex items-center gap-2">
        <button className="rounded-lg bg-[var(--primary)] px-3 py-1.5 text-sm font-medium text-white">
          All
        </button>
        <button className="rounded-lg bg-[var(--muted)] px-3 py-1.5 text-sm font-medium text-[var(--muted-foreground)] hover:bg-[var(--muted)]/80">
          Albums
        </button>
        <button className="rounded-lg bg-[var(--muted)] px-3 py-1.5 text-sm font-medium text-[var(--muted-foreground)] hover:bg-[var(--muted)]/80">
          Stories
        </button>
        <button className="rounded-lg bg-[var(--muted)] px-3 py-1.5 text-sm font-medium text-[var(--muted-foreground)] hover:bg-[var(--muted)]/80">
          Favorites
        </button>
      </div>

      {/* Memory Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {memories.map((memory) => (
          <a
            key={memory.id}
            href={`/memories/${memory.id}`}
            className="group overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-[var(--shadow-sm)] transition-all hover:shadow-[var(--shadow-md)] hover:border-[var(--primary)]/30"
          >
            {/* Thumbnail */}
            <div className="relative aspect-[4/3] overflow-hidden">
              <img
                src={memory.thumbnail}
                alt={memory.title}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 right-3">
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  memory.type === "story"
                    ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
                    : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                }`}>
                  {memory.type === "story" ? (
                    <svg className="mr-1 h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                    </svg>
                  ) : (
                    <svg className="mr-1 h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                    </svg>
                  )}
                  {memory.type}
                </span>
              </div>
            </div>
            
            {/* Content */}
            <div className="p-4">
              <h3 className="font-semibold">{memory.title}</h3>
              <div className="mt-2 flex items-center justify-between text-sm text-[var(--muted-foreground)]">
                <span>{memory.itemCount} {memory.type === "story" ? "pages" : "photos"}</span>
                <span>Viewed {memory.lastViewed}</span>
              </div>
            </div>
          </a>
        ))}
      </div>

      {/* This Day Section */}
      <section className="mt-12">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-orange-500">
            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold">This Day in History</h2>
            <p className="text-sm text-[var(--muted-foreground)]">February 19th memories</p>
          </div>
        </div>
        
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 dark:border-amber-900/50 dark:bg-amber-950/30">
          <div className="flex items-center gap-4">
            <img
              src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=200&h=200&fit=crop"
              alt="This day memory"
              className="h-20 w-20 rounded-lg object-cover"
            />
            <div>
              <p className="text-sm font-medium text-amber-900 dark:text-amber-100">5 years ago</p>
              <h3 className="text-lg font-semibold text-amber-950 dark:text-amber-50">Family Reunion 2021</h3>
              <p className="mt-1 text-sm text-amber-700 dark:text-amber-300">
                The whole family gathered at Grandma&apos;s house for the annual reunion
              </p>
            </div>
            <button className="ml-auto flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-amber-600">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
              </svg>
              Play for Margaret
            </button>
          </div>
        </div>
      </section>
    </DashboardLayout>
  );
}
