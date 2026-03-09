'use client';
import { motion } from 'framer-motion';
import { mockLessonsData } from '@/lib/data';
import { useAppStore } from '@/lib/store';
import { BookOpen, CheckCircle, Lock, Star } from 'lucide-react';
import Link from 'next/link';

export default function LessonsPage() {
    const { progress } = useAppStore();
    const { completedLessons } = progress;

    return (
        <div className="max-w-4xl mx-auto p-6 md:p-12">
            <div className="mb-12 text-center md:text-left">
                <h1 className="text-4xl md:text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-amharic-green via-amharic-yellow to-amharic-red">
                    Learning Path
                </h1>
                <p className="text-lg text-slate-600 dark:text-slate-400">
                    Follow the guided path to master conversational Amharic step by step.
                </p>
            </div>

            <div className="relative pt-8 pb-40">
                {/* Winding path line behind nodes */}
                <div className="absolute left-[2.25rem] md:left-1/2 top-10 bottom-10 w-2 bg-slate-200 dark:bg-zinc-800 -translate-x-[0.5rem] md:-translate-x-1/2 rounded-full overflow-hidden z-0">
                    <div
                        className="absolute top-0 left-0 right-0 bg-amharic-green transition-all duration-1000 ease-in-out"
                        style={{ height: `${Math.min((completedLessons.length / mockLessonsData.length) * 100 + 5, 100)}%` }}
                    />
                </div>

                <div className="space-y-32">
                    {mockLessonsData.map((lesson, index) => {
                        const isCompleted = completedLessons.includes(lesson.id);
                        // First lesson is always unlocked. Others are unlocked if previous is complete.
                        const isUnlocked = index === 0 || completedLessons.includes(mockLessonsData[index - 1].id);
                        const isCurrent = isUnlocked && !isCompleted;

                        // Alternate left/right on desktop
                        const isRight = index % 2 !== 0;

                        return (
                            <div
                                key={lesson.id}
                                className={`relative flex items-center md:justify-center z-10 ${!isUnlocked ? 'opacity-60' : ''}`}
                            >
                                {/* Desktop Card (Left or Right) */}
                                <div className={`hidden md:block absolute w-[calc(50%-4rem)] ${isRight ? 'left-[calc(50%+4rem)]' : 'right-[calc(50%+4rem)]'}`}>
                                    <motion.div
                                        initial={{ opacity: 0, x: isRight ? 20 : -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true, margin: "-100px" }}
                                        transition={{ type: "spring", stiffness: 200, damping: 20 }}
                                    >
                                        <Link href={`/practice?lesson=${lesson.id}`} className={isUnlocked ? 'cursor-pointer' : 'cursor-not-allowed pointer-events-none'}>
                                            <div className={`glass-card p-6 rounded-2xl border-2 transition-all hover:scale-105 active:scale-95 ${isCurrent ? 'border-amharic-green shadow-lg shadow-amharic-green/20' :
                                                isCompleted ? 'border-amharic-yellow/50 bg-amharic-yellow/5' :
                                                    'border-slate-200 dark:border-zinc-800'
                                                }`}>
                                                <div className="flex justify-between items-start mb-2">
                                                    <h3 className={`text-xl font-bold ${isCurrent ? 'text-amharic-green' : isCompleted ? 'text-slate-800 dark:text-slate-200' : 'text-slate-500'}`}>
                                                        {lesson.title}
                                                    </h3>
                                                    {isCompleted && <CheckCircle className="w-6 h-6 text-amharic-yellow fill-amharic-yellow/20" />}
                                                    {!isUnlocked && <Lock className="w-5 h-5 text-slate-400" />}
                                                </div>
                                                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{lesson.description}</p>
                                                <div className="flex items-center gap-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
                                                    <span className="flex items-center gap-1 bg-slate-100 dark:bg-zinc-800 px-3 py-1 rounded-full">
                                                        <BookOpen className="w-3 h-3" /> {lesson.items.length} words
                                                    </span>
                                                    <span className="flex items-center gap-1 bg-amharic-yellow/20 text-amharic-yellow px-3 py-1 rounded-full border border-amharic-yellow/30">
                                                        <Star className="w-3 h-3 fill-current" /> {lesson.xpReward} XP
                                                    </span>
                                                </div>
                                            </div>
                                        </Link>
                                    </motion.div>
                                </div>

                                {/* Mobile Card Layout */}
                                <div className="block md:hidden ml-20 w-full pr-4">
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true, margin: "-100px" }}
                                    >
                                        <Link href={`/practice?lesson=${lesson.id}`} className={isUnlocked ? 'cursor-pointer' : 'cursor-not-allowed pointer-events-none'}>
                                            <div className={`glass-card p-5 rounded-2xl border-2 ${isCurrent ? 'border-amharic-green shadow-lg shadow-amharic-green/20' :
                                                isCompleted ? 'border-amharic-yellow/50' :
                                                    'border-slate-200 dark:border-zinc-800'
                                                }`}>
                                                <div className="flex justify-between items-center mb-1">
                                                    <h3 className="text-lg font-bold">{lesson.title}</h3>
                                                    {isCompleted && <CheckCircle className="w-5 h-5 text-amharic-yellow" />}
                                                    {!isUnlocked && <Lock className="w-4 h-4 text-slate-400" />}
                                                </div>
                                                <p className="text-xs text-slate-500 mb-3">{lesson.description}</p>
                                                <div className="flex text-[10px] gap-2 font-bold uppercase tracking-wider text-slate-500">
                                                    <span className="bg-slate-100 dark:bg-zinc-800 px-2 py-1 rounded-md">{lesson.items.length} words</span>
                                                    <span className="text-amharic-yellow bg-amharic-yellow/10 px-2 py-1 rounded-md">+{lesson.xpReward} XP</span>
                                                </div>
                                            </div>
                                        </Link>
                                    </motion.div>
                                </div>

                                {/* Central Node Icon */}
                                <motion.div
                                    initial={{ scale: 0 }}
                                    whileInView={{ scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                    className={`absolute left-4 md:left-1/2 md:-translate-x-1/2 w-16 h-16 rounded-full flex items-center justify-center border-4 z-20 shadow-xl ${isCurrent ? 'bg-amharic-green border-white dark:border-zinc-950 text-white scale-110' :
                                        isCompleted ? 'bg-amharic-yellow border-white dark:border-zinc-950 text-amber-900' :
                                            'bg-slate-200 dark:bg-zinc-800 border-slate-100 dark:border-zinc-900 text-slate-400'
                                        }`}
                                >
                                    {isCompleted ? <Star className="w-8 h-8 fill-current" /> :
                                        isCurrent ? <BookOpen className="w-7 h-7" /> :
                                            <Lock className="w-6 h-6" />}
                                </motion.div>

                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
