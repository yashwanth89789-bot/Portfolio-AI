import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  Target,
  BarChart3,
  Zap,
  Eye,
  Rocket,
  ShieldCheck,
  Code2,
  CheckCircle2
} from 'lucide-react';
import { Logo } from './Logo';
import { ROLES_DATA } from '../data/rolesData';

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col items-center justify-center p-4 selection:bg-indigo-500 selection:text-white">
      
      <main className="max-w-4xl mx-auto py-16 px-4 flex flex-col items-center text-center space-y-8">
        
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center space-y-6"
        >
          <Logo size="lg" className="shadow-lg" />

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold border border-indigo-200 dark:border-indigo-800">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Deterministic ATS Scoring & Recruiter Eye-Tracking Suite</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-zinc-900 dark:text-white max-w-2xl leading-tight">
            Elevate Your Portfolio to Top 1% Engineering Standards
          </h1>

          <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-xl leading-relaxed">
            Scan your tech resume or portfolio against 50,000+ benchmarked profiles. Detect missing ATS keywords, transform bullet points with Google’s X-Y-Z formula, and simulate the recruiter 6-second glance.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <button
              onClick={() => navigate('/analyze')}
              id="start-analysis-cta-btn"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-500/25 transition-all group cursor-pointer"
            >
              <span>Launch Portfolio Booster</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </motion.div>

        {/* Feature Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-2xl pt-6">
          <div className="p-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center justify-center gap-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            <BarChart3 className="w-4 h-4 text-indigo-500" />
            <span>6-Axis Radar</span>
          </div>
          <div className="p-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center justify-center gap-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            <Target className="w-4 h-4 text-rose-500" />
            <span>ATS Keywords</span>
          </div>
          <div className="p-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center justify-center gap-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            <Zap className="w-4 h-4 text-amber-500" />
            <span>Google X-Y-Z Lab</span>
          </div>
          <div className="p-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center justify-center gap-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            <Eye className="w-4 h-4 text-emerald-500" />
            <span>6s Eye Heatmap</span>
          </div>
        </div>

      </main>

    </div>
  );
}
