import { useState } from 'react';
import {
  Rocket,
  Twitter,
  Linkedin,
  Copy,
  Check,
  Send,
  Sparkles,
  Flame,
  MessageSquare,
  Globe,
  Share2
} from 'lucide-react';
import { FullAuditResult } from '../types';

interface LaunchCopyTabProps {
  audit: FullAuditResult;
}

export function LaunchCopyTab({ audit }: LaunchCopyTabProps) {
  const [activeSubTab, setActiveSubTab] = useState<'twitter' | 'linkedin' | 'outreach' | 'producthunt'>('twitter');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-8">
      
      {/* Top Banner */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 sm:p-8 border border-zinc-200 dark:border-zinc-800 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Rocket className="w-5 h-5 text-indigo-500" />
              <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
                Viral Launch & Recruiter Outreach Copy
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 max-w-2xl">
              Don't let your portfolio sit in silence. Ready-to-publish social copy and personalized cold outreach direct messages to get on hiring managers' radars.
            </p>
          </div>

          {/* Social Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 bg-zinc-100 dark:bg-zinc-800 p-1.5 rounded-xl self-start md:self-auto">
            <button
              onClick={() => setActiveSubTab('twitter')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                activeSubTab === 'twitter'
                  ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              <Twitter className="w-3.5 h-3.5 text-sky-500" /> Twitter Thread
            </button>
            <button
              onClick={() => setActiveSubTab('linkedin')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                activeSubTab === 'linkedin'
                  ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              <Linkedin className="w-3.5 h-3.5 text-blue-600" /> LinkedIn
            </button>
            <button
              onClick={() => setActiveSubTab('outreach')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                activeSubTab === 'outreach'
                  ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              <Send className="w-3.5 h-3.5 text-emerald-500" /> Cold Outreach DM
            </button>
            <button
              onClick={() => setActiveSubTab('producthunt')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                activeSubTab === 'producthunt'
                  ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              <Globe className="w-3.5 h-3.5 text-orange-500" /> Show HN / PH
            </button>
          </div>
        </div>
      </div>

      {/* Sub-Tab Content */}

      {/* 1. Twitter Thread */}
      {activeSubTab === 'twitter' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
              4-Tweet Launch Thread Sequence
            </span>
            <button
              onClick={() => handleCopy(audit.launchCopy.twitterThread.join('\n\n---\n\n'), 'all-tweets')}
              className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              {copiedKey === 'all-tweets' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'all-tweets' ? 'Copied All Tweets' : 'Copy Full Thread'}</span>
            </button>
          </div>

          <div className="space-y-4">
            {audit.launchCopy.twitterThread.map((tweet, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-zinc-900 rounded-2xl p-5 border border-zinc-200 dark:border-zinc-800 shadow-sm relative"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-sky-500 flex items-center gap-1.5">
                    <Twitter className="w-3.5 h-3.5" /> Tweet {idx + 1}/4
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-zinc-400 font-mono">
                      {tweet.length}/280 chars
                    </span>
                    <button
                      onClick={() => handleCopy(tweet, `tweet-${idx}`)}
                      className="p-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 transition-colors text-xs inline-flex items-center gap-1"
                    >
                      {copiedKey === `tweet-${idx}` ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedKey === `tweet-${idx}` ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 whitespace-pre-line leading-relaxed font-normal">
                  {tweet}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. LinkedIn Post */}
      {activeSubTab === 'linkedin' && (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 sm:p-8 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center gap-2">
              <Linkedin className="w-5 h-5 text-blue-600" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-white">
                Formatted LinkedIn Announcement Post
              </h3>
            </div>
            <button
              onClick={() => handleCopy(audit.launchCopy.linkedinPost, 'linkedin')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 transition-colors"
            >
              {copiedKey === 'linkedin' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'linkedin' ? 'Copied Post' : 'Copy LinkedIn Post'}</span>
            </button>
          </div>

          <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 whitespace-pre-line leading-relaxed">
            {audit.launchCopy.linkedinPost}
          </div>
        </div>
      )}

      {/* 3. Cold Outreach DM */}
      {activeSubTab === 'outreach' && (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 sm:p-8 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center gap-2">
              <Send className="w-5 h-5 text-emerald-500" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-white">
                High-Converting Cold Outreach DM
              </h3>
            </div>
            <button
              onClick={() => handleCopy(audit.launchCopy.coldOutreachDM, 'outreach')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 transition-colors"
            >
              {copiedKey === 'outreach' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'outreach' ? 'Copied DM' : 'Copy Direct Message'}</span>
            </button>
          </div>

          <p className="text-xs text-zinc-500">
            Customize the bracketed tokens (e.g. <span className="font-semibold text-zinc-700 dark:text-zinc-300">[Hiring Manager Name]</span>) before sending on LinkedIn or Email.
          </p>

          <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 whitespace-pre-line leading-relaxed">
            {audit.launchCopy.coldOutreachDM}
          </div>
        </div>
      )}

      {/* 4. Show HN & Product Hunt */}
      {activeSubTab === 'producthunt' && (
        <div className="space-y-6">
          
          {/* Hacker News Show HN */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400">
                Hacker News "Show HN" Title
              </span>
              <button
                onClick={() => handleCopy(audit.launchCopy.hackerNewsShow, 'hn')}
                className="p-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 text-xs font-medium inline-flex items-center gap-1"
              >
                {copiedKey === 'hn' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-zinc-600 dark:text-zinc-300" />}
                <span>{copiedKey === 'hn' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <div className="p-3 bg-zinc-50 dark:bg-zinc-800/60 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs sm:text-sm font-mono text-zinc-900 dark:text-white">
              {audit.launchCopy.hackerNewsShow}
            </div>
          </div>

          {/* Product Hunt Pitch */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400">
                Product Hunt Pitch & Maker Comment
              </span>
              <button
                onClick={() => handleCopy(
                  `Tagline: ${audit.launchCopy.productHuntPitch.tagline}\n\nDescription: ${audit.launchCopy.productHuntPitch.description}\n\nMaker Comment: ${audit.launchCopy.productHuntPitch.makerComment}`,
                  'ph'
                )}
                className="p-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 text-xs font-medium inline-flex items-center gap-1"
              >
                {copiedKey === 'ph' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-zinc-600 dark:text-zinc-300" />}
                <span>{copiedKey === 'ph' ? 'Copied' : 'Copy All'}</span>
              </button>
            </div>

            <div className="space-y-3 text-xs sm:text-sm">
              <div>
                <span className="text-zinc-500 font-semibold block text-[11px] uppercase mb-1">Tagline</span>
                <p className="p-2.5 bg-zinc-50 dark:bg-zinc-800/60 rounded-lg text-zinc-800 dark:text-zinc-200">
                  {audit.launchCopy.productHuntPitch.tagline}
                </p>
              </div>

              <div>
                <span className="text-zinc-500 font-semibold block text-[11px] uppercase mb-1">Description</span>
                <p className="p-2.5 bg-zinc-50 dark:bg-zinc-800/60 rounded-lg text-zinc-800 dark:text-zinc-200">
                  {audit.launchCopy.productHuntPitch.description}
                </p>
              </div>

              <div>
                <span className="text-zinc-500 font-semibold block text-[11px] uppercase mb-1">First Maker Comment</span>
                <p className="p-2.5 bg-zinc-50 dark:bg-zinc-800/60 rounded-lg text-zinc-800 dark:text-zinc-200">
                  {audit.launchCopy.productHuntPitch.makerComment}
                </p>
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
