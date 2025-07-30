import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../auth/authSlice";
import categoryReducer from "../category/categorySlice";
import publisherReducer from "../publisher/publisherSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    category: categoryReducer,
    publisher: publisherReducer,
  },
});
