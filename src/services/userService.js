// src/services/userService.js
import api from './api';

export const userService = {
  getUsers: () => {
    return api.get('accounts/usuarios/');  
  },

  getUserById: (id) => {
    return api.get(`accounts/usuarios/${id}/`);
  },

  createUser: (userData) => {
    return api.post('accounts/usuarios/', userData);  
  },

  updateUser: (id, userData) => {
    return api.patch(`accounts/usuarios/${id}/`, userData);
  },

  softDeleteUser: (id) => {
    return api.patch(`accounts/usuarios/${id}/toggle-activo/`);
  }
};