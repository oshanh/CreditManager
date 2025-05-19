import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authService';
import { ethers } from 'ethers';
import { useUser } from '../../context/UserContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useUser();
  const [isAnimating, setIsAnimating] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isWeb3Loading, setIsWeb3Loading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await authService.login(formData);
      if (response.authenticated) {
        
        navigate('/dashboard');
      } else {
        setErrors({ general: response.message || 'Login failed. Please try again.' });
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrors({ general: 'Login failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleWeb3Login = async () => {
    setIsWeb3Loading(true);
    try {
      if (typeof window.ethereum !== 'undefined') {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        console.log('Connected account:', accounts[0]);
        
        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const address = await signer.getAddress();
            const message = Math.random().toString(36).substring(2);
            const signature = await signer.signMessage(message);
    
            console.log("🔹 Address:", address);
            console.log("🔹 Message:", message);
            console.log("🔹 Signature:", signature);
    
            const loginResponse = await authService.web3Login(address, message, signature);
            console.log("Web3 login response:", loginResponse);
    
            if (loginResponse.token) {
                login({
                    id: loginResponse.id,
                    nickname: loginResponse.nickname
                });
                navigate('/dashboard');
            } else {
                setErrors({ general: 'Web3 login failed. Please try again.' });
            }
        } catch (error) {
            console.error("❌ Error during Web3 login:", error);
            setErrors({ general: 'Web3 login failed. Please try again.' });
        }
      } else {
        setErrors({ general: 'MetaMask is not installed. Please install MetaMask to use Web3 login.' });
      }
    } catch (error) {
      console.error('Web3 login error:', error);
      setErrors({ general: 'Web3 login failed. Please try again.' });
    } finally {
      setIsWeb3Loading(false);
    }
  };

  const handleNavigateToRegister = () => {
    setIsAnimating(true);
    setTimeout(() => {
      navigate('/register');
    }, 300); // Match this with the animation duration
  };

  // MetaMask Icon Component
  const MetaMaskIcon = () => (
    <svg width="20" height="20" viewBox="0 0 318.6 318.6" xmlns="http://www.w3.org/2000/svg">
      <path d="M274.1 35.5l-99.5 73.9L193 65.8z" fill="#e2761b" stroke="#e2761b"/>
      <path d="M44.4 35.5l98.7 74.6-17.5-44.3z" fill="#e4761b" stroke="#e4761b"/>
      <path d="M238.3 206.8l-26.5 40.6 56.7 15.6 16.3-55.3z" fill="#e4761b" stroke="#e4761b"/>
      <path d="M33.9 207.7l16.2 55.3 56.7-15.6-26.5-40.6z" fill="#e4761b" stroke="#e4761b"/>
      <path d="M103.6 138.2l-15.8 23.9 56.3 2.5-1.9-60.6z" fill="#e4761b" stroke="#e4761b"/>
      <path d="M214.9 138.2l-39-34.8-1.3 61.2 56.2-2.5z" fill="#e4761b" stroke="#e4761b"/>
      <path d="M106.8 247.4l33.8-16.5-29.2-22.8z" fill="#e4761b" stroke="#e4761b"/>
      <path d="M177.9 230.9l33.9 16.5-4.7-39.3z" fill="#e4761b" stroke="#e4761b"/>
      <path d="M211.8 247.4l-33.9-16.5 2.7 22.1-.3 9.3z" fill="#d7c1b3" stroke="#d7c1b3"/>
      <path d="M106.8 247.4l31.5 14.9-.2-9.3 2.5-22.1z" fill="#d7c1b3" stroke="#d7c1b3"/>
      <path d="M138.8 193.5l-28.2-8.3 19.9-9.1z" fill="#233447" stroke="#233447"/>
      <path d="M179.7 193.5l8.3-17.4 20 9.1z" fill="#233447" stroke="#233447"/>
      <path d="M106.8 247.4l4.8-40.6-31.3.9z" fill="#cd6116" stroke="#cd6116"/>
      <path d="M207 206.8l4.8 40.6 26.5-39.7z" fill="#cd6116" stroke="#cd6116"/>
      <path d="M230.8 162.1l-56.2 2.5 5.2 28.9 8.3-17.4 20 9.1z" fill="#cd6116" stroke="#cd6116"/>
      <path d="M110.6 185.2l20-9.1 8.2 17.4 5.3-28.9-56.3-2.5z" fill="#cd6116" stroke="#cd6116"/>
      <path d="M87.8 162.1l23.6 46-.8-22.9z" fill="#e4751f" stroke="#e4751f"/>
      <path d="M208.1 185.2l-1 22.9 23.7-46z" fill="#e4751f" stroke="#e4751f"/>
      <path d="M144.1 164.6l-5.3 28.9 6.6 34.1 1.5-44.9z" fill="#e4751f" stroke="#e4751f"/>
      <path d="M174.6 164.6l-2.7 18 1.2 45 6.7-34.1z" fill="#e4751f" stroke="#e4751f"/>
      <path d="M179.8 193.5l-6.7 34.1 4.8 3.3 29.2-22.8 1-22.9z" fill="#f6851b" stroke="#f6851b"/>
      <path d="M110.6 185.2l.8 22.9 29.2 22.8 4.8-3.3-6.6-34.1z" fill="#f6851b" stroke="#f6851b"/>
      <path d="M180.3 262.3l.3-9.3-2.5-2.2h-37.7l-2.3 2.2.2 9.3-31.5-14.9 11 9 22.3 15.5h38.3l22.4-15.5 11-9z" fill="#c0ad9e" stroke="#c0ad9e"/>
      <path d="M177.9 230.9l-4.8-3.3h-28.3l-4.8 3.3-2.5 22.1 2.3-2.2h37.7l2.5 2.2z" fill="#161616" stroke="#161616"/>
      <path d="M278.3 114.2l8.5-40.8-12.7-37.9-96.2 71.4 37 31.3 52.3 15.3 11.6-13.5-5-3.6 8-7.3-6.2-4.8 8-6.1z" fill="#763d16" stroke="#763d16"/>
      <path d="M31.8 73.4l8.5 40.8-5.4 4 8 6.1-6.1 4.8 8 7.3-5 3.6 11.5 13.5 52.3-15.3 37-31.3-96.2-71.4z" fill="#763d16" stroke="#763d16"/>
      <path d="M267.2 153.5l-52.3-15.3 15.9 23.9-23.7 46 31.2-.4h46.5z" fill="#f6851b" stroke="#f6851b"/>
      <path d="M103.6 138.2l-52.3 15.3-17.4 54.2h46.4l31.1.4-23.6-46z" fill="#f6851b" stroke="#f6851b"/>
      <path d="M174.6 164.6l3.3-57.7 15.2-41.1h-67.5l15 41.1 3.5 57.7 1.2 18.2.1 44.8h28.3l.2-44.8z" fill="#f6851b" stroke="#f6851b"/>
    </svg>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#101014] px-4">
      <div className={`w-full max-w-md bg-gray-900 border border-gray-800 rounded-2xl shadow-lg p-8 ${isAnimating ? 'animate-slide-out' : 'animate-slide-in'}`}>
        <h2 className="text-3xl font-bold text-white mb-2 text-center">
          Sign in to your account
        </h2>
        
        {errors.general && (
          <div className="bg-red-900/50 border border-red-800 text-red-400 px-4 py-3 rounded-md text-sm mb-4">
            {errors.general}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-5 mb-10 mt-10">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-1">
              Email address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full bg-gray-800 border ${errors.email ? 'border-red-500' : 'border-gray-700'} text-gray-100 placeholder-gray-500 rounded-lg pl-10 pr-3 py-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition`}
                placeholder="Enter your email"
              />
            </div>
            {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email}</p>}
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full bg-gray-800 border ${errors.password ? 'border-red-500' : 'border-gray-700'} text-gray-100 placeholder-gray-500 rounded-lg pl-10 pr-10 py-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition`}
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-400"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {errors.password && <p className="mt-1 text-sm text-red-400">{errors.password}</p>}
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mx-auto"></div>
            ) : (
              'Sign in'
            )}
          </button>
          
        </form>
        <p className="mb-6 text-center text-gray-400">
          Don't have an account?{' '}
          <button
            onClick={handleNavigateToRegister}
            className="text-blue-400 hover:text-blue-300 underline font-medium transition"
          >
            create a new account
          </button>
        </p>
        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-gray-700"></div>
          <span className="mx-4 text-gray-400 bg-gray-900 px-2">
            Or continue with
          </span>
          <div className="flex-grow border-t border-gray-700"></div>
        </div>
        <div className="flex gap-3">
          <button className="flex-1 flex items-center justify-center bg-gray-800 border border-gray-700 hover:bg-gray-700 text-gray-200 rounded-lg py-2 transition">
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M21.805 10.023h-9.765v3.953h5.617c-.241 1.241-1.453 3.641-5.617 3.641-3.389 0-6.156-2.805-6.156-6.264s2.767-6.264 6.156-6.264c1.934 0 3.234.82 3.98 1.523l2.727-2.648c-1.727-1.6-3.953-2.586-6.707-2.586-5.547 0-10.055 4.508-10.055 10.055s4.508 10.055 10.055 10.055c5.82 0 9.672-4.086 9.672-9.82 0-.66-.07-1.16-.156-1.59z"/></svg>
          </button>
          <button className="flex-1 flex items-center justify-center bg-gray-800 border border-gray-700 hover:bg-gray-700 text-gray-200 rounded-lg py-2 transition">
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2c-5.514 0-10 4.486-10 10 0 4.991 3.657 9.128 8.438 9.877.617.113.844-.267.844-.594 0-.293-.011-1.07-.017-2.099-3.338.726-4.042-1.609-4.042-1.609-.562-1.428-1.375-1.809-1.375-1.809-1.125-.77.086-.755.086-.755 1.242.087 1.896 1.277 1.896 1.277 1.104 1.893 2.898 1.347 3.604 1.031.112-.799.432-1.347.785-1.658-2.665-.304-5.466-1.332-5.466-5.931 0-1.309.469-2.381 1.236-3.221-.124-.304-.535-1.527.117-3.182 0 0 1.008-.322 3.301 1.23.957-.266 1.984-.399 3.003-.404 1.018.005 2.045.138 3.003.404 2.291-1.553 3.297-1.23 3.297-1.23.654 1.655.243 2.878.12 3.182.77.84 1.235 1.912 1.235 3.221 0 4.609-2.803 5.625-5.475 5.921.444.383.839 1.137.839 2.293 0 1.654-.015 2.988-.015 3.393 0 .33.225.713.85.592 4.779-.751 8.434-4.886 8.434-9.876 0-5.514-4.486-10-10-10z"/></svg>
          </button>
          <button 
            onClick={handleWeb3Login}
            disabled={isWeb3Loading}
            className="flex-1 flex items-center justify-center bg-gray-800 border border-gray-700 hover:bg-gray-700 text-gray-200 rounded-lg py-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <MetaMaskIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

Login.propTypes = {
  onLogin: PropTypes.func
};

export default Login;