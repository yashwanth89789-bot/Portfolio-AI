import { motion } from 'motion/react';
import { Rocket, Zap } from 'lucide-react';

export function Logo({ className = "" }: { className?: string }) {
  return (
    <motion.div 
      className={`relative flex items-center justify-center ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="relative">
        {/* Outer Glow */}
        <motion.div 
          className="absolute inset-0 bg-indigo-500/30 blur-2xl rounded-full"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ 
            duration: 4, 
            repeat: Infinity,
            ease: "easeInOut" 
          }}
        />
        
        {/* Main Icon Container */}
        <div className="relative bg-gradient-to-br from-indigo-600 to-violet-700 p-4 rounded-2xl shadow-xl shadow-indigo-500/20 border border-white/10 overflow-hidden">
          <Rocket className="w-10 h-10 text-white relative z-10" />
          
          {/* Animated Sparkle/Zap */}
          <motion.div
            className="absolute top-0 right-0 p-1"
            animate={{ 
              y: [0, -2, 0],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              ease: "easeInOut" 
            }}
          >
            <Zap className="w-4 h-4 text-yellow-300 fill-yellow-300" />
          </motion.div>

          {/* Background Shine */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent"
            animate={{ 
              x: ['-100%', '100%']
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity,
              ease: "linear" 
            }}
          />
        </div>
      </div>
    </motion.div>
  );
}
