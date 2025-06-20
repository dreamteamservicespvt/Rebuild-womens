import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import SectionTitle from "@/components/SectionTitle";
import { useToast } from "@/hooks/use-toast";
import { useFirebase } from "@/contexts/FirebaseContext";
import UPIQRCode from "@/components/UpiQRCode";
import { CheckCircle } from "lucide-react"; // Import for step indicator

interface Service {
  id: string;
  title: string;
  basePrice: number;
  discountedPrice: number;
  trainer: string;
  timings?: string; // Optional timings field
}

const JoinFormSection = () => {
  const { toast } = useToast();
  // Add missing Firebase context functions
  const { getServices, validateCoupon, submitBooking } = useFirebase();
  
  // Add step state for the multi-step process
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  
  // Coupon states
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponValid, setCouponValid] = useState(false);
  const [couponLoading, setCouponLoading] = useState(false);
  const [finalPrice, setFinalPrice] = useState<number | null>(null);
  
  // Add state to track original price
  const [originalPrice, setOriginalPrice] = useState<number | null>(null);
  
  // Add screenshot handling state
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [uploadingScreenshot, setUploadingScreenshot] = useState(false);
  const [screenshotUrl, setScreenshotUrl] = useState("");
  
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState("");

  // Add fallback services with accurate pricing and timing
  const fallbackServices: Service[] = [
    {
      id: "strength",
      title: "Strength Training",
      basePrice: 1800,
      discountedPrice: 1500,  // This is now the fixed coupon price
      trainer: "Revathi",
      timings: "5:30AM to 10:30AM, 4:00PM to 8:00PM"
    },
    {
      id: "weight-loss",
      title: "Weight Loss Program",
      basePrice: 4000,
      discountedPrice: 3000,  // This is now the fixed coupon price
      trainer: "Revathi",
      timings: "6:00AM to 10:00AM, 4:00PM to 8:00PM"
    },
    {
      id: "zumba",
      title: "Zumba",
      basePrice: 2000,
      discountedPrice: 1500,  // This is now the fixed coupon price
      trainer: "Jyothi",
      timings: "4:00PM to 8:00PM"
    }
  ];

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const servicesData = await getServices();
        if (servicesData && servicesData.length > 0) {
          setServices(servicesData);
        } else {
          setServices(fallbackServices);
        }
      } catch (error) {
        setServices(fallbackServices);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load services from server. Using default options.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [getServices, toast]);

  const handleServiceChange = (value: string) => {
    setServiceId(value);
    const service = services.find(s => s.id === value) || null;
    setSelectedService(service);
    
    // Reset coupon state when service changes
    setCouponCode("");
    setCouponApplied(false);
    setCouponValid(false);
    
    // Set initial price based on service - use base price, not discounted
    if (service) {
      setFinalPrice(service.basePrice); // Use base price initially
      setOriginalPrice(service.basePrice);
    } else {
      setFinalPrice(null);
      setOriginalPrice(null);
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a coupon code.",
      });
      return;
    }
    
    if (!serviceId) {
      return;
    }
    
    setCouponLoading(true);
    
    try {
      // Apply uppercase and trim the coupon code
      const formattedCode = couponCode.trim().toUpperCase();
      
      const result = await validateCoupon(formattedCode, serviceId);
      
      setCouponApplied(true);
      
      if (result.valid) {
        setCouponValid(true);
        
        // Ensure we're setting the fixed discounted price returned from the validateCoupon function
        setFinalPrice(result.discountedPrice);
        
        // Calculate savings amount
        const savingsAmount = selectedService ? (selectedService.basePrice - result.discountedPrice) : 0;
        
        toast({
          title: "Coupon Applied Successfully!",
          description: `You saved ₹${savingsAmount} with coupon ${formattedCode}`
        });
      } else {
        setCouponValid(false);
        
        // Reset price to base price
        if (selectedService) {
          setFinalPrice(selectedService.basePrice);
        }
        
        toast({
          variant: "destructive",
          title: "Invalid Coupon",
          description: result.message || "This coupon code is invalid or has expired.",
        });
      }
    } catch (error) {
      // Silent error handling - log to monitoring service in production
      setCouponApplied(false);
      setCouponValid(false);
      
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to validate coupon. Please try again.",
      });
    } finally {
      setCouponLoading(false);
    }
  };

  // Step 1: Handle form submission to move to payment step
  const handleFirstStepSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !phone || !serviceId || !selectedService) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please fill all required fields.",
      });
      return;
    }
    
    // Move to step 2 (Payment)
    setCurrentStep(2);
    
    // Scroll to top of the form for better UX
    const formElement = document.getElementById('join-form-container');
    if (formElement) {
      formElement?.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  // Step 2: Handle screenshot upload
  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setScreenshotFile(e.target.files[0]);
    }
  };
  
  const handleUploadScreenshot = async () => {
    if (!screenshotFile) {
      toast({
        variant: "destructive",
        title: "No file selected",
        description: "Please select a screenshot to upload.",
      });
      return;
    }
    
    setUploadingScreenshot(true);
    
    try {
      // Create FormData for upload
      const formData = new FormData();
      formData.append("file", screenshotFile);
      formData.append("upload_preset", "rebuild womens"); // Corrected to match JoinForm.tsx
      
      // Upload to Cloudinary with your actual cloud name
      const uploadResponse = await fetch("https://api.cloudinary.com/v1_1/dvmrhs2ek/upload", {
        method: "POST",
        body: formData
      });
      
      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json();
        console.error("Cloudinary API error:", errorData);
        throw new Error(`Upload failed: ${errorData.error?.message || 'Unknown error'}`);
      }
      
      const uploadData = await uploadResponse.json();
      
      if (uploadData.secure_url) {
        setScreenshotUrl(uploadData.secure_url);
        toast({
          title: "Screenshot uploaded",
          description: "Your payment screenshot has been uploaded successfully.",
        });
      } else {
        throw new Error("Failed to get upload URL");
      }
    } catch (error) {
      console.error("Error uploading screenshot:", error);
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: "Failed to upload screenshot. Please try again.",
      });
    } finally {
      setUploadingScreenshot(false);
    }
  };
  
  // Step 2: Handle payment completion to move to confirmation step
  const handlePaymentComplete = async () => {
    if (!selectedService) return;
    
    // Don't allow completion without screenshot
    if (!screenshotUrl) {
      toast({
        variant: "destructive",
        title: "Screenshot required",
        description: "Please upload your payment screenshot before completing registration.",
      });
      return;
    }
    
    setSubmitting(true);
    
    try {
      // Calculate final amount based on whether a coupon was applied
      const finalAmount = couponValid ? finalPrice! : selectedService.basePrice;
      
      const bookingData = {
        name,
        phone,
        email,
        message,
        serviceId,
        serviceName: selectedService.title,
        couponCode: couponValid ? couponCode.toUpperCase() : "",
        amount: finalAmount, 
        originalAmount: selectedService.basePrice,
        timestamp: new Date().toISOString(),
        trainer: selectedService.trainer || "",
        paymentStatus: 'completed', // Changed from status: 'pending' to paymentStatus: 'completed'
        screenshotUrl: screenshotUrl // Include the screenshot URL
      };
      
      await submitBooking(bookingData);
      
      // Show confirmation message with appropriate pricing
      const discountAmount = couponValid ? 
        (selectedService.basePrice - finalAmount) : 0;
        
      const confirmMsg = `My name is ${name} and I'm paying ₹${finalAmount} to Rebuild Women.${
        couponValid ? ` Coupon ${couponCode.toUpperCase()} applied, saving ₹${discountAmount}.` : ""
      }`;
      
      setConfirmationMessage(confirmMsg);
      setCurrentStep(3); // Move to step 3 (Confirmation)
      
      // Scroll to the confirmation header after step change
      setTimeout(() => {
        const confirmationHeader = document.getElementById('confirmation-success-header');
        if (confirmationHeader) {
          confirmationHeader.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          // Fallback to form container if specific element isn't found
          const formElement = document.getElementById('join-form-container');
          if (formElement) {
            formElement.scrollIntoView({ behavior: 'smooth' });
          }
        }
      }, 100); // Small delay to ensure the DOM is updated
      
      toast({
        title: "Registration successful!",
        description: "Your booking has been submitted.",
      });
    } catch (error) {
      console.error("Error submitting booking:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to submit your booking. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };
  
  // Reset form and start over
  const handleStartOver = () => {
    setName("");
    setPhone("");
    setEmail("");
    setMessage("");
    setServiceId("");
    setSelectedService(null);
    setCouponCode("");
    setCouponApplied(false);
    setCouponValid(false);
    setFinalPrice(null);
    setOriginalPrice(null);
    setScreenshotFile(null);
    setScreenshotUrl("");
    setCurrentStep(1);
  };
  
  // Progress steps display
  const StepIndicator = () => (
    <div className="flex justify-between mb-8 relative">
      {/* Progress bar */}
      <div className="absolute top-1/2 left-0 right-0 h-1 bg-gym-gray transform -translate-y-1/2 z-0"></div>
      <div 
        className="absolute top-1/2 left-0 h-1 bg-gym-yellow transform -translate-y-1/2 z-0 transition-all duration-500"
        style={{ width: currentStep === 1 ? "0%" : currentStep === 2 ? "50%" : "100%" }}
      ></div>
      
      {/* Step dots */}
      <div className="z-10 flex flex-col items-center">
        <div className={`h-8 w-8 rounded-full flex items-center justify-center border-2 ${
          currentStep >= 1 ? "bg-gym-yellow border-gym-yellow text-black" : "bg-gym-gray-dark border-gym-gray-light text-white/70"
        }`}>
          {currentStep > 1 ? <CheckCircle className="h-5 w-5" /> : "1"}
        </div>
        <span className={`text-xs mt-2 ${currentStep >= 1 ? "text-gym-yellow" : "text-white/70"}`}>Information</span>
      </div>
      
      <div className="z-10 flex flex-col items-center">
        <div className={`h-8 w-8 rounded-full flex items-center justify-center border-2 ${
          currentStep >= 2 ? "bg-gym-yellow border-gym-yellow text-black" : "bg-gym-gray-dark border-gym-gray-light text-white/70"
        }`}>
          {currentStep > 2 ? <CheckCircle className="h-5 w-5" /> : "2"}
        </div>
        <span className={`text-xs mt-2 ${currentStep >= 2 ? "text-gym-yellow" : "text-white/70"}`}>Payment</span>
      </div>
      
      <div className="z-10 flex flex-col items-center">
        <div className={`h-8 w-8 rounded-full flex items-center justify-center border-2 ${
          currentStep >= 3 ? "bg-gym-yellow border-gym-yellow text-black" : "bg-gym-gray-dark border-gym-gray-light text-white/70"
        }`}>
          {currentStep > 3 ? <CheckCircle className="h-5 w-5" /> : "3"}
        </div>
        <span className={`text-xs mt-2 ${currentStep >= 3 ? "text-gym-yellow" : "text-white/70"}`}>Confirmation</span>
      </div>
    </div>
  );

  return (
    <section id="join" className="section relative bg-gym-black py-24">
      {/* Decorative elements */}
      <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-gym-yellow/5 to-transparent"></div>
      <div className="absolute -top-12 -right-12 w-64 h-64 bg-gym-yellow/5 rounded-full opacity-20 blur-3xl"></div>
      <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-gym-yellow/5 rounded-full opacity-20 blur-3xl"></div>
      
      <div className="container-custom relative z-10">
        <SectionTitle 
          title="Join Rebuild Women" 
          subtitle="Take the first step towards a stronger you"
          className="text-white"
        />
        
        <div id="join-form-container" className="max-w-4xl mx-auto mt-12">
          {/* Progress indicator */}
          <StepIndicator />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left side: Form/Content based on current step */}
            <div className="bg-gym-gray-dark rounded-xl overflow-hidden border border-gym-gray-light shadow-lg p-8">
              {currentStep === 1 && (
                <>
                  <h3 className="text-xl font-bold text-white mb-6">Registration Form</h3>
                  
                  <form onSubmit={handleFirstStepSubmit} className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name" className="text-white">Full Name *</Label>
                        <Input
                          id="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Enter your full name"
                          className="bg-gym-gray border-gym-gray-light text-white placeholder:text-white/50 focus:bg-gym-gray hover:bg-gym-gray focus:border-gym-yellow focus-visible:ring-0 focus-visible:ring-offset-0 autofill:bg-gym-gray"
                          style={{ WebkitTextFillColor: 'white', WebkitBoxShadow: '0 0 0px 1000px #1a1a1a inset' }}
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="phone" className="text-white">Phone Number *</Label>
                        <Input
                          id="phone"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="Enter your phone number"
                          className="bg-gym-gray border-gym-gray-light text-white placeholder:text-white/50 focus:bg-gym-gray hover:bg-gym-gray focus:border-gym-yellow focus-visible:ring-0 focus-visible:ring-offset-0 autofill:bg-gym-gray"
                          style={{ WebkitTextFillColor: 'white', WebkitBoxShadow: '0 0 0px 1000px #1a1a1a inset' }}
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="email" className="text-white">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter your email address"
                          className="bg-gym-gray border-gym-gray-light text-white placeholder:text-white/50 focus:bg-gym-gray hover:bg-gym-gray focus:border-gym-yellow focus-visible:ring-0 focus-visible:ring-offset-0 autofill:bg-gym-gray"
                          style={{ WebkitTextFillColor: 'white', WebkitBoxShadow: '0 0 0px 1000px #1a1a1a inset' }}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="service" className="text-white">Select Service *</Label>
                        <Select value={serviceId} onValueChange={handleServiceChange}>
                          <SelectTrigger id="service" className="bg-gym-gray border-gym-gray-light text-white h-10">
                            <SelectValue placeholder="Select a service" />
                          </SelectTrigger>
                          <SelectContent className="bg-gym-gray border-gym-gray-light z-50">
                            {services.map((service) => (
                              <SelectItem 
                                key={service.id} 
                                value={service.id}
                                className="text-white hover:bg-gym-gray-light focus:bg-gym-gray-light focus:text-white"
                              >
                                {service.title} - ₹{service.basePrice}
                              </SelectItem>
                            ))}
                            {services.length === 0 && !loading && (
                              <div className="p-2 text-center text-white/70">No services available</div>
                            )}
                            {loading && (
                              <div className="p-2 text-center text-white/70">Loading services...</div>
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {/* Coupon code section */}
                      {selectedService && (
                        <div className="space-y-2">
                          <div className="bg-gym-yellow/5 border border-gym-yellow/20 rounded-md p-4">
                            <h4 className="text-gym-yellow font-bold mb-2 flex items-center">
                              <span className="mr-1">🏷️</span> Have a Coupon Code?
                            </h4>
                            
                            <div className="flex gap-2 mb-2">
                              <div className="flex-grow">
                                <Input
                                  id="coupon"
                                  value={couponCode}
                                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                  placeholder="Enter your coupon code"
                                  className="bg-gym-gray border-gym-yellow/30 text-white uppercase placeholder:text-white/50 focus:bg-gym-gray hover:bg-gym-gray focus:border-gym-yellow focus-visible:ring-0 focus-visible:ring-offset-0 autofill:bg-gym-gray"
                                  style={{ WebkitTextFillColor: 'white', WebkitBoxShadow: '0 0 0px 1000px #1a1a1a inset' }}
                                  disabled={couponApplied || couponLoading}
                                />
                              </div>
                              <div>
                                <Button 
                                  type="button" 
                                  onClick={handleApplyCoupon}
                                  variant="outline"
                                  className="border-gym-yellow text-gym-yellow hover:bg-gym-yellow/20 h-10"
                                  disabled={!couponCode || couponApplied || couponLoading}
                                >
                                  {couponLoading ? "Validating..." : "Apply"}
                                </Button>
                              </div>
                            </div>
                            
                            {couponApplied && (
                              <div className={`text-sm p-3 rounded-md ${couponValid ? 'bg-green-950/20 text-green-400 border border-green-900/30' : 'bg-red-950/20 text-red-400 border border-red-900/30'}`}>
                                {couponValid 
                                  ? (
                                    <>
                                      <div className="flex items-center gap-2">
                                        <div className="bg-green-900/50 h-5 w-5 rounded-full flex items-center justify-center">✓</div>
                                        <div className="font-semibold">Coupon applied successfully!</div>
                                      </div>
                                      <div className="mt-1">You saved ₹{selectedService.basePrice - (finalPrice || 0)} with this coupon.</div>
                                    </>
                                  ) 
                                  : (
                                    <>
                                      <div className="flex items-center gap-2">
                                        <div className="bg-red-900/50 h-5 w-5 rounded-full flex items-center justify-center">✕</div>
                                        <div className="font-semibold">Invalid coupon code</div>
                                      </div>
                                      <div className="mt-1">This coupon might be expired or not applicable to your selection.</div>
                                    </>
                                  )}
                              </div>
                            )}
                            
                            {/* Try again button when coupon is invalid */}
                            {couponApplied && !couponValid && (
                              <Button 
                                type="button" 
                                variant="ghost" 
                                onClick={() => {
                                  setCouponApplied(false);
                                  setCouponCode("");
                                }}
                                className="mt-2 text-white/70 text-sm hover:text-white w-full"
                                size="sm"
                              >
                                Try a different code
                              </Button>
                            )}
                          </div>
                        </div>
                      )}
                      
                      <div>
                        <Label htmlFor="message" className="text-white">Additional Information</Label>
                        <Textarea
                          id="message"
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="Any specific requirements or questions?"
                          className="bg-gym-gray border-gym-gray-light text-white placeholder:text-white/50 focus:bg-gym-gray hover:bg-gym-gray min-h-[100px] focus:border-gym-yellow focus-visible:ring-0 focus-visible:ring-offset-0"
                          style={{ WebkitTextFillColor: 'white', WebkitBoxShadow: '0 0 0px 1000px #1a1a1a inset' }}
                        />
                      </div>
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-gym-yellow text-black hover:bg-gym-yellow/90"
                      disabled={submitting || loading}
                    >
                      Continue to Payment
                    </Button>
                  </form>
                </>
              )}
              
              {currentStep === 2 && (
                <>
                  <h3 className="text-xl font-bold text-white mb-6">Complete Your Payment</h3>
                  
                  <div className="space-y-6">
                    {/* QR Code component with enhanced UPI payment description */}
                    <div className="bg-white p-6 rounded-lg">
                      <UPIQRCode 
                        amount={couponValid ? (finalPrice || 0) : (selectedService?.basePrice || 0)}
                        userName={name}
                        serviceName={selectedService?.title || "Fitness Program"}
                        originalPrice={selectedService?.basePrice || 0}
                        couponCode={couponValid ? couponCode.toUpperCase() : undefined}
                        paymentDescription={`Payment for ${selectedService?.title || "Fitness Program"} at Rebuild Women`}
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <Label className="text-white font-medium" htmlFor="screenshot">Upload Payment Screenshot</Label>
                      
                      {/* Enhanced file input with better visibility */}
                      <div className="relative group">
                        <Input
                          id="screenshot"
                          type="file"
                          accept="image/*"
                          onChange={handleScreenshotChange}
                          className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
                        />
                        <div className="flex items-center w-full overflow-hidden rounded-md border border-gym-yellow/40 bg-gym-gray-dark hover:bg-gym-gray hover:border-gym-yellow group-hover:shadow-[0_0_8px_rgba(255,243,24,0.2)] transition-all duration-300">
                          <div className="bg-gym-yellow text-black py-2.5 px-4">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                            </svg>
                          </div>
                          <div className="px-4 py-2 text-white/90 truncate">
                            {screenshotFile ? screenshotFile.name : "Choose screenshot file..."}
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-white/60 text-xs">Accepted formats: JPG, PNG, HEIC</p>
                      
                      {screenshotFile && !screenshotUrl && (
                        <Button
                          onClick={handleUploadScreenshot}
                          className="w-full bg-gym-yellow text-black hover:bg-gym-yellow/90 mt-2"
                          disabled={uploadingScreenshot}
                        >
                          {uploadingScreenshot ? "Uploading..." : "Upload Screenshot"}
                        </Button>
                      )}
                      
                      {screenshotUrl && (
                        <div className="mt-4 p-4 bg-gym-gray rounded-md">
                          <p className="text-gym-yellow text-sm mb-2">Screenshot uploaded successfully!</p>
                          <div className="aspect-video rounded-md overflow-hidden bg-black/40">
                            <img 
                              src={screenshotUrl} 
                              alt="Payment screenshot" 
                              loading="lazy"
                              width="400"
                              height="300"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-4">
                      <Button
                        variant="outline"
                        onClick={() => setCurrentStep(1)}
                        className="flex-1 border-white/30 text-white hover:bg-white/10"
                      >
                        Back
                      </Button>
                      
                      <Button
                        onClick={handlePaymentComplete}
                        className="flex-1 bg-gym-yellow text-black hover:bg-gym-yellow/90"
                        disabled={!screenshotUrl || submitting}
                      >
                        {submitting ? "Processing..." : "Complete Registration"}
                      </Button>
                    </div>
                    
                    <p className="text-white/60 text-sm text-center">
                      Please complete the payment using UPI and upload a screenshot to confirm your registration.
                    </p>
                  </div>
                </>
              )}
              
              {currentStep === 3 && (
                <div className="py-8">
                  {/* Success animation - Added ID for scrolling target */}
                  <div id="confirmation-success-header" className="flex flex-col items-center mb-8">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gym-yellow/20 rounded-full blur-md animate-pulse"></div>
                      <div className="bg-gym-yellow/30 w-24 h-24 rounded-full flex items-center justify-center relative z-10">
                        <CheckCircle className="text-gym-yellow w-12 h-12" strokeWidth={2.5} />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-gym-yellow mt-6 mb-1">You're All Set!</h3>
                    <p className="text-white/80 text-sm max-w-md mx-auto">Your journey to a stronger you starts now</p>
                  </div>
                  
                  {/* Booking summary card */}
                  <div className="bg-gym-gray rounded-lg border border-gym-gray-light p-5 mb-6">
                    <h4 className="text-white text-lg font-semibold mb-3 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-gym-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
                      </svg>
                      Booking Details
                    </h4>
                    
                    <div className="space-y-2 text-white/80 text-sm">
                      <div className="flex justify-between items-center pb-2 border-b border-gym-gray-light">
                        <span>Name:</span>
                        <span className="font-medium text-white">{name}</span>
                      </div>
                      
                      {selectedService && (
                        <>
                          <div className="flex justify-between items-center pb-2 border-b border-gym-gray-light">
                            <span>Program:</span>
                            <span className="font-medium text-white">{selectedService.title}</span>
                          </div>
                          
                          <div className="flex justify-between items-center pb-2 border-b border-gym-gray-light">
                            <span>Amount Paid:</span>
                            <div className="text-right">
                              <span className="font-bold text-gym-yellow">₹{couponValid ? finalPrice : selectedService.basePrice}</span>
                              {couponValid && (
                                <div className="text-xs text-gym-yellow/70">
                                  Coupon {couponCode} applied (₹{selectedService.basePrice - (finalPrice || 0)} saved)
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center pb-2 border-b border-gym-gray-light">
                            <span>Trainer:</span>
                            <span className="font-medium text-white">{selectedService.trainer}</span>
                          </div>
                        </>
                      )}
                      
                      <div className="flex justify-between items-center">
                        <span>Booking ID:</span>
                        <span className="font-medium text-gym-yellow">RW-{Math.floor(100000 + Math.random() * 900000)}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* What happens next */}
                  <div className="bg-gradient-to-r from-gym-yellow/10 to-transparent p-5 rounded-lg mb-6">
                    <h4 className="text-white text-lg font-semibold mb-4 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-gym-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      What Happens Next
                    </h4>
                    
                    <div className="space-y-5">
                      <div className="flex gap-4">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gym-yellow/20 flex items-center justify-center text-gym-yellow font-bold">1</div>
                        <div>
                          <h5 className="text-white font-medium mb-1">Welcome Call</h5>
                          <p className="text-white/70 text-sm">We'll contact you within 12 hours to welcome you and confirm your first session timing.</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-4">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gym-yellow/20 flex items-center justify-center text-gym-yellow font-bold">2</div>
                        <div>
                          <h5 className="text-white font-medium mb-1">First Session</h5>
                          <p className="text-white/70 text-sm">Wear comfortable workout clothes, bring a water bottle, and arrive 10 minutes early for your assessment.</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-4">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gym-yellow/20 flex items-center justify-center text-gym-yellow font-bold">3</div>
                        <div>
                          <h5 className="text-white font-medium mb-1">Begin Your Journey</h5>
                          <p className="text-white/70 text-sm">Our expert trainers will customize your workout program to help you achieve your fitness goals.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Contact support */}
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-gym-yellow mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                      </svg>
                      <div>
                        <span className="block text-xs text-white/60">Need help? Call us</span>
                        <a href="tel:+919618361999" className="text-gym-yellow hover:underline">+91 96183 61999</a>
                      </div>
                    </div>
                    
                    <Button
                      onClick={handleStartOver}
                      variant="outline"
                      className="border-gym-yellow text-gym-yellow hover:bg-gym-yellow/20"
                    >
                      Register Another
                    </Button>
                  </div>
                  
                  {/* Email confirmation note */}
                  <div className="mt-6 text-center">
                    <p className="text-white/50 text-xs">A confirmation has also been sent to your phone via SMS</p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Right side: Payment info or confirmation */}
            <div className="bg-gym-gray-dark rounded-xl overflow-hidden border border-gym-gray-light shadow-lg">
              <div className="bg-gradient-to-r from-gym-yellow/10 to-transparent p-6">
                <h3 className="text-xl font-bold text-white">
                  {currentStep === 1 && "Booking Summary"}
                  {currentStep === 2 && "Payment Information"}
                  {currentStep === 3 && "What's Next?"}
                </h3>
              </div>
              
              <div className="p-8 space-y-6">
                {currentStep === 1 && selectedService ? (
                  <>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center pb-2 border-b border-gym-gray-light">
                        <span className="text-white/70">Selected Service:</span>
                        <span className="text-white font-medium">{selectedService.title}</span>
                      </div>
                      
                      <div className="flex justify-between items-center pb-2 border-b border-gym-gray-light">
                        <span className="text-white/70">Trainer:</span>
                        <span className="text-white font-medium">{selectedService.trainer}</span>
                      </div>
                      
                      <div className="flex justify-between items-center pb-2 border-b border-gym-gray-light">
                        <span className="text-white/70">Base Price:</span>
                        <span className="text-white font-medium">₹{selectedService.basePrice}</span>
                      </div>
                      
                      {couponValid && (
                        <div className="flex justify-between items-center pb-2 border-b border-gym-gray-light">
                          <span className="text-white/70">Discount ({couponCode.toUpperCase()}):</span>
                          <div className="flex flex-col items-end">
                            <span className="text-gym-yellow font-medium">
                              -₹{selectedService.basePrice - (finalPrice || 0)}
                            </span>
                            <span className="text-xs text-gym-yellow/70">
                              ({Math.round((1 - (finalPrice || 0) / selectedService.basePrice) * 100)}% OFF)
                            </span>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex justify-between items-center pb-2 border-b border-gym-gray-light">
                        <span className="text-white font-semibold">Final Price:</span>
                        <span className={`text-xl font-bold ${couponValid ? 'text-gym-yellow' : 'text-white'}`}>
                          ₹{couponValid ? finalPrice : selectedService.basePrice}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-white/70 text-sm">
                      After completing this step, you'll be able to make the payment using UPI and upload a screenshot to confirm your registration.
                    </p>
                  </>
                ) : currentStep === 2 ? (
                  <>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center pb-2 border-b border-gym-gray-light">
                        <span className="text-white/70">Name:</span>
                        <span className="text-white font-medium">{name}</span>
                      </div>
                      
                      <div className="flex justify-between items-center pb-2 border-b border-gym-gray-light">
                        <span className="text-white/70">Phone:</span>
                        <span className="text-white font-medium">{phone}</span>
                      </div>
                      
                      {selectedService && (
                        <>
                          <div className="flex justify-between items-center pb-2 border-b border-gym-gray-light">
                            <span className="text-white/70">Service:</span>
                            <span className="text-white font-medium">{selectedService.title}</span>
                          </div>
                          
                          <div className="flex justify-between items-center pb-2 border-b border-gym-gray-light">
                            <span className="text-white/70">Amount To Pay:</span>
                            <span className="text-xl font-bold text-gym-yellow">
                              ₹{couponValid ? finalPrice : selectedService.basePrice}
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                    
                    <div className="bg-gym-yellow/5 border border-gym-yellow/20 rounded-md p-4">
                      <h4 className="text-gym-yellow font-bold mb-2">Payment Instructions:</h4>
                      <ol className="list-decimal list-inside space-y-2 text-white/80 text-sm">
                        <li>Scan the QR code with any UPI app (Google Pay, PhonePe, Paytm)</li>
                        <li>Enter the exact amount shown above</li>
                        <li>Complete the payment</li>
                        <li>Take a screenshot of your payment confirmation</li>
                        <li>Upload the screenshot using the form on the left</li>
                      </ol>
                    </div>
                  </>
                ) : currentStep === 3 ? (
                  <>
                    <div className="space-y-6">
                      {/* Payment Receipt UI - designed like a premium receipt */}
                      <div className="bg-gym-gray-light/5 border border-gym-yellow/20 rounded-lg overflow-hidden">
                        {/* Receipt Header */}
                        <div className="bg-gym-yellow/10 p-4 flex items-center justify-between border-b border-gym-yellow/20">
                          <div className="flex items-center">
                            <svg className="w-5 h-5 text-gym-yellow mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <h4 className="text-gym-yellow font-bold">Payment Receipt</h4>
                          </div>
                          <div className="text-white/70 text-sm">
                            {new Date().toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </div>
                        </div>

                        {/* Receipt Content */}
                        <div className="p-4 space-y-4">
                          {/* Transaction ID */}
                          <div className="flex items-center justify-between pb-3 border-b border-gym-gray-light/20">
                            <span className="text-white/70 text-sm">Transaction ID:</span>
                            <span className="text-gym-yellow font-mono text-sm">RW-{Math.floor(100000 + Math.random() * 900000)}</span>
                          </div>

                          {/* Personal Details */}
                          <div className="pb-3 border-b border-gym-gray-light/20">
                            <h5 className="text-white/90 text-sm font-medium mb-2 flex items-center">
                              <svg className="w-4 h-4 mr-1.5 text-gym-yellow/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                              </svg>
                              Personal Details
                            </h5>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div className="flex flex-col">
                                <span className="text-white/50">Name</span>
                                <span className="text-white font-medium">{name}</span>
                              </div>
                              <div className="flex flex-col">
                                <span className="text-white/50">Phone</span>
                                <span className="text-white font-medium">{phone}</span>
                              </div>
                              {email && (
                                <div className="flex flex-col col-span-2">
                                  <span className="text-white/50">Email</span>
                                  <span className="text-white font-medium">{email}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Service Details */}
                          {selectedService && (
                            <div className="pb-3 border-b border-gym-gray-light/20">
                              <h5 className="text-white/90 text-sm font-medium mb-2 flex items-center">
                                <svg className="w-4 h-4 mr-1.5 text-gym-yellow/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                                </svg>
                                Service Details
                              </h5>
                              <div className="grid grid-cols-2 gap-2 text-sm">
                                <div className="flex flex-col">
                                  <span className="text-white/50">Program</span>
                                  <span className="text-white font-medium">{selectedService.title}</span>
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-white/50">Trainer</span>
                                  <span className="text-white font-medium">{selectedService.trainer}</span>
                                </div>
                                {selectedService.timings && (
                                  <div className="flex flex-col col-span-2">
                                    <span className="text-white/50">Available Timings</span>
                                    <span className="text-white/90">{selectedService.timings}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Payment Information */}
                          <div className="pb-1">
                            <h5 className="text-white/90 text-sm font-medium mb-2 flex items-center">
                              <svg className="w-4 h-4 mr-1.5 text-gym-yellow/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path>
                              </svg>
                              Payment Details
                            </h5>
                            
                            {selectedService && (
                              <div className="bg-gym-gray-dark/60 rounded-md p-3 space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span className="text-white/70">Original Price:</span>
                                  <span className="text-white">₹{selectedService.basePrice}</span>
                                </div>
                                
                                {couponValid && (
                                  <div className="flex justify-between text-sm">
                                    <div className="flex items-center">
                                      <svg className="w-3.5 h-3.5 text-gym-yellow/80 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                                      </svg>
                                      <span className="text-white/70">Discount ({couponCode.toUpperCase()}):</span>
                                    </div>
                                    <span className="text-gym-yellow">-₹{selectedService.basePrice - (finalPrice || 0)}</span>
                                  </div>
                                )}
                                
                                <div className="flex justify-between pt-2 border-t border-gym-gray-light/20">
                                  <span className="text-white font-medium">Final Amount:</span>
                                  <span className="text-gym-yellow font-bold">₹{couponValid ? finalPrice : selectedService.basePrice}</span>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Paid To */}
                          <div className="bg-gym-yellow/5 rounded-md p-3 flex items-center justify-between mt-2 border border-gym-yellow/20">
                            <div className="flex items-center">
                              <div className="bg-gym-yellow/20 p-1.5 rounded-full mr-3">
                                <svg className="w-5 h-5 text-gym-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                                </svg>
                              </div>
                              <div>
                                <p className="text-white/50 text-xs">Paid to</p>
                                <p className="text-white font-medium text-sm">Rebuild Women</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-white/50 text-xs">Payment Time</p>
                              <p className="text-white font-medium text-sm">{new Date().toLocaleTimeString('en-IN', {
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: true
                              })}</p>
                            </div>
                          </div>

                          {/* Payment Screenshot Thumbnail */}
                          {screenshotUrl && (
                            <div className="relative group cursor-pointer">
                              <div className="aspect-video w-full h-24 rounded-md overflow-hidden border border-gym-yellow/20">
                                <img 
                                  src={screenshotUrl} 
                                  alt="Payment confirmation" 
                                  className="w-full h-full object-cover opacity-60 group-hover:opacity-90 transition-opacity"
                                />
                              </div>
                              <div className="absolute inset-0 flex items-center justify-center opacity-100 group-hover:opacity-0 transition-opacity">
                                <div className="bg-gym-yellow/30 rounded-full p-1.5">
                                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                                  </svg>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                        
                        {/* Receipt Footer */}
                        <div className="bg-gym-gray-dark/50 p-3 text-center border-t border-gym-gray-light/10">
                          <p className="text-white/60 text-xs mb-1">Thank you for choosing Rebuild Women</p>
                          <p className="text-white/60 text-xs">A copy of this receipt has been sent to your phone</p>
                        </div>
                      </div>

                      {/* Next Steps Section */}
                      <div className="space-y-4 mt-5">
                        <h5 className="text-white text-sm font-medium mb-2 flex items-center">
                          <svg className="w-4 h-4 mr-1.5 text-gym-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                          </svg>
                          Next Steps
                        </h5>
                        
                        <div className="flex items-start gap-3">
                          <div className="bg-gym-yellow/20 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-gym-yellow text-sm">1</span>
                          </div>
                          <div>
                            <h5 className="text-white font-medium mb-1">Expect Our Call</h5>
                            <p className="text-white/70 text-sm">Our team will contact you within 24 hours to confirm your booking and answer any questions.</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                          <div className="bg-gym-yellow/20 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-gym-yellow text-sm">2</span>
                          </div>
                          <div>
                            <h5 className="text-white font-medium mb-1">Attend Your First Session</h5>
                            <p className="text-white/70 text-sm">Come prepared for your first session. Wear comfortable clothes and bring a water bottle.</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                          <div className="bg-gym-yellow/20 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-gym-yellow text-sm">3</span>
                          </div>
                          <div>
                            <h5 className="text-white font-medium mb-1">Begin Your Transformation</h5>
                            <p className="text-white/70 text-sm">Start your fitness journey with our expert trainers guiding you every step of the way.</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Contact Support */}
                      <div className="pt-4 border-t border-gym-gray-light/20 flex justify-between items-center">
                        <a 
                          href={`https://wa.me/919618361999?text=${encodeURIComponent("Hi, I've just registered for "+selectedService?.title+" at Rebuild Women. My name is "+name+". Could you please confirm my booking?")}`}
                          target="_blank"
                          rel="noopener noreferrer" 
                          className="flex items-center gap-2 text-white/80 hover:text-gym-yellow transition-colors"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                          </svg>
                          <div className="text-sm">Contact via WhatsApp</div>
                        </a>
                        <Button
                          type="button"
                          onClick={handleStartOver} 
                          variant="outline"
                          size="sm"
                          className="border-gym-yellow/50 text-gym-yellow hover:bg-gym-yellow/10"
                        >
                          Register Another
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="w-16 h-16 bg-gym-gray rounded-full flex items-center justify-center mb-4">
                      <svg className="w-8 h-8 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    </div>
                    <p className="text-white/70 mb-2">Please select a service to view booking details</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default JoinFormSection;