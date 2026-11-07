import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Journey',
    description: 'Your path of lessons across Ethiopia, from Addis Ababa to the Simien Mountains.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
