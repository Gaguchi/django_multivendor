import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Hook to properly initialize jQuery plugins in React components
 * 
 * @param {Object} options Configuration options
 * @param {Array} options.dependencies Additional dependencies for the effect
 * @param {boolean} options.skipFirstRender Whether to skip first render initialization
 * @param {Array} options.plugins List of specific plugins to initialize
 * @returns {Object} Object containing utility methods
 */
export default function useJQueryInitializer(options = {}) {
  const location = useLocation();
  const { 
    dependencies = [], 
    skipFirstRender = false,
    plugins = []
  } = options;

  // Function to initialize all requested jQuery plugins
  const initializePlugins = () => {
    // Make sure jQuery is available
    if (typeof $ === 'undefined') {
      console.error('jQuery is not defined');
      return;
    }

    // Wait for DOM to be ready
    $(document).ready(function() {
      console.log('jQuery initializing plugins:', plugins.length ? plugins : 'all');
      
      // Initialize common jQuery plugins
      initOwlCarousels();

      // Initialize plugin-specific functionality
      if (plugins.includes('tooltip') || plugins.length === 0) {
        initTooltips();
      }
      
      if (plugins.includes('popover') || plugins.length === 0) {
        initPopovers();
      }
      
      if (plugins.includes('touchSpin') || plugins.length === 0) {
        initTouchSpin();
      }
    });
  };

  // Function to initialize owl carousels
  const initOwlCarousels = () => {
    if (!$.fn.owlCarousel) return;
    
    // Default options for owl carousel
    const defaultOptions = {
      loop: true,
      margin: 0,
      responsiveClass: true,
      nav: false,
      navText: ['<i class="icon-angle-left">', '<i class="icon-angle-right">'],
      dots: true,
      autoplay: false,
      autoplayTimeout: 15000,
      items: 1
    };
    
    // Initialize all non-initialized owl carousels
    $('.owl-carousel:not(.owl-loaded)').each(function() {
      const $this = $(this);
      let options = { ...defaultOptions };
      
      // Get custom options from data attribute
      const dataOptions = $this.data('owl-options');
      if (dataOptions) {
        try {
          const parsedOptions = JSON.parse(dataOptions.replace(/'/g, '"').replace(';', ''));
          options = { ...options, ...parsedOptions };
        } catch (e) {
          console.error("Error parsing owl carousel options", e);
        }
      }
      
      // Special handling for specific carousels
      if ($this.hasClass('home-slider')) {
        options = {
          ...options,
          autoplay: true,
          autoplayTimeout: 12000,
          animateOut: 'fadeOut',
          lazyLoad: true,
          navText: ['<i class="icon-left-open-big">', '<i class="icon-right-open-big">']
        };
      }
      
      // Initialize the carousel
      try {
        $this.owlCarousel(options);
        
        // Add loaded class for home slider
        if ($this.hasClass('home-slider')) {
          $this.on('loaded.owl.lazy', function(e) {
            $(e.element).closest('.home-slide').addClass('loaded');
            $(e.element).closest('.home-slider').addClass('loaded');
          });
        }
      } catch (error) {
        console.error("Error initializing owl carousel", error);
      }
    });
  };

  // Function to initialize tooltips
  const initTooltips = () => {
    if ($.fn.tooltip) {
      $('[data-toggle="tooltip"]').tooltip({
        trigger: 'hover focus'
      });
    }
  };

  // Function to initialize popovers
  const initPopovers = () => {
    if ($.fn.popover) {
      $('[data-toggle="popover"]').popover({
        trigger: 'focus'
      });
    }
  };

  // Function to initialize TouchSpin
  const initTouchSpin = () => {
    if ($.fn.TouchSpin) {
      $('.horizontal-quantity').TouchSpin({
        verticalbuttons: false,
        buttonup_txt: '',
        buttondown_txt: '',
        buttondown_class: 'btn btn-outline btn-down-icon',
        buttonup_class: 'btn btn-outline btn-up-icon',
        initval: 1,
        min: 1
      });
    }
  };

  useEffect(() => {
    // Skip initialization if this is the first render and skipFirstRender is true
    if (skipFirstRender && !dependencies.length) {
      return;
    }
    
    // Initialize jQuery plugins
    initializePlugins();
    
    // Clean up on unmount
    return () => {
      if (typeof $ !== 'undefined') {
        // Destroy tooltips and popovers
        if ($.fn.tooltip) $('[data-toggle="tooltip"]').tooltip('dispose');
        if ($.fn.popover) $('[data-toggle="popover"]').popover('dispose');
      }
    };
  }, [location.pathname, ...dependencies]);

  // Return utility methods
  return { initializePlugins };
}
