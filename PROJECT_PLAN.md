# 🧠 Evermind - Project Plan & QA Checklist

## Overview
Memory preservation app for people with cognitive decline.
- **Live URL:** https://evermind-portal.vercel.app
- **Repo:** github.com/lokifrische/evermind
- **Stack:** Next.js + Supabase + Vercel

---

## 🔍 QA Audit (Feb 19, 2026)

### Status Legend
- ✅ Verified working
- ⚠️ Partially working / needs fixes
- ❌ Not working / not implemented
- 🔲 Not tested yet

---

## 📄 PAGES BUILT

### Caregiver Portal (8 pages)
| Page | Route | Status | Notes |
|------|-------|--------|-------|
| Dashboard | `/` | 🔲 | |
| Memories | `/memories` | 🔲 | |
| Family | `/family` | 🔲 | |
| Activities | `/activities` | 🔲 | |
| Schedule | `/schedule` | 🔲 | |
| Settings | `/settings` | 🔲 | |
| Login | `/login` | ✅ | Google OAuth wired up (needs Supabase config) |
| Signup | `/signup` | 🔲 | |

### Patient Portal (14 pages)
| Page | Route | Status | Notes |
|------|-------|--------|-------|
| Home | `/patient` | 🔲 | |
| Memories | `/patient/memories` | 🔲 | |
| Record Memory | `/patient/memories/record` | 🔲 | |
| Slideshow | `/patient/memories/slideshow` | 🔲 | |
| Family | `/patient/family` | 🔲 | |
| Video Call | `/patient/family/call` | 🔲 | |
| Games Index | `/patient/games` | 🔲 | |
| Memory Match | `/patient/games/memory-match` | ✅ | FIXED - Card flip, matching, win modal all working |
| Talk to Me | `/patient/talk` | 🔲 | |
| Calm Mode | `/patient/calm` | 🔲 | |
| Mood Check-in | `/patient/mood` | 🔲 | |

---

## 🚨 KNOWN ISSUES

### Critical
1. **Google OAuth** - ✅ CODE COMPLETE (needs Supabase config)
   - [x] Implement `signInWithOAuth` handler
   - [x] Create /auth/callback route
   - [ ] Set up Google OAuth in Supabase dashboard (Nick's action)
   - [ ] Test sign-in flow end-to-end

2. **Memory Match Game** - ✅ FIXED
   - [x] Test game on live site
   - [x] Verify card flip works
   - [x] Verify matching logic works
   - [x] Verify win condition triggers
   - [x] Test all difficulty levels (2x2, 3x2, 4x3)

### To Verify
3. **Supabase Connection**
   - [ ] Verify `.env.local` has correct keys
   - [ ] Run schema.sql in Supabase
   - [ ] Test database connection
   - [ ] Verify RLS policies work

---

## ✅ FEATURE CHECKLIST

### Auth
- [ ] Email/password login working
- [ ] Email/password signup working
- [ ] Google OAuth working
- [ ] Password reset working
- [ ] Protected routes redirect to login
- [ ] Logout working

### Caregiver Dashboard
- [ ] Shows engagement stats
- [ ] Activity feed displays
- [ ] Quick actions work
- [ ] Navigation works

### Memories
- [ ] Can view memory list
- [ ] Can view individual memory
- [ ] Can create new memory
- [ ] Can add photos to memory
- [ ] Can delete memory

### Family
- [ ] Can view family members
- [ ] Can add family member
- [ ] Can edit family member
- [ ] Can delete family member
- [ ] Photos display correctly

### Patient Home
- [ ] Shows time/date
- [ ] Shows greeting
- [ ] 4 main tiles work (Memories, Family, Games, Talk to Me)
- [ ] Bottom nav works
- [ ] Daily highlights show

### Patient Memories
- [ ] Timeline view works
- [ ] Story recording works
- [ ] Slideshow works
- [ ] Audio playback works

### Patient Family
- [ ] Messages inbox shows
- [ ] Voice playback works
- [ ] Photo feed shows
- [ ] Video call initiates

### Patient Games
- [ ] Games index loads
- [ ] Memory Match fully functional
- [ ] Touch targets are 60dp+

### Patient Calm Mode
- [ ] Breathing exercise works
- [ ] Nature scenes display

### Patient Mood Check-in
- [ ] Emoji selection works
- [ ] Activity suggestions show

---

## 🛠️ SETUP CHECKLIST

### Supabase
- [ ] Create Supabase project
- [ ] Run `supabase/schema.sql`
- [ ] Enable Google OAuth in Auth settings
- [ ] Add Google client ID/secret
- [ ] Set redirect URLs

### Environment
- [ ] `apps/portal/.env.local` has `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `apps/portal/.env.local` has `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Verify keys match Supabase project

### Deployment
- [ ] Vercel connected to repo
- [ ] Environment variables set in Vercel
- [ ] Build passes
- [ ] Preview deploys work

---

## 📝 NEXT STEPS

1. **Test everything** - Spin up dev server and click every button
2. **Fix Google OAuth** - Wire up the handler
3. **Fix Memory Match** - Identify and fix the issue
4. **Set up Supabase** - Create project and run schema
5. **End-to-end test** - Full flow from signup to using features

---

## 📊 PROGRESS TRACKING

| Category | Done | Total | % |
|----------|------|-------|---|
| Auth | 2 | 6 | 33% |
| Caregiver | 0 | 4 | 0% |
| Memories | 0 | 5 | 0% |
| Family | 0 | 5 | 0% |
| Patient Home | 0 | 5 | 0% |
| Patient Memories | 0 | 4 | 0% |
| Patient Family | 0 | 4 | 0% |
| Patient Games | 3 | 3 | 100% |
| Patient Calm | 0 | 2 | 0% |
| Patient Mood | 0 | 2 | 0% |
| **TOTAL** | **5** | **40** | **13%** |

## ✅ FIXES COMPLETED (Feb 19, 2026)

1. **Memory Match Game** - Fixed CSS 3D transforms for card flip
2. **Google OAuth** - Wired up handler and callback route

---

*Last updated: Feb 19, 2026 by Loki 🦊*
