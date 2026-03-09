'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAppStore } from '@/lib/store';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LogOut, User as UserIcon, Flame, Star, Award, Settings } from 'lucide-react';

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
        <div className="max-w-4xl mx-auto p-6 md:p-12">
            <header className="mb-10 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-amharic-green to-amharic-yellow">
                        Your Profile
                    </h1>
                    <p className="text-lg text-slate-600 dark:text-slate-400">
                        Manage your account and track your progress.
                    </p>
                </div>
                <Button variant="outline" onClick={handleLogout} className="gap-2 text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-red-900/30 dark:hover:bg-red-900/20">
                    <LogOut className="w-4 h-4" /> Sign Out
                </Button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* User Info Card */}
                <Card className="p-8 md:col-span-1 flex flex-col items-center text-center">
                    <div className="w-24 h-24 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center mb-4 text-slate-400 border-4 border-amharic-green/20">
                        <UserIcon className="w-12 h-12" />
                    </div>
                    <h2 className="text-2xl font-bold mb-1">{user.displayName || 'Amharic Learner'}</h2>
                    <p className="text-slate-500 text-sm mb-6">{user.email}</p>

                    <div className="w-full space-y-3">
                        <Button variant="outline" className="w-full justify-start gap-3">
                            <Settings className="w-4 h-4" /> Account Settings
                        </Button>
                    </div>
                </Card>

                {/* Stats Cards */}
                <div className="md:col-span-2 space-y-6">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                        <Award className="w-6 h-6 text-amharic-green" /> Learning Statistics
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Card className="p-6 flex items-center gap-4 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-zinc-900 dark:to-orange-900/10 border-orange-200 dark:border-orange-500/20">
                            <div className="w-14 h-14 rounded-2xl bg-orange-500 text-white flex items-center justify-center shadow-lg shadow-orange-500/30">
                                <Flame className="w-8 h-8" />
                            </div>
                            <div>
                                <div className="text-3xl font-black text-orange-600 dark:text-orange-500">{progress.streak}</div>
                                <div className="text-sm font-bold text-orange-900/60 dark:text-orange-200/60 uppercase tracking-widest">Day Streak</div>
                            </div>
                        </Card>

                        <Card className="p-6 flex items-center gap-4 bg-gradient-to-br from-amharic-yellow/10 to-amharic-yellow/20 dark:from-zinc-900 dark:to-amharic-yellow/10 border-amharic-yellow/30">
                            <div className="w-14 h-14 rounded-2xl bg-amharic-yellow text-amber-900 flex items-center justify-center shadow-lg shadow-amharic-yellow/30">
                                <Star className="w-8 h-8 fill-current" />
                            </div>
                            <div>
                                <div className="text-3xl font-black text-amber-600 dark:text-amharic-yellow">{progress.totalXP}</div>
                                <div className="text-sm font-bold text-amber-900/60 dark:text-amber-200/60 uppercase tracking-widest">Total XP</div>
                            </div>
                        </Card>
                    </div>

                    <Card className="p-6">
                        <h4 className="font-bold mb-4">Current Level</h4>
                        <div className="flex items-end gap-4 mb-2">
                            <div className="text-5xl font-black text-amharic-green">Lv. {progress.level}</div>
                            <div className="text-slate-500 pb-1">Mastered <b>{progress.masteredWords.length}</b> words</div>
                        </div>
                        <div className="h-4 w-full bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden mt-4">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${(progress.totalXP % 100)}%` }}
                                className="h-full bg-amharic-green rounded-full"
                            />
                        </div>
                        <div className="text-right text-xs text-slate-400 mt-2 font-medium">
                            {100 - (progress.totalXP % 100)} XP to Next Level
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
