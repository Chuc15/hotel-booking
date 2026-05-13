import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const PaymentResult = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [status, setStatus] = useState('processing'); // processing, success, fail
    const [message, setMessage] = useState('Đang xác thực giao dịch...');

    useEffect(() => {
        const verifyPayment = async () => {
            try {
                // Gửi toàn bộ Query String từ URL về Backend để verify
                const queryParams = location.search;
                const response = await axios.get(`http://localhost:5000/api/payment/vnpay-callback${queryParams}`);

                if (response.status === 200) {
                    setStatus('success');
                    setMessage('Thanh toán thành công! Cảm ơn bạn đã sử dụng dịch vụ.');
                } else {
                    setStatus('fail');
                    setMessage('Giao dịch không thành công hoặc bị hủy.');
                }
            } catch (error) {
                console.error("Verify error:", error);
                setStatus('fail');
                setMessage('Có lỗi xảy ra khi xác thực giao dịch.');
            }
        };

        verifyPayment();
    }, [location]);

    return (
        <div style={{ textAlign: 'center', padding: '100px 20px', minHeight: '60vh' }}>
            <div className={`result-card ${status}`} style={{
                background: '#fff', padding: '40px', borderRadius: '15px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)', display: 'inline-block'
            }}>
                {status === 'processing' && <div className="loader">🌀</div>}

                <h2 style={{ color: status === 'success' ? '#27ae60' : status === 'fail' ? '#e74c3c' : '#333' }}>
                    {status === 'success' ? 'Thành công!' : status === 'fail' ? 'Thất bại!' : 'Vui lòng đợi'}
                </h2>

                <p style={{ margin: '20px 0', fontSize: '18px', color: '#666' }}>{message}</p>

                <div style={{ marginTop: '30px' }}>
                    <Link to="/" style={{
                        padding: '12px 25px', background: '#C9A84C', color: '#fff',
                        textDecoration: 'none', borderRadius: '5px', fontWeight: 'bold'
                    }}>
                        Quay về Trang chủ
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default PaymentResult;
