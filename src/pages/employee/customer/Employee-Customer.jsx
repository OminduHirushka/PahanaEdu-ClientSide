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
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  ArrowLeftOutlined,
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

const fetchLastAccountNumbers = async () => {
  try {
    const baseURL = import.meta.env.VITE_API_URL;
    const response = await axios.get(`${baseURL}/auth/last-account-numbers`);

    return response.data;
  } catch (error) {
    console.error("Failed to fetch account numbers from API:", error);

    return {
      CUSTOMER: "CU-001",
    };
  }
};

const EmployeeCustomer = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [searchText, setSearchText] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
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
          CUSTOMER: "CU-001",
        });
      }
    };

    loadLastAccountNumbers();
  }, []);

  const filteredCustomers = users.filter((user) => {
    const isCustomer = user.role === "CUSTOMER";

    const matchesSearch =
      user.fullName?.toLowerCase().includes(searchText.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchText.toLowerCase()) ||
      user.accountNumber?.toLowerCase().includes(searchText.toLowerCase()) ||
      user.contact?.includes(searchText) ||
      user.nic?.toLowerCase().includes(searchText.toLowerCase());

    return isCustomer && matchesSearch;
  });

  const generateNextAccountNumber = () => {
    const lastNumber = lastAccountNumbers.CUSTOMER || "CU-001";
    const numberPart = parseInt(lastNumber.split("-")[1] || "1");
    const nextNumber = numberPart + 1;
    return `CU-${String(nextNumber).padStart(3, "0")}`;
  };

  const handleAddCustomer = () => {
    const nextAccountNumber = generateNextAccountNumber();
    setAccountNumberPrefix(nextAccountNumber);
    setEditingCustomer(null);
    setIsModalVisible(true);
    form.resetFields();
    form.setFieldsValue({
      accountNumber: nextAccountNumber,
      role: "CUSTOMER",
    });
  };

  const handleEditCustomer = (customer) => {
    setEditingCustomer(customer);
    setIsModalVisible(true);
    form.setFieldsValue({
      accountNumber: customer.accountNumber,
      fullName: customer.fullName,
      email: customer.email,
      contact: customer.contact,
      nic: customer.nic,
      address: customer.address,
      role: customer.role,
    });
  };

  const handleDeleteCustomer = async (accountNumber) => {
    try {
      await dispatch(deleteUser(accountNumber));
      message.success("Customer deleted successfully!");
      dispatch(getAllUsers());
    } catch (error) {
      console.error("Delete customer error:", error);
      message.error("Failed to delete customer");
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingCustomer(null);
    form.resetFields();
  };

  const handleSubmit = async (values) => {
    setModalLoading(true);
    try {
      const customerData = {
        ...values,
        nic: values.nic.toUpperCase(),
      };

      if (editingCustomer) {
        await dispatch(updateUser(editingCustomer.accountNumber, customerData));
        message.success("Customer updated successfully!");
      } else {
        await dispatch(createUser(customerData));
        message.success("Customer created successfully!");

        const numbers = await fetchLastAccountNumbers();
        setLastAccountNumbers(numbers);
      }

      setIsModalVisible(false);
      setEditingCustomer(null);
      form.resetFields();
      dispatch(getAllUsers());
    } catch (error) {
      console.error("Submit error:", error);
      if (error.response?.status === 400) {
        const errorData = error.response.data;
        if (errorData?.message?.includes("Validation failed")) {
          if (errorData.errors && Array.isArray(errorData.errors)) {
            const fieldErrors = errorData.errors;
            fieldErrors.forEach((err) => {
              message.error(`${err.field}: ${err.defaultMessage}`);
            });
          } else {
            message.error("Validation failed. Please check your inputs.");
          }
        } else if (errorData?.message?.includes("already exists")) {
          message.error(errorData.message);
        } else {
          message.error(errorData?.message || "Bad request error");
        }
      } else {
        message.error(
          editingCustomer
            ? "Failed to update customer"
            : "Failed to create customer"
        );
      }
    } finally {
      setModalLoading(false);
    }
  };

  const columns = [
    {
      title: "Account Number",
      dataIndex: "accountNumber",
      key: "accountNumber",
      sorter: (a, b) => a.accountNumber.localeCompare(b.accountNumber),
      render: (accountNumber) => (
        <Text strong style={{ color: "#1890ff" }}>
          {accountNumber}
        </Text>
      ),
    },
    {
      title: "Full Name",
      dataIndex: "fullName",
      key: "fullName",
      sorter: (a, b) => a.fullName.localeCompare(b.fullName),
      render: (fullName) => <Text strong>{fullName}</Text>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (email) => <Text>{email}</Text>,
    },
    {
      title: "Contact",
      dataIndex: "contact",
      key: "contact",
      render: (contact) => <Text>{contact}</Text>,
    },
    {
      title: "NIC",
      dataIndex: "nic",
      key: "nic",
      render: (nic) => <Text>{nic}</Text>,
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      render: (address) => (
        <Text ellipsis title={address}>
          {address?.length > 30 ? `${address.substring(0, 30)}...` : address}
        </Text>
      ),
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role) => (
        <Tag color="blue" style={{ fontSize: "12px" }}>
          {role}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEditCustomer(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete Customer"
            description={`Are you sure you want to delete customer ${record.fullName}?`}
            onConfirm={() => handleDeleteCustomer(record.accountNumber)}
            okText="Yes"
            cancelText="No"
            okType="danger"
          >
            <Button danger size="small" icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Content style={{ padding: "24px", background: "#f5f5f5" }}>
        <Card>
          <Row
            justify="space-between"
            align="middle"
            style={{ marginBottom: 16 }}
          >
            <Col>
              <Space>
                <Button
                  icon={<ArrowLeftOutlined />}
                  onClick={() => navigate("/employee/")}
                >
                  Back to Dashboard
                </Button>
                <Title level={2} style={{ margin: 0 }}>
                  Manage Customers
                </Title>
              </Space>
            </Col>
            <Col>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAddCustomer}
                size="large"
              >
                Add New Customer
              </Button>
            </Col>
          </Row>

          <Row gutter={16} style={{ marginBottom: 16 }}>
            <Col xs={24} md={8}>
              <Input
                placeholder="Search customers..."
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                allowClear
              />
            </Col>
            <Col xs={24} md={16}>
              <Text type="secondary">
                Total Customers: {filteredCustomers.length}
              </Text>
            </Col>
          </Row>

          <Table
            columns={columns}
            dataSource={filteredCustomers}
            rowKey="accountNumber"
            loading={isLoading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} customers`,
            }}
            scroll={{ x: 1200 }}
          />
        </Card>

        <Modal
          title={editingCustomer ? "Edit Customer" : "Add New Customer"}
          open={isModalVisible}
          onCancel={handleCancel}
          footer={null}
          width={800}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            style={{ marginTop: "1rem" }}
          >
            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="Account Number"
                  name="accountNumber"
                  rules={[
                    { required: true, message: "Please enter account number" },
                  ]}
                >
                  <Input disabled={!!editingCustomer} />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="Role"
                  name="role"
                  rules={[{ required: true, message: "Please select role" }]}
                >
                  <Input disabled value="CUSTOMER" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
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
                  label={
                    editingCustomer ? "New Password (Optional)" : "Password"
                  }
                  name="password"
                  rules={
                    editingCustomer
                      ? [
                          {
                            min: 8,
                            message: "Password must be at least 8 characters",
                          },
                        ]
                      : [
                          { required: true, message: "Please enter password" },
                          {
                            min: 8,
                            message: "Password must be at least 8 characters",
                          },
                        ]
                  }
                >
                  <Input.Password
                    placeholder={
                      editingCustomer
                        ? "Leave blank to keep current password"
                        : "Enter password"
                    }
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item style={{ marginBottom: 0, textAlign: "right" }}>
              <Space>
                <Button onClick={handleCancel}>Cancel</Button>
                <Button type="primary" htmlType="submit" loading={modalLoading}>
                  {editingCustomer ? "Update Customer" : "Create Customer"}
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </Content>
    </Layout>
  );
};

export default EmployeeCustomer;
