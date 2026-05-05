function Button({ children, onClick, type = "button", className = "" }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={className}
      style={{
        padding: "15px",
        width: "100%",
        background: "#1A1510",
        color: "#C9A84C",
        border: "1.5px solid #C9A84C",
        borderRadius: "2px",
        fontSize: "12px",
        fontWeight: "500",
        letterSpacing: "2px",
        textTransform: "uppercase",
        cursor: "pointer",
        fontFamily: "'DM Sans', sans-serif",
        position: "relative",
        overflow: "hidden",
        transition: "all 0.25s",
      }}
    >
      <span style={{ position: "relative", zIndex: 1 }}>{children}</span>
    </button>
  );
}

export default Button;