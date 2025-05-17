import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import UpiQRCode from "@/components/UpiQRCode";
import { useFirebase } from "@/contexts/FirebaseContext";
import { Instagram, Home, Phone } from "lucide-react";

const JoinForm = () => {
  const { addBooking, getPriceConfig } = useFirebase();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    age: "",
    session: "",
    message: "",
    price: 0,
    paid: false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string, field: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Get current price config
      const priceConfig = await getPriceConfig();
      setFormData(prev => ({ ...prev, price: priceConfig.discountedPrice }));
      
      setStep(2);
      toast({
        title: "Form submitted successfully!",
        description: "Please complete your payment to secure your spot.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Something went wrong",
        description: "Please try again later.",
      });
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentComplete = async () => {
    setLoading(true);
    try {
      // Convert form data to match BookingType
      await addBooking({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        preferredSlot: formData.session,
        paymentStatus: 'completed',
        price: formData.price,
      });
      
      setStep(3);
      toast({
        title: "Payment registered!",
        description: "Your spot has been secured. We'll contact you soon.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Payment registration failed",
        description: "Please contact us directly.",
      });
      console.error("Error registering payment:", error);
    } finally {
      setLoading(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  const openWhatsApp = () => {
    const phoneNumber = "919618361999"; // Format: country code + number without +
    const message = "Hi Rebuild Fitness, I've completed my payment and need some help.";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  const openInstagram = () => {
    // Replace with actual Instagram URL if available
    window.open("https://www.instagram.com/rebuildfitness/", "_blank");
  };

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <div className="animate-on-scroll">
            <h3 className="text-2xl font-bold text-center mb-6 text-rebuild-purple">
              Join Our Women-only Weight Loss Program
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Full Name"
                required
                className="bg-white/70 backdrop-blur-sm"
              />
              
              <Input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone Number"
                required
                type="tel"
                className="bg-white/70 backdrop-blur-sm"
              />
              
              <Input
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Address"
                type="email"
                className="bg-white/70 backdrop-blur-sm"
              />
              
              <Input
                name="age"
                value={formData.age}
                onChange={handleChange}
                placeholder="Age"
                type="number"
                required
                min="18"
                max="100"
                className="bg-white/70 backdrop-blur-sm"
              />
              
              <Select 
                value={formData.session} 
                onValueChange={(value) => handleSelectChange(value, "session")}
                required
              >
                <SelectTrigger className="bg-white/70 backdrop-blur-sm">
                  <SelectValue placeholder="Select Preferred Session" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="9am-10am">9 AM–10 AM (Morning)</SelectItem>
                  <SelectItem value="10am-11am">10 AM–11 AM (Morning)</SelectItem>
                  <SelectItem value="4pm-5pm">4 PM–5 PM (Evening)</SelectItem>
                  <SelectItem value="5pm-6pm">5 PM–6 PM (Evening)</SelectItem>
                </SelectContent>
              </Select>
              
              <Textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Any specific requirements or questions? (Optional)"
                className="bg-white/70 backdrop-blur-sm"
              />
              
              <Button 
                type="submit" 
                className="w-full bg-rebuild-purple hover:bg-rebuild-purple/90" 
                disabled={loading}
              >
                {loading ? "Processing..." : "Submit & Proceed to Payment"}
              </Button>
            </form>
          </div>
        );
        
      case 2:
        return (
          <div className="animate-on-scroll">
            <h3 className="text-2xl font-bold mb-6 text-rebuild-purple text-center">Complete Your Payment</h3>
            <p className="mb-6 text-center">Scan the QR code to pay and secure your spot:</p>
            
            <div className="max-w-sm mx-auto mb-6">
              <UpiQRCode 
                amount={formData.price} 
                onComplete={handlePaymentComplete} 
              />
            </div>
          </div>
        );
        
      case 3:
        return (
          <div className="animate-fade-in bg-gradient-to-b from-purple-50 to-white p-6 rounded-xl shadow-sm border border-purple-100">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-rebuild-purple/10 mb-4">
                <svg className="w-8 h-8 text-rebuild-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              
              <h3 className="text-2xl font-bold mb-4 text-rebuild-purple">Congratulations!</h3>
              <p className="mb-2 text-gray-700">You've successfully joined our weight loss program.</p>
              <p className="mb-8 text-gray-700">Our team will contact you soon with more details about your first session.</p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={scrollToTop}
                  className="bg-rebuild-purple hover:bg-rebuild-purple/90 transition-all w-full flex gap-2 items-center justify-center"
                >
                  <Home size={18} /> Return to Home
                </Button>
                
                <Button
                  onClick={openWhatsApp}
                  variant="outline" 
                  className="border-rebuild-purple text-rebuild-purple hover:bg-rebuild-purple/10 w-full flex gap-2 items-center justify-center"
                >
                  <Phone size={18} /> Contact Support
                </Button>
                
                <Button
                  onClick={openInstagram}
                  variant="outline"
                  className="border-rebuild-pink text-rebuild-pink hover:bg-rebuild-pink/10 w-full flex gap-2 items-center justify-center"
                >
                  <Instagram size={18} /> Follow Us
                </Button>
              </div>
              
              <div className="mt-10">
                <Button
                  onClick={() => setStep(1)}
                  variant="ghost" 
                  className="text-gray-500 hover:text-rebuild-purple"
                >
                  Register Another Person
                </Button>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white/40 backdrop-blur-sm p-6 sm:p-8 rounded-xl shadow-xl border border-white/50">
      {renderStep()}
    </div>
  );
};

export default JoinForm;
