import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'The Fidel',
    description: 'Explore all 238 characters of the Amharic alphabet, family by family.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
