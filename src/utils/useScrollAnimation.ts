
import { useEffect } from 'react';

const useScrollAnimation = () => {
  useEffect(() => {
    const handleScrollAnimation = () => {
      const elements = document.querySelectorAll('.animate-on-scroll');
      
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
      });
      
      elements.forEach(element => {
        observer.observe(element);
      });
      
      return () => {
        elements.forEach(element => {
          observer.unobserve(element);
        });
      };
    };
    
    handleScrollAnimation();
    window.addEventListener('resize', handleScrollAnimation);
    
    return () => {
      window.removeEventListener('resize', handleScrollAnimation);
    };
  }, []);
  
  return null;
};

export default useScrollAnimation;
