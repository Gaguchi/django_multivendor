import { memo, useCallback } from 'react'

const CategoriesFilter = memo(function CategoriesFilter({
  categories = [],
  selectedCategories = [],
  onToggleCategory,
  loading = false,
  collapsed = false,
  onToggleCollapse
}) {
  const handleClearCategories = useCallback((e) => {
    e.preventDefault()
    selectedCategories.forEach(categoryId => {
      onToggleCategory(categoryId)
    })
  }, [selectedCategories, onToggleCategory])

  console.log('🏷️ CategoriesFilter render:', {
    categoriesCount: categories.length,
    selectedCount: selectedCategories.length,
    timestamp: new Date().toISOString()
  })

  return (
    <div className="widget">
      <h3 className="widget-title">
        <button
          className="widget-title collapse-toggle"
          onClick={onToggleCollapse}
          type="button"
        >
          Categories
          <i className={`fas fa-chevron-${collapsed ? 'down' : 'up'} ms-2`}></i>
        </button>
        {selectedCategories.length > 0 && (
          <button
            type="button"
            className="clear-section"
            onClick={handleClearCategories}
          >
            Clear
          </button>
        )}
      </h3>
      <div className={`widget-collapse ${collapsed ? 'collapsed' : 'expanded'}`}>
        <div className="widget-body">
          {loading ? (
            <div className="category-skeleton">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="skeleton-line mb-2"></div>
              ))}
            </div>
          ) : (
            <ul className="cat-list">
              {categories.length > 0 ? (
                categories.map((category) => (
                  <li key={category.id}>
                    <label className="category-item">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(String(category.id))}
                        onChange={() => onToggleCategory(String(category.id))}
                      />
                      <span className="category-name">{category.name}</span>
                      {category.product_count && (
                        <span className="products-count">({category.product_count})</span>
                      )}
                    </label>
                  </li>
                ))
              ) : (
                <li>
                  <label className="category-item">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes('electronics')}
                      onChange={() => onToggleCategory('electronics')}
                    />
                    <span className="category-name">Electronics</span>
                    <span className="products-count">(15)</span>
                  </label>
                </li>
              )}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
})

export default CategoriesFilter
