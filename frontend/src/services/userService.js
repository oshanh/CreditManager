import apiClient from './apiClient';

const userService = {
  getCurrentUser: async () => {
    const response = await apiClient.get('/users/me');
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await apiClient.put('/users/me', {
      nickname: profileData.nickname,
      email: profileData.email,
      address: profileData.address,
      currentPassword: profileData.currentPassword,
      newPassword: profileData.newPassword
    });
    return response.data;
  }
};

export default userService; 