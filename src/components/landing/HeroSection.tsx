
import { Button } from "@/components/ui/button";
import ImageSlideshow from "@/components/ImageSlideshow";

// High-resolution images of women working out in the gym
const WORKOUT_IMAGES = [
  "https://images.unsplash.com/photo-1534258936925-c58bed479fcb?q=80&w=1931&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=1770&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1518310383802-640c2de311b2?q=80&w=1770&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=1770&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1523476324532-18841ae4ab0e?q=80&w=1769&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1593476123561-9516f2097158?q=80&w=1770&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1599058917212-d750089bc07e?q=80&w=1769&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1770&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=1770&auto=format&fit=crop"
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
      <ImageSlideshow images={WORKOUT_IMAGES} interval={4000} />
      
      <div className="container-custom relative z-10 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 animate-fade-in">
            <span className="block mb-2">Strong. Confident.</span> 
            <span className="text-rebuild-pink">Rebuilt.</span>
          </h1>
          
          <p className="text-lg md:text-2xl mb-10 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            Expertly Designed by a Certified Women's Fitness Coach — Right Here in Kakinada
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fade-in" style={{ animationDelay: "0.5s" }}>
            <Button 
              size="lg" 
              className="text-lg bg-gradient-to-r from-rebuild-purple to-rebuild-pink hover:bg-rebuild-purple/90 relative overflow-hidden group shadow-lg transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              onClick={() => scrollToSection('join')}
            >
              <span className="relative z-10 px-2">Join the Program</span>
              <span className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
            </Button>
            
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg text-white border-white hover:bg-white/20 relative overflow-hidden group shadow-md transform transition-all duration-300 hover:-translate-y-1"
              onClick={() => scrollToSection('sessions')}
            >
              <span className="relative z-10 px-2">View Workout Sessions</span>
              <span className="absolute inset-0 bg-white/10 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
            </Button>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-10 left-0 right-0 flex justify-center animate-bounce">
        <button 
          onClick={() => scrollToSection('sessions')} 
          className="text-white opacity-80 hover:opacity-100 transition-opacity"
          aria-label="Scroll down"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </button>
      </div>
    </section>
  );
};

export default HeroSection;
