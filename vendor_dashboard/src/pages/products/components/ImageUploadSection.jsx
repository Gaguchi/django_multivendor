import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ImageUploadSkeleton } from '../../../components/Skeleton';
import './ImageUploadSection.css'; // We'll create this file for custom styles

const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

// Debug utility to log thumbnail state
const debugThumbnailState = (context, managedImages, selectedThumbnailId) => {
    console.log(`ImageUploadSection [${context}]:`, {
        imageCount: managedImages.length,
        selectedThumbnailId,
        thumbnailExists: managedImages.some(img => img.id === selectedThumbnailId),
        imageIds: managedImages.map(img => img.id)
    });
};

export default function ImageUploadSection({ 
    initialImages = [], 
    onImagesChange,
    loading = false 
}) {
    const fileInputRef = useRef(null);
    const [managedImages, setManagedImages] = useState([]);
    const [selectedThumbnailId, setSelectedThumbnailId] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    
    // Ref to store the latest managedImages for cleanup
    const imagesRef = useRef(managedImages);
    useEffect(() => {
        imagesRef.current = managedImages;
    }, [managedImages]);    // Initialize images from props - REVISED to prevent infinite loops and image duplication
    useEffect(() => {
        console.log("ImageUploadSection: Processing initialImages", initialImages);
        // This effect should map initialImages to managedImages and selectedThumbnailId
        // It should only run when initialImages prop changes.

        const processedImages = initialImages.map(img => {
            if (img instanceof File) {
                return {
                    id: generateId(),
                    file: img,
                    preview: URL.createObjectURL(img),
                    isExternal: false,
                };
            }
            // If it's an object with an id and preview, assume it's an existing image
            if (img && typeof img.id === 'string' && typeof img.preview === 'string') {
                return { ...img, file: null }; // Ensure file is null for existing images not yet replaced
            }
            // Log or handle unexpected image formats if necessary
            console.warn("Unexpected initial image format:", img);
            return null;
        }).filter(Boolean); // Filter out any nulls from unexpected formats

        console.log("ImageUploadSection: Processed images", processedImages);

        setManagedImages(currentManagedImages => {
            // In edit mode, when initialImages change, we want to replace all managed images
            // This prevents duplication when updating products
            
            // Basic check to prevent update if objects are effectively the same (shallow compare by id and preview)
            if (currentManagedImages.length === processedImages.length &&
                currentManagedImages.every((img, index) => img.id === processedImages[index]?.id && img.preview === processedImages[index]?.preview)) {
                console.log("ImageUploadSection: Skipping managed images update - no changes detected");
                return currentManagedImages;
            }
            
            console.log("ImageUploadSection: Updating managed images from", currentManagedImages.length, "to", processedImages.length);
            debugThumbnailState("Before updating managed images", currentManagedImages, selectedThumbnailId);
            
            // Clean up old blob URLs before replacing
            currentManagedImages.forEach(img => {
                if (img.preview && img.preview.startsWith('blob:') && !img.isExternal) {
                    URL.revokeObjectURL(img.preview);
                }
            });
            
            return processedImages;
        });

        // Handle thumbnail selection logic
        setSelectedThumbnailId(currentSelectedThumbnailId => {
            // First check if there's an initial thumbnail marked
            const initialThumbnail = initialImages.find(img => img.isThumbnail);
            if (initialThumbnail) {
                console.log("ImageUploadSection: Found initial thumbnail with isThumbnail flag:", initialThumbnail.id);
                return initialThumbnail.id;
            }
            
            // If no images, clear thumbnail
            if (processedImages.length === 0) {
                console.log("ImageUploadSection: No images, clearing thumbnail");
                return null;
            }
            
            // Check if the current selectedThumbnailId is still valid within the new processedImages
            const currentThumbnailStillValid = processedImages.some(img => img.id === currentSelectedThumbnailId);
            if (currentThumbnailStillValid) {
                console.log("ImageUploadSection: Current thumbnail still valid:", currentSelectedThumbnailId);
                return currentSelectedThumbnailId;
            }
            
            // Default to first image if current selection is invalid
            console.log("ImageUploadSection: Defaulting to first image as thumbnail:", processedImages[0].id);
            return processedImages[0].id;
        });

    }, [initialImages]); // Corrected dependency array

    const processFiles = useCallback(async (files) => {
        setIsProcessing(true);
        
        try {
            const imageFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
            if (imageFiles.length === 0) return;

            const newImageObjects = imageFiles.map(file => ({
                id: generateId(),
                file: file,
                preview: URL.createObjectURL(file),
                isExternal: false
            }));

            setManagedImages(prevImages => {
                const updatedImages = [...prevImages, ...newImageObjects];
                
                // If no thumbnail is selected yet, and we're adding new images, select the first new one.
                if (!selectedThumbnailId && updatedImages.length > 0) {
                    setSelectedThumbnailId(updatedImages[0].id);
                } else if (selectedThumbnailId === null && updatedImages.length > 0) {
                    // This condition ensures a thumbnail is selected if one wasn't previously.
                    setSelectedThumbnailId(updatedImages[0].id);
                }
                
                return updatedImages;
            });
        } catch (error) {
            console.error('Error processing image files:', error);
        } finally {
            setIsProcessing(false);
        }
    }, [selectedThumbnailId]);

    const handleFileSelect = (e) => {
        processFiles(e.target.files);
        if (fileInputRef.current) {
            fileInputRef.current.value = ""; // Reset file input to allow selecting the same file again
        }
    };

    const openFileDialog = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const removeImage = (idToRemove) => {
        // Add confirmation dialog
        const confirmRemoval = window.confirm('Are you sure you want to remove this image?');
        if (!confirmRemoval) return;

        setManagedImages(prevImages => {
            const imageToRemove = prevImages.find(img => img.id === idToRemove);
            if (imageToRemove && imageToRemove.preview.startsWith('blob:') && !imageToRemove.isExternal) {
                URL.revokeObjectURL(imageToRemove.preview);
            }
            
            const updatedImages = prevImages.filter(img => img.id !== idToRemove);
            
            // Handle thumbnail selection when removing current thumbnail
            if (selectedThumbnailId === idToRemove) {
                const newThumbnailId = updatedImages.length > 0 ? updatedImages[0].id : null;
                setSelectedThumbnailId(newThumbnailId);
                console.log("ImageUploadSection: Thumbnail removed, setting new thumbnail:", newThumbnailId);
            }
            return updatedImages;
        });
    };

    const handleSetThumbnail = (idToSet) => {
        console.log("ImageUploadSection: Setting thumbnail to:", idToSet);
        setSelectedThumbnailId(idToSet);
        
        // Provide user feedback
        const image = managedImages.find(img => img.id === idToSet);
        if (image) {
            console.log("ImageUploadSection: Thumbnail successfully set for image:", image.id);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            processFiles(e.dataTransfer.files);
            e.dataTransfer.clearData();
        }
    };

    // Effect to call onImagesChange when state updates - stabilized with useCallback
    useEffect(() => {
        // Add safety check to prevent React error #31
        if (typeof onImagesChange === 'function') {
            try {
                const imageData = { 
                    managedImages, 
                    selectedThumbnailId,
                    thumbnailImage: managedImages.find(img => img.id === selectedThumbnailId) || null
                };
                console.log("ImageUploadSection: Calling onImagesChange with:", imageData);
                onImagesChange(imageData);
            } catch (error) {
                console.error('Error in onImagesChange callback:', error);
                // Don't throw the error, just log it to prevent breaking the component
            }
        }
    }, [managedImages, selectedThumbnailId]); // Remove onImagesChange from dependencies to prevent loops

    // Effect for cleanup of object URLs on unmount
    useEffect(() => {
        return () => {
            imagesRef.current.forEach(img => {
                if (img.preview && img.preview.startsWith('blob:') && !img.isExternal) {
                    URL.revokeObjectURL(img.preview);
                }
            });
        };
    }, []); // Runs only on unmount

    // Show skeleton loader during initial loading
    if (loading) {
        return <ImageUploadSkeleton />;
    }

    return (
        <div className="wg-box mb-30">
            <fieldset>
                <div className="body-title mb-10">Upload images</div>
                <div 
                    className={`upload-image-area mb-16 ${isDragging ? 'dragging' : ''}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    <div className="up-load">
                        {/* Make label keyboard accessible and clickable */}
                        <label 
                            className="uploadfile" 
                            onClick={openFileDialog} 
                            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && openFileDialog()}
                            tabIndex="0" 
                            role="button"
                            aria-label="Upload images"
                        >
                            <span className="icon">
                                <i className="icon-upload-cloud" />
                            </span>
                            <div className="text-tiny">
                                Drop your images here or select{" "}
                                <span className="text-secondary">click to browse</span>
                            </div>
                            <input 
                                type="file" 
                                ref={fileInputRef}
                                multiple
                                onChange={handleFileSelect}
                                accept="image/*"
                                style={{ display: 'none' }}
                                aria-hidden="true"
                            />
                        </label>
                    </div>
                    
                    {isProcessing && (
                        <div className="upload-processing">
                            <div className="d-flex align-items-center justify-content-center p-3">
                                <div className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></div>
                                <span>Processing images...</span>
                            </div>
                        </div>
                    )}
                    
                    {managedImages.length > 0 && (
                        <div className="image-previews-container">
                            {managedImages.map((image) => (
                                <div 
                                    className={`image-preview-item ${selectedThumbnailId === image.id ? 'thumbnail' : ''}`} 
                                    key={image.id}
                                >
                                    <img 
                                        src={image.preview} 
                                        alt={`Preview ${image.file ? image.file.name : image.id}`}
                                        className="preview-image-tag"
                                        onLoad={() => console.log("ImageUploadSection: Image loaded:", image.id)}
                                        onError={(e) => {
                                            console.error("ImageUploadSection: Image failed to load:", image.id, e);
                                            e.target.style.display = 'none';
                                        }}
                                    />
                                    <div className="image-actions">
                                        <button 
                                            type="button"
                                            className="btn-remove-image"
                                            onClick={() => removeImage(image.id)}
                                            title="Remove image"
                                            aria-label={`Remove image ${image.file ? image.file.name : image.id}`}
                                        >
                                            <i className="icon-close" />
                                        </button>
                                        {selectedThumbnailId !== image.id && (
                                            <button
                                                type="button"
                                                className="btn-set-thumbnail"
                                                onClick={() => handleSetThumbnail(image.id)}
                                                title="Set as thumbnail"
                                                aria-label={`Set image ${image.file ? image.file.name : image.id} as thumbnail`}
                                            >
                                                <i className="icon-star" />
                                            </button>
                                        )}
                                    </div>
                                    {selectedThumbnailId === image.id && (
                                        <div className="thumbnail-indicator">
                                            <span className="thumbnail-badge" aria-label="Current thumbnail">
                                                <i className="icon-star" /> THUMBNAIL
                                            </span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div className="body-text">
                    You need to add at least 4 images. Pay attention to the quality of the
                    pictures you add, comply with the background color standards. Pictures
                    must be in certain dimensions. Notice that the product shows all the
                    details
                </div>
            </fieldset>
        </div>
    );
}

// Consider adding PropTypes for better component contract definition
// import PropTypes from 'prop-types';
// ImageUploadSection.propTypes = {
//   initialImages: PropTypes.arrayOf(
//     PropTypes.oneOfType([
//       PropTypes.instanceOf(File), // For new uploads
//       PropTypes.shape({          // For existing images (e.g. from server)
//         id: PropTypes.string.isRequired,
//         preview: PropTypes.string.isRequired,
//         file: PropTypes.instanceOf(File), // Optional, might not exist for server URLs
//         isExternal: PropTypes.bool,
//         isThumbnail: PropTypes.bool // Optional: if initial data specifies thumbnail
//       })
//     ]
