import { useState } from 'react';
import ProductForm from './components/ProductForm';
import Breadcrumb from '../../components/Breadcrumb';
import * as api from '../../services/api';

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
                <Breadcrumb 
                    items={[
                        { label: "Dashboard", url: "/" },
                        { label: "Product", url: "/products" },
                        { label: "Add Product" }
                    ]} 
                />
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