import React, { useState, useEffect } from "react";
import {
  Layout,
  Card,
  Row,
  Col,
  Button,
  Typography,
  Form,
  Input,
  Divider,
  Space,
  Spin,
  Alert,
  Breadcrumb,
  Table,
  Image,
} from "antd";
import {
  ShoppingCartOutlined,
  UserOutlined,
  HomeOutlined,
  CheckCircleOutlined,
  ArrowLeftOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createOrder } from "../../state/order/orderAction";
import { clearOrderMessages } from "../../state/order/orderSlice";
import { getCurrentUser } from "../../state/auth/authAction";
import { SHIPPING_FEE } from "../../utils/orderConstants";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const { Content } = Layout;
const { Title, Text } = Typography;

const Order = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const { user } = useSelector((state) => state.auth);
  const { cart, cartItems } = useSelector((state) => state.cart);
  const { isLoading, error, success } = useSelector((state) => state.order);

  const [orderData, setOrderData] = useState({
    subtotal: 0,
    shippingFee: SHIPPING_FEE,
    totalAmount: 0,
  });

  useEffect(() => {
    if (cartItems && cartItems.length > 0) {
      const subtotal = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      const totalAmount = subtotal + orderData.shippingFee;

      setOrderData((prev) => ({
        ...prev,
        subtotal,
        totalAmount,
      }));
    }
  }, [cartItems, orderData.shippingFee]);

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        name: user.fullName || "",
        accountNumber: user.accountNumber || "",
        nic: user.nic || "",
        address: user.address || "",
        email: user.email || "",
        phoneNumber: user.contact || "",
      });
    }
  }, [user, form]);

  useEffect(() => {
    if (!user) {
      dispatch(getCurrentUser());
    }
  }, [dispatch, user]);

  useEffect(() => {
    dispatch(clearOrderMessages());

    return () => {
      dispatch(clearOrderMessages());
    };
  }, [dispatch]);

  useEffect(() => {
    if (!cartItems || cartItems.length === 0) {
      navigate("/customer/cart");
    }
  }, [cartItems, navigate]);

  const handleCreateOrder = async (values) => {
    try {
      const orderDTO = {
        address: values.address,
      };

      await dispatch(createOrder(cart.id, orderDTO));

      setTimeout(() => {
        navigate("/customer/orders");
      }, 2000);
    } catch (error) {
      console.error("Failed to create order:", error);
    }
  };

  const orderItemColumns = [
    {
      title: "Book",
      dataIndex: "book",
      key: "book",
      render: (book) => (
        <Space>
          <Image
            width={60}
            height={80}
            src={book.cover}
            alt={book.name}
            style={{ objectFit: "cover", borderRadius: "4px" }}
          />
          <div>
            <Text strong>{book.name}</Text>
            <br />
            <Text type="secondary">{book.publisher?.name}</Text>
          </div>
        </Space>
      ),
    },
    {
      title: "Unit Price",
      dataIndex: "price",
      key: "price",
      render: (price) => <Text>Rs. {price?.toFixed(2)}</Text>,
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      render: (quantity) => <Text>{quantity}</Text>,
    },
    {
      title: "Total",
      key: "total",
      render: (_, record) => (
        <Text strong>Rs. {(record.price * record.quantity).toFixed(2)}</Text>
      ),
    },
  ];

  if (!cartItems || cartItems.length === 0) {
    return (
      <Layout style={{ minHeight: "100vh" }}>
        <Navbar />
        <Content style={{ padding: "24px", flex: 1 }}>
          <div style={{ textAlign: "center", marginTop: "100px" }}>
            <Spin size="large" />
            <Text style={{ display: "block", marginTop: "16px" }}>
              Loading...
            </Text>
          </div>
        </Content>
        <Footer />
      </Layout>
    );
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Navbar />
      <Content style={{ padding: "24px", flex: 1 }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <Breadcrumb style={{ marginBottom: "24px" }}>
            <Breadcrumb.Item>
              <HomeOutlined />
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <Button
                type="link"
                onClick={() => navigate("/customer/cart")}
                style={{ padding: 0 }}
              >
                Cart
              </Button>
            </Breadcrumb.Item>
            <Breadcrumb.Item>Create Order</Breadcrumb.Item>
          </Breadcrumb>

          <Row gutter={24} style={{ marginBottom: "24px" }}>
            <Col span={24}>
              <Card>
                <Space align="center">
                  <Button
                    type="text"
                    icon={<ArrowLeftOutlined />}
                    onClick={() => navigate("/customer/cart")}
                  >
                    Back to Cart
                  </Button>
                  <Divider type="vertical" />
                  <Title level={3} style={{ margin: 0 }}>
                    <ShoppingCartOutlined style={{ marginRight: "8px" }} />
                    Create Order
                  </Title>
                </Space>
              </Card>
            </Col>
          </Row>

          {error && (
            <Alert
              message="Error"
              description={error}
              type="error"
              showIcon
              closable
              style={{ marginBottom: "24px" }}
              onClose={() => dispatch(clearOrderMessages())}
            />
          )}

          {success && (
            <Alert
              message="Success"
              description={success}
              type="success"
              showIcon
              closable
              style={{ marginBottom: "24px" }}
              onClose={() => dispatch(clearOrderMessages())}
            />
          )}

          <Row gutter={24}>
            <Col xs={24} lg={14}>
              <Card
                title={
                  <Space>
                    <ShoppingCartOutlined />
                    <span>Order Items</span>
                  </Space>
                }
                style={{ marginBottom: "24px" }}
              >
                <Table
                  columns={orderItemColumns}
                  dataSource={cartItems}
                  pagination={false}
                  rowKey={(record) => record.id || record.key}
                  size="middle"
                />

                <Divider />

                <Row justify="end">
                  <Col xs={24} sm={12}>
                    <Space direction="vertical" style={{ width: "100%" }}>
                      <Row justify="space-between">
                        <Col>
                          <Text>Subtotal:</Text>
                        </Col>
                        <Col>
                          <Text>Rs. {orderData.subtotal.toFixed(2)}</Text>
                        </Col>
                      </Row>
                      <Row justify="space-between">
                        <Col>
                          <Text>Shipping Fee:</Text>
                        </Col>
                        <Col>
                          <Text>Rs. {orderData.shippingFee.toFixed(2)}</Text>
                        </Col>
                      </Row>
                      <Divider style={{ margin: "8px 0" }} />
                      <Row justify="space-between">
                        <Col>
                          <Text strong style={{ fontSize: "16px" }}>
                            Total Amount:
                          </Text>
                        </Col>
                        <Col>
                          <Text
                            strong
                            style={{ fontSize: "16px", color: "#1890ff" }}
                          >
                            Rs. {orderData.totalAmount.toFixed(2)}
                          </Text>
                        </Col>
                      </Row>
                    </Space>
                  </Col>
                </Row>
              </Card>
            </Col>

            <Col xs={24} lg={10}>
              <Card
                title={
                  <Space>
                    <UserOutlined />
                    <span>Customer Information</span>
                  </Space>
                }
              >
                <Form
                  form={form}
                  layout="vertical"
                  onFinish={handleCreateOrder}
                  autoComplete="off"
                >
                  <Form.Item
                    label="Full Name"
                    name="name"
                    rules={[
                      {
                        required: true,
                        message: "Please enter your full name",
                      },
                    ]}
                  >
                    <Input prefix={<UserOutlined />} disabled />
                  </Form.Item>

                  <Form.Item
                    label="Account Number"
                    name="accountNumber"
                    rules={[
                      {
                        required: true,
                        message: "Please enter account number",
                      },
                    ]}
                  >
                    <Input disabled />
                  </Form.Item>

                  <Form.Item
                    label="NIC"
                    name="nic"
                    rules={[
                      { required: true, message: "Please enter your NIC" },
                    ]}
                  >
                    <Input disabled />
                  </Form.Item>

                  <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                      { required: true, message: "Please enter your email" },
                      { type: "email", message: "Please enter a valid email" },
                    ]}
                  >
                    <Input disabled />
                  </Form.Item>

                  <Form.Item label="Phone Number" name="phoneNumber">
                    <Input disabled />
                  </Form.Item>

                  <Form.Item
                    label="Delivery Address"
                    name="address"
                    rules={[
                      {
                        required: true,
                        message: "Please enter delivery address",
                      },
                    ]}
                  >
                    <Input.TextArea
                      rows={3}
                      placeholder="Enter your complete delivery address"
                    />
                  </Form.Item>

                  <Form.Item style={{ marginBottom: 0 }}>
                    <Button
                      type="primary"
                      htmlType="submit"
                      size="large"
                      loading={isLoading}
                      icon={
                        isLoading ? (
                          <LoadingOutlined />
                        ) : (
                          <CheckCircleOutlined />
                        )
                      }
                      style={{
                        width: "100%",
                        background:
                          "linear-gradient(90deg, #1890ff 0%, #40a9ff 100%)",
                      }}
                    >
                      {isLoading ? "Creating Order..." : "Confirm Order"}
                    </Button>
                  </Form.Item>
                </Form>
              </Card>
            </Col>
          </Row>
        </div>
      </Content>
      <Footer />
    </Layout>
  );
};

export default Order;
