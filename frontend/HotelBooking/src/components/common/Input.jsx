import React from "react";

const Input = React.forwardRef(
  ({ type = "text", placeholder, ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        placeholder={placeholder}
        {...props} // 🔥 QUAN TRỌNG
        style={{
          padding: "10px",
          marginBottom: "10px",
          width: "100%",
          borderRadius: "6px",
          border: "1px solid #ccc",
        }}
      />
    );
  }
);

export default Input;