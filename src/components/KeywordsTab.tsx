import { useState } from 'react';
import {
  Target,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Search,
  Zap,
  Info,
  Sparkles,
  Layers,
  ArrowRight
} from 'lucide-react';
import { FullAuditResult, KeywordMatch } from '../types';

interface KeywordsTabProps {
  audit: FullAuditResult;
  onNavigateToEditor: () => void;
}

export function KeywordsTab({ audit, onNavigateToEditor }: KeywordsTabProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'missing' | 'present'>('all');
  const [copiedKeyword, setCopiedKeyword] = useState<string | null>(null);

  const handleCopyContext = (text: string, kw: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKeyword(kw);
    setTimeout(() => setCopiedKeyword(null), 2000);
  };

  const filteredMissing = audit.missingKeywords.filter(k =>
    k.keyword.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPresent = audit.presentKeywords.filter(k =>
    k.keyword.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const matchRatio = Math.round(
    (audit.presentKeywords.length / Math.max(1, audit.presentKeywords.length + audit.missingKeywords.length)) * 100
  );

  return (
    <div className="space-y-8">
      
      {/* Top Banner: ATS Keyword Health Summary */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 sm:p-8 border border-zinc-200 dark:border-zinc-800 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-5 h-5 text-indigo-500" />
              <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
                ATS Keyword Radar & Industry Taxonomy
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 max-w-2xl">
              Applicant Tracking Systems (ATS) score your application against role-specific keyword density. Here is your exact match breakdown for <span className="font-semibold text-zinc-900 dark:text-white">{audit.targetRoleTitle}</span>.
            </p>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <div className="bg-zinc-50 dark:bg-zinc-800 p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-center min-w-[110px]">
              <span className="text-[10px] uppercase font-bold text-zinc-500 block">Keyword Match</span>
              <span className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400">{matchRatio}%</span>
            </div>
            <div className="bg-zinc-50 dark:bg-zinc-800 p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-center min-w-[110px]">
              <span className="text-[10px] uppercase font-bold text-zinc-500 block">Density Rating</span>
              <span className={`text-sm font-bold block mt-1 ${
                audit.keywordDensityRating === 'Balanced' ? 'text-emerald-600 dark:text-emerald-400' :
                audit.keywordDensityRating === 'Low' ? 'text-amber-600 dark:text-amber-400' : 'text-rose-600 dark:text-rose-400'
              }`}>
                {audit.keywordDensityRating}
              </span>
            </div>
          </div>

        </div>

        {/* Filter / Search Bar */}
        <div className="mt-6 pt-6 border-t border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search taxonomy keywords..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white placeholder-zinc-400 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center gap-1.5 self-start sm:self-auto bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                filterType === 'all'
                  ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              All ({audit.missingKeywords.length + audit.presentKeywords.length})
            </button>
            <button
              onClick={() => setFilterType('missing')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                filterType === 'missing'
                  ? 'bg-white dark:bg-zinc-700 text-rose-600 dark:text-rose-400 shadow-sm'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-rose-600'
              }`}
            >
              Missing ({audit.missingKeywords.length})
            </button>
            <button
              onClick={() => setFilterType('present')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                filterType === 'present'
                  ? 'bg-white dark:bg-zinc-700 text-emerald-600 dark:text-emerald-400 shadow-sm'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-emerald-600'
              }`}
            >
              Present ({audit.presentKeywords.length})
            </button>
          </div>

        </div>
      </div>

      {/* Main Grid: Missing High-Impact vs Present Keywords */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Missing Keywords (7 cols) */}
        {(filterType === 'all' || filterType === 'missing') && (
          <div className={`${filterType === 'missing' ? 'lg:col-span-12' : 'lg:col-span-7'} bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-rose-500" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-white">
                  Missing High-Impact Keywords
                </h3>
              </div>
              <span className="text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 px-2.5 py-0.5 rounded-full border border-rose-200 dark:border-rose-800">
                {filteredMissing.length} absent
              </span>
            </div>

            <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-6">
              These industry-standard terms were not detected. Click <span className="font-semibold text-zinc-700 dark:text-zinc-300">Copy Context</span> to get a natural sentence template to paste into your resume.
            </p>

            {filteredMissing.length === 0 ? (
              <div className="p-8 text-center bg-zinc-50 dark:bg-zinc-800/40 rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                  Zero missing keywords for this filter!
                </p>
                <p className="text-xs text-zinc-500">Your profile covers all standard requirements.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredMissing.map((kw, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl border border-rose-100 dark:border-rose-900/40 bg-rose-50/40 dark:bg-rose-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-sm text-zinc-900 dark:text-white">
                          {kw.keyword}
                        </span>
                        <span className={`text-[10px] font-semibold px-2 py-0.2 rounded ${
                          kw.importance === 'critical'
                            ? 'bg-rose-100 dark:bg-rose-900 text-rose-700 dark:text-rose-300'
                            : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300'
                        }`}>
                          {kw.importance}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-600 dark:text-zinc-400">
                        {kw.suggestedContext || `Demonstrate experience with ${kw.keyword} in projects or skills.`}
                      </p>
                    </div>

                    <button
                      onClick={() => handleCopyContext(
                        `Spearheaded the integration of ${kw.keyword} into core product architecture, accelerating delivery by 30%.`,
                        kw.keyword
                      )}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors shrink-0 self-end sm:self-auto shadow-sm"
                    >
                      {copiedKeyword === kw.keyword ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                          <span>Copied Context</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-indigo-500" />
                          <span>Copy Sentence</span>
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Present Keywords (5 cols) */}
        {(filterType === 'all' || filterType === 'present') && (
          <div className={`${filterType === 'present' ? 'lg:col-span-12' : 'lg:col-span-5'} bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-white">
                  Present Keywords Found
                </h3>
              </div>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                {filteredPresent.length} found
              </span>
            </div>

            <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-6">
              Confirmed match keywords already detected in your portfolio or resume text.
            </p>

            {filteredPresent.length === 0 ? (
              <div className="p-8 text-center bg-zinc-50 dark:bg-zinc-800/40 rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700">
                <Info className="w-8 h-8 text-zinc-400 mx-auto mb-2" />
                <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                  No matching keywords found
                </p>
                <p className="text-xs text-zinc-500">Paste your content to detect keywords.</p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {filteredPresent.map((kw, idx) => (
                  <div
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold text-emerald-800 dark:text-emerald-200 shadow-sm"
                  >
                    <span>{kw.keyword}</span>
                    <span className="w-4 h-4 rounded-full bg-emerald-200 dark:bg-emerald-800 text-[10px] flex items-center justify-center font-bold text-emerald-900 dark:text-emerald-100">
                      {kw.countInText}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
              <div className="text-xs text-zinc-500">
                Want to update your content live?
              </div>
              <button
                onClick={onNavigateToEditor}
                className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Open Live Editor <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
