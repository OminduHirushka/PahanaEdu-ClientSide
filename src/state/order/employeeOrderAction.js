import axios from "axios";
import {
  createEmployeeOrderRequest,
  createEmployeeOrderSuccess,
  createEmployeeOrderFailure,
  getEmployeeOrderByIdRequest,
  getEmployeeOrderByIdSuccess,
  getEmployeeOrderByIdFailure,
  getAllEmployeeOrdersRequest,
  getAllEmployeeOrdersSuccess,
  getAllEmployeeOrdersFailure,
  getEmployeeOrdersByEmployeeRequest,
  getEmployeeOrdersByEmployeeSuccess,
  getEmployeeOrdersByEmployeeFailure,
  getEmployeeOrdersByCustomerRequest,
  getEmployeeOrdersByCustomerSuccess,
  getEmployeeOrdersByCustomerFailure,
  updateEmployeeOrderStatusRequest,
  updateEmployeeOrderStatusSuccess,
  updateEmployeeOrderStatusFailure,
  cancelEmployeeOrderRequest,
  cancelEmployeeOrderSuccess,
  cancelEmployeeOrderFailure,
} from "./employeeOrderSlice";
import toast from "react-hot-toast";

const baseURL = import.meta.env.VITE_API_URL;

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  console.log("Auth token exists:", !!token);
  if (!token) {
    console.error("No authentication token found");
  }
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

const generateOrderNumber = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `EMP-ORD-${timestamp}-${random}`;
};

export const createEmployeeOrder =
  (employeeIdOrAccount, customerIdOrAccount, orderItems) =>
  async (dispatch) => {
    try {
      dispatch(createEmployeeOrderRequest());

      const orderDTO = {
        orderNumber: generateOrderNumber(),
        items: orderItems.map((item) => ({
          bookId: item.bookId,
          quantity: item.quantity,
          unitPrice: item.unitPrice || item.price,
        })),
      };

      console.log("Creating employee order with:", {
        employeeIdOrAccount,
        customerIdOrAccount,
        orderDTO,
      });

      const response = await axios.post(
        `${baseURL}/employee-orders/create/${employeeIdOrAccount}/${customerIdOrAccount}`,
        orderDTO,
        { headers: getAuthHeaders() }
      );

      console.log("Employee order creation response:", response.data);
      dispatch(createEmployeeOrderSuccess(response.data));

      if (response.data.message) {
        toast.success(response.data.message);
      }

      return response.data;
    } catch (error) {
      console.error("Create employee order error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to create employee order";

      dispatch(createEmployeeOrderFailure(errorMessage));
      toast.error(errorMessage);

      throw error;
    }
  };

export const getEmployeeOrderById = (orderId) => async (dispatch) => {
  try {
    dispatch(getEmployeeOrderByIdRequest());

    const response = await axios.get(`${baseURL}/employee-orders/${orderId}`, {
      headers: getAuthHeaders(),
    });

    dispatch(getEmployeeOrderByIdSuccess(response.data));
    return response.data;
  } catch (error) {
    console.error("Get employee order by ID error:", error);
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Failed to fetch employee order";

    dispatch(getEmployeeOrderByIdFailure(errorMessage));
    toast.error(errorMessage);

    throw error;
  }
};

export const getAllEmployeeOrders = () => async (dispatch) => {
  try {
    dispatch(getAllEmployeeOrdersRequest());

    const response = await axios.get(`${baseURL}/employee-orders/`, {
      headers: getAuthHeaders(),
    });

    dispatch(getAllEmployeeOrdersSuccess(response.data));
    return response.data;
  } catch (error) {
    console.error("Get all employee orders error:", error);
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Failed to fetch employee orders";

    dispatch(getAllEmployeeOrdersFailure(errorMessage));
    toast.error(errorMessage);

    throw error;
  }
};

export const getEmployeeOrdersByEmployee =
  (employeeAccountNumber) => async (dispatch) => {
    try {
      dispatch(getEmployeeOrdersByEmployeeRequest());

      console.log(
        "Fetching employee orders for account:",
        employeeAccountNumber
      );

      const response = await axios.get(
        `${baseURL}/employee-orders/employee/account/${employeeAccountNumber}`,
        { headers: getAuthHeaders() }
      );

      const ordersData = response.data.orders || response.data;
      dispatch(getEmployeeOrdersByEmployeeSuccess(ordersData));
      return ordersData;
    } catch (error) {
      console.error("Get employee orders by employee error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch employee's orders";

      dispatch(getEmployeeOrdersByEmployeeFailure(errorMessage));

      if (error.response?.status !== 403) {
        toast.error(errorMessage);
      }

      throw error;
    }
  };

export const getEmployeeOrdersByCustomer =
  (customerAccountNumber) => async (dispatch) => {
    try {
      dispatch(getEmployeeOrdersByCustomerRequest());

      const response = await axios.get(
        `${baseURL}/employee-orders/customer/account/${customerAccountNumber}`,
        { headers: getAuthHeaders() }
      );

      const ordersData = response.data.orders || response.data;
      dispatch(getEmployeeOrdersByCustomerSuccess(ordersData));
      return ordersData;
    } catch (error) {
      console.error("Get employee orders by customer error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch customer's in-store orders";

      dispatch(getEmployeeOrdersByCustomerFailure(errorMessage));
      toast.error(errorMessage);

      throw error;
    }
  };

export const updateEmployeeOrderStatus =
  (orderId, status) => async (dispatch) => {
    try {
      dispatch(updateEmployeeOrderStatusRequest());

      const response = await axios.patch(
        `${baseURL}/employee-orders/${orderId}/status?status=${status}`,
        {},
        { headers: getAuthHeaders() }
      );

      dispatch(updateEmployeeOrderStatusSuccess(response.data));

      if (response.data.message) {
        toast.success(response.data.message);
      }

      return response.data;
    } catch (error) {
      console.error("Update employee order status error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to update order status";

      dispatch(updateEmployeeOrderStatusFailure(errorMessage));
      toast.error(errorMessage);

      throw error;
    }
  };

export const cancelEmployeeOrder = (orderId) => async (dispatch) => {
  try {
    dispatch(cancelEmployeeOrderRequest());

    const response = await axios.put(
      `${baseURL}/employee-orders/${orderId}/cancel`,
      {},
      { headers: getAuthHeaders() }
    );

    dispatch(cancelEmployeeOrderSuccess(response.data));

    if (response.data.message) {
      toast.success(response.data.message);
    }

    return response.data;
  } catch (error) {
    console.error("Cancel employee order error:", error);
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Failed to cancel employee order";

    dispatch(cancelEmployeeOrderFailure(errorMessage));
    toast.error(errorMessage);

    throw error;
  }
};
