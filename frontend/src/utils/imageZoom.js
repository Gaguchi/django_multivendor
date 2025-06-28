/**
 * Modern Image zoom utility for product images
 * Amazon-style hover zoom functionality
 */

// Global state to prevent multiple zoom instances
let activeZoomInstance = null;
let isZoomActive = false;

export function setupImageZoom(zoomContainer, debug = false) {
  console.log(`🚀 ZOOM setup cont:${zoomContainer?.className} dim:${zoomContainer?.offsetWidth}x${zoomContainer?.offsetHeight} active:${!!activeZoomInstance}`);
  
  if (!zoomContainer) {
    console.warn('❌ No zoom container');
    return null;
  }

  // Force cleanup of any existing zoom instance
  if (activeZoomInstance) {
    console.log(`🧹 FORCE cleanup prev:${activeZoomInstance.container === zoomContainer ? 'SAME' : 'DIFF'}`);
    activeZoomInstance.cleanup();
    activeZoomInstance = null;
  }

  // Clear existing zoom elements globally (more thorough cleanup)
  const existingLenses = document.querySelectorAll('.img-zoom-lens');
  const existingResults = document.querySelectorAll('.img-zoom-result');
  console.log(`🧹 GLOBAL cleanup lens:${existingLenses.length} result:${existingResults.length}`);
  existingLenses.forEach(el => el.remove());
  existingResults.forEach(el => el.remove());

  // Get the current active image from React component
  const activeImage = zoomContainer.querySelector('img');
  if (!activeImage) {
    console.warn('No img found for zoom');
    return null;
  }

  console.log(`🖼️ IMG found src:${activeImage.src.slice(-20)} comp:${activeImage.complete} w:${activeImage.naturalWidth}x${activeImage.naturalHeight}`);

  // Ensure image is fully loaded
  if (!activeImage.complete || activeImage.naturalWidth === 0) {
    console.warn('⚠️ IMG not loaded, zoom abort');
    return null;
  }

  // Store container and image references for calculations - force fresh calculation
  let containerRect = null;
  let currentImageSrc = activeImage.src;
  let isCurrentlyHovering = false;

  // Function to refresh container dimensions (always fresh calculation)
  const refreshContainerRect = () => {
    // Force reflow and get fresh dimensions
    zoomContainer.offsetHeight; // trigger reflow
    containerRect = zoomContainer.getBoundingClientRect();
    if (debug) {
      console.log(`📦 RECT refresh ${containerRect.width}x${containerRect.height}`);
    }
    return containerRect;
  };

  // Initial container rect calculation
  refreshContainerRect();

  // Check if device supports hover (desktop/tablet with cursor)
  const supportsHover = window.matchMedia('(hover: hover)').matches;
  if (!supportsHover) {
    console.log('Touch device, skip zoom');
    return null;
  }

  // Create zoom lens element
  const lens = document.createElement('div');
  lens.className = 'img-zoom-lens';
  lens.style.cssText = `
    position: absolute;
    border: 2px solid #007bff;
    background: rgba(0, 123, 255, 0.1);
    border-radius: 50%;
    cursor: none;
    display: none;
    z-index: 5;
    pointer-events: none;
    width: 150px;
    height: 150px;
  `;
  
  // Add lens to the container
  zoomContainer.appendChild(lens);
  
  // Create zoom result element
  const result = document.createElement('div');
  result.className = 'img-zoom-result';
  result.style.cssText = `
    position: fixed;
    background: #fff;
    border: 2px solid #007bff;
    border-radius: 12px;
    background-repeat: no-repeat;
    display: none;
    z-index: 9999;
    pointer-events: none;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
    overflow: hidden;
    width: 400px;
    height: 400px;
  `;
  
  // Append result to body for z-index control
  document.body.appendChild(result);

  // Set up the background image for zoom
  const setupBackground = () => {
    const currentImg = zoomContainer.querySelector('img');
    if (currentImg && currentImg.complete) {
      result.style.backgroundImage = `url('${currentImg.src}')`;
      result.style.backgroundSize = `1200px 1200px`; // 3x zoom
      currentImageSrc = currentImg.src; // Update tracked src
      
      if (debug) console.log(`BG set:${currentImg.src.slice(-20)}`);
    }
  };

  // Check for image changes and update background
  const updateBackground = () => {
    const currentImg = zoomContainer.querySelector('img');
    if (currentImg && currentImg.src !== currentImageSrc) {
      setupBackground();
      refreshContainerRect(); // Refresh container dimensions on image change
      if (debug) console.log(`🔄 IMG change, bg+rect updated`);
    }
  };

  // Position the result element beside the image
  const positionZoomResult = () => {
    if (!zoomContainer || !containerRect) {
      refreshContainerRect();
      if (!containerRect) return;
    }
    
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const resultSize = 400;
    
    // Calculate optimal position next to the container
    let left = containerRect.right + 20;
    let top = containerRect.top;
    
    // If showing to the right would push it off screen, show on the left
    if (left + resultSize > windowWidth - 20) {
      left = Math.max(20, containerRect.left - resultSize - 20);
    }
    
    // Adjust vertical position if needed
    if (top + resultSize > windowHeight - 20) {
      top = Math.max(20, windowHeight - resultSize - 20);
    }
    
    result.style.top = `${top}px`;
    result.style.left = `${left}px`;
    
    if (debug) console.log('Positioned zoom result at:', left, top);
  };

  // Initialize position and background
  positionZoomResult();
  setupBackground();

  // Get cursor position relative to the zoom container
  function getCursorPos(e) {
    // Always refresh container rect for accurate positioning
    refreshContainerRect();
    
    const relativeX = e.clientX - containerRect.left;
    const relativeY = e.clientY - containerRect.top;
    
    if (debug) {
      console.log(`🖱️ POS x:${relativeX} y:${relativeY} cont:${containerRect.width}x${containerRect.height}`);
    }
    
    return { 
      x: relativeX,
      y: relativeY
    };
  }

  // Handle mouse movement for zoom effect
  function moveLens(e) {
    e.preventDefault();
    
    if (!isCurrentlyHovering) {
      if (debug) console.log('🖱️ Not hovering, skip move');
      return;
    }
    
    if (debug) {
      console.log(`🖱️ MOVE lens:${lens?.style.display} result:${result?.style.display}`);
    }
    
    // ALWAYS refresh container rect and background on movement for accuracy
    refreshContainerRect();
    updateBackground();
    
    // Validate zoom state during movement (every 10th move to avoid spam)
    if (Math.random() < 0.1) { // 10% chance
      validateZoomState('moveLens');
    }
    
    const pos = getCursorPos(e);
    
    // Validate position is within container bounds
    if (!containerRect || pos.x < 0 || pos.y < 0 || pos.x > containerRect.width || pos.y > containerRect.height) {
      if (debug) console.log('🖱️ Out of bounds, skip');
      return;
    }
    
    const lensSize = 150;
    const resultSize = 400;
    
    // Calculate lens position
    let x = pos.x - lensSize / 2;
    let y = pos.y - lensSize / 2;
    
    // Constrain lens to container boundaries
    const maxX = containerRect.width - lensSize;
    const maxY = containerRect.height - lensSize;
    
    x = Math.max(0, Math.min(maxX, x));
    y = Math.max(0, Math.min(maxY, y));
    
    // Position the lens
    lens.style.left = x + "px";
    lens.style.top = y + "px";
    
    // Calculate background position for zoom result
    const lensPercentX = maxX > 0 ? (x / maxX) : 0;
    const lensPercentY = maxY > 0 ? (y / maxY) : 0;
    
    const bgX = (1200 - resultSize) * lensPercentX;
    const bgY = (1200 - resultSize) * lensPercentY;
    
    result.style.backgroundPosition = `-${bgX}px -${bgY}px`;
    
    if (debug) {
      console.log(`Lens ${x},${y} | BG -${bgX},-${bgY} | Cont ${containerRect.width}x${containerRect.height}`);
    }
  }
  
  // Show zoom elements
  const showZoom = () => {
    if (isCurrentlyHovering) {
      if (debug) console.log('⚠️ Already hovering, skip show');
      return;
    }
    
    console.log(`🔍 ZOOM SHOW lens:${!!lens} result:${!!result} src:${currentImageSrc.slice(-20)}`);
    
    // Validate zoom state before showing
    validateZoomState('showZoom');
    
    isCurrentlyHovering = true;
    
    // FORCE fresh state on hover enter - more aggressive reset
    updateBackground();
    const freshRect = refreshContainerRect(); // Force fresh calculation
    
    // Ensure elements exist
    if (!lens || !result || !freshRect) {
      if (debug) console.warn(`⚠️ Missing elements lens:${!!lens} result:${!!result} rect:${!!freshRect}`);
      isCurrentlyHovering = false;
      return;
    }
    
    // Force a complete reset of zoom state - this is key since leaving works
    // Remove the delay and make it immediate
    lens.style.display = "block";
    result.style.display = "block";
    positionZoomResult();
    
    if (debug) console.log('✅ zoom shown');
  };
  
  // Hide zoom elements
  const hideZoom = () => {
    if (!isCurrentlyHovering) {
      if (debug) console.log('⚠️ Not hovering, skip hide');
      return;
    }
    
    console.log('🔍 ZOOM HIDE');
    
    isCurrentlyHovering = false;
    
    if (lens) lens.style.display = "none";
    if (result) result.style.display = "none";
    
    if (debug) console.log('Zoom hidden');
  };
  
  // Update position on scroll/resize
  const handleResize = () => {
    refreshContainerRect();
    positionZoomResult();
  };
  
  // Handle window scroll with container refresh
  const handleScroll = () => {
    refreshContainerRect();
    positionZoomResult();
  };
  
  window.addEventListener('resize', handleResize);
  window.addEventListener('scroll', handleScroll);
  
  // Attach event listeners
  zoomContainer.addEventListener("mouseenter", showZoom);
  zoomContainer.addEventListener("mouseleave", hideZoom);
  zoomContainer.addEventListener("mousemove", moveLens);
  
  // Handle click events for debugging zoom state
  const handleZoomClick = (e) => {
    console.log(`🖱️ ZOOM CLICK ${e.target.tagName} hover:${isCurrentlyHovering} lens:${lens?.style.display} result:${result?.style.display}`);
    
    // If zoom isn't working after click, try to force recalculation
    if (isCurrentlyHovering && (!lens || lens.style.display !== 'block')) {
      console.log('🔄 FORCE refresh after click');
      refreshContainerRect();
      updateBackground();
      if (lens) lens.style.display = 'block';
      if (result) result.style.display = 'block';
      positionZoomResult();
    }
  };

  // Handle lens click events for debugging
  const handleLensClick = (e) => {
    console.log(`🖱️ LENS CLICK pos:${lens.style.left},${lens.style.top} hover:${isCurrentlyHovering}`);
    
    // Prevent click from bubbling to container
    e.stopPropagation();
  };

  // Add click event listeners for debugging
  zoomContainer.addEventListener("click", handleZoomClick);
  
  // Keep lens non-interactive to avoid blocking UI controls
  // lens.style.pointerEvents = 'auto';
  // lens.addEventListener("click", handleLensClick);

  // Window/document click handler to detect clicks outside zoom area
  const handleDocumentClick = (e) => {
    if (!zoomContainer.contains(e.target) && !result.contains(e.target)) {
      console.log(`🖱️ CLICK outside ${e.target.tagName} hover:${isCurrentlyHovering}`);
    }
  };
  
  document.addEventListener('click', handleDocumentClick);
  
  if (debug) {
    console.log('Event listeners attached for zoom container:', zoomContainer);
    console.log('Container dimensions:', {
      width: zoomContainer.offsetWidth,
      height: zoomContainer.offsetHeight,
      rect: zoomContainer.getBoundingClientRect()
    });
  }
  
  // Watch for container resize changes specifically
  let containerResizeObserver = null;
  
  if (window.ResizeObserver) {
    containerResizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        if (entry.target === zoomContainer) {
          const newRect = entry.contentRect;
          console.log(`🔄 RESIZE ${containerRect?.width}x${containerRect?.height} → ${newRect.width}x${newRect.height} hover:${isCurrentlyHovering}`);
          
          // Force refresh container rect and reposition result
          refreshContainerRect();
          positionZoomResult();
          
          // Validate state after resize
          validateZoomState('containerResize');
        }
      }
    });
    
    containerResizeObserver.observe(zoomContainer);
  }

  // Function to validate zoom state and detect issues
  const validateZoomState = (context = 'unknown') => {
    const currentImg = zoomContainer.querySelector('img');
    const currentSrc = currentImg?.src;
    const currentRect = zoomContainer.getBoundingClientRect();
    
    const imageChanged = currentSrc !== currentImageSrc;
    const containerSizeChanged = !containerRect || 
      Math.abs(currentRect.width - containerRect.width) > 1 || 
      Math.abs(currentRect.height - containerRect.height) > 1;
    
    // Log any inconsistencies
    if (imageChanged || containerSizeChanged) {
      console.warn(`⚠️ VALIDATION [${context}] img:${imageChanged} size:${containerSizeChanged}`);
      
      // Auto-fix by refreshing state
      if (imageChanged) {
        console.log('🔄 Auto-fix img change');
        updateBackground();
      }
      if (containerSizeChanged) {
        console.log('🔄 Auto-fix size change');
        refreshContainerRect();
        positionZoomResult();
      }
    } else if (debug) {
      console.log(`✅ VALIDATION [${context}] OK`);
    }
    
    return { imageChanged, containerSizeChanged };
  };

  // Periodic zoom state validation (helps catch async issues)
  let stateCheckInterval = null;
  
  if (debug) {
    stateCheckInterval = setInterval(() => {
      if (isCurrentlyHovering) {
        validateZoomState('periodicCheck');
      }
    }, 2000); // Check every 2 seconds when hovering
  }

  // Return cleanup function
  const cleanup = () => {
    if (debug) console.log('🧹 Cleaning up zoom instance');
    
    isCurrentlyHovering = false;
    
    // Remove event listeners
    zoomContainer.removeEventListener("mouseenter", showZoom);
    zoomContainer.removeEventListener("mouseleave", hideZoom);
    zoomContainer.removeEventListener("mousemove", moveLens);
    zoomContainer.removeEventListener("click", handleZoomClick);
    window.removeEventListener('resize', handleResize);
    window.removeEventListener('scroll', handleScroll);
    document.removeEventListener('click', handleDocumentClick);
    
    // Remove lens-specific event listeners
    // if (lens) {
    //   lens.removeEventListener("click", handleLensClick);
    // }
    
    // Remove DOM elements
    if (lens && lens.parentNode) lens.parentNode.removeChild(lens);
    if (result && result.parentNode) result.parentNode.removeChild(result);
    
    // Clear active instance if this is the active one
    if (activeZoomInstance && activeZoomInstance.container === zoomContainer) {
      activeZoomInstance = null;
    }
    
    // Clear periodic state check interval
    if (stateCheckInterval) {
      clearInterval(stateCheckInterval);
      stateCheckInterval = null;
    }
    
    // Cleanup container resize observer
    if (containerResizeObserver) {
      containerResizeObserver.disconnect();
      containerResizeObserver = null;
    }
    
    // Unobserve container resize
    if (containerResizeObserver) {
      containerResizeObserver.unobserve(zoomContainer);
      containerResizeObserver = null;
    }
  };

  // Store this instance as the active one
  activeZoomInstance = {
    container: zoomContainer,
    cleanup: cleanup
  };

  return cleanup;
}
