import React, { useState, useEffect } from "react";
import {
  Layout,
  Card,
  Table,
  Button,
  Space,
  Typography,
  Input,
  Select,
  Tag,
  Row,
  Col,
  Modal,
  message,
  Tooltip,
  Popconfirm,
  DatePicker,
} from "antd";
import {
  SearchOutlined,
  EyeOutlined,
  EditOutlined,
  ArrowLeftOutlined,
  ReloadOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers } from "../../../state/user/userAction";
import { updateOrderStatus } from "../../../state/order/orderAction";
import {
  ORDER_STATUS,
  ORDER_STATUS_LABELS,
  ORDER_STATUS_COLORS,
  PAYMENT_STATUS_LABELS,
  PAYMENT_STATUS_COLORS,
} from "../../../utils/orderConstants";
import axios from "axios";
import dayjs from "dayjs";

const { Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const EmployeeOrderManagement = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("");
  const [dateRange, setDateRange] = useState([]);
  const [isStatusModalVisible, setIsStatusModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);

  const { users = [] } = useSelector((state) => state.user || {});

  useEffect(() => {
    dispatch(getAllUsers());
    fetchOrders();
  }, [dispatch]);

  useEffect(() => {
    applyFilters();
  }, [orders, searchText, statusFilter, paymentStatusFilter, dateRange]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const baseURL = import.meta.env.VITE_API_URL;
      const token = localStorage.getItem("token");

      const response = await axios.get(`${baseURL}/orders/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const ordersData = Array.isArray(response.data) 
        ? response.data 
        : Array.isArray(response.data.orders) 
        ? response.data.orders 
        : [];

      setOrders(ordersData);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      message.error("Failed to load orders");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...orders];

    // Search filter
    if (searchText) {
      filtered = filtered.filter(order =>
        order.orderNumber?.toLowerCase().includes(searchText.toLowerCase()) ||
        order.customerAccountNumber?.toLowerCase().includes(searchText.toLowerCase()) ||
        order.customerName?.toLowerCase().includes(searchText.toLowerCase()) ||
        order.address?.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter) {
      filtered = filtered.filter(order => order.orderStatus === statusFilter);
    }

    // Payment status filter
    if (paymentStatusFilter) {
      filtered = filtered.filter(order => order.paymentStatus === paymentStatusFilter);
    }

    // Date range filter
    if (dateRange && dateRange.length === 2) {
      const [startDate, endDate] = dateRange;
      filtered = filtered.filter(order => {
        const orderDate = dayjs(order.orderDate);
        return orderDate.isAfter(startDate.startOf('day')) && orderDate.isBefore(endDate.endOf('day'));
      });
    }

    setFilteredOrders(filtered);
  };

  const handleStatusUpdate = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.orderStatus);
    setIsStatusModalVisible(true);
  };

  const confirmStatusUpdate = async () => {
    if (!selectedOrder || !newStatus) return;

    setStatusUpdateLoading(true);
    try {
      await dispatch(updateOrderStatus(selectedOrder.id, newStatus));
      message.success("Order status updated successfully");
      
      // Update the local state
      const updatedOrders = orders.map(order => 
        order.id === selectedOrder.id 
          ? { ...order, orderStatus: newStatus }
          : order
      );
      setOrders(updatedOrders);
      
      setIsStatusModalVisible(false);
      setSelectedOrder(null);
      setNewStatus("");
    } catch (error) {
      console.error("Failed to update order status:", error);
      message.error("Failed to update order status");
    } finally {
      setStatusUpdateLoading(false);
    }
  };

  const handleViewOrder = (orderId) => {
    navigate(`/employee/orders/${orderId}`);
  };

  const getCustomerName = (accountNumber) => {
    const customer = users.find(user => user.accountNumber === accountNumber);
    return customer?.fullName || accountNumber;
  };

  const getStatusOptions = (currentStatus) => {
    const statusFlow = {
      [ORDER_STATUS.PENDING]: [ORDER_STATUS.PROCESSING, ORDER_STATUS.CANCELLED],
      [ORDER_STATUS.PROCESSING]: [ORDER_STATUS.SHIPPED, ORDER_STATUS.COMPLETED, ORDER_STATUS.CANCELLED],
      [ORDER_STATUS.SHIPPED]: [ORDER_STATUS.DELIVERED, ORDER_STATUS.COMPLETED],
      [ORDER_STATUS.DELIVERED]: [ORDER_STATUS.COMPLETED],
      [ORDER_STATUS.COMPLETED]: [],
      [ORDER_STATUS.CANCELLED]: [],
    };

    const availableStatuses = statusFlow[currentStatus] || [];
    return [currentStatus, ...availableStatuses];
  };

  const columns = [
    {
      title: "Order Number",
      dataIndex: "orderNumber",
      key: "orderNumber",
      fixed: "left",
      width: 150,
      render: (orderNumber) => (
        <Text strong style={{ color: "#1890ff" }}>
          {orderNumber}
        </Text>
      ),
    },
    {
      title: "Customer",
      key: "customer",
      width: 200,
      render: (_, record) => (
        <div>
          <Text strong>{getCustomerName(record.customerAccountNumber)}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: "12px" }}>
            {record.customerAccountNumber}
          </Text>
        </div>
      ),
    },
    {
      title: "Order Date",
      dataIndex: "orderDate",
      key: "orderDate",
      width: 120,
      render: (date) => (
        <Text>{dayjs(date).format("MMM DD, YYYY")}</Text>
      ),
      sorter: (a, b) => dayjs(a.orderDate).unix() - dayjs(b.orderDate).unix(),
    },
    {
      title: "Total Amount",
      dataIndex: "totalAmount",
      key: "totalAmount",
      width: 120,
      render: (amount) => (
        <Text strong style={{ color: "#1890ff" }}>
          Rs. {amount?.toLocaleString() || "0"}
        </Text>
      ),
      sorter: (a, b) => (a.totalAmount || 0) - (b.totalAmount || 0),
    },
    {
      title: "Order Status",
      dataIndex: "orderStatus",
      key: "orderStatus",
      width: 120,
      render: (status) => (
        <Tag color={ORDER_STATUS_COLORS[status] || "default"}>
          {ORDER_STATUS_LABELS[status] || status}
        </Tag>
      ),
      filters: Object.keys(ORDER_STATUS).map(key => ({
        text: ORDER_STATUS_LABELS[ORDER_STATUS[key]],
        value: ORDER_STATUS[key],
      })),
      onFilter: (value, record) => record.orderStatus === value,
    },
    {
      title: "Payment Status",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      width: 120,
      render: (status) => (
        <Tag color={PAYMENT_STATUS_COLORS[status] || "default"}>
          {PAYMENT_STATUS_LABELS[status] || status}
        </Tag>
      ),
    },
    {
      title: "Order Type",
      dataIndex: "orderType",
      key: "orderType",
      width: 100,
      render: (type) => (
        <Tag color={type === "IN_STORE" ? "purple" : "green"}>
          {type || "ONLINE"}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      fixed: "right",
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="View Details">
            <Button
              type="primary"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => handleViewOrder(record.id)}
            />
          </Tooltip>
          <Tooltip title="Update Status">
            <Button
              type="default"
              size="small"
              icon={<EditOutlined />}
              onClick={() => handleStatusUpdate(record)}
              disabled={record.orderStatus === ORDER_STATUS.COMPLETED || record.orderStatus === ORDER_STATUS.CANCELLED}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Content style={{ padding: "24px", background: "#f5f5f5" }}>
        <Card style={{ marginBottom: 24 }}>
          <Row justify="space-between" align="middle">
            <Col>
              <Space>
                <Button
                  icon={<ArrowLeftOutlined />}
                  onClick={() => navigate("/employee/")}
                >
                  Back to Dashboard
                </Button>
                <Title level={2} style={{ margin: 0 }}>
                  Order Management
                </Title>
              </Space>
            </Col>
            <Col>
              <Button
                type="primary"
                icon={<ReloadOutlined />}
                onClick={fetchOrders}
                loading={loading}
              >
                Refresh
              </Button>
            </Col>
          </Row>
        </Card>

        <Card style={{ marginBottom: 16 }}>
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} sm={12} md={6}>
              <Input
                placeholder="Search orders..."
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                allowClear
              />
            </Col>
            <Col xs={24} sm={12} md={4}>
              <Select
                placeholder="Order Status"
                style={{ width: "100%" }}
                value={statusFilter}
                onChange={setStatusFilter}
                allowClear
              >
                {Object.keys(ORDER_STATUS).map(key => (
                  <Option key={ORDER_STATUS[key]} value={ORDER_STATUS[key]}>
                    {ORDER_STATUS_LABELS[ORDER_STATUS[key]]}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col xs={24} sm={12} md={4}>
              <Select
                placeholder="Payment Status"
                style={{ width: "100%" }}
                value={paymentStatusFilter}
                onChange={setPaymentStatusFilter}
                allowClear
              >
                <Option value="PENDING">Pending</Option>
                <Option value="PAID">Paid</Option>
                <Option value="CANCELLED">Cancelled</Option>
              </Select>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <RangePicker
                style={{ width: "100%" }}
                value={dateRange}
                onChange={setDateRange}
                placeholder={["Start Date", "End Date"]}
              />
            </Col>
            <Col xs={24} sm={12} md={4}>
              <Button
                icon={<FilterOutlined />}
                onClick={() => {
                  setSearchText("");
                  setStatusFilter("");
                  setPaymentStatusFilter("");
                  setDateRange([]);
                }}
              >
                Clear Filters
              </Button>
            </Col>
          </Row>
          <Row style={{ marginTop: 16 }}>
            <Col>
              <Text type="secondary">
                Showing {filteredOrders.length} of {orders.length} orders
              </Text>
            </Col>
          </Row>
        </Card>

        <Card>
          <Table
            columns={columns}
            dataSource={filteredOrders}
            rowKey="id"
            loading={loading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} orders`,
            }}
            scroll={{ x: 1200 }}
          />
        </Card>

        <Modal
          title="Update Order Status"
          open={isStatusModalVisible}
          onCancel={() => {
            setIsStatusModalVisible(false);
            setSelectedOrder(null);
            setNewStatus("");
          }}
          footer={[
            <Button
              key="cancel"
              onClick={() => {
                setIsStatusModalVisible(false);
                setSelectedOrder(null);
                setNewStatus("");
              }}
            >
              Cancel
            </Button>,
            <Button
              key="confirm"
              type="primary"
              loading={statusUpdateLoading}
              onClick={confirmStatusUpdate}
              disabled={!newStatus || newStatus === selectedOrder?.orderStatus}
            >
              Update Status
            </Button>,
          ]}
        >
          {selectedOrder && (
            <Space direction="vertical" style={{ width: "100%" }}>
              <div>
                <Text strong>Order Number: </Text>
                <Text>{selectedOrder.orderNumber}</Text>
              </div>
              <div>
                <Text strong>Customer: </Text>
                <Text>{getCustomerName(selectedOrder.customerAccountNumber)}</Text>
              </div>
              <div>
                <Text strong>Current Status: </Text>
                <Tag color={ORDER_STATUS_COLORS[selectedOrder.orderStatus]}>
                  {ORDER_STATUS_LABELS[selectedOrder.orderStatus]}
                </Tag>
              </div>
              <div>
                <Text strong>New Status: </Text>
                <Select
                  style={{ width: "100%", marginTop: 8 }}
                  value={newStatus}
                  onChange={setNewStatus}
                >
                  {getStatusOptions(selectedOrder.orderStatus).map(status => (
                    <Option key={status} value={status}>
                      <Tag color={ORDER_STATUS_COLORS[status]}>
                        {ORDER_STATUS_LABELS[status]}
                      </Tag>
                    </Option>
                  ))}
                </Select>
              </div>
            </Space>
          )}
        </Modal>
      </Content>
    </Layout>
  );
};

export default EmployeeOrderManagement;
