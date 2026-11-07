import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Profile',
    description: 'Your streak, XP, badges, and settings.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
