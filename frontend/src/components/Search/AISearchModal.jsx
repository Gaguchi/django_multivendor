import { useState, useEffect } from 'react'

export default function AISearchModal({ onClose }) {
    const [searchQuery, setSearchQuery] = useState('')
    const [isLoading, setIsLoading] = useState(false)

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

    const handleSearch = (e) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            setIsLoading(true)
            // TODO: Implement AI search functionality
            console.log('AI Search query:', searchQuery)
            
            // Simulate loading for now
            setTimeout(() => {
                setIsLoading(false)
            }, 2000)
        }
    }

    return (
        <>
            {/* Search Overlay */}
            <div className="search-overlay" onClick={closeModal}></div>
            
            {/* Search Modal */}
            <div className="search-modal">
                <div className="search-modal-header">
                    <h3 className="search-modal-title">
                        <i className="icon-search mr-2"></i>
                        AI-Powered Search
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
                                placeholder="Ask me anything about products... (e.g., 'Show me wireless headphones under $100')"
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
                    <div className="search-suggestions">
                        <h4 className="suggestions-title">Try asking:</h4>
                        <div className="suggestion-chips">
                            <button 
                                className="suggestion-chip"
                                onClick={() => setSearchQuery("Show me the best smartphones under $500")}
                            >
                                Best smartphones under $500
                            </button>
                            <button 
                                className="suggestion-chip"
                                onClick={() => setSearchQuery("Find wireless headphones with good battery life")}
                            >
                                Wireless headphones with good battery
                            </button>
                            <button 
                                className="suggestion-chip"
                                onClick={() => setSearchQuery("Recommend laptops for students")}
                            >
                                Laptops for students
                            </button>
                            <button 
                                className="suggestion-chip"
                                onClick={() => setSearchQuery("Show me trending electronics")}
                            >
                                Trending electronics
                            </button>
                        </div>
                    </div>

                    {/* Search Results Placeholder */}
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
                                <p>AI is searching for the best results...</p>
                            </div>
                        </div>
                    )}

                    {/* Empty State */}
                    {!isLoading && searchQuery && (
                        <div className="search-results">
                            <div className="search-empty">
                                <i className="icon-robot"></i>
                                <p>AI search functionality coming soon!</p>
                                <small>Your query: "{searchQuery}"</small>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}
