# 🧠 Evermind

**Cognitive Support & Memory Preservation Platform**

A unified application for people with early-to-moderate cognitive decline and their families. Evermind replaces 5-8 fragmented apps with one cognitively-accessible experience.

## What is Evermind?

Evermind is a digital companion that helps people with memory loss:
- **Preserve and revisit memories** through photos, videos, and recorded stories
- **Stay connected with family** through video/voice messages and simple video calls
- **Engage their minds** with adaptive, judgment-free cognitive games
- **Maintain daily routines** with medication reminders, appointments, and morning briefings
- **Get help anytime** from an AI companion that guides them through the app

## Key Principles

- **2 taps maximum** from home to any feature
- **Voice-first interaction** — speak naturally, get results
- **No time pressure** — nothing expires, nothing counts down
- **No failure states** — games encourage, never punish
- **Tiles never move** — spatial memory is preserved

## Tech Stack

| Component | Technology |
|-----------|------------|
| Mobile App | React Native + Expo |
| Caregiver Portal | Next.js |
| Backend | Supabase (PostgreSQL, Auth, Storage, Realtime) |
| AI Assistant | Claude API |
| Voice | AssemblyAI (STT) + ElevenLabs (TTS) |
| Video Calling | LiveKit |

## Project Structure

```
evermind/
├── apps/
│   ├── mobile/          # React Native + Expo app (primary user)
│   └── portal/          # Next.js web app (caregiver)
├── packages/
│   └── shared/          # Shared types and utilities
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+
- Expo CLI
- Supabase account
- (For mobile testing) Expo Go app on your phone

### Installation

```bash
# Clone the repo
git clone https://github.com/lokifrische/evermind.git
cd evermind

# Install dependencies
npm install

# Start the mobile app (web mode for development)
npm run mobile:web

# Start the caregiver portal
npm run portal
```

### Environment Variables

Create `.env` files in each app directory:

**apps/mobile/.env**
```
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**apps/portal/.env.local**
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## User Types

1. **Primary User** — Person with cognitive decline (uses mobile app)
2. **Caregiver** — Family member who manages everything (uses web portal)
3. **Contributors** — Extended family/friends who send content (uses simple web links)

## Features

### Mobile App (Primary User)
- Home screen with 4 large tiles: Memories, Family, Games, Talk to Me
- Memory timeline with photos, videos, and recorded stories
- Family message inbox (organized by faces, not lists)
- Simple video calling with auto-answer for trusted contacts
- Adaptive cognitive games
- AI companion for navigation and daily support
- Morning briefings and medication reminders

### Caregiver Portal
- Dashboard with engagement overview and alerts
- Content management (upload photos, manage memories)
- Contact and communication management
- Reminder and routine configuration
- Analytics and reporting (engagement-focused, not clinical)
- Export memory books and data archives

## Accessibility

Every screen is designed for cognitive accessibility:
- **Touch targets**: Minimum 60x60dp, primary buttons even larger
- **Font sizes**: 4 configurable levels (16sp to 28sp base)
- **Contrast**: Standard and High Contrast modes (WCAG AA/AAA)
- **Motion**: Reduced motion mode available
- **Voice**: Full voice control throughout
- **Haptics**: Tactile feedback confirms actions

## License

Proprietary — All rights reserved

---

Built with ❤️ for families navigating cognitive decline.
