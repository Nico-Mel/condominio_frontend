// src/services/authService.js
/*
import api from './api';

export const authService = {
  login: (credentials) => api.post('api/accounts/login/', credentials),
  register: (userData) => api.post('api/accounts/usuarios/', userData),
};*/
// src/services/authService.js
// src/services/authService.js - VERSIÓN CORREGIDA
// src/services/authService.js - VERSIÓN FINAL Y FUNCIONAL
// src/services/authService.js - VERSIÓN ORIGINAL
export const authService = {
  login: async (credentials) => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/accounts/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ci: credentials.ci,
        password: credentials.password
      }),
    });

    if (!response.ok) {
      throw new Error('Credenciales incorrectas');
    }

    const data = await response.json();

    // Guardar en localStorage
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));

    return data;
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

/*
export const authService = {
  login: async (credentials) => {
    const response = await fetch('http://localhost:8000/api/accounts/login/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ci: credentials.ci, password: credentials.password }),
    });
    
    if (!response.ok) {
      throw new Error('Credenciales incorrectas');
    }
    
    const data = await response.json();
    
    // Guardar en localStorage
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    
    return data;
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
  
};*/