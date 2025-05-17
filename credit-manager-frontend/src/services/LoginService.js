import apiClient from './apiClient';

const BASE_URL = '/auth/web3';

const loginWithWeb3 = async (address, message, signature) => {
  try {
    const response = await apiClient.post(BASE_URL, { address, message, signature });
    return response.data;
  } catch (error) {
    console.error("Web3 login failed:", error);
    throw error;
  }
};

export default { loginWithWeb3 };
