/**
 * Simplified approach to jQuery initialization
 * This will be the single source of truth for jQuery initialization
 */

// Track initialization to prevent redundancy
let isInitialized = false;
let lastInitTime = 0;
const THROTTLE_TIME = 300; // Minimum time between initializations (ms)
const COMPONENTS_INITIALIZED = new Set(); // Track which specific components are initialized

/**
 * Check if jQuery and its plugins are available
 */
const isJQueryReady = () => {
  if (typeof window === 'undefined') return false;
  if (typeof jQuery === 'undefined') return false;
  
  return true;
};

/**
 * Initialize all jQuery plugins on page load
 * Only runs once per page navigation
 */
export const initializePage = () => {
  const now = Date.now();
  
  // Check if initialization should be throttled
  if (now - lastInitTime < THROTTLE_TIME) {
    return;
  }
  
  lastInitTime = now;
  
  // Use setTimeout to ensure DOM is ready
  setTimeout(() => {
    if (!isJQueryReady()) {
      console.warn('jQuery not available yet, will retry on next navigation');
      return;
    }
    
    console.log('Initializing page jQuery components');
    
    try {
      // Initialize all components if needed
      initializeComponents();
      
      // Mark as initialized
      isInitialized = true;
    } catch (error) {
      console.error('Error initializing jQuery components:', error);
    }
  }, 300); // Delay to ensure DOM is ready
};

/**
 * Force reinitialization of all components (use sparingly)
 */
export const forceReinitialize = () => {
  isInitialized = false;
  COMPONENTS_INITIALIZED.clear();
  initializePage();
};

/**
 * Initialize a specific component if it hasn't been initialized
 * @param {string} name Component name to initialize
 */
export const initializeComponent = (name) => {
  // Skip if already initialized
  if (COMPONENTS_INITIALIZED.has(name)) {
    return;
  }
  
  if (!isJQueryReady()) {
    return;
  }
  
  try {
    switch (name) {
      case 'owlCarousel':
        initOwlCarousels();
        break;
      case 'tooltip':
        initTooltips();
        break;
      case 'popover':
        initPopovers();
        break;
      case 'touchSpin':
        initTouchSpin();
        break;
      default:
        console.warn(`Unknown component: ${name}`);
        return;
    }
    
    // Mark this component as initialized
    COMPONENTS_INITIALIZED.add(name);
  } catch (error) {
    console.error(`Error initializing ${name}:`, error);
  }
};

/**
 * Initialize all components
 */
const initializeComponents = () => {
  try {
    // Initialize carousels
    initOwlCarousels();
    COMPONENTS_INITIALIZED.add('owlCarousel');
    
    // Initialize tooltips
    initTooltips();
    COMPONENTS_INITIALIZED.add('tooltip');
    
    // Initialize popovers
    initPopovers();
    COMPONENTS_INITIALIZED.add('popover');
    
    // Initialize TouchSpin
    initTouchSpin();
    COMPONENTS_INITIALIZED.add('touchSpin');
    
    // Initialize any other components
  } catch (e) {
    console.error("Error initializing components:", e);
  }
};

/**
 * Initialize Owl Carousel instances
 */
const initOwlCarousels = () => {
  try {
    if (!jQuery.fn.owlCarousel) return;
    
    // Exclude React-managed containers to prevent conflicts
    jQuery('.owl-carousel:not(.owl-loaded)').not('[data-react-managed]').each(function() {
      const $this = jQuery(this);
      
      // Skip if already initialized
      if ($this.data('owl.carousel')) {
        return;
      }
      
      // Skip if inside a React component container
      if ($this.closest('[data-reactroot], .react-component, [id*="react"]').length > 0) {
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
 * Initialize Bootstrap popovers
 */
const initPopovers = () => {
  try {
    if (!jQuery.fn.popover) return;
    
    // First dispose any existing popovers to prevent duplicates
    jQuery('[data-toggle="popover"]').popover('dispose');
    
    // Initialize popovers
    jQuery('[data-toggle="popover"]').popover({
      trigger: 'focus'
    });
  } catch (e) {
    console.error("Error initializing popovers:", e);
  }
};

/**
 * Initialize TouchSpin
 */
const initTouchSpin = () => {
  try {
    if (!jQuery.fn.TouchSpin) return;
    
    jQuery('.horizontal-quantity').TouchSpin({
      verticalbuttons: false,
      buttonup_txt: '',
      buttondown_txt: '',
      buttondown_class: 'btn btn-outline btn-down-icon',
      buttonup_class: 'btn btn-outline btn-up-icon',
      initval: 1,
      min: 1
    });
  } catch (e) {
    console.error("Error initializing TouchSpin:", e);
  }
};

export default {
  initializePage,
  forceReinitialize,
  initializeComponent,
  isJQueryReady
};
