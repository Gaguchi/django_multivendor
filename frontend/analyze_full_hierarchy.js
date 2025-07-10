// Full API analysis to understand the category hierarchy
console.log('🔍 Full API Hierarchy Analysis...')

async function analyzeFullAPIHierarchy() {
  try {
    // Fetch all pages of categories
    let allCategories = []
    let page = 1
    let hasMore = true

    while (hasMore && page <= 20) { // Safety limit
      console.log(`📄 Fetching page ${page}...`)
      const response = await fetch(`https://api.bazro.ge/api/categories/?page=${page}`)
      const data = await response.json()
      
      allCategories = allCategories.concat(data.results || [])
      hasMore = !!data.next
      page++
      
      console.log(`   Page ${page-1}: ${data.results?.length || 0} categories`)
    }

    console.log(`\n📊 Full API Data Analysis:`, {
      totalCategories: allCategories.length,
      categoriesWithNullParent: allCategories.filter(c => !c.parent_category).length,
      categoriesWithSubcategories: allCategories.filter(c => c.subcategories?.length > 0).length,
      allParentIds: [...new Set(allCategories.map(c => c.parent_category).filter(Boolean))],
      allCategoryIds: allCategories.map(c => c.id).slice(0, 10)
    })

    // Build the complete tree
    const convertCategory = (category, level = 0) => {
      return {
        ...category,
        children: (category.subcategories || []).map(sub => convertCategory(sub, level + 1)),
        level
      }
    }

    // Find true root categories
    const allCategoryIds = new Set(allCategories.map(c => c.id))
    const trueRoots = allCategories.filter(cat => !cat.parent_category)
    const orphanRoots = allCategories.filter(cat => 
      cat.parent_category && !allCategoryIds.has(cat.parent_category)
    )

    console.log(`\n🌳 Root Category Analysis:`, {
      trueRootsCount: trueRoots.length,
      trueRootNames: trueRoots.map(c => c.name),
      orphanRootsCount: orphanRoots.length,
      orphanRootNames: orphanRoots.slice(0, 5).map(c => ({ name: c.name, missingParent: c.parent_category }))
    })

    // Convert true roots to tree format
    const rootCategories = trueRoots.map(cat => convertCategory(cat, 0))

    console.log(`\n🎯 Complete Tree Structure:`, {
      rootCount: rootCategories.length,
      detailedStructure: rootCategories.slice(0, 3).map(root => ({
        root: { id: root.id, name: root.name, level: root.level },
        childCount: root.children.length,
        children: root.children.slice(0, 5).map(child => ({
          id: child.id,
          name: child.name,
          level: child.level,
          grandchildCount: child.children.length,
          grandchildren: child.children.slice(0, 3).map(gc => ({
            id: gc.id,
            name: gc.name,
            level: gc.level
          }))
        }))
      }))
    })

    // Check for specific categories we know should have children
    const booksCategory = allCategories.find(c => c.name === 'Books')
    if (booksCategory) {
      console.log(`\n📚 Books Category Analysis:`, {
        id: booksCategory.id,
        name: booksCategory.name,
        parent_category: booksCategory.parent_category,
        subcategories: booksCategory.subcategories?.map(sub => ({
          id: sub.id,
          name: sub.name,
          parent_category: sub.parent_category
        })) || []
      })
    }

  } catch (error) {
    console.error('❌ Analysis Error:', error)
  }
}

analyzeFullAPIHierarchy()
