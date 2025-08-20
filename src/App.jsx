import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/app/Home";
import About from "./pages/app/About";
import Contact from "./pages/app/Contact";
import BookRoutes from "./routes/BookRoutes";
import AuthRoutes from "./routes/AuthRoutes";
import ManagerRoutes from "./routes/ManagerRoutes";
import CustomerRoutes from "./routes/CustomerRoutes";
import EmployeeRoutes from "./routes/EmployeeRoutes";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/books/*" element={<BookRoutes />} />
      <Route path="/auth/*" element={<AuthRoutes />} />
      <Route path="/manager/*" element={<ManagerRoutes />} />
      <Route path="/employee/*" element={<EmployeeRoutes />} />
      <Route path="/customer/*" element={<CustomerRoutes />} />
    </Routes>
  );
}

export default App;
