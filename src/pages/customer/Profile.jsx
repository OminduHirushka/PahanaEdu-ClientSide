import React, { useEffect } from "react";
import {
  Layout,
  Card,
  Row,
  Col,
  Typography,
  Descriptions,
  Tag,
  Button,
  Space,
  Breadcrumb,
} from "antd";
import {
  UserOutlined,
  ArrowLeftOutlined,
  EditOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentUser } from "../../state/auth/authAction";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const { Content } = Layout;
const { Title, Text } = Typography;

const CustomerProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user) {
      dispatch(getCurrentUser());
    }
  }, [dispatch, user]);

  const navItems = [
    {
      key: "home",
      label: <span onClick={() => navigate("/")}>Home</span>,
    },
    {
      key: "about",
      label: <span onClick={() => navigate("/about")}>About</span>,
    },
    {
      key: "contact",
      label: <span onClick={() => navigate("/contact")}>Contact</span>,
    },
    {
      key: "books",
      label: <span onClick={() => navigate("/books")}>Books</span>,
    },
    {
      key: "cart",
      icon: <ShoppingCartOutlined />,
      label: <span onClick={() => navigate("/customer/cart")}>Cart</span>,
      className: "auth-nav-item",
    },
    {
      key: "profile",
      label: "Profile",
      children: [
        {
          key: "logout",
          label: <span>Logout</span>,
          onClick: () => {
            dispatch({ type: "auth/logout" });
            navigate("/");
          },
        },
      ],
      className: "auth-nav-item",
    },
  ];

  if (!user) {
    navigate("/auth/login");
    return null;
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Navbar nav={navItems} selectedKey="profile" />
      <Content style={{ padding: "20px 50px" }}>
        <div style={{ background: "#fff", padding: 24, minHeight: 380 }}>
          <Breadcrumb style={{ marginBottom: 16 }}>
            <Breadcrumb.Item>
              <Button
                type="link"
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate("/")}
                style={{ padding: 0 }}
              >
                Home
              </Button>
            </Breadcrumb.Item>
            <Breadcrumb.Item>Profile</Breadcrumb.Item>
          </Breadcrumb>

          <Row justify="center">
            <Col xs={24} sm={20} md={16} lg={12}>
              <Card
                title={
                  <Space>
                    <UserOutlined />
                    <Title level={3} style={{ margin: 0 }}>
                      My Profile
                    </Title>
                  </Space>
                }
                extra={
                  <Button type="primary" icon={<EditOutlined />}>
                    Edit Profile
                  </Button>
                }
              >
                <Descriptions bordered column={1}>
                  <Descriptions.Item label="Account Number">
                    <Text strong>{user.accountNumber}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Full Name">
                    {user.fullName}
                  </Descriptions.Item>
                  <Descriptions.Item label="Email">
                    {user.email}
                  </Descriptions.Item>
                  <Descriptions.Item label="Contact">
                    {user.contact}
                  </Descriptions.Item>
                  <Descriptions.Item label="NIC">{user.nic}</Descriptions.Item>
                  <Descriptions.Item label="Address">
                    {user.address}
                  </Descriptions.Item>
                  <Descriptions.Item label="Role">
                    <Tag color="blue">{user.role}</Tag>
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            </Col>
          </Row>
        </div>
      </Content>
      <Footer />
    </Layout>
  );
};

export default CustomerProfile;
