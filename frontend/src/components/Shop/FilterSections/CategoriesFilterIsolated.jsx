import React, { memo, useCallback, useState, useMemo } from 'react'
import { useFilterContext } from './FilterProvider'
import './HierarchicalCategoriesFilter.css'

const CategoriesFilterIsolated = memo(function CategoriesFilterIsolated({ 
  categories = [],
  loading = false,
  collapsed = false,
  onToggleCollapse = () => {}
}) {
  const { filters, updateFilter } = useFilterContext()
  const selectedCategories = filters.categories

  // Navigation state for hierarchical browsing
  const [currentView, setCurrentView] = useState({
    categories: [],
    breadcrumb: [],
    parentCategory: null
  })

  // This component should ONLY re-render when:
  // 1. categories prop changes
  // 2. selectedCategories changes
  // 3. loading/collapsed state changes
  
  console.log('🏷️ CategoriesFilterIsolated render:', {
    categoriesCount: categories.length,
    selectedCount: selectedCategories.length,
    timestamp: new Date().toISOString(),
    note: 'This should ONLY re-render when categories data or selection changes'
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

  // Initialize current view when categories load
  React.useEffect(() => {
    if (categories.length > 0 && currentView.categories.length === 0) {
      setCurrentView({
        categories: rootCategories,
        breadcrumb: [],
        parentCategory: null
      })
    }
  }, [categories.length, currentView.categories.length, rootCategories])

  const handleToggleCategory = useCallback((categoryId) => {
    const newCategories = selectedCategories.includes(categoryId)
      ? selectedCategories.filter(id => id !== categoryId)
      : [...selectedCategories, categoryId]
    
    updateFilter('categories', newCategories, true) // Immediate update
  }, [selectedCategories, updateFilter])

  const handleClearCategories = useCallback(() => {
    updateFilter('categories', [], true)
  }, [updateFilter])

  // Handle drilling down into a category
  const handleDrillDown = useCallback((category) => {
    if (category.children && category.children.length > 0) {
      const newBreadcrumb = [...currentView.breadcrumb, category]
      setCurrentView({
        categories: category.children.sort((a, b) => (a.display_order || 0) - (b.display_order || 0)),
        breadcrumb: newBreadcrumb,
        parentCategory: category
      })
    }
  }, [currentView.breadcrumb])

  // Handle going back to parent level
  const handleGoBack = useCallback(() => {
    if (currentView.breadcrumb.length > 0) {
      const newBreadcrumb = currentView.breadcrumb.slice(0, -1)
      const parent = newBreadcrumb.length > 0 ? newBreadcrumb[newBreadcrumb.length - 1] : null
      
      setCurrentView({
        categories: parent ? parent.children.sort((a, b) => (a.display_order || 0) - (b.display_order || 0)) : rootCategories,
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

  if (loading) {
    return (
      <div className="widget widget-categories">
        <h3 className="widget-title">Categories</h3>
        <div className="widget-body">
          <div className="cat-list">
            {[1, 2, 3].map(i => (
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
            ))}
          </div>

          {currentView.categories.length === 0 && (
            <div className="no-categories">
              <p>No categories available!</p>
              {currentView.breadcrumb.length > 0 && (
                <button onClick={() => handleBreadcrumbClick(-1)} className="btn-reset">
                  Return to main categories
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
})

export default CategoriesFilterIsolated
