'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAppStore } from '@/lib/store';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LogOut, User as UserIcon, Flame, Star, Award, Settings, Edit3 } from 'lucide-react';

export default function ProfilePage() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const { progress, setUid } = useAppStore();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                setUid(currentUser.uid);
            } else {
                setUser(null);
                setUid(null);
                router.push('/login');
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [router, setUid]);

    const handleLogout = async () => {
        await signOut(auth);
        setUid(null);
        router.push('/login');
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    if (!user) return null; // will redirect in useEffect

    return (
        <div className="max-w-6xl mx-auto p-6 md:p-12 relative">
            {/* Background Blobs */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-amharic-yellow/10 rounded-full blur-[120px] pointer-events-none -z-10" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-amharic-green/10 rounded-full blur-[120px] pointer-events-none -z-10" />

            <header className="mb-12 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-6">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-3 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-amharic-green to-amharic-yellow">
                        Your Profile
                    </h1>
                    <p className="text-lg text-slate-600 dark:text-slate-400">
                        Manage your account and track your progress.
                    </p>
                </motion.div>
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                    <Button variant="outline" onClick={handleLogout} className="gap-2 text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-red-900/30 dark:hover:bg-red-900/20 py-6 px-6 rounded-xl">
                        <LogOut className="w-5 h-5" /> Sign Out
                    </Button>
                </motion.div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* User Info Card */}
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
                    <Card className="p-8 md:col-span-1 flex flex-col items-center text-center glass-card border-slate-200/50 dark:border-zinc-800/50 shadow-2xl shadow-amharic-green/5 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-amharic-green/20 to-amharic-yellow/20 -z-10" />
                        <div className="w-32 h-32 rounded-full bg-white dark:bg-zinc-900 flex items-center justify-center mb-6 text-slate-400 border-4 border-white dark:border-zinc-800 shadow-xl relative mt-4">
                            <UserIcon className="w-16 h-16 text-amharic-green" />
                            <button className="absolute bottom-0 right-0 bg-amharic-yellow text-amber-900 p-2 rounded-full shadow-lg hover:scale-110 transition-transform">
                                <Edit3 className="w-4 h-4" />
                            </button>
                        </div>
                        <h2 className="text-3xl font-black mb-1 text-slate-900 dark:text-white">{user.displayName || 'Amharic Learner'}</h2>
                        <p className="text-slate-500 text-base mb-8 font-medium">{user.email}</p>

                        <div className="w-full space-y-3">
                            <Button variant="outline" className="w-full justify-start gap-3 py-6 rounded-xl text-lg">
                                <Settings className="w-5 h-5 text-slate-500" /> Account Settings
                            </Button>
                        </div>
                    </Card>
                </motion.div>

                {/* Stats Cards */}
                <div className="md:col-span-2 space-y-8">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                        <h3 className="text-2xl font-bold flex items-center gap-3 mb-6">
                            <Award className="w-8 h-8 text-amharic-green" /> Learning Statistics
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <Card className="p-8 flex items-center gap-6 bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-orange-950/20 dark:to-orange-900/10 border-orange-200/50 dark:border-orange-500/20 hover:-translate-y-1 transition-transform duration-300">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 text-white flex items-center justify-center shadow-lg shadow-orange-500/30">
                                    <Flame className="w-8 h-8" />
                                </div>
                                <div>
                                    <div className="text-4xl font-black text-orange-600 dark:text-orange-500">{progress.streak}</div>
                                    <div className="text-sm font-bold text-orange-900/60 dark:text-orange-200/60 uppercase tracking-widest mt-1">Day Streak</div>
                                </div>
                            </Card>

                            <Card className="p-8 flex items-center gap-6 bg-gradient-to-br from-amharic-yellow/10 to-amharic-yellow/5 dark:from-yellow-950/20 dark:to-yellow-900/10 border-amharic-yellow/30 hover:-translate-y-1 transition-transform duration-300">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-400 to-amber-500 text-white flex items-center justify-center shadow-lg shadow-amharic-yellow/30">
                                    <Star className="w-8 h-8 fill-current" />
                                </div>
                                <div>
                                    <div className="text-4xl font-black text-amber-600 dark:text-amharic-yellow">{progress.totalXP}</div>
                                    <div className="text-sm font-bold text-amber-900/60 dark:text-amber-200/60 uppercase tracking-widest mt-1">Total XP</div>
                                </div>
                            </Card>
                        </div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                        <Card className="p-8 glass-card border-slate-200/50 dark:border-zinc-800/50 shadow-xl shadow-amharic-green/5">
                            <h4 className="font-bold text-2xl mb-6 text-slate-900 dark:text-white">Current Level</h4>
                            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-4">
                                <div className="flex items-end gap-4">
                                    <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amharic-green-light to-amharic-green">Lv. {progress.level}</div>
                                </div>
                                <div className="text-slate-500 font-medium bg-slate-100 dark:bg-zinc-800 px-4 py-2 rounded-lg">
                                    Mastered <b className="text-slate-900 dark:text-white text-lg">{progress.masteredWords.length}</b> words
                                </div>
                            </div>
                            <div className="h-4 w-full bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden mt-6 shadow-inner">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(progress.totalXP % 100)}%` }}
                                    transition={{ duration: 1, type: "spring" }}
                                    className="h-full bg-gradient-to-r from-amharic-green-light to-amharic-green rounded-full relative overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-white/20 w-full h-full" style={{ transform: 'skewX(-20deg)', animation: 'shimmer 2s infinite' }} />
                                </motion.div>
                            </div>
                            <div className="text-right text-sm text-slate-400 mt-3 font-semibold">
                                {100 - (progress.totalXP % 100)} XP to Next Level
                            </div>
                        </Card>
                    </motion.div>
                </div>
            </div>
            <style dangerouslySetInnerHTML={{__html: `
                @keyframes shimmer {
                    0% { transform: translateX(-100%) skewX(-20deg); }
                    100% { transform: translateX(200%) skewX(-20deg); }
                }
            `}} />
        </div>
    );
}
