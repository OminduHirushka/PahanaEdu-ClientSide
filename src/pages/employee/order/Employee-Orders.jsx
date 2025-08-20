import React, { useEffect, useState } from "react";
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
  Input,
  Select,
  DatePicker,
  Tooltip,
  message,
  Result,
} from "antd";
import {
  ShoppingCartOutlined,
  EyeOutlined,
  DownloadOutlined,
  SearchOutlined,
  ArrowLeftOutlined,
  FilterOutlined,
  ReloadOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getEmployeeOrdersByEmployee } from "../../../state/order/employeeOrderAction";
import { clearEmployeeOrderMessages } from "../../../state/order/employeeOrderSlice";
import { getCurrentLoggedUser, getUserByAccountNumber } from "../../../state/user/userAction";
import {
  ORDER_STATUS_COLORS,
  PAYMENT_STATUS_COLORS,
} from "../../../utils/orderConstants";
import { formatBookPrice } from "../../../utils/bookHelpers";
import { generateInvoicePDF } from "../../../utils/pdfUtils";
import dayjs from "dayjs";

const { Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const EmployeeOrders = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("");
  const [dateRange, setDateRange] = useState(null);
  const [filteredOrders, setFilteredOrders] = useState([]);

  const { employeeOrdersByEmployee = [], isLoading, error } = useSelector((state) => state.employeeOrder);
  const { user } = useSelector((state) => state.auth || {});
  const { user: currentUser, users = [] } = useSelector((state) => state.user || {});
  
  const displayUser = user || currentUser;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          message.error("Authentication required. Please log in again.");
          navigate("/auth/login");
          return;
        }

        let employeeData = displayUser;
        
        if (!employeeData || (!employeeData.id && !employeeData.accountNumber)) {
          try {
            const userData = await dispatch(getCurrentLoggedUser());
            employeeData = userData;
          } catch (authError) {
            message.error("Authentication failed. Please log in again.");
            navigate("/auth/login");
            return;
          }
        }

        if (employeeData.accountNumber && !employeeData.id) {
          if (users && users.length > 0) {
            const employeeFromList = users.find(u => u.accountNumber === employeeData.accountNumber);
            if (employeeFromList && employeeFromList.id) {
              employeeData = { ...employeeData, id: employeeFromList.id };
            }
          }
          
          if (!employeeData.id) {
            try {
              const employeeFromAPI = await dispatch(getUserByAccountNumber(employeeData.accountNumber));
              if (employeeFromAPI && employeeFromAPI.id) {
                employeeData = { ...employeeData, id: employeeFromAPI.id };
              }
            } catch (error) {
              console.error("Failed to fetch employee by account number:", error);
            }
          }
        }

        if (employeeData?.accountNumber) {
          await dispatch(getEmployeeOrdersByEmployee(employeeData.accountNumber));
        } else {
          message.error("Unable to load orders. Employee account number not found. Please contact your administrator.");
        }
      } catch (error) {
        if (error.message === "No token found") {
          message.error("Please log in to continue.");
          navigate("/auth/login");
        } else {
          message.error("Failed to load employee orders");
        }
      }
    };

    fetchData();
    
    return () => {
      dispatch(clearEmployeeOrderMessages());
    };
  }, [dispatch, navigate, displayUser, users]);

  useEffect(() => {
    let filtered = [...employeeOrdersByEmployee];

    if (searchText) {
      filtered = filtered.filter(
        (order) =>
          order?.orderNumber?.toLowerCase().includes(searchText.toLowerCase()) ||
          order?.customerName?.toLowerCase().includes(searchText.toLowerCase()) ||
          order?.customerAccountNumber?.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (statusFilter) {
      filtered = filtered.filter((order) => order?.orderStatus === statusFilter);
    }

    if (paymentFilter) {
      filtered = filtered.filter((order) => order?.paymentStatus === paymentFilter);
    }

    if (dateRange && dateRange[0] && dateRange[1]) {
      filtered = filtered.filter((order) => {
        const orderDate = dayjs(order?.createdAt);
        return orderDate.isAfter(dateRange[0].startOf('day')) && 
               orderDate.isBefore(dateRange[1].endOf('day'));
      });
    }

    setFilteredOrders(filtered);
  }, [employeeOrdersByEmployee, searchText, statusFilter, paymentFilter, dateRange]);

  const handleViewDetails = (orderId) => {
    navigate(`/employee/orders/${orderId}`);
  };

  const handleDownloadInvoice = async (order) => {
    try {
      await generateInvoicePDF(order);
      message.success("Invoice downloaded successfully!");
    } catch (error) {
      message.error("Failed to download invoice");
    }
  };

  const handleRefresh = async () => {
    if (currentUser?.accountNumber) {
      try {
        await dispatch(getEmployeeOrdersByEmployee(currentUser.accountNumber));
        message.success("Employee orders refreshed successfully!");
      } catch (error) {
        message.error("Failed to refresh employee orders");
      }
    }
  };

  const clearFilters = () => {
    setSearchText("");
    setStatusFilter("");
    setPaymentFilter("");
    setDateRange(null);
  };

  const columns = [
    {
      title: "Order #",
      dataIndex: "orderNumber",
      key: "orderNumber",
      width: 140,
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
        <Space direction="vertical" size="small">
          <Text strong>{record?.customerName || "Unknown"}</Text>
          <Text type="secondary" style={{ fontSize: "12px" }}>
            {record?.customerAccountNumber}
          </Text>
        </Space>
      ),
    },
    {
      title: "Order Type",
      key: "orderType", 
      width: 120,
      render: () => (
        <Tag color="purple">
          In-Store
        </Tag>
      ),
    },
    {
      title: "Total Amount",
      key: "totalAmount",
      width: 120,
      render: (_, record) => (
        <Text strong style={{ color: "#52c41a" }}>
          {formatBookPrice(record?.totalAmount || 0)}
        </Text>
      ),
      sorter: (a, b) => (a?.totalAmount || 0) - (b?.totalAmount || 0),
    },
    {
      title: "Order Status",
      dataIndex: "orderStatus",
      key: "orderStatus",
      width: 130,
      render: (orderStatus) => (
        <Tag color={ORDER_STATUS_COLORS[orderStatus] || "default"}>
          {orderStatus?.replace("_", " ")}
        </Tag>
      ),
      filters: [
        { text: "Pending", value: "PENDING" },
        { text: "Completed", value: "COMPLETED" },
        { text: "Cancelled", value: "CANCELLED" },
      ],
    },
    {
      title: "Payment Status",
      key: "paymentStatus",
      width: 130,
      render: (_, record) => {
        const paymentStatus = record?.paymentStatus;
        return (
          <Tag color={PAYMENT_STATUS_COLORS[paymentStatus] || "default"}>
            {paymentStatus?.replace("_", " ") || "N/A"}
          </Tag>
        );
      },
      filters: [
        { text: "Pending", value: "PENDING" },
        { text: "Paid", value: "PAID" },
        { text: "Cancelled", value: "CANCELLED" },
      ],
    },
    {
      title: "Order Date",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 120,
      render: (createdAt) => (
        <Space direction="vertical" size="small">
          <Text>{dayjs(createdAt).format("MMM DD, YYYY")}</Text>
          <Text type="secondary" style={{ fontSize: "12px" }}>
            {dayjs(createdAt).format("hh:mm A")}
          </Text>
        </Space>
      ),
      sorter: (a, b) => dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
      defaultSortOrder: "descend",
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      fixed: "right",
      render: (_, record) => (
        <Space>
          <Tooltip title="View Details">
            <Button
              type="primary"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => handleViewDetails(record.id)}
            />
          </Tooltip>
          <Tooltip title="Download Invoice">
            <Button
              size="small"
              icon={<DownloadOutlined />}
              onClick={() => handleDownloadInvoice(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  if (error) {
    return (
      <Layout style={{ minHeight: "100vh" }}>
        <Content style={{ padding: "24px" }}>
          <Card>
            <Result
              status="error"
              title="Failed to Load Orders"
              subTitle={error}
              extra={
                <Button type="primary" onClick={handleRefresh}>
                  Try Again
                </Button>
              }
            />
          </Card>
        </Content>
      </Layout>
    );
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Content style={{ padding: "24px", background: "#f5f5f5" }}>
        <Card style={{ marginBottom: 24 }}>
          <Row align="middle" justify="space-between" style={{ marginBottom: 16 }}>
            <Col>
              <Space>
                <Button
                  icon={<ArrowLeftOutlined />}
                  onClick={() => navigate("/employee/")}
                >
                  Back to Dashboard
                </Button>
                <Title level={2} style={{ margin: 0 }}>
                  Employee Orders
                </Title>
              </Space>
            </Col>
            <Col>
              <Space>
                <Button
                  icon={<ReloadOutlined />}
                  onClick={handleRefresh}
                  loading={isLoading}
                >
                  Refresh
                </Button>
                <Button
                  icon={<PlusOutlined />}
                  type="primary"
                  onClick={() => navigate("/employee/orders/create")}
                >
                  Create New Order
                </Button>
              </Space>
            </Col>
          </Row>

          <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
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
                <Option value="PENDING">Pending</Option>
                <Option value="COMPLETED">Completed</Option>
                <Option value="CANCELLED">Cancelled</Option>
              </Select>
            </Col>
            <Col xs={24} sm={12} md={4}>
              <Select
                placeholder="Payment Status"
                style={{ width: "100%" }}
                value={paymentFilter}
                onChange={setPaymentFilter}
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
              <Button onClick={clearFilters} icon={<FilterOutlined />} block>
                Clear Filters
              </Button>
            </Col>
          </Row>

          <Row style={{ marginBottom: 16 }}>
            <Col>
              <Space>
                <Text>
                  Showing {filteredOrders.length} of {employeeOrdersByEmployee.length} orders
                </Text>
                {currentUser && (
                  <>
                    <Text type="secondary">•</Text>
                    <Text type="secondary">
                      Logged in as: {currentUser.fullName} ({currentUser.role})
                    </Text>
                  </>
                )}
              </Space>
            </Col>
          </Row>
        </Card>

        <Card>
          {isLoading ? (
            <div style={{ textAlign: "center", padding: "50px" }}>
              <Spin size="large" />
              <div style={{ marginTop: 16 }}>
                <Text>Loading orders...</Text>
              </div>
            </div>
          ) : filteredOrders.length === 0 ? (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <Space direction="vertical">
                  <Text>No orders found</Text>
                  <Text type="secondary">
                    {employeeOrdersByEmployee.length === 0 
                      ? "No orders have been created yet" 
                      : "Try adjusting your search criteria"}
                  </Text>
                </Space>
              }
              style={{ padding: "50px" }}
            >
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => navigate("/employee/orders/create")}
              >
                Create First Order
              </Button>
            </Empty>
          ) : (
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
              scroll={{ x: 1200 }}
              size="middle"
            />
          )}
        </Card>
      </Content>
    </Layout>
  );
};

export default EmployeeOrders;
