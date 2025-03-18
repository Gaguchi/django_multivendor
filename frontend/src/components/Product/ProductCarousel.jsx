import { useEffect, useRef } from 'react';

export default function ProductCarousel({ images = [], productName = '' }) {
  const mainCarouselRef = useRef(null);
  const thumbsCarouselRef = useRef(null);
  
  // Simple jQuery initialization for this specific component
  useEffect(() => {
    if (typeof jQuery === 'undefined' || !jQuery.fn.owlCarousel) {
      return;
    }
    
    const $mainCarousel = jQuery(mainCarouselRef.current);
    const $thumbsCarousel = jQuery(thumbsCarouselRef.current);
    
    // Only initialize if not already done
    if (!$mainCarousel.data('owl.carousel')) {
      // Initialize main carousel
      $mainCarousel.owlCarousel({
        items: 1,
        nav: false,
        dots: false,
        loop: false,
        margin: 0
      });
    }
    
    if (!$thumbsCarousel.data('owl.carousel')) {
      // Initialize thumbnail carousel
      $thumbsCarousel.owlCarousel({
        items: 4,
        margin: 10,
        nav: true,
        dots: false,
        navText: ['<i class="icon-angle-left">', '<i class="icon-angle-right">']
      });
      
      // Link thumbnail clicks to main carousel
      $thumbsCarousel.find('.owl-item').on('click', function() {
        const index = jQuery(this).index();
        $mainCarousel.trigger('to.owl.carousel', [index, 300, true]);
      });
    }
    
    // Clean up on unmount
    return () => {
      try {
        if ($mainCarousel.data('owl.carousel')) {
          $mainCarousel.trigger('destroy.owl.carousel');
        }
        if ($thumbsCarousel.data('owl.carousel')) {
          $thumbsCarousel.trigger('destroy.owl.carousel');
        }
      } catch (e) {
        console.error('Error cleaning up carousels:', e);
      }
    };
  }, [images.length]); // Only re-run if images change
  
  return (
    <div className="product-gallery">
      <div className="main-carousel-container">
        <div ref={mainCarouselRef} className="owl-carousel product-single-carousel">
          {images.map((image, index) => (
            <div key={index} className="product-item">
              <img 
                src={image.src || image.image || image} 
                alt={`${productName} - Image ${index + 1}`} 
                className="product-single-image" 
              />
            </div>
          ))}
        </div>
      </div>
      
      {images.length > 1 && (
        <div className="prod-thumbnail">
          <div ref={thumbsCarouselRef} className="owl-carousel owl-theme prod-thumbnail-carousel">
            {images.map((image, index) => (
              <div key={index} className="owl-item">
                <img 
                  src={image.thumbnail || image.src || image.image || image} 
                  alt={`${productName} - Thumbnail ${index + 1}`}
                  width="80"
                  height="80" 
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
