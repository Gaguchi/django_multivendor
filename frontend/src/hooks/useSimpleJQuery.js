import { useEffect } from 'react';
import { initializeComponent } from '../utils/jQuerySimple';

/**
 * Super simple hook to initialize specific jQuery components
 * when needed by a specific React component
 * 
 * @param {Array} components Array of component names to initialize
 * @param {Array} dependencies Additional effect dependencies
 */
export default function useSimpleJQuery(components = [], dependencies = []) {
  useEffect(() => {
    // If components specified, initialize them
    if (components && components.length) {
      components.forEach(component => {
        setTimeout(() => {
          initializeComponent(component);
        }, 300);
      });
    }
  }, dependencies);
  
  return {
    isAvailable: typeof jQuery !== 'undefined'
  };
}
