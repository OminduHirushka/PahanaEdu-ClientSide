import React from "react";
import { Routes, Route } from "react-router-dom";

import EmployeeDashboard from "../pages/employee/Employee-Dashboard";
import EmployeeBooks from "../pages/employee/book/Employee-Books";
import EmployeeBookDetail from "../pages/employee/book/Employee-Book-Details";
import EmployeeCustomer from "../pages/employee/customer/Employee-Customer";
import EmployeeInStoreOrder from "../pages/employee/order/Employee-InStore-Order";
import EmployeeOrders from "../pages/employee/order/Employee-Orders";
import EmployeeOrderDetails from "../pages/employee/order/Employee-Order-Details";
import OnlineOrders from "../pages/employee/Online-Orders";

const EmployeeRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<EmployeeDashboard />} />
      <Route path="/books" element={<EmployeeBooks />} />
      <Route path="/books/:name" element={<EmployeeBookDetail />} />
      <Route path="/customers" element={<EmployeeCustomer />} />
      <Route path="/in-store-order" element={<EmployeeInStoreOrder />} />
      <Route path="/orders" element={<EmployeeOrders />} />
      <Route path="/orders/create" element={<EmployeeInStoreOrder />} />
      <Route path="/orders/:orderId" element={<EmployeeOrderDetails />} />
      <Route path="/online-orders" element={<OnlineOrders />} />
    </Routes>
  );
};

export default EmployeeRoutes;
