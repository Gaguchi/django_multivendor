/**
 * Utility for safely handling jQuery initialization and checking its status
 */

/**
 * Check if jQuery is properly initialized and available
 * @returns {boolean} True if jQuery is available
 */
export const isJQueryAvailable = () => {
  return typeof window !== 'undefined' && typeof jQuery !== 'undefined' && jQuery;
};

/**
 * Check if a specific jQuery plugin is available
 * @param {string} pluginName The name of the jQuery plugin to check
 * @returns {boolean} True if the plugin is available
 */
export const isPluginAvailable = (pluginName) => {
  if (!isJQueryAvailable()) return false;
  return typeof jQuery.fn[pluginName] === 'function';
};

/**
 * Safely execute jQuery code with proper error handling
 * @param {Function} callback Function containing jQuery code to execute
 * @param {number} delay Optional delay before execution in milliseconds
 * @returns {void}
 */
export const safeJQuery = (callback, delay = 0) => {
  // First check if jQuery is available
  if (!isJQueryAvailable()) {
    console.warn('jQuery is not available yet, will retry...');
    
    // Try again in a moment
    setTimeout(() => safeJQuery(callback, delay), 100);
    return;
  }

  // When to execute the callback
  const execute = () => {
    try {
      // jQuery is available, run the callback
      callback(jQuery);
    } catch (error) {
      console.error('Error executing jQuery code:', error);
    }
  };

  // Execute immediately or after specified delay
  if (delay > 0) {
    setTimeout(execute, delay);
  } else {
    execute();
  }
};

/**
 * Reinitialize a specific jQuery component or all components
 * @param {string|null} component Specific component to reinitialize, or null for all
 * @param {Object} options Additional options
 */
export const reinitializeJQuery = (component = null, options = {}) => {
  const { delay = 100, selector } = options;
  
  safeJQuery(($) => {
    console.log(`Reinitializing jQuery${component ? ' ' + component : ''}`);
    
    // Make sure document is ready
    $(document).ready(function() {
      // Handle specific components
      switch (component) {
        case 'carousel':
        case 'owlCarousel':
          if ($.fn.owlCarousel) {
            // Destroy and reinitialize carousels
            const carouselSelector = selector || '.owl-carousel';
            $(carouselSelector).each(function() {
              const $this = $(this);
              if ($this.data('owl.carousel')) {
                $this.trigger('destroy.owl.carousel');
              }
              // Reinit with data options
              const dataOptions = $this.data('owl-options');
              let options = {
                loop: true, 
                margin: 0,
                responsiveClass: true,
                nav: false,
                dots: true,
                items: 1
              };
              
              if (dataOptions) {
                try {
                  const parsedOptions = JSON.parse(dataOptions.replace(/'/g, '"').replace(';', ''));
                  options = { ...options, ...parsedOptions };
                } catch (e) {
                  console.error("Error parsing carousel options", e);
                }
              }
              
              try {
                $this.owlCarousel(options);
              } catch (e) {
                console.error("Error reinitializing carousel:", e);
              }
            });
          }
          break;
          
        case 'tooltip':
          if ($.fn.tooltip) {
            $('[data-toggle="tooltip"]').tooltip('dispose').tooltip();
          }
          break;
          
        case 'popover':
          if ($.fn.popover) {
            $('[data-toggle="popover"]').popover('dispose').popover();
          }
          break;
          
        default:
          // Reinitialize all components
          if ($.fn.tooltip) $('[data-toggle="tooltip"]').tooltip('dispose').tooltip();
          if ($.fn.popover) $('[data-toggle="popover"]').popover('dispose').popover();
          if ($.fn.owlCarousel) {
            $('.owl-carousel').each(function() {
              const $carousel = $(this);
              if ($carousel.data('owl.carousel')) {
                $carousel.trigger('destroy.owl.carousel').removeClass('owl-loaded');
                setTimeout(() => {
                  try {
                    const dataOptions = $carousel.data('owl-options');
                    let options = { 
                      loop: true, 
                      margin: 0, 
                      responsiveClass: true,
                      nav: false,
                      dots: true,
                      items: 1
                    };
                    
                    if (dataOptions) {
                      try {
                        options = { 
                          ...options, 
                          ...JSON.parse(dataOptions.replace(/'/g, '"').replace(';', ''))
                        };
                      } catch (e) {}
                    }
                    
                    $carousel.owlCarousel(options);
                  } catch (e) {
                    console.error("Error reinitializing carousel:", e);
                  }
                }, 100);
              }
            });
          }
      }
    });
  }, delay);
};

/**
 * Wait for jQuery to be fully loaded and available
 * @param {Function} callback Function to call when jQuery is available
 * @param {number} maxAttempts Maximum number of attempts to check for jQuery
 * @param {number} interval Time in milliseconds between attempts
 */
export const waitForJQuery = (callback, maxAttempts = 20, interval = 100) => {
  let attempts = 0;
  
  const checkJQuery = () => {
    if (isJQueryAvailable()) {
      callback(jQuery);
    } else if (attempts < maxAttempts) {
      attempts++;
      setTimeout(checkJQuery, interval);
    } else {
      console.error('jQuery not available after maximum attempts');
    }
  };
  
  checkJQuery();
};

export default {
  isJQueryAvailable,
  isPluginAvailable,
  safeJQuery,
  reinitializeJQuery,
  waitForJQuery
};
