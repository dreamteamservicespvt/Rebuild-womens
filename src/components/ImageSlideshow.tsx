import { useState, useEffect, useRef } from "react";

interface ImageSlideshowProps {
  images: string[];
  mobileImages?: string[];
  interval?: number;
  showControls?: boolean;
  pauseOnHover?: boolean;
  enableKenBurns?: boolean;
}

const ImageSlideshow = ({ 
  images, 
  mobileImages,
  interval = 5000, 
  showControls = false,
  pauseOnHover = false,
  enableKenBurns = false
}: ImageSlideshowProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [nextImageIndex, setNextImageIndex] = useState(1);
  const [transitioning, setTransitioning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState<boolean[]>([]);
  const [allImagesLoaded, setAllImagesLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const transitionDuration = 2000; // Changed to 2000ms for smoother transition

  // Determine which image set to use based on screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const activeImages = isMobile && mobileImages ? mobileImages : images;

  // Preload images before starting slideshow
  useEffect(() => {
    // Reset loaded state when image set changes
    setImagesLoaded(Array(activeImages.length).fill(false));
    setAllImagesLoaded(false);
    
    // Preload all images and track loading state
    const imageLoadingPromises = activeImages.map((src, index) => {
      return new Promise<void>((resolve) => {
        const img = new Image();
        img.onload = () => {
          setImagesLoaded(prev => {
            const newState = [...prev];
            newState[index] = true;
            return newState;
          });
          resolve();
        };
        img.onerror = () => {
          // Handle image loading errors silently
          setImagesLoaded(prev => {
            const newState = [...prev];
            newState[index] = true;
            return newState;
          });
          resolve();
          
          // Log to monitoring in production using a more controlled approach
          if (process.env.NODE_ENV === "production") {
            // Using a safer logging method that doesn't rely on console.error
            const errorInfo = {
              type: "IMAGE_LOAD_ERROR",
              source: src,
              component: "ImageSlideshow"
            };
            
            // If there's a monitoring service available, use it instead
            // errorTrackingService.logEvent(errorInfo);
            
            // Fallback to a minimal console warning that doesn't interrupt execution
            try {
              console.warn("Failed to load image:", errorInfo);
            } catch (e) {
              // Suppress any console errors
            }
          }
        };
        img.src = src;
      });
    });
    
    // When all images are loaded, update state
    Promise.all(imageLoadingPromises).then(() => {
      setAllImagesLoaded(true);
    });
  }, [activeImages]);

  // Check if at least the first two images are loaded to begin slideshow
  const initialImagesLoaded = imagesLoaded[0] && (activeImages.length === 1 || imagesLoaded[1]);

  const goToNextSlide = () => {
    if (transitioning || activeImages.length <= 1) return;
    
    setTransitioning(true);
    setTimeout(() => {
      setCurrentImageIndex(nextImageIndex);
      setNextImageIndex((nextImageIndex + 1) % activeImages.length);
      setTransitioning(false);
    }, transitionDuration);
  };

  const goToPrevSlide = () => {
    if (transitioning || activeImages.length <= 1) return;
    
    setTransitioning(true);
    const prevIndex = (currentImageIndex - 1 + activeImages.length) % activeImages.length;
    setTimeout(() => {
      setCurrentImageIndex(prevIndex);
      setNextImageIndex(currentImageIndex);
      setTransitioning(false);
    }, transitionDuration);
  };

  useEffect(() => {
    // Don't start slideshow until at least first two images are loaded
    if (activeImages.length <= 1 || isPaused || !initialImagesLoaded) return;
    
    const startTransition = () => {
      // Don't transition if next image isn't loaded yet
      if (!imagesLoaded[nextImageIndex]) return;
      
      setTransitioning(true);
      
      setTimeout(() => {
        setCurrentImageIndex(nextImageIndex);
        setNextImageIndex((nextImageIndex + 1) % activeImages.length);
        setTransitioning(false);
      }, transitionDuration);
    };
    
    // Clear existing timer before setting a new one
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    timerRef.current = setInterval(startTransition, interval);
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [activeImages, interval, nextImageIndex, isPaused, initialImagesLoaded, imagesLoaded]);

  if (activeImages.length === 0) return null;
  
  // Display loading state if the first image isn't loaded yet
  if (!imagesLoaded[0]) {
    return (
      <div className="absolute inset-0 w-full h-full bg-black/70 -z-10">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div 
      className="absolute inset-0 w-full h-full overflow-hidden -z-10"
      onMouseEnter={() => pauseOnHover && setIsPaused(true)}
      onMouseLeave={() => pauseOnHover && setIsPaused(false)}
    >
      {/* Current Image */}
      <div
        className={`absolute inset-0 w-full h-full bg-black transition-all duration-[2000ms] ease-out ${
          transitioning ? "opacity-0" : "opacity-100"
        }`}
        style={{
          backgroundImage: `url(${activeImages[currentImageIndex]})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          transform: enableKenBurns ? `scale(${transitioning ? 1.05 : 1.1})` : "scale(1)",
          transition: enableKenBurns 
            ? "transform 8s ease-out, opacity 2s ease-out"
            : "opacity 2s ease-out",
        }}
      />
      
      {/* Next Image */}
      {imagesLoaded[nextImageIndex] && (
        <div
          className={`absolute inset-0 w-full h-full bg-black transition-all duration-[2000ms] ease-out ${
            transitioning ? "opacity-100" : "opacity-0"
          }`}
          style={{
            backgroundImage: `url(${activeImages[nextImageIndex]})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            transform: enableKenBurns ? `scale(${transitioning ? 1.1 : 1.05})` : "scale(1)",
            transition: enableKenBurns 
              ? "transform 8s ease-out, opacity 2s ease-out"
              : "opacity 2s ease-out",
          }}
        />
      )}

      {/* Enhanced gradient overlay with smoother transition */}
      <div 
        className="absolute inset-0 bg-gradient-to-b from-black/90 via-transparent to-black/80 transition-opacity duration-[2000ms] ease-out"
      ></div>

      {/* Navigation Controls */}
      {showControls && activeImages.length > 1 && (
        <>
          <button 
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-3 rounded-full transition-colors duration-300 z-10"
            onClick={goToPrevSlide}
            aria-label="Previous slide"
            aria-controls="slideshow-container"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                goToPrevSlide();
              }
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button 
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-3 rounded-full transition-colors duration-300 z-10"
            onClick={goToNextSlide}
            aria-label="Next slide"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}
    </div>
  );
};

export default ImageSlideshow;
