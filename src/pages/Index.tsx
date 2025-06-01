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
  
  // Effect to show popup after 10 seconds
  useEffect(() => {
    // Check if user has submitted the form before
    const hasSubmitted = localStorage.getItem('freeSession_submitted') === 'true';
    
    // Check if popup was recently shown (within the last 24 hours)
    const lastShown = localStorage.getItem('freeSession_lastShown');
    const wasRecentlyShown = lastShown && 
      (new Date().getTime() - new Date(lastShown).getTime() < 24 * 60 * 60 * 1000);
    
    // If user hasn't submitted and popup wasn't recently shown
    if (!hasSubmitted && !wasRecentlyShown) {
      const timer = setTimeout(() => {
        setShowFreeSessionPopup(true);
        // Mark as shown in the current session
        localStorage.setItem('freeSession_lastShown', new Date().toISOString());
      }, 10000); // 10 seconds
      
      return () => clearTimeout(timer);
    }
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
