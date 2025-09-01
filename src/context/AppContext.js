import React, { createContext, useContext, useReducer } from 'react';

const AppContext = createContext();

const appReducer = (state, action) => {
  switch (action.type) {
    case 'SET_UPLOAD_STATUS':
      return { 
        ...state, 
        uploadStatus: { ...state.uploadStatus, ...action.payload } 
      };
    case 'SET_SELECTED_FILE':
      return { ...state, selectedFile: action.payload };
    case 'ADD_HISTORY_ITEM':
      return { 
        ...state, 
        history: [action.payload, ...state.history].slice(0, 50) // Keep last 50 items
      };
    case 'ADD_ACTIVITY_LOG':
      return { 
        ...state, 
        activityLog: [action.payload, ...state.activityLog].slice(0, 100) // Keep last 100 items
      };
    case 'CLEAR_HISTORY':
      return { ...state, history: [] };
    case 'CLEAR_ACTIVITY_LOG':
      return { ...state, activityLog: [] };
    case 'SET_SOCKET_CONNECTED':
      return { ...state, socketConnected: action.payload };
    default:
      return state;
  }
};

const initialState = {
  uploadStatus: {
    total: 0,
    success: 0,
    failed: 0,
    inProgress: false
  },
  selectedFile: null,
  history: [],
  activityLog: [],
  socketConnected: false
};

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const actions = {
    setUploadStatus: (status) => dispatch({ type: 'SET_UPLOAD_STATUS', payload: status }),
    setSelectedFile: (file) => dispatch({ type: 'SET_SELECTED_FILE', payload: file }),
    addHistoryItem: (item) => dispatch({ type: 'ADD_HISTORY_ITEM', payload: item }),
    addActivityLog: (log) => dispatch({ type: 'ADD_ACTIVITY_LOG', payload: log }),
    clearHistory: () => dispatch({ type: 'CLEAR_HISTORY' }),
    clearActivityLog: () => dispatch({ type: 'CLEAR_ACTIVITY_LOG' }),
    setSocketConnected: (connected) => dispatch({ type: 'SET_SOCKET_CONNECTED', payload: connected })
  };

  return (
    <AppContext.Provider value={{ ...state, ...actions }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};