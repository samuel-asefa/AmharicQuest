import { Dumbbell, House, Map as MapIcon, User } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface NavItem {
    href: string;
    label: string;
    /** The same word in Amharic, shown under the label. */
    am: string;
    icon?: LucideIcon;
    /** A Fidel character used instead of an icon. */
    glyph?: string;
}

export const NAV_ITEMS: NavItem[] = [
    { href: '/', label: 'Home', am: 'ቤት', icon: House },
    { href: '/lessons', label: 'Journey', am: 'ጉዞ', icon: MapIcon },
    { href: '/fidel', label: 'Fidel', am: 'ፊደል', glyph: 'ፊ' },
    { href: '/practice', label: 'Practice', am: 'ልምምድ', icon: Dumbbell },
    { href: '/profile', label: 'Profile', am: 'መገለጫ', icon: User },
];

export function isActive(pathname: string, href: string) {
    return href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`);
}
