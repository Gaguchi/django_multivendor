import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'
import api from '../services/api'

const CartContext = createContext()

export const useCart = () => {
    const context = useContext(CartContext)
    if (!context) {
        throw new Error('useCart must be used within a CartProvider')
    }
    return context
}

export function CartProvider({ children }) {
    const [cart, setCart] = useState(null)
    const [loading, setLoading] = useState(true)
    const { user } = useAuth()
    const [guestSessionKey, setGuestSessionKey] = useState(
        localStorage.getItem('guestSessionKey') || null
    )
    
    // Initialize or retrieve sessionKey for guest users
    useEffect(() => {
        if (!user && !guestSessionKey) {
            const newSessionKey = 'guest_' + Math.random().toString(36).substring(2, 15)
            localStorage.setItem('guestSessionKey', newSessionKey)
            setGuestSessionKey(newSessionKey)
        }
    }, [user, guestSessionKey])
    
    // Handle cart merging when user logs in
    useEffect(() => {
        const mergeGuestCart = async () => {
            if (user && guestSessionKey) {
                try {
                    setLoading(true)
                    // Call the backend API to merge guest cart into user cart
                    await api.post('/api/cart/carts/merge_cart/', {
                        session_key: guestSessionKey
                    })
                    
                    // Clear guest session after successful merge
                    localStorage.removeItem('guestSessionKey')
                    setGuestSessionKey(null)
                } catch (error) {
                    console.error('Error merging cart:', error)
                } finally {
                    setLoading(false)
                }
            }
        }
        
        mergeGuestCart()
    }, [user])

    const fetchCart = async () => {
        try {
            setLoading(true)
            
            // Always call the same endpoint - backend will determine
            // whether to return a guest cart or user cart
            const response = await api.get('/api/cart/carts/current/')
            setCart(response.data)
        } catch (error) {
            console.error('Error fetching cart:', error)
            setCart(null)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchCart()
    }, [user, guestSessionKey])

    const addToCart = async (productId, quantity = 1) => {
        try {
            const response = await api.post('/api/cart/carts/add_item/', {
                product_id: productId,
                quantity
            })
            await fetchCart() // Refresh cart after adding
            return response.data
        } catch (error) {
            console.error('Error adding to cart:', error)
            throw error
        }
    }

    const updateCartItem = async (productId, quantity) => {
        try {
            if (quantity === 0) {
                await api.delete(`/api/cart/items/${productId}/`)
            } else {
                await api.patch(
                    `/api/cart/items/${productId}/`,
                    { quantity }
                )
            }
            await fetchCart() // Refresh cart after update
        } catch (error) {
            console.error('Error updating cart:', error)
            throw error
        }
    }

    const removeFromCart = async (productId) => {
        try {
            await api.delete(`/api/cart/items/${productId}/`)
            await fetchCart() // Refresh cart after removal
        } catch (error) {
            console.error('Error removing from cart:', error)
            throw error
        }
    }

    // Add a function to clear the entire cart
    const clearCart = async () => {
        if (!cart || !cart.items || cart.items.length === 0) {
            return; // Nothing to clear
        }
        
        try {
            setLoading(true);
            
            // Remove each item individually
            const removePromises = cart.items.map(item => 
                api.delete(`/api/cart/items/${item.product.id}/`)
            );
            
            await Promise.all(removePromises);
            
            // Finally, refresh the cart to show it's empty
            await fetchCart();
        } catch (error) {
            console.error('Error clearing cart:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const value = {
        cart,
        loading,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
        refreshCart: fetchCart,
        isGuestCart: !user && cart !== null
    }

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    )
}
