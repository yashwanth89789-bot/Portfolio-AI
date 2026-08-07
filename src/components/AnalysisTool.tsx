import { useState } from 'react';
import { motion } from 'motion/react';
import { UrlInput } from './UrlInput';
import { AnalysisResult } from './AnalysisResult';
import { AnalysisSkeleton } from './AnalysisSkeleton';
import { performFullAnalysis } from '../services/gemini';
import { Sparkles, Zap, Target, TrendingUp, Briefcase, CheckCircle, BookOpen } from 'lucide-react';
import { Logo } from './Logo';

export const ROLE_TIPS: Record<string, { resumeTips: string[], portfolioTips: string[] }> = {
  'Frontend Engineer': {
    resumeTips: [
      'Highlight responsive design, performance metrics (Lighthouse scores), and modern frameworks (React, Next.js, Vue).',
      'Showcase component library experience and design system contribution.',
      'Quantify impact (e.g., "Reduced bundle size by 35%", "Improved page load by 1.2s").'
    ],
    portfolioTips: [
      'Include live interactive links and clean, well-documented GitHub repositories.',
      'Ensure impeccable accessibility (WCAG) and smooth, performant animations.',
      'Showcase code snippets or architecture diagrams for complex UI state management.'
    ]
  },
  'Full Stack / Backend Engineer': {
    resumeTips: [
      'Emphasize database scaling, API design (REST/GraphQL), cloud architecture (AWS/GCP), and security best practices.',
      'Highlight system uptime, latency reduction, and high-throughput data processing.',
      'Specify CI/CD pipelines, containerization (Docker/Kubernetes), and testing coverage.'
    ],
    portfolioTips: [
      'Provide architecture overviews, sequence diagrams, and API documentation (Swagger/Postman).',
      'Showcase backend benchmarks, load testing results, and fault-tolerance strategies.',
      'Include clear deployment instructions and Docker Compose setups for quick evaluation.'
    ]
  },
  'UI/UX Designer': {
    resumeTips: [
      'Focus on user research methodologies, wireframing, prototyping, and design systems.',
      'Highlight collaboration with cross-functional teams and product managers.',
      'Demonstrate business impact (e.g., "Increased conversion rate by 18% through redesigned checkout flow").'
    ],
    portfolioTips: [
      'Present case studies detailing the problem, user research, iteration cycles, and final outcomes.',
      'Show high-fidelity prototypes, user journey maps, and interaction design details.',
      'Keep the portfolio visual, clean, and intuitive with pristine typography and spacing.'
    ]
  },
  'Data Scientist / AI Engineer': {
    resumeTips: [
      'Highlight machine learning models, statistical analysis, data pipelines, and MLOps experience.',
      'Mention specific libraries and frameworks (PyTorch, TensorFlow, Scikit-learn, LangChain).',
      'Quantify model performance and business value (e.g., "Improved recommendation accuracy by 14%").'
    ],
    portfolioTips: [
      'Include clean Jupyter notebooks with clear markdown explanations and visualizations.',
      'Showcase end-to-end ML pipelines from data ingestion to model deployment.',
      'Provide clear READMEs explaining dataset sources, evaluation metrics, and limitations.'
    ]
  },
  'Mobile Developer': {
    resumeTips: [
      'Highlight native (Swift/Kotlin) or cross-platform (Flutter/React Native) expertise.',
      'Mention app store deployments, ratings, and download milestones.',
      'Emphasize offline storage, state management, and memory optimization.'
    ],
    portfolioTips: [
      'Include direct links to App Store and Google Play, or smooth demo GIFs of app flows.',
      'Showcase responsive layouts across various screen sizes and device orientations.',
      'Highlight custom animations and native module integrations.'
    ]
  }
};

