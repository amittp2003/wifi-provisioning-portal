import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authService } from '../services/authService';
import api from '../services/api';

export const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, loading: true, error: null };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        loading: false,
        error: null,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token
      };
    case 'LOGIN_FAILURE':
      return { ...state, loading: false, error: action.payload, isAuthenticated: false };
    case 'LOGOUT':
      return { ...state, isAuthenticated: false, user: null, token: null };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

const initialState = {
  isAuthenticated: false,
  user: null,
  token: authService.getAuthToken(), // Initialize token from localStorage
  loading: false,
  error: null
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    // Check authentication status on initial load
    checkAuthStatus();
  }, []);

  const login = async (credentials, loginType) => {
    // Clear any previous errors
    dispatch({ type: 'CLEAR_ERROR' });
    
    try {
      dispatch({ type: 'LOGIN_START' });
      const response = await authService.login(credentials, loginType);
      
      if (response.success) {
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: { user: response.user, token: response.token }
        });
        
        return { success: true };
      } else {
        const errorMessage = response.message || 'Login failed. Please try again.';
        dispatch({ type: 'LOGIN_FAILURE', payload: errorMessage });
        return { success: false, error: errorMessage };
      }
    } catch (error) {
      let errorMessage = 'Login failed. Please try again.';
      
      if (error.response) {
        // Server responded with error status
        if (error.response.status === 401) {
          errorMessage = 'Invalid credentials. Please check your email and password.';
        } else if (error.response.status === 400) {
          errorMessage = 'Bad request. Please check your input.';
        } else if (error.response.status >= 500) {
          errorMessage = 'Server error. Please try again later.';
        } else {
          errorMessage = error.response.data?.message || errorMessage;
        }
      } else if (error.request) {
        // Request was made but no response received
        errorMessage = 'Network error. Please check your connection.';
      }
      
      dispatch({ type: 'LOGIN_FAILURE', payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      // Even if logout API fails, we still want to clear local state
      console.warn('Logout API call failed, but clearing local state anyway');
    } finally {
      dispatch({ type: 'LOGOUT' });
    }
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  // Check if user is authenticated (for initial load)
  const checkAuthStatus = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Check if token exists
      const token = authService.getAuthToken();
      if (!token) {
        dispatch({ type: 'SET_LOADING', payload: false });
        return false;
      }
      
      // Verify token by calling auth/me endpoint
      const response = await api.get('/api/auth/me');
      
      if (response.data.success) {
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: { user: response.data.user, token: token }
        });
        dispatch({ type: 'SET_LOADING', payload: false });
        return true;
      } else {
        // Remove invalid token
        authService.setAuthToken(null);
        dispatch({ type: 'SET_LOADING', payload: false });
        return false;
      }
    } catch (error) {
      // Remove invalid token on error
      authService.setAuthToken(null);
      dispatch({ type: 'SET_LOADING', payload: false });
      
      // If it's a network error, we might want to retry or show a different message
      if (error.code === 'NETWORK_ERROR' || !error.response) {
        // Network error - might be temporary
        console.warn('Network error during auth check');
      }
      
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{
      ...state,
      login,
      logout,
      clearError,
      checkAuthStatus
    }}>
      {children}
    </AuthContext.Provider>
  );
};
