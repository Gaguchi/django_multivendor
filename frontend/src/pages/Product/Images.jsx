import React, { useEffect, useRef, useState, useCallback } from 'react'
import { setupImageZoom } from '../../utils/imageZoom'
import styles from './Images.module.css'

export default function Images({ product, selectedImage, setSelectedImage }) {
  // Extract image URLs from the product.images array
  const imageUrls = product.images ? product.images.map(img => img.file) : []
  
  // Combine thumbnail with additional images
  const allImages = [product.thumbnail, ...imageUrls]
  
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [thumbsScrollPosition, setThumbsScrollPosition] = useState(0)
  const [canScrollUp, setCanScrollUp] = useState(false)
  const [canScrollDown, setCanScrollDown] = useState(true)
  const [imageLoaded, setImageLoaded] = useState(false)
  
  // Force zoom reset flag to trigger complete rebuild
  const [forceZoomReset, setForceZoomReset] = useState(0)
  
  const mainImageRef = useRef(null)
  const thumbsContainerRef = useRef(null)
  const thumbsWrapRef = useRef(null)
  const zoomContainerRef = useRef(null)
  const thumbnailsSectionRef = useRef(null)
  
  // Debug mode toggle for zoom functionality
  const DEBUG_ZOOM = true

  // Handle thumbnail navigation
  const scrollThumbs = useCallback((direction) => {
    if (!thumbsContainerRef.current || !thumbsWrapRef.current) return
    
    const thumbHeight = 95 // thumbnail height + margin
    const containerHeight = thumbsWrapRef.current.clientHeight
    const totalHeight = allImages.length * thumbHeight
    const maxScroll = Math.max(0, totalHeight - containerHeight)
    
    let newPosition = thumbsScrollPosition
    if (direction === 'up') {
      newPosition = Math.max(0, thumbsScrollPosition - thumbHeight * 2)
    } else {
      newPosition = Math.min(maxScroll, thumbsScrollPosition + thumbHeight * 2)
    }
    
    setThumbsScrollPosition(newPosition)
    setCanScrollUp(newPosition > 0)
    setCanScrollDown(newPosition < maxScroll)
    
    // Apply smooth scroll
    if (thumbsContainerRef.current) {
      thumbsContainerRef.current.style.transform = `translateY(-${newPosition}px)`
    }
  }, [thumbsScrollPosition, allImages.length])

  // Handle image selection with zoom cleanup
  const handleImageSelect = useCallback((index, source = 'unknown') => {
    console.log(`IMG ${selectedImage}→${index} [${source}] load:${imageLoaded}`)
    
    setSelectedImage(index)
    setImageLoaded(false)
    
    // Force complete zoom cleanup and DOM reset for new image
    if (zoomContainerRef.current) {
      // Remove ALL existing zoom elements globally
      const existingLens = document.querySelectorAll('.img-zoom-lens');
      const existingResult = document.querySelectorAll('.img-zoom-result');
      existingLens.forEach(el => el.remove());
      existingResult.forEach(el => el.remove());
      
      // Clear any mouseover states
      if (zoomContainerRef.current.style) {
        zoomContainerRef.current.style.cursor = 'crosshair';
      }
      
      // Force zoom system rebuild by incrementing reset counter
      setForceZoomReset(prev => prev + 1);
      
      console.log(`CLEANUP [${source}] lens:${existingLens.length} result:${existingResult.length}`)
    }
  }, [setSelectedImage, selectedImage, imageLoaded])

  // Handle navigation arrows with enhanced logging
  const handlePrevImage = useCallback(() => {
    const newIndex = selectedImage > 0 ? selectedImage - 1 : allImages.length - 1
    console.log(`⬅️ PREV ${selectedImage}→${newIndex}`)
    handleImageSelect(newIndex, 'prev-arrow')
  }, [selectedImage, allImages.length, handleImageSelect])

  const handleNextImage = useCallback(() => {
    const newIndex = selectedImage < allImages.length - 1 ? selectedImage + 1 : 0
    console.log(`➡️ NEXT ${selectedImage}→${newIndex}`)
    handleImageSelect(newIndex, 'next-arrow')
  }, [selectedImage, allImages.length, handleImageSelect])

  // Handle fullscreen toggle
  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(!isFullscreen)
  }, [isFullscreen])

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e) => {
    if (!isFullscreen) return
    
    console.log(`⌨️ KEY ${e.key} img:${selectedImage} fs:${isFullscreen}`)
    
    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault()
        handlePrevImage()
        break
      case 'ArrowRight':
        e.preventDefault()
        handleNextImage()
        break
      case 'Escape':
        console.log('⌨️ ESC - exit fullscreen')
        e.preventDefault()
        setIsFullscreen(false)
        break
    }
  }, [isFullscreen, handlePrevImage, handleNextImage, selectedImage])

  // Setup zoom and event listeners
  useEffect(() => {
    let zoomCleanup = null
    
    // Only setup zoom when image is loaded and container is ready
    if (!imageLoaded || !zoomContainerRef.current) {
      if (DEBUG_ZOOM) {
        console.log(`⏳ ZOOM skip load:${imageLoaded} cont:${!!zoomContainerRef.current}`)
      }
      return
    }
    
    // Small delay to ensure image is fully rendered
    const setupTimer = setTimeout(() => {
      if (zoomContainerRef.current) {
        if (DEBUG_ZOOM) {
          console.log(`ZOOM setup img:${selectedImage} reset:${forceZoomReset}`)
        }
        zoomCleanup = setupImageZoom(zoomContainerRef.current, DEBUG_ZOOM)
      }
    }, 100)
    
    // Cleanup function
    return () => {
      clearTimeout(setupTimer)
      if (zoomCleanup) {
        if (DEBUG_ZOOM) console.log('ZOOM cleanup effect')
        zoomCleanup()
        zoomCleanup = null
      }
    }
  }, [selectedImage, imageLoaded, forceZoomReset, DEBUG_ZOOM])

  // Separate effect for keyboard events
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown])

  // Initial height sync on component mount
  useEffect(() => {
    const initialSync = () => {
      if (zoomContainerRef.current && thumbnailsSectionRef.current) {
        const containerHeight = zoomContainerRef.current.offsetHeight
        if (containerHeight > 0) {
          thumbnailsSectionRef.current.style.height = `${containerHeight}px`
        }
      }
    }

    // Try to sync initially with a small delay
    const timer = setTimeout(initialSync, 300)
    
    return () => clearTimeout(timer)
  }, [])

  // Debug effect to track image changes
  useEffect(() => {
    console.log(`🔄 IMG change ${selectedImage} src:${allImages[selectedImage]?.slice(-20)} load:${imageLoaded}`)
  }, [selectedImage, allImages, imageLoaded])

  // Debug effect to track image load state changes
  useEffect(() => {
    console.log(`🔄 LOAD state:${imageLoaded} img:${selectedImage} w:${mainImageRef.current?.naturalWidth || 0}x${mainImageRef.current?.naturalHeight || 0}`)
  }, [imageLoaded])

  // Update thumbnail scroll buttons
  useEffect(() => {
    if (!thumbsWrapRef.current || allImages.length <= 5) {
      setCanScrollUp(false)
      setCanScrollDown(false)
      return
    }
    
    const thumbHeight = 95
    const containerHeight = thumbsWrapRef.current.clientHeight
    const totalHeight = allImages.length * thumbHeight
    const maxScroll = Math.max(0, totalHeight - containerHeight)
    
    setCanScrollUp(thumbsScrollPosition > 0)
    setCanScrollDown(thumbsScrollPosition < maxScroll)
  }, [thumbsScrollPosition, allImages.length])

  // Handle image load
  const handleImageLoad = useCallback(() => {
    console.log(`📸 LOAD img:${selectedImage} w:${mainImageRef.current?.naturalWidth || 0}`)
    
    setImageLoaded(true)
    
    // Sync thumbnails section to match the main image container height
    setTimeout(() => {
      if (zoomContainerRef.current && thumbnailsSectionRef.current) {
        const containerHeight = zoomContainerRef.current.offsetHeight
        console.log(`📏 HEIGHT sync:${containerHeight}`)
        if (containerHeight > 0) {
          // Set thumbnails section to match the square container height
          thumbnailsSectionRef.current.style.height = `${containerHeight}px`
        }
      }
    }, 100)
  }, [selectedImage, allImages])

  // Sync container heights when image changes or window resizes
  useEffect(() => {
    const syncHeights = () => {
      if (zoomContainerRef.current && thumbnailsSectionRef.current) {
        const containerHeight = zoomContainerRef.current.offsetHeight
        if (containerHeight > 0) {
          // Ensure thumbnails section matches the square container height
          thumbnailsSectionRef.current.style.height = `${containerHeight}px`
        }
      }
    }

    // Create resize observer to watch for container size changes
    let resizeObserver = null
    if (zoomContainerRef.current) {
      resizeObserver = new ResizeObserver(syncHeights)
      resizeObserver.observe(zoomContainerRef.current)
    }

    return () => {
      if (resizeObserver) {
        resizeObserver.disconnect()
      }
    }
  }, [selectedImage, imageLoaded])

  return (
    <>
      {/* Image Gallery */}
      <div className="col-12 col-lg-4" data-react-managed="true">
        <div className={styles.modernProductGallery}>
          {/* Main Image Container */}
          <div 
            className={styles.mainImageContainer} 
            ref={zoomContainerRef}
            onMouseEnter={(e) => {
              console.log(`🖱️ ENTER load:${imageLoaded} zoom:${!!zoomContainerRef.current}`)
              
              // Force cleanup any stale zoom elements before hover starts
              const existingLens = document.querySelectorAll('.img-zoom-lens');
              const existingResult = document.querySelectorAll('.img-zoom-result');
              if (existingLens.length > 0 || existingResult.length > 0) {
                console.log(`🧹 ENTER cleanup lens:${existingLens.length} result:${existingResult.length}`);
                existingLens.forEach(el => el.remove());
                existingResult.forEach(el => el.remove());
              }
            }}
            onMouseLeave={(e) => {
              console.log(`🖱️ LEAVE`)
            }}
            onMouseMove={(e) => {
              if (DEBUG_ZOOM) {
                console.log(`🖱️ MOVE x:${e.clientX},${e.clientY} rel:${e.nativeEvent.offsetX},${e.nativeEvent.offsetY}`)
              }
            }}
            onClick={(e) => {
              console.log(`🖱️ CLICK cont img:${selectedImage} load:${imageLoaded} lens:${!!document.querySelector('.img-zoom-lens')}`)
              
              // Force zoom recalculation on click to handle image changes
              if (zoomContainerRef.current && imageLoaded) {
                // Clear existing zoom elements
                const existingLens = document.querySelector('.img-zoom-lens');
                const existingResult = document.querySelector('.img-zoom-result');
                if (existingLens) existingLens.remove();
                if (existingResult) existingResult.remove();
                
                if (DEBUG_ZOOM) {
                  console.log('🔄 FORCE zoom recalc after click');
                }
                
                // Re-setup zoom with fresh calculations
                setTimeout(() => {
                  if (imageLoaded && mainImageRef.current && zoomContainerRef.current) {
                    setupImageZoom(zoomContainerRef.current, DEBUG_ZOOM)
                  }
                }, 100)
              }
            }}
          >
            <div className={styles.imageWrapper}>
              <img 
                ref={mainImageRef}
                className={styles.mainProductImage} 
                src={allImages[selectedImage]}
                alt={`${product.name}-${selectedImage}`}
                onLoad={handleImageLoad}
                onClick={(e) => {
                  console.log(`🖱️ CLICK img w:${e.target.naturalWidth} h:${e.target.naturalHeight} comp:${e.target.complete}`)
                  
                  // Prevent event bubbling to container
                  e.stopPropagation()
                }}
              />
              
              {/* Loading indicator */}
              {!imageLoaded && (
                <div className={styles.imageLoader}>
                  <div className={styles.spinner}></div>
                </div>
              )}
              
              {/* Navigation Arrows */}
              {allImages.length > 1 && (
                <>
                  <button 
                    className={`${styles.navArrow} ${styles.navArrowLeft}`}
                    onClick={(e) => {
                      console.log(`⬅️ ARROW L ${selectedImage}`)
                      handlePrevImage()
                    }}
                    type="button"
                    aria-label="Previous image"
                  >
                    <i className="fas fa-chevron-left"></i>
                  </button>
                  <button 
                    className={`${styles.navArrow} ${styles.navArrowRight}`}
                    onClick={(e) => {
                      console.log(`➡️ ARROW R ${selectedImage}`)
                      handleNextImage()
                    }}
                    type="button"
                    aria-label="Next image"
                  >
                    <i className="fas fa-chevron-right"></i>
                  </button>
                </>
              )}
              
              {/* Fullscreen Button */}
              <button 
                className={styles.fullscreenBtn}
                onClick={(e) => {
                  console.log(`🔍 FULLSCREEN ${isFullscreen}→${!isFullscreen}`)
                  toggleFullscreen()
                }}
                type="button"
                aria-label="View fullscreen"
              >
                <i className="fas fa-expand"></i>
              </button>
              
              {/* Image Counter */}
              {allImages.length > 1 && (
                <div className={styles.imageCounter}>
                  {selectedImage + 1} / {allImages.length}
                </div>
              )}
            </div>
          </div>

          {/* Thumbnail Navigation */}
          {allImages.length > 1 && (
            <div className={styles.thumbnailsSection} ref={thumbnailsSectionRef}>
              {/* Scroll Up Button */}
              {canScrollUp && (
                <button 
                  className={styles.thumbScrollBtn}
                  onClick={(e) => {
                    console.log(`🔼 SCROLL UP pos:${thumbsScrollPosition} imgs:${allImages.length}`)
                    scrollThumbs('up')
                  }}
                  type="button"
                  aria-label="Scroll thumbnails up"
                >
                  <i className="fas fa-chevron-up"></i>
                </button>
              )}
              
              {/* Thumbnails Container */}
              <div className={styles.thumbnailsWrapper} ref={thumbsWrapRef}>
                <div 
                  className={styles.thumbnailsContainer} 
                  ref={thumbsContainerRef}
                  style={{ 
                    transform: `translateY(-${thumbsScrollPosition}px)`,
                    transition: 'transform 0.3s ease'
                  }}
                >
                  {allImages.map((img, idx) => (
                    <div 
                      key={idx}
                      className={`${styles.thumbnailItem} ${selectedImage === idx ? styles.active : ''}`}
                      onClick={(e) => {
                        console.log(`🖼️ THUMB ${idx} curr:${selectedImage} zoom:${!!zoomContainerRef.current}`)
                        handleImageSelect(idx, 'thumbnail-click')
                      }}
                    >
                      <img 
                        src={img} 
                        alt={`${product.name}-thumbnail-${idx}`}
                        className={styles.thumbnailImage}
                      />
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Scroll Down Button */}
              {canScrollDown && (
                <button 
                  className={styles.thumbScrollBtn}
                  onClick={(e) => {
                    console.log(`🔽 SCROLL DOWN pos:${thumbsScrollPosition} imgs:${allImages.length}`)
                    scrollThumbs('down')
                  }}
                  type="button"
                  aria-label="Scroll thumbnails down"
                >
                  <i className="fas fa-chevron-down"></i>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div className={styles.fullscreenModal} onClick={(e) => {
          console.log(`🔍 FS modal bg click`)
          toggleFullscreen()
        }}>
          <div className={styles.fullscreenContent} onClick={(e) => e.stopPropagation()}>
            <button 
              className={styles.fullscreenClose}
              onClick={(e) => {
                console.log(`❌ FS close click`)
                toggleFullscreen()
              }}
              type="button"
              aria-label="Close fullscreen"
            >
              <i className="fas fa-times"></i>
            </button>
            
            <div className={styles.fullscreenImageContainer}>
              <img 
                src={allImages[selectedImage]}
                alt={`${product.name}-fullscreen-${selectedImage}`}
                className={styles.fullscreenImage}
              />
              
              {/* Fullscreen Navigation */}
              {allImages.length > 1 && (
                <>
                  <button 
                    className={`${styles.fullscreenNav} ${styles.fullscreenNavLeft}`}
                    onClick={(e) => {
                      console.log(`⬅️ FS nav L ${selectedImage}`)
                      handlePrevImage()
                    }}
                    type="button"
                    aria-label="Previous image"
                  >
                    <i className="fas fa-chevron-left"></i>
                  </button>
                  <button 
                    className={`${styles.fullscreenNav} ${styles.fullscreenNavRight}`}
                    onClick={(e) => {
                      console.log(`➡️ FS nav R ${selectedImage}`)
                      handleNextImage()
                    }}
                    type="button"
                    aria-label="Next image"
                  >
                    <i className="fas fa-chevron-right"></i>
                  </button>
                </>
              )}
              
              {/* Fullscreen Counter */}
              {allImages.length > 1 && (
                <div className={styles.fullscreenCounter}>
                  {selectedImage + 1} / {allImages.length}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </>
  )
}