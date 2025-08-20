import React from "react";
import { Routes, Route } from "react-router-dom";
import ManagerDashboard from "../pages/manager/Manager-Dashboard";
import ManagerBooks from "../pages/manager/book/Manager-Book";
import ManagerBookDetail from "../pages/manager/book/Manager-Book-Details";
import ManagerCategory from "../pages/manager/category/Manager-Category";
import ManagerPublisher from "../pages/manager/publisher/Manager-Publisher";
import ManagerEmployee from "../pages/manager/user/Manager-Employee";
import ManagerCustomer from "../pages/manager/customer/Manager-Customer";
import ManagerBookCreate from "../pages/manager/book/Manager-Book-Create";
import ManagerBookUpdate from "../pages/manager/book/Manager-Book-Update";
import ManagerOrders from "../pages/manager/order/Manager-Orders";
import ManagerInStoreOrders from "../pages/manager/order/Manager-In-Store-Orders";
import ManagerInStoreOrderDetails from "../pages/manager/order/Manager-In-Store-Order-Details";
import ManagerOrderDetails from "../pages/manager/order/Manager-Order-Details";

const ManagerRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<ManagerDashboard />} />
      <Route path="/books" element={<ManagerBooks />} />
      <Route path="/books/create" element={<ManagerBookCreate />} />
      <Route path="/books/:name" element={<ManagerBookDetail />} />
      <Route path="/books/:name/update" element={<ManagerBookUpdate />} />
      <Route path="/categories" element={<ManagerCategory />} />
      <Route path="/publishers" element={<ManagerPublisher />} />
      <Route path="/employees" element={<ManagerEmployee />} />
      <Route path="/customers" element={<ManagerCustomer />} />
      <Route path="/orders" element={<ManagerOrders />} />
      <Route path="/in-store-orders" element={<ManagerInStoreOrders />} />
      <Route path="/in-store-orders/:orderId" element={<ManagerInStoreOrderDetails />} />
      <Route path="/orders/:orderId" element={<ManagerOrderDetails />} />
    </Routes>
  );
};

export default ManagerRoutes;
