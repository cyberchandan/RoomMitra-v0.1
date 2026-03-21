import axios from 'axios';

const api = axios.create({
  // baseURL: 'http://localhost:5000/api', // Backend base URL
  // baseURL: 'https://roomserver.vercel.app/api', // Backend base URL
  baseURL: 'https://imaginative-recreation-production-d054.up.railway.app/', // Backend base URL

});

// Interceptor to add token to requests
api.interceptors.request.use((config) => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  
  if (userInfo && userInfo.token) {
    config.headers.Authorization = `Bearer ${userInfo.token}`;
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
