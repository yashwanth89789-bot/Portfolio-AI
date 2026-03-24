import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Loader2, Sparkles, Linkedin, Github, Twitter } from 'lucide-react';

interface UrlInputProps {
  onAnalyze: (url: string, socialLinks: { linkedin: string, github: string, twitter: string }) => void;
  isLoading: boolean;
}

export function UrlInput({ onAnalyze, isLoading }: UrlInputProps) {
  const [url, setUrl] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [github, setGithub] = useState('');
  const [twitter, setTwitter] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onAnalyze(url, { linkedin, github, twitter });
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl mx-auto"
    >
      <form onSubmit={handleSubmit} className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
        <div className="relative bg-white dark:bg-zinc-900 rounded-xl p-6 shadow-xl border border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-indigo-500" />
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste your portfolio URL (e.g., https://my-portfolio.com)"
              className="flex-1 bg-transparent border-none outline-none text-zinc-900 dark:text-white placeholder-zinc-400 h-10 text-lg"
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-800 p-2 rounded-lg">
              <Linkedin className="w-4 h-4 text-blue-600" />
              <input type="url" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} placeholder="LinkedIn URL" className="flex-1 bg-transparent border-none outline-none text-sm" />
            </div>
            <div className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-800 p-2 rounded-lg">
              <Github className="w-4 h-4 text-zinc-900 dark:text-white" />
              <input type="url" value={github} onChange={(e) => setGithub(e.target.value)} placeholder="GitHub URL" className="flex-1 bg-transparent border-none outline-none text-sm" />
            </div>
            <div className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-800 p-2 rounded-lg">
              <Twitter className="w-4 h-4 text-sky-500" />
              <input type="url" value={twitter} onChange={(e) => setTwitter(e.target.value)} placeholder="Twitter URL" className="flex-1 bg-transparent border-none outline-none text-sm" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Scanning...</span>
              </>
            ) : (
              <>
                <span>Boost Portfolio</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </form>
      <p className="text-center mt-4 text-zinc-500 text-sm">
        We'll analyze your structure, content, design, and social presence to give you actionable feedback.
      </p>
    </motion.div>
  );
}
