import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authService';
import { ethers } from 'ethers';
import { useUser } from '../../context/UserContext';
import DarkModeToggle from '../../components/common/DarkModeToggle';
import MetaMaskIcon from '../../components/icons/MetaMask';
import GoogleIcon from '../../components/icons/Google';

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
        login({
          email: response.email,
          nickname: response.nickname
      });
        
        navigate('/dashboard');
      } else {
        
        setErrors({ general: response.message || 'Login failed. Please try again.' });
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrors({ general: error.message || 'Login failed. Please try again.' });
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
                    email: loginResponse.email,
                    nickname: loginResponse.nickname
                });
                navigate('/dashboard');
            } else {
                setErrors({ general: 'Web3 login failed. Please try again.' });
            }
        } catch (error) {
            console.error(" Error during Web3 login:", error);
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

  const handleNavigateToResetPassword = () => {
    setIsAnimating(true);
    setTimeout(() => {
      navigate('/reset-password');
    }, 300);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <DarkModeToggle />
      <div className={`w-full max-w-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg p-8 ${isAnimating ? 'animate-slide-out' : 'animate-slide-in'}`}>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 text-center">
          Sign in to your account
        </h2>
        
        {errors.general && (
          <div className="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-md text-sm mb-4">
            {errors.general}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-5 mb-10 mt-10">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Email address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full bg-white dark:bg-gray-700 border ${errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-lg pl-10 pr-3 py-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition`}
                placeholder="Enter your email"
              />
            </div>
            {errors.email && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>}
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full bg-white dark:bg-gray-700 border ${errors.password ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-lg pl-10 pr-10 py-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition`}
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {errors.password && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password}</p>}
            <div className="flex justify-end mt-1">
              <button
                type="button"
                onClick={handleNavigateToResetPassword}
                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition"
              >
                Forgot Password?
              </button>
            </div>
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
        <p className="mb-6 text-center text-gray-600 dark:text-gray-400">
          Don't have an account?{' '}
          <button
            onClick={handleNavigateToRegister}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 underline font-medium transition"
          >
            Sign Up
          </button>
        </p>
        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
          <span className="mx-4 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 px-2">
            Or continue with
          </span>
          <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
        </div>
        <div className="flex gap-3">
          <button className="flex-1 flex items-center justify-center bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg py-2 transition">
            <GoogleIcon/>
          </button>
          
          <button 
            onClick={handleWeb3Login}
            disabled={isWeb3Loading}
            className="flex-1 flex items-center justify-center bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg py-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
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