import { useState, useRef } from 'react';

export default function ImageUploadSection({ images = [], onImagesChange }) {
    const fileInputRef = useRef(null);
    const [previewImages, setPreviewImages] = useState(images);
    
    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;
        
        const newImages = files.map(file => ({
            file,
            preview: URL.createObjectURL(file)
        }));
        
        const updatedImages = [...previewImages, ...newImages];
        setPreviewImages(updatedImages);
        onImagesChange(updatedImages);
    };
    
    const openFileDialog = () => {
        fileInputRef.current.click();
    };
    
    const removeImage = (indexToRemove) => {
        const updatedImages = previewImages.filter((_, index) => index !== indexToRemove);
        setPreviewImages(updatedImages);
        onImagesChange(updatedImages);
    };

    return (
        <div className="wg-box mb-30">
            <fieldset>
                <div className="body-title mb-10">Upload images</div>
                <div className="upload-image mb-16">
                    <div className="up-load">
                        <label className="uploadfile" onClick={openFileDialog}>
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
                            />
                        </label>
                    </div>
                    
                    {previewImages.length > 0 && (
                        <div className="flex gap20 flex-wrap">
                            {previewImages.map((image, index) => (
                                <div className="item relative" key={index}>
                                    <img 
                                        src={image.preview || image} 
                                        alt={`Preview ${index}`}
                                        className="w-100 h-100 object-cover"
                                    />
                                    <button 
                                        type="button"
                                        className="btn-remove absolute top-2 right-2 bg-white rounded-full p-1"
                                        onClick={() => removeImage(index)}
                                    >
                                        <i className="icon-close" />
                                    </button>
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
