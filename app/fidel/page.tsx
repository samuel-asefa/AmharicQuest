'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fidelData } from '@/lib/data';
import { BookOpen } from 'lucide-react';

const orderNames = ['1st (ä)', '2nd (u)', '3rd (i)', '4th (a)', '5th (ē)', '6th (ə)', '7th (o)'];

export default function FidelPage() {
    const [activeBase, setActiveBase] = useState<string | null>(null);

    return (
        <div className="max-w-6xl mx-auto p-6 md:p-10">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-10"
            >
                <div className="chip chip-blue inline-flex mb-3">
                    <BookOpen className="w-3 h-3" />
                    Alphabet
                </div>
                <h1 className="text-4xl md:text-5xl font-black mb-3" style={{ color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
                    The Amharic Fidel
                </h1>
                <p className="font-600 text-lg max-w-2xl" style={{ color: 'var(--text-secondary)' }}>
                    Each symbol represents a consonant-vowel pair. Tap any character to see its 7 distinctive forms.
                </p>
            </motion.div>

            {/* Character grid */}
            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-9 gap-2.5 md:gap-3 mb-8">
                {fidelData.map((group, i) => {
                    const baseChar = group.family[0];
                    const isActive = activeBase === group.basePhonetic;

                    return (
                        <motion.button
                            key={group.basePhonetic}
                            onClick={() => setActiveBase(isActive ? null : group.basePhonetic)}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.02 }}
                            whileTap={{ y: isActive ? 0 : 2, scale: 0.97 }}
                            className="aspect-square rounded-2xl flex flex-col items-center justify-center gap-1 transition-all duration-100"
                            style={isActive ? {
                                backgroundColor: 'var(--duo-green)',
                                border: '2px solid var(--duo-green-border)',
                                boxShadow: '0 3px 0 0 var(--duo-green-border)',
                                color: 'white',
                            } : {
                                backgroundColor: 'var(--surface)',
                                border: '2px solid var(--border)',
                                boxShadow: '0 3px 0 0 var(--border)',
                                color: 'var(--text-primary)',
                            }}
                        >
                            <span className="text-2xl md:text-3xl font-black leading-none">{baseChar.char}</span>
                            <span className="text-[9px] font-800 uppercase tracking-wider"
                                style={{ color: isActive ? 'rgba(255,255,255,0.8)' : 'var(--text-muted)' }}>
                                {group.basePhonetic}
                            </span>
                        </motion.button>
                    );
                })}
            </div>

            {/* Expanded family panel */}
            <AnimatePresence mode="wait">
                {activeBase && (
                    <motion.div
                        key={activeBase}
                        initial={{ opacity: 0, y: 16, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: 'auto' }}
                        exit={{ opacity: 0, y: -8, height: 0 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        className="overflow-hidden"
                    >
                        <div className="rounded-2xl p-6 md:p-8"
                            style={{
                                backgroundColor: 'var(--surface)',
                                border: '2px solid var(--duo-green)',
                                boxShadow: '0 4px 0 0 var(--duo-green-border)',
                            }}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <h2 className="font-900 text-xl" style={{ color: 'var(--text-primary)' }}>
                                        Family of
                                    </h2>
                                    <span className="chip chip-green text-base font-900 px-4 py-1.5">
                                        {activeBase}
                                    </span>
                                </div>
                                <button
                                    onClick={() => setActiveBase(null)}
                                    className="w-9 h-9 flex items-center justify-center rounded-xl font-800 text-sm transition-all"
                                    style={{
                                        backgroundColor: 'var(--bg-tertiary)',
                                        color: 'var(--text-secondary)',
                                        border: '2px solid var(--border)',
                                    }}
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
                                {fidelData.find(g => g.basePhonetic === activeBase)?.family.map((item, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.04 }}
                                        className="flex flex-col items-center justify-center p-4 rounded-xl transition-all duration-100 cursor-default group"
                                        style={{
                                            backgroundColor: 'var(--bg-secondary)',
                                            border: '2px solid var(--border)',
                                            boxShadow: '0 3px 0 0 var(--border)',
                                        }}
                                    >
                                        <span className="text-4xl md:text-5xl font-black mb-3"
                                            style={{ color: 'var(--text-primary)' }}>
                                            {item.char}
                                        </span>
                                        <div className="font-800 text-sm px-3 py-1.5 rounded-lg w-full text-center mb-1"
                                            style={{
                                                backgroundColor: 'var(--duo-green)',
                                                color: 'white',
                                                boxShadow: '0 2px 0 0 var(--duo-green-border)',
                                            }}>
                                            {item.phonetic}
                                        </div>
                                        <div className="text-[9px] font-700 uppercase tracking-wider"
                                            style={{ color: 'var(--text-muted)' }}>
                                            {orderNames[idx]}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
