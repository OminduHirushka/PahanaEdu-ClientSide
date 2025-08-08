import React from "react";
import { Routes, Route } from "react-router-dom";
import CustomerCart from "../pages/customer/Cart";
import Profile from "../pages/customer/Profile";
import Order from "../pages/customer/Order";
import Orders from "../pages/customer/Orders";
import OrderDetails from "../pages/customer/OrderDetails";

const CustomerRoutes = () => {
  return (
    <Routes>
      <Route path="/cart" element={<CustomerCart />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/order" element={<Order />} />
      <Route path="/orders" element={<Orders />} />
      <Route path="/orders/:orderId" element={<OrderDetails />} />
    </Routes>
  );
};

export default CustomerRoutes;
