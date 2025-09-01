import axios from 'axios';
import { authService } from './authService';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor to add JWT token to requests
api.interceptors.request.use(
  (config) => {
    const token = authService.getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Remove token and redirect to login on 401 errors
      authService.setAuthToken(null);
      // Only redirect if we're not on the login page already
      // And only for non-login endpoints
      const isLoginPage = window.location.pathname === '/login';
      const isLoginEndpoint = error.config?.url?.includes('/api/auth/login');
      
      if (!isLoginPage && !isLoginEndpoint) {
        window.location.href = '/login';
      }
    }
    
    // Add more detailed error handling
    if (error.response) {
      // Server responded with error status
      error.message = error.response.data?.message || error.message || 'An error occurred';
    } else if (error.request) {
      // Request was made but no response received
      error.message = 'Network error. Please check your connection.';
    } else {
      // Something else happened
      error.message = error.message || 'An error occurred';
    }
    
    return Promise.reject(error);
  }
);

export default api;