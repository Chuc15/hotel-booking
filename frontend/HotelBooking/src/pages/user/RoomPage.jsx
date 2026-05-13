import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import '../../pages/AuthPages.css';
import { getRooms } from '../../api/roomApi';

// Local images (consistent with HomePage)
import imgRoom1 from '../../assets/images/room1.jpg';
import imgRoom2 from '../../assets/images/room2.jpg';
import imgRoom3 from '../../assets/images/room3.jpg';
import imgRoom4 from '../../assets/images/room4.jpg';
import imgRoom5 from '../../assets/images/room5.jpg';

const defaultImages = [
  imgRoom1,
  imgRoom2,
  imgRoom3,
  imgRoom4,
  imgRoom5,
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

        // Show all rooms regardless of status as requested
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
          available: r.status === "Trống" ? 1 : 0,
          status: r.status,
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
                  <div className={`mt-room-status-badge ${room.status === "Trống" ? "status-available" : "status-occupied"}`}>
                    {room.status === "Trống" ? "Còn phòng" : "Hết phòng"}
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