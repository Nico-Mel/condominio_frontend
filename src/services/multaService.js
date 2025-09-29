// src/services/multaService.js
import api from './api';

export const multaService = {
  // Obtener todas las multas
  getAll: async () => {
    try {
      const response = await api.get('finance/multas/');
      return response.data || response;
    } catch (error) {
      console.error('Error fetching multas:', error);
      throw error;
    }
  },

  // Obtener multa por ID
  getById: async (id) => {
    try {
      const response = await api.get(`finance/multas/${id}/`);
      return response.data || response;
    } catch (error) {
      console.error('Error fetching multa:', error);
      throw error;
    }
  },

  // Crear multa
  create: async (multaData) => {
    try {
      const response = await api.post('finance/multas/', multaData);
      return response.data || response;
    } catch (error) {
      console.error('Error creating multa:', error);
      throw error;
    }
  },

  // Actualizar multa
  update: async (id, multaData) => {
    try {
      const response = await api.patch(`finance/multas/${id}/`, multaData);
      return response.data || response;
    } catch (error) {
      console.error('Error updating multa:', error);
      throw error;
    }
  },

  // Eliminar multa
  delete: async (id) => {
    try {
      const response = await api.delete(`finance/multas/${id}/`);
      return response.data || response;
    } catch (error) {
      console.error('Error deleting multa:', error);
      throw error;
    }
  },

  // Convertir multa a cuota
  convertirACuota: async (multaId) => {
    try {
      const response = await api.post(`finance/multas/${multaId}/convertir/`);
      return response.data || response;
    } catch (error) {
      console.error('Error converting multa to cuota:', error);
      throw error;
    }
  },

  // Obtener multas por residente
  getByResidente: async (residenteId) => {
    try {
      const response = await api.get(`finance/multas/por-residente/?residente_id=${residenteId}`);
      return response.data || response;
    } catch (error) {
      console.error('Error fetching multas by residente:', error);
      throw error;
    }
  },

  // Obtener multas por residencia
  getByResidencia: async (residenciaId) => {
    try {
      const response = await api.get(`finance/multas/por-residencia/?residencia_id=${residenciaId}`);
      return response.data || response;
    } catch (error) {
      console.error('Error fetching multas by residencia:', error);
      throw error;
    }
  },

  // Obtener mis multas (residente)
  getMisMultas: async () => {
    try {
      const response = await api.get('finance/mis-multas/');
      return response.data || response;
    } catch (error) {
      console.error('Error fetching mis multas:', error);
      throw error;
    }
  }
};