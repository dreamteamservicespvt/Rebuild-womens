import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import SectionTitle from "@/components/SectionTitle";
import { useFirebase } from "@/contexts/FirebaseContext";
import { useToast } from "@/hooks/use-toast";

interface Trainer {
  id: string;
  name: string;
  expertise: string;
  quote: string;
  image: string;
}

const TrainersSection = () => {
  const { getTrainers } = useFirebase();
  const { toast } = useToast(); // Add toast for better error handling
  const [trainers, setTrainers] = useState<Trainer[]>([
    {
      id: "revathi",
      name: "Revathi",
      expertise: "Weight Loss & Strength Training",
      quote: "Helping women feel strong, not just look strong.",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1470&auto=format&fit=crop"
    },
    {
      id: "jyothi",
      name: "Jyothi",
      expertise: "Zumba & Dance Fitness",
      quote: "Dance your way to fitness and confidence.",
      image: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=1469&auto=format&fit=crop"
    }
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        const trainersData = await getTrainers();
        if (trainersData && trainersData.length > 0) {
          setTrainers(trainersData);
        }
      } catch (error) {
        // Replace console.error with toast
        toast({
          variant: "destructive",
          title: "Error loading trainers",
          description: "Using default trainer information instead."
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTrainers();
  }, [getTrainers, toast]);

  return (
    <section id="trainers" className="section relative bg-gym-black py-24">
      {/* Decorative elements */}
      <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-gym-yellow/5 to-transparent"></div>
      <div className="absolute -top-12 -left-12 w-64 h-64 bg-gym-yellow/5 rounded-full opacity-20 blur-3xl"></div>
      
      <div className="container-custom relative z-10">
        <SectionTitle 
          title="Meet Our Trainers" 
          subtitle="Certified professionals dedicated to your fitness journey"
          className="text-white"
        />
        
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gym-yellow"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            {trainers.map((trainer, index) => (
              <motion.div
                key={trainer.id}
                className="bg-gym-gray-dark rounded-xl overflow-hidden border border-gym-gray-light hover:border-gym-yellow transition-all duration-300 shadow-lg animate-on-scroll group"
                style={{ animationDelay: `${index * 0.1}s` }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="md:flex">
                  <div className="md:w-2/5 h-64 md:h-auto relative overflow-hidden">
                    <img 
                      src={trainer.image} 
                      alt={`${trainer.name} - Rebuild Women Trainer`}
                      loading="lazy"
                      width="300"
                      height="400"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:bg-gradient-to-r"></div>
                    
                    {/* Mobile only name overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 md:hidden">
                      <h3 className="text-2xl font-bold text-white">{trainer.name}</h3>
                      <p className="text-gym-yellow text-sm">{trainer.expertise}</p>
                    </div>
                  </div>
                  
                  <div className="p-6 md:w-3/5 flex flex-col justify-center">
                    {/* Desktop name */}
                    <div className="hidden md:block">
                      <h3 className="text-2xl font-bold text-white mb-2">{trainer.name}</h3>
                      <p className="text-gym-yellow text-sm mb-4">{trainer.expertise}</p>
                    </div>
                    
                    {/* Quote */}
                    <blockquote className="relative">
                      <div className="text-gym-yellow text-4xl absolute -top-4 -left-2 opacity-30">"</div>
                      <p className="text-white/80 italic relative z-10 pl-4">
                        {trainer.quote}
                      </p>
                      <div className="text-gym-yellow text-4xl absolute -bottom-8 -right-2 opacity-30">"</div>
                    </blockquote>
                    
                    {/* Certification badges */}
                    <div className="flex flex-wrap gap-2 mt-6">
                      <span className="bg-gym-yellow/20 text-gym-yellow text-xs px-3 py-1 rounded-full">Certified</span>
                      <span className="bg-gym-yellow/20 text-gym-yellow text-xs px-3 py-1 rounded-full">Women's Fitness</span>
                      <span className="bg-gym-yellow/20 text-gym-yellow text-xs px-3 py-1 rounded-full">Nutrition</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default TrainersSection;
