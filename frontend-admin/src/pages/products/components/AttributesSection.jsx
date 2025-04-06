import { useEffect } from 'react';

export default function AttributesSection({ attributes = [], formData, onChange }) {
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

    // Function to chunk attributes into pairs
    const chunkAttributes = (arr, size) => 
        Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
            arr.slice(i * size, i * size + size)
        );

    const attributeChunks = chunkAttributes(attributes, 3); // Group by 2

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
                <div key={`chunk-${index}`} className="cols-lg gap22 mb-20"> {/* Add mb-20 for spacing between rows */}
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
                                    <input
                                        type="checkbox"
                                        id={`attr_${attr.id}`}
                                        name={`attr_${attr.id}`}
                                        checked={formData[`attr_${attr.id}`] || false}
                                        onChange={(e) => handleAttributeChange(attr.id, e.target.checked)}
                                        required={attr.required}
                                    />
                                    <label htmlFor={`attr_${attr.id}`} className="ml-2">
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
