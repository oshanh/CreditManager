const config = {
  api: {
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
    timeout: 30000,
  },
  auth: {
    tokenKey: 'auth_token',
    refreshTokenKey: 'refresh_token',
  },
  app: {
    name: 'Debit Manager',
    version: '1.0.0',
  },
  web3: {
    chainId: import.meta.env.VITE_CHAIN_ID || '1',
    rpcUrl: import.meta.env.VITE_RPC_URL || 'https://mainnet.infura.io/v3/your-project-id',
  }
};

export default config; 