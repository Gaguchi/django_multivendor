export default function Total() {
    return (
        <div className="col-lg-4">
            <div className="card shadow p-4 mb-4">
                <div className="mb-1">
                    <button className="btn btn-success w-100 py-4">
                        Proceed to Checkout
                    </button>
                    <p className="text-secondary mt-2 small">
                        Shipping methods and delivery times can be selected during checkout
                    </p>
                </div>

                <div className="border-bottom pb-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                        <h5 className="fw-bold mb-0">Your Cart</h5>
                        <span className="text-secondary">2 items • 583 g</span>
                    </div>
                    
                    <div className="d-flex justify-content-between py-1">
                        <span>Items (2)</span>
                        <span className="fw-bold">$290.28</span>
                    </div>
                    
                    <div className="d-flex justify-content-between py-1">
                        <span>Discount</span>
                        <span className="text-danger">- $233.48</span>
                    </div>
                    
                    <div className="mb-1">
                        <a href="#" className="link-primary text-decoration-none small">Details</a>
                    </div>
                </div>

                <div className="pt-3">
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <h5 className="fw-bold mb-0">
                                Total Amount 
                                <i className="bi bi-info-circle  ms-2"></i>
                            </h5>
                        </div>
                        <div className="text-end">
                            <h5 className="fw-bold mb-0">$56.79</h5>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}