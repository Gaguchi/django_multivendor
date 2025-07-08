import React, { memo, useCallback, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import './HierarchicalCategoriesFilter.css'

const HierarchicalCategoriesFilter = memo(function HierarchicalCategoriesFilter({ 
  categories = [],
  selectedCategories = [],
  onCategoriesChange = () => {},
  loading = false,
  collapsed = false,
  onToggleCollapse = () => {}
}) {
  const navigate = useNavigate()

  // Track current navigation state
  const [currentView, setCurrentView] = useState({
    categories: [],
    breadcrumb: [],
    parentCategory: null
  })

  // Build category hierarchy from flat list
  const categoryMap = useMemo(() => {
    const map = new Map()
    categories.forEach(category => {
      map.set(category.id, {
        ...category,
        children: []
      })
    })
    
    // Build parent-child relationships
    categories.forEach(category => {
      if (category.parent_category) {
        const parent = map.get(category.parent_category)
        if (parent) {
          parent.children.push(map.get(category.id))
        }
      }
    })
    
    return map
  }, [categories])

  // Get root categories
  const rootCategories = useMemo(() => {
    return categories
      .filter(cat => !cat.parent_category)
      .map(cat => categoryMap.get(cat.id))
      .sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
  }, [categories, categoryMap])

  // Debug logging (after rootCategories is defined)
  console.log('🌳 HierarchicalCategoriesFilter render:', {
    categoriesCount: categories.length,
    selectedCount: selectedCategories.length,
    currentViewCount: currentView.categories.length,
    breadcrumb: currentView.breadcrumb.map(c => c.name),
    rootCategoriesCount: rootCategories.length,
    categories: categories.slice(0, 3).map(c => ({ id: c.id, name: c.name, parent: c.parent_category })),
    timestamp: new Date().toISOString()
  })

  // Handle category selection/deselection
  const handleToggleCategory = useCallback((categoryId) => {
    const category = categoryMap.get(categoryId)
    if (!category) return

    const newCategories = selectedCategories.includes(categoryId)
      ? selectedCategories.filter(id => id !== categoryId)
      : [...selectedCategories, categoryId]
    
    onCategoriesChange(newCategories)
  }, [selectedCategories, onCategoriesChange, categoryMap])

  // Handle category page navigation
  const handleCategoryPageNavigation = useCallback((category) => {
    if (category.slug) {
      navigate(`/category/${category.slug}`)
    }
  }, [navigate])

  // Handle drilling down into a category
  const handleDrillDown = useCallback((category) => {
    if (!category.children || category.children.length === 0) return

    setCurrentView({
      categories: category.children.sort((a, b) => (a.display_order || 0) - (b.display_order || 0)),
      breadcrumb: [...currentView.breadcrumb, category],
      parentCategory: category
    })
  }, [currentView.breadcrumb])

  // Handle going back up the hierarchy
  const handleGoBack = useCallback(() => {
    if (currentView.breadcrumb.length === 0) return

    const newBreadcrumb = [...currentView.breadcrumb]
    newBreadcrumb.pop() // Remove last item
    
    if (newBreadcrumb.length === 0) {
      // Back to root
      setCurrentView({
        categories: rootCategories,
        breadcrumb: [],
        parentCategory: null
      })
    } else {
      // Back to parent
      const parent = newBreadcrumb[newBreadcrumb.length - 1]
      setCurrentView({
        categories: parent.children.sort((a, b) => (a.display_order || 0) - (b.display_order || 0)),
        breadcrumb: newBreadcrumb,
        parentCategory: parent
      })
    }
  }, [currentView.breadcrumb, rootCategories])

  // Handle breadcrumb navigation
  const handleBreadcrumbClick = useCallback((index) => {
    if (index === -1) {
      // Root clicked
      setCurrentView({
        categories: rootCategories,
        breadcrumb: [],
        parentCategory: null
      })
    } else {
      // Specific breadcrumb level clicked
      const newBreadcrumb = currentView.breadcrumb.slice(0, index + 1)
      const targetCategory = newBreadcrumb[newBreadcrumb.length - 1]
      
      setCurrentView({
        categories: targetCategory.children.sort((a, b) => (a.display_order || 0) - (b.display_order || 0)),
        breadcrumb: newBreadcrumb,
        parentCategory: targetCategory
      })
    }
  }, [currentView.breadcrumb, rootCategories])

  // Clear all category selections
  const handleClearCategories = useCallback(() => {
    onCategoriesChange([])
  }, [onCategoriesChange])

  // Reset to root view
  const handleResetView = useCallback(() => {
    setCurrentView({
      categories: rootCategories,
      breadcrumb: [],
      parentCategory: null
    })
  }, [rootCategories])

  // Initialize current view when categories load
  React.useEffect(() => {
    if (categories.length > 0 && rootCategories.length > 0) {
      console.log('🔄 Initializing current view with root categories:', rootCategories.length)
      setCurrentView({
        categories: rootCategories,
        breadcrumb: [],
        parentCategory: null
      })
    }
  }, [categories.length, rootCategories.length, rootCategories])

  if (loading) {
    return (
      <div className="widget widget-categories">
        <h3 className="widget-title">Categories</h3>
        <div className="widget-body">
          <div className="cat-list">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="skeleton-line mb-2"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="widget widget-categories hierarchical">
      <h3 className="widget-title">
        <button 
          className="collapse-toggle"
          onClick={onToggleCollapse}
          aria-expanded={!collapsed}
        >
          Categories
          <i className={`icon-${collapsed ? 'plus' : 'minus'} ml-2`}></i>
        </button>
        {selectedCategories.length > 0 && (
          <button 
            className="clear-section"
            onClick={handleClearCategories}
            title="Clear categories"
          >
            Clear ({selectedCategories.length})
          </button>
        )}
      </h3>
      
      <div className={`widget-collapse ${collapsed ? 'collapsed' : 'expanded'}`}>
        <div className="widget-body">
          
          {/* Breadcrumb Navigation */}
          <div className="category-breadcrumb">
            <button 
              className="breadcrumb-item root"
              onClick={() => handleBreadcrumbClick(-1)}
              title="Go to root categories"
            >
              <i className="icon-home"></i>
              All Categories
            </button>
            
            {currentView.breadcrumb.map((crumb, index) => (
              <React.Fragment key={crumb.id}>
                <i className="icon-angle-right breadcrumb-separator"></i>
                <button 
                  className="breadcrumb-item"
                  onClick={() => handleBreadcrumbClick(index)}
                  title={`Go to ${crumb.name}`}
                >
                  {crumb.name}
                </button>
              </React.Fragment>
            ))}
          </div>

          {/* Back Button */}
          {currentView.breadcrumb.length > 0 && (
            <button 
              className="category-back-btn"
              onClick={handleGoBack}
              title="Go back"
            >
              <i className="icon-arrow-left"></i>
              Back
            </button>
          )}

          {/* Current Level Categories */}
          <div className="cat-list hierarchical">
            {/* Show parent category if we're in a subcategory */}
            {currentView.parentCategory && (
              <div className="category-row parent-category">
                <label className="category-item">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(currentView.parentCategory.id)}
                    onChange={() => handleToggleCategory(currentView.parentCategory.id)}
                    tabIndex="-1"
                  />
                  <span className="category-name">
                    <i className="icon-arrow-up"></i>
                    {currentView.parentCategory.name} (Parent)
                  </span>
                  <small className="products-count">({currentView.parentCategory.product_count || 0})</small>
                </label>
                <button 
                  className="view-category-btn"
                  onClick={() => handleCategoryPageNavigation(currentView.parentCategory)}
                  title={`View ${currentView.parentCategory.name} category page`}
                >
                  <i className="icon-eye"></i>
                  View
                </button>
              </div>
            )}

            {/* Current level categories (siblings if we're in a subcategory) */}
            {currentView.categories.map((category) => (
              <div key={category.id} className="category-row">
                {/* Category Selection Checkbox */}
                <label className="category-item">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category.id)}
                    onChange={() => handleToggleCategory(category.id)}
                    tabIndex="-1"
                  />
                  <span className="category-name">{category.name}</span>
                  <small className="products-count">({category.product_count || 0})</small>
                </label>

                <div className="category-actions">
                  {/* View Category Page Button */}
                  <button 
                    className="view-category-btn"
                    onClick={() => handleCategoryPageNavigation(category)}
                    title={`View ${category.name} category page`}
                  >
                    <i className="icon-eye"></i>
                    View
                  </button>

                  {/* Drill Down Button */}
                  {category.children && category.children.length > 0 && (
                    <button 
                      className="drill-down-btn"
                      onClick={() => handleDrillDown(category)}
                      title={`View ${category.name} subcategories`}
                    >
                      <i className="icon-angle-right"></i>
                      <span className="subcategory-count">
                        {category.children.length} sub{category.children.length === 1 ? '' : 's'}
                      </span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {currentView.categories.length === 0 && (
            <div className="no-categories">
              {loading ? (
                <p>Loading categories...</p>
              ) : categories.length === 0 ? (
                <p>No categories available!</p>
              ) : currentView.breadcrumb.length > 0 ? (
                <>
                  <p>No subcategories in this category</p>
                  <button onClick={handleResetView} className="btn-reset">
                    Return to main categories
                  </button>
                </>
              ) : (
                <p>Categories are loading...</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
})

export default HierarchicalCategoriesFilter
