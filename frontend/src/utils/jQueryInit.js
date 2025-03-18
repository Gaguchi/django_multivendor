import { 
  waitForJQuery, 
  safeJQuery, 
  reinitializeJQuery 
} from './jQueryHandler';

// Track initialization status
let jQueryInitialized = false;

/**
 * Initialize jQuery plugins globally
 */
export const initializeJQueryPlugins = (attempt = 1) => {
  if (attempt > 5) {
    console.warn('Max initialization attempts reached');
    return;
  }

  // Skip if already initialized successfully
  if (jQueryInitialized) {
    console.log('jQuery already initialized, skipping');
    return;
  }

  waitForJQuery(($) => {
    safeJQuery(($) => {
      console.log(`Initializing jQuery plugins (attempt ${attempt})`);
      
      // Try initializing all components
      reinitializeJQuery(null, { delay: 100 });
      
      // Mark as initialized so we don't unnecessarily reinitialize
      jQueryInitialized = true;
    }, 100);
  });
};

/**
 * Check jQuery status and reinitialize if needed
 */
export const checkAndReinitializeJQuery = () => {
  // Skip if already successfully initialized
  if (jQueryInitialized) {
    console.log('jQuery already initialized, skipping check');
    return;
  }

  safeJQuery(($) => {
    // Test if jQuery functionality is working properly
    try {
      // Test DOM manipulation
      const $testDiv = $('<div id="jquery-test"></div>');
      $('body').append($testDiv);
      $testDiv.remove();
      
      // If we got here, basic jQuery is working
      console.log('jQuery functional check passed');
      
      // Only reinitialize if not already marked as initialized
      if (!jQueryInitialized) {
        reinitializeJQuery();
        jQueryInitialized = true;
      }
    } catch (error) {
      console.error('jQuery functionality test failed:', error);
      console.log('Attempting to reinitialize jQuery');
      
      // Try harder to reinitialize
      setTimeout(() => {
        initializeJQueryPlugins(2);
      }, 500);
    }
  });
};

/**
 * Reset initialization state (useful for manual reinitializations)
 */
export const resetJQueryInitStatus = () => {
  jQueryInitialized = false;
};

export default {
  initializeJQueryPlugins,
  checkAndReinitializeJQuery,
  resetJQueryInitStatus
};
