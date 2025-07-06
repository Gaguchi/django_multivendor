// Modal utility functions to prevent backdrop issues
export const cleanupModalBackdrops = () => {
  // Remove any lingering modal backdrops
  const backdrops = document.querySelectorAll('.modal-backdrop');
  backdrops.forEach(backdrop => backdrop.remove());
  
  // Remove modal-open class from body
  document.body.classList.remove('modal-open');
  
  // Reset body overflow
  document.body.style.overflow = '';
  document.body.style.paddingRight = '';
};

export const showModal = () => {
  // Clean up any existing backdrops first
  cleanupModalBackdrops();
  
  // Add modal-open class to body (for proper Bootstrap styling)
  document.body.classList.add('modal-open');
};

export const hideModal = () => {
  // Clean up modal artifacts
  cleanupModalBackdrops();
};

// Add escape key handling for modals
export const handleModalEscape = (callback) => {
  const handleEscape = (event) => {
    if (event.key === 'Escape') {
      callback();
    }
  };
  
  document.addEventListener('keydown', handleEscape);
  
  // Return cleanup function
  return () => {
    document.removeEventListener('keydown', handleEscape);
  };
};
