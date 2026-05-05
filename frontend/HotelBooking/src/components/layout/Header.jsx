import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';


export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  return (
    <nav className="home-nav">
      <div className="home-nav-inner">

        <div className="home-nav-logo">
          <div
             className="home-logo"
         onClick={() => navigate('/')}
          >
         
        <span className="text">Grand Hotel</span>
          </div>
        </div>

        {/* Links */}
        <div className="home-nav-links">
          <Link to="/">Trang chủ</Link>
          <Link to="/about">Giới thiệu</Link>
          <Link to="/">Ưu đãi</Link>
          
          <Link to="/contact">Liên hệ</Link>
        </div>

        {/* Actions */}
        <div className="home-nav-actions">
          {user ? (
            <>
              <span className="home-nav-greeting">
                Xin chào, <strong>{user.fullName || user.name || user.email}</strong>
              </span>
              <button
                className="home-btn-outline"
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
              >
                Đăng xuất
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="home-btn-ghost">Đăng nhập</Link>
              <Link to="/register" className="home-btn-gold">Đăng ký</Link>
            </>
          )}
        </div>

      </div>
    </nav>
  );
}
