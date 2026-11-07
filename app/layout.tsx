import type { Metadata, Viewport } from 'next';
import { Fraunces, Noto_Sans_Ethiopic, Noto_Serif_Ethiopic, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { ClientLayout } from '@/components/layout/client-layout';

const jakarta = Plus_Jakarta_Sans({
    variable: '--font-jakarta',
    subsets: ['latin', 'latin-ext'],
    display: 'swap',
});

const fraunces = Fraunces({
    variable: '--font-fraunces',
    subsets: ['latin', 'latin-ext'],
    axes: ['SOFT', 'WONK', 'opsz'],
    display: 'swap',
});

const ethiopicSerif = Noto_Serif_Ethiopic({
    variable: '--font-ethiopic-serif',
    subsets: ['ethiopic'],
    display: 'swap',
});

const ethiopicSans = Noto_Sans_Ethiopic({
    variable: '--font-ethiopic-sans',
    subsets: ['ethiopic'],
    display: 'swap',
    preload: false,
});

export const metadata: Metadata = {
    title: {
        default: 'AmharicQuest — Learn Amharic, one letter at a time',
        template: '%s · AmharicQuest',
    },
    description:
        'A beautiful, game-like way to learn Amharic. Master the Fidel script, build your vocabulary, and journey across Ethiopia one lesson at a time.',
    applicationName: 'AmharicQuest',
    keywords: ['Amharic', 'Fidel', "Ge'ez", 'Ethiopia', 'language learning', 'learn Amharic'],
    openGraph: {
        title: 'AmharicQuest',
        description: 'Master the Fidel script and journey across Ethiopia, one lesson at a time.',
        type: 'website',
    },
};

export const viewport: Viewport = {
    themeColor: [
        { media: '(prefers-color-scheme: light)', color: '#fbf6ee' },
        { media: '(prefers-color-scheme: dark)', color: '#120e0b' },
    ],
};

// Applies the saved theme before first paint so there is no flash.
const themeScript = `try{var s=JSON.parse(localStorage.getItem('amharic-quest-storage')||'{}');var t=s&&s.state&&s.state.settings&&s.state.settings.theme;if(t==='light'||t==='dark'){document.documentElement.dataset.theme=t}}catch(e){}`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html
            lang="en"
            suppressHydrationWarning
            className={`${jakarta.variable} ${fraunces.variable} ${ethiopicSerif.variable} ${ethiopicSans.variable}`}
        >
            <head>
                <script dangerouslySetInnerHTML={{ __html: themeScript }} />
            </head>
            <body className="antialiased">
                <ClientLayout>{children}</ClientLayout>
            </body>
        </html>
    );
}
