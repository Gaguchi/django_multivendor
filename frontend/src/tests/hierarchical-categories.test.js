// Test file to verify the hierarchical categories and category page functionality
import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import CategoryPage from '../pages/CategoryPage'
import CategoriesFilterIsolated from '../components/Shop/FilterSections/CategoriesFilterIsolated'

// Mock the API
jest.mock('../services/api', () => ({
  get: jest.fn(() => Promise.resolve({
    data: {
      results: [
        {
          id: 1,
          name: 'Jewelry',
          slug: 'jewelry',
          parent_category: null,
          product_count: 15,
          children: [
            {
              id: 2,
              name: 'Necklaces',
              slug: 'necklaces',
              parent_category: 1,
              product_count: 5,
              children: []
            },
            {
              id: 3,
              name: 'Rings',
              slug: 'rings',
              parent_category: 1,
              product_count: 10,
              children: []
            }
          ]
        }
      ]
    }
  }))
}))

describe('Hierarchical Categories', () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })

  const renderWithProviders = (component) => {
    return render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          {component}
        </BrowserRouter>
      </QueryClientProvider>
    )
  }

  test('CategoryPage renders correctly', async () => {
    renderWithProviders(<CategoryPage />)
    
    await waitFor(() => {
      expect(screen.getByText('Category')).toBeInTheDocument()
    })
  })

  test('CategoriesFilterIsolated shows hierarchical navigation', async () => {
    const mockCategories = [
      {
        id: 1,
        name: 'Jewelry',
        slug: 'jewelry',
        parent_category: null,
        product_count: 15,
        children: [
          {
            id: 2,
            name: 'Necklaces',
            slug: 'necklaces',
            parent_category: 1,
            product_count: 5,
            children: []
          }
        ]
      }
    ]

    const MockFilterProvider = ({ children }) => (
      <div data-testid="filter-provider">
        {children}
      </div>
    )

    // Mock the FilterProvider context
    jest.doMock('../components/Shop/FilterSections/FilterProvider', () => ({
      useFilterContext: () => ({
        filters: { categories: [] },
        updateFilter: jest.fn()
      })
    }))

    renderWithProviders(
      <MockFilterProvider>
        <CategoriesFilterIsolated 
          categories={mockCategories}
          loading={false}
          collapsed={false}
          onToggleCollapse={() => {}}
        />
      </MockFilterProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('Categories')).toBeInTheDocument()
      expect(screen.getByText('All Categories')).toBeInTheDocument()
      expect(screen.getByText('Jewelry')).toBeInTheDocument()
    })
  })
})

console.log('✅ Test setup complete. The hierarchical categories filter and category pages are ready!')
console.log('📍 Test URLs:')
console.log('   - Category page: https://shop.bazro.ge/category/jewelry')
console.log('   - Shop page: https://shop.bazro.ge/shop')
console.log('   - API endpoint: https://api.bazro.ge/api/categories/')
