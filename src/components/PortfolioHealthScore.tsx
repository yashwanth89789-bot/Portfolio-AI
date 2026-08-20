import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  TrendingUp,
  Award,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Zap,
  Target,
  FileCheck
} from 'lucide-react';

export interface PortfolioHealthScoreProps {
  score: number;
  grade?: string;
  percentileRank?: number;
  targetRoleTitle?: string;
  subScores?: {
    atsCompliance: number;
    impactMetrics: number;
    technicalDepth: number;
    actionVerbPower: number;
    structureAndUx?: number;
    socialProof?: number;
  };
  size?: 'compact' | 'standard' | 'large';
  className?: string;
}

export function PortfolioHealthScore({
  score,
  grade,
  percentileRank = 50,
  targetRoleTitle = 'Engineering Candidate',
  subScores,
  size = 'standard',
  className = ''
}: PortfolioHealthScoreProps) {
  const [animatedScore, setAnimatedScore] = useState(0);

  // Animate the numeric score counting up
  useEffect(() => {
    let start = 0;
    const end = Math.min(100, Math.max(0, Math.round(score)));
    if (end === 0) {
      setAnimatedScore(0);
      return;
    }

    const duration = 1000;
    const stepTime = 16;
    const totalSteps = duration / stepTime;
    const increment = end / totalSteps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setAnimatedScore(end);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.floor(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [score]);

  // Radius and circumference setup for circular progress gauge
  const radius = size === 'compact' ? 52 : size === 'large' ? 80 : 68;
  const strokeWidth = size === 'compact' ? 8 : size === 'large' ? 12 : 10;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = 2 * Math.PI * normalizedRadius;
  const strokeDashoffset = circumference - (Math.min(100, Math.max(0, score)) / 100) * circumference;

  // Determine status color and copy based on score
  const getStatusConfig = (val: number) => {
    if (val >= 85) {
      return {
        label: 'Elite Profile',
        badgeColor: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
        gradientStart: '#10b981', // emerald-500
        gradientEnd: '#06b6d4',   // cyan-500
        trackColor: 'text-emerald-100 dark:text-emerald-950/40',
        textColor: 'text-emerald-600 dark:text-emerald-400',
        icon: Award,
        summary: 'Top-tier portfolio ready for high-volume recruiter outreach and Tier 1 tech screens.'
      };
    }
    if (val >= 70) {
      return {
        label: 'Competitive',
        badgeColor: 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
        gradientStart: '#6366f1', // indigo-500
        gradientEnd: '#3b82f6',   // blue-500
        trackColor: 'text-indigo-100 dark:text-indigo-950/40',
        textColor: 'text-indigo-600 dark:text-indigo-400',
        icon: CheckCircle2,
        summary: 'Strong baseline. Enhancing impact metrics and missing ATS keywords will push this into top 5%.'
      };
    }
    if (val >= 50) {
      return {
        label: 'Needs Refinement',
        badgeColor: 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
        gradientStart: '#f59e0b', // amber-500
        gradientEnd: '#ea580c',   // orange-600
        trackColor: 'text-amber-100 dark:text-amber-950/40',
        textColor: 'text-amber-600 dark:text-amber-400',
        icon: AlertCircle,
        summary: 'Contains good experience but suffers from passive phrasing and missing role keywords.'
      };
    }
    return {
      label: 'At Risk',
      badgeColor: 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800',
      gradientStart: '#f43f5e', // rose-500
      gradientEnd: '#e11d48',   // rose-600
      trackColor: 'text-rose-100 dark:text-rose-950/40',
      textColor: 'text-rose-600 dark:text-rose-400',
      icon: AlertCircle,
      summary: 'High probability of ATS screen drops. Requires immediate keyword and X-Y-Z metric restructuring.'
    };
  };

  const status = getStatusConfig(score);
  const StatusIcon = status.icon;
  const gradientId = `health-gauge-grad-${Math.round(score)}`;

  return (
    <div
      id="portfolio-health-score-card"
      className={`bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col justify-between relative overflow-hidden ${className}`}
    >
      {/* Background ambient glow */}
      <div 
        className="absolute -top-12 -right-12 w-44 h-44 rounded-full blur-3xl opacity-20 pointer-events-none transition-all"
        style={{ background: status.gradientStart }}
      />

      <div>
        {/* Header Title & Role Label */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ backgroundColor: status.gradientStart }} />
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
              Portfolio Health Score
            </h3>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200/60 dark:border-zinc-700/60 max-w-[140px] truncate">
            {targetRoleTitle}
          </span>
        </div>

        {/* Circular Progress Gauge & Main Metric Section */}
        <div className="flex flex-col sm:flex-row items-center gap-6 py-2">
          
          {/* SVG Circular Progress Gauge */}
          <div className="relative flex items-center justify-center shrink-0">
            <svg
              height={radius * 2}
              width={radius * 2}
              className="transform -rotate-90 drop-shadow-sm"
            >
              <defs>
                <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={status.gradientStart} />
                  <stop offset="100%" stopColor={status.gradientEnd} />
                </linearGradient>
              </defs>

              {/* Background Circle Track */}
              <circle
                stroke="currentColor"
                className="text-zinc-100 dark:text-zinc-800"
                fill="transparent"
                strokeWidth={strokeWidth}
                r={normalizedRadius}
                cx={radius}
                cy={radius}
              />

              {/* Animated Progress Gauge Circle */}
              <motion.circle
                stroke={`url(#${gradientId})`}
                fill="transparent"
                strokeWidth={strokeWidth}
                strokeDasharray={`${circumference} ${circumference}`}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                strokeLinecap="round"
                r={normalizedRadius}
                cx={radius}
                cy={radius}
              />
            </svg>

            {/* Centered Readout inside the Circular Gauge */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <motion.span 
                className="text-3xl sm:text-4xl font-black tracking-tight text-zinc-900 dark:text-white"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                {animatedScore}
              </motion.span>
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest -mt-1">
                OUT OF 100
              </span>
            </div>
          </div>

          {/* Right/Adjacent Score Details */}
          <div className="flex-1 space-y-2.5 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${status.badgeColor}`}>
                <StatusIcon className="w-3.5 h-3.5" />
                <span>{status.label}</span>
              </span>

              {grade && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-extrabold bg-zinc-900 dark:bg-white text-white dark:text-zinc-900">
                  Grade {grade}
                </span>
              )}
            </div>

            <div className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 flex items-center justify-center sm:justify-start gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>
                Ranked in top <strong className="text-zinc-900 dark:text-white">{100 - percentileRank}%</strong> of applicants
              </span>
            </div>

            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              {status.summary}
            </p>
          </div>

        </div>

        {/* Sub-Metrics Quick Bar (if subScores are available) */}
        {subScores && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-4 mt-3 border-t border-zinc-100 dark:border-zinc-800/80">
            <div className="bg-zinc-50 dark:bg-zinc-800/60 p-2 rounded-xl border border-zinc-100 dark:border-zinc-800 text-center">
              <span className="text-[10px] font-medium text-zinc-500 block truncate">ATS Match</span>
              <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">{subScores.atsCompliance}%</span>
            </div>
            <div className="bg-zinc-50 dark:bg-zinc-800/60 p-2 rounded-xl border border-zinc-100 dark:border-zinc-800 text-center">
              <span className="text-[10px] font-medium text-zinc-500 block truncate">Metrics Density</span>
              <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">{subScores.impactMetrics}%</span>
            </div>
            <div className="bg-zinc-50 dark:bg-zinc-800/60 p-2 rounded-xl border border-zinc-100 dark:border-zinc-800 text-center">
              <span className="text-[10px] font-medium text-zinc-500 block truncate">Tech Depth</span>
              <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">{subScores.technicalDepth}%</span>
            </div>
            <div className="bg-zinc-50 dark:bg-zinc-800/60 p-2 rounded-xl border border-zinc-100 dark:border-zinc-800 text-center">
              <span className="text-[10px] font-medium text-zinc-500 block truncate">Action Verbs</span>
              <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">{subScores.actionVerbPower}%</span>
            </div>
          </div>
        )}
      </div>

      {/* Benchmark Footer */}
      <div className="pt-3 mt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-400">
        <span className="flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          50,000+ benchmarked profiles
        </span>
        <span className="font-semibold text-zinc-600 dark:text-zinc-400">
          Target: 85+ (Elite)
        </span>
      </div>

    </div>
  );
}
