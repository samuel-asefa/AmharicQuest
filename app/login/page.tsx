'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { AlertCircle, ArrowRight, Eye, EyeOff, Loader2 } from 'lucide-react';
import { AuthShell } from '@/components/auth/auth-shell';
import { Button, ButtonLink } from '@/components/ui/button';
import { authErrorMessage } from '@/lib/auth';
import { auth, isConfigured } from '@/lib/firebase';
import { useAppStore } from '@/lib/store';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [show, setShow] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const setUid = useAppStore((s) => s.setUid);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const cred = await signInWithEmailAndPassword(auth, email, password);
            setUid(cred.user.uid);
            router.push('/');
        } catch (err) {
            setError(authErrorMessage(err));
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthShell
            headline={
                <>
                    Pick up where you <span className="italic text-[#ffd560]">left off.</span>
                </>
            }
            text="Your streak, your XP, and the next stop on your journey across Ethiopia are waiting."
        >
            <div className="font-geez text-lg font-semibold text-jade-ink">እንኳን ደህና መጡ</div>
            <h2 className="font-display mt-1 text-4xl font-semibold">Welcome back</h2>
            <p className="mt-2 text-ink-2">Log in to continue your quest.</p>

            {!isConfigured && (
                <p className="mt-6 rounded-2xl bg-gold-soft p-4 text-sm font-semibold text-gold-ink">
                    Accounts aren&apos;t set up on this copy of the app yet. You can still learn as a guest.
                </p>
            )}

            <AnimatePresence>
                {error && (
                    <motion.div
                        role="alert"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="mt-6 flex gap-3 rounded-2xl border-2 border-berbere/40 bg-berbere-soft p-4 text-sm font-semibold text-berbere-ink">
                            <AlertCircle className="size-5 shrink-0" />
                            {error}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <form onSubmit={handleLogin} className="mt-7 space-y-4">
                <div>
                    <label htmlFor="email" className="mb-1.5 block text-sm font-bold text-ink-2">
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="field"
                        placeholder="you@example.com"
                    />
                </div>
                <div>
                    <label htmlFor="password" className="mb-1.5 block text-sm font-bold text-ink-2">
                        Password
                    </label>
                    <div className="relative">
                        <input
                            id="password"
                            type={show ? 'text' : 'password'}
                            autoComplete="current-password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="field pr-12"
                            placeholder="Your password"
                        />
                        <button
                            type="button"
                            onClick={() => setShow((s) => !s)}
                            className="absolute right-2 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-lg text-ink-3 hover:bg-paper-2 hover:text-ink"
                            aria-label={show ? 'Hide password' : 'Show password'}
                        >
                            {show ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                        </button>
                    </div>
                </div>
                <Button type="submit" size="lg" block disabled={loading || !isConfigured} className="!mt-6">
                    {loading ? (
                        <>
                            <Loader2 className="size-5 animate-spin" /> Logging in…
                        </>
                    ) : (
                        <>
                            Log in <ArrowRight className="size-5" />
                        </>
                    )}
                </Button>
            </form>

            <div className="my-6 flex items-center gap-3">
                <span className="h-0.5 flex-1 rounded-full bg-line" />
                <span className="text-xs font-bold uppercase tracking-widest text-ink-3">or</span>
                <span className="h-0.5 flex-1 rounded-full bg-line" />
            </div>

            <ButtonLink href="/" variant="outline" size="lg" block>
                <span className="font-geez text-lg text-jade-ink">ሰላም</span> Continue as guest
            </ButtonLink>

            <p className="mt-8 text-center text-ink-2">
                New here?{' '}
                <Link href="/signup" className="font-bold text-jade-ink hover:underline">
                    Create an account
                </Link>
            </p>
        </AuthShell>
    );
}
