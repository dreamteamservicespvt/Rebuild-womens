import { useState, useEffect } from "react";
import { Facebook, Instagram, Twitter, Phone, Mail, Globe, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { useFirebase } from "@/contexts/FirebaseContext";
import { getFirestore, collection, onSnapshot, doc, getDoc } from "firebase/firestore";

// Update the FooterSettings interface to make id optional to match FirebaseContext's definition
interface FooterSettings {
  id?: string; // Make id optional with ?
  phone: string;
  email: string;
  brandName: string;
  socialLinks: {
    instagram?: string;
    facebook?: string;
    whatsapp?: string;
    youtube?: string;
    x?: string;  // Twitter/X platform
  };
}

// Create a mock getFooterSettings function since it's referenced but may not exist
const mockGetFooterSettings = async (): Promise<FooterSettings> => {
  return {
    id: "1",
    phone: "+91 96183 61999",
    email: "contact@rebuild.com",
    brandName: "Rebuild Women's",
    socialLinks: {
      instagram: "https://instagram.com",
      facebook: "https://facebook.com",
      whatsapp: "https://api.whatsapp.com/send?phone=919618361999",
      youtube: "https://youtube.com",
      x: undefined,
    }
  };
};

const Footer = () => {
  const { getFooterSettings } = useFirebase();
  const [footerData, setFooterData] = useState<FooterSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const currentYear = new Date().getFullYear();
  
  // Load footer settings from Firebase
  useEffect(() => {
    // First try to get initial data
    const fetchFooterSettings = async () => {
      try {
        const data = await (getFooterSettings ? getFooterSettings() : mockGetFooterSettings());
        // Use type assertion to ensure compatibility
        setFooterData(data as FooterSettings);
      } catch (error) {
        console.error("Error fetching footer settings:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFooterSettings();
    
    // Then set up real-time listener for updates
    const db = getFirestore();
    const footerSettingsRef = collection(db, "footer_settings");
    
    // Use onSnapshot to listen for real-time updates
    const unsubscribe = onSnapshot(footerSettingsRef, (snapshot) => {
      if (!snapshot.empty) {
        // Get the first document from the collection
        const doc = snapshot.docs[0];
        setFooterData({
          id: doc.id,
          ...doc.data()
        } as FooterSettings); // Use type assertion here as well
        setLoading(false);
      }
    }, (error) => {
      console.error("Error listening to footer settings:", error);
      setLoading(false);
    });
    
    // Clean up listener on unmount
    return () => unsubscribe();
  }, [getFooterSettings]);
  
  // Default data as fallback
  const defaultData = {
    phone: "+91 96183 61999",
    email: "contact@rebuild.com",
    brandName: "Rebuild Women's",
    socialLinks: {
      instagram: "https://instagram.com",
      facebook: "https://facebook.com",
      whatsapp: "https://api.whatsapp.com/send?phone=919618361999",
      youtube: "https://youtube.com",
      x: undefined,
    }
  };
  
  // Use either the fetched data or default values
  const {
    phone,
    email,
    brandName,
    socialLinks
  } = footerData || defaultData;
  
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
            <h3 className="text-xl font-bold mb-4 text-gym-yellow neon-text">
              {!loading ? brandName : "Rebuild Fitness"}
            </h3>
            <p className="text-white/80 mb-4">
              Women-only weight-loss program executed by certified women trainers.
            </p>
            <div className="flex space-x-4">
              {/* Social Icons - Instagram */}
              {socialLinks.instagram && (
                <a 
                  href={socialLinks.instagram} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full flex items-center justify-center bg-gym-gray-dark shadow-sm border border-gym-gray-light text-white/70 hover:text-gym-yellow hover:bg-gym-gray hover:border-gym-yellow/50 hover:shadow-[0_0_10px_rgba(255,243,24,0.3)] transition-all duration-300 transform hover:scale-105"
                  aria-label="Instagram"
                >
                  <Instagram className="h-5 w-5" />
                </a>
              )}
              
              {/* Social Icons - Facebook */}
              {socialLinks.facebook && (
                <a 
                  href={socialLinks.facebook} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full flex items-center justify-center bg-gym-gray-dark shadow-sm border border-gym-gray-light text-white/70 hover:text-gym-yellow hover:bg-gym-gray hover:border-gym-yellow/50 hover:shadow-[0_0_10px_rgba(255,243,24,0.3)] transition-all duration-300 transform hover:scale-105"
                  aria-label="Facebook"
                >
                  <Facebook className="h-5 w-5" />
                </a>
              )}
              
              {/* Social Icons - YouTube */}
              {socialLinks.youtube && (
                <a 
                  href={socialLinks.youtube}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full flex items-center justify-center bg-gym-gray-dark shadow-sm border border-gym-gray-light text-white/70 hover:text-gym-yellow hover:bg-gym-gray hover:border-gym-yellow/50 hover:shadow-[0_0_10px_rgba(255,243,24,0.3)] transition-all duration-300 transform hover:scale-105"
                  aria-label="YouTube"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5" 
                    fill="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                  </svg>
                </a>
              )}
              
              {/* Social Icons - WhatsApp */}
              {socialLinks.whatsapp && (
                <a 
                  href={socialLinks.whatsapp}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full flex items-center justify-center bg-gym-gray-dark shadow-sm border border-gym-gray-light text-white/70 hover:text-gym-yellow hover:bg-gym-gray hover:border-gym-yellow/50 hover:shadow-[0_0_10px_rgba(255,243,24,0.3)] transition-all duration-300 transform hover:scale-105"
                  aria-label="WhatsApp"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5" 
                    fill="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </a>
              )}
              
              {/* Social Icons - Twitter/X (if available) */}
              {socialLinks.x && (
                <a 
                  href={socialLinks.x}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full flex items-center justify-center bg-gym-gray-dark shadow-sm border border-gym-gray-light text-white/70 hover:text-gym-yellow hover:bg-gym-gray hover:border-gym-yellow/50 hover:shadow-[0_0_10px_rgba(255,243,24,0.3)] transition-all duration-300 transform hover:scale-105"
                  aria-label="Twitter/X"
                >
                  <Twitter className="h-5 w-5" />
                </a>
              )}
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
            
            {loading ? (
              <div className="space-y-4 animate-pulse">
                <div className="h-10 bg-gym-gray-light/20 rounded"></div>
                <div className="h-10 bg-gym-gray-light/20 rounded"></div>
                <div className="h-10 bg-gym-gray-light/20 rounded"></div>
              </div>
            ) : (
              <div className="space-y-4">
                {phone && (
                  <a 
                    href={`tel:${phone}`} 
                    className="flex items-center group"
                  >
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gym-gray-dark shadow-sm border border-gym-gray-light text-gym-yellow mr-3 group-hover:bg-gym-yellow/20 group-hover:text-gym-yellow group-hover:shadow-[0_0_10px_rgba(255,243,24,0.3)] transition-all duration-300">
                      <Phone className="h-4 w-4" />
                    </div>
                    <span className="text-white/80 group-hover:text-gym-yellow transition-colors">{phone}</span>
                  </a>
                )}
                
                {email && (
                  <a 
                    href={`mailto:${email}`}
                    className="flex items-center group"
                  >
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gym-gray-dark shadow-sm border border-gym-gray-light text-gym-yellow mr-3 group-hover:bg-gym-yellow/20 group-hover:text-gym-yellow group-hover:shadow-[0_0_10px_rgba(255,243,24,0.3)] transition-all duration-300">
                      <Mail className="h-4 w-4" />
                    </div>
                    <span className="text-white/80 group-hover:text-gym-yellow transition-colors">{email}</span>
                  </a>
                )}
                
                <a 
                  href="#" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center group"
                >
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gym-gray-dark shadow-sm border border-gym-gray-light text-gym-yellow mr-3 group-hover:bg-gym-yellow/20 group-hover:text-gym-yellow group-hover:shadow-[0_0_10px_rgba(255,243,24,0.3)] transition-all duration-300">
                    <Globe className="h-4 w-4" />
                  </div>
                  <span className="text-white/80 group-hover:text-gym-yellow transition-colors">{brandName}</span>
                </a>
              </div>
            )}
          </div>
        </div>
        
        {/* Copyright section - Fixed for mobile */}
        <div className="mt-10 pt-6 border-t border-gym-gray-light">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-white/60 mb-3 md:mb-0 text-center md:text-left">
              © {currentYear} {brandName || "Rebuild Fitness"}. All rights reserved.
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
