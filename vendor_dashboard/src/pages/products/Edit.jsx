import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ProductForm from './components/ProductForm';
import * as api from '../../services/api';

export default function Edit() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [initialData, setInitialData] = useState(null);
    const [productLoading, setProductLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setProductLoading(true);
                setError(null);
                
                console.log("=== FETCHING PRODUCT FOR EDIT ===");
                console.log("Product ID:", id);
                
                const product = await api.getProductByIdApi(id);
                console.log("Raw API response:", product);
                
                // Defensive checks for the product data
                if (!product || typeof product !== 'object') {
                    throw new Error("Invalid product data received from API");
                }
                
                // Log individual fields for debugging
                console.log("=== PRODUCT FIELD ANALYSIS ===");
                console.log("Category data:", product.category);
                console.log("Category type:", typeof product.category);
                console.log("Brand data:", product.brand);
                console.log("Brand type:", typeof product.brand);
                console.log("Price data:", product.price);
                console.log("Old price data:", product.old_price);
                console.log("Sale price data:", product.sale_price);
                console.log("Stock data:", product.stock);
                console.log("Images data:", product.images);
                
                // Transform the product data to match the form structure with robust handling
                const transformedData = {
                    // Basic product information
                    name: product.name || '',
                    description: product.description || '',
                    sku: product.sku || '',
                    is_active: product.is_active !== undefined ? product.is_active : true,
                    
                    // Price handling - robust conversion
                    price: product.price ? String(product.price) : '',
                    
                    // Handle sale price vs old price mapping
                    salePrice: (() => {
                        if (product.sale_price) return String(product.sale_price);
                        if (product.old_price) return String(product.old_price);
                        return '';
                    })(),
                    
                    // Stock handling with fallbacks
                    stock: (() => {
                        if (product.stock !== undefined) return Number(product.stock);
                        if (product.stock_quantity !== undefined) return Number(product.stock_quantity);
                        return 0;
                    })(),
                    
                    // Category handling - support multiple formats
                    category: (() => {
                        if (!product.category) return '';
                        if (typeof product.category === 'object') {
                            return product.category.id ? String(product.category.id) : '';
                        }
                        return String(product.category);
                    })(),
                    
                    // Brand handling
                    brand: product.brand ? String(product.brand) : '',
                    
                    // Optional fields with defaults
                    tags: product.tags || '',
                    color: product.color || 'Orange',
                    size: product.size || 'S',
                    
                    // Image handling with robust transformation
                    managedImages: (() => {
                        if (!product.images || !Array.isArray(product.images)) return [];
                        return product.images.map((img, index) => {
                            // Handle different image object structures
                            const imageUrl = img.file || img.image || img.url || '';
                            return {
                                id: `existing-${img.id || index}`,
                                preview: imageUrl,
                                isExternal: true,
                                file: null,
                                originalData: img // Keep original data for reference
                            };
                        });
                    })(),
                    
                    // Thumbnail selection
                    selectedThumbnailId: (() => {
                        if (product.thumbnail && product.images && product.images.length > 0) {
                            // Try to find the image that matches the thumbnail
                            const matchingImageIndex = product.images.findIndex(img => 
                                (img.file && img.file === product.thumbnail) ||
                                (img.image && img.image === product.thumbnail) ||
                                (img.url && img.url === product.thumbnail)
                            );
                            if (matchingImageIndex !== -1) {
                                return `existing-${product.images[matchingImageIndex].id || matchingImageIndex}`;
                            }
                            // Default to first image
                            return `existing-${product.images[0].id || 0}`;
                        }
                        return null;
                    })()
                };
                
                console.log("=== TRANSFORMATION RESULTS ===");
                console.log("Transformed data:", transformedData);
                console.log("Transformed category:", transformedData.category);
                console.log("Transformed brand:", transformedData.brand);
                console.log("Transformed price:", transformedData.price);
                console.log("Transformed salePrice:", transformedData.salePrice);
                console.log("Transformed stock:", transformedData.stock);
                console.log("Transformed images count:", transformedData.managedImages.length);
                console.log("Selected thumbnail ID:", transformedData.selectedThumbnailId);
                
                setInitialData(transformedData);
            } catch (err) {
                console.error("=== ERROR FETCHING PRODUCT ===");
                console.error("Error details:", err);
                console.error("Error message:", err.message);
                setError(err.message || "Failed to fetch product");
            } finally {
                setProductLoading(false);
            }
        };

        if (id) {
            fetchProduct();
        } else {
            setError("No product ID provided");
            setProductLoading(false);
        }
    }, [id]);

    const handleSubmit = async (productData) => {
        try {
            setLoading(true);
            setError(null);
            
            console.log("=== SUBMITTING PRODUCT UPDATE ===");
            console.log("Form data to submit:", productData);            // Transform data for API submission if needed
            const apiData = {
                ...productData,
                // Ensure numeric fields are properly formatted
                price: productData.price ? String(productData.price) : '',
                stock: productData.stock ? Number(productData.stock) : 0,
                // Handle sale price mapping
                sale_price: productData.salePrice || '',
                // Send category as category_id for backend
                category_id: productData.category ? Number(productData.category) : null
            };
            
            // Remove the old category field to avoid confusion
            delete apiData.category;
            
            console.log("API submission data:", apiData);
            console.log("Category being sent:", apiData.category, typeof apiData.category);
            
            const response = await api.updateProductApi(id, apiData);
            console.log("Update response:", response);
            
            // Show success notification
            alert("Product updated successfully!");
            
            // Redirect back to products list
            navigate('/products');
        } catch (err) {
            console.error("=== ERROR UPDATING PRODUCT ===");
            console.error("Error details:", err);
            setError(err.message || "Failed to update product");
        } finally {
            setLoading(false);
        }
    };

    if (productLoading) {
        return (
            <>
                <div className="flex items-center flex-wrap justify-between gap20 mb-30">
                    <h3>Edit Product</h3>
                    <ul className="breadcrumbs flex items-center flex-wrap justify-start gap10">
                        <li>
                            <Link to="/">
                                <div className="text-tiny">Dashboard</div>
                            </Link>
                        </li>
                        <li>
                            <i className="icon-chevron-right" />
                        </li>
                        <li>
                            <Link to="/products">
                                <div className="text-tiny">Product</div>
                            </Link>
                        </li>
                        <li>
                            <i className="icon-chevron-right" />
                        </li>
                        <li>
                            <div className="text-tiny">Edit Product</div>
                        </li>
                    </ul>
                </div>
                
                <div className="flex justify-center items-center py-20">
                    <div className="text-tiny">Loading product data...</div>
                </div>
            </>
        );
    }

    if (error && !initialData) {
        return (
            <>
                <div className="flex items-center flex-wrap justify-between gap20 mb-30">
                    <h3>Edit Product</h3>
                    <ul className="breadcrumbs flex items-center flex-wrap justify-start gap10">
                        <li>
                            <Link to="/">
                                <div className="text-tiny">Dashboard</div>
                            </Link>
                        </li>
                        <li>
                            <i className="icon-chevron-right" />
                        </li>
                        <li>
                            <Link to="/products">
                                <div className="text-tiny">Product</div>
                            </Link>
                        </li>
                        <li>
                            <i className="icon-chevron-right" />
                        </li>
                        <li>
                            <div className="text-tiny">Edit Product</div>
                        </li>
                    </ul>
                </div>
                
                <div className="alert alert-danger mb-20">
                    <p>{error}</p>
                    <Link to="/products" className="tf-button style-1 mt-10">
                        Back to Products
                    </Link>
                </div>
            </>
        );
    }

    return (
        <>
            <div className="flex items-center flex-wrap justify-between gap20 mb-30">
                <h3>Edit Product</h3>
                <ul className="breadcrumbs flex items-center flex-wrap justify-start gap10">
                    <li>
                        <Link to="/">
                            <div className="text-tiny">Dashboard</div>
                        </Link>
                    </li>
                    <li>
                        <i className="icon-chevron-right" />
                    </li>
                    <li>
                        <Link to="/products">
                            <div className="text-tiny">Product</div>
                        </Link>
                    </li>
                    <li>
                        <i className="icon-chevron-right" />
                    </li>
                    <li>
                        <div className="text-tiny">Edit Product</div>
                    </li>
                </ul>
            </div>
            
            {error && (
                <div className="alert alert-danger mb-20">
                    <p>{error}</p>
                </div>
            )}
            
            {initialData && (
                <ProductForm 
                    onSubmit={handleSubmit} 
                    isLoading={loading}
                    initialData={initialData}
                    isEdit={true}
                />
            )}
        </>
    );
}