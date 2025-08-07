import React from "react";
import { Routes, Route } from "react-router-dom";
import CustomerCart from "../pages/customer/Cart";
import Profile from "../pages/customer/Profile";

const CustomerRoutes = () => {
  return (
    <Routes>
      <Route path="/cart" element={<CustomerCart />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  );
};

export default CustomerRoutes;
