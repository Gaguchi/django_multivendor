import { useState } from 'react';
import ProductForm from './components/ProductForm';
// import Breadcrumb from '../../components/Breadcrumb'; // No longer used
import * as api from '../../services/api';
import { Link } from 'react-router-dom'; // Added for breadcrumb links

export default function Add() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
      const handleSubmit = async (productData) => {
        try {
            setLoading(true);
            setError(null);
            
            // Transform price data according to business logic
            const transformedData = { ...productData };
            
            // Handle price logic: if salePrice is empty, use price as price
            // if salePrice has value, use salePrice as price and price as old_price
            if (productData.salePrice && productData.salePrice.trim() !== '') {
                // Sale price is provided
                transformedData.price = productData.salePrice;
                transformedData.old_price = productData.price;
            } else {
                // No sale price, use regular price
                transformedData.price = productData.price;
                // Remove old_price if no sale price
                delete transformedData.old_price;
            }
            
            // Remove salePrice from the data sent to API as it's not expected by backend
            delete transformedData.salePrice;
            
            console.log("Original product data:", productData);
            console.log("Transformed product data:", transformedData);
            const response = await api.createProductApi(transformedData);
            console.log("Product creation response:", response);
            
            // Show success notification
            alert("Product added successfully!");
            
            // Reset form or redirect
        } catch (err) {
            console.error("Error creating product:", err);
            setError(err.message || "Failed to create product");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="flex items-center flex-wrap justify-between gap20 mb-30">
                <h3>Add Product</h3>
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
                        <div className="text-tiny">Add Product</div>
                    </li>
                </ul>
            </div>
            
            {error && (
                <div className="alert alert-danger mb-20">
                    <p>{error}</p>
                </div>
            )}
            
            <ProductForm 
                onSubmit={handleSubmit} 
                isLoading={loading}
            />
        </>
    );
}