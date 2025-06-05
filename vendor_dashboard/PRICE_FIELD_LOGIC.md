# Price Field Logic Documentation

## Overview

The vendor dashboard uses a two-field system for pricing products that allows for sale/discount pricing.

## Field Definitions

### Frontend Fields (in forms)

- **Price**: Original/Regular price (required)
- **Sale Price**: Discounted price (optional)

### Backend Fields (in database)

- **price**: Current selling price (what customer pays)
- **old_price**: Original price before discount (shown crossed out, optional)

## Logic Flow

### When Adding/Editing Products:

**Scenario 1: No Sale Price Provided**

- Frontend: `Price = $100`, `Sale Price = empty`
- Backend: `price = $100`, `old_price = null`
- Customer sees: `$100`

**Scenario 2: Sale Price Provided**

- Frontend: `Price = $100`, `Sale Price = $80`
- Backend: `price = $80`, `old_price = $100`
- Customer sees: `~~$100~~ $80` (crossed out original, current sale price)

### When Editing Existing Products:

**Product without sale (old_price = null)**

- Form shows: `Price = current price`, `Sale Price = empty`

**Product with sale (old_price exists)**

- Form shows: `Price = old_price`, `Sale Price = current price`

## Implementation Files

- `Add.jsx` - Lines 22-32: Price transformation logic
- `Edit.jsx` - Lines 54-68: Price loading logic, Lines 160-173: Price submission logic
- `PricingInventorySection.jsx` - Form fields with helper text

## Example Data Flow

```javascript
// User enters in form:
formData = {
  price: "100.00",
  salePrice: "80.00"
}

// Transformed for API:
apiData = {
  price: "80.00",      // Sale price becomes selling price
  old_price: "100.00"  // Original price for display
}

// In database:
VendorProduct {
  price: 80.00,        // What customer pays
  old_price: 100.00    // Original price (crossed out)
}
```

This logic ensures consistency between Add and Edit operations while providing a user-friendly interface for managing product pricing.
