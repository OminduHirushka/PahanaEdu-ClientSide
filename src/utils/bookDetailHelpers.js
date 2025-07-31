/**
 * Extract category name from a book object
 * @param {Object} book - The book object
 * @returns {string} The category name or fallback text
 */
export const getCategoryName = (book) => {
  if (book?.categoryName) {
    return book.categoryName;
  }
  if (
    book?.category &&
    typeof book.category === "object" &&
    book.category.name
  ) {
    return book.category.name;
  }
  return "No Category";
};

/**
 * Extract publisher name from a book object
 * @param {Object} book - The book object
 * @returns {string} The publisher name or fallback text
 */
export const getPublisherName = (book) => {
  if (book?.publisherName) {
    return book.publisherName;
  }
  if (
    book?.publisher &&
    typeof book.publisher === "object" &&
    book.publisher.name
  ) {
    return book.publisher.name;
  }
  return "No Publisher";
};

/**
 * Format book price with currency
 * @param {Object} book - The book object
 * @returns {string} Formatted price string
 */
export const formatBookPrice = (book) => {
  const price = Number(book?.price);
  if (isNaN(price)) {
    return "LKR 0.00";
  }
  return `LKR ${price.toFixed(2)}`;
};

/**
 * Check if a book is available for purchase
 * @param {Object} book - The book object
 * @returns {boolean} True if book is available
 */
export const isBookAvailable = (book) => {
  if (book?.isAvailable === false) {
    return false;
  }

  if (book?.stock !== undefined) {
    return book.stock > 0;
  }

  return true;
};

/**
 * Get availability status for display
 * @param {Object} book - The book object
 * @returns {Object} Object with availability information
 */
export const getAvailabilityStatus = (book) => {
  const available = isBookAvailable(book);

  if (available) {
    const stockText = book?.stock ? ` (${book.stock} available)` : "";
    return {
      available: true,
      text: `In Stock${stockText}`,
      color: "#52c41a",
      icon: "CheckCircleOutlined",
    };
  }

  return {
    available: false,
    text: "Out of Stock",
    color: "#ff4d4f",
    icon: "CloseCircleOutlined",
  };
};

/**
 * Validate if book has required information for display
 * @param {Object} book - The book object
 * @returns {boolean} True if book has minimum required info
 */
export const isValidBook = (book) => {
  return book && book.name && book.price !== undefined;
};

/**
 * Get book display title with fallback
 * @param {Object} book - The book object
 * @returns {string} Book title or fallback
 */
export const getBookTitle = (book) => {
  return book?.name || book?.title || "Untitled Book";
};

/**
 * Get book ISBN with formatting
 * @param {Object} book - The book object
 * @returns {string} Formatted ISBN or fallback
 */
export const getFormattedISBN = (book) => {
  if (!book?.isbn) {
    return "ISBN not available";
  }
  return book.isbn;
};

/**
 * Get book page count with formatting
 * @param {Object} book - The book object
 * @returns {string} Formatted page count or fallback
 */
export const getFormattedPageCount = (book) => {
  if (!book?.pages) {
    return null;
  }
  return `${book.pages} pages`;
};
