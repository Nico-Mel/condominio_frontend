// src/services/expensaService.js
import api from './api';

export const expensaService = {
  // Obtener todas las expensas
  getAll: async () => {
    try {
      const response = await api.get('finance/expensas/');
      return response.data || response;
    } catch (error) {
      console.error('Error fetching expensas:', error);
      throw error;
    }
  },

  // Obtener expensa por ID
  getById: async (id) => {
    try {
      const response = await api.get(`finance/expensas/${id}/`);
      return response.data || response;
    } catch (error) {
      console.error('Error fetching expensa:', error);
      throw error;
    }
  },

  // Crear expensa
  create: async (expensaData) => {
    try {
      const response = await api.post('finance/expensas/', expensaData);
      return response.data || response;
    } catch (error) {
      console.error('Error creating expensa:', error);
      throw error;
    }
  },

  // Actualizar expensa
  update: async (id, expensaData) => {
    try {
      const response = await api.patch(`finance/expensas/${id}/`, expensaData);
      return response.data || response;
    } catch (error) {
      console.error('Error updating expensa:', error);
      throw error;
    }
  },

  // Eliminar expensa (desactivar)
  delete: async (id) => {
    try {
      const response = await api.patch(`finance/expensas/${id}/`, { es_activo: false });
      return response.data || response;
    } catch (error) {
      console.error('Error deactivating expensa:', error);
      throw error;
    }
  },

  // Activar expensa
  activate: async (id) => {
    try {
      const response = await api.patch(`finance/expensas/${id}/`, { es_activo: true });
      return response.data || response;
    } catch (error) {
      console.error('Error activating expensa:', error);
      throw error;
    }
  }
};