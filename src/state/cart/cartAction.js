import axios from "axios";
import {
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
} from "./cartSlice";
import toast from "react-hot-toast";

const baseURL = import.meta.env.VITE_API_URL;

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

const processCartItems = (cartItems) => {
  if (!cartItems || !Array.isArray(cartItems)) return [];

  return cartItems.map((item) => {
    const processedItem = {
      ...item,
      key: item.id || `item-${Date.now()}-${Math.random()}`,
      book: {
        id: item.bookId,
        name: item.bookName || "Unknown Book",
        cover: item.bookCover,
        price: item.price,
        publisher: {
          name: item.publisherName || "Unknown Publisher",
        },
        publisherName: item.publisherName || "Unknown Publisher",
      },
    };

    return processedItem;
  });
};

export const getUserCart = (accountNumber) => async (dispatch) => {
  dispatch(getCartRequest());

  try {
    const result = await axios.get(
      `${baseURL}/cart/user/${accountNumber}/with-items`,
      {
        headers: getAuthHeaders(),
      }
    );

    if (result.data.cart && result.data.cart.items) {
      const processedItems = processCartItems(result.data.cart.items);
      result.data.cart.items = processedItems;
    }

    dispatch(getCartSuccess(result.data));
    return result.data;
  } catch (error) {
    console.error("Get cart error:", error);

    if (error.response?.status === 401) {
      toast.error("Session expired. Please login again.");
    } else if (error.response?.status === 404) {
      try {
        await dispatch(createCartForUser(accountNumber));
      } catch (createError) {
        console.error("Failed to create cart:", createError);
        toast.error("Failed to create cart");
      }
    } else if (error.response?.status === 500) {
      const errorMessage = error.response?.data?.message || "Server error";
      if (
        errorMessage.includes("transaction") ||
        errorMessage.includes("CartItem")
      ) {
        console.warn("Database transaction issue, retrying cart fetch...");
        setTimeout(async () => {
          try {
            await dispatch(getUserCart(accountNumber));
          } catch (retryError) {
            console.error("Retry failed:", retryError);
            toast.error("Unable to load cart. Please refresh the page.");
          }
        }, 1000);
      } else {
        toast.error("Server error occurred while loading cart");
      }
    } else {
      toast.error("Failed to load cart");
    }

    dispatch(getCartFailure(error.response?.data?.message || error.message));
    throw error;
  }
};

export const getCartItems = (cartId) => async (dispatch) => {
  dispatch(getCartItemsRequest());

  try {
    const result = await axios.get(`${baseURL}/cart/${cartId}/items`, {
      headers: getAuthHeaders(),
    });

    if (result.data.items && Array.isArray(result.data.items)) {
      const processedItems = processCartItems(result.data.items);

      const processedResult = {
        ...result.data,
        items: processedItems,
      };

      dispatch(getCartItemsSuccess(processedResult));
      return processedResult;
    } else {
      dispatch(getCartItemsSuccess(result.data));
      return result.data;
    }
  } catch (error) {
    console.error("Get cart items error:", error);

    if (error.response?.status === 401) {
      toast.error("Session expired. Please login again.");
    } else {
      toast.error("Failed to load cart items");
    }

    dispatch(
      getCartItemsFailure(error.response?.data?.message || error.message)
    );
    throw error;
  }
};

export const addItemToCart =
  (accountNumber, cartItemData) => async (dispatch) => {
    dispatch(addItemToCartRequest());

    try {
      if (
        !cartItemData.bookId ||
        !cartItemData.quantity ||
        cartItemData.quantity <= 0
      ) {
        throw new Error("Invalid cart item data");
      }

      const result = await axios.post(
        `${baseURL}/cart/${accountNumber}/add-item`,
        cartItemData,
        {
          headers: getAuthHeaders(),
        }
      );

      dispatch(addItemToCartSuccess(result.data));
      toast.success("Item added to cart successfully!");

      await dispatch(getUserCart(accountNumber));

      return result.data;
    } catch (error) {
      console.error("Add to cart error:", error);

      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
      } else if (error.response?.status === 400) {
        const errorMessage =
          error.response.data?.message || error.message || "Invalid request";
        if (errorMessage.includes("stock")) {
          toast.error("Not enough stock available for this book");
        } else if (errorMessage.includes("quantity")) {
          toast.error("Please enter a valid quantity");
        } else {
          toast.error(errorMessage);
        }
      } else if (error.response?.status === 404) {
        toast.error("Book not found");
      } else {
        toast.error(error.message || "Failed to add item to cart");
      }

      dispatch(
        addItemToCartFailure(error.response?.data?.message || error.message)
      );
      throw error;
    }
  };

