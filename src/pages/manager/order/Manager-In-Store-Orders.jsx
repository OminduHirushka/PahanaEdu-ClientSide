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
  DatePicker,
  Statistic,
} from "antd";
import {
  SearchOutlined,
  EyeOutlined,
  EditOutlined,
  ArrowLeftOutlined,
  ReloadOutlined,
  FilterOutlined,
  ShopOutlined,
  DollarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers } from "../../../state/user/userAction";
import { getAllEmployeeOrders, updateEmployeeOrderStatus } from "../../../state/order/employeeOrderAction";
import { updatePaymentStatus } from "../../../state/order/orderAction";
import {
  ORDER_STATUS,
  ORDER_STATUS_LABELS,
  ORDER_STATUS_COLORS,
  PAYMENT_STATUS_LABELS,
  PAYMENT_STATUS_COLORS,
} from "../../../utils/orderConstants";
import dayjs from "dayjs";
import { generateInvoicePDF } from "../../../utils/pdfUtils";

const { Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const ManagerInStoreOrders = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("");
  const [employeeFilter, setEmployeeFilter] = useState("");
  const [dateRange, setDateRange] = useState([]);
  const [isStatusModalVisible, setIsStatusModalVisible] = useState(false);
  const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [newPaymentStatus, setNewPaymentStatus] = useState("");
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);
  const [paymentUpdateLoading, setPaymentUpdateLoading] = useState(false);

  const { users = [] } = useSelector((state) => state.user || {});

  useEffect(() => {
    dispatch(getAllUsers());
    fetchOrders();
  }, [dispatch]);

  useEffect(() => {
    applyFilters();
  }, [orders, searchText, statusFilter, paymentStatusFilter, employeeFilter, dateRange]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const ordersData = await dispatch(getAllEmployeeOrders());
      setOrders(ordersData);
    } catch (error) {
      console.error("Failed to fetch employee orders:", error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...orders];

    if (searchText) {
      filtered = filtered.filter(order =>
        order.orderNumber?.toLowerCase().includes(searchText.toLowerCase()) ||
        order.customerName?.toLowerCase().includes(searchText.toLowerCase()) ||
        order.customerPhone?.toLowerCase().includes(searchText.toLowerCase()) ||
        order.createdByName?.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (statusFilter) {
      filtered = filtered.filter(order => order.orderStatus === statusFilter);
    }

    // Payment status filter
    if (paymentStatusFilter) {
      filtered = filtered.filter(order => order.paymentStatus === paymentStatusFilter);
    }

    // Employee filter
    if (employeeFilter) {
      filtered = filtered.filter(order => order.createdBy === employeeFilter);
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

  const handlePaymentUpdate = (order) => {
    setSelectedOrder(order);
    setNewPaymentStatus(order.paymentStatus);
    setIsPaymentModalVisible(true);
  };

  const confirmStatusUpdate = async () => {
    if (!selectedOrder || !newStatus) return;

    setStatusUpdateLoading(true);
    try {
      await dispatch(updateEmployeeOrderStatus(selectedOrder.id, newStatus));
      
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

  const confirmPaymentUpdate = async () => {
    if (!selectedOrder || !newPaymentStatus) return;

    setPaymentUpdateLoading(true);
    try {
      await dispatch(updatePaymentStatus(selectedOrder.id, newPaymentStatus));
      
      // Update the local state
      const updatedOrders = orders.map(order => 
        order.id === selectedOrder.id 
          ? { ...order, paymentStatus: newPaymentStatus }
          : order
      );
      setOrders(updatedOrders);
      
      setIsPaymentModalVisible(false);
      setSelectedOrder(null);
      setNewPaymentStatus("");
    } catch (error) {
      console.error("Failed to update payment status:", error);
    } finally {
      setPaymentUpdateLoading(false);
    }
  };

  const handleViewOrder = (orderId) => {
    navigate(`/manager/in-store-orders/${orderId}`);
  };

  const handleGenerateInvoice = async (order) => {
    try {
      const customerData = {
        fullName: order.customerName || "Walk-in Customer",
        phone: order.customerPhone || "",
        email: order.customerEmail || "",
        address: order.customerAddress || ""
      };

      await generateInvoicePDF(order, customerData);
      message.success("Invoice generated successfully");
    } catch (error) {
      console.error("Failed to generate invoice:", error);
      message.error("Failed to generate invoice");
    }
  };

  const getEmployeeName = (employeeId) => {
    const employee = users.find(user => user.id === employeeId);
    return employee?.fullName || employeeId;
  };

  const getEmployeeList = () => {
    return users.filter(user => user.role === "EMPLOYEE" || user.role === "MANAGER");
  };

  const getStatusOptions = (currentStatus) => {
    const statusFlow = {
      [ORDER_STATUS.PENDING]: [ORDER_STATUS.PROCESSING, ORDER_STATUS.CANCELLED],
      [ORDER_STATUS.PROCESSING]: [ORDER_STATUS.COMPLETED, ORDER_STATUS.CANCELLED],
      [ORDER_STATUS.COMPLETED]: [],
      [ORDER_STATUS.CANCELLED]: [],
    };

    const availableStatuses = statusFlow[currentStatus] || [];
    return [currentStatus, ...availableStatuses];
  };

  const getOrderStats = () => {
    const totalOrders = filteredOrders.length;
    const totalRevenue = filteredOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    const completedOrders = filteredOrders.filter(order => order.orderStatus === ORDER_STATUS.COMPLETED).length;
    const pendingOrders = filteredOrders.filter(order => order.orderStatus === ORDER_STATUS.PENDING).length;

    return { totalOrders, totalRevenue, completedOrders, pendingOrders };
  };

  const stats = getOrderStats();

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
          <Text strong>{record.customerName || "Walk-in Customer"}</Text>
          <br />
          {record.customerPhone && (
            <Text type="secondary" style={{ fontSize: "12px" }}>
              {record.customerPhone}
            </Text>
          )}
        </div>
      ),
    },
    {
      title: "Created By",
      key: "createdBy",
      width: 150,
      render: (_, record) => (
        <div>
          <Text>{getEmployeeName(record.createdBy)}</Text>
          <br />
          <Tag color="blue" size="small">
            {record.createdByRole || "EMPLOYEE"}
          </Tag>
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
      width: 130,
      render: (status) => (
        <Tag color={ORDER_STATUS_COLORS[status] || "default"}>
          {ORDER_STATUS_LABELS[status] || status}
        </Tag>
      ),
    },
    {
      title: "Payment Status",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      width: 130,
      render: (status) => (
        <Tag color={PAYMENT_STATUS_COLORS[status] || "default"}>
          {PAYMENT_STATUS_LABELS[status] || status}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      fixed: "right",
      width: 200,
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
          <Tooltip title="Update Order Status">
            <Button
              type="default"
              size="small"
              icon={<EditOutlined />}
              onClick={() => handleStatusUpdate(record)}
              disabled={record.orderStatus === ORDER_STATUS.COMPLETED || record.orderStatus === ORDER_STATUS.CANCELLED}
            />
          </Tooltip>
          <Tooltip title="Update Payment Status">
            <Button
              type="default"
              size="small"
              icon={<DollarOutlined />}
              onClick={() => handlePaymentUpdate(record)}
              disabled={record.paymentStatus === "PAID"}
            />
          </Tooltip>
          <Tooltip title="Generate Invoice">
            <Button
              type="primary"
              size="small"
              ghost
              onClick={() => handleGenerateInvoice(record)}
            >
              PDF
            </Button>
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
                  onClick={() => navigate("/manager/")}
                >
                  Back to Dashboard
                </Button>
                <Title level={2} style={{ margin: 0 }}>
                  In-Store Orders Management
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

        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Total Orders"
                value={stats.totalOrders}
                prefix={<ShopOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Total Revenue"
                value={stats.totalRevenue}
                prefix="Rs."
                suffix=""
                valueStyle={{ color: '#3f8600' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Completed"
                value={stats.completedOrders}
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Pending"
                value={stats.pendingOrders}
                prefix={<ClockCircleOutlined />}
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
          </Col>
        </Row>

        <Card style={{ marginBottom: 16 }}>
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} sm={12} md={5}>
              <Input
                placeholder="Search orders..."
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                allowClear
              />
            </Col>
            <Col xs={24} sm={12} md={3}>
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
            <Col xs={24} sm={12} md={3}>
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
            <Col xs={24} sm={12} md={4}>
              <Select
                placeholder="Created By"
                style={{ width: "100%" }}
                value={employeeFilter}
                onChange={setEmployeeFilter}
                allowClear
              >
                {getEmployeeList().map(employee => (
                  <Option key={employee.id} value={employee.id}>
                    {employee.fullName}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col xs={24} sm={12} md={5}>
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
                  setEmployeeFilter("");
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
                Showing {filteredOrders.length} of {orders.length} in-store orders
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
            scroll={{ x: 1400 }}
          />
        </Card>

        {/* Order Status Update Modal */}
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
                <Text>{selectedOrder.customerName || "Walk-in Customer"}</Text>
              </div>
              <div>
                <Text strong>Created By: </Text>
                <Text>{getEmployeeName(selectedOrder.createdBy)}</Text>
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

        {/* Payment Status Update Modal */}
        <Modal
          title="Update Payment Status"
          open={isPaymentModalVisible}
          onCancel={() => {
            setIsPaymentModalVisible(false);
            setSelectedOrder(null);
            setNewPaymentStatus("");
          }}
          footer={[
            <Button
              key="cancel"
              onClick={() => {
                setIsPaymentModalVisible(false);
                setSelectedOrder(null);
                setNewPaymentStatus("");
              }}
            >
              Cancel
            </Button>,
            <Button
              key="confirm"
              type="primary"
              loading={paymentUpdateLoading}
              onClick={confirmPaymentUpdate}
              disabled={!newPaymentStatus || newPaymentStatus === selectedOrder?.paymentStatus}
            >
              Update Payment Status
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
                <Text>{selectedOrder.customerName || "Walk-in Customer"}</Text>
              </div>
              <div>
                <Text strong>Created By: </Text>
                <Text>{getEmployeeName(selectedOrder.createdBy)}</Text>
              </div>
              <div>
                <Text strong>Total Amount: </Text>
                <Text>Rs. {selectedOrder.totalAmount?.toLocaleString() || "0"}</Text>
              </div>
              <div>
                <Text strong>Current Payment Status: </Text>
                <Tag color={PAYMENT_STATUS_COLORS[selectedOrder.paymentStatus]}>
                  {PAYMENT_STATUS_LABELS[selectedOrder.paymentStatus]}
                </Tag>
              </div>
              <div>
                <Text strong>New Payment Status: </Text>
                <Select
                  style={{ width: "100%", marginTop: 8 }}
                  value={newPaymentStatus}
                  onChange={setNewPaymentStatus}
                >
                  <Option value="PENDING">
                    <Tag color="orange">Pending</Tag>
                  </Option>
                  <Option value="PAID">
                    <Tag color="green">Paid</Tag>
                  </Option>
                  <Option value="CANCELLED">
                    <Tag color="red">Cancelled</Tag>
                  </Option>
                </Select>
              </div>
            </Space>
          )}
        </Modal>
      </Content>
    </Layout>
  );
};

export default ManagerInStoreOrders;
