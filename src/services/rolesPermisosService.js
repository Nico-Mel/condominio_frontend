// src/services/rolesPermisosService.js
import api from './api';

export const rolesPermisosService = {
  // Roles
  getRoles: () => api.get('accounts/roles/'),
  createRol: (data) => api.post('accounts/roles/', data),
  updateRol: (id, data) => api.patch(`accounts/roles/${id}/`, data),
  deleteRol: (id) => api.delete(`accounts/roles/${id}/`),

  // Permisos
  getPermisos: () => api.get('accounts/permisos/'),
  createPermiso: (data) => api.post('accounts/permisos/', data),
  updatePermiso: (id, data) => api.patch(`accounts/permisos/${id}/`, data),
  deletePermiso: (id) => api.delete(`accounts/permisos/${id}/`),

  // RolPermiso
  getRolPermisos: () => api.get('accounts/rolpermisos/'),
  createRolPermiso: (data) => api.post('accounts/rolpermisos/', data),
  updateRolPermiso: (id, data) => api.patch(`accounts/rolpermisos/${id}/`, data),
  deleteRolPermiso: (id) => api.delete(`accounts/rolpermisos/${id}/`),
};