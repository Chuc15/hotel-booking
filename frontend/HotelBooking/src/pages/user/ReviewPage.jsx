import { useState } from 'react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import '../../pages/AuthPages.css';

export default function ReviewPage() {
  const [reviews] = useState([
    {
      id: 1,
      name: 'Nguyễn Văn A',
      date: '28/04/2026',
      rating: 5,
      comment: 'Khách sạn rất tuyệt vời! Phòng sạch sẽ, nhân viên nhiệt tình, vị trí thuận tiện. Tôi sẽ quay lại vào lần sau.',
      avatar: '👨'
    },
    {
      id: 2,
      name: 'Trần Thị B',
      date: '27/04/2026',
      rating: 4,
      comment: 'Dịch vụ tốt, phòng đẹp, bữa sáng ngon. Chỉ có phần check-in hơi lâu một chút.',
      avatar: '👩'
    },
    {
      id: 3,
      name: 'Lê Văn C',
      date: '26/04/2026',
      rating: 5,
      comment: 'Trải nghiệm tuyệt vời! Nhân viên rất chu đáo, phòng view đẹp, giá cả hợp lý.',
      avatar: '👨‍💼'
    },
    {
      id: 4,
      name: 'Phạm Thị D',
      date: '25/04/2026',
      rating: 5,
      comment: 'Tôi rất hài lòng với chất lượng dịch vụ. Spa và hồ bơi tuyệt vời!',
      avatar: '👩‍💼'
    }
  ]);

  const renderStars = (rating) => {
    return '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  return (
    <div className="home-wrap">
      <Header />
      
      {/* Page Header */}
      <section className="mt-page-header">
        <h1>Đánh giá khách hàng</h1>
        <p>Xem đánh giá từ khách hàng đã trải nghiệm dịch vụ của chúng tôi</p>
      </section>

      {/* Reviews Stats */}
      <section className="mt-reviews-stats">
        <div className="mt-reviews-stats-inner">
          <div className="mt-reviews-rating">
            <span className="mt-rating-number">4.9</span>
            <div className="mt-rating-stars">⭐⭐⭐⭐⭐</div>
            <span className="mt-rating-count">Dựa trên 128 đánh giá</span>
          </div>
          <div className="mt-reviews-bars">
            {[5, 4, 3, 2, 1].map((star) => (
              <div className="mt-review-bar" key={star}>
                <span>{star} ⭐</span>
                <div className="mt-bar-progress">
                  <div className="mt-bar-fill" style={{ width: star === 5 ? '80%' : star === 4 ? '15%' : '5%' }}></div>
                </div>
                <span>{star === 5 ? '80%' : star === 4 ? '15%' : '5%'}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews List */}
      <section className="mt-reviews-section">
        <div className="mt-reviews-list">
          {reviews.map((review) => (
            <div className="mt-review-card" key={review.id}>
              <div className="mt-review-header">
                <div className="mt-review-avatar">{review.avatar}</div>
                <div className="mt-review-info">
                  <h4>{review.name}</h4>
                  <span>{review.date}</span>
                </div>
                <div className="mt-review-rating">{renderStars(review.rating)}</div>
              </div>
              <p className="mt-review-comment">{review.comment}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
