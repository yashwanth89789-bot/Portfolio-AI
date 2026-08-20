import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  BarChart3,
  Target,
  Zap,
  Eye,
  Rocket,
  Edit3,
  Download,
  Share2,
  ArrowLeft,
  Check,
  Briefcase
} from 'lucide-react';
import { FullAuditResult } from '../types';
import { ScorecardTab } from './ScorecardTab';
import { KeywordsTab } from './KeywordsTab';
import { BulletPointLabTab } from './BulletPointLabTab';
import { RecruiterHeatmapTab } from './RecruiterHeatmapTab';
import { LaunchCopyTab } from './LaunchCopyTab';
import { LiveEditorTab } from './LiveEditorTab';
import { ExportModal } from './ExportModal';

interface AnalysisResultProps {
  audit: FullAuditResult;
  rawContent: string;
  onReset: () => void;
  onUpdateContent: (newContent: string) => void;
}

export function AnalysisResult({ audit, rawContent, onReset, onUpdateContent }: AnalysisResultProps) {
  const [activeTab, setActiveTab] = useState<'scorecard' | 'keywords' | 'bullets' | 'heatmap' | 'launch' | 'editor'>('scorecard');
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  const tabs = [
    { id: 'scorecard' as const, label: 'Scorecard & Radar', icon: BarChart3, badge: `${audit.score.overall}/100` },
    { id: 'keywords' as const, label: 'ATS Keywords', icon: Target, badge: `${audit.missingKeywords.length} missing` },
    { id: 'bullets' as const, label: 'Bullet Impact Lab', icon: Zap, badge: 'Impact Score' },
    { id: 'heatmap' as const, label: '6s Recruiter Glance', icon: Eye, badge: 'Simulated' },
    { id: 'launch' as const, label: 'Viral Launch & Outreach', icon: Rocket, badge: '4 Channels' },
    { id: 'editor' as const, label: 'Live Editor', icon: Edit3, badge: 'Realtime' },
  ];

  const handleShare = async () => {
    const text = `I just audited my ${audit.targetRoleTitle} portfolio on Portfolio Booster!\nScore: ${audit.score.overall}/100 (Grade ${audit.grade}) - Top ${100 - audit.percentileRank}%`;
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    }
  };

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-300">
      
      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>New Profile Audit</span>
        </button>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-xs font-semibold">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Target: {audit.targetRoleTitle}</span>
          </div>

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 text-xs font-semibold transition-colors border border-zinc-200 dark:border-zinc-700"
          >
            {copiedShare ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copiedShare ? 'Copied Share Link' : 'Share Score'}</span>
          </button>

          <button
            onClick={() => setIsExportOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Main Tab Navigation Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-zinc-100 dark:border-zinc-800">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-sm'
                  : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white border border-zinc-200/80 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                  isActive
                    ? 'bg-zinc-700 dark:bg-zinc-200 text-zinc-200 dark:text-zinc-800'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'
                }`}
              >
                {tab.badge}
              </span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'scorecard' && (
            <ScorecardTab
              audit={audit}
              onNavigateTab={(tab) => setActiveTab(tab as any)}
            />
          )}

          {activeTab === 'keywords' && (
            <KeywordsTab
              audit={audit}
              onNavigateToEditor={() => setActiveTab('editor')}
            />
          )}

          {activeTab === 'bullets' && (
            <BulletPointLabTab audit={audit} />
          )}

          {activeTab === 'heatmap' && (
            <RecruiterHeatmapTab
              audit={audit}
              rawContent={rawContent}
            />
          )}

          {activeTab === 'launch' && (
            <LaunchCopyTab audit={audit} />
          )}

          {activeTab === 'editor' && (
            <LiveEditorTab
              initialContent={rawContent}
              roleId={audit.roleId}
              onUpdateContent={onUpdateContent}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Export Modal */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        audit={audit}
      />

    </div>
  );
}
