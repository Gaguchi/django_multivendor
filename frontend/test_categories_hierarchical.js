// Test hierarchical categories API and logic
console.log('🧪 Testing Hierarchical Categories Logic...')

// Test with live API data
fetch('https://api.bazro.ge/api/categories/')
  .then(response => response.json())
  .then(data => {
    console.log('📊 API Response Analysis:', {
      totalCount: data.count,
      resultsCount: data.results?.length || 0,
      hasSubcategoriesField: data.results?.some(c => c.subcategories !== undefined),
      categoriesWithSubcategories: data.results?.filter(c => c.subcategories && c.subcategories.length > 0).slice(0, 3).map(c => ({
        id: c.id,
        name: c.name,
        subcategoriesCount: c.subcategories.length,
        subcategoryNames: c.subcategories.slice(0, 3).map(sub => sub.name)
      })) || [],
      categoriesWithNullParent: data.results?.filter(c => !c.parent_category).length || 0,
      sampleNestedStructure: data.results?.slice(0, 2).map(c => ({
        id: c.id,
        name: c.name,
        parent_category: c.parent_category,
        subcategories: c.subcategories?.map(sub => ({
          id: sub.id,
          name: sub.name,
          parent_category: sub.parent_category
        })) || []
      })) || []
    })

    // Test the tree building logic
    console.log('\n🌳 Testing Tree Building Logic...')
    const categories = data.results || []
    
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

    // Find root categories
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
      .slice(0, 5) // Show first 5 for testing

    console.log('🌱 Tree Building Results:', {
      totalInputCategories: categories.length,
      rootCategoriesCount: rootCategories.length,
      rootNames: rootCategories.map(c => c.name),
      treeStructure: rootCategories.slice(0, 3).map(root => ({
        root: { id: root.id, name: root.name, level: root.level },
        children: root.children?.slice(0, 3).map(child => ({
          id: child.id,
          name: child.name,
          level: child.level,
          grandchildren: child.children?.slice(0, 2).map(gc => ({ 
            id: gc.id, 
            name: gc.name, 
            level: gc.level 
          })) || []
        })) || []
      }))
    })
  })
  .catch(error => {
    console.error('❌ API Error:', error)
  })
