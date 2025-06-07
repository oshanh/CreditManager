import apiClient from './apiClient';

const userService = {
  getCurrentUser: async () => {
    const response = await apiClient.get('/users/me');
    return response.data;
  },

  initiateEmailChange: async (newEmail) => {
    const response = await apiClient.post('/users/update/email', {
      email: newEmail,
      nickname: null,
      address: null,
      currentPassword: null,
      newPassword: null,
      oldEmailOtp: null,
      newEmailOtp: null
    });
    return response.data;
  },

  verifyEmailChange: async (email, oldEmailOtp, newEmailOtp) => {
    const response = await apiClient.put('/users/update/email/verify', {
      email,
      oldEmailOtp,
      newEmailOtp,
      nickname: null,
      address: null,
      currentPassword: null,
      newPassword: null
    });
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await apiClient.put('/users/me', {
      nickname: profileData.nickname,
      address: profileData.address,
      currentPassword: profileData.currentPassword,
      newPassword: profileData.newPassword
    });
    return response.data;
  }
};

export default userService; 