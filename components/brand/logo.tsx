import Link from 'next/link';
import { cn } from '@/lib/utils';

export function LogoMark({ size = 40, className }: { size?: number; className?: string }) {
    return (
        <span
            aria-hidden
            className={cn('relative grid shrink-0 place-items-center overflow-hidden', className)}
            style={{
                width: size,
                height: size,
                borderRadius: size * 0.3,
                background: 'linear-gradient(140deg, #13ad72 0%, #077a51 55%, #05583a 100%)',
                boxShadow: `0 ${Math.max(2, size / 14)}px 0 0 #044330, inset 0 1px 0 rgb(255 255 255 / 0.25)`,
            }}
        >
            <span
                className="absolute rounded-[inherit]"
                style={{ inset: size * 0.08, border: `${Math.max(1.5, size / 22)}px solid #f4b000`, borderRadius: size * 0.22 }}
            />
            <span className="font-geez relative font-bold leading-none text-white" style={{ fontSize: size * 0.52, marginTop: size * 0.02 }}>
                አ
            </span>
        </span>
    );
}

export function Logo({ className, size = 40, href = '/' }: { className?: string; size?: number; href?: string }) {
    return (
        <Link href={href} className={cn('group inline-flex items-center gap-3', className)} aria-label="AmharicQuest home">
            <LogoMark size={size} className="transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105" />
            <span className="font-display text-[1.45rem] font-semibold leading-none tracking-tight text-ink">
                Amharic<span className="italic text-jade-ink">Quest</span>
            </span>
        </Link>
    );
}
