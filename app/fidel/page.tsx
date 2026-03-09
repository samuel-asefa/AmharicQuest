'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fidelData } from '@/lib/data';
import { Card } from '@/components/ui/card';

const orderNames = ['1st (ä)', '2nd (u)', '3rd (i)', '4th (a)', '5th (ē)', '6th (ə)', '7th (o)'];

export default function FidelPage() {
    const [activeBase, setActiveBase] = useState<string | null>(null);

    return (
        <div className="max-w-6xl mx-auto p-6 md:p-12">
            <div className="mb-10 text-center md:text-left">
                <h1 className="text-4xl md:text-6xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-amharic-green via-amharic-yellow to-amharic-red py-2">
                    The Amharic Fidel
                </h1>
                <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
                    Amharic uses an abugida writing system where each symbol represents a consonant-vowel pair. Click any base character to see its 7 distinctive forms.
                </p>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-3 md:gap-4">
                {fidelData.map((group) => {
                    const baseChar = group.family[0];
                    const isActive = activeBase === group.basePhonetic;

                    return (
                        <div key={group.basePhonetic} className="relative">
                            <motion.button
                                onClick={() => setActiveBase(isActive ? null : group.basePhonetic)}
                                className={`w-full aspect-square rounded-2xl flex flex-col items-center justify-center transition-all ${isActive
                                        ? 'bg-amharic-green text-white shadow-lg shadow-amharic-green/30 scale-105 z-10'
                                        : 'glass-card hover:bg-slate-50 dark:hover:bg-zinc-800 hover:scale-105'
                                    }`}
                                whileHover={{ scale: isActive ? 1.05 : 1.1 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <span className="text-3xl md:text-4xl font-bold mb-1">{baseChar.char}</span>
                                <span className={`text-xs font-bold uppercase tracking-wider ${isActive ? 'text-green-100' : 'text-slate-400'}`}>
                                    {group.basePhonetic}
                                </span>
                            </motion.button>
                        </div>
                    );
                })}
            </div>

            <AnimatePresence mode="wait">
                {activeBase && (
                    <motion.div
                        key={activeBase}
                        initial={{ opacity: 0, y: 20, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: 'auto' }}
                        exit={{ opacity: 0, scale: 0.95, height: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="mt-12 overflow-hidden"
                    >
                        <Card className="p-6 md:p-8 bg-gradient-to-br from-white to-slate-50 dark:from-zinc-900 dark:to-zinc-950 border-2 border-amharic-green/20">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-2xl font-bold flex items-center gap-3">
                                    <span className="text-slate-700 dark:text-slate-300">Family of</span>
                                    <span className="px-4 py-1.5 bg-amharic-green/10 dark:bg-amharic-green/20 rounded-xl text-amharic-green font-black uppercase tracking-widest border border-amharic-green/20">
                                        {activeBase}
                                    </span>
                                </h2>
                                <button
                                    onClick={() => setActiveBase(null)}
                                    className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-900 dark:bg-zinc-800 dark:text-slate-400 dark:hover:bg-zinc-700 dark:hover:text-slate-100 transition-colors focus:ring-2 ring-amharic-green outline-none"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="grid grid-cols-2 flex-wrap sm:grid-cols-4 md:grid-cols-7 gap-4">
                                {fidelData.find(g => g.basePhonetic === activeBase)?.family.map((item, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="flex flex-col items-center justify-center p-4 rounded-xl bg-white dark:bg-zinc-950 border shadow-sm group hover:border-amharic-green/50 hover:shadow-md transition-all cursor-pointer relative overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-amharic-green/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />

                                        <span className="relative z-10 text-4xl md:text-5xl font-bold mb-3 group-hover:text-amharic-green transition-colors">{item.char}</span>

                                        <div className="relative z-10 w-full">
                                            <div className="text-sm font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-zinc-800 px-2 py-1.5 rounded-lg text-center mb-1 group-hover:bg-amharic-green group-hover:text-white transition-colors">
                                                {item.phonetic}
                                            </div>
                                            <div className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold text-center">
                                                {orderNames[idx]}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
