export const generateInvoicePDF = (order) => {
  const invoiceContent = `
    PAHANA EDU - INVOICE
    ==================
    
    Order Number: ${order.orderNumber}
    Date: ${new Date(order.createdAt).toLocaleDateString()}
    
    Customer Information:
    Name: ${order.userName || order.user?.fullName || order.user?.name || "N/A"}
    Account Number: ${
      order.userAccountNumber || order.user?.accountNumber || "N/A"
    }
    Address: ${order.address || order.user?.address || "N/A"}
    
    Order Items:
    ${
      order.items
        ?.map((item) => {
          const bookName =
            item.bookName ||
            item.book?.name ||
            item.book?.bookName ||
            "Unknown Book";

          return `- ${bookName} x ${
            item.quantity
          } = Rs. ${item.totalPrice?.toFixed(2)}`;
        })
        .join("\n    ") || "No items"
    }
    
    Order Summary:
    Subtotal: Rs. ${(order.subtotal || order.subTotal)?.toFixed(2)}
    Shipping Fee: Rs. ${order.shippingFee?.toFixed(2)}
    Total Amount: Rs. ${order.totalAmount?.toFixed(2)}
    
    Payment Status: ${order.paymentStatus}
    Order Status: ${order.orderStatus}
  `;

  const blob = new Blob([invoiceContent], { type: "text/plain" });
  const url = window.URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `invoice-${order.orderNumber}.txt`;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  window.URL.revokeObjectURL(url);
};

export const generateInvoicePDFWithJsPDF = (order) => {
  return generateInvoicePDF(order);
};

export default {
  generateInvoicePDF,
  generateInvoicePDFWithJsPDF,
};
