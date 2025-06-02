import { Button } from "@/components/ui/button";
import ImageSlideshow from "@/components/ImageSlideshow";
import NavigationBar from "@/components/landing/NavigationBar";
import { motion, useAnimation } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import "@/styles/animations.css";

// Desktop/Large Screen images (≥768px)
const DESKTOP_IMAGES = [
  "https://eliteclubs.com/wp-content/uploads/2019/11/The-Pros-Cons-of-Exercising-with-a-Friend-e1571837163735.jpeg",
  "https://images.unsplash.com/photo-1534258936925-c58bed479fcb?q=80&w=1931&auto=format&fit=crop",
  "https://images.pexels.com/photos/17898139/pexels-photo-17898139/free-photo-of-back-view-of-a-muscular-woman-at-the-gym.jpeg",
  "https://i.pinimg.com/736x/2f/7e/18/2f7e1807fa627358b26952bcdcd66fce.jpg",
  "https://images.unsplash.com/photo-1534258936925-c58bed479fcb?q=80&w=1931&auto=format&fit=crop",
  "https://images.pexels.com/photos/2247179/pexels-photo-2247179.jpeg",
];

// Mobile Screen images (<768px)
const MOBILE_IMAGES = [
  "https://images.unsplash.com/photo-1550345332-09e3ac987658",
  "https://plus.unsplash.com/premium_photo-1674059549221-e2943b475f62",
  "https://images.unsplash.com/photo-1548690312-e3b507d8c110",
  "https://images.pexels.com/photos/4944104/pexels-photo-4944104.jpeg",
  "https://plus.unsplash.com/premium_photo-1661580189677-67d3d3fbf7cb",
  "https://images.unsplash.com/photo-1550259979-ed79b48d2a30",
  "https://images.unsplash.com/photo-1595078475328-1ab05d0a6a0e"
];

// Inspirational quotes for typewriter effect - Updated with more powerful messages
const QUOTES = [
  "Transform your body. Transform your life. This is your rebuild.",
  "Fitness isn't just about losing weight—it's about gaining strength.",
  "Every session brings you closer to the strongest version of yourself.",
  "Your body hears everything your mind says. Stay positive. Stay strong.",
  "The woman you're becoming will thank the woman who's working hard now.",
  "Your only competition is the woman you were yesterday.",
  "Sweat now, shine later. Your rebuild journey starts here.",
  "When you feel like quitting, remember why you started.",
  "Strong women lift each other up—mentally, emotionally, physically.",
  "This is your space to rebuild, redefine, and reclaim your power.",
  "Fitness is not about being better than someone else—it's about being better than you used to be."
];

