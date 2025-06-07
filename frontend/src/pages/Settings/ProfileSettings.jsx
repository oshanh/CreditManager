import { useState, useEffect } from 'react';
import { useUser } from '../../context/UserContext';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon, User, Mail, Lock, Save } from 'lucide-react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import MessageAlert from '../../components/common/MessageAlert';
import userService from '../../services/userService';
import EmailChangeModal from '../../components/EmailChangeModal';
import Web3EmailVerificationModal from '../../components/Web3EmailVerificationModal';
import { web3Service } from '../../services/web3Service';

const ProfileSettings = () => {
  const { user, updateUser } = useUser();
  const { isDarkMode, toggleTheme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showWeb3EmailModal, setShowWeb3EmailModal] = useState(false);

  const [formData, setFormData] = useState({
    nickname: '',
    email: null,
    address: null,
    currentPassword: null,
    newPassword: null,
    confirmPassword: null
  });

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        nickname: user.nickname || '',
        email: user.email || null,
        address: user.address || null
      }));
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Create update data object with only the fields that are being changed
      const updateData = {
        nickname: formData.nickname,
        address: formData.address
      };

      // Only include password fields if user is changing password
      if (formData.newPassword) {
        if (formData.newPassword !== formData.confirmPassword) {
          throw new Error('New passwords do not match');
        }
        if (!formData.currentPassword) {
          throw new Error('Current password is required to set a new password');
        }
        updateData.currentPassword = formData.currentPassword;
        updateData.newPassword = formData.newPassword;
      }

      // Call API to update profile
      const updatedUser = await userService.updateProfile(updateData);
      
      // Update user context
      updateUser({
        email: updatedUser.email,
        address: updatedUser.address,
        nickname: updatedUser.nickname
      });
      
      setMessage({ type: 'success', text: 'Profile updated successfully' });
      
      // Clear password fields
      setFormData(prev => ({
        ...prev,
        currentPassword: null,
        newPassword: null,
        confirmPassword: null
      }));
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || error.message || 'Failed to update profile' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEmailChange = async () => {
    try {
      // Check if user has a Web3 wallet connected
      //const address = await web3Service.getCurrentAccount();
      const address=user.address;
      console.log(address);
      if (address) {
        // If user has a Web3 wallet, show Web3 email modal
        setShowWeb3EmailModal(true);
      } else {
        
        setShowEmailModal(true);
      }
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: 'Failed to check wallet connection' 
      });
      console.log(error);
      
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profile Settings</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Manage your account settings and preferences
        </p>
      </div>

      {message.text && (
        <MessageAlert
          type={message.type}
          message={message.text}
          onClose={() => setMessage({ type: '', text: '' })}
        />
      )}

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="p-6">
          <form onSubmit={handleProfileUpdate} className="space-y-6">
            {/* Profile Information */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Profile Information</h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <Input
                  label="Display Name"
                  name="nickname"
                  value={formData.nickname}
                  onChange={handleInputChange}
                  icon={User}
                  placeholder="Enter your display name"
                />
                <div className="relative">
                  <Input
                    label="Email Address"
                    name="email"
                    type="email"
                    value={formData.email}
                    disabled
                    icon={Mail}
                    placeholder="Enter your email"
                  />
                  <button
                    type="button"
                    onClick={handleEmailChange}
                    className="absolute right-2 top-8 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    {user?.email ? 'Change' : 'Add'}
                  </button>
                </div>
                <Input
                  label="Web3 Address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  disabled
                  icon={User}
                  placeholder="Enter your web3 address"
                />
              </div>
            </div>

            {/* Password Change */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Change Password</h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <Input
                  label="Current Password"
                  name="currentPassword"
                  type="password"
                  value={formData.currentPassword}
                  onChange={handleInputChange}
                  icon={Lock}
                  placeholder="Enter current password"
                />
                <div className="sm:col-span-2 grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <Input
                    label="New Password"
                    name="newPassword"
                    type="password"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    icon={Lock}
                    placeholder="Enter new password"
                  />
                  <Input
                    label="Confirm New Password"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    icon={Lock}
                    placeholder="Confirm new password"
                  />
                </div>
              </div>
            </div>

            {/* Theme Settings */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Appearance</h2>
              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {isDarkMode ? (
                    <>
                      <Sun className="h-5 w-5 mr-2" />
                      Light Mode
                    </>
                  ) : (
                    <>
                      <Moon className="h-5 w-5 mr-2" />
                      Dark Mode
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                isLoading={loading}
                className="inline-flex items-center"
              >
                <Save className="h-5 w-5 mr-2" />
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </div>

      <EmailChangeModal
        show={showEmailModal}
        onHide={() => setShowEmailModal(false)}
        onSuccess={updateUser}
      />

      <Web3EmailVerificationModal
        show={showWeb3EmailModal}
        onHide={() => setShowWeb3EmailModal(false)}
        onSuccess={(response) => {
          updateUser({
            email: response.email,
            address: response.address,
            nickname: response.nickname
          });
          setMessage({ type: 'success', text: 'Email updated successfully' });
        }}
      />
    </div>
  );
};

export default ProfileSettings; 