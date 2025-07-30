import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Layout,
  Form,
  Input,
  Button,
  Card,
  Typography,
  Row,
  Col,
  Select,
} from "antd";
import {
  MailOutlined,
  LockOutlined,
  UserOutlined,
  PhoneOutlined,
  IdcardOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { registerUser } from "../../state/auth/authAction";
import toast from "react-hot-toast";

const { Option } = Select;
const { Content } = Layout;
const { Title, Text, Link } = Typography;

const colors = {
  primary: "#3f51b5",
  secondary: "#00bcd4",
  accent: "#ff5722",
  lightBg: "#f5f7fa",
  darkText: "#263238",
  lightText: "#607d8b",
};

const fetchLastAccountNumbers = async () => {
  try {
    const baseURL = import.meta.env.VITE_API_URL;
    const response = await axios.get(`${baseURL}/auth/last-account-numbers`);

    return response.data;
  } catch (error) {
    console.error("Failed to fetch account numbers from API:", error);

    return {
      CUSTOMER: "CU-001",
      EMPLOYEE: "UE-001",
      ADMIN: "UA-001",
      MANAGER: "UM-001",
    };
  }
};

const Register = () => {
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);
  const [lastAccountNumbers, setLastAccountNumbers] = useState({});
  const [accountNumberPrefix, setAccountNumberPrefix] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const loadLastAccountNumbers = async () => {
      try {
        const numbers = await fetchLastAccountNumbers();
        setLastAccountNumbers(numbers);
      } catch (error) {
        console.error("Failed to fetch account numbers:", error);
        toast.error("Failed to load account numbers.");

        setLastAccountNumbers({
          CUSTOMER: "CU-001",
          EMPLOYEE: "UE-001",
          ADMIN: "UA-001",
          MANAGER: "UM-001",
        });
      }
    };

    loadLastAccountNumbers();
  }, []);

  const handleRoleChange = (role) => {
    let prefix = "";
    switch (role) {
      case "CUSTOMER":
        prefix = "CU-";
        break;
      case "EMPLOYEE":
        prefix = "UE-";
        break;
      case "ADMIN":
        prefix = "UA-";
        break;
      case "MANAGER":
        prefix = "UM-";
        break;
      default:
        prefix = "CU-";
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

  const handleRegister = async (values) => {
    setLoading(true);
    try {
      const result = await dispatch(
        registerUser({
          accountNumber: values.accountNumber,
          fullName: values.fullName.trim(),
          email: values.email.trim(),
          password: values.password.trim(),
          contact: values.contact.trim(),
          nic: values.nic.trim(),
          address: values.address.trim(),
          role: values.role || "CUSTOMER",
        })
      );

      toast.success("Registration Successful!");
      navigate("/auth/login");
    } catch (error) {
      console.error("Registration error in component:", error);
      toast.error("Registration Failed! Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Navbar selectedKey="register" />

      <Content
        style={{
          padding: "0",
          background: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "1200px",
            padding: "2rem",
            margin: "2rem 0",
          }}
        >
          <Row gutter={[48, 48]} align="middle">
            <Col xs={24} lg={12}>
              <div style={{ textAlign: "center", padding: "0 1rem" }}>
                <Title
                  level={2}
                  style={{
                    color: colors.darkText,
                    fontSize: "2.5rem",
                    marginBottom: "1rem",
                  }}
                >
                  Join <span style={{ color: colors.primary }}>Pahana Edu</span>
                </Title>
                <Text
                  style={{
                    color: colors.lightText,
                    fontSize: "1.1rem",
                    display: "block",
                    marginBottom: "2rem",
                  }}
                >
                  Create an account to access our educational resources and
                  services
                </Text>
                <img
                  src="/pahana-edu-logo.png"
                  alt="Pahana Edu logo"
                  style={{
                    width: "100%",
                    maxWidth: "500px",
                    height: "auto",
                    borderRadius: "12px",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                  }}
                />
              </div>
            </Col>

            <Col xs={24} lg={12}>
              <Card
                style={{
                  borderRadius: "12px",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                  borderTop: `4px solid ${colors.primary}`,
                  maxWidth: "500px",
                  margin: "0 auto",
                  padding: "2rem",
                }}
              >
                <Title
                  level={3}
                  style={{
                    color: colors.darkText,
                    textAlign: "center",
                    marginBottom: "2rem",
                  }}
                >
                  Create Your Account
                </Title>

                <Form
                  form={form}
                  name="register-form"
                  onFinish={handleRegister}
                  layout="vertical"
                  scrollToFirstError
                >
                  <Form.Item
                    name="role"
                    label="User Role"
                    rules={[
                      { required: true, message: "Please select your role" },
                    ]}
                  >
                    <Select
                      placeholder="Select your role"
                      size="large"
                      onChange={handleRoleChange}
                    >
                      <Option value="CUSTOMER">Customer</Option>
                      <Option value="EMPLOYEE">Employee</Option>
                      <Option value="ADMIN">Admin</Option>
                      <Option value="MANAGER">Manager</Option>
                    </Select>
                  </Form.Item>

                  <Form.Item
                    name="accountNumber"
                    label="Account Number"
                    rules={[
                      { required: true, message: "Account number is required" },
                    ]}
                  >
                    <Input
                      prefix={
                        <UserOutlined style={{ color: colors.primary }} />
                      }
                      placeholder="Select role to generate account number"
                      size="large"
                      readOnly
                    />
                  </Form.Item>

                  <Form.Item
                    name="fullName"
                    label="Full Name"
                    rules={[
                      {
                        required: true,
                        message: "Please enter your full name",
                      },
                    ]}
                  >
                    <Input
                      prefix={
                        <UserOutlined style={{ color: colors.primary }} />
                      }
                      placeholder="Full name"
                      size="large"
                    />
                  </Form.Item>

                  <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                      { required: true, message: "Please enter your email" },
                      { type: "email", message: "Please enter a valid email" },
                    ]}
                  >
                    <Input
                      prefix={
                        <MailOutlined style={{ color: colors.primary }} />
                      }
                      placeholder="Email"
                      size="large"
                    />
                  </Form.Item>

                  <Form.Item
                    name="password"
                    label="Password"
                    rules={[
                      { required: true, message: "Please enter your password" },
                      {
                        min: 8,
                        message: "Password must be at least 8 characters",
                      },
                    ]}
                    hasFeedback
                  >
                    <Input.Password
                      prefix={
                        <LockOutlined style={{ color: colors.primary }} />
                      }
                      placeholder="Password"
                      size="large"
                    />
                  </Form.Item>

                  <Form.Item
                    name="confirm"
                    label="Confirm Password"
                    dependencies={["password"]}
                    hasFeedback
                    rules={[
                      {
                        required: true,
                        message: "Please confirm your password",
                      },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue("password") === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(
                            new Error("The two passwords do not match")
                          );
                        },
                      }),
                    ]}
                  >
                    <Input.Password
                      prefix={
                        <LockOutlined style={{ color: colors.primary }} />
                      }
                      placeholder="Confirm password"
                      size="large"
                    />
                  </Form.Item>

                  <Form.Item
                    name="contact"
                    label="Contact Number"
                    rules={[
                      {
                        required: true,
                        message: "Please enter your contact number",
                      },
                      {
                        pattern: /^[0-9]{10}$/,
                        message: "Contact number must be exactly 10 digits",
                      },
                    ]}
                  >
                    <Input
                      prefix={
                        <PhoneOutlined style={{ color: colors.primary }} />
                      }
                      placeholder="Contact number (10 digits)"
                      size="large"
                      maxLength={10}
                    />
                  </Form.Item>

                  <Form.Item
                    name="nic"
                    label="NIC Number"
                    rules={[
                      {
                        required: true,
                        message: "Please enter your NIC number",
                      },
                      {
                        pattern: /^[0-9]{9}[vVxX]$|^[0-9]{12}$/,
                        message:
                          "Please enter a valid NIC number (9 digits + V/X or 12 digits)",
                      },
                    ]}
                  >
                    <Input
                      prefix={
                        <IdcardOutlined style={{ color: colors.primary }} />
                      }
                      placeholder="NIC number (e.g., 123456789V or 123456789012)"
                      size="large"
                      maxLength={12}
                      onChange={(e) => {
                        const value = e.target.value.toUpperCase();
                        form.setFieldsValue({ nic: value });
                      }}
                    />
                  </Form.Item>

                  <Form.Item
                    name="address"
                    label="Address"
                    rules={[
                      { required: true, message: "Please enter your address" },
                    ]}
                  >
                    <Input.TextArea
                      prefix={
                        <HomeOutlined style={{ color: colors.primary }} />
                      }
                      placeholder="Address"
                      rows={3}
                    />
                  </Form.Item>

                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      size="large"
                      block
                      loading={loading}
                      style={{
                        background: colors.primary,
                        borderColor: colors.primary,
                        borderRadius: "6px",
                        fontWeight: 500,
                        height: "48px",
                        fontSize: "1.1rem",
                        marginTop: "1rem",
                      }}
                    >
                      Register
                    </Button>
                  </Form.Item>

                  <div
                    style={{
                      textAlign: "center",
                      marginTop: "1rem",
                      color: colors.lightText,
                    }}
                  >
                    Already have an account?{" "}
                    <Link
                      href="/auth/login"
                      style={{
                        color: colors.primary,
                        fontWeight: 500,
                      }}
                    >
                      Login here
                    </Link>
                  </div>
                </Form>
              </Card>
            </Col>
          </Row>
        </div>
      </Content>

      <Footer />
    </Layout>
  );
};

export default Register;
