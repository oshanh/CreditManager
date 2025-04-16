import axios from 'axios';

const BASE_URL = 'http://localhost:8081/api/repayments';

const repaymentService = {
  getRepaymentsForCredit: async (creditId) => {
    try {
      const response = await axios.get(`${BASE_URL}/${creditId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching repayments:', error);
      throw error;
    }
  },

  createRepayment: async (creditId, repaymentData) => {
    try {
      const response = await axios.post(`${BASE_URL}/${creditId}`, repaymentData);
      return response.data;
    } catch (error) {
      console.error('Error creating repayment:', error);
      throw error;
    }
  },

  updateRepayment: async (repaymentId, repaymentData) => {
    try {
      const response = await axios.put(`${BASE_URL}/${repaymentId}`, repaymentData);
      return response.data;
    } catch (error) {
      console.error('Error updating repayment:', error);
      throw error;
    }
  },

  deleteRepayment: async (repaymentId) => {
    try {
      await axios.delete(`${BASE_URL}/${repaymentId}`);
    } catch (error) {
      console.error('Error deleting repayment:', error);
      throw error;
    }
  },
};

export default repaymentService;
