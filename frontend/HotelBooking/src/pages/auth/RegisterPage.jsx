import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { register as registerApi } from "../../api/auth";
import { motion } from 'framer-motion';
import { 
  Mail, Lock, Eye, EyeOff, User, Phone, 
  ArrowRight, Shield, Check
} from 'lucide-react';

// Background particles component
const Particles = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(20)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-2 h-2 bg-luxury-neon/30 rounded-full blur-[2px]"
        initial={{
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          scale: Math.random() * 0.5 + 0.5,
        }}
        animate={{
          y: [null, Math.random() * -500],
          x: [null, Math.random() * 200 - 100],
          opacity: [0.2, 0.8, 0],
        }}
        transition={{
          duration: Math.random() * 10 + 10,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    ))}
  </div>
);

// Floating glowing orbs
const GlowingOrbs = () => (
  <>
    <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-luxury-purple/20 rounded-full mix-blend-screen filter blur-[100px] animate-blob"></div>
    <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-luxury-neon/20 rounded-full mix-blend-screen filter blur-[100px] animate-blob animation-delay-2000"></div>
    <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-luxury-accent/20 rounded-full mix-blend-screen filter blur-[100px] animate-blob animation-delay-4000"></div>
  </>
);

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const { login } = useAuth();
  const navigate = useNavigate();

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
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
        phoneNumber: data.phone
      });

      if (result.accessToken) {
        login(result.accessToken);
        navigate('/home');
      } else {
        alert(result.message || "Đăng ký thành công");
        navigate('/login');
      }
    } catch (err) {
      alert(err.response?.data?.message || err.message || "Đăng ký thất bại");
    } finally {
      setIsLoading(false);
    }
  };

  const strengthLabels = ['', 'Yếu', 'Trung bình', 'Tốt', 'Mạnh'];
  const strengthClasses = ['bg-white/20', 'bg-red-500', 'bg-yellow-500', 'bg-luxury-neon', 'bg-green-500 shadow-[0_0_10px_#22c55e]'];

  const inputClasses = "w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-luxury-neon/50 focus:border-transparent transition-all backdrop-blur-sm text-sm";
  const labelClasses = "block text-xs font-medium text-white/80 mb-1.5";

  return (
    <div className="min-h-screen bg-luxury-dark text-white overflow-hidden flex relative font-['DM_Sans',sans-serif]">
      <Particles />
      <GlowingOrbs />

      {/* LEFT SECTION - Brand & Hero */}
      <div className="hidden lg:flex w-1/2 flex-col justify-between p-12 relative z-10">
        <div className="absolute inset-0 bg-gradient-to-r from-luxury-dark via-luxury-dark/80 to-transparent z-10" />
        <img 
          src="https://images.unsplash.com/photo-1542314831-c6a4d2748622?q=80&w=2000&auto=format&fit=crop" 
          alt="Luxury Hotel" 
          className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-luminosity"
        />
        
        <div className="relative z-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 text-2xl font-bold font-['Cormorant_Garamond'] text-white tracking-wider"
          >
            <span className="text-3xl text-luxury-accent">✦</span>
            Grand Hotel
          </motion.div>
        </div>

        <div className="relative z-20 mb-20 max-w-xl">
          <motion.h1 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl lg:text-6xl font-light font-['Cormorant_Garamond'] leading-tight mb-6 text-white"
          >
            Gia nhập <br/>
            <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-luxury-accent via-luxury-neon to-luxury-purple">
              Thế giới Thượng lưu
            </span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-lg text-white/70"
          >
            Bắt đầu hành trình của bạn với những đặc quyền giới hạn và trải nghiệm cá nhân hóa đỉnh cao.
          </motion.p>
        </div>
        
        <div className="relative z-20 flex items-center gap-8 text-white/50 text-sm font-medium">
          <div className="flex items-center gap-2">
            <Shield size={16} className="text-luxury-accent" /> Secure Registration
          </div>
          <div className="flex items-center gap-2">
            <Check size={16} className="text-luxury-neon" /> Exclusive Benefits
          </div>
        </div>
      </div>

      {/* RIGHT SECTION - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative z-20 overflow-y-auto">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-md bg-white/[0.03] border border-white/10 p-8 rounded-3xl backdrop-blur-xl shadow-2xl relative my-auto"
        >
          {/* Card Glow */}
          <div className="absolute inset-0 rounded-3xl ring-1 ring-white/10 shadow-[0_0_50px_rgba(176,38,255,0.1)] pointer-events-none" />

          {/* Toggle Tabs */}
          <div className="flex p-1 bg-white/5 rounded-xl mb-6">
            <Link 
              to="/login"
              className="flex-1 py-2 text-sm text-center font-semibold rounded-lg transition-all text-white/60 hover:text-white"
            >
              Đăng nhập
            </Link>
            <div 
              className="flex-1 py-2 text-sm text-center font-semibold rounded-lg transition-all bg-luxury-neon text-luxury-dark shadow-lg"
            >
              Đăng ký
            </div>
          </div>

          {/* Form Content */}
          <div className="mb-6">
            <h2 className="text-3xl font-['Cormorant_Garamond'] font-bold mb-2 text-white">
              Tạo tài khoản
            </h2>
            <p className="text-white/50 text-sm">
              Bắt đầu hành trình đẳng cấp cùng Grand Hotel
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className={labelClasses}>Họ</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={16} />
                  <input
                    className={`${inputClasses} pl-9`}
                    type="text"
                    placeholder="Nguyễn"
                    {...register('lastName', { required: 'Vui lòng nhập họ' })}
                  />
                </div>
                {errors.lastName && <span className="text-[10px] text-red-400 mt-1 block">{errors.lastName.message}</span>}
              </div>
              <div className="flex-1">
                <label className={labelClasses}>Tên</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={16} />
                  <input
                    className={`${inputClasses} pl-9`}
                    type="text"
                    placeholder="Văn A"
                    {...register('firstName', { required: 'Vui lòng nhập tên' })}
                  />
                </div>
                {errors.firstName && <span className="text-[10px] text-red-400 mt-1 block">{errors.firstName.message}</span>}
              </div>
            </div>

            <div>
              <label className={labelClasses}>Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={16} />
                <input
                  className={`${inputClasses} ${errors.email ? 'ring-2 ring-red-500' : ''}`}
                  type="email"
                  placeholder="luxury@hotel.com"
                  {...register('email', { 
                    required: 'Vui lòng nhập email',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Email không hợp lệ'
                    }
                  })}
                />
              </div>
              {errors.email && <span className="text-[10px] text-red-400 mt-1 block">{errors.email.message}</span>}
            </div>

            <div>
              <label className={labelClasses}>Số điện thoại</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={16} />
                <input
                  className={inputClasses}
                  type="tel"
                  placeholder="0912 345 678"
                  {...register('phone', {
                    required: 'Vui lòng nhập số điện thoại',
                    pattern: {
                      value: /^[0-9]{10,11}$/,
                      message: 'SĐT phải có 10-11 chữ số'
                    }
                  })}
                />
              </div>
              {errors.phone && <span className="text-[10px] text-red-400 mt-1 block">{errors.phone.message}</span>}
            </div>

            <div>
              <label className={labelClasses}>Mật khẩu</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={16} />
                <input
                  className={`${inputClasses} ${errors.password ? 'ring-2 ring-red-500' : ''}`}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  {...register('password', { 
                    required: 'Vui lòng nhập mật khẩu',
                    onChange: (e) => checkStrength(e.target.value),
                    pattern: {
                      value: /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/,
                      message: 'Phải có chữ hoa, số và ký tự đặc biệt'
                    }
                  })}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              
              {/* Strength Meter */}
              <div className="mt-2 flex items-center gap-2">
                <div className="flex flex-1 gap-1 h-1.5">
                  {[1, 2, 3, 4].map(i => (
                    <div 
                      key={i} 
                      className={`flex-1 rounded-full transition-colors duration-300 ${i <= passwordStrength ? strengthClasses[passwordStrength] : 'bg-white/10'}`}
                    />
                  ))}
                </div>
                <span className="text-[10px] text-white/50 w-16 text-right">{strengthLabels[passwordStrength]}</span>
              </div>
              
              {errors.password && <span className="text-[10px] text-red-400 mt-1 block">{errors.password.message}</span>}
            </div>

            <div>
              <label className={labelClasses}>Xác nhận mật khẩu</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={16} />
                <input
                  className={inputClasses}
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="••••••••"
                  {...register('confirmPassword', { 
                    required: 'Vui lòng xác nhận mật khẩu',
                    validate: (value) => value === password || 'Mật khẩu không khớp'
                  })}
                />
                <button 
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.confirmPassword && <span className="text-[10px] text-red-400 mt-1 block">{errors.confirmPassword.message}</span>}
            </div>

            <label className="flex items-start gap-3 mt-4 cursor-pointer group">
              <div className="w-4 h-4 mt-0.5 rounded border border-white/20 flex-shrink-0 group-hover:border-luxury-accent transition-colors">
                <input type="checkbox" className="hidden" {...register('terms', { required: true })} />
              </div>
              <span className="text-[11px] text-white/60">
                Tôi đồng ý với <a href="#" className="text-luxury-accent hover:underline">Điều khoản dịch vụ</a> và <a href="#" className="text-luxury-accent hover:underline">Chính sách bảo mật</a>
              </span>
            </label>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full mt-6 py-3 rounded-xl font-bold text-luxury-dark transition-all flex items-center justify-center gap-2 relative overflow-hidden group bg-luxury-neon hover:shadow-[0_0_20px_rgba(0,243,255,0.4)]"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
              <span className="relative z-10 text-sm">
                {isLoading ? 'ĐANG XỬ LÝ...' : 'TẠO TÀI KHOẢN NGAY'}
              </span>
              {!isLoading && <ArrowRight size={16} className="relative z-10" />}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}