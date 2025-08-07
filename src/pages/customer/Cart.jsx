import React, { useState, useEffect } from "react";
import {
  Layout,
  Card,
  Row,
  Col,
  Button,
  Typography,
  Table,
  InputNumber,
  Space,
  Spin,
  Empty,
  Popconfirm,
  Divider,
  Alert,
  Breadcrumb,
} from "antd";
import {
  ShoppingCartOutlined,
  DeleteOutlined,
  PlusOutlined,
  MinusOutlined,
  ClearOutlined,
  CheckCircleOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getUserCart,
  updateCartItemQuantity,
  removeCartItem,
  clearCart,
  checkoutCart,
} from "../../state/cart/cartAction";
import { clearCartState, clearCartMessages } from "../../state/cart/cartSlice";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const { Content } = Layout;
const { Title, Text } = Typography;

const CustomerCart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { cart, cartItems, isLoading, error } = useSelector((state) => state.cart);

  useEffect(() => {
    if (user?.accountNumber) {
      fetchCartData();
    }
  }, [user]);

  useEffect(() => {
    return () => {
      dispatch(clearCartState());
    };
  }, [dispatch]);

  const fetchCartData = async () => {
    try {
      dispatch(clearCartMessages());
      const cartData = await dispatch(getUserCart(user.accountNumber));
    } catch (error) {
      console.error("Error fetching cart data:", error);
    }
  };

  const handleQuantityChange = async (cartItemId, newQuantity) => {
    if (newQuantity <= 0 || !Number.isInteger(newQuantity)) {
      return;
    }
    
    try {
      dispatch(clearCartMessages());
      await dispatch(updateCartItemQuantity(cartItemId, newQuantity));
      await fetchCartData();
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const handleRemoveItem = async (cartItemId) => {
    try {
      dispatch(clearCartMessages());
      await dispatch(removeCartItem(user.accountNumber, cartItemId));
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const handleClearCart = async () => {
    try {
      dispatch(clearCartMessages());
      await dispatch(clearCart(user.accountNumber));
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  };

  const handleCheckout = async () => {
    try {
      dispatch(clearCartMessages());
      await dispatch(checkoutCart(user.accountNumber));
      navigate("/customer/books");
    } catch (error) {
      console.error("Error during checkout:", error);
    }
  };

  const columns = [
    {
      title: "Book",
      dataIndex: "book",
      key: "book",
      render: (book) => {
        return (
          <div style={{ display: "flex", alignItems: "center" }}>
            <img
              src={book?.cover || book?.imageUrl || "/default-book.jpg"}
              alt={book?.name || "Book"}
              style={{
                width: 60,
                height: 80,
                objectFit: "cover",
                marginRight: 12,
                borderRadius: 4,
              }}
              onError={(e) => {
                e.target.src = "/default-book.jpg";
              }}
            />
            <div>
              <Text strong>{book?.name || "Unknown Book"}</Text>
              <br />
              <Text type="secondary" style={{ fontSize: "12px" }}>
                Publisher: {book?.publisher?.name || book?.publisherName || "Unknown Publisher"}
              </Text>
              {book?.category && (
                <>
                  <br />
                  <Text type="secondary" style={{ fontSize: "11px" }}>
                    Category: {book.category.name || book.categoryName || ""}
                  </Text>
                </>
              )}
            </div>
          </div>
        );
      },
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price) => <Text strong>Rs. {price?.toFixed(2) || "0.00"}</Text>,
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      render: (quantity, record) => (
        <Space>
          <Button
            size="small"
            icon={<MinusOutlined />}
            onClick={() => handleQuantityChange(record.id, quantity - 1)}
            disabled={quantity <= 1}
          />
          <InputNumber
            min={1}
            value={quantity}
            onChange={(value) => handleQuantityChange(record.id, value)}
            style={{ width: 60 }}
            size="small"
          />
          <Button
            size="small"
            icon={<PlusOutlined />}
            onClick={() => handleQuantityChange(record.id, quantity + 1)}
          />
        </Space>
      ),
    },
    {
      title: "Total",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (totalPrice) => (
        <Text strong style={{ color: "#1890ff" }}>
          Rs. {totalPrice?.toFixed(2) || "0.00"}
        </Text>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Popconfirm
          title="Remove item"
          description="Are you sure you want to remove this item from your cart?"
          onConfirm={() => handleRemoveItem(record.id)}
          okText="Yes"
          cancelText="No"
        >
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            size="small"
          />
        </Popconfirm>
      ),
    },
  ];

  const navItems = [
    {
      key: "home",
      label: <span onClick={() => navigate("/")}>Home</span>,
    },
    {
      key: "about",
      label: <span onClick={() => navigate("/about")}>About</span>,
    },
    {
      key: "contact",
      label: <span onClick={() => navigate("/contact")}>Contact</span>,
    },
    {
      key: "books",
      label: <span onClick={() => navigate("/books")}>Books</span>,
    },
    {
      key: "cart",
      icon: <ShoppingCartOutlined />,
      label: <span onClick={() => navigate("/customer/cart")}>Cart</span>,
      className: "auth-nav-item",
    },
    {
      key: "profile",
      label: "Profile",
      children: [
        {
          key: "logout",
          label: <span>Logout</span>,
          onClick: () => {
            dispatch({ type: "auth/logout" });
            navigate("/");
          },
        },
      ],
      className: "auth-nav-item",
    },
  ];

  if (isLoading) {
    return (
      <Layout style={{ minHeight: "100vh" }}>
        <Navbar nav={navItems} selectedKey="cart" />
        <Content style={{ padding: "50px", textAlign: "center" }}>
          <Spin size="large" />
        </Content>
        <Footer />
      </Layout>
    );
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Navbar nav={navItems} selectedKey="cart" />
      <Content style={{ padding: "20px 50px" }}>
        <div style={{ background: "#fff", padding: 24, minHeight: 380 }}>
          <Breadcrumb style={{ marginBottom: 16 }}>
            <Breadcrumb.Item>
              <Button
                type="link"
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate("/")}
                style={{ padding: 0 }}
              >
                Home
              </Button>
            </Breadcrumb.Item>
            <Breadcrumb.Item>Cart</Breadcrumb.Item>
          </Breadcrumb>

          <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
            <Col>
              <Title level={2}>
                <ShoppingCartOutlined style={{ marginRight: 8 }} />
                Shopping Cart
              </Title>
            </Col>
            {cartItems && cartItems.length > 0 && (
              <Col>
                <Space>
                  <Popconfirm
                    title="Clear cart"
                    description="Are you sure you want to clear all items from your cart?"
                    onConfirm={handleClearCart}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button
                      icon={<ClearOutlined />}
                      danger
                    >
                      Clear Cart
                    </Button>
                  </Popconfirm>
                </Space>
              </Col>
            )}
          </Row>

          {error && (
            <Alert
              message="Error"
              description={
                <div>
                  {error.includes("transaction") || error.includes("CartItem") ? (
                    <>
                      <p>There was a temporary database issue. This usually resolves automatically.</p>
                      <Button 
                        size="small" 
                        type="primary" 
                        onClick={fetchCartData}
                        style={{ marginTop: 8 }}
                      >
                        Retry Loading Cart
                      </Button>
                    </>
                  ) : (
                    error
                  )}
                </div>
              }
              type="error"
              showIcon
              closable
              onClose={() => dispatch(clearCartMessages())}
              style={{ marginBottom: 16 }}
            />
          )}

          {!cartItems || cartItems.length === 0 ? (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <span>
                  Your cart is empty
                  <br />
                  <Button
                    type="primary"
                    onClick={() => navigate("/books")}
                    style={{ marginTop: 16 }}
                  >
                    Continue Shopping
                  </Button>
                </span>
              }
            />
          ) : (
            <>
              <Table
                columns={columns}
                dataSource={cartItems}
                rowKey="id"
                pagination={false}
                scroll={{ x: 800 }}
              />

              <Divider />

              <Row justify="space-between" align="middle">
                <Col>
                  <Space>
                    <Button onClick={() => navigate("/books")}>
                      Continue Shopping
                    </Button>
                  </Space>
                </Col>
                <Col>
                  <Card
                    size="small"
                    style={{ minWidth: 200 }}
                  >
                    <Row justify="space-between" style={{ marginBottom: 8 }}>
                      <Text>Subtotal:</Text>
                      <Text strong>Rs. {cart?.totalPrice?.toFixed(2) || "0.00"}</Text>
                    </Row>
                    <Row justify="space-between" style={{ marginBottom: 16 }}>
                      <Text strong style={{ fontSize: 16 }}>Total:</Text>
                      <Text strong style={{ fontSize: 16, color: "#1890ff" }}>
                        Rs. {cart?.totalPrice?.toFixed(2) || "0.00"}
                      </Text>
                    </Row>
                    <Button
                      type="primary"
                      size="large"
                      block
                      icon={<CheckCircleOutlined />}
                      onClick={handleCheckout}
                      disabled={!cartItems || cartItems.length === 0}
                    >
                      Checkout
                    </Button>
                  </Card>
                </Col>
              </Row>
            </>
          )}
        </div>
      </Content>
      <Footer />
    </Layout>
  );
};

export default CustomerCart;
