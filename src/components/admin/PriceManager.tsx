import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useFirebase } from "@/contexts/FirebaseContext";
import UPIQRCode from "@/components/UpiQRCode";

const PriceManager = () => {
  const { getPriceConfig, updatePriceConfig } = useFirebase();
  const { toast } = useToast();
  const [currentOffer, setCurrentOffer] = useState<'none' | '50off' | '25off'>('none');
  const [basePrice] = useState(4000);
  const [discountedPrice, setDiscountedPrice] = useState(4000);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchPriceConfig();
  }, []);

  const fetchPriceConfig = async () => {
    setLoading(true);
    try {
      const config = await getPriceConfig();
      setCurrentOffer(config.currentOffer);
      setDiscountedPrice(config.discountedPrice);
    } catch (error) {
      console.error("Error fetching price config:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load price configuration. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSetOffer = async (offer: 'none' | '50off' | '25off') => {
    setUpdating(true);
    try {
      await updatePriceConfig({ currentOffer: offer });
      setCurrentOffer(offer);
      
      // Update discounted price based on offer
      if (offer === '50off') {
        setDiscountedPrice(basePrice * 0.5);
      } else if (offer === '25off') {
        setDiscountedPrice(basePrice * 0.75);
      } else {
        setDiscountedPrice(basePrice);
      }
      
      toast({
        title: "Price updated",
        description: offer === 'none' 
          ? "Removed all discounts. Price is now ₹4000." 
          : offer === '50off'
            ? "Applied 50% discount. Price is now ₹2000."
            : "Applied 25% discount. Price is now ₹3000.",
      });
    } catch (error) {
      console.error("Error updating price:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update price. Please try again.",
      });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="bg-gym-gray-dark border-gym-gray-light">
        <CardHeader>
          <CardTitle className="text-gym-yellow">Membership Pricing</CardTitle>
          <CardDescription className="text-white/70">
            Set the pricing and discounts for new members
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-gym-gray rounded-lg border border-gym-gray-light">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-white/80">Base Price:</span>
                <span className="font-semibold text-white">₹{basePrice}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-white/80">Current Price:</span>
                <span className="font-semibold text-lg text-gym-yellow">₹{discountedPrice}</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <h3 className="font-medium">Select Active Offer:</h3>
              
              <div className="grid grid-cols-1 gap-3">
                <Button
                  variant={currentOffer === '50off' ? "default" : "outline"}
                  className={currentOffer === '50off' ? "bg-gym-yellow text-black" : "border-gym-yellow text-gym-yellow hover:bg-gym-yellow/20"}
                  onClick={() => handleSetOffer('50off')}
                  disabled={updating}
                >
                  50% OFF (₹2000) - First 20 Members
                </Button>
                
                <Button
                  variant={currentOffer === '25off' ? "default" : "outline"}
                  className={currentOffer === '25off' ? "bg-rebuild-pink" : ""}
                  onClick={() => handleSetOffer('25off')}
                  disabled={updating}
                >
                  25% OFF (₹3000) - Next 20 Members
                </Button>
                
                <Button
                  variant={currentOffer === 'none' ? "default" : "outline"}
                  onClick={() => handleSetOffer('none')}
                  disabled={updating}
                >
                  No Discount (₹4000) - Regular Price
                </Button>
              </div>
              
              <p className="text-sm text-gray-500 mt-4">
                The selected offer will be immediately reflected on the website and the UPI QR code.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Payment QR Preview</CardTitle>
          <CardDescription>
            Current UPI QR code shown to customers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UPIQRCode amount={discountedPrice} />
        </CardContent>
      </Card>
    </div>
  );
};

export default PriceManager;
