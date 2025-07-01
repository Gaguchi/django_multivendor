import React, { memo, useCallback } from 'react'
import { useFilterContext } from './FilterProvider'

const CategoriesFilterIsolated = memo(function CategoriesFilterIsolated({ 
  categories = [],
  loading = false,
  collapsed = false,
  onToggleCollapse = () => {}
}) {
  const { filters, updateFilter } = useFilterContext()
  const selectedCategories = filters.categories

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

  const handleToggleCategory = useCallback((categoryId) => {
    const newCategories = selectedCategories.includes(categoryId)
      ? selectedCategories.filter(id => id !== categoryId)
      : [...selectedCategories, categoryId]
    
    updateFilter('categories', newCategories, true) // Immediate update
  }, [selectedCategories, updateFilter])

  const handleClearCategories = useCallback(() => {
    updateFilter('categories', [], true)
  }, [updateFilter])

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
    <div className="widget widget-categories">
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
          <div className="cat-list">
            {categories.map((category) => (
              <button
                key={category.id}
                className="category-item"
                onClick={() => handleToggleCategory(category.id)}
              >
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category.id)}
                  onChange={() => {}} // Handled by button click
                  tabIndex="-1"
                />
                <span className="category-name">{category.name}</span>
                <small className="products-count">({category.product_count || 0})</small>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
})

export default CategoriesFilterIsolated
