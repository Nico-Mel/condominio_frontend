// src/services/unidadService.js
import api from './api';

export const unidadService = {
  // Obtener todas las unidades
  getUnidades: async () => {
    try {
      console.log('🔍 Haciendo petición a: condominio/unidades/');
      const response = await api.get('condominio/unidades/');
      console.log('📦 Respuesta completa:', response);
      console.log('📊 response:', response);
      console.log('📊 response.data:', response.data);
      console.log('📊 response.data directo:', response.data);
      
      // Si response.data es undefined, usar response directamente
      const data = response.data !== undefined ? response.data : response;
      console.log('📊 Datos finales:', data);
      
      return data;
    } catch (error) {
      console.error('❌ Error en getUnidades:', error);
      console.error('🔍 Detalles del error:', error.response?.data);
      throw error;
    }
  },

  // Obtener unidad por ID
  getUnidadById: async (id) => {
    try {
      const response = await api.get(`condominio/unidades/${id}/`);
      // Si response.data es undefined, usar response directamente
      return response.data !== undefined ? response.data : response;
    } catch (error) {
      console.error('Error en getUnidadById:', error);
      throw error;
    }
  },

  // Crear unidad
  createUnidad: async (unidadData) => {
    try {
      const response = await api.post('condominio/unidades/', unidadData);
      // Si response.data es undefined, usar response directamente
      return response.data !== undefined ? response.data : response;
    } catch (error) {
      console.error('Error en createUnidad:', error);
      throw error;
    }
  },

  // Actualizar unidad
  updateUnidad: async (id, unidadData) => {
    try {
      const response = await api.patch(`condominio/unidades/${id}/`, unidadData);
      // Si response.data es undefined, usar response directamente
      return response.data !== undefined ? response.data : response;
    } catch (error) {
      console.error('Error en updateUnidad:', error);
      throw error;
    }
  },

  // Activar/desactivar unidad
  toggleUnidadActiva: async (id) => {
    try {
      const response = await api.patch(`condominio/unidades/${id}/toggle-activa/`);
      // Si response.data es undefined, usar response directamente
      return response.data !== undefined ? response.data : response;
    } catch (error) {
      console.error('Error en toggleUnidadActiva:', error);
      throw error;
    }
  },

  // Eliminar unidad (soft delete)
  deleteUnidad: async (id) => {
    try {
      const response = await api.delete(`condominio/unidades/${id}/`);
      // Si response.data es undefined, usar response directamente
      return response.data !== undefined ? response.data : response;
    } catch (error) {
      console.error('Error en deleteUnidad:', error);
      throw error;
    }
  },

  // Eliminación forzada
  hardDeleteUnidad: async (id) => {
    try {
      const response = await api.delete(`condominio/unidades/${id}/hard-delete/`);
      // Si response.data es undefined, usar response directamente
      return response.data !== undefined ? response.data : response;
    } catch (error) {
      console.error('Error en hardDeleteUnidad:', error);
      throw error;
    }
  }
};