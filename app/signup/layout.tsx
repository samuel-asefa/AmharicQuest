import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Create account',
    description: 'Start learning Amharic for free.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
