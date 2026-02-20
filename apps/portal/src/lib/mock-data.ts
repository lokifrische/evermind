/**
 * Centralized mock data for Evermind Patient Portal
 * Used for demo/development before Supabase integration
 */

import type { FamilyMember, Memory, DailyHighlight, MemoryPrompt, NavItem } from './types';

// ==================== User Data ====================

export const mockPatient = {
  id: 'patient-1',
  name: 'Margaret',
  preferredName: 'Maggie',
  photo: 'https://images.unsplash.com/photo-1566616213894-2d4e1baee5d8?w=400&h=400&fit=crop',
  dateOfBirth: '1950-03-15',
};

// ==================== Family Members ====================

export const mockFamilyMembers: FamilyMember[] = [
  {
    id: '1',
    careCircleId: 'care-1',
    name: 'Sarah',
    relationship: 'Your Daughter',
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop',
    hasNewMessage: true,
  },
  {
    id: '2',
    careCircleId: 'care-1',
    name: 'David',
    relationship: 'Your Son',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop',
    hasNewMessage: true,
  },
  {
    id: '3',
    careCircleId: 'care-1',
    name: 'Emma',
    relationship: 'Your Granddaughter',
    photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=300&fit=crop',
    hasNewMessage: false,
  },
  {
    id: '4',
    careCircleId: 'care-1',
    name: 'Tommy',
    relationship: 'Your Grandson',
    photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&h=300&fit=crop',
    hasNewMessage: true,
  },
];

// ==================== Memories ====================

export const mockMemories: Memory[] = [
  {
    id: '1',
    careCircleId: 'care-1',
    type: 'photo',
    title: "Sarah's Wedding Day",
    date: 'June 15, 2019',
    year: 2019,
    decade: '2010s',
    thumbnailUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=400&fit=crop',
    tags: ['Sarah', 'Wedding', 'Family'],
    hasAudio: true,
    lifePeriod: 'Recent Years',
    createdAt: new Date('2019-06-15'),
    createdBy: 'caregiver-1',
  },
  {
    id: '2',
    careCircleId: 'care-1',
    type: 'photo',
    title: 'Christmas at Home',
    date: 'December 25, 2018',
    year: 2018,
    decade: '2010s',
    thumbnailUrl: 'https://images.unsplash.com/photo-1512389142860-9c449e58a814?w=400&h=400&fit=crop',
    tags: ['Christmas', 'Family', 'Home'],
    hasAudio: false,
    lifePeriod: 'Recent Years',
    createdAt: new Date('2018-12-25'),
    createdBy: 'caregiver-1',
  },
  {
    id: '3',
    careCircleId: 'care-1',
    type: 'story',
    title: 'How We Met',
    date: 'Recorded Feb 2024',
    year: 2024,
    decade: '2020s',
    thumbnailUrl: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400&h=400&fit=crop',
    tags: ['Love Story', 'Robert'],
    hasAudio: true,
    lifePeriod: 'Recent Years',
    createdAt: new Date('2024-02-01'),
    createdBy: 'patient-1',
  },
  {
    id: '4',
    careCircleId: 'care-1',
    type: 'photo',
    title: "David's Graduation",
    date: 'May 20, 2010',
    year: 2010,
    decade: '2010s',
    thumbnailUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=400&fit=crop',
    tags: ['David', 'Graduation', 'College'],
    hasAudio: true,
    lifePeriod: 'Recent Years',
    createdAt: new Date('2010-05-20'),
    createdBy: 'caregiver-1',
  },
  {
    id: '5',
    careCircleId: 'care-1',
    type: 'photo',
    title: 'Beach Vacation',
    date: 'July 1998',
    year: 1998,
    decade: '1990s',
    thumbnailUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=400&fit=crop',
    tags: ['Vacation', 'Beach', 'Family'],
    hasAudio: false,
    lifePeriod: 'Middle Years',
    createdAt: new Date('1998-07-01'),
    createdBy: 'caregiver-1',
  },
  {
    id: '6',
    careCircleId: 'care-1',
    type: 'photo',
    title: 'First Home',
    date: 'September 1985',
    year: 1985,
    decade: '1980s',
    thumbnailUrl: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&h=400&fit=crop',
    tags: ['Home', 'New Beginning'],
    hasAudio: true,
    lifePeriod: 'Middle Years',
    createdAt: new Date('1985-09-01'),
    createdBy: 'caregiver-1',
  },
  {
    id: '7',
    careCircleId: 'care-1',
    type: 'photo',
    title: 'Our Wedding Day',
    date: 'April 12, 1975',
    year: 1975,
    decade: '1970s',
    thumbnailUrl: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=400&h=400&fit=crop',
    tags: ['Wedding', 'Robert', 'Love'],
    hasAudio: true,
    lifePeriod: 'Early Years',
    createdAt: new Date('1975-04-12'),
    createdBy: 'caregiver-1',
  },
  {
    id: '8',
    careCircleId: 'care-1',
    type: 'photo',
    title: 'Childhood in Ohio',
    date: '1955',
    year: 1955,
    decade: '1950s',
    thumbnailUrl: 'https://images.unsplash.com/photo-1489710437720-ebb67ec84dd2?w=400&h=400&fit=crop',
    tags: ['Childhood', 'Ohio', 'Family'],
    hasAudio: true,
    lifePeriod: 'Childhood',
    createdAt: new Date('1955-01-01'),
    createdBy: 'caregiver-1',
  },
];

