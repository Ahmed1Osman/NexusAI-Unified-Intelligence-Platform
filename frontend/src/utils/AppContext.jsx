import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocalStorage } from './hooks';
import * as api from './api';

// Create context
const AppContext = createContext();

// Context provider component
export const AppProvider = ({ children }) => {
  // User state
  const [user, setUser] = useLocalStorage('user', { name: 'User', email: '' });
  
  // API settings
  const [apiKey, setApiKey] = useLocalStorage('apiKey', '');
  const [apiModel, setApiModel] = useLocalStorage('apiModel', 'openai/gpt-4');
  
  // UI state
  const [darkMode, setDarkMode] = useLocalStorage('darkMode', false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // Application state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);
  
  // Initialize API with stored key
  useEffect(() => {
    if (apiKey) {
      api.setApiKey(apiKey);
    }
  }, [apiKey]);
  
  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  };
  
  // Show notification
  const showNotification = (message, severity = 'info', duration = 6000) => {
    setNotification({ message, severity, duration });
  };
  
  // Clear notification
  const clearNotification = () => {
    setNotification(null);
  };
  
  // Update user information
  const updateUser = (newUserData) => {
    setUser({ ...user, ...newUserData });
  };
  
  // Update API settings
  const updateApiSettings = (key, model) => {
    if (key && key !== apiKey) {
      setApiKey(key);
      api.setApiKey(key);
    }
    
    if (model && model !== apiModel) {
      setApiModel(model);
    }
    
    showNotification('API settings updated successfully', 'success');
  };
  
  // Generic API request handler
  const makeApiRequest = async (requestFn, ...args) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await requestFn(...args);
      setLoading(false);
      return result;
    } catch (err) {
      setError(err.message || 'An error occurred');
      showNotification(err.message || 'An error occurred', 'error');
      setLoading(false);
      throw err;
    }
  };
  
  // Context value
  const contextValue = {
    // State
    user,
    apiKey,
    apiModel,
    darkMode,
    sidebarOpen,
    loading,
    error,
    notification,
    
    // Actions
    setUser,
    updateUser,
    setSidebarOpen,
    toggleDarkMode,
    updateApiSettings,
    showNotification,
    clearNotification,
    makeApiRequest,
  };
  
  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the context
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export default AppContext;
