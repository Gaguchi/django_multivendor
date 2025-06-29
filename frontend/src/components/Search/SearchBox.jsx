import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function SearchBox({ className = '', placeholder = "Search products...", showCategories = false }) {
    const [query, setQuery] = useState('')
    const [suggestions, setSuggestions] = useState([])
    const [showSuggestions, setShowSuggestions] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState('')
    const [isAIMode, setIsAIMode] = useState(false)
    const navigate = useNavigate()

    // Debounce search suggestions
    useEffect(() => {
        if (query.length > 2) {
            const timer = setTimeout(() => {
                fetchSuggestions(query)
            }, 300)
            return () => clearTimeout(timer)
        } else {
            setSuggestions([])
            setShowSuggestions(false)
        }
    }, [query])

    const fetchSuggestions = async (searchQuery) => {
        try {
            const endpoint = isAIMode ? 'ai-search/suggestions' : 'search/suggestions'
            const response = await fetch(`https://api.bazro.ge/api/${endpoint}/?q=${encodeURIComponent(searchQuery)}`)
            if (response.ok) {
                const data = await response.json()
                setSuggestions(data.suggestions || [])
                setShowSuggestions(data.suggestions?.length > 0)
            }
        } catch (error) {
            console.error('Error fetching suggestions:', error)
        }
    }

    const handleSearch = async (e) => {
        e.preventDefault()
        if (!query.trim()) return

        setIsLoading(true)
        setShowSuggestions(false)

        try {
            // Navigate to search results page with query parameters
            const searchParams = new URLSearchParams({
                q: query.trim(),
                ...(selectedCategory && { category: selectedCategory }),
                ...(isAIMode && { type: 'ai' })
            })
            navigate(`/search?${searchParams.toString()}`)
        } catch (error) {
            console.error('Search error:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleSuggestionClick = (suggestion) => {
        const searchText = typeof suggestion === 'object' ? suggestion.text : String(suggestion);
        setQuery(searchText)
        setShowSuggestions(false)
        // Trigger search
        const searchParams = new URLSearchParams({
            q: searchText,
            ...(selectedCategory && { category: selectedCategory }),
            ...(isAIMode && { type: 'ai' })
        })
        navigate(`/search?${searchParams.toString()}`)
    }

    const categories = [
        { value: '', label: 'All Categories' },
        { value: 'electronics', label: 'Electronics' },
        { value: 'fashion', label: 'Fashion' },
        { value: 'home', label: 'Home & Garden' },
        { value: 'health', label: 'Health & Beauty' },
        { value: 'sports', label: 'Sports' },
        { value: 'automotive', label: 'Automotive' },
    ]

    return (
        <div className={`search-box-container ${className}`}>
            <form onSubmit={handleSearch} className="search-form">
                <div className="search-input-wrapper">
                    {showCategories && (
                        <div className="search-category-select">
                            <select 
                                value={selectedCategory} 
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="category-select"
                            >
                                {categories.map(cat => (
                                    <option key={cat.value} value={cat.value}>
                                        {cat.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                    
                    <div className="search-input-container">
                        {/* AI Mode Toggle */}
                        <div className="search-mode-toggle">
                            <button
                                type="button"
                                className={`ai-toggle ${isAIMode ? 'active' : ''}`}
                                onClick={() => setIsAIMode(!isAIMode)}
                                title={isAIMode ? 'Disable AI Search' : 'Enable AI Search'}
                            >
                                <i className="icon-cpu"></i>
                                {isAIMode && <span className="ai-label">AI</span>}
                            </button>
                        </div>

                        <input
                            type="search"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder={isAIMode ? "Ask AI anything..." : placeholder}
                            className="search-input"
                            autoComplete="off"
                        />
                        
                        <button 
                            type="submit" 
                            className="search-button"
                            disabled={isLoading || !query.trim()}
                        >
                            {isLoading ? (
                                <div className="spinner"></div>
                            ) : (
                                <i className="icon-magnifier"></i>
                            )}
                        </button>

                        {/* Search Suggestions Dropdown */}
                        {showSuggestions && suggestions.length > 0 && (
                            <div className="search-suggestions-dropdown">
                                {suggestions.map((suggestion, index) => {
                                    const suggestionText = typeof suggestion === 'object' ? suggestion.text : String(suggestion);
                                    const suggestionType = typeof suggestion === 'object' ? suggestion.type : null;
                                    const suggestionCount = typeof suggestion === 'object' ? suggestion.count : null;
                                    
                                    return (
                                        <div 
                                            key={index}
                                            className="suggestion-item"
                                            onClick={() => handleSuggestionClick(suggestion)}
                                        >
                                            <i className="icon-magnifier"></i>
                                            <span className="suggestion-text">{suggestionText}</span>
                                            {suggestionType && (
                                                <span className="suggestion-type">{String(suggestionType)}</span>
                                            )}
                                            {suggestionCount && (
                                                <span className="suggestion-count">({String(suggestionCount)})</span>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </form>

            <style jsx>{`
                .search-box-container {
                    position: relative;
                    width: 100%;
                }

                .search-form {
                    width: 100%;
                }

                .search-input-wrapper {
                    display: flex;
                    width: 100%;
                    background: #f4f4f4;
                    border-radius: ${showCategories ? '25px' : '25px'};
                    overflow: hidden;
                    border: 2px solid transparent;
                    transition: border-color 0.3s ease;
                }

                .search-input-wrapper:focus-within {
                    border-color: #08C;
                }

                .search-category-select {
                    flex-shrink: 0;
                }

                .category-select {
                    border: none;
                    background: transparent;
                    padding: 12px 15px;
                    font-size: 14px;
                    color: #666;
                    cursor: pointer;
                    border-right: 1px solid #ddd;
                    outline: none;
                    min-width: 130px;
                }

                .search-input-container {
                    position: relative;
                    flex: 1;
                    display: flex;
                    align-items: center;
                }

                .search-mode-toggle {
                    padding-left: 10px;
                }

                .ai-toggle {
                    background: transparent;
                    border: none;
                    padding: 8px;
                    border-radius: 50%;
                    color: #666;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    font-size: 12px;
                    min-width: 32px;
                    height: 32px;
                    justify-content: center;
                }

                .ai-toggle:hover {
                    background: rgba(0, 136, 204, 0.1);
                    color: #08C;
                }

                .ai-toggle.active {
                    background: #08C;
                    color: white;
                }

                .ai-label {
                    font-size: 10px;
                    font-weight: bold;
                    margin-left: 2px;
                }

                .search-input {
                    flex: 1;
                    border: none;
                    background: transparent;
                    padding: 12px 15px;
                    font-size: 14px;
                    color: #333;
                    outline: none;
                }

                .search-input::placeholder {
                    color: #a8a8a8;
                }

                .search-button {
                    background: transparent;
                    border: none;
                    padding: 12px 15px;
                    color: #666;
                    cursor: pointer;
                    transition: color 0.3s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    min-width: 45px;
                }

                .search-button:hover:not(:disabled) {
                    color: #08C;
                }

                .search-button:disabled {
                    color: #ccc;
                    cursor: not-allowed;
                }

                .spinner {
                    width: 16px;
                    height: 16px;
                    border: 2px solid #f3f3f3;
                    border-top: 2px solid #08C;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }

                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                .search-suggestions-dropdown {
                    position: absolute;
                    top: 100%;
                    left: 0;
                    right: 0;
                    background: white;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                    z-index: 1000;
                    max-height: 300px;
                    overflow-y: auto;
                    margin-top: 5px;
                }

                .suggestion-item {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    padding: 12px 15px;
                    cursor: pointer;
                    transition: background-color 0.2s ease;
                }

                .suggestion-item:hover {
                    background-color: #f8f9fa;
                }

                .suggestion-item i {
                    color: #666;
                    font-size: 14px;
                    flex-shrink: 0;
                }

                .suggestion-text {
                    font-size: 14px;
                    color: #333;
                    flex: 1;
                }

                .suggestion-type {
                    font-size: 12px;
                    color: #666;
                    background: #f0f0f0;
                    padding: 2px 6px;
                    border-radius: 3px;
                    text-transform: capitalize;
                }

                .suggestion-count {
                    font-size: 12px;
                    color: #999;
                }

                /* Responsive styles */
                @media (max-width: 768px) {
                    .category-select {
                        min-width: 100px;
                        font-size: 13px;
                    }
                    
                    .search-input {
                        font-size: 13px;
                    }
                }
            `}</style>
        </div>
    )
}
