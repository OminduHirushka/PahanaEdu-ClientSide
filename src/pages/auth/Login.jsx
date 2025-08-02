import React from "react";
import {
  Layout,
  Form,
  Input,
  Button,
  Card,
  Typography,
  Divider,
  Row,
  Col,
} from "antd";
import {
  UserOutlined,
  LockOutlined,
  GoogleOutlined,
  FacebookOutlined,
} from "@ant-design/icons";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginUser } from "../../state/auth/authAction";
import toast from "react-hot-toast";

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

const Login = () => {
  const [form] = Form.useForm();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (values) => {
    try {
      const result = await dispatch(
        loginUser({
          email: values.email,
          password: values.password,
        })
      );

      toast.success("Welcome Back!\nLogin successful!");

      if (result.role === "CUSTOMER") {
        navigate("/");
      } else if (result.role === "MANAGER") {
        navigate("/manager/");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Login error in component:", error);
      toast.error("Login failed. Please check your credentials.");
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Navbar selectedKey="login" />

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
                  Welcome to{" "}
                  <span style={{ color: colors.primary }}>Pahana Edu</span>
                </Title>
                <Text
                  style={{
                    color: colors.lightText,
                    fontSize: "1.1rem",
                    display: "block",
                    marginBottom: "2rem",
                  }}
                >
                  Access your account to explore our collection of educational
                  resources
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
                  Login to Your Account
                </Title>

                <Form
                  form={form}
                  name="login-form"
                  onFinish={handleLogin}
                  layout="vertical"
                >
                  <Form.Item
                    name="email"
                    rules={[
                      {
                        required: true,
                        message: "Please enter your email",
                      },
                      {
                        type: "email",
                        message: "Please enter a valid email",
                      },
                    ]}
                  >
                    <Input
                      prefix={
                        <UserOutlined style={{ color: colors.primary }} />
                      }
                      placeholder="Email Address"
                      size="large"
                      style={{ borderRadius: "6px", padding: "10px" }}
                    />
                  </Form.Item>

                  <Form.Item
                    name="password"
                    rules={[
                      { required: true, message: "Please enter your password" },
                      {
                        min: 6,
                        message: "Password must be at least 6 characters",
                      },
                    ]}
                  >
                    <Input.Password
                      prefix={
                        <LockOutlined style={{ color: colors.primary }} />
                      }
                      placeholder="Password"
                      size="large"
                      style={{ borderRadius: "6px", padding: "10px" }}
                    />
                  </Form.Item>

                  <Form.Item>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "1rem",
                      }}
                    >
                      <Form.Item
                        name="remember"
                        valuePropName="checked"
                        noStyle
                      >
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <input
                            type="checkbox"
                            id="remember"
                            style={{
                              marginRight: "8px",
                              accentColor: colors.primary,
                            }}
                          />
                          <label
                            htmlFor="remember"
                            style={{ color: colors.lightText }}
                          >
                            Remember me
                          </label>
                        </div>
                      </Form.Item>

                      <Link
                        href="/forgot-password"
                        style={{ color: colors.primary }}
                      >
                        Forgot password?
                      </Link>
                    </div>
                  </Form.Item>

                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      size="large"
                      block
                      style={{
                        background: colors.primary,
                        borderColor: colors.primary,
                        borderRadius: "6px",
                        fontWeight: 500,
                        height: "48px",
                        fontSize: "1.1rem",
                      }}
                    >
                      Login
                    </Button>
                  </Form.Item>

                  <Divider
                    style={{
                      borderColor: colors.lightBg,
                      color: colors.lightText,
                    }}
                  >
                    Or login with
                  </Divider>

                  <Row gutter={16}>
                    <Col xs={24} sm={12}>
                      <Button
                        icon={<GoogleOutlined />}
                        size="large"
                        block
                        style={{
                          borderRadius: "6px",
                          height: "48px",
                          marginBottom: "1rem",
                        }}
                      >
                        Google
                      </Button>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Button
                        icon={<FacebookOutlined style={{ color: "#1877F2" }} />}
                        size="large"
                        block
                        style={{
                          borderRadius: "6px",
                          height: "48px",
                        }}
                      >
                        Facebook
                      </Button>
                    </Col>
                  </Row>

                  <div
                    style={{
                      textAlign: "center",
                      marginTop: "2rem",
                      color: colors.lightText,
                    }}
                  >
                    Don't have an account?{" "}
                    <Link
                      href="/auth/register"
                      style={{
                        color: colors.primary,
                        fontWeight: 500,
                      }}
                    >
                      Register now
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

export default Login;
