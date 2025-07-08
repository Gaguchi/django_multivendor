/**
 * Frontend Hierarchical Categories - Verification Test
 * 
 * This script tests the hierarchical categories implementation
 */

console.log('🧪 Testing Frontend Hierarchical Categories...')

// Test 1: Check if categories API is working
fetch('https://api.bazro.ge/api/categories/')
  .then(response => response.json())
  .then(data => {
    console.log('✅ Categories API working:', {
      totalCategories: data.count,
      firstCategory: data.results[0]?.name,
      hasHierarchy: data.results.some(cat => cat.parent_category || cat.subcategories?.length > 0)
    })
  })
  .catch(error => console.log('❌ Categories API error:', error))

// Test 2: Check if HierarchicalCategoriesFilter component exists
setTimeout(() => {
  const filterElement = document.querySelector('.widget-categories.hierarchical')
  if (filterElement) {
    console.log('✅ HierarchicalCategoriesFilter component found')
    
    // Check for navigation elements
    const breadcrumb = document.querySelector('.category-breadcrumb')
    const backBtn = document.querySelector('.category-back-btn')
    const categories = document.querySelectorAll('.category-row')
    
    console.log('📊 Filter Elements Found:', {
      hasBreadcrumb: !!breadcrumb,
      hasBackButton: !!backBtn,
      categoryCount: categories.length
    })
  } else {
    console.log('❌ HierarchicalCategoriesFilter component not found')
  }
}, 2000)

// Test 3: Check if category pages are accessible
const testCategoryPages = ['books', 'jewelry', 'electronics']
testCategoryPages.forEach(slug => {
  fetch(`https://api.bazro.ge/api/categories/${slug}/`)
    .then(response => {
      if (response.ok) {
        console.log(`✅ Category page accessible: /category/${slug}`)
      } else {
        console.log(`❌ Category page not found: /category/${slug}`)
      }
    })
    .catch(error => console.log(`❌ Error accessing /category/${slug}:`, error))
})

console.log('🎯 Verification script loaded. Check console for results.')
