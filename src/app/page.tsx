import { Button } from "@/components/ui/button";
import ImageSlideshow from "@/components/ImageSlideshow";
import "@/styles/animations.css";

// Desktop/Large Screen images (≥768px)
const DESKTOP_IMAGES = [
  "https://eliteclubs.com/wp-content/uploads/2019/11/The-Pros-Cons-of-Exercising-with-a-Friend-e1571837163735.jpeg",
  "https://images.unsplash.com/photo-1534258936925-c58bed479fcb?q=80&w=1931&auto=format&fit=crop",
  "https://images.pexels.com/photos/17898139/pexels-photo-17898139/free-photo-of-back-view-of-a-muscular-woman-at-the-gym.jpeg",
  "https://i.pinimg.com/736x/2f/7e/18/2f7e1807fa627358b26952bcdcd66fce.jpg",
  "https://images.unsplash.com/photo-1534258936925-c58bed479fcb?q=80&w=1931&auto=format&fit=crop",
  "https://images.pexels.com/photos/2247179/pexels-photo-2247179.jpeg",
  "https://static.vecteezy.com/system/resources/thumbnails/003/452/165/small_2x/sporty-woman-using-waist-tape-line-in-fitness-gym-sport-club-training-photo.jpg"
];

// Mobile Screen images (<768px)
const MOBILE_IMAGES = [
  "https://images.unsplash.com/photo-1550345332-09e3ac987658",
  "https://plus.unsplash.com/premium_photo-1674059549221-e2943b475f62",
  "https://images.unsplash.com/photo-1548690312-e3b507d8c110",
  "https://images.pexels.com/photos/4944104/pexels-photo-4944104.jpeg",
  "https://plus.unsplash.com/premium_photo-1661580189677-67d3d3fbf7cb",
  "https://images.unsplash.com/photo-1550259979-ed79b48d2a30",
  "https://images.unsplash.com/photo-1595078475328-1ab05d0a6a0e"
];

const HeroSection = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center text-white">
      <ImageSlideshow 
        images={DESKTOP_IMAGES} 
        mobileImages={MOBILE_IMAGES}
        interval={6000} 
        pauseOnHover={true}
        enableKenBurns={true}
      />
      
      <div className="container-custom relative z-10 text-center">
        {/* Removing the dark gradient overlay */}
        
        <div className="max-w-3xl mx-auto px-4 py-12 relative">
          {/* Simplified premium headline */}
          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight leading-tight">
            <span className="block mb-3 text-white animate-fade-down">Rebuild Your Body.</span> 
            <span className="block text-rebuild-pink animate-fade-down" style={{ animationDelay: "0.3s" }}>Redefine Your Confidence.</span>
          </h1>
          
          {/* Concise subheadline */}
          <p className="font-sans text-xl md:text-2xl mb-10 leading-relaxed animate-fade-up opacity-0" 
             style={{ animationDelay: "0.6s", animationFillMode: "forwards" }}>
            Kakinada's Exclusive Weight Loss Program for Women.
          </p>
          
          {/* Streamlined CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-5 justify-center max-w-md mx-auto">
            <Button 
              size="lg" 
              className="text-lg w-full bg-gradient-to-r from-rebuild-purple to-rebuild-pink relative overflow-hidden group shadow-lg transform transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(186,104,200,0.4)] animate-fade-in opacity-0"
              style={{ animationDelay: "0.8s", animationFillMode: "forwards" }}
              onClick={() => scrollToSection('join')}
            >
              <span className="relative z-10 px-3 py-1 font-medium">Join Now</span>
              <span className="absolute inset-0 bg-white/10 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
            </Button>
            
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg w-full border-2 border-rebuild-pink text-rebuild-pink hover:text-white hover:border-white bg-black/20 backdrop-blur-sm hover:bg-rebuild-pink/30 relative overflow-hidden group transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_15px_rgba(236,72,153,0.3)] animate-fade-in opacity-0"
              style={{ animationDelay: "1s", animationFillMode: "forwards" }}
              onClick={() => scrollToSection('sessions')}
            >
              <span className="relative z-10 px-3 py-1 font-medium">View Sessions</span>
              <span className="absolute inset-0 transform scale-y-0 group-hover:scale-y-100 transition-transform origin-bottom duration-300"></span>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-0 right-0 flex flex-col items-center justify-center animate-pulse">
        <span className="text-white/70 text-sm mb-2 animate-fade-in opacity-0" style={{ animationDelay: "1.2s", animationFillMode: "forwards" }}>
          Scroll to explore
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="animate-fade-in opacity-0"
          style={{ animationDelay: "1.2s", animationFillMode: "forwards" }}
        >
          <path d="M12 5v14M5 12l7 7 7-7" />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;