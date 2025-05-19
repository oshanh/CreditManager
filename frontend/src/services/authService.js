import apiClient from './apiClient';

const authService = {
    // Regular email/password login
    async login(formData) {
        try {
            const response = await apiClient.post('/auth/login', {
                email: formData.email,
                password: formData.password
            });
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify({
                    email: response.data.email,
                    nickname: response.data.nickname,
                    address: response.data.address
                }));
            }
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Web3 login
    async web3Login(address, message, signature) {
        try {
            const response = await apiClient.post('/auth/web3-login', { address, message, signature });
            console.log('inside service',response.data);
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify({
                    email: response.data.email,
                    nickname: response.data.nickname,
                    address: response.data.address
                }));
            }
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Register new user
    async register(formData) {
        try {
            const requestBody = {
                nickname: formData.name,
                email: formData.email,
                password: formData.password
            };

            const response = await apiClient.post('/auth/register', requestBody);
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify({
                    email: response.data.email,
                    nickname: response.data.nickname,
                    address: response.data.address
                }));
            }
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Logout
    async logout() {
        try {
            await apiClient.post('/auth/logout');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        } catch (error) {
            console.error('Logout error:', error);
            // Still clear local storage even if the server request fails
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
    },

    // Get current user
    getCurrentUser() {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            return JSON.parse(userStr);
        }
        return null;
    },

    // Check if user is logged in
    isLoggedIn() {
        return !!localStorage.getItem('token');
    }
};

export default authService;
