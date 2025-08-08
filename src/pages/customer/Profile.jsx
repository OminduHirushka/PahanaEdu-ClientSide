import React, { useEffect, useState } from "react";
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
  Modal,
  Form,
  Input,
  message,
} from "antd";
import {
  UserOutlined,
  ArrowLeftOutlined,
  EditOutlined,
  SaveOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { updateUser, getCurrentLoggedUser } from "../../state/user/userAction";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const { Content } = Layout;
const { Title, Text } = Typography;

const CustomerProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const { user: authUser, isLoading: authLoading } = useSelector(
    (state) => state.auth
  );
  const { user: currentUser, isLoading: userLoading } = useSelector(
    (state) => state.user
  );

  const user = currentUser || authUser;
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (!user) {
      dispatch(getCurrentLoggedUser());
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (isEditModalVisible && user) {
      form.setFieldsValue({
        fullName: user.fullName,
        email: user.email,
        contact: user.contact,
        address: user.address,
      });
    }
  }, [isEditModalVisible, user, form]);

  const handleEditProfile = () => {
    setIsEditModalVisible(true);
  };

  const handleCancelEdit = () => {
    setIsEditModalVisible(false);
    form.resetFields();
  };

  const handleUpdateProfile = async (values) => {
    setIsUpdating(true);
    try {
      const updateData = {
        accountNumber: user.accountNumber?.trim(),
        fullName: values.fullName?.trim(),
        email: values.email?.trim(),
        contact: values.contact?.trim(),
        nic: user.nic?.trim(),
        address: values.address?.trim(),
      };

      if (values.password && values.password.trim()) {
        updateData.password = values.password.trim();
      }

      await dispatch(updateUser(user.accountNumber, updateData));
      message.success("Profile updated successfully!");

      await dispatch(getCurrentLoggedUser());

      setIsEditModalVisible(false);
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
            message.error(`Validation error in field: ${errorData.path}`);
          } else {
            message.error(errorData.message || "Validation failed");
          }
        } else {
          message.error(errorData?.message || "Failed to update profile");
        }
      } else if (error.response?.status === 409) {
        message.error("Email or contact number already exists!");
      } else {
        const errorMessage =
          error.response?.data?.message ||
          "Failed to update profile. Please try again.";
        message.error(errorMessage);
      }
    } finally {
      setIsUpdating(false);
    }
  };

  if (!user) {
    navigate("/auth/login");
    return null;
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Navbar />
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
                  <Button
                    type="primary"
                    icon={<EditOutlined />}
                    onClick={handleEditProfile}
                  >
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

          <Modal
            title={
              <Space>
                <EditOutlined />
                Edit Profile
              </Space>
            }
            open={isEditModalVisible}
            onCancel={handleCancelEdit}
            width={600}
            footer={[
              <Button
                key="cancel"
                icon={<CloseOutlined />}
                onClick={handleCancelEdit}
              >
                Cancel
              </Button>,
              <Button
                key="submit"
                type="primary"
                icon={<SaveOutlined />}
                loading={isUpdating}
                onClick={() => form.submit()}
              >
                Save Changes
              </Button>,
            ]}
          >
            <Form
              form={form}
              layout="vertical"
              onFinish={handleUpdateProfile}
              requiredMark={false}
            >
              <Row gutter={30}>
                <Col span={10}>
                  <Form.Item label="Account Number">
                    <Input
                      value={user?.accountNumber}
                      disabled
                      style={{ backgroundColor: "#f5f5f5" }}
                    />
                    <small style={{ color: "#888" }}>
                      Account number cannot be changed
                    </small>
                  </Form.Item>
                </Col>
                <Col span={14}>
                  <Form.Item
                    label="Full Name"
                    name="fullName"
                    rules={[
                      {
                        required: true,
                        message: "Please enter your full name",
                      },
                      {
                        min: 2,
                        message: "Full name must be at least 2 characters",
                      },
                    ]}
                  >
                    <Input placeholder="Enter your full name" />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                      { required: true, message: "Please enter your email" },
                      { type: "email", message: "Please enter a valid email" },
                    ]}
                  >
                    <Input placeholder="Enter your email address" />
                  </Form.Item>
                </Col>

                <Col span={12}>
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

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Contact Number"
                    name="contact"
                    rules={[
                      {
                        required: true,
                        message: "Please enter your contact number",
                      },
                      {
                        pattern: /^[0-9+\-\s()]+$/,
                        message: "Please enter a valid contact number",
                      },
                    ]}
                  >
                    <Input placeholder="Enter your contact number" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="NIC">
                    <Input
                      value={user?.nic}
                      disabled
                      style={{ backgroundColor: "#f5f5f5" }}
                    />
                    <small style={{ color: "#888" }}>
                      NIC cannot be changed
                    </small>
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                label="Address"
                name="address"
                rules={[
                  { required: true, message: "Please enter your address" },
                  {
                    min: 10,
                    message: "Address must be at least 10 characters",
                  },
                ]}
              >
                <Input.TextArea
                  rows={3}
                  placeholder="Enter your complete address"
                />
              </Form.Item>
            </Form>
          </Modal>
        </div>
      </Content>
      <Footer />
    </Layout>
  );
};

export default CustomerProfile;
