'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAppStore } from '@/lib/store';
import { Sparkles, Globe } from 'lucide-react';

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

            // Create user doc in firestore
            await setDoc(doc(db, 'users', user.uid), {
                name,
                email,
                createdAt: new Date().toISOString(),
            });

            setUid(user.uid);
            router.push('/');
        } catch (err: any) {
            setError(err.message || 'Failed to create account');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 flex relative overflow-hidden">
            {/* Dynamic Background Elements */}
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-amharic-green/20 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-amharic-yellow/20 rounded-full blur-[100px] pointer-events-none" />

            <div className="w-full flex flex-col md:flex-row-reverse items-center justify-center p-6 z-10 gap-12 max-w-6xl mx-auto">
                {/* Hero Section */}
                <motion.div 
                    initial={{ opacity: 0, x: 40 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    transition={{ duration: 0.6 }}
                    className="flex-1 hidden md:flex flex-col justify-center items-start space-y-6"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amharic-green/10 text-amharic-green font-bold text-sm">
                        <Sparkles className="w-4 h-4" /> Begin Your Journey
                    </div>
                    <h1 className="text-5xl lg:text-7xl font-extrabold leading-tight">
                        Unlock the <span className="bg-clip-text text-transparent bg-gradient-to-r from-amharic-yellow to-orange-500">Beauty</span> of Amharic.
                    </h1>
                    <p className="text-xl text-slate-600 dark:text-slate-400 max-w-lg">
                        Start learning the unique Fidel script and everyday vocabulary in an interactive and fun way.
                    </p>
                </motion.div>

                {/* Signup Form */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="w-full max-w-md flex-1"
                >
                    <div className="text-center mb-8 md:hidden">
                        <Globe className="w-12 h-12 mx-auto text-amharic-green mb-4" />
                        <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-amharic-green to-amharic-yellow mb-2">
                            AmharicQuest
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400">Start your language journey</p>
                    </div>

                    <Card className="p-8 shadow-2xl shadow-amharic-green/10 border-slate-200/50 dark:border-zinc-800/50 glass-card">
                        <h2 className="text-2xl font-bold mb-6 text-center">Create an Account</h2>

                        {error && <motion.div initial={{opacity: 0, height: 0}} animate={{opacity: 1, height: 'auto'}} className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm mb-4 border border-red-200 dark:border-red-900/30">{error}</motion.div>}

                        <form onSubmit={handleSignup} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold mb-1 text-slate-700 dark:text-slate-300">Name</label>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 focus:outline-none focus:ring-2 focus:ring-amharic-green transition-all backdrop-blur-sm"
                                    placeholder="Abebe Bikila"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold mb-1 text-slate-700 dark:text-slate-300">Email</label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 focus:outline-none focus:ring-2 focus:ring-amharic-green transition-all backdrop-blur-sm"
                                    placeholder="abebe@example.com"
                                />
                            </div>
                            <div className="mb-6">
                                <label className="block text-sm font-semibold mb-1 text-slate-700 dark:text-slate-300">Password</label>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    minLength={6}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 focus:outline-none focus:ring-2 focus:ring-amharic-green transition-all backdrop-blur-sm"
                                    placeholder="••••••••"
                                />
                            </div>

                            <Button type="submit" disabled={loading} className="w-full py-6 text-lg rounded-xl mt-4">
                                {loading ? 'Creating...' : 'Sign Up'}
                            </Button>
                        </form>

                        <div className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
                            Already have an account?{' '}
                            <Link href="/login" className="text-amharic-green font-bold hover:underline transition-all">
                                Log in
                            </Link>
                        </div>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}
