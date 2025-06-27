import { useState } from 'react'
import AISearchModal from './AISearchModal'
import './AISearchModal.css'

export default function AISearchButton() {
    const [isSearchOpen, setIsSearchOpen] = useState(false)

    const openSearch = () => {
        setIsSearchOpen(true)
        document.body.classList.add('search-opened')
    }

    const closeSearch = () => {
        setIsSearchOpen(false)
        document.body.classList.remove('search-opened')
    }

    return (
        <>
            {/* AI Search Button */}
            <button
                className="ai-search-btn"
                onClick={openSearch}
                title="AI Search - Ask me anything!"
                aria-label="Open AI Search"
            >
                <div className="ai-search-icon">
                    <i className="icon-magnifier"></i>
                    <span className="ai-badge">AI</span>
                </div>
                <span className="ai-search-text d-none d-lg-inline">Ask AI</span>
            </button>

            {/* AI Search Modal */}
            {isSearchOpen && <AISearchModal onClose={closeSearch} />}

            {/* AI Search Button Styles */}
            <style jsx>{`
                .ai-search-btn {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border: none;
                    color: white;
                    padding: 10px 16px;
                    border-radius: 25px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
                    position: relative;
                    overflow: hidden;
                    font-weight: 500;
                    font-size: 14px;
                }

                .ai-search-btn:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
                    background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);
                }

                .ai-search-btn:active {
                    transform: translateY(0);
                }

                .ai-search-icon {
                    position: relative;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 20px;
                    height: 20px;
                }

                .ai-search-icon i {
                    font-size: 16px;
                }

                .ai-badge {
                    position: absolute;
                    top: -6px;
                    right: -8px;
                    background: #ff6b6b;
                    color: white;
                    font-size: 9px;
                    font-weight: bold;
                    padding: 1px 4px;
                    border-radius: 8px;
                    line-height: 1;
                    animation: pulse 2s infinite;
                }

                .ai-search-text {
                    font-size: 14px;
                    font-weight: 500;
                }

                @keyframes pulse {
                    0% {
                        transform: scale(1);
                    }
                    50% {
                        transform: scale(1.1);
                    }
                    100% {
                        transform: scale(1);
                    }
                }

                /* Mobile responsiveness */
                @media (max-width: 991px) {
                    .ai-search-btn {
                        padding: 8px 12px;
                        border-radius: 20px;
                    }
                    
                    .ai-search-icon {
                        width: 18px;
                        height: 18px;
                    }
                    
                    .ai-search-icon i {
                        font-size: 14px;
                    }
                }

                @media (max-width: 576px) {
                    .ai-search-btn {
                        padding: 6px 10px;
                        min-width: 44px; /* Ensure touch-friendly size */
                    }
                }
            `}</style>
        </>
    )
}
