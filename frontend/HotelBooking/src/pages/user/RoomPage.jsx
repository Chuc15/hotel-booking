import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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

export default function RoomPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { checkIn, checkOut, guests } = location.state || {};
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        const data = await getRooms({ page: 1, pageSize: 100 });
        const roomsArray = Array.isArray(data) ? data : data.data || data.items || [];
        
        // Filter out rooms that are not "Trống" if you only want available rooms
        // But the user said "những phòng đang sử dụng", so let's show all or just "Trống"
        // Usually users can only book "Trống" rooms.
        const availableRooms = roomsArray.filter(r => r.status === "Trống");

        const formattedRooms = availableRooms.map((r, i) => ({
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
          amenities: r.amenities ? r.amenities.split(',').map(a => a.trim()) : ['WiFi', 'Air Conditioning'],
          size: `${r.area || 30}m²`,
          capacity: r.capacity || 2,
          capacityText: `${r.capacity || 2} người`,
          bed: r.bedType || '1 giường lớn',
          available: 1, // physical room
          hasBuffet: true
        }));
        setRooms(formattedRooms);
      } catch (error) {
        console.error("Lỗi khi tải phòng:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  // Lọc phòng dựa trên yêu cầu từ HomePage
  const filteredRooms = guests ? rooms.filter(room => {
    const totalGuests = guests.adults + guests.children;
    return room.available > 0 && room.capacity >= totalGuests;
  }) : rooms;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
      .format(price).replace('₫', 'VNĐ');
  };

  const handleViewRoom = (room) => {
    navigate('/roomtype', { state: { room } });
  };

  return (
    <div className="home-wrap">
      <Header />
      
      {/* Page Header */}
      <section className="mt-page-header">
        <h1>Danh Sách Phòng</h1>
        <p>Khám phá các loại phòng sang trọng của chúng tôi</p>
      </section>

      {/* Room List */}
      <section className="mt-room-section">
        {filteredRooms.length === 0 ? (
          <div className="no-results">
            <h2>Không tìm thấy phòng phù hợp</h2>
            <p>Vui lòng điều chỉnh tiêu chí tìm kiếm của bạn.</p>
          </div>
        ) : (
          <div className="mt-room-grid">
            {filteredRooms.map((room) => (
  <div 
    key={room.id} 
    className="mt-room-card"
    onClick={() => handleViewRoom(room)} // 👈 click cả card
  >
    <div className="mt-room-image">
      <img src={room.image} alt={room.name} />
      <div className="mt-room-badge">{room.type}</div>
      <div className="mt-room-available">
        Còn {room.available} phòng
      </div>
    </div>

    <div className="mt-room-content">
      <h3>{room.name}</h3>
      <p className="mt-room-description">{room.description}</p>

      <div className="mt-room-details">
        <div className="mt-room-detail">
          <span>📐</span> {room.size}
        </div>
        <div className="mt-room-detail">
          <span>👥</span> {room.capacity}
        </div>
        <div className="mt-room-detail">
          <span>🛏️</span> {room.bed}
        </div>
      </div>

      <div className="mt-room-amenities">
        {room.amenities.slice(0, 4).map((amenity, index) => (
          <span key={index} className="mt-amenity-tag">{amenity}</span>
        ))}
        {room.amenities.length > 4 && (
          <span className="mt-amenity-more">+{room.amenities.length - 4}</span>
        )}
      </div>

      <div className="mt-room-footer">
        <div className="mt-room-price">
          <span className="mt-price-label">Giá từ</span>
          <span className="mt-price-value">{formatPrice(room.price)}</span>
          <span className="mt-price-unit">/đêm</span>
        </div>
      </div>
    </div>
  </div>
))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}