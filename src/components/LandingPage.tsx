import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-2xl"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-sm font-medium mb-6 border border-indigo-100 dark:border-indigo-800">
          <Sparkles className="w-4 h-4" />
          <span>AI-Powered Portfolio Analysis</span>
        </div>
        <h1 className="text-6xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-zinc-900 to-zinc-500 dark:from-white dark:to-zinc-500">
          Portfolio Booster
        </h1>
        <p className="text-xl text-zinc-600 dark:text-zinc-400 mb-10 leading-relaxed">
          Get instant, brutal feedback, SEO improvements, and viral launch tweets for your portfolio.
        </p>
        <button 
          onClick={() => navigate('/analyze')}
          className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-full font-semibold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/20"
        >
          Start Analysis <ArrowRight className="w-5 h-5" />
        </button>
      </motion.div>
    </div>
  );
}
