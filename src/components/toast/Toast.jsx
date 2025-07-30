import React from "react";
import { Toaster } from "react-hot-toast";

const ToastProvider = ({ position = "top-center", ...props }) => {
  return (
    <Toaster
      position={position}
      toastOptions={{
        duration: 3000,
        style: {
          borderRadius: "8px",
        },
        success: {
          style: {
            background: "#52c41a",
            color: "#fff",
          },
        },
        error: {
          style: {
            background: "#ff4d4f",
            color: "#fff",
          },
        },
        loading: {
          style: {
            background: "#1890ff",
            color: "#fff",
          },
        },
        info: {
          style: {
            background: "#1890ff",
            color: "#fff",
          },
        },
      }}
      {...props}
    />
  );
};

export default ToastProvider;
