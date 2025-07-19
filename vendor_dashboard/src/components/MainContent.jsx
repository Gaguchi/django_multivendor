import { Routes, Route } from 'react-router-dom';
import Default from "../pages/Default";
import All from "../pages/products/All";
import Add from '../pages/products/Add';
import Edit from '../pages/products/Edit';
import Orders from '../pages/Orders';
import Notifications from '../pages/Notifications';
import VendorProfileLoader from './VendorProfileLoader';

export default function MainContent() {
    return (
        <>
          {/* main-content */}
          <div className="main-content">
            {/* main-content-wrap */}
            <div className="main-content-inner">
              {/* main-content-wrap */}
              <div className="main-content-wrap">
                <VendorProfileLoader>
                  <Routes>
                    <Route path="/" element={<Default />} />
                    <Route path="/products" element={<All />} />
                    <Route path="/addproduct" element={<Add />} />
                    <Route path="/editproduct/:id" element={<Edit />} />
                    <Route path="/orders/*" element={<Orders />} />
                    <Route path="/notifications" element={<Notifications />} />
                  </Routes>
                </VendorProfileLoader>
              </div>
              {/* /main-content-wrap */}
            </div>
            {/* /main-content-wrap */}
            {/* bottom-page */}
            <div className="bottom-page">
              <div className="body-text">
                Copyright © 2024 <a href="../index.html">Ecomus</a>. Design by
                Themesflat All rights reserved
              </div>
            </div>
            {/* /bottom-page */}
          </div>
          {/* /main-content */}
        </>
    )
}