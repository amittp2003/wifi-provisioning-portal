import api from './api';

// Store token in localStorage
const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('authToken', token);
  } else {
    localStorage.removeItem('authToken');
  }
};

// Get token from localStorage
const getAuthToken = () => {
  const token = localStorage.getItem('authToken');
  return token;
};

export const authService = {
  async login(credentials, loginType) {
    const endpoint = '/api/auth/login';
    const response = await api.post(endpoint, { ...credentials, loginType });
    
    // Store token if login successful
    if (response.data.success && response.data.token) {
      setAuthToken(response.data.token);
    }
    
    return response.data;
  },

  async logout() {
    try {
      await api.post('/api/auth/logout');
    } catch (error) {
      // Logout API call failed
    } finally {
      // Remove token from localStorage
      setAuthToken(null);
    }
 },

  // Token helper functions
  setAuthToken,
  getAuthToken
};