import { useState } from 'react';
import { X, Download, Copy, Check, FileText, Code2, Sparkles } from 'lucide-react';
import { FullAuditResult } from '../types';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  audit: FullAuditResult;
}

export function ExportModal({ isOpen, onClose, audit }: ExportModalProps) {
  const [exportFormat, setExportFormat] = useState<'markdown' | 'json' | 'text'>('markdown');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const generateMarkdown = () => {
    return `# Portfolio Booster Audit Report: ${audit.targetRoleTitle}
**Overall Score:** ${audit.score.overall}/100 (Grade ${audit.grade})
**Percentile Rank:** Top ${100 - audit.percentileRank}%

## Executive Critique
${audit.summaryBrutalCritique}

## Competency Scorecard
- ATS Compliance: ${audit.score.atsCompliance}/100
- Impact & Metrics Density: ${audit.score.impactMetrics}/100
- Technical Depth: ${audit.score.technicalDepth}/100
- Action Verb Power: ${audit.score.actionVerbPower}/100
- Structure & UX: ${audit.score.structureAndUx}/100
- Social Proof: ${audit.score.socialProof}/100

## Missing High-Impact Keywords (${audit.missingKeywords.length})
${audit.missingKeywords.map(k => `- ${k.keyword} (${k.importance})`).join('\n')}

## Key Strengths
${audit.keyStrengths.map(s => `- ${s}`).join('\n')}

## Critical Blind Spots
${audit.redFlags.map(f => `- ${f}`).join('\n')}

## Prioritized Action Items
${audit.actionableChecklist.map(a => `### ${a.title} [${a.priority}] - Estimated Lift: ${a.estimatedLift}\n${a.description}`).join('\n\n')}
`;
  };

  const generateExportText = () => {
    if (exportFormat === 'json') {
      return JSON.stringify(audit, null, 2);
    }
    if (exportFormat === 'text') {
      return `PORTFOLIO BOOSTER AUDIT REPORT
Target Role: ${audit.targetRoleTitle}
Score: ${audit.score.overall}/100 (Grade ${audit.grade})
Percentile: Top ${100 - audit.percentileRank}%

CRITIQUE:
${audit.summaryBrutalCritique}

ACTION ITEMS:
${audit.actionableChecklist.map(a => `• ${a.title} (${a.estimatedLift})`).join('\n')}
`;
    }
    return generateMarkdown();
  };

  const textToExport = generateExportText();

  const handleCopy = () => {
    navigator.clipboard.writeText(textToExport);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const ext = exportFormat === 'json' ? 'json' : exportFormat === 'markdown' ? 'md' : 'txt';
    const blob = new Blob([textToExport], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `portfolio-audit-${audit.roleId}.${ext}`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl max-w-2xl w-full border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                Export Audit Report
              </h3>
              <p className="text-xs text-zinc-500">
                Download or copy your complete analysis and action checklist
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-zinc-700 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Format Selector */}
        <div className="p-6 pb-2">
          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={() => setExportFormat('markdown')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                exportFormat === 'markdown'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
              }`}
            >
              <FileText className="w-3.5 h-3.5" /> Markdown (.md)
            </button>
            <button
              onClick={() => setExportFormat('json')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                exportFormat === 'json'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" /> Raw JSON Schema
            </button>
          </div>

          <textarea
            readOnly
            value={textToExport}
            rows={10}
            className="w-full p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-mono text-zinc-800 dark:text-zinc-200 outline-none"
          />
        </div>

        {/* Footer */}
        <div className="p-6 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-end gap-3">
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied to Clipboard' : 'Copy Text'}</span>
          </button>
          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download File</span>
          </button>
        </div>

      </div>
    </div>
  );
}
