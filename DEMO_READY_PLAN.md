# Evermind Demo-Ready Plan

> **Goal:** Make the caregiver portal functional so data flows to the patient app
> **Timeline:** ASAP for client demo

---

## 🎯 What "Demo Ready" Means

A caregiver can:
1. Sign up / Log in
2. Add family members → Appear in patient app
3. Add memories/photos → Appear in patient app
4. Send messages → Appear in patient app
5. Update patient profile → Reflected in patient app

---

## 📋 Master Checklist

### Phase 1: Auth Flow ✅ (Partially Done)
- [x] Supabase Auth configured (Site URL fixed)
- [x] Redirect URLs set
- [ ] Login page → actually authenticate with Supabase
- [ ] Signup page → create account + care circle
- [ ] Logout functionality
- [ ] Protected routes (redirect to login if not authenticated)
- [ ] Get current user's care_circle_id

### Phase 2: Supabase Client Setup for Portal
- [ ] Create server-side Supabase client (already exists)
- [ ] Create client-side Supabase client for forms
- [ ] Add auth context/provider for portal
- [ ] Fetch care_circle_id on login

### Phase 3: Family Management (Priority 1)
- [ ] Family page → fetch real family_members from Supabase
- [ ] "Add Family Member" modal/form
  - [ ] Name, relationship, photo_url, fun_fact fields
  - [ ] Save to Supabase family_members table
- [ ] Edit family member
- [ ] Delete family member
- [ ] Changes reflect in patient app immediately

### Phase 4: Memories Management (Priority 2)
- [ ] Memories page → fetch real memories from Supabase
- [ ] "Add Memory" form
  - [ ] Title, description, type (photo/story/album)
  - [ ] Photo upload (Supabase Storage)
  - [ ] Tags
  - [ ] Save to Supabase memories table
- [ ] Edit memory
- [ ] Delete memory
- [ ] Changes reflect in patient app

### Phase 5: Messages (Priority 3)
- [ ] Messages section → fetch real messages from Supabase
- [ ] "Send Message" form
  - [ ] Text message
  - [ ] From which family member
  - [ ] Save to Supabase messages table
- [ ] Messages appear in patient app inbox

### Phase 6: Patient Profile / Settings
- [ ] Settings page → fetch patient data
- [ ] Update patient name/preferred name
- [ ] Update patient photo
- [ ] Changes reflect in patient app greeting

### Phase 7: Dashboard
- [ ] Dashboard → show real stats
  - [ ] Number of family members
  - [ ] Number of memories
  - [ ] Recent activity
  - [ ] Unread messages count

---

## 🔧 Technical Implementation

### Files to Create/Modify:

**New Files:**
- `apps/portal/src/lib/supabase/client.ts` - Browser Supabase client
- `apps/portal/src/contexts/AuthContext.tsx` - Auth state management
- `apps/portal/src/components/forms/AddFamilyMember.tsx`
- `apps/portal/src/components/forms/AddMemory.tsx`
- `apps/portal/src/components/forms/SendMessage.tsx`

**Files to Modify:**
- `apps/portal/src/app/login/page.tsx` - Real auth
- `apps/portal/src/app/signup/page.tsx` - Real auth
- `apps/portal/src/app/family/page.tsx` - Fetch real data
- `apps/portal/src/app/memories/page.tsx` - Fetch real data
- `apps/portal/src/app/page.tsx` - Dashboard with real data
- `apps/portal/src/app/settings/page.tsx` - Real patient data

---

## 📊 Data Flow

```
Caregiver Portal (Next.js)
        ↓
   Supabase DB
        ↓
Patient App (Expo) ← pulls via DataContext
```

The patient app already pulls from Supabase via DataContext.
We just need to make the caregiver portal WRITE to Supabase.

---

## 🚀 Execution Order

1. **Auth** - Login/signup must work first
2. **Family** - Most visible feature, easiest to demo
3. **Memories** - Core value prop
4. **Messages** - Shows real-time updates
5. **Settings** - Polish

---

*Created: Feb 19, 2026*
