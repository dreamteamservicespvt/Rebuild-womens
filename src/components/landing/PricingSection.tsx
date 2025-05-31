import { useEffect, useState, useCallback } from "react";
import SectionTitle from "@/components/SectionTitle";
import { CheckCircle, Copy, CheckCheck, Clock, Calendar, Users } from "lucide-react";
import { useFirebase, ServiceType } from "@/contexts/FirebaseContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

interface ServicePrice {
  id: string;
  title: string;
  basePrice: number;
  discountedPrice: number;
  trainer: string;
  features: string[];
}

// Add interface for coupon data
interface CouponData {
  id: string;
  code: string;
  maxRedemptions: number;
  usageCount: number;
  expiryDate: string;
  status: string;
}

// Fallback services in case Firebase fetch fails
const fallbackServices = [
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
];

const PricingSection = () => {
  const { getServices, getActiveCoupon, getAllCoupons } = useFirebase();
  const { toast } = useToast();
  const [services, setServices] = useState<ServicePrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCoupon, setActiveCoupon] = useState<CouponData | null>(null);
  const [copied, setCopied] = useState(false);
  
  // Add new state for all coupons
  const [allCoupons, setAllCoupons] = useState<CouponData[]>([]);

  // Use useCallback to prevent recreating this function on every render
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch services from Firebase
      const servicesData = await getServices();
      
      if (servicesData && servicesData.length > 0) {
        setServices(servicesData);
      } else {
        // Remove console.log about "No services found in Firebase"
        setServices(fallbackServices as ServiceType[]);
      }
      
      // Initialize allCoupons as empty array
      setAllCoupons([]);
      
      // Fetch coupon data
      try {
        // Get all coupons for the public display
        const allCouponsData = await getAllCoupons();
        // Remove console.log about "Fetched coupons"
        setAllCoupons(allCouponsData || []);
        
        // Get active coupon for special offer
        const activeCouponData = await getActiveCoupon();
        if (activeCouponData) {
          setActiveCoupon(activeCouponData);
        }
      } catch (error) {
        // Silent error handling
        setAllCoupons([]); // Ensure empty array on error
      }
      
    } catch (error) {
      // Silent error handling for service data
      setServices(fallbackServices as ServiceType[]);
      toast({
        variant: "destructive",
        title: "Error loading pricing",
        description: "Using default pricing information. Please try again later."
      });
    } finally {
      setLoading(false);
    }
  }, [getServices, getActiveCoupon, getAllCoupons, toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const scrollToJoin = () => {
    document.getElementById('join')?.scrollIntoView({ behavior: 'smooth' });
  };
  
  // Function to copy coupon code to clipboard
  const copyToClipboard = () => {
    if (activeCoupon) {
      navigator.clipboard.writeText(activeCoupon.code);
      setCopied(true);
      toast({
        title: "Coupon copied!",
        description: `${activeCoupon.code} has been copied to your clipboard.`,
      });
      
      setTimeout(() => setCopied(false), 2000);
    }
  };
  
  // Check if offer is valid (before June 6th)
  const isOfferValid = () => {
    if (!activeCoupon) return false;
    
    const expiryDate = new Date(activeCoupon.expiryDate);
    const offerEndDate = new Date("2023-06-06"); // June 6, 2023
    const currentDate = new Date();
    
    // Make sure the active coupon from admin dashboard is displayed
    return activeCoupon.status === "active" && 
           expiryDate >= currentDate && 
           currentDate < offerEndDate && 
           activeCoupon.usageCount < activeCoupon.maxRedemptions;
  };
  
  // Calculate remaining spots
  const remainingSpots = activeCoupon ? 
    activeCoupon.maxRedemptions - activeCoupon.usageCount : 0;
  
  // Calculate days remaining until June 5th
  const calculateDaysRemaining = () => {
    const today = new Date();
    const endDate = new Date("2023-06-05"); // June 5, 2023
    
    // Set both dates to midnight for accurate day calculation
    today.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);
    
    const differenceMs = endDate.getTime() - today.getTime();
    const differenceDays = Math.ceil(differenceMs / (1000 * 60 * 60 * 24));
    
    return differenceDays > 0 ? differenceDays : 0;
  };
  
  const daysRemaining = calculateDaysRemaining();

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
        
        {/* Public Coupon Code Display - Always visible */}
        <div className="mb-8 bg-gym-gray-dark rounded-lg border border-gym-yellow/30 p-4">
          <h3 className="text-xl font-bold text-gym-yellow mb-2">
            Available Discount Codes {allCoupons.length === 0 && '(0)'}
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-white/90">
              <thead>
                <tr className="border-b border-gym-yellow/20">
                  <th className="py-2 px-4 text-left">Coupon Code</th>
                  <th className="py-2 px-4 text-left">Status</th>
                  <th className="py-2 px-4 text-left">Expiry</th>
                  <th className="py-2 px-4 text-left">Remaining Uses</th>
                  <th className="py-2 px-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {allCoupons && allCoupons.length > 0 ? (
                  allCoupons.map((coupon) => {
                    const isExpired = new Date(coupon.expiryDate) < new Date();
                    const isFull = coupon.usageCount >= coupon.maxRedemptions;
                    const isValidCoupon = coupon.status === "active" && !isExpired && !isFull;
                    
                    return (
                      <tr key={coupon.id} className="border-b border-gym-yellow/10 hover:bg-gym-yellow/5">
                        <td className="py-2 px-4 font-mono font-bold">{coupon.code}</td>
                        <td className="py-2 px-4">
                          <span className={`px-2 py-1 rounded text-xs ${isValidCoupon ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                            {isValidCoupon ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="py-2 px-4">{new Date(coupon.expiryDate).toLocaleDateString()}</td>
                        <td className="py-2 px-4">
                          {isFull ? (
                            <span className="text-red-400">0 remaining (Full)</span>
                          ) : (
                            <>
                              <span className="font-medium">{coupon.maxRedemptions - coupon.usageCount}</span> 
                              <span className="text-white/60"> remaining of </span>
                              <span>{coupon.maxRedemptions}</span>
                            </>
                          )}
                        </td>
                        <td className="py-2 px-4">
                          <Button
                            onClick={() => {
                              navigator.clipboard.writeText(coupon.code);
                              toast({
                                title: "Coupon copied!",
                                description: `${coupon.code} has been copied to your clipboard.`,
                              });
                            }}
                            variant="outline"
                            className="h-8 px-3 text-xs border-gym-yellow/30 text-gym-yellow hover:bg-gym-yellow/10"
                          >
                            Copy Code
                          </Button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="py-4 text-center text-white/60">
                      No coupon codes available at the moment.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <p className="text-white/60 text-sm mt-3">
            * Discount codes are applicable on first month fees only. Apply these codes during checkout.
            {allCoupons?.length === 0 && " Check back later for special offers."}
          </p>
        </div>
        
        {/* Special Offer Banner */}
        {isOfferValid() && (
          <div className="mb-14 animate-pulse-slow">
            <div className="bg-gradient-to-r from-gym-yellow/20 to-gym-yellow/10 rounded-lg border-2 border-gym-yellow overflow-hidden shadow-[0_0_15px_rgba(255,243,24,0.2)] relative">
              {/* Corner ribbon */}
              <div className="absolute top-0 right-0">
                <div className="bg-gym-yellow text-black font-bold py-1 px-4 shadow-md transform rotate-45 translate-x-[25%] translate-y-[10%] text-sm">
                  FIRST MONTH ONLY
                </div>
              </div>
              
              <div className="p-4 sm:p-6">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="flex-1 space-y-3">
                    <h3 className="font-bold text-xl sm:text-2xl text-gym-yellow tracking-tight">
                      Special First Month Discount
                    </h3>
                    
                    <p className="text-white text-sm sm:text-base">
                      Get a significant discount on your <span className="font-bold underline text-gym-yellow">first month only</span> of membership. 
                      Apply the coupon code at checkout to claim this exclusive offer!
                    </p>
                    
                    <div className="flex flex-wrap gap-4 mt-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-gym-yellow" />
                        <span className="text-white/90 text-sm">
                          Offer ends on <span className="font-semibold text-gym-yellow">5th June</span>
                          {daysRemaining > 0 && <span className="ml-1 text-red-400 font-bold">({daysRemaining} days left)</span>}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-gym-yellow" />
                        <span className="text-white/90 text-sm">
                          Limited to first <span className="font-semibold text-gym-yellow">30</span> members
                          <span className="ml-1 text-red-400 font-bold">({remainingSpots} spots left)</span>
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-gym-yellow" />
                        <span className="text-white/90 text-sm">
                          <span className="font-semibold text-gym-yellow">First month only</span> - Regular pricing applies after
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gym-black/50 p-4 rounded-lg border border-gym-yellow/30 flex flex-col items-center space-y-3">
                    <p className="text-sm text-white/80">Use this coupon code</p>
                    <div className="bg-gym-yellow/10 border-2 border-gym-yellow px-5 py-3 rounded-md flex items-center gap-3">
                      <span className="font-mono text-xl font-bold text-gym-yellow tracking-wider">
                        {activeCoupon?.code}
                      </span>
                      <button 
                        onClick={copyToClipboard} 
                        className="text-white hover:text-gym-yellow transition-colors"
                        title="Copy coupon code"
                      >
                        {copied ? <CheckCheck size={20} /> : <Copy size={20} />}
                      </button>
                    </div>
                    <Button 
                      onClick={scrollToJoin}
                      className="bg-gym-yellow text-black hover:bg-gym-yellow/90 hover:shadow-[0_0_15px_rgba(255,243,24,0.3)] w-full"
                    >
                      Claim First Month Discount
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {[1, 2, 3].map((i) => (
              <div key={i} className="relative animate-pulse">
                <div className="bg-gym-gray-dark rounded-xl shadow-xl overflow-visible border-2 border-gym-yellow/30 h-[500px]">
                  <div className="absolute -top-4 right-0 left-0 flex justify-center z-10">
                    <div className="bg-gym-gray-light h-7 w-28 rounded-full"></div>
                  </div>
                  <div className="p-6 text-center space-y-3">
                    <Skeleton className="h-6 w-3/4 mx-auto bg-gym-gray-light" />
                    <Skeleton className="h-4 w-1/2 mx-auto bg-gym-gray-light" />
                  </div>
                  <div className="p-6 space-y-6">
                    <div className="flex flex-col items-center">
                      <Skeleton className="h-5 w-16 bg-gym-gray-light mb-1" />
                      <Skeleton className="h-8 w-24 bg-gym-gray-light" />
                    </div>
                    <div className="space-y-3">
                      {[1, 2, 3, 4, 5].map(j => (
                        <div key={j} className="flex items-center">
                          <div className="h-5 w-5 rounded-full bg-gym-gray-light mr-3"></div>
                          <Skeleton className="h-4 flex-1 bg-gym-gray-light" />
                        </div>
                      ))}
                    </div>
                    <Skeleton className="h-10 w-full bg-gym-gray-light rounded" />
                  </div>
                </div>
              </div>
            ))}
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
                      {/* Only show strikethrough if there's a discounted price different from base price */}
                      {service.discountedPrice !== service.basePrice && (
                        <span className="text-lg line-through text-white/40 mb-1">₹{service.basePrice}</span>
                      )}
                      <div className="flex items-end">
                        {/* Show the appropriate price */}
                        <span className="text-4xl font-bold text-gym-yellow neon-text">
                          ₹{service.discountedPrice === service.basePrice ? service.basePrice : service.discountedPrice}
                        </span>
                        <span className="text-white/70 self-end mb-1.5 ml-1">/month</span>
                        {service.discountedPrice !== service.basePrice && (
                          <span className="text-xs bg-gym-yellow text-black px-2 py-0.5 rounded ml-2 self-end mb-2">First Month</span>
                        )}
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
                      {service.discountedPrice !== service.basePrice 
                        ? "Join with First Month Discount" 
                        : "Join Now"}
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
