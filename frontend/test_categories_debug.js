// Test script to debug categories API response
console.log('🧪 Testing Categories API with Debug Logging');

// Test with localhost (backend running on 8000)
fetch('http://localhost:8000/api/categories/')
  .then(response => {
    console.log('✅ Local API Response Status:', response.status);
    return response.json();
  })
  .then(data => {
    console.log('📊 Local API Data Analysis:', {
      totalCount: data.count,
      pageResults: data.results?.length || 0,
      hasNext: !!data.next,
      firstCategory: data.results?.[0] ? {
        id: data.results[0].id,
        name: data.results[0].name,
        parent_category: data.results[0].parent_category,
        product_count: data.results[0].product_count,
        subcategories: data.results[0].subcategories?.length || 0
      } : 'No results'
    });
    
    // Check for categories with subcategories
    const categoriesWithChildren = data.results?.filter(cat => cat.subcategories?.length > 0) || [];
    console.log('🌳 Categories with subcategories:', categoriesWithChildren.map(cat => ({
      name: cat.name,
      children: cat.subcategories.map(sub => sub.name)
    })));
  })
  .catch(error => {
    console.error('❌ Local API Error:', error);
  });

// Test with production API
fetch('https://api.bazro.ge/api/categories/')
  .then(response => {
    console.log('✅ Production API Response Status:', response.status);
    return response.json();
  })
  .then(data => {
    console.log('📊 Production API Data Analysis:', {
      totalCount: data.count,
      pageResults: data.results?.length || 0,
      hasNext: !!data.next,
      firstCategory: data.results?.[0] ? {
        id: data.results[0].id,
        name: data.results[0].name,
        parent_category: data.results[0].parent_category,
        product_count: data.results[0].product_count,
        subcategories: data.results[0].subcategories?.length || 0
      } : 'No results'
    });
    
    // Check for categories with subcategories
    const categoriesWithChildren = data.results?.filter(cat => cat.subcategories?.length > 0) || [];
    console.log('🌳 Categories with subcategories:', categoriesWithChildren.map(cat => ({
      name: cat.name,
      children: cat.subcategories.map(sub => sub.name)
    })));
  })
  .catch(error => {
    console.error('❌ Production API Error:', error);
  });
