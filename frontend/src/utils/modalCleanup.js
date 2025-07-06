// Modal cleanup utility to remove Bootstrap modal artifacts
export const cleanupModalBackdrops = () => {
  // Remove any lingering modal backdrops
  const backdrops = document.querySelectorAll('.modal-backdrop');
  backdrops.forEach(backdrop => backdrop.remove());
  
  // Remove modal-open class from body
  document.body.classList.remove('modal-open');
  
  // Reset body styles
  document.body.style.overflow = '';
  document.body.style.paddingRight = '';
  
  // Remove any modal-related data attributes
  const modals = document.querySelectorAll('.modal');
  modals.forEach(modal => {
    modal.removeAttribute('aria-modal');
    modal.removeAttribute('role');
    modal.style.display = '';
  });
};

// Initialize cleanup on page load
export const initModalCleanup = () => {
  cleanupModalBackdrops();
  
  // Clean up on page unload
  window.addEventListener('beforeunload', cleanupModalBackdrops);
};
