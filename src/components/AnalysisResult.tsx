import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { CheckCircle2, MessageSquare, Rocket, Copy, Check, Trophy, Linkedin, Github, Twitter, Share2, AlertCircle, ArrowUpRight } from 'lucide-react';
import { Logo } from './Logo';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip } from 'recharts';

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
  score: ScoreData | null;
  socialLinks: { linkedin: string, github: string, twitter: string };
  analyzedUrl: string;
  projects: Project[];
}

export function AnalysisResult({ critique, marketing, improvements, score, socialLinks, analyzedUrl, projects }: AnalysisResultProps) {
  const [activeTab, setActiveTab] = useState<'critique' | 'marketing' | 'improvements'>('critique');
  const [copied, setCopied] = useState(false);

  const tabs = [
    { id: 'critique', label: 'Critique', icon: MessageSquare },
    { id: 'improvements', label: 'Improvements', icon: CheckCircle2 },
    { id: 'marketing', label: 'Marketing', icon: Rocket },
  ] as const;

  const content = {
    critique,
    marketing,
    improvements,
  };

  const radarData = score ? [
    { subject: 'UX', A: score.breakdown.ux },
    { subject: 'Content', A: score.breakdown.content },
    { subject: 'Technical', A: score.breakdown.technical },
    { subject: 'SEO', A: score.breakdown.seo },
    { subject: 'Social', A: score.breakdown.social },
  ] : [];

  const lowMetrics = score 
    ? Object.entries(score.breakdown).filter(([_, val]) => val < 75).sort((a, b) => a[1] - b[1])
    : [];

  const getMetricAdvice = (key: string) => {
    switch (key) {
      case 'ux':
        return 'Enhance visual hierarchy, ensure sufficient color contrast, and simplify navigation to reduce cognitive load.';
      case 'content':
        return 'Refine copywriting with compelling case studies, quantifiable achievements, and clear value propositions.';
      case 'technical':
        return 'Highlight robust tech stacks, clean code practices, performance optimizations, and live deployment links.';
      case 'seo':
        return 'Optimize meta tags, use semantic HTML headings, add descriptive alt text, and incorporate relevant industry keywords.';
      case 'social':
        return 'Prominently display active professional social profiles, GitHub contributions, and tech community links.';
      default:
        return 'Review and polish this section to align with industry best practices.';
    }
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
                  {project.liveDemoUrl && <a href={project.liveDemoUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-indigo-600 hover:underline flex items-center gap-1">Live Demo <ArrowUpRight className="w-3 h-3" /></a>}
                  {project.githubUrl && <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-zinc-900 dark:text-white hover:underline flex items-center gap-1">GitHub <ArrowUpRight className="w-3 h-3" /></a>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {score && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 bg-white dark:bg-zinc-900 rounded-2xl p-8 shadow-xl border border-zinc-200 dark:border-zinc-800"
        >
          <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
            <div className="flex-1 w-full h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#6b7280', fontSize: 12 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar
                    name="Score"
                    dataKey="A"
                    stroke="#4f46e5"
                    fill="#4f46e5"
                    fillOpacity={0.6}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                    itemStyle={{ color: '#1f2937' }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="md:w-1/3 w-full text-center md:text-left flex flex-col justify-center">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Portfolio Grade</h3>
              </div>
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, type: 'spring', stiffness: 200 }}
                className="text-5xl font-extrabold text-indigo-600 dark:text-indigo-400 mb-4"
              >
                {score.overall}<span className="text-lg font-medium text-zinc-400">/100</span>
              </motion.div>
              <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                {score.summary}
              </p>
            </div>
          </div>

          {/* Animated Breakdown Bars */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8 pt-6 border-t border-zinc-100 dark:border-zinc-800">
            {Object.entries(score.breakdown).map(([key, value], idx) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-4 border border-zinc-200 dark:border-zinc-700 text-center"
              >
                <div className="text-xs text-zinc-500 uppercase font-semibold mb-1">{key}</div>
                <div className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">{value}</div>
                <div className="w-full bg-zinc-200 dark:bg-zinc-700 h-2 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${value}%` }}
                    transition={{ duration: 0.8, delay: 0.2 + idx * 0.1, ease: 'easeOut' }}
                    className="bg-indigo-600 h-full rounded-full"
                  />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Actionable Improvements for Low Metrics */}
          <div className="mt-8 pt-8 border-t border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="w-5 h-5 text-indigo-500" />
              <h4 className="text-lg font-bold text-zinc-900 dark:text-white">Targeted Action Plan for Low Metrics</h4>
            </div>
            {lowMetrics.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {lowMetrics.map(([key, val]) => (
                  <div key={key} className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold uppercase text-xs tracking-wider text-indigo-600 dark:text-indigo-400">{key}</span>
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400">{val}/100</span>
                    </div>
                    <p className="text-sm text-zinc-600 dark:text-zinc-300">{getMetricAdvice(key)}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 text-sm flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-500" />
                <span>Fantastic job! All metric scores are strong (75+), indicating a well-rounded portfolio.</span>
              </div>
            )}
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
                {tabs.find(t => t.id === activeTab)?.label}
              </h3>
              <button
                onClick={handleCopy}
                className="p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
                title="Copy to clipboard"
                aria-label="Copy to clipboard"
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

