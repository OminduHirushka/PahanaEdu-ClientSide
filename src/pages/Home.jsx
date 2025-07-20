import React from "react";
import { Layout } from "antd";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const { Content } = Layout;

const nav = [
  { key: "home", label: "Home" },
  { key: "about", label: "About" },
  { key: "contact", label: "Contact" },
  { key: "books", label: "Books" },
  { key: "login", label: "Login" },
  { key: "signup", label: "Sign Up" },
];

const Home = () => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Navbar nav={nav} selectedKey="home" />

      <Content style={{ padding: "24px", background: "#f5f5f5" }}>
        <div style={{ padding: 24, minHeight: 360 }}>
          <h1>Welcome to Pahana Edu</h1>
        </div>
      </Content>

      <Footer />
    </Layout>
  );
};

export default Home;
