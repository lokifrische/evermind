# Evermind — Full Build Master Checklist

> **Platform:** Cognitive Support & Memory Preservation
> **Stack:** React Native/Expo (mobile) + Next.js (web) + Supabase (backend)
> **Last Updated:** Feb 19, 2026

---

## 🎯 Platform Overview

- [ ] Native mobile app (React Native/Expo) — iOS & Android
- [x] Web-based caregiver portal (Next.js)
- [ ] Lightweight contributor interface
- [x] Common backend (Supabase)

---

## 👥 User Roles & Authentication

### Primary User (Person with Cognitive Decline)
- [ ] Mobile-only access
- [ ] Simplified authentication:
  - [ ] No-auth auto-login option
  - [ ] PIN code option
  - [ ] Biometric option
  - [ ] Caregiver-initiated unlock
- [ ] No session timeout while app is foregrounded
- [ ] Configurable grace period when backgrounded
- [ ] Cannot access settings/admin
- [ ] Never creates account directly

### Caregiver/Administrator
- [x] Full web portal access
- [x] Create/manage primary user account
- [ ] Upload and moderate all content
- [ ] Configure accessibility settings
- [ ] Configure reminders, contacts, games
- [ ] Configure AI assistant behavior
- [ ] Configure notification preferences
- [ ] Configure privacy controls
- [ ] View engagement analytics
- [ ] View activity logs
- [ ] Manage contributor access

### Contributor (Extended Family/Friends)
- [ ] Shared link access (no account required)
- [ ] Optional lightweight account
- [ ] Upload photos with captions
- [ ] Record video messages (up to 3 min)
- [ ] Record voice messages
- [ ] Cannot access analytics/settings
- [ ] Content goes through moderation (configurable)

---

## 📱 Primary User Mobile App (React Native/Expo)

### Core Platform — Accessibility Framework
- [ ] Enforced minimum touch targets (60dp+)
- [ ] Dynamic font scaling (4 sizes)
- [ ] High contrast mode
- [ ] Dark/light themes
- [ ] Haptic feedback
- [ ] Audio feedback
- [ ] Reduced motion mode
- [ ] Orientation lock
- [ ] Full screen reader support
- [ ] Custom component library enforcing accessibility rules

### Home Screen
- [ ] Time-of-day greeting with user's name
- [ ] User's photo displayed
- [ ] Full natural-language date display
- [ ] Four fixed-position color-coded tiles:
  - [ ] Memories (blue)
  - [ ] Family (rose)
  - [ ] Games (amber)
  - [ ] Talk to Me (purple)
- [ ] Daily highlight strip with rotating content
- [ ] Subtle new-content indicators (no number badges)

### Navigation System
- [ ] Two-tap maximum depth to any feature
- [ ] Persistent bottom navigation bar
- [ ] Center Home button on every screen
- [ ] Consistent back button with text label
- [ ] NO hamburger menus
- [ ] NO drawers
- [ ] NO gesture-required navigation
- [ ] NO time-limited interactions
- [ ] Gentle non-technical error handling

### Voice System
- [ ] Persistent microphone button on every screen
- [ ] Natural language intent recognition
- [ ] Handles imprecise/varied speech
- [ ] Global voice commands
- [ ] Contextual voice commands
- [ ] Voice guidance output
- [ ] Configurable speech speed
- [ ] Tolerance for long pauses
- [ ] Tolerance for repetition
- [ ] Tolerance for mumbling
- [ ] Tolerance for background noise
- [ ] Optional wake word

### Offline Architecture
- [ ] Proactive caching:
  - [ ] Recent photos
  - [ ] Recordings
  - [ ] Video messages
  - [ ] Contact data
  - [ ] Game assets
  - [ ] Reminders
  - [ ] Morning briefing data
- [ ] Silent background sync on reconnect
- [ ] Graceful fallbacks for connectivity issues

