import { useEffect } from 'react';

export default function ReviewMediaModal({ isOpen, onClose, media }) {
  // Close on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);
  
  // Close on backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };
  
  if (!isOpen || !media) return null;
  
  return (
    <div 
      className="modal review-media-modal d-block" 
      tabIndex="-1" 
      role="dialog"
      onClick={handleBackdropClick}
    >
      <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
        <div className="modal-content">
          <button 
            type="button" 
            className="close" 
            onClick={onClose} 
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
          <div className="modal-body">
            {media.type === 'image' ? (
              <img 
                src={media.url} 
                alt="Review media" 
                className="img-fluid" 
              />
            ) : (
              <video 
                src={media.url} 
                className="img-fluid" 
                controls 
                autoPlay 
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
