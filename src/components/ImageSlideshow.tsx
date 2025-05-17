
import { useState, useEffect } from "react";

interface ImageSlideshowProps {
  images: string[];
  interval?: number;
}

const ImageSlideshow = ({ images, interval = 5000 }: ImageSlideshowProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [nextImageIndex, setNextImageIndex] = useState(1);
  const [transitioning, setTransitioning] = useState(false);

  useEffect(() => {
    if (images.length <= 1) return;
    
    const timer = setInterval(() => {
      setTransitioning(true);
      
      setTimeout(() => {
        setCurrentImageIndex(nextImageIndex);
        setNextImageIndex((nextImageIndex + 1) % images.length);
        setTransitioning(false);
      }, 1000); // 1 second transition time
      
    }, interval);
    
    return () => clearInterval(timer);
  }, [images, interval, nextImageIndex]);

  if (images.length === 0) return null;
  
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden -z-10">
      {/* Current Image */}
      <div
        className={`absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-1000 ${
          transitioning ? "opacity-0" : "opacity-100"
        }`}
        style={{
          backgroundImage: `url(${images[currentImageIndex]})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      
      {/* Next Image (preloaded) */}
      <div
        className={`absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-1000 ${
          transitioning ? "opacity-100" : "opacity-0"
        }`}
        style={{
          backgroundImage: `url(${images[nextImageIndex]})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
    </div>
  );
};

export default ImageSlideshow;
