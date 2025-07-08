import React, { useState, useEffect, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import api from '../services/api'
import ProductGridSection from '../components/Shop/ProductGridSection'
import Sidebar from '../components/Shop/Sidebar'
import StickyBox from 'react-sticky-box'

const CategoryPage = () => {
  const { categorySlug } = useParams()
  const navigate = useNavigate()
  
  // State for filters and UI
  const [filterState, setFilterState] = useState({
    selectedCategories: [],
    selectedBrands: [],
    minPrice: 0,
    maxPrice: 1000
  })
  
  const [sortBy, setSortBy] = useState('menu_order')
  const [showCount, setShowCount] = useState(12)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Fetch category data
  const { data: categoryData, isLoading: categoryLoading, error: categoryError } = useQuery({
    queryKey: ['category', categorySlug],
    queryFn: async () => {
      const response = await api.get(`/api/categories/${categorySlug}/`)
      return response.data
    },
    enabled: !!categorySlug
  })

  // Fetch all categories for sidebar
  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await api.get('/api/categories/')
      return response.data.results || response.data
    }
  })

  // Fetch vendors for sidebar
  const { data: vendors = [], isLoading: vendorsLoading } = useQuery({
    queryKey: ['vendors'],
    queryFn: async () => {
      const response = await api.get('/api/vendors/')
      return response.data.results || response.data
    }
  })

  // Auto-select current category when data loads
  useEffect(() => {
    if (categoryData && categoryData.id) {
      setFilterState(prev => ({
        ...prev,
        selectedCategories: [categoryData.id]
      }))
    }
  }, [categoryData])

  // Build query parameters for products
  const queryOptions = useMemo(() => {
    const apiFilters = {}
    
    if (filterState.selectedCategories.length > 0) {
      apiFilters.category = filterState.selectedCategories.join(',')
    }
    if (filterState.selectedBrands.length > 0) {
      apiFilters.vendor = filterState.selectedBrands.join(',')
    }
    if (filterState.minPrice > 0) {
      apiFilters.price_min = filterState.minPrice
    }
    if (filterState.maxPrice < 1000) {
      apiFilters.price_max = filterState.maxPrice
    }

    return {
      filters: {
        ...apiFilters,
        ordering: sortBy,
        page_size: showCount
      }
    }
  }, [filterState, sortBy, showCount])

  // Fetch products with filters
  const { 
    data: productsData, 
    isLoading: productsLoading, 
    error: productsError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useQuery({
    queryKey: ['products', queryOptions],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await api.get('/api/vendors/products/', {
        params: {
          ...queryOptions.filters,
          page: pageParam
        }
      })
      return response.data
    },
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.next) {
        return pages.length + 1
      }
      return undefined
    }
  })

  // Extract products from paginated data
  const products = useMemo(() => {
    if (!productsData) return []
    return productsData.results || []
  }, [productsData])

  // Get price range for sidebar
  const priceRange = useMemo(() => {
    if (!products.length) return { min: 0, max: 1000 }
    
    const prices = products.map(p => parseFloat(p.price)).filter(p => !isNaN(p))
    return {
      min: Math.floor(Math.min(...prices, 0)),
      max: Math.ceil(Math.max(...prices, 1000))
    }
  }, [products])

  // Filter change handlers
  const handleCategoriesChange = (selectedCategories) => {
    setFilterState(prev => ({
      ...prev,
      selectedCategories
    }))
  }

  const handleBrandsChange = (selectedBrands) => {
    setFilterState(prev => ({
      ...prev,
      selectedBrands
    }))
  }

  const handlePriceChange = (minPrice, maxPrice) => {
    setFilterState(prev => ({
      ...prev,
      minPrice,
      maxPrice
    }))
  }

  const handleClearAllFilters = () => {
    setFilterState({
      selectedCategories: categoryData?.id ? [categoryData.id] : [],
      selectedBrands: [],
      minPrice: 0,
      maxPrice: 1000
    })
  }

  const handleSortChange = (newSort) => {
    setSortBy(newSort)
  }

  const handleShowCountChange = (newCount) => {
    setShowCount(newCount)
  }

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev)
  }

  const closeSidebar = () => {
    setSidebarOpen(false)
  }

  // Breadcrumb generation
  const breadcrumbs = useMemo(() => {
    if (!categoryData) return []
    
    const crumbs = []
    let current = categoryData
    
    // Build breadcrumbs from current category up to root
    while (current) {
      crumbs.unshift({
        name: current.name,
        slug: current.slug,
        id: current.id
      })
      
      // Find parent category
      if (current.parent_category) {
        current = categories.find(cat => cat.id === current.parent_category)
      } else {
        current = null
      }
    }
    
    return crumbs
  }, [categoryData, categories])

  // Sidebar props
  const sidebarProps = {
    categories: categories || [],
    brands: vendors || [],
    priceRange,
    selectedCategories: filterState.selectedCategories,
    selectedBrands: filterState.selectedBrands,
    minPrice: filterState.minPrice,
    maxPrice: filterState.maxPrice,
    onCategoriesChange: handleCategoriesChange,
    onBrandsChange: handleBrandsChange,
    onPriceChange: handlePriceChange,
    onClearAll: handleClearAllFilters,
    loading: categoriesLoading || vendorsLoading,
    isOpen: sidebarOpen,
    onClose: closeSidebar
  }

  // Product grid props
  const productGridProps = {
    products,
    isLoading: productsLoading,
    error: productsError,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    sortBy,
    showCount,
    onSortChange: handleSortChange,
    onShowCountChange: handleShowCountChange
  }

  if (categoryLoading) {
    return (
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="text-center py-5">
              <div className="spinner-border" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (categoryError) {
    return (
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="alert alert-danger" role="alert">
              <h4 className="alert-heading">Category not found</h4>
              <p>The category you're looking for doesn't exist or has been moved.</p>
              <button className="btn btn-primary" onClick={() => navigate('/shop')}>
                Go to Shop
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page-wrapper">
      <div className="page-header text-center">
        <div className="container">
          <h1 className="page-title">{categoryData?.name || 'Category'}</h1>
          {categoryData?.description && (
            <p className="page-subtitle">{categoryData.description}</p>
          )}
          
          {/* Breadcrumbs */}
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb justify-content-center">
              <li className="breadcrumb-item">
                <a href="/">Home</a>
              </li>
              <li className="breadcrumb-item">
                <a href="/shop">Shop</a>
              </li>
              {breadcrumbs.map((crumb, index) => (
                <li 
                  key={crumb.id}
                  className={`breadcrumb-item ${index === breadcrumbs.length - 1 ? 'active' : ''}`}
                >
                  {index === breadcrumbs.length - 1 ? (
                    crumb.name
                  ) : (
                    <a href={`/category/${crumb.slug}`}>{crumb.name}</a>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        </div>
      </div>

      <div className="page-content">
        <div className="container">
          
          {/* Mobile sidebar toggle */}
          <div className="d-lg-none mb-3">
            <button 
              className="btn btn-outline-primary w-100" 
              onClick={toggleSidebar}
            >
              <i className="icon-sliders"></i>
              Filters
            </button>
          </div>

          {/* Desktop Layout */}
          <div className="d-none d-lg-block">
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '280px 1fr', 
              gap: '30px',
              alignItems: 'start'
            }}>
              {/* Sidebar */}
              <div>
                <StickyBox offsetTop={20} offsetBottom={20}>
                  <Sidebar {...sidebarProps} />
                </StickyBox>
              </div>

              {/* Main Content */}
              <div style={{ minWidth: 0 }}>
                <ProductGridSection {...productGridProps} />
              </div>
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="d-lg-none">
            <div className="row">
              <div className="col-12">
                <Sidebar {...sidebarProps} />
              </div>
              <div className="col-12">
                <ProductGridSection {...productGridProps} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CategoryPage