// Typewriter Component
const TypewriterQuote = () => {
  const [currentQuote, setCurrentQuote] = useState(0);
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isBlinking, setIsBlinking] = useState(true);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const typeSpeed = 60; // milliseconds per character for typing
    const deleteSpeed = 30; // milliseconds per character for deleting
    const pauseTime = 1800; // milliseconds to pause after finishing typing

    if (isDeleting) {
      // Delete characters
      if (text.length > 0) {
        timeout = setTimeout(() => {
          setText(text.slice(0, -1));
        }, deleteSpeed);
      } else {
        // Move to next quote when deletion is complete
        setIsDeleting(false);
        setCurrentQuote((currentQuote + 1) % QUOTES.length);
      }
    } else {
      // Check if current quote is fully typed
      if (text.length < QUOTES[currentQuote].length) {
        // Type next character
        timeout = setTimeout(() => {
          setText(QUOTES[currentQuote].slice(0, text.length + 1));
          setIsBlinking(false);
        }, typeSpeed);
      } else {
        // Pause before starting to delete
        setIsBlinking(true);
        timeout = setTimeout(() => {
          setIsDeleting(true);
        }, pauseTime);
      }
    }

    return () => clearTimeout(timeout);
  }, [text, currentQuote, isDeleting]);

  // Format text with highlighted keywords
  const formattedText = () => {
    const keywords = ["rebuild", "Rebuild", "strong", "stronger", "confidence", "transformation"];
    let result = text;

    keywords.forEach(keyword => {
      // Case insensitive replace with span, escape special regex characters
      const safeKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(${safeKeyword})`, 'gi');
      result = result.replace(regex, '<span class="text-gym-yellow">$1</span>');
    });

    return result;
  };

  return (
    <div className="font-mono text-xs sm:text-sm text-white/80 min-h-[40px] relative flex items-center justify-center">
      <span
        className="inline-block"
        dangerouslySetInnerHTML={{ __html: formattedText() }}
      />
      <span className={`h-4 w-0.5 bg-gym-yellow ml-1 inline-block ${isBlinking ? 'animate-blink' : ''}`}></span>
    </div>
  );
};

const HeroSection = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center text-white">
      <NavigationBar />

      <ImageSlideshow
        images={DESKTOP_IMAGES}
        mobileImages={MOBILE_IMAGES}
        interval={6000}
        pauseOnHover={true}
        enableKenBurns={true}
      />

      {/* Enhanced overlay with further reduced opacity */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/30 z-[1]"></div>

      <div className="container-custom relative z-10 flex justify-start items-center h-full">
        <div className="max-w-4xl mt-16 sm:mt-16 md:mt-12 px-4 sm:px-6 md:px-8 py-4 sm:py-10 md:py-12 relative text-left">
          {/* Main headline - Updated for more impact */}
          <motion.h1
            className="text-xl sm:text-4xl md:text-5xl lg:text-6xl font-black italic leading-tight sm:leading-tight tracking-wider"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Premium REBUILD text for mobile only */}
            <div className="sm:hidden mb-3 relative">
              <div className="relative inline-block">
                {/* Modified glow effect to only apply behind text */}
                <span className="absolute -inset-y-1 -inset-x-2 bg-gradient-to-r from-gym-yellow/30 via-gym-yellow/50 to-gym-yellow/30 blur-lg rounded-md"></span>
                <span className="relative block text-[28px] text-gym-yellow font-heading font-[900] italic tracking-[0.15em] 
                       [text-shadow:0_0_10px_rgba(255,243,24,0.5),3px_3px_0px_rgba(0,0,0,0.8)] py-1 px-1">
                  <span className="relative inline-block after:content-[''] after:absolute after:bottom-[-2px] after:left-0 after:w-full after:h-[2px] 
                         after:bg-gradient-to-r after:from-transparent after:via-gym-yellow after:to-transparent">
                    REBUILD WOMEN'S
                  </span>
                </span>
              </div>
              <div className="absolute -bottom-1 left-0 w-[160px] h-[3px] bg-gym-yellow/70 rounded-full"></div>
            </div>

            <span className="block text-[24px] sm:text-5xl leading-tight mb-2 tracking-wider font-[900] italic">
              <span className="text-gym-yellow [text-shadow:2px_2px_0px_rgba(0,0,0,1),0_0_20px_rgba(255,243,24,0.4)]">TRANSFORM</span>{' '}
              <span className="text-white [text-shadow:2px_2px_0px_rgba(0,0,0,1)]">YOUR</span>{' '}
              <span className="text-gym-yellow [text-shadow:2px_2px_0px_rgba(0,0,0,1),0_0_20px_rgba(255,243,24,0.4)]">BODY</span>
            </span>
            <span className="text-[20px] sm:text-4xl tracking-wider font-[900] italic">
              <span className="text-white [text-shadow:2px_2px_0px_rgba(0,0,0,1)]">IN A SPACE</span>{' '}
              <span className="text-gym-yellow [text-shadow:2px_2px_0px_rgba(0,0,0,1),0_0_20px_rgba(255,243,24,0.4)]">DESIGNED</span>{' '}
              <span className="text-white [text-shadow:2px_2px_0px_rgba(0,0,0,1)]">FOR</span>{' '}
              <span className="text-gym-yellow [text-shadow:2px_2px_0px_rgba(0,0,0,1),0_0_20px_rgba(255,243,24,0.4)]">WOMEN</span>
            </span>
          </motion.h1>

          {/* Subheadline - Updated with more benefits */}
          <motion.p
            className="font-heading text-sm sm:text-xl md:text-2xl mt-3 sm:mt-6 mb-2 sm:mb-3 tracking-wide text-white/90
                     font-medium [text-shadow:0_2px_10px_rgba(0,0,0,0.5)]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Expert Female Trainers • Personalized Programs • Women-Only Environment
          </motion.p>

          {/* Offer line - Updated with clearer pricing structure */}
          <motion.div
            className="inline-block bg-gym-yellow/20 backdrop-blur-sm border border-gym-yellow/50 rounded-lg py-2 px-3 sm:px-4 mt-2 sm:mt-4 mb-6 sm:mb-8"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <p className="text-xs leading-snug sm:text-sm font-medium whitespace-normal">
              <span className="text-white/90">Limited Time Offer:</span> <span className="text-gym-yellow font-semibold">25% OFF</span> on All Programs
              <br className="hidden sm:block" />
              <span className="text-white/80"> Morning (5:30AM-10:30AM) & Evening (4PM-8PM) Sessions</span>
            </p>
          </motion.div>

          {/* Button container - Adjusted for mobile row layout */}
          <div className="flex flex-row gap-2 sm:gap-5 justify-between w-full sm:max-w-md">
            <Button
              size="lg"
              className="flex-1 text-base sm:text-lg bg-gym-yellow hover:bg-gym-yellow/90 text-black relative overflow-hidden group shadow-lg transform transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(255,243,24,0.4)] animate-slide-up opacity-0 py-4 sm:py-6 font-bold tracking-wide"
              style={{ animationDelay: "0.8s", animationFillMode: "forwards" }}
              onClick={() => scrollToSection('join')}
            >
              <span className="relative z-10 text-sm sm:text-xl">START TODAY</span>
              <span className="absolute inset-0 bg-black/10 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="flex-1 text-base sm:text-lg border-2 border-white/80 text-white hover:text-white hover:border-gym-yellow bg-transparent hover:bg-gym-yellow/20 relative overflow-hidden group transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_15px_rgba(255,243,24,0.3)] animate-slide-up opacity-0 py-4 sm:py-6 font-bold tracking-wide"
              style={{ animationDelay: "1s", animationFillMode: "forwards" }}
              onClick={() => scrollToSection('sessions')}
            >
              <span className="relative z-10 text-sm sm:text-xl">VIEW PROGRAMS</span>
              <span className="absolute inset-0 transform scale-y-0 group-hover:scale-y-100 transition-transform origin-bottom duration-300"></span>
            </Button>
          </div>

          {/* Decorative divider between content and quotes */}
          <motion.div
            className="w-32 h-1 bg-gradient-to-r from-gym-yellow/30 via-gym-yellow to-gym-yellow/30 my-10 rounded-full shadow-[0_0_10px_rgba(255,243,24,0.4)]"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 128, opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.6 }}
          />

        </div>
      </div>

      {/* Bottom center quotes section with typewriter animation */}
      <div className="absolute bottom-20 sm:bottom-16 left-0 right-0 z-20">
        <motion.div
          className="max-w-lg mx-auto px-3 sm:px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.8 }}
        >
          <TypewriterQuote />
        </motion.div>
      </div>

      {/* Scroll indicator - Hidden on mobile */}
      <div className="hidden sm:flex absolute bottom-[4.5rem] sm:bottom-6 md:bottom-8 right-3 sm:right-6 md:right-8 flex-col items-center justify-center animate-pulse z-30">
        <span className="text-white/70 text-xs sm:text-sm mb-1 sm:mb-2 animate-fade-in opacity-0" style={{ animationDelay: "1.6s", animationFillMode: "forwards" }}>
          Scroll to explore
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="animate-fade-in opacity-0"
          style={{ animationDelay: "1.6s", animationFillMode: "forwards" }}
        >
          <path d="M12 5v14M5 12l7 7 7-7" />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
