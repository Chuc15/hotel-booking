

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import HomePage from "./pages/user/HomePage";
import BookingPage from "./pages/user/BookingPage";
import PaymentPage from "./pages/user/PaymentPage";
import ReviewPage from "./pages/user/ReviewPage";
import AboutPage from "./pages/shared/AboutPage";
import RoomTypePage from "./pages/user/RoomTypePage";
import RoomPage from "./pages/user/RoomPage";
import ContactPage from "./pages/shared/ContactPage";
import AdminLayout from "./pages/admin/AdminLayout";
import PaymentResult from "./pages/admin/PaymentResult";




function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/rooms" element={<RoomPage />} />
          <Route path="/admin" element={<AdminLayout />} />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/review" element={<ReviewPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/roomtype" element={<RoomTypePage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/payment-result" element={<PaymentResult />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;