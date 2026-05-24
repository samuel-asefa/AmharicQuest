'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useAppStore } from '@/lib/store';
import { BookOpen, Library, GraduationCap, Flame, Star, Award, ArrowRight, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { mockLessonsData } from '@/lib/data';

export default function Dashboard() {
  const { progress } = useAppStore();

  // Calculate stats
  const nextLesson = mockLessonsData.find(l => !progress.completedLessons.includes(l.id)) || mockLessonsData[mockLessonsData.length - 1];
  const totalLessons = mockLessonsData.length;
  const completedLessonsCount = progress.completedLessons.length;
  const progressPercentage = Math.round((completedLessonsCount / totalLessons) * 100) || 0;

  // Example daily goal calculation (simplified)
  const dailyGoalXP = 50;
  const currentDailyXP = Math.min(progress.totalXP % dailyGoalXP, dailyGoalXP);
  const dailyProgress = Math.round((currentDailyXP / dailyGoalXP) * 100);

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-12 relative">
      {/* Background Blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amharic-yellow/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-amharic-green/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-200/50 dark:bg-zinc-800/50 text-slate-600 dark:text-slate-300 font-bold text-sm mb-4">
            <Sparkles className="w-4 h-4 text-amharic-yellow" /> Welcome back, Learner!
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-extrabold mb-3 tracking-tight"
          >
            Ready to <span className="bg-clip-text text-transparent bg-gradient-to-r from-amharic-green to-amharic-yellow">continue?</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-600 dark:text-slate-400"
          >
            Let's dive back into your Amharic journey today.
          </motion.p>
        </div>
      </header>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="p-6 flex items-center gap-5 bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-orange-950/20 dark:to-orange-900/10 border-orange-200/50 dark:border-orange-500/20 hover:-translate-y-1 transition-transform duration-300">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 text-white flex items-center justify-center shadow-lg shadow-orange-500/30">
              <Flame className="w-8 h-8" />
            </div>
            <div>
              <div className="text-4xl font-black text-orange-600 dark:text-orange-500">{progress.streak}</div>
              <div className="text-sm font-bold text-orange-900/60 dark:text-orange-200/60 uppercase tracking-widest mt-1">Day Streak</div>
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="p-6 flex items-center gap-5 bg-gradient-to-br from-amharic-yellow/10 to-amharic-yellow/5 dark:from-yellow-950/20 dark:to-yellow-900/10 border-amharic-yellow/30 hover:-translate-y-1 transition-transform duration-300">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-400 to-amber-500 text-white flex items-center justify-center shadow-lg shadow-amharic-yellow/30">
              <Star className="w-8 h-8 fill-current" />
            </div>
            <div>
              <div className="text-4xl font-black text-amber-600 dark:text-amharic-yellow">{progress.totalXP}</div>
              <div className="text-sm font-bold text-amber-900/60 dark:text-amber-200/60 uppercase tracking-widest mt-1">Total XP</div>
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="p-6 flex items-center gap-5 bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-950/20 dark:to-emerald-900/10 border-amharic-green/30 hover:-translate-y-1 transition-transform duration-300">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-amharic-green text-white flex items-center justify-center shadow-lg shadow-amharic-green/30">
              <Award className="w-8 h-8" />
            </div>
            <div>
              <div className="text-4xl font-black text-emerald-700 dark:text-amharic-green-light">Lv. {progress.level}</div>
              <div className="text-sm font-bold text-emerald-900/60 dark:text-emerald-200/60 uppercase tracking-widest mt-1">Current Rank</div>
            </div>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Learning Path CTA */}
        <div className="lg:col-span-2 space-y-8">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}>
            <Card className="p-8 border-2 border-amharic-green/50 shadow-2xl shadow-amharic-green/10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-amharic-green/20 to-amharic-yellow/20 rounded-full blur-3xl -translate-y-1/3 translate-x-1/3 group-hover:bg-amharic-green/30 transition-colors duration-500" />

              <div className="relative z-10">
                <div className="flex items-center gap-2 text-amharic-green font-bold text-sm tracking-widest uppercase mb-4 bg-amharic-green/10 inline-flex px-3 py-1 rounded-full">
                  <GraduationCap className="w-5 h-5" /> Up Next
                </div>

                <h2 className="text-4xl font-extrabold mb-3 text-slate-900 dark:text-white">{nextLesson?.title || 'Course Complete!'}</h2>
                <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-md">
                  {nextLesson?.description || 'You have finished all available lessons. Keep practicing to maintain your skills!'}
                </p>

                <Link href={nextLesson ? `/practice?lesson=${nextLesson.id}` : '/practice'}>
                  <Button size="lg" className="w-full sm:w-auto gap-3 text-lg py-6 px-8 rounded-xl shadow-lg shadow-amharic-green/20">
                    {nextLesson ? 'Continue Learning' : 'Practice Now'} <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <div>
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
              Quick Practice
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Link href="/fidel">
                <Card className="p-6 hover:border-amharic-green hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group glass-card">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-zinc-800 flex items-center justify-center mb-5 group-hover:bg-amharic-green/10 transition-colors">
                    <BookOpen className="w-6 h-6 text-slate-500 group-hover:text-amharic-green transition-colors" />
                  </div>
                  <h4 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Alphabet (Fidel)</h4>
                  <p className="text-slate-500">Master the Amharic characters</p>
                </Card>
              </Link>
              <Link href="/practice">
                <Card className="p-6 hover:border-amharic-yellow hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group glass-card">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-zinc-800 flex items-center justify-center mb-5 group-hover:bg-amharic-yellow/10 transition-colors">
                    <Library className="w-6 h-6 text-slate-500 group-hover:text-amber-500 transition-colors" />
                  </div>
                  <h4 className="font-bold text-xl mb-2 text-slate-900 dark:text-white">Vocabulary Quiz</h4>
                  <p className="text-slate-500">Test your word knowledge</p>
                </Card>
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column: Progress details */}
        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
            <Card className="p-8 glass-card border-slate-200/50 dark:border-zinc-800/50">
              <h3 className="font-bold text-2xl mb-8">Course Progress</h3>

              <div className="mb-8">
                <div className="mb-3 flex justify-between items-end">
                  <span className="text-slate-500 font-semibold">Completed</span>
                  <span className="text-2xl font-black text-amharic-green">{progressPercentage}%</span>
                </div>
                <div className="h-4 w-full bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden shadow-inner">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercentage}%` }}
                    transition={{ duration: 1, delay: 0.5, type: "spring" }}
                    className="h-full bg-gradient-to-r from-amharic-green-light to-amharic-green rounded-full relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-white/20 w-full h-full" style={{ transform: 'skewX(-20deg)', animation: 'shimmer 2s infinite' }} />
                  </motion.div>
                </div>
              </div>

              <div>
                <div className="mb-3 flex justify-between items-end">
                  <span className="text-slate-500 font-semibold">Daily Goal</span>
                  <span className="text-2xl font-black text-amber-500">{currentDailyXP}<span className="text-sm text-slate-400">/{dailyGoalXP} XP</span></span>
                </div>
                <div className="h-4 w-full bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden shadow-inner">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${dailyProgress}%` }}
                    transition={{ duration: 1, delay: 0.7, type: "spring" }}
                    className="h-full bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full relative overflow-hidden"
                  >
                     <div className="absolute inset-0 bg-white/20 w-full h-full" style={{ transform: 'skewX(-20deg)', animation: 'shimmer 2s infinite' }} />
                  </motion.div>
                </div>
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
