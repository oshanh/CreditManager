import axios from 'axios';

const BASE_URL = 'http://localhost:8081/api/v1/customers';

const customerService = {
  getAllCustomers: async () => {
    try {
      const response = await axios.get(BASE_URL);
      return response.data;
    } catch (error) {
      console.error('Error fetching customers:', error);
      throw error;
    }
  },

  createCustomer: async (customerData) => {
    try {
      const response = await axios.post(BASE_URL, customerData);
      return response.data;
    } catch (error) {
      console.error('Error creating customer:', error);
      throw error;
    }
  },

  updateCustomer: async (customerId, customerData) => {
    try {
      const response = await axios.put(`${BASE_URL}/${customerId}`, customerData);
      return response.data;
    } catch (error) {
      console.error('Error updating customer:', error);
      throw error;
    }
  },

  deleteCustomer: async (customerId) => {
    try {
      await axios.delete(`${BASE_URL}/${customerId}`);
    } catch (error) {
      console.error('Error deleting customer:', error);
      throw error;
    }
  },
};

export default customerService;
