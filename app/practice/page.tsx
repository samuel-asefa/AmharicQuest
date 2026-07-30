'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { vocabularyData } from '@/lib/data';
import { VocabularyItem } from '@/lib/types';
import { CheckCircle, XCircle, ArrowRight, Zap, Flame } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';

type QuizMode = 'amharic-to-english' | 'english-to-amharic';

export default function PracticePage() {
    const { progress, addXP, masterWord } = useAppStore();
    const [mode, setMode] = useState<QuizMode>('amharic-to-english');
    const [currentCard, setCurrentCard] = useState<VocabularyItem | null>(null);
    const [options, setOptions] = useState<string[]>([]);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [streak, setStreak] = useState(0);

    useEffect(() => {
        generateQuestion();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mode]);

    const generateQuestion = () => {
        const randomCard = vocabularyData[Math.floor(Math.random() * vocabularyData.length)];
        setCurrentCard(randomCard);

        const correctAnswer = mode === 'amharic-to-english' ? randomCard.english : randomCard.amharic;
        const wrongOptions = vocabularyData
            .filter((v: VocabularyItem) => v.id !== randomCard.id)
            .sort(() => Math.random() - 0.5)
            .slice(0, 3)
            .map((v: VocabularyItem) => mode === 'amharic-to-english' ? v.english : v.amharic);

        const allOptions = [correctAnswer, ...wrongOptions].sort(() => Math.random() - 0.5);
        setOptions(allOptions);
        setSelectedAnswer(null);
        setShowResult(false);
    };

    const handleAnswer = (answer: string) => {
        if (showResult) return;
        setSelectedAnswer(answer);
        setShowResult(true);

        const correctAnswer = mode === 'amharic-to-english' ? currentCard?.english : currentCard?.amharic;
        const isCorrect = answer === correctAnswer;

        if (isCorrect) {
            setStreak(s => s + 1);
            const xpGain = 10 + Math.min(streak * 2, 20);
            addXP(xpGain);
            if (currentCard) masterWord(currentCard.id);
        } else {
            setStreak(0);
        }
    };

    if (!currentCard) return null;

    const correctAnswer = mode === 'amharic-to-english' ? currentCard.english : currentCard.amharic;
    const isCorrect = selectedAnswer === correctAnswer;

    return (
        <div className="max-w-2xl mx-auto p-6 md:p-10 min-h-screen flex flex-col">

            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                {/* Mode Toggle */}
                <div className="flex p-1 rounded-xl gap-1"
                    style={{ backgroundColor: 'var(--bg-tertiary)', border: '2px solid var(--border)' }}
                >
                    {(['amharic-to-english', 'english-to-amharic'] as QuizMode[]).map((m) => (
                        <button
                            key={m}
                            onClick={() => setMode(m)}
                            className="px-3 py-1.5 rounded-lg text-xs font-800 uppercase tracking-wide transition-all"
                            style={mode === m ? {
                                backgroundColor: 'var(--bg-primary)',
                                color: 'var(--text-primary)',
                                boxShadow: '0 2px 0 0 var(--border)',
                            } : {
                                color: 'var(--text-muted)',
                            }}
                        >
                            {m === 'amharic-to-english' ? 'አ → EN' : 'EN → አ'}
                        </button>
                    ))}
                </div>

                {/* Stats */}
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl"
                        style={{ backgroundColor: 'rgba(255, 150, 0, 0.1)', border: '1.5px solid rgba(255, 150, 0, 0.25)' }}>
                        <Flame className="w-4 h-4" style={{ color: 'var(--duo-orange)' }} />
                        <span className="font-900 text-sm" style={{ color: 'var(--duo-orange)' }}>{streak}</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl"
                        style={{ backgroundColor: 'rgba(88, 204, 2, 0.1)', border: '1.5px solid rgba(88, 204, 2, 0.25)' }}>
                        <Zap className="w-4 h-4" style={{ color: 'var(--duo-green)' }} />
                        <span className="font-900 text-sm" style={{ color: 'var(--duo-green)' }}>Lv. {progress.level}</span>
                    </div>
                </div>
            </div>

            {/* Progress bar */}
            <div className="progress-track mb-8" style={{ height: 10 }}>
                <motion.div
                    className="progress-fill-green"
                    animate={{ width: `${Math.min(streak * 10, 100)}%` }}
                    transition={{ type: 'spring', stiffness: 80 }}
                />
            </div>

            {/* Question Card */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentCard.id}
                    initial={{ opacity: 0, y: 20, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.97 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                    className="flex-1 flex flex-col"
                >
                    {/* Prompt card */}
                    <div className="rounded-2xl p-8 md:p-12 mb-6 text-center relative overflow-hidden"
                        style={{
                            backgroundColor: 'var(--surface)',
                            border: '2px solid var(--border)',
                            boxShadow: '0 4px 0 0 var(--border)',
                        }}>
                        {/* Top accent bar */}
                        <div className="absolute top-0 inset-x-0 h-1 rounded-t-2xl"
                            style={{ background: 'linear-gradient(90deg, var(--duo-green), var(--duo-blue), var(--duo-purple))' }} />

                        <div className="text-xs font-800 uppercase tracking-widest mb-5" style={{ color: 'var(--text-muted)' }}>
                            {mode === 'amharic-to-english' ? 'What does this mean?' : 'How do you say this in Amharic?'}
                        </div>

                        <div className="font-black mb-4 leading-none"
                            style={{
                                fontSize: mode === 'amharic-to-english' ? 'clamp(3rem, 12vw, 6rem)' : 'clamp(2rem, 6vw, 3.5rem)',
                                color: 'var(--text-primary)',
                                letterSpacing: '-0.02em',
                            }}>
                            {mode === 'amharic-to-english' ? currentCard.amharic : currentCard.english}
                        </div>

                        {mode === 'amharic-to-english' && (
                            <div className="font-600 text-xl" style={{ color: 'var(--text-muted)' }}>
                                {currentCard.phonetic}
                            </div>
                        )}
                    </div>

                    {/* Answer options */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                        {options.map((option, index) => {
                            let btnClass = 'answer-btn';
                            if (showResult) {
                                if (option === correctAnswer) btnClass += ' answer-btn-correct';
                                else if (option === selectedAnswer) btnClass += ' answer-btn-incorrect';
                            }

                            return (
                                <motion.button
                                    key={index}
                                    className={btnClass}
                                    onClick={() => handleAnswer(option)}
                                    disabled={showResult}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.06 }}
                                    whileHover={!showResult ? { y: -1 } : {}}
                                    whileTap={!showResult ? { y: 3, boxShadow: '0 0px 0 0 var(--border)' } : {}}
                                >
                                    <span className="font-700">{option}</span>
                                    {showResult && option === correctAnswer && (
                                        <CheckCircle className="w-6 h-6 flex-shrink-0" style={{ color: 'var(--duo-green)' }} />
                                    )}
                                    {showResult && option === selectedAnswer && option !== correctAnswer && (
                                        <XCircle className="w-6 h-6 flex-shrink-0" style={{ color: 'var(--duo-red)' }} />
                                    )}
                                </motion.button>
                            );
                        })}
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Result feedback bar */}
            <AnimatePresence>
                {showResult && (
                    <motion.div
                        initial={{ opacity: 0, y: 60 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 60 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                        className="fixed bottom-[72px] md:bottom-0 left-0 right-0 z-40 p-4 md:p-6"
                        style={isCorrect ? {
                            backgroundColor: 'var(--duo-green)',
                            borderTop: '3px solid var(--duo-green-border)',
                        } : {
                            backgroundColor: 'var(--bg-primary)',
                            borderTop: '3px solid rgba(255, 75, 75, 0.3)',
                        }}
                    >
                        <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
                            <div>
                                {isCorrect ? (
                                    <div>
                                        <div className="text-2xl font-900 text-white mb-0.5">Excellent! 🎉</div>
                                        <div className="font-700 text-white/80 text-sm">+{10 + Math.min((streak - 1) * 2, 20)} XP earned</div>
                                    </div>
                                ) : (
                                    <div>
                                        <div className="text-2xl font-900 mb-1" style={{ color: 'var(--duo-red)' }}>
                                            Correct answer:
                                        </div>
                                        <div className="font-700 text-lg" style={{ color: 'var(--text-primary)' }}>
                                            {currentCard.amharic}
                                            {currentCard.phonetic && <span className="font-600 opacity-70"> ({currentCard.phonetic})</span>}
                                            {' = '}{currentCard.english}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <Button
                                variant={isCorrect ? "secondary" : "destructive"}
                                size="lg"
                                onClick={generateQuestion}
                                className="gap-2 flex-shrink-0"
                            >
                                Continue <ArrowRight className="w-4 h-4" />
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}