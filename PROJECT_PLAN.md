# Evermind — Full Build Project Plan

> **Project:** Cognitive Support & Memory Preservation Platform
> **Client:** BPN Solutions client (will resell)
> **Builder:** Loki (AI)
> **Stack:** React Native/Expo + Next.js + Supabase
> **Budget:** $0 for external APIs (mock/free tier only)
> **Started:** February 19, 2026

---

## 🎯 Project Overview

Three interfaces, one backend:
1. **Mobile App** (React Native/Expo) — Primary user (person with cognitive decline)
2. **Web Portal** (Next.js) — Caregiver/Administrator
3. **Contributor Interface** (Web) — Extended family/friends

---

## 📋 Phase 1: Foundation (CURRENT)

### 1.1 Project Structure
- [x] Monorepo setup (`apps/mobile`, `apps/portal`)
- [x] React Native/Expo scaffold
- [x] Next.js portal (existing)
- [x] Supabase project created
- [x] Database schema deployed
- [x] Seed data loaded

### 1.2 Accessibility Component Library
**Goal:** Every component enforces accessibility rules at the code level

| Component | 60dp Target | Font Scaling | High Contrast | Haptics | Screen Reader | Status |
|-----------|-------------|--------------|---------------|---------|---------------|--------|
| Text | N/A | ✓ | ✓ | N/A | ✓ | ✅ DONE |
| Button | ✓ | ✓ | ✓ | ✓ | ✓ | ✅ DONE |
| Card | ✓ | ✓ | ✓ | ✓ | ✓ | ✅ DONE |
| FeatureTile | ✓ | ✓ | ✓ | ✓ | ✓ | ✅ DONE |
| Input | ✓ | ✓ | ✓ | ✓ | ✓ | ✅ DONE |
| IconButton | ✓ | N/A | ✓ | ✓ | ✓ | ✅ DONE |
| Modal | ✓ | ✓ | ✓ | ✓ | ✓ | ✅ DONE |
| Toast | N/A | ✓ | ✓ | ✓ | ✓ | ✅ DONE |
| Avatar | N/A | N/A | ✓ | N/A | ✓ | ✅ DONE |
| Badge | N/A | ✓ | ✓ | N/A | ✓ | ✅ DONE |

**DONE criteria:** Component cannot be used in a way that violates accessibility rules

### 1.3 Accessibility Context
- [x] Font scale (4 levels: small, medium, large, extraLarge)
- [x] Theme mode (light, dark, highContrast)
- [x] Reduced motion toggle
- [x] Haptics toggle
- [x] Audio feedback toggle
- [x] Voice speed setting
- [x] Persist settings to device storage ✅
- [x] Load settings on app start ✅

### 1.4 Navigation System
- [x] Expo Router setup
- [x] Bottom tab navigator (5 tabs)
- [x] Stack navigator for detail screens
- [x] 2-tap max depth enforcement audit ✅ (all detail screens 1 tap from tabs)
- [x] Back button consistency audit ✅ (all detail screens use showBack)
- [x] No hamburger/drawer menus (verified) ✅
- [x] No gesture-required navigation (verified) ✅

### 1.5 Service Abstraction Layer
**Goal:** Swap between mock and real providers without code changes

```
┌─────────────────────────────────────┐
│           App Features              │
├─────────────────────────────────────┤
│        Service Interfaces           │
├──────────────┬──────────────────────┤
│  Mock/Free   │   Paid (Later)       │
└──────────────┴──────────────────────┘
```

| Service | Interface | Mock Provider | Paid Provider (Future) | Status |
|---------|-----------|---------------|------------------------|--------|
| Speech-to-Text | `SpeechService` | Native RN Voice | Deepgram/Whisper | ⬜ TODO |
| Text-to-Speech | `TTSService` | Expo Speech | ElevenLabs | ✅ DONE |
| AI Assistant | `AssistantService` | Canned responses | OpenAI/Claude | ✅ DONE |
| Video Calling | `VideoService` | P2P WebRTC | Daily.co/LiveKit | ⬜ TODO |
| Database | `DataService` | Supabase | Supabase | ✅ (using Supabase directly) |
| Storage | `StorageService` | Supabase Storage | Supabase + CDN | ⬜ TODO |
| Auth | `AuthService` | Supabase Auth | Supabase Auth | ⬜ TODO |

---

## 📋 Phase 2: Mobile App Core Screens

### 2.1 Home Screen
- [x] Time-of-day greeting with user's name
- [x] User's photo displayed
- [x] Full natural-language date display
- [x] Four feature tiles (2x2 grid)
- [x] Daily highlight strip
- [x] Family quick view
- [ ] Subtle new-content indicators (dots, not badges)
- [x] Connect to real user data (Supabase) ✅
- [x] Connect to real memories data ✅
- [ ] "This Day in History" integration

**DONE criteria:** Screen displays real user data, greeting is accurate, tiles navigate correctly

### 2.2 Memories Module

#### 2.2.1 Timeline View
- [x] Vertical scrollable cards
- [x] Thumbnails, titles, dates
- [x] Filter toggle buttons
- [ ] Tags display on cards
- [ ] Date headers while scrolling
- [ ] Connect to real memories (Supabase)
- [ ] Caregiver-curated collections

