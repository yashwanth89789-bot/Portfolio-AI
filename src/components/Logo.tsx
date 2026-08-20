import { motion } from 'motion/react';
import { Rocket, Zap } from 'lucide-react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function Logo({ className = "", size = "sm" }: LogoProps) {
  const sizeConfig = {
    sm: {
      container: "w-8 h-8 rounded-lg",
      icon: "w-4 h-4",
      zap: "w-2.5 h-2.5",
      glow: "blur-sm"
    },
    md: {
      container: "w-10 h-10 rounded-xl",
      icon: "w-5 h-5",
      zap: "w-3 h-3",
      glow: "blur-md"
    },
    lg: {
      container: "w-14 h-14 rounded-2xl",
      icon: "w-7 h-7",
      zap: "w-3.5 h-3.5",
      glow: "blur-xl"
    }
  };

  const config = sizeConfig[size] || sizeConfig.sm;

  return (
    <motion.div 
      className={`relative inline-flex items-center justify-center shrink-0 ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="relative flex items-center justify-center">
        {/* Outer Glow */}
        <motion.div 
          className={`absolute inset-0 bg-indigo-500/25 ${config.glow} rounded-full`}
          animate={{ 
            scale: [1, 1.15, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ 
            duration: 3.5, 
            repeat: Infinity,
            ease: "easeInOut" 
          }}
        />
        
        {/* Main Icon Container */}
        <div className={`relative ${config.container} bg-gradient-to-br from-indigo-600 to-violet-700 flex items-center justify-center shadow-md shadow-indigo-500/20 border border-white/20 overflow-hidden`}>
          <Rocket className={`${config.icon} text-white relative z-10`} />
          
          {/* Animated Sparkle/Zap */}
          <motion.div
            className="absolute top-0.5 right-0.5"
            animate={{ 
              y: [0, -1, 0],
              opacity: [0.6, 1, 0.6]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              ease: "easeInOut" 
            }}
          >
            <Zap className={`${config.zap} text-yellow-300 fill-yellow-300`} />
          </motion.div>

          {/* Background Shine */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/25 to-transparent"
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

