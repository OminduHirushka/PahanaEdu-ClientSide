import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  employeeOrders: [],
  currentEmployeeOrder: null,
  employeeOrdersByEmployee: [],
  employeeOrdersByCustomer: [],
  isLoading: false,
  error: null,
  success: null,
};

const employeeOrderSlice = createSlice({
  name: "employeeOrder",
  initialState,
  reducers: {
    createEmployeeOrderRequest: (state) => {
      state.isLoading = true;
      state.error = null;
      state.success = null;
    },
    createEmployeeOrderSuccess: (state, action) => {
      state.isLoading = false;
      state.currentEmployeeOrder = action.payload.order;
      state.employeeOrders.unshift(action.payload.order);
      state.success = action.payload.message;
      state.error = null;
    },
    createEmployeeOrderFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      state.success = null;
    },

    getEmployeeOrderByIdRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    getEmployeeOrderByIdSuccess: (state, action) => {
      state.isLoading = false;
      state.currentEmployeeOrder = action.payload.order || action.payload;
      state.error = null;
    },
    getEmployeeOrderByIdFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    getAllEmployeeOrdersRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    getAllEmployeeOrdersSuccess: (state, action) => {
      state.isLoading = false;
      state.employeeOrders = action.payload.orders || action.payload;
      state.error = null;
    },
    getAllEmployeeOrdersFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    getEmployeeOrdersByEmployeeRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    getEmployeeOrdersByEmployeeSuccess: (state, action) => {
      state.isLoading = false;
      state.employeeOrdersByEmployee = action.payload.orders || action.payload;
      state.error = null;
    },
    getEmployeeOrdersByEmployeeFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    getEmployeeOrdersByCustomerRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    getEmployeeOrdersByCustomerSuccess: (state, action) => {
      state.isLoading = false;
      state.employeeOrdersByCustomer = action.payload.orders || action.payload;
      state.error = null;
    },
    getEmployeeOrdersByCustomerFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    updateEmployeeOrderStatusRequest: (state) => {
      state.isLoading = true;
      state.error = null;
      state.success = null;
    },
    updateEmployeeOrderStatusSuccess: (state, action) => {
      state.isLoading = false;
      const updatedOrder = action.payload.order;

      const orderIndex = state.employeeOrders.findIndex(
        (order) => order.id === updatedOrder.id
      );
      if (orderIndex !== -1) {
        state.employeeOrders[orderIndex] = updatedOrder;
      }

      const employeeOrderIndex = state.employeeOrdersByEmployee.findIndex(
        (order) => order.id === updatedOrder.id
      );
      if (employeeOrderIndex !== -1) {
        state.employeeOrdersByEmployee[employeeOrderIndex] = updatedOrder;
      }

      if (state.currentEmployeeOrder?.id === updatedOrder.id) {
        state.currentEmployeeOrder = updatedOrder;
      }

      state.success = action.payload.message;
      state.error = null;
    },
    updateEmployeeOrderStatusFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      state.success = null;
    },

    cancelEmployeeOrderRequest: (state) => {
      state.isLoading = true;
      state.error = null;
      state.success = null;
    },
    cancelEmployeeOrderSuccess: (state, action) => {
      state.isLoading = false;
      const cancelledOrderId = action.payload.orderId || action.payload.id;

      state.employeeOrders = state.employeeOrders.map((order) =>
        order.id === cancelledOrderId
          ? { ...order, orderStatus: "CANCELLED", paymentStatus: "CANCELLED" }
          : order
      );

      state.employeeOrdersByEmployee = state.employeeOrdersByEmployee.map(
        (order) =>
          order.id === cancelledOrderId
            ? { ...order, orderStatus: "CANCELLED", paymentStatus: "CANCELLED" }
            : order
      );

      if (state.currentEmployeeOrder?.id === cancelledOrderId) {
        state.currentEmployeeOrder = {
          ...state.currentEmployeeOrder,
          orderStatus: "CANCELLED",
          paymentStatus: "CANCELLED",
        };
      }

      state.success = action.payload.message;
      state.error = null;
    },
    cancelEmployeeOrderFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      state.success = null;
    },

    clearCurrentEmployeeOrder: (state) => {
      state.currentEmployeeOrder = null;
    },

    clearEmployeeOrderMessages: (state) => {
      state.error = null;
      state.success = null;
    },

    resetEmployeeOrderState: (state) => {
      state.employeeOrders = [];
      state.currentEmployeeOrder = null;
      state.employeeOrdersByEmployee = [];
      state.employeeOrdersByCustomer = [];
      state.isLoading = false;
      state.error = null;
      state.success = null;
    },
  },
});

export const {
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
  clearCurrentEmployeeOrder,
  clearEmployeeOrderMessages,
  resetEmployeeOrderState,
} = employeeOrderSlice.actions;

export default employeeOrderSlice.reducer;
