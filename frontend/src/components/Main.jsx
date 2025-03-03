import { useEffect, useRef } from "react";
import Hero from "../elements/Hero";
import InfoBoxes from "../elements/InfoBoxes";
import PopularCategories from "../elements/PopularCategories";
import PopularProducts from "../elements/PopularProducts";
import Specials from "../elements/Specials";
import BannersHome from "../elements/BannersHome";
import ForYou from "../elements/ForYou";
import useJQueryInitializer from "../hooks/useJQueryInitializer";

export default function Main() {
  // Reference to the main container to help track when it's mounted
  const mainRef = useRef(null);

  // Initialize jQuery plugins needed for the Main component
  const { initializePlugins } = useJQueryInitializer({
    plugins: ['owlCarousel'],
    // Use the main component's mounting as a dependency
    dependencies: [mainRef.current]
  });

  // After mount, ensure carousels and other jQuery-dependent elements are properly initialized
  useEffect(() => {
    if (!mainRef.current || typeof $ === 'undefined') {
      return;
    }

    // Initialize specific elements in this component
    const initSpecificElements = () => {
      // Find all carousel elements within this component
      $(mainRef.current).find('.owl-carousel').each(function() {
        const $carousel = $(this);
        
        // Skip if already initialized
        if ($carousel.hasClass('owl-loaded')) {
          return;
        }
        
        // Get custom options
        let options = {
          loop: true,
          margin: 0,
          nav: true,
          dots: true,
          items: 1,
          autoplay: true,
          autoplayTimeout: 8000
        };
        
        // Apply custom options if specified via data-attribute
        const dataOptions = $carousel.data('owl-options');
        if (dataOptions) {
          try {
            const parsedOptions = JSON.parse(dataOptions.replace(/'/g, '"').replace(';', ''));
            options = { ...options, ...parsedOptions };
          } catch (e) {
            console.error("Error parsing owl carousel options", e);
          }
        }
        
        // Initialize or re-initialize carousel
        $carousel.owlCarousel(options);
      });
      
      // Initialize newsletter form validation if it exists
      const $newsletterForm = $(mainRef.current).find('.newsletter-section form');
      if ($newsletterForm.length) {
        $newsletterForm.on('submit', function(e) {
          e.preventDefault();
          const email = $(this).find('input[type="email"]').val();
          if (!email) {
            return;
          }
          
          // Here you would normally submit the form via AJAX
          console.log('Newsletter subscription for:', email);
          // Show success message
          const $formWrapper = $(this).closest('.footer-submit-wrapper');
          $formWrapper.append('<div class="success-message">Thank you for subscribing!</div>');
          setTimeout(() => {
            $formWrapper.find('.success-message').fadeOut(function() {
              $(this).remove();
            });
          }, 3000);
          
          // Clear the input
          $(this).find('input[type="email"]').val('');
        });
      }
    };
    
    // Wait for DOM to be ready and give a small delay for React to finish rendering
    $(document).ready(function() {
      setTimeout(initSpecificElements, 200);
    });
    
    // Manually call initialization when needed (can be used by parent components)
    initializePlugins();
    
    // Cleanup on unmount
    return () => {
      if (typeof $ !== 'undefined') {
        $(mainRef.current).find('.owl-carousel').trigger('destroy.owl.carousel');
        $(mainRef.current).find('.newsletter-section form').off('submit');
      }
    };
  }, [initializePlugins]);

  return (
    <main className="bg-gray" ref={mainRef}>
      <Hero />
      <section className="popular-section">
        <div className="container">
          <InfoBoxes />
          <PopularCategories />
          <PopularProducts />
        </div>
      </section>
      <section className="special-section">
        <div className="container">
          <Specials />
          <BannersHome />
          <ForYou />
        </div>
      </section>
      <section
        className="newsletter-section appear-animate"
        data-animation-name="fadeInUpShorter"
        data-animation-delay={200}
      >
        <div className="container">
          <div className="row no-gutters m-0 align-items-center">
            <div className="col-lg-6 col-xl-4 mb-2 mb-lg-0">
              <div className="info-box d-block d-sm-flex text-center text-sm-left">
                <i className="icon-envolope text-dark mr-4" />
                <div className="widget-newsletter-info">
                  <h4 className="font-weight-bold line-height-1">
                    Subscribe To Our Newsletter
                  </h4>
                  <p className="font2">
                    Get all the latest information on Events, Sales and Offers.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-xl-8">
              <form action="#" className="mb-0">
                <div className="footer-submit-wrapper d-flex">
                  <input
                    type="email"
                    className="form-control rounded mb-0"
                    placeholder="Your E-mail Address"
                    size={40}
                    required
                  />
                  <button type="submit" className="btn btn-primary">
                    Subscribe Now!
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}