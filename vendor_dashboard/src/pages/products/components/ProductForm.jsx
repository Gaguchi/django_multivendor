import { useState, useEffect, useCallback } from 'react';
import ImageUploadSection from './ImageUploadSection';
import ProductDetailsSection from './ProductDetailsSection';
import PricingInventorySection from './PricingInventorySection';
import { getCategoriesApi } from '../../../services/api';

export default function ProductForm({ onSubmit, isLoading, initialData = {}, isEdit = false }) {
    const [categories, setCategories] = useState({ results: [] });
    const [formData, setFormData] = useState({
        // Initialize with an empty array for managedImages and null for selectedThumbnailId
        managedImages: [],
        selectedThumbnailId: null,
        name: '',
        category: '',
        price: '',
        salePrice: '',
        scheduleDate: '',
        brand: '',
        color: 'Orange',
        size: 'S',
        sku: '',
        stock: '',
        tags: '',
        description: '',
        ...initialData
    });
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);    // Update form data when initialData changes (for edit mode)
    useEffect(() => {
        if (initialData && Object.keys(initialData).length > 0) {
            console.log('ProductForm: Updating form with initial data:', initialData);
            console.log('ProductForm: Initial category value:', initialData.category);
            console.log('ProductForm: Initial brand value:', initialData.brand);
            setFormData(prev => ({
                ...prev,
                ...initialData
            }));
        }
    }, [initialData]);    // Fetch categories on component mount
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await getCategoriesApi();
                console.log('ProductForm: Categories API response:', response);
                console.log('ProductForm: Categories array:', response?.results || response);
                
                // Store the full response object which contains the results array
                setCategories(response);
            } catch (error) {
                console.error('ProductForm: Error fetching categories:', error);
                setError('Failed to load categories');
            } finally {
                setLoading(false);
            }
        };
        
        fetchCategories();
    }, []);
    
    const handleInputChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleImageUpload = useCallback(({ managedImages, selectedThumbnailId }) => {
        setFormData(prev => ({ 
            ...prev, 
            managedImages, 
            selectedThumbnailId 
        }));
    }, []); // Add useCallback with empty dependency array
    
    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form className="form-add-product" onSubmit={handleSubmit}>
            {error && (
                <div className="alert alert-danger mb-20">
                    <p>{error}</p>
                </div>
            )}
            
            <ImageUploadSection 
                initialImages={formData.managedImages} 
                onImagesChange={handleImageUpload}
            />
            
            <ProductDetailsSection 
                formData={formData}
                onChange={handleInputChange}
                categories={categories}
                loading={loading}
            />
            
            <PricingInventorySection 
                formData={formData}
                onChange={handleInputChange}
            />
            
            <div className="cols gap10">                <button 
                    className="tf-button w380" 
                    type="submit"
                    disabled={isLoading}
                >
                    {isLoading 
                        ? (isEdit ? 'Updating product...' : 'Adding product...') 
                        : (isEdit ? 'Update product' : 'Add product')
                    }
                </button>
                <a href="#" className="tf-button style-3 w380" type="button">
                    Cancel
                </a>
            </div>
        </form>
    );
}
