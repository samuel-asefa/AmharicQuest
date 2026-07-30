'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/lib/store';
import { ArrowRight, Globe } from 'lucide-react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const router = useRouter();
    const setUid = useAppStore(state => state.setUid);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            setUid(userCredential.user.uid);
            router.push('/');
        } catch {
            setError('Invalid email or password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex" style={{ backgroundColor: 'var(--bg-secondary)' }}>
            {/* Left panel (desktop only) */}
            <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="hidden lg:flex flex-col justify-center items-center flex-1 p-16 relative overflow-hidden"
                style={{ backgroundColor: 'var(--duo-green)', borderRight: '3px solid var(--duo-green-border)' }}
            >
                {/* Decorative Amharic characters */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {['አ', 'ለ', 'ሐ', 'መ', 'ሠ', 'ረ'].map((char, i) => (
                        <div
                            key={i}
                            className="absolute font-black opacity-10 text-white select-none"
                            style={{
                                fontSize: `${100 + i * 30}px`,
                                top: `${[5, 20, 50, 65, 30, 75][i]}%`,
                                left: `${[10, 60, 30, 75, 5, 50][i]}%`,
                                transform: `rotate(${[-15, 10, -8, 12, -5, 8][i]}deg)`,
                            }}
                        >
                            {char}
                        </div>
                    ))}
                </div>

                <div className="relative z-10 text-center">
                    <div className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl font-black mx-auto mb-8"
                        style={{ backgroundColor: 'rgba(255,255,255,0.2)', border: '3px solid rgba(255,255,255,0.3)', color: 'white' }}>
                        አ
                    </div>
                    <h1 className="text-5xl font-black text-white mb-4" style={{ letterSpacing: '-0.03em' }}>
                        AmharicQuest
                    </h1>
                    <p className="text-xl font-700 text-white/80 max-w-sm mx-auto">
                        The fun and effective way to learn Amharic
                    </p>

                    <div className="mt-10 grid grid-cols-3 gap-4">
                        {[
                            { label: 'Learners', value: '10K+' },
                            { label: 'Lessons', value: '50+' },
                            { label: 'Languages', value: '1 🇪🇹' },
                        ].map((stat) => (
                            <div key={stat.label} className="rounded-2xl p-4 text-center"
                                style={{ backgroundColor: 'rgba(255,255,255,0.15)', border: '2px solid rgba(255,255,255,0.2)' }}>
                                <div className="text-2xl font-900 text-white">{stat.value}</div>
                                <div className="text-xs font-700 text-white/70 uppercase tracking-wider mt-1">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* Right panel: Login form */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="flex flex-col justify-center items-center flex-1 p-6 md:p-12 lg:max-w-md w-full"
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
                        Welcome back!
                    </h2>
                    <p className="font-600 mb-8" style={{ color: 'var(--text-secondary)' }}>
                        Continue your Amharic journey
                    </p>

                    {/* Error message */}
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

                    <form onSubmit={handleLogin} className="space-y-4">
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
                                className="duo-input"
                                placeholder="••••••••"
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
                                {loading ? 'Logging in...' : (
                                    <>
                                        Log In <ArrowRight className="w-4 h-4" />
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>

                    <div className="mt-6 text-center">
                        <span className="font-600" style={{ color: 'var(--text-secondary)' }}>
                            Don&apos;t have an account?{' '}
                        </span>
                        <Link href="/signup"
                            className="font-800"
                            style={{ color: 'var(--duo-blue)' }}>
                            Sign up
                        </Link>
                    </div>

                    {/* Divider */}
                    <div className="flex items-center gap-3 my-6">
                        <div className="flex-1 h-px" style={{ backgroundColor: 'var(--border)' }} />
                        <span className="text-xs font-700 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>or</span>
                        <div className="flex-1 h-px" style={{ backgroundColor: 'var(--border)' }} />
                    </div>

                    <button
                        className="w-full flex items-center justify-center gap-3 font-800 rounded-2xl transition-all"
                        style={{
                            height: 52,
                            border: '2px solid var(--border)',
                            boxShadow: '0 4px 0 0 var(--border)',
                            backgroundColor: 'var(--surface)',
                            color: 'var(--text-primary)',
                            fontSize: '0.9rem',
                        }}
                    >
                        <Globe className="w-5 h-5" style={{ color: 'var(--duo-green)' }} />
                        Continue as Guest
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
