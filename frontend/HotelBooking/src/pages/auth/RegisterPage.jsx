
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import '../../pages/AuthPages.css';
import { register as registerApi } from "../../api/auth";;
import Input from "../../components/common/Input"; 
import Button from "../../components/common/Button";

export default function RegisterPage() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  useEffect(() => {
    const toast = document.getElementById('toast');
    if (toast) {
      toast.style.display = 'none';
    }
  }, []);

  const password = watch('password', '');

  const checkStrength = (pass) => {
    let strength = 0;
    if (pass.length >= 8) strength++;
    if (pass.match(/[A-Z]/)) strength++;
    if (pass.match(/[0-9]/)) strength++;
    if (pass.match(/[^A-Za-z0-9]/)) strength++;
    setPasswordStrength(strength);
  };

  const onSubmit = async (data) => {
  setIsLoading(true);
  try {
    const result = await registerApi({
       firstName:   data.FirstName,
      lastName:    data.LastName,
      email:       data.Email,
      password:    data.Password,
      confirmPassword: data.ConfirmPassword,  // thêm vào
      phoneNumber: data.Phone 
    });

    // Nếu backend trả về token thì login luôn
    if (result.accessToken) {
      login(result.accessToken);
      navigate('/home');
    } else {
      alert(result.message || "Đăng ký thành công");
      navigate('/login');
    }
  } catch (err) {
    alert(err);
  } finally {
    setIsLoading(false);
  }
};


  const strengthLabels = ['', 'Yếu', 'Trung bình', 'Tốt', 'Mạnh'];
  const strengthClasses = ['', 'weak', 'fair', 'good', 'good'];

  return (
    <div className="auth-bg">
      <div className="auth-bg-lines"></div>
      
      <div className="toast" id="toast">
        <span>✦</span>
        <span id="toastMsg">Đăng ký thành công!</span>
      </div>

      <div className="auth-card">
        <div className="auth-card-top"></div>

        <div className="auth-card-header">
          <div className="auth-hotel-logo">
            <div className="auth-logo-icon"><span>✦</span></div>
            <div className="auth-logo-text">Grand Hotel</div>
          </div>

          <div className="auth-tabs">
            <Link to="/login" className="auth-tab">Đăng nhập</Link>
            <button className="auth-tab active">Đăng ký</button>
          </div>
        </div>

        <div className="auth-card-body">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="auth-form-row">
              <div className="auth-form-group">
                <label className="auth-form-label">Họ</label>
                <Input
                  type="text"
                  placeholder="Nguyễn"
                  {...register('LastName', { required: 'Vui lòng nhập họ' })}
                />
                {errors.lastName && <div className="auth-error-msg show">{errors.lastName.message}</div>}
              </div>
              <div className="auth-form-group">
                <label className="auth-form-label">Tên</label>
                <Input
                  type="text"
                  placeholder="Văn A"
                  {...register('FirstName', { required: 'Vui lòng nhập tên' })}
                />
                {errors.firstName && <div className="auth-error-msg show">{errors.firstName.message}</div>}
              </div>
            </div>

            <div className="auth-form-group">
              <label className="auth-form-label">Email</label>
              <Input
                type="email"
                placeholder="your@email.com"
                {...register('Email', { 
                  required: 'Vui lòng nhập email',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Email không hợp lệ'
                  }
                })}
              />
              {errors.email && <div className="auth-error-msg show">{errors.email.message}</div>}
            </div>

            <div className="auth-form-group">
              <label className="auth-form-label">Số điện thoại</label>
              <Input
                type="tel"
                placeholder="0912345678"
                {...register('Phone', { 
                  required: 'Vui lòng nhập số điện thoại',
                  pattern: {
                    value: /^[0-9]{10,11}$/,
                    message: 'Số điện thoại không hợp lệ'
                  }
                })}
              />
              {errors.phone && <div className="auth-error-msg show">{errors.phone.message}</div>}
            </div>

            <div className="auth-form-group">
              <label className="auth-form-label">Mật khẩu</label>
              <div className="auth-input-wrap">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  {...register('Password', {
  required: 'Nhập mật khẩu',
  pattern: {
    value: /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/,
    message: 'Phải có chữ hoa, số, ký tự đặc biệt'
  }
})}
                />
                <span className="auth-input-icon" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? '🙈' : '👁'}
                </span>
              </div>
              <div className="auth-strength-bar">
                {[1,2,3,4].map(i => (
                  <div key={i} className={`auth-strength-seg ${i <= passwordStrength ? strengthClasses[passwordStrength] : ''}`}></div>
                ))}
              </div>
              <div className="auth-strength-label">{strengthLabels[passwordStrength]}</div>
              {errors.password && <div className="auth-error-msg show">{errors.password.message}</div>}
            </div>

            <div className="auth-form-group">
              <label className="auth-form-label">Xác nhận mật khẩu</label>
              <div className="auth-input-wrap">
                <Input
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="••••••••"
                  {...register('ConfirmPassword', { 
                    required: 'Vui lòng xác nhận mật khẩu',
                    validate: (value) => value === password || 'Mật khẩu xác nhận không khớp'
                  })}
                />
                <span className="auth-input-icon" onClick={() => setShowConfirm(!showConfirm)}>
                  {showConfirm ? '🙈' : '👁'}
                </span>
              </div>
              {errors.confirmPassword && <div className="auth-error-msg show">{errors.confirmPassword.message}</div>}
            </div>

            <Button type="submit">
              {isLoading ? 'Đang đăng ký...' : 'Tạo tài khoản'}
            </Button>

            <div className="auth-terms">
              Bằng cách đăng ký, bạn đồng ý với
              <a href="#">Điều khoản dịch vụ</a> và <a href="#">Chính sách bảo mật</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}