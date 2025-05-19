import apiClient from './apiClient';

const BASE_URL = '/debtors';

const debtorService = {
  getAllDebtors: async () => {
    try {
      const response = await apiClient.get(BASE_URL);
      return response.data;
    } catch (error) {
      console.error('Error fetching debtors:', error);
      throw error;
    }
  },

  getDebtorById: async (debtorId) => {
    try {
      const response = await apiClient.get(`${BASE_URL}/${debtorId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching debtor:', error);
      throw error;
    }
  },

  createDebtor:  (debtorData,file) => {
   const formData = new FormData();
   formData.append('debtor', new Blob([JSON.stringify(debtorData)], {
    type: 'application/json'
   }));
   if (file) {
    formData.append('file', file);
   }
   return apiClient.post(BASE_URL, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
   });
  },

  updateDebtor: async (debtorId, debtorData) => {
    try {
      const response = await apiClient.put(`${BASE_URL}/${debtorId}`, debtorData);
      return response.data;
    } catch (error) {
      console.error('Error updating debtor:', error);
      throw error;
    }
  },

  deleteDebtor: async (debtorId) => {
    try {
      await apiClient.delete(`${BASE_URL}/${debtorId}`);
    } catch (error) {
      console.error('Error deleting debtor:', error);
      throw error;
    }
  }
};

export default debtorService; 