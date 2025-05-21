import { useState, useEffect, useCallback } from 'react';
import ImageUploadSection from './ImageUploadSection';
import ProductDetailsSection from './ProductDetailsSection';
import AttributesSection from './AttributesSection';
import PricingInventorySection from './PricingInventorySection';
import { getCategoriesApi } from '../../../services/api';

export default function ProductForm({ onSubmit, isLoading, initialData = {} }) {
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
    
    const [showAttributes, setShowAttributes] = useState(false);
    const [categoryAttributes, setCategoryAttributes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    // Fetch categories on component mount
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await getCategoriesApi();
                console.log('Categories API response:', response);
                
                // Store the full response object which contains the results array
                setCategories(response);
            } catch (error) {
                console.error('Error fetching categories:', error);
                setError('Failed to load categories');
            } finally {
                setLoading(false);
            }
        };
        
        fetchCategories();
    }, []);
    
    // Handle category change
    useEffect(() => {
        const fetchCategoryAttributes = async () => {
            if (formData.category) {
                try {
                    setLoading(true);
                    // In a real implementation, you'd make an API call to get attributes by category
                    // const response = await getCategoryAttributesApi(formData.category);
                    // setCategoryAttributes(response);
                    
                    // Look up the selected category in our categories data to get its attributes
                    const allCategories = categories?.results || [];
                    let selectedCategory = null;
                    
                    // Search in root categories
                    for (const cat of allCategories) {
                        if (cat.id === parseInt(formData.category)) {
                            selectedCategory = cat;
                            break;
                        }
                        
                        // Search in subcategories if not found
                        if (cat.subcategories) {
                            for (const subCat of cat.subcategories) {
                                if (subCat.id === parseInt(formData.category)) {
                                    selectedCategory = subCat;
                                    break;
                                }
                                
                                // Search in sub-subcategories if available
                                if (subCat.subcategories) {
                                    for (const subSubCat of subCat.subcategories) {
                                        if (subSubCat.id === parseInt(formData.category)) {
                                            selectedCategory = subSubCat;
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                    }
                    
                    // If we found the category, get its attribute groups
                    if (selectedCategory && selectedCategory.attribute_groups) {
                        const attributes = [];
                        
                        // Flatten attributes from all attribute groups
                        selectedCategory.attribute_groups.forEach(group => {
                            group.attributes.forEach(attr => {
                                attributes.push({
                                    id: attr.id,
                                    name: attr.name,
                                    type: attr.attribute_type,
                                    required: attr.is_required,
                                    options: attr.options?.map(opt => opt.value) || []
                                });
                            });
                        });
                        
                        setCategoryAttributes(attributes);
                        setShowAttributes(attributes.length > 0);
                    } else {
                        // Mock data for development if no attributes found
                        setCategoryAttributes([
                            { id: 1, name: 'Material', type: 'select', options: ['Cotton', 'Polyester', 'Wool'] },
                            { id: 2, name: 'Weight', type: 'number' },
                            { id: 3, name: 'Waterproof', type: 'boolean' }
                        ]);
                        setShowAttributes(true);
                    }
                } catch (error) {
                    console.error('Error fetching category attributes:', error);
                } finally {
                    setLoading(false);
                }
            } else {
                setShowAttributes(false);
                setCategoryAttributes([]);
            }
        };
        
        fetchCategoryAttributes();
    }, [formData.category, categories]);
    
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
            
            {showAttributes && (
                <AttributesSection 
                    attributes={categoryAttributes}
                    formData={formData}
                    onChange={handleInputChange}
                />
            )}
            
            <PricingInventorySection 
                formData={formData}
                onChange={handleInputChange}
            />
            
            <div className="cols gap10">
                <button 
                    className="tf-button w380" 
                    type="submit"
                    disabled={isLoading}
                >
                    {isLoading ? 'Adding product...' : 'Add product'}
                </button>
                <a href="#" className="tf-button style-3 w380" type="button">
                    Cancel
                </a>
            </div>
        </form>
    );
}
