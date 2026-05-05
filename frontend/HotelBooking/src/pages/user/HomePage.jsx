import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import '../../pages/AuthPages.css';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getRooms } from "../../api/roomApi";

const defaultImages = [
  'https://images.unsplash.com/photo-1566665797739-1674de7a421a',
  'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b',
  'https://images.unsplash.com/photo-1590490360182-c33d57733427',
  'https://images.unsplash.com/photo-1631049307264-da0ec9d70304',
  'https://images.unsplash.com/photo-1578683010236-d716f9a3f461'
];

export default function HomePage() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [checkIn, setCheckIn] = useState(today);
  const [checkOut, setCheckOut] = useState(tomorrow);
  const [showGuestPanel, setShowGuestPanel] = useState(false);
  const [guests, setGuests] = useState({ rooms: 1, adults: 2, children: 0 });

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const data = await getRooms({ page: 1, pageSize: 100 });
        const roomsArray = Array.isArray(data) ? data : data.data || data.items || [];
        
        // Lấy tất cả phòng đang "Trống" hoặc "Đang sử dụng" theo ý user 
        // Thường trang chủ sẽ show các phòng để book, ta ưu tiên hiển thị "Trống"
        const availableRooms = roomsArray.filter(r => r.status === "Trống");

        const formattedRooms = availableRooms.map((r, index) => ({
          id: r.id,
          name: `Phòng ${r.number}`,
          type: r.roomTypeName,
          price: r.pricePerNight,
          image: defaultImages[index % defaultImages.length],
          maxOccupancy: r.capacity || 2,
        }));
        setRooms(formattedRooms);
        setFilteredRooms(formattedRooms);
      } catch (error) {
        console.error("Lỗi khi tải danh sách phòng:", error);
      }
    };
    fetchRooms();
  }, []);

  const handleGuestChange = (field, delta) => {
    setGuests((prev) => {
      const nextValue = Math.max(0, prev[field] + delta);
      if (field === 'rooms' && nextValue < 1) {
        return { ...prev, rooms: 1 };
      }

      let newGuests = { ...prev, [field]: nextValue };

      // Nếu tăng phòng và tổng khách = số phòng hiện tại, tăng adults theo
      if (field === 'rooms' && delta > 0) {
        const currentTotal = prev.adults + prev.children;
        if (currentTotal === prev.rooms) {
          newGuests.adults = prev.adults + 1;
        }
      }

      return newGuests;
    });
  };

  const totalGuests = guests.adults + guests.children;
  const canDecreaseGuests = totalGuests > guests.rooms;

  const handleSearch = () => {
    if (!checkIn || !checkOut || checkOut <= checkIn) {
      setFilteredRooms([]);
      return;
    }

    const totalGuests = guests.adults + guests.children;
    setFilteredRooms(
      rooms.filter((room) => room.maxOccupancy >= totalGuests)
    );

    navigate('/rooms', {
      state: {
        checkIn,
        checkOut,
        guests,
      },
    });
  };

  return (
    <div className="home-wrap">

      <Header />

      {/* HERO */}
      <section className="home-hero">
        <img
          src="https://images.unsplash.com/photo-1551882547-ff40c63fe5fa"
          className="hero-img"
        />
        <div className="hero-overlay">
          <h1>Luxury Hotel Hanoi</h1>
          <p>Trải nghiệm đẳng cấp 5 sao ngay trung tâm Hà Nội</p>
        </div>
      </section>

      {/* SEARCH */}
      <section className="home-search home-container">
        <div className="home-search-box">
          <div className="input-group">
            <label>Ngày nhận phòng</label>
            <DatePicker
              selected={checkIn}
              onChange={(date) => {
                setCheckIn(date);
                if (!checkOut || date >= checkOut) {
                  const nextDay = new Date(date);
                  nextDay.setDate(date.getDate() + 1);
                  setCheckOut(nextDay);
                }
              }}
              onFocus={() => setShowGuestPanel(false)}
              minDate={today}
              dateFormat="dd/MM/yyyy"
              className="input-date"
            />
          </div>

          <div className="input-group">
            <label>Ngày trả phòng</label>
            <DatePicker
              selected={checkOut}
              onChange={(date) => setCheckOut(date)}
              onFocus={() => setShowGuestPanel(false)}
              minDate={checkIn || today}
              dateFormat="dd/MM/yyyy"
              className="input-date"
            />
          </div>

          <div className="input-group guest-input-group">
            <label>Số phòng / Khách</label>
            <button type="button" className="guest-toggle" onClick={() => setShowGuestPanel((v) => !v)}>
              {guests.rooms} phòng, {totalGuests} khách
            </button>
            {showGuestPanel && (
              <div className="guest-panel">
                <div className="guest-row">
                  <div>
                    <p>Phòng</p>
                    <span>{guests.rooms}</span>
                  </div>
                  <div className="guest-buttons">
                    <button type="button" onClick={() => handleGuestChange('rooms', -1)}>-</button>
                    <button type="button" onClick={() => handleGuestChange('rooms', 1)}>+</button>
                  </div>
                </div>
                <div className="guest-row">
                  <div>
                    <p>Người lớn</p>
                    <span>{guests.adults}</span>
                  </div>
                  <div className="guest-buttons">
                    <button type="button" disabled={!canDecreaseGuests || guests.adults <= 0} onClick={() => handleGuestChange('adults', -1)}>-</button>
                    <button type="button" onClick={() => handleGuestChange('adults', 1)}>+</button>
                  </div>
                </div>
                <div className="guest-row">
                  <div>
                    <p>Trẻ em</p>
                    <span>{guests.children}</span>
                  </div>
                  <div className="guest-buttons">
                    <button type="button" disabled={!canDecreaseGuests || guests.children <= 0} onClick={() => handleGuestChange('children', -1)}>-</button>
                    <button type="button" onClick={() => handleGuestChange('children', 1)}>+</button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <button type="button" className="home-btn-gold" onClick={handleSearch} onFocus={() => setShowGuestPanel(false)}>
            Tìm kiếm
          </button>
        </div>
      </section>

      {/* ROOMS */}
      <section className="home-hotels home-container">
        <h2 className="home-section-title">Các loại phòng</h2>
        <div className="home-hotels-grid">
          {filteredRooms.length ? filteredRooms.map((room, i) => (
           <div 
  className="hotel-card" 
  key={i}
  onClick={() => navigate('/rooms', {
    state: { checkIn, checkOut, guests }
  })}
  style={{ cursor: "pointer" }}
>
              <div className="hotel-img">
                <img src={room.image} alt={room.name} />
                <div className="hotel-overlay">
                  <h3>{room.name}</h3>
                  <p>{room.price?.toLocaleString("vi-VN")}₫ / đêm</p>
                </div>
              </div>
            </div>
          )) : (
            <div className="no-results">Không tìm thấy phòng phù hợp với lựa chọn của bạn.</div>
          )}
        </div>
      </section>

      {/* WHY */}
      <section className="home-why home-container">
        <h2 className="home-section-title">
          Tại sao chọn chúng tôi tại Hà Nội?
        </h2>

        <div className="home-why-grid">
          <div className="home-why-item">📍 Gần Hồ Gươm, phố cổ</div>
          <div className="home-why-item">⭐ Tiêu chuẩn khách sạn 5 sao</div>
          <div className="home-why-item">💰 Giá tốt, nhiều ưu đãi</div>
          <div className="home-why-item">📞 Hỗ trợ 24/7</div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="home-services home-container">
        <h2 className="home-section-title">Dịch vụ của chúng tôi</h2>

        <div className="home-hotels-grid">
          <div className="hotel-card">
            <img src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb" />
            <h3>Hồ bơi</h3>
          </div>

          <div className="hotel-card">
            <img src="https://images.unsplash.com/photo-1551632811-561732d1e306" />
            <h3>Spa & Massage</h3>
          </div>

          <div className="hotel-card">
            <img src="https://images.unsplash.com/photo-1555992336-03a23c7b20ee" />
            <h3>Nhà hàng</h3>
          </div>

          <div className="hotel-card">
            <img src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267" />
            <h3>Gym</h3>
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section className="home-gallery home-container">
        <h2 className="home-section-title">Hình ảnh khách sạn</h2>

        <div className="home-destinations-grid">
          <img src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2" />
          <img src="https://images.unsplash.com/photo-1578683010236-d716f9a3f461" />
          <img src="https://images.unsplash.com/photo-1584132967334-10e028bd69f7" />
          <img src="https://images.unsplash.com/photo-1590490360182-c33d57733427" />
        </div>
      </section>

      {/* ACHIEVEMENTS */}
      <section className="home-achievements">
        <div className="home-container">
          <h2 className="home-title-center">Thành tựu & giải thưởng</h2>

          <div className="achievement-grid">
            {[
              { img: '	https://www.vietnambooking.com/wp-content/uploads/2019/08/top-20-famous-brand-2019.png', title: 'GIẢI THƯỞNG', desc: 'Top 20 thương hiệu 2019' },
              { img: '	https://www.vietnambooking.com/wp-content/uploads/2019/05/01.png', title: 'TOP 10', desc: 'Dịch vụ xuất sắc' },
              { img: '	https://www.vietnambooking.com/wp-content/uploads/2019/05/02.png', title: 'BẰNG VÀNG', desc: 'Doanh nghiệp uy tín' },
              { img: 'https://www.vietnambooking.com/wp-content/uploads/2019/05/03.png', title: 'DANH HIỆU', desc: 'Tiêu biểu ngành du lịch' },
              { img: '	https://www.vietnambooking.com/wp-content/uploads/2019/05/04.png', title: 'AWARDS', desc: 'The Guide Awards' },
              { img: 'https://www.vietnambooking.com/wp-content/uploads/2019/05/05.png', title: 'GIẢI THƯỞNG', desc: 'Doanh nghiệp văn hóa' }
            ].map((item, i) => (
              <div className="achievement-item" key={i}>
                <img src={item.img} />
                <h4>{item.title}</h4>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRESS */}
      <section className="home-press">
        <div className="home-container">
          <h2 className="home-title-center">
            Vietnam Booking đã được nhắc đến trên
          </h2>

          <div className="press-grid">
  {[
    'https://www.vietnambooking.com/wp-content/uploads/2019/08/logo.png',
    'https://www.vietnambooking.com/wp-content/uploads/2019/03/24_h.png',
    'https://www.vietnambooking.com/wp-content/uploads/2019/03/tien_phong.png',
    'https://www.vietnambooking.com/wp-content/uploads/2019/07/thanhnien.png',
    'https://www.vietnambooking.com/wp-content/uploads/2019/08/vcci-la-gi.png'
  ].map((logo, i) => (
    <div className="press-item" key={i}>
      <img src={logo} alt="press logo" />
    </div>
  ))}
</div>
        </div>
      </section>

      <Footer />
    </div>
  );
}