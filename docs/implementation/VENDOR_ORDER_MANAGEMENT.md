# Vendor Dashboard Order Management System

## Overview

This comprehensive order management system enables vendors in the multivendor marketplace to efficiently manage orders containing their products. The system provides a complete view of vendor-specific orders with the ability to update order statuses and track the fulfillment process.

## Features

### Backend Features

- **Vendor-specific order filtering**: Vendors can only see orders containing their products
- **Order status management**: Mark orders as shipped or delivered
- **Customer privacy protection**: Limited customer information exposure
- **Vendor authentication**: Secure access using JWT + Master Token + Vendor ID
- **Order timeline tracking**: Complete order status progression

### Frontend Features

- **Order list view**: Filterable table showing all vendor orders
- **Order detail view**: Comprehensive order information with timeline
- **Status update controls**: Easy-to-use buttons for status changes
- **Real-time updates**: Automatic refresh after status changes
- **Responsive design**: Works on all device sizes
- **Loading states**: Smooth user experience with proper loading indicators

## Technical Architecture

### Backend Components

#### 1. Enhanced Authentication (`vendors/authentication.py`)

```python
class MasterTokenAuthentication(BaseAuthentication):
    def authenticate(self, request):
        master_token = request.META.get('HTTP_X_MASTER_TOKEN')
        vendor_id = request.META.get('HTTP_X_VENDOR_ID')

        if master_token and master_token == settings.MASTER_ACCESS_TOKEN:
            if vendor_id:
                vendor = Vendor.objects.get(id=vendor_id)
                request.vendor = vendor  # Attach vendor to request
                return (vendor.user, None)
```

**New Feature**: The authentication system now requires both a master token AND a vendor ID header (`X-Vendor-ID`) to identify which vendor is making the request.

#### 2. Order Model Extensions (`orders/models.py`)

The existing Order model already includes comprehensive vendor-specific methods:

- `can_vendor_access(vendor)`: Check if vendor has access to order
- `get_vendor_items(vendor)`: Get order items for specific vendor
- `get_vendor_total(vendor)`: Calculate vendor's earnings from order
- `mark_as_shipped_by_vendor(vendor)`: Vendor-specific status updates
- `mark_as_delivered_by_vendor(vendor)`: Secure status transitions

#### 3. API Endpoints (`orders/views.py`)

```
GET /api/orders/vendor/ - List orders for authenticated vendor
GET /api/orders/{order_number}/vendor-detail/ - Get order details for vendor
POST /api/orders/{order_number}/update-status/ - Update order status
```

**Required Headers**:

```
X-Master-Token: your-super-secret-token
X-Vendor-ID: {vendor_id}
```

#### 4. Vendor Profile Endpoint (`vendors/views.py`)

```
GET /api/vendors/profile/ - Get vendor information including vendor ID
```

### Frontend Components

#### 1. Vendor Context (`contexts/VendorContext.jsx`)

Manages vendor profile information and ensures vendor ID is available for API requests:

```javascript
const { vendor, vendorId, isVendorLoaded, fetchVendorProfile } = useVendor();
```

#### 2. Order Context (`contexts/VendorOrderContext.jsx`)

Handles all order-related operations with vendor-aware functionality:

```javascript
const {
  orders,
  currentOrder,
  loading,
  fetchOrders,
  fetchOrderDetail,
  updateStatus,
} = useVendorOrders();
```

#### 3. Order Components

- `OrderList.jsx`: Displays filterable table of vendor orders
- `OrderDetail.jsx`: Shows comprehensive order information
- `VendorProfileLoader.jsx`: Ensures vendor profile is loaded before accessing orders

## API Request Flow

### 1. Authentication Flow

```
1. User logs in with JWT
2. Frontend fetches vendor profile: GET /api/vendors/profile/
3. Vendor ID is stored in localStorage
4. All subsequent API requests include both master token and vendor ID headers
```

### 2. Order Management Flow

```
1. Request with headers:
   - X-Master-Token: {master_token}
   - X-Vendor-ID: {vendor_id}

2. Backend validates both tokens and identifies vendor
3. Orders are filtered to only include vendor's products
4. Response contains vendor-specific data only
```

## Security Features

### 1. Multi-layer Authentication

- **JWT Authentication**: Standard user authentication
- **Master Token**: Internal system authentication
- **Vendor ID**: Ensures proper vendor context

### 2. Data Privacy

- **Customer information**: Email addresses are masked (e.g., `joh***@example.com`)
- **Order filtering**: Vendors only see orders containing their products
- **Vendor isolation**: No access to other vendors' data

### 3. Permission Validation

- Backend validates vendor access for every order operation
- Status updates are only allowed for appropriate order states
- Frontend prevents unauthorized actions through context validation

