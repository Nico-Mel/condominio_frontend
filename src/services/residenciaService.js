// src/services/residenciaService.js
import api from './api';

export const residenciaService = {
  // Obtener todas las residencias
  getResidencias: async () => {
    try {
      console.log('🔍 Haciendo petición a: condominio/residencias/');
      const response = await api.get('condominio/residencias/');
      console.log('📦 Respuesta completa:', response);
      console.log('📊 response:', response);
      console.log('📊 response.data:', response.data);
      
      // Si response.data es undefined, usar response directamente
      const data = response.data !== undefined ? response.data : response;
      console.log('📊 Datos finales:', data);
      
      return data;
    } catch (error) {
      console.error('❌ Error en getResidencias:', error);
      console.error('🔍 Detalles del error:', error.response?.data);
      throw error;
    }
  },

  // Obtener residencia por ID
  getResidenciaById: async (id) => {
    try {
      const response = await api.get(`condominio/residencias/${id}/`);
      // Si response.data es undefined, usar response directamente
      return response.data !== undefined ? response.data : response;
    } catch (error) {
      console.error('Error en getResidenciaById:', error);
      throw error;
    }
  },

  // Crear residencia
  createResidencia: async (residenciaData) => {
    try {
      const response = await api.post('condominio/residencias/', residenciaData);
      // Si response.data es undefined, usar response directamente
      return response.data !== undefined ? response.data : response;
    } catch (error) {
      console.error('Error en createResidencia:', error);
      throw error;
    }
  },

  // Actualizar residencia
  updateResidencia: async (id, residenciaData) => {
    try {
      const response = await api.patch(`condominio/residencias/${id}/`, residenciaData);
      // Si response.data es undefined, usar response directamente
      return response.data !== undefined ? response.data : response;
    } catch (error) {
      console.error('Error en updateResidencia:', error);
      throw error;
    }
  },

  // Activar/desactivar residencia
  toggleResidenciaActiva: async (id) => {
    try {
      const response = await api.patch(`condominio/residencias/${id}/toggle-activa/`);
      // Si response.data es undefined, usar response directamente
      return response.data !== undefined ? response.data : response;
    } catch (error) {
      console.error('Error en toggleResidenciaActiva:', error);
      throw error;
    }
  },

  // Eliminar residencia
  deleteResidencia: async (id) => {
    try {
      const response = await api.delete(`condominio/residencias/${id}/`);
      // Si response.data es undefined, usar response directamente
      return response.data !== undefined ? response.data : response;
    } catch (error) {
      console.error('Error en deleteResidencia:', error);
      throw error;
    }
  }
};