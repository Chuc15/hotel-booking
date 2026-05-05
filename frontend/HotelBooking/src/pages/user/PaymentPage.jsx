import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import '../../pages/AuthPages.css';

// VNP Configuration - Replace with your actual VNP settings
const VNP_CONFIG = {
  vnp_Url: 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
  vnp_TmnCode: 'YOUR_TMN_CODE',
  vnp_HashSecret: 'YOUR_HASH_SECRET',
  vnp_ReturnUrl: 'http://localhost:5173/payment/return'
};

export default function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingData = location.state?.booking || null;
  
  const [paymentMethod, setPaymentMethod] = useState('vnp');
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardInfo, setCardInfo] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: ''
  });

  // Payment state - matches C# model
  const [payment, setPayment] = useState({
    id: 0,
    bookingId: bookingData?.bookingId || Math.floor(Math.random() * 10000) + 1,
    amount: bookingData?.pricing?.total || 0,
    method: 'VNPay',
    transactionId: '',
    status: 'Pending',
    paidAt: null
  });

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
      .format(price).replace('₫', 'VNĐ');
  };

  // Generate VNP payment URL
  const createVNPPayment = () => {
    const date = new Date();
    const createDate = date.toISOString().slice(0, 19).replace(/[-:T]/g, '');
    const orderId = `ORDER${Date.now()}`;
    
    const vnp_Params = {
      vnp_Version: '2.1.0',
      vnp_Command: 'pay',
      vnp_TmnCode: VNP_CONFIG.vnp_TmnCode,
      vnp_Locale: 'vn',
      vnp_CurrCode: 'VND',
      vnp_TxnRef: orderId,
      vnp_OrderInfo: `Thanh toan dat phong Grand Hotel - ${bookingData?.guestInfo?.name || 'Khach hang'}`,
      vnp_OrderType: 'billpayment',
      vnp_Amount: bookingData?.pricing?.total * 100,
      vnp_ReturnUrl: VNP_CONFIG.vnp_ReturnUrl,
      vnp_IpAddr: '127.0.0.1',
      vnp_CreateDate: createDate
    };

    // Sort parameters and create hash
    const sortedParams = Object.keys(vnp_Params).sort().reduce((obj, key) => {
      obj[key] = vnp_Params[key];
      return obj;
    }, {});

    const queryString = new URLSearchParams(sortedParams).toString();
    const hmacSHA512 = require('crypto').createHmac('sha512', VNP_CONFIG.vnp_HashSecret);
    const signed = hmacSHA512(queryString).digest('hex');
    
    vnp_Params.vnp_SecureHash = signed;
    
    const paymentUrl = `${VNP_CONFIG.vnp_Url}?${new URLSearchParams(vnp_Params).toString()}`;
    return paymentUrl;
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    const methodMap = {
      'vnp': 'VNPay',
      'banking': 'BankTransfer',
      'momo': 'MoMo',
      'card': 'CreditCard',
      'cash': 'Cash'
    };

    const statusMap = {
      'vnp': 'Completed',
      'banking': 'Pending',
      'momo': 'Completed',
      'card': 'Completed',
      'cash': 'Pending'
    };

    try {
      if (paymentMethod === 'vnp') {
        // VNP Payment - In production, redirect to VNP URL
        // For demo, we'll simulate the payment
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Update payment state
        const transactionId = `VNP${Date.now()}`;
        setPayment({
          ...payment,
          id: Math.floor(Math.random() * 1000) + 1,
          bookingId: bookingData?.bookingId || Math.floor(Math.random() * 10000) + 1,
          amount: bookingData?.pricing?.total || 0,
          method: methodMap[paymentMethod],
          transactionId: transactionId,
          status: statusMap[paymentMethod],
          paidAt: new Date().toISOString()
        });
        
        // In real implementation:
        // const paymentUrl = createVNPPayment();
        // window.location.href = paymentUrl;
        
        alert(`Thanh toán qua VNPay thành công! Mã giao dịch: ${transactionId}`);
        navigate('/');
      } else if (paymentMethod === 'banking') {
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const transactionId = `BANK${Date.now()}`;
        setPayment({
          ...payment,
          id: Math.floor(Math.random() * 1000) + 1,
          bookingId: bookingData?.bookingId || Math.floor(Math.random() * 10000) + 1,
          amount: bookingData?.pricing?.total || 0,
          method: methodMap[paymentMethod],
          transactionId: transactionId,
          status: statusMap[paymentMethod],
          paidAt: null
        });
        
        alert(`Thanh toán chuyển khoản thành công! Mã giao dịch: ${transactionId}. Vui lòng kiểm tra email xác nhận.`);
        navigate('/');
      } else if (paymentMethod === 'momo') {
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const transactionId = `MOMO${Date.now()}`;
        setPayment({
          ...payment,
          id: Math.floor(Math.random() * 1000) + 1,
          bookingId: bookingData?.bookingId || Math.floor(Math.random() * 10000) + 1,
          amount: bookingData?.pricing?.total || 0,
          method: methodMap[paymentMethod],
          transactionId: transactionId,
          status: statusMap[paymentMethod],
          paidAt: new Date().toISOString()
        });
        
        alert(`Thanh toán qua MoMo thành công! Mã giao dịch: ${transactionId}`);
        navigate('/');
      } else if (paymentMethod === 'card') {
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const transactionId = `CARD${Date.now()}`;
        setPayment({
          ...payment,
          id: Math.floor(Math.random() * 1000) + 1,
          bookingId: bookingData?.bookingId || Math.floor(Math.random() * 10000) + 1,
          amount: bookingData?.pricing?.total || 0,
          method: methodMap[paymentMethod],
          transactionId: transactionId,
          status: statusMap[paymentMethod],
          paidAt: new Date().toISOString()
        });
        
        alert(`Thanh toán thẻ quốc tế thành công! Mã giao dịch: ${transactionId}`);
        navigate('/');
      } else {
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const transactionId = `CASH${Date.now()}`;
        setPayment({
          ...payment,
          id: Math.floor(Math.random() * 1000) + 1,
          bookingId: bookingData?.bookingId || Math.floor(Math.random() * 10000) + 1,
          amount: bookingData?.pricing?.total || 0,
          method: methodMap[paymentMethod],
          transactionId: transactionId,
          status: statusMap[paymentMethod],
          paidAt: null
        });
        
        alert(`Đặt phòng thành công! Mã đơn: ${transactionId}. Vui lòng thanh toán tại quầy.`);
        navigate('/');
      }
    } catch (error) {
      alert('Có lỗi xảy ra. Vui lòng thử lại!');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="home-wrap">
      <Header />
      
      {/* Page Header */}
      <section className="mt-page-header">
        <h1>Thanh toán</h1>
        <p>Chọn phương thức thanh toán phù hợp với bạn</p>
      </section>

      {/* Payment Section */}
      <section className="mt-payment-section">
        <div className="mt-payment-container">
          {/* Payment Methods */}
          <div className="mt-payment-methods">
            <h2>Phương thức thanh toán</h2>
            
            <div className="mt-method-options">
              <label className={`mt-method-option ${paymentMethod === 'vnp' ? 'active' : ''}`}>
                <input 
                  type="radio" 
                  name="payment" 
                  value="vnp" 
                  checked={paymentMethod === 'vnp'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span className="mt-method-icon">💳</span>
                <div className="mt-method-info">
                  <strong>VNPay</strong>
                  <span>Thanh toán qua QR Code hoặc ATM</span>
                </div>
              </label>

              <label className={`mt-method-option ${paymentMethod === 'banking' ? 'active' : ''}`}>
                <input 
                  type="radio" 
                  name="payment" 
                  value="banking" 
                  checked={paymentMethod === 'banking'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span className="mt-method-icon">🏦</span>
                <div className="mt-method-info">
                  <strong>Chuyển khoản ngân hàng</strong>
                  <span>Thanh toán qua ATM hoặc Internet Banking</span>
                </div>
              </label>

              <label className={`mt-method-option ${paymentMethod === 'momo' ? 'active' : ''}`}>
                <input 
                  type="radio" 
                  name="payment" 
                  value="momo"
                  checked={paymentMethod === 'momo'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span className="mt-method-icon">💚</span>
                <div className="mt-method-info">
                  <strong>Ví MoMo</strong>
                  <span>Thanh toán nhanh chóng qua MoMo</span>
                </div>
              </label>

              <label className={`mt-method-option ${paymentMethod === 'card' ? 'active' : ''}`}>
                <input 
                  type="radio" 
                  name="payment" 
                  value="card"
                  checked={paymentMethod === 'card'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span className="mt-method-icon">💳</span>
                <div className="mt-method-info">
                  <strong>Thẻ quốc tế</strong>
                  <span>Visa, MasterCard, JCB</span>
                </div>
              </label>

              <label className={`mt-method-option ${paymentMethod === 'cash' ? 'active' : ''}`}>
                <input 
                  type="radio" 
                  name="payment" 
                  value="cash"
                  checked={paymentMethod === 'cash'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span className="mt-method-icon">💵</span>
                <div className="mt-method-info">
                  <strong>Tiền mặt</strong>
                  <span>Thanh toán trực tiếp tại quầy</span>
                </div>
              </label>
            </div>

            {/* VNP Payment Form */}
            {paymentMethod === 'vnp' && (
              <div className="mt-vnp-info">
                <h3>Thanh toán qua VNPay</h3>
                <div className="mt-vnp-options">
                  <label className="mt-vnp-option">
                    <input type="radio" name="vnpType" value="qr" defaultChecked />
                    <span>📱 Quét QR Code</span>
                  </label>
                  <label className="mt-vnp-option">
                    <input type="radio" name="vnpType" value="atm" />
                    <span>🏧 Thẻ ATM</span>
                  </label>
                  <label className="mt-vnp-option">
                    <input type="radio" name="vnpType" value="credit" />
                    <span>💳 Thẻ tín dụng</span>
                  </label>
                </div>
                <div className="mt-vnp-note">
                  <p>🔒 Bảo mật thanh toán qua VNPay</p>
                </div>
              </div>
            )}

            {/* Payment Info */}
            {paymentMethod === 'banking' && (
              <div className="mt-payment-info">
                <h3>Thông tin chuyển khoản</h3>
                <div className="mt-bank-info">
                  <p><strong>Ngân hàng:</strong> Vietcombank</p>
                  <p><strong>Số tài khoản:</strong> 1234567890</p>
                  <p><strong>Chủ tài khoản:</strong> Công ty TNHH Grand Hotel</p>
                  <p><strong>Nội dung:</strong> [Số điện thoại] - Dat phong Grand Hotel</p>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="mt-payment-summary">
            <h2>Thông tin đơn hàng</h2>
            {bookingData?.room && (
              <div className="mt-room-selected">
                <img src={bookingData.room.image} alt={bookingData.room.name} />
                <div>
                  <h4>{bookingData.room.name}</h4>
                  <p>{bookingData.room.type}</p>
                </div>
              </div>
            )}
            <div className="mt-summary-item">
              <span>Khách sạn</span>
              <strong>Grand Hotel</strong>
            </div>
            <div className="mt-summary-item">
              <span>Loại phòng</span>
              <strong>{bookingData?.room?.name || 'Chưa chọn'}</strong>
            </div>
            <div className="mt-summary-item">
              <span>Ngày nhận</span>
              <strong>{bookingData?.guestInfo?.checkIn || 'Chưa chọn'}</strong>
            </div>
            <div className="mt-summary-item">
              <span>Ngày trả</span>
              <strong>{bookingData?.guestInfo?.checkOut || 'Chưa chọn'}</strong>
            </div>
            <div className="mt-summary-item">
              <span>Số đêm</span>
              <strong>{bookingData?.nights || 0} đêm</strong>
            </div>
            <div className="mt-summary-item">
              <span>Số phòng</span>
              <strong>{bookingData?.rooms || 1} phòng</strong>
            </div>
            <div className="mt-summary-divider"></div>
            <div className="mt-summary-item">
              <span>Giá phòng</span>
              <span>{formatPrice(bookingData?.pricing?.roomPrice || 0)}</span>
            </div>
            <div className="mt-summary-item">
              <span>Thuế & phí (10%)</span>
              <span>{formatPrice(bookingData?.pricing?.tax || 0)}</span>
            </div>
            <div className="mt-summary-total">
              <span>Tổng cộng</span>
              <strong>{formatPrice(bookingData?.pricing?.total || 0)}</strong>
            </div>
            
            {/* Payment Details Display */}
            {payment.transactionId && (
              <div className="mt-payment-details">
                <h4>Thông tin thanh toán</h4>
                <div className="mt-payment-detail-row">
                  <span>Mã thanh toán:</span>
                  <strong>{payment.id}</strong>
                </div>
                <div className="mt-payment-detail-row">
                  <span>Mã giao dịch:</span>
                  <strong>{payment.transactionId}</strong>
                </div>
                <div className="mt-payment-detail-row">
                  <span>Phương thức:</span>
                  <strong>{payment.method}</strong>
                </div>
                <div className="mt-payment-detail-row">
                  <span>Trạng thái:</span>
                  <strong className={`mt-status-${payment.status.toLowerCase()}`}>
                    {payment.status === 'Completed' ? '✓ Đã thanh toán' : '⏳ Chờ xử lý'}
                  </strong>
                </div>
                {payment.paidAt && (
                  <div className="mt-payment-detail-row">
                    <span>Thời gian:</span>
                    <strong>{new Date(payment.paidAt).toLocaleString('vi-VN')}</strong>
                  </div>
                )}
              </div>
            )}
            
            <button 
              className="home-btn-gold mt-submit-btn" 
              onClick={handlePayment}
              disabled={isProcessing}
            >
              {isProcessing ? 'Đang xử lý...' : 'Xác nhận thanh toán'}
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
