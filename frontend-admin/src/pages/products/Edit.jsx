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
                
                console.log("Fetching product with ID:", id);
                const product = await api.getProductByIdApi(id);
                console.log("Fetched product data:", product);
                  // Transform the product data to match the form structure
                const transformedData = {
                    name: product.name || '',
                    description: product.description || '',
                    price: product.price || '',
                    stock: product.stock || 0,  // API returns 'stock', not 'stock_quantity'
                    category: product.category || '',
                    sku: product.sku || '',
                    is_active: product.is_active !== undefined ? product.is_active : true,
                    // Transform images for the form
                    managedImages: product.images ? product.images.map((img, index) => ({
                        id: `existing-${index}`,
                        preview: img.file || img.url,  // API returns 'file', not 'image'
                        isExternal: true,
                        file: null
                    })) : [],
                    // Set thumbnail if available
                    selectedThumbnailId: product.thumbnail && product.images && product.images.length > 0 
                        ? `existing-0` 
                        : null
                };
                
                setInitialData(transformedData);
            } catch (err) {
                console.error("Error fetching product:", err);
                setError(err.message || "Failed to fetch product");
            } finally {
                setProductLoading(false);
            }
        };

        if (id) {
            fetchProduct();
        }
    }, [id]);

    const handleSubmit = async (productData) => {
        try {
            setLoading(true);
            setError(null);
            
            console.log("Updating product with data:", productData);
            const response = await api.updateProductApi(id, productData);
            console.log("Product update response:", response);
            
            // Show success notification
            alert("Product updated successfully!");
            
            // Redirect back to products list
            navigate('/products');
        } catch (err) {
            console.error("Error updating product:", err);
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
                    <div className="text-tiny">Loading product...</div>
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