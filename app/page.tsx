'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useAppStore } from '@/lib/store';
import { BookOpen, Library, GraduationCap, Flame, Star, Award, ArrowRight } from 'lucide-react';
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
    <div className="max-w-4xl mx-auto p-6 md:p-12">
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-extrabold mb-2"
          >
            Welcome back! 👋
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-600 dark:text-slate-400"
          >
            Ready to continue your Amharic journey?
          </motion.p>
        </div>
      </header>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="p-6 flex items-center gap-4 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-zinc-900 dark:to-orange-900/20 border-orange-200 dark:border-orange-500/20">
            <div className="w-14 h-14 rounded-2xl bg-orange-500 text-white flex items-center justify-center shadow-lg shadow-orange-500/30">
              <Flame className="w-8 h-8" />
            </div>
            <div>
              <div className="text-3xl font-black text-orange-600 dark:text-orange-500">{progress.streak}</div>
              <div className="text-sm font-bold text-orange-900/60 dark:text-orange-200/60 uppercase tracking-widest">Day Streak</div>
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="p-6 flex items-center gap-4 bg-gradient-to-br from-amharic-yellow/10 to-amharic-yellow/20 dark:from-zinc-900 dark:to-amharic-yellow/10 border-amharic-yellow/30">
            <div className="w-14 h-14 rounded-2xl bg-amharic-yellow text-amber-900 flex items-center justify-center shadow-lg shadow-amharic-yellow/30">
              <Star className="w-8 h-8 fill-current" />
            </div>
            <div>
              <div className="text-3xl font-black text-amber-600 dark:text-amharic-yellow">{progress.totalXP}</div>
              <div className="text-sm font-bold text-amber-900/60 dark:text-amber-200/60 uppercase tracking-widest">Total XP</div>
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="p-6 flex items-center gap-4 bg-gradient-to-br from-amharic-green/10 to-amharic-green/20 dark:from-zinc-900 dark:to-amharic-green/10 border-amharic-green/30">
            <div className="w-14 h-14 rounded-2xl bg-amharic-green text-white flex items-center justify-center shadow-lg shadow-amharic-green/30">
              <Award className="w-8 h-8" />
            </div>
            <div>
              <div className="text-3xl font-black text-emerald-700 dark:text-amharic-green-light">Level {progress.level}</div>
              <div className="text-sm font-bold text-emerald-900/60 dark:text-emerald-200/60 uppercase tracking-widest">Current Rank</div>
            </div>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Learning Path CTA */}
        <div className="lg:col-span-2 space-y-8">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}>
            <Card className="p-8 border-2 border-amharic-green/50 shadow-xl shadow-amharic-green/10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-amharic-green/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-amharic-green/20 transition-colors" />

              <div className="relative z-10">
                <div className="flex items-center gap-2 text-amharic-green font-bold text-sm tracking-widest uppercase mb-4">
                  <GraduationCap className="w-5 h-5" /> Up Next
                </div>

                <h2 className="text-3xl font-bold mb-2">{nextLesson?.title || 'Course Complete!'}</h2>
                <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-md">
                  {nextLesson?.description || 'You have finished all available lessons. Keep practicing to maintain your skills!'}
                </p>

                <Link href={nextLesson ? `/practice?lesson=${nextLesson.id}` : '/practice'}>
                  <Button size="lg" className="w-full sm:w-auto gap-2">
                    {nextLesson ? 'Continue Learning' : 'Practice Now'} <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Practice</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link href="/fidel">
                <Card className="p-6 hover:border-amharic-green hover:shadow-md transition-all cursor-pointer group">
                  <BookOpen className="w-8 h-8 text-slate-400 group-hover:text-amharic-green mb-4 transition-colors" />
                  <h4 className="font-bold text-lg mb-1">Alphabet (Fidel)</h4>
                  <p className="text-sm text-slate-500">Master the Amharic characters</p>
                </Card>
              </Link>
              <Link href="/practice">
                <Card className="p-6 hover:border-amharic-yellow hover:shadow-md transition-all cursor-pointer group">
                  <Library className="w-8 h-8 text-slate-400 group-hover:text-amharic-yellow mb-4 transition-colors" />
                  <h4 className="font-bold text-lg mb-1">Vocabulary Quiz</h4>
                  <p className="text-sm text-slate-500">Test your word knowledge</p>
                </Card>
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column: Progress details */}
        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
            <Card className="p-6">
              <h3 className="font-bold text-lg mb-6">Course Progress</h3>

              <div className="mb-2 flex justify-between text-sm font-semibold">
                <span className="text-slate-500">Completed</span>
                <span className="text-amharic-green">{progressPercentage}%</span>
              </div>
              <div className="h-3 w-full bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden mb-6">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="h-full bg-amharic-green rounded-full"
                />
              </div>

              <div className="mb-2 flex justify-between text-sm font-semibold">
                <span className="text-slate-500">Daily Goal</span>
                <span className="text-amharic-yellow">{currentDailyXP}/{dailyGoalXP} XP</span>
              </div>
              <div className="h-3 w-full bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${dailyProgress}%` }}
                  transition={{ duration: 1, delay: 0.7 }}
                  className="h-full bg-amharic-yellow rounded-full"
                />
              </div>
            </Card>
          </motion.div>
        </div>

      </div>
    </div>
  );
}
