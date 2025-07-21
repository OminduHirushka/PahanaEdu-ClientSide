import React from "react";
import { Layout, Row, Col, Typography, Divider, Card, Image } from "antd";
import {
  BookOutlined,
  ReadOutlined,
  StarFilled,
  SafetyCertificateFilled,
  DollarCircleFilled,
} from "@ant-design/icons";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;

const colors = {
  primary: "#3f51b5",
  secondary: "#00bcd4",
  accent: "#ff5722",
  lightBg: "#f5f7fa",
  darkText: "#263238",
  lightText: "#607d8b",
};

const About = () => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Navbar selectedKey="about" />

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
              textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
            }}
          >
            About Pahana Edu
          </Title>
          <Text
            style={{
              color: "#fff",
              fontSize: "1.2rem",
              maxWidth: "800px",
              textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
            }}
          >
            Your trusted partner in educational resources and learning materials
          </Text>
        </div>

        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "4rem 2rem",
          }}
        >
          <Row
            gutter={[48, 48]}
            style={{ marginBottom: "3rem", alignItems: "center" }}
          >
            <Col xs={24} lg={12}>
              <Title
                level={2}
                style={{ color: colors.darkText, marginBottom: "1.5rem" }}
              >
                Welcome to{" "}
                <span style={{ color: colors.primary }}>Pahana Edu</span>
              </Title>
              <Paragraph
                style={{
                  fontSize: "1.1rem",
                  textAlign: "justify",
                  lineHeight: 1.8,
                  color: colors.darkText,
                }}
              >
                Pahana Edu is your premier destination for educational books and
                learning resources. We offer a carefully curated selection of
                materials from foundational textbooks to advanced academic
                references, serving students, educators, and lifelong learners.
              </Paragraph>
              <Paragraph
                style={{
                  fontSize: "1.1rem",
                  textAlign: "justify",
                  lineHeight: 1.8,
                  color: colors.darkText,
                }}
              >
                Our collection spans across all academic disciplines, with
                special emphasis on STEM fields, humanities, and professional
                development resources.
              </Paragraph>
            </Col>
            <Col
              xs={24}
              lg={12}
              style={{ display: "flex", justifyContent: "center" }}
            >
              <Image
                src="/pahana-edu-logo.png"
                alt="Pahana Edu Bookshop"
                preview={false}
                style={{
                  width: "100%",
                  height: "auto",
                  maxWidth: "500px",
                  borderRadius: "12px",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                  border: `4px solid ${colors.lightBg}`,
                }}
              />
            </Col>
          </Row>

          <Divider
            style={{
              borderColor: colors.lightBg,
              borderWidth: "2px",
              margin: "3rem 0",
            }}
          />

          <Row gutter={[32, 32]} style={{ marginBottom: "4rem" }}>
            <Col xs={24} md={12}>
              <Card
                hoverable
                style={{
                  height: "100%",
                  borderRadius: "12px",
                  borderTop: `5px solid ${colors.primary}`,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                }}
              >
                <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
                  <BookOutlined
                    style={{
                      fontSize: "3.5rem",
                      color: colors.primary,
                      background: `${colors.lightBg}`,
                      padding: "1rem",
                      borderRadius: "50%",
                    }}
                  />
                </div>
                <Title
                  level={3}
                  style={{
                    textAlign: "center",
                    color: colors.primary,
                    marginBottom: "1.5rem",
                  }}
                >
                  Our Mission
                </Title>
                <Text
                  style={{
                    fontSize: "1.1rem",
                    lineHeight: 1.7,
                    color: colors.darkText,
                    display: "block",
                    textAlign: "center",
                  }}
                >
                  To make quality educational materials accessible to all
                  learners. We strive to provide comprehensive resources that
                  empower students and educators to achieve academic excellence
                  and foster lifelong learning.
                </Text>
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card
                hoverable
                style={{
                  height: "100%",
                  borderRadius: "12px",
                  borderTop: `5px solid ${colors.secondary}`,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                }}
              >
                <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
                  <ReadOutlined
                    style={{
                      fontSize: "3.5rem",
                      color: colors.secondary,
                      background: `${colors.lightBg}`,
                      padding: "1rem",
                      borderRadius: "50%",
                    }}
                  />
                </div>
                <Title
                  level={3}
                  style={{
                    textAlign: "center",
                    color: colors.secondary,
                    marginBottom: "1.5rem",
                  }}
                >
                  Our Vision
                </Title>
                <Text
                  style={{
                    fontSize: "1.1rem",
                    lineHeight: 1.7,
                    color: colors.darkText,
                    display: "block",
                    textAlign: "center",
                  }}
                >
                  To become the leading educational resource center, recognized
                  for our exceptional collection of learning materials and our
                  commitment to supporting educational communities worldwide.
                </Text>
              </Card>
            </Col>
          </Row>

          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <Title
              level={2}
              style={{
                color: colors.darkText,
                position: "relative",
                display: "inline-block",
              }}
            >
              Our Commitment
              <div
                style={{
                  width: "60px",
                  height: "4px",
                  background: colors.accent,
                  margin: "1rem auto 0",
                  borderRadius: "2px",
                }}
              ></div>
            </Title>
          </div>

          <Row gutter={[24, 24]}>
            <Col xs={24} md={8}>
              <Card
                hoverable
                style={{
                  borderRadius: "12px",
                  textAlign: "center",
                  borderTop: `3px solid ${colors.primary}`,
                  padding: "1.5rem 1rem",
                }}
              >
                <StarFilled
                  style={{
                    fontSize: "2.5rem",
                    color: colors.primary,
                    marginBottom: "1.5rem",
                    background: `${colors.lightBg}`,
                    padding: "1rem",
                    borderRadius: "50%",
                  }}
                />
                <Title level={4} style={{ color: colors.darkText }}>
                  Quality Content
                </Title>
                <Text style={{ color: colors.lightText }}>
                  We meticulously select books and resources that meet the
                  highest academic standards from publishers worldwide.
                </Text>
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card
                hoverable
                style={{
                  borderRadius: "12px",
                  textAlign: "center",
                  borderTop: `3px solid ${colors.secondary}`,
                  padding: "1.5rem 1rem",
                }}
              >
                <DollarCircleFilled
                  style={{
                    fontSize: "2.5rem",
                    color: colors.secondary,
                    marginBottom: "1.5rem",
                    background: `${colors.lightBg}`,
                    padding: "1rem",
                    borderRadius: "50%",
                  }}
                />
                <Title level={4} style={{ color: colors.darkText }}>
                  Affordable Pricing
                </Title>
                <Text style={{ color: colors.lightText }}>
                  We believe education should be accessible, offering
                  competitive prices, student discounts, and special offers.
                </Text>
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card
                hoverable
                style={{
                  borderRadius: "12px",
                  textAlign: "center",
                  borderTop: `3px solid ${colors.accent}`,
                  padding: "1.5rem 1rem",
                }}
              >
                <SafetyCertificateFilled
                  style={{
                    fontSize: "2.5rem",
                    color: colors.accent,
                    marginBottom: "1.5rem",
                    background: `${colors.lightBg}`,
                    padding: "1rem",
                    borderRadius: "50%",
                  }}
                />
                <Title level={4} style={{ color: colors.darkText }}>
                  Expert Guidance
                </Title>
                <Text style={{ color: colors.lightText }}>
                  Our knowledgeable staff with academic backgrounds helps you
                  find the perfect resources for your specific needs.
                </Text>
              </Card>
            </Col>
          </Row>
        </div>
      </Content>

      <Footer />
    </Layout>
  );
};

export default About;
