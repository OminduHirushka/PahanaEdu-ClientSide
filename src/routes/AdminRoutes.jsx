import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminDashboard from "../pages/admin/Admin-Dashboard";
import AdminBooks from "../pages/admin/book/Admin-Book";
import AdminBookDetail from "../pages/admin/book/Admin-Book-Details";
import AdminCategory from "../pages/admin/category/Admin-Category";
import AdminPublisher from "../pages/admin/publisher/Admin-Publisher";
import AdminEmployee from "../pages/admin/user/Admin-Employee";
import AdminCustomer from "../pages/admin/customer/Admin-Customer";
import AdminBookCreate from "../pages/admin/book/Admin-Book-Create";
import AdminBookUpdate from "../pages/admin/book/Admin-Book-Update";
import AdminOrders from "../pages/admin/order/Admin-Orders";
import AdminInStoreOrders from "../pages/admin/order/Admin-In-Store-Orders";
import AdminOrderDetails from "../pages/admin/order/Admin-Order-Details";
import AdminInStoreOrderDetails from "../pages/admin/order/Admin-In-Store-Order-Details";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<AdminDashboard />} />
      <Route path="/books" element={<AdminBooks />} />
      <Route path="/books/create" element={<AdminBookCreate />} />
      <Route path="/books/:name" element={<AdminBookDetail />} />
      <Route path="/books/:name/update" element={<AdminBookUpdate />} />
      <Route path="/categories" element={<AdminCategory />} />
      <Route path="/publishers" element={<AdminPublisher />} />
      <Route path="/employees" element={<AdminEmployee />} />
      <Route path="/customers" element={<AdminCustomer />} />
      <Route path="/orders" element={<AdminOrders />} />
      <Route path="/in-store-orders" element={<AdminInStoreOrders />} />
      <Route path="/in-store-orders/:orderId" element={<AdminInStoreOrderDetails />} />
      <Route path="/orders/:orderId" element={<AdminOrderDetails />} />
    </Routes>
  );
};

export default AdminRoutes;
