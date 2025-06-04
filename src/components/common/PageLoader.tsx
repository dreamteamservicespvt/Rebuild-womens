import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface PageLoaderProps {
  duration?: number;
}

const PageLoader = ({ duration = 2000 }: PageLoaderProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [pulseText, setPulseText] = useState('LOADING');
  
  useEffect(() => {
    // Progress update logic
    const intervalId = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + (100 - prev) / 15;
        return Math.min(newProgress, 99.5);
      });
    }, 20);

    // Text pulse animation
    const textInterval = setInterval(() => {
      setPulseText(current => {
        if (current === 'LOADING') return 'LOADING.';
        if (current === 'LOADING.') return 'LOADING..';
        if (current === 'LOADING..') return 'LOADING...';
        return 'LOADING';
      });
    }, 400);

    const timeout1 = setTimeout(() => {
      setProgress(100);
    }, duration - 400);

    const timeout2 = setTimeout(() => {
      setIsLoading(false);
    }, duration);

    return () => {
      clearInterval(intervalId);
      clearInterval(textInterval);
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
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gym-black"
        >
          {/* Background elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=1975&auto=format&fit=crop')] bg-cover bg-center opacity-5"></div>
            
            {/* Grid overlay */}
            <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-10"></div>
            
            {/* Animated lines - fixed to avoid RGB issues */}
            <motion.div 
              className="absolute top-0 left-0 right-0 h-px bg-gym-yellow opacity-40"
              animate={{ 
                y: ["0%", "100%"] 
              }}
              transition={{ 
                duration: 15, 
                ease: "linear", 
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
            <motion.div 
              className="absolute bottom-0 left-0 right-0 h-px bg-gym-yellow opacity-40"
              animate={{ 
                y: ["0%", "-100%"] 
              }}
              transition={{ 
                duration: 12, 
                ease: "linear", 
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
          </div>

          <div className="flex flex-col items-center space-y-5 z-10">
            {/* Logo with enhanced neon glow */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-80 h-72 flex items-center justify-center"
            >
              <motion.img 
                src="https://res.cloudinary.com/dvmrhs2ek/image/upload/v1747563756/wa32r5fvog2a86kbxvf5.png"
                alt="Rebuild Fitness"
                width="192"
                height="192"
                className="h-48 w-auto filter brightness-110 z-10"
                style={{
                  filter: 'brightness(1.2) drop-shadow(0 0 15px rgba(255, 243, 24, 0.8)) drop-shadow(0 0 30px rgba(255, 243, 24, 0.6))'
                }}
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: 1,
                  filter: [
                    'brightness(1.2) drop-shadow(0 0 15px rgba(255, 243, 24, 0.8)) drop-shadow(0 0 30px rgba(255, 243, 24, 0.6))',
                    'brightness(1.3) drop-shadow(0 0 25px rgba(255, 243, 24, 0.9)) drop-shadow(0 0 40px rgba(255, 243, 24, 0.7))',
                    'brightness(1.2) drop-shadow(0 0 15px rgba(255, 243, 24, 0.8)) drop-shadow(0 0 30px rgba(255, 243, 24, 0.6))'
                  ]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut"
                }}
              />
            </motion.div>
            
            {/* New quote animation replacing the REBUILD FITNESS text */}
            <div className="flex flex-col items-center space-y-3 text-center px-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="overflow-hidden"
              >
                <motion.p 
                  className="text-white font-heading tracking-wide text-lg sm:text-xl"
                  initial={{ y: 30 }}
                  animate={{ y: 0 }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                >
                  <motion.span 
                    className="text-gym-yellow mr-1"
                    animate={{ 
                      textShadow: [
                        "0 0 5px rgba(255, 243, 24, 0.5)",
                        "0 0 10px rgba(255, 243, 24, 0.8)",
                        "0 0 5px rgba(255, 243, 24, 0.5)"
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    Rebuild
                  </motion.span>
                  your body,
                </motion.p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.8 }}
                className="overflow-hidden"
              >
                <motion.p 
                  className="text-white font-heading tracking-wide text-lg sm:text-xl"
                  initial={{ y: 30 }}
                  animate={{ y: 0 }}
                  transition={{ delay: 1.0, duration: 0.8 }}
                >
                  <motion.span 
                    className="text-gym-yellow mr-1"
                    animate={{ 
                      textShadow: [
                        "0 0 5px rgba(255, 243, 24, 0.5)",
                        "0 0 10px rgba(255, 243, 24, 0.8)",
                        "0 0 5px rgba(255, 243, 24, 0.5)"
                      ]
                    }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity,
                      repeatType: "reverse",
                      delay: 0.5
                    }}
                  >
                    Redefine
                  </motion.span>
                  Your Confidence.
                </motion.p>
              </motion.div>
              
              {/* Progress bar */}
              <div className="w-64 h-1 bg-gym-gray rounded-full overflow-hidden mt-6 relative">
                <motion.div 
                  className="h-full bg-gym-yellow"
                  style={{ width: `${progress}%` }}
                />
                
                {/* Glow effect on progress bar */}
                <motion.div 
                  className="absolute top-0 left-0 h-full bg-white w-10 opacity-30 blur-sm"
                  animate={{ 
                    x: [`-100%`, `${progress}%`]
                  }}
                  transition={{ 
                    duration: 1, 
                    ease: "easeInOut"
                  }}
                />
              </div>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-sm text-gym-yellow font-heading tracking-widest h-5"
              >
                {progress >= 100 ? (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="inline-block"
                  >
                    READY
                  </motion.span>
                ) : null}
              </motion.div>
            </div>
          </div>
          
          {/* Yellow flashing elements */}
          <motion.div
            className="absolute top-10 left-10 w-2 h-2 rounded-full bg-gym-yellow"
            animate={{ 
              opacity: [0.2, 1, 0.2],
              scale: [1, 1.2, 1],
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse" 
            }}
          />
          <motion.div
            className="absolute bottom-20 right-20 w-2 h-2 rounded-full bg-gym-yellow"
            animate={{ 
              opacity: [0.2, 1, 0.2],
              scale: [1, 1.2, 1],
            }}
            transition={{ 
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
