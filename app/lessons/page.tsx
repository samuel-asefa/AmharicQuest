'use client';

import { motion } from 'framer-motion';
import { mockLessonsData } from '@/lib/data';
import { useAppStore } from '@/lib/store';
import { BookOpen, CheckCircle, Lock, Zap, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function LessonsPage() {
    const { progress } = useAppStore();
    const { completedLessons } = progress;

    return (
        <div className="max-w-2xl mx-auto p-6 md:p-10">
            {/* Page header */}
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-10"
            >
                <div className="chip chip-blue inline-flex mb-3">
                    <BookOpen className="w-3 h-3" />
                    Learning Path
                </div>
                <h1 className="text-4xl md:text-5xl font-black mb-3" style={{ color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
                    Your Journey
                </h1>
                <p className="font-600 text-lg" style={{ color: 'var(--text-secondary)' }}>
                    Master conversational Amharic step by step.
                </p>
            </motion.div>

            {/* Overall Progress */}
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="rounded-2xl p-5 mb-8"
                style={{
                    backgroundColor: 'var(--surface)',
                    border: '2px solid var(--border)',
                    boxShadow: '0 4px 0 0 var(--border)',
                }}
            >
                <div className="flex justify-between items-center mb-3">
                    <span className="font-700 text-sm" style={{ color: 'var(--text-secondary)' }}>
                        Overall Progress
                    </span>
                    <span className="font-900 text-sm" style={{ color: 'var(--duo-green)' }}>
                        {completedLessons.length} / {mockLessonsData.length} lessons
                    </span>
                </div>
                <div className="progress-track">
                    <motion.div
                        className="progress-fill-green"
                        initial={{ width: 0 }}
                        animate={{ width: `${(completedLessons.length / mockLessonsData.length) * 100}%` }}
                        transition={{ duration: 0.8, delay: 0.3, type: 'spring', stiffness: 60 }}
                    />
                </div>
            </motion.div>

            {/* Lesson list */}
            <div className="space-y-4">
                {mockLessonsData.map((lesson, index) => {
                    const isCompleted = completedLessons.includes(lesson.id);
                    const isUnlocked = index === 0 || completedLessons.includes(mockLessonsData[index - 1].id);
                    const isCurrent = isUnlocked && !isCompleted;

                    return (
                        <motion.div
                            key={lesson.id}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.06 }}
                        >
                            <Link
                                href={isUnlocked ? `/practice?lesson=${lesson.id}` : '#'}
                                className={!isUnlocked ? 'pointer-events-none' : ''}
                            >
                                <div
                                    className="rounded-2xl p-5 flex items-center gap-4 transition-all duration-150"
                                    style={{
                                        backgroundColor: 'var(--surface)',
                                        border: `2px solid ${isCurrent ? 'var(--duo-green)' : isCompleted ? 'var(--duo-yellow)' : 'var(--border)'}`,
                                        boxShadow: `0 4px 0 0 ${isCurrent ? 'var(--duo-green-border)' : isCompleted ? 'var(--duo-yellow-border)' : 'var(--border)'}`,
                                        opacity: isUnlocked ? 1 : 0.5,
                                        cursor: isUnlocked ? 'pointer' : 'not-allowed',
                                    }}
                                >
                                    {/* Node icon */}
                                    <div
                                        className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 font-black text-xl"
                                        style={{
                                            backgroundColor: isCurrent
                                                ? 'var(--duo-green)'
                                                : isCompleted
                                                    ? 'var(--duo-yellow)'
                                                    : 'var(--bg-tertiary)',
                                            color: isCurrent ? 'white' : isCompleted ? '#5d4100' : 'var(--text-muted)',
                                            boxShadow: `0 3px 0 0 ${isCurrent ? 'var(--duo-green-border)' : isCompleted ? 'var(--duo-yellow-border)' : 'var(--border)'}`,
                                        }}
                                    >
                                        {isCompleted ? (
                                            <CheckCircle className="w-7 h-7" />
                                        ) : isCurrent ? (
                                            <BookOpen className="w-7 h-7" />
                                        ) : (
                                            <Lock className="w-6 h-6" />
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            {isCurrent && (
                                                <span className="chip chip-green text-[10px]">Current</span>
                                            )}
                                            {isCompleted && (
                                                <span className="chip chip-yellow text-[10px]">Completed</span>
                                            )}
                                        </div>
                                        <h3 className="font-900 text-base truncate" style={{ color: 'var(--text-primary)' }}>
                                            {lesson.title}
                                        </h3>
                                        <p className="text-sm font-600 truncate mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                                            {lesson.description}
                                        </p>
                                        <div className="flex items-center gap-3 mt-2">
                                            <span className="flex items-center gap-1 text-xs font-700"
                                                style={{ color: 'var(--text-muted)' }}>
                                                <BookOpen className="w-3 h-3" />
                                                {lesson.items.length} words
                                            </span>
                                            <span className="xp-badge">
                                                <Zap className="w-2.5 h-2.5" />
                                                +{lesson.xpReward} XP
                                            </span>
                                        </div>
                                    </div>

                                    {/* Arrow */}
                                    {isUnlocked && (
                                        <ChevronRight className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--text-muted)' }} />
                                    )}
                                </div>
                            </Link>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
