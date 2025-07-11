import React, { memo, useCallback, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { buildCategoryTree } from '../../../utils/categoryTreeBuilder'
import './Categories.css'

const Categories = memo(function Categories({ 
  categories = [],
  selectedCategories = [],
  onCategoriesChange = () => {},
  loading = false,
  collapsed = false,
  onToggleCollapse = () => {}
}) {
  const navigate = useNavigate()

  // DEBUG: Log categories prop at component level (reduced logging)
  const isFirstRender = React.useRef(true)
  if (isFirstRender.current) {
    console.log('🎯 Categories Component Initial Render:', {
      categoriesLength: categories.length,
      loading,
      hasCategories: categories.length > 0,
      timestamp: new Date().toISOString()
    })
    isFirstRender.current = false
  }

  // Track expanded categories and selected category for tree navigation
  const [expandedCategories, setExpandedCategories] = useState(new Set())
  const [selectedCategory, setSelectedCategory] = useState(null)

  // Categories should be collapsed by default
  // DEBUG: Uncomment the lines below to auto-expand all categories for debugging
  // React.useEffect(() => {
  //   if (categories.length > 0) {
  //     const allCategoryIds = categories.map(c => c.id)
  //     setExpandedCategories(new Set(allCategoryIds))
  //     console.log('🔧 DEBUG: Auto-expanded all categories for debugging:', allCategoryIds)
  //   }
  // }, [categories])

  // Build category hierarchy using shared utility (optimized)
  const categoryTree = useMemo(() => {
    if (categories.length === 0) {
      return { map: new Map(), rootCategories: [] }
    }

    const tree = buildCategoryTree(categories, {
      debug: false, // Reduced debug logging
      currentCategory: null,
      showEmptyCategories: false
    })

    // Sort root categories and limit for better UX
    const visibleRootCategories = tree.rootCategories
      .sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
      .slice(0, 10) // Show up to 10 root categories

    return { map: tree.map, rootCategories: visibleRootCategories }
  }, [categories])

  // Extract data from tree structure
  const { map: categoryMap, rootCategories } = categoryTree

  // Simplified debug logging (only when needed)
  const renderCount = React.useRef(0)
  renderCount.current++

  // Only log excessive renders or issues
  if (renderCount.current > 3) {
    console.warn('⚠️ Categories excessive renders:', {
      renderCount: renderCount.current,
      categoriesCount: categories.length,
      rootCategoriesCount: rootCategories.length,
      timestamp: new Date().toISOString()
    })
  }

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

  // Handle tree expand/collapse
  const handleToggleExpand = useCallback((categoryId) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev)
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId)
      } else {
        newSet.add(categoryId)
      }
      return newSet
    })
  }, [])

  // Handle category selection for filtering
  const handleCategorySelect = useCallback((category) => {
    setSelectedCategory(category)
    onCategoriesChange([category.id])
  }, [onCategoriesChange])

  // Clear all category selections
  const handleClearCategories = useCallback(() => {
    onCategoriesChange([])
    setSelectedCategory(null)
  }, [onCategoriesChange])

  // Render a single category tree node
  const renderCategoryNode = useCallback((category, level = 0) => {
    const hasChildren = category.children && category.children.length > 0
    const isExpanded = expandedCategories.has(category.id)
    const isSelected = selectedCategories.includes(category.id)
    const isCurrentCategory = selectedCategory?.id === category.id

    return (
      <div key={category.id} className={`category-tree-node level-${level}`}>
        <div className={`category-item ${isSelected ? 'selected' : ''} ${isCurrentCategory ? 'current' : ''}`}>
          {/* Expand/Collapse Button */}
          {hasChildren ? (
            <button 
              className="expand-toggle"
              onClick={() => handleToggleExpand(category.id)}
              aria-expanded={isExpanded}
              title={isExpanded ? 'Collapse' : 'Expand'}
            >
              <i className={`icon-chevron-${isExpanded ? 'down' : 'right'}`}></i>
            </button>
          ) : (
            <span className="no-children-spacer"></span>
          )}

          {/* Category Icon */}
          <span className="category-icon">
            {hasChildren ? '📁' : '📄'}
          </span>

          {/* Category Name and Count */}
          <button 
            className="category-name-btn"
            onClick={() => handleCategorySelect(category)}
            title={`Filter by ${category.name}`}
          >
            <span className="category-name">{category.name}</span>
            <span className="product-count">({category.product_count || 0})</span>
          </button>

          {/* Action Buttons */}
          <div className="category-actions">
            <button 
              className="view-category-btn"
              onClick={() => handleCategoryPageNavigation(category)}
              title={`View ${category.name} category page`}
            >
              <i className="icon-external-link"></i>
            </button>
          </div>
        </div>

        {/* Children (when expanded) */}
        {hasChildren && isExpanded && (
          <div className="category-children">
            {category.children
              .slice(0, 8) // Limit to 8 children for better UX
              .map(child => renderCategoryNode(child, level + 1))
            }
          </div>
        )}
      </div>
    )
  }, [expandedCategories, selectedCategories, selectedCategory, handleToggleExpand, handleCategorySelect, handleCategoryPageNavigation])

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
      {/* DEBUG: Visual indicator that our code is running */}
      <div style={{backgroundColor: '#e3f2fd', padding: '4px 8px', fontSize: '11px', color: '#1976d2', marginBottom: '8px'}}>
        🌳 Hierarchical Tree v2.0 (Categories: {categories.length}, Roots: {rootCategories.length})
        {rootCategories.length > 0 && (
          <div style={{marginTop: '4px', fontSize: '10px'}}>
            Roots: {rootCategories.slice(0, 3).map(r => r.name).join(', ')}
            {rootCategories.length > 3 && ` +${rootCategories.length - 3} more`}
          </div>
        )}
        {/* Show tree structure */}
        {rootCategories.length > 0 && rootCategories.some(r => r.children?.length > 0) && (
          <div style={{marginTop: '4px', fontSize: '10px', color: '#388e3c'}}>
            Tree: {rootCategories.filter(r => r.children?.length > 0).slice(0, 2).map(r => 
              `${r.name}(${r.children.length})`
            ).join(', ')}
          </div>
        )}
      </div>
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
          {/* Category Tree */}
          <div className="category-tree">
            {loading ? (
              <div className="no-categories">
                <p>Processing categories...</p>
              </div>
            ) : rootCategories.length > 0 ? (
              rootCategories.map(category => renderCategoryNode(category, 0))
            ) : (
              <div className="no-categories">
                {categories.length === 0 ? (
                  <p>No categories available!</p>
                ) : (
                  <p>No categories with products found!</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
})

export default Categories
