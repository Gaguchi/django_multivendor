import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Simplified hook for component-specific jQuery initialization
 * 
 * @param {Function} initializer Function to run for jQuery initialization
 * @param {Array} dependencies Additional effect dependencies
 */
export default function useJQuery(initializer, dependencies = []) {
  const location = useLocation();
  
  useEffect(() => {
    // Skip if jQuery isn't available
    if (typeof jQuery === 'undefined') {
      return;
    }
    
    // Simple delay to ensure DOM is ready
    const timeoutId = setTimeout(() => {
      try {
        initializer(jQuery);
      } catch (error) {
        console.error('Error in jQuery initializer:', error);
      }
    }, 300);
    
    // Clean up
    return () => clearTimeout(timeoutId);
  }, [location.pathname, ...dependencies]);
  
  return {
    isAvailable: typeof jQuery !== 'undefined'
  };
}