## Installation & Setup

### 1. Backend Setup

The backend components are already integrated. Ensure your settings include:

```python
# settings.py
MASTER_ACCESS_TOKEN = 'your-super-secret-token'
```

### 2. Frontend Setup

The vendor dashboard is already configured. Ensure environment variables:

```bash
# .env
VITE_API_BASE_URL=https://api.bazro.ge
VITE_MASTER_TOKEN=your-super-secret-token
```

### 3. Database Migration

No additional migrations required - the system uses existing models.

## Usage Guide

### For Vendors

1. **Login**: Use vendor credentials to access the dashboard
2. **View Orders**: Navigate to Orders section to see all orders containing your products
3. **Filter Orders**: Use status filters (All, Ready to Ship, Shipped, Delivered)
4. **Manage Orders**:
   - Click "View" to see detailed order information
   - Use "Mark as Shipped" for paid orders
   - Use "Mark as Delivered" for shipped orders
5. **Track Progress**: Monitor order timeline and status changes

### For Developers

1. **Adding New Features**: Use the existing contexts and API patterns
2. **Extending Order Management**: Follow the vendor-aware patterns established
3. **Testing**: Ensure both master token and vendor ID are provided in requests

## API Reference

### Headers Required

```javascript
headers: {
  'X-Master-Token': 'your-super-secret-token',
  'X-Vendor-ID': '123',  // Vendor ID from vendor profile
  'Content-Type': 'application/json',
  'Accept': 'application/json'
}
```

### Response Examples

#### Vendor Orders List

```json
[
  {
    "id": 1,
    "order_number": "ORD-123456",
    "status": "Paid",
    "customer_name": "John Doe",
    "customer_email": "joh***@example.com",
    "vendor_total": "25.00",
    "vendor_items": [
      {
        "id": 1,
        "product": {...},
        "quantity": 2,
        "unit_price": "12.50",
        "total_price": "25.00"
      }
    ],
    "can_update_status": true,
    "created_at": "2024-06-29T10:00:00Z"
  }
]
```

#### Order Status Update

```json
{
  "status": "Order status updated successfully",
  "new_status": "Shipped"
}
```

## Error Handling

### Common Error Scenarios

1. **Missing Vendor ID**: Returns 401 with "Vendor authentication required"
2. **Invalid Vendor ID**: Returns 401 with "Invalid vendor ID"
3. **Unauthorized Access**: Returns 403 with "You do not have access to this order"
4. **Invalid Status Transition**: Returns 400 with specific error message

### Frontend Error Handling

- Loading states for all async operations
- Error messages with retry options
- Graceful fallbacks for missing data
- User-friendly error displays

## Performance Considerations

### Backend Optimizations

- Efficient database queries with proper filtering
- Minimal data exposure for privacy and performance
- Indexed lookups on vendor and order relationships

### Frontend Optimizations

- Context-based state management
- Efficient re-rendering with proper dependencies
- Loading states to improve perceived performance
- Error boundaries for graceful failure handling

## Testing

### Backend Testing

```python
# Test vendor order access
def test_vendor_can_only_see_own_orders():
    # Ensure vendor A cannot see vendor B's orders

# Test status updates
def test_vendor_can_update_order_status():
    # Test allowed status transitions
```

### Frontend Testing

```javascript
// Test order list filtering
test("should filter orders by status", () => {
  // Test filter functionality
});

// Test status updates
test("should update order status", () => {
  // Test status update flow
});
```

## Future Enhancements

### Potential Improvements

1. **Bulk Actions**: Update multiple orders simultaneously
2. **Order Notes**: Add internal notes to orders
3. **Shipping Integration**: Connect with shipping providers
4. **Analytics**: Order performance metrics for vendors
5. **Notifications**: Real-time order updates
6. **Export**: Download order data in various formats

### Scalability Considerations

- Database indexing for large order volumes
- Caching strategies for frequently accessed data
- API rate limiting for high-traffic scenarios
- Background job processing for status updates

## Troubleshooting

### Common Issues

1. **Orders not loading**: Check vendor profile is loaded and vendor ID is available
2. **Status update failing**: Verify order state allows the transition
3. **Authentication errors**: Ensure both master token and vendor ID are provided
4. **Empty order list**: Check if vendor has any orders with their products

### Debug Tools

- Browser console for API request/response inspection
- Django admin for backend data verification
- API endpoint testing with tools like Postman
- Frontend dev tools for context state inspection

## Support

For technical support or questions about the order management system:

1. Check the console for error messages
2. Verify API endpoint responses
3. Review authentication headers
4. Test with different order states
5. Contact the development team with specific error details

This order management system provides a complete, secure, and user-friendly solution for vendors to manage their orders in the multivendor marketplace.
