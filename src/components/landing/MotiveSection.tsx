import { motion } from "framer-motion";
import SectionTitle from "@/components/SectionTitle";

const MotiveSection = () => {
  return (
    <section id="why-us" className="section relative bg-gym-black py-24">
      {/* Decorative elements */}
      <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-gym-yellow/5 to-transparent"></div>
      <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-gym-yellow/5 rounded-full opacity-20 blur-3xl"></div>
      
      <div className="container-custom relative z-10">
        <SectionTitle 
          title="Why Rebuild Women?" 
          subtitle="Our mission and values"
          className="text-white"
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12 items-center">
          <motion.div
            className="animate-on-scroll visible"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7 }}
          >
            <div className="relative">
              <div className="absolute -inset-2 bg-gradient-to-r from-gym-yellow/30 to-transparent rounded-lg blur-lg"></div>
              <img 
                src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1470&auto=format&fit=crop" 
                alt="Rebuild Women Founder" 
                loading="lazy"
                width="600"
                height="400"
                className="rounded-lg relative z-10 w-full h-full object-cover border border-gym-yellow/30"
              />
              <div className="absolute -bottom-4 -right-4 bg-gym-yellow/10 backdrop-blur-sm rounded-lg p-4 border border-gym-yellow/20 shadow-lg text-white">
                <p className="font-semibold">Founded in 2022</p>
                <p className="text-sm opacity-80">Kakinada, India</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            className="space-y-6 animate-on-scroll visible"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <h3 className="text-2xl md:text-3xl font-bold text-gym-yellow [text-shadow:0_0_10px_rgba(255,243,24,0.3)]">
              More Than Just a Gym
            </h3>
            
            <div className="space-y-4">
              <p className="text-white/90 text-lg leading-relaxed">
                Rebuild Women was created to help every woman feel strong, confident, and unstoppable. It's more than a gym — it's a sisterhood, a safe space, and a movement.
              </p>
              
              <p className="text-white/80 leading-relaxed">
                We believe that fitness is not just about losing weight or building muscle. It's about building confidence, creating sustainable habits, and finding joy in the journey of becoming your strongest self.
              </p>
              
              <p className="text-white/80 leading-relaxed">
                Our women-only environment provides a comfortable space where you can focus on your goals without judgment or distraction. Our certified female trainers understand women's bodies and specific fitness needs.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-8">
              <div className="bg-gym-gray-dark p-4 rounded-lg border border-gym-gray-light">
                <h4 className="text-gym-yellow font-semibold mb-2">Our Mission</h4>
                <p className="text-white/70 text-sm">To empower women through fitness, creating stronger bodies and minds.</p>
              </div>
              
              <div className="bg-gym-gray-dark p-4 rounded-lg border border-gym-gray-light">
                <h4 className="text-gym-yellow font-semibold mb-2">Our Vision</h4>
                <p className="text-white/70 text-sm">A world where every woman has the tools and confidence to prioritize her health.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default MotiveSection;
