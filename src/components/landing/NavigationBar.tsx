import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence, useScroll, useTransform, useMotionValueEvent } from "framer-motion";

const ListItem = ({
  title,
  href,
  children,
  className,
  ...props
}: {
  title: string;
  href: string;
  children?: React.ReactNode;
  className?: string;
  [key: string]: any;
}) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          to={href}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          {children && <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>}
        </Link>
      </NavigationMenuLink>
    </li>
  );
};

const NavigationBar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const lastScrollY = useRef(0);
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const { scrollY } = useScroll();
  const navRef = useRef<HTMLElement>(null);
  const [touchStartY, setTouchStartY] = useState(0);
  const [menuAnimationComplete, setMenuAnimationComplete] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  
  // Dynamic opacity based on scroll position for extra premium feel
  const logoOpacity = useTransform(scrollY, [0, 100], [1, 0.95]);
  const navBgOpacity = useTransform(scrollY, [0, 100], [0, 0.85]);
  
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
      setActiveSection(id);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Set scrolled state for background change
      if (currentScrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
      
      // Hide/show navbar on scroll with improved sensitivity
      if (currentScrollY > 200) {
        setIsNavVisible(
          currentScrollY < lastScrollY.current || 
          currentScrollY < 100 || 
          currentScrollY + window.innerHeight >= document.body.scrollHeight - 50
        );
      } else {
        setIsNavVisible(true);
      }
      
      // Update active section based on scroll position
      const sections = ['hero', 'sessions', 'pricing', 'join', 'location'];
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section);
            break;
          }
        }
      }
      
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (navRef.current) {
      // Apply premium depth effect on scroll
      const scrollPercentage = Math.min(latest / 500, 1);
      navRef.current.style.setProperty('--depth-shadow', `0 10px ${30 + scrollPercentage * 20}px ${-10 + scrollPercentage * -10}px rgba(0, 0, 0, ${0.2 + scrollPercentage * 0.1})`);
    }
  });
  
  // Enhanced animations for premium feel
  const navVariants = {
    visible: { 
      y: 0, 
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 20, 
        mass: 0.8 
      }
    },
    hidden: { 
      y: -100, 
      opacity: 0,
      scale: 0.98,
      filter: "blur(4px)",
      transition: { 
        type: "spring", 
        stiffness: 200, 
        damping: 30, 
        mass: 1 
      }
    }
  };
  
  // Menu items with their section IDs
  const menuItems = [
    { id: 'hero', label: 'Home' },
    { id: 'sessions', label: 'Sessions' },
    { id: 'pricing', label: 'Pricing' },
    { id: 'join', label: 'Join' },
    { id: 'location', label: 'Location' }
  ];

  // Enhanced hover effect for menu items
  const itemHoverVariants = {
    initial: { y: 0, x: 0 },
    hover: { 
      y: -4, 
      x: 0,
      scale: 1.05, 
      transition: { type: "spring", stiffness: 400, damping: 10 }
    }
  };

  // Enable haptic feedback when available
  const triggerHapticFeedback = () => {
    if (window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(5); // Subtle vibration for 5ms
    }
  };
  
  // Handle touch gestures for the mobile menu
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartY(e.touches[0].clientY);
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isMobileMenuOpen) return;
    
    const touchY = e.touches[0].clientY;
    const deltaY = touchY - touchStartY;
    
    // If swiping down, allow menu to follow finger
    if (deltaY > 30 && mobileMenuRef.current) {
      mobileMenuRef.current.style.transform = `translateY(${deltaY * 0.3}px)`;
      mobileMenuRef.current.style.opacity = `${1 - (deltaY / 500)}`;
    }
  };
  
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isMobileMenuOpen || !mobileMenuRef.current) return;
    
    const touchY = e.changedTouches[0].clientY;
    const deltaY = touchY - touchStartY;
    
    // If swipe down is significant, close the menu
    if (deltaY > 100) {
      setIsMobileMenuOpen(false);
      triggerHapticFeedback();
    } else {
      // Reset position and opacity
      mobileMenuRef.current.style.transform = '';
      mobileMenuRef.current.style.opacity = '';
    }
  };

  // Enhanced hover effect for menu items with 3D perspective
  const mobileItemVariants = {
    hidden: { opacity: 0, y: 40, rotateX: 10 },
    visible: (i: number) => ({ 
      opacity: 1, 
      y: 0,
      rotateX: 0,
      transition: { 
        duration: 0.5, 
        ease: [0.22, 1, 0.36, 1],
        delay: 0.06 * i + 0.3
      }
    }),
    exit: (i: number) => ({ 
      opacity: 0, 
      y: 20, 
      rotateX: -5,
      transition: { 
        duration: 0.4,
        delay: 0.02 * i
      }
    }),
    tap: { 
      scale: 0.96, 
      y: 5,
      transition: { duration: 0.1 } 
    }
  };

  return (
    <AnimatePresence>
      <motion.nav
        ref={navRef}
        variants={navVariants}
        initial="visible"
        animate={isNavVisible ? "visible" : "hidden"}
        style={{ 
          boxShadow: "var(--depth-shadow)",
        }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all px-4 md:px-8",
          isScrolled 
            ? "py-3 backdrop-blur-xl border-b border-white/15" 
            : "py-5 bg-transparent"
        )}
      >
        <div 
          className={cn(
            "absolute inset-0 transition-all duration-500",
            isScrolled ? "bg-black/70 backdrop-blur-xl" : "bg-transparent"
          )}
          style={{
            backgroundImage: isScrolled ? 
              "linear-gradient(to bottom, rgba(0,0,0,0.85), rgba(0,0,0,0.75))" : 
              "none",
          }}
        />
        
        <div className="container mx-auto flex items-center justify-between relative z-10">
          {/* Logo with premium hover animation */}
          <Link to="/" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ 
                scale: 1.05,
                rotate: -1,
              }}
              transition={{ 
                type: "spring", 
                stiffness: 500, 
                damping: 15,
              }}
              className="overflow-hidden relative"
              style={{ opacity: logoOpacity }}
            >
              <motion.img 
                initial={{ filter: "brightness(1)" }}
                whileHover={{ 
                  filter: "brightness(1.2) contrast(1.1)",
                  scale: 1.05,
                }}
                transition={{ 
                  type: "spring", 
                  stiffness: 400, 
                  damping: 15,
                }}
                src="https://res.cloudinary.com/dvmrhs2ek/image/upload/v1747488784/ukxacg9kkjcewvwgml2u.png" 
                alt="Rebuild Fitness Logo" 
                className={cn(
                  "transition-all duration-300 filter drop-shadow-lg",
                  isScrolled ? "h-16 sm:h-20" : "h-20 sm:h-24"
                )}
              />
              <motion.div
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                className="absolute -inset-1 rounded-full bg-white/10 blur-lg -z-10"
              />
            </motion.div>
            
            {/* Tagline with premium animation */}
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ 
                opacity: isScrolled ? 0 : 1, 
                x: isScrolled ? -5 : 0 
              }}
              transition={{ 
                duration: 0.4, 
                ease: [0.22, 1, 0.36, 1] 
              }}
              className="hidden md:flex flex-col justify-center"
            >
              <motion.h2 
                className="text-white text-sm font-semibold tracking-wide"
              >
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                >
                  Rebuild Your Body,
                </motion.span>
              </motion.h2>
              <motion.p 
                className="text-rebuild-pink/90 text-xs font-medium"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.8 }}
              >
                Redefine Your Confidence.
              </motion.p>
            </motion.div>
          </Link>

          {/* Desktop Navigation - Ultra Premium Experience */}
          <div className="hidden md:flex items-center space-x-1">
            <NavigationMenu>
              <NavigationMenuList className="flex space-x-3">
                {menuItems.map((item) => (
                  <NavigationMenuItem key={item.id}>
                    <motion.div
                      variants={itemHoverVariants}
                      initial="initial"
                      whileHover="hover"
                      onHoverStart={() => setHoveredItem(item.id)}
                      onHoverEnd={() => setHoveredItem(null)}
                      className="relative"
                    >
                      <NavigationMenuLink 
                        className={cn(
                          "relative px-4 py-2 rounded-md text-sm font-medium tracking-wide transition-all",
                          "hover:text-white text-white/85 backdrop-blur-sm",
                          "border-b-2 border-transparent",
                          hoveredItem === item.id && "border-white/5",
                          activeSection === item.id 
                            ? "text-white bg-white/5" 
                            : "hover:bg-white/5"
                        )}
                        onClick={() => scrollToSection(item.id)}
                      >
                        <span className="relative z-10">{item.label}</span>
                        {activeSection === item.id && (
                          <motion.span
                            layoutId="activeIndicator"
                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-rebuild-purple/80 to-rebuild-pink/80 rounded-full"
                            style={{ bottom: -1 }}
                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                          />
                        )}
                        <motion.span
                          className="absolute inset-0 rounded-md -z-10 bg-gradient-to-br from-white/5 to-transparent opacity-0"
                          initial={{ opacity: 0 }}
                          whileHover={{ opacity: 1 }}
                          transition={{ duration: 0.2 }}
                        />
                      </NavigationMenuLink>
                    </motion.div>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
            
            <motion.div
              initial={{ scale: 1, rotate: 0 }}
              whileHover={{ 
                scale: 1.03, 
                rotate: 0,
                boxShadow: "0 0 20px rgba(186,104,200,0.2)"
              }}
              whileTap={{ scale: 0.97, rotate: 0 }}
              transition={{ 
                type: "spring", 
                stiffness: 400, 
                damping: 15,
                mass: 0.8
              }}
              className="relative ml-6 overflow-hidden rounded-md"
            >
              <motion.span
                className="absolute inset-0 bg-gradient-to-br from-rebuild-purple/90 via-rebuild-pink/90 to-purple-500/90 opacity-90"
                animate={{
                  background: [
                    "linear-gradient(to right, rgba(186,104,200,0.9), rgba(236,72,153,0.9))",
                    "linear-gradient(to right, rgba(236,72,153,0.9), rgba(168,85,247,0.9))",
                    "linear-gradient(to right, rgba(168,85,247,0.9), rgba(186,104,200,0.9))",
                  ],
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              />
              <Button 
                className="relative bg-black/10 text-white px-6 py-2 h-auto text-sm font-medium tracking-wider
                          transition-all duration-300 rounded-md border border-white/10 backdrop-blur-md"
                onClick={() => scrollToSection('join')}
              >
                <motion.span 
                  className="relative z-10"
                  initial={{ y: 0 }}
                  whileHover={{ y: -1 }}
                  transition={{ type: "spring", stiffness: 700, damping: 10 }}
                >JOIN NOW</motion.span>
                <span className="absolute inset-0 bg-black/15 transform scale-y-0 group-hover:scale-y-100 
                               transition-transform origin-bottom duration-500 -z-5"></span>
              </Button>
              <motion.div
                className="absolute -inset-1 blur-sm -z-10 opacity-0 bg-rebuild-pink/20"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 0.8 }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          </div>

          {/* Mobile Menu Toggle - Ultra Premium Animation */}
          <motion.button 
            className="md:hidden flex flex-col justify-center items-center w-14 h-14 rounded-full z-50 relative"
            onClick={() => {
              setIsMobileMenuOpen(!isMobileMenuOpen);
              triggerHapticFeedback();
              setMenuAnimationComplete(false);
            }}
            aria-label="Toggle menu"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <motion.div
              className="absolute inset-0 rounded-full -z-10"
              initial={{ backgroundColor: "rgba(0,0,0,0.1)" }}
              animate={{ 
                backgroundColor: isMobileMenuOpen 
                  ? "rgba(236,72,153,0.2)" 
                  : "rgba(0,0,0,0.2)",
                boxShadow: isMobileMenuOpen
                  ? "0 0 15px 2px rgba(236,72,153,0.3)"
                  : "0 0 0px 0px rgba(0,0,0,0)"
              }}
              whileHover={{ 
                backgroundColor: isMobileMenuOpen 
                  ? "rgba(236,72,153,0.3)" 
                  : "rgba(0,0,0,0.3)"
              }}
              style={{ backdropFilter: "blur(8px)" }}
              transition={{ duration: 0.3 }}
            />
            <motion.span 
              animate={isMobileMenuOpen 
                ? { rotate: 45, y: 6, backgroundColor: "#ec4899", width: "20px" } 
                : { rotate: 0, y: 0, backgroundColor: "#ffffff", width: "24px" }
              }
              className="block h-0.5 my-0.5"
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
            />
            <motion.span 
              animate={isMobileMenuOpen 
                ? { opacity: 0, x: -10, backgroundColor: "#ec4899", width: "16px" } 
                : { opacity: 1, x: 0, backgroundColor: "#ffffff", width: "24px" }
              }
              className="block h-0.5 my-0.5"
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
            />
            <motion.span 
              animate={isMobileMenuOpen 
                ? { rotate: -45, y: -6, backgroundColor: "#ec4899", width: "20px" } 
                : { rotate: 0, y: 0, backgroundColor: "#ffffff", width: "24px" }
              }
              className="block h-0.5 my-0.5"
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
            />
          </motion.button>
        </div>
      
        {/* Mobile Menu - Ultra Premium Full Screen Experience */}
        <AnimatePresence mode="wait">
          {isMobileMenuOpen && (
            <motion.div 
              ref={mobileMenuRef}
              initial={{ opacity: 0, y: -10, backdropFilter: "blur(0px)" }}
              animate={{ 
                opacity: 1, 
                y: 0, 
                backdropFilter: "blur(10px)",
                transition: { 
                  duration: 0.5, 
                  ease: [0.22, 1, 0.36, 1] 
                }
              }}
              exit={{ 
                opacity: 0, 
                y: -10, 
                backdropFilter: "blur(0px)",
                transition: { 
                  duration: 0.4, 
                  ease: [0.22, 1, 0.36, 1] 
                }
              }}
              onAnimationComplete={() => setMenuAnimationComplete(true)}
              className="fixed inset-0 bg-gradient-to-b from-black/95 via-black/90 to-black/95 z-40 flex flex-col items-center justify-center"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {/* Glow effects and decorative elements */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-br from-rebuild-purple/10 to-rebuild-pink/10 opacity-0 z-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7 }}
              />
              
              <motion.div
                className="absolute top-1/3 left-1/4 w-32 h-32 rounded-full bg-rebuild-purple/10 blur-3xl"
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                  duration: 7,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              />
              
              <motion.div
                className="absolute bottom-1/3 right-1/4 w-32 h-32 rounded-full bg-rebuild-pink/10 blur-3xl"
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              />
              
              {/* Swipe down indicator when menu first opens */}
              <motion.div
                className="absolute top-6 left-0 right-0 flex flex-col items-center"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <motion.p 
                  className="text-white/40 text-xs mb-1"
                  animate={{ y: [0, -3, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  Swipe down to close
                </motion.p>
                <motion.svg 
                  width="20" 
                  height="20" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  className="text-white/30"
                  animate={{ y: [0, 3, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </motion.svg>
              </motion.div>
              
              {/* Menu items container with 3D perspective */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col items-center space-y-5 text-white px-6 text-center relative z-10 perspective-800"
                style={{ perspective: "800px" }}
              >
                {menuItems.map((item, index) => (
                  <motion.button 
                    key={item.id}
                    custom={index}
                    variants={mobileItemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    whileTap="tap"
                    className={cn(
                      "relative py-5 px-10 text-2xl font-medium transition-all",
                      activeSection === item.id 
                        ? "text-rebuild-pink" 
                        : "text-white/85 hover:text-white"
                    )}
                    onClick={() => {
                      triggerHapticFeedback();
                      scrollToSection(item.id);
                    }}
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    <span className="relative inline-block">
                      {item.label}
                      
                      {/* Animated underline that follows active item */}
                      {activeSection === item.id && (
                        <motion.span 
                          layoutId="mobileActiveIndicator"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-rebuild-purple to-rebuild-pink"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                    </span>
                    
                    {/* Hover/press area with liquid animation */}
                    <motion.span
                      className="absolute inset-0 rounded-lg -z-10 opacity-0"
                      whileHover={{ 
                        opacity: 0.1,
                        scale: 1.05,
                        transition: { duration: 0.3 }
                      }}
                      whileTap={{ 
                        opacity: 0.15,
                        scale: 0.98
                      }}
                      style={{
                        background: "radial-gradient(circle at center, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%)"
                      }}
                    />
                  </motion.button>
                ))}
                
                {/* Join Now Button with enhanced animations */}
                <motion.div
                  custom={menuItems.length}
                  variants={mobileItemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  whileTap="tap"
                  className="mt-8 relative rounded-lg overflow-hidden w-full max-w-[240px] perspective-800"
                  style={{ transformStyle: "preserve-3d", perspective: "800px" }}
                >
                  {/* Button glow effect */}
                  <motion.div 
                    className="absolute -inset-1 opacity-0 blur-lg rounded-lg"
                    animate={{ 
                      opacity: [0.1, 0.3, 0.1],
                      background: [
                        "radial-gradient(circle at 50% 50%, rgba(186,104,200,0.5), rgba(236,72,153,0.5))",
                        "radial-gradient(circle at 30% 70%, rgba(236,72,153,0.5), rgba(186,104,200,0.5))",
                        "radial-gradient(circle at 70% 30%, rgba(186,104,200,0.5), rgba(236,72,153,0.5))",
                      ]
                    }}
                    transition={{ 
                      duration: 3, 
                      repeat: Infinity, 
                      repeatType: "reverse" 
                    }}
                  />
                  
                  <motion.span
                    className="absolute inset-0 bg-gradient-to-r from-rebuild-purple via-rebuild-pink to-purple-500"
                    animate={{
                      background: [
                        "linear-gradient(to right, rgba(186,104,200,0.9), rgba(236,72,153,0.9))",
                        "linear-gradient(to right, rgba(236,72,153,0.9), rgba(168,85,247,0.9))",
                        "linear-gradient(to right, rgba(168,85,247,0.9), rgba(186,104,200,0.9))",
                      ],
                    }}
                    transition={{
                      duration: 6,
                      repeat: Infinity,
                      repeatType: "reverse",
                    }}
                  />
                  
                  <Button 
                    className="relative bg-black/30 backdrop-blur-md text-white py-6 h-auto text-lg font-medium tracking-wider w-full
                            shadow-[0_0_20px_rgba(186,104,200,0.2)]
                            overflow-hidden rounded-md border border-white/20"
                    onClick={() => {
                      triggerHapticFeedback();
                      scrollToSection('join');
                    }}
                  >
                    <motion.span 
                      className="relative z-10"
                      initial={{ y: 0 }}
                      whileHover={{ y: -2 }}
                      transition={{ type: "spring", stiffness: 700, damping: 10 }}
                    >JOIN NOW</motion.span>
                    
                    {/* Shine effect */}
                    <motion.span 
                      className="absolute inset-0 -z-5"
                      initial={{ 
                        background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
                        left: "-100%"
                      }}
                      animate={{ left: "100%" }}
                      transition={{ 
                        duration: 1.5, 
                        repeat: Infinity, 
                        repeatDelay: 5
                      }}
                    />
                  </Button>
                </motion.div>
                
                {/* Social icons */}
                {menuAnimationComplete && (
                  <motion.div 
                    className="flex space-x-6 mt-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                  >
                    <motion.a 
                      href="https://instagram.com" 
                      target="_blank"
                      className="w-10 h-10 rounded-full flex items-center justify-center bg-white/10 text-white"
                      whileHover={{ scale: 1.1, backgroundColor: "rgba(236,72,153,0.3)" }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                      </svg>
                    </motion.a>
                    <motion.a 
                      href="tel:+919618361999" 
                      className="w-10 h-10 rounded-full flex items-center justify-center bg-white/10 text-white"
                      whileHover={{ scale: 1.1, backgroundColor: "rgba(186,104,200,0.3)" }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                      </svg>
                    </motion.a>
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </AnimatePresence>
  );
};

export default NavigationBar;
