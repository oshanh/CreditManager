import apiClient from './apiClient';

const BASE_URL = '/credits';

const creditService = {
  getAllCredits: async () => {
    try {
      const response = await apiClient.get(BASE_URL);
      return response.data;
    } catch (error) {
      console.error('Error fetching credits:', error);
      throw error;
    }
  },

  createCredit: async (creditData) => {
    try {
      const response = await apiClient.post(BASE_URL, creditData);
      return response.data;
    } catch (error) {
      console.error('Error creating credit:', error);
      throw error;
    }
  },

  updateCredit: async (creditId, creditData) => {
    try {
      const response = await apiClient.put(`${BASE_URL}/${creditId}`, creditData);
      return response.data;
    } catch (error) {
      console.error('Error updating credit:', error);
      throw error;
    }
  },

  deleteCredit: async (creditId) => {
    try {
      await apiClient.delete(`${BASE_URL}/${creditId}`);
    } catch (error) {
      console.error('Error deleting credit:', error);
      throw error;
    }
  },

  sendWhatsAppNotification: async (customerId, creditId) => {
    try {
      const response = await apiClient.post(`${BASE_URL}/${customerId}/whatsapp/${creditId}`);
      return response.data;
    } catch (error) {
      console.error("Error sending WhatsApp notification:", error);
      throw error;
    }
  },
};

export default creditService;
