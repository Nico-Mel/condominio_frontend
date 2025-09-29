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
    const response = await fetch(`${import.meta.env.VITE_API_URL}accounts/login/`, {
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

    // NORMALIZAR EL ROL - ESTA ES LA SOLUCIÓN
    let normalizedRol = data.rol;
    if (data.rol === 'Administrador') {
      normalizedRol = 'Admin';
    }

    // Guardar en localStorage con el rol normalizado
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify({
      id: data.id,
      nombre: data.nombre,
      apellido: data.apellido,
      correo: data.correo,
      rol: normalizedRol, // Usar el rol normalizado
      ci: data.ci
    }));

    return data;
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    
    const user = JSON.parse(userStr);
    
    // Asegurar que el rol esté normalizado también al leer
    if (user.rol === 'Administrador') {
      user.rol = 'Admin';
    }
    
    return user;
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