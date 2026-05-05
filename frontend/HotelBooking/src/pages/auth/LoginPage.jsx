import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import '../../pages/AuthPages.css';
import { login as loginApi } from "../../api/auth";
import { jwtDecode } from "jwt-decode";

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login } = useAuth();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const res = await loginApi(data.email, data.password);

      const token = res.accessToken;

      // 🔥 decode đúng chỗ
      const decoded = jwtDecode(token);

      const role =
        decoded.role ||
        decoded.Role ||
        decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

      // lưu token
      login(token);

      // 🔥 redirect theo role
      if (role === "Admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }

    } catch (err) {
      alert(err.response?.data?.message || "Đăng nhập thất bại");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-bg">
      <div className="auth-card">
        <div className="auth-logo-icon"><span>✦</span></div>
            <div className="auth-logo-text">Grand Hotel</div>
        <div className="auth-card-header">
          <h2>Đăng nhập</h2>
        </div>

        <div className="auth-card-body">
          <form onSubmit={handleSubmit(onSubmit)}>

            {/* EMAIL */}
            <div className="auth-form-group">
              <label>Email</label>
              <input
                className={`auth-form-control ${errors.email ? 'error' : ''}`}
                type="email"
                placeholder="your@email.com"
                {...register('email', {
                  required: 'Vui lòng nhập email',
                })}
              />
              {errors.email && <p>{errors.email.message}</p>}
            </div>

            {/* PASSWORD */}
            <div className="auth-form-group">
              <label>Mật khẩu</label>
              <div className="auth-input-wrap">
                <input
                  className={`auth-form-control ${errors.password ? 'error' : ''}`}
                  type={showPassword ? 'text' : 'password'}
                  {...register('password', {
                    required: 'Vui lòng nhập mật khẩu',
                  })}
                />
                 <span className="auth-input-icon" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? '🙈' : '👁'}
                </span>
              </div>
              {errors.password && <p>{errors.password.message}</p>}
            </div>

            {/* SUBMIT */}
            <button type="submit" className="auth-btn-submit">
              {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>

            <div className="auth-divider">hoặc</div>

            <Link to="/register">Chưa có tài khoản? Đăng ký</Link>

          </form>
        </div>
      </div>
    </div>
  );
}