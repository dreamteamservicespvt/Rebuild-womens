import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
import { Instagram, Home, Phone, CheckCircle2, ArrowRight } from "lucide-react";

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  },
  exit: { 
    opacity: 0, 
    y: -20,
    transition: { duration: 0.4 }
  }
};

// Progress indicator steps
const steps = [
  { name: "Your Info", number: 1 },
  { name: "Payment", number: 2 },
  { name: "Complete", number: 3 }
];

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
    paid: false,
    screenshotUrl: ""    // <— add
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string, field: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleScreenshotUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    setLoading(true);
    const file = e.target.files[0];
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "rebuild womens");
    try {
      const res = await fetch("https://api.cloudinary.com/v1_1/dvmrhs2ek/upload", {
        method: "POST", body: data
      });
      const json = await res.json();
      setFormData(prev => ({ ...prev, screenshotUrl: json.secure_url }));
      toast({ title: "Uploaded!", description: "Screenshot saved." });
    } catch {
      toast({ variant: "destructive", title: "Upload failed" });
    } finally {
      setLoading(false);
    }
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
        screenshotUrl: formData.screenshotUrl   // <— include
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

  // Progress indicator
  const ProgressBar = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((s, i) => (
          <div key={s.name} className="flex flex-col items-center">
            <div 
              className={`h-10 w-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                step >= s.number 
                  ? 'bg-gym-yellow text-gym-black border-gym-yellow' 
                  : 'bg-gym-gray-dark text-white/70 border-gym-gray-light'
              }`}
            >
              {step > s.number ? (
                <CheckCircle2 className="h-5 w-5" />
              ) : (
                <span>{s.number}</span>
              )}
            </div>
            <span className={`text-xs mt-1.5 ${
              step >= s.number ? 'text-gym-yellow font-medium' : 'text-white/70'
            }`}>
              {s.name}
            </span>
          </div>
        ))}
      </div>
      <div className="relative mt-4">
        <div className="absolute inset-0 flex items-center">
          <div className="h-1 w-full bg-gym-gray-light rounded"></div>
        </div>
        <div className="relative flex justify-between">
          <div 
            className="h-1 bg-gym-yellow rounded transition-all duration-700 ease-in-out shadow-[0_0_5px_rgba(255,243,24,0.7)]" 
            style={{ 
              width: step === 1 ? '0%' : step === 2 ? '50%' : '100%',
              position: 'absolute',
              left: 0,
              top: 0
            }}
          ></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-md mx-auto p-6 sm:p-8">
      <ProgressBar />
      
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
           
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Full Name"
                required
                className="bg-gym-gray-dark text-white border-gym-gray-light focus:border-gym-yellow focus:ring-gym-yellow/50"
              />
              
              <Input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone Number"
                required
                type="tel"
                className="bg-gym-gray-dark text-white border-gym-gray-light focus:border-gym-yellow focus:ring-gym-yellow/50"
              />
              
              <Input
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Address"
                type="email"
                className="bg-gym-gray-dark text-white border-gym-gray-light focus:border-gym-yellow focus:ring-gym-yellow/50"
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
                className="bg-gym-gray-dark text-white border-gym-gray-light focus:border-gym-yellow focus:ring-gym-yellow/50"
              />
              
              <Select 
                value={formData.session} 
                onValueChange={(value) => handleSelectChange(value, "session")}
                required
              >
                <SelectTrigger className="bg-gym-gray-dark text-white border-gym-gray-light focus:border-gym-yellow focus:ring-gym-yellow/50">
                  <SelectValue placeholder="Select Preferred Session" />
                </SelectTrigger>
                <SelectContent>
                  {/* Morning slots */}
                  <SelectItem value="morning-1">8:00 AM - 9:00 AM (Morning)</SelectItem>
                  <SelectItem value="morning-2">9:00 AM - 10:10 AM (Morning)</SelectItem>
                  
                  {/* Evening slots */}
                  <SelectItem value="evening-1">3:00 PM - 4:00 PM (Evening)</SelectItem>
                  <SelectItem value="evening-2">4:00 PM - 5:00 PM (Evening)</SelectItem>
                </SelectContent>
              </Select>
              
              <Textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Any specific requirements or questions? (Optional)"
                className="bg-gym-gray-dark text-white border-gym-gray-light focus:border-gym-yellow focus:ring-gym-yellow/50"
              />
              
              <Button 
                type="submit" 
                className="w-full bg-gym-yellow text-gym-black hover:bg-gym-yellow/90 group" 
                disabled={loading}
              >
                {loading ? "Processing..." : (
                  <>
                    Submit & Proceed to Payment
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </Button>
            </form>
          </motion.div>
        )}
        
        {step === 2 && (
          <motion.div
            key="step2"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <h3 className="text-2xl font-bold mb-6 text-gym-yellow text-center">Complete Your Payment</h3>
            <p className="mb-6 text-center">Scan the QR code to pay and secure your spot:</p>
            
            <div className="max-w-sm mx-auto mb-6">
              <UpiQRCode 
                amount={formData.price} 
                onComplete={handlePaymentComplete} 
              />
            </div>

            {/* Upload screenshot + share */}
            <div className="space-y-4 mb-6">
              <label className="block text-center font-medium">Upload Payment Screenshot</label>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleScreenshotUpload}
                className="block mx-auto"
              />
              {formData.screenshotUrl && (
                <img src={formData.screenshotUrl} alt="Screenshot" className="mx-auto w-40 h-auto rounded-md" />
              )}
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  const wa = `https://wa.me/919618361999?text=${encodeURIComponent(
                    "Here is my payment screenshot: " + formData.screenshotUrl
                  )}`;
                  window.open(wa, "_blank");
                }}
              >
                Share on WhatsApp
              </Button>
            </div>
          </motion.div>
        )}
        
        {step === 3 && (
          <motion.div
            key="step3"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-xl border border-white/50"
          >
            {/* Success Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 120, damping: 8, delay: 0.2 }}
              className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-rebuild-purple to-rebuild-pink shadow-lg mb-6"
            >
              <CheckCircle2 className="h-10 w-10 text-white" />
            </motion.div>

            {/* Headline */}
            <h3 className="text-center text-3xl font-bold text-rebuild-purple mb-4">
              Congratulations!
            </h3>

            {/* Messages */}
            <div className="space-y-2 text-center text-gray-700 mb-8">
              <p>You've successfully joined our weight loss program.</p>
              <p>Our team will contact you soon with more details about your first session.</p>
            </div>

            {/* Action Buttons - Vertical Stack on Mobile, Horizontal on Desktop */}
            <div className="flex flex-col space-y-3 mb-6">
              <Button
                onClick={scrollToTop}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-rebuild-purple to-rebuild-pink hover:opacity-90 transition-all py-6"
              >
                <Home size={18} />
                <span>Return to Home</span>
              </Button>
              
              <Button
                onClick={openWhatsApp}
                variant="outline"
                className="w-full flex items-center justify-center gap-2 border-rebuild-purple text-rebuild-purple hover:bg-rebuild-purple/5 py-6"
              >
                <Phone size={18} />
                <span>Contact Support</span>
              </Button>
              
              <Button
                onClick={openInstagram}
                variant="outline"
                className="w-full flex items-center justify-center gap-2 border-rebuild-pink text-rebuild-pink hover:bg-rebuild-pink/5 py-6"
              >
                <Instagram size={18} />
                <span>Follow Us</span>
              </Button>
            </div>

            {/* Register another link */}
            <div className="text-center">
              <Button
                variant="ghost"
                onClick={() => setStep(1)}
                className="text-gray-500 hover:text-rebuild-purple"
              >
                Register Another Person
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default JoinForm;
