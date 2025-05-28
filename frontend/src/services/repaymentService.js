import apiClient from './apiClient';

const BASE_URL = '/repayments';

const repaymentService = {
  getRepaymentsForDebit: async (debitId) => {
    try {
      const response = await apiClient.get(`${BASE_URL}/${debitId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching repayments:', error);
      throw error;
    }
  },

  createRepayment: async (debitId, repaymentData) => {
    try {
      const response = await apiClient.post(`${BASE_URL}/${debitId}`, repaymentData);
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

  markAsPaid: async (repaymentId) => {
    try {
      const response = await apiClient.put(`${BASE_URL}/${repaymentId}/mark-as-paid`);
      return response.data;
    } catch (error) {
      console.error('Error marking repayment as paid:', error);
      throw error;
    }
  },

  undoPayment: async (repaymentId) => {
    try {
      const response = await apiClient.put(`${BASE_URL}/${repaymentId}/undo-payment`);
      return response.data;
    } catch (error) {
      console.error('Error undoing payment:', error);
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
