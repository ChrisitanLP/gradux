// src/axiosConfig.js

import axios from 'axios';

// Configuración del interceptor de solicitud de Axios
axios.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Usar comillas invertidas (`) para interpolación
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);
