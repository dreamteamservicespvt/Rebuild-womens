
import HeroSection from "@/components/landing/HeroSection";
import SessionsSection from "@/components/landing/SessionsSection";
import PricingSection from "@/components/landing/PricingSection";
import JoinFormSection from "@/components/landing/JoinFormSection";
import LocationSection from "@/components/landing/LocationSection";
import Footer from "@/components/landing/Footer";

const Index = () => {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <SessionsSection />
      <PricingSection />
      <JoinFormSection />
      <LocationSection />
      <Footer />
    </main>
  );
};

export default Index;
