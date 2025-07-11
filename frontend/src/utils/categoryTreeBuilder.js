/**
 * Utility for building hierarchical category trees with smart filtering
 * Only displays categories if they or any descendants have products
 */

/**
 * Build a hierarchical category tree from API nested structure
 * @param {Array} categories - Array of categories from API
 * @param {Object} options - Options for tree building
 * @returns {Object} - Tree structure with filtered categories
 */
export const buildCategoryTree = (categories = [], options = {}) => {
  const { 
    debug = false,
    currentCategory = null,
    showEmptyCategories = false 
  } = options

  if (debug && categories.length > 0) {
    console.log('🌳 Building category tree from API nested structure:', {
      totalCategories: categories.length,
      sampleCategories: categories.slice(0, 2).map(c => ({ 
        id: c.id, 
        name: c.name, 
        product_count: c.product_count
      })),
      currentCategory: currentCategory ? {
        id: currentCategory.id,
        name: currentCategory.name,
        slug: currentCategory.slug
      } : null,
      timestamp: new Date().toISOString()
    })
  }

  if (categories.length === 0) {
    return { 
      map: new Map(), 
      rootCategories: [],
      parentChain: [],
      currentCategory: null,
      children: [],
      siblings: []
    }
  }

  // Convert API nested structure to our format recursively
  const convertCategory = (category, level = 0) => {
    // First convert all children
    const convertedChildren = (category.subcategories || []).map(subcategory => 
      convertCategory(subcategory, level + 1)
    )
    
    // Filter children to only include those with products in their tree (unless showing empty)
    const filteredChildren = showEmptyCategories 
      ? convertedChildren 
      : convertedChildren.filter(child => child.hasProductsInTree)
    
    // Check if this category or any of its descendants have products
    const hasDirectProducts = (category.product_count || 0) > 0
    const hasProductsInDescendants = filteredChildren.length > 0
    const hasProductsInTree = hasDirectProducts || hasProductsInDescendants
    
    const converted = {
      ...category,
      children: filteredChildren,
      hasProductsInTree,
      level: level
    }
    
    if (debug && level === 0) {
      console.log(`🔄 CONVERTING ROOT: "${category.name}" (${category.id}), hasProductsInTree: ${hasProductsInTree}`)
    }
    
    return converted
  }

  // Find root categories (those without parent_category or whose parent is not in the current dataset)
  const allCategoryIds = new Set(categories.map(c => c.id))
  const allRootCategories = categories
    .filter(cat => {
      // No parent category (true root)
      if (!cat.parent_category) return true
      // Parent category doesn't exist in our current dataset (treat as root)
      if (!allCategoryIds.has(cat.parent_category)) return true
      return false
    })
    .map(cat => convertCategory(cat, 0))
  
  // Filter root categories to only include those with products in their tree (unless showing empty)
  const rootCategories = showEmptyCategories 
    ? allRootCategories 
    : allRootCategories.filter(cat => cat.hasProductsInTree)
  
  if (debug && rootCategories.length > 0) {
    console.log('🚮 FILTERING ROOT CATEGORIES:', {
      allRootsBeforeFilter: allRootCategories.length,
      rootsWithProducts: rootCategories.length,
      keptRoots: rootCategories.slice(0, 3).map(cat => ({
        name: cat.name,
        id: cat.id,
        productCount: cat.product_count || 0
      }))
    })
  }

  // Create map for quick lookup
  const map = new Map()
  const addToMap = (category) => {
    map.set(category.id, category)
    category.children.forEach(child => addToMap(child))
  }
  rootCategories.forEach(cat => addToMap(cat))

  // If we have a current category, build its context
  if (currentCategory) {
    // Build parent chain from current category up to root
    const parentChain = []
    let currentCat = currentCategory
    
    while (currentCat && currentCat.parent_category) {
      const parentId = currentCat.parent_category
      const parentFromApi = categories.find(c => c.id === parentId)
      if (parentFromApi) {
        const convertedParent = convertCategory(parentFromApi, 0)
        parentChain.unshift(convertedParent)
        currentCat = parentFromApi
      } else {
        break
      }
    }

    // Get the current category's children (non-empty ones)
    const currentConverted = convertCategory(currentCategory, 0)
    const children = currentConverted.children || []

    // Get siblings (other children of the same parent)
    let siblings = []
    if (currentCategory.parent_category) {
      const parent = categories.find(c => c.id === currentCategory.parent_category)
      if (parent) {
        const convertedParent = convertCategory(parent, 0)
        siblings = convertedParent.children.filter(child => 
          child.id !== currentCategory.id && child.hasProductsInTree
        )
      }
    }

    if (debug) {
      console.log('📍 CategoryTree Context:', {
        parentChain: parentChain.map(p => ({ id: p.id, name: p.name })),
        currentCategory: { id: currentCategory.id, name: currentCategory.name },
        children: children.map(c => ({ id: c.id, name: c.name, hasProductsInTree: c.hasProductsInTree })),
        siblings: siblings.map(s => ({ id: s.id, name: s.name }))
      })
    }

    return {
      map,
      rootCategories,
      parentChain,
      currentCategory: currentConverted,
      children,
      siblings
    }
  }

  return {
    map,
    rootCategories,
    parentChain: [],
    currentCategory: null,
    children: rootCategories,
    siblings: []
  }
}

/**
 * Find a category by ID in the tree structure
 * @param {Map} categoryMap - Map of categories
 * @param {number} categoryId - ID to search for
 * @returns {Object|null} - Found category or null
 */
export const findCategoryById = (categoryMap, categoryId) => {
  return categoryMap.get(categoryId) || null
}

/**
 * Get the path from root to a specific category
 * @param {Array} categories - All categories from API
 * @param {Object} targetCategory - Category to find path to
 * @returns {Array} - Array of categories from root to target
 */
export const getCategoryPath = (categories, targetCategory) => {
  if (!targetCategory) return []
  
  const path = []
  let current = targetCategory
  
  while (current) {
    path.unshift(current)
    if (current.parent_category) {
      current = categories.find(c => c.id === current.parent_category)
    } else {
      current = null
    }
  }
  
  return path
}

/**
 * Check if a category has products in its tree (itself or descendants)
 * @param {Object} category - Category to check
 * @returns {boolean} - True if category or any descendant has products
 */
export const hasProductsInTree = (category) => {
  if (!category) return false
  
  // Check direct products
  if ((category.product_count || 0) > 0) return true
  
  // Check descendants recursively
  if (category.subcategories && category.subcategories.length > 0) {
    return category.subcategories.some(child => hasProductsInTree(child))
  }
  
  return false
}
