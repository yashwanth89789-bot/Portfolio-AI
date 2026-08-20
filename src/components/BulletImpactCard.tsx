import { useState } from 'react';
import {
  Zap,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Copy,
  Check,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Target,
  Briefcase,
  Cpu,
  RefreshCw,
  HelpCircle
} from 'lucide-react';
import { BulletPointAnalysis, HighlightedPhraseToken } from '../types';

interface BulletImpactCardProps {
  analysis: BulletPointAnalysis;
  onApplyReplacement?: (replacementText: string) => void;
  onSelectForLab?: (originalText: string) => void;
  isDetailedView?: boolean;
}

export function BulletImpactCard({
  analysis,
  onApplyReplacement,
  onSelectForLab,
  isDetailedView = true
}: BulletImpactCardProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeTokenInfo, setActiveTokenInfo] = useState<HighlightedPhraseToken | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return {
      text: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-950/50',
      border: 'border-emerald-200 dark:border-emerald-800',
      stroke: '#10b981',
      badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300'
    };
    if (score >= 70) return {
      text: 'text-indigo-600 dark:text-indigo-400',
      bg: 'bg-indigo-50 dark:bg-indigo-950/50',
      border: 'border-indigo-200 dark:border-indigo-800',
      stroke: '#6366f1',
      badge: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/60 dark:text-indigo-300'
    };
    if (score >= 50) return {
      text: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-50 dark:bg-amber-950/50',
      border: 'border-amber-200 dark:border-amber-800',
      stroke: '#f59e0b',
      badge: 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300'
    };
    return {
      text: 'text-rose-600 dark:text-rose-400',
      bg: 'bg-rose-50 dark:bg-rose-950/50',
      border: 'border-rose-200 dark:border-rose-800',
      stroke: '#f43f5e',
      badge: 'bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-300'
    };
  };

  const colors = getScoreColor(analysis.score);

  return (
    <div className={`rounded-2xl border transition-all ${colors.border} bg-white dark:bg-zinc-900 p-5 sm:p-6 shadow-sm hover:shadow-md`}>
      
      {/* Header: Score Gauge & Tier */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-100 dark:border-zinc-800/80">
        <div className="flex items-center gap-3">
          {/* Circular Score Gauge */}
          <div className="relative w-12 h-12 flex-shrink-0 flex items-center justify-center">
            <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-zinc-100 dark:text-zinc-800"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                strokeDasharray={`${analysis.score}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke={colors.stroke}
                fill="none"
                className="transition-all duration-700 ease-out"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-xs font-black ${colors.text}`}>{analysis.score}</span>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-white">
                Impact Score
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${colors.badge}`}>
                {analysis.grade} Tier
              </span>
            </div>
            <div className="text-[11px] text-zinc-500 flex items-center gap-2 mt-0.5">
              <span>{analysis.passivePhrasesFound.length > 0 ? `⚠️ ${analysis.passivePhrasesFound.length} Passive Flags` : '✅ Zero Passive Phrasing'}</span>
              <span>•</span>
              <span>{analysis.hasMetrics ? '📊 Verified Numbers' : '⚠️ No Metrics'}</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        {onSelectForLab && (
          <button
            onClick={() => onSelectForLab(analysis.original)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 text-xs font-semibold transition-colors self-start sm:self-auto"
          >
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>Load in Live Lab</span>
          </button>
        )}
      </div>

      {/* Visual Phrase Highlighter Block */}
      <div className="my-4">
        <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 mb-2 flex items-center justify-between">
          <span>Highlighted Analysis & Passive Diagnostics</span>
          <span className="text-[10px] font-normal text-zinc-400">Click highlighted words for recommendations</span>
        </div>

        <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700/80 text-sm leading-relaxed font-normal text-zinc-800 dark:text-zinc-200 flex flex-wrap items-center gap-1.5">
          {analysis.tokens.map((token, idx) => {
            if (token.type === 'passive') {
              return (
                <button
                  key={idx}
                  onClick={() => setActiveTokenInfo(token)}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-200 border border-rose-300 dark:border-rose-700 font-semibold cursor-pointer hover:bg-rose-200 dark:hover:bg-rose-900 transition-colors shadow-2xs"
                  title={token.feedback}
                >
                  <AlertOctagon className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 flex-shrink-0" />
                  <span>{token.text}</span>
                  <span className="text-[9px] uppercase px-1 rounded bg-rose-200 dark:bg-rose-800 text-rose-900 dark:text-rose-100">
                    Passive
                  </span>
                </button>
              );
            }

            if (token.type === 'weak') {
              return (
                <button
                  key={idx}
                  onClick={() => setActiveTokenInfo(token)}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-200 border border-amber-300 dark:border-amber-700 font-semibold cursor-pointer hover:bg-amber-200 dark:hover:bg-amber-900 transition-colors"
                  title={token.feedback}
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                  <span>{token.text}</span>
                  <span className="text-[9px] uppercase px-1 rounded bg-amber-200 dark:bg-amber-800 text-amber-900 dark:text-amber-100">
                    Weak
                  </span>
                </button>
              );
            }

            if (token.type === 'power') {
              return (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700 font-semibold"
                  title="Strong active power verb"
                >
                  <Zap className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                  <span>{token.text}</span>
                </span>
              );
            }

            if (token.type === 'metric') {
              return (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950/80 text-indigo-800 dark:text-indigo-200 border border-indigo-300 dark:border-indigo-700 font-semibold"
                  title="Quantifiable metric proof point"
                >
                  <TrendingUp className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
                  <span>{token.text}</span>
                </span>
              );
            }

            return <span key={idx}>{token.text}</span>;
          })}
        </div>

        {/* Selected Passive/Weak Token Info Panel */}
        {activeTokenInfo && activeTokenInfo.suggestedReplacement && (
          <div className="mt-2.5 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 animate-in fade-in duration-200">
            <div className="space-y-0.5">
              <div className="font-bold text-rose-900 dark:text-rose-200 flex items-center gap-1.5">
                <AlertOctagon className="w-4 h-4 text-rose-500" />
                <span>Flagged Phrase: "{activeTokenInfo.text}"</span>
              </div>
              <p className="text-zinc-600 dark:text-zinc-400 text-[11px]">
                {activeTokenInfo.feedback || 'Replace passive phrasing to showcase ownership and leadership.'}
              </p>
            </div>

            {activeTokenInfo.suggestedReplacement && onApplyReplacement && (
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] font-semibold text-zinc-500">Suggested:</span>
                {activeTokenInfo.suggestedReplacement.split(' / ').map((rep, rIdx) => (
                  <button
                    key={rIdx}
                    onClick={() => {
                      const newStr = analysis.original.replace(new RegExp(activeTokenInfo.text, 'i'), rep);
                      onApplyReplacement(newStr);
                      setActiveTokenInfo(null);
                    }}
                    className="px-2 py-1 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:border-emerald-500 hover:text-emerald-600 font-semibold text-[11px] transition-colors shadow-2xs"
                  >
                    ⚡ {rep}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Diagnostics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 py-3 border-y border-zinc-100 dark:border-zinc-800/80 text-center">
        <div className="p-2 rounded-xl bg-zinc-50 dark:bg-zinc-800/50">
          <span className="text-[10px] uppercase font-bold text-zinc-400 block">Verb Power</span>
          <span className={`text-xs font-bold block mt-0.5 ${analysis.actionVerb.isStrong ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
            {analysis.actionVerb.isStrong ? '⚡ Strong Active' : '⚠️ Weak / Passive'}
          </span>
        </div>

        <div className="p-2 rounded-xl bg-zinc-50 dark:bg-zinc-800/50">
          <span className="text-[10px] uppercase font-bold text-zinc-400 block">Metric Proof</span>
          <span className={`text-xs font-bold block mt-0.5 ${analysis.hasMetrics ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
            {analysis.hasMetrics ? `📊 ${analysis.metricsFound.length} Detected` : '❌ Missing Metrics'}
          </span>
        </div>

        <div className="p-2 rounded-xl bg-zinc-50 dark:bg-zinc-800/50">
          <span className="text-[10px] uppercase font-bold text-zinc-400 block">Business ROI</span>
          <span className={`text-xs font-bold block mt-0.5 ${analysis.hasOutcome ? 'text-emerald-600 dark:text-emerald-400' : 'text-zinc-600 dark:text-zinc-400'}`}>
            {analysis.hasOutcome ? '✅ Measurable' : '⚠️ Unverified'}
          </span>
        </div>

        <div className="p-2 rounded-xl bg-zinc-50 dark:bg-zinc-800/50">
          <span className="text-[10px] uppercase font-bold text-zinc-400 block">Deductions</span>
          <span className={`text-xs font-bold block mt-0.5 ${analysis.breakdown.penalty > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
            {analysis.breakdown.penalty > 0 ? `-${analysis.breakdown.penalty} pts` : '0 penalty'}
          </span>
        </div>
      </div>

      {/* Critique message */}
      <div className="mt-3.5 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/50 dark:border-zinc-700/50 text-xs text-zinc-700 dark:text-zinc-300 italic flex items-start gap-2">
        <span className="flex-shrink-0 text-base">💡</span>
        <p>{analysis.critique}</p>
      </div>

      {/* Tailored Rewrites Accordion/List */}
      {isDetailedView && (
        <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-white flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              High-Impact AI Rewrites
            </span>
            <span className="text-[11px] text-zinc-400">Click to copy or apply</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {/* Google X-Y-Z */}
            <div className="p-3 rounded-xl border border-indigo-200 dark:border-indigo-800/80 bg-indigo-50/30 dark:bg-indigo-950/20 text-xs flex flex-col justify-between gap-2">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                    <Target className="w-3 h-3" /> Google X-Y-Z Formula
                  </span>
                  <button
                    onClick={() => handleCopy(analysis.rewrites.xyzFormula, 'xyz')}
                    className="inline-flex items-center gap-1 text-[10px] font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-white p-1 rounded"
                  >
                    {copiedKey === 'xyz' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === 'xyz' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <p className="text-zinc-800 dark:text-zinc-200 font-medium leading-relaxed">
                  "{analysis.rewrites.xyzFormula}"
                </p>
              </div>
            </div>

            {/* Executive */}
            <div className="p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-850 text-xs flex flex-col justify-between gap-2">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-zinc-900 dark:text-white flex items-center gap-1">
                    <Briefcase className="w-3 h-3 text-zinc-500" /> Executive & Leadership
                  </span>
                  <button
                    onClick={() => handleCopy(analysis.rewrites.executive, 'exec')}
                    className="inline-flex items-center gap-1 text-[10px] font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-white p-1 rounded"
                  >
                    {copiedKey === 'exec' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === 'exec' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  "{analysis.rewrites.executive}"
                </p>
              </div>
            </div>

            {/* Technical */}
            <div className="p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-850 text-xs flex flex-col justify-between gap-2">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-zinc-900 dark:text-white flex items-center gap-1">
                    <Cpu className="w-3 h-3 text-zinc-500" /> Deep Technical Architecture
                  </span>
                  <button
                    onClick={() => handleCopy(analysis.rewrites.technical, 'tech')}
                    className="inline-flex items-center gap-1 text-[10px] font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-white p-1 rounded"
                  >
                    {copiedKey === 'tech' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === 'tech' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  "{analysis.rewrites.technical}"
                </p>
              </div>
            </div>

            {/* Concise */}
            <div className="p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-850 text-xs flex flex-col justify-between gap-2">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-zinc-900 dark:text-white flex items-center gap-1">
                    <Zap className="w-3 h-3 text-amber-500" /> 1-Line ATS Punch
                  </span>
                  <button
                    onClick={() => handleCopy(analysis.rewrites.concise, 'conc')}
                    className="inline-flex items-center gap-1 text-[10px] font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-white p-1 rounded"
                  >
                    {copiedKey === 'conc' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === 'conc' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  "{analysis.rewrites.concise}"
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
