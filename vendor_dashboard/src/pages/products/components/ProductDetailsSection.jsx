import { useState } from 'react';

export default function ProductDetailsSection({ formData, onChange, categories = [], loading = false }) {
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        onChange(name, value);
    };
    
    const handleColorChange = (color) => {
        onChange('color', color);
    };
    
    const handleSizeChange = (size) => {
        onChange('size', size);
    };

    // Get the actual categories array to render
    const categoryItems = categories?.results || categories || [];
    
    // Debug logging
    console.log('ProductDetailsSection: Received categories:', categories);
    console.log('ProductDetailsSection: Category items to render:', categoryItems);
    console.log('ProductDetailsSection: Form data category value:', formData.category);
    console.log('ProductDetailsSection: Form data brand value:', formData.brand);

    return (
        <div className="wg-box mb-30">
            <fieldset className="name">
                <div className="body-title mb-10">
                    Product title <span className="tf-color-1">*</span>
                </div>
                <input
                    className="mb-10"
                    type="text"
                    placeholder="Enter title"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                />
                <div className="text-tiny text-surface-2">
                    Do not exceed 20 characters when entering the product name.
                </div>
            </fieldset>
            
            <fieldset className="category">
                <div className="body-title mb-10">
                    Category <span className="tf-color-1">*</span>
                </div>
                <select
                    className=""
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                >
                    <option value="">Choose category</option>
                    {Array.isArray(categoryItems) && categoryItems.map(category => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </select>
                {loading && <div className="text-tiny mt-2">Loading categories...</div>}
            </fieldset>
            
            <fieldset className="description">
                <div className="body-title mb-10">
                    Description <span className="tf-color-1">*</span>
                </div>
                <textarea
                    className="mb-10"
                    name="description"
                    placeholder="Short description about product"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                />
                <div className="text-tiny">
                    Do not exceed 100 characters when entering the product name.
                </div>
            </fieldset>
            
            <div className="cols-lg gap22">
                <fieldset className="choose-brand">
                    <div className="body-title mb-10">
                        Brand <span className="tf-color-1">*</span>
                    </div>
                    <input
                        type="text"
                        placeholder="Choose brand"
                        name="brand"
                        value={formData.brand}
                        onChange={handleInputChange}
                        required
                    />
                </fieldset>
                
                <fieldset className="variant-picker-item">
                    <div className="variant-picker-label body-title">
                        Color:{" "}
                        <span className="body-title-2 fw-4 variant-picker-label-value">
                            {formData.color}
                        </span>
                    </div>
                    <div className="variant-picker-values">
                        <input
                            id="values-orange"
                            type="radio"
                            name="color"
                            checked={formData.color === 'Orange'}
                            onChange={() => handleColorChange('Orange')}
                        />
                        <label
                            className="radius-60"
                            htmlFor="values-orange"
                            data-value="Orange"
                        >
                            <span className="btn-checkbox bg-color-orange" />
                        </label>
                        
                        <input 
                            id="values-blue" 
                            type="radio" 
                            name="color"
                            checked={formData.color === 'Blue'}
                            onChange={() => handleColorChange('Blue')}
                        />
                        <label
                            className="radius-60"
                            htmlFor="values-blue"
                            data-value="Blue"
                        >
                            <span className="btn-checkbox bg-color-blue" />
                        </label>
                        
                        <input 
                            id="values-yellow" 
                            type="radio" 
                            name="color"
                            checked={formData.color === 'Yellow'}
                            onChange={() => handleColorChange('Yellow')}
                        />
                        <label
                            className="radius-60"
                            htmlFor="values-yellow"
                            data-value="Yellow"
                        >
                            <span className="btn-checkbox bg-color-yellow" />
                        </label>
                        
                        <input 
                            id="values-black" 
                            type="radio" 
                            name="color"
                            checked={formData.color === 'Black'}
                            onChange={() => handleColorChange('Black')}
                        />
                        <label
                            className="radius-60"
                            htmlFor="values-black"
                            data-value="Black"
                        >
                            <span className="btn-checkbox bg-color-black" />
                        </label>
                    </div>
                </fieldset>
                
                <fieldset className="variant-picker-item">
                    <div className="variant-picker-label body-text">
                        Size:{" "}
                        <span className="body-title-2 variant-picker-label-value">{formData.size}</span>
                    </div>
                    <div className="variant-picker-values">
                        <input 
                            type="radio" 
                            name="size" 
                            id="values-s"
                            checked={formData.size === 'S'}
                            onChange={() => handleSizeChange('S')}
                        />
                        <label className="style-text" htmlFor="values-s" data-value="S">
                            <div className="text">S</div>
                        </label>
                        
                        <input 
                            type="radio" 
                            name="size" 
                            id="values-m"
                            checked={formData.size === 'M'}
                            onChange={() => handleSizeChange('M')}
                        />
                        <label className="style-text" htmlFor="values-m" data-value="M">
                            <div className="text">M</div>
                        </label>
                        
                        <input 
                            type="radio" 
                            name="size" 
                            id="values-l"
                            checked={formData.size === 'L'}
                            onChange={() => handleSizeChange('L')}
                        />
                        <label className="style-text" htmlFor="values-l" data-value="L">
                            <div className="text">L</div>
                        </label>
                        
                        <input 
                            type="radio" 
                            name="size" 
                            id="values-xl"
                            checked={formData.size === 'XL'}
                            onChange={() => handleSizeChange('XL')}
                        />
                        <label className="style-text" htmlFor="values-xl" data-value="XL">
                            <div className="text">XL</div>
                        </label>
                    </div>
                </fieldset>
            </div>
        </div>
    );
}
