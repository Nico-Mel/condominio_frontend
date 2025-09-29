// src/services/cuotaService.js
import api from './api';

export const cuotaService = {
  // Obtener todas las cuotas
  getAll: async () => {
    try {
      const response = await api.get('finance/cuotas/');
      return response.data || response;
    } catch (error) {
      console.error('Error fetching cuotas:', error);
      throw error;
    }
  },

  // Obtener cuota por ID
  getById: async (id) => {
    try {
      const response = await api.get(`finance/cuotas/${id}/`);
      return response.data || response;
    } catch (error) {
      console.error('Error fetching cuota:', error);
      throw error;
    }
  },

  // Crear cuota
  create: async (cuotaData) => {
    try {
      const response = await api.post('finance/cuotas/', cuotaData);
      return response.data || response;
    } catch (error) {
      console.error('Error creating cuota:', error);
      throw error;
    }
  },

  // Actualizar cuota
  update: async (id, cuotaData) => {
    try {
      const response = await api.patch(`finance/cuotas/${id}/`, cuotaData);
      return response.data || response;
    } catch (error) {
      console.error('Error updating cuota:', error);
      throw error;
    }
  },

  // Generar cuotas mensuales
  generarMensuales: async (periodoData) => {
    try {
      const response = await api.post('finance/cuotas/generar-mensuales/', periodoData);
      return response.data || response;
    } catch (error) {
      console.error('Error generating monthly cuotas:', error);
      throw error;
    }
  },

  // Obtener cuotas por residente
  getByResidente: async (residenteId) => {
    try {
      const response = await api.get(`finance/cuotas/residente/${residenteId}/`);
      return response.data || response;
    } catch (error) {
      console.error('Error fetching cuotas by residente:', error);
      throw error;
    }
  },

  // Obtener cuotas por periodo
  getByPeriodo: async (periodo) => {
    try {
      const response = await api.get(`finance/cuotas/periodo/${periodo}/`);
      return response.data || response;
    } catch (error) {
      console.error('Error fetching cuotas by periodo:', error);
      throw error;
    }
  }
};