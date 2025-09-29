// src/services/areaComunService.js
import api from './api';

export const areaComunService = {
  // Obtener todas las áreas comunes
  getAll: async () => {
    try {
      console.log('🔍 Haciendo petición a: condominio/areas-comunes/');
      const response = await api.get('condominio/areas-comunes/');
      console.log('📦 Respuesta completa:', response);
      console.log('📊 response.data:', response.data);
      
      // Si response.data es undefined, usar response directamente
      const data = response.data || response;
      console.log('📊 Datos finales:', data);
      
      return data;
    } catch (error) {
      console.error('❌ Error fetching areas:', error);
      throw error;
    }
  },

  // Obtener área común por ID
  getById: async (id) => {
    try {
      const response = await api.get(`condominio/areas-comunes/${id}/`);
      // Si response.data es undefined, usar response directamente
      return response.data || response;
    } catch (error) {
      console.error('Error fetching area:', error);
      throw error;
    }
  },

  // Crear área común
  create: async (areaData) => {
    try {
      const response = await api.post('condominio/areas-comunes/', areaData);
      // Si response.data es undefined, usar response directamente
      return response.data || response;
    } catch (error) {
      console.error('Error creating area:', error);
      throw error;
    }
  },

  // Actualizar área común
  update: async (id, areaData) => {
    try {
      const response = await api.patch(`condominio/areas-comunes/${id}/`, areaData);
      // Si response.data es undefined, usar response directamente
      return response.data || response;
    } catch (error) {
      console.error('Error updating area:', error);
      throw error;
    }
  },

  // Eliminar área común (desactivar)
  delete: async (id) => {
    try {
      const response = await api.patch(`condominio/areas-comunes/${id}/`, { esta_activa: false });
      // Si response.data es undefined, usar response directamente
      return response.data || response;
    } catch (error) {
      console.error('Error deactivating area:', error);
      throw error;
    }
  },

  // Activar área común
  activate: async (id) => {
    try {
      const response = await api.patch(`condominio/areas-comunes/${id}/`, { esta_activa: true });
      // Si response.data es undefined, usar response directamente
      return response.data || response;
    } catch (error) {
      console.error('Error activating area:', error);
      throw error;
    }
  }
};