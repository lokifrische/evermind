/**
 * Evermind Theme Constants
 * 
 * Accessibility-first design system:
 * - 60dp minimum touch targets
 * - 4 font scale levels
 * - High contrast mode support
 * - Reduced motion support
 */

// Minimum touch target per spec
export const MIN_TOUCH_TARGET = 60;

// Color Palette
export const colors = {
  // Primary feature colors (from spec)
  memories: {
    light: '#DBEAFE',
    main: '#3B82F6',
    dark: '#1E40AF',
  },
  family: {
    light: '#FCE7F3',
    main: '#EC4899',
    dark: '#BE185D',
  },
  games: {
    light: '#FEF3C7',
    main: '#F59E0B',
    dark: '#B45309',
  },
  assistant: {
    light: '#EDE9FE',
    main: '#8B5CF6',
    dark: '#6D28D9',
  },
  
  // Neutral colors
  white: '#FFFFFF',
  black: '#000000',
  
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
  
  // Semantic colors
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
  danger: '#EF4444',
  
  // Primary/Secondary (alias to feature colors for consistency)
  primary: '#3B82F6',
  primaryDark: '#1E40AF',
  secondary: '#8B5CF6',
  secondaryDark: '#6D28D9',
  
  // Theme variants
  light: {
    background: '#FFFFFF',
    surface: '#F9FAFB',
    text: '#111827',
    textSecondary: '#6B7280',
    border: '#E5E7EB',
  },
  dark: {
    background: '#111827',
    surface: '#1F2937',
    text: '#F9FAFB',
    textSecondary: '#9CA3AF',
    border: '#374151',
  },
  highContrast: {
    background: '#000000',
    surface: '#000000',
    text: '#FFFFFF',
    textSecondary: '#FFFFFF',
    border: '#FFFFFF',
  },
};

// Font Scale Levels (4 sizes per spec)
export const fontScales = {
  small: 1.0,
  medium: 1.15,
  large: 1.3,
  extraLarge: 1.5,
};

// Base font sizes (multiplied by scale)
export const fontSizes = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
  '5xl': 48,
};

// Font weights
export const fontWeights = {
  normal: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

// Typography presets
export const typography = {
  h1: { fontSize: 32, fontWeight: fontWeights.bold, fontFamily: undefined },
  h2: { fontSize: 24, fontWeight: fontWeights.bold, fontFamily: undefined },
  h3: { fontSize: 20, fontWeight: fontWeights.semibold, fontFamily: undefined },
  bodyLarge: { fontSize: 18, fontWeight: fontWeights.normal, fontFamily: undefined },
  body: { fontSize: 16, fontWeight: fontWeights.normal, fontFamily: undefined },
  caption: { fontSize: 14, fontWeight: fontWeights.normal, fontFamily: undefined },
};

// Spacing scale
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
};

// Border radius
export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

// Shadows
export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
};

// Animation durations (respect reduced motion)
export const animations = {
  fast: 150,
  normal: 300,
  slow: 500,
};

// Feature tile configuration
export const featureTiles = [
  {
    id: 'memories',
    title: 'Memories',
    icon: 'images',
    color: colors.memories.main,
    backgroundColor: colors.memories.light,
    route: '/memories',
  },
  {
    id: 'family',
    title: 'Family',
    icon: 'people',
    color: colors.family.main,
    backgroundColor: colors.family.light,
    route: '/family',
  },
  {
    id: 'games',
    title: 'Games',
    icon: 'game-controller',
    color: colors.games.main,
    backgroundColor: colors.games.light,
    route: '/games',
  },
  {
    id: 'assistant',
    title: 'Talk to Me',
    icon: 'chatbubbles',
    color: colors.assistant.main,
    backgroundColor: colors.assistant.light,
    route: '/assistant',
  },
];
