/**
 * Shared utility functions for Evermind Portal
 */

import type { TimeOfDay } from './types';

// ==================== Date & Time ====================

/**
 * Get time-appropriate greeting
 */
export function getTimeOfDay(): TimeOfDay {
  const hour = new Date().getHours();
  if (hour < 12) return { greeting: 'Good Morning', emoji: '🌅', period: 'Morning' };
  if (hour < 17) return { greeting: 'Good Afternoon', emoji: '☀️', period: 'Afternoon' };
  if (hour < 21) return { greeting: 'Good Evening', emoji: '🌆', period: 'Evening' };
  return { greeting: 'Good Night', emoji: '🌙', period: 'Night' };
}

/**
 * Format date for display
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Format date short (without year)
 */
export function formatDateShort(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Get relative time string (e.g., "5 min ago")
 */
export function getRelativeTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min ago`;
  
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return formatDateShort(d);
}

/**
 * Check if date is today
 */
export function isToday(date: Date | string): boolean {
  const d = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();
  return d.toDateString() === today.toDateString();
}

/**
 * Check if date is tomorrow
 */
export function isTomorrow(date: Date | string): boolean {
  const d = typeof date === 'string' ? new Date(date) : date;
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return d.toDateString() === tomorrow.toDateString();
}

// ==================== Array Utilities ====================

/**
 * Shuffle array (Fisher-Yates algorithm)
 */
export function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

/**
 * Group array by key
 */
export function groupBy<T, K extends string | number>(
  array: T[],
  keyFn: (item: T) => K
): Record<K, T[]> {
  return array.reduce((acc, item) => {
    const key = keyFn(item);
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {} as Record<K, T[]>);
}

/**
 * Pick random item from array
 */
export function randomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

// ==================== String Utilities ====================

/**
 * Truncate string with ellipsis
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + '...';
}

/**
 * Capitalize first letter
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Slugify string for URLs
 */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// ==================== CSS Utilities ====================

/**
 * Merge class names (simple cn alternative)
 */
export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

// ==================== Accessibility ====================

/**
 * Get font size class based on setting
 */
export function getFontSizeClass(size: 'standard' | 'large' | 'extra-large' | 'maximum'): string {
  const sizes = {
    standard: 'text-base',
    large: 'text-lg',
    'extra-large': 'text-xl',
    maximum: 'text-2xl',
  };
  return sizes[size];
}

// ==================== Validation ====================

/**
 * Check if value is a valid email
 */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Check if value is a valid phone number (basic)
 */
export function isValidPhone(phone: string): boolean {
  return /^\+?[\d\s-()]{10,}$/.test(phone);
}

// ==================== Local Storage ====================

/**
 * Safe JSON parse from localStorage
 */
export function getStoredValue<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch {
    return defaultValue;
  }
}

/**
 * Safe JSON stringify to localStorage
 */
export function setStoredValue<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage might be full or disabled
  }
}

// ==================== Numbers ====================

/**
 * Clamp number between min and max
 */
export function clamp(num: number, min: number, max: number): number {
  return Math.min(Math.max(num, min), max);
}

/**
 * Format number with commas
 */
export function formatNumber(num: number): string {
  return num.toLocaleString('en-US');
}
