
import { Mail, MapPin, Phone } from "lucide-react";
import SectionTitle from "@/components/SectionTitle";

const LocationSection = () => {
  return (
    <section id="location" className="section relative overflow-hidden bg-gradient-to-b from-purple-50 to-gray-50 py-24">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-white to-transparent"></div>
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-100 rounded-full opacity-30 blur-3xl"></div>
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-pink-100 rounded-full opacity-20 blur-3xl"></div>
      
      <div className="container-custom relative z-10">
        <SectionTitle 
          title="Location & Contact" 
          subtitle="Find us in the heart of Kakinada city."
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="animate-on-scroll space-y-6 bg-white rounded-xl shadow-lg p-8 transition-all duration-300 hover:shadow-xl">
            <div className="flex items-start">
              <div className="h-10 w-10 bg-rebuild-purple/10 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                <MapPin className="h-5 w-5 text-rebuild-purple" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Our Address</h3>
                <p className="text-gray-600">
                  Rebuild Fitness Gym,<br />
                  23‑7‑7/1, Opp. Bhavani Function Hall,<br />
                  TTD Kalyana Mandapam Backside,<br />
                  Balaji Cheruvu Centre,<br />
                  Kakinada, Andhra Pradesh 533001
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="h-10 w-10 bg-rebuild-purple/10 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                <Phone className="h-5 w-5 text-rebuild-purple" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Phone</h3>
                <p className="text-gray-600">
                  <a 
                    href="tel:+919618361999" 
                    className="hover:text-rebuild-purple transition-colors"
                  >
                    +91 96183 61999
                  </a>
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="h-10 w-10 bg-rebuild-purple/10 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                <Mail className="h-5 w-5 text-rebuild-purple" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Email</h3>
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
          
          <div className="h-96 rounded-xl overflow-hidden shadow-xl animate-on-scroll hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3827.0279542821863!2d82.2356389!3d16.5677778!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a37a544d3f881df%3A0x90e8c310f0e705a0!2sBalaji%20Cheruvu%20Center%2C%20Kakinada%2C%20Andhra%20Pradesh%20533001!5e0!3m2!1sen!2sin!4v1652343678954!5m2!1sen!2sin" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Rebuild Fitness Location"
              className="grayscale hover:grayscale-0 transition-all duration-500"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocationSection;
