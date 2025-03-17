import { Link } from 'react-router-dom'
import SideCart from '../../../Cart/SideCart'
import { useAuth } from '../../../../contexts/AuthContext'
import { useCart } from '../../../../contexts/CartContext'

export default function HeaderRight() {
    const { cart, loading, removeFromCart } = useCart()
    const { user } = useAuth()

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
                    <SideCart />
                </div>
            </div>
        </div>
    )
}