import { useEffect, useState } from "react";
import SectionTitle from "@/components/SectionTitle";
import { CheckCircle } from "lucide-react";
import { useFirebase } from "@/contexts/FirebaseContext";

const PricingSection = () => {
  const { getPriceConfig } = useFirebase();
  const [price, setPrice] = useState(4000);
  const [originalPrice, setOriginalPrice] = useState(4000); // Store original price
  const [offer, setOffer] = useState<'none' | '50off' | '25off'>('none');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPricing = async () => {
      try {
        const config = await getPriceConfig();
        setPrice(config.discountedPrice);
        setOriginalPrice(config.basePrice);
        setOffer(config.currentOffer);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching price:", error);
        setLoading(false);
      }
    };

    fetchPricing();
  }, [getPriceConfig]);

  const renderOffer = () => {
    if (offer === '50off') {
      return (
        <div className="absolute -top-6 right-0 left-0 flex justify-center z-10">
          <div className="bg-gradient-to-r from-rebuild-purple to-rebuild-pink text-white px-6 py-2 rounded-full text-base font-bold shadow-lg transform rotate-0 scale-110">
            50% OFF
          </div>
        </div>
      );
    } else if (offer === '25off') {
      return (
        <div className="absolute -top-6 right-0 left-0 flex justify-center z-10">
          <div className="bg-gradient-to-r from-rebuild-pink to-rebuild-purple text-white px-6 py-2 rounded-full text-base font-bold shadow-lg transform rotate-0 scale-110">
            25% OFF
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <section id="pricing" className="section relative overflow-hidden bg-gradient-to-b from-purple-100/40 to-pink-50/40 py-24">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl -translate-y-1/3 translate-x-1/4"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-200/30 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4"></div>
      
      <div className="container-custom relative z-10">
        <SectionTitle 
          title="Simple & Transparent Pricing" 
          subtitle="Invest in yourself with our affordable and value-packed membership plans."
        />
        
        <div className="max-w-md mx-auto relative animate-on-scroll mt-16">
          <div className="bg-white rounded-xl shadow-xl overflow-visible border-2 border-rebuild-purple/30 hover:border-rebuild-purple transition-all duration-300 relative backdrop-blur-sm">
            {renderOffer()}
            
            <div className="bg-gradient-to-r from-rebuild-purple/10 to-rebuild-pink/10 p-6 text-center">
              <h3 className="text-2xl font-bold text-rebuild-purple">Monthly Membership</h3>
              <p className="text-sm text-gray-600 mt-1">Full access to all facilities & classes</p>
            </div>
            
            <div className="p-8">
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              ) : (
                <>
                  <div className="flex flex-col items-center justify-center mb-8">
                    {offer !== 'none' && (
                      <span className="text-lg line-through text-gray-400 mb-1">₹{originalPrice}</span>
                    )}
                    <div className="flex items-end">
                      <span className="text-5xl font-bold bg-gradient-to-r from-rebuild-purple to-rebuild-pink bg-clip-text text-transparent">₹{price}</span>
                      <span className="text-gray-500 self-end mb-2 ml-1">/month</span>
                    </div>
                  </div>
                  
                  <ul className="space-y-4">
                    {[
                      "Personalized workout plans",
                      "Women-only environment",
                      "Certified women trainers",
                      "Nutrition guidance",
                      "Progress tracking",
                      "24/7 community support"
                    ].map((feature, index) => (
                      <li key={index} className="flex items-center transition-all duration-300 hover:translate-x-1 group">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 group-hover:text-rebuild-purple transition-colors duration-300" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
              
              <div className="mt-10 text-center">
                <a 
                  href="#join"
                  className="inline-block bg-gradient-to-r from-rebuild-purple to-rebuild-pink text-white px-8 py-3.5 rounded-lg font-medium hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden group w-full"
                >
                  <span className="relative z-10">Join Now</span>
                  <span className="absolute inset-0 bg-white/10 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
                </a>
              </div>
            </div>
          </div>
          
          {offer !== 'none' && (
            <div className="mt-4 text-center bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-md animate-on-scroll">
              <p className="text-sm font-medium">
                {offer === '50off' ? (
                  <span>Limited time offer: <strong className="text-rebuild-purple">50% OFF</strong> for first 20 members!</span>
                ) : (
                  <span>Special deal: <strong className="text-rebuild-pink">25% OFF</strong> for next 20 members!</span>
                )}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