export function AnalysisTool() {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<{
    critique: string;
    marketing: string;
    improvements: string;
    score: any;
    socialLinks: { linkedin: string, github: string, twitter: string };
    analyzedUrl: string;
    projects: any[];
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [rawContent, setRawContent] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('Frontend Engineer');

  const handleAnalyze = async (url: string | null, content: string | null, socialLinks: { linkedin: string, github: string, twitter: string }) => {
    setIsLoading(true);
    setError(null);
    setResults(null);
    console.log("Analyzing:", { url, content, socialLinks, selectedRole });

    try {
      let finalContent = content;

      if (url && !finalContent) {
        // 1. Fetch content from our server proxy
        const fetchUrl = `/api/fetch-url?url=${encodeURIComponent(url)}`;
        console.log("Fetching from:", fetchUrl);
        const response = await fetch(fetchUrl);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch URL content (Status: ${response.status}). Please check the URL and try again.`);
        }
        
        const data = await response.json();
        
        if (!data.content) {
          throw new Error('Could not extract content from the URL.');
        }
        finalContent = data.content;
      }
      
      if (!finalContent) {
        throw new Error('Please provide either a portfolio URL or content to analyze.');
      }

      // 2. Analyze with Gemini (Combined call to save quota)
      const analysis = await performFullAnalysis(finalContent, socialLinks);

      if (!analysis) {
        throw new Error('Failed to analyze portfolio. Please try again later.');
      }

      setResults({
        critique: analysis.critique || "Failed to generate critique.",
        marketing: analysis.marketing || "Failed to generate marketing copy.",
        improvements: analysis.improvements || "Failed to generate improvements.",
        score: analysis.score || null,
        socialLinks,
        analyzedUrl: url || 'Manual Input',
        projects: analysis.projects || [],
      });

    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans selection:bg-indigo-500 selection:text-white">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay"></div>
      
      <main className="relative container mx-auto px-4 py-16 lg:py-24 flex flex-col items-center max-w-5xl">
        
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-12 flex flex-col items-center"
        >
          <Logo className="mb-6" />
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-sm font-medium mb-4 border border-indigo-100 dark:border-indigo-800">
            <Sparkles className="w-4 h-4" />
            <span>AI-Powered Portfolio Analysis</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-b from-zinc-900 to-zinc-500 dark:from-white dark:to-zinc-500">
            Portfolio Booster
          </h1>
          
          <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Turn your portfolio into a hiring magnet. Get instant feedback, 
            industry benchmarks, and viral launch assets in seconds.
          </p>
        </motion.div>

        {/* Top Control Grid: Role Selector & Inputs */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          
          {/* Left Column: Role Selector & Industry Tips */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-xl border border-zinc-200 dark:border-zinc-800">
              <label className="block text-sm font-semibold text-zinc-800 dark:text-zinc-200 mb-3 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-indigo-500" />
                Target Role
              </label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium"
              >
                {Object.keys(ROLE_TIPS).map((role) => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-xl border border-zinc-200 dark:border-zinc-800 flex-1">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="w-4 h-4 text-indigo-500" />
                <h3 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider">Role Benchmarks</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase mb-2">Resume Essentials</h4>
                  <ul className="space-y-1.5">
                    {ROLE_TIPS[selectedRole].resumeTips.slice(0, 2).map((tip, idx) => (
                      <li key={idx} className="text-xs text-zinc-600 dark:text-zinc-400 flex items-start gap-1.5">
                        <span className="text-indigo-500 font-bold">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase mb-2">Portfolio Must-Haves</h4>
                  <ul className="space-y-1.5">
                    {ROLE_TIPS[selectedRole].portfolioTips.slice(0, 2).map((tip, idx) => (
                      <li key={idx} className="text-xs text-zinc-600 dark:text-zinc-400 flex items-start gap-1.5">
                        <span className="text-indigo-500 font-bold">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: URL Input & Direct Paste */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-xl border border-zinc-200 dark:border-zinc-800">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                <Target className="w-4 h-4 text-indigo-500" />
                Scan via Portfolio URL
              </h3>
              <UrlInput onAnalyze={(url, social) => handleAnalyze(url, null, social)} isLoading={isLoading} />
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-xl border border-zinc-200 dark:border-zinc-800">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                <Zap className="w-4 h-4 text-indigo-500" />
                Or Paste Portfolio Content Directly
              </h3>
              <textarea
                value={rawContent}
                onChange={(e) => setRawContent(e.target.value)}
                placeholder="Paste your project descriptions, bio, skills, and experience here..."
                className="w-full h-32 p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 text-sm resize-none mb-4"
              />
              <button
                onClick={() => handleAnalyze(null, rawContent, { linkedin: '', github: '', twitter: '' })}
                disabled={isLoading || !rawContent.trim()}
                className="w-full bg-indigo-600 text-white py-3 rounded-xl font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/20 text-sm"
              >
                {isLoading ? 'Analyzing Portfolio...' : 'Analyze Pasted Content'}
              </button>
            </div>
          </div>

        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full max-w-3xl mb-8 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl border border-red-100 dark:border-red-800 text-center text-sm"
          >
            {error}
          </motion.div>
        )}

        {isLoading && <AnalysisSkeleton />}

        {results && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full"
          >
            <AnalysisResult 
              critique={results.critique}
              marketing={results.marketing}
              improvements={results.improvements}
              score={results.score}
              socialLinks={results.socialLinks}
              analyzedUrl={results.analyzedUrl}
              projects={results.projects}
            />
          </motion.div>
        )}

        {!results && !isLoading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 w-full text-center"
          >
            <Feature 
              icon={<Target className="w-5 h-5" />}
              title="Brutal Critique"
              desc="Honest feedback on UX, copy, and visual hierarchy."
            />
            <Feature 
              icon={<TrendingUp className="w-5 h-5" />}
              title="Radar Scoring"
              desc="Comprehensive 5-axis portfolio evaluation."
            />
            <Feature 
              icon={<Zap className="w-5 h-5" />}
              title="Viral Marketing"
              desc="Ready-to-post tweets and LinkedIn updates."
            />
          </motion.div>
        )}
      </main>
    </div>
  );
}


function Feature({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow">
      <div className="w-12 h-12 mx-auto bg-zinc-100 dark:bg-zinc-800 rounded-xl flex items-center justify-center text-zinc-900 dark:text-white mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-2 text-zinc-900 dark:text-white">{title}</h3>
      <p className="text-zinc-500 dark:text-zinc-400 text-sm">{desc}</p>
    </div>
  );
}
