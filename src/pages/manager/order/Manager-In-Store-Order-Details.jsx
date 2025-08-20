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
  Alert,
  Descriptions,
  Image,
  Divider,
  message,
  Select,
  Form,
  Breadcrumb,
} from "antd";
import {
  ShoppingCartOutlined,
  ArrowLeftOutlined,
  DownloadOutlined,
  CalendarOutlined,
  UserOutlined,
  EnvironmentOutlined,
  PrinterOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getEmployeeOrderById } from "../../../state/order/employeeOrderAction";
import { getBookById } from "../../../state/book/bookAction";
import { generateInvoicePDF } from "../../../utils/pdfUtils";
import {
  ORDER_STATUS_COLORS,
  PAYMENT_STATUS_COLORS,
  ORDER_STATUS_LABELS,
} from "../../../utils/orderConstants";
import { formatBookPrice } from "../../../utils/bookHelpers";
import dayjs from "dayjs";

const { Content } = Layout;
const { Text } = Typography;

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

const ManagerInStoreOrderDetails = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { orderId } = useParams();

  const { currentEmployeeOrder, isLoading, error } = useSelector(
    (state) => state.employeeOrder
  );
  const order = currentEmployeeOrder;

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (orderId) {
        try {
          const orderData = await dispatch(getEmployeeOrderById(orderId));
          console.log("Fetched order data:", orderData);
          console.log(
            "Order items:",
            orderData?.orderItems || orderData?.items
          );
        } catch (error) {
          console.error("Failed to fetch order details:", error);
          message.error("Failed to load order details");
        }
      }
    };

    fetchOrderDetails();
  }, [dispatch, orderId]);

  const handleDownloadInvoice = async () => {
    if (!order) {
      message.error("Order data not available");
      return;
    }

    try {
      await generateInvoicePDF(order);
      message.success("Invoice downloaded successfully!");
    } catch (error) {
      console.error("Invoice generation error:", error);
      message.error("Failed to download invoice");
    }
  };

  const handleRefresh = () => {
    dispatch(getEmployeeOrderById(orderId));
    message.success("Order details refreshed!");
  };

  const orderItemColumns = [
    {
      title: "Book",
      key: "book",
      render: (_, record) => <BookInfoDisplay record={record} />,
    },
    {
      title: "Unit Price",
      dataIndex: "unitPrice",
      key: "unitPrice",
      width: 120,
      render: (price, record) => (
        <Text strong style={{ color: "#1890ff" }}>
          {formatBookPrice(price || record.bookPrice || record.unitPrice || 0)}
        </Text>
      ),
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      width: 100,
      render: (quantity, record) => (
        <Text strong>{quantity || record.qty || 1}</Text>
      ),
    },
    {
      title: "Subtotal",
      key: "subtotal",
      width: 120,
      render: (_, record) => {
        const price = record.price || record.bookPrice || record.unitPrice || 0;
        const quantity = record.quantity || record.qty || 1;
        return (
          <Text strong style={{ color: "#52c41a" }}>
            {formatBookPrice(price * quantity)}
          </Text>
        );
      },
    },
  ];

  if (isLoading) {
    return (
      <Layout style={{ minHeight: "100vh" }}>
        <Content style={{ padding: "24px", background: "#f5f5f5" }}>
          <div style={{ textAlign: "center", padding: "5rem" }}>
            <Spin size="large" />
            <div style={{ marginTop: "1rem" }}>
              <Text>Loading order details...</Text>
            </div>
          </div>
        </Content>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout style={{ minHeight: "100vh" }}>
        <Content style={{ padding: "24px", background: "#f5f5f5" }}>
          <Alert
            message="Error"
            description={error}
            type="error"
            showIcon
            action={
              <Button size="small" onClick={handleRefresh}>
                Try Again
              </Button>
            }
          />
        </Content>
      </Layout>
    );
  }

  if (!order) {
    return (
      <Layout style={{ minHeight: "100vh" }}>
        <Content style={{ padding: "24px", background: "#f5f5f5" }}>
          <Alert
            message="Order Not Found"
            description="The order you're looking for doesn't exist."
            type="warning"
            showIcon
            action={
              <Button size="small" onClick={() => navigate("/manager/orders")}>
                Back to Orders
              </Button>
            }
          />
        </Content>
      </Layout>
    );
  }

  const getCustomerName = (customerInfo) => {
    if (typeof customerInfo === "object" && customerInfo?.fullName) {
      return customerInfo.fullName;
    }
    if (typeof customerInfo === "string") {
      return customerInfo;
    }
    return order.customerAccountNumber || "Unknown Customer";
  };

  const customerName = getCustomerName(order.customer || order.customerName);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Content style={{ padding: "24px", background: "#f5f5f5" }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={16}>
            <Card
              title={
                <Space>
                  <ShoppingCartOutlined />
                  <span>Order Information</span>
                </Space>
              }
              extra={
                <Space>
                  <Button
                    type="default"
                    icon={<ReloadOutlined />}
                    onClick={handleRefresh}
                  >
                    Refresh
                  </Button>
                  <Button
                    type="primary"
                    icon={<DownloadOutlined />}
                    onClick={handleDownloadInvoice}
                  >
                    Download Invoice
                  </Button>
                </Space>
              }
            >
              <Descriptions column={2} bordered>
                <Descriptions.Item label="Order Number">
                  <Text strong style={{ color: "#1890ff" }}>
                    {order.orderNumber || order.id}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label="Order Date">
                  <Space>
                    <CalendarOutlined />
                    {dayjs(order.orderDate || order.createdAt).format(
                      "MMMM DD, YYYY"
                    )}
                  </Space>
                </Descriptions.Item>
                <Descriptions.Item label="Customer">
                  <Space>
                    <UserOutlined />
                    <div>
                      <Text strong>{customerName}</Text>
                      <br />
                      <Text type="secondary" style={{ fontSize: "12px" }}>
                        {order.customerAccountNumber ||
                          order.customer?.accountNumber ||
                          "N/A"}
                      </Text>
                    </div>
                  </Space>
                </Descriptions.Item>
                <Descriptions.Item label="Total Amount">
                  <Text strong style={{ fontSize: "18px", color: "#1890ff" }}>
                    {formatBookPrice(order.totalAmount)}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label="Order Status">
                  <Tag
                    color={
                      ORDER_STATUS_COLORS[order.orderStatus || order.status] ||
                      "default"
                    }
                    style={{ fontSize: "14px" }}
                  >
                    {ORDER_STATUS_LABELS[order.orderStatus || order.status] ||
                      order.orderStatus ||
                      order.status ||
                      "Unknown"}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Payment Status">
                  <Tag
                    color={
                      PAYMENT_STATUS_COLORS[order.paymentStatus] || "default"
                    }
                    style={{ fontSize: "14px" }}
                  >
                    {order.paymentStatus || "PENDING"}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Order Type">
                  <Tag
                    color={
                      (order.orderType || order.type) === "IN_STORE"
                        ? "purple"
                        : "green"
                    }
                  >
                    {order.orderType || order.type || "ONLINE"}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Delivery Address">
                  <Space>
                    <EnvironmentOutlined />
                    <Text>
                      {order.address || order.deliveryAddress || "N/A"}
                    </Text>
                  </Space>
                </Descriptions.Item>
              </Descriptions>
            </Card>

            <Card title="Order Items" style={{ marginTop: 16 }}>
              {(!order.orderItems && !order.items && !order.orderItemList) ||
              (order.orderItems || order.items || order.orderItemList || [])
                .length === 0 ? (
                <Alert
                  message="No Order Items Found"
                  description="This order doesn't have any items or the items data is not available."
                  type="warning"
                  showIcon
                />
              ) : (
                <Table
                  columns={orderItemColumns}
                  dataSource={
                    order.orderItems || order.items || order.orderItemList || []
                  }
                  rowKey={(record) =>
                    record.id ||
                    record.orderItemId ||
                    record.bookId ||
                    Math.random()
                  }
                  pagination={false}
                  summary={(pageData) => {
                    console.log("Table summary pageData:", pageData);
                    const totalItems = pageData.reduce((total, item) => {
                      const quantity = item.quantity || item.qty || 1;
                      return total + quantity;
                    }, 0);

                    return (
                      <Table.Summary fixed>
                        <Table.Summary.Row>
                          <Table.Summary.Cell index={0}>
                            <Text strong>Total</Text>
                          </Table.Summary.Cell>
                          <Table.Summary.Cell index={1}>
                            <Text strong>{totalItems} items</Text>
                          </Table.Summary.Cell>
                          <Table.Summary.Cell index={2} />
                          <Table.Summary.Cell index={3}>
                            <Text
                              strong
                              style={{ color: "#1890ff", fontSize: "16px" }}
                            >
                              {formatBookPrice(
                                order.totalAmount || order.total || 0
                              )}
                            </Text>
                          </Table.Summary.Cell>
                        </Table.Summary.Row>
                      </Table.Summary>
                    );
                  }}
                />
              )}
            </Card>
          </Col>

          <Col xs={24} lg={8}>
            <Card title="Order Timeline" style={{ height: "fit-content" }}>
              <Space direction="vertical" style={{ width: "100%" }}>
                <div>
                  <Text strong>Order Placed</Text>
                  <br />
                  <Text type="secondary">
                    {dayjs(order.orderDate || order.createdAt).format(
                      "MMM DD, YYYY h:mm A"
                    )}
                  </Text>
                </div>

                <Divider />

                <div>
                  <Text strong>Current Status</Text>
                  <br />
                  <Tag
                    color={
                      ORDER_STATUS_COLORS[order.orderStatus || order.status] ||
                      "default"
                    }
                    style={{ fontSize: "14px", marginTop: 4 }}
                  >
                    {ORDER_STATUS_LABELS[order.orderStatus || order.status] ||
                      order.orderStatus ||
                      order.status ||
                      "Unknown"}
                  </Tag>
                </div>

                {(order.orderType === "IN_STORE" ||
                  order.type === "IN_STORE") && (
                  <>
                    <Divider />
                    <Alert
                      message="In-Store Order"
                      description="This order was created in-store and can be fulfilled immediately."
                      type="info"
                      showIcon
                    />
                  </>
                )}
              </Space>
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default ManagerInStoreOrderDetails;
