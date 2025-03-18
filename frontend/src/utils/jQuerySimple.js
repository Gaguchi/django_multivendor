/**
 * A simpler approach to jQuery initialization that avoids redundancy
 */

// Track initialization time to prevent frequent reinitializations
let lastInitTime = 0;
const THROTTLE_TIME = 1000; // Minimum time between initializations (ms)

/**
 * Check if jQuery and its plugins are available
 */
const isJQueryReady = () => {
  if (typeof window === 'undefined') return false;
  if (typeof jQuery === 'undefined') return false;
  
  // Check for essential plugins
  const hasOwlCarousel = typeof jQuery.fn.owlCarousel === 'function';
  const hasTooltip = typeof jQuery.fn.tooltip === 'function';
  
  return hasOwlCarousel && hasTooltip;
};

/**
 * Initialize jQuery plugins with throttling to prevent excessive calls
 */
export const initializePage = () => {
  const now = Date.now();
  
  // Skip initialization if throttled
  if (now - lastInitTime < THROTTLE_TIME) {
    return;
  }
  
  lastInitTime = now;
  
  // Use setTimeout to ensure DOM is ready
  setTimeout(() => {
    if (!isJQueryReady()) {
      console.log('jQuery or required plugins not available yet');
      return;
    }
    
    console.log('Initializing page jQuery components');
    
    try {
      // Initialize owl carousels
      initOwlCarousels();
      
      // Initialize tooltips
      initTooltips();
      
      // Initialize any other common components
      initMisc();
    } catch (error) {
      console.error('Error initializing jQuery components:', error);
    }
  }, 300);
};

/**
 * Initialize Owl Carousel instances
 */
const initOwlCarousels = () => {
  try {
    if (!jQuery.fn.owlCarousel) return;
    
    jQuery('.owl-carousel').each(function() {
      const $this = jQuery(this);
      
      // Skip if already initialized
      if ($this.data('owl.carousel')) {
        return;
      }
      
      // Get options from data attribute
      let options = {
        loop: true,
        margin: 0,
        responsiveClass: true,
        nav: false,
        dots: true,
        items: 1
      };
      
      const dataOptions = $this.data('owl-options');
      if (dataOptions) {
        try {
          const parsedOptions = JSON.parse(dataOptions.replace(/'/g, '"').replace(';', ''));
          options = { ...options, ...parsedOptions };
        } catch (e) {
          console.error("Error parsing carousel options", e);
        }
      }
      
      // Initialize carousel
      $this.owlCarousel(options);
    });
  } catch (e) {
    console.error("Error initializing owl carousels:", e);
  }
};

/**
 * Initialize Bootstrap tooltips
 */
const initTooltips = () => {
  try {
    if (!jQuery.fn.tooltip) return;
    
    // First dispose any existing tooltips to prevent duplicates
    jQuery('[data-toggle="tooltip"]').tooltip('dispose');
    
    // Initialize tooltips
    jQuery('[data-toggle="tooltip"]').tooltip({
      trigger: 'hover focus'
    });
  } catch (e) {
    console.error("Error initializing tooltips:", e);
  }
};

/**
 * Initialize miscellaneous jQuery components
 */
const initMisc = () => {
  try {
    // Initialize TouchSpin if available
    if (jQuery.fn.TouchSpin) {
      jQuery('.horizontal-quantity').TouchSpin({
        verticalbuttons: false,
        buttonup_txt: '',
        buttondown_txt: '',
        buttondown_class: 'btn btn-outline btn-down-icon',
        buttonup_class: 'btn btn-outline btn-up-icon',
        initval: 1,
        min: 1
      });
    }
    
    // Initialize popover if available
    if (jQuery.fn.popover) {
      jQuery('[data-toggle="popover"]').popover({
        trigger: 'focus'
      });
    }
  } catch (e) {
    console.error("Error initializing misc components:", e);
  }
};

export default {
  initializePage,
  isJQueryReady
};
