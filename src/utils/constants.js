export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    VALIDATE: '/api/auth/validate',
    REFRESH: '/api/auth/refresh',
    LOGOUT: '/api/auth/logout',
    AD_LOGIN: '/api/auth/ad-login'
  },
  CSV: {
    UPLOAD: '/api/csv/upload',
    VALIDATE: '/api/csv/validate',
    DOWNLOAD_SAMPLE: '/api/csv/sample'
  },
  PROVISIONING: {
    RUN: '/api/provisioning/run',
    STATUS: '/api/provisioning/status',
    HISTORY: '/api/provisioning/history',
    CLEAR: '/api/provisioning/clear'
  }
};

export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ACCEPTED_TYPES: ['.csv', 'text/csv', 'application/vnd.ms-excel']
};

export const STATUS_COLORS = {
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6'
};