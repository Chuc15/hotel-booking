import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import '../../pages/AuthPages.css';

export default function RoomsPage() {
  return (
    <div className="home-wrap">
      <Header />
      
      {/* ── GIỚI THIỆU KHÁCH SẠN ── */}
      <section className="rooms-hero">
  <div className="rooms-hero-content">
    <h1>Grand Hotel – Khách sạn sang trọng tại Hà Nội</h1>
    <p>
      Grand Hotel là khách sạn cao cấp tại trung tâm Hà Nội, mang đến trải nghiệm lưu trú 
      sang trọng, tiện nghi hiện đại và dịch vụ chuyên nghiệp. Với vị trí thuận lợi gần 
      các địa điểm du lịch nổi tiếng, chúng tôi là lựa chọn lý tưởng cho du khách trong 
      và ngoài nước khi đến Hà Nội.
    </p>

    <div className="home-stats">
      <span>10.000+ khách đã lưu trú</span>
      <span>50.000+ đánh giá tích cực</span>
      <span>4.9/5 điểm hài lòng</span>
    </div>
  </div>
</section>

{/* ── VỀ CHÚNG TÔI (SEO mạnh) ── */}
<section className="rooms-about">
  <h2 className="home-section-title">Giới thiệu về Grand Hotel</h2>

  <div className="rooms-about-content">
    <p>
      Grand Hotel là khách sạn tiêu chuẩn 4 sao tại Hà Nội, được thành lập với mục tiêu 
      mang đến trải nghiệm nghỉ dưỡng cao cấp, tiện nghi và thoải mái cho khách hàng. 
      Với hơn 20 năm kinh nghiệm trong lĩnh vực khách sạn, chúng tôi luôn không ngừng 
      nâng cao chất lượng dịch vụ để đáp ứng nhu cầu ngày càng cao của du khách.
    </p>

    <p>
      Khách sạn sở hữu hệ thống phòng nghỉ hiện đại, thiết kế sang trọng, đầy đủ tiện nghi 
      như điều hòa, WiFi tốc độ cao, TV thông minh và dịch vụ phòng 24/7. Ngoài ra, 
      Grand Hotel còn cung cấp các dịch vụ như nhà hàng, spa, hồ bơi và đưa đón sân bay.
    </p>

    <p>
      Nằm tại vị trí trung tâm Hà Nội, từ Grand Hotel quý khách có thể dễ dàng di chuyển 
      đến các địa điểm du lịch nổi tiếng như Hồ Hoàn Kiếm, Phố Cổ, Văn Miếu – Quốc Tử Giám. 
      Đây là lựa chọn hoàn hảo cho cả khách du lịch và công tác.
    </p>

    <p>
      Đội ngũ nhân viên chuyên nghiệp, thân thiện và tận tâm của chúng tôi luôn sẵn sàng 
      phục vụ 24/7, cam kết mang đến cho quý khách trải nghiệm lưu trú đáng nhớ nhất.
    </p>
  </div>
</section>

      {/* ── DỊCH VỤ ── */}
      <section className="rooms-services">
        <h2 className="home-section-title">Dịch vụ của chúng tôi</h2>
        <div className="rooms-services-grid">
          {[
            { name: 'Phòng sang trọng', desc: 'Đầy đủ tiện nghi, view đẹp', icon: '🏨' },
            { name: 'Nhà hàng cao cấp', desc: 'Ẩm thực đa dạng', icon: '🍽️' },
            { name: 'Spa & Massage', desc: 'Thư giãn tuyệt vời', icon: '💆' },
            { name: 'Hồ bơi', desc: 'View rooftop tuyệt đẹp', icon: '🏊' },
          ].map((service, i) => (
            <div className="rooms-service-card" key={i}>
              <span className="rooms-service-icon">{service.icon}</span>
              <h3>{service.name}</h3>
              <p>{service.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── VỀ CHÚNG TÔI ── */}
      <section className="rooms-about">
        <h2 className="home-section-title">Về chúng tôi</h2>
        <div className="rooms-about-content">
          <p>
            Grand Hotel được thành lập với sứ mệnh mang đến cho quý khách những trải nghiệm lưu trú 
            tuyệt vời nhất. Với hơn 20 năm kinh nghiệm trong ngành khách sạn, chúng tôi tự hào là 
            điểm đến tin cậy của hàng triệu du khách mỗi năm.
          </p>
          <p>
            Đội ngũ nhân viên chuyên nghiệp, tận tâm luôn sẵn sàng phục vụ quý khách 24/7.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
