import axios from "axios";
import {
  createOrderRequest,
  createOrderSuccess,
  createOrderFailure,
  getOrderByIdRequest,
  getOrderByIdSuccess,
  getOrderByIdFailure,
  getOrdersByCustomerRequest,
  getOrdersByCustomerSuccess,
  getOrdersByCustomerFailure,
  updateOrderStatusRequest,
  updateOrderStatusSuccess,
  updateOrderStatusFailure,
  cancelOrderRequest,
  cancelOrderSuccess,
  cancelOrderFailure,
  getAllOrdersRequest,
  getAllOrdersSuccess,
  getAllOrdersFailure,
} from "./orderSlice";
import toast from "react-hot-toast";

const baseURL = import.meta.env.VITE_API_URL;

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

const generateOrderNumber = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `ORD-${timestamp}-${random}`;
};

export const createOrder = (cartId, orderData) => async (dispatch) => {
  try {
    dispatch(createOrderRequest());

    const orderDTO = {
      orderNumber: generateOrderNumber(),
      address: orderData.address || "",
    };

    const response = await axios.post(
      `${baseURL}/orders/create-order/${cartId}`,
      orderDTO,
      {
        headers: getAuthHeaders(),
      }
    );

    dispatch(createOrderSuccess(response.data));
    toast.success(response.data.message || "Order created successfully!");
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Failed to create order";

    dispatch(createOrderFailure(errorMessage));
    toast.error(errorMessage);
    throw error;
  }
};

export const getOrderById = (orderId) => async (dispatch) => {
  try {
    dispatch(getOrderByIdRequest());

    const response = await axios.get(`${baseURL}/orders/order/${orderId}`, {
      headers: getAuthHeaders(),
    });

    const orderData = response.data.order || response.data;

    dispatch(getOrderByIdSuccess(orderData));
    return orderData;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Failed to fetch order";

    dispatch(getOrderByIdFailure(errorMessage));
    toast.error(errorMessage);
    throw error;
  }
};

export const getOrdersByCustomer = (accountNumber) => async (dispatch) => {
  try {
    dispatch(getOrdersByCustomerRequest());

    const response = await axios.get(
      `${baseURL}/orders/customer/${accountNumber}`,
      {
        headers: getAuthHeaders(),
      }
    );

    const ordersData = Array.isArray(response.data)
      ? response.data
      : Array.isArray(response.data.orders)
      ? response.data.orders
      : [];

    dispatch(getOrdersByCustomerSuccess(ordersData));
    return ordersData;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Failed to fetch orders";

    dispatch(getOrdersByCustomerFailure(errorMessage));
    toast.error(errorMessage);
    throw error;
  }
};

export const updateOrderStatus = (orderId, orderStatus) => async (dispatch) => {
  try {
    dispatch(updateOrderStatusRequest());

    const response = await axios.put(
      `${baseURL}/orders/update-order/${orderId}`,
      {},
      {
        headers: getAuthHeaders(),
        params: { status: orderStatus }
      }
    );

    const updatedOrder = response.data.order || response.data;
    dispatch(updateOrderStatusSuccess(updatedOrder));
    
    toast.success(response.data.message || "Order status updated successfully!");
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Failed to update order status";
    dispatch(updateOrderStatusFailure(errorMessage));
    toast.error(errorMessage);
    throw error;
  }
};

export const updatePaymentStatus = (orderId, paymentStatus) => async (dispatch) => {
  try {
    dispatch(updateOrderStatusRequest());

    const response = await axios.put(
      `${baseURL}/orders/update-payment/${orderId}`,
      {},
      {
        headers: getAuthHeaders(),
        params: { paymentStatus: paymentStatus }
      }
    );

    const updatedOrder = response.data.order || response.data;
    dispatch(updateOrderStatusSuccess(updatedOrder));
    
    toast.success(response.data.message || "Payment status updated successfully!");
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Failed to update payment status";
    dispatch(updateOrderStatusFailure(errorMessage));
    toast.error(errorMessage);
    throw error;
  }
};

export const cancelOrder = (orderId) => async (dispatch) => {
  try {
    dispatch(cancelOrderRequest());

    const response = await axios.put(
      `${baseURL}/orders/cancel-order/${orderId}`,
      {},
      {
        headers: getAuthHeaders(),
      }
    );

    dispatch(
      cancelOrderSuccess({
        message: response.data.message,
        orderId,
      })
    );
    toast.success(response.data.message || "Order cancelled successfully!");
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Failed to cancel order";

    dispatch(cancelOrderFailure(errorMessage));
    toast.error(errorMessage);
    throw error;
  }
};

export const getAllOrders = () => async (dispatch) => {
  try {
    dispatch(getAllOrdersRequest());

    const response = await axios.get(`${baseURL}/orders/`, {
      headers: getAuthHeaders(),
    });

    const ordersData = response.data.orders || [];
    dispatch(getAllOrdersSuccess(ordersData));
    return ordersData;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Failed to fetch orders";

    dispatch(getAllOrdersFailure(errorMessage));
    toast.error(errorMessage);
    throw error;
  }
};
