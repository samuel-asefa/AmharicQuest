'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, Variants } from 'framer-motion';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAppStore } from '@/lib/store';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LogOut, User as UserIcon, Flame, Zap, Trophy, Settings, Award } from 'lucide-react';

const staggerContainer: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08 } },
};
const fadeUp: Variants = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' as const } },
};

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
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="text-4xl mb-3 animate-bounce-in">አ</div>
                    <div className="font-700" style={{ color: 'var(--text-muted)' }}>Loading...</div>
                </div>
            </div>
        );
    }

    if (!user) return null;

    const xpToNextLevel = 100 - (progress.totalXP % 100);
    const levelProgress = progress.totalXP % 100;

    return (
        <div className="max-w-4xl mx-auto p-6 md:p-10">
            {/* Page header */}
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start justify-between mb-10"
            >
                <div>
                    <div className="chip chip-blue inline-flex mb-3">
                        <UserIcon className="w-3 h-3" />
                        Profile
                    </div>
                    <h1 className="text-4xl font-black" style={{ color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
                        Your Profile
                    </h1>
                </div>
                <Button
                    variant="outline"
                    onClick={handleLogout}
                    className="gap-2 mt-1"
                    style={{ color: 'var(--duo-red)', borderColor: 'rgba(255, 75, 75, 0.3)', boxShadow: '0 4px 0 0 rgba(255, 75, 75, 0.2)' }}
                >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                </Button>
            </motion.div>

            <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
                {/* User card */}
                <motion.div variants={fadeUp}>
                    <Card className="p-6 flex flex-col items-center text-center relative overflow-hidden">
                        {/* Header gradient strip */}
                        <div className="absolute top-0 inset-x-0 h-20 rounded-t-2xl"
                            style={{ background: 'linear-gradient(135deg, var(--duo-green), var(--duo-blue))' }} />

                        {/* Avatar */}
                        <div className="relative z-10 mt-8 mb-4">
                            <div className="w-20 h-20 rounded-full flex items-center justify-center"
                                style={{
                                    backgroundColor: 'var(--bg-primary)',
                                    border: '3px solid var(--duo-green)',
                                    boxShadow: '0 4px 0 0 var(--duo-green-border)',
                                }}>
                                <UserIcon className="w-10 h-10" style={{ color: 'var(--duo-green)' }} />
                            </div>
                        </div>

                        <h2 className="font-900 text-xl mb-0.5" style={{ color: 'var(--text-primary)' }}>
                            {user.displayName || 'Amharic Learner'}
                        </h2>
                        <p className="text-sm font-600 mb-5" style={{ color: 'var(--text-muted)' }}>
                            {user.email}
                        </p>

                        <Button variant="outline" className="w-full gap-2 text-xs">
                            <Settings className="w-4 h-4" />
                            Account Settings
                        </Button>
                    </Card>
                </motion.div>

                {/* Stats cards */}
                <div className="md:col-span-2 space-y-4">
                    <motion.div variants={fadeUp}>
                        <h2 className="font-900 text-lg mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                            <Award className="w-5 h-5" style={{ color: 'var(--duo-green)' }} />
                            Learning Statistics
                        </h2>
                        <div className="grid grid-cols-3 gap-3">
                            <div className="stat-card flex-col items-start gap-2 p-4">
                                <Flame className="w-6 h-6" style={{ color: 'var(--duo-orange)' }} />
                                <div className="text-3xl font-900" style={{ color: 'var(--text-primary)' }}>
                                    {progress.streak}
                                </div>
                                <div className="text-[10px] font-800 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                                    Day Streak
                                </div>
                            </div>
                            <div className="stat-card flex-col items-start gap-2 p-4">
                                <Zap className="w-6 h-6" style={{ color: 'var(--duo-yellow)' }} />
                                <div className="text-3xl font-900" style={{ color: 'var(--text-primary)' }}>
                                    {progress.totalXP}
                                </div>
                                <div className="text-[10px] font-800 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                                    Total XP
                                </div>
                            </div>
                            <div className="stat-card flex-col items-start gap-2 p-4">
                                <Trophy className="w-6 h-6" style={{ color: 'var(--duo-purple)' }} />
                                <div className="text-3xl font-900" style={{ color: 'var(--text-primary)' }}>
                                    {progress.masteredWords.length}
                                </div>
                                <div className="text-[10px] font-800 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                                    Words Mastered
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Level card */}
                    <motion.div variants={fadeUp}>
                        <Card className="p-6" accent="blue">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-900 text-lg" style={{ color: 'var(--text-primary)' }}>
                                    Current Level
                                </h3>
                                <span className="chip chip-blue text-base font-900 px-4 py-1.5">
                                    Level {progress.level}
                                </span>
                            </div>

                            <div className="mb-3">
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="font-700" style={{ color: 'var(--text-secondary)' }}>
                                        XP Progress
                                    </span>
                                    <span className="font-900" style={{ color: 'var(--duo-blue)' }}>
                                        {levelProgress}/100 XP
                                    </span>
                                </div>
                                <div className="progress-track">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${levelProgress}%` }}
                                        transition={{ duration: 0.8, delay: 0.5, type: 'spring', stiffness: 60 }}
                                        style={{
                                            height: '100%',
                                            backgroundColor: 'var(--duo-blue)',
                                            borderRadius: 999,
                                            position: 'relative',
                                        }}
                                    >
                                        <div style={{ position: 'absolute', top: 3, left: 4, right: 4, height: 4, background: 'rgba(255,255,255,0.4)', borderRadius: 999 }} />
                                    </motion.div>
                                </div>
                            </div>
                            <p className="text-xs font-700" style={{ color: 'var(--text-muted)' }}>
                                {xpToNextLevel} XP to Level {progress.level + 1}
                            </p>
                        </Card>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
}
