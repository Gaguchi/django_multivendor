/**
 * Simple Image Zoom Utility
 * Clean, robust, and React-friendly
 */

export function setupImageZoom(container) {
  if (!container) return null;

  const img = container.querySelector('img');
  if (!img || !img.complete) return null;

  // Remove any existing zoom elements
  const oldLens = container.querySelector('.zoom-lens');
  const oldResult = document.querySelector('.zoom-result');
  if (oldLens) oldLens.remove();
  if (oldResult) oldResult.remove();

  // Create lens
  const lens = document.createElement('div');
  lens.className = 'zoom-lens';
  lens.style.cssText = `
    position: absolute;
    border: 2px solid #007bff;
    background: rgba(0, 123, 255, 0.1);
    border-radius: 50%;
    width: 150px;
    height: 150px;
    display: none;
    pointer-events: none;
    z-index: 10;
  `;
  container.appendChild(lens);

  // Create result window
  const result = document.createElement('div');
  result.className = 'zoom-result';
  result.style.cssText = `
    position: fixed;
    width: 400px;
    height: 400px;
    border: 2px solid #007bff;
    border-radius: 12px;
    background: white;
    background-repeat: no-repeat;
    display: none;
    z-index: 9999;
    pointer-events: none;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  `;
  document.body.appendChild(result);

  // Set zoom background
  const setBackground = () => {
    const currentImg = container.querySelector('img');
    if (currentImg && currentImg.complete) {
      result.style.backgroundImage = `url('${currentImg.src}')`;
      result.style.backgroundSize = '1200px 1200px'; // 3x zoom
    }
  };

  // Position result window
  const positionResult = () => {
    const rect = container.getBoundingClientRect();
    const windowWidth = window.innerWidth;
    const resultWidth = 400;
    let left = rect.right + 20;
    if (left + resultWidth > windowWidth - 20) {
      left = Math.max(20, rect.left - resultWidth - 20);
    }
    result.style.left = `${left}px`;
    result.style.top = `${rect.top}px`;
  };

  // Mouse move handler
  const handleMouseMove = (e) => {
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    // Position lens
    const lensX = Math.max(0, Math.min(x - 75, rect.width - 150));
    const lensY = Math.max(0, Math.min(y - 75, rect.height - 150));
    lens.style.left = `${lensX}px`;
    lens.style.top = `${lensY}px`;
    // Calculate background position
    const bgX = (lensX / (rect.width - 150)) * (1200 - 400);
    const bgY = (lensY / (rect.height - 150)) * (1200 - 400);
    result.style.backgroundPosition = `-${bgX}px -${bgY}px`;
  };

  // Mouse enter handler
  const handleMouseEnter = () => {
    setBackground();
    positionResult();
    lens.style.display = 'block';
    result.style.display = 'block';
  };

  // Mouse leave handler
  const handleMouseLeave = () => {
    lens.style.display = 'none';
    result.style.display = 'none';
  };

  // Add event listeners
  container.addEventListener('mouseenter', handleMouseEnter);
  container.addEventListener('mouseleave', handleMouseLeave);
  container.addEventListener('mousemove', handleMouseMove);

  // Window resize handler
  const handleResize = () => {
    if (result.style.display === 'block') {
      positionResult();
    }
  };
  window.addEventListener('resize', handleResize);

  // Initialize
  setBackground();

  // Return cleanup function
  return () => {
    container.removeEventListener('mouseenter', handleMouseEnter);
    container.removeEventListener('mouseleave', handleMouseLeave);
    container.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('resize', handleResize);
    if (lens && lens.parentNode) lens.parentNode.removeChild(lens);
    if (result && result.parentNode) result.parentNode.removeChild(result);
  };
}
