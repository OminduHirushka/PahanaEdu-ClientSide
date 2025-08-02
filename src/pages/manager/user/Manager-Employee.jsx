import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Layout,
  Card,
  Table,
  Button,
  Space,
  Typography,
  Input,
  Modal,
  Form,
  message,
  Popconfirm,
  Tag,
  Row,
  Col,
  Select,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  ArrowLeftOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../../../state/user/userAction";

const { Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

const fetchLastAccountNumbers = async () => {
  try {
    const baseURL = import.meta.env.VITE_API_URL;
    const response = await axios.get(`${baseURL}/auth/last-account-numbers`);

    return response.data;
  } catch (error) {
    console.error("Failed to fetch account numbers from API:", error);

    return {
      EMPLOYEE: "UE-001",
      MANAGER: "UM-001",
    };
  }
};

const ManagerEmployee = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [searchText, setSearchText] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [lastAccountNumbers, setLastAccountNumbers] = useState({});
  const [accountNumberPrefix, setAccountNumberPrefix] = useState("");

  const {
    users = [],
    isLoading = false,
    error = null,
  } = useSelector((state) => state.user || {});

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  useEffect(() => {
    const loadLastAccountNumbers = async () => {
      try {
        const numbers = await fetchLastAccountNumbers();
        setLastAccountNumbers(numbers);
      } catch (error) {
        console.error("Failed to fetch account numbers:", error);
        message.error("Failed to load account numbers.");

        setLastAccountNumbers({
          EMPLOYEE: "UE-001",
          MANAGER: "UM-001",
        });
      }
    };

    loadLastAccountNumbers();
  }, []);

  const filteredEmployees = users.filter((user) => {
    const isEmployee = user.role === "EMPLOYEE" || user.role === "MANAGER";

    const matchesSearch =
      user.fullName?.toLowerCase().includes(searchText.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchText.toLowerCase()) ||
      user.accountNumber?.toLowerCase().includes(searchText.toLowerCase()) ||
      user.contact?.toLowerCase().includes(searchText.toLowerCase()) ||
      user.role?.toLowerCase().includes(searchText.toLowerCase());

    return isEmployee && matchesSearch;
  });

  const handleRoleChange = (role) => {
    let prefix = "";
    switch (role) {
      case "EMPLOYEE":
        prefix = "UE-";
        break;
      case "MANAGER":
        prefix = "UM-";
        break;
      default:
        prefix = "UE-";
    }
    setAccountNumberPrefix(prefix);

    if (lastAccountNumbers[role]) {
      const lastNumber = lastAccountNumbers[role];
      const numberPart = lastNumber.split("-")[1];
      const nextNumber = parseInt(numberPart, 10) + 1;
      const paddedNumber = nextNumber
        .toString()
        .padStart(numberPart.length, "0");
      form.setFieldsValue({ accountNumber: `${prefix}${paddedNumber}` });
    } else {
      form.setFieldsValue({ accountNumber: `${prefix}001` });
    }
  };

  const handleAddEmployee = () => {
    setEditingEmployee(null);
    setIsModalVisible(true);
    form.resetFields();
  };

  const handleEditEmployee = (employee) => {
    setEditingEmployee(employee);
    setIsModalVisible(true);

    form.setFieldsValue({
      accountNumber: employee.accountNumber,
      fullName: employee.fullName,
      email: employee.email,
      contact: employee.contact,
      nic: employee.nic,
      address: employee.address,
      role: employee.role,
    });
  };

  const handleDeleteEmployee = async (accountNumber, employeeName) => {
    try {
      await dispatch(deleteUser(accountNumber));
      message.success(`Employee "${employeeName}" deleted successfully`);
      dispatch(getAllUsers());
    } catch (error) {
      message.error("Failed to delete employee");
    }
  };

  const handleModalSubmit = async (values) => {
    setModalLoading(true);

    try {
      console.log("Form values:", values);

      if (editingEmployee) {
        const updateData = {
          accountNumber: values.accountNumber?.trim(),
          fullName: values.fullName?.trim(),
          email: values.email?.trim(),
          contact: values.contact?.trim(),
          nic: values.nic?.trim().toUpperCase(),
          address: values.address?.trim(),
          role: values.role,
        };

        if (values.password && values.password.trim() && values.password.trim().length > 0) {
          updateData.password = values.password.trim();
        }

        console.log("Update data being sent:", updateData);
        await dispatch(updateUser(editingEmployee.accountNumber, updateData));
        message.success("Employee updated successfully");
      } else {
        const createData = {
          accountNumber: values.accountNumber,
          fullName: values.fullName?.trim(),
          email: values.email?.trim(),
          password: values.password?.trim(),
          contact: values.contact?.trim(),
          nic: values.nic?.trim().toUpperCase(),
          address: values.address?.trim(),
          role: values.role,
        };

        console.log("Create data being sent:", createData);
        await dispatch(createUser(createData));
        message.success("Employee created successfully!");
      }

      setIsModalVisible(false);
      form.resetFields();

      dispatch(getAllUsers());
    } catch (error) {
      console.error("Employee operation error:", error);
      console.error("Full error response:", error.response);
      
      if (error.response?.status === 400) {
        const errorData = error.response.data;
        console.error("Error data:", errorData);
        
        if (errorData?.message?.includes("Validation failed")) {
          if (errorData.errors && Array.isArray(errorData.errors)) {
            console.log("Validation errors:", errorData.errors);
            const fieldErrors = errorData.errors;
            fieldErrors.forEach(err => {
              console.log("Field error:", err);
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
        message.error(
          editingEmployee
            ? "Failed to update employee"
            : "Failed to create employee"
        );
      }
    } finally {
      setModalLoading(false);
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setEditingEmployee(null);
    form.resetFields();
  };

  const columns = [
    {
      title: "Account Number",
      dataIndex: "accountNumber",
      key: "accountNumber",
      width: 120,
      render: (text) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: "Full Name",
      dataIndex: "fullName",
      key: "fullName",
      sorter: (a, b) => (a.fullName || "").localeCompare(b.fullName || ""),
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (text) => <Text type="secondary">{text}</Text>,
    },
    {
      title: "Contact",
      dataIndex: "contact",
      key: "contact",
      render: (text) => <Text>{text}</Text>,
    },
    {
      title: "NIC",
      dataIndex: "nic",
      key: "nic",
      render: (text) => <Text>{text}</Text>,
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      render: (text) => (
        <Text style={{ maxWidth: 150 }} ellipsis={{ tooltip: text }}>
          {text}
        </Text>
      ),
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role) => {
        const roleColors = {
          MANAGER: "blue",
          EMPLOYEE: "green",
        };
        return <Tag color={roleColors[role] || "default"}>{role}</Tag>;
      },
    },
    {
      title: "Actions",
      key: "actions",
      width: 200,
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEditEmployee(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete Employee"
            description={`Are you sure you want to delete "${record.fullName}"?`}
            onConfirm={() =>
              handleDeleteEmployee(record.accountNumber, record.fullName)
            }
            okText="Yes"
            cancelText="No"
            okType="danger"
          >
            <Button
              type="primary"
              danger
              size="small"
              icon={<DeleteOutlined />}
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Content style={{ padding: "2rem", background: "#f5f5f5" }}>
        <div
          style={{ background: "#fff", padding: "2rem", borderRadius: "8px" }}
        >
          <div style={{ marginBottom: "2rem" }}>
            <Row justify="space-between" align="middle">
              <Col>
                <Space>
                  <Button
                    icon={<ArrowLeftOutlined />}
                    onClick={() => navigate("/manager")}
                  >
                    Back to Dashboard
                  </Button>
                  <Title level={2} style={{ margin: 0 }}>
                    Manage Employees
                  </Title>
                </Space>
              </Col>
              <Col>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  size="large"
                  onClick={handleAddEmployee}
                >
                  Add New Employee
                </Button>
              </Col>
            </Row>
          </div>

          <Card style={{ marginBottom: "1.5rem" }}>
            <Row gutter={16} align="middle">
              <Col xs={24} sm={12} md={8}>
                <Input
                  placeholder="Search employees by name, email, account number, or contact"
                  prefix={<SearchOutlined />}
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  allowClear
                />
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Text type="secondary">
                  Total: {filteredEmployees.length} employees
                </Text>
              </Col>
            </Row>
          </Card>

          <Table
            columns={columns}
            dataSource={filteredEmployees}
            rowKey="accountNumber"
            loading={isLoading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `Total ${total} employees`,
            }}
            scroll={{ x: 1400 }}
          />

          <Modal
            title={editingEmployee ? "Edit Employee" : "Add New Employee"}
            open={isModalVisible}
            onCancel={handleModalCancel}
            footer={null}
            width={800}
          >
            <Form
              form={form}
              layout="vertical"
              onFinish={handleModalSubmit}
              style={{ marginTop: "1rem" }}
            >
              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    label="Account Number"
                    name="accountNumber"
                    rules={[
                      {
                        required: true,
                        message: "Please enter account number",
                      },
                    ]}
                    extra={
                      !editingEmployee
                        ? "(UM-Manager, UE-Employee)"
                        : "Account number cannot be changed"
                    }
                  >
                    <Input
                      prefix={<UserOutlined />}
                      placeholder={
                        editingEmployee
                          ? "Account number (cannot be changed)"
                          : "Select role to auto-generate"
                      }
                      readOnly
                      style={{
                        backgroundColor: "#f5f5f5",
                        color: "#999",
                      }}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12}>
                  <Form.Item
                    label="Full Name"
                    name="fullName"
                    rules={[
                      { required: true, message: "Please enter full name" },
                      { min: 2, message: "Name must be at least 2 characters" },
                      {
                        max: 100,
                        message: "Name must not exceed 100 characters",
                      },
                    ]}
                  >
                    <Input placeholder="Enter full name" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
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

                <Col xs={24} sm={12}>
                  <Form.Item
                    label="Password"
                    name="password"
                    rules={[
                      {
                        required: !editingEmployee,
                        message: "Please enter password",
                      },
                      {
                        min: 8,
                        message: "Password must be at least 8 characters",
                      },
                    ]}
                    extra={
                      editingEmployee 
                        ? "Leave this field empty to keep the current password unchanged" 
                        : undefined
                    }
                  >
                    <Input.Password
                      placeholder={
                        editingEmployee
                          ? "Leave blank to keep current password"
                          : "Enter password (minimum 8 characters)"
                      }
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    label="Contact Number"
                    name="contact"
                    rules={[
                      {
                        required: true,
                        message: "Please enter contact number",
                      },
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
                      {
                        min: 5,
                        message: "Address must be at least 5 characters",
                      },
                    ]}
                  >
                    <Input.TextArea placeholder="Enter full address" rows={3} />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12}>
                  <Form.Item
                    label="Role"
                    name="role"
                    rules={[{ required: true, message: "Please select role" }]}
                  >
                    <Select
                      placeholder="Select user role"
                      onChange={handleRoleChange}
                    >
                      <Option value="MANAGER">Manager</Option>
                      <Option value="EMPLOYEE">Employee</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item style={{ marginBottom: 0, textAlign: "right" }}>
                <Space>
                  <Button onClick={handleModalCancel}>Cancel</Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={modalLoading}
                  >
                    {editingEmployee ? "Update Employee" : "Create Employee"}
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Modal>
        </div>
      </Content>
    </Layout>
  );
};

export default ManagerEmployee;
