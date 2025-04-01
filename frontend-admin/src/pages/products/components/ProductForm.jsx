import { useState, useEffect } from 'react';
import ImageUploadSection from './ImageUploadSection';
import ProductDetailsSection from './ProductDetailsSection';
import AttributesSection from './AttributesSection';
import PricingInventorySection from './PricingInventorySection';
import { getCategoriesApi } from '../../../services/api';

export default function ProductForm({ onSubmit, isLoading, initialData = {} }) {
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        images: [],
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
    
    // Fetch categories on component mount
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoading(true);
                const response = await getCategoriesApi();
                setCategories(response);
            } catch (error) {
                console.error('Error fetching categories:', error);
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
                    
                    // Mock data for now
                    setCategoryAttributes([
                        { id: 1, name: 'Material', type: 'select', options: ['Cotton', 'Polyester', 'Wool'] },
                        { id: 2, name: 'Weight', type: 'number' },
                        { id: 3, name: 'Waterproof', type: 'boolean' }
                    ]);
                    
                    setShowAttributes(true);
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
    }, [formData.category]);
    
    const handleInputChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleImageUpload = (images) => {
        setFormData(prev => ({ ...prev, images }));
    };
    
    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form className="form-add-product" onSubmit={handleSubmit}>
            <ImageUploadSection 
                images={formData.images} 
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
