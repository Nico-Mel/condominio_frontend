// src/services/residenteService.js
import api from './api';

export const residenteService = {
  getResidentes: () => {
    return api.get('accounts/residentes/');  
  },

  getResidenteById: (id) => {
    return api.get(`accounts/residentes/${id}/`);
  },

  createResidente: (residenteData) => {
    return api.post('accounts/residentes/', residenteData);  
  },

  updateResidente: (id, residenteData) => {
    return api.patch(`accounts/residentes/${id}/`, residenteData);  
  },

  deleteResidente: (id) => {
    return api.delete(`accounts/residentes/${id}/`);  
  }
};