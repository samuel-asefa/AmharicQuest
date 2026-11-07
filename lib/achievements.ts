import { BookOpenCheck, Compass, Crown, Feather, Flame, Library, Map as MapIcon, Sparkles, Timer, Trophy, Zap } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { lessons } from './data';
import { FIDEL } from './fidel';
import { Accent, UserProgress } from './types';

export interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: LucideIcon;
    accent: Accent;
    measure: (p: UserProgress) => number;
    goal: number;
}

export const ACHIEVEMENTS: Achievement[] = [
    {
        id: 'first-steps',
        title: 'First Steps',
        description: 'Complete your first lesson',
        icon: BookOpenCheck,
        accent: 'jade',
        measure: (p) => p.completedLessons.length,
        goal: 1,
    },
    {
        id: 'on-a-roll',
        title: 'On a Roll',
        description: 'Reach a 3-day streak',
        icon: Flame,
        accent: 'berbere',
        measure: (p) => p.longestStreak,
        goal: 3,
    },
    {
        id: 'flawless',
        title: 'Flawless',
        description: 'Finish a lesson without a mistake',
        icon: Sparkles,
        accent: 'gold',
        measure: (p) => p.perfectLessons.length,
        goal: 1,
    },
    {
        id: 'combo',
        title: 'Combo Master',
        description: 'Get 10 answers right in a row',
        icon: Zap,
        accent: 'lapis',
        measure: (p) => p.bestCombo,
        goal: 10,
    },
    {
        id: 'explorer',
        title: 'Fidel Explorer',
        description: 'Open 10 letter families',
        icon: Compass,
        accent: 'plum',
        measure: (p) => p.exploredFamilies.length,
        goal: 10,
    },
    {
        id: 'wordsmith',
        title: 'Wordsmith',
        description: 'Learn 25 words',
        icon: Library,
        accent: 'jade',
        measure: (p) => p.masteredWords.length,
        goal: 25,
    },
    {
        id: 'unstoppable',
        title: 'Unstoppable',
        description: 'Reach a 7-day streak',
        icon: Flame,
        accent: 'berbere',
        measure: (p) => p.longestStreak,
        goal: 7,
    },
    {
        id: 'speed',
        title: 'Speed Demon',
        description: 'Score 15 in a Speed Round',
        icon: Timer,
        accent: 'lapis',
        measure: (p) => p.bestSprint,
        goal: 15,
    },
    {
        id: 'scribe',
        title: 'Scribe',
        description: `Open all ${FIDEL.length} letter families`,
        icon: Feather,
        accent: 'plum',
        measure: (p) => p.exploredFamilies.length,
        goal: FIDEL.length,
    },
    {
        id: 'centurion',
        title: 'Treasure Hunter',
        description: 'Earn 500 XP',
        icon: Trophy,
        accent: 'gold',
        measure: (p) => p.totalXP,
        goal: 500,
    },
    {
        id: 'halfway',
        title: 'Halfway There',
        description: 'Reach the middle of the journey',
        icon: MapIcon,
        accent: 'jade',
        measure: (p) => p.completedLessons.length,
        goal: Math.ceil(lessons.length / 2),
    },
    {
        id: 'quest',
        title: 'Quest Complete',
        description: 'Finish every stop on the journey',
        icon: Crown,
        accent: 'gold',
        measure: (p) => p.completedLessons.length,
        goal: lessons.length,
    },
];

export function achievementState(a: Achievement, p: UserProgress) {
    const value = Math.min(a.measure(p), a.goal);
    return { value, earned: value >= a.goal, pct: value / a.goal };
}
