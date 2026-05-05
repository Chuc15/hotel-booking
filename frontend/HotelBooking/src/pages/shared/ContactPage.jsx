import { useState } from "react";
import '../../pages/AuthPages.css';
import Footer from '../../components/layout/Footer';
import Header from "../../components/layout/Header";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!form.name.trim()) {
      newErrors.name = 'Vui lòng nhập họ và tên';
    } else if (form.name.trim().length < 2) {
      newErrors.name = 'Họ và tên phải có ít nhất 2 ký tự';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email.trim()) {
      newErrors.email = 'Vui lòng nhập email';
    } else if (!emailRegex.test(form.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (!form.message.trim()) {
      newErrors.message = 'Vui lòng nhập nội dung liên hệ';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      alert("Gửi liên hệ thành công!");
      setForm({ name: "", email: "", message: "" });
    }
  };

  return (
    <div className="home-wrap">
      <Header />
      
      {/* Page Header */}
      <section className="mt-page-header">
        <h1>Liên hệ với chúng tôi</h1>
        <p>Chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7</p>
      </section>

      {/* Contact Section */}
      <section className="mt-contact-section">
        <div className="mt-contact-container">
          {/* Contact Info */}
          <div className="mt-contact-info">
            <h2>Grand Hotel</h2>
            <p className="mt-contact-desc">Hệ thống đặt phòng khách sạn cao cấp</p>

            <div className="mt-contact-items">
              <div className="mt-contact-item">
                <span className="mt-contact-icon">📍</span>
                <div>
                  <strong>Địa chỉ</strong>
                  <p>123 Trần Phú, Quận Hoàn Kiếm, Hà Nội</p>
                </div>
              </div>
              <div className="mt-contact-item">
                <span className="mt-contact-icon">📞</span>
                <div>
                  <strong>Điện thoại</strong>
                  <p>0123 456 789</p>
                </div>
              </div>
              <div className="mt-contact-item">
                <span className="mt-contact-icon">✉️</span>
                <div>
                  <strong>Email</strong>
                  <p>support@grandhotel.com</p>
                </div>
              </div>
              <div className="mt-contact-item">
                <span className="mt-contact-icon">🌐</span>
                <div>
                  <strong>Website</strong>
                  <p>www.grandhotel.com</p>
                </div>
              </div>
            </div>

            <div className="mt-contact-note">
              Phản hồi trong vòng 24 giờ
            </div>
          </div>

          {/* Contact Form */}
          <form className="mt-contact-form" onSubmit={handleSubmit}>
            <h2>Gửi tin nhắn</h2>

            <div className="mt-form-group">
              <label>Họ và tên *</label>
              <input
                type="text"
                name="name"
                placeholder="Nhập họ và tên"
                value={form.name}
                onChange={handleChange}
                className={errors.name ? 'error' : ''}
              />
              {errors.name && <span className="mt-error">{errors.name}</span>}
            </div>

            <div className="mt-form-group">
              <label>Email *</label>
              <input
                type="email"
                name="email"
                placeholder="Nhập email của bạn"
                value={form.email}
                onChange={handleChange}
                className={errors.email ? 'error' : ''}
              />
              {errors.email && <span className="mt-error">{errors.email}</span>}
            </div>

            <div className="mt-form-group">
              <label>Nội dung *</label>
              <textarea
                name="message"
                placeholder="Nhập nội dung liên hệ..."
                rows="5"
                value={form.message}
                onChange={handleChange}
                className={errors.message ? 'error' : ''}
              ></textarea>
              {errors.message && <span className="mt-error">{errors.message}</span>}
            </div>

            <button type="submit" className="home-btn-gold mt-submit-btn">Gửi liên hệ</button>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
}
