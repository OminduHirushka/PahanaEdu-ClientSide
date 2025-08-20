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
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers } from "../../../state/user/userAction";
import { getAllEmployeeOrders } from "../../../state/order/employeeOrderAction";
import {
  ORDER_STATUS,
  ORDER_STATUS_LABELS,
  ORDER_STATUS_COLORS,
  PAYMENT_STATUS_LABELS,
  PAYMENT_STATUS_COLORS,
} from "../../../utils/orderConstants";
import { formatBookPrice } from "../../../utils/bookHelpers";
import dayjs from "dayjs";
import { generateInvoicePDF } from "../../../utils/pdfUtils";

const { Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

const AdminInStoreOrders = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { employeeOrders, isLoading } = useSelector(
    (store) => store.employeeOrder
  );
  const { users } = useSelector((store) => store.user);

  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("");
  const [employeeFilter, setEmployeeFilter] = useState("");
  const [dateRange, setDateRange] = useState([]);

  useEffect(() => {
    dispatch(getAllUsers());
    fetchOrders();
  }, [dispatch]);

  useEffect(() => {
    applyFilters();
  }, [
    employeeOrders,
    searchText,
    statusFilter,
    paymentStatusFilter,
    employeeFilter,
    dateRange,
  ]);

  const fetchOrders = async () => {
    try {
      await dispatch(getAllEmployeeOrders());
    } catch (error) {
      console.error("Failed to fetch employee orders:", error);
      message.error("Failed to fetch orders");
    }
  };

  const applyFilters = () => {
    let filtered = Array.isArray(employeeOrders) ? [...employeeOrders] : [];

    if (searchText) {
      filtered = filtered.filter(
        (order) =>
          order.orderNumber?.toLowerCase().includes(searchText.toLowerCase()) ||
          order.customerName
            ?.toLowerCase()
            .includes(searchText.toLowerCase()) ||
          order.customerPhone
            ?.toLowerCase()
            .includes(searchText.toLowerCase()) ||
          order.createdByName?.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (employeeFilter) {
      filtered = filtered.filter(
        (order) =>
          order.createdBy === employeeFilter ||
          order.employeeId === employeeFilter ||
          order.createdByEmployeeId === employeeFilter
      );
    }

    setFilteredOrders(filtered);
  };

  const handleViewOrder = (orderId) => {
    navigate(`/admin/in-store-orders/${orderId}`);
  };

  const handleGenerateInvoice = async (order) => {
    try {
      const customerData = {
        fullName: order.customerName || "Walk-in Customer",
        phone: order.customerPhone || "",
        email: order.customerEmail || "",
        address: order.customerAddress || "",
      };

      await generateInvoicePDF(order, customerData);
      message.success("Invoice generated successfully");
    } catch (error) {
      console.error("Failed to generate invoice:", error);
      message.error("Failed to generate invoice");
    }
  };

  const getEmployeeName = (employeeId) => {
    if (!employeeId || !users.length) {
      return employeeId || "Unknown Employee";
    }

    const employee = users.find(
      (user) =>
        user.id === employeeId ||
        user.accountNumber === employeeId ||
        user.userId === employeeId ||
        user.employeeId === employeeId
    );

    console.log("Found employee:", employee);
    return employee?.fullName || employee?.name || employeeId;
  };

  const getEmployeeList = () => {
    return users.filter(
      (user) => user.role === "EMPLOYEE" || user.role === "MANAGER"
    );
  };

  const getOrderStats = () => {
    const totalOrders = filteredOrders.length;
    const totalRevenue = filteredOrders.reduce(
      (sum, order) => sum + (order.totalAmount || 0),
      0
    );
    const completedOrders = filteredOrders.filter(
      (order) => order.orderStatus === ORDER_STATUS.COMPLETED
    ).length;
    const pendingOrders = filteredOrders.filter(
      (order) => order.orderStatus === ORDER_STATUS.PENDING
    ).length;

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
      render: (_, record) => {
        console.log("Created By record:", record);
        const employeeName =
          record.createdByName ||
          record.employeeName ||
          getEmployeeName(record.createdBy) ||
          getEmployeeName(record.employeeId) ||
          getEmployeeName(record.createdByEmployeeId) ||
          "Unknown Employee";

        return (
          <div>
            <Text>{employeeName}</Text>
            <br />
            <Tag color="blue" size="small">
              {record.createdByRole || record.employeeRole || "EMPLOYEE"}
            </Tag>
          </div>
        );
      },
    },
    {
      title: "Order Date",
      dataIndex: "orderDate",
      key: "orderDate",
      width: 120,
      render: (date) => <Text>{dayjs(date).format("MMM DD, YYYY")}</Text>,
      sorter: (a, b) => dayjs(a.orderDate).unix() - dayjs(b.orderDate).unix(),
    },
    {
      title: "Total Amount",
      dataIndex: "totalAmount",
      key: "totalAmount",
      width: 120,
      render: (amount) => (
        <Text strong style={{ color: "#1890ff" }}>
          {formatBookPrice(amount) || "0"}
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
                  onClick={() => navigate("/admin/")}
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
                loading={isLoading}
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
                valueStyle={{ color: "#1890ff" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Total Revenue"
                value={formatBookPrice(stats.totalRevenue)}
                suffix=""
                valueStyle={{ color: "#3f8600" }}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} md={12}>
            <Card style={{ marginBottom: 16 }}>
              <Row gutter={[16, 16]} align="middle">
                <Col xs={24} sm={12} md={10}>
                  <Input
                    placeholder="Search orders..."
                    prefix={<SearchOutlined />}
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    allowClear
                  />
                </Col>
                <Col xs={24} sm={12} md={10}>
                  <Select
                    placeholder="Created By"
                    style={{ width: "100%" }}
                    value={employeeFilter}
                    onChange={setEmployeeFilter}
                    allowClear
                  >
                    {getEmployeeList().map((employee) => (
                      <Option key={employee.id} value={employee.id}>
                        {employee.fullName}
                      </Option>
                    ))}
                  </Select>
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
                  />
                </Col>
              </Row>
              <Row style={{ marginTop: 16 }}>
                <Col>
                  <Text type="secondary">
                    Showing {filteredOrders.length} of {employeeOrders.length}{" "}
                    in-store orders
                  </Text>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>

        <Card>
          <Table
            columns={columns}
            dataSource={filteredOrders}
            rowKey="id"
            loading={isLoading}
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
      </Content>
    </Layout>
  );
};

export default AdminInStoreOrders;
