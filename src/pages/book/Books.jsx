import React, { useState, useEffect } from "react";
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
  Select,
  Spin,
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
const { Option } = Select;

const mockBooks = [
  {
    id: 1,
    isbn: "978-0062315007",
    name: "The Alchemist",
    category: { id: 1, name: "Fiction" },
    publisher: { id: 1, name: "HarperOne" },
    price: 2490.0,
    cover:
      "https://m.media-amazon.com/images/I/71aFt4+OTOL._AC_UF1000,1000_QL80_.jpg",
  },
  {
    id: 2,
    isbn: "978-0062457714",
    name: "The Subtle Art of Not Giving a F*ck",
    category: { id: 2, name: "Self-Help" },
    publisher: { id: 2, name: "Harper" },
    price: 1990.0,
    cover:
      "https://m.media-amazon.com/images/I/71Nd7WQ2BEL._AC_UF1000,1000_QL80_.jpg",
  },
  {
    id: 3,
    isbn: "978-1501173219",
    name: "The Midnight Library",
    category: { id: 1, name: "Fiction" },
    publisher: { id: 3, name: "Viking" },
    price: 2790.0,
    cover:
      "https://m.media-amazon.com/images/I/81Jc4swhURL._AC_UF1000,1000_QL80_.jpg",
  },
  {
    id: 4,
    isbn: "978-0062315008",
    name: "The Psychology of Money",
    category: { id: 3, name: "Finance" },
    publisher: { id: 4, name: "Harriman House" },
    price: 2990.0,
    cover:
      "https://m.media-amazon.com/images/I/71QKQ9mwV7L._AC_UF1000,1000_QL80_.jpg",
  },
];

const BooksPage = () => {
  const [viewMode, setViewMode] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPublisher, setSelectedPublisher] = useState("all");
  const [loading, setLoading] = useState(false);
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        setBooks(mockBooks);
        setFilteredBooks(mockBooks);
      } catch (error) {
        console.error("Failed to fetch books:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const categories = [
    "all",
    ...new Set(books.map((book) => book.category?.name)),
  ];
  const publishers = [
    "all",
    ...new Set(books.map((book) => book.publisher?.name)),
  ];

  useEffect(() => {
    setLoading(true);

    const timer = setTimeout(() => {
      const filtered = books.filter((book) => {
        const matchesSearch = book.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        const matchesCategory =
          selectedCategory === "all" ||
          book.category?.name === selectedCategory;
        const matchesPublisher =
          selectedPublisher === "all" ||
          book.publisher?.name === selectedPublisher;

        return matchesSearch && matchesCategory && matchesPublisher;
      });

      setFilteredBooks(filtered);
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, selectedCategory, selectedPublisher, books]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
  };

  const handlePublisherChange = (value) => {
    setSelectedPublisher(value);
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setSelectedPublisher("all");
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Navbar selectedKey="books" />

      <Content style={{ padding: "0", background: "#fff" }}>
        <div
          style={{
            background: "#f0f2f5",
            padding: "2rem 0",
            marginBottom: "2rem",
          }}
        >
          <div
            style={{
              maxWidth: "1200px",
              margin: "0 auto",
              padding: "0 2rem",
            }}
          >
            <Title level={2} style={{ color: "#333", marginBottom: "0.5rem" }}>
              Our Book Collection
            </Title>
            <Text style={{ color: "#666", fontSize: "1.1rem" }}>
              Browse through our extensive collection of books
            </Text>
          </div>
        </div>

        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "0 2rem 2rem",
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
            <div style={{ flex: 1, minWidth: "300px" }}>
              <Input
                size="large"
                placeholder="Search books by title..."
                prefix={<SearchOutlined style={{ color: "#666" }} />}
                value={searchTerm}
                onChange={handleSearchChange}
                style={{
                  width: "100%",
                  maxWidth: "500px",
                  color: "#333",
                  fontSize: "1rem",
                }}
                allowClear
              />
            </div>

            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <div
                style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                <Text strong style={{ color: "#333", fontSize: "1rem" }}>
                  Category:
                </Text>
                <Select
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                  style={{ width: "150px" }}
                >
                  {categories.map((category) => (
                    <Option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </Option>
                  ))}
                </Select>
              </div>

              <div
                style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                <Text strong style={{ color: "#333", fontSize: "1rem" }}>
                  Publisher:
                </Text>
                <Select
                  value={selectedPublisher}
                  onChange={handlePublisherChange}
                  style={{ width: "200px" }}
                >
                  {publishers.map((publisher) => (
                    <Option key={publisher} value={publisher}>
                      {publisher.charAt(0).toUpperCase() + publisher.slice(1)}
                    </Option>
                  ))}
                </Select>
              </div>

              <div>
                <Button
                  type={viewMode === "grid" ? "primary" : "default"}
                  icon={<AppstoreOutlined />}
                  onClick={() => setViewMode("grid")}
                  style={{ marginRight: "0.5rem" }}
                >
                  Grid
                </Button>
                <Button
                  type={viewMode === "list" ? "primary" : "default"}
                  icon={<UnorderedListOutlined />}
                  onClick={() => setViewMode("list")}
                >
                  List
                </Button>
              </div>
            </div>
          </div>

          <Divider style={{ borderColor: "#f0f0f0" }} />

          {loading ? (
            <div style={{ textAlign: "center", padding: "3rem" }}>
              <Spin size="large" />
            </div>
          ) : filteredBooks.length === 0 ? (
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
                onClick={handleClearFilters}
              >
                Clear Filters
              </Button>
            </div>
          ) : viewMode === "grid" ? (
            <Row gutter={[24, 24]}>
              {filteredBooks.map((book) => (
                <Col key={book.id} xs={24} sm={12} md={8} lg={6}>
                  <Card
                    hoverable
                    cover={
                      <img
                        alt={book.name}
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
                    onClick={() => navigate(`/books/${book.id}`)}
                  >
                    <Meta
                      title={
                        <Text
                          strong
                          style={{ color: "#333", fontSize: "1.1rem" }}
                        >
                          {book.name}
                        </Text>
                      }
                      description={
                        <>
                          <Text style={{ color: "#666" }}>
                            {book.publisher?.name}
                          </Text>
                          <br />
                          <Tag color="geekblue">{book.category?.name}</Tag>
                          <br />
                          <Text
                            strong
                            style={{ color: "#1890ff", fontSize: "1.2rem" }}
                          >
                            LKR {book.price.toFixed(2)}
                          </Text>
                        </>
                      }
                    />
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
                  onClick={() => navigate(`/books/${book.id}`)}
                >
                  <Row gutter={16}>
                    <Col xs={24} sm={8} md={6}>
                      <img
                        alt={book.name}
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
                        {book.name}
                      </Title>
                      <Text strong style={{ color: "#666" }}>
                        {book.publisher?.name}
                      </Text>
                      <div style={{ margin: "0.5rem 0" }}>
                        <Tag color="geekblue">{book.category?.name}</Tag>
                      </div>
                      <Text
                        strong
                        style={{ color: "#1890ff", fontSize: "1.2rem" }}
                      >
                        LKR {book.price.toFixed(2)}
                      </Text>
                      <Text
                        style={{
                          color: "#666",
                          lineHeight: 1.6,
                          display: "block",
                          marginTop: "0.5rem",
                        }}
                      >
                        ISBN: {book.isbn}
                      </Text>
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
                    ></Col>
                  </Row>
                </Card>
              ))}
            </div>
          )}
        </div>
      </Content>
      
      <Footer />
    </Layout>
  );
};

export default BooksPage;
