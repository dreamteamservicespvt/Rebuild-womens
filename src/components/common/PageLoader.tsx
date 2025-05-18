import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface PageLoaderProps {
  duration?: number;
}

const PageLoader = ({ duration = 2000 }: PageLoaderProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    const intervalId = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + (100 - prev) / 15;
        return Math.min(newProgress, 99.5);
      });
    }, 20);

    const timeout1 = setTimeout(() => {
      setProgress(100);
    }, duration - 400);

    const timeout2 = setTimeout(() => {
      setIsLoading(false);
    }, duration);

    return () => {
      clearInterval(intervalId);
      clearTimeout(timeout1);
      clearTimeout(timeout2);
    };
  }, [duration]);

  return (
    <AnimatePresence mode="wait">
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black"
        >
          <div className="flex flex-col items-center space-y-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-40 h-40 flex items-center justify-center"
            >
              <motion.div 
                className="absolute inset-0"
                animate={{ 
                  rotate: 360,
                  borderColor: [
                    "rgba(186,104,200,0.3)",
                    "rgba(236,72,153,0.3)",
                    "rgba(168,85,247,0.3)",
                    "rgba(186,104,200,0.3)"
                  ]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear" 
                }}
                style={{
                  borderRadius: "50%",
                  borderWidth: "3px",
                  borderStyle: "solid",
                }}
              />
              
              <motion.img 
                src="https://res.cloudinary.com/dvmrhs2ek/image/upload/v1747488784/ukxacg9kkjcewvwgml2u.png"
                alt="Rebuild Fitness"
                className="h-28 w-auto filter drop-shadow-glow z-10"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ 
                  opacity: 1, 
                  scale: [0.8, 1.05, 1],
                }}
                transition={{ 
                  duration: 1.2,
                  times: [0, 0.8, 1],
                  ease: [0.22, 1, 0.36, 1],
                }}
              />
            </motion.div>
            
            <div className="flex flex-col items-center space-y-4 max-w-xs text-center">
              <motion.h2 
                className="text-white font-medium tracking-wider"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                <span className="text-rebuild-pink">Rebuild</span> Your Body, <br/>
                <span className="text-rebuild-pink">Redefine</span> Your Confidence.
              </motion.h2>
              
              <div className="w-64 h-[2px] bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-rebuild-purple to-rebuild-pink"
                  style={{ width: `${progress}%` }}
                />
              </div>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: progress > 80 ? 1 : 0 }}
                transition={{ duration: 0.5 }}
                className="text-xs text-white/60"
              >
                {progress >= 100 ? 'Ready!' : 'Loading...'}
              </motion.div>
            </div>
          </div>
          
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-rebuild-purple/5 to-rebuild-pink/5"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: [0, 0.1, 0.05, 0.1], 
            }}
            transition={{ 
              times: [0, 0.33, 0.66, 1],
              duration: 4, 
              repeat: Infinity,
              repeatType: "reverse" 
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PageLoader;
