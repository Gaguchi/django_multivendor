import React, { useState, useEffect } from 'react'
import api from '../services/api'

function ProductsPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [productsPerPage] = useState(4)

  useEffect(() => {
    let isMounted = true

    const fetchProducts = async () => {
      try {
        const response = await api.get('/api/vendors/products', {
          headers: {
            'X-Master-Token': import.meta.env.VITE_MASTER_TOKEN
          }
        })

        if (isMounted && Array.isArray(response.data)) {
          setProducts(response.data)
        }
      } catch (error) {
        // Only log real errors, not cancellations
        if (!error.code || error.code !== 'ERR_CANCELED') {
          console.error('Error fetching products:', error)
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchProducts()

    return () => {
      isMounted = false
    }
  }, [])

  // Get current products
  const indexOfLastProduct = currentPage * productsPerPage
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct)

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  if (loading) return <div>Loading...</div>

  return (
    <div className="container">
      <h1>Products</h1>
      
      <div className="products-grid">
        {currentProducts.map(product => (
          <div key={product.id} className="product-card">
            <h3>{product.name}</h3>
            {product.thumbnail && (
              <img src={product.thumbnail} alt={product.name} />
            )}
            <p>${product.price}</p>
          </div>
        ))}
      </div>

      <div className="pagination">
        {Array.from({ length: Math.ceil(products.length / productsPerPage) }).map((_, index) => (
          <button
            key={index + 1}
            onClick={() => paginate(index + 1)}
            className={currentPage === index + 1 ? 'active' : ''}
          >
            {index + 1}
          </button>
        ))}
      </div>

      <style>{`
        .container {
          padding: 20px;
        }
        
        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 20px;
          margin: 20px 0;
        }
        
        .product-card {
          border: 1px solid #ddd;
          padding: 15px;
          border-radius: 8px;
          text-align: center;
        }
        
        .product-card img {
          max-width: 100%;
          height: auto;
        }
        
        .pagination {
          display: flex;
          justify-content: center;
          gap: 10px;
          margin-top: 20px;
        }
        
        .pagination button {
          padding: 8px 12px;
          border: 1px solid #ddd;
          background: white;
          cursor: pointer;
          border-radius: 4px;
        }
        
        .pagination button.active {
          background: #007bff;
          color: white;
          border-color: #007bff;
        }
      `}</style>
    </div>
  )
}
export default ProductsPage