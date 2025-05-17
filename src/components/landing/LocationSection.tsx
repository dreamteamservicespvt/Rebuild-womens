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
    <section id="location" className="section relative overflow-hidden py-24">
      {/* Decorative elements */}
      <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-rebuild-purple/5 to-transparent"></div>
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-rebuild-purple/10 rounded-full opacity-30 blur-3xl"></div>
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-rebuild-pink/10 rounded-full opacity-20 blur-3xl"></div>
      
      <div className="container-custom relative z-10">
        <SectionTitle 
          title="Location & Contact" 
          subtitle="Find us in the heart of Kakinada city"
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-stretch mt-12">
          {/* Left Column - Contact Info */}
          <motion.div 
            className="space-y-8 lg:col-span-2"
            variants={staggeredFadeInVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            {/* Main contact card */}
            <motion.div 
              className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-shadow duration-500"
              variants={itemVariants}
            >
              <h3 className="font-serif text-2xl font-bold mb-6 text-rebuild-purple bg-gradient-to-r from-rebuild-purple to-rebuild-pink bg-clip-text text-transparent">
                Get In Touch
              </h3>
              
              <div className="space-y-6">
                <div className="flex items-start group">
                  <div className="h-12 w-12 bg-rebuild-purple/10 rounded-full flex items-center justify-center mr-4 flex-shrink-0 group-hover:bg-rebuild-purple/20 transition-all duration-300">
                    <MapPin className="h-6 w-6 text-rebuild-purple" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-2">Our Address</h4>
                    <p className="text-gray-600 leading-relaxed">
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
                      className="inline-flex items-center mt-2 text-sm text-rebuild-purple hover:underline transition-all group"
                    >
                      <span>Get Directions</span>
                      <ExternalLink className="h-3.5 w-3.5 ml-1 transition-transform group-hover:translate-x-1" />
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start group">
                  <div className="h-12 w-12 bg-rebuild-purple/10 rounded-full flex items-center justify-center mr-4 flex-shrink-0 group-hover:bg-rebuild-purple/20 transition-all duration-300">
                    <Phone className="h-6 w-6 text-rebuild-purple" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-2">Contact Us</h4>
                    <p className="text-gray-600">
                      <a 
                        href="tel:+919618361999" 
                        className="text-lg hover:text-rebuild-purple transition-colors flex items-center group"
                      >
                        +91 96183 61999
                        <span className="ml-2 text-rebuild-purple/60 text-sm group-hover:translate-x-1 transition-transform">
                          Call now
                        </span>
                      </a>
                    </p>
                    <a 
                      href="https://wa.me/919618361999" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center mt-2 text-sm text-rebuild-purple hover:underline transition-all"
                    >
                      <span>Message on WhatsApp</span>
                      <ExternalLink className="h-3.5 w-3.5 ml-1" />
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start group">
                  <div className="h-12 w-12 bg-rebuild-purple/10 rounded-full flex items-center justify-center mr-4 flex-shrink-0 group-hover:bg-rebuild-purple/20 transition-all duration-300">
                    <Mail className="h-6 w-6 text-rebuild-purple" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-2">Email</h4>
                    <p className="text-gray-600">
                      <a 
                        href="mailto:contact@rebuild.fit" 
                        className="hover:text-rebuild-purple transition-colors"
                      >
                        contact@rebuild.fit
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Hours Card */}
            <motion.div 
              className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
              variants={itemVariants}
            >
              <div className="flex items-start mb-4">
                <div className="h-10 w-10 bg-amber-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <Clock className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-lg">Opening Hours</h4>
                </div>
              </div>
              
              <div className="space-y-2 text-gray-600">
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
            
            {/* Social Media */}
            <motion.div 
              className="bg-gradient-to-r from-rebuild-purple/20 to-rebuild-pink/20 backdrop-blur-sm rounded-2xl shadow-lg p-6"
              variants={itemVariants}
            >
              <h4 className="font-semibold text-lg mb-4 text-gray-800">Follow Us</h4>
              <div className="flex space-x-4">
                <Button variant="outline" size="icon" className="rounded-full bg-white hover:bg-white/80">
                  <Instagram className="h-5 w-5 text-rebuild-pink" />
                </Button>
                <Button variant="outline" size="icon" className="rounded-full bg-white hover:bg-white/80">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-rebuild-purple" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 11.7c0 6.45-5.27 11.68-11.78 11.68-2.07 0-4-.53-5.7-1.45L0 24l2.13-6.27a11.57 11.57 0 0 1-1.7-6.04C.44 5.23 5.72 0 12.23 0 18.72 0 24 5.23 24 11.7M12.22 1.85c-5.46 0-9.9 4.41-9.9 9.83 0a9.8 9.8 0 0 0 1.5 5.26L2.4 21.2l4.4-1.4a9.9 9.9 0 0 0 5.42 1.62c5.44 0 9.9-4.4 9.9-9.83a9.83 9.83 0 0 0-9.9-9.75" />
                  </svg>
                </Button>
              </div>
            </motion.div>
          </motion.div>
          
          {/* Right Column - Map */}
          <motion.div 
            className="rounded-2xl overflow-hidden shadow-2xl lg:col-span-3 h-[600px] lg:h-auto relative"
            variants={fadeInUpVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            whileHover={{ scale: 1.01, transition: { duration: 0.3 } }}
          >
            {/* Custom overlay with gradient for better aesthetics */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent z-10 pointer-events-none"></div>
            <div className="absolute inset-0 border border-white/10 rounded-2xl z-10 pointer-events-none"></div>
            
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
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full text-sm font-medium shadow-lg z-20 text-rebuild-purple flex items-center">
              <MapPin className="h-4 w-4 mr-2" />
              <span>Rebuild Fitness, Balaji Cheruvu Center</span>
            </div>
            
            {/* Floating action buttons */}
            <div className="absolute top-6 right-6 z-20 space-y-3">
              <a 
                href="https://maps.google.com/?q=Rebuild+Fitness+Gym+Kakinada" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white rounded-full p-3 shadow-lg hover:shadow-xl hover:bg-rebuild-purple hover:text-white transition-all duration-300 flex items-center justify-center"
              >
                <ExternalLink className="h-5 w-5" />
              </a>
            </div>
          </motion.div>
        </div>
        
        {/* Contact action card */}
        <motion.div 
          className="mt-16 bg-gradient-to-r from-rebuild-purple to-rebuild-pink rounded-2xl shadow-xl overflow-hidden"
          variants={fadeInUpVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="p-10 text-white">
              <h3 className="text-2xl font-bold mb-4">Ready to transform your body?</h3>
              <p className="mb-6 opacity-90">Visit our studio or call us today to begin your fitness journey with Rebuild.</p>
              <Button 
                onClick={() => document.getElementById('join')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-white text-rebuild-purple hover:bg-white/90"
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
                  <span>Certified female trainers</span>
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
