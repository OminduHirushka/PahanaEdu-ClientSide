import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cart: null,
  cartItems: [],
  isLoading: false,
  error: null,
  success: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    getCartRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    getCartSuccess: (state, action) => {
      state.isLoading = false;

      const cart = action.payload.cart;

      if (cart) {
        state.cart = cart;

        if (cart.items && Array.isArray(cart.items)) {
          state.cartItems = cart.items.map((item) => ({
            ...item,
            key: item.id || `item-${Date.now()}-${Math.random()}`,
          }));
        } else {
          state.cartItems = [];
        }
      } else {
        state.cart = null;
        state.cartItems = [];
      }

      state.error = null;
      state.success = null;
    },
    getCartFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    getCartItemsRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    getCartItemsSuccess: (state, action) => {
      state.isLoading = false;

      state.cartItems =
        action.payload.items?.map((item) => ({
          ...item,
          key: item.id || `item-${Date.now()}-${Math.random()}`,
          book: item.book
            ? {
                id: item.book.id,
                name: item.book.name,
                cover: item.book.cover,
                price: item.book.price,
                publisher: item.book.publisher,
                publisherName: item.book.publisherName,
              }
            : null,
        })) || [];

      state.error = null;
    },
    getCartItemsFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    addItemToCartRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    addItemToCartSuccess: (state, action) => {
      state.isLoading = false;
      state.success = "Item added to cart successfully";
      state.error = null;
    },
    addItemToCartFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    updateCartItemRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    updateCartItemSuccess: (state, action) => {
      state.isLoading = false;
      state.success = "Cart item updated successfully";
      state.error = null;
    },
    updateCartItemFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    removeCartItemRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    removeCartItemSuccess: (state, action) => {
      state.isLoading = false;
      state.success = "Item removed from cart successfully";
      state.error = null;
    },
    removeCartItemFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    clearCartRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    clearCartSuccess: (state, action) => {
      state.isLoading = false;
      state.cartItems = [];
      state.cart = { ...state.cart, totalPrice: 0.0 };
      state.success = "Cart cleared successfully";
      state.error = null;
    },
    clearCartFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    checkoutCartRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    checkoutCartSuccess: (state, action) => {
      state.isLoading = false;
      state.cart = null;
      state.cartItems = [];
      state.success = "Checkout completed successfully";
      state.error = null;
    },
    checkoutCartFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    clearCartState: (state) => {
      state.error = null;
      state.success = null;
    },

    clearCartMessages: (state) => {
      state.error = null;
      state.success = null;
    },
  },
});

export const {
  getCartRequest,
  getCartSuccess,
  getCartFailure,
  getCartItemsRequest,
  getCartItemsSuccess,
  getCartItemsFailure,
  addItemToCartRequest,
  addItemToCartSuccess,
  addItemToCartFailure,
  updateCartItemRequest,
  updateCartItemSuccess,
  updateCartItemFailure,
  removeCartItemRequest,
  removeCartItemSuccess,
  removeCartItemFailure,
  clearCartRequest,
  clearCartSuccess,
  clearCartFailure,
  checkoutCartRequest,
  checkoutCartSuccess,
  checkoutCartFailure,
  clearCartState,
  clearCartMessages,
} = cartSlice.actions;

export default cartSlice.reducer;
