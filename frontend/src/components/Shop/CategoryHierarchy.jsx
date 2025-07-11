import React, { memo, useState, useMemo, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { buildCategoryTree } from '../../utils/categoryTreeBuilder'
import './FilterSections/Categories.css'

const CategoryHierarchy = memo(function CategoryHierarchy({
  categories = [],
  currentCategory = null,
  loading = false,
  showProductCounts = true,
  showAsFilter = false,
  onCategorySelect = null
}) {
  const navigate = useNavigate()
  const [expandedCategories, setExpandedCategories] = useState(new Set())

  // Build the hierarchical category structure with smart filtering
  const categoryHierarchy = useMemo(() => {
    console.log('🏗️ CategoryHierarchy - Building with shared utility:', {
      totalCategories: categories.length,
      currentCategory: currentCategory ? {
        id: currentCategory.id,
        name: currentCategory.name,
        slug: currentCategory.slug,
        parent_category: currentCategory.parent_category
      } : null,
      showAsFilter,
      timestamp: new Date().toISOString()
    })

    return buildCategoryTree(categories, {
      debug: false, // Reduced debug logging
      currentCategory,
      showEmptyCategories: false
    })
  }, [categories, currentCategory, showAsFilter])

  // Auto-expand categories to show current category's context
  useEffect(() => {
    if (currentCategory && categoryHierarchy.parentChain.length > 0) {
      const newExpanded = new Set()
      
      // Expand all parent categories
      categoryHierarchy.parentChain.forEach(parent => {
        newExpanded.add(parent.id)
      })
      
      // Expand current category if it has children
      if (categoryHierarchy.children.length > 0) {
        newExpanded.add(currentCategory.id)
      }
      
      setExpandedCategories(newExpanded)
      
      console.log('📂 Auto-expanded categories for hierarchy context:', {
        expandedIds: Array.from(newExpanded),
        parentChain: categoryHierarchy.parentChain.map(p => p.name),
        currentCategory: currentCategory.name
      })
    }
  }, [currentCategory, categoryHierarchy])

  // Handle category click
  const handleCategoryClick = useCallback((category) => {
    if (showAsFilter && onCategorySelect) {
      onCategorySelect(category)
    } else {
      // Navigate to category page
      if (category.slug) {
        navigate(`/category/${category.slug}`)
      }
    }
  }, [showAsFilter, onCategorySelect, navigate])

  // Handle expand/collapse
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

  // Render a single category item
  const renderCategoryItem = useCallback((category, isActive = false, isInActivePath = false, showIndent = true) => {
    const hasChildren = category.children && category.children.length > 0
    const isExpanded = expandedCategories.has(category.id)
    const shouldShowChildren = hasChildren && isExpanded

    return (
      <li key={category.id} className={`category-item ${isActive ? 'active' : ''} ${isInActivePath ? 'in-active-path' : ''}`}>
        <div 
          className={`category-link ${showIndent ? `level-${category.level || 0}` : ''}`}
          style={{ paddingLeft: showIndent ? `${(category.level || 0) * 20}px` : '0' }}
        >
          {/* Expand/Collapse button */}
          {hasChildren && (
            <button
              type="button"
              className="category-toggle"
              onClick={(e) => {
                e.stopPropagation()
                handleToggleExpand(category.id)
              }}
              aria-label={isExpanded ? 'Collapse' : 'Expand'}
            >
              <i className={`fas ${isExpanded ? 'fa-minus' : 'fa-plus'}`}></i>
            </button>
          )}

          {/* Category name and count */}
          <div 
            className="category-info"
            onClick={() => handleCategoryClick(category)}
            style={{ cursor: 'pointer' }}
          >
            <span className="category-name">{category.name}</span>
            {showProductCounts && (
              <span className="category-count">({category.product_count || 0})</span>
            )}
            {isActive && <span className="current-indicator ms-2"><i className="fas fa-arrow-right"></i></span>}
          </div>
        </div>

        {/* Children */}
        {shouldShowChildren && (
          <ul className="category-children">
            {category.children.map(child => {
              const childIsActive = currentCategory && child.id === currentCategory.id
              const childIsInPath = categoryHierarchy.parentChain.some(p => p.id === child.id)
              return renderCategoryItem(child, childIsActive, childIsInPath, showIndent)
            })}
          </ul>
        )}
      </li>
    )
  }, [expandedCategories, handleToggleExpand, handleCategoryClick, showProductCounts, currentCategory, categoryHierarchy.parentChain])

  // Render breadcrumb-style parent chain
  const renderParentChain = useCallback(() => {
    if (categoryHierarchy.parentChain.length === 0) return null

    return (
      <div className="category-parent-chain mb-3">
        <h6 className="text-muted mb-2">Parent Categories:</h6>
        <nav aria-label="Category breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="/shop" className="text-decoration-none">All Categories</a>
            </li>
            {categoryHierarchy.parentChain.map((parent, index) => (
              <li key={parent.id} className="breadcrumb-item">
                <a 
                  href={`/category/${parent.slug}`}
                  className="text-decoration-none"
                  onClick={(e) => {
                    e.preventDefault()
                    handleCategoryClick(parent)
                  }}
                >
                  {parent.name}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </div>
    )
  }, [categoryHierarchy.parentChain, handleCategoryClick])

  // Render current category section
  const renderCurrentCategory = useCallback(() => {
    if (!categoryHierarchy.currentCategory) return null

    return (
      <div className="current-category mb-3">
        <h6 className="text-muted mb-2">Current Category:</h6>
        <div className="current-category-item p-2 bg-light rounded">
          <strong>{categoryHierarchy.currentCategory.name}</strong>
          {showProductCounts && (
            <span className="category-count ms-2">
              ({categoryHierarchy.currentCategory.product_count || 0} products)
            </span>
          )}
        </div>
      </div>
    )
  }, [categoryHierarchy.currentCategory, showProductCounts])

  // Render children section
  const renderChildren = useCallback(() => {
    if (categoryHierarchy.children.length === 0) return null

    const title = categoryHierarchy.currentCategory 
      ? 'Subcategories:' 
      : 'Categories:'

    return (
      <div className="category-children-section">
        <h6 className="text-muted mb-2">{title}</h6>
        <ul className="category-list">
          {categoryHierarchy.children.map(child => {
            const childIsActive = currentCategory && child.id === currentCategory.id
            const childIsInPath = categoryHierarchy.parentChain.some(p => p.id === child.id)
            return renderCategoryItem(child, childIsActive, childIsInPath, !showAsFilter)
          })}
        </ul>
      </div>
    )
  }, [categoryHierarchy.children, categoryHierarchy.currentCategory, categoryHierarchy.parentChain, renderCategoryItem, showAsFilter, currentCategory])

  // Render siblings section
  const renderSiblings = useCallback(() => {
    if (categoryHierarchy.siblings.length === 0) return null

    return (
      <div className="category-siblings-section mt-3">
        <h6 className="text-muted mb-2">Related Categories:</h6>
        <ul className="category-list">
          {categoryHierarchy.siblings.map(sibling => {
            const siblingIsActive = currentCategory && sibling.id === currentCategory.id
            const siblingIsInPath = categoryHierarchy.parentChain.some(p => p.id === sibling.id)
            return renderCategoryItem(sibling, siblingIsActive, siblingIsInPath, !showAsFilter)
          })}
        </ul>
      </div>
    )
  }, [categoryHierarchy.siblings, categoryHierarchy.parentChain, renderCategoryItem, showAsFilter, currentCategory])

  if (loading) {
    return (
      <div className="category-hierarchy-loading">
        <div className="text-center py-3">
          <div className="spinner-border spinner-border-sm" role="status">
            <span className="sr-only">Loading categories...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="category-hierarchy">
      {renderParentChain()}
      {renderCurrentCategory()}
      {renderChildren()}
      {renderSiblings()}
    </div>
  )
})

export default CategoryHierarchy
