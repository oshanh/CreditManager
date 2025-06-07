import React, { useState } from 'react';
import { web3Service } from '../services/web3Service';
import userService  from '../services/userService';
import { X } from 'lucide-react';
import { useUser } from '../context/UserContext';

const Web3EmailVerificationModal = ({ show, onHide, onSuccess }) => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState(1); // 1: Enter email, 2: Enter OTP
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { user } = useUser();

    const handleClose = () => {
        setEmail('');
        setOtp('');
        setStep(1);
        setError('');
        onHide();
    };

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Get current account
            //const address = await web3Service.getCurrentAccount();
            const address=user.address;
            if (!address) {
                throw new Error('No wallet connected');
            }

            // Create message to sign
            const message = `Verify email change to ${email}`;
            
            // Sign message using web3Service
            const signature = await web3Service.signMessage(message);

            // Initiate email verification
            const res= await userService.initiateWeb3EmailVerification({
                email,
                signature,
                message,
                address
            });

            setStep(2);
        } catch (err) {
            console.log(err);
            setError(err.response.data || 'Failed to initiate email verification');
        } finally {
            setLoading(false);
        }
    };

    const handleOtpSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Get current account
            const address = await web3Service.getCurrentAccount();
            if (!address) {
                throw new Error('No wallet connected');
            }

            // Create message to sign
            const message = `Verify OTP for email change to ${email}`;
            
            // Sign message using web3Service
            const signature = await web3Service.signMessage(message);

            // Verify OTP
            const response = await userService.verifyWeb3EmailOTP({
                email,
                otp,
                signature,
                message,
                address
            });
            console.log(response);
            // Update token in localStorage
            localStorage.setItem('token', response.token);
            
            onSuccess(response);
            onHide();
            handleClose();
        } catch (err) {
            console.log(err);
            setError(err.response.data || err.message);
        } finally {
            setLoading(false);
        }
    };

    

    if (!show) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center p-4 text-center">
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={handleClose}></div>

                <div className="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                    <div className="absolute right-0 top-0 pr-4 pt-4">
                        <button
                            type="button"
                            className="rounded-md bg-white dark:bg-gray-800 text-gray-400 hover:text-gray-500 focus:outline-none"
                            onClick={handleClose}
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                    <div className="sm:flex sm:items-start">
                        <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                            <h3 className="text-lg font-semibold leading-6 text-gray-900 dark:text-white mb-4">
                                {step === 1 ? 'Add Email Address' : 'Verify OTP'}
                            </h3>

                            {error && (
                                <div className="mb-4 rounded-md bg-red-50 dark:bg-red-900/50 p-4">
                                    <div className="text-sm text-red-700 dark:text-red-200">{error}</div>
                                </div>
                            )}

                            {step === 1 ? (
                                <form onSubmit={handleEmailSubmit} className="space-y-4">
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            New Email Address
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                                            placeholder="Enter new email address"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading ? 'Processing...' : 'Continue'}
                                    </button>
                                </form>
                            ) : (
                                <form onSubmit={handleOtpSubmit} className="space-y-4">
                                    <div>
                                        <label htmlFor="otp" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Enter OTP
                                        </label>
                                        <input
                                            type="text"
                                            id="otp"
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                            required
                                            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                                            placeholder="Enter OTP sent to your email"
                                        />
                                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                            Please check your email for the OTP
                                        </p>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading ? 'Verifying...' : 'Verify OTP'}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Web3EmailVerificationModal; 