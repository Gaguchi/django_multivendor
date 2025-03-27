import React, { useEffect, useRef, useState } from 'react'
import { setupImageZoom } from '../../utils/imageZoom'

export default function Images({ product, selectedImage, setSelectedImage }) {
  // Extract image URLs from the product.images array
  const imageUrls = product.images ? product.images.map(img => img.file) : []
  
  // Combine thumbnail with additional images
  const allImages = [product.thumbnail, ...imageUrls]
  
  const carouselRef = useRef(null)
  const carouselContainerRef = useRef(null)
  const thumbsRef = useRef(null)
  const thumbsWrapRef = useRef(null)
  const thumbUpRef = useRef(null)
  const thumbDownRef = useRef(null)
  const zoomContainerRef = useRef(null)
  
  // Use fixed height instead of dynamic state to prevent recursive updates
  const fixedHeightRef = useRef(null)
  
  // Debug mode toggle for zoom functionality
  const DEBUG_ZOOM = true
  
  // Function to adjust thumbnails wrapper height
  const adjustThumbsHeight = () => {
    if (carouselContainerRef.current && thumbsWrapRef.current) {
      // Get the actual height of the carousel container
      const carouselHeight = carouselContainerRef.current.clientHeight;
      
      // Limit maximum height to prevent infinite growth
      const maxHeight = 220; // Maximum reasonable height in pixels
      const newHeight = Math.min(carouselHeight, maxHeight);
      
      // Set fixed height reference
      fixedHeightRef.current = newHeight;
      
      // Apply directly to the DOM element
      if (thumbsWrapRef.current) {
        thumbsWrapRef.current.style.height = `${newHeight}px`;
      }
    }
  };

  useEffect(() => {
    let owlCarousel = null;
    let zoomCleanup = null;
    
    // Initialize main carousel
    if (carouselRef.current) {
      owlCarousel = $(carouselRef.current);
      
      owlCarousel.owlCarousel({
        items: 1,
        nav: true,
        navText: ['<i class="icon-angle-left"></i>', '<i class="icon-angle-right"></i>'],
        dots: false,
        loop: false,
        margin: 0,
        autoplay: false,
        startPosition: selectedImage,
        onInitialized: () => {
          // Adjust heights after carousel is fully initialized with a slight delay
          setTimeout(() => {
            adjustThumbsHeight();
            
            // Setup zoom with debugging enabled
            if (zoomCleanup) zoomCleanup(); // Clean up previous zoom
            zoomCleanup = setupImageZoom(zoomContainerRef.current, DEBUG_ZOOM);
          }, 200);
        },
        onChanged: (e) => {
          setSelectedImage(e.item.index);
          
          // Update active thumbnail
          if (thumbsRef.current) {
            $(thumbsRef.current).find('.owl-dot').removeClass('active');
            $(thumbsRef.current).find(`.owl-dot:eq(${e.item.index})`).addClass('active');
          }
          
          // Update zoom for new image
          setTimeout(() => {
            if (zoomCleanup) zoomCleanup(); // Clean up previous zoom
            zoomCleanup = setupImageZoom(zoomContainerRef.current, DEBUG_ZOOM);
          }, 100);
        }
      });
      
      // Sync carousel with selected image
      if (selectedImage !== 0) {
        owlCarousel.trigger('to.owl.carousel', [selectedImage, 300, true]);
      }
    }
    
    // Setup thumbnails
    if (thumbsRef.current) {
      // Set active state on thumbnail click
      $(thumbsRef.current).find('.owl-dot').on('click', function() {
        $(thumbsRef.current).find('.owl-dot').removeClass('active');
        $(this).addClass('active');
        const index = $(this).index();
        setSelectedImage(index);
        
        if (owlCarousel) {
          owlCarousel.trigger('to.owl.carousel', [index, 300, true]);
        }
        
        // Update zoom for selected image
        setTimeout(() => {
          if (zoomCleanup) zoomCleanup(); // Clean up previous zoom
          zoomCleanup = setupImageZoom(zoomContainerRef.current, DEBUG_ZOOM);
        }, 100);
      });
    }
    
    // Add thumb navigation
    const $thumbsWrap = $(thumbsWrapRef.current);
    const $productThumbs = $thumbsWrap.find('.product-thumbs');
    
    // Function to check and update buttons state
    const updateNavButtonState = () => {
      if (!thumbsWrapRef.current || !thumbUpRef.current || !thumbDownRef.current) return;
      
      const wrapHeight = $thumbsWrap.height();
      const currentTop = parseInt($productThumbs.css('top'), 10) || 0;
      const thumbsHeight = $productThumbs.height();
      
      // Enable/disable up button
      if (currentTop >= 0) {
        thumbUpRef.current.classList.add('disabled');
      } else {
        thumbUpRef.current.classList.remove('disabled');
      }
      
      // Enable/disable down button
      if (wrapHeight >= thumbsHeight + currentTop) {
        thumbDownRef.current.classList.add('disabled');
      } else {
        thumbDownRef.current.classList.remove('disabled');
      }
    };
    
    // Initial button state check after images load
    setTimeout(updateNavButtonState, 500);
    
    // Up button click handler using React refs
    const handleThumbUp = () => {
      if (!thumbUpRef.current || !thumbsWrapRef.current) return;
      if (thumbUpRef.current.classList.contains('disabled')) return;
      
      const currentTop = parseInt($productThumbs.css('top'), 10) || 0;
      const newTop = Math.min(currentTop + 100, 0);
      
      $productThumbs.css('top', newTop + 'px');
      updateNavButtonState();
    };
    
    // Down button click handler using React refs
    const handleThumbDown = () => {
      if (!thumbDownRef.current || !thumbsWrapRef.current) return;
      if (thumbDownRef.current.classList.contains('disabled')) return;
      
      const wrapHeight = $thumbsWrap.height();
      const currentTop = parseInt($productThumbs.css('top'), 10) || 0;
      const thumbsHeight = $productThumbs.height();
      
      // Only scroll down if there's more content to show
      if (wrapHeight < thumbsHeight + currentTop) {
        const newTop = Math.max(currentTop - 100, wrapHeight - thumbsHeight);
        $productThumbs.css('top', newTop + 'px');
        updateNavButtonState();
      }
    };
    
    // Attach event listeners directly to the button elements
    const upButton = thumbUpRef.current;
    const downButton = thumbDownRef.current;
    
    if (upButton) {
      upButton.addEventListener('click', handleThumbUp);
    }
    
    if (downButton) {
      downButton.addEventListener('click', handleThumbDown);
    }
    
    // Handle window resize to recalculate button states and adjust heights
    const handleResize = () => {
      // Use a debounced approach to avoid multiple rapid adjustments
      clearTimeout(window.resizeTimer);
      window.resizeTimer = setTimeout(() => {
        adjustThumbsHeight();
        updateNavButtonState();
        
        // Re-initialize zoom on resize
        if (zoomCleanup) zoomCleanup();
        zoomCleanup = setupImageZoom(zoomContainerRef.current, DEBUG_ZOOM);
      }, 250);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Handle image load events
    const imageLoadHandler = () => {
      adjustThumbsHeight();
      
      // Re-initialize zoom when images load
      if (zoomCleanup) zoomCleanup();
      zoomCleanup = setupImageZoom(zoomContainerRef.current, DEBUG_ZOOM);
    };
    
    const carouselImages = document.querySelectorAll('.product-single-image');
    carouselImages.forEach(img => {
      img.addEventListener('load', imageLoadHandler);
    });
    
    // Run the height adjustment once initially
    adjustThumbsHeight();
    
    // Setup zoom initially
    zoomCleanup = setupImageZoom(zoomContainerRef.current, DEBUG_ZOOM);
    
    // Clean up function
    return () => {
      // Destroy carousel instances
      if (owlCarousel) {
        owlCarousel.trigger('destroy.owl.carousel');
      }
      
      // Clean up zoom
      if (zoomCleanup) {
        zoomCleanup();
      }
      
      // Remove event listeners
      if (thumbsRef.current) {
        $(thumbsRef.current).find('.owl-dot').off('click');
      }
      
      if (upButton) {
        upButton.removeEventListener('click', handleThumbUp);
      }
      
      if (downButton) {
        downButton.removeEventListener('click', handleThumbDown);
      }
      
      window.removeEventListener('resize', handleResize);
      
      carouselImages.forEach(img => {
        img.removeEventListener('load', imageLoadHandler);
      });
      
      // Clear any pending resize timers
      clearTimeout(window.resizeTimer);
    };
  }, [allImages, selectedImage, setSelectedImage, DEBUG_ZOOM]);
  
  // Get height from ref instead of state
  const getThumbsWrapStyles = () => {
    return {
      height: fixedHeightRef.current ? `${fixedHeightRef.current}px` : '500px',
      overflow: 'hidden'
    };
  };
  
  const productThumbsStyles = {
    position: 'relative',
    top: 0,
    transition: 'top 0.3s ease'
  };
  
  const thumbStyles = {
    marginBottom: '15px',
    cursor: 'pointer',
    maxWidth: '100%',
    transition: 'all 0.3s ease'
  };

  // Apply responsive styles using CSS classes
  const getResponsiveClasses = () => {
    return "product-single-gallery pg-vertical responsive-gallery";
  };

  return (
    <>
      {/* Image Gallery */}
      <div className="col-12 col-lg-4">
        <div className={getResponsiveClasses()}>
          <div className="product-slider-container" ref={carouselContainerRef}>
            <div 
              ref={carouselRef} 
              className="product-single-carousel owl-carousel owl-theme show-nav-hover"
            >
              {allImages.map((img, idx) => (
                <div key={idx} className="product-item">
                  <img 
                    className="product-single-image" 
                    src={img}
                    alt={`${product.name}-${idx}`} 
                    style={{ width: '100%', height: 'auto' }}
                  />
                </div>
              ))}
            </div>

            {/* Custom zoom container - now with explicit positioning context */}
            <div ref={zoomContainerRef} className="product-zoom-container"></div>
            
            <span className="prod-full-screen">
              <i className="icon-plus"></i>
            </span>
          </div>

          <div className="vertical-thumbs">
            <button 
              ref={thumbUpRef} 
              className="thumb-up disabled"
              type="button"
            >
              <i className="icon-angle-up"></i>
            </button>
            <div className="product-thumbs-wrap" ref={thumbsWrapRef} style={getThumbsWrapStyles()}>
              <div 
                ref={thumbsRef} 
                className="product-thumbs owl-dots" 
                id="carousel-custom-dots" 
                style={productThumbsStyles}
              >
                {allImages.map((img, idx) => (
                  <div 
                    key={idx} 
                    className={`owl-dot ${selectedImage === idx ? 'active' : ''}`}
                    style={thumbStyles}
                  >
                    <img 
                      src={img} 
                      alt={`${product.name}-thumbnail-${idx}`}
                      style={{width: '100%', height: 'auto'}}
                      draggable="false"
                    />
                  </div>
                ))}
              </div>
            </div>
            <button 
              ref={thumbDownRef} 
              className="thumb-down"
              type="button"
            >
              <i className="icon-angle-down"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Add custom CSS for responsive gallery and zoom functionality */}
      <style jsx>{`
        .pg-vertical .product-slider-container {
          max-width: calc(100% - 52px);
          position: relative;
          z-index: 20;
        }

        /* Create a new stacking context */
        .product-slider-container {
          isolation: isolate; /* Modern browsers */
          transform: translateZ(0); /* Fallback for older browsers */
        }

        /* Force position and z-index */
        .product-zoom-container {
          position: absolute !important;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 2000 !important;
          pointer-events: none;
          transform: translateZ(0);
        }
        
        .img-zoom-lens {
          position: absolute !important;
          border: 1px solid #d4d4d4;
          background-color: rgba(0, 0, 0, 0.2);
          width: 100px;
          height: 100px;
          display: none;
          cursor: crosshair;
          z-index: 3000 !important;
          pointer-events: none;
        }
        
        .img-zoom-result {
          position: absolute !important;
          right: -320px;
          top: 0;
          border: 1px solid #d4d4d4;
          width: 300px;
          height: 300px;
          background-repeat: no-repeat;
          display: none;
          z-index: 9999 !important;
          pointer-events: none;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
          transform: translateZ(0);
        }
        
        /* Make sure the active image gets pointer events */
        .product-single-carousel .active .product-single-image {
          pointer-events: auto;
          z-index: 10;
        }
        
        @media (max-width: 991px) {
          .responsive-gallery .product-thumbs .owl-dot {
            margin-bottom: 8px;
          }
          
          .img-zoom-result {
            display: none !important;
          }
        }

        .pg-vertical {
          display: flex;
          flex-wrap: nowrap;
          margin-bottom: 1rem;
          position: sticky;
        }
        /* Global styles to ensure zoom container is above all content */
        #root .img-zoom-result {
          z-index: 9999 !important;
          position: absolute !important;
        }
        
        /* Create global override */
        body .img-zoom-result {
          position: absolute !important;
          z-index: 9999 !important;
        }
      `}</style>
    </>
  )
}