import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useFirebase } from '@/contexts/FirebaseContext';
import { useToast } from '@/hooks/use-toast';

interface FreeSessionPopupProps {
  onClose: () => void;
}

const FreeSessionPopup = ({ onClose }: FreeSessionPopupProps) => {
  const { createFreeSession } = useFirebase();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    phone: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const validateForm = (): boolean => {
    let isValid = true;
    const newErrors = { ...errors };
    
    // Validate name
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }
    
    // Validate email
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
      isValid = false;
    }
    
    // Validate phone
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
      isValid = false;
    } else if (!/^\+?[0-9]{10,15}$/.test(formData.phone.replace(/[-\s]/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      await createFreeSession({
        name: formData.name,
        email: formData.email,
        phone: formData.phone
      });
      
      setIsSuccess(true);
      
      // Mark as shown in localStorage
      localStorage.setItem('freeSession_submitted', 'true');
      localStorage.setItem('freeSession_lastShown', new Date().toISOString());
      
      // Show success toast
      toast({
        title: "Free Session Booked!",
        description: "We'll contact you shortly to confirm your appointment.",
      });
      
      // After 3 seconds, close the popup
      setTimeout(() => {
        onClose();
      }, 3000);
      
    } catch (error) {
      console.error('Error submitting free session form:', error);
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: "Please try again or contact us directly.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <AnimatePresence>
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        {/* Backdrop */}
        <motion.div 
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />
        
        {/* Popup Content */}
        <motion.div
          className="w-full max-w-md z-10 bg-gym-gray-dark border border-gym-gray-light rounded-xl overflow-hidden shadow-2xl"
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
        >
          {/* Yellow top accent */}
          <div className="h-2 bg-gradient-to-r from-gym-yellow/50 via-gym-yellow to-gym-yellow/50"></div>
          
          {/* Header */}
          <div className="p-6 border-b border-gym-gray-light flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center">
                <span className="mr-2">🎁</span>
                Book Your Free Session
              </h2>
              <p className="text-white/70 mt-1">Try before you commit</p>
            </div>
            
            <button 
              onClick={onClose} 
              className="text-white/70 hover:text-white rounded-full p-1 transition-colors"
              aria-label="Close popup"
            >
              <X size={20} />
            </button>
          </div>
          
          {/* Content */}
          <div className="p-6 pt-5">
            {!isSuccess ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <Label 
                    htmlFor="name" 
                    className="text-white/90"
                  >
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`bg-gym-gray border-gym-gray-light text-white focus:border-gym-yellow ${errors.name ? 'border-red-500' : ''}`}
                    placeholder="Enter your name"
                    autoComplete="name"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                  )}
                </div>
                
                <div className="space-y-1.5">
                  <Label 
                    htmlFor="email" 
                    className="text-white/90"
                  >
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`bg-gym-gray border-gym-gray-light text-white focus:border-gym-yellow ${errors.email ? 'border-red-500' : ''}`}
                    placeholder="Enter your email"
                    autoComplete="email"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>
                
                <div className="space-y-1.5">
                  <Label 
                    htmlFor="phone" 
                    className="text-white/90"
                  >
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`bg-gym-gray border-gym-gray-light text-white focus:border-gym-yellow ${errors.phone ? 'border-red-500' : ''}`}
                    placeholder="Enter your phone number"
                    autoComplete="tel"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                  )}
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full mt-6 bg-gradient-to-r from-gym-yellow/90 to-gym-yellow text-black font-medium hover:shadow-[0_0_15px_rgba(255,243,24,0.5)] transition-all duration-300 hover:scale-[1.01]"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit & Reserve My Slot'}
                </Button>
              </form>
            ) : (
              <motion.div 
                className="flex flex-col items-center py-4 text-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="w-20 h-20 rounded-full bg-gym-yellow/20 flex items-center justify-center mb-4">
                  <span className="text-3xl">🎉</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Your free session is booked!</h3>
                <p className="text-white/70 mb-4">
                  We'll contact you shortly to confirm your appointment.
                </p>
                <Button
                  className="bg-gym-yellow/20 text-gym-yellow hover:bg-gym-yellow/30"
                  onClick={onClose}
                >
                  Close
                </Button>
              </motion.div>
            )}
          </div>
          
          {/* Footer */}
          <div className="bg-gym-gray-dark/80 p-4 text-center border-t border-gym-gray-light">
            <p className="text-white/50 text-sm">
              Limited spots available. No credit card required.
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default FreeSessionPopup;
