import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import SectionTitle from "@/components/SectionTitle";
import { Users, Music, Dumbbell } from "lucide-react";
import { useFirebase } from "@/contexts/FirebaseContext";
import { toast } from "@/components/ui/use-toast";

interface Service {
  id: string;
  title: string;
  basePrice: number;
  discountedPrice: number;
  trainer: string;
  maxCapacity: number | string;
  icon: React.ReactNode;
  description: string;
  timings?: string; // Add the missing timings property
}

const ServicesSection = () => {
  const { getServices } = useFirebase();
  const [services, setServices] = useState<Service[]>([
    {
      id: "strength",
      title: "Strength Training",
      basePrice: 1800,
      discountedPrice: 1500,
      trainer: "Revathi",
      maxCapacity: "Unlimited",
      icon: <Dumbbell className="h-10 w-10 text-gym-yellow" />,
      description: "Build lean muscle, improve metabolism and create a stronger, more defined physique.",
      timings: "5:30AM to 10:30AM, 4:00PM to 8:00PM"
    },
    {
      id: "weight-loss",
      title: "Weight Loss Program",
      basePrice: 4000,
      discountedPrice: 3000,
      trainer: "Revathi",
      maxCapacity: 10,
      icon: <Users className="h-10 w-10 text-gym-yellow" />,
      description: "Comprehensive program designed to help women achieve sustainable weight loss through nutrition and exercise.",
      timings: "6:00AM to 10:00AM, 4:00PM to 8:00PM"
    },
    {
      id: "zumba",
      title: "Zumba",
      basePrice: 2000,
      discountedPrice: 1500,
      trainer: "Jyothi",
      maxCapacity: 9,
      icon: <Music className="h-10 w-10 text-gym-yellow" />,
      description: "Fun, energetic dance workouts to help you burn calories while enjoying upbeat music.",
      timings: "4:00PM to 8:00PM"
    }
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const servicesData = await getServices();
        if (servicesData && servicesData.length > 0) {
          // Map icons to services data
          const mappedServices = servicesData.map(service => {
            let icon;
            switch(service.id) {
              case "zumba":
                icon = <Music className="h-10 w-10 text-gym-yellow" />;
                break;
              case "weight-loss":
                icon = <Users className="h-10 w-10 text-gym-yellow" />;
                break;
              case "strength":
                icon = <Dumbbell className="h-10 w-10 text-gym-yellow" />;
                break;
              default:
                icon = <Dumbbell className="h-10 w-10 text-gym-yellow" />;
            }
            return { ...service, icon };
          });
          setServices(mappedServices);
        }
      } catch (error) {
        // Replace console.error with toast notification
        toast({
          variant: "destructive",
          title: "Error loading services",
          description: "Using default service information instead."
        });
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [getServices, toast]);

  const scrollToJoin = () => {
    document.getElementById('join')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="services" className="section relative bg-gym-black py-24">
      {/* Decorative elements */}
      <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-gym-yellow/5 to-transparent"></div>
      <div className="absolute -top-12 -right-12 w-64 h-64 bg-gym-yellow/5 rounded-full opacity-20 blur-3xl"></div>
      <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-gym-yellow/5 rounded-full opacity-20 blur-3xl"></div>
      
      <div className="container-custom relative z-10">
        <SectionTitle 
          title="Our Services" 
          subtitle="Choose the program that best fits your fitness goals"
          className="text-white"
        />
        
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gym-yellow"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                className="bg-gym-gray-dark rounded-xl overflow-hidden border border-gym-gray-light hover:border-gym-yellow transition-all duration-300 shadow-lg animate-on-scroll"
                style={{ animationDelay: `${index * 0.1}s` }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {/* Card header with icon */}
                <div className="p-6 bg-gradient-to-r from-gym-yellow/10 to-transparent flex items-center space-x-4">
                  <div className="bg-gym-gray/30 p-3 rounded-full">
                    {service.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{service.title}</h3>
                    <p className="text-gym-yellow text-sm">Trainer: {service.trainer}</p>
                  </div>
                </div>
                
                {/* Card content */}
                <div className="p-6">
                  <p className="text-white/70 mb-4">{service.description}</p>
                  
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white/60">Base Fee:</span>
                    <span className="text-white/90">₹{service.basePrice}</span>
                  </div>
                  
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-white/60">With Coupon:</span>
                    {/* Change this to make it clear this is a potential discount with a coupon */}
                    <span className="text-gym-yellow font-semibold">
                      Starting from ₹{service.discountedPrice}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-white/60">Timings:</span>
                    <span className="text-white/90 text-right text-sm">{service.timings}</span>
                  </div>
                  
                  <div className="flex justify-between items-center mb-6 bg-gym-gray/20 p-2 rounded">
                    <span className="text-white/60">Max Capacity:</span>
                    <span className="text-white/90 font-medium">{service.maxCapacity}</span>
                  </div>
                  
                  <Button 
                    onClick={scrollToJoin}
                    className="w-full bg-gym-yellow text-black hover:bg-gym-yellow/90 hover:shadow-[0_0_15px_rgba(255,243,24,0.3)]"
                  >
                    Join Now
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ServicesSection;
