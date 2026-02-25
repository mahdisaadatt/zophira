import { useState, useEffect } from 'react';

export function useResponsiveLoadCount() {
  const [loadCount, setLoadCount] = useState(9); // Default to large screen

  useEffect(() => {
    const updateLoadCount = () => {
      const width = window.innerWidth;
      if (width >= 1024) {
        // lg and above: 3 columns × 3 rows = 9 products
        setLoadCount(9);
      } else if (width >= 768) {
        // md: 2 columns × 3 rows = 6 products
        setLoadCount(6);
      } else {
        // mobile: 1 column × 6 rows = 6 products
        setLoadCount(6);
      }
    };

    // Set initial count
    updateLoadCount();

    // Listen for window resize
    window.addEventListener('resize', updateLoadCount);
    
    return () => window.removeEventListener('resize', updateLoadCount);
  }, []);

  return loadCount;
}
