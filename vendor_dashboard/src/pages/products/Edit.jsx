import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ProductForm from './components/ProductForm';
import { ProductFormSkeleton } from '../../components/Skeleton';
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
                      // Price handling - follow same logic as Add.jsx
                    // If old_price exists, then current price is actually the sale price
                    // and old_price is the original price
                    price: (() => {
                        if (product.old_price) {
                            // Product is on sale: show old_price as the original price
                            return String(product.old_price);
                        } else {
                            // Regular product: show current price
                            return product.price ? String(product.price) : '';
                        }
                    })(),
                    
                    salePrice: (() => {
                        if (product.old_price) {
                            // Product is on sale: current price is the sale price
                            return product.price ? String(product.price) : '';
                        } else {
                            // No sale: salePrice is empty
                            return '';
                        }
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
                        
                        // First, determine which image should be the thumbnail
                        let thumbnailImageId = null;
                        if (product.thumbnail && product.images.length > 0) {
                            const matchingImageIndex = product.images.findIndex(img => 
                                (img.file && img.file === product.thumbnail) ||
                                (img.image && img.image === product.thumbnail) ||
                                (img.url && img.url === product.thumbnail)
                            );
                            if (matchingImageIndex !== -1) {
                                thumbnailImageId = product.images[matchingImageIndex].id || matchingImageIndex;
                            } else {
                                // Default to first image
                                thumbnailImageId = product.images[0].id || 0;
                            }
                        }
                        
                        return product.images.map((img, index) => {
                            const imageId = img.id || index;
                            const imageUrl = img.file || img.image || img.url || '';
                            return {
                                id: `existing-${imageId}`,
                                preview: imageUrl,
                                isExternal: true,
                                file: null,
                                originalData: img, // Keep original data for reference
                                isThumbnail: thumbnailImageId === imageId // Mark the thumbnail image
                            };
                        });
                    })(),
                };
                
                console.log("=== TRANSFORMATION RESULTS ===");
                console.log("Transformed data:", transformedData);
                console.log("Transformed category:", transformedData.category);
                console.log("Transformed brand:", transformedData.brand);
                console.log("Transformed price:", transformedData.price);
                console.log("Transformed salePrice:", transformedData.salePrice);
                console.log("Transformed stock:", transformedData.stock);
                console.log("Transformed images count:", transformedData.managedImages.length);
                console.log("Transformed images with thumbnails:", transformedData.managedImages.map(img => ({ id: img.id, isThumbnail: img.isThumbnail })));
                
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
            console.log("Form data to submit:", productData);            // Transform data for API submission - follow same logic as Add.jsx
            const apiData = {
                ...productData,
                stock: productData.stock ? Number(productData.stock) : 0,
                category_id: productData.category ? Number(productData.category) : null
            };
            
            // Handle price/sale price logic (same as Add.jsx)
            if (productData.salePrice && productData.salePrice.trim() !== '') {
                // Sale price is provided: salePrice becomes price, price becomes old_price
                apiData.price = productData.salePrice;
                apiData.old_price = productData.price;
            } else {
                // No sale price: use regular price, remove old_price
                apiData.price = productData.price;
                delete apiData.old_price;
            }
            
            // Remove frontend-only fields
            delete apiData.category;
            delete apiData.salePrice;
              console.log("API submission data:", apiData);
            console.log("Corrected price logic:");
            console.log("- Original price field:", apiData.price);
            console.log("- Old price field:", apiData.old_price);
            console.log("- Category ID being sent:", apiData.category_id, typeof apiData.category_id);
            
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
                
                <ProductFormSkeleton />
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