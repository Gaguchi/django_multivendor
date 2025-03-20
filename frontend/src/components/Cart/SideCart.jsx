import { useCart } from "../../contexts/CartContext"
import { useAuth } from "../../contexts/AuthContext"
import { Link } from "react-router-dom"
import { useState, useEffect } from "react"

export default function SideCart() {
    const { cart, loading, removeFromCart } = useCart()
    const { user } = useAuth()
    const [screenWidth, setScreenWidth] = useState(window.innerWidth)

    // Update screen width on resize
    useEffect(() => {
        const handleResize = () => {
            setScreenWidth(window.innerWidth)
        }
        
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    // Function to truncate product name based on screen size
    const truncateName = (name) => {
        if (!name) return '';
        
        // Set max length based on screen width
        let maxLength = 15; // Default max length
        
        if (screenWidth < 576) {
            maxLength = 12; // Mobile
        } else if (screenWidth < 768) {
            maxLength = 15; // Small tablets
        } else if (screenWidth < 992) {
            maxLength = 15; // Tablets
        } else {
            maxLength = 15; // Desktop
        }
        
        return name.length > maxLength ? `${name.substring(0, maxLength)}...` : name;
    }

    // Calculate total quantity
    const totalQuantity = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0

    const handleRemoveItem = async (e, productId) => {
        e.preventDefault()
        try {
            await removeFromCart(productId)
        } catch (error) {
            console.error('Error removing item:', error)
        }
    }

    return (
        <><div className="dropdown-menu mobile-cart">
            <a href="#" title="Close (Esc)" className="btn-close">×</a>
            <div className="dropdownmenu-wrapper custom-scrollbar">
                <div className="dropdown-cart-header">Shopping Cart</div>
                <div className="dropdown-cart-products">
                    {loading ? (
                        <div className="text-center p-3">Loading...</div>
                    ) : !cart || !cart.items || cart.items.length === 0 ? (
                        <div className="text-center p-3">Your cart is empty</div>
                    ) : (
                        cart.items.map((item) => (
                            <div className="product" key={item.id}>
                                <div className="product-details">
                                    <h4 className="product-title">
                                        <Link to={`/product/${item.product.id}`} title={item.product.name}>
                                            {truncateName(item.product.name)}
                                        </Link>
                                    </h4>
                                    <span className="cart-product-info">
                                        <span className="cart-product-qty">
                                            {item.quantity}
                                        </span> 
                                        × ${item.unit_price}
                                    </span>
                                </div>
                                <figure className="product-image-container">
                                    <Link 
                                        to={`/product/${item.product.id}`} 
                                        className="product-image"
                                    >
                                        <img
                                            alt={item.product.name}
                                            width={80}
                                            height={80}
                                            src={item.product.thumbnail}
                                        />
                                    </Link>
                                    <a
                                        href="#"
                                        className="btn-remove"
                                        title="Remove Product"
                                        onClick={(e) => handleRemoveItem(e, item.product.id)}
                                    >
                                        <span>×</span>
                                    </a>
                                </figure>
                            </div>
                        ))
                    )}
                </div>
                {cart?.items?.length > 0 && (
                    <>
                        <div className="dropdown-cart-total">
                            <span>SUBTOTAL:</span>
                            <span className="cart-total-price float-right">
                                ${cart.total}
                            </span>
                        </div>
                        <div className="dropdown-cart-action">
                            <Link to="/cart" className="btn btn-gray btn-block view-cart">
                                View Cart
                            </Link>
                            <Link to="/checkout" className="btn btn-dark btn-block">
                                Checkout
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </div>
        </>
    )
}