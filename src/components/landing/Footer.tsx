import { Facebook, Instagram, Twitter, Phone, Mail, Globe, ChevronRight, ArrowUp, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

const Footer = () => {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const currentYear = new Date().getFullYear();
  
  // Show back to top button when scrolled down
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  return (
    <footer className="relative bg-white text-gray-800 pt-20 pb-10 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-rebuild-purple/50 to-transparent"></div>
      <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-rebuild-purple/5 to-transparent"></div>
      <div className="absolute -top-40 right-0 w-96 h-96 bg-rebuild-purple/5 rounded-full opacity-20 blur-3xl"></div>
      <div className="absolute -bottom-40 -left-20 w-96 h-96 bg-rebuild-pink/5 rounded-full opacity-20 blur-3xl"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="animate-on-scroll visible">
            <h3 className="text-xl font-bold mb-4 text-rebuild-purple">Rebuild Fitness</h3>
            <p className="text-gray-800 mb-4">Women-only weight-loss program executed by certified women trainers.</p>
            
            <div className="flex space-x-3">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full flex items-center justify-center bg-white shadow-sm border border-gray-100 text-gray-600 hover:text-white hover:bg-blue-600 hover:border-blue-600 hover:shadow-md transition-all duration-300 transform hover:scale-105"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full flex items-center justify-center bg-white shadow-sm border border-gray-100 text-gray-600 hover:text-white hover:bg-gradient-to-br hover:from-amber-500 hover:via-pink-500 hover:to-purple-500 hover:border-pink-500 hover:shadow-md transition-all duration-300 transform hover:scale-105"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full flex items-center justify-center bg-white shadow-sm border border-gray-100 text-gray-600 hover:text-white hover:bg-blue-400 hover:border-blue-400 hover:shadow-md transition-all duration-300 transform hover:scale-105"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div className="animate-on-scroll visible" style={{ animationDelay: "0.1s" }}>
            <h3 className="text-xl font-bold mb-4 text-rebuild-purple">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-800 hover:text-rebuild-purple transition-colors block py-1 transform hover:translate-x-1 transition-transform duration-300">
                  Home
                </a>
              </li>
              <li>
                <a href="#sessions" className="text-gray-800 hover:text-rebuild-purple transition-colors block py-1 transform hover:translate-x-1 transition-transform duration-300">
                  Sessions
                </a>
              </li>
              <li>
                <a href="#pricing" className="text-gray-800 hover:text-rebuild-purple transition-colors block py-1 transform hover:translate-x-1 transition-transform duration-300">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#join" className="text-gray-800 hover:text-rebuild-purple transition-colors block py-1 transform hover:translate-x-1 transition-transform duration-300">
                  Join Now
                </a>
              </li>
              <li>
                <a href="#location" className="text-gray-800 hover:text-rebuild-purple transition-colors block py-1 transform hover:translate-x-1 transition-transform duration-300">
                  Location
                </a>
              </li>
            </ul>
          </div>
          
          <div className="animate-on-scroll visible" style={{ animationDelay: "0.2s" }}>
            <h3 className="text-xl font-bold mb-4 text-rebuild-purple">Contact Us</h3>
            <div className="space-y-4">
              <a 
                href="tel:+919618361999" 
                className="flex items-center group"
              >
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white shadow-sm border border-gray-100 text-rebuild-purple mr-3 group-hover:bg-rebuild-purple group-hover:text-white group-hover:shadow-md transition-all duration-300">
                  <Phone className="h-4 w-4" />
                </div>
                <span className="text-gray-800 group-hover:text-rebuild-purple transition-colors">+91 96183 61999</span>
              </a>
              
              <a 
                href="mailto:contact@rebuild.fit" 
                className="flex items-center group"
              >
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white shadow-sm border border-gray-100 text-rebuild-purple mr-3 group-hover:bg-rebuild-purple group-hover:text-white group-hover:shadow-md transition-all duration-300">
                  <Mail className="h-4 w-4" />
                </div>
                <span className="text-gray-800 group-hover:text-rebuild-purple transition-colors">contact@rebuild.fit</span>
              </a>
              
              <a 
                href="https://www.rebuild.fit/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center group"
              >
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white shadow-sm border border-gray-100 text-rebuild-purple mr-3 group-hover:bg-rebuild-purple group-hover:text-white group-hover:shadow-md transition-all duration-300">
                  <Globe className="h-4 w-4" />
                </div>
                <span className="text-gray-800 group-hover:text-rebuild-purple transition-colors">www.rebuild.fit</span>
              </a>
            </div>
          </div>
        </div>
        
        {/* Copyright section */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 mb-4 md:mb-0">
              © {new Date().getFullYear()} Rebuild Fitness. All rights reserved.
            </p>
            <p className="text-gray-600">
              Designed & Developed by{" "}
              <a 
                href="https://thedreamteamservices.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-rebuild-purple hover:underline"
              >
                thedreamteamservices.com
              </a>
            </p>
          </div>
        </div>
      </div>
      
      {/* Back to top button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-50 w-12 h-12 rounded-full bg-gradient-to-r from-rebuild-purple to-rebuild-pink text-white shadow-lg flex items-center justify-center group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Back to top"
          >
            <ChevronUp className="h-6 w-6 transition-transform group-hover:-translate-y-1 duration-300" />
            
            {/* Optional pulse effect */}
            <span className="absolute inset-0 rounded-full bg-rebuild-purple animate-ping opacity-25"></span>
          </motion.button>
        )}
      </AnimatePresence>
    </footer>
  );
};

export default Footer;