### Onboarding (Caregiver-Driven)
- [ ] Connection via QR code
- [ ] Connection via numeric code
- [ ] Welcome screen with user's photo
- [ ] Optional four-screen tour
- [ ] Home screen in under 60 seconds
- [ ] No account creation for primary user

---

## 🧠 Memories Module (Mobile)

### Story Recording
- [ ] Large microphone button
- [ ] Visual waveform display
- [ ] No visible timer
- [ ] Gentle prompts on silence
- [ ] Auto-stop after extended silence
- [ ] Confirmation screen
- [ ] Automatic speech-to-text transcription
- [ ] Configured for elderly speech patterns

### Photo & Video Capture
- [ ] Simplified camera interface
- [ ] Single-select photo picker
- [ ] Oversized thumbnails
- [ ] Preview confirmation flow

### Memory Prompt System
- [ ] Built-in library (~100 prompts)
- [ ] Prompts organized by theme
- [ ] Daily rotating prompt on home screen
- [ ] Caregiver-created custom prompts
- [ ] Prompt scheduling

### Tagging System
- [ ] Automatic tags from EXIF data
- [ ] Automatic tags from transcription content
- [ ] AI-assisted tag suggestions
- [ ] Caregiver manual tagging
- [ ] Tag types: people, places, dates, life periods, themes, custom

### Timeline View
- [ ] Vertical scrollable cards
- [ ] Thumbnails, titles, dates, tags
- [ ] Date headers while scrolling
- [ ] Filter toggles: type, life period, people
- [ ] Caregiver-curated named collections

### Memory Playback
- [ ] Photos: full-screen, audio playback option, navigation arrows
- [ ] Voice recordings: auto-play, waveform, scrolling transcription
- [ ] Videos: full-screen, play/pause only

### Slideshow Mode
- [ ] Full-screen crossfade display
- [ ] Configurable duration per photo
- [ ] Voice recording narration with auto-duration override
- [ ] Background music (caregiver-selected genre)
- [ ] Auto volume adjustment
- [ ] Minimal tap-to-reveal controls
- [ ] Caregiver-built named slideshows
- [ ] Custom order and music per slideshow

### This Day in History
- [ ] Match current date to memories across years
- [ ] Notification
- [ ] Home screen display
- [ ] Offline support

### Text Entry Alternative
- [ ] Large-font keyboard
- [ ] Voice-to-text dictation

---

## 👨‍👩‍👧‍👦 Family Module (Mobile)

### Video & Voice Message Inbox
- [ ] Sender faces as large circular photos in grid
- [ ] Tap face to play most recent message
- [ ] Video messages full-screen
- [ ] Voice messages with sender photo
- [ ] Post-playback replay option
- [ ] Message history per sender
- [ ] Messages never deleted (archived after configurable period)
- [ ] Auto-transcription subtitles on videos

### Scheduled Messages
- [ ] Caregiver-scheduled delivery
- [ ] Video, voice, or text-to-speech
- [ ] One-time or recurring
- [ ] Provides orientation and emotional connection

### Family Photo Feed
- [ ] Vertically scrolling reverse-chronological
- [ ] Large photos
- [ ] Sender names and captions
- [ ] One-tap reaction buttons (heart, smiley, thumbs up)
- [ ] Reaction notifications to contributors

### Video Calling
- [ ] Large labeled contact photo tiles (4-8 contacts)
- [ ] Tap to call immediately
- [ ] Full-screen incoming call display
- [ ] Large answer button (no swipe)
- [ ] WebRTC-based (no third-party app)
- [ ] Auto-answer option per contact
- [ ] During-call: only other person's face + end button
- [ ] Graceful quality degradation
- [ ] Auto-reconnect

### Morning Briefing
- [ ] Configurable delivery time
- [ ] Day/date display
- [ ] Weather
- [ ] Schedule
- [ ] Featured memory
- [ ] Configurable elements

### Medication Reminders
- [ ] Name, dosage, time
- [ ] Optional pill photo
- [ ] Acknowledgment button
- [ ] Snooze button
- [ ] Caregiver escalation after configurable window

