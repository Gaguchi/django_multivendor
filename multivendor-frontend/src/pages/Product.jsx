import React, { useState } from 'react'

export default function Product() {
  const [selectedImage, setSelectedImage] = useState(0)

  // Dummy product data
  const product = {
    name: "Послеоперационный пластырь повязка на рану и шов заживляющая стерильная, 9 х 10 см, 10 шт.",
    price: "400.00",
    oldPrice: "500.00",
    discount: "20",
    rating: 5,
    reviews: 88,
    specs: {
      type: "Повязка на рану",
      size: "90х100",
      quantity: "10",
      color: "Белый",
      manufacturer: "Китай"
    },
    images: [
      "https://placehold.co/600x600?text=Image+1",
      "https://placehold.co/600x600?text=Image+2",
      "https://placehold.co/600x600?text=Image+3",
      "https://placehold.co/600x600?text=Image+4",
      "https://placehold.co/600x600?text=Image+5",
      "https://placehold.co/600x600?text=Image+6"
    ],
    detailedSpecs: {
      "Brand": "Farm Sfera",
      "Model": "TriaFarm",
      "Package Contents": "10 sterile dressings",
      "Material": "Non-woven fabric",
      "Storage": "Store in dry place",
      "Expiration": "36 months",
      "Country": "China",
      "SKU": "1723794781"
    },
    description: "Sterile post-operative wound and suture dressing, adhesive bandage for wound care and healing",
    features: [
      "Sterile and safe",
      "Good adhesion",
      "Breathable material",
      "Easy to apply",
      "Suitable for surgical wounds"
    ]
  }

  return (
<main className="main bg-gray">
    <div className="container py-4">
      <div className="row g-4">
        {/* Image Gallery - Reduced width */}
        <div className="col-12 col-lg-5">
          <div className="row g-3">
            {/* Thumbnails */}
            <div className="col-3 col-lg-2 order-lg-1">
              <div className="d-flex flex-lg-column gap-2">
                {product.images.map((img, idx) => (
                  <div 
                    key={idx}
                    className={`thumbnail-wrapper ${selectedImage === idx ? 'img-small img-small-active' : 'img-small'}`}
                    onClick={() => setSelectedImage(idx)}
                    style={{cursor: 'pointer'}}
                  >
                    <img 
                      src={img} 
                      alt="" 
                      className="img-fluid rounded"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Main Image */}
            <div className="col-9 col-lg-10 order-lg-2">
              <img 
                src={product.images[selectedImage]} 
                alt={product.name}
                className="img-fluid rounded"
              />
            </div>
          </div>
        </div>

        {/* Info + Purchase Section */}
        <div className="col-12 col-lg-7">
          <div className="row g-4">
            {/* Product Info Section */}
            <div className="col-12 col-md-6">
              <div className="card h-100 border-0">
                <div className="card-body bg-gray">
                  <h1 className="h4 mb-3">{product.name}</h1>
                  
                  <div className="d-flex align-items-center gap-2 mb-4">
                    <div className="stars" style={{color: '#ffa800'}}>
                      {'★'.repeat(product.rating)}
                    </div>
                    <span className="text-muted small">{product.reviews} reviews</span>
                  </div>

                  <div className="specifications">
                    <table className="table table-sm">
                      <tbody>
                        {Object.entries(product.specs).map(([key, value]) => (
                          <tr key={key}>
                            <th className="text-secondary fw-normal" style={{width: '40%'}}>{key}</th>
                            <td>{value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            {/* Purchase Section - Redesigned */}
            <div className="col-12 col-md-6">
              <div className="card h-100 border-0 purchase-card" style={{borderRadius: '16px'}}>
                <div className="card-body">
                  {/* Price Row */}
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <div className="current-price h3 mb-0 fw-bold">{product.price} ₾</div>
                    <div className="d-flex align-items-center gap-2">
                      <span className="text-decoration-line-through text-muted fs-5">{product.oldPrice} ₾</span>
                      <span className="badge text-bg-danger rounded-pill px-2">-{product.discount}%</span>
                    </div>
                  </div>

                  {/* Installment Row */}
                  <div className="d-flex justify-content-between align-items-center p-3 bg-transparent rounded mb-1">
                    <div className="d-flex align-items-center gap-2">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-primary">
                        <path d="M11.7 7.9C11.7 11 9.2 13.5 6.1 13.5C3 13.5 0.4 11 0.4 7.9C0.4 4.7 2.9 2.2 6.1 2.2V7.9H11.7Z"/>
                        <path d="M13.6 6.1H7.9V0.5C11.1 0.5 13.6 3 13.6 6.1Z"/>
                      </svg>
                      <span>Monthly from: <strong>16₾</strong></span>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <img src="https://placehold.co/32x16?text=TBC" alt="TBC" className="rounded"/>
                      <img src="https://placehold.co/32x16?text=BOG" alt="BOG" className="rounded"/>
                      <img src="https://placehold.co/32x16?text=Credo" alt="Credo" className="rounded"/>
                    </div>
                  </div>

                  {/* Delivery Row */}
                  <div className="d-flex align-items-center gap-3 p-3 bg-transparent rounded mb-1">
                    <svg width="24" height="24" fill="currentColor" className="text-success flex-shrink-0">
                      <path d="M3.4 12c.4.4 1 .4 1.4 0L10 6.8V20c0 .6.4 1 1 1s1-.4 1-1V6.8l5.2 5.2c.4.4 1 .4 1.4 0 .4-.4.4-1 0-1.4l-7-7c-.4-.4-1-.4-1.4 0l-7 7c-.4.4-.4 1 0 1.4z"/>
                    </svg>
                    <div>
                      <div className="fw-bold">Free Delivery</div>
                      <small className="text-muted">in 3 hours</small>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="d-flex flex-column gap-2">
                    <button className="btn btn-primary py-2 rounded-3 d-flex align-items-center justify-content-center gap-2 card-button">
                      <svg width="20" height="20" fill="currentColor">
                        <path d="M6.3 16c.9 0 1.6.7 1.6 1.6S7.2 19.2 6.3 19.2s-1.6-.7-1.6-1.6.7-1.6 1.6-1.6zM16.5 16c.9 0 1.6.7 1.6 1.6s-.7 1.6-1.6 1.6-1.6-.7-1.6-1.6.7-1.6 1.6-1.6zM3.8 3l1.7.7.7 7.5h12.2l1.6-6c.1-.4-.1-.8-.5-.9L8.2 3H3.8zm2.3 6.2l-.4-4h10.6l-1.1 4H6.1z"/>
                      </svg>
                      <span>Add to Cart</span>
                    </button>
                    <button className="btn btn-dark py-2 rounded-3 card-button">Buy Now</button>
                    <button className="btn btn-outline-primary py-2 rounded-3 card-button">Installment</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </main>
  )
}