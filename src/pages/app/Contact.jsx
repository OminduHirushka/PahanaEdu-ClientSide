import React from "react";
import {
  Layout,
  Row,
  Col,
  Typography,
  Form,
  Input,
  Button,
  Card,
  Divider,
} from "antd";
import {
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  SendOutlined,
} from "@ant-design/icons";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const colors = {
  primary: "#3f51b5",
  secondary: "#00bcd4",
  accent: "#ff5722",
  lightBg: "#f5f7fa",
  darkText: "#263238",
  lightText: "#607d8b",
};

const Contact = () => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log("Received values:", values);
    form.resetFields();
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Navbar selectedKey="contact" />

      <Content style={{ padding: "0", background: "#fff" }}>
        <div
          style={{
            background:
              "linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            height: "400px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            color: "#fff",
            textAlign: "center",
            padding: "0 20px",
          }}
        >
          <Title
            level={1}
            style={{
              color: "#fff",
              fontSize: "3rem",
              fontWeight: 700,
              marginBottom: "1rem",
              textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
            }}
          >
            Contact Pahana Edu
          </Title>
          <Text
            style={{
              color: "#fff",
              fontSize: "1.2rem",
              maxWidth: "700px",
              textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
              fontWeight: 500,
            }}
          >
            Have questions or need assistance? Reach out to our team anytime.
          </Text>
        </div>

        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "4rem 2rem",
          }}
        >
          <Row gutter={[48, 48]} style={{ marginBottom: "3rem" }}>
            <Col xs={24} lg={12}>
              <Title
                level={2}
                style={{ color: colors.darkText, marginBottom: "1.5rem" }}
              >
                Get in <span style={{ color: colors.primary }}>Touch</span>
              </Title>
              <Paragraph
                style={{
                  fontSize: "1.1rem",
                  lineHeight: 1.8,
                  color: colors.darkText,
                  marginBottom: "2rem",
                }}
              >
                We're here to help with any questions about our educational
                resources, bulk orders, or partnership opportunities. Fill out
                the form or contact us directly using the information below.
              </Paragraph>

              <Card
                style={{
                  borderRadius: "12px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  borderTop: `4px solid ${colors.primary}`,
                  marginBottom: "2rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "1.5rem",
                  }}
                >
                  <MailOutlined
                    style={{
                      fontSize: "1.5rem",
                      color: colors.primary,
                      marginRight: "1rem",
                    }}
                  />
                  <div>
                    <Text
                      strong
                      style={{ display: "block", color: colors.darkText }}
                    >
                      Email Us
                    </Text>
                    <Text style={{ color: colors.lightText }}>
                      info@pahana-edu.lk
                    </Text>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "1.5rem",
                  }}
                >
                  <PhoneOutlined
                    style={{
                      fontSize: "1.5rem",
                      color: colors.primary,
                      marginRight: "1rem",
                    }}
                  />
                  <div>
                    <Text
                      strong
                      style={{ display: "block", color: colors.darkText }}
                    >
                      Call Us
                    </Text>
                    <Text style={{ color: colors.lightText }}>
                      +94 112 345 678
                    </Text>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center" }}>
                  <EnvironmentOutlined
                    style={{
                      fontSize: "1.5rem",
                      color: colors.primary,
                      marginRight: "1rem",
                    }}
                  />
                  <div>
                    <Text
                      strong
                      style={{ display: "block", color: colors.darkText }}
                    >
                      Visit Us
                    </Text>
                    <Text style={{ color: colors.lightText }}>
                      123 Piliyandala Road, Kottawa, Colombo
                    </Text>
                  </div>
                </div>
              </Card>

              <Title
                level={4}
                style={{ color: colors.darkText, marginBottom: "1rem" }}
              >
                Business Hours
              </Title>
              <Paragraph style={{ color: colors.lightText }}>
                Monday - Friday: 8:30 AM - 8:30 PM
                <br />
                Saturday: 9:00 AM - 5:00 PM
                <br />
                Sunday: Closed
              </Paragraph>
            </Col>

            <Col xs={24} lg={12}>
              <Card
                style={{
                  borderRadius: "12px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  borderTop: `4px solid ${colors.secondary}`,
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
                  Send Us a Message
                </Title>

                <Form
                  form={form}
                  name="contact-form"
                  onFinish={onFinish}
                  layout="vertical"
                >
                  <Form.Item
                    name="name"
                    rules={[
                      { required: true, message: "Please enter your name" },
                    ]}
                  >
                    <Input
                      placeholder="Your Name"
                      size="large"
                      style={{ borderRadius: "6px" }}
                    />
                  </Form.Item>

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
                      placeholder="Email Address"
                      size="large"
                      style={{ borderRadius: "6px" }}
                    />
                  </Form.Item>

                  <Form.Item
                    name="subject"
                    rules={[
                      { required: true, message: "Please enter a subject" },
                    ]}
                  >
                    <Input
                      placeholder="Subject"
                      size="large"
                      style={{ borderRadius: "6px" }}
                    />
                  </Form.Item>

                  <Form.Item
                    name="message"
                    rules={[
                      { required: true, message: "Please enter your message" },
                    ]}
                  >
                    <TextArea
                      placeholder="Your Message"
                      rows={6}
                      style={{ borderRadius: "6px" }}
                    />
                  </Form.Item>

                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      size="large"
                      block
                      icon={<SendOutlined />}
                      style={{
                        background: colors.primary,
                        borderColor: colors.primary,
                        borderRadius: "6px",
                        fontWeight: 500,
                        height: "48px",
                      }}
                    >
                      Send Message
                    </Button>
                  </Form.Item>
                </Form>
              </Card>
            </Col>
          </Row>

          <Divider
            style={{
              borderColor: colors.lightBg,
              borderWidth: "2px",
              margin: "3rem 0",
            }}
          />

          <Title
            level={2}
            style={{
              color: colors.darkText,
              textAlign: "center",
              marginBottom: "2rem",
            }}
          >
            Our <span style={{ color: colors.primary }}>Location</span>
          </Title>

          <Card
            style={{
              borderRadius: "12px",
              overflow: "hidden",
              padding: 0,
              marginBottom: "3rem",
            }}
          >
            <iframe
              title="Pahana Edu Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3961.925234414933!2d79.9488593147689!3d6.822244595064841!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae2517b9a7a7c2d%3A0x6a1a9b0b9b9b9b9b!2sKottawa%2C%20Colombo%2C%20Sri%20Lanka!5e0!3m2!1sen!2sus!4v1620000000000!5m2!1sen!2sus"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </Card>
        </div>
      </Content>

      <Footer />
    </Layout>
  );
};

export default Contact;
