import React, { useState, useEffect } from "react";
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
  Tag,
  Breadcrumb,
  Alert,
  Descriptions,
  Image,
  Divider,
} from "antd";
import {
  ShoppingCartOutlined,
  ArrowLeftOutlined,
  DownloadOutlined,
  HomeOutlined,
  CalendarOutlined,
  UserOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getOrderById } from "../../../state/order/orderAction";
import { getBookById } from "../../../state/book/bookAction";
import { clearOrderMessages } from "../../../state/order/orderSlice";
import { formatBookPrice } from "../../../utils/bookHelpers";
import { generateInvoicePDF } from "../../../utils/pdfUtils";
import {
  ORDER_STATUS_COLORS,
  PAYMENT_STATUS_COLORS,
} from "../../../utils/orderConstants";

const { Content } = Layout;
const { Title, Text } = Typography;

const BookInfoDisplay = ({ record, dispatch }) => {
  const [bookDetails, setBookDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBookDetails = async () => {
      if (record?.bookId && !bookDetails) {
        setLoading(true);
        try {
          const bookData = await dispatch(getBookById(record.bookId));
          setBookDetails(bookData);
        } catch (error) {
          console.error("Failed to fetch book details:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchBookDetails();
  }, [record?.bookId, dispatch, bookDetails]);

  const publisherName =
    bookDetails?.publisher?.name || bookDetails?.publisherName || "Loading...";

  return (
    <Space>
      <Image
        width={50}
        height={65}
        src={record?.bookCover}
        alt={record?.bookName}
        style={{ objectFit: "cover", borderRadius: "4px" }}
      />
      <div>
        <Text strong>{record?.bookName}</Text>
        <br />
        <Text type="secondary">
          {loading ? (
            <Space>
              <Spin size="small" />
              Loading publisher...
            </Space>
          ) : (
            publisherName
          )}
        </Text>
      </div>
    </Space>
  );
};

const AdminOrderDetails = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { currentOrder, isLoading, error } = useSelector(
    (state) => state.order
  );

  const [orderData, setOrderData] = useState(null);

  useEffect(() => {
    if (orderId) {
      dispatch(getOrderById(orderId));
    }
  }, [dispatch, orderId]);

  useEffect(() => {
    if (currentOrder) {
      setOrderData(currentOrder);
    }
  }, [currentOrder]);

  useEffect(() => {
    dispatch(clearOrderMessages());

    return () => {
      dispatch(clearOrderMessages());
    };
  }, [dispatch]);

  const getStatusColor = (status) => {
    return ORDER_STATUS_COLORS[status] || "default";
  };

  const getPaymentStatusColor = (status) => {
    return PAYMENT_STATUS_COLORS[status] || "default";
  };

  const handleDownloadInvoice = () => {
    if (orderData) {
      try {
        generateInvoicePDF(orderData);
      } catch (error) {
        console.error("Failed to generate invoice:", error);
      }
    }
  };

  const orderItemColumns = [
    {
      title: "Book",
      dataIndex: "book",
      key: "book",
      render: (book, record) => {
        return <BookInfoDisplay record={record} dispatch={dispatch} />;
      },
    },
    {
      title: "Unit Price",
      dataIndex: "unitPrice",
      key: "unitPrice",
      render: (price) => (
        <Text strong style={{ color: "#1890ff" }}>
          {formatBookPrice(price || 0)}
        </Text>
      ),
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      align: "center",
    },
    {
      title: "Total Price",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (total) => (
        <Text strong style={{ color: "#1890ff" }}>
          {formatBookPrice(total || 0)}
        </Text>
      ),
    },
  ];

  if (isLoading) {
    return (
      <Layout style={{ minHeight: "100vh" }}>
        <Content style={{ padding: "24px", flex: 1 }}>
          <div style={{ textAlign: "center", marginTop: "100px" }}>
            <Spin size="large" />
            <Text style={{ display: "block", marginTop: "16px" }}>
              Loading order details...
            </Text>
          </div>
        </Content>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout style={{ minHeight: "100vh" }}>
        <Content style={{ padding: "24px", flex: 1 }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <Alert
              message="Error"
              description={error}
              type="error"
              showIcon
              style={{ marginBottom: "24px" }}
            />
            <Button
              type="primary"
              onClick={() => navigate("/admin/orders")}
              icon={<ArrowLeftOutlined />}
            >
              Back to Orders
            </Button>
          </div>
        </Content>
      </Layout>
    );
  }

  if (!orderData) {
    return (
      <Layout style={{ minHeight: "100vh" }}>
        <Content style={{ padding: "24px", flex: 1 }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <Alert
              message="Order Not Found"
              description="The requested order could not be found."
              type="warning"
              showIcon
              style={{ marginBottom: "24px" }}
            />
            <Button
              type="primary"
              onClick={() => navigate("/admin/orders")}
              icon={<ArrowLeftOutlined />}
            >
              Back to Orders
            </Button>
          </div>
        </Content>
      </Layout>
    );
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Content style={{ padding: "24px", flex: 1 }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <Row gutter={24} style={{ marginBottom: "24px" }}>
            <Col span={24}>
              <Card>
                <Space
                  align="center"
                  style={{ width: "100%", justifyContent: "space-between" }}
                >
                  <div>
                    <Space align="center">
                      <Button
                        type="text"
                        icon={<ArrowLeftOutlined />}
                        onClick={() => navigate("/admin/orders")}
                      >
                        Back to Orders
                      </Button>
                      <Divider type="vertical" />
                      <Title level={3} style={{ margin: 0 }}>
                        <ShoppingCartOutlined style={{ marginRight: "8px" }} />
                        Order Details
                      </Title>
                      <Text
                        code
                        strong
                        style={{ marginLeft: "8px", fontSize: "20px" }}
                      >
                        {orderData.orderNumber}
                      </Text>
                    </Space>
                  </div>
                  <Button
                    type="primary"
                    icon={<DownloadOutlined />}
                    onClick={handleDownloadInvoice}
                    style={{
                      background:
                        "linear-gradient(90deg, #1890ff 0%, #40a9ff 100%)",
                    }}
                  >
                    Download Invoice
                  </Button>
                </Space>
              </Card>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col xs={24} lg={8}>
              <Card
                title={
                  <Space>
                    <CalendarOutlined />
                    <span>Order Information</span>
                  </Space>
                }
                style={{ marginBottom: "24px" }}
              >
                <Descriptions column={1} size="small">
                  <Descriptions.Item label="Order Date">
                    <Text>
                      {orderData.createdAt
                        ? new Date(orderData.createdAt).toLocaleString()
                        : "N/A"}
                    </Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Order Status">
                    <Tag
                      color={getStatusColor(orderData.orderStatus)}
                      style={{ fontWeight: "bold" }}
                    >
                      {orderData.orderStatus}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="Payment Status">
                    <Tag
                      color={getPaymentStatusColor(orderData.paymentStatus)}
                      style={{ fontWeight: "bold" }}
                    >
                      {orderData.paymentStatus}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="Last Updated">
                    <Text>
                      {orderData.updatedAt
                        ? new Date(orderData.updatedAt).toLocaleString()
                        : "N/A"}
                    </Text>
                  </Descriptions.Item>
                </Descriptions>
              </Card>

              <Card
                title={
                  <Space>
                    <UserOutlined />
                    <span>Customer Information</span>
                  </Space>
                }
                style={{ marginBottom: "24px" }}
              >
                <Descriptions column={1} size="small">
                  <Descriptions.Item label="Account Number">
                    <Text>
                      {orderData.userAccountNumber ||
                        user?.accountNumber ||
                        "N/A"}
                    </Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Name">
                    <Text>{orderData.userName || user?.fullName || "N/A"}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Email">
                    <Text>{orderData.userEmail || user?.email || "N/A"}</Text>
                  </Descriptions.Item>
                </Descriptions>
              </Card>

              <Card
                title={
                  <Space>
                    <EnvironmentOutlined />
                    <span>Delivery Information</span>
                  </Space>
                }
              >
                <Descriptions column={1} size="small">
                  <Descriptions.Item label="Delivery Address">
                    <Text>{orderData.address || "N/A"}</Text>
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            </Col>

            <Col xs={24} lg={16}>
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
                  dataSource={orderData.items || []}
                  pagination={false}
                  rowKey={(record) => record.id || record.bookId}
                  size="middle"
                />

                <Divider />

                <Row justify="end">
                  <Col xs={24} sm={12} lg={8}>
                    <Space direction="vertical" style={{ width: "100%" }}>
                      <Row justify="space-between">
                        <Col>
                          <Text>Subtotal:</Text>
                        </Col>
                        <Col>
                          <Text>
                            {formatBookPrice(
                              orderData.subtotal?.toFixed(2) || "0.00"
                            )}
                          </Text>
                        </Col>
                      </Row>
                      <Row justify="space-between">
                        <Col>
                          <Text>Shipping Fee:</Text>
                        </Col>
                        <Col>
                          <Text>
                            {formatBookPrice(
                              orderData.shippingFee?.toFixed(2) || "0.00"
                            )}
                          </Text>
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
                            {formatBookPrice(
                              orderData.totalAmount?.toFixed(2) || "0.00"
                            )}
                          </Text>
                        </Col>
                      </Row>
                    </Space>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
        </div>
      </Content>
    </Layout>
  );
};

export default AdminOrderDetails;
