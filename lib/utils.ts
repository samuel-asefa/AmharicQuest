import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Merges Tailwind classes safely, resolving conflicts. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/* ---------- Dates (always local time, never UTC) ---------- */

export function dayKey(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function shiftDay(key: string, days: number): string {
  const [y, m, d] = key.split('-').map(Number);
  return dayKey(new Date(y, m - 1, d + days));
}

/** The last `n` local days, oldest first, ending today. */
export function lastDays(n: number): string[] {
  const today = dayKey();
  return Array.from({ length: n }, (_, i) => shiftDay(today, i - (n - 1)));
}

export function weekdayLetter(key: string): string {
  const [y, m, d] = key.split('-').map(Number);
  return ['S', 'M', 'T', 'W', 'T', 'F', 'S'][new Date(y, m - 1, d).getDay()];
}

/* ---------- Levels ---------- */

export const LEVEL_TITLES = [
  'Newcomer',
  'Traveler',
  'Explorer',
  'Pathfinder',
  'Wayfarer',
  'Scholar',
  'Storyteller',
  'Elder',
  'Sage',
];

/**
 * Each level takes 50 XP more than the one before:
 * L2 at 100 XP, L3 at 250, L4 at 450, L5 at 700…
 */
export function levelInfo(xp: number) {
  let level = 1;
  let floor = 0;
  let need = 100;
  while (xp >= floor + need) {
    floor += need;
    level += 1;
    need = 100 + 50 * (level - 1);
  }
  const into = xp - floor;
  return {
    level,
    title: LEVEL_TITLES[Math.min(level - 1, LEVEL_TITLES.length - 1)],
    into,
    need,
    toNext: need - into,
    pct: into / need,
  };
}

/* ---------- Randomness ---------- */

export function shuffle<T>(items: readonly T[]): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function pick<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

export function greetingFor(hour: number) {
  if (hour < 12) return { am: 'እንደምን አደሩ', en: 'Good morning' };
  if (hour < 18) return { am: 'እንደምን ዋሉ', en: 'Good afternoon' };
  return { am: 'እንደምን አመሹ', en: 'Good evening' };
}

export function currentHour() {
  return new Date().getHours();
}
