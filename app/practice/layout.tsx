import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Practice',
    description: 'Vocabulary quizzes, Fidel drills, and a 60-second speed round.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