**DONE criteria:** Shows real memories from database, filters work, smooth scrolling

#### 2.2.2 Memory Playback
- [x] Photo viewer with navigation arrows
- [ ] Audio playback with photos
- [ ] Voice recording playback with waveform
- [ ] Scrolling transcription
- [ ] Video playback (full-screen, play/pause only)

**DONE criteria:** All media types play correctly, controls are minimal and clear

#### 2.2.3 Slideshow Mode
- [ ] Full-screen crossfade display
- [ ] Configurable duration per photo
- [ ] Voice narration with auto-duration
- [ ] Background music
- [ ] Auto volume adjustment
- [ ] Tap-to-reveal controls

**DONE criteria:** Smooth transitions, audio works, controls appear on tap

#### 2.2.4 Story Recording
- [ ] Large microphone button
- [ ] Visual waveform
- [ ] No visible timer
- [ ] Gentle prompts on silence
- [ ] Auto-stop after extended silence
- [ ] Confirmation screen
- [ ] Speech-to-text transcription

**DONE criteria:** Recording works, transcription appears, saved to database

#### 2.2.5 Photo/Video Capture
- [ ] Simplified camera interface
- [ ] Oversized thumbnail picker
- [ ] Preview confirmation flow

**DONE criteria:** Photos save to database with metadata

### 2.3 Family Module

#### 2.3.1 Message Inbox
- [x] Sender faces as circular photos (grid)
- [x] Tap to play message
- [ ] Video messages full-screen
- [ ] Voice messages with sender photo
- [ ] Message history per sender
- [ ] Auto-transcription subtitles
- [ ] Connect to real messages (Supabase)

**DONE criteria:** Real messages play, history works, transcriptions show

#### 2.3.2 Photo Feed
- [x] Vertically scrolling feed
- [x] Large photos
- [x] Sender names and captions
- [x] One-tap reaction buttons
- [ ] Connect to real photos (Supabase)
- [ ] Send reactions to backend

**DONE criteria:** Real photos from contributors, reactions save

#### 2.3.3 Video Calling
- [x] Contact tiles (tap to call)
- [ ] WebRTC connection
- [ ] Full-screen incoming call
- [ ] Large answer button (no swipe)
- [ ] During-call: face + end button only
- [ ] Auto-answer option
- [ ] Graceful quality degradation

**DONE criteria:** Can complete a video call between two devices

#### 2.3.4 Family Member Detail
- [x] Profile display
- [x] Message history
- [x] Call button
- [ ] Connect to real data (Supabase)
- [ ] Fun facts and relationship info

**DONE criteria:** Shows real family member data

### 2.4 Reminders & Briefing

#### 2.4.1 Morning Briefing
- [ ] Configurable delivery time
- [ ] Day/date display
- [ ] Weather (free API)
- [ ] Today's schedule
- [ ] Featured memory
- [ ] Configurable elements

**DONE criteria:** Briefing shows at configured time with real data

#### 2.4.2 Medication Reminders
- [ ] Name, dosage, time display
- [ ] Optional pill photo
- [ ] Acknowledgment button
- [ ] Snooze button
- [ ] Caregiver escalation

**DONE criteria:** Reminders fire on time, acknowledgments logged

