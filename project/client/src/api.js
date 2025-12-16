import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,  // Your backend server
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('[API] Sending token in header:', token);
  } else {
    console.warn('[API] No token found in localStorage');
  }
  return config;
});

export default api;
