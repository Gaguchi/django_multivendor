import React, { useEffect } from 'react';
import Main from '../components/Main';
import useJQueryInitializer from '../hooks/useJQueryInitializer';

export default function Home() {
  // Initialize jQuery plugins specifically needed for the home page
  const { initializePlugins } = useJQueryInitializer({
    plugins: [
      'owlCarousel',    // For all sliders and carousels
      'superfish',      // For menus
      'tooltip',        // For tooltips
      'touchSpin'       // For quantity inputs
    ],
    skipFirstRender: false // Initialize on first render
  });

  // Additional effect to handle specific home page components
  useEffect(() => {
    // Make sure jQuery is available
    if (typeof $ === 'undefined') {
      console.error('jQuery is not available');
      return;
    }

    // Re-initialize specific home page carousels after component has fully mounted
    setTimeout(() => {
      // Reinitialize and fix any carousels that may not have initialized properly
      $('.owl-carousel:not(.owl-loaded)').each(function() {
        const $this = $(this);
        
        // Get custom options from data attribute if available
        let options = {
          loop: true,
          margin: 20,
          nav: true,
          dots: false,
          items: 1,
          responsive: {
            576: { items: 2 },
            992: { items: 3 }
          }
        };
        
        const dataOptions = $this.data('owl-options');
        if (dataOptions) {
          try {
            const parsedOptions = JSON.parse(dataOptions.replace(/'/g, '"').replace(';', ''));
            options = { ...options, ...parsedOptions };
          } catch (e) {
            console.error("Error parsing owl carousel options", e);
          }
        }
        
        // Initialize carousel
        $this.owlCarousel(options);
      });
      
      // Initialize any appearance animations
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
    }, 500);
    
    return () => {
      // Clean up any event handlers or plugins on unmount
      $('.owl-carousel').trigger('destroy.owl.carousel');
    };
  }, []);

  return (
    <>
      <Main />
    </>
  );
}