### Appointment Reminders
- [ ] Title, time, location
- [ ] Context about who's involved
- [ ] Configurable pre-event timing

### Mood Check-in
- [ ] Configurable frequency
- [ ] Emoji-based response options
- [ ] Responses logged for caregiver
- [ ] Alerts on sustained negative trends

### Passive Activity Log
- [ ] Track app opens
- [ ] Track section usage
- [ ] Track messages viewed
- [ ] Track games played
- [ ] Track reminders acknowledged
- [ ] Data visible only to caregiver

---

## 🎮 Games Module (Mobile)

### Memory Matching
- [ ] Uses user's own family photos
- [ ] Configurable grid sizes
- [ ] Adaptive difficulty
- [ ] Extended card visibility
- [ ] Celebration feedback
- [ ] Two-player family mode

### Word Association
- [ ] Prompt word + multiple choice
- [ ] Gentle hints
- [ ] Vocabulary calibrated to user's interests

### Story Completion
- [ ] Fill-in-the-blank short stories
- [ ] Multiple choice or voice input
- [ ] Adaptive difficulty

### Picture Naming
- [ ] Photo display + identification (tap or voice)
- [ ] Progress: common objects → family member recognition

### Daily Word Game
- [ ] Quick rotating puzzle (unscramble, missing letter, rhyme)
- [ ] 30-60 second morning warm-up

### Name That Tune
- [ ] Era-appropriate audio clips
- [ ] Multiple choice answers

### Sound Matching
- [ ] Audio clips + photo options
- [ ] Calming nature theme

### Musical Memory Lane
- [ ] Decade-curated playlists
- [ ] Thumbs up/down rating
- [ ] Preference profile building
- [ ] Use in slideshows and background music

### Simple Jigsaw Puzzles
- [ ] Uses family photos
- [ ] Large pieces
- [ ] Generous snap-to-grid

### Sorting Games
- [ ] Drag or tap-to-place categorization
- [ ] Gentle correction

### Spot the Difference
- [ ] Generous hit detection
- [ ] Progressive difficulty

### Game Session Management
- [ ] Fatigue warning after configurable duration
- [ ] Gentle suggestion to take a break
- [ ] Daily game limits (configurable)
- [ ] Redirect to other activities

### Game Analytics (Passive)
- [ ] Games played
- [ ] Frequency
- [ ] Duration
- [ ] Difficulty levels
- [ ] Trends over time
- [ ] Positioned as engagement info, NOT cognitive assessment

---

## 🤖 AI Assistant — "Talk to Me" (Mobile)

### Conversational Interface
- [ ] Voice-first interaction
- [ ] Visual feedback during listening/processing/responding
- [ ] Text input alternative
- [ ] Session context within conversations
- [ ] No context persistence between sessions

### Personalization
- [ ] Access to user profile
- [ ] Access to preferences
- [ ] Access to memory library metadata
- [ ] Uses user's preferred name
- [ ] Configurable speech speed
- [ ] Configurable assistant name

### Personality
- [ ] Warm, patient, encouraging
- [ ] Repeats information willingly (never notes repetition)
- [ ] Identifies as digital helper (never pretends human)

### Platform Navigation & Tasks
- [ ] Navigate to any section
- [ ] Play specific memories/slideshows/messages
- [ ] Initiate video calls
- [ ] Send reactions
- [ ] Provide date/time/weather/schedule
- [ ] Step-by-step help for any feature
- [ ] Undo and correction support

### Proactive Daily Support
- [ ] Morning greeting with briefing
- [ ] Medication reminders with confirmation/escalation
- [ ] Appointment reminders with context
- [ ] Activity suggestions during low engagement
- [ ] Evening wind-down suggestions
- [ ] All on configurable schedules

### Companionship & Grounding
- [ ] Calm orientation responses (date/location/identity)
- [ ] Conversational engagement from user's life history
- [ ] Calming responses to confusion/distress
- [ ] Reassurance and practical options
- [ ] Light cognitive prompts
- [ ] Never minimizes feelings
- [ ] Never provides clinical advice

