import React, { use, useState } from "react";
import {
  Layout,
  Card,
  Row,
  Col,
  Button,
  Input,
  Divider,
  Typography,
  Tag,
} from "antd";
import {
  SearchOutlined,
  AppstoreOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const { Content } = Layout;
const { Title, Text } = Typography;
const { Meta } = Card;

const books = [
  {
    id: 1,
    title: "The Psychology of Money",
    author: "Morgan Housel",
    price: 299,
    cover:
      "https://m.media-amazon.com/images/I/71QKQ9mwV7L._AC_UF1000,1000_QL80_.jpg",
    category: "Finance",
  },
  {
    id: 2,
    title: "Atomic Habits",
    author: "James Clear",
    price: 349,
    cover:
      "https://m.media-amazon.com/images/I/91bYsX41DVL._AC_UF1000,1000_QL80_.jpg",
    category: "Self-Help",
  },
  {
    id: 3,
    title: "The Silent Patient",
    author: "Alex Michaelides",
    price: 399,
    cover:
      "https://m.media-amazon.com/images/I/71XW3Zz0UOL._AC_UF1000,1000_QL80_.jpg",
    category: "Thriller",
  },
  {
    id: 4,
    title: "Sapiens",
    author: "Yuval Noah Harari",
    price: 449,
    cover:
      "https://m.media-amazon.com/images/I/713jIoMO3UL._AC_UF1000,1000_QL80_.jpg",
    category: "History",
  },
  {
    id: 5,
    title: "The Alchemist",
    author: "Paulo Coelho",
    price: 249,
    cover:
      "https://m.media-amazon.com/images/I/71aFt4+OTOL._AC_UF1000,1000_QL80_.jpg",
    category: "Fiction",
  },
  {
    id: 6,
    title: "Educated",
    author: "Tara Westover",
    price: 379,
    cover:
      "https://m.media-amazon.com/images/I/71yH6w+3XAL._AC_UF1000,1000_QL80_.jpg",
    category: "Memoir",
  },
];

const Home = () => {
  const [viewMode, setViewMode] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const navigate = useNavigate();

  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || book.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ["all", ...new Set(books.map((book) => book.category))];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Navbar selectedKey="home" />

      <Content style={{ padding: "0", background: "#fff" }}>
        <div
          style={{
            background:
              "linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            height: "450px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            color: "#fff",
            textAlign: "center",
            padding: "0 20px",
            textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
          }}
        >
          <Title
            level={1}
            style={{
              color: "#fff",
              fontSize: "3rem",
              fontWeight: 700,
              marginBottom: "1rem",
              lineHeight: 1.2,
            }}
          >
            Discover Your Next Favorite Book
          </Title>

          <div
            style={{
              backgroundColor: "rgba(255,255,255,0.95)",
              borderRadius: "8px",
              padding: "4px",
              marginBottom: "2rem",
              width: "100%",
              maxWidth: "600px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            }}
          >
            <Input
              size="large"
              placeholder="Search books or authors..."
              prefix={<SearchOutlined style={{ color: "#666" }} />}
              style={{
                width: "100%",
                color: "#333",
                fontSize: "1.1rem",
                border: "none",
                boxShadow: "none",
              }}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "2rem",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1.5rem",
              flexWrap: "wrap",
              gap: "1rem",
            }}
          >
            <div>
              <Button
                type={viewMode === "grid" ? "primary" : "default"}
                icon={<AppstoreOutlined />}
                onClick={() => setViewMode("grid")}
                style={{ marginRight: "0.5rem" }}
              >
                Grid View
              </Button>
              <Button
                type={viewMode === "list" ? "primary" : "default"}
                icon={<UnorderedListOutlined />}
                onClick={() => setViewMode("list")}
              >
                List View
              </Button>
            </div>

            <div
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <Text strong style={{ color: "#333", fontSize: "1rem" }}>
                Filter by:
              </Text>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={{
                  padding: "0.5rem",
                  borderRadius: "4px",
                  border: "1px solid #d9d9d9",
                  fontSize: "1rem",
                  minWidth: "120px",
                }}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <Divider style={{ borderColor: "#f0f0f0" }} />

          {viewMode === "grid" ? (
            <Row gutter={[24, 24]}>
              {filteredBooks.map((book) => (
                <Col key={book.id} xs={24} sm={12} md={8} lg={6}>
                  <Card
                    hoverable
                    cover={
                      <img
                        alt={book.title}
                        src={book.cover}
                        style={{
                          height: "300px",
                          objectFit: "cover",
                          borderTopLeftRadius: "8px",
                          borderTopRightRadius: "8px",
                        }}
                      />
                    }
                    style={{ borderRadius: "8px" }}
                  >
                    <Meta
                      title={
                        <Text
                          strong
                          style={{ color: "#333", fontSize: "1.1rem" }}
                        >
                          {book.title}
                        </Text>
                      }
                      description={
                        <>
                          <Text style={{ color: "#666" }}>{book.author}</Text>
                          <br />
                          <Tag color="geekblue">{book.category}</Tag>
                          <br />
                          <Text
                            strong
                            style={{ color: "#1890ff", fontSize: "1.2rem" }}
                          >
                            LKR {book.price}
                          </Text>
                        </>
                      }
                    />
                    <Button
                      type="primary"
                      style={{
                        marginTop: "1rem",
                        width: "100%",
                        fontWeight: 500,
                      }}
                    >
                      Add to Cart
                    </Button>
                  </Card>
                </Col>
              ))}
            </Row>
          ) : (
            <div>
              {filteredBooks.map((book) => (
                <Card
                  key={book.id}
                  style={{
                    marginBottom: "1.5rem",
                    borderRadius: "8px",
                  }}
                  hoverable
                >
                  <Row gutter={16}>
                    <Col xs={24} sm={8} md={6}>
                      <img
                        alt={book.title}
                        src={book.cover}
                        style={{
                          width: "100%",
                          height: "200px",
                          objectFit: "cover",
                          borderRadius: "4px",
                        }}
                      />
                    </Col>
                    <Col xs={24} sm={16} md={12}>
                      <Title level={4} style={{ color: "#333" }}>
                        {book.title}
                      </Title>
                      <Text strong style={{ color: "#666" }}>
                        {book.author}
                      </Text>
                      <br />
                      <Tag color="geekblue">{book.category}</Tag>
                      <br />
                      <Text
                        strong
                        style={{ color: "#1890ff", fontSize: "1.2rem" }}
                      >
                        LKR {book.price}
                      </Text>
                      <p
                        style={{
                          marginTop: "0.5rem",
                          color: "#666",
                          lineHeight: 1.6,
                        }}
                      >
                        Explore this captivating read that will keep you engaged
                        from start to finish. Perfect for fans of the genre.
                      </p>
                    </Col>
                    <Col
                      xs={24}
                      sm={24}
                      md={6}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginTop: "1rem",
                      }}
                    >
                      <Button
                        type="primary"
                        style={{
                          width: "100%",
                          height: "40px",
                          fontWeight: 500,
                        }}
                      >
                        Add to Cart
                      </Button>
                    </Col>
                  </Row>
                </Card>
              ))}
            </div>
          )}

          {filteredBooks.length === 0 && (
            <div
              style={{
                textAlign: "center",
                padding: "3rem",
                backgroundColor: "#fafafa",
                borderRadius: "8px",
              }}
            >
              <Title level={3} style={{ color: "#333", marginBottom: "1rem" }}>
                No books found
              </Title>
              <Text style={{ color: "#666", fontSize: "1rem" }}>
                Try adjusting your search or filter criteria
              </Text>
              <Button
                type="primary"
                style={{ marginTop: "1rem" }}
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("all");
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>

        <div
          style={{
            backgroundColor: "#f9f9f9",
            padding: "4rem 2rem",
            marginTop: "3rem",
          }}
        >
          <div
            style={{
              maxWidth: "1200px",
              margin: "0 auto",
              textAlign: "center",
            }}
          >
            <Title
              level={2}
              style={{
                color: "#333",
              }}
            >
              Browse All Books
            </Title>
            <Button
              type="primary"
              size="large"
              style={{
                padding: "0 2rem",
                height: "40px",
                fontWeight: 500,
              }}
              onClick={() => navigate("/books")}
            >
              View All Books
            </Button>
          </div>
        </div>
      </Content>

      <Footer />
    </Layout>
  );
};

export default Home;
