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
    // Keep track of guest session key locally, but AuthContext handles removal on merge
    const [guestSessionKey, setGuestSessionKey] = useState(
        localStorage.getItem('guestSessionKey') || null
    )

    // --- Generate Guest Session Key if needed --- 
    useEffect(() => {
        if (!user && !localStorage.getItem('guestSessionKey')) {
            const newSessionKey = 'guest_' + Math.random().toString(36).substring(2, 15)
            localStorage.setItem('guestSessionKey', newSessionKey)
            setGuestSessionKey(newSessionKey)
            console.log('[CartContext] Generated new guest session key:', newSessionKey)
        } else if (!user) {
            // Ensure component state matches localStorage if user is guest
            setGuestSessionKey(localStorage.getItem('guestSessionKey'))
        } else {
             // Clear local state guest key if user is logged in
             setGuestSessionKey(null)
        }
    }, [user]) // Re-evaluate when user logs in or out

    // --- Fetch Cart based on Auth State --- 
    const fetchCart = async () => {
        try {
            setLoading(true)
            console.log('[CartContext] Fetching cart...', { user: !!user })
            // Backend's /current/ endpoint handles guest vs user automatically
            const response = await api.get('/api/cart/carts/current/')
            console.log('[CartContext] Fetched cart data:', response.data)
            setCart(response.data)
        } catch (error) {
            console.error('[CartContext] Error fetching cart:', error)
            // Handle potential 401 if tokens expire between AuthContext load and this fetch
            if (error.response?.status === 401 && user) {
                 console.warn('[CartContext] Received 401 fetching cart, user might be logged out.');
                 // Optionally trigger logout from AuthContext here if needed
            }
            setCart(null) // Set cart to null on error
        } finally {
            setLoading(false)
        }
    }

    // Fetch cart whenever the user logs in or out
    useEffect(() => {
        console.log('[CartContext] User state changed, fetching cart.', { user: !!user });
        fetchCart()
    }, [user])

    // --- Cart Actions (Unchanged) --- 

    const addToCart = async (productId, quantity = 1) => {
        try {
            setLoading(true)
            console.log(`[CartContext] Adding item ${productId} (qty: ${quantity})`) 
            const response = await api.post('/api/cart/carts/add_item/', {
                product_id: productId,
                quantity
            })
            await fetchCart() // Refresh cart after adding
            return response.data
        } catch (error) {
            console.error('[CartContext] Error adding to cart:', error)
            setLoading(false)
            throw error
        }
    }

    const updateCartItem = async (productId, quantity) => {
        try {
            setLoading(true)
            console.log(`[CartContext] Updating item ${productId} to quantity ${quantity}`) 
            if (quantity <= 0) {
                await removeFromCart(productId)
            } else {
                await api.patch(
                    `/api/cart/items/${productId}/`,
                    { quantity }
                )
                await fetchCart() // Refresh cart after update
            }
        } catch (error) {
            console.error('[CartContext] Error updating cart:', error)
            setLoading(false)
            throw error
        }
    }

    const removeFromCart = async (productId) => {
        try {
            setLoading(true)
            console.log(`[CartContext] Removing item ${productId}`) 
            await api.delete(`/api/cart/items/${productId}/`)
            await fetchCart() // Refresh cart after removal
        } catch (error) {
            console.error('[CartContext] Error removing from cart:', error)
            setLoading(false)
            throw error
        }
    }

    const clearCart = async () => {
        if (!cart || !cart.items || cart.items.length === 0) {
            return; // Nothing to clear
        }
        
        try {
            setLoading(true);
            console.log('[CartContext] Clearing cart...') 
            const removePromises = cart.items.map(item => 
                api.delete(`/api/cart/items/${item.product.id}/`)
            );
            
            await Promise.all(removePromises);
            console.log('[CartContext] Cart cleared successfully.') 
            
            await fetchCart();
        } catch (error) {
            console.error('[CartContext] Error clearing cart:', error);
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
