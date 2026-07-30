'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/lib/store';
import { ArrowRight, CheckCircle } from 'lucide-react';

const perks = [
    'Learn Amharic with fun, daily lessons',
    'Master the Fidel script step by step',
    'Build vocabulary with interactive quizzes',
    'Track your streak & earn XP',
];

export default function SignupPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const router = useRouter();
    const setUid = useAppStore(state => state.setUid);

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            await updateProfile(user, { displayName: name });
            await setDoc(doc(db, 'users', user.uid), {
                name,
                email,
                createdAt: new Date().toISOString(),
            });
            setUid(user.uid);
            router.push('/');
        } catch (err: unknown) {
            setError((err as Error).message || 'Failed to create account');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex" style={{ backgroundColor: 'var(--bg-secondary)' }}>
            {/* Left panel: Form */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col justify-center items-center flex-1 p-6 md:p-12 lg:max-w-md"
                style={{ backgroundColor: 'var(--bg-primary)' }}
            >
                {/* Mobile logo */}
                <div className="lg:hidden flex items-center gap-3 mb-10">
                    <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl font-black"
                        style={{ backgroundColor: 'var(--duo-green)', color: 'white', boxShadow: '0 3px 0 0 var(--duo-green-border)' }}>
                        አ
                    </div>
                    <span className="text-2xl font-black" style={{ color: 'var(--text-primary)' }}>AmharicQuest</span>
                </div>

                <div className="w-full max-w-sm">
                    <h2 className="text-3xl font-900 mb-2" style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                        Create account
                    </h2>
                    <p className="font-600 mb-8" style={{ color: 'var(--text-secondary)' }}>
                        Begin your Amharic journey today
                    </p>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="rounded-xl p-4 mb-6 font-700 text-sm"
                            style={{
                                backgroundColor: 'rgba(255, 75, 75, 0.08)',
                                border: '2px solid rgba(255, 75, 75, 0.3)',
                                color: 'var(--duo-red)',
                            }}
                        >
                            {error}
                        </motion.div>
                    )}

                    <form onSubmit={handleSignup} className="space-y-4">
                        <div>
                            <label className="block text-sm font-800 uppercase tracking-wider mb-2"
                                style={{ color: 'var(--text-secondary)' }}>
                                Your Name
                            </label>
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="duo-input"
                                placeholder="Abebe Bikila"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-800 uppercase tracking-wider mb-2"
                                style={{ color: 'var(--text-secondary)' }}>
                                Email
                            </label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="duo-input"
                                placeholder="abebe@example.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-800 uppercase tracking-wider mb-2"
                                style={{ color: 'var(--text-secondary)' }}>
                                Password
                            </label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                minLength={6}
                                className="duo-input"
                                placeholder="Min. 6 characters"
                            />
                        </div>

                        <div className="pt-2">
                            <Button
                                type="submit"
                                disabled={loading}
                                variant="default"
                                className="w-full gap-2"
                                style={{ height: 56, fontSize: '1rem' }}
                            >
                                {loading ? 'Creating account...' : (
                                    <>
                                        Get Started <ArrowRight className="w-4 h-4" />
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>

                    <div className="mt-6 text-center">
                        <span className="font-600" style={{ color: 'var(--text-secondary)' }}>
                            Already have an account?{' '}
                        </span>
                        <Link href="/login" className="font-800" style={{ color: 'var(--duo-blue)' }}>
                            Log in
                        </Link>
                    </div>
                </div>
            </motion.div>

            {/* Right panel (desktop) */}
            <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="hidden lg:flex flex-col justify-center items-center flex-1 p-16 relative overflow-hidden"
                style={{ backgroundColor: 'var(--duo-blue)', borderLeft: '3px solid var(--duo-blue-border)' }}
            >
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {['ሰ', 'ሸ', 'ቀ', 'በ', 'ተ', 'ነ'].map((char, i) => (
                        <div
                            key={i}
                            className="absolute font-black opacity-10 text-white select-none"
                            style={{
                                fontSize: `${90 + i * 25}px`,
                                top: `${[8, 25, 55, 70, 35, 80][i]}%`,
                                right: `${[8, 55, 25, 70, 5, 45][i]}%`,
                                transform: `rotate(${[10, -12, 8, -10, 15, -7][i]}deg)`,
                            }}
                        >
                            {char}
                        </div>
                    ))}
                </div>

                <div className="relative z-10 text-center max-w-md">
                    <div className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl font-black mx-auto mb-8"
                        style={{ backgroundColor: 'rgba(255,255,255,0.2)', border: '3px solid rgba(255,255,255,0.3)', color: 'white' }}>
                        አ
                    </div>
                    <h1 className="text-4xl font-black text-white mb-4" style={{ letterSpacing: '-0.03em' }}>
                        Start learning today
                    </h1>
                    <p className="text-lg font-700 text-white/80 mb-10">
                        Join thousands discovering the beauty of Amharic
                    </p>

                    <div className="space-y-3 text-left">
                        {perks.map((perk, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 + i * 0.1 }}
                                className="flex items-center gap-3 p-4 rounded-2xl"
                                style={{ backgroundColor: 'rgba(255,255,255,0.15)', border: '1.5px solid rgba(255,255,255,0.2)' }}
                            >
                                <CheckCircle className="w-5 h-5 text-white flex-shrink-0" />
                                <span className="font-700 text-white text-sm">{perk}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
