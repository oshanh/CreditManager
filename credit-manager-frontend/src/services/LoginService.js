import axios from 'axios';

const BASE_URL = 'http://localhost:8081/api/v1/auth/web3';

const loginWithWeb3 = async (address, message, signature) => {
  try {
    const response = await axios.post(BASE_URL, { address, message, signature });
    return response.data;
  } catch (error) {
    console.error("Web3 login failed:", error);
    throw error;
  }
};

export default { loginWithWeb3 };
