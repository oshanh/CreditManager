import React, { useState } from 'react';
import userService from '../services/userService';
import { useUser } from '../context/UserContext';

const EmailChangeModal = ({ show, onHide, onSuccess }) => {
  const [newEmail, setNewEmail] = useState('');
  const [oldEmailOtp, setOldEmailOtp] = useState('');
  const [newEmailOtp, setNewEmailOtp] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [step, setStep] = useState(1); // 1: Enter new email, 2: Enter OTPs
  const { user, updateUser, updateToken } = useUser();

  const handleInitiateChange = async () => {
    try {
      await userService.initiateEmailChange(newEmail);
      setStep(2);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to initiate email change');
    }
  };

  const handleVerifyAndChange = async () => {
    try {
      const response = await userService.verifyEmailChange(newEmail, oldEmailOtp, newEmailOtp);
      console.log(response);
      setSuccess('Email updated successfully!');
      setTimeout(() => {
        onSuccess({
          email: newEmail,
          address: user.address,
          nickname: user.nickname
        });
        updateToken(response.token);
        onHide();
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to verify and update email');
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Change Email Address</h2>
          <button
            onClick={onHide}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-200 rounded">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-4 p-3 bg-green-100 dark:bg-green-900 border border-green-400 text-green-700 dark:text-green-200 rounded">
            {success}
          </div>
        )}
        
        {step === 1 ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                New Email Address
              </label>
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="Enter new email"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <button
              onClick={handleInitiateChange}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Verify Email
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                OTP from Current Email
              </label>
              <input
                type="text"
                value={oldEmailOtp}
                onChange={(e) => setOldEmailOtp(e.target.value)}
                placeholder="Enter OTP from current email"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                OTP from New Email
              </label>
              <input
                type="text"
                value={newEmailOtp}
                onChange={(e) => setNewEmailOtp(e.target.value)}
                placeholder="Enter OTP from new email"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <button
              onClick={handleVerifyAndChange}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Change Email
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailChangeModal; 