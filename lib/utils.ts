import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges Tailwind classes safely, resolving conflicts.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Calculates user level based on total XP.
 * E.g., Level 1: 0-99 XP, Level 2: 100-249 XP, Level 3: 250-499 XP
 */
export function calculateLevel(xp: number): number {
  if (xp < 100) return 1;
  const level = Math.floor(Math.sqrt(xp / 50)) + 1;
  return level;
}
