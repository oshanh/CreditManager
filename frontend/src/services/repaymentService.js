import apiClient from './apiClient';

const BASE_URL = '/repayments';

const repaymentService = {
  getRepaymentsForCredit: async (creditId) => {
    try {
      const response = await apiClient.get(`${BASE_URL}/${creditId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching repayments:', error);
      throw error;
    }
  },

  createRepayment: async (creditId, repaymentData) => {
    try {
      const response = await apiClient.post(`${BASE_URL}/${creditId}`, repaymentData);
      return response.data;
    } catch (error) {
      console.error('Error creating repayment:', error);
      throw error;
    }
  },

  updateRepayment: async (repaymentId, repaymentData) => {
    try {
      const response = await apiClient.put(`${BASE_URL}/${repaymentId}`, repaymentData);
      return response.data;
    } catch (error) {
      console.error('Error updating repayment:', error);
      throw error;
    }
  },

  deleteRepayment: async (repaymentId) => {
    try {
      await apiClient.delete(`${BASE_URL}/${repaymentId}`);
    } catch (error) {
      console.error('Error deleting repayment:', error);
      throw error;
    }
  },
};

export default repaymentService;
