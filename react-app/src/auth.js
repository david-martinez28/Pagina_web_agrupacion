import api from './api';

export const login = async (email, password) => {
  const response = await api.post('/login', { email, password });
  
  if (response.data.token) {
    // Guarda el token en el almacenamiento local
    localStorage.setItem('token', response.data.token);
  }
  
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('token');
  // Opcional: Notificar al backend si tu API requiere anular el token
};