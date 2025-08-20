import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Card,
  Table,
  Tag,
  Button,
  Space,
  Select,
  message,
  Modal,
  Typography,
} from "antd";
import { EyeOutlined } from "@ant-design/icons";
import {
  getAllOrders,
  updateOrderStatus,
  updatePaymentStatus,
} from "../../state/order/orderAction";
import {
  ORDER_STATUS,
  PAYMENT_STATUS,
  ORDER_STATUS_COLORS,
  PAYMENT_STATUS_COLORS,
  ORDER_STATUS_LABELS,
  PAYMENT_STATUS_LABELS,
} from "../../utils/orderConstants";

const { Title } = Typography;
const { Option } = Select;
const { confirm } = Modal;

const OnlineOrders = () => {
  const dispatch = useDispatch();
  const { orders, isLoading } = useSelector((state) => state.order);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [localOrderStatuses, setLocalOrderStatuses] = useState({});
  const [localPaymentStatuses, setLocalPaymentStatuses] = useState({});
  const [pendingOrderStatusChanges, setPendingOrderStatusChanges] = useState(
    {}
  );
  const [pendingPaymentStatusChanges, setPendingPaymentStatusChanges] =
    useState({});

  useEffect(() => {
    dispatch(getAllOrders());
  }, [dispatch]);

  const getStatusColor = (status) => {
    return ORDER_STATUS_COLORS[status] || "default";
  };

  const getPaymentStatusColor = (status) => {
    return PAYMENT_STATUS_COLORS[status] || "default";
  };

  const handleStatusSelection = (record, newStatus) => {
    const orderId = record.id || record.orderNumber;

    setLocalOrderStatuses((prev) => ({
      ...prev,
      [orderId]: newStatus,
    }));

    setPendingOrderStatusChanges((prev) => ({
      ...prev,
      [orderId]: { oldStatus: record.orderStatus, newStatus, record },
    }));
  };

  const handlePaymentSelection = (record, newPaymentStatus) => {
    const orderId = record.id || record.orderNumber;

    setLocalPaymentStatuses((prev) => ({
      ...prev,
      [orderId]: newPaymentStatus,
    }));

    setPendingPaymentStatusChanges((prev) => ({
      ...prev,
      [orderId]: {
        oldStatus: record.paymentStatus,
        newStatus: newPaymentStatus,
        record,
      },
    }));
  };

  const confirmOrderStatusUpdate = (orderId) => {
    const pendingChange = pendingOrderStatusChanges[orderId];
    if (!pendingChange) {
      message.error("No pending changes found!");
      return;
    }

    const { newStatus } = pendingChange;

    confirm({
      title: "Confirm Order Status Update",
      content: `Are you sure you want to change the order status to "${
        ORDER_STATUS_LABELS[newStatus] || newStatus
      }"?`,
      onOk() {
        message.loading({ content: "Updating order status...", key: orderId });

        dispatch(updateOrderStatus(orderId, newStatus))
          .then(() => {
            message.success({
              content: "Order status updated and confirmed!",
              key: orderId,
            });

            dispatch(getAllOrders());

            setLocalOrderStatuses((prev) => {
              const newState = { ...prev };
              delete newState[orderId];
              return newState;
            });
            setPendingOrderStatusChanges((prev) => {
              const newState = { ...prev };
              delete newState[orderId];
              return newState;
            });
          })
          .catch((error) => {
            message.error({
              content: `Failed to update status: ${
                error.response?.data?.message || error.message
              }`,
              key: orderId,
            });
            setLocalOrderStatuses((prev) => {
              const newState = { ...prev };
              delete newState[orderId];
              return newState;
            });
            setPendingOrderStatusChanges((prev) => {
              const newState = { ...prev };
              delete newState[orderId];
              return newState;
            });
          });
      },
      onCancel() {
        setLocalOrderStatuses((prev) => {
          const newState = { ...prev };
          delete newState[orderId];
          return newState;
        });
        setPendingOrderStatusChanges((prev) => {
          const newState = { ...prev };
          delete newState[orderId];
          return newState;
        });
      },
    });
  };

  const confirmPaymentStatusUpdate = (orderId) => {
    const pendingChange = pendingPaymentStatusChanges[orderId];
    if (!pendingChange) {
      message.error("No pending payment changes found!");
      return;
    }

    const { newStatus, record } = pendingChange;

    confirm({
      title: "Confirm Payment Status Update",
      content: `Are you sure you want to change the payment status to "${
        PAYMENT_STATUS_LABELS[newStatus] || newStatus
      }"?`,
      onOk() {
        message.loading({
          content: "Updating payment status...",
          key: `payment-${orderId}`,
        });

        dispatch(updatePaymentStatus(orderId, newStatus))
          .then((response) => {
            message.success({
              content: "Payment status updated and confirmed!",
              key: `payment-${orderId}`,
            });

            dispatch(getAllOrders());

            setLocalPaymentStatuses((prev) => {
              const newState = { ...prev };
              delete newState[orderId];
              return newState;
            });
            setPendingPaymentStatusChanges((prev) => {
              const newState = { ...prev };
              delete newState[orderId];
              return newState;
            });
          })
          .catch((error) => {
            message.error({
              content: `Failed to update payment status: ${
                error.response?.data?.message || error.message
              }`,
              key: `payment-${orderId}`,
            });
            setLocalPaymentStatuses((prev) => {
              const newState = { ...prev };
              delete newState[orderId];
              return newState;
            });
            setPendingPaymentStatusChanges((prev) => {
              const newState = { ...prev };
              delete newState[orderId];
              return newState;
            });
          });
      },
      onCancel() {
        setLocalPaymentStatuses((prev) => {
          const newState = { ...prev };
          delete newState[orderId];
          return newState;
        });
        setPendingPaymentStatusChanges((prev) => {
          const newState = { ...prev };
          delete newState[orderId];
          return newState;
        });
      },
    });
  };

  const showOrderDetails = (order) => {
    setSelectedOrder(order);
    setModalVisible(true);
  };

  const columns = [
    {
      title: "Order ID",
      key: "orderId",
      render: (_, record) => `#${record.id || record.orderNumber || "N/A"}`,
      width: 100,
    },
    {
      title: "Customer",
      key: "customerName",
      render: (_, record) => (
        <div>
          <div>
            {record.userName ||
              record.user?.fullName ||
              record.user?.name ||
              "N/A"}
          </div>
          <div style={{ fontSize: "12px", color: "#666" }}>
            {record.userEmail || record.user?.email || "N/A"}
          </div>
        </div>
      ),
    },
    {
      title: "Order Date",
      dataIndex: "createdAt",
      key: "orderDate",
      render: (date) => new Date(date).toLocaleDateString(),
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    },
    {
      title: "Total Amount",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (amount) => `Rs. ${parseFloat(amount).toFixed(2)}`,
      sorter: (a, b) => a.totalAmount - b.totalAmount,
    },
    {
      title: "Order Status",
      dataIndex: "orderStatus",
      key: "orderStatus",
      render: (status, record) => {
        const orderId = record.id || record.orderNumber;
        const currentStatus = localOrderStatuses[orderId] || status;
        const isDisabled =
          currentStatus === ORDER_STATUS.COMPLETED ||
          currentStatus === ORDER_STATUS.CANCELLED;
        const hasPendingChange = pendingOrderStatusChanges[orderId];

        return (
          <div>
            <div style={{ marginBottom: 4 }}>
              <Tag color={getStatusColor(currentStatus)}>
                {ORDER_STATUS_LABELS[currentStatus] || currentStatus}
              </Tag>
              {hasPendingChange && (
                <Button
                  size="small"
                  type="primary"
                  style={{ marginLeft: 4 }}
                  onClick={() => confirmOrderStatusUpdate(orderId)}
                >
                  Confirm
                </Button>
              )}
            </div>
            <Select
              size="small"
              style={{ width: 120 }}
              value={currentStatus}
              onChange={(newStatus) => handleStatusSelection(record, newStatus)}
              disabled={isDisabled}
              placeholder="Select status"
            >
              <Option value={ORDER_STATUS.PENDING}>Pending</Option>
              <Option value={ORDER_STATUS.PROCESSING}>Processing</Option>
              <Option value={ORDER_STATUS.SHIPPED}>Shipped</Option>
              <Option value={ORDER_STATUS.DELIVERED}>Delivered</Option>
              <Option value={ORDER_STATUS.COMPLETED}>Completed</Option>
              <Option value={ORDER_STATUS.CANCELLED}>Cancelled</Option>
            </Select>
          </div>
        );
      },
    },
    {
      title: "Payment Status",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      render: (status, record) => {
        const orderId = record.id || record.orderNumber;
        const orderStatus = localOrderStatuses[orderId] || record.orderStatus;
        // Use local payment status if available, otherwise use the original status
        const currentPaymentStatus = localPaymentStatuses[orderId] || status;
        const isDisabled =
          orderStatus === ORDER_STATUS.COMPLETED ||
          orderStatus === ORDER_STATUS.CANCELLED;
        const hasPendingChange = pendingPaymentStatusChanges[orderId];

        return (
          <div>
            <div style={{ marginBottom: 4 }}>
              <Tag color={getPaymentStatusColor(currentPaymentStatus)}>
                {PAYMENT_STATUS_LABELS[currentPaymentStatus] ||
                  currentPaymentStatus}
              </Tag>
              {hasPendingChange && (
                <Button
                  size="small"
                  type="primary"
                  style={{ marginLeft: 4 }}
                  onClick={() => confirmPaymentStatusUpdate(orderId)}
                >
                  Confirm
                </Button>
              )}
            </div>
            <Select
              size="small"
              style={{ width: 120 }}
              value={currentPaymentStatus}
              onChange={(newPaymentStatus) =>
                handlePaymentSelection(record, newPaymentStatus)
              }
              disabled={isDisabled}
              placeholder="Select status"
            >
              <Option value={PAYMENT_STATUS.PENDING}>Pending</Option>
              <Option value={PAYMENT_STATUS.PAID}>Paid</Option>
              <Option value={PAYMENT_STATUS.CANCELLED}>Cancelled</Option>
            </Select>
          </div>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => showOrderDetails(record)}
          >
            View Details
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: "24px" }}>
      <Title level={2}>Online Orders Management</Title>

      <Card>
        <Table
          columns={columns}
          dataSource={orders}
          rowKey={(record) => record.id || record.orderNumber || Math.random()}
          loading={isLoading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} orders`,
          }}
          scroll={{ x: 1000 }}
        />
      </Card>

      <Modal
        title={`Order Details - #${
          selectedOrder?.id || selectedOrder?.orderNumber || "N/A"
        }`}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={800}
      >
        {selectedOrder && (
          <div>
            <Card
              title="Customer Information"
              size="small"
              style={{ marginBottom: 16 }}
            >
              <p>
                <strong>Account Number:</strong>{" "}
                {selectedOrder.userAccountNumber ||
                  selectedOrder.accountNumber ||
                  selectedOrder.user?.accountNumber ||
                  "N/A"}
              </p>
              <p>
                <strong>Name:</strong>{" "}
                {selectedOrder.userName ||
                  selectedOrder.customerName ||
                  selectedOrder.user?.fullName ||
                  selectedOrder.user?.name ||
                  "N/A"}
              </p>
              <p>
                <strong>Email:</strong>{" "}
                {selectedOrder.userEmail ||
                  selectedOrder.customerEmail ||
                  selectedOrder.user?.email ||
                  "N/A"}
              </p>
              <p>
                <strong>Phone:</strong>{" "}
                {selectedOrder.userPhone ||
                  selectedOrder.customerPhone ||
                  selectedOrder.user?.phone ||
                  "N/A"}
              </p>
            </Card>

            <Card
              title="Shipping Information"
              size="small"
              style={{ marginBottom: 16 }}
            >
              <p>
                <strong>Address:</strong>{" "}
                {selectedOrder.shippingAddress ||
                  selectedOrder.address ||
                  "N/A"}
              </p>
              <p>
                <strong>City:</strong>{" "}
                {selectedOrder.city || selectedOrder.shippingCity || "N/A"}
              </p>
              <p>
                <strong>Postal Code:</strong>{" "}
                {selectedOrder.postalCode || selectedOrder.zipCode || "N/A"}
              </p>
            </Card>

            <Card title="Order Items" size="small" style={{ marginBottom: 16 }}>
              <Table
                size="small"
                dataSource={selectedOrder.orderItems || []}
                rowKey={(record) =>
                  record.id ||
                  record.bookId ||
                  record.orderItemId ||
                  Math.random()
                }
                pagination={false}
                columns={[
                  {
                    title: "Book",
                    render: (_, record) => {
                      const bookTitle =
                        record.bookName ||
                        record.book?.title ||
                        record.bookTitle ||
                        "Unknown Book";
                      const bookAuthor =
                        record.bookAuthor ||
                        record.book?.author ||
                        record.author ||
                        "Unknown Author";
                      return (
                        <div>
                          <div>
                            <strong>{bookTitle}</strong>
                          </div>
                          <div style={{ fontSize: "12px", color: "#666" }}>
                            {bookAuthor}
                          </div>
                        </div>
                      );
                    },
                  },
                  {
                    title: "Quantity",
                    dataIndex: "quantity",
                    key: "quantity",
                    render: (qty) => qty || 0,
                  },
                  {
                    title: "Unit Price",
                    render: (_, record) => {
                      const price = record.unitPrice || record.price || 0;
                      return `Rs. ${parseFloat(price || 0).toFixed(2)}`;
                    },
                  },
                  {
                    title: "Total",
                    key: "itemTotal",
                    render: (_, record) => {
                      const unitPrice = parseFloat(
                        record.unitPrice || record.price || 0
                      );
                      const quantity = record.quantity || 0;
                      return `Rs. ${(unitPrice * quantity).toFixed(2)}`;
                    },
                  },
                ]}
              />
            </Card>

            <Card title="Order Summary" size="small">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <p>
                    <strong>Order Date:</strong>{" "}
                    {new Date(selectedOrder.createdAt).toLocaleString()}
                  </p>
                  <p>
                    <strong>Order Status:</strong>
                    <Tag
                      color={getStatusColor(selectedOrder.orderStatus)}
                      style={{ marginLeft: 8 }}
                    >
                      {selectedOrder.orderStatus?.toUpperCase()}
                    </Tag>
                  </p>
                  <p>
                    <strong>Payment Status:</strong>
                    <Tag
                      color={getPaymentStatusColor(selectedOrder.paymentStatus)}
                      style={{ marginLeft: 8 }}
                    >
                      {selectedOrder.paymentStatus?.toUpperCase()}
                    </Tag>
                  </p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <Title level={4} style={{ margin: 0, color: "#1890ff" }}>
                    Total: Rs.{" "}
                    {parseFloat(selectedOrder.totalAmount).toFixed(2)}
                  </Title>
                </div>
              </div>
            </Card>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default OnlineOrders;
