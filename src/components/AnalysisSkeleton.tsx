import React from 'react';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';

export function AnalysisSkeleton() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-4xl mx-auto mt-12 bg-white dark:bg-zinc-900 rounded-2xl p-8 shadow-xl border border-zinc-200 dark:border-zinc-800"
    >
      {/* Header Loading State */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-zinc-100 dark:border-zinc-800">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 animate-pulse">
            <Sparkles className="w-6 h-6 animate-spin" />
          </div>
          <div>
            <div className="h-6 w-48 bg-zinc-200 dark:bg-zinc-800 rounded-lg animate-pulse mb-2"></div>
            <div className="h-4 w-32 bg-zinc-100 dark:bg-zinc-800/60 rounded-md animate-pulse"></div>
          </div>
        </div>
        <div className="flex gap-2 w-full md:w-auto justify-end">
          <div className="h-10 w-28 bg-zinc-200 dark:bg-zinc-800 rounded-xl animate-pulse"></div>
          <div className="h-10 w-28 bg-zinc-200 dark:bg-zinc-800 rounded-xl animate-pulse"></div>
        </div>
      </div>

      {/* Radar & Grade Section Skeleton */}
      <div className="py-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="h-[280px] bg-zinc-100 dark:bg-zinc-800/40 rounded-2xl animate-pulse flex items-center justify-center">
          <div className="w-48 h-48 rounded-full border-4 border-dashed border-zinc-200 dark:border-zinc-700 animate-spin opacity-50"></div>
        </div>
        <div className="space-y-4">
          <div className="h-6 w-36 bg-zinc-200 dark:bg-zinc-800 rounded-lg animate-pulse"></div>
          <div className="h-12 w-24 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl animate-pulse"></div>
          <div className="space-y-2">
            <div className="h-4 w-full bg-zinc-100 dark:bg-zinc-800 rounded-md animate-pulse"></div>
            <div className="h-4 w-5/6 bg-zinc-100 dark:bg-zinc-800 rounded-md animate-pulse"></div>
            <div className="h-4 w-4/6 bg-zinc-100 dark:bg-zinc-800 rounded-md animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Breakdown Bars Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 pt-6 border-t border-zinc-100 dark:border-zinc-800">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="bg-zinc-50 dark:bg-zinc-800/30 rounded-xl p-4 border border-zinc-100 dark:border-zinc-800">
            <div className="h-3 w-16 bg-zinc-200 dark:bg-zinc-700 rounded animate-pulse mb-2"></div>
            <div className="h-6 w-10 bg-zinc-200 dark:bg-zinc-700 rounded animate-pulse mb-3"></div>
            <div className="h-2 w-full bg-zinc-200 dark:bg-zinc-700 rounded-full animate-pulse"></div>
          </div>
        ))}
      </div>

      {/* Status Progress Bar */}
      <div className="mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-800 text-center">
        <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 text-sm font-medium animate-pulse">
          <div className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-ping"></div>
          AI is reviewing code quality, UX patterns, and industry benchmarks...
        </div>
      </div>
    </motion.div>
  );
}
