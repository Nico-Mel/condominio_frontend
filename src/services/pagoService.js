// src/services/pagoService.js
import api from './api';

export const pagoService = {
  // Obtener todos los pagos
  getAll: async () => {
    try {
      const response = await api.get('/finance/pagos/');
      return response.data || response;
    } catch (error) {
      console.error('Error fetching pagos:', error);
      throw error;
    }
  },

  // Obtener pago por ID
  getById: async (id) => {
    try {
      const response = await api.get(`/finance/pagos/${id}/`);
      return response.data || response;
    } catch (error) {
      console.error('Error fetching pago:', error);
      throw error;
    }
  },

  // Crear pago
  create: async (pagoData) => {
    try {
      const response = await api.post('/finance/pagos/', pagoData);
      return response.data || response;
    } catch (error) {
      console.error('Error creating pago:', error);
      throw error;
    }
  },

  // Realizar pago (endpoint específico)
  realizarPago: async (pagoData) => {
    try {
      const response = await api.post('/finance/realizar-pago/', pagoData);
      return response.data || response;
    } catch (error) {
      console.error('Error realizando pago:', error);
      throw error;
    }
  },

  // Obtener mis pagos (residente)
  getMisPagos: async () => {
    try {
      const response = await api.get('/finance/mis-pagos/');
      return response.data || response;
    } catch (error) {
      console.error('Error fetching mis pagos:', error);
      throw error;
    }
  }
};