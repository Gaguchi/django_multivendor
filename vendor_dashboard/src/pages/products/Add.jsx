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
            
            console.log("Submitting product data:", productData);
            const response = await api.createProductApi(productData);
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