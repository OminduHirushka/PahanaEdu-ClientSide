import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../auth/authSlice";
import categoryReducer from "../category/categorySlice";
import publisherReducer from "../publisher/publisherSlice";
import bookReducer from "../book/bookSlice";
import userReducer from "../user/userSlice";
import cartReducer from "../cart/cartSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    category: categoryReducer,
    publisher: publisherReducer,
    book: bookReducer,
    user: userReducer,
    cart: cartReducer,
  },
});
