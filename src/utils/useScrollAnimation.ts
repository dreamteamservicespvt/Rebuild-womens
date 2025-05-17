import { useEffect } from 'react';

const useScrollAnimation = () => {
  useEffect(() => {
    const handleScrollAnimation = () => {
      const elements = document.querySelectorAll('.animate-on-scroll');
      
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Add a small delay to create a more natural feel
            setTimeout(() => {
              entry.target.classList.add('visible');
            }, 100);
            
            // Add custom animation classes if specified
            const animation = entry.target.getAttribute('data-animation');
            if (animation) {
              entry.target.classList.add(animation);
            }
            
            // Optional: Unobserve after animation
            const unobserve = entry.target.getAttribute('data-unobserve');
            if (unobserve !== 'false') {
              observer.unobserve(entry.target);
            }
          } else {
            // Optional: Reset animation when out of view
            const reset = entry.target.getAttribute('data-reset');
            if (reset === 'true') {
              entry.target.classList.remove('visible');
              const animation = entry.target.getAttribute('data-animation');
              if (animation) {
                entry.target.classList.remove(animation);
              }
            }
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
    
    // Run on initial load
    handleScrollAnimation();
    
    // Re-run on resize for responsive designs
    window.addEventListener('resize', handleScrollAnimation);
    
    // First time visitors get immediate animation for above-the-fold content
    const firstVisit = !sessionStorage.getItem('visited');
    if (firstVisit) {
      document.querySelectorAll('.animate-on-scroll.above-fold').forEach(el => {
        el.classList.add('visible');
      });
      sessionStorage.setItem('visited', 'true');
    }
    
    return () => {
      window.removeEventListener('resize', handleScrollAnimation);
    };
  }, []);
  
  return null;
};

export default useScrollAnimation;
