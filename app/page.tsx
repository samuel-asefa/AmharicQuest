'use client';

import { motion, Variants } from 'framer-motion';
import Link from 'next/link';
import { useAppStore } from '@/lib/store';
import { BookOpen, Library, GraduationCap, Flame, Zap, Trophy, ArrowRight, Target, Star } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { mockLessonsData } from '@/lib/data';

const staggerContainer: Variants = {
    hidden: {},
    show: {
        transition: {
            staggerChildren: 0.07,
        },
    },
};

const fadeUp: Variants = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' as const } },
};

export default function Dashboard() {
    const { progress } = useAppStore();

    const nextLesson = mockLessonsData.find(l => !progress.completedLessons.includes(l.id)) || mockLessonsData[mockLessonsData.length - 1];
    const totalLessons = mockLessonsData.length;
    const completedLessonsCount = progress.completedLessons.length;
    const progressPercentage = Math.round((completedLessonsCount / totalLessons) * 100) || 0;

    const dailyGoalXP = 50;
    const currentDailyXP = Math.min(progress.totalXP % dailyGoalXP, dailyGoalXP);
    const dailyProgress = Math.round((currentDailyXP / dailyGoalXP) * 100);

    return (
        <div className="max-w-5xl mx-auto p-6 md:p-10">
            {/* Page Header */}
            <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="show"
                className="mb-10"
            >
                <motion.div variants={fadeUp}>
                    <div className="inline-flex items-center gap-2 mb-3 chip chip-green">
                        <Star className="w-3 h-3" />
                        Keep up your streak!
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black mb-2" style={{ color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
                        Good evening! 👋
                    </h1>
                    <p className="text-lg font-600" style={{ color: 'var(--text-secondary)' }}>
                        Ready to continue your Amharic journey?
                    </p>
                </motion.div>
            </motion.div>

            <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
                {/* Left: Main content */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Stats Row */}
                    <motion.div variants={fadeUp} className="grid grid-cols-3 gap-4">
                        {/* Streak */}
                        <div className="stat-card flex-col items-start gap-2 p-4">
                            <Flame className="w-7 h-7" style={{ color: 'var(--duo-orange)' }} />
                            <div>
                                <div className="text-3xl font-900" style={{ color: 'var(--text-primary)' }}>
                                    {progress.streak}
                                </div>
                                <div className="text-xs font-700 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                                    Day Streak
                                </div>
                            </div>
                        </div>

                        {/* XP */}
                        <div className="stat-card flex-col items-start gap-2 p-4">
                            <Zap className="w-7 h-7" style={{ color: 'var(--duo-yellow)' }} />
                            <div>
                                <div className="text-3xl font-900" style={{ color: 'var(--text-primary)' }}>
                                    {progress.totalXP}
                                </div>
                                <div className="text-xs font-700 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                                    Total XP
                                </div>
                            </div>
                        </div>

                        {/* Level */}
                        <div className="stat-card flex-col items-start gap-2 p-4">
                            <Trophy className="w-7 h-7" style={{ color: 'var(--duo-purple)' }} />
                            <div>
                                <div className="text-3xl font-900" style={{ color: 'var(--text-primary)' }}>
                                    {progress.level}
                                </div>
                                <div className="text-xs font-700 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                                    Level
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Continue Learning CTA */}
                    <motion.div variants={fadeUp}>
                        <Card accent="green" className="p-6 md:p-8 relative overflow-hidden">
                            {/* Decorative pattern */}
                            <div className="absolute top-0 right-0 opacity-5 text-[140px] font-black leading-none select-none pointer-events-none"
                                style={{ color: 'var(--duo-green)' }}>
                                አ
                            </div>

                            <div className="relative">
                                <div className="chip chip-green mb-4">
                                    <GraduationCap className="w-3 h-3" />
                                    Up Next
                                </div>

                                <h2 className="text-2xl md:text-3xl font-900 mb-2" style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                                    {nextLesson?.title || 'Course Complete!'}
                                </h2>
                                <p className="font-600 mb-6 max-w-sm" style={{ color: 'var(--text-secondary)' }}>
                                    {nextLesson?.description || 'You have mastered all lessons. Keep practicing!'}
                                </p>

                                <div className="flex flex-wrap gap-3 items-center">
                                    <Link href={nextLesson ? `/practice?lesson=${nextLesson.id}` : '/practice'}>
                                        <Button size="lg" variant="default" className="gap-2 text-sm">
                                            {nextLesson ? 'Continue Learning' : 'Practice Now'}
                                            <ArrowRight className="w-4 h-4" />
                                        </Button>
                                    </Link>
                                    {nextLesson && (
                                        <div className="xp-badge">
                                            <Zap className="w-3 h-3" />
                                            +{nextLesson.xpReward} XP
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Card>
                    </motion.div>

                    {/* Quick Practice */}
                    <motion.div variants={fadeUp}>
                        <h2 className="text-xl font-900 mb-4" style={{ color: 'var(--text-primary)' }}>
                            Quick Practice
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Link href="/fidel">
                                <Card interactive className="p-5 group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-black flex-shrink-0"
                                            style={{
                                                backgroundColor: 'rgba(28, 176, 246, 0.12)',
                                                border: '2px solid rgba(28, 176, 246, 0.2)',
                                                color: 'var(--duo-blue)',
                                            }}>
                                            አ
                                        </div>
                                        <div>
                                            <div className="font-800 text-base" style={{ color: 'var(--text-primary)' }}>
                                                Alphabet (Fidel)
                                            </div>
                                            <div className="text-sm font-600" style={{ color: 'var(--text-secondary)' }}>
                                                Master Amharic characters
                                            </div>
                                        </div>
                                        <ArrowRight className="w-4 h-4 ml-auto flex-shrink-0 opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all" style={{ color: 'var(--text-secondary)' }} />
                                    </div>
                                </Card>
                            </Link>

                            <Link href="/practice">
                                <Card interactive className="p-5 group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                                            style={{
                                                backgroundColor: 'rgba(255, 200, 0, 0.12)',
                                                border: '2px solid rgba(255, 200, 0, 0.25)',
                                                color: 'var(--duo-yellow)',
                                            }}>
                                            <Library className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <div className="font-800 text-base" style={{ color: 'var(--text-primary)' }}>
                                                Vocabulary Quiz
                                            </div>
                                            <div className="text-sm font-600" style={{ color: 'var(--text-secondary)' }}>
                                                Test your word knowledge
                                            </div>
                                        </div>
                                        <ArrowRight className="w-4 h-4 ml-auto flex-shrink-0 opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all" style={{ color: 'var(--text-secondary)' }} />
                                    </div>
                                </Card>
                            </Link>

                            <Link href="/lessons">
                                <Card interactive className="p-5 group sm:col-span-2">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                                            style={{
                                                backgroundColor: 'rgba(206, 130, 255, 0.12)',
                                                border: '2px solid rgba(206, 130, 255, 0.25)',
                                                color: 'var(--duo-purple)',
                                            }}>
                                            <BookOpen className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <div className="font-800 text-base" style={{ color: 'var(--text-primary)' }}>
                                                All Lessons
                                            </div>
                                            <div className="text-sm font-600" style={{ color: 'var(--text-secondary)' }}>
                                                View the full learning path — {completedLessonsCount} of {totalLessons} completed
                                            </div>
                                        </div>
                                        <ArrowRight className="w-4 h-4 ml-auto flex-shrink-0 opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all" style={{ color: 'var(--text-secondary)' }} />
                                    </div>
                                </Card>
                            </Link>
                        </div>
                    </motion.div>
                </div>

                {/* Right: Progress sidebar */}
                <div className="space-y-5">
                    <motion.div variants={fadeUp}>
                        <Card className="p-6">
                            <h3 className="font-900 text-lg mb-5" style={{ color: 'var(--text-primary)' }}>
                                Course Progress
                            </h3>

                            {/* Overall Progress */}
                            <div className="mb-6">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-700" style={{ color: 'var(--text-secondary)' }}>
                                        Lessons
                                    </span>
                                    <span className="text-sm font-900" style={{ color: 'var(--duo-green)' }}>
                                        {progressPercentage}%
                                    </span>
                                </div>
                                <div className="progress-track">
                                    <motion.div
                                        className="progress-fill-green"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${progressPercentage}%` }}
                                        transition={{ duration: 0.8, delay: 0.3, type: 'spring', stiffness: 60 }}
                                    />
                                </div>
                                <div className="text-xs font-600 mt-2" style={{ color: 'var(--text-muted)' }}>
                                    {completedLessonsCount} of {totalLessons} lessons
                                </div>
                            </div>

                            {/* Daily Goal */}
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <div className="flex items-center gap-1.5">
                                        <Target className="w-3.5 h-3.5" style={{ color: 'var(--duo-blue)' }} />
                                        <span className="text-sm font-700" style={{ color: 'var(--text-secondary)' }}>
                                            Daily Goal
                                        </span>
                                    </div>
                                    <span className="text-sm font-900" style={{ color: 'var(--duo-blue)' }}>
                                        {currentDailyXP}<span className="font-600 text-xs" style={{ color: 'var(--text-muted)' }}>/{dailyGoalXP} XP</span>
                                    </span>
                                </div>
                                <div className="progress-track">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${dailyProgress}%` }}
                                        transition={{ duration: 0.8, delay: 0.5, type: 'spring', stiffness: 60 }}
                                        style={{
                                            height: '100%',
                                            backgroundColor: 'var(--duo-blue)',
                                            borderRadius: '999px',
                                            position: 'relative',
                                        }}
                                    >
                                        <div style={{
                                            position: 'absolute',
                                            top: 3,
                                            left: 4,
                                            right: 4,
                                            height: 4,
                                            background: 'rgba(255,255,255,0.4)',
                                            borderRadius: 999,
                                        }} />
                                    </motion.div>
                                </div>
                            </div>
                        </Card>
                    </motion.div>

                    {/* Streak Card */}
                    <motion.div variants={fadeUp}>
                        <Card className="p-6 text-center">
                            <div className="text-5xl mb-2">🔥</div>
                            <div className="text-4xl font-900 mb-1" style={{ color: 'var(--text-primary)' }}>
                                {progress.streak}
                            </div>
                            <div className="text-sm font-700 uppercase tracking-wider mb-4" style={{ color: 'var(--text-muted)' }}>
                                Day Streak
                            </div>
                            <div className="text-sm font-600 p-3 rounded-xl" style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}>
                                {progress.streak === 0
                                    ? "Start your streak today! 💪"
                                    : progress.streak < 3
                                        ? "You're building momentum! ✨"
                                        : "You're on fire! Keep going! 🌟"}
                            </div>
                        </Card>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
}
