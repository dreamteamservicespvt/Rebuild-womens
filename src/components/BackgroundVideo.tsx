
import { useEffect, useRef, useState } from "react";

interface BackgroundVideoProps {
  videoUrl: string;
  fallbackImage: string;
}

const BackgroundVideo = ({ videoUrl, fallbackImage }: BackgroundVideoProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoad = () => {
      setIsVideoLoaded(true);
    };

    video.addEventListener('loadeddata', handleLoad);
    
    return () => {
      video.removeEventListener('loadeddata', handleLoad);
    };
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden -z-10">
      {/* Fallback Image */}
      <div 
        className={`absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-500 ${isVideoLoaded ? 'opacity-0' : 'opacity-100'}`}
        style={{ 
          backgroundImage: `url(${fallbackImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center' 
        }}
      />
      
      {/* Video Background */}
      <video
        ref={videoRef}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${isVideoLoaded ? 'opacity-100' : 'opacity-0'}`}
        autoPlay
        loop
        muted
        playsInline
      >
        <source src={videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
    </div>
  );
};

export default BackgroundVideo;
