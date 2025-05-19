import apiClient from './apiClient';

const BASE_URL = '/auth';

const loginWithWeb3 = async (address, message, signature) => {
  try {
    const response = await apiClient.post(BASE_URL + '/web3login', { address, message, signature });
    return response.data;
  } catch (error) {
    console.error("Web3 login failed:", error);
    throw error;
  }
};

const logout = async () => {
  try {
    const response = await apiClient.post(BASE_URL + '/logout');
    return response.data;
  } catch (error) {
    console.error("Logout failed:", error);
    throw error;
  }
};

export default {
  web3Login: loginWithWeb3,
  logout
};
