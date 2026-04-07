import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { CheckCircle2, MessageSquare, Rocket, Copy, Check, Flame, Trophy, Linkedin, Github, Twitter, Share2 } from 'lucide-react';
import { Logo } from './Logo';

interface ScoreData {
  overall: number;
  breakdown: {
    ux: number;
    content: number;
    technical: number;
    seo: number;
    social: number;
  };
  summary: string;
}

interface Project {
  title: string;
  description: string;
  liveDemoUrl?: string;
  githubUrl?: string;
  suggestion?: string;
}

interface AnalysisResultProps {
  critique: string;
  marketing: string;
  improvements: string;
  roast: string;
  score: ScoreData | null;
  socialLinks: { linkedin: string, github: string, twitter: string };
  analyzedUrl: string;
  projects: Project[];
}

export function AnalysisResult({ critique, marketing, improvements, roast, score, socialLinks, analyzedUrl, projects }: AnalysisResultProps) {
  const [activeTab, setActiveTab] = useState<'critique' | 'marketing' | 'improvements' | 'roast'>('critique');
  const [copied, setCopied] = useState(false);

  const tabs = [
    { id: 'critique', label: 'Critique', icon: MessageSquare },
    { id: 'improvements', label: 'Improvements', icon: CheckCircle2 },
    { id: 'marketing', label: 'Marketing', icon: Rocket },
    { id: 'roast', label: 'Roast Me', icon: Flame },
  ] as const;

  const content = {
    critique,
    marketing,
    improvements,
    roast,
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(content[activeTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    const shareData = {
      title: 'Portfolio Booster Analysis',
      text: `Check out my portfolio analysis for ${analyzedUrl}!`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-500 border-emerald-500';
    if (score >= 70) return 'text-indigo-500 border-indigo-500';
    if (score >= 50) return 'text-yellow-500 border-yellow-500';
    return 'text-red-500 border-red-500';
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-12">
      
      <div className="flex items-center justify-center mb-12">
        <Logo className="scale-75" />
      </div>

      {/* Social Links and Share Section */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex gap-4">
          {socialLinks.linkedin && <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800"><Linkedin className="w-6 h-6" /></a>}
          {socialLinks.github && <a href={socialLinks.github} target="_blank" rel="noopener noreferrer" className="text-zinc-900 dark:text-white hover:text-zinc-600"><Github className="w-6 h-6" /></a>}
          {socialLinks.twitter && <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-sky-500 hover:text-sky-700"><Twitter className="w-6 h-6" /></a>}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-sm font-medium hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
          >
            <Share2 className="w-4 h-4" />
            Share Results
          </button>
          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <Linkedin className="w-4 h-4" />
            LinkedIn
          </a>
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(score?.summary || 'Check out my portfolio analysis!')}&url=${encodeURIComponent(window.location.href)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-sky-500 text-white rounded-lg text-sm font-medium hover:bg-sky-600 transition-colors"
          >
            <Twitter className="w-4 h-4" />
            Twitter
          </a>
          <a
            href={`https://github.com/issues/new?title=Portfolio%20Analysis%20Summary&body=${encodeURIComponent(`## Portfolio Analysis Summary\n\n${score?.summary || 'Check out my portfolio analysis!'}\n\nView full analysis: ${window.location.href}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white rounded-lg text-sm font-medium hover:bg-zinc-800 transition-colors"
          >
            <Github className="w-4 h-4" />
            GitHub
          </a>
        </div>
      </div>

      {/* Projects Section */}
      {projects.length > 0 && (
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-6">Projects Showcase</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project, index) => (
              <div key={index} className="bg-white dark:bg-zinc-900 rounded-xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <h4 className="text-lg font-semibold mb-2">{project.title}</h4>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-4">{project.description}</p>
                {project.suggestion && (
                  <p className="text-xs text-indigo-600 dark:text-indigo-400 mb-4 bg-indigo-50 dark:bg-indigo-900/20 p-2 rounded">
                    <strong>Suggestion:</strong> {project.suggestion}
                  </p>
                )}
                <div className="flex gap-4">
                  {project.liveDemoUrl && <a href={project.liveDemoUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-indigo-600 hover:underline">Live Demo</a>}
                  {project.githubUrl && <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-zinc-900 dark:text-white hover:underline">GitHub</a>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {score && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-12 bg-white dark:bg-zinc-900 rounded-2xl p-8 shadow-xl border border-zinc-200 dark:border-zinc-800"
        >
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative w-32 h-32 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="58"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-zinc-100 dark:text-zinc-800"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="58"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={364}
                  strokeDashoffset={364 - (364 * score.overall) / 100}
                  className={`${getScoreColor(score.overall)} transition-all duration-1000 ease-out`}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-4xl font-bold ${getScoreColor(score.overall).split(' ')[0]}`}>
                  {score.overall}
                </span>
                <span className="text-xs text-zinc-400 uppercase font-medium mt-1">Score</span>
              </div>
            </div>
            
            <div className="flex-1 w-full">
              <div className="flex items-center gap-2 mb-4">
                <Trophy className="w-5 h-5 text-yellow-500" />
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Portfolio Grade</h3>
              </div>
              <p className="text-zinc-600 dark:text-zinc-400 mb-6 text-sm">
                {score.summary}
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {Object.entries(score.breakdown).map(([key, value]) => (
                  <div key={key} className="bg-zinc-50 dark:bg-zinc-800/50 rounded-lg p-3">
                    <div className="text-xs text-zinc-500 uppercase font-medium mb-1">{key}</div>
                    <div className="text-lg font-bold text-zinc-900 dark:text-white">{value}/100</div>
                    <div className="w-full bg-zinc-200 dark:bg-zinc-700 h-1.5 rounded-full mt-2 overflow-hidden">
                      <div 
                        className="bg-indigo-500 h-full rounded-full" 
                        style={{ width: `${value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-lg scale-105'
                : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden"
        >
          <div className="p-6 md:p-8">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-white capitalize flex items-center gap-2">
                {activeTab === 'roast' && <Flame className="w-6 h-6 text-orange-500" />}
                {tabs.find(t => t.id === activeTab)?.label}
              </h3>
              <button
                onClick={handleCopy}
                className="p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
                title="Copy to clipboard"
              >
                {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>
            
            <div className="prose prose-zinc dark:prose-invert max-w-none">
              <ReactMarkdown>{content[activeTab]}</ReactMarkdown>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
