import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import SearchBox from '../components/Search/SearchBox'
import AISearchButton from '../components/Search/AISearchButton'

export default function SearchResults() {
    const [searchParams, setSearchParams] = useSearchParams()
    const navigate = useNavigate()
    
    const [results, setResults] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [pagination, setPagination] = useState(null)
    const [searchInfo, setSearchInfo] = useState(null)
    const [searchType, setSearchType] = useState('ordinary') // 'ordinary' or 'ai'
    
    const query = searchParams.get('q') || ''
    const category = searchParams.get('category') || ''
    const sortBy = searchParams.get('sort') || 'relevance'
    const page = parseInt(searchParams.get('page')) || 1
    const initialSearchType = searchParams.get('type') || 'ordinary'

    useEffect(() => {
        setSearchType(initialSearchType)
    }, [initialSearchType])

    useEffect(() => {
        if (query) {
            performSearch()
        }
    }, [query, category, sortBy, page, searchType])

    const performSearch = async () => {
        setLoading(true)
        setError('')
        
        try {
            if (searchType === 'ai') {
                await performAISearch()
            } else {
                await performOrdinarySearch()
            }
        } catch (err) {
            console.error('Search error:', err)
            setError(err.message || 'Failed to perform search')
            setResults([])
        } finally {
            setLoading(false)
        }
    }

    const performOrdinarySearch = async () => {
        const params = new URLSearchParams({
            q: query,
            page: page.toString(),
            sort: sortBy,
            per_page: '20'
        })
        
        if (category) {
            params.append('category', category)
        }

        const response = await fetch(`https://api.bazro.ge/api/search/?${params.toString()}`)
        const data = await response.json()
        
        if (!response.ok) {
            throw new Error(data.error || 'Search failed')
        }

        setResults(data.results || [])
        setPagination(data.pagination)
        setSearchInfo({
            query: data.query,
            category: data.category,
            searchType: 'ordinary',
            responseTime: data.response_time_ms
        })
    }

    const performAISearch = async () => {
        const response = await fetch('https://api.bazro.ge/api/ai/search/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: query.trim(),
                max_results: 20
            })
        })

        const data = await response.json()
        
        if (!response.ok) {
            throw new Error(data.error || 'AI Search failed')
        }

        setResults(data.results || [])
        // For AI search, create pagination-like structure
        setPagination({
            total_count: data.total_count || data.results?.length || 0,
            total_pages: 1,
            current_page: 1,
            has_previous: false,
            has_next: false
        })
        setSearchInfo({
            query: data.query,
            category: category,
            searchType: 'ai',
            responseTime: data.response_time_ms,
            searchMethod: data.search_method,
            relevantTags: data.relevant_tags
        })
    }

    const handleSortChange = (newSort) => {
        const newParams = new URLSearchParams(searchParams)
        newParams.set('sort', newSort)
        newParams.delete('page') // Reset to page 1 when sorting
        setSearchParams(newParams)
    }

    const handleSearchTypeToggle = (newType) => {
        if (newType !== searchType) {
            setSearchType(newType)
            const newParams = new URLSearchParams(searchParams)
            newParams.set('type', newType)
            newParams.delete('page') // Reset to page 1 when changing search type
            setSearchParams(newParams)
        }
    }

    const handlePageChange = (newPage) => {
        const newParams = new URLSearchParams(searchParams)
        newParams.set('page', newPage.toString())
        setSearchParams(newParams)
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' })
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

    const renderStars = (rating) => {
        return [...Array(5)].map((_, i) => (
            <i 
                key={i} 
                className={`icon-star${i < Math.floor(rating) ? ' filled' : ''}`}
            ></i>
        ))
    }

    return (
        <div className="search-results-page">
            <div className="container">
                {/* Search Header */}
                <div className="search-header">
                    <div className="row align-items-center">
                        <div className="col-lg-8">
                            <SearchBox 
                                className="main-search-box"
                                placeholder="Search products..."
                                showCategories={true}
                            />
                        </div>
                        <div className="col-lg-4 text-right">
                            <AISearchButton />
                        </div>
                    </div>
                </div>

                {/* Search Info */}
                {searchInfo && (
                    <div className="search-info">
                        <div className="search-info-header">
                            <h2>Search Results for "{searchInfo.query}"</h2>
                            
                            {/* Search Type Toggle */}
                            <div className="search-type-toggle">
                                <button 
                                    className={`toggle-btn ${searchType === 'ordinary' ? 'active' : ''}`}
                                    onClick={() => handleSearchTypeToggle('ordinary')}
                                    disabled={loading}
                                >
                                    <i className="icon-search"></i>
                                    Ordinary Search
                                </button>
                                <button 
                                    className={`toggle-btn ${searchType === 'ai' ? 'active' : ''}`}
                                    onClick={() => handleSearchTypeToggle('ai')}
                                    disabled={loading}
                                >
                                    <i className="icon-robot"></i>
                                    AI Search
                                </button>
                            </div>
                        </div>
                        
                        {pagination && (
                            <div className="search-meta">
                                <p>
                                    {pagination.total_count} results found 
                                    {searchInfo.category && ` in ${searchInfo.category}`}
                                    <span className="response-time">
                                        ({searchInfo.responseTime}ms)
                                    </span>
                                    {searchInfo.searchMethod && (
                                        <span className="search-method">
                                            • {searchInfo.searchMethod.replace('_', ' ')}
                                        </span>
                                    )}
                                </p>
                                
                                {searchInfo.relevantTags && searchInfo.relevantTags.length > 0 && (
                                    <div className="relevant-tags">
                                        <span className="tags-label">AI identified tags:</span>
                                        {searchInfo.relevantTags.map((tag, index) => (
                                            <span key={index} className="tag-chip">{tag}</span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* Loading State */}
                {loading && (
                    <div className="loading-container">
                        <div className="spinner-large"></div>
                        <p>Searching products...</p>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="error-container">
                        <div className="alert alert-danger">
                            <h4>Search Error</h4>
                            <p>{error}</p>
                            <button 
                                className="btn btn-primary"
                                onClick={performSearch}
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                )}

                {/* Results */}
                {!loading && !error && (
                    <>
                        {/* Sort and Filter Bar */}
                        {results.length > 0 && (
                            <div className="search-controls">
                                <div className="row align-items-center">
                                    <div className="col-md-6">
                                        <p className="results-count">
                                            Showing {((page - 1) * 20) + 1} - {Math.min(page * 20, pagination?.total_count || 0)} of {pagination?.total_count || 0} results
                                        </p>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="sort-controls">
                                            <label>Sort by:</label>
                                            <select 
                                                value={sortBy} 
                                                onChange={(e) => handleSortChange(e.target.value)}
                                                className="sort-select"
                                            >
                                                <option value="relevance">Relevance</option>
                                                <option value="price_low">Price: Low to High</option>
                                                <option value="price_high">Price: High to Low</option>
                                                <option value="rating">Customer Rating</option>
                                                <option value="newest">Newest</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Product Grid */}
                        {results.length > 0 ? (
                            <div className="products-grid">
                                {results.map((product) => (
                                    <div key={product.id} className="product-card">
                                        <div className="product-image">
                                            {product.thumbnail ? (
                                                <img 
                                                    src={product.thumbnail} 
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
                                                <span className="hot-badge">HOT</span>
                                            )}
                                        </div>
                                        
                                        <div className="product-info">
                                            <h3 className="product-name">
                                                <a href={`/product/${product.id}`}>
                                                    {product.name}
                                                </a>
                                            </h3>
                                            
                                            <p className="product-vendor">
                                                by {product.vendor_name}
                                            </p>
                                            
                                            <div className="product-rating">
                                                <div className="stars">
                                                    {renderStars(product.rating)}
                                                </div>
                                                <span className="rating-text">
                                                    ({product.rating.toFixed(1)})
                                                </span>
                                            </div>
                                            
                                            <div className="product-price">
                                                {formatPrice(product.price, product.old_price)}
                                            </div>
                                            
                                            {/* Show relevance score for ordinary search, match score for AI search */}
                                            {searchType === 'ai' && product.match_score !== undefined && (
                                                <div className="ai-match-score">
                                                    <i className="icon-robot"></i>
                                                    AI Match: {Math.round(product.match_score * 20)}%
                                                </div>
                                            )}
                                            
                                            {searchType === 'ordinary' && product.relevance_score > 0 && (
                                                <div className="relevance-score">
                                                    <i className="icon-target"></i>
                                                    Relevance: {Math.round(product.relevance_score * 10)}%
                                                </div>
                                            )}
                                            
                                            {/* Show tags for AI search results */}
                                            {searchType === 'ai' && product.tags && product.tags.length > 0 && (
                                                <div className="product-tags">
                                                    {product.tags.slice(0, 3).map((tag, idx) => (
                                                        <span key={idx} className="tag">{tag}</span>
                                                    ))}
                                                    {product.tags.length > 3 && (
                                                        <span className="tag-more">+{product.tags.length - 3}</span>
                                                    )}
                                                </div>
                                            )}
                                            
                                            <button className="btn btn-primary add-to-cart-btn">
                                                Add to Cart
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="no-results">
                                <div className="no-results-content">
                                    <i className="icon-search"></i>
                                    <h3>No products found</h3>
                                    <p>Try adjusting your search terms or browse our categories</p>
                                    <div className="no-results-actions">
                                        <button 
                                            className="btn btn-outline-primary"
                                            onClick={() => navigate('/')}
                                        >
                                            Browse All Products
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Pagination */}
                        {pagination && pagination.total_pages > 1 && (
                            <div className="pagination-container">
                                <nav aria-label="Search results pagination">
                                    <ul className="pagination">
                                        <li className={`page-item ${!pagination.has_previous ? 'disabled' : ''}`}>
                                            <button
                                                className="page-link"
                                                onClick={() => handlePageChange(page - 1)}
                                                disabled={!pagination.has_previous}
                                            >
                                                Previous
                                            </button>
                                        </li>
                                        
                                        {[...Array(pagination.total_pages)].map((_, index) => {
                                            const pageNum = index + 1
                                            const isCurrentPage = pageNum === page
                                            
                                            // Show first, last, current, and pages around current
                                            if (
                                                pageNum === 1 || 
                                                pageNum === pagination.total_pages ||
                                                (pageNum >= page - 2 && pageNum <= page + 2)
                                            ) {
                                                return (
                                                    <li key={pageNum} className={`page-item ${isCurrentPage ? 'active' : ''}`}>
                                                        <button
                                                            className="page-link"
                                                            onClick={() => handlePageChange(pageNum)}
                                                        >
                                                            {pageNum}
                                                        </button>
                                                    </li>
                                                )
                                            } else if (
                                                pageNum === page - 3 || 
                                                pageNum === page + 3
                                            ) {
                                                return (
                                                    <li key={pageNum} className="page-item disabled">
                                                        <span className="page-link">...</span>
                                                    </li>
                                                )
                                            }
                                            return null
                                        })}
                                        
                                        <li className={`page-item ${!pagination.has_next ? 'disabled' : ''}`}>
                                            <button
                                                className="page-link"
                                                onClick={() => handlePageChange(page + 1)}
                                                disabled={!pagination.has_next}
                                            >
                                                Next
                                            </button>
                                        </li>
                                    </ul>
                                </nav>
                            </div>
                        )}
                    </>
                )}
            </div>

            <style jsx>{`
                .search-results-page {
                    padding: 20px 0;
                    min-height: 60vh;
                }

                .search-header {
                    margin-bottom: 30px;
                    padding: 20px 0;
                    border-bottom: 1px solid #eee;
                }

                .search-info {
                    margin-bottom: 20px;
                }

                .search-info h2 {
                    margin-bottom: 10px;
                    font-size: 24px;
                    color: #333;
                }

                .search-meta {
                    color: #666;
                    margin: 0;
                }

                .response-time {
                    font-size: 12px;
                    color: #999;
                }

                .loading-container {
                    text-align: center;
                    padding: 60px 20px;
                }

                .spinner-large {
                    width: 40px;
                    height: 40px;
                    border: 4px solid #f3f3f3;
                    border-top: 4px solid #08C;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin: 0 auto 20px;
                }

                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                .error-container {
                    padding: 40px 20px;
                    text-align: center;
                }

                .search-controls {
                    margin-bottom: 30px;
                    padding: 15px 0;
                    border-bottom: 1px solid #eee;
                }

                .results-count {
                    margin: 0;
                    color: #666;
                    font-size: 14px;
                }

                .sort-controls {
                    text-align: right;
                }

                .sort-controls label {
                    margin-right: 10px;
                    font-size: 14px;
                    color: #666;
                }

                .sort-select {
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    padding: 8px 12px;
                    font-size: 14px;
                    background: white;
                }

                .products-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                    gap: 30px;
                    margin-bottom: 40px;
                }

                .product-card {
                    background: white;
                    border: 1px solid #eee;
                    border-radius: 8px;
                    padding: 20px;
                    transition: all 0.3s ease;
                    cursor: pointer;
                }

                .product-card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
                }

                .product-image {
                    position: relative;
                    width: 100%;
                    height: 200px;
                    margin-bottom: 15px;
                    border-radius: 6px;
                    overflow: hidden;
                    background: #f8f9fa;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .product-image img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .no-image {
                    color: #ccc;
                    font-size: 48px;
                }

                .hot-badge {
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    background: #ff4444;
                    color: white;
                    padding: 4px 8px;
                    border-radius: 4px;
                    font-size: 12px;
                    font-weight: bold;
                }

                .product-info {
                    text-align: center;
                }

                .product-name {
                    margin-bottom: 8px;
                    font-size: 16px;
                    font-weight: 600;
                }

                .product-name a {
                    color: #333;
                    text-decoration: none;
                }

                .product-name a:hover {
                    color: #08C;
                }

                .product-vendor {
                    margin-bottom: 10px;
                    font-size: 14px;
                    color: #666;
                }

                .product-rating {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 5px;
                    margin-bottom: 10px;
                }

                .stars {
                    display: flex;
                    gap: 2px;
                }

                .icon-star {
                    color: #ddd;
                    font-size: 14px;
                }

                .icon-star.filled {
                    color: #ffc107;
                }

                .rating-text {
                    font-size: 12px;
                    color: #666;
                }

                .product-price {
                    margin-bottom: 10px;
                    font-size: 18px;
                    font-weight: 600;
                    color: #28a745;
                }

                .price-container {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                }

                .old-price {
                    font-size: 14px;
                    color: #999;
                    text-decoration: line-through;
                }

                .relevance-score {
                    font-size: 12px;
                    color: #08C;
                    margin-bottom: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 5px;
                }

                .ai-match-score {
                    font-size: 12px;
                    color: #667eea;
                    margin-bottom: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 5px;
                    font-weight: 600;
                }

                .product-tags {
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: center;
                    gap: 4px;
                    margin-bottom: 10px;
                }

                .product-tags .tag {
                    background: #f3f4f6;
                    color: #374151;
                    padding: 2px 6px;
                    border-radius: 4px;
                    font-size: 10px;
                    font-weight: 500;
                }

                .tag-more {
                    background: #e5e7eb;
                    color: #6b7280;
                    padding: 2px 6px;
                    border-radius: 4px;
                    font-size: 10px;
                }

                /* Search Type Toggle */
                .search-info-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 15px;
                }

                .search-type-toggle {
                    display: flex;
                    background: #f8f9fa;
                    border-radius: 8px;
                    padding: 4px;
                    gap: 4px;
                }

                .toggle-btn {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    padding: 8px 16px;
                    border: none;
                    background: transparent;
                    color: #666;
                    border-radius: 6px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    font-size: 14px;
                    font-weight: 500;
                }

                .toggle-btn:hover:not(:disabled) {
                    background: #e9ecef;
                    color: #333;
                }

                .toggle-btn.active {
                    background: white;
                    color: #333;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }

                .toggle-btn:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }

                /* Search Meta Enhancements */
                .search-meta {
                    padding: 15px;
                    background: #f8f9fa;
                    border-radius: 8px;
                    border-left: 4px solid #08C;
                }

                .search-method {
                    font-style: italic;
                    color: #495057;
                }

                .relevant-tags {
                    margin-top: 10px;
                    display: flex;
                    align-items: center;
                    flex-wrap: wrap;
                    gap: 8px;
                }

                .tags-label {
                    font-size: 12px;
                    color: #666;
                    font-weight: 600;
                    margin-right: 8px;
                }

                .tag-chip {
                    background: #667eea;
                    color: white;
                    padding: 3px 8px;
                    border-radius: 12px;
                    font-size: 11px;
                    font-weight: 500;
                }

                .add-to-cart-btn {
                    width: 100%;
                    padding: 10px;
                    background: #08C;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    transition: background 0.3s ease;
                }

                .add-to-cart-btn:hover {
                    background: #0066cc;
                }

                .no-results {
                    text-align: center;
                    padding: 60px 20px;
                }

                .no-results-content i {
                    font-size: 64px;
                    color: #ccc;
                    margin-bottom: 20px;
                }

                .no-results-content h3 {
                    margin-bottom: 10px;
                    color: #666;
                }

                .no-results-content p {
                    color: #999;
                    margin-bottom: 30px;
                }

                .pagination-container {
                    display: flex;
                    justify-content: center;
                    margin-top: 40px;
                }

                .pagination {
                    display: flex;
                    list-style: none;
                    padding: 0;
                    margin: 0;
                    gap: 5px;
                }

                .page-item {
                    display: flex;
                }

                .page-link {
                    padding: 8px 12px;
                    border: 1px solid #ddd;
                    background: white;
                    color: #08C;
                    text-decoration: none;
                    cursor: pointer;
                    border-radius: 4px;
                    transition: all 0.3s ease;
                }

                .page-item.active .page-link {
                    background: #08C;
                    color: white;
                    border-color: #08C;
                }

                .page-item.disabled .page-link {
                    color: #ccc;
                    cursor: not-allowed;
                    background: #f8f9fa;
                }

                .page-link:hover:not(.disabled) {
                    background: #f8f9fa;
                }

                @media (max-width: 768px) {
                    .products-grid {
                        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
                        gap: 20px;
                    }
                    
                    .search-controls .row {
                        flex-direction: column;
                        gap: 15px;
                    }
                    
                    .sort-controls {
                        text-align: left;
                    }

                    .search-info-header {
                        flex-direction: column;
                        gap: 15px;
                        align-items: stretch;
                    }

                    .search-type-toggle {
                        align-self: center;
                    }

                    .toggle-btn {
                        padding: 10px 12px;
                        font-size: 13px;
                    }

                    .relevant-tags {
                        flex-direction: column;
                        align-items: flex-start;
                    }
                }
            `}</style>
        </div>
    )
}