export const updateCartItemQuantity =
  (cartItemId, quantity) => async (dispatch) => {
    dispatch(updateCartItemRequest());

    try {
      if (!quantity || quantity <= 0) {
        throw new Error("Quantity must be greater than 0");
      }

      const result = await axios.put(
        `${baseURL}/cart/items/${cartItemId}/quantity?quantity=${quantity}`,
        {},
        {
          headers: getAuthHeaders(),
        }
      );

      dispatch(updateCartItemSuccess(result.data));
      toast.success("Cart item updated successfully!");
      return result.data;
    } catch (error) {
      console.error("Update cart item error:", error);

      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
      } else if (error.response?.status === 400) {
        const errorMessage = error.response.data?.message || error.message;
        if (errorMessage.includes("stock")) {
          toast.error("Not enough stock available for this quantity");
        } else if (errorMessage.includes("quantity")) {
          toast.error("Please enter a valid quantity");
        } else {
          toast.error(errorMessage);
        }
      } else if (error.response?.status === 404) {
        toast.error("Cart item not found");
      } else {
        toast.error("Failed to update cart item");
      }

      dispatch(
        updateCartItemFailure(error.response?.data?.message || error.message)
      );
      throw error;
    }
  };

export const removeCartItem =
  (accountNumber, cartItemId) => async (dispatch) => {
    dispatch(removeCartItemRequest());

    try {
      if (!accountNumber || !cartItemId) {
        throw new Error("Missing required parameters");
      }

      const result = await axios.delete(
        `${baseURL}/cart/${accountNumber}/items/${cartItemId}`,
        {
          headers: getAuthHeaders(),
        }
      );

      dispatch(removeCartItemSuccess(result.data));
      toast.success("Item removed from cart!");

      await dispatch(getUserCart(accountNumber));

      return result.data;
    } catch (error) {
      console.error("Remove cart item error:", error);

      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
      } else if (error.response?.status === 403) {
        toast.error("You don't have permission to remove this item");
      } else if (error.response?.status === 404) {
        toast.error("Cart item not found");
      } else if (error.response?.status === 400) {
        const errorMessage = error.response.data?.message || "Invalid request";
        if (errorMessage.includes("belong")) {
          toast.error("This item doesn't belong to your cart");
        } else {
          toast.error(errorMessage);
        }
      } else {
        toast.error("Failed to remove item from cart");
      }

      dispatch(
        removeCartItemFailure(error.response?.data?.message || error.message)
      );
      throw error;
    }
  };

export const clearCart = (accountNumber) => async (dispatch) => {
  dispatch(clearCartRequest());

  try {
    if (!accountNumber) {
      throw new Error("Account number is required");
    }

    const result = await axios.delete(
      `${baseURL}/cart/${accountNumber}/clear`,
      {
        headers: getAuthHeaders(),
      }
    );

    dispatch(clearCartSuccess(result.data));
    toast.success("Cart cleared successfully!");

    await dispatch(getUserCart(accountNumber));

    return result.data;
  } catch (error) {
    console.error("Clear cart error:", error);

    if (error.response?.status === 401) {
      toast.error("Session expired. Please login again.");
    } else if (error.response?.status === 404) {
      toast.error("No active cart found");
    } else if (error.response?.status === 500) {
      const errorMessage = error.response.data?.message || "Server error";
      if (errorMessage.includes("Failed to clear cart")) {
        toast.error("Unable to clear cart. Please try again.");
      } else {
        toast.error("Server error occurred while clearing cart");
      }
    } else {
      toast.error("Failed to clear cart");
    }

    dispatch(clearCartFailure(error.response?.data?.message || error.message));
    throw error;
  }
};

export const checkoutCart = (accountNumber) => async (dispatch) => {
  dispatch(checkoutCartRequest());

  try {
    const result = await axios.post(
      `${baseURL}/cart/${accountNumber}/checkout`,
      {},
      {
        headers: getAuthHeaders(),
      }
    );

    dispatch(checkoutCartSuccess(result.data));
    toast.success("Checkout completed successfully!");
    return result.data;
  } catch (error) {
    console.error("Checkout cart error:", error);

    if (error.response?.status === 401) {
      toast.error("Session expired. Please login again.");
    } else if (error.response?.status === 400) {
      toast.error(error.response.data?.message || "Cannot checkout empty cart");
    } else {
      toast.error("Failed to checkout cart");
    }

    dispatch(
      checkoutCartFailure(error.response?.data?.message || error.message)
    );
    throw error;
  }
};

export const createCartForUser = (accountNumber) => async (dispatch) => {
  try {
    const result = await axios.post(
      `${baseURL}/cart/${accountNumber}/create`,
      {},
      {
        headers: getAuthHeaders(),
      }
    );

    dispatch(getCartSuccess(result.data));
    return result.data;
  } catch (error) {
    console.error("Create cart error:", error);
    dispatch(getCartFailure(error.response?.data?.message || error.message));
    throw error;
  }
};
