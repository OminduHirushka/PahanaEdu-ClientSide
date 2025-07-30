import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  categories: [],
  category: null,
  isLoading: false,
  error: null,
  success: null,
  totalCategories: 0,
  searchQuery: "",
};

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    getCategoriesRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    getCategoriesSuccess: (state, action) => {
      state.isLoading = false;
      state.categories = action.payload.allCategories || action.payload;
      state.totalCategories = state.categories.length;
      state.error = null;
      state.success = "Categories fetched successfully";
    },
    getCategoriesFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      state.categories = [];
    },

    getCategoryRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    getCategorySuccess: (state, action) => {
      state.isLoading = false;
      state.category = action.payload;
      state.error = null;
      state.success = "Category fetched successfully";
    },
    getCategoryFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      state.category = null;
    },

    createCategoryRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    createCategorySuccess: (state, action) => {
      state.isLoading = false;
      state.categories.unshift(action.payload);
      state.totalCategories += 1;
      state.error = null;
      state.success = "Category created successfully";
    },
    createCategoryFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    updateCategoryRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    updateCategorySuccess: (state, action) => {
      state.isLoading = false;
      const updatedCategory = action.payload;
      const index = state.categories.findIndex(
        (category) => category.id === updatedCategory.id
      );
      if (index !== -1) {
        state.categories[index] = updatedCategory;
      }
      if (state.category && state.category.id === updatedCategory.id) {
        state.category = updatedCategory;
      }
      state.error = null;
      state.success = "Category updated successfully";
    },
    updateCategoryFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    deleteCategoryRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    deleteCategorySuccess: (state, action) => {
      state.isLoading = false;
      const categoryId = action.payload;
      state.categories = state.categories.filter(
        (category) => category.id !== categoryId
      );
      state.totalCategories -= 1;
      if (state.category && state.category.id === categoryId) {
        state.category = null;
      }
      state.error = null;
      state.success = "Category deleted successfully";
    },
    deleteCategoryFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },

    clearCategoryState: (state) => {
      state.category = null;
      state.error = null;
      state.success = null;
    },
    clearCategoriesState: (state) => {
      return initialState;
    },
  },
});

export const {
  getCategoriesRequest,
  getCategoriesSuccess,
  getCategoriesFailure,
  getCategoryRequest,
  getCategorySuccess,
  getCategoryFailure,
  createCategoryRequest,
  createCategorySuccess,
  createCategoryFailure,
  updateCategoryRequest,
  updateCategorySuccess,
  updateCategoryFailure,
  deleteCategoryRequest,
  deleteCategorySuccess,
  deleteCategoryFailure,
  setSearchQuery,
  clearCategoryState,
  clearCategoriesState,
} = categorySlice.actions;

export default categorySlice.reducer;
