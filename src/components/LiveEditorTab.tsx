import { useState, useEffect } from 'react';
import {
  Edit3,
  Sparkles,
  Zap,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Target,
  BarChart2,
  Copy,
  Check
} from 'lucide-react';
import { FullAuditResult } from '../types';
import { performLocalAudit } from '../services/analyzerEngine';

interface LiveEditorTabProps {
  initialContent: string;
  roleId: string;
  onUpdateContent: (newContent: string) => void;
}

export function LiveEditorTab({ initialContent, roleId, onUpdateContent }: LiveEditorTabProps) {
  const [content, setContent] = useState(initialContent);
  const [liveAudit, setLiveAudit] = useState<FullAuditResult>(() => performLocalAudit(initialContent, roleId));
  const [copied, setCopied] = useState(false);

  // Debounced real-time analysis
  useEffect(() => {
    const timer = setTimeout(() => {
      const result = performLocalAudit(content, roleId);
      setLiveAudit(result);
      onUpdateContent(content);
    }, 250);

    return () => clearTimeout(timer);
  }, [content, roleId]);

  const handleInsertKeyword = (kw: string) => {
    const addition = `\n• Spearheaded core ${kw} architecture, boosting system throughput by 35%.`;
    setContent(prev => prev + addition);
  };

  const handleCopyContent = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Bar */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Edit3 className="w-5 h-5 text-indigo-500" />
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
              Live Real-Time Optimizer & Scratchpad
            </h2>
          </div>
          <p className="text-xs text-zinc-500">
            Edit your resume or portfolio content on the left — scores and keywords update instantly.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleCopyContent}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied Content' : 'Copy Text'}</span>
          </button>
        </div>
      </div>

      {/* Side-by-Side Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Editor (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-3 text-xs text-zinc-500">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Markdown / Text Editor</span>
            <div className="flex items-center gap-3">
              <span>{content.split(/\s+/).filter(Boolean).length} words</span>
              <span>{content.length} chars</span>
            </div>
          </div>

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Paste or write your resume / portfolio content here..."
            rows={18}
            className="w-full p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white text-xs sm:text-sm font-mono leading-relaxed outline-none focus:ring-2 focus:ring-indigo-500 resize-y"
          />

          {/* Quick Keyword Inserter */}
          {liveAudit.missingKeywords.length > 0 && (
            <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
              <span className="text-[11px] font-semibold text-zinc-500 block mb-2">
                Click to append missing keyword template:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {liveAudit.missingKeywords.slice(0, 6).map((kw, i) => (
                  <button
                    key={i}
                    onClick={() => handleInsertKeyword(kw.keyword)}
                    className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/60 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 transition-colors inline-flex items-center gap-1"
                  >
                    <span>+ {kw.keyword}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Live Diagnostics (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Live Score Overview Card */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-4 flex items-center justify-between">
              <span>Real-Time Audit Score</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">Live Synced</span>
            </h3>

            <div className="flex items-center justify-between mb-4">
              <div className="text-4xl font-extrabold text-zinc-900 dark:text-white">
                {liveAudit.score.overall}<span className="text-lg text-zinc-400 font-normal">/100</span>
              </div>
              <div className="text-2xl font-black px-4 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                Grade {liveAudit.grade}
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div>
                <div className="flex justify-between text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  <span>ATS Keyword Match</span>
                  <span>{liveAudit.score.atsCompliance}%</span>
                </div>
                <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-indigo-600 h-full rounded-full transition-all duration-300" style={{ width: `${liveAudit.score.atsCompliance}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  <span>Metrics Density</span>
                  <span>{liveAudit.score.impactMetrics}%</span>
                </div>
                <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full transition-all duration-300" style={{ width: `${liveAudit.score.impactMetrics}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  <span>Action Verb Power</span>
                  <span>{liveAudit.score.actionVerbPower}%</span>
                </div>
                <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full transition-all duration-300" style={{ width: `${liveAudit.score.actionVerbPower}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* Real-time Keyword Breakdown */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-white mb-3 flex items-center justify-between">
              <span>Matched Keywords ({liveAudit.presentKeywords.length})</span>
              <span className="text-[10px] text-zinc-500">{liveAudit.missingKeywords.length} Missing</span>
            </h3>

            <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
              {liveAudit.presentKeywords.map((kw, idx) => (
                <span
                  key={idx}
                  className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800"
                >
                  ✓ {kw.keyword} ({kw.countInText})
                </span>
              ))}
            </div>
          </div>

          {/* Real-time Bullet Impact Scores */}
          {liveAudit.bulletAnalyses.length > 0 && (
            <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-white mb-3 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  Live Bullet Impact Scores
                </span>
                <span className="text-[10px] text-zinc-500">{liveAudit.bulletAnalyses.length} Bullets</span>
              </h3>

              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {liveAudit.bulletAnalyses.map((b, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/40 text-xs flex items-center justify-between gap-2"
                  >
                    <span className="truncate text-zinc-700 dark:text-zinc-300">• {b.original}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                      b.score >= 80 ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                      b.score >= 60 ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
                      'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                    }`}>
                      {b.score}/100
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
