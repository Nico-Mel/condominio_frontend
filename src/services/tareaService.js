// src/services/tareaService.js - VERSIÓN CORREGIDA
import { authService } from './authService';

const API_BASE = 'http://127.0.0.1:8000/api/operations';

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || errorData.message || `Error ${response.status}`);
  }
  return response.json();
};

// ✅ FUNCIÓN CORREGIDA - obtener token del localStorage directamente
const getAuthHeaders = () => {
  const token = localStorage.getItem('token'); // ← Cambio aquí
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

// Función para mapear los datos de la API al formato que espera el frontend
const mapTareaFromAPI = (tarea) => ({
  ...tarea,
  // Mapear nombres de campos para consistencia
  asignado_rol: {
    id: tarea.asignado_rol,
    nombre: tarea.asignado_rol_nombre || 'Sin nombre'
  },
  residencia: tarea.residencia ? {
    id: tarea.residencia,
    unidad_codigo: tarea.residencia_direccion || 'Sin dirección'
  } : null,
  area_comun: tarea.area_comun ? {
    id: tarea.area_comun,
    nombre: tarea.area_comun_nombre || 'Sin nombre'
  } : null,
  // Agregar campos display para los choices
  tipo_display: tarea.tipo === 'ordinaria' ? 'Ordinaria' : 'Extraordinaria',
  estado_display: 
    tarea.estado === 'pendiente' ? 'Pendiente' :
    tarea.estado === 'en_progreso' ? 'En Progreso' :
    tarea.estado === 'completada' ? 'Completada' : 'Cancelada',
  prioridad_display: 
    tarea.prioridad === 'baja' ? 'Baja' :
    tarea.prioridad === 'media' ? 'Media' :
    tarea.prioridad === 'alta' ? 'Alta' : 'Urgente'
});

export const tareaService = {
  // Obtener todas las tareas (admin)
  getTareas: async () => {
    const response = await fetch(`${API_BASE}/tareas/`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    const data = await handleResponse(response);
    return Array.isArray(data) ? data.map(mapTareaFromAPI) : [];
  },

  // Obtener tareas por rol
  getTareasPorRol: async (rolId) => {
    const response = await fetch(`${API_BASE}/tareas-por-rol/?rol=${rolId}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    const data = await handleResponse(response);
    return Array.isArray(data) ? data.map(mapTareaFromAPI) : [];
  },

  // Obtener mis tareas (usuario logueado)
  getMisTareas: async () => {
    const response = await fetch(`${API_BASE}/mis-tareas/`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    const data = await handleResponse(response);
    return Array.isArray(data) ? data.map(mapTareaFromAPI) : [];
  },

  // Obtener tareas disponibles
  getTareasDisponibles: async () => {
    const response = await fetch(`${API_BASE}/tareas-disponibles/`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    const data = await handleResponse(response);
    return Array.isArray(data) ? data.map(mapTareaFromAPI) : [];
  },

  // Crear tarea
  createTarea: async (tareaData) => {
    const response = await fetch(`${API_BASE}/tareas/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(tareaData),
    });
    const data = await handleResponse(response);
    return mapTareaFromAPI(data);
  },

  // Actualizar tarea
  updateTarea: async (id, tareaData) => {
    const response = await fetch(`${API_BASE}/tareas/${id}/`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(tareaData),
    });
    const data = await handleResponse(response);
    return mapTareaFromAPI(data);
  },

  // Eliminar tarea
  deleteTarea: async (id) => {
    const response = await fetch(`${API_BASE}/tareas/${id}/`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (response.ok) {
      return { success: true };
    }
    return handleResponse(response);
  },

  // Tomar tarea
  tomarTarea: async (tareaId) => {
    const response = await fetch(`${API_BASE}/tareas/${tareaId}/tomar/`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    const data = await handleResponse(response);
    return mapTareaFromAPI(data);
  },

  // Completar tarea
  completarTarea: async (tareaId) => {
    const response = await fetch(`${API_BASE}/tareas/${tareaId}/completar/`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    const data = await handleResponse(response);
    return mapTareaFromAPI(data);
  },
};