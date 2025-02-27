import { Link } from 'react-router-dom'
import { useAuth } from '../../../../contexts/AuthContext'
import { useCart } from '../../../../contexts/CartContext'

export default function HeaderRight() {
    const { cart, loading, removeFromCart } = useCart()
    const { user } = useAuth()

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
        <div className="header-right">
            <div className="header-middle-icon -fav">
                <Link to="/wishlist" className="header-icon position-relative">
                    <i className="icon-wishlist-2" />
                </Link>
            </div>
            
            <div className="header-middle-icon header-middle-user">
                <Link 
                    to={user ? "/account" : "/login"} 
                    className="header-icon mr-0" 
                    title={user ? "My Account" : "Login"}
                >
                    <i className="icon-user-2" />
                </Link>
            </div>

            <div className="header-middle-icon cart-dropdown-wrapper d-flex align-items-center">
                <div className="dropdown cart-dropdown">
                    <a
                        href="#"
                        title="Cart"
                        className="header-icondropdown-toggle cart-toggle"
                        role="button"
                        data-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                        data-display="static"
                    >
                        <i className="icon-cart-thick" />
                        <span className="cart-count badge-circle badge-cart">
                            {loading ? '...' : totalQuantity}
                        </span>
                    </a>
                    <div className="cart-overlay" />
                    <div className="dropdown-menu mobile-cart">
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
                                                    <Link to={`/product/${item.product.id}`}>
                                                        {item.product.name}
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
                </div>
            </div>
        </div>
    )
}