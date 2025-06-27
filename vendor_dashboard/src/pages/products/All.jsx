import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ConfirmationModal from '../../components/ConfirmationModal';
import * as api from '../../services/api';
import './All.css';

export default function All() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleteModal, setDeleteModal] = useState({
        isOpen: false,
        productId: null,
        productName: '',
        loading: false
    });

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const response = await api.getProductsApi();
                console.log("Products API response:", response);
                setProducts(response?.results || response || []);
            } catch (err) {
                console.error("Error fetching products:", err);
                setError(err.message || "Failed to fetch products");
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);    const handleDeleteProduct = (productId, productName) => {
        setDeleteModal({
            isOpen: true,
            productId,
            productName,
            loading: false
        });
    };

    const confirmDelete = async () => {
        setDeleteModal(prev => ({ ...prev, loading: true }));

        try {
            await api.deleteProductApi(deleteModal.productId);
            setProducts(prev => prev.filter(p => p.id !== deleteModal.productId));
            setDeleteModal({
                isOpen: false,
                productId: null,
                productName: '',
                loading: false
            });
            // You could add a toast notification here instead of alert
        } catch (err) {
            console.error("Error deleting product:", err);
            setDeleteModal(prev => ({ ...prev, loading: false }));
            // You could show an error modal here instead of alert
            alert("Failed to delete product: " + (err.message || "Unknown error"));
        }
    };

    const closeDeleteModal = () => {
        if (!deleteModal.loading) {
            setDeleteModal({
                isOpen: false,
                productId: null,
                productName: '',
                loading: false
            });
        }
    };

    return (<>
  <div className="flex items-center flex-wrap justify-between gap20 mb-30">
    <h3>All Products</h3>
    <ul className="breadcrumbs flex items-center flex-wrap justify-start gap10">
      <li>
        <Link to="/">
          <div className="text-tiny">Dashboard</div>
        </Link>
      </li>
      <li>
        <i className="icon-chevron-right" />
      </li>
      <li>
        <Link to="/products">
          <div className="text-tiny">Product</div>
        </Link>
      </li>
      <li>
        <i className="icon-chevron-right" />
      </li>
      <li>
        <div className="text-tiny">All Products</div>
      </li>
    </ul>
  </div>
  {/* product-list */}
  <div className="wg-box">
    <div className="title-box">
      <i className="icon-coffee" />
      <div className="body-text">
        Tip search by Product ID: Each product is provided with a unique ID,
        which you can rely on to find the exact product you need.
      </div>
    </div>
    <div className="flex items-center justify-between gap10 flex-wrap">
      <div className="wg-filter flex-grow">
        <div className="show">
          <div className="text-tiny">Showing</div>
          <div className="select">
            <select className="">
              <option>10</option>
              <option>20</option>
              <option>30</option>
            </select>
          </div>
          <div className="text-tiny">entries</div>
        </div>
        <form className="form-search">
          <fieldset className="name">
            <input
              type="text"
              placeholder="Search here..."
              className=""
              name="name"
              tabIndex={2}
              defaultValue=""
              aria-required="true"
              required=""
            />
          </fieldset>
          <div className="button-submit">
            <button className="" type="submit">
              <i className="icon-search" />
            </button>
          </div>
        </form>
      </div>      <Link to="/addproduct" className="tf-button style-1 w208">
        <i className="icon-plus" />
        Add new
      </Link>
    </div>
    <div className="wg-table table-product-list">
      <ul className="table-title flex gap20 mb-14">
        <li>
          <div className="body-title">Product</div>
        </li>
        <li>
          <div className="body-title">Product ID</div>
        </li>
        <li>
          <div className="body-title">Price</div>
        </li>
        <li>
          <div className="body-title">Quantity</div>
        </li>
        <li>
          <div className="body-title">Tags</div>
        </li>
        <li>
          <div className="body-title">Stock</div>
        </li>
        <li>
          <div className="body-title">Start date</div>
        </li>
        <li>
          <div className="body-title">Action</div>
        </li>
      </ul>
      
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="text-tiny">Loading products...</div>
        </div>
      ) : error ? (
        <div className="flex justify-center items-center py-20">
          <div className="text-tiny text-red">Error: {error}</div>
        </div>
      ) : products.length === 0 ? (
        <div className="flex justify-center items-center py-20">
          <div className="text-tiny">No products found</div>
        </div>
      ) : (
        <ul className="flex flex-column">
          {products.map((product) => (            <li key={product.id} className="wg-product item-row gap20">
              <div className="name">                <div className="image">
                  <img 
                    src={product.thumbnail || product.images?.[0]?.image || "images/products/placeholder.jpg"} 
                    alt={product.name}
                    onError={(e) => {
                      e.target.src = "images/products/placeholder.jpg";
                    }}
                  />
                </div>
                <div className="title line-clamp-2 mb-0">
                  <a href={`#`} className="body-text">
                    {product.name}
                  </a>
                </div>
              </div>              <div className="body-text text-main-dark mt-4">#{product.id}</div>
              <div className="body-text text-main-dark mt-4">${parseFloat(product.price || 0).toFixed(2)}</div>
              <div className="body-text text-main-dark mt-4">{product.stock_quantity || product.stock || 0}</div>
              <div className="tags-cell mt-4">
                {product.tags ? (
                  <div className="product-tags">
                    {product.tags.split(',').slice(0, 3).map((tag, index) => (
                      <span key={index} className="tag-badge-small">
                        {tag.trim()}
                      </span>
                    ))}
                    {product.tags.split(',').length > 3 && (
                      <span className="tag-more">+{product.tags.split(',').length - 3}</span>
                    )}
                  </div>
                ) : (
                  <span className="text-muted">No tags</span>
                )}
              </div>
              <div>
                <div className={`block-${(product.stock_quantity || product.stock || 0) > 0 ? 'available' : 'stock'} bg-1 fw-7`}>
                  {(product.stock_quantity || product.stock || 0) > 0 ? 'In Stock' : 'Out of stock'}
                </div>
              </div>
              <div className="body-text text-main-dark mt-4">
                {product.created_at ? new Date(product.created_at).toLocaleDateString() : 'N/A'}
              </div>
              <div className="list-icon-function">
                <div className="item eye" title="View Product">
                  <i className="icon-eye" />
                </div>
                <Link to={`/editproduct/${product.id}`} className="item edit" title="Edit Product">
                  <i className="icon-edit-3" />
                </Link>                <div 
                  className="item trash" 
                  title="Delete Product"
                  onClick={() => handleDeleteProduct(product.id, product.name)}
                  style={{ cursor: 'pointer' }}
                >
                  <i className="icon-trash-2" />
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
    <div className="divider" />
    <div className="flex items-center justify-between flex-wrap gap10">
      <div className="text-tiny">Showing 10 entries</div>
      <ul className="wg-pagination">
        <li>
          <a href="product-list.html#">
            <i className="icon-chevron-left" />
          </a>
        </li>
        <li>
          <a href="product-list.html#">1</a>
        </li>
        <li className="active">
          <a href="product-list.html#">2</a>
        </li>
        <li>
          <a href="product-list.html#">3</a>
        </li>
        <li>
          <a href="product-list.html#">
            <i className="icon-chevron-right" />
          </a>
        </li>      </ul>
    </div>
  </div>

  {/* Delete Confirmation Modal */}
  <ConfirmationModal
    isOpen={deleteModal.isOpen}
    onClose={closeDeleteModal}
    onConfirm={confirmDelete}
    title="Delete Product"
    message={`Are you sure you want to delete "${deleteModal.productName}"? This action cannot be undone.`}
    confirmText="Delete"
    cancelText="Cancel"
    type="danger"
    loading={deleteModal.loading}
  />
</>
    )
}