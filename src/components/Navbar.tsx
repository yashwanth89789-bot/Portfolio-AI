import { Sparkles, FileText, Download, Moon, Sun, Layers } from 'lucide-react';
import { Logo } from './Logo';

interface NavbarProps {
  onOpenSampleModal: () => void;
  onOpenExportModal: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onReset: () => void;
  hasResults: boolean;
}

export function Navbar({
  onOpenSampleModal,
  onOpenExportModal,
  isDarkMode,
  onToggleDarkMode,
  onReset,
  hasResults
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/85 dark:bg-zinc-950/85 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Left: Brand */}
        <div 
          onClick={onReset}
          className="flex items-center gap-2.5 cursor-pointer group"
          id="brand-logo-btn"
        >
          <Logo size="sm" className="group-hover:scale-105 transition-transform" />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base sm:text-lg tracking-tight text-zinc-900 dark:text-white">
                Portfolio Booster
              </span>
              <span className="text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                PRO
              </span>
            </div>
          </div>
        </div>

        {/* Center/Right Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          <button
            onClick={onOpenSampleModal}
            id="navbar-sample-portfolios-btn"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 transition-colors border border-zinc-200 dark:border-zinc-700"
          >
            <Layers className="w-3.5 h-3.5 text-indigo-500" />
            <span className="hidden sm:inline">Try Sample Profiles</span>
            <span className="sm:hidden">Samples</span>
          </button>

          {hasResults && (
            <button
              onClick={onOpenExportModal}
              id="navbar-export-report-btn"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 transition-colors border border-indigo-200 dark:border-indigo-800"
            >
              <Download className="w-3.5 h-3.5 text-indigo-500" />
              <span>Export Report</span>
            </button>
          )}

          <button
            onClick={onToggleDarkMode}
            id="navbar-dark-mode-toggle"
            aria-label="Toggle dark mode"
            className="p-2 rounded-lg text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-100 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 transition-colors border border-zinc-200 dark:border-zinc-700"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-zinc-600" />}
          </button>

        </div>
      </div>
    </header>
  );
}
