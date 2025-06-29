import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useCart } from "../contexts/CartContext"
import Total from "../components/Cart/Total"
import { CartItemSkeleton } from "../components/Skeleton"
import LoadingSpinner from "../components/LoadingSpinner"

export default function Cart() {
  const { cart, loading, updateCartItem, removeFromCart, refreshCart } = useCart()
  const [localQuantities, setLocalQuantities] = useState({})
  const [processingItems, setProcessingItems] = useState({})
  const [screenWidth, setScreenWidth] = useState(window.innerWidth)

  // Update screen width on resize
  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth)
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    refreshCart()
  }, [])

  // Initialize local quantities when cart loads or changes
  useEffect(() => {
    if (cart?.items) {
      const quantities = {}
      cart.items.forEach(item => {
        quantities[item.product.id] = item.quantity
      })
      setLocalQuantities(quantities)
    }
  }, [cart?.items])

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) return
    
    // Update local state immediately for responsive UI
    setLocalQuantities(prev => ({
      ...prev,
      [itemId]: newQuantity
    }))
    
    // Mark this item as processing
    setProcessingItems(prev => ({
      ...prev,
      [itemId]: true
    }))
    
    try {
      // Make API call in the background
      await updateCartItem(itemId, newQuantity)
    } catch (error) {
      console.error("Failed to update quantity:", error)
      
      // Revert to original quantity on error
      if (cart?.items) {
        const originalItem = cart.items.find(item => item.product.id === itemId)
        if (originalItem) {
          setLocalQuantities(prev => ({
            ...prev,
            [itemId]: originalItem.quantity
          }))
        }
      }
    } finally {
      // Clear processing state
      setProcessingItems(prev => ({
        ...prev,
        [itemId]: false
      }))
    }
  }

  const handleRemoveItem = async (itemId) => {
    // Mark item as being removed
    setProcessingItems(prev => ({
      ...prev,
      [itemId]: true
    }))
    
    try {
      await removeFromCart(itemId)
    } catch (error) {
      console.error("Failed to remove item:", error)
    } finally {
      setProcessingItems(prev => ({
        ...prev,
        [itemId]: false
      }))
    }
  }

  // Function to truncate product name based on screen size
  const truncateName = (name) => {
    if (!name) return '';
    
    // Set max length based on screen width
    let maxLength = 25; // Default max length
    
    if (screenWidth < 576) {
      maxLength = 15; // Mobile
    } else if (screenWidth < 768) {
      maxLength = 20; // Small tablets
    } else if (screenWidth < 992) {
      maxLength = 25; // Tablets
    } else if (screenWidth < 1200) {
      maxLength = 18; // Small desktop
    } else {
      maxLength = 25; // Large desktop
    }
    
    return name.length > maxLength ? `${name.substring(0, maxLength)}...` : name;
  }

  if (loading) {
    return (
      <div className="container py-5">
        <ul className="checkout-progress-bar d-flex justify-content-center flex-wrap">
          <li className="active">
            <a href="/cart">Shopping Cart</a>
          </li>
          <li>
            <a href="/checkout">Checkout</a>
          </li>
        </ul>
        <div className="row">
          <div className="col-lg-8">
            <div className="cart-table-container">
              <table className="table table-cart">
                <thead>
                  <tr>
                    <th className="thumbnail-col" />
                    <th className="product-col">Product</th>
                    <th className="price-col">Price</th>
                    <th className="qty-col">Quantity</th>
                    <th className="text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: 3 }, (_, index) => (
                    <CartItemSkeleton key={index} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="cart-summary">
              <LoadingSpinner text="Loading cart..." />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!cart || cart.items?.length === 0) {
    return (
      <div className="container py-5 text-center">
        <h2>Your cart is empty</h2>
        <Link to="/shop" className="btn btn-primary mt-3">Continue Shopping</Link>
      </div>
    )
  }

  return (
    <>
      <div className="container">
        <ul className="checkout-progress-bar d-flex justify-content-center flex-wrap">
          <li className="active">
            <a href="/cart">Shopping Cart</a>
          </li>
          <li>
            <a href="/checkout">Checkout</a>
          </li>
        </ul>
        <div className="row">
          <div className="col-lg-8">
            <div className="cart-table-container">
              <table className="table table-cart">
                <thead>
                  <tr>
                    <th className="thumbnail-col" />
                    <th className="product-col">Product</th>
                    <th className="price-col">Price</th>
                    <th className="qty-col">Quantity</th>
                    <th className="text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.items.map(item => (
                    <tr 
                      className={`product-row ${processingItems[item.product.id] ? 'opacity-50' : ''}`}
                      key={item.id}
                    >
                      <td>
                        <figure className="product-image-container">
                          <Link to={`/product/${item.product.id}`} className="product-image">
                            <img
                              src={item.product.thumbnail || "src/assets/images/products/placeholder.jpg"}
                              alt={item.product.name}
                            />
                          </Link>
                          <a
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              handleRemoveItem(item.product.id);
                            }}
                            className="btn-remove icon-cancel"
                            title="Remove Product"
                            style={{ pointerEvents: processingItems[item.product.id] ? 'none' : 'auto' }}
                          />
                        </figure>
                      </td>
                      <td className="product-col">
                        <h5 className="product-title">
                          <Link to={`/product/${item.product.id}`} title={item.product.name}>
                            {truncateName(item.product.name)}
                          </Link>
                        </h5>
                      </td>
                      <td>${parseFloat(item.unit_price).toFixed(2)}</td>
                      <td>
                        <div className="quantity-controls">
                          <button
                            className={`btn-quantity-decrement ${(localQuantities[item.product.id] || item.quantity) <= 1 ? 'disabled' : ''}`}
                            onClick={() => handleQuantityChange(item.product.id, (localQuantities[item.product.id] || item.quantity) - 1)}
                            disabled={processingItems[item.product.id] || (localQuantities[item.product.id] || item.quantity) <= 1}
                          >
                            -
                          </button>
                          <input 
                            className="quantity-input" 
                            type="text"
                            value={localQuantities[item.product.id] || item.quantity}
                            readOnly
                          />
                          <button
                            className={`btn-quantity-increment ${(localQuantities[item.product.id] || item.quantity) >= item.product.stock ? 'disabled' : ''}`}
                            onClick={() => handleQuantityChange(item.product.id, (localQuantities[item.product.id] || item.quantity) + 1)}
                            disabled={processingItems[item.product.id] || (localQuantities[item.product.id] || item.quantity) >= item.product.stock}
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="text-right">
                        <span className="subtotal-price">
                          ${(parseFloat(item.unit_price) * (localQuantities[item.product.id] || item.quantity)).toFixed(2)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={5} className="clearfix">
                      <div className="float-left">
                        <div className="cart-discount">
                          <form action="#" onSubmit={(e) => e.preventDefault()}>
                            <div className="input-group">
                              <input
                                type="text"
                                className="form-control form-control-sm"
                                placeholder="Coupon Code"
                                required=""
                              />
                              <div className="input-group-append">
                                <button className="btn btn-sm" type="submit">
                                  Apply Coupon
                                </button>
                              </div>
                            </div>
                          </form>
                        </div>
                      </div>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
          <Total />
        </div>
      </div>

      <style>{`
        .opacity-50 {
          opacity: 0.5;
          pointer-events: none;
        }
        
        .disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .quantity-controls {
          display: flex;
          align-items: center;
          max-width: 120px;
        }
        
        .quantity-input {
          width: 40px;
          text-align: center;
          border: 1px solid #dae2e6;
          padding: 4px;
          border-radius: 0;
          height: 36px;
        }
        
        .btn-quantity-decrement,
        .btn-quantity-increment {
          width: 36px;
          height: 36px;
          border: 1px solid #dae2e6;
          background-color: #f4f4f4;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-weight: bold;
          font-size: 16px;
        }
        
        .btn-quantity-decrement {
          border-radius: 3px 0 0 3px;
        }
        
        .btn-quantity-increment {
          border-radius: 0 3px 3px 0;
        }
      `}</style>
    </>
  )
}