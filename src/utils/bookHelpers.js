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
 * @param {number} price - The price value
 * @returns {string} Formatted price string
 */
export const formatBookPrice = (price) => {
  const numericPrice = Number(price);
  if (isNaN(numericPrice)) {
    return "LKR 0.00";
  }
  return `LKR ${numericPrice.toFixed(2)}`;
};

/**
 * Generate unique category options from books and categories arrays
 * @param {Array} books - Array of book objects
 * @param {Array} categories - Array of category objects
 * @returns {Array} Array of category options for dropdowns
 */
export const generateCategoryOptions = (books = [], categories = []) => {
  const options = [{ value: "all", label: "All Categories" }];

  const bookCategoryNames = Array.from(
    new Set(
      books
        .map((book) => getCategoryName(book))
        .filter((name) => name && name !== "No Category")
    )
  ).map((name) => ({ value: name, label: name }));

  const categoryArrayOptions = categories
    .filter((cat) => cat?.name)
    .map((cat) => ({ value: cat.name, label: cat.name }));

  const allOptions = [
    ...options,
    ...bookCategoryNames,
    ...categoryArrayOptions,
  ];
  return allOptions.filter(
    (option, index, self) =>
      index === self.findIndex((o) => o.value === option.value)
  );
};

/**
 * Generate unique publisher options from books and publishers arrays
 * @param {Array} books - Array of book objects
 * @param {Array} publishers - Array of publisher objects
 * @returns {Array} Array of publisher options for dropdowns
 */
export const generatePublisherOptions = (books = [], publishers = []) => {
  const options = [{ value: "all", label: "All Publishers" }];

  const bookPublisherNames = Array.from(
    new Set(
      books
        .map((book) => getPublisherName(book))
        .filter((name) => name && name !== "No Publisher")
    )
  ).map((name) => ({ value: name, label: name }));

  const publisherArrayOptions = publishers
    .filter((pub) => pub?.name)
    .map((pub) => ({ value: pub.name, label: pub.name }));

  const allOptions = [
    ...options,
    ...bookPublisherNames,
    ...publisherArrayOptions,
  ];
  return allOptions.filter(
    (option, index, self) =>
      index === self.findIndex((o) => o.value === option.value)
  );
};

/**
 * Filter books based on search query and filters
 * @param {Array} books - Array of book objects
 * @param {string} searchQuery - Search term
 * @param {Object} filters - Filter object with category and publisher
 * @returns {Array} Filtered books array
 */
export const filterBooks = (books = [], searchQuery = "", filters = {}) => {
  return books.filter((book) => {
    const matchesSearch =
      book?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false;

    const categoryName = getCategoryName(book);
    const matchesCategory =
      !filters.category ||
      filters.category === "all" ||
      categoryName === filters.category;

    const publisherName = getPublisherName(book);
    const matchesPublisher =
      !filters.publisher ||
      filters.publisher === "all" ||
      publisherName === filters.publisher;

    return matchesSearch && matchesCategory && matchesPublisher;
  });
};
