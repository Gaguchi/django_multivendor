import React, { memo, useCallback, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
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

  // Track expanded categories and selected category for tree navigation
  const [expandedCategories, setExpandedCategories] = useState(new Set())
  const [selectedCategory, setSelectedCategory] = useState(null)

  // Build category hierarchy with smart filtering: only show categories that have products in their tree
  const categoryTree = useMemo(() => {
    console.log('🌳 Building category tree:', {
      totalCategories: categories.length,
      sampleCategories: categories.slice(0, 5).map(c => ({ 
        id: c.id, 
        name: c.name, 
        parent_category: c.parent_category,
        product_count: c.product_count
      })),
      allParentValues: [...new Set(categories.map(c => c.parent_category))].slice(0, 10),
      // Check if any categories have null parent
      categoriesWithNullParent: categories.filter(c => !c.parent_category).length,
      // Check parent IDs that don't exist in our dataset
      orphanedCategories: categories.filter(c => 
        c.parent_category && !categories.find(parent => parent.id === c.parent_category)
      ).slice(0, 5).map(c => ({ id: c.id, name: c.name, missingParent: c.parent_category }))
    })

    if (categories.length === 0) {
      return { map: new Map(), rootCategories: [] }
    }

    // Step 1: Create map of all categories
    const map = new Map()
    categories.forEach(category => {
      map.set(category.id, {
        ...category,
        children: [],
        hasProductsInTree: false // Will be calculated
      })
    })
    
    // Step 2: Build parent-child relationships
    categories.forEach(category => {
      if (category.parent_category) {
        const parent = map.get(category.parent_category)
        if (parent) {
          parent.children.push(map.get(category.id))
        }
      }
    })
    
    // Step 3: Calculate which categories have products in their tree (recursive)
    const calculateHasProductsInTree = (category) => {
      // Has direct products
      if (category.product_count > 0) {
        category.hasProductsInTree = true
        return true
      }
      
      // Check children recursively
      let hasProductsInChildren = false
      for (const child of category.children) {
        if (calculateHasProductsInTree(child)) {
          hasProductsInChildren = true
        }
      }
      
      category.hasProductsInTree = hasProductsInChildren
      return hasProductsInChildren
    }
    
    // Step 4: Find root categories - handle case where parent categories are missing from API response
    const existingCategoryIds = new Set(categories.map(c => c.id))
    
    const rootCategories = categories
      .filter(cat => {
        // No parent category (true root)
        if (!cat.parent_category) return true
        // Parent category doesn't exist in our dataset (treat as root)
        if (!existingCategoryIds.has(cat.parent_category)) return true
        return false
      })
      .map(cat => map.get(cat.id))
      .filter(Boolean)
    
    console.log('🔍 ROOT DETECTION DEBUG:', {
      totalCategories: categories.length,
      existingIds: Array.from(existingCategoryIds).slice(0, 10),
      referencedParentIds: [...new Set(categories.map(c => c.parent_category).filter(Boolean))].slice(0, 10),
      missingParentIds: [...new Set(categories.map(c => c.parent_category).filter(Boolean))]
        .filter(parentId => !existingCategoryIds.has(parentId)).slice(0, 10),
      detectedRoots: rootCategories.map(c => ({ id: c.id, name: c.name, parent: c.parent_category }))
    })
    
    // Step 5: Calculate hasProductsInTree for all categories (improved algorithm)
    // Apply to all root categories (this will cascade down to children)
    rootCategories.forEach(root => calculateHasProductsInTree(root))
    
    // Step 6: Filter to only show root categories that have products in their tree
    let visibleRootCategories = rootCategories
      .filter(cat => cat.hasProductsInTree)
      .sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
      .slice(0, 15)
    
    // FALLBACK: If no categories have products, show the first few categories anyway
    // This might happen if product counts are not properly calculated or all are zero
    if (visibleRootCategories.length === 0 && rootCategories.length > 0) {
      console.log('⚠️ FALLBACK: No categories with products found, showing first few categories anyway')
      visibleRootCategories = rootCategories
        .sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
        .slice(0, 8) // Show fewer in fallback mode
    }
    
    console.log('🌱 Category tree built:', {
      totalCount: categories.length,
      rootCount: visibleRootCategories.length,
      rootNames: visibleRootCategories.map(c => c.name),
      firstFewWithCounts: visibleRootCategories.slice(0, 5).map(c => ({ 
        name: c.name, 
        count: c.product_count,
        hasChildren: c.children?.length > 0,
        hasProductsInTree: c.hasProductsInTree
      })),
      // Debug info
      allRootCandidates: rootCategories.map(c => ({ 
        id: c.id, 
        name: c.name, 
        parent: c.parent_category,
        hasProductsInTree: c.hasProductsInTree,
        productCount: c.product_count
      })),
      filteredOutRoots: rootCategories.filter(cat => !cat.hasProductsInTree).map(c => c.name),
      // NEW: Check if ANY category has products
      categoriesWithProducts: categories.filter(c => c.product_count > 0).map(c => ({ 
        id: c.id, 
        name: c.name, 
        count: c.product_count 
      })),
      totalProductsInAllCategories: categories.reduce((sum, c) => sum + (c.product_count || 0), 0)
    })
    
    return { map, rootCategories: visibleRootCategories }
  }, [categories])

  // Extract data from tree structure
  const { map: categoryMap, rootCategories } = categoryTree

  // Debug logging
  console.log('🌳 Categories render:', {
    categoriesCount: categories.length,
    selectedCount: selectedCategories.length,
    rootCategoriesCount: rootCategories.length,
    expandedCount: expandedCategories.size,
    categories: categories.slice(0, 3).map(c => ({ id: c.id, name: c.name, parent: c.parent_category })),
    timestamp: new Date().toISOString()
  })

  // DETAILED DEBUG: What's in rootCategories?
  console.log('🔍 DETAILED Categories Debug:', {
    loading,
    categoriesLength: categories.length,
    rootCategoriesLength: rootCategories.length,
    rootCategoriesArray: rootCategories,
    categoriesData: categories.slice(0, 2),
    conditionCheck: {
      isLoading: loading,
      hasRootCategories: rootCategories.length > 0,
      willShowTree: !loading && rootCategories.length > 0
    }
  })

  // DETAILED RENDER LOGIC DEBUG
  console.log('🎯 RENDER LOGIC DEBUG:', {
    loading: loading,
    rootCategoriesLength: rootCategories.length,
    rootCategoriesArray: rootCategories.slice(0, 3).map(cat => ({
      id: cat.id,
      name: cat.name,
      product_count: cat.product_count,
      hasChildren: cat.children?.length > 0
    })),
    willShowLoading: loading,
    willShowTree: !loading && rootCategories.length > 0,
    willShowNoCategories: !loading && rootCategories.length === 0
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
              .filter(child => child.hasProductsInTree) // Only show children that have products in their tree
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
            {(() => {
              console.log('🚨 FINAL RENDER DECISION:', {
                loading,
                rootCategoriesLength: rootCategories.length,
                categoriesLength: categories.length,
                hasAnyProducts: categories.some(c => c.product_count > 0),
                decision: loading ? 'SHOW_LOADING' : 
                         rootCategories.length > 0 ? 'SHOW_TREE' : 
                         categories.length === 0 ? 'NO_CATEGORIES_AVAILABLE' : 'NO_CATEGORIES_WITH_PRODUCTS',
                firstFewCategories: categories.slice(0, 3).map(c => ({ 
                  id: c.id, 
                  name: c.name, 
                  hasProducts: c.product_count > 0,
                  count: c.product_count 
                }))
              })
              return null
            })()}
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
