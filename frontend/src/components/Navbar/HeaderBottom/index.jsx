import Categories from "./Categories"
import AISearchButton from "../../Search/AISearchButton"
import { Link } from 'react-router-dom'
import { useCart } from '../../../contexts/CartContext'
import { useAuth } from '../../../contexts/AuthContext'

export default function HeaderBottom() {
    const { cart, loading } = useCart()
    const { user } = useAuth()

    // Calculate total quantity
    const totalQuantity = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0

    return (
        <div className="header-bottom sticky-header d-none d-lg-flex">
            <div className="container">
                <div className="header-center w-100 ml-0">
                    <Categories />
                    <div className="info-boxes font2 align-items-center ml-auto">
                        {/* AI Search for Desktop */}
                        <div className="info-item d-none d-xl-block">
                            <AISearchButton />
                        </div>
                        <div className="info-item">
                            <Link to="/wishlist" className="wishlist-toggle" title="Wishlist">
                                <i className="icon-wishlist-2" />
                            </Link>
                        </div>
                        <div className="info-item">
                            <Link 
                                to={user ? "/account" : "/login"} 
                                className="account-toggle" 
                                title={user ? "My Account" : "Login"}
                            >
                                <i className="icon-user-2" />
                            </Link>
                        </div>
                        <div className="info-item">
                            <Link to="/cart" className="cart-toggle" title="Cart">
                                <i className="icon-cart-thick" />
                                <span className="cart-count badge-circle badge-cart">
                                    {loading ? '...' : totalQuantity}
                                </span>
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="header-right" />
            </div>
        </div>
    )
}