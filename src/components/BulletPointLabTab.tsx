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
  Sliders,
  Flame,
  Briefcase,
  Cpu,
  Target,
  Filter,
  TrendingUp,
  RefreshCw,
  HelpCircle,
  Award
} from 'lucide-react';
import { FullAuditResult, BulletPointAnalysis } from '../types';
import { analyzeSingleBulletPoint, tokenizeBulletPointForImpact } from '../services/analyzerEngine';
import { BulletImpactCard } from './BulletImpactCard';

interface BulletPointLabTabProps {
  audit: FullAuditResult;
}

export function BulletPointLabTab({ audit }: BulletPointLabTabProps) {
  const [customInput, setCustomInput] = useState(
    audit.bulletAnalyses[0]?.original ||
    'Responsible for building web features using React and helped team fix 40+ critical bugs on production.'
  );
  const [filterMode, setFilterMode] = useState<'all' | 'passive' | 'missing-metrics' | 'high-impact'>('all');
  const [activeTokenTooltip, setActiveTokenTooltip] = useState<{ text: string; feedback?: string; replacement?: string } | null>(null);

  // Real-time analysis of the active input in the lab
  const activeAnalysis = analyzeSingleBulletPoint(customInput, audit.targetRoleTitle);

  // Compute aggregated stats across all scanned resume bullets
  const totalBullets = audit.bulletAnalyses.length;
  const avgImpactScore = totalBullets > 0
    ? Math.round(audit.bulletAnalyses.reduce((acc, b) => acc + b.score, 0) / totalBullets)
    : activeAnalysis.score;
  
  const totalPassiveDetected = audit.bulletAnalyses.reduce((acc, b) => acc + b.passivePhrasesFound.length, 0);
  const totalWeakDetected = audit.bulletAnalyses.reduce((acc, b) => acc + b.weakPhrasesFound.length, 0);
  const totalPowerVerbs = audit.bulletAnalyses.reduce((acc, b) => acc + b.powerVerbsFound.length, 0);
  const totalMetrics = audit.bulletAnalyses.reduce((acc, b) => acc + b.metricsFound.length, 0);

  // Filtered list of resume bullets
  const filteredBullets = audit.bulletAnalyses.filter(b => {
    if (filterMode === 'passive') return b.passivePhrasesFound.length > 0 || b.weakPhrasesFound.length > 0;
    if (filterMode === 'missing-metrics') return !b.hasMetrics;
    if (filterMode === 'high-impact') return b.score >= 80;
    return true;
  });

  const handleApplyReplacement = (newText: string) => {
    setCustomInput(newText);
    setActiveTokenTooltip(null);
  };

  const handleQuickPreset = (type: 'weak' | 'elite' | 'standard') => {
    if (type === 'weak') {
      setCustomInput('Was responsible for developing frontend UI features and helped team fix bugs as needed.');
    } else if (type === 'elite') {
      setCustomInput('Spearheaded end-to-end architecture overhaul of distributed checkout service, reducing p99 latency by 48% and boosting checkout conversions by $1.2M annually across 350k+ users.');
    } else {
      setCustomInput('Engineered reusable React component library adopted across 8 product squads, cutting feature development time by 30%.');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 sm:p-8 border border-zinc-200 dark:border-zinc-800 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Zap className="w-4 h-4" />
              </div>
              <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
                Bullet Point Impact Score & Passive Phrase Inspector
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 max-w-2xl">
              Evaluate the punch of every bullet point. Flag weak phrasing, eliminate passive voice, and convert task descriptions into high-converting proof points using the Google X-Y-Z formula: <span className="font-semibold text-zinc-900 dark:text-white">"Accomplished [X], as measured by [Y], by doing [Z]"</span>.
            </p>
          </div>

          <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 self-start md:self-auto flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Realtime Impact AI
          </span>
        </div>

        {/* Aggregated Bullet Health Stat Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-zinc-100 dark:border-zinc-800">
          <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-700/60">
            <div className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">Avg Impact Score</div>
            <div className="text-lg sm:text-xl font-black text-zinc-900 dark:text-white mt-1 flex items-baseline gap-1.5">
              <span>{avgImpactScore}</span>
              <span className="text-xs font-semibold text-zinc-400">/ 100</span>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                avgImpactScore >= 80 ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                avgImpactScore >= 60 ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
                'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
              }`}>
                {avgImpactScore >= 80 ? 'Elite' : avgImpactScore >= 60 ? 'Competitive' : 'Needs Work'}
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-700/60">
            <div className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">Passive Phrases Flagged</div>
            <div className="text-lg sm:text-xl font-black text-rose-600 dark:text-rose-400 mt-1 flex items-baseline gap-1">
              <span>{totalPassiveDetected + totalWeakDetected}</span>
              <span className="text-xs font-normal text-zinc-500">instances</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-700/60">
            <div className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">Power Action Verbs</div>
            <div className="text-lg sm:text-xl font-black text-emerald-600 dark:text-emerald-400 mt-1 flex items-baseline gap-1">
              <span>{totalPowerVerbs}</span>
              <span className="text-xs font-normal text-zinc-500">detected</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-700/60">
            <div className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">Quantifiable Metrics</div>
            <div className="text-lg sm:text-xl font-black text-indigo-600 dark:text-indigo-400 mt-1 flex items-baseline gap-1">
              <span>{totalMetrics}</span>
              <span className="text-xs font-normal text-zinc-500">proof points</span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 1: Interactive Live Bullet Lab & Tester */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 sm:p-8 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-500" />
              Live Interactive Bullet Tester & Phrase Analyzer
            </h3>
            <p className="text-xs text-zinc-500 mt-0.5">
              Type or edit any sentence to watch the Impact Score and passive highlighting update in real time.
            </p>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-semibold text-zinc-400 mr-1">Sample Presets:</span>
            <button
              onClick={() => handleQuickPreset('weak')}
              className="text-[11px] px-2.5 py-1 rounded-lg border border-rose-200 dark:border-rose-800/80 bg-rose-50/60 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 font-semibold hover:bg-rose-100 transition-colors"
            >
              ⚠️ Passive Example
            </button>
            <button
              onClick={() => handleQuickPreset('elite')}
              className="text-[11px] px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800/80 bg-emerald-50/60 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-semibold hover:bg-emerald-100 transition-colors"
            >
              ⚡ Elite Impact
            </button>
          </div>
        </div>

        {/* Text Input Area */}
        <div className="space-y-2">
          <textarea
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            placeholder="Type or paste any resume bullet point here (e.g. Worked on building web features and helped team fix bugs...)"
            rows={3}
            className="w-full p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500 resize-none font-normal leading-relaxed shadow-inner"
          />

          {/* Quick detected bullets from resume */}
          {audit.bulletAnalyses.length > 0 && (
            <div className="pt-2">
              <span className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 block mb-2">
                Quick Select from Detected Resume Bullets:
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {audit.bulletAnalyses.slice(0, 4).map((b, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCustomInput(b.original)}
                    className={`text-left p-2.5 rounded-xl border text-xs transition-all flex items-center justify-between gap-2 ${
                      customInput === b.original
                        ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/40 text-zinc-900 dark:text-white font-medium shadow-xs'
                        : 'border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                    }`}
                  >
                    <span className="truncate">• {b.original}</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded flex-shrink-0 ${
                      b.score >= 80 ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                      b.score >= 60 ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
                      'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                    }`}>
                      {b.score} pts
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Real-time Bullet Impact Card Visualizer for Active Input */}
        <div className="pt-2">
          <BulletImpactCard
            analysis={activeAnalysis}
            onApplyReplacement={handleApplyReplacement}
            isDetailedView={true}
          />
        </div>
      </div>

      {/* SECTION 2: Full Resume Bullets Audit List */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-500" />
              All Detected Resume Bullets ({audit.bulletAnalyses.length})
            </h3>
            <p className="text-xs text-zinc-500">
              Each bullet point analyzed individually with passive voice alerts and tailored Google X-Y-Z rewrites.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1 p-1 bg-zinc-100 dark:bg-zinc-800/80 rounded-xl border border-zinc-200 dark:border-zinc-700/60 self-start sm:self-auto">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                filterMode === 'all'
                  ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-2xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
              }`}
            >
              All ({audit.bulletAnalyses.length})
            </button>
            <button
              onClick={() => setFilterMode('passive')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 ${
                filterMode === 'passive'
                  ? 'bg-rose-500 text-white shadow-2xs'
                  : 'text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40'
              }`}
            >
              <AlertOctagon className="w-3 h-3" />
              <span>Passive Flags ({audit.bulletAnalyses.filter(b => b.passivePhrasesFound.length > 0 || b.weakPhrasesFound.length > 0).length})</span>
            </button>
            <button
              onClick={() => setFilterMode('missing-metrics')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                filterMode === 'missing-metrics'
                  ? 'bg-amber-500 text-white shadow-2xs'
                  : 'text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40'
              }`}
            >
              No Numbers ({audit.bulletAnalyses.filter(b => !b.hasMetrics).length})
            </button>
            <button
              onClick={() => setFilterMode('high-impact')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                filterMode === 'high-impact'
                  ? 'bg-emerald-500 text-white shadow-2xs'
                  : 'text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
              }`}
            >
              ⚡ Elite (80+)
            </button>
          </div>
        </div>

        {/* Bullets Grid */}
        <div className="space-y-4">
          {filteredBullets.length > 0 ? (
            filteredBullets.map((bullet, idx) => (
              <BulletImpactCard
                key={idx}
                analysis={bullet}
                onSelectForLab={(text) => {
                  setCustomInput(text);
                  window.scrollTo({ top: 120, behavior: 'smooth' });
                }}
                onApplyReplacement={(newText) => {
                  setCustomInput(newText);
                  window.scrollTo({ top: 120, behavior: 'smooth' });
                }}
                isDetailedView={true}
              />
            ))
          ) : (
            <div className="p-8 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-center text-zinc-500 text-sm">
              No bullet points match the selected filter criteria.
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
