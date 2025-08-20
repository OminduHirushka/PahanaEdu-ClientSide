import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  orders: [],
  currentOrder: null,
  isLoading: false,
  error: null,
  success: null,
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    createOrderRequest: (state) => {
      state.isLoading = true;
      state.error = null;
      state.success = null;
    },
    createOrderSuccess: (state, action) => {
      state.isLoading = false;
      state.currentOrder = action.payload.order;
      state.success = action.payload.message;
      state.error = null;
    },
    createOrderFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      state.success = null;
    },

    getOrderByIdRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    getOrderByIdSuccess: (state, action) => {
      state.isLoading = false;
      state.currentOrder = action.payload.order || action.payload;
      state.error = null;
    },
    getOrderByIdFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    getOrdersByCustomerRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    getOrdersByCustomerSuccess: (state, action) => {
      state.isLoading = false;
      state.orders = Array.isArray(action.payload)
        ? action.payload
        : Array.isArray(action.payload.orders)
        ? action.payload.orders
        : [];
      state.error = null;
    },
    getOrdersByCustomerFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    updateOrderStatusRequest: (state) => {
      state.isLoading = true;
      state.error = null;
      state.success = null;
    },
    updateOrderStatusSuccess: (state, action) => {
      state.isLoading = false;
      state.currentOrder = action.payload.order;
      state.success = action.payload.message;
      state.error = null;

      const orderIndex = state.orders.findIndex(
        (order) => order.id === action.payload.order.id
      );
      if (orderIndex !== -1) {
        state.orders[orderIndex] = action.payload.order;
      }
    },
    updateOrderStatusFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      state.success = null;
    },

    cancelOrderRequest: (state) => {
      state.isLoading = true;
      state.error = null;
      state.success = null;
    },
    cancelOrderSuccess: (state, action) => {
      state.isLoading = false;
      state.success = action.payload.message;
      state.error = null;
      if (
        state.currentOrder &&
        state.currentOrder.id === action.payload.orderId
      ) {
        state.currentOrder.orderStatus = "CANCELLED";
      }

      const orderIndex = state.orders.findIndex(
        (order) => order.id === action.payload.orderId
      );
      if (orderIndex !== -1) {
        state.orders[orderIndex].orderStatus = "CANCELLED";
      }
    },
    cancelOrderFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      state.success = null;
    },

    getAllOrdersRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    getAllOrdersSuccess: (state, action) => {
      state.isLoading = false;
      state.orders = Array.isArray(action.payload)
        ? action.payload
        : [];
      state.error = null;
    },
    getAllOrdersFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    clearOrderState: (state) => {
      state.currentOrder = null;
      state.orders = [];
      state.error = null;
      state.success = null;
      state.isLoading = false;
    },

    clearOrderMessages: (state) => {
      state.error = null;
      state.success = null;
    },
  },
});

export const {
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
  clearOrderState,
  clearOrderMessages,
} = orderSlice.actions;

export default orderSlice.reducer;
