import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'
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

    const fetchCart = async () => {
        if (!user) {
            setCart(null)
            setLoading(false)
            return
        }

        try {
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
    }, [user])

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
                await axios.delete(
                    `${import.meta.env.VITE_API_BASE_URL}/api/cart/items/${productId}/`,
                    {
                        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                    }
                )
            } else {
                await axios.patch(
                    `${import.meta.env.VITE_API_BASE_URL}/api/cart/items/${productId}/`,
                    { quantity },
                    {
                        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                    }
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
            await axios.delete(
                `${import.meta.env.VITE_API_BASE_URL}/api/cart/items/${productId}/`,
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                }
            )
            await fetchCart() // Refresh cart after removal
        } catch (error) {
            console.error('Error removing from cart:', error)
            throw error
        }
    }

    const value = {
        cart,
        loading,
        addToCart,
        updateCartItem,
        removeFromCart,
        refreshCart: fetchCart
    }

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    )
}
