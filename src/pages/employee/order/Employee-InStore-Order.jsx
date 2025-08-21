import React, { useState, useEffect } from "react";
import {
  Layout,
  Card,
  Row,
  Col,
  Button,
  Input,
  Typography,
  Select,
  Table,
  InputNumber,
  Space,
  message,
  Form,
  Modal,
  Spin,
  Tag,
  Alert,
  Divider,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  DeleteOutlined,
  ShoppingCartOutlined,
  ArrowLeftOutlined,
  UserOutlined,
  BookOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllBooks } from "../../../state/book/bookAction";
import {
  getCustomers,
  getUserByAccountNumber,
  getCurrentLoggedUser,
} from "../../../state/user/userAction";
import { createEmployeeOrder } from "../../../state/order/employeeOrderAction";
import { formatBookPrice } from "../../../utils/bookHelpers";

const { Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

const EmployeeInStoreOrder = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [selectedBooks, setSelectedBooks] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [isOrderModalVisible, setIsOrderModalVisible] = useState(false);
  const [orderLoading, setOrderLoading] = useState(false);
  const [customerSearch, setCustomerSearch] = useState("");

  const { user } = useSelector((state) => state.auth || {});
  const {
    user: currentUser,
    users = [],
    isLoading: usersLoading,
  } = useSelector((state) => state.user || {});
  const { books = [], isLoading: booksLoading } = useSelector(
    (state) => state.book || {}
  );
  const { isLoading: employeeOrderLoading } = useSelector(
    (state) => state.employeeOrder || {}
  );

  const displayUser = user || currentUser;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          message.error("Authentication required. Please log in.");
          navigate("/auth/login");
          return;
        }

        await dispatch(getAllBooks());
        await dispatch(getCustomers());
        await dispatch(getCurrentLoggedUser());
      } catch (error) {
        if (
          error.message === "No token found" ||
          error.response?.status === 401
        ) {
          message.error("Session expired. Please log in again.");
          navigate("/auth/login");
        } else {
          message.error("Failed to load data. Please try again later.");
        }
      }
    };

    fetchData();
  }, [dispatch, navigate]);

  useEffect(() => {
    const total = selectedBooks.reduce(
      (sum, book) => sum + book.price * book.orderQuantity,
      0
    );
    setTotalAmount(total);
  }, [selectedBooks]);

  const customers = users.filter(
    (user) =>
      user.fullName?.toLowerCase().includes(customerSearch.toLowerCase()) ||
      user.accountNumber
        ?.toLowerCase()
        .includes(customerSearch.toLowerCase()) ||
      user.email?.toLowerCase().includes(customerSearch.toLowerCase())
  );

  const filteredBooks = books.filter(
    (book) =>
      book.name?.toLowerCase().includes(searchText.toLowerCase()) ||
      book.authorName?.toLowerCase().includes(searchText.toLowerCase()) ||
      book.categoryName?.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleCustomerSelect = (customerId, customerData) => {
    const customer = customers.find((c) => c.accountNumber === customerId);
    setSelectedCustomer(customer);
  };

  const handleManualCustomerEntry = async () => {
    if (!customerSearch.trim()) {
      message.error("Please enter a customer account number");
      return;
    }

    try {
      const customer = await dispatch(
        getUserByAccountNumber(customerSearch.trim())
      );
      if (customer && customer.role === "CUSTOMER") {
        setSelectedCustomer(customer);
        message.success(`Customer ${customer.fullName} selected successfully!`);
        setCustomerSearch("");
      } else if (customer) {
        message.error("The account number belongs to a non-customer user");
      } else {
        message.error("Customer not found");
      }
    } catch (error) {
      message.error(
        "Failed to find customer. Please check the account number."
      );
    }
  };

  const handleAddBookToOrder = (book) => {
    if (book.quantity <= 0) {
      message.error("This book is out of stock");
      return;
    }

    const existingBook = selectedBooks.find((b) => b.id === book.id);
    if (existingBook) {
      message.warning("This book is already in the order");
      return;
    }

    const bookWithQuantity = {
      ...book,
      orderQuantity: 1,
    };
    setSelectedBooks([...selectedBooks, bookWithQuantity]);
    message.success(`${book.name} added to order`);
  };

  const handleQuantityChange = (bookId, quantity) => {
    if (quantity <= 0) {
      message.error("Quantity must be greater than 0");
      return;
    }

    const book = books.find((b) => b.id === bookId);
    if (quantity > book.quantity) {
      message.error(`Only ${book.quantity} copies available in stock`);
      return;
    }

    setSelectedBooks(
      selectedBooks.map((book) =>
        book.id === bookId ? { ...book, orderQuantity: quantity } : book
      )
    );
  };

  const handleRemoveBook = (bookId) => {
    setSelectedBooks(selectedBooks.filter((book) => book.id !== bookId));
  };

  const handleCreateOrder = () => {
    if (!selectedCustomer) {
      message.error("Please select a customer");
      return;
    }

    if (selectedBooks.length === 0) {
      message.error("Please add at least one book to the order");
      return;
    }

    setIsOrderModalVisible(true);
  };

  const handleConfirmOrder = async (values) => {
    setIsOrderModalVisible(false);

    try {
      await createOrderHandler(values);
    } catch (error) {
      setIsOrderModalVisible(true);
    }
  };

  const createOrderHandler = async (values) => {
    setOrderLoading(true);

    try {
      let employeeData = displayUser;

      if (!employeeData || (!employeeData.id && !employeeData.accountNumber)) {
        try {
          const userData = await dispatch(getCurrentLoggedUser());
          employeeData = userData;
        } catch (error) {
          throw new Error(
            "Unable to get employee information. Please log in again."
          );
        }
      }

      if (employeeData.accountNumber && !employeeData.id) {
        if (users && users.length > 0) {
          const employeeFromList = users.find(
            (u) => u.accountNumber === employeeData.accountNumber
          );
          if (employeeFromList && employeeFromList.id) {
            employeeData = { ...employeeData, id: employeeFromList.id };
          }
        }

        if (!employeeData.id) {
          try {
            const employeeFromAPI = await dispatch(
              getUserByAccountNumber(employeeData.accountNumber)
            );
            if (employeeFromAPI && employeeFromAPI.id) {
              employeeData = { ...employeeData, id: employeeFromAPI.id };
            }
          } catch (error) {
            // Silently continue if fetch fails
          }
        }
      }

      let customerData = selectedCustomer;
      if (customerData.accountNumber && !customerData.id) {
        if (users && users.length > 0) {
          const customerFromList = users.find(
            (u) => u.accountNumber === customerData.accountNumber
          );
          if (customerFromList && customerFromList.id) {
            customerData = { ...customerData, id: customerFromList.id };
          }
        }

        if (!customerData.id) {
          try {
            const customerFromAPI = await dispatch(
              getUserByAccountNumber(customerData.accountNumber)
            );
            if (customerFromAPI && customerFromAPI.id) {
              customerData = { ...customerData, id: customerFromAPI.id };
            }
          } catch (error) {
            // Silently continue if fetch fails
          }
        }
      }

      if (!employeeData || !employeeData.id) {
        throw new Error(
          "Employee database ID not available. Please contact your administrator."
        );
      }

      if (!customerData || !customerData.id) {
        throw new Error(
          "Customer database ID not available. Please select a valid customer."
        );
      }

      const employeeId = employeeData.id;
      const customerId = customerData.id;

      const orderItems = selectedBooks.map((book) => ({
        bookId: book.id,
        quantity: book.orderQuantity,
        unitPrice: book.price,
      }));

      const result = await dispatch(
        createEmployeeOrder(employeeId, customerId, orderItems)
      ).unwrap();

      setSelectedCustomer(null);
      setSelectedBooks([]);
      setTotalAmount(0);
      setIsOrderModalVisible(false);
      form.resetFields();

      const orderId = result?.order?.id || result?.id;

      if (orderId) {
        Modal.success({
          title: "In-Store Order Created Successfully",
          content: `In-store order has been created successfully. You will now be redirected to view the order details.`,
          onOk() {
            navigate(`/employee/orders/${orderId}`);
          },
        });
      } else {
        message.success("In-store order created successfully!");
        navigate("/employee/orders");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data ||
        error.message ||
        "Failed to create in-store order";
      message.error(errorMessage);
    } finally {
      setOrderLoading(false);
    }
  };

  const bookColumns = [
    {
      title: "Book",
      key: "book",
      render: (_, record) => (
        <Space>
          <img
            src={record.cover || "/placeholder-book.png"}
            alt={record.name}
            style={{
              width: 40,
              height: 50,
              objectFit: "cover",
              borderRadius: "4px",
            }}
          />
          <div>
            <Text strong>{record.name}</Text>
            <br />
            <Text type="secondary">{record.authorName}</Text>
          </div>
        </Space>
      ),
    },
    {
      title: "Category",
      dataIndex: "categoryName",
      key: "categoryName",
      render: (categoryName) => <Tag color="blue">{categoryName}</Tag>,
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price) => <Text strong>{formatBookPrice(price)}</Text>,
    },
    {
      title: "Stock",
      dataIndex: "quantity",
      key: "quantity",
      sorter: (a, b) => a.stock - b.stock,
      render: (stock) => (
        <Tag color={stock > 10 ? "green" : stock > 0 ? "orange" : "red"}>
          {stock} units
        </Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button
          type="primary"
          size="small"
          icon={<PlusOutlined />}
          onClick={() => handleAddBookToOrder(record)}
          disabled={record.quantity <= 0}
        >
          Add to Order
        </Button>
      ),
    },
  ];

  const orderColumns = [
    {
      title: "Book",
      key: "book",
      render: (_, record) => (
        <Space>
          <img
            src={record.cover || "/placeholder-book.png"}
            alt={record.name}
            style={{
              width: 40,
              height: 50,
              objectFit: "cover",
              borderRadius: "4px",
            }}
          />
          <div>
            <Text strong>{record.name}</Text>
            <br />
            <Text type="secondary">{record.authorName}</Text>
          </div>
        </Space>
      ),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price) => <Text>{formatBookPrice(price)}</Text>,
    },
    {
      title: "Quantity",
      key: "quantity",
      render: (_, record) => (
        <InputNumber
          min={1}
          max={record.quantity}
          value={record.orderQuantity}
          onChange={(value) => handleQuantityChange(record.id, value)}
          size="small"
        />
      ),
    },
    {
      title: "Subtotal",
      key: "subtotal",
      render: (_, record) => (
        <Text strong>
          {formatBookPrice(record.price * record.orderQuantity)}
        </Text>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button
          danger
          size="small"
          icon={<DeleteOutlined />}
          onClick={() => handleRemoveBook(record.id)}
        >
          Remove
        </Button>
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Content style={{ padding: "24px", background: "#f5f5f5" }}>
        <Card style={{ marginBottom: 24 }}>
          <Row justify="space-between" align="middle">
            <Col>
              <Space>
                <Button
                  icon={<ArrowLeftOutlined />}
                  onClick={() => navigate("/employee/")}
                >
                  Back to Dashboard
                </Button>
                <Title level={2} style={{ margin: 0 }}>
                  Create In-Store Order
                </Title>
              </Space>
            </Col>
          </Row>
        </Card>

        <Row gutter={[16, 16]}>
          <Col xs={24} lg={8}>
            <Card
              title={
                <Space>
                  <UserOutlined />
                  <span>Select Customer</span>
                </Space>
              }
              style={{ height: "100%" }}
            >
              <Space direction="vertical" style={{ width: "100%" }}>
                <Input
                  placeholder="Search customers..."
                  prefix={<SearchOutlined />}
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                  allowClear
                />

                <Select
                  showSearch
                  placeholder={
                    customers.length === 0
                      ? "No customers available - Contact your manager"
                      : "Select a customer"
                  }
                  style={{ width: "100%" }}
                  value={selectedCustomer?.accountNumber}
                  onChange={handleCustomerSelect}
                  filterOption={(input, option) =>
                    option.children.toLowerCase().includes(input.toLowerCase())
                  }
                  loading={usersLoading}
                  disabled={customers.length === 0}
                >
                  {customers.map((customer) => (
                    <Option
                      key={customer.accountNumber}
                      value={customer.accountNumber}
                    >
                      {customer.fullName} ({customer.accountNumber})
                    </Option>
                  ))}
                </Select>

                {customers.length === 0 && (
                  <Alert
                    message="Customer List Unavailable"
                    description="Unable to load customer list. Please contact your manager to get access to customer data for creating in-store orders."
                    type="warning"
                    showIcon
                    style={{ marginTop: 8 }}
                  />
                )}

                {customers.length === 0 && (
                  <div>
                    <Text strong style={{ marginBottom: 8, display: "block" }}>
                      Manual Customer Entry:
                    </Text>
                    <Input
                      placeholder="Enter customer account number (e.g., UC-001)"
                      value={customerSearch}
                      onChange={(e) => setCustomerSearch(e.target.value)}
                      onPressEnter={handleManualCustomerEntry}
                      suffix={
                        <Button
                          size="small"
                          type="primary"
                          onClick={handleManualCustomerEntry}
                          disabled={!customerSearch.trim()}
                        >
                          Find
                        </Button>
                      }
                    />
                  </div>
                )}

                {selectedCustomer && (
                  <Card
                    size="small"
                    style={{
                      backgroundColor: "#f6ffed",
                      border: "1px solid #b7eb8f",
                    }}
                  >
                    <Space direction="vertical" size="small">
                      <Text strong>Customer Details:</Text>
                      <Text>Name: {selectedCustomer.fullName}</Text>
                      <Text>Account: {selectedCustomer.accountNumber}</Text>
                      <Text>Email: {selectedCustomer.email}</Text>
                      <Text>Contact: {selectedCustomer.contact}</Text>
                    </Space>
                  </Card>
                )}
              </Space>
            </Card>
          </Col>

          <Col xs={24} lg={16}>
            <Card
              title={
                <Space>
                  <ShoppingCartOutlined />
                  <span>Order Summary</span>
                </Space>
              }
              extra={
                <Button
                  type="primary"
                  size="large"
                  icon={<PlusOutlined />}
                  onClick={handleCreateOrder}
                  disabled={!selectedCustomer || selectedBooks.length === 0}
                >
                  Create Order - {formatBookPrice(totalAmount)}
                </Button>
              }
            >
              {selectedBooks.length > 0 ? (
                <Table
                  columns={orderColumns}
                  dataSource={selectedBooks}
                  rowKey="id"
                  pagination={false}
                  size="small"
                />
              ) : (
                <Alert
                  message="No books selected"
                  description="Select books from the catalog below to add to the order"
                  type="info"
                  showIcon
                />
              )}
            </Card>
          </Col>
        </Row>

        <Card
          title={
            <Space>
              <BookOutlined />
              <span>Books Catalog</span>
            </Space>
          }
          style={{ marginTop: 16 }}
        >
          <Input
            placeholder="Search books..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
            style={{ marginBottom: 16, maxWidth: 400 }}
          />

          {booksLoading ? (
            <div style={{ textAlign: "center", padding: "50px" }}>
              <Spin size="large" />
              <div style={{ marginTop: 16 }}>
                <Text>Loading books...</Text>
              </div>
            </div>
          ) : (
            <Table
              columns={bookColumns}
              dataSource={filteredBooks}
              rowKey="id"
              pagination={{
                pageSize: 5,
                showSizeChanger: false,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} of ${total} books`,
              }}
              scroll={{ x: 800 }}
            />
          )}
        </Card>

        <Modal
          title="Confirm Order"
          open={isOrderModalVisible}
          onCancel={() => setIsOrderModalVisible(false)}
          footer={null}
          width={600}
        >
          <Form form={form} onFinish={handleConfirmOrder} layout="vertical">
            <div style={{ marginBottom: 16 }}>
              <Title level={5}>Order Summary</Title>
              <Space direction="vertical" style={{ width: "100%" }}>
                <Text>
                  Customer: <strong>{selectedCustomer?.fullName}</strong>
                </Text>
                <Text>
                  Account: <strong>{selectedCustomer?.accountNumber}</strong>
                </Text>
                <Text>
                  Total Items: <strong>{selectedBooks.length}</strong>
                </Text>
                <Text>
                  Total Amount:{" "}
                  <strong style={{ color: "#1890ff", fontSize: "16px" }}>
                    {formatBookPrice(totalAmount)}
                  </strong>
                </Text>
              </Space>
            </div>

            <Form.Item style={{ marginBottom: 0, textAlign: "right" }}>
              <Space>
                <Button onClick={() => setIsOrderModalVisible(false)}>
                  Cancel
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={orderLoading || employeeOrderLoading}
                  icon={<ShoppingCartOutlined />}
                >
                  Confirm Order
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </Content>
    </Layout>
  );
};

export default EmployeeInStoreOrder;
