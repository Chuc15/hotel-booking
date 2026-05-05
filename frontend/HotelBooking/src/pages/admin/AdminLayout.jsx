import { useState } from "react";
import "./css/Admin.css";
import Dashboard from "../admin/Dashboard";
import ManageRoom from "../admin/ManageRooms";
import ManageRoomTypes from "../admin/ManageRoomTypes";
import ManageBooking from "../admin/ManageBookings";
import ManageUser from "../admin/ManageUsers";
import { useNavigate } from "react-router-dom";
export default function AdminLayout() {
  const [tab, setTab] = useState("dashboard");
    const navigate = useNavigate();

const handleLogout = () => {
  localStorage.removeItem("token"); // xóa JWT
  navigate("/login"); // về login
};
    
    
 const renderContent = () => {
  switch (tab) {
    case "dashboard":
      return <Dashboard />;
    case "booking":
      return <ManageBooking />;
    case "roomtype":
      return <ManageRoomTypes />;
    case "room":
      return <ManageRoom />;
    case "user":
      return <ManageUser />;
    default:
      return <Dashboard />;
  }
};

  return (
    <div className="admin-container">
      
      {/* Sidebar */}
      <div className="sidebar">
        <h2 className="logo">ADMIN</h2>

        <div 
          className={`menu-item ${tab === "dashboard" ? "active" : ""}`}
          onClick={() => setTab("dashboard")}
        >
          Dashboard
        </div>

        <div 
          className={`menu-item ${tab === "booking" ? "active" : ""}`}
          onClick={() => setTab("booking")}
        >
           Quản lý đặt phòng
        </div>

        <div 
          className={`menu-item ${tab === "roomtype" ? "active" : ""}`}
          onClick={() => setTab("roomtype")}
        >
           Quản lý loại phòng
        </div>

        <div 
          className={`menu-item ${tab === "room" ? "active" : ""}`}
          onClick={() => setTab("room")}
        >
           Quản lý phòng
        </div>

        <div 
          className={`menu-item ${tab === "user" ? "active" : ""}`}
          onClick={() => setTab("user")}
        >
          Quản lý người dùng
        </div>
         <div className="logout" onClick={handleLogout}>
    <i className="fa fa-sign-out-alt"></i> Đăng xuất
  </div>
      </div>

      {/* Main */}
      <div className="main">
        
     
       

        {/* Content */}
        <div className="content">
          <div className="card">
            {renderContent()}
          </div>
        </div>

      </div>
      
    </div>
  );
}