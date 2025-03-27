/**
 * Image zoom utility for product images
 */

export function setupImageZoom(zoomContainer, debug = false) {
  if (!zoomContainer) {
    console.warn('Zoom container not found');
    return;
  }

  // Clear existing zoom elements
  while (zoomContainer.firstChild) {
    zoomContainer.removeChild(zoomContainer.firstChild);
  }

  // Get the current active image
  const activeImage = document.querySelector('.product-single-carousel .active .product-single-image');
  if (!activeImage) {
    if (debug) console.warn('Active image not found for zoom');
    return;
  }

  // Create zoom lens element with explicit dimensions
  const lens = document.createElement('div');
  lens.className = 'img-zoom-lens';
  lens.style.width = '180px';
  lens.style.height = '180px';
  
  // Add lens to the container
  zoomContainer.appendChild(lens);
  
  // Create zoom result element with explicit dimensions
  const result = document.createElement('div');
  result.className = 'img-zoom-result';
  result.style.width = '600px';
  result.style.height = '600px';
  result.style.position = 'fixed';
  result.style.zIndex = '9999';
  result.style.background = '#fff';
  result.style.border = '1px solid #ddd';
  result.style.backgroundRepeat = 'no-repeat';
  result.style.boxShadow = '0 5px 10px rgba(0,0,0,0.1)';
  
  // Append result to body for z-index control
  document.body.appendChild(result);
  
  // Position the result element beside the image
  const positionZoomResult = () => {
    if (!activeImage) return;
    
    const imageRect = activeImage.getBoundingClientRect();
    const windowWidth = window.innerWidth;
    
    // Default position to the right of the image
    let left = imageRect.right + 20;
    
    // If showing to the right would push it off screen, show on the left instead
    if (left + 300 > windowWidth) {
      left = Math.max(0, imageRect.left - 320);
    }
    
    result.style.top = `${imageRect.top}px`;
    result.style.left = `${left}px`;
  };
  
  // Position result initially and on window events
  positionZoomResult();
  window.addEventListener('resize', positionZoomResult);
  window.addEventListener('scroll', positionZoomResult);
  
  // Load the full-size image to get accurate dimensions
  const getImageDimensions = () => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        resolve({
          width: img.width,
          height: img.height
        });
      };
      img.src = activeImage.src;
    });
  };
  
  // Setup the image background
  const setupBackground = async () => {
    const dimensions = await getImageDimensions();
    
    // Set zoom result background image
    result.style.backgroundImage = `url('${activeImage.src}')`;
    
    // Use a lower zoom ratio for better usability
    const zoomRatio = 1.5;
    result.style.backgroundSize = `${dimensions.width * zoomRatio}px ${dimensions.height * zoomRatio}px`;
    
    return { dimensions, zoomRatio };
  };
  
  // Initialize setup and store zoom settings
  let zoomSettings = {
    dimensions: { width: 0, height: 0 },
    zoomRatio: 1.5
  };
  
  setupBackground().then(settings => {
    zoomSettings = settings;
  });
  
  // Handle mouse movement for zoom effect
  function moveLens(e) {
    e.preventDefault();
    
    const pos = getCursorPos(e);
    const imageRect = activeImage.getBoundingClientRect();
    
    // Calculate lens position
    let x = pos.x - lens.offsetWidth / 2;
    let y = pos.y - lens.offsetHeight / 2;
    
    // Constrain lens to image boundaries
    const maxX = imageRect.width - lens.offsetWidth;
    const maxY = imageRect.height - lens.offsetHeight;
    
    x = x < 0 ? 0 : x > maxX ? maxX : x;
    y = y < 0 ? 0 : y > maxY ? maxY : y;
    
    // Position the lens
    lens.style.left = x + "px";
    lens.style.top = y + "px";
    
    // Calculate the relative position as a percentage of the image size
    const lensPercentX = (x / (imageRect.width - lens.offsetWidth)) * 100;
    const lensPercentY = (y / (imageRect.height - lens.offsetHeight)) * 100;
    
    // Calculate zoom result's background position
    const resultWidth = 600;
    const resultHeight = 600;
    const bgWidth = zoomSettings.dimensions.width * zoomSettings.zoomRatio;
    const bgHeight = zoomSettings.dimensions.height * zoomSettings.zoomRatio;
    
    // The background image should shift in proportion to where the lens is
    const bgX = (lensPercentX / 100) * (bgWidth - resultWidth);
    const bgY = (lensPercentY / 100) * (bgHeight - resultHeight);
    
    // Apply the background position
    result.style.backgroundPosition = `-${bgX}px -${bgY}px`;
    
    // Calculate what percentage into the background we're showing
    const bgPercentX = (bgX / (bgWidth - resultWidth)) * 100;
    const bgPercentY = (bgY / (bgHeight - resultHeight)) * 100;
    
    if (debug) {
      // Compact debugging output showing lens position and background position as percentages
      console.log(`Lens: ${lensPercentX.toFixed(1)}%, ${lensPercentY.toFixed(1)}% | BG: ${bgPercentX.toFixed(1)}%, ${bgPercentY.toFixed(1)}% | Diff: ${(bgPercentX - lensPercentX).toFixed(1)}%, ${(bgPercentY - lensPercentY).toFixed(1)}%`);
    }
  }
  
  // Get cursor position relative to the image
  function getCursorPos(e) {
    const imageRect = activeImage.getBoundingClientRect();
    
    return { 
      x: e.clientX - imageRect.left,
      y: e.clientY - imageRect.top
    };
  }
  
  // Attach event listeners
  activeImage.addEventListener("mousemove", moveLens);
  zoomContainer.addEventListener("mousemove", moveLens);
  
  // Show/hide zoom elements
  activeImage.addEventListener("mouseenter", () => {
    lens.style.display = "block";
    result.style.display = "block";
    positionZoomResult();
  });
  
  activeImage.addEventListener("mouseleave", () => {
    lens.style.display = "none";
    result.style.display = "none";
  });
  
  // Return cleanup function
  return () => {
    activeImage.removeEventListener("mousemove", moveLens);
    zoomContainer.removeEventListener("mousemove", moveLens);
    activeImage.removeEventListener("mouseenter", () => {});
    activeImage.removeEventListener("mouseleave", () => {});
    window.removeEventListener('resize', positionZoomResult);
    window.removeEventListener('scroll', positionZoomResult);
    
    if (lens.parentNode) lens.parentNode.removeChild(lens);
    if (result.parentNode) result.parentNode.removeChild(result);
  };
}
