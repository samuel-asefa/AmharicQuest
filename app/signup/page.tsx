'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { AlertCircle, ArrowRight, Check, Eye, EyeOff, Loader2 } from 'lucide-react';
import { AuthShell, PasswordStrength } from '@/components/auth/auth-shell';
import { Button } from '@/components/ui/button';
import { authErrorMessage, refreshAuthUser } from '@/lib/auth';
import { auth, db, isConfigured } from '@/lib/firebase';
import { useAppStore } from '@/lib/store';

const perks = [
    'Read the Fidel, one letter family at a time',
    'Journey through 12 cities, from Addis to the Simien Mountains',
    'Quick quizzes, combos, and a 60-second speed round',
    'Streaks, levels, and badges to keep you coming back',
];

export default function SignupPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [show, setShow] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const setUid = useAppStore((s) => s.setUid);

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const { user } = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(user, { displayName: name.trim() });
            refreshAuthUser();
            try {
                await setDoc(doc(db, 'users', user.uid), { name: name.trim(), email, createdAt: new Date().toISOString() });
            } catch {
                // The account exists either way; a missing profile document shouldn't block sign-up.
            }
            setUid(user.uid);
            router.push('/');
        } catch (err) {
            setError(authErrorMessage(err));
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthShell
            flip
            headline={
                <>
                    Learn to read <span className="italic text-[#ffd560]">Amharic.</span>
                </>
            }
            text="A playful path through the Fidel script and everyday words, one short lesson at a time."
            aside={
                <ul className="mt-8 space-y-3">
                    {perks.map((p, i) => (
                        <motion.li
                            key={p}
                            initial={{ opacity: 0, x: -16 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 + i * 0.1 }}
                            className="flex items-center gap-3 font-semibold text-white/90"
                        >
                            <span className="grid size-7 shrink-0 place-items-center rounded-full bg-[#ffd560] text-[#3f2b00]">
                                <Check className="size-4" strokeWidth={3.5} />
                            </span>
                            {p}
                        </motion.li>
                    ))}
                </ul>
            }
        >
            <div className="font-geez text-lg font-semibold text-jade-ink">ሰላም!</div>
            <h2 className="font-display mt-1 text-4xl font-semibold">Start your quest</h2>
            <p className="mt-2 text-ink-2">Create a free account in seconds.</p>

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

            <form onSubmit={handleSignup} className="mt-7 space-y-4">
                <div>
                    <label htmlFor="name" className="mb-1.5 block text-sm font-bold text-ink-2">
                        Your name
                    </label>
                    <input
                        id="name"
                        type="text"
                        autoComplete="name"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="field"
                        placeholder="What should we call you?"
                    />
                </div>
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
                            autoComplete="new-password"
                            required
                            minLength={6}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="field pr-12"
                            placeholder="At least 6 characters"
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
                    <PasswordStrength value={password} />
                </div>
                <Button type="submit" size="lg" block disabled={loading || !isConfigured} className="!mt-6">
                    {loading ? (
                        <>
                            <Loader2 className="size-5 animate-spin" /> Creating account…
                        </>
                    ) : (
                        <>
                            Create account <ArrowRight className="size-5" />
                        </>
                    )}
                </Button>
            </form>

            <p className="mt-8 text-center text-ink-2">
                Already learning?{' '}
                <Link href="/login" className="font-bold text-jade-ink hover:underline">
                    Log in
                </Link>
            </p>
            <p className="mt-2 text-center text-sm">
                <Link href="/" className="font-semibold text-ink-3 hover:text-ink">
                    or keep exploring as a guest
                </Link>
            </p>
        </AuthShell>
    );
}
