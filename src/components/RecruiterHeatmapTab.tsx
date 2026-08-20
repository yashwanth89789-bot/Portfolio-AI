import { useState } from 'react';
import {
  Eye,
  Clock,
  Flame,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Info,
  Layers,
  Zap,
  MousePointer
} from 'lucide-react';
import { FullAuditResult } from '../types';

interface RecruiterHeatmapTabProps {
  audit: FullAuditResult;
  rawContent: string;
}

export function RecruiterHeatmapTab({ audit, rawContent }: RecruiterHeatmapTabProps) {
  const [showHeatmapOverlay, setShowHeatmapOverlay] = useState(true);
  const [selectedScanArea, setSelectedScanArea] = useState<string | null>(audit.recruiterHeatmap[0]?.id || null);

  const activeArea = audit.recruiterHeatmap.find(a => a.id === selectedScanArea) || audit.recruiterHeatmap[0];

  const getIntensityBadge = (intensity: string) => {
    switch (intensity) {
      case 'high':
        return 'bg-rose-500 text-white shadow-rose-500/30';
      case 'medium':
        return 'bg-amber-500 text-white shadow-amber-500/30';
      case 'low':
        return 'bg-blue-500 text-white shadow-blue-500/30';
      default:
        return 'bg-zinc-500 text-white';
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Top Banner */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 sm:p-8 border border-zinc-200 dark:border-zinc-800 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Eye className="w-5 h-5 text-indigo-500" />
              <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
                Recruiter 6-Second Glance Simulator
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 max-w-2xl">
              Industry studies show tech recruiters spend an average of <span className="font-semibold text-zinc-900 dark:text-white">6.2 seconds</span> scanning a resume before deciding to advance or pass. Here is the simulated eye gaze heatmap.
            </p>
          </div>

          {/* Heatmap overlay toggle */}
          <div className="flex items-center gap-3 self-start md:self-auto bg-zinc-100 dark:bg-zinc-800 p-1.5 rounded-xl">
            <button
              onClick={() => setShowHeatmapOverlay(true)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                showHeatmapOverlay
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              <Flame className="w-3.5 h-3.5" /> Heatmap Mode
            </button>
            <button
              onClick={() => setShowHeatmapOverlay(false)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                !showHeatmapOverlay
                  ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              Clean Text
            </button>
          </div>
        </div>

        {/* Timeline Bar */}
        <div className="mt-6 pt-6 border-t border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center justify-between text-xs text-zinc-500 font-semibold mb-2">
            <span>0.0s (First Contact)</span>
            <span>3.0s (Mid-Scan Skim)</span>
            <span>6.0s (Decision Gate)</span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {audit.recruiterHeatmap.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => setSelectedScanArea(item.id)}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  selectedScanArea === item.id
                    ? 'border-indigo-500 bg-indigo-50/60 dark:bg-indigo-950/40 ring-2 ring-indigo-500/20'
                    : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/40 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase">{item.gazeTimeEst}</span>
                  <span className={`w-2 h-2 rounded-full ${
                    item.intensity === 'high' ? 'bg-rose-500' :
                    item.intensity === 'medium' ? 'bg-amber-500' : 'bg-blue-400'
                  }`} />
                </div>
                <div className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 truncate">
                  Phase {idx + 1}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Heatmap Visual Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Interactive Simulated Document with Visual Overlays (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-zinc-900 rounded-2xl p-6 sm:p-8 border border-zinc-200 dark:border-zinc-800 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-100 dark:border-zinc-800">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-1.5">
              <MousePointer className="w-3.5 h-3.5 text-indigo-500" /> Simulated Document Canvas
            </span>
            <span className="text-[11px] text-zinc-400">Click any zone to inspect feedback</span>
          </div>

          <div className="space-y-4 font-mono text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed max-h-[480px] overflow-y-auto pr-2">
            
            {/* Zone 1: Header */}
            <div
              onClick={() => setSelectedScanArea('header-anchor')}
              className={`p-4 rounded-xl cursor-pointer transition-all relative ${
                selectedScanArea === 'header-anchor' ? 'ring-2 ring-indigo-500' : ''
              } ${
                showHeatmapOverlay
                  ? 'bg-rose-500/10 dark:bg-rose-500/20 border border-rose-300 dark:border-rose-700/60'
                  : 'bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700'
              }`}
            >
              {showHeatmapOverlay && (
                <span className="absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500 text-white">
                  🔥 High Fixation (0-1.4s)
                </span>
              )}
              <div className="font-bold text-sm text-zinc-900 dark:text-white mb-1">
                {rawContent.split('\n')[0] || 'Full Name & Target Professional Title'}
              </div>
              <div className="text-zinc-500 text-[11px]">
                {rawContent.split('\n')[1] || 'San Francisco, CA • email@example.com • github.com/portfolio'}
              </div>
            </div>

            {/* Zone 2: Summary / Top Bullets */}
            <div
              onClick={() => setSelectedScanArea('top-bullets')}
              className={`p-4 rounded-xl cursor-pointer transition-all relative ${
                selectedScanArea === 'top-bullets' ? 'ring-2 ring-indigo-500' : ''
              } ${
                showHeatmapOverlay
                  ? audit.score.impactMetrics > 75
                    ? 'bg-rose-500/10 dark:bg-rose-500/20 border border-rose-300 dark:border-rose-700/60'
                    : 'bg-amber-500/10 dark:bg-amber-500/20 border border-amber-300 dark:border-amber-700/60'
                  : 'bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700'
              }`}
            >
              {showHeatmapOverlay && (
                <span className="absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-white">
                  ⚡ Skim Zone (1.5-3.1s)
                </span>
              )}
              <div className="font-semibold text-zinc-900 dark:text-white mb-2 uppercase text-[11px]">
                Professional Summary & Experience Highlights
              </div>
              <p className="line-clamp-4 text-zinc-600 dark:text-zinc-400 text-[11px] leading-relaxed">
                {rawContent.split('\n').slice(2, 8).join(' ') ||
                  'Architected and deployed high-performance microservices, reducing bundle size by 42% and boosting conversion by 28% across 150,000+ active users.'}
              </p>
            </div>

            {/* Zone 3: Technical Skills Matrix */}
            <div
              onClick={() => setSelectedScanArea('skills-cloud')}
              className={`p-4 rounded-xl cursor-pointer transition-all relative ${
                selectedScanArea === 'skills-cloud' ? 'ring-2 ring-indigo-500' : ''
              } ${
                showHeatmapOverlay
                  ? 'bg-blue-500/10 dark:bg-blue-500/20 border border-blue-300 dark:border-blue-700/60'
                  : 'bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700'
              }`}
            >
              {showHeatmapOverlay && (
                <span className="absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500 text-white">
                  🎯 Keyword Scan (3.2-4.5s)
                </span>
              )}
              <div className="font-semibold text-zinc-900 dark:text-white mb-2 uppercase text-[11px]">
                Core Competencies & Frameworks
              </div>
              <div className="flex flex-wrap gap-1 text-[10px]">
                {audit.presentKeywords.slice(0, 8).map((k, i) => (
                  <span key={i} className="px-2 py-0.5 rounded bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200">
                    {k.keyword}
                  </span>
                ))}
              </div>
            </div>

            {/* Zone 4: Projects & Links */}
            <div
              onClick={() => setSelectedScanArea('projects-links')}
              className={`p-4 rounded-xl cursor-pointer transition-all relative ${
                selectedScanArea === 'projects-links' ? 'ring-2 ring-indigo-500' : ''
              } ${
                showHeatmapOverlay
                  ? 'bg-purple-500/10 dark:bg-purple-500/20 border border-purple-300 dark:border-purple-700/60'
                  : 'bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700'
              }`}
            >
              {showHeatmapOverlay && (
                <span className="absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500 text-white">
                  🚀 Proof of Work (4.6-6.0s)
                </span>
              )}
              <div className="font-semibold text-zinc-900 dark:text-white mb-2 uppercase text-[11px]">
                Featured Projects & Repositories
              </div>
              <div className="text-[11px] text-zinc-600 dark:text-zinc-400">
                {audit.projects[0]?.title || 'Core Product Showcase'} — Live Demo & GitHub Links
              </div>
            </div>

          </div>
        </div>

        {/* Right: Selected Zone Analysis & Attention Friction Advice (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Zone Feedback
              </span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                Estimated: {activeArea.gazeTimeEst}
              </span>
            </div>

            <h3 className="text-base font-bold text-zinc-900 dark:text-white mb-3">
              {activeArea.label}
            </h3>

            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed mb-6">
              {activeArea.feedback}
            </p>

            {/* Cognitive tips */}
            <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 space-y-2">
              <div className="text-xs font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Recruiter Attention Optimization
              </div>
              <ul className="space-y-1.5 text-xs text-zinc-600 dark:text-zinc-400">
                <li className="flex items-start gap-1.5">
                  <span className="text-indigo-500 font-bold">•</span>
                  <span>Place metrics (%, $, ms, users) in the first 4 words of each bullet point to catch eye fixations.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-indigo-500 font-bold">•</span>
                  <span>Keep paragraphs under 3 lines to prevent cognitive skim drop-off.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-indigo-500 font-bold">•</span>
                  <span>Ensure your target role title is identical to the open position job title.</span>
                </li>
              </ul>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
