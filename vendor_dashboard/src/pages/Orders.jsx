import { Routes, Route } from 'react-router-dom';
import OrderList from '../components/Orders/OrderList';
import OrderDetail from '../components/Orders/OrderDetail';
import { VendorOrderProvider } from '../contexts/VendorOrderContext';

export default function Orders() {
  return (
    <VendorOrderProvider>
      <div className="orders-page">
        <Routes>
          <Route index element={<OrderList />} />
          <Route path=":orderNumber" element={<OrderDetail />} />
        </Routes>
      </div>
    </VendorOrderProvider>
  );
}
