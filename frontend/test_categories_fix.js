/**
 * Test script to verify hierarchical categories filter is working
 * Run this in browser console on shop.bazro.ge
 */

// Test 1: Check if categories are loaded
console.log('🧪 Testing Hierarchical Categories Filter');

// Check if categories data is available
const categoriesData = window.localStorage.getItem('categories') || 'Not cached';
console.log('📦 Categories in localStorage:', categoriesData !== 'Not cached' ? 'Available' : 'Not found');

// Test 2: Check DOM elements
const categoryFilter = document.querySelector('.widget-categories.hierarchical');
console.log('🔍 Category filter element:', categoryFilter ? 'Found' : 'Not found');

if (categoryFilter) {
    const categoryItems = categoryFilter.querySelectorAll('.category-row');
    console.log('📋 Category items found:', categoryItems.length);
    
    const noCategoriesMsg = categoryFilter.querySelector('.no-categories');
    console.log('❌ "No categories" message:', noCategoriesMsg ? 'Visible' : 'Hidden');
    
    if (noCategoriesMsg) {
        console.log('📝 Message text:', noCategoriesMsg.textContent.trim());
    }
}

// Test 3: Check if API is being called
console.log('🌐 Testing API call...');
fetch('https://api.bazro.ge/api/categories/')
    .then(response => response.json())
    .then(data => {
        console.log('✅ API Response:', {
            status: 'Success',
            categoriesCount: data.results ? data.results.length : data.length,
            hasData: !!data,
            firstCategory: data.results ? data.results[0]?.name : data[0]?.name
        });
    })
    .catch(error => {
        console.error('❌ API Error:', error);
    });

console.log('🧪 Test completed. Check results above.');
