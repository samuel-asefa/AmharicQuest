'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { vocabularyData } from '@/lib/data';
import { VocabularyItem } from '@/lib/types';
import { RotateCw, CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

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
      const xpGain = 10 + Math.min(streak * 2, 20); // Bonus XP for streaks
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
    <div className="max-w-3xl mx-auto p-6 md:p-12 min-h-screen flex flex-col justify-center">

      <div className="flex justify-between items-center mb-8">
        <div className="flex gap-2 bg-slate-100 dark:bg-zinc-900 p-1 rounded-xl">
          <button
            onClick={() => setMode('amharic-to-english')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${mode === 'amharic-to-english' ? 'bg-white dark:bg-zinc-800 shadow-sm' : 'text-slate-500'}`}
          >
            Amharic → English
          </button>
          <button
            onClick={() => setMode('english-to-amharic')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${mode === 'english-to-amharic' ? 'bg-white dark:bg-zinc-800 shadow-sm' : 'text-slate-500'}`}
          >
            English → Amharic
          </button>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-amharic-yellow font-black text-xl">
            🔥 {streak}
          </div>
          <div className="glass-card px-4 py-2 rounded-xl text-sm font-bold text-amharic-green">
            Level {progress.level}
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentCard.id + showResult.toString()}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          <Card className="p-8 md:p-12 mb-8 text-center border-4 border-slate-100 dark:border-zinc-800 shadow-xl overflow-hidden relative">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amharic-green via-amharic-yellow to-amharic-red opacity-50" />

            <div className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">
              {mode === 'amharic-to-english' ? 'What does this mean?' : 'How do you say it in Amharic?'}
            </div>

            <div className="text-6xl md:text-8xl font-black mb-6 bg-clip-text text-transparent bg-gradient-to-b from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 py-2">
              {mode === 'amharic-to-english' ? currentCard.amharic : currentCard.english}
            </div>

            {mode === 'amharic-to-english' && (
              <div className="text-2xl font-medium text-slate-400">
                {currentCard.phonetic}
              </div>
            )}
          </Card>
        </motion.div>
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {options.map((option, index) => {
          let state: 'idle' | 'correct' | 'incorrect' = 'idle';
          if (showResult) {
            if (option === correctAnswer) state = 'correct';
            else if (option === selectedAnswer) state = 'incorrect';
          }

          return (
            <motion.button
              key={index}
              onClick={() => handleAnswer(option)}
              disabled={showResult}
              whileHover={!showResult ? { scale: 1.02, y: -2 } : {}}
              whileTap={!showResult ? { scale: 0.98 } : {}}
              className={`
                relative p-6 rounded-2xl border-4 text-xl font-bold text-left transition-all duration-300
                ${state === 'idle' ? 'border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-amharic-green/50 hover:shadow-lg' : ''}
                ${state === 'correct' ? 'border-amharic-green bg-amharic-green/10 text-amharic-green z-10 shadow-lg shadow-amharic-green/20' : ''}
                ${state === 'incorrect' ? 'border-amharic-red bg-amharic-red/10 text-amharic-red opacity-50' : ''}
              `}
            >
              <div className="flex items-center justify-between">
                <span>{option}</span>
                {state === 'correct' && <CheckCircle className="w-8 h-8 flex-shrink-0" />}
                {state === 'incorrect' && <XCircle className="w-8 h-8 flex-shrink-0" />}
              </div>
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {showResult && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className={`fixed bottom-20 md:bottom-10 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:max-w-2xl p-6 rounded-3xl shadow-2xl z-40 flex items-center justify-between ${isCorrect ? 'bg-amharic-green text-white' : 'bg-amharic-red text-white'
              }`}
          >
            <div>
              <div className="text-2xl font-black mb-1">
                {isCorrect ? 'Excellent!' : 'Correct Answer:'}
              </div>
              {!isCorrect && (
                <div className="text-lg opacity-90 font-medium">
                  {currentCard.amharic} ({currentCard.phonetic}) = {currentCard.english}
                </div>
              )}
            </div>

            <Button
              variant={isCorrect ? "secondary" : "default"}
              size="lg"
              className="rounded-xl font-black text-lg gap-2"
              onClick={generateQuestion}
            >
              Continue <ArrowRight className="w-5 h-5" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}