#### 2.4.3 Appointment Reminders
- [ ] Title, time, location
- [ ] Context (who's involved)
- [ ] Configurable timing

**DONE criteria:** Reminders show before appointments

#### 2.4.4 Mood Check-in
- [x] Emoji-based responses (UI exists)
- [ ] Configurable frequency
- [ ] Log to database
- [ ] Trend detection (backend)

**DONE criteria:** Check-ins save to database, visible to caregiver

### 2.5 Games Module

#### 2.5.1 Memory Match
- [x] Uses family photos
- [x] Grid display
- [x] Flip animation
- [x] Match detection
- [x] Celebration feedback
- [ ] Configurable grid sizes
- [ ] Adaptive difficulty
- [ ] Extended card visibility (1.5s)
- [ ] Two-player mode

**DONE criteria:** Multiple difficulties work, uses real family photos

#### 2.5.2 Other Games (Phase 3)
- [ ] Word Association
- [ ] Story Completion
- [ ] Picture Naming
- [ ] Daily Word Game
- [ ] Name That Tune
- [ ] Sound Matching
- [ ] Musical Memory Lane
- [ ] Jigsaw Puzzles
- [ ] Sorting Games
- [ ] Spot the Difference

**DONE criteria:** Each game is playable with appropriate difficulty

#### 2.5.3 Game Infrastructure
- [ ] Session fatigue warning
- [ ] Daily game limits
- [ ] Passive analytics logging
- [ ] Difficulty progression

### 2.6 AI Assistant ("Talk to Me")

#### 2.6.1 Interface
- [x] Voice-first UI
- [x] Visual feedback (listening/processing/speaking)
- [x] Text input alternative
- [x] Quick action buttons
- [x] Message bubbles
- [ ] Animated waveform during listening

**DONE criteria:** UI responds to all states, looks polished

#### 2.6.2 Speech Integration
- [ ] Speech recognition (native)
- [ ] Text-to-speech output (Expo Speech)
- [ ] Configurable voice speed
- [ ] Tolerance for pauses/mumbling

**DONE criteria:** Can have voice conversation

#### 2.6.3 Response System
- [x] Mock responses (canned)
- [ ] Context-aware responses
- [ ] Access to user profile
- [ ] Access to memory metadata
- [ ] Navigation commands
- [ ] Task execution
- [ ] Date/time/weather queries

**DONE criteria:** Assistant can navigate app, answer questions, be helpful

#### 2.6.4 Safety & Personality
- [ ] Warm, patient personality
- [ ] Uses preferred name
- [ ] Repeats without noting repetition
- [ ] Never claims to be human
- [ ] No medical advice
- [ ] Distress detection
- [ ] Caregiver alerting

**DONE criteria:** Safe, appropriate responses in all scenarios

---

## 📋 Phase 3: Caregiver Web Portal

### 3.1 Dashboard
- [x] Basic layout
- [ ] Today's activity summary
- [ ] Medication status
- [ ] Mood trend (weekly)
- [ ] Engagement chart (30-day)
- [ ] Alerts and flags
- [ ] Recent content

### 3.2 Content Management
- [ ] Bulk photo upload
- [ ] EXIF date sorting
- [ ] Batch tagging
- [ ] Story editing
- [ ] Voice recording association
- [ ] Moderation queue
- [ ] Collection builder
- [ ] Memory prompts
- [ ] PDF memory book export

### 3.3 Family & Communication
- [ ] Video call contacts management
- [ ] Contributor invitations
- [ ] Scheduled messages
- [ ] Message library

### 3.4 Reminders & Routines
- [ ] Medication management
- [ ] Adherence calendar
- [ ] Appointments
- [ ] Morning briefing config
- [ ] Mood check-in config

### 3.5 Analytics
- [ ] Engagement dashboard
- [ ] Mood tracking charts
- [ ] Game performance
- [ ] AI usage stats
- [ ] PDF report export
- [ ] CSV export

### 3.6 Settings
- [ ] User profile
- [ ] Accessibility settings
- [ ] Auth configuration
- [ ] Notifications
- [ ] Game settings
- [ ] AI settings
- [ ] Privacy settings

---

## 📋 Phase 4: Contributor Interface

- [ ] Shared link access (no login)
- [ ] Video message recording (3 min)
- [ ] Voice message recording
- [ ] Photo upload with caption
- [ ] Multiple photo upload
- [ ] Optional account creation
- [ ] View/reaction notifications

---

## 📋 Phase 5: Backend Integration

### 5.1 Supabase Integration (Mobile)
- [ ] Auth flow (simplified for primary user)
- [ ] User profile queries
- [ ] Memories CRUD
- [ ] Family members queries
- [ ] Messages queries
- [ ] Routines queries
- [ ] Activity logging
- [ ] Mood check-in logging
- [ ] Real-time subscriptions

### 5.2 Offline Support
- [ ] Proactive caching strategy
- [ ] SQLite local database
- [ ] Sync queue for offline actions
- [ ] Conflict resolution
- [ ] Background sync

### 5.3 Push Notifications
- [ ] Expo Push setup
- [ ] Reminder notifications
- [ ] New message notifications
- [ ] Caregiver alerts

---

## 📋 Phase 6: Polish & Launch

### 6.1 Testing
- [ ] Accessibility audit (screen reader)
- [ ] Touch target audit (60dp)
- [ ] Navigation depth audit (2-tap)
- [ ] Offline mode testing
- [ ] Performance profiling
- [ ] Memory leak check

### 6.2 App Store Prep
- [ ] App icons
- [ ] Splash screens
- [ ] Store screenshots
- [ ] App description
- [ ] Privacy policy
- [ ] TestFlight build
- [ ] Play Store internal build

### 6.3 Documentation
- [ ] Client handoff document
- [ ] API key setup guide
- [ ] Supabase configuration guide
- [ ] Deployment guide

---

## 🔄 Current Sprint Focus

**IMMEDIATE NEXT STEPS:**
1. [x] Complete component library (Input, IconButton, Modal, Toast, Avatar, Badge) ✅
2. [x] Create service interfaces (Supabase service created)
3. [x] Connect Home screen to Supabase (DataContext created)
4. [x] Connect Memories to Supabase (using DataContext)
5. [x] Fix RLS recursion issue in Supabase policies ✅
6. [ ] Test on physical device
7. [ ] Persist accessibility settings to device storage
8. [ ] Complete remaining Phase 2 screen features

**RLS ISSUE:** ✅ FIXED (Feb 19, 2026)
- Created `get_my_care_circle_id()` SECURITY DEFINER function
- Dropped recursive "Care circle members can view each other" policy
- Added permissive policies for all tables missing them

---

## 📝 Notes

- No paid APIs until client is ready to go live
- Use native device speech recognition
- Use Expo Speech for TTS
- WebRTC for video calling (free STUN servers)
- All settings controlled by caregiver
- Primary user never creates account

---

*Last updated: February 19, 2026*
