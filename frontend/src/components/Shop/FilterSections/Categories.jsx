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

  // DEBUG: Log categories prop at component level
  console.log('🎯 Categories Component Render:', {
    categoriesLength: categories.length,
    loading,
    hasCategories: categories.length > 0,
    firstFewCategories: categories.slice(0, 3).map(c => ({
      id: c.id,
      name: c.name,
      hasSubcategories: c.subcategories?.length > 0,
      subcategoriesCount: c.subcategories?.length || 0
    })),
    timestamp: new Date().toISOString(),
    // Force log the first category structure
    firstCategoryStructure: categories[0] ? {
      id: categories[0].id,
      name: categories[0].name,
      parent_category: categories[0].parent_category,
      subcategories: categories[0].subcategories?.slice(0, 2) || []
    } : null
  })

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

  // Build category hierarchy using API's nested structure
  const categoryTree = useMemo(() => {
    console.log('🌳 Building category tree from API nested structure:', {
      totalCategories: categories.length,
      sampleCategories: categories.slice(0, 3).map(c => ({ 
        id: c.id, 
        name: c.name, 
        parent_category: c.parent_category,
        product_count: c.product_count,
        subcategoriesCount: c.subcategories?.length || 0,
        hasSubcategories: (c.subcategories?.length || 0) > 0
      })),
      // Check structure of API response
      apiStructureCheck: {
        hasSubcategoriesField: categories.some(c => c.subcategories !== undefined),
        categoriesWithSubcategories: categories.filter(c => c.subcategories && c.subcategories.length > 0).slice(0, 5).map(c => ({
          id: c.id,
          name: c.name,
          subcategoriesCount: c.subcategories.length,
          subcategoryNames: c.subcategories.slice(0, 3).map(sub => sub.name)
        })),
        categoriesWithNullParent: categories.filter(c => !c.parent_category).length,
        totalProductCount: categories.reduce((sum, c) => sum + (c.product_count || 0), 0)
      }
    })

    if (categories.length === 0) {
      return { map: new Map(), rootCategories: [] }
    }

    // Convert API nested structure to our format recursively
    const convertCategory = (category, level = 0) => {
      const converted = {
        ...category,
        children: (category.subcategories || []).map(subcategory => convertCategory(subcategory, level + 1)),
        hasProductsInTree: true, // Show all categories for now since product counts are 0
        level: level
      }
      
      console.log(`🔄 CONVERTING: "${category.name}" (${category.id}) at level ${level}, children: ${converted.children.length}`)
      
      return converted
    }

    // Find root categories (those without parent_category or whose parent is not in the current dataset)
    const allCategoryIds = new Set(categories.map(c => c.id))
    const rootCategories = categories
      .filter(cat => {
        // No parent category (true root)
        if (!cat.parent_category) return true
        // Parent category doesn't exist in our current dataset (treat as root)
        if (!allCategoryIds.has(cat.parent_category)) return true
        return false
      })
      .map(cat => convertCategory(cat, 0))
    
    console.log('🔍 ROOT CATEGORIES DETECTED:', {
      totalRoots: rootCategories.length,
      rootNames: rootCategories.map(c => c.name),
      rootsWithChildren: rootCategories.filter(c => c.children.length > 0).map(c => ({
        name: c.name,
        childrenCount: c.children.length,
        childrenNames: c.children.slice(0, 3).map(child => child.name)
      }))
    })

    // Create map for quick lookup
    const map = new Map()
    const addToMap = (category) => {
      map.set(category.id, category)
      category.children.forEach(addToMap)
    }
    rootCategories.forEach(addToMap)

    // Sort root categories and limit for better UX
    const visibleRootCategories = rootCategories
      .sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
      .slice(0, 10) // Show up to 10 root categories    
    console.log('🌱 Category tree final result:', {
      totalInputCategories: categories.length,
      visibleRootCount: visibleRootCategories.length,
      rootNames: visibleRootCategories.map(c => c.name),
      treeStructure: visibleRootCategories.slice(0, 3).map(root => ({
        root: { id: root.id, name: root.name, level: root.level },
        children: root.children?.slice(0, 5).map(child => ({
          id: child.id,
          name: child.name,
          level: child.level,
          grandchildren: child.children?.slice(0, 3).map(gc => ({ 
            id: gc.id, 
            name: gc.name, 
            level: gc.level 
          })) || []
        })) || []
      }))
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
    console.log(`🔄 TOGGLE EXPAND for category ${categoryId}`)
    setExpandedCategories(prev => {
      const newSet = new Set(prev)
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId)
        console.log(`➖ COLLAPSED category ${categoryId}`)
      } else {
        newSet.add(categoryId)
        console.log(`➕ EXPANDED category ${categoryId}`)
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

    // DEBUG: Log each node being rendered (only first few to reduce noise)
    if (level === 0 || category.children?.length > 0) {
      console.log(`🎨 RENDERING NODE:`, {
        id: category.id,
        name: category.name,
        level,
        hasChildren,
        childrenCount: category.children?.length || 0,
        isExpanded
      })
    }

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
