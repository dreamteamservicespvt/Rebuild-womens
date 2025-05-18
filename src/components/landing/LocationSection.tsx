import { Mail, MapPin, Phone, ExternalLink, Clock, Instagram } from "lucide-react";
import { motion } from "framer-motion";
import SectionTitle from "@/components/SectionTitle";
import { Button } from "@/components/ui/button";

const fadeInUpVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] }
  }
};

const staggeredFadeInVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  }
};

const LocationSection = () => {
  return (
    <section id="location" className="section relative overflow-hidden bg-gym-black py-24">
      {/* Decorative elements */}
      <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-gym-yellow/5 to-transparent"></div>
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-gym-yellow/10 rounded-full opacity-30 blur-3xl"></div>
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-gym-yellow/10 rounded-full opacity-20 blur-3xl"></div>
      
      <div className="container-custom relative z-10">
        <SectionTitle 
          title="Location & Contact" 
          subtitle="Find us in the heart of Kakinada city"
          className="text-white"
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start mt-12">
          {/* Left Column - Contact Info */}
          <motion.div 
            className="space-y-6"
            variants={staggeredFadeInVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            {/* Main contact card */}
            <motion.div 
              className="bg-gym-gray-dark rounded-2xl shadow-xl p-8 border border-gym-gray-light hover:border-gym-yellow/50 hover:shadow-[0_0_20px_rgba(255,243,24,0.2)] transition-shadow duration-500"
              variants={itemVariants}
            >
              <h3 className="font-serif text-2xl font-bold mb-6 text-gym-yellow neon-text">
                Get In Touch
              </h3>
              
              <div className="space-y-6">
                <div className="flex items-start group">
                  <div className="h-12 w-12 bg-gym-yellow/10 rounded-full flex items-center justify-center mr-4 flex-shrink-0 group-hover:bg-gym-yellow/20 transition-all duration-300">
                    <MapPin className="h-6 w-6 text-gym-yellow" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-2 text-white">Our Address</h4>
                    <p className="text-white/80 leading-relaxed">
                      Rebuild Fitness Gym,<br />
                      23‑7‑7/1, Opp. Bhavani Function Hall,<br />
                      TTD Kalyana Mandapam Backside,<br />
                      Balaji Cheruvu Centre,<br />
                      Kakinada, Andhra Pradesh 533001
                    </p>
                    <a 
                      href="https://maps.google.com/?q=Rebuild+Fitness+Gym+Kakinada" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center mt-2 text-sm text-gym-yellow hover:underline transition-all group"
                    >
                      <span>Get Directions</span>
                      <ExternalLink className="h-3.5 w-3.5 ml-1 transition-transform group-hover:translate-x-1" />
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start group">
                  <div className="h-12 w-12 bg-gym-yellow/10 rounded-full flex items-center justify-center mr-4 flex-shrink-0 group-hover:bg-gym-yellow/20 transition-all duration-300">
                    <Phone className="h-6 w-6 text-gym-yellow" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-2 text-white">Contact Us</h4>
                    <p className="text-white/80">
                      <a 
                        href="tel:+919618361999" 
                        className="text-lg hover:text-gym-yellow transition-colors flex items-center group"
                      >
                        +91 96183 61999
                        <span className="ml-2 text-gym-yellow/60 text-sm group-hover:translate-x-1 transition-transform">
                          Call now
                        </span>
                      </a>
                    </p>
                    <a 
                      href="https://wa.me/919618361999" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center mt-2 text-sm text-gym-yellow hover:underline transition-all"
                    >
                      <span>Message on WhatsApp</span>
                      <ExternalLink className="h-3.5 w-3.5 ml-1" />
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start group">
                  <div className="h-12 w-12 bg-gym-yellow/10 rounded-full flex items-center justify-center mr-4 flex-shrink-0 group-hover:bg-gym-yellow/20 transition-all duration-300">
                    <Mail className="h-6 w-6 text-gym-yellow" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-2 text-white">Email</h4>
                    <p className="text-white/80">
                      <a 
                        href="mailto:contact@rebuild.fit" 
                        className="hover:text-gym-yellow transition-colors"
                      >
                        contact@rebuild.fit
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
          
          {/* Right Column - Map and Hours */}
          <div className="space-y-6">
            {/* Map */}
            <motion.div 
              className="rounded-xl overflow-hidden shadow-[0_0_15px_rgba(255,243,24,0.15)] h-[250px] relative border border-gym-yellow/20"
              variants={fadeInUpVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              whileHover={{ scale: 1.01, transition: { duration: 0.3 } }}
            >
              {/* Custom overlay with gradient for better aesthetics */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent z-10 pointer-events-none"></div>
              <div className="absolute inset-0 border border-white/10 rounded-xl z-10 pointer-events-none"></div>
              
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3827.0279542821863!2d82.2356389!3d16.5677778!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a37a544d3f881df%3A0x90e8c310f0e705a0!2sBalaji%20Cheruvu%20Center%2C%20Kakinada%2C%20Andhra%20Pradesh%20533001!5e0!3m2!1sen!2sin!4v1652343678954!5m2!1sen!2sin" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Rebuild Fitness Location"
                className="grayscale hover:grayscale-0 transition-all duration-700 h-full w-full"
              ></iframe>
              
              {/* Address pill overlay */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-gym-gray-dark/90 backdrop-blur-sm px-4 py-2 rounded-full text-xs font-medium shadow-lg z-20 text-gym-yellow flex items-center">
                <MapPin className="h-3 w-3 mr-1.5" />
                <span>Rebuild Fitness, Balaji Cheruvu Center</span>
              </div>
              
              {/* Floating action buttons */}
              <div className="absolute top-4 right-4 z-20">
                <a 
                  href="https://maps.google.com/?q=Rebuild+Fitness+Gym+Kakinada" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-gym-gray-dark rounded-full p-2 shadow-lg hover:shadow-xl hover:bg-gym-yellow hover:text-gym-black transition-all duration-300 flex items-center justify-center"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </motion.div>
            
            {/* Opening Hours - Below map in right column */}
            <motion.div 
              className="bg-gym-gray-dark rounded-xl shadow-xl p-6 border border-gym-yellow/20"
              variants={itemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
            >
              <div className="flex items-start mb-4">
                <div className="h-10 w-10 bg-gym-yellow/20 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <Clock className="h-5 w-5 text-gym-yellow" />
                </div>
                <div>
                  <h4 className="font-semibold text-lg text-white">Opening Hours</h4>
                </div>
              </div>
              
              <div className="space-y-2 text-white/80">
                <div className="flex justify-between items-center">
                  <span>Monday - Friday</span>
                  <span className="font-medium">6:00 AM - 9:00 PM</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Saturday</span>
                  <span className="font-medium">7:00 AM - 7:00 PM</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Sunday</span>
                  <span className="font-medium">Closed</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Contact action card */}
        <motion.div 
          className="mt-12 bg-gradient-to-r from-gym-yellow/20 to-gym-yellow/10 rounded-xl shadow-lg overflow-hidden border border-gym-yellow/30"
          variants={fadeInUpVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="p-10 text-white">
              <h3 className="text-2xl font-bold mb-4 neon-text">Ready to transform your body?</h3>
              <p className="mb-6 opacity-90">Visit our studio or call us today to begin your fitness journey with Rebuild.</p>
              <Button 
                onClick={() => document.getElementById('join')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-gym-yellow text-gym-black hover:bg-gym-yellow/90 neon-border"
              >
                Join Now
              </Button>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-10 hidden md:block">
              <ul className="space-y-4 text-white">
                <li className="flex items-center">
                  <div className="h-8 w-8 bg-white/20 rounded-full flex items-center justify-center mr-3">
                    <Check className="h-4 w-4" />
                  </div>
                  <span>Women-only safe environment</span>
                </li>
                <li className="flex items-center">
                  <div className="h-8 w-8 bg-white/20 rounded-full flex items-center justify-center mr-3">
                    <Check className="h-4 w-4" />
                  </div>
                  <span></span>
                </li>
                <li className="flex items-center">
                  <div className="h-8 w-8 bg-white/20 rounded-full flex items-center justify-center mr-3">
                    <Check className="h-4 w-4" />
                  </div>
                  <span>Personalized weight loss plans</span>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const Check = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export default LocationSection;
