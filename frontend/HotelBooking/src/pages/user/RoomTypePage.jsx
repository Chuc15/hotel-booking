import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import '../../pages/AuthPages.css';
import { getRooms } from '../../api/roomApi';

const defaultImages = [
  'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800',
  'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800',
  'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800',
  'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800',
  'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800'
];

export default function RoomTypePage() {

  const { state } = useLocation();
  const navigate = useNavigate();
  const room = state?.room;
  const [allRooms, setAllRooms] = useState([]);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const data = await getRooms({ page: 1, pageSize: 100 });
        const roomsArray = Array.isArray(data) ? data : data.data || data.items || [];
        // Removed status filter to show all rooms as requested

        const formattedRooms = roomsArray.map((r, i) => ({
          id: r.id,
          name: `Phòng ${r.number}`,
          type: r.roomTypeName || 'Tiêu chuẩn',
          price: r.pricePerNight,
          image: defaultImages[i % defaultImages.length],
          images: [
            defaultImages[i % defaultImages.length],
            defaultImages[(i + 1) % defaultImages.length],
            defaultImages[(i + 2) % defaultImages.length],
            defaultImages[(i + 3) % defaultImages.length]
          ],
          description: `Phòng ${r.number} - Tầng ${r.floor}. Tình trạng: ${r.status}.`,
          amenities: Array.isArray(r.amenities) ? r.amenities : (typeof r.amenities === 'string' ? r.amenities.split(',').map(a => a.trim()) : ['WiFi', 'Air Conditioning']),
          size: `${r.area || 30}m²`,
          capacity: r.capacity || 2,
          capacityText: `${r.capacity || 2} người`,
          bed: r.bedType || '1 giường lớn',
        }));
        setAllRooms(formattedRooms);
      } catch (error) {
        console.error("Lỗi khi tải phòng:", error);
      }
    };
    fetchRooms();
  }, []);

  // 👉 Lưu lịch sử đã xem
  useEffect(() => {
    if (!room) return;

    let recent = JSON.parse(localStorage.getItem("recentRooms")) || [];

    // loại trùng
    recent = recent.filter(r => r.id !== room.id);

    // thêm mới lên đầu
    recent.unshift(room);

    // giới hạn 5 phòng
    if (recent.length > 5) recent.pop();

    localStorage.setItem("recentRooms", JSON.stringify(recent));
  }, [room]);

  // ❌ nếu không có room
  if (!room) {
    return <div>Không tìm thấy phòng</div>;
  }

  // 👉 Lấy lại lịch sử
  const recent = JSON.parse(localStorage.getItem("recentRooms")) || [];

  // 👉 Phòng tương tự
  const relatedRooms = allRooms.filter(
    r => r.type === room.type && r.id !== room.id
  );

  return (
    <div className="home-wrap">
      <Header />

      {/* HEADER */}
      <section className="rt-header">
        <h1>{room.name}</h1>
        <p>{room.description}</p>
      </section>

      {/* GALLERY */}
      <section className="rt-gallery home-container">
        {room.images.map((img, i) => (
          <img key={i} src={img} alt="" />
        ))}
      </section>

      {/* INFO */}
      <section className="rt-info home-container">

        {/* LEFT */}
        <div className="rt-left">
          <h2>Thông tin phòng</h2>

          <div className="rt-grid">
            <span>📐 {room.size}</span>
            <span>👥 {room.capacityText}</span>
            <span>🛏️ {room.bed}</span>
          </div>

          <h3>Tiện nghi</h3>
          <div className="rt-amenities">
            {room.amenities.map((a, i) => (
              <span key={i}>{a}</span>
            ))}
          </div>
        </div>

        {/* RIGHT */}
        <div className="rt-right">
          <div className="rt-price-box">
            <h2>{room.price.toLocaleString()} VNĐ</h2>
            <p>/ đêm</p>

            <div className="rt-policy">
              <p>🕑 Nhận phòng: 14:00</p>
              <p>🕘 Trả phòng: 12:00</p>
            </div>

            <button
              className="home-btn-gold"
              onClick={() => navigate('/booking', { state: { room } })}
            >
              Đặt ngay
            </button>
          </div>
        </div>
      </section>

      {/* 🔥 PHÒNG TƯƠNG TỰ */}
      <section className="home-container">
        <h2>Phòng tương tự</h2>

        <div className="home-hotels-grid">
          {relatedRooms.map(r => (
            <div
              key={r.id}
              className="hotel-card"
              onClick={() => navigate('/roomtype', { state: { room: r } })}
            >
              <img src={r.image} alt="" />
              <h3>{r.name}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* 🔥 LỊCH SỬ ĐÃ XEM */}
      <section className="home-container">
        <h2>Đã xem gần đây</h2>

        <div className="home-hotels-grid">
          {recent.map(r => (
            <div
              key={r.id}
              className="hotel-card"
              onClick={() => navigate('/roomtype', { state: { room: r } })}
            >
              <img src={r.image} alt="" />
              <h3>{r.name}</h3>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}