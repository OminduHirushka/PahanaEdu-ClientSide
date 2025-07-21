import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/home/Home";
import About from "./pages/home/About";
import Contact from "./pages/home/Contact";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
    </Routes>
  );
}

export default App;
