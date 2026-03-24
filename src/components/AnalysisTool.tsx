import { useState } from 'react';
import { motion } from 'motion/react';
import { UrlInput } from './UrlInput';
import { AnalysisResult } from './AnalysisResult';
import { analyzePortfolio, generateScore, extractProjects } from '../services/gemini';
import { Sparkles, Zap, Target, TrendingUp, Flame } from 'lucide-react';

export function AnalysisTool() {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<{
    critique: string;
    marketing: string;
    improvements: string;
    roast: string;
    score: any;
    socialLinks: { linkedin: string, github: string, twitter: string };
    analyzedUrl: string;
    projects: any[];
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (url: string, socialLinks: { linkedin: string, github: string, twitter: string }) => {
    setIsLoading(true);
    setError(null);
    setResults(null);
    console.log("Analyzing URL:", url, "Social Links:", socialLinks);

    try {
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

      // 2. Analyze with Gemini
      const [critique, marketing, improvements, roast, score, projects] = await Promise.all([
        analyzePortfolio(data.content, 'critique', socialLinks),
        analyzePortfolio(data.content, 'marketing', socialLinks),
        analyzePortfolio(data.content, 'improvements', socialLinks),
        analyzePortfolio(data.content, 'roast', socialLinks),
        generateScore(data.content, socialLinks),
        extractProjects(data.content),
      ]);

      setResults({
        critique: critique || "Failed to generate critique.",
        marketing: marketing || "Failed to generate marketing copy.",
        improvements: improvements || "Failed to generate improvements.",
        roast: roast || "Failed to generate roast.",
        score: score || null,
        socialLinks,
        analyzedUrl: url,
        projects: projects || [],
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
      
      <main className="relative container mx-auto px-4 py-20 lg:py-32 flex flex-col items-center">
        
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-sm font-medium mb-6 border border-indigo-100 dark:border-indigo-800">
            <Sparkles className="w-4 h-4" />
            <span>AI-Powered Portfolio Analysis</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-zinc-900 to-zinc-500 dark:from-white dark:to-zinc-500">
            Portfolio Booster
          </h1>
          
          <p className="text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Turn your portfolio into a hiring magnet. Get instant, brutal feedback, 
            SEO improvements, and viral launch tweets in seconds.
          </p>
        </motion.div>

        <UrlInput onAnalyze={handleAnalyze} isLoading={isLoading} />

        {error && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-8 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg border border-red-100 dark:border-red-800"
          >
            {error}
          </motion.div>
        )}

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
              roast={results.roast}
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
            className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-24 max-w-6xl mx-auto text-center"
          >
            <Feature 
              icon={<Target className="w-6 h-6" />}
              title="Brutal Critique"
              desc="Honest feedback on UX, copy, and visual hierarchy."
            />
            <Feature 
              icon={<TrendingUp className="w-6 h-6" />}
              title="Portfolio Score"
              desc="Get a 0-100 score based on UX, SEO, and content."
            />
            <Feature 
              icon={<Zap className="w-6 h-6" />}
              title="Viral Marketing"
              desc="Ready-to-post tweets and LinkedIn updates."
            />
            <Feature 
              icon={<Flame className="w-6 h-6" />}
              title="Roast Mode"
              desc="Get a hilarious, ruthless roast of your site."
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
