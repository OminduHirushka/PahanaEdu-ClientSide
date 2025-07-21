import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/home/Home";
import About from "./pages/home/About";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
    </Routes>
  );
}

export default App;
