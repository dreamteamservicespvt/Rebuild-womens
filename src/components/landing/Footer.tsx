import { Facebook, Instagram, Twitter, Phone, Mail, Globe, ChevronRight, Linkedin, Youtube } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="relative bg-gym-black text-white pt-20 pb-10 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gym-yellow/50 to-transparent"></div>
      <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-gym-yellow/5 to-transparent"></div>
      <div className="absolute -top-40 right-0 w-96 h-96 bg-gym-yellow/5 rounded-full opacity-20 blur-3xl"></div>
      <div className="absolute -bottom-40 -left-20 w-96 h-96 bg-gym-yellow/5 rounded-full opacity-20 blur-3xl"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="animate-on-scroll visible">
            <h3 className="text-xl font-bold mb-4 text-gym-yellow neon-text">Rebuild Fitness</h3>
            <p className="text-white/80 mb-4">Women-only weight-loss program executed by certified women trainers.</p>
            
            <div className="flex flex-wrap gap-3">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full flex items-center justify-center bg-gym-gray-dark shadow-sm border border-gym-gray-light text-white/70 hover:text-gym-yellow hover:bg-gym-gray hover:border-gym-yellow/50 hover:shadow-[0_0_10px_rgba(255,243,24,0.3)] transition-all duration-300 transform hover:scale-105"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full flex items-center justify-center bg-gym-gray-dark shadow-sm border border-gym-gray-light text-white/70 hover:text-gym-yellow hover:bg-gym-gray hover:border-gym-yellow/50 hover:shadow-[0_0_10px_rgba(255,243,24,0.3)] transition-all duration-300 transform hover:scale-105"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full flex items-center justify-center bg-gym-gray-dark shadow-sm border border-gym-gray-light text-white/70 hover:text-gym-yellow hover:bg-gym-gray hover:border-gym-yellow/50 hover:shadow-[0_0_10px_rgba(255,243,24,0.3)] transition-all duration-300 transform hover:scale-105"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              
              {/* YouTube Icon */}
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full flex items-center justify-center bg-gym-gray-dark shadow-sm border border-gym-gray-light text-white/70 hover:text-gym-yellow hover:bg-gym-gray hover:border-gym-yellow/50 hover:shadow-[0_0_10px_rgba(255,243,24,0.3)] transition-all duration-300 transform hover:scale-105"
                aria-label="YouTube"
              >
                <Youtube className="h-5 w-5" />
              </a>
              
              {/* LinkedIn Icon */}
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full flex items-center justify-center bg-gym-gray-dark shadow-sm border border-gym-gray-light text-white/70 hover:text-gym-yellow hover:bg-gym-gray hover:border-gym-yellow/50 hover:shadow-[0_0_10px_rgba(255,243,24,0.3)] transition-all duration-300 transform hover:scale-105"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              
              <a 
                href="https://api.whatsapp.com/send?phone=919618361999"
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full flex items-center justify-center bg-gym-gray-dark shadow-sm border border-gym-gray-light text-white/70 hover:text-gym-yellow hover:bg-gym-gray hover:border-gym-yellow/50 hover:shadow-[0_0_10px_rgba(255,243,24,0.3)] transition-all duration-300 transform hover:scale-105"
                aria-label="WhatsApp"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5" 
                  viewBox="0 0 24 24" 
                  fill="currentColor"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </a>
            </div>
          </div>
          
          <div className="animate-on-scroll visible" style={{ animationDelay: "0.1s" }}>
            <h3 className="text-xl font-bold mb-4 text-gym-yellow neon-text">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-white/80 hover:text-gym-yellow transition-colors block py-1 transform hover:translate-x-1 transition-transform duration-300">
                  Home
                </a>
              </li>
              <li>
                <a href="#sessions" className="text-white/80 hover:text-gym-yellow transition-colors block py-1 transform hover:translate-x-1 transition-transform duration-300">
                  Sessions
                </a>
              </li>
              <li>
                <a href="#pricing" className="text-white/80 hover:text-gym-yellow transition-colors block py-1 transform hover:translate-x-1 transition-transform duration-300">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#join" className="text-white/80 hover:text-gym-yellow transition-colors block py-1 transform hover:translate-x-1 transition-transform duration-300">
                  Join Now
                </a>
              </li>
              <li>
                <a href="#location" className="text-white/80 hover:text-gym-yellow transition-colors block py-1 transform hover:translate-x-1 transition-transform duration-300">
                  Location
                </a>
              </li>
            </ul>
          </div>
          
          <div className="animate-on-scroll visible" style={{ animationDelay: "0.2s" }}>
            <h3 className="text-xl font-bold mb-4 text-gym-yellow neon-text">Contact Us</h3>
            <div className="space-y-4">
              <a 
                href="tel:+919618361999" 
                className="flex items-center group"
              >
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gym-gray-dark shadow-sm border border-gym-gray-light text-gym-yellow mr-3 group-hover:bg-gym-yellow/20 group-hover:text-gym-yellow group-hover:shadow-[0_0_10px_rgba(255,243,24,0.3)] transition-all duration-300">
                  <Phone className="h-4 w-4" />
                </div>
                <span className="text-white/80 group-hover:text-gym-yellow transition-colors">+91 96183 61999</span>
              </a>
              
              <a 
                href="mailto:contact@rebuild.fit" 
                className="flex items-center group"
              >
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gym-gray-dark shadow-sm border border-gym-gray-light text-gym-yellow mr-3 group-hover:bg-gym-yellow/20 group-hover:text-gym-yellow group-hover:shadow-[0_0_10px_rgba(255,243,24,0.3)] transition-all duration-300">
                  <Mail className="h-4 w-4" />
                </div>
                <span className="text-white/80 group-hover:text-gym-yellow transition-colors">contact@rebuild.fit</span>
              </a>
              
              <a 
                href="https://www.rebuild.fit/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center group"
              >
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gym-gray-dark shadow-sm border border-gym-gray-light text-gym-yellow mr-3 group-hover:bg-gym-yellow/20 group-hover:text-gym-yellow group-hover:shadow-[0_0_10px_rgba(255,243,24,0.3)] transition-all duration-300">
                  <Globe className="h-4 w-4" />
                </div>
                <span className="text-white/80 group-hover:text-gym-yellow transition-colors">www.rebuild.fit</span>
              </a>
            </div>
          </div>
        </div>
        
        {/* Copyright section - Fixed for mobile */}
        <div className="mt-10 pt-6 border-t border-gym-gray-light">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-white/60 mb-3 md:mb-0 text-center md:text-left">
              © {currentYear} Rebuild Fitness. All rights reserved.
            </p>
            <p className="text-white/60 text-center md:text-left mb-16 md:mb-0">
              {/* Added pb-safe for iOS safe area */}
              <span className="pb-safe inline-block">
                Designed & Developed by{" "}
                <a 
                  href="https://thedreamteamservices.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gym-yellow hover:underline"
                >
                  thedreamteamservices.com
                </a>
              </span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
