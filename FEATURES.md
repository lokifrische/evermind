# Evermind Feature Vision

## The Core Insight

Evermind isn't just a caregiver tool — it's a **dual-experience platform**:

1. **Caregiver Portal** (current) — For family members managing care
2. **Patient Experience** (new) — For the person with cognitive decline

Most dementia apps focus entirely on caregivers. We're building something that also serves the person at the center.

---

## Patient Experience: Design Principles

### 1. Minimal Cognitive Load
- Never more than 2-3 choices on screen
- Large buttons (minimum 64px touch targets)
- High contrast, clear typography (20px+ base font)
- No nested navigation — everything 1 tap away

### 2. Constant Orientation
People with dementia often wake up confused:
- Where am I?
- What day is it?
- Who are these people?

Every screen should gently orient them.

### 3. Emotional Safety
- Warm, calming colors (soft blues, greens, warm neutrals)
- Reassuring language ("You are safe. Sarah is coming at 2pm.")
- No alarming notifications or urgent red alerts
- Photos of familiar faces provide comfort

### 4. Dignity Preservation
- Never feel like a "test" or "treatment"
- Frame everything positively
- Let them feel capable, not diminished

---

## Feature: Morning Greeting (Patient Home Screen)

When a patient opens the app, they see:

### Top Section: Orientation
```
[Large, warm greeting based on time]
"Good Morning, Margaret"

[Today's date in friendly format]
"Wednesday, February 19th"

[Current time of day indicator]
☀️ Morning
```

### Center Section: Family Recognition
```
[Large, beautiful photo of a family member]
[Photo rotates each time app opens]

"This is Sarah"
"Your daughter"

[Optional: Play voice message button]
🔊 "Hear from Sarah"
```

### Bottom Section: What's Happening
```
[Simple day overview]
"Today:"
☕ Breakfast at 8:00
💊 Medication at 9:00
📞 Video call with David at 3:00

[Big help button]
🆘 "I Need Help"
[Tapping calls the primary caregiver immediately]
```

---

## Feature: Meet Your Family

A dedicated experience for gentle face-name reinforcement.

### How It Works (Patient View)
1. Full-screen photo of family member
2. Large name and relationship
3. Audio recording of that person saying "Hi [Patient], I'm [Name], your [relationship]. I love you."
4. Swipe to see next family member
5. No scoring, no pressure — just warm exposure

### How Caregivers Set It Up (Portal)
- Upload photos of each family member
- Record or upload voice introductions
- Set which members appear and how often
- Track engagement (which faces resonate most)

---

## Feature: Daily Routine Visualization

### Patient View
A simple, visual timeline of the day:

```
[Morning - highlighted if current]
  🌅 Wake up
  ☕ Breakfast
  💊 Morning medication

[Afternoon]
  🎨 Activity time
  📞 Call with David
  🍽️ Lunch

[Evening]
  📺 Relaxation
  💊 Evening medication
  🌙 Bedtime
```

- Current period highlighted
- Completed items gently checked off
- Tap any item for more detail

### Caregiver Setup
- Create routine templates
- Customize with photos/icons
- Set reminder triggers

---

## Feature: Calm Mode

For moments of agitation or sundowning (late-day confusion).

### Triggers
- Caregiver activates remotely
- Patient taps "I feel worried" button
- Scheduled activation during known difficult times

### What It Shows
- Soothing full-screen nature imagery
- Gentle, familiar music (can be customized)
- Slowly rotating photos of loved ones
- Soft voice: "You are safe. You are loved. [Caregiver] will be with you soon."

---

## Feature: Life Story Timeline

An interactive biography that helps maintain identity.

### Patient View
Swipeable timeline with:
- Wedding photo: "You married Robert in 1965"
- Career photo: "You were a nurse for 30 years"
- Family photo: "You have 2 children: Sarah and David"
- Milestone photo: "You built your first home in 1972"

### Why It Matters
- Helps them hold onto who they are
- Gives conversation starters for visitors
- Preserves dignity through remembered accomplishments

---

## Feature: "Who's Coming Today?"

Before visitors arrive, prepare the patient.

```
[Photo of visitor]
"In 30 minutes:"

"Sarah (your daughter) and Tommy (your grandson, age 8) are coming to visit"

[Play intro audio]
🔊 "Remember us"
```

Reduces anxiety of "who are these people?" moments.

---

## Feature: Safe Check-In

Simple daily wellness check:

### Morning Check
[Large emoji buttons]
"How are you feeling today?"
😊 Good  |  😐 Okay  |  😔 Not great

### Caregiver Dashboard
- Pattern tracking over time
- Alerts for concerning trends
- Notes correlation with activities/visits

---

## Feature: Smart Emergency System

### Big Red Button (Patient View)
Always visible, easy to tap:
```
🆘 "I Need Help"
```

### What Happens
1. Immediately calls primary caregiver
2. Sends location to emergency contacts
3. Shows reassuring message: "Sarah is calling you now..."
4. Falls back to secondary contacts if no answer

### False Alarm Handling
- Caregiver can mark as "false alarm" 
- Pattern tracking helps identify if button placement needs adjustment

---

## Technical Architecture

### Mode Switching
- Single app, two modes
- Caregiver logs in normally
- Patient has simplified PIN or face recognition
- Caregiver can switch to "Patient View" to test/demo

### Data Structure (Supabase)
```
profiles
├── id
├── role (caregiver | patient)
├── care_circle_id
├── settings

family_members
├── id
├── care_circle_id
├── name
├── relationship
├── photo_url
├── voice_intro_url
├── display_order

daily_routines
├── id
├── care_circle_id
├── time
├── activity_type
├── title
├── icon
├── details

life_events
├── id
├── patient_id
├── year
├── title
├── description
├── photo_url
├── display_order

wellness_checks
├── id
├── patient_id
├── timestamp
├── mood
├── notes
```

---

## Implementation Priority

### Phase 1: Patient Home Screen ⭐
- Morning greeting with orientation
- Family photo rotation
- Today's schedule
- Help button

### Phase 2: Meet Your Family
- Family gallery
- Voice introductions
- Gentle browsing experience

### Phase 3: Life Story
- Timeline interface
- Photo + story pairing

### Phase 4: Calm Mode & Advanced
- Soothing experience
- Wellness tracking
- Visitor preparation

---

## What Makes This Special

1. **Human-Centered** — Built for the person with dementia, not just their caregivers
2. **Emotionally Intelligent** — Calming, not clinical
3. **Therapeutically Sound** — Based on dementia care best practices
4. **Beautiful** — Because dignity matters

This isn't just an app. It's a bridge between someone losing their memory and the people they love.
