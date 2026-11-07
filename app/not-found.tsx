import type { Metadata } from 'next';
import { ArrowRight } from 'lucide-react';
import { ButtonLink } from '@/components/ui/button';

export const metadata: Metadata = { title: 'Page not found' };

export default function NotFound() {
    return (
        <div className="mx-auto flex min-h-[70dvh] max-w-xl flex-col items-center justify-center px-6 py-16 text-center">
            <div className="relative">
                <span className="font-display text-[9rem] font-semibold leading-none text-line-strong sm:text-[11rem]">404</span>
                <span className="font-geez absolute -right-4 -top-2 rotate-12 text-6xl font-bold text-gold">?</span>
            </div>
            <div className="eyebrow mt-4">Off the map</div>
            <h1 className="font-display mt-2 text-4xl font-semibold">This road doesn&apos;t lead anywhere</h1>
            <p className="mt-3 text-ink-2">The page you were looking for wandered off. Let&apos;s get you back on the journey.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href="/" size="lg">
                    Back home <ArrowRight className="size-5" />
                </ButtonLink>
                <ButtonLink href="/lessons" variant="outline" size="lg">
                    See the journey
                </ButtonLink>
            </div>
        </div>
    );
}
