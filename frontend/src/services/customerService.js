import apiClient from './apiClient';

const BASE_URL = '/customers';

const customerService = {
  getAllCustomers: async () => {
    try {
      const response = await apiClient.get(BASE_URL);
      return response.data;
    } catch (error) {
      console.error('Error fetching customers:', error);
      throw error;
    }
  },

  getCustomerById: async (customerId) => {
    try {
      const response = await apiClient.get(`${BASE_URL}/${customerId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching customer:', error);
      throw error;
    }
  },

  updateCustomer: async (customerId, customerData) => {
    try {
      const response = await apiClient.put(`${BASE_URL}/${customerId}`, customerData);
      return response.data;
    } catch (error) {
      console.error('Error updating customer:', error);
      throw error;
    }
  },

  deleteCustomer: async (customerId) => {
    try {
      await apiClient.delete(`${BASE_URL}/${customerId}`);
    } catch (error) {
      console.error('Error deleting customer:', error);
      throw error;
    }
  },

  addCustomer: (customerData, file) => {
    const formData = new FormData();
    formData.append('customer', new Blob([JSON.stringify(customerData)], { type: 'application/json' }));
    if (file) {
      formData.append('file', file);
    }
    return apiClient.post(BASE_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }


};

export default customerService;
