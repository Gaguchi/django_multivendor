import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import FireIcon from '../../assets/images/svgs/Fire.svg'

export default function AISearchModal({ onClose }) {
    const [searchQuery, setSearchQuery] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [searchResults, setSearchResults] = useState([])
    const [error, setError] = useState('')
    const [searchPerformed, setSearchPerformed] = useState(false)
    const [searchMeta, setSearchMeta] = useState(null) // Track search metadata
    const navigate = useNavigate()

    // Close modal on Escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                closeModal()
            }
        }

        document.addEventListener('keydown', handleEscape)
        return () => document.removeEventListener('keydown', handleEscape)
    }, [])

    const closeModal = () => {
        if (onClose) {
            onClose()
        } else {
            document.body.classList.remove('search-opened')
        }
    }

    const performAISearch = async (query) => {
        try {
            setIsLoading(true)
            setError('')
            setSearchPerformed(false)
            
            console.log('🚀 Starting GPT-4o AI Search for:', query)
            
            const response = await fetch('https://api.bazro.ge/api/ai/search/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': 'BazroShop-Frontend/1.0'
                },
                body: JSON.stringify({
                    query: query.trim()
                })
            })

            const data = await response.json()
            
            console.log('🎯 GPT-4o Search Response:', {
                status: response.status,
                method: data.search_method,
                results: data.total_count,
                tags: data.relevant_tags,
                time: data.response_time_ms,
                success: data.search_method === 'gpt4o' ? '✅ GPT-4o' : '⚡ Fallback'
            })
            
            if (!response.ok) {
                throw new Error(data.error || 'Search failed')
            }

            // Filter results to only show products with meaningful AI match score
            const filteredResults = (data.results || []).filter(product => {
                // Include all results from GPT-4o as they're already intelligently filtered
                if (data.search_method === 'gpt4o' || data.search_method === 'manual') {
                    return true
                }
                // For fallback methods, apply score filtering
                if (product.match_score === undefined || product.match_score === null) {
                    return true
                }
                return product.match_score > 1.0
            })

            setSearchResults(filteredResults)
            setSearchPerformed(true)
            
            // Store search metadata for display
            setSearchMeta({
                method: data.search_method,
                tags: data.relevant_tags || [],
                totalCount: data.total_count || 0,
                responseTime: data.response_time_ms || 0
            })
            
            // Show search method info in console for debugging
            if (data.search_method) {
                const methodNames = {
                    'gpt4o': '🤖 GPT-4o AI Analysis',
                    'manual': '🔧 Smart Tag Mapping',
                    'keyword': '📝 Keyword Search',
                    'error': '❌ Search Error'
                }
                console.log(`Search method: ${methodNames[data.search_method] || data.search_method}`)
            }
            
        } catch (err) {
            console.error('❌ AI Search error:', err)
            setError(err.message || 'Failed to perform search. Please try again.')
            setSearchResults([])
            setSearchPerformed(true)
            setSearchMeta(null) // Clear metadata on error
        } finally {
            setIsLoading(false)
        }
    }

    const handleSearch = (e) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            performAISearch(searchQuery)
        }
    }

    const handleProductClick = (productId) => {
        navigate(`/product/${productId}`)
        closeModal()
    }

    const formatPrice = (price, oldPrice) => {
        const formattedPrice = `$${parseFloat(price).toFixed(2)}`
        if (oldPrice && oldPrice > price) {
            return (
                <span className="price-container">
                    <span className="current-price">{formattedPrice}</span>
                    <span className="old-price">${parseFloat(oldPrice).toFixed(2)}</span>
                </span>
            )
        }
        return <span className="current-price">{formattedPrice}</span>
    }

    // Helper function to format image URLs
    const formatImageUrl = (imagePath) => {
        if (!imagePath) return null
        
        // If it's already a full URL, return as is
        if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
            return imagePath
        }
        
        // If it's a relative path starting with /media/, prepend the API base URL
        if (imagePath.startsWith('/media/')) {
            return `https://api.bazro.ge${imagePath}`
        }
        
        // If it starts with media/ (without leading slash), add the slash
        if (imagePath.startsWith('media/')) {
            return `https://api.bazro.ge/${imagePath}`
        }
        
        // For any other path, treat it as a media path
        return `https://api.bazro.ge/media/${imagePath}`
    }

    return (
        <>
            {/* Search Overlay */}
            <div className="search-overlay" onClick={closeModal}></div>
            
            {/* Search Modal */}
            <div className="search-modal">
                <div className="search-modal-header">
                    <h3 className="search-modal-title">
                        <i className="fas fa-search mr-2"></i>
                        🤖 GPT-4o AI Search
                    </h3>
                    <button 
                        className="search-close-btn" 
                        onClick={closeModal}
                        title="Close (Esc)"
                    >
                        ×
                    </button>
                </div>

                <div className="search-modal-body">
                    <form onSubmit={handleSearch} className="search-form">
                        <div className="search-input-container">
                            <input
                                type="text"
                                className="search-input"
                                placeholder="🤖 Ask GPT-4o anything about products... (e.g., 'Show me wireless headphones under $100')"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                autoFocus
                            />
                            <button 
                                type="submit" 
                                className="search-submit-btn"
                                disabled={isLoading || !searchQuery.trim()}
                            >
                                {isLoading ? (
                                    <div className="spinner"></div>
                                ) : (
                                    <i className="icon-search"></i>
                                )}
                            </button>
                        </div>
                    </form>

                    {/* Search Suggestions */}
                    {!searchPerformed && (
                        <div className="search-suggestions">
                            <h4 className="suggestions-title">✨ Try asking GPT-4o:</h4>
                            <div className="suggestion-chips">
                                <button 
                                    className="suggestion-chip"
                                    onClick={() => {
                                        setSearchQuery("Show me the best smartphones under $500")
                                        performAISearch("Show me the best smartphones under $500")
                                    }}
                                >
                                    🤖 Best smartphones under $500
                                </button>
                                <button 
                                    className="suggestion-chip"
                                    onClick={() => {
                                        setSearchQuery("Find wireless headphones with good battery life")
                                        performAISearch("Find wireless headphones with good battery life")
                                    }}
                                >
                                    🎧 Wireless headphones with good battery
                                </button>
                                <button 
                                    className="suggestion-chip"
                                    onClick={() => {
                                        setSearchQuery("What are the most popular gaming accessories?")
                                        performAISearch("What are the most popular gaming accessories?")
                                    }}
                                >
                                    🎮 Popular gaming accessories
                                </button>
                                <button 
                                    className="suggestion-chip"
                                    onClick={() => {
                                        setSearchQuery("Show me eco-friendly home products")
                                        performAISearch("Show me eco-friendly home products")
                                    }}
                                >
                                    🌱 Eco-friendly home products
                                </button>
                                <button 
                                    className="suggestion-chip"
                                    onClick={() => {
                                        setSearchQuery("Find budget electronics under $100")
                                        performAISearch("Find budget electronics under $100")
                                    }}
                                >
                                    💰 Budget electronics under $100
                                </button>
                                <button 
                                    className="suggestion-chip"
                                    onClick={() => {
                                        setSearchQuery("What are the highest rated products?")
                                        performAISearch("What are the highest rated products?")
                                    }}
                                >
                                    ⭐ Highest rated products
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Loading State */}
                    {isLoading && (
                        <div className="search-results">
                            <div className="search-loading">
                                <div className="loading-animation">
                                    <div className="loading-dots">
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                    </div>
                                </div>
                                <p>🤖 GPT-4o is analyzing your query and finding the best matches...</p>
                                <small>Using advanced AI via GitHub Copilot to understand your needs</small>
                            </div>
                        </div>
                    )}

                    {/* Error State */}
                    {error && (
                        <div className="search-results">
                            <div className="search-error">
                                <i className="icon-exclamation-triangle"></i>
                                <p>Oops! Something went wrong:</p>
                                <small>{error}</small>
                                <button 
                                    className="retry-btn"
                                    onClick={() => searchQuery.trim() && performAISearch(searchQuery)}
                                    disabled={isLoading}
                                >
                                    Try Again
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Search Results */}
                    {searchPerformed && !isLoading && !error && (
                        <div className="search-results">
                            {searchResults.length > 0 ? (
                                <>
                                    <div className="results-header">
                                        <div className="results-info">
                                            <h4>Found {searchResults.length} products</h4>
                                            <p className="search-query-display">for "{searchQuery}"</p>
                                        </div>
                                        
                                        {/* Search Method Indicator */}
                                        {searchMeta && (
                                            <div className="search-method-info">
                                                <div className="search-method-badge">
                                                    {searchMeta.method === 'gpt4o' && (
                                                        <>
                                                            <i className="fas fa-robot"></i>
                                                            <span>GPT-4o AI</span>
                                                        </>
                                                    )}
                                                    {searchMeta.method === 'manual' && (
                                                        <>
                                                            <i className="fas fa-cogs"></i>
                                                            <span>Smart Mapping</span>
                                                        </>
                                                    )}
                                                    {searchMeta.method === 'keyword' && (
                                                        <>
                                                            <i className="fas fa-search"></i>
                                                            <span>Keyword Search</span>
                                                        </>
                                                    )}
                                                </div>
                                                
                                                {/* Relevant Tags Display */}
                                                {searchMeta.tags && searchMeta.tags.length > 0 && (
                                                    <div className="relevant-tags">
                                                        <span className="tags-label">🏷️ AI Tags:</span>
                                                        {searchMeta.tags.slice(0, 4).map((tag, idx) => (
                                                            <span key={idx} className="tag-chip">{tag}</span>
                                                        ))}
                                                        {searchMeta.tags.length > 4 && (
                                                            <span className="tag-more">+{searchMeta.tags.length - 4}</span>
                                                        )}
                                                    </div>
                                                )}
                                                
                                                <div className="search-timing">
                                                    <i className="fas fa-clock"></i>
                                                    <span>{searchMeta.responseTime}ms</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="results-grid">
                                        {searchResults.map((product) => (
                                            <div 
                                                key={product.id} 
                                                className="result-item"
                                                onClick={() => handleProductClick(product.id)}
                                            >
                                                <div className="product-image">
                                                    {product.thumbnail ? (
                                                        <img 
                                                            src={formatImageUrl(product.thumbnail)} 
                                                            alt={product.name}
                                                            onError={(e) => {
                                                                e.target.src = '/placeholder-product.png'
                                                            }}
                                                        />
                                                    ) : (
                                                        <div className="no-image">
                                                            <i className="icon-image"></i>
                                                        </div>
                                                    )}
                                                    {product.is_hot && (
                                                        <span className="hot-badge">
                                                            <img src={FireIcon} alt="Hot Product" style={{width: '16px', height: '16px'}} />
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="product-info">
                                                    <h5 className="product-name">{product.name}</h5>
                                                    <p className="product-vendor">by {product.vendor_name}</p>
                                                    <p className="product-category">{product.category}</p>
                                                    <div className="product-rating">
                                                        {[...Array(5)].map((_, i) => (
                                                            <i 
                                                                key={i} 
                                                                className={`icon-star${i < Math.floor(product.rating) ? ' filled' : ''}`}
                                                            ></i>
                                                        ))}
                                                        <span className="rating-text">({product.rating.toFixed(1)})</span>
                                                    </div>
                                                    <div className="product-price">
                                                        {formatPrice(product.price, product.old_price)}
                                                    </div>
                                                    {product.tags && product.tags.length > 0 && (
                                                        <div className="product-tags">
                                                            {product.tags.slice(0, 3).map((tag, idx) => (
                                                                <span key={idx} className="tag">{tag}</span>
                                                            ))}
                                                            {product.tags.length > 3 && (
                                                                <span className="tag-more">+{product.tags.length - 3}</span>
                                                            )}
                                                        </div>
                                                    )}
                                                    <div className="match-score">
                                                        🎯 AI Match: {Math.round((product.match_score || 1) * 20)}%
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    
                                    {/* View All Results Button */}
                                    <div className="view-all-container">
                                        <button 
                                            className="view-all-btn"
                                            onClick={() => {
                                                const searchParams = new URLSearchParams({
                                                    q: searchQuery.trim(),
                                                    type: 'ai'
                                                })
                                                navigate(`/search?${searchParams.toString()}`)
                                                closeModal()
                                            }}
                                        >
                                            <i className="icon-external-link"></i>
                                            View All Results on Search Page
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="search-empty">
                                    <i className="icon-search"></i>
                                    <p>No products found for your query</p>
                                    <small>Try adjusting your search terms or check our suggestions above</small>
                                    
                                    {/* Alternative search suggestion */}
                                    <div className="alternative-search">
                                        <button 
                                            className="alternative-search-btn"
                                            onClick={() => {
                                                const searchParams = new URLSearchParams({
                                                    q: searchQuery.trim(),
                                                    type: 'ordinary'
                                                })
                                                navigate(`/search?${searchParams.toString()}`)
                                                closeModal()
                                            }}
                                        >
                                            <i className="icon-search"></i>
                                            Try Ordinary Search Instead
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Empty State - No search performed yet */}
                    {!searchPerformed && !isLoading && (
                        <div className="search-welcome">
                            <div className="ai-icon">
                                <i className="fas fa-robot"></i>
                            </div>
                            <h4>🤖 AI-Powered Product Search</h4>
                            <p>Ask me anything about products in natural language!</p>
                            <ul className="search-tips">
                                <li>💡 Try: "Show me budget laptops for gaming"</li>
                                <li>💡 Try: "Find wireless earbuds with noise cancellation"</li>
                                <li>💡 Try: "What are the best deals under $50?"</li>
                                <li>💡 Try: "Recommend fitness equipment for home"</li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}
