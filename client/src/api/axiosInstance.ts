import axios from 'axios';

// La URL del backend vive en una variable de entorno de Vite.
// Crea un archivo .env en la raíz de client/ con:
//   VITE_API_URL=http://localhost:3000/api
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
});

// Adjunta el JWT en cada petición, si existe
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('siga_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Manejo centralizado de errores comunes
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token vencido o inválido: limpiar sesión y mandar a login
      localStorage.removeItem('siga_token');
      localStorage.removeItem('siga_usuario');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;