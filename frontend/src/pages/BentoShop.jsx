import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCategories } from '../hooks/useCategories'
import { buildCategoryTree } from '../utils/categoryTreeBuilder'
import './BentoShop.css'

const BentoShop = () => {
  const navigate = useNavigate()
  const { data: categories = [], isLoading } = useCategories()
  const [categoryTree, setCategoryTree] = useState({ rootCategories: [], map: new Map() })

  // Build category tree for display
  useEffect(() => {
    if (categories.length > 0) {
      console.log('🏪 BentoShop: Building category tree from', categories.length, 'categories')
      const tree = buildCategoryTree(categories, {
        debug: false,
        showEmptyCategories: true // Show all categories for main shop page
      })
      
      console.log('🏗️ BentoShop: Category tree built:', {
        rootCategories: tree.rootCategories.length,
        withProducts: tree.rootCategories.filter(c => c.product_count > 0).length,
        withSubcategories: tree.rootCategories.filter(c => c.subcategories?.length > 0).length
      })
      
      setCategoryTree(tree)
    }
  }, [categories])

  // Handle category click
  const handleCategoryClick = (category) => {
    console.log('🎯 BentoShop: Navigating to category:', category.slug)
    navigate(`/category/${category.slug}`)
  }

  // Handle search/filter click
  const handleSearchClick = () => {
    console.log('🔍 BentoShop: Navigating to shop browse')
    navigate('/shop/browse')
  }

  if (isLoading) {
    return (
      <div className="bento-shop-container">
        <div className="container py-5">
          <div className="loading-state">
            <div className="loading-spinner">
              <div className="spinner-border text-primary" role="status">
                <span className="sr-only">Loading categories...</span>
              </div>
            </div>
            <h3 className="loading-title">Loading Amazing Categories</h3>
            <p className="loading-subtitle">Preparing your shopping experience...</p>
          </div>
        </div>
      </div>
    )
  }

  // Get featured categories (top-level categories with products or subcategories)
  const featuredCategories = categoryTree.rootCategories
    .filter(category => {
      const hasProducts = category.product_count > 0
      const hasSubcategories = category.subcategories?.length > 0
      return hasProducts || hasSubcategories
    })
    .slice(0, 8) // Limit to 8 for bento grid

  console.log('✨ BentoShop: Featured categories:', featuredCategories.map(c => ({
    name: c.name,
    products: c.product_count,
    subcategories: c.subcategories?.length || 0
  })))

  return (
    <div className="bento-shop-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <div className="hero-badge">
              <i className="fas fa-star"></i>
              <span>Multi-Vendor Marketplace</span>
            </div>
            <h1 className="hero-title">Discover Amazing Products</h1>
            <p className="hero-subtitle">
              Explore our curated collection of quality products from trusted vendors around the world
            </p>
            <div className="hero-buttons">
              <button 
                className="cta-button primary"
                onClick={handleSearchClick}
              >
                Start Shopping
                <i className="fas fa-arrow-right ml-2"></i>
              </button>
              <button 
                className="cta-button secondary"
                onClick={() => navigate('/search')}
              >
                <i className="fas fa-search mr-2"></i>
                Search Products
              </button>
            </div>
            <div className="hero-stats">
              <div className="stat-item">
                <strong>{categories.length}+</strong>
                <span>Categories</span>
              </div>
              <div className="stat-item">
                <strong>1000+</strong>
                <span>Products</span>
              </div>
              <div className="stat-item">
                <strong>50+</strong>
                <span>Vendors</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Shop by Category</h2>
            <p className="section-subtitle">Find exactly what you're looking for in our organized categories</p>
          </div>

          {/* Bento Grid */}
          <div className="bento-grid">
            {featuredCategories.map((category, index) => (
              <div 
                key={category.id}
                className={`bento-card ${getBentoCardClass(index)}`}
                onClick={() => handleCategoryClick(category)}
              >
                <div className="bento-card-content">
                  <div className="category-image-placeholder">
                    <i className={getCategoryIcon(category.name)}></i>
                  </div>
                  <div className="category-info">
                    <h3 className="category-name">{category.name}</h3>
                  </div>
                </div>
                <div className="category-overlay">
                  <div className="overlay-content">
                    <span className="explore-text">Explore {category.name}</span>
                    <i className="fas fa-arrow-right"></i>
                  </div>
                </div>
              </div>
            ))}

            {/* Search/Filter Card */}
            <div 
              className="bento-card search-card special-card"
              onClick={handleSearchClick}
            >
              <div className="bento-card-content">
                <div className="search-icon-container">
                  <i className="fas fa-search"></i>
                  <div className="search-pulse"></div>
                </div>
                <div className="search-info">
                  <h3 className="search-title">Advanced Search</h3>
                </div>
              </div>
              <div className="category-overlay">
                <div className="overlay-content">
                  <span className="explore-text">Advanced Filters</span>
                  <i className="fas fa-filter"></i>
                </div>
              </div>
            </div>

            {/* All Categories Card */}
            <div 
              className="bento-card all-categories-card special-card"
              onClick={handleSearchClick}
            >
              <div className="bento-card-content">
                <div className="all-categories-icon-container">
                  <i className="fas fa-th-large"></i>
                </div>
                <div className="all-categories-info">
                  <h3 className="all-categories-title">View All</h3>
                </div>
              </div>
              <div className="category-overlay">
                <div className="overlay-content">
                  <span className="explore-text">Browse All</span>
                  <i className="fas fa-grid-3x3"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="features-header">
            <h2 className="features-title">Why Shop With Us?</h2>
            <p className="features-subtitle">Experience the best in multi-vendor marketplace shopping</p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-shipping-fast"></i>
              </div>
              <h3>Fast Shipping</h3>
              <p>Free shipping on orders over $50 with tracking included</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-shield-alt"></i>
              </div>
              <h3>Secure Payments</h3>
              <p>100% secure payment processing with SSL encryption</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-undo"></i>
              </div>
              <h3>Easy Returns</h3>
              <p>30-day hassle-free returns with full money-back guarantee</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-headset"></i>
              </div>
              <h3>24/7 Support</h3>
              <p>Customer support when you need it, any time of day</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

// Helper function to get Bento card class based on index for better grid layout
const getBentoCardClass = (index) => {
  const patterns = [
    'large', 'medium', 'small', 'medium',
    'medium', 'small', 'medium', 'large',
    'small', 'medium'
  ]
  return patterns[index % patterns.length]
}

// Helper function to get category icon with more variety
const getCategoryIcon = (categoryName) => {
  const iconMap = {
    'Electronics': 'fas fa-laptop',
    'Fashion': 'fas fa-tshirt', 
    'Clothing': 'fas fa-tshirt',
    'Home': 'fas fa-home',
    'Home & Garden': 'fas fa-home',
    'Beauty': 'fas fa-palette',
    'Health & Beauty': 'fas fa-heart',
    'Sports': 'fas fa-dumbbell',
    'Sports & Outdoors': 'fas fa-running',
    'Books': 'fas fa-book',
    'Media': 'fas fa-play-circle',
    'Jewelry': 'fas fa-gem',
    'Automotive': 'fas fa-car',
    'Garden': 'fas fa-leaf',
    'Toys': 'fas fa-puzzle-piece',
    'Food': 'fas fa-utensils',
    'Pets': 'fas fa-paw',
    'Baby': 'fas fa-baby',
    'Office': 'fas fa-briefcase',
    'Art': 'fas fa-paint-brush',
    'Music': 'fas fa-music',
    'Tools': 'fas fa-tools',
    'Travel': 'fas fa-plane'
  }
  
  // Check for partial matches
  const lowercaseName = categoryName.toLowerCase()
  for (const [key, icon] of Object.entries(iconMap)) {
    if (lowercaseName.includes(key.toLowerCase())) {
      return icon
    }
  }
  
  return iconMap[categoryName] || 'fas fa-box'
}

export default BentoShop
