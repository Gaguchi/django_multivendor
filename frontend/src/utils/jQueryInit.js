/**
 * This utility provides functions to initialize jQuery plugins globally
 * without modifying individual components
 */

/**
 * Initialize all jQuery plugins needed across the application
 */
export function initializeJQueryPlugins() {
  if (typeof $ === 'undefined') {
    console.error('jQuery is not available');
    return;
  }

  $(document).ready(function() {
    // Initialize owl carousels
    initOwlCarousels();
    
    // Initialize tooltips
    initTooltips();
    
    // Initialize popovers
    initPopovers();
    
    // Initialize touch spin
    initTouchSpin();
    
    // Initialize appearance animations
    initAppearAnimations();
    
    // Initialize superfish menus
    initSuperfish();
  });
}

/**
 * Initialize owl carousels across the site
 */
function initOwlCarousels() {
  if (!$.fn.owlCarousel) return;
  
  $('.owl-carousel:not(.owl-loaded)').each(function() {
    const $this = $(this);
    let options = {
      loop: true,
      margin: 0,
      nav: true,
      navText: ['<i class="icon-angle-left">', '<i class="icon-angle-right">'],
      dots: true,
      autoplay: false,
      autoplayTimeout: 15000,
      items: 1
    };
    
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
    
    // Apply special options for specific carousel types
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
    
    try {
      $this.owlCarousel(options);
      
      // Special handlers for specific carousels
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
}

/**
 * Initialize tooltips
 */
function initTooltips() {
  if ($.fn.tooltip) {
    $('[data-toggle="tooltip"]').tooltip({
      trigger: 'hover focus'
    });
  }
}

/**
 * Initialize popovers
 */
function initPopovers() {
  if ($.fn.popover) {
    $('[data-toggle="popover"]').popover({
      trigger: 'focus'
    });
  }
}

/**
 * Initialize TouchSpin inputs
 */
function initTouchSpin() {
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
    
    $('.vertical-quantity').TouchSpin({
      verticalbuttons: true,
      verticalup: '',
      verticaldown: '',
      verticalupclass: 'icon-up-dir',
      verticaldownclass: 'icon-down-dir',
      buttondown_class: 'btn btn-outline',
      buttonup_class: 'btn btn-outline',
      initval: 1,
      min: 1
    });
  }
}

/**
 * Initialize animations for appearing elements
 */
function initAppearAnimations() {
  $('.appear-animate').each(function() {
    const $this = $(this);
    if (!$this.hasClass('animated')) {
      const animationName = $this.data('animation-name') || 'fadeIn';
      const animationDuration = $this.data('animation-duration') || 1000;
      const animationDelay = $this.data('animation-delay') || 0;
      
      $this.addClass('animated');
      setTimeout(() => {
        $this.addClass(animationName);
        $this.css('animationDuration', animationDuration + 'ms');
        $this.addClass('appear-animation-visible');
      }, parseInt(animationDelay));
    }
  });
}

/**
 * Initialize superfish menus
 */
function initSuperfish() {
  if ($.fn.superfish) {
    $('.menu:not(.menu-vertical):not(.no-superfish)').superfish({
      popUpSelector: 'ul, .megamenu',
      hoverClass: 'show',
      delay: 0,
      speed: 80,
      speedOut: 80,
      autoArrows: true
    });
  }
}
