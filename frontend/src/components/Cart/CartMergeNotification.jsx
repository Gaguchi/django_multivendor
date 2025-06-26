import { useState, useEffect } from 'react'
import { useCart } from '../../contexts/CartContext'

export default function CartMergeNotification() {
    const [notification, setNotification] = useState(null)
    const { mergingCart } = useCart()

    useEffect(() => {
        const handleCartMerged = (event) => {
            const { merged, hadGuestItems, merge_summary, error } = event.detail
            
            if (merged && hadGuestItems && merge_summary) {
                const { items_added, items_merged } = merge_summary
                const totalItems = items_added + items_merged
                
                if (totalItems > 0) {
                    setNotification({
                        type: 'success',
                        message: `Welcome back! ${totalItems} item${totalItems !== 1 ? 's' : ''} from your previous session ${items_added > 0 && items_merged > 0 ? 'have been added to and merged with' : items_added > 0 ? 'have been added to' : 'have been merged with'} your cart.`,
                        show: true
                    })
                    
                    // Auto-hide after 5 seconds
                    setTimeout(() => {
                        setNotification(prev => prev ? { ...prev, show: false } : null)
                    }, 5000)
                }
            } else if (error) {
                setNotification({
                    type: 'warning',
                    message: 'There was an issue merging your previous cart items, but your account cart has been loaded.',
                    show: true
                })
                
                // Auto-hide after 4 seconds
                setTimeout(() => {
                    setNotification(prev => prev ? { ...prev, show: false } : null)
                }, 4000)
            }
        }

        window.addEventListener('cartMerged', handleCartMerged)
        
        return () => {
            window.removeEventListener('cartMerged', handleCartMerged)
        }
    }, [])

    // Auto-hide notification after animation
    useEffect(() => {
        if (notification && !notification.show) {
            const timer = setTimeout(() => {
                setNotification(null)
            }, 300) // Match CSS transition duration
            
            return () => clearTimeout(timer)
        }
    }, [notification])

    if (!notification) return null

    return (
        <div 
            className={`cart-merge-notification ${notification.type} ${notification.show ? 'show' : 'hide'}`}
            style={{
                position: 'fixed',
                top: '20px',
                right: '20px',
                zIndex: 1050,
                maxWidth: '400px',
                backgroundColor: notification.type === 'success' ? '#d4edda' : '#fff3cd',
                border: `1px solid ${notification.type === 'success' ? '#c3e6cb' : '#ffeaa7'}`,
                borderRadius: '8px',
                padding: '12px 16px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                transform: notification.show ? 'translateX(0)' : 'translateX(100%)',
                transition: 'transform 0.3s ease-in-out',
                fontSize: '14px',
                lineHeight: '1.4'
            }}
        >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <div style={{ 
                    color: notification.type === 'success' ? '#155724' : '#856404',
                    fontSize: '16px',
                    marginTop: '1px'
                }}>
                    {notification.type === 'success' ? '✓' : '⚠'}
                </div>
                <div style={{ 
                    flex: 1,
                    color: notification.type === 'success' ? '#155724' : '#856404'
                }}>
                    {notification.message}
                </div>
                <button
                    onClick={() => setNotification(prev => prev ? { ...prev, show: false } : null)}
                    style={{
                        background: 'none',
                        border: 'none',
                        fontSize: '18px',
                        cursor: 'pointer',
                        color: notification.type === 'success' ? '#155724' : '#856404',
                        padding: '0',
                        lineHeight: '1'
                    }}
                >
                    ×
                </button>
            </div>
            
            {mergingCart && (
                <div style={{ 
                    marginTop: '8px',
                    fontSize: '12px',
                    color: notification.type === 'success' ? '#155724' : '#856404',
                    opacity: 0.8
                }}>
                    <div style={{
                        display: 'inline-block',
                        width: '12px',
                        height: '12px',
                        border: '2px solid currentColor',
                        borderTopColor: 'transparent',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                        marginRight: '6px'
                    }}></div>
                    Updating cart...
                </div>
            )}
            
            <style>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    )
}
