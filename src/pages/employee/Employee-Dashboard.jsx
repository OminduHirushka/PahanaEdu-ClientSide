import React, { useState, useEffect } from "react";
import {
  Layout,
  Menu,
  Card,
  Row,
  Col,
  Typography,
  Statistic,
  Avatar,
  Button,
  Space,
  Badge,
  Modal,
  Form,
  Input,
  message,
} from "antd";
import {
  DashboardOutlined,
  BookOutlined,
  UserOutlined,
  LogoutOutlined,
  EditOutlined,
  ShoppingCartOutlined,
  FileTextOutlined,
  TeamOutlined,
  PlusOutlined,
  GlobalOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getAllBooks } from "../../state/book/bookAction";
import {
  getCurrentLoggedUser,
  updateUser,
  getAllUsers,
} from "../../state/user/userAction";
import { getEmployeeOrdersByEmployee } from "../../state/order/employeeOrderAction";
import dayjs from "dayjs";

const { Sider, Content } = Layout;
const { Title, Text } = Typography;

const Employee_Dashboard = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [selectedKey, setSelectedKey] = useState("dashboard");
  const [isEditProfileVisible, setIsEditProfileVisible] = useState(false);
  const [editProfileLoading, setEditProfileLoading] = useState(false);

  const { user } = useSelector((state) => state.auth || {});
  const { user: currentUser, users = [] } = useSelector(
    (state) => state.user || {}
  );
  const { books = [] } = useSelector((state) => state.book || {});
  const { employeeOrders = [], employeeOrdersByEmployee = [] } = useSelector(
    (state) => state.employeeOrder || {}
  );

  const displayUser = currentUser || user;

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        await dispatch(getAllBooks());
        await dispatch(getAllUsers());
        await dispatch(getCurrentLoggedUser());
      } catch (error) {
        // Handle error silently
      }
    };

    fetchInitialData();
  }, [dispatch]);

  useEffect(() => {
    const fetchEmployeeOrders = async () => {
      if (displayUser?.accountNumber) {
        try {
          await dispatch(
            getEmployeeOrdersByEmployee(displayUser.accountNumber)
          );
        } catch (error) {
          // Handle error silently
        }
      }
    };

    fetchEmployeeOrders();
  }, [dispatch, displayUser?.accountNumber]);

  const handleEditProfile = () => {
    setIsEditProfileVisible(true);

    form.setFieldsValue({
      fullName: displayUser?.fullName || "",
      email: displayUser?.email || "",
      contact: displayUser?.contact || "",
      nic: displayUser?.nic || "",
      address: displayUser?.address || "",
    });
  };

  const handleEditProfileCancel = () => {
    setIsEditProfileVisible(false);
    form.resetFields();
  };

  const handleEditProfileSubmit = async (values) => {
    if (!displayUser?.accountNumber) {
      message.error("User account number not found");
      return;
    }

    setEditProfileLoading(true);

    try {
      const updateData = {
        accountNumber: displayUser.accountNumber?.trim(),
        fullName: values.fullName?.trim(),
        email: values.email?.trim(),
        contact: values.contact?.trim(),
        nic: values.nic?.trim().toUpperCase(),
        address: values.address?.trim(),
        role: displayUser.role,
      };

      if (values.password && values.password.trim()) {
        updateData.password = values.password.trim();
      }

      await dispatch(updateUser(displayUser.accountNumber, updateData));
      message.success("Profile updated successfully!");

      await dispatch(getCurrentLoggedUser());

      setIsEditProfileVisible(false);
      form.resetFields();
    } catch (error) {
      if (error.response?.status === 400) {
        const errorData = error.response.data;

        if (errorData?.message?.includes("Validation failed")) {
          if (errorData.errors && Array.isArray(errorData.errors)) {
            const fieldErrors = errorData.errors;
            fieldErrors.forEach((err) => {
              message.error(`${err.field}: ${err.defaultMessage}`);
            });
          } else if (errorData.path) {
            message.error(`Validation error: ${errorData.message}`);
          } else {
            message.error("Validation failed. Please check the following:");
            message.error("- NIC: Must be 9 digits + V/X or exactly 12 digits");
            message.error("- Contact: Must be exactly 10 digits");
            message.error("- All required fields must be filled");
          }
        } else {
          message.error(errorData?.message || "Bad request error");
        }
      } else {
        message.error("Failed to update profile");
      }
    } finally {
      setEditProfileLoading(false);
    }
  };

  const menuItems = [
    {
      key: "dashboard",
      icon: <DashboardOutlined />,
      label: "Dashboard",
    },
    {
      key: "books",
      icon: <BookOutlined />,
      label: "Books",
    },
    {
      key: "customers",
      icon: <TeamOutlined />,
      label: "Customers",
    },
    {
      key: "in-store-order",
      icon: <PlusOutlined />,
      label: "Create In-Store Order",
    },
    {
      key: "orders",
      icon: <ShoppingCartOutlined />,
      label: "Employee Orders",
    },
    {
      key: "online-orders",
      icon: <GlobalOutlined />,
      label: "Online Orders",
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Logout",
      danger: true,
    },
  ];

  const handleMenuClick = ({ key }) => {
    if (key === "logout") {
      localStorage.removeItem("token");
      sessionStorage.clear();

      navigate("/auth/login");
      return;
    }

    setSelectedKey(key);

    switch (key) {
      case "books":
        navigate("/employee/books");
        break;
      case "customers":
        navigate("/employee/customers");
        break;
      case "in-store-order":
        navigate("/employee/in-store-order");
        break;
      case "orders":
        navigate("/employee/orders");
        break;
      case "online-orders":
        navigate("/employee/online-orders");
        break;
      default:
        break;
    }
  };

  // Calculate dashboard statistics
  const today = dayjs().format("YYYY-MM-DD");

  // Orders processed today by this employee (fallback to empty array if not loaded)
  const ordersProcessedToday = (employeeOrdersByEmployee || []).filter(
    (order) => {
      const orderDate = dayjs(order.orderDate || order.createdAt).format(
        "YYYY-MM-DD"
      );
      return orderDate === today;
    }
  ).length;

  // Total orders processed by this employee (all time)
  const totalOrdersProcessed = (employeeOrdersByEmployee || []).length;

  // Unique customers assisted today
  const customersAssistedToday = new Set(
    (employeeOrdersByEmployee || [])
      .filter((order) => {
        const orderDate = dayjs(order.orderDate || order.createdAt).format(
          "YYYY-MM-DD"
        );
        return orderDate === today;
      })
      .map(
        (order) => order.customerAccountNumber || order.customer?.accountNumber
      )
      .filter(Boolean)
  ).size;

  // Total sales today
  const totalSalesToday = (employeeOrdersByEmployee || []).reduce(
    (sum, order) => {
      const orderDate = dayjs(order.orderDate || order.createdAt).format(
        "YYYY-MM-DD"
      );
      if (orderDate === today) {
        return sum + (order.totalAmount || 0);
      }
      return sum;
    },
    0
  );

  const renderDashboardContent = () => (
    <div>
      <Card style={{ marginBottom: 24 }}>
        <Row align="middle" gutter={16}>
          <Col>
            <Avatar size={64} icon={<UserOutlined />} />
          </Col>
          <Col flex="auto">
            <Title level={3} style={{ margin: 0 }}>
              Welcome,{" "}
              {displayUser?.fullName || displayUser?.name || "Employee"}!
            </Title>
            <Text type="secondary">
              Account: {displayUser?.accountNumber || "Not Available"} | Role:{" "}
              {displayUser?.role || "Employee"}
            </Text>
          </Col>
          <Col>
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={handleEditProfile}
            >
              Edit Profile
            </Button>
          </Col>
        </Row>
      </Card>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic
              title="Total Books Available"
              value={books.length || 0}
              prefix={<BookOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic
              title="Customers Assisted Today"
              value={customersAssistedToday}
              prefix={<TeamOutlined />}
              valueStyle={{ color: "#722ed1" }}
              suffix="customers"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic
              title="Total Orders Processed"
              value={totalOrdersProcessed}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: "#fa8c16" }}
              suffix="orders"
            />
          </Card>
        </Col>
      </Row>

      {ordersProcessedToday > 0 && (
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24}>
            <Card
              title={
                <span
                  style={{
                    fontSize: "20px",
                    fontWeight: "600",
                    color: "#52c41a",
                  }}
                >
                  📊 Today's Performance Summary
                </span>
              }
            >
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12}>
                  <div style={{ textAlign: "center", padding: "16px" }}>
                    <Text strong style={{ fontSize: "24px", color: "#52c41a" }}>
                      {ordersProcessedToday}
                    </Text>
                    <br />
                    <Text type="secondary">Orders Processed</Text>
                  </div>
                </Col>
                <Col xs={24} sm={12}>
                  <div style={{ textAlign: "center", padding: "16px" }}>
                    <Text strong style={{ fontSize: "24px", color: "#1890ff" }}>
                      Rs. {totalSalesToday.toLocaleString()}
                    </Text>
                    <br />
                    <Text type="secondary">Total Sales Today</Text>
                  </div>
                </Col>
              </Row>

              <div style={{ marginTop: "16px", textAlign: "center" }}>
                <Button
                  type="primary"
                  onClick={() => navigate("/employee/orders")}
                  icon={<ShoppingCartOutlined />}
                >
                  View All My Orders
                </Button>
              </div>
            </Card>
          </Col>
        </Row>
      )}

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card
            title={
              <span
                style={{
                  fontSize: "20px",
                  fontWeight: "600",
                  color: "#1890ff",
                }}
              >
                📋 Personal Information
              </span>
            }
            style={{ height: "100%" }}
          >
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Space
                  direction="vertical"
                  style={{ width: "100%" }}
                  size="large"
                >
                  <div>
                    <Text strong style={{ fontSize: "18px" }}>
                      Full Name:
                    </Text>
                    <br />
                    <Text style={{ fontSize: "17px" }}>
                      {displayUser?.fullName || "Not Available"}
                    </Text>
                  </div>
                  <div>
                    <Text strong style={{ fontSize: "18px" }}>
                      Email:
                    </Text>
                    <br />
                    <Text style={{ fontSize: "17px" }}>
                      {displayUser?.email || "Not Available"}
                    </Text>
                  </div>
                  <div>
                    <Text strong style={{ fontSize: "18px" }}>
                      Role:
                    </Text>
                    <br />
                    <Text style={{ fontSize: "17px" }}>
                      {displayUser?.role || "Employee"}
                    </Text>
                  </div>
                  <div>
                    <Text strong style={{ fontSize: "18px" }}>
                      Account Number:
                    </Text>
                    <br />
                    <Text style={{ fontSize: "17px" }}>
                      {displayUser?.accountNumber || "Not Available"}
                    </Text>
                  </div>
                </Space>
              </Col>
              <Col xs={24} md={12}>
                <Space
                  direction="vertical"
                  style={{ width: "100%" }}
                  size="large"
                >
                  <div>
                    <Text strong style={{ fontSize: "18px" }}>
                      Contact Number:
                    </Text>
                    <br />
                    <Text style={{ fontSize: "17px" }}>
                      {displayUser?.contact || "Not Available"}
                    </Text>
                  </div>
                  <div>
                    <Text strong style={{ fontSize: "18px" }}>
                      NIC:
                    </Text>
                    <br />
                    <Text style={{ fontSize: "17px" }}>
                      {displayUser?.nic || "Not Available"}
                    </Text>
                  </div>
                  <div>
                    <Text strong style={{ fontSize: "18px" }}>
                      Address:
                    </Text>
                    <br />
                    <Text style={{ fontSize: "17px" }}>
                      {displayUser?.address || "Not Available"}
                    </Text>
                  </div>
                  <div>
                    <Text strong style={{ fontSize: "18px" }}>
                      Status:
                    </Text>
                    <br />
                    <Badge
                      status="success"
                      text="Active"
                      style={{ fontSize: "17px" }}
                    />
                  </div>
                </Space>
              </Col>
            </Row>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card
            title={
              <span
                style={{
                  fontSize: "20px",
                  fontWeight: "600",
                  color: "#52c41a",
                }}
              >
                ⚡ Quick Actions
              </span>
            }
            extra={<FileTextOutlined style={{ color: "#52c41a" }} />}
            style={{ height: "100%" }}
          >
            <Space direction="vertical" style={{ width: "100%" }} size="middle">
              <Button
                type="primary"
                block
                icon={<BookOutlined />}
                onClick={() => navigate("/employee/books")}
                style={{ height: "40px", fontSize: "16px" }}
              >
                View Books Catalog
              </Button>
              <Button
                block
                icon={<PlusOutlined />}
                onClick={() => navigate("/employee/in-store-order")}
                style={{ height: "40px", fontSize: "16px" }}
              >
                Create In-Store Order
              </Button>
              <Button
                block
                icon={<ShoppingCartOutlined />}
                onClick={() => navigate("/employee/orders")}
                style={{ height: "40px", fontSize: "16px" }}
              >
                Manage Orders
              </Button>
              <Button
                block
                icon={<TeamOutlined />}
                onClick={() => navigate("/employee/customers")}
                style={{ height: "40px", fontSize: "16px" }}
              >
                Manage Customers
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Layout>
        <Sider
          width={250}
          style={{
            background: "#fff",
            borderRight: "1px solid #f0f0f0",
            height: "100vh",
            position: "fixed",
            left: 0,
            top: 0,
            zIndex: 100,
          }}
        >
          <style>
            {`
              .ant-menu-item {
                font-size: 16px !important;
                font-weight: 500 !important;
                height: 48px !important;
                line-height: 48px !important;
              }
              .ant-menu-item-icon {
                font-size: 17px !important;
              }
              .ant-menu-item-selected {
                font-weight: 600 !important;
              }
            `}
          </style>
          <div style={{ padding: "16px", borderBottom: "1px solid #f0f0f0" }}>
            <Title level={4} style={{ margin: 0, textAlign: "center" }}>
              Employee Panel
            </Title>
          </div>

          <Menu
            mode="inline"
            selectedKeys={[selectedKey]}
            style={{
              height: "100%",
              borderRight: 0,
              fontSize: "16px",
            }}
            items={menuItems}
            onClick={handleMenuClick}
          />
        </Sider>

        <Layout style={{ marginLeft: 250 }}>
          <Content style={{ padding: "24px", background: "#f5f5f5" }}>
            {selectedKey === "dashboard" && renderDashboardContent()}
          </Content>
        </Layout>
      </Layout>

      <Modal
        title="Edit Profile"
        open={isEditProfileVisible}
        onCancel={handleEditProfileCancel}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleEditProfileSubmit}
          style={{ marginTop: "1rem" }}
        >
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Full Name"
                name="fullName"
                rules={[
                  { required: true, message: "Please enter full name" },
                  { min: 2, message: "Name must be at least 2 characters" },
                  { max: 100, message: "Name must not exceed 100 characters" },
                ]}
              >
                <Input placeholder="Enter full name" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Please enter email" },
                  { type: "email", message: "Please enter a valid email" },
                ]}
              >
                <Input placeholder="Enter email address" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Contact Number"
                name="contact"
                rules={[
                  { required: true, message: "Please enter contact number" },
                  {
                    pattern: /^[0-9]{10}$/,
                    message: "Contact number must be exactly 10 digits",
                  },
                ]}
              >
                <Input
                  placeholder="Enter contact number (10 digits)"
                  maxLength={10}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="NIC"
                name="nic"
                rules={[
                  { required: true, message: "Please enter NIC" },
                  {
                    pattern: /^[0-9]{9}[vVxX]$|^[0-9]{12}$/,
                    message:
                      "Please enter a valid NIC (9 digits + V/X or 12 digits)",
                  },
                ]}
              >
                <Input
                  placeholder="Enter NIC number"
                  maxLength={12}
                  onChange={(e) => {
                    const value = e.target.value.toUpperCase();
                    form.setFieldsValue({ nic: value });
                  }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Address"
                name="address"
                rules={[
                  { required: true, message: "Please enter address" },
                  { min: 5, message: "Address must be at least 5 characters" },
                ]}
              >
                <Input.TextArea placeholder="Enter full address" rows={3} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="New Password (Optional)"
                name="password"
                rules={[
                  {
                    min: 8,
                    message: "Password must be at least 8 characters",
                  },
                ]}
              >
                <Input.Password placeholder="Leave blank to keep current password" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item style={{ marginBottom: 0, textAlign: "right" }}>
            <Space>
              <Button onClick={handleEditProfileCancel}>Cancel</Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={editProfileLoading}
              >
                Update Profile
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
};

export default Employee_Dashboard;
