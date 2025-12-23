import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, register, clearError } from '../store/slices/authSlice.js';
import { Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoading, error, isAuthenticated } = useSelector((state) => state.auth);

  const [isLogin, setIsLogin] = useState(location.pathname !== '/register');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'customer',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    setIsLogin(location.pathname !== '/register');
    dispatch(clearError());
    setValidationError('');
  }, [location.pathname, dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setValidationError('');
  };

  const handleModeSwitch = () => {
    navigate(isLogin ? '/register' : '/login');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    if (isLogin) {
      dispatch(login({ email: formData.email, password: formData.password }));
    } else {
      if (formData.password !== formData.confirmPassword) {
        setValidationError('Passwords do not match');
        return;
      }
      if (formData.password.length < 6) {
        setValidationError('Password must be at least 6 characters');
        return;
      }
      dispatch(register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: formData.role
      }));
    }
  };

  const inputClasses = "w-full bg-[#0d1117] border border-[#30363d] rounded-[6px] px-3 py-[5px] text-white text-[16px] md:text-[14px] focus:outline-none focus:border-[#58a6ff] focus:ring-2 focus:ring-[#58a6ff]/30 transition-all shadow-sm placeholder-[#484f58]";
  const labelClasses = "block text-white text-[14px] font-semibold mb-2";

  return (
    <div className="min-h-screen bg-transparent text-[#c9d1d9] flex flex-col justify-center items-center font-sans relative py-12">

      <div className="pixel-background-container fixed inset-0 z-0">
        <div className="pixel-background"></div>
      </div>

      <div className="mb-8 text-center z-10">
        <h1 className="text-[28px] font-bold text-white tracking-tight">
          {isLogin ? "Sign in to COUPON PULSE" : "Join COUPON PULSE"}
        </h1>
      </div>

      <div className={`w-full z-10 transition-all duration-300 px-4 ${isLogin ? 'max-w-[550px]' : 'max-w-[400px]'}`}>

        {(error || validationError) && (
          <div className="mb-4 p-4 text-[13px] text-white bg-[rgba(255,123,114,0.1)] border border-[rgba(255,123,114,0.4)] rounded-[6px] flex items-start">
            <span className="mr-2 font-bold text-lg leading-none text-[#ff7b72]">•</span>
            {error || validationError}
          </div>
        )}

        <div className={`bg-[#010409] border border-[#30363d] rounded-[12px] p-8 shadow-2xl backdrop-blur-md bg-opacity-90 animate-float ${isLogin ? 'min-h-[500px] flex flex-col justify-between' : ''}`}>

          <div className="flex-1 flex flex-col justify-center">
            <form onSubmit={handleSubmit} className="space-y-5">

              {!isLogin && (
                <div>
                  <label className={labelClasses}>Username</label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className={inputClasses + " py-3 px-4 text-[16px]"}
                    required
                    autoFocus={!isLogin}
                  />
                </div>
              )}

              <div>
                <label className={labelClasses}>Email address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={inputClasses + " py-3 px-4 text-[16px]"}
                  required
                  autoFocus={isLogin}
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-white text-[14px] font-normal">Password</label>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={inputClasses + " py-3 px-4 text-[16px]"}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#8b949e] hover:text-[#58a6ff] transition-colors p-1"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {!isLogin && (
                <>
                  <div>
                    <label className={labelClasses}>Confirm Password</label>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={inputClasses + " py-3 px-4 text-[16px]"}
                      required
                    />
                  </div>

                  <div>
                    <label className={labelClasses}>I am a...</label>
                    <div className="flex gap-2 mt-1">
                      {['customer', 'admin'].map((role) => (
                        <label key={role} className={`flex-1 cursor-pointer border rounded-[6px] px-3 py-3 text-[14px] text-center capitalize transition-colors ${formData.role === role ? 'bg-[#1f6feb] border-[#1f6feb] text-white' : 'bg-[#0d1117] border-[#30363d] text-[#c9d1d9] hover:bg-[#161b22] hover:border-[#8b949e]'}`}>
                          <input
                            type="radio"
                            name="role"
                            value={role}
                            checked={formData.role === role}
                            onChange={handleChange}
                            className="hidden"
                          />
                          {role === 'customer' ? 'User' : 'Admin'}
                        </label>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#238636] text-white rounded-[6px] py-3 font-bold text-[16px] hover:bg-[#2ea043] border border-[rgba(240,246,252,0.1)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-6 shadow-sm"
              >
                {isLoading
                  ? "Processing..."
                  : (isLogin ? "Sign in" : "Create account")
                }
              </button>
            </form>
          </div>

          <div className="mt-8 pt-6 border-t border-[#30363d] flex flex-col gap-4 text-center">
            <p className="text-[14px] text-[#8b949e]">
              {isLogin ? "New to COUPON PULSE? " : "Already have an account? "}
              <button
                onClick={handleModeSwitch}
                className="text-[#58a6ff] hover:underline decoration-[#58a6ff] font-medium"
              >
                {isLogin ? "Create an account" : "Sign in"}
              </button>
              .
            </p>

            <Link to="/" className="text-[12px] text-[#58a6ff] opacity-80 hover:opacity-100 hover:underline transition-all">
              &larr; Back to COUPON PULSE
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