### Conversation Logging
- [ ] Timestamped transcripts
- [ ] Accessible to caregiver

### Safety Guardrails
- [ ] No medical advice (redirect to caregiver/doctor)
- [ ] No harmful or distressing content
- [ ] Distress detection with caregiver alerting
- [ ] Offer to connect when distressed
- [ ] Caregiver-configurable topic boundaries
- [ ] Transparency about being a digital assistant
- [ ] Configurable conversation rate limiting

---

## 💻 Caregiver Web Portal (Next.js)

### Dashboard
- [x] Basic layout structure
- [ ] Today's activity summary
- [ ] Medication reminder status
- [ ] Mood check-in responses with weekly trend
- [ ] 30-day engagement trend chart
- [ ] Alerts and flags:
  - [ ] Missed medications
  - [ ] Inactivity
  - [ ] Distress indicators
- [ ] Recent content additions

### Content Management
- [ ] Bulk photo upload (drag-and-drop)
- [ ] Automatic EXIF date sorting
- [ ] Batch tagging
- [ ] Story editing (title, description, caption, tags, privacy)
- [ ] Associate voice recordings with photos
- [ ] Content moderation queue
- [ ] Approve, edit, archive, flag actions
- [ ] Configurable moderation mode:
  - [ ] Auto-approve all
  - [ ] Review all
  - [ ] Review contributor content only
- [ ] Collection builder (named groups, custom order, descriptions, covers)
- [ ] Memory prompt management (create, edit, schedule, track)
- [ ] PDF memory book generation
- [ ] Complete data export (media, transcriptions, metadata)

### Contact & Communication Management
- [ ] Video calling contacts (photo, priority, auto-answer config)
- [ ] Contributor invitation and permissions
- [ ] Scheduled message recording/scheduling/editing/deletion
- [ ] Calendar view for scheduled messages
- [ ] Message library for pre-recorded messages

### Reminder & Routine Configuration
- [ ] Medication management (dosage, timing, photos, escalation)
- [ ] Medication adherence history calendar
- [ ] Appointment management (details, timing)
- [ ] Morning briefing customization
- [ ] Mood check-in configuration (frequency, options)

### Analytics & Reporting
- [ ] Engagement dashboard (daily/weekly/monthly)
- [ ] Breakdown by section
- [ ] Time per session
- [ ] Most viewed memories
- [ ] Most played games + difficulty
- [ ] Message interaction rates
- [ ] Reminder adherence rates
- [ ] Mood tracking over time
- [ ] Pattern detection
- [ ] Sustained negative trend alerts
- [ ] Game performance trends (weeks/months)
- [ ] AI assistant usage:
  - [ ] Conversation count
  - [ ] Average length
  - [ ] Common request types
  - [ ] Flagged responses
- [ ] Conversation log access (full transcripts)
- [ ] Export: PDF summary reports
- [ ] Export: Raw CSV
- [ ] PDF formatted for healthcare providers
- [ ] Disclaimer: engagement data, not clinical assessment

### Settings & Configuration
- [x] Settings page structure
- [ ] User profile editing (name, photo, interests, life details)
- [ ] Accessibility settings:
  - [ ] Font size
  - [ ] Contrast mode
  - [ ] Theme
  - [ ] Voice speed
  - [ ] Reduced motion
  - [ ] Haptics
  - [ ] Audio feedback
  - [ ] Orientation lock
- [ ] Authentication method selection
- [ ] Session timeout configuration
- [ ] Notification preferences (push, email, SMS)
- [ ] Activity thresholds
- [ ] Game settings:
  - [ ] Enable/disable specific games
  - [ ] Difficulty ranges
  - [ ] Session limits
  - [ ] Family play mode
- [ ] AI assistant settings:
  - [ ] Name
  - [ ] Proactive interaction schedule
  - [ ] Conversation limits
  - [ ] Topic boundaries
  - [ ] Capability toggles
- [ ] Privacy settings:
  - [ ] Moderation mode
  - [ ] Default privacy levels
  - [ ] Data retention
  - [ ] Export
  - [ ] Deletion

### Authentication
- [x] Login page
- [x] Signup page
- [x] Auth callback
- [ ] Password reset
- [ ] Session management

---

## 🤝 Contributor Interface

### Zero-Friction Access
- [ ] Shared link experience
- [ ] No account required
- [ ] No app download required
- [ ] No login required

### Upload Options
- [ ] Record video message (up to 3 min)
- [ ] Record voice message
- [ ] Upload photo with caption
- [ ] Upload multiple photos with captions

### Content Routing
- [ ] Content to primary user's library
- [ ] Optional caregiver moderation

### Optional Lightweight Account
- [ ] See when content was viewed
- [ ] Receive reaction notifications
- [ ] Upload without fresh link each time

---

## 🔧 Backend & Infrastructure

### Supabase
- [x] PostgreSQL database
- [x] Database schema (13 tables)
- [x] Row Level Security policies
- [x] Auto-update triggers
- [x] Seed data
- [x] Email/password authentication
- [ ] File storage for all media
- [ ] Realtime subscriptions for notifications

### Authentication
- [x] Email/password
- [ ] Google OAuth
- [ ] Apple Sign-In (iOS)
- [ ] PIN auth system
- [ ] Biometric integration

### External Services
- [ ] CDN for media delivery
- [ ] Speech-to-text (elderly speech patterns)
- [ ] Neural text-to-speech (voice output)
- [ ] LLM API for AI assistant
- [ ] System prompts: personality, safety, boundaries
- [ ] WebRTC with TURN server (video calling)
- [ ] Image compression (preserving face clarity)

### Infrastructure
- [x] Production deployment (Vercel - web)
- [ ] Staging environment
- [ ] Development environment
- [ ] Expo/EAS (mobile builds)
- [ ] App Store submission
- [ ] Play Store submission
- [ ] Monitoring and alerting
- [ ] CI/CD pipeline

---

## 🚫 Explicitly Excluded (Future Phases)

- Medical information module with clinically reviewed content
- Peer community for users and caregivers
- Direct healthcare provider integration (HIPAA, EHR)
- Predictive cognitive analytics (ML on engagement)
- Wearable device integration (location, vitals, sleep)
- Multi-language localization (including AI)

---

## 📊 Current Status Summary

### ✅ DONE
- Caregiver web portal structure (22 pages)
- Patient web interface prototype (demo quality)
- Supabase schema + seed data (13 tables)
- Vercel deployment
- Basic auth flow
- **React Native/Expo project scaffold** ✅ (Feb 19, 2026)
- **Accessibility component library** (Text, Button, Card, FeatureTile) ✅
- **Navigation system** (Expo Router with bottom tabs) ✅
- **Home screen** with greeting, tiles, daily highlights ✅
- **Memories tab** with timeline, filters, cards ✅
- **Family tab** with messages inbox, photo feed, video call ✅
- **Games tab** with all 11 games listed, Memory Match playable ✅
- **AI Assistant tab** with voice-first UI, quick actions ✅
- **Detail screens** (Memory viewer, Family member, Game) ✅
- **Accessibility Context** (font scaling, themes, haptics, reduced motion) ✅

### ❌ NOT DONE (Mobile)
- Supabase integration (connect to real data)
- Voice system
- Offline architecture
- AI assistant integration
- Video calling (WebRTC)
- Game implementations
- Content management features
- Analytics dashboard
- Contributor portal
- Full accessibility component library
- External service integrations

### 🎯 PRIORITY ORDER (Recommended)
1. React Native mobile app scaffold
2. Home screen with 4 tiles
3. Family module (messages, video calling)
4. Memories module (view, record)
5. Games module (start with Memory Match)
6. AI assistant integration
7. Caregiver portal features
8. Contributor interface
9. Analytics and reporting
10. App store deployment

---

*This checklist tracks the full build scope per Nick's spec (Feb 19, 2026)*
