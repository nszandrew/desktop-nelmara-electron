// api.js
import axios from 'axios';

const api = axios.create({
  baseURL: '/api', // 👈 permite usar o proxy definido no Vite
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
