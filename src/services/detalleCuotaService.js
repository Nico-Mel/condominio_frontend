// src/services/detalleCuotaService.js
import api from './api';

export const detalleCuotaService = {
  // Obtener todos los detalles
  getAll: async () => {
    try {
      const response = await api.get('finance/detalles-cuota/');
      return response.data || response;
    } catch (error) {
      console.error('Error fetching detalles:', error);
      throw error;
    }
  },

  // Obtener detalle por ID
  getById: async (id) => {
    try {
      const response = await api.get(`finance/detalles-cuota/${id}/`);
      return response.data || response;
    } catch (error) {
      console.error('Error fetching detalle:', error);
      throw error;
    }
  },

  // Crear detalle
  create: async (detalleData) => {
    try {
      const response = await api.post('finance/detalles-cuota/', detalleData);
      return response.data || response;
    } catch (error) {
      console.error('Error creating detalle:', error);
      throw error;
    }
  },

  // Actualizar detalle
  update: async (id, detalleData) => {
    try {
      const response = await api.patch(`finance/detalles-cuota/${id}/`, detalleData);
      return response.data || response;
    } catch (error) {
      console.error('Error updating detalle:', error);
      throw error;
    }
  },

  // Eliminar detalle
  delete: async (id) => {
    try {
      const response = await api.delete(`finance/detalles-cuota/${id}/`);
      return response.data || response;
    } catch (error) {
      console.error('Error deleting detalle:', error);
      throw error;
    }
  }
};