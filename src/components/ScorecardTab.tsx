import { useState } from 'react';
import { motion } from 'motion/react';
import {
  Trophy,
  CheckCircle2,
  AlertTriangle,
  Flame,
  ArrowUpRight,
  Copy,
  Check,
  Zap,
  Target,
  Sparkles,
  ExternalLink,
  Code2,
  TrendingUp,
  BarChart3
} from 'lucide-react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip } from 'recharts';
import { FullAuditResult } from '../types';
import { PortfolioHealthScore } from './PortfolioHealthScore';

interface ScorecardTabProps {
  audit: FullAuditResult;
  onNavigateTab: (tabId: string) => void;
}

export function ScorecardTab({ audit, onNavigateTab }: ScorecardTabProps) {
  const [copiedCritique, setCopiedCritique] = useState(false);

  const radarData = [
    { subject: 'ATS Match', value: audit.score.atsCompliance, fullMark: 100 },
    { subject: 'Metrics Density', value: audit.score.impactMetrics, fullMark: 100 },
    { subject: 'Tech Depth', value: audit.score.technicalDepth, fullMark: 100 },
    { subject: 'Action Verbs', value: audit.score.actionVerbPower, fullMark: 100 },
    { subject: 'Structure & UX', value: audit.score.structureAndUx, fullMark: 100 },
    { subject: 'Social Proof', value: audit.score.socialProof, fullMark: 100 },
  ];

  const handleCopyCritique = () => {
    navigator.clipboard.writeText(audit.summaryBrutalCritique);
    setCopiedCritique(true);
    setTimeout(() => setCopiedCritique(false), 2000);
  };

  return (
    <div className="space-y-8">
      
      {/* Top Banner: Portfolio Health Score Circular Progress Gauge & 6-Axis Radar Visualizer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Portfolio Health Score with Circular Progress Gauge (5 cols) */}
        <div className="lg:col-span-5 flex">
          <PortfolioHealthScore
            score={audit.score.overall}
            grade={audit.grade}
            percentileRank={audit.percentileRank}
            targetRoleTitle={audit.targetRoleTitle}
            subScores={{
              atsCompliance: audit.score.atsCompliance,
              impactMetrics: audit.score.impactMetrics,
              technicalDepth: audit.score.technicalDepth,
              actionVerbPower: audit.score.actionVerbPower,
              structureAndUx: audit.score.structureAndUx,
              socialProof: audit.score.socialProof
            }}
            className="w-full"
          />
        </div>

        {/* 6-Axis Radar Visualizer (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-indigo-500" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-white">
                6-Dimensional Competency Radar
              </h3>
            </div>
            <span className="text-xs text-zinc-500">Benchmark Scale: 0 – 100</span>
          </div>

          <div className="w-full h-64 sm:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
                <PolarGrid stroke="currentColor" className="text-zinc-200 dark:text-zinc-800" />
                <PolarAngleAxis 
                  dataKey="subject" 
                  tick={{ fill: 'currentColor', fontSize: 11, fontWeight: 500 }}
                  className="text-zinc-600 dark:text-zinc-400"
                />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#71717a" opacity={0.3} />
                <Radar
                  name="Score"
                  dataKey="value"
                  stroke="#6366f1"
                  fill="#6366f1"
                  fillOpacity={0.35}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(24, 24, 27, 0.95)', 
                    borderColor: '#3f3f46', 
                    borderRadius: '8px', 
                    color: '#fff',
                    fontSize: '12px'
                  }}
                  formatter={(val: any) => [`${val} / 100`, 'Score']}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 pt-3 border-t border-zinc-100 dark:border-zinc-800/80 text-center">
            {radarData.map(item => (
              <div key={item.subject} className="p-1.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/50">
                <div className="text-[10px] font-medium text-zinc-500 truncate">{item.subject}</div>
                <div className="text-xs font-bold text-zinc-900 dark:text-white">{item.value}%</div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Brutal Constructive Critique Banner */}
      <div className="bg-gradient-to-br from-indigo-900/10 via-purple-900/10 to-pink-900/10 dark:from-indigo-950/40 dark:via-purple-950/30 dark:to-zinc-900 rounded-2xl p-6 sm:p-8 border border-indigo-200/60 dark:border-indigo-800/40 shadow-sm relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
                Executive Audit Critique
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Honest, recruiter-perspective feedback on your positioning
              </p>
            </div>
          </div>

          <button
            onClick={handleCopyCritique}
            id="copy-critique-btn"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors shrink-0"
          >
            {copiedCritique ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedCritique ? 'Copied' : 'Copy Critique'}</span>
          </button>
        </div>

        <p className="text-sm sm:text-base text-zinc-700 dark:text-zinc-300 leading-relaxed font-normal">
          {audit.summaryBrutalCritique}
        </p>

        {/* Quick Readability & Verb Metrics Pill row */}
        <div className="mt-6 pt-4 border-t border-indigo-200/50 dark:border-indigo-900/50 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="bg-white/70 dark:bg-zinc-900/70 p-2.5 rounded-xl border border-zinc-200/50 dark:border-zinc-800">
            <span className="text-zinc-500 block text-[10px] uppercase font-semibold">Word Count</span>
            <span className="font-bold text-zinc-900 dark:text-white text-sm">{audit.readability.wordCount} words</span>
          </div>
          <div className="bg-white/70 dark:bg-zinc-900/70 p-2.5 rounded-xl border border-zinc-200/50 dark:border-zinc-800">
            <span className="text-zinc-500 block text-[10px] uppercase font-semibold">Metrics Density</span>
            <span className="font-bold text-zinc-900 dark:text-white text-sm">{audit.readability.metricsDensityPercent}% of sentences</span>
          </div>
          <div className="bg-white/70 dark:bg-zinc-900/70 p-2.5 rounded-xl border border-zinc-200/50 dark:border-zinc-800">
            <span className="text-zinc-500 block text-[10px] uppercase font-semibold">Reading Ease</span>
            <span className="font-bold text-zinc-900 dark:text-white text-sm">{audit.readability.readingEase}/100</span>
          </div>
          <div className="bg-white/70 dark:bg-zinc-900/70 p-2.5 rounded-xl border border-zinc-200/50 dark:border-zinc-800">
            <span className="text-zinc-500 block text-[10px] uppercase font-semibold">Power Verbs Used</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">{audit.readability.strongVerbsFound.length} found</span>
          </div>
        </div>
      </div>

      {/* Strengths & Red Flags Side-by-Side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Strengths */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-white">
              Key Competitive Strengths
            </h3>
          </div>
          <ul className="space-y-3">
            {audit.keyStrengths.map((str, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                <span>{str}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Red Flags */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-white">
              Critical Red Flags & Blind Spots
            </h3>
          </div>
          <ul className="space-y-3">
            {audit.redFlags.map((flag, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                <span>{flag}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* Actionable Prioritized Checklist */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-white">
              Prioritized Optimization Checklist
            </h3>
            <p className="text-xs text-zinc-500">
              Ranked in order of highest expected return on recruiter callback rates
            </p>
          </div>
          <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 px-3 py-1 rounded-full border border-indigo-100 dark:border-indigo-900 self-start sm:self-auto">
            4 Action Items
          </span>
        </div>

        <div className="space-y-4">
          {audit.actionableChecklist.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                    item.priority === 'Critical' ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800' :
                    item.priority === 'High' ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800' :
                    'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800'
                  }`}>
                    {item.priority}
                  </span>
                  <h4 className="text-sm font-semibold text-zinc-900 dark:text-white">
                    {item.title}
                  </h4>
                </div>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 pl-0 sm:pl-1">
                  {item.description}
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800">
                  {item.estimatedLift}
                </span>
                <button
                  onClick={() => onNavigateTab(item.title.includes('Keyword') ? 'keywords' : item.title.includes('Bullet') ? 'bullets' : 'editor')}
                  className="p-1.5 rounded-lg bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-700 dark:hover:bg-zinc-600 text-zinc-700 dark:text-zinc-200 transition-colors text-xs inline-flex items-center gap-1"
                >
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Extracted Projects Roast & Evaluation */}
      {audit.projects.length > 0 && (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Code2 className="w-5 h-5 text-indigo-500" />
              <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                Project Portfolio Breakdown & Roasts
              </h3>
            </div>
            <span className="text-xs text-zinc-500">{audit.projects.length} Projects Analyzed</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {audit.projects.map((proj, idx) => (
              <div
                key={idx}
                className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/40 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h4 className="font-bold text-zinc-900 dark:text-white text-sm sm:text-base">
                      {proj.title}
                    </h4>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300">
                      {proj.score}/100
                    </span>
                  </div>

                  <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-4 line-clamp-3">
                    {proj.description}
                  </p>

                  {/* Tech chips */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {proj.detectedTech.map((t, tidx) => (
                      <span key={tidx} className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-zinc-200/80 dark:bg-zinc-700/80 text-zinc-800 dark:text-zinc-200">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-zinc-200/60 dark:border-zinc-700/60">
                  <div className="text-[11px] font-semibold text-amber-700 dark:text-amber-400 mb-1 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Technical Review & Suggestions:
                  </div>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 italic">
                    "{proj.roastAndSuggestion}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
