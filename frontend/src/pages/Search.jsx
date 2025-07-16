import { useState, useEffect } from 'react'
import { useSearchParams, useLocation } from 'react-router-dom'
import ProductGrid from '../elements/ProductGrid'
import { ProductGridSkeleton, SearchResultsSkeleton } from '../components/Skeleton'
import ErrorMessage from '../components/ErrorMessage'
import './Search.css'

export default function Search() {
    const [searchParams] = useSearchParams()
    const location = useLocation()
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [searchMeta, setSearchMeta] = useState({})
    const [filters, setFilters] = useState({
        category: '',
        minPrice: '',
        maxPrice: '',
        sortBy: 'relevance'
    })

    const query = searchParams.get('q') || ''
    const searchType = searchParams.get('type') || 'regular'
    const category = searchParams.get('category') || ''

    useEffect(() => {
        if (query) {
            performSearch()
        } else {
            // Clear results when query is empty
            setProducts([])
            setSearchMeta({})
            setError('')
            setLoading(false)
        }
    }, [query, searchType, category, filters])

    const performSearch = async () => {
        setLoading(true)
        setError('')

        try {
            let response
            
            if (searchType === 'ai') {
                // GPT-4o AI Search endpoint (POST request)
                response = await fetch('https://api.bazro.ge/api/ai/search/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'User-Agent': 'BazroShop-Frontend/1.0'
                    },
                    body: JSON.stringify({
                        query: query.trim()
                    })
                })
            } else {
                // Regular search endpoint (GET request)
                const searchUrl = new URL(`https://api.bazro.ge/api/search/?q=${encodeURIComponent(query)}`)
                if (category) searchUrl.searchParams.append('category', category)
                if (filters.category) searchUrl.searchParams.append('category', filters.category)
                if (filters.minPrice) searchUrl.searchParams.append('min_price', filters.minPrice)
                if (filters.maxPrice) searchUrl.searchParams.append('max_price', filters.maxPrice)
                if (filters.sortBy) searchUrl.searchParams.append('sort', filters.sortBy)
                
                response = await fetch(searchUrl.toString())
            }
            
            if (!response.ok) {
                if (response.status === 404) {
                    // No results found - not an error
                    setProducts([])
                    setSearchMeta({
                        total: 0,
                        query: query,
                        searchType: searchType,
                        suggestions: []
                    })
                    return
                } else {
                    throw new Error(`Search failed: ${response.status}`)
                }
            }

            const data = await response.json()
            
            setProducts(data.results || data.products || [])
            setSearchMeta({
                total: data.count || data.total || data.results?.length || 0,
                query: data.query || query,
                searchType: searchType,
                processingTime: data.processing_time || null,
                aiInsights: data.ai_insights || null,
                suggestions: data.suggestions || []
            })

        } catch (err) {
            console.error('Search error:', err)
            setError(err.message || 'Failed to search products')
        } finally {
            setLoading(false)
        }
    }

    const handleFilterChange = (filterName, value) => {
        setFilters(prev => ({
            ...prev,
            [filterName]: value
        }))
    }

    const clearFilters = () => {
        setFilters({
            category: '',
            minPrice: '',
            maxPrice: '',
            sortBy: 'relevance'
        })
    }

    if (loading) {
        return (
            <div className="search-page">
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <SearchResultsSkeleton />
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="search-page">
            <div className="container">
                {/* Search Header */}
                <div className="search-header mb-4">
                    <div className="row align-items-center">
                        <div className="col-md-8">
                            <h2 className="search-title">
                                {searchType === 'ai' ? (
                                    <>
                                        <i className="icon-cpu me-2 text-primary"></i>
                                        AI Search Results
                                        <span className="badge bg-primary ms-2" style={{fontSize: '0.5em'}}>
                                            Powered by GPT-4o
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <i className="icon-magnifier me-2"></i>
                                        Search Results
                                    </>
                                )}
                            </h2>
                            <div className="search-info">
                                <span className="search-query">"{searchMeta.query}"</span>
                                {searchMeta.total > 0 && (
                                    <span className="search-count ms-2">
                                        ({searchMeta.total} {searchMeta.total === 1 ? 'product' : 'products'} found)
                                    </span>
                                )}
                                {searchMeta.processingTime && (
                                    <span className="processing-time ms-2 text-muted">
                                        in {searchMeta.processingTime}ms
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="col-md-4 text-end">
                            {searchType !== 'ai' && (
                                <button 
                                    className="btn btn-outline-primary"
                                    onClick={() => {
                                        const newParams = new URLSearchParams(searchParams)
                                        newParams.set('type', 'ai')
                                        window.location.search = newParams.toString()
                                    }}
                                >
                                    <i className="icon-cpu me-2"></i>
                                    Try AI Search
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* AI Insights */}
                {searchType === 'ai' && searchMeta.aiInsights && (
                    <div className="ai-insights-card mb-4">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">
                                    <i className="icon-bulb me-2 text-warning"></i>
                                    AI Insights
                                    <small className="text-muted ms-2" style={{fontSize: '0.7em'}}>
                                        by GPT-4o
                                    </small>
                                </h5>
                                <p className="card-text">{searchMeta.aiInsights}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Error Display */}
                {error && (
                    <ErrorMessage 
                        message={error} 
                        type="danger" 
                        dismissible 
                        onDismiss={() => setError('')}
                        className="mb-4"
                    />
                )}

                {/* No Results */}
                {!loading && !error && products.length === 0 && (
                    <div className="no-results text-center py-5">
                        <div className="no-results-icon mb-3">
                            <i className="icon-magnifier" style={{ fontSize: '4rem', color: '#ccc' }}></i>
                        </div>
                        <h3>No products found</h3>
                        <p className="text-muted mb-4">
                            We couldn't find any products matching your search "{query}"
                        </p>
                        <div className="no-results-suggestions">
                            <h5>Try:</h5>
                            <ul className="list-unstyled">
                                <li>• Checking your spelling</li>
                                <li>• Using fewer keywords</li>
                                <li>• Using more general terms</li>
                                {searchType !== 'ai' && <li>• Using AI search for better results</li>}
                            </ul>
                        </div>
                        {searchMeta.suggestions && searchMeta.suggestions.length > 0 && (
                            <div className="search-suggestions mt-4">
                                <h5>Did you mean:</h5>
                                <div className="d-flex flex-wrap gap-2 justify-content-center">
                                    {searchMeta.suggestions.map((suggestion, index) => (
                                        <button
                                            key={index}
                                            className="btn btn-outline-secondary btn-sm"
                                            onClick={() => {
                                                const newParams = new URLSearchParams()
                                                newParams.set('q', suggestion)
                                                if (searchType === 'ai') newParams.set('type', 'ai')
                                                window.location.search = newParams.toString()
                                            }}
                                        >
                                            {suggestion}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Results */}
                {products.length > 0 && (
                    <div className="row">
                        {/* Filters Sidebar */}
                        <div className="col-lg-3 col-md-4 mb-4">
                            <div className="search-filters">
                                <div className="filters-header d-flex justify-content-between align-items-center mb-3">
                                    <h5>Filters</h5>
                                    <button 
                                        className="btn btn-link btn-sm p-0"
                                        onClick={clearFilters}
                                    >
                                        Clear All
                                    </button>
                                </div>

                                {/* Sort By */}
                                <div className="filter-group mb-4">
                                    <label className="form-label">Sort By</label>
                                    <select 
                                        className="form-select"
                                        value={filters.sortBy}
                                        onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                                    >
                                        <option value="relevance">Relevance</option>
                                        <option value="price_low">Price: Low to High</option>
                                        <option value="price_high">Price: High to Low</option>
                                        <option value="newest">Newest First</option>
                                        <option value="rating">Highest Rated</option>
                                        <option value="popular">Most Popular</option>
                                    </select>
                                </div>

                                {/* Price Range */}
                                <div className="filter-group mb-4">
                                    <label className="form-label">Price Range</label>
                                    <div className="row g-2">
                                        <div className="col-6">
                                            <input
                                                type="number"
                                                className="form-control"
                                                placeholder="Min"
                                                value={filters.minPrice}
                                                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                                            />
                                        </div>
                                        <div className="col-6">
                                            <input
                                                type="number"
                                                className="form-control"
                                                placeholder="Max"
                                                value={filters.maxPrice}
                                                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Category Filter */}
                                <div className="filter-group mb-4">
                                    <label className="form-label">Category</label>
                                    <select 
                                        className="form-select"
                                        value={filters.category}
                                        onChange={(e) => handleFilterChange('category', e.target.value)}
                                    >
                                        <option value="">All Categories</option>
                                        <option value="electronics">Electronics</option>
                                        <option value="fashion">Fashion</option>
                                        <option value="home">Home & Garden</option>
                                        <option value="health">Health & Beauty</option>
                                        <option value="sports">Sports</option>
                                        <option value="automotive">Automotive</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Products Grid */}
                        <div className="col-lg-9 col-md-8">
                            <div className="search-results-header d-flex justify-content-between align-items-center mb-4">
                                <div className="results-info">
                                    <span>Showing {products.length} of {searchMeta.total} products</span>
                                </div>
                                <div className="view-options">
                                    <div className="btn-group" role="group">
                                        <button type="button" className="btn btn-outline-secondary active">
                                            <i className="icon-grid"></i>
                                        </button>
                                        <button type="button" className="btn btn-outline-secondary">
                                            <i className="icon-list"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <ProductGrid 
                                products={products.map(p => ({
                                    id: p.id,
                                    thumbnail: p.thumbnail,
                                    name: p.name,
                                    category: p.category_name || p.vendor_name || 'Category',
                                    price: parseFloat(p.price),
                                    old_price: p.old_price ? parseFloat(p.old_price) : null,
                                    stock: p.stock,
                                    rating: p.rating || 0
                                }))}
                                loading={false}
                                className="search-results-grid"
                            />

                            {/* Load More / Pagination */}
                            {searchMeta.total > products.length && (
                                <div className="text-center mt-4">
                                    <button className="btn btn-primary">
                                        Load More Products
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
