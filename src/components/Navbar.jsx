import React, { useState } from "react";
import {
  Menu,
  Space,
  Typography,
  Button,
  Drawer,
  Avatar,
  Row,
  Col,
} from "antd";
import {
  LoginOutlined,
  UserAddOutlined,
  MenuOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import logo from "/pahana-edu-logo.png";

const { Title } = Typography;

const Navbar = ({ nav, selectedKey = "home" }) => {
  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState(selectedKey);

  const mainNavItems = [
    {
      key: "home",
      label: <Link to="/">Home</Link>,
    },
    {
      key: "about",
      label: <Link to="/about">About</Link>,
    },
    {
      key: "contact",
      label: <Link to="/contact">Contact</Link>,
    },
    {
      key: "books",
      label: <Link to="/books">Books</Link>,
    },
  ];

  const authNavItems = [
    {
      key: "login",
      icon: <LoginOutlined />,
      label: <Link to="/auth/login">Login</Link>,
      className: "auth-nav-item",
    },
    {
      key: "register",
      icon: <UserAddOutlined />,
      label: <Link to="/auth/register">Register</Link>,
      className: "auth-nav-item register-btn",
    },
  ];

  const allItems = nav || [...mainNavItems, ...authNavItems];

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  const onClick = (e) => {
    setCurrent(e.key);
    setVisible(false);
  };

  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 1000,
        width: "100%",
        height: "64px",
        padding: "0 24px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        background: "linear-gradient(90deg, #001529 0%, #003366 100%)",
      }}
    >
      <Row
        justify="space-between"
        align="middle"
        style={{ height: "100%" }}
        className="desktop-nav"
      >
        <Col flex="none">
          <Link to="/" style={{ display: "flex", alignItems: "center" }}>
            <Avatar
              src={logo}
              size="large"
              style={{ marginRight: 12 }}
              alt="Pahana Edu Logo"
            />
            <Title
              level={4}
              style={{
                color: "#fff",
                margin: 0,
                fontWeight: "bold",
              }}
            >
              Pahana Edu
            </Title>
          </Link>
        </Col>

        <Col flex="auto" style={{ display: "flex", justifyContent: "center" }}>
          <Menu
            theme="dark"
            mode="horizontal"
            selectedKeys={[current]}
            onClick={onClick}
            items={mainNavItems}
            style={{
              backgroundColor: "transparent",
              border: "none",
              width: "auto",
            }}
            className="main-navigation"
          />
        </Col>

        <Col flex="none">
          <Menu
            theme="dark"
            mode="horizontal"
            selectedKeys={[current]}
            onClick={onClick}
            items={authNavItems}
            style={{
              backgroundColor: "transparent",
              border: "none",
              minWidth: 0,
            }}
          />
        </Col>
      </Row>

      <Row
        justify="space-between"
        align="middle"
        style={{ height: "100%" }}
        className="mobile-nav"
      >
        <Col>
          <Link to="/" style={{ display: "flex", alignItems: "center" }}>
            <Avatar
              src={logo}
              size="large"
              style={{ marginRight: 12 }}
              alt="Pahana Edu Logo"
            />
            <Title
              level={4}
              style={{
                color: "#fff",
                margin: 0,
                fontWeight: "bold",
              }}
            >
              Pahana Edu
            </Title>
          </Link>
        </Col>

        <Col>
          <Button
            type="text"
            icon={<MenuOutlined style={{ color: "#fff", fontSize: "20px" }} />}
            onClick={showDrawer}
            style={{
              width: "48px",
              height: "48px",
            }}
          />
        </Col>
      </Row>

      <Drawer
        title={
          <Space align="center">
            <Avatar src={logo} size="default" />
            <Title level={4} style={{ color: "#001529", margin: 0 }}>
              Pahana Edu
            </Title>
          </Space>
        }
        placement="right"
        onClose={onClose}
        visible={visible}
        closeIcon={<CloseOutlined style={{ color: "#001529" }} />}
        bodyStyle={{ padding: 0 }}
        headerStyle={{ borderBottom: "1px solid #f0f0f0" }}
      >
        <Menu
          mode="vertical"
          selectedKeys={[current]}
          onClick={onClick}
          items={allItems.map((item) => ({
            ...item,
            style: { ...item.style, margin: 0 },
          }))}
          style={{ padding: "8px 0", borderRight: 0 }}
        />
      </Drawer>

      <style jsx global>{`
        @media (max-width: 992px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-nav {
            display: flex !important;
          }
        }
        @media (min-width: 993px) {
          .mobile-nav {
            display: none !important;
          }
        }
        .ant-menu-item:hover {
          background-color: rgba(255, 255, 255, 0.1) !important;
        }
        .ant-menu-item-selected {
          background-color: rgba(255, 255, 255, 0.2) !important;
        }
        .auth-nav-item {
          margin-left: 8px !important;
        }
        .register-btn {
          background-color: #1890ff !important;
          border-radius: 4px !important;
        }
        .register-btn:hover {
          background-color: #40a9ff !important;
        }

        /* Added gap between navigation items */
        .main-navigation .ant-menu-item {
          margin: 0 12px !important;
        }

        /* Adjust first and last items to balance spacing */
        .main-navigation .ant-menu-item:first-child {
          margin-left: 0 !important;
        }
        .main-navigation .ant-menu-item:last-child {
          margin-right: 0 !important;
        }
      `}</style>
    </div>
  );
};

export default Navbar;
