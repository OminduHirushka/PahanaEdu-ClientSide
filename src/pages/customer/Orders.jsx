import React, { useEffect } from "react";
import {
  Layout,
  Card,
  Row,
  Col,
  Button,
  Typography,
  Table,
  Space,
  Spin,
  Empty,
  Tag,
  Breadcrumb,
  Alert,
  Popconfirm,
  Tooltip,
} from "antd";
import {
  ShoppingCartOutlined,
  EyeOutlined,
  DownloadOutlined,
  CloseCircleOutlined,
  HomeOutlined,
  CalendarOutlined,
  DollarOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getOrdersByCustomer,
  cancelOrder,
} from "../../state/order/orderAction";
import { clearOrderMessages } from "../../state/order/orderSlice";
import { getCurrentUser } from "../../state/auth/authAction";
import {
  ORDER_STATUS_COLORS,
  PAYMENT_STATUS_COLORS,
  CUSTOMER_ALLOWED_ACTIONS,
} from "../../utils/orderConstants";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const { Content } = Layout;
const { Title, Text } = Typography;

const Orders = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { orders, isLoading, error, success } = useSelector(
    (state) => state.order
  );

  useEffect(() => {
    if (user?.accountNumber) {
      dispatch(getOrdersByCustomer(user.accountNumber));
    } else {
      dispatch(getCurrentUser());
    }
  }, [dispatch, user?.accountNumber]);

  useEffect(() => {
    dispatch(clearOrderMessages());
  }, [dispatch]);

  const getStatusColor = (status) => {
    return ORDER_STATUS_COLORS[status] || "default";
  };

  const getPaymentStatusColor = (status) => {
    return PAYMENT_STATUS_COLORS[status] || "default";
  };

  const handleViewOrder = async (orderId) => {
    navigate(`/customer/orders/${orderId}`);
  };

  const handleCancelOrder = async (orderId) => {
    try {
      await dispatch(cancelOrder(orderId));
      if (user?.accountNumber) {
        dispatch(getOrdersByCustomer(user.accountNumber));
      }
    } catch (error) {
      console.error("Failed to cancel order:", error);
    }
  };

  const columns = [
    {
      title: "Order Number",
      dataIndex: "orderNumber",
      key: "orderNumber",
      render: (orderNumber) => (
        <Text code strong>
          {orderNumber}
        </Text>
      ),
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => (
        <Space>
          <CalendarOutlined />
          <Text>{new Date(date).toLocaleDateString()}</Text>
        </Space>
      ),
    },
    {
      title: "Total Amount",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (amount) => (
        <Space>
          <DollarOutlined />
          <Text strong style={{ color: "#1890ff" }}>
            Rs. {amount?.toFixed(2)}
          </Text>
        </Space>
      ),
    },
    {
      title: "Order Status",
      dataIndex: "orderStatus",
      key: "orderStatus",
      render: (status) => (
        <Tag color={getStatusColor(status)} style={{ fontWeight: "bold" }}>
          {status}
        </Tag>
      ),
    },
    {
      title: "Payment Status",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      render: (status) => (
        <Tag
          color={getPaymentStatusColor(status)}
          style={{ fontWeight: "bold" }}
        >
          {status}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="View Details">
            <Button
              type="primary"
              ghost
              size="small"
              icon={<EyeOutlined />}
              onClick={() => handleViewOrder(record.id)}
            />
          </Tooltip>

          <Tooltip title="Download Invoice">
            <Button
              type="default"
              size="small"
              icon={<DownloadOutlined />}
              onClick={() => navigate(`/customer/orders/${record.id}`)}
            />
          </Tooltip>

          {record.orderStatus === "PENDING" &&
            CUSTOMER_ALLOWED_ACTIONS[record.orderStatus]?.includes(
              "cancel"
            ) && (
              <Tooltip title="Cancel Order">
                <Popconfirm
                  title="Cancel Order"
                  description="Are you sure you want to cancel this order?"
                  onConfirm={() => handleCancelOrder(record.id)}
                  okText="Yes"
                  cancelText="No"
                  okButtonProps={{ danger: true }}
                >
                  <Button
                    type="primary"
                    danger
                    size="small"
                    icon={<CloseCircleOutlined />}
                  />
                </Popconfirm>
              </Tooltip>
            )}
        </Space>
      ),
    },
  ];

  if (isLoading && orders.length === 0) {
    return (
      <Layout style={{ minHeight: "100vh" }}>
        <Navbar />
        <Content style={{ padding: "24px", flex: 1 }}>
          <div style={{ textAlign: "center", marginTop: "100px" }}>
            <Spin size="large" />
            <Text style={{ display: "block", marginTop: "16px" }}>
              Loading your orders...
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
              <UserOutlined />
              Profile
            </Breadcrumb.Item>
            <Breadcrumb.Item>Orders</Breadcrumb.Item>
          </Breadcrumb>

          <Row gutter={24} style={{ marginBottom: "24px" }}>
            <Col span={24}>
              <Card>
                <Title level={3} style={{ margin: 0 }}>
                  <ShoppingCartOutlined style={{ marginRight: "8px" }} />
                  My Orders
                </Title>
                <Text type="secondary">View and manage your order history</Text>
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

          <Card>
            {orders.length === 0 ? (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <div>
                    <Text>No orders found</Text>
                    <br />
                    <Text type="secondary">
                      Start shopping to see your orders here
                    </Text>
                  </div>
                }
              >
                <Button
                  type="primary"
                  onClick={() => navigate("/books")}
                  style={{
                    background:
                      "linear-gradient(90deg, #1890ff 0%, #40a9ff 100%)",
                  }}
                >
                  Browse Books
                </Button>
              </Empty>
            ) : (
              <Table
                columns={columns}
                dataSource={orders}
                rowKey="id"
                loading={isLoading}
                pagination={{
                  total: orders.length,
                  pageSize: 10,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total, range) =>
                    `${range[0]}-${range[1]} of ${total} orders`,
                }}
                scroll={{ x: 800 }}
              />
            )}
          </Card>
        </div>
      </Content>
      <Footer />
    </Layout>
  );
};

export default Orders;
