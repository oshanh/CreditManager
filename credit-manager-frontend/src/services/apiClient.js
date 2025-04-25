import axios from 'axios';

// Create axios instance with default config
const apiClient = axios.create({
    baseURL:  'http://localhost:8001/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

// Request interceptor for adding auth token
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor for handling common errors
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            // Optional: Redirect to login page
            // window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Authentication services
export const authService = {
    login: async (credentials) => {
        const response = await apiClient.post('/auth/login', credentials);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    },
    register: (userData) => apiClient.post('/auth/register', userData),
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        return apiClient.post('/auth/logout');
    }
};

// Credit services
export const creditService = {
    getCredits: (params) => apiClient.get('/credits', { params }),
    getCreditById: (id) => apiClient.get(`/credits/${id}`),
    createCredit: (creditData) => apiClient.post('/credits', creditData),
    updateCredit: (id, creditData) => apiClient.put(`/credits/${id}`, creditData),
    deleteCredit: (id) => apiClient.delete(`/credits/${id}`),
    approveCredit: (id) => apiClient.post(`/credits/${id}/approve`),
    rejectCredit: (id, reason) => apiClient.post(`/credits/${id}/reject`, { reason })
};

// User services
export const userService = {
    getProfile: () => apiClient.get('/user/profile'),
    updateProfile: (userData) => apiClient.put('/user/profile', userData),
    changePassword: (passwordData) => apiClient.post('/user/change-password', passwordData)
};

export default apiClient;