// ==================== Daily Highlights ====================

export const mockDailyHighlights: DailyHighlight[] = [
  {
    type: 'memory',
    title: '10 years ago today',
    subtitle: "Sarah's college graduation 🎓",
    action: 'View Memory',
    href: '/patient/memories?highlight=today',
    icon: '📅',
  },
  {
    type: 'message',
    title: 'New message from David',
    subtitle: 'Sent this morning',
    action: 'Listen Now',
    href: '/patient/family/messages',
    icon: '💌',
  },
  {
    type: 'prompt',
    title: 'Share a memory',
    subtitle: 'What was your favorite vacation?',
    action: 'Record Story',
    href: '/patient/memories/record',
    icon: '🎙️',
  },
];

// ==================== Memory Prompts ====================

export const mockMemoryPrompts: MemoryPrompt[] = [
  { id: '1', text: 'What was your favorite holiday tradition?', icon: '🎄', category: 'Holidays' },
  { id: '2', text: 'Tell me about your first job.', icon: '💼', category: 'Career' },
  { id: '3', text: 'What was your favorite vacation?', icon: '🏖️', category: 'Travel' },
  { id: '4', text: 'How did you meet your spouse?', icon: '💕', category: 'Love' },
  { id: '5', text: 'What was your childhood home like?', icon: '🏠', category: 'Childhood' },
  { id: '6', text: 'What was your wedding day like?', icon: '💒', category: 'Love' },
  { id: '7', text: "Tell me about your children's births.", icon: '👶', category: 'Family' },
  { id: '8', text: 'What music did you listen to growing up?', icon: '🎵', category: 'Music' },
  { id: '9', text: 'What was your favorite family recipe?', icon: '🍳', category: 'Food' },
  { id: '10', text: 'Tell me about a proud moment.', icon: '🏆', category: 'Achievements' },
];

// ==================== Navigation ====================

export const patientNavItems: NavItem[] = [
  { href: '/patient/memories', label: 'Memories', icon: '📸', color: 'from-purple-500 to-indigo-600' },
  { href: '/patient/family', label: 'Family', icon: '👨‍👩‍👧‍👦', color: 'from-pink-500 to-rose-600' },
  { href: '/patient/games', label: 'Games', icon: '🧩', color: 'from-amber-500 to-orange-600' },
  { href: '/patient/talk', label: 'Talk to Me', icon: '💬', color: 'from-emerald-500 to-teal-600' },
];

export const patientMainTiles = [
  {
    id: 'memories',
    label: 'Memories',
    icon: '📸',
    href: '/patient/memories',
    bgGradient: 'from-purple-500 to-indigo-600',
    shadowColor: 'shadow-purple-500/30',
    hasNotification: false,
  },
  {
    id: 'family',
    label: 'Family',
    icon: '👨‍👩‍👧‍👦',
    href: '/patient/family',
    bgGradient: 'from-pink-500 to-rose-600',
    shadowColor: 'shadow-pink-500/30',
    hasNotification: true,
  },
  {
    id: 'games',
    label: 'Games',
    icon: '🧩',
    href: '/patient/games',
    bgGradient: 'from-amber-500 to-orange-600',
    shadowColor: 'shadow-amber-500/30',
    hasNotification: false,
  },
  {
    id: 'talk',
    label: 'Talk to Me',
    icon: '💬',
    href: '/patient/talk',
    bgGradient: 'from-emerald-500 to-teal-600',
    shadowColor: 'shadow-emerald-500/30',
    hasNotification: false,
  },
];

// ==================== Games List ====================

export const gamesList = [
  {
    id: 'memory-match',
    name: 'Memory Match',
    description: 'Match pairs of family photos',
    icon: '🃏',
    bgGradient: 'from-purple-500 to-indigo-600',
    shadowColor: 'shadow-purple-500/30',
    href: '/patient/games/memory-match',
    difficulty: 'Easy',
  },
  {
    id: 'word-game',
    name: 'Daily Word',
    description: 'Quick word puzzle',
    icon: '📝',
    bgGradient: 'from-emerald-500 to-teal-600',
    shadowColor: 'shadow-emerald-500/30',
    href: '/patient/games/word-game',
    difficulty: 'Easy',
  },
  {
    id: 'picture-naming',
    name: 'Name That!',
    description: 'Name familiar objects',
    icon: '🖼️',
    bgGradient: 'from-amber-500 to-orange-600',
    shadowColor: 'shadow-amber-500/30',
    href: '/patient/games/picture-naming',
    difficulty: 'Easy',
  },
  {
    id: 'name-that-tune',
    name: 'Name That Tune',
    description: 'Songs from your era',
    icon: '🎵',
    bgGradient: 'from-pink-500 to-rose-600',
    shadowColor: 'shadow-pink-500/30',
    href: '/patient/games/name-that-tune',
    difficulty: 'Fun',
  },
  {
    id: 'sorting',
    name: 'Sort It Out',
    description: 'Put things in categories',
    icon: '📦',
    bgGradient: 'from-sky-500 to-blue-600',
    shadowColor: 'shadow-sky-500/30',
    href: '/patient/games/sorting',
    difficulty: 'Easy',
  },
  {
    id: 'jigsaw',
    name: 'Simple Puzzle',
    description: 'Easy jigsaw puzzles',
    icon: '🧩',
    bgGradient: 'from-violet-500 to-purple-600',
    shadowColor: 'shadow-violet-500/30',
    href: '/patient/games/jigsaw',
    difficulty: 'Easy',
  },
];

// ==================== Quick Actions (Talk to Me) ====================

export const talkQuickActions = [
  { id: 'date', label: "What day is it?", icon: '📅' },
  { id: 'weather', label: "What's the weather?", icon: '🌤️' },
  { id: 'family', label: 'Tell me about my family', icon: '👨‍👩‍👧‍👦' },
  { id: 'schedule', label: "What's happening today?", icon: '📋' },
  { id: 'memory', label: 'Share a memory with me', icon: '💭' },
  { id: 'music', label: 'Play some music', icon: '🎵' },
  { id: 'call', label: 'Call someone', icon: '📞' },
  { id: 'help', label: 'I need help', icon: '🆘' },
];

// ==================== Calming Scenes ====================

export const calmingScenes = [
  {
    id: 'ocean',
    name: 'Ocean Waves',
    image: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=1600&h=900&fit=crop',
    color: 'from-sky-400 to-blue-600',
    icon: '🌊',
  },
  {
    id: 'forest',
    name: 'Peaceful Forest',
    image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1600&h=900&fit=crop',
    color: 'from-emerald-400 to-green-600',
    icon: '🌲',
  },
  {
    id: 'sunset',
    name: 'Golden Sunset',
    image: 'https://images.unsplash.com/photo-1495344517868-8ebaf0a2044a?w=1600&h=900&fit=crop',
    color: 'from-amber-400 to-orange-600',
    icon: '🌅',
  },
  {
    id: 'stars',
    name: 'Starry Night',
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1600&h=900&fit=crop',
    color: 'from-indigo-400 to-purple-600',
    icon: '✨',
  },
];
