# Evermind Portal

Caregiver dashboard for the Evermind cognitive support platform.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Supabase account

### Setup

1. **Clone and install:**
   ```bash
   cd apps/portal
   npm install
   ```

2. **Create Supabase project:**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Copy your project URL and anon key

3. **Configure environment:**
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` with your Supabase credentials.

4. **Run database migrations:**
   - Open Supabase SQL Editor
   - Paste contents of `supabase/migrations/001_initial_schema.sql`
   - Run the SQL

5. **Start development:**
   ```bash
   npm run dev
   ```

6. **Deploy to Vercel:**
   - Push to GitHub
   - Import in Vercel
   - Add environment variables
   - Deploy!

## 📱 Features

- **Dashboard** - Overview with stats, activity feed, upcoming events
- **Memories** - Photo albums and stories with "This Day in History"
- **Family** - Family circle, video calls, messages
- **Activities** - Brain games with progress tracking
- **Schedule** - Daily routines and event management
- **Settings** - Profile, accessibility, notifications

## 🎨 UI Features

- Command palette (⌘K)
- Framer Motion animations
- Responsive design
- Dark mode ready
- Skeleton loaders
- Empty states

## 🔧 Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS
- **Animation:** Framer Motion
- **Database:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth

## 📁 Project Structure

```
src/
├── app/                 # Pages (App Router)
│   ├── activities/
│   ├── family/
│   ├── login/
│   ├── memories/
│   ├── schedule/
│   ├── settings/
│   └── signup/
├── components/          # Reusable components
│   ├── activity-feed.tsx
│   ├── command-palette.tsx
│   ├── dashboard-layout.tsx
│   ├── empty-state.tsx
│   ├── quick-actions.tsx
│   ├── sidebar.tsx
│   ├── skeleton.tsx
│   ├── stat-card.tsx
│   └── welcome-banner.tsx
└── lib/
    ├── animations.ts    # Framer Motion variants
    └── supabase/        # Database client
```

## 🧪 Development

```bash
# Run dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 📄 License

Private - BPN Solutions
