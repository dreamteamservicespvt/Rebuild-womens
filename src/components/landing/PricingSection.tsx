import { useEffect, useState } from "react";
import SectionTitle from "@/components/SectionTitle";
import { CheckCircle } from "lucide-react";
import { useFirebase } from "@/contexts/FirebaseContext";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

interface ServicePrice {
  id: string;
  title: string;
  basePrice: number;
  discountedPrice: number;
  trainer: string;
  features: string[];
}

const PricingSection = () => {
  const { getServices } = useFirebase();
  const [services, setServices] = useState<ServicePrice[]>([
    {
      id: "strength",
      title: "Strength Training",
      basePrice: 1800,
      discountedPrice: 1500,
      trainer: "Revathi",
      features: [
        "Build lean muscle",
        "Morning: 5:30AM to 10:30AM",
        "Evening: 4:00PM to 8:00PM",
        "Women-only environment",
        "Specialized equipment",
        "Form correction & guidance"
      ]
    },
    {
      id: "weight-loss",
      title: "Weight Loss Program",
      basePrice: 4000,
      discountedPrice: 3000,
      trainer: "Revathi",
      features: [
        "Personalized workout plans",
        "Nutrition guidance",
        "Women-only environment",
        "Morning: 6:00AM to 10:00AM",
        "Evening: 4:00PM to 8:00PM",
        "Progress tracking"
      ]
    },
    {
      id: "zumba",
      title: "Zumba",
      basePrice: 2000,
      discountedPrice: 1500,
      trainer: "Jyothi",
      features: [
        "Fun dance workouts",
        "Burn calories with music",
        "Improve coordination",
        "Suitable for all fitness levels",
        "Women-only environment",
        "Evening sessions: 4:00PM to 8:00PM"
      ]
    }
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch services
        const servicesData = await getServices();
        if (servicesData && servicesData.length > 0) {
          setServices(servicesData);
        }
      } catch (error) {
        // Replace console.error with toast notification
        toast({
          variant: "destructive",
          title: "Error loading pricing",
          description: "Using default pricing information. Please try again later."
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [getServices, toast]);

  const scrollToJoin = () => {
    document.getElementById('join')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="pricing" className="section relative overflow-hidden bg-gym-black py-24">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gym-yellow/5 rounded-full blur-3xl -translate-y-1/3 translate-x-1/4"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gym-yellow/5 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4"></div>
      
      <div className="container-custom relative z-10">
        <SectionTitle 
          title="Membership Pricing" 
          subtitle="Invest in yourself with our affordable and value-packed membership plans"
          className="text-white"
        />
        
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gym-yellow"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {services.map((service, index) => (
              <div 
                key={service.id}
                className="relative animate-on-scroll visible"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="bg-gym-gray-dark rounded-xl shadow-xl overflow-visible border-2 border-gym-yellow/30 hover:border-gym-yellow transition-all duration-300 relative backdrop-blur-sm">
                  {/* Offer banner */}
                  <div className="absolute -top-4 right-0 left-0 flex justify-center z-10">
                    <div className="bg-gym-yellow text-black px-4 py-1.5 rounded-full text-sm font-bold shadow-lg">
                      MEMBERSHIP
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-gym-yellow/10 to-gym-yellow/5 p-6 text-center">
                    <h3 className="text-2xl font-bold text-gym-yellow neon-text">{service.title}</h3>
                    <p className="text-sm text-white/80 mt-1">Trainer: {service.trainer}</p>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex flex-col items-center justify-center mb-6">
                      <span className="text-lg line-through text-white/40 mb-1">₹{service.basePrice}</span>
                      <div className="flex items-end">
                        {/* Display the base price here, not the discounted price */}
                        <span className="text-4xl font-bold text-gym-yellow neon-text">₹{service.basePrice}</span>
                        <span className="text-white/70 self-end mb-1.5 ml-1">/month</span>
                      </div>
                    </div>
                    
                    <ul className="space-y-3 mb-6">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center transition-all duration-300 hover:translate-x-1 group">
                          <CheckCircle className="h-5 w-5 text-gym-yellow mr-3 flex-shrink-0 group-hover:text-gym-yellow transition-colors duration-300" />
                          <span className="text-white/90 text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <Button 
                      onClick={scrollToJoin}
                      className="w-full bg-gym-yellow text-black hover:bg-gym-yellow/90 hover:shadow-[0_0_15px_rgba(255,243,24,0.3)]"
                    >
                      Join Now
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default PricingSection;
