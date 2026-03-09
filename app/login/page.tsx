'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAppStore } from '@/lib/store';

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
        } catch (err: any) {
            setError('Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 flex flex-col items-center justify-center p-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-amharic-green to-amharic-yellow mb-2">
                        AmharicQuest
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400">Welcome back!</p>
                </div>

                <Card className="p-8 shadow-xl shadow-amharic-green/5 border-slate-200 dark:border-zinc-800">
                    <h2 className="text-2xl font-bold mb-6 text-center">Log In</h2>

                    {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4">{error}</div>}

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold mb-1">Email</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-amharic-green transition-all"
                                placeholder="abebe@example.com"
                            />
                        </div>
                        <div className="mb-6">
                            <label className="block text-sm font-semibold mb-1">Password</label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-amharic-green transition-all"
                                placeholder="••••••••"
                            />
                        </div>

                        <Button type="submit" disabled={loading} className="w-full py-4 text-lg">
                            {loading ? 'Logging in...' : 'Log In'}
                        </Button>
                    </form>

                    <div className="mt-6 text-center text-sm text-slate-500">
                        Don't have an account?{' '}
                        <Link href="/signup" className="text-amharic-green font-bold hover:underline">
                            Sign up
                        </Link>
                    </div>
                </Card>
            </motion.div>
        </div>
    );
}
