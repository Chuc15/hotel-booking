import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import '../../pages/AuthPages.css';

export default function BookingPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedRoom = location.state?.room || null;
  
  const [rooms, setRooms] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    checkIn: '',
    checkOut: '',
    promotion: '',
    specialRequest: ''
  });
  const [errors, setErrors] = useState({});

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
      .format(price).replace('₫', 'VNĐ');
  };

  const calculateNights = () => {
    if (!formData.checkIn || !formData.checkOut) return 0;
    return Math.ceil((new Date(formData.checkOut) - new Date(formData.checkIn)) / (1000 * 60 * 60 * 24));
  };

  const calculateTotal = () => {
    if (!selectedRoom) return 0;
    const nights = calculateNights();
    const roomPrice = selectedRoom.price * rooms * nights;
    const tax = roomPrice * 0.1;
    return { roomPrice, tax, total: roomPrice + tax };
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error when user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Vui lòng nhập họ và tên';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Họ và tên phải có ít nhất 2 ký tự';
    }

    // Phone validation
    const phoneRegex = /^[0-9]{10,11}$/;
    if (!formData.phone.trim()) {
      newErrors.phone = 'Vui lòng nhập số điện thoại';
    } else if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Số điện thoại không hợp lệ (10-11 số)';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Vui lòng nhập email';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    // Date validation
    if (!formData.checkIn) {
      newErrors.checkIn = 'Vui lòng chọn ngày nhận phòng';
    }

    if (!formData.checkOut) {
      newErrors.checkOut = 'Vui lòng chọn ngày trả phòng';
    }

    if (formData.checkIn && formData.checkOut) {
      const checkInDate = new Date(formData.checkIn);
      const checkOutDate = new Date(formData.checkOut);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (checkInDate < today) {
        newErrors.checkIn = 'Ngày nhận phòng không được trong quá khứ';
      }

      if (checkOutDate <= checkInDate) {
        newErrors.checkOut = 'Ngày trả phòng phải sau ngày nhận phòng';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const bookingData = {
        room: selectedRoom,
        guestInfo: formData,
        rooms,
        nights: calculateNights(),
        pricing: calculateTotal()
      };
      navigate('/payment', { state: { booking: bookingData } });
    }
  };

  const increaseRooms = () => {
    if (rooms < 10) setRooms(rooms + 1);
  };

  const decreaseRooms = () => {
    if (rooms > 1) setRooms(rooms - 1);
  };

  return (
    <div className="home-wrap">
      <Header />
      
      {/* Page Header */}
      <section className="mt-page-header">
        <h1>Đặt phòng</h1>
        <p>Chọn phòng và điền thông tin để hoàn tất đặt phòng</p>
      </section>

      {/* Booking Form */}
      <section className="mt-booking-section">
        <div className="mt-booking-container">
          {/* Summary - Left Side */}
          <div className="mt-booking-summary">
            <h2>Tóm tắt đặt phòng</h2>
            {selectedRoom && (
              <div className="mt-room-selected">
                <img src={selectedRoom.image} alt={selectedRoom.name} />
                <div>
                  <h4>{selectedRoom.name}</h4>
                  <p>{selectedRoom.type}</p>
                </div>
              </div>
            )}
            <div className="mt-summary-item">
              <span>Khách sạn</span>
              <strong>Grand Hotel</strong>
            </div>
            <div className="mt-summary-item">
              <span>Loại phòng</span>
              <strong>{selectedRoom?.name || 'Chưa chọn'}</strong>
            </div>
            <div className="mt-summary-item">
              <span>Số phòng</span>
              <strong>{rooms} Phòng</strong>
            </div>
            <div className="mt-summary-item">
              <span>Ngày nhận</span>
              <strong>{formData.checkIn || 'Chưa chọn'}</strong>
            </div>
            <div className="mt-summary-item">
              <span>Ngày trả</span>
              <strong>{formData.checkOut || 'Chưa chọn'}</strong>
            </div>
            <div className="mt-summary-item">
              <span>Số đêm</span>
              <strong>{calculateNights() || 'Chưa chọn'}</strong>
            </div>
            <div className="mt-summary-divider"></div>
            <div className="mt-summary-item">
              <span>Giá phòng</span>
              <span>{formatPrice(calculateTotal().roomPrice)}</span>
            </div>
            <div className="mt-summary-item">
              <span>Thuế & phí (10%)</span>
              <span>{formatPrice(calculateTotal().tax)}</span>
            </div>
            <div className="mt-summary-total">
              <span>Tổng cộng</span>
              <strong>{formatPrice(calculateTotal().total)}</strong>
            </div>
          </div>

          {/* Form - Right Side */}
          <form className="mt-booking-form" onSubmit={handleSubmit}>
            <h2>Thông tin đặt phòng</h2>
            
            <div className="mt-form-row">
              <div className="mt-form-group">
                <label>Họ và tên *</label>
                <input 
                  type="text" 
                  name="name"
                  placeholder="Nhập họ và tên" 
                  value={formData.name}
                  onChange={handleChange}
                  className={errors.name ? 'error' : ''}
                />
                {errors.name && <span className="mt-error">{errors.name}</span>}
              </div>
              <div className="mt-form-group">
                <label>Số điện thoại *</label>
                <input 
                  type="tel" 
                  name="phone"
                  placeholder="Nhập số điện thoại" 
                  value={formData.phone}
                  onChange={handleChange}
                  className={errors.phone ? 'error' : ''}
                />
                {errors.phone && <span className="mt-error">{errors.phone}</span>}
              </div>
            </div>

            <div className="mt-form-group">
              <label>Email *</label>
              <input 
                type="email" 
                name="email"
                placeholder="Nhập email" 
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? 'error' : ''}
              />
              {errors.email && <span className="mt-error">{errors.email}</span>}
            </div>

            <div className="mt-form-row">
              <div className="mt-form-group">
                <label>Ngày nhận phòng *</label>
                <input 
                  type="date" 
                  name="checkIn"
                  value={formData.checkIn}
                  onChange={handleChange}
                  className={errors.checkIn ? 'error' : ''}
                />
                {errors.checkIn && <span className="mt-error">{errors.checkIn}</span>}
              </div>
              <div className="mt-form-group">
                <label>Ngày trả phòng *</label>
                <input 
                  type="date" 
                  name="checkOut"
                  value={formData.checkOut}
                  onChange={handleChange}
                  className={errors.checkOut ? 'error' : ''}
                />
                {errors.checkOut && <span className="mt-error">{errors.checkOut}</span>}
              </div>
            </div>

            <div className="mt-form-row">
              <div className="mt-form-group">
                <label>Số phòng</label>
                <div className="mt-counter">
                  <button type="button" onClick={decreaseRooms} disabled={rooms <= 1}>−</button>
                  <span>{rooms}</span>
                  <button type="button" onClick={increaseRooms} disabled={rooms >= 10}>+</button>
                </div>
              </div>
              <div className="mt-form-group">
                <label>Khuyến mãi</label>
                <select 
                  name="promotion"
                  value={formData.promotion}
                  onChange={handleChange}
                >
                  <option value="">Chọn khuyến mãi</option>
                  <option value="early">Giảm 10% đặt sớm</option>
                  <option value="weekend">Giảm 15% cuối tuần</option>
                  <option value="vip">Giảm 20% khách VIP</option>
                  <option value="newyear">Giảm 25% Tết Nguyên Đán</option>
                </select>
              </div>
            </div>

            <div className="mt-form-group">
              <label>Yêu cầu đặc biệt</label>
              <textarea 
                name="specialRequest"
                placeholder="Nhập yêu cầu đặc biệt (nếu có)" 
                rows="3"
                value={formData.specialRequest}
                onChange={handleChange}
              ></textarea>
            </div>

            <button type="submit" className="home-btn-gold mt-submit-btn">Xác nhận đặt phòng</button>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
}
