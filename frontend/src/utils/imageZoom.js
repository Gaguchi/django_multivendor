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

  if (debug) console.log('Setting up zoom for image:', activeImage.src);

  // Create zoom lens element with explicit dimensions
  const lens = document.createElement('div');
  lens.className = 'img-zoom-lens';
  lens.style.width = '100px';
  lens.style.height = '100px';
  
  // Create zoom result element with explicit dimensions
  const result = document.createElement('div');
  result.className = 'img-zoom-result';
  result.style.width = '300px';
  result.style.height = '300px';
  result.style.zIndex = '9999'; // Force high z-index directly
  result.style.position = 'absolute'; // Force position
  
  // Add elements to the container
  zoomContainer.appendChild(lens);
  
  // Append the result to body instead to avoid z-index issues
  document.body.appendChild(result);
  
  // Position the result relative to the image
  const positionZoomResult = () => {
    const imageRect = activeImage.getBoundingClientRect();
    result.style.position = 'fixed';
    result.style.top = `${imageRect.top}px`;
    result.style.right = `auto`;
    result.style.left = `${imageRect.right + 20}px`;
  };
  
  // Position immediately and on resize
  positionZoomResult();
  window.addEventListener('resize', positionZoomResult);
  window.addEventListener('scroll', positionZoomResult);
  
  // Wait for image to be fully loaded before calculating dimensions
  const calculateZoomRatios = () => {
    // Set the size of the lens and result
    const cx = result.offsetWidth / lens.offsetWidth;
    const cy = result.offsetHeight / lens.offsetHeight;
    
    if (debug) {
      console.log('Zoom ratios - cx:', cx, 'cy:', cy);
      console.log('Lens dimensions:', lens.offsetWidth, 'x', lens.offsetHeight);
      console.log('Result dimensions:', result.offsetWidth, 'x', result.offsetHeight);
    }
    
    // Set background properties of result
    result.style.backgroundImage = `url('${activeImage.src}')`;
    
    // Wait for image to load before accessing width and height
    const tempImg = new Image();
    tempImg.onload = () => {
      const imgWidth = tempImg.width;
      const imgHeight = tempImg.height;
      
      result.style.backgroundSize = `${imgWidth * cx}px ${imgHeight * cy}px`;
      
      if (debug) {
        console.log('Image dimensions:', imgWidth, 'x', imgHeight);
        console.log('Zoom result background size:', `${imgWidth * cx}px ${imgHeight * cy}px`);
      }
    };
    tempImg.src = activeImage.src;
  };
  
  // Run calculations once
  calculateZoomRatios();
  
  // Mouse move handler for zoom effect
  function moveLens(e) {
    e.preventDefault();
    
    // Get cursor position
    const pos = getCursorPos(e);
    
    if (debug) {
      console.log('------ Mouse Move Event -------');
      console.log('Raw event coordinates - pageX:', e.pageX, 'pageY:', e.pageY);
      console.log('Cursor position relative to image - x:', pos.x, 'y:', pos.y);
    }
    
    // Calculate position of lens
    let x = pos.x - lens.offsetWidth / 2;
    let y = pos.y - lens.offsetHeight / 2;
    
    if (debug) {
      console.log('Initial lens position - x:', x, 'y:', y);
    }
    
    // Get image dimensions
    const imgWidth = activeImage.width || activeImage.naturalWidth;
    const imgHeight = activeImage.height || activeImage.naturalHeight;
    
    // Prevent lens from being positioned outside the image
    if (x > imgWidth - lens.offsetWidth) x = imgWidth - lens.offsetWidth;
    if (x < 0) x = 0;
    if (y > imgHeight - lens.offsetHeight) y = imgHeight - lens.offsetHeight;
    if (y < 0) y = 0;
    
    if (debug) {
      console.log('Adjusted lens position - x:', x, 'y:', y);
      console.log('Image boundaries - width:', imgWidth, 'height:', imgHeight);
      console.log('Image position - left:', activeImage.getBoundingClientRect().left, 'top:', activeImage.getBoundingClientRect().top);
    }
    
    // Set the position of the lens
    lens.style.left = x + "px";
    lens.style.top = y + "px";
    
    // Calculate zoom ratios again to avoid NaN
    const cx = result.offsetWidth / lens.offsetWidth;
    const cy = result.offsetHeight / lens.offsetHeight;
    
    // Display what the lens "sees" in the result div
    result.style.backgroundPosition = `-${x * cx}px -${y * cy}px`;
    
    if (debug) {
      console.log('Result background position:', `-${x * cx}px -${y * cy}px`);
    }
  }
  
  // Get cursor position relative to the image
  function getCursorPos(e) {
    let a, x = 0, y = 0;
    e = e || window.event;
    a = activeImage.getBoundingClientRect();
    
    // Calculate cursor position relative to image
    x = e.pageX - a.left - window.pageXOffset;
    y = e.pageY - a.top - window.pageYOffset;
    
    if (debug) {
      console.log('getBoundingClientRect:', a);
      console.log('Window scroll - X:', window.pageXOffset, 'Y:', window.pageYOffset);
    }
    
    return { x, y };
  }
  
  // Since we've positioned the zoom container absolutely over the image,
  // we need to attach mousemove events to the zoom container too
  activeImage.addEventListener("mousemove", moveLens);
  zoomContainer.addEventListener("mousemove", moveLens);
  lens.addEventListener("mousemove", moveLens);
  
  // Show/hide zoom on mouse enter/leave
  activeImage.addEventListener("mouseenter", () => {
    lens.style.display = "block";
    result.style.display = "block";
    positionZoomResult(); // Reposition on show
    if (debug) console.log('Mouse entered image - showing zoom');
  });
  
  activeImage.addEventListener("mouseleave", () => {
    lens.style.display = "none";
    result.style.display = "none";
    if (debug) console.log('Mouse left image - hiding zoom');
  });
  
  // Return cleanup function to remove event listeners
  return () => {
    activeImage.removeEventListener("mousemove", moveLens);
    zoomContainer.removeEventListener("mousemove", moveLens);
    lens.removeEventListener("mousemove", moveLens);
    activeImage.removeEventListener("mouseenter", () => {});
    activeImage.removeEventListener("mouseleave", () => {});
    window.removeEventListener('resize', positionZoomResult);
    window.removeEventListener('scroll', positionZoomResult);
    
    // Remove elements
    if (lens.parentNode) lens.parentNode.removeChild(lens);
    if (result.parentNode) result.parentNode.removeChild(result);
    
    if (debug) console.log('Zoom event listeners removed');
  };
}
