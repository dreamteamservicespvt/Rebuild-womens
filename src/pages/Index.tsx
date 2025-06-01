import { useState, useEffect } from 'react';
import HeroSection from "@/components/landing/HeroSection";
import SessionsSection from "@/components/landing/SessionsSection";
import PricingSection from "@/components/landing/PricingSection";
import JoinFormSection from "@/components/landing/JoinFormSection";
import LocationSection from "@/components/landing/LocationSection";
import Footer from "@/components/landing/Footer";
import FreeSessionPopup from '@/components/FreeSessionPopup';

const Index = () => {
  // State for free session popup
  const [showFreeSessionPopup, setShowFreeSessionPopup] = useState(false);
  
  // Effect to show popup with different timing based on visit type
  useEffect(() => {
    // For development debugging only - uncomment to reset storage when needed
    // localStorage.removeItem('freeSession_submitted');
    // localStorage.removeItem('freeSession_lastShown');
    // localStorage.removeItem('first_visit_completed');
    
    // Check if user has submitted the form before - never show popup in this case
    const hasSubmitted = localStorage.getItem('freeSession_submitted') === 'true';
    if (hasSubmitted) {
      return; // Don't show popup to users who already filled the form
    }
    
    // Check if this is the first visit or a reload
    const isFirstVisit = localStorage.getItem('first_visit_completed') !== 'true';
    
    // Set the appropriate delay based on whether it's first visit or reload
    const popupDelay = isFirstVisit ? 5000 : 10000; // 5s for first visit, 10s for reloads
    
    // Set a timer to show the popup after the appropriate delay
    const timer = setTimeout(() => {
      console.log(`Showing popup after ${popupDelay/1000}s - First visit: ${isFirstVisit}`);
      setShowFreeSessionPopup(true);
      
      // Mark as shown in the current session
      localStorage.setItem('freeSession_lastShown', new Date().toISOString());
      
      // If this was the first visit, mark it as completed for future visits
      if (isFirstVisit) {
        localStorage.setItem('first_visit_completed', 'true');
      }
    }, popupDelay);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleClosePopup = () => {
    setShowFreeSessionPopup(false);
  };
  
  return (
    <main className="min-h-screen">
      <HeroSection />
      <SessionsSection />
      <PricingSection />
      <JoinFormSection />
      <LocationSection />
      <Footer />
      {showFreeSessionPopup && <FreeSessionPopup onClose={handleClosePopup} />}
    </main>
  );
};

export default Index;
