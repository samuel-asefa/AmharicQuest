'use client';

/**
 * Dependency-free confetti. Draws on a temporary full-screen canvas,
 * then removes itself. Skipped entirely for reduced-motion users.
 */

const COLORS = ['#0a8f62', '#12c486', '#f4b000', '#ffd560', '#e04a2f', '#3b5bdb', '#9b4dca', '#ffffff'];

interface Piece {
    x: number;
    y: number;
    vx: number;
    vy: number;
    rot: number;
    vr: number;
    w: number;
    h: number;
    color: string;
    shape: 'rect' | 'circle' | 'diamond';
    tilt: number;
    vt: number;
}

export function fireConfetti({
    count = 160,
    origin = { x: 0.5, y: 0.45 },
    spread = 1,
}: { count?: number; origin?: { x: number; y: number }; spread?: number } = {}) {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const canvas = document.createElement('canvas');
    canvas.setAttribute('aria-hidden', 'true');
    Object.assign(canvas.style, {
        position: 'fixed',
        inset: '0',
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: '9999',
    });
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        canvas.remove();
        return;
    }
    ctx.scale(dpr, dpr);

    const ox = window.innerWidth * origin.x;
    const oy = window.innerHeight * origin.y;
    const pieces: Piece[] = Array.from({ length: count }, () => {
        const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.1 * spread;
        const speed = 7 + Math.random() * 11;
        return {
            x: ox,
            y: oy,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            rot: Math.random() * Math.PI,
            vr: (Math.random() - 0.5) * 0.35,
            w: 6 + Math.random() * 7,
            h: 4 + Math.random() * 6,
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
            shape: (['rect', 'rect', 'circle', 'diamond'] as const)[Math.floor(Math.random() * 4)],
            tilt: Math.random() * Math.PI,
            vt: 0.05 + Math.random() * 0.1,
        };
    });

    const start = performance.now();
    const life = 3200;

    const frame = (now: number) => {
        const t = now - start;
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        const fade = t > life - 700 ? Math.max(0, (life - t) / 700) : 1;
        for (const p of pieces) {
            p.vx *= 0.985;
            p.vy = p.vy * 0.985 + 0.32;
            p.x += p.vx;
            p.y += p.vy;
            p.rot += p.vr;
            p.tilt += p.vt;
            ctx.save();
            ctx.globalAlpha = fade;
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rot);
            ctx.scale(1, Math.cos(p.tilt));
            ctx.fillStyle = p.color;
            if (p.shape === 'circle') {
                ctx.beginPath();
                ctx.arc(0, 0, p.w / 2.4, 0, Math.PI * 2);
                ctx.fill();
            } else if (p.shape === 'diamond') {
                ctx.beginPath();
                ctx.moveTo(0, -p.w / 1.6);
                ctx.lineTo(p.w / 2.2, 0);
                ctx.lineTo(0, p.w / 1.6);
                ctx.lineTo(-p.w / 2.2, 0);
                ctx.closePath();
                ctx.fill();
            } else {
                ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
            }
            ctx.restore();
        }
        if (t < life) requestAnimationFrame(frame);
        else canvas.remove();
    };
    requestAnimationFrame(frame);
}

/** A bigger celebration: two side cannons and a center burst. */
export function celebrate() {
    fireConfetti({ count: 90, origin: { x: 0.15, y: 0.75 }, spread: 0.6 });
    fireConfetti({ count: 90, origin: { x: 0.85, y: 0.75 }, spread: 0.6 });
    setTimeout(() => fireConfetti({ count: 140, origin: { x: 0.5, y: 0.4 } }), 220);
}
