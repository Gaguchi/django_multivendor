
export default function PricingInventorySection({ formData, onChange }) {
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        onChange(name, value);
    };

    return (
        <div className="wg-box mb-30">
            <div className="cols-lg gap22">                <fieldset className="price">
                    <div className="body-title mb-10">
                        Price <span className="tf-color-1">*</span>
                        <small className="text-muted d-block">Original/Regular price (required)</small>
                    </div>
                    <input
                        type="number"
                        placeholder="Price"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        step="0.01"
                        min="0"
                        required
                    />
                </fieldset>
                  <fieldset className="sale-price">
                    <div className="body-title mb-10">
                        Sale Price
                        <small className="text-muted d-block">Discounted price (optional). If provided, becomes current selling price.</small>
                    </div>
                    <input
                        type="number"
                        placeholder="Sale Price"
                        name="salePrice"
                        value={formData.salePrice}
                        onChange={handleInputChange}
                        step="0.01"
                        min="0"
                    />
                </fieldset>
                
                <fieldset className="schedule">
                    <div className="body-title mb-10">Schedule</div>
                    <input 
                        type="date" 
                        name="scheduleDate"
                        value={formData.scheduleDate}
                        onChange={handleInputChange}
                    />
                </fieldset>
            </div>
            
            <div className="cols-lg gap22">
                <fieldset className="sku">
                    <div className="body-title mb-10">SKU</div>
                    <input
                        type="text"
                        placeholder="Enter SKU"
                        name="sku"
                        value={formData.sku}
                        onChange={handleInputChange}
                    />
                </fieldset>
                
                <fieldset className="category">
                    <div className="body-title mb-10">
                        Stock <span className="tf-color-1">*</span>
                    </div>
                    <input
                        type="number"
                        placeholder="Enter Stock"
                        name="stock"
                        value={formData.stock}
                        onChange={handleInputChange}
                        min="0"
                        required
                    />
                </fieldset>
                
                <fieldset className="sku">
                    <div className="body-title mb-10">Tags</div>
                    <input
                        type="text"
                        placeholder="Enter a tag"
                        name="tags"
                        value={formData.tags}
                        onChange={handleInputChange}
                    />
                </fieldset>
            </div>
        </div>
    );
}
