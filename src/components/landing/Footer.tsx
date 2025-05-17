
import { Facebook, Instagram, Twitter, Phone, Mail, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gradient-to-br from-rebuild-dark to-rebuild-dark/90 text-white py-12">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="animate-on-scroll">
            <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Rebuild Fitness</h3>
            <p className="text-gray-300 mb-4">
              Women-only weight-loss program executed by certified women trainers.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-300">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-300">
                <Instagram className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-300">
                <Twitter className="h-5 w-5" />
              </Button>
            </div>
          </div>
          
          <div className="animate-on-scroll" style={{ animationDelay: "0.1s" }}>
            <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { name: "Home", href: "#" },
                { name: "Sessions", href: "#sessions" },
                { name: "Pricing", href: "#pricing" },
                { name: "Join Now", href: "#join" },
                { name: "Location", href: "#location" },
              ].map((link, index) => (
                <li key={link.name}>
                  <a 
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors block py-1 transform hover:translate-x-1 transition-transform duration-300"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="animate-on-scroll" style={{ animationDelay: "0.2s" }}>
            <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Contact Us</h3>
            <p className="text-gray-300 mb-2 hover:text-white transition-colors">
              <a 
                href="tel:+919618361999"
                className="flex items-center hover:text-white transition-colors"
              >
                <Phone className="h-4 w-4 mr-2 opacity-70" />
                +91 96183 61999
              </a>
            </p>
            <p className="text-gray-300 mb-2">
              <a 
                href="mailto:contact@rebuild.fit"
                className="flex items-center hover:text-white transition-colors"
              >
                <Mail className="h-4 w-4 mr-2 opacity-70" />
                contact@rebuild.fit
              </a>
            </p>
            <p className="text-gray-300">
              <a 
                href="https://www.rebuild.fit/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center hover:text-white transition-colors"
              >
                <Globe className="h-4 w-4 mr-2 opacity-70" />
                www.rebuild.fit
              </a>
            </p>
          </div>
        </div>
        
        <div className="mt-12 pt-6 border-t border-gray-800 text-center text-gray-400 text-sm">
          <p>© {currentYear} Rebuild Fitness. All rights reserved.</p>
          <p className="mt-2">
            <a 
              href="https://thedreamteamservices.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              Designed & Developed by thedreamteamservices.com
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
