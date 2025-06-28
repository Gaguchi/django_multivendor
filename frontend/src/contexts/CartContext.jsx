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
    const [mergingCart, setMergingCart] = useState(false)
    const { user } = useAuth()
    // Keep track of guest session key locally, but AuthContext handles removal on merge
    const [guestSessionKey, setGuestSessionKey] = useState(
        localStorage.getItem('guestSessionKey') || null
    )

    // --- Generate Guest Session Key if needed --- 
    useEffect(() => {
        if (!user && !localStorage.getItem('guestSessionKey')) {
            const newSessionKey = 'guest_' + Math.random().toString(36).substring(2, 15) + '_' + Date.now()
            localStorage.setItem('guestSessionKey', newSessionKey)
            setGuestSessionKey(newSessionKey)
            console.log('[CartContext] Generated new guest session key:', newSessionKey)
        } else if (!user) {
            // Ensure component state matches localStorage if user is guest
            const storedKey = localStorage.getItem('guestSessionKey')
            setGuestSessionKey(storedKey)
            console.log('[CartContext] Using existing guest session key:', storedKey)
        } else {
             // Clear local state guest key if user is logged in
             setGuestSessionKey(null)
             console.log('[CartContext] User logged in, cleared guest session key from state')
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
        fetchCart();
    }, [user])

    // Listen for cart merge events from AuthContext
    useEffect(() => {
        const handleCartMerged = async (event) => {
            console.log('[CartContext] Cart merge event received:', event.detail);
            
            setMergingCart(true);
            
            try {
                // Wait a moment for backend to complete the merge operation
                await new Promise(resolve => setTimeout(resolve, 500));
                
                // Force fetch the updated cart
                await fetchCart();
                
                // Show success message if items were actually merged
                if (event.detail.merged && event.detail.hadGuestItems) {
                    console.log('[CartContext] Guest cart items successfully merged with user cart');
                } else if (event.detail.merged && !event.detail.hadGuestItems) {
                    console.log('[CartContext] No guest cart items to merge, loaded user cart');
                } else if (event.detail.error) {
                    console.warn('[CartContext] Cart merge failed, but loaded user cart:', event.detail.error);
                }
                
            } catch (error) {
                console.error('[CartContext] Error refreshing cart after merge:', error);
            } finally {
                setMergingCart(false);
            }
        };

        window.addEventListener('cartMerged', handleCartMerged);
        
        return () => {
            window.removeEventListener('cartMerged', handleCartMerged);
        };
    }, []);

    // --- Cart Actions (Unchanged) --- 

    const addToCart = async (productId, quantity = 1) => {
        try {
            setLoading(true)
            console.log(`[CartContext] Adding item ${productId} (qty: ${quantity})`) 
            
            // For guest users, ensure we have a session key
            if (!user) {
                let sessionKey = localStorage.getItem('guestSessionKey')
                if (!sessionKey) {
                    sessionKey = 'guest_' + Math.random().toString(36).substring(2, 15) + '_' + Date.now()
                    localStorage.setItem('guestSessionKey', sessionKey)
                    setGuestSessionKey(sessionKey)
                    console.log('[CartContext] Generated session key for cart operation:', sessionKey)
                } else {
                    console.log('[CartContext] Using existing session key for cart operation:', sessionKey)
                }
            }
            
            const response = await api.post('/api/cart/carts/add_item/', {
                product_id: productId,
                quantity
            })
            
            console.log('[CartContext] Item added successfully, updating cart state')
            
            // Instead of full refresh, update cart state intelligently
            if (response.data && cart) {
                const existingItemIndex = cart.items.findIndex(item => item.product.id === productId)
                
                if (existingItemIndex >= 0) {
                    // Update existing item quantity
                    setCart(prevCart => ({
                        ...prevCart,
                        items: prevCart.items.map((item, index) => 
                            index === existingItemIndex 
                                ? { ...item, quantity: item.quantity + quantity }
                                : item
                        )
                    }))
                } else {
                    // Add new item - we need to fetch product details, so do a targeted refresh
                    await fetchCart()
                }
            } else {
                // If no current cart, fetch it
                await fetchCart()
            }
            
            setLoading(false)
            return response.data
        } catch (error) {
            console.error('[CartContext] Error adding to cart:', error)
            setLoading(false)
            throw error
        }
    }

    // Helper function to calculate cart totals
    const calculateCartTotals = (items) => {
        if (!items || items.length === 0) {
            return { subtotal: 0, total: 0, totalItems: 0 }
        }
        
        const subtotal = items.reduce((sum, item) => {
            const price = parseFloat(item.product.price || 0)
            const quantity = parseInt(item.quantity || 0)
            return sum + (price * quantity)
        }, 0)
        
        // For now, total equals subtotal (can add tax/shipping later)
        const total = subtotal
        const totalItems = items.reduce((sum, item) => sum + parseInt(item.quantity || 0), 0)
        
        return { subtotal, total, totalItems }
    }

    const updateCartItem = async (productId, quantity) => {
        try {
            console.log(`[CartContext] Updating item ${productId} to quantity ${quantity}`) 
            
            if (quantity <= 0) {
                await removeFromCart(productId)
                return
            }

            // Optimistically update the cart state first for instant UI feedback
            if (cart && cart.items) {
                const updatedItems = cart.items.map(item => 
                    item.product.id === productId 
                        ? { ...item, quantity: quantity }
                        : item
                )
                
                const totals = calculateCartTotals(updatedItems)
                
                setCart(prevCart => ({
                    ...prevCart,
                    items: updatedItems,
                    ...totals
                }))
            }

            // Then update the backend
            const response = await api.patch(
                `/api/cart/items/${productId}/`,
                { quantity }
            )

            // Update cart state with the response data if it includes updated totals
            if (response.data && cart) {
                const updatedItems = cart.items.map(item => 
                    item.product.id === productId 
                        ? { ...item, quantity: response.data.quantity || quantity }
                        : item
                )
                
                const totals = calculateCartTotals(updatedItems)
                
                setCart(prevCart => ({
                    ...prevCart,
                    items: updatedItems,
                    // Use backend totals if provided, otherwise use calculated ones
                    ...(response.data.cart_total ? { total: response.data.cart_total } : totals)
                }))
            }
        } catch (error) {
            console.error('[CartContext] Error updating cart:', error)
            // On error, refresh the cart to ensure consistency
            await fetchCart()
            throw error
        }
    }

    const removeFromCart = async (productId) => {
        try {
            console.log(`[CartContext] Removing item ${productId}`) 
            
            // Optimistically update the cart state first for instant UI feedback
            if (cart && cart.items) {
                const updatedItems = cart.items.filter(item => item.product.id !== productId)
                const totals = calculateCartTotals(updatedItems)
                
                setCart(prevCart => ({
                    ...prevCart,
                    items: updatedItems,
                    ...totals
                }))
            }

            // Then update the backend
            await api.delete(`/api/cart/items/${productId}/`)
            
            // No need to refetch the entire cart since we've already updated the state
        } catch (error) {
            console.error('[CartContext] Error removing from cart:', error)
            // On error, refresh the cart to ensure consistency
            await fetchCart()
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

    const forceRefreshCart = async () => {
        console.log('[CartContext] Force refreshing cart after merge...');
        setMergingCart(true);
        try {
            await fetchCart();
        } finally {
            setMergingCart(false);
        }
    };

    const value = {
        cart,
        loading: loading || mergingCart,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
        refreshCart: fetchCart,
        forceRefreshCart,
        isGuestCart: !user && cart !== null && cart.items && cart.items.length > 0,
        mergingCart,
        guestSessionKey: !user ? guestSessionKey : null
    }

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    )
}
