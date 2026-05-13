import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { login as loginApi } from "../../api/auth";
import { jwtDecode } from "jwt-decode";
import { motion } from 'framer-motion';
import { 
  Mail, Lock, Eye, EyeOff,
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

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm();
  const rememberChecked = watch('remember', false);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    const savedPassword = localStorage.getItem('rememberedPassword');
    if (savedEmail && savedPassword) {
      setValue('email', savedEmail);
      setValue('password', savedPassword);
      setValue('remember', true);
    }
  }, [setValue]);

  const onLoginSubmit = async (data) => {
    setIsLoading(true);
    try {
      if (data.remember) {
        localStorage.setItem('rememberedEmail', data.email);
        localStorage.setItem('rememberedPassword', data.password);
      } else {
        localStorage.removeItem('rememberedEmail');
        localStorage.removeItem('rememberedPassword');
      }

      const res = await loginApi(data.email, data.password);
      const token = res.accessToken;
      const decoded = jwtDecode(token);
      const role =
        decoded.role ||
        decoded.Role ||
        decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

      login(token);

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

  const inputClasses = "w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-luxury-neon/50 focus:border-transparent transition-all backdrop-blur-sm";
  const labelClasses = "block text-sm font-medium text-white/80 mb-1.5";

  return (
    <div className="min-h-screen bg-luxury-dark text-white overflow-hidden flex relative font-['DM_Sans',sans-serif]">
      {/* Cinematic Background & Particles */}
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
            Trải nghiệm <br/>
            <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-luxury-accent via-luxury-neon to-luxury-purple">
              Không gian Đẳng cấp
            </span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-lg text-white/70"
          >
            Đắm chìm trong sự sang trọng bậc nhất và dịch vụ hoàn hảo. 
            Nơi mọi khoảnh khắc của bạn đều trở thành kiệt tác.
          </motion.p>
        </div>
        
        <div className="relative z-20 flex items-center gap-8 text-white/50 text-sm font-medium">
          <div className="flex items-center gap-2">
            <Shield size={16} className="text-luxury-accent" /> Secure Booking
          </div>
          <div className="flex items-center gap-2">
            <Check size={16} className="text-luxury-neon" /> Premium Service
          </div>
        </div>
      </div>

      {/* RIGHT SECTION - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative z-20">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-md bg-white/[0.03] border border-white/10 p-8 rounded-3xl backdrop-blur-xl shadow-2xl relative"
        >
          {/* Card Glow */}
          <div className="absolute inset-0 rounded-3xl ring-1 ring-white/10 shadow-[0_0_50px_rgba(37,99,235,0.2)] pointer-events-none" />

          {/* Toggle Tabs */}
          <div className="flex p-1 bg-white/5 rounded-xl mb-8">
            <div 
              className="flex-1 py-2 text-sm text-center font-semibold rounded-lg transition-all bg-luxury-accent text-white shadow-lg"
            >
              Đăng nhập
            </div>
            <Link 
              to="/register"
              className="flex-1 py-2 text-sm text-center font-semibold rounded-lg transition-all text-white/60 hover:text-white"
            >
              Đăng ký
            </Link>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-['Cormorant_Garamond'] font-bold mb-2 text-white">
              Chào mừng trở lại
            </h2>
            <p className="text-white/50 text-sm">
              Nhập thông tin để tiếp tục trải nghiệm
            </p>
          </div>

          <form onSubmit={handleSubmit(onLoginSubmit)} className="space-y-5">
            <div>
              <label className={labelClasses}>Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={20} />
                <input
                  className={`${inputClasses} ${errors.email ? 'ring-2 ring-red-500' : ''}`}
                  type="email"
                  placeholder="your@email.com"
                  {...register('email', { required: 'Vui lòng nhập email' })}
                />
              </div>
              {errors.email && <span className="text-xs text-red-400 mt-1 block">{errors.email.message}</span>}
            </div>

            <div>
              <label className={labelClasses}>Mật khẩu</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={20} />
                <input
                  className={`${inputClasses} ${errors.password ? 'ring-2 ring-red-500' : ''}`}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  {...register('password', { required: 'Vui lòng nhập mật khẩu' })}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && <span className="text-xs text-red-400 mt-1 block">{errors.password.message}</span>}
            </div>

            <div className="flex items-center justify-between mt-4">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${rememberChecked ? 'bg-luxury-accent border-luxury-accent' : 'border-white/20 group-hover:border-luxury-accent'}`}>
                  <input type="checkbox" className="hidden" {...register('remember')} />
                  <Check size={12} className={`transition-all ${rememberChecked ? 'text-white opacity-100' : 'text-transparent opacity-0'}`} />
                </div>
                <span className={`text-sm transition-colors ${rememberChecked ? 'text-white' : 'text-white/70 group-hover:text-white'}`}>Ghi nhớ</span>
              </label>
              <a href="#" className="text-sm text-luxury-neon hover:text-white transition-colors">Quên mật khẩu?</a>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full mt-6 py-3.5 rounded-xl font-bold text-luxury-dark transition-all flex items-center justify-center gap-2 relative overflow-hidden group bg-luxury-neon hover:shadow-[0_0_20px_rgba(255,255,255,0.4)]"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
              <span className="relative z-10">
                {isLoading ? 'Đang xử lý...' : 'Đăng nhập ngay'}
              </span>
              {!isLoading && <ArrowRight size={18} className="relative z-10" />}
            </motion.button>
            
            <div className="mt-8">
              <div className="relative flex items-center justify-center mb-6">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
                <span className="relative px-4 text-xs text-white/40 bg-[#0f172a] backdrop-blur-xl rounded-full">Hoặc tiếp tục với</span>
              </div>
              <div className="flex justify-center">
                <button type="button" className="flex-1 max-w-[200px] flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-sm text-white">
                  <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
                  Google
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}