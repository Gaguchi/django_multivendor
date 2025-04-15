import { useEffect, useState } from 'react';
import './AttributesSection.css';

export default function AttributesSection({ attributes = [], formData, onChange }) {
    // Track open/closed state of multi-select dropdowns
    const [openDropdowns, setOpenDropdowns] = useState({});
    
    // When attributes change, initialize their values in formData
    useEffect(() => {
        attributes.forEach(attr => {
            if (!formData[`attr_${attr.id}`]) {
                // Initialize attribute values based on type
                let initialValue;
                switch (attr.type) {
                    case 'select':
                        initialValue = attr.options?.[0] || '';
                        break;
                    case 'multi_select':
                        initialValue = [];
                        break;
                    case 'number':
                        initialValue = '';
                        break;
                    case 'boolean':
                        initialValue = false;
                        break;
                    default:
                        initialValue = '';
                }
                
                onChange(`attr_${attr.id}`, initialValue);
            }
        });
    }, [attributes]);

    const handleAttributeChange = (attrId, value) => {
        onChange(`attr_${attrId}`, value);
    };
    
    // Handle multi-select option toggle
    const handleMultiSelectToggle = (attrId, option) => {
        const currentValues = Array.isArray(formData[`attr_${attrId}`]) 
            ? [...formData[`attr_${attrId}`]] 
            : [];
            
        if (currentValues.includes(option)) {
            // Remove option if already selected
            onChange(`attr_${attrId}`, currentValues.filter(item => item !== option));
        } else {
            // Add option if not already selected
            onChange(`attr_${attrId}`, [...currentValues, option]);
        }
    };
    
    // Toggle dropdown open/closed state
    const toggleDropdown = (attrId) => {
        setOpenDropdowns(prev => ({
            ...prev,
            [attrId]: !prev[attrId]
        }));
    };

    // Function to chunk attributes into pairs
    const chunkAttributes = (arr, size) => 
        Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
            arr.slice(i * size, i * size + size)
        );

    const attributeChunks = chunkAttributes(attributes, 3); // Group by 3

    if (!attributes || attributes.length === 0) {
        return null;
    }

    return (
        <div className="wg-box mb-30">
            <h3 className="body-title mb-20">Product Attributes</h3>
            <p className="text-tiny mb-20">
                These attributes are specific to the selected category and help customers filter and find your product.
            </p>
            
            {/* Map over chunks to create rows */}
            {attributeChunks.map((chunk, index) => (
                <div key={`chunk-${index}`} className="cols-lg gap22 mb-20">
                    {chunk.map(attr => (
                        <fieldset key={attr.id} className="attribute-field">
                            <div className="body-title mb-10">
                                {attr.name} {attr.required && <span className="tf-color-1">*</span>}
                            </div>
                            
                            {attr.type === 'select' && (
                                <select
                                    className="attribute-select"
                                    name={`attr_${attr.id}`}
                                    value={formData[`attr_${attr.id}`] || ''}
                                    onChange={(e) => handleAttributeChange(attr.id, e.target.value)}
                                    required={attr.required}
                                >
                                    <option value="">Select {attr.name}</option>
                                    {attr.options?.map((option, idx) => (
                                        <option key={idx} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            )}
                            
                            {attr.type === 'multi_select' && (
                                <div className="multi-select-dropdown">
                                    <div 
                                        className="multi-select-header"
                                        onClick={() => toggleDropdown(attr.id)}
                                    >
                                        <span>
                                            {Array.isArray(formData[`attr_${attr.id}`]) && formData[`attr_${attr.id}`].length > 0
                                                ? `${formData[`attr_${attr.id}`].length} selected`
                                                : `Select ${attr.name}`
                                            }
                                        </span>
                                        <span className="dropdown-arrow">▼</span>
                                    </div>
                                    
                                    {openDropdowns[attr.id] && (
                                        <div className="multi-select-options">
                                            {attr.options?.map((option, idx) => (
                                                <div key={idx} className="multi-select-option">
                                                    <label className="checkbox-container">
                                                        <input
                                                            type="checkbox"
                                                            checked={Array.isArray(formData[`attr_${attr.id}`]) && 
                                                                    formData[`attr_${attr.id}`].includes(option)}
                                                            onChange={() => handleMultiSelectToggle(attr.id, option)}
                                                        />
                                                        <span className="checkmark"></span>
                                                        {option}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                            
                            {attr.type === 'number' && (
                                <input
                                    type="number"
                                    name={`attr_${attr.id}`}
                                    value={formData[`attr_${attr.id}`] || ''}
                                    onChange={(e) => handleAttributeChange(attr.id, e.target.value)}
                                    placeholder={`Enter ${attr.name}`}
                                    required={attr.required}
                                />
                            )}
                            
                            {attr.type === 'boolean' && (
                                <div className="flex items-center attribute-boolean">
                                    <label className="checkbox-container">
                                        <input
                                            type="checkbox"
                                            id={`attr_${attr.id}`}
                                            name={`attr_${attr.id}`}
                                            checked={formData[`attr_${attr.id}`] || false}
                                            onChange={(e) => handleAttributeChange(attr.id, e.target.checked)}
                                            required={attr.required}
                                        />
                                        <span className="checkmark"></span>
                                        {attr.name}
                                    </label>
                                </div>
                            )}
                            
                            {attr.description && (
                                <div className="text-tiny text-surface-2 mt-2">
                                    {attr.description}
                                </div>
                            )}
                        </fieldset>
                    ))}
                </div>
            ))}
        </div>
    );
}
