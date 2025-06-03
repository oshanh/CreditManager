import apiClient from './apiClient';

const BASE_URL = '/debits';

const debitService = {
  createDebit: async (debitData) => {
    try {
      const response = await apiClient.post(BASE_URL, debitData);
      return response.data;
    } catch (error) {
      console.error('Error creating debit:', error);
      throw error;
    }
  },

  getAllDebits: async () => {
    try {
      const response = await apiClient.get(BASE_URL);
      return response.data;
    } catch (error) {
      console.error('Error fetching debits:', error);
      throw error;
    }
  },

  getDebitById: async (id) => {
    try {
      const response = await apiClient.get(`${BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching debit:', error);
      throw error;
    }
  },

  getDebitsByDebtorId: async (debtorId) => {
    try {
      const response = await apiClient.get(`${BASE_URL}/debtor/${debtorId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching debtor debits:', error);
      throw error;
    }
  },

  updateDebit: async (id, debitData) => {
    try {
      const response = await apiClient.put(`${BASE_URL}/${id}`, debitData);
      return response.data;
    } catch (error) {
      console.error('Error updating debit:', error);
      throw error;
    }
  },

  deleteDebit: async (id) => {
    try {
      await apiClient.delete(`${BASE_URL}/${id}`);
    } catch (error) {
      console.error('Error deleting debit:', error);
      throw error;
    }
  },

  // Repayment related methods
  getDebitRepayments: async (debitId) => {
    try {
      const response = await apiClient.get(`/repayments/${debitId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching debit repayments:', error);
      throw error;
    }
  },

  createRepayment: async (debitId, repaymentData) => {
    try {
      const response = await apiClient.post(`${BASE_URL}/${debitId}/repayments`, repaymentData);
      return response.data;
    } catch (error) {
      console.error('Error creating repayment:', error);
      throw error;
    }
  },

  // Transaction related methods
  getDebitTransactions: async (debitId) => {
    try {
      const response = await apiClient.get(`${BASE_URL}/${debitId}/transactions`);
      return response.data;
    } catch (error) {
      console.error('Error fetching debit transactions:', error);
      throw error;
    }
  },

  createTransaction: async (debitId, transactionData) => {
    try {
      const response = await apiClient.post(`${BASE_URL}/${debitId}/transactions`, transactionData);
      return response.data;
    } catch (error) {
      console.error('Error creating transaction:', error);
      throw error;
    }
  },

  // Helper methods
  calculateRemainingBalance: (debit) => {
    return debit.debitAmount - (debit.totalRepayments || 0);
  },

  getDebitStatus: (debit) => {
    const remainingAmount = debitService.calculateRemainingBalance(debit);
    const isOverdue = new Date(debit.dueDate) < new Date();
    
    if (isOverdue && remainingAmount>0) return 'OVERDUE';
    if (remainingAmount === 0) return 'PAID';
    if (remainingAmount < debit.debitAmount) return 'PARTIALLY_PAID';
    return 'PENDING';
  },

  getOverdueDebits: async () => {
    try {
      const response = await apiClient.get(`${BASE_URL}/overdue`);
      return response.data;
    } catch (error) {
      console.error('Error fetching overdue debits:', error);
      throw error;
    }
  }
};

export default debitService; 