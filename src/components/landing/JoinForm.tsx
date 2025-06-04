import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge"; // Add missing Badge import
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
import { 
  Instagram, 
  Home, 
  Phone, 
  CheckCircle2, 
  ArrowRight,
  Camera, // Replace CameraPlus with Camera
  Loader2
} from "lucide-react";

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
  const { addBooking, getPriceConfig, validateCoupon } = useFirebase();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(false);
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  // Add service selection state
  const [selectedService, setSelectedService] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    age: "",
    session: "",
    message: "",
    price: 0,
    originalPrice: 0,
    paid: false,
    screenshotUrl: "",
    couponCode: "" // Add missing couponCode field
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string, field: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // When session changes, also update the selected service
    if (field === "session") {
      // Here you would ideally look up the service details
      // For now we'll simulate with dummy data
      const serviceMap: Record<string, any> = {
        "weight-morning": { title: "Weight Loss (Morning)", basePrice: 4000, trainer: "Revathi" },
        "strength-morning": { title: "Strength Training (Morning)", basePrice: 1800, trainer: "Revathi" },
        "weight-evening": { title: "Weight Loss (Evening)", basePrice: 4000, trainer: "Revathi" },
        "strength-evening": { title: "Strength Training (Evening)", basePrice: 1800, trainer: "Revathi" },
        "zumba-evening": { title: "Zumba (Evening)", basePrice: 2000, trainer: "Jyothi" }
      };
      
      setSelectedService(serviceMap[value] || null);
      
      // Update price in form data
      if (serviceMap[value]) {
        setFormData(prev => ({ 
          ...prev, 
          price: serviceMap[value].basePrice,
          originalPrice: serviceMap[value].basePrice
        }));
      }
    }
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
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Upload failed";
      toast({ 
        variant: "destructive", 
        title: "Upload failed",
        description: errorMessage
      });
      
      // Log error safely in production
      if (process.env.NODE_ENV === "production") {
        // errorTrackingService.logError({
        //   action: "uploadScreenshot",
        //   error: errorMessage
        // });
      }
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
    } catch (error: unknown) {
      // Improve error handling with typed error and toast
      const errorMessage = error instanceof Error 
        ? error.message 
        : "An unexpected error occurred";
      
      toast({
        variant: "destructive",
        title: "Form submission failed",
        description: errorMessage
      });
      
      // For monitoring, log the error to a service in production 
      if (process.env.NODE_ENV === "production") {
        // errorLoggingService.logError(error);
      } 
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
        screenshotUrl: formData.screenshotUrl
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
      // Handle error silently instead of console.error
      if (process.env.NODE_ENV === "production") {
        // errorLogService.log("Error registering payment", error);
      }
    } finally {
      setLoading(false);
    }
  };

  const applyCouponCode = async () => {
    if (!couponCode.trim()) {
      toast({
        variant: "destructive",
        title: "Missing coupon code",
        description: "Please enter a coupon code to apply."
      });
      return;
    }

    setApplyingCoupon(true);
    
    try {
      // Validate coupon with Firebase - make sure to pass the serviceId parameter
      const serviceId = formData.session; // This should be the service ID
      if (!serviceId) {
        toast({
          variant: "destructive", 
          title: "Service required",
          description: "Please select a service before applying a coupon."
        });
        return;
      }
      
      const result = await validateCoupon(couponCode.trim(), serviceId);
      
      if (result.valid) {
        // Apply the fixed discounted price returned by validateCoupon
        // Use formData.price for originalPrice since it's not in the result
        const originalPrice = selectedService?.basePrice || formData.price;
        
        setFormData(prev => ({
          ...prev,
          price: result.discountedPrice,
          originalPrice: originalPrice,
          couponApplied: true,
          couponCode: couponCode.trim().toUpperCase()
        }));
        
        // Calculate the savings amount
        const savingsAmount = originalPrice - result.discountedPrice;
        
        toast({
          title: "Coupon applied",
          description: `You saved ₹${savingsAmount} with coupon ${couponCode.trim().toUpperCase()}`
        });
        
        setCouponApplied(true);
        setCouponCode(couponCode.trim().toUpperCase());
      } else {
        toast({
          variant: "destructive",
          title: "Invalid coupon",
          description: result.message || "This coupon code is invalid or has expired."
        });
      }
    } catch (error) {
      // Silent error handling - log to monitoring service in production
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to apply coupon. Please try again."
      });
    } finally {
      setApplyingCoupon(false);
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

  useEffect(() => {
    if (formData.session) {
      // Reset coupon state when service changes
      setCouponApplied(false);
      setCouponCode("");
      
      // Update the form data with the selected service info
      setFormData(prev => ({
        ...prev,
        service: formData.session,
        price: formData.price, // Default to base price until coupon is applied
        originalPrice: formData.price
      }));
    }
  }, [formData.session]);

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
                  <SelectItem value="weight-morning">6:00 AM - 10:00 AM (Weight Loss)</SelectItem>
                  <SelectItem value="strength-morning">5:30 AM - 10:30 AM (Strength)</SelectItem>
                  
                  {/* Evening slots */}
                  <SelectItem value="weight-evening">4:00 PM - 8:00 PM (Weight Loss)</SelectItem>
                  <SelectItem value="strength-evening">5:00 PM - 9:00 PM (Strength)</SelectItem>
                  <SelectItem value="zumba-evening">4:00 PM - 8:00 PM (Zumba)</SelectItem>
                </SelectContent>
              </Select>
              
              <Textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Additional Information (optional)"
                className="bg-gym-gray-dark text-white border-gym-gray-light focus:border-gym-yellow focus:ring-gym-yellow/50"
              />
              
              {/* Price display with coupon applied status */}
              <div className="py-4 px-6 bg-gym-gray rounded-lg mb-6">
                <h3 className="font-medium text-white mb-2">Selected Plan</h3>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gym-yellow font-medium text-lg">{selectedService?.title || "No plan selected"}</p>
                    <p className="text-sm text-white/70">Trainer: {selectedService?.trainer}</p>
                  </div>
                  <div className="text-right">
                    {couponApplied ? (
                      <>
                        <p className="text-sm text-white/60 line-through">₹{selectedService?.basePrice}</p>
                        <p className="text-lg font-bold text-gym-yellow">₹{formData.price}</p>
                        <Badge variant="outline" className="mt-1 text-xs border-gym-yellow text-gym-yellow">
                          Coupon Applied: {formData.couponCode}
                        </Badge>
                      </>
                    ) : (
                      <p className="text-xl font-bold text-gym-yellow">₹{selectedService?.basePrice}</p>
                    )}
                  </div>
                </div>
              </div>
              
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gym-yellow text-gym-black hover:bg-gym-yellow/90 transition-all py-4 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <Loader2 className="animate-spin h-5 w-5" />
                ) : (
                  <ArrowRight className="h-5 w-5" />
                )}
                <span>{loading ? "Submitting..." : "Continue to Payment"}</span>
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
            {/* Payment instructions */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-4">Complete Your Payment</h2>
              <p className="text-white/80 mb-2">
                Please complete the payment using the details below:
              </p>
              <div className="bg-gym-gray-dark p-4 rounded-lg shadow-md">
                <p className="text-gym-yellow font-medium">Rebuild Fitness</p>
                <p className="text-white/70">Account Number: 1234567890</p>
                <p className="text-white/70">IFSC Code: REB0000123</p>
                <p className="text-white/70">UPI ID: rebuild@upi</p>
              </div>
            </div>
            
            {/* UPI QR Code */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-2">Or Pay via UPI QR Code</h3>
              <div className="flex justify-center">
                <UpiQRCode 
                  amount={formData.price}
                  paymentDescription="Rebuild Fitness Membership" 
                  onComplete={() => {}}  
                />
              </div>
            </div>
            
            {/* Screenshot upload section */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-2">Upload Payment Screenshot</h3>
              <p className="text-white/70 text-sm mb-4">
                Please upload the screenshot of your payment confirmation.
              </p>
              <input
                type="file"
                id="screenshot-upload"
                className="hidden"
                onChange={handleScreenshotUpload}
                accept="image/*"
              />
              <label htmlFor="screenshot-upload">
                <Button
                  variant="outline"
                  asChild
                  className="w-full flex items-center justify-center gap-2 border-gym-yellow text-gym-yellow hover:bg-gym-yellow/10 py-4"
                >
                  {loading ? (
                    <Loader2 className="animate-spin h-5 w-5" />
                  ) : (
                    <Camera size={18} />
                  )}
                  <span>{loading ? "Uploading..." : "Upload Screenshot"}</span>
                </Button>
              </label>
              
              {formData.screenshotUrl && (
                <div className="mt-4">
                  <p className="text-white/70 text-sm mb-2">Uploaded Screenshot:</p>
                  <img 
                    src={formData.screenshotUrl} 
                    alt="Payment Screenshot" 
                    className="w-full h-auto rounded-lg shadow-md"
                    loading="lazy"
                    width="400"
                    height="300"
                  />
                </div>
              )}
            </div>
            
            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                variant="ghost"
                onClick={() => setStep(1)}
                className="w-full sm:w-auto text-gray-500 hover:text-rebuild-purple"
              >
                &larr; Back to Info
              </Button>
              
              <Button
                onClick={handlePaymentComplete}
                disabled={loading || !formData.screenshotUrl}
                className="w-full sm:w-auto bg-gym-yellow text-gym-black hover:bg-gym-yellow/90 transition-all py-4 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <Loader2 className="animate-spin h-5 w-5" />
                ) : (
                  <CheckCircle2 className="h-5 w-5" />
                )}
                <span>{loading ? "Processing..." : "Confirm Payment"}</span>
              </Button>
            </div>
            
            {formData.screenshotUrl && (
              <Button 
                className="mt-4 w-full" 
                variant="outline" 
                onClick={() => {
                  const wa = `https://wa.me/919618361999?text=${encodeURIComponent(
                    "Here is my payment screenshot: " + formData.screenshotUrl
                  )}`;
                  window.open(wa, "_blank");
                }}
              >
                Share on WhatsApp
              </Button>
            )}
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
            {/* Checkmark animation */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="flex justify-center mb-6"
            >
              <CheckCircle2 className="h-10 w-10 text-white" />
            </motion.div>

            {/* Headline */}
            <h3 className="text-center text-3xl font-bold text-rebuild-purple mb-4">
              Congratulations!
            </h3>

            {/* Messages */}
            <div className="space-y-2 text-center text-gray-700 mb-8">
              <p>You've successfully joined our fitness program.</p>
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
