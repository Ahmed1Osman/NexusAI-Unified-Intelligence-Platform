import axios from 'axios';

// Create an axios instance with default config
const api = axios.create({
  baseURL: '/api',
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Function to set the API key
export const setApiKey = (apiKey) => {
  if (apiKey) {
    localStorage.setItem('apiKey', apiKey);
    api.defaults.headers.common['Authorization'] = `Bearer ${apiKey}`;
  } else {
    localStorage.removeItem('apiKey');
    delete api.defaults.headers.common['Authorization'];
  }
};

// Initialize API key from localStorage if available
const storedApiKey = localStorage.getItem('apiKey');
if (storedApiKey) {
  setApiKey(storedApiKey);
}

// API functions for chat
export const sendMessage = async (message) => {
  try {
    const response = await api.post('/chat', { message });
    return response.data;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

// API functions for documents
export const uploadDocument = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  try {
    const response = await api.post('/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading document:', error);
    throw error;
  }
};

export const getDocuments = async () => {
  try {
    const response = await api.get('/documents');
    return response.data;
  } catch (error) {
    console.error('Error fetching documents:', error);
    throw error;
  }
};

export const getDocumentContent = async (documentId) => {
  try {
    const response = await api.get(`/documents/${documentId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching document content:', error);
    throw error;
  }
};

export const deleteDocument = async (documentId) => {
  try {
    const response = await api.delete(`/documents/${documentId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting document:', error);
    throw error;
  }
};

// API functions for memories
export const getMemories = async (tag = null) => {
  try {
    const params = tag ? { tag } : {};
    const response = await api.get('/memories', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching memories:', error);
    throw error;
  }
};

export const addMemory = async (content, tags = []) => {
  try {
    const response = await api.post('/memories', { content, tags });
    return response.data;
  } catch (error) {
    console.error('Error adding memory:', error);
    throw error;
  }
};

export const updateMemory = async (memoryId, content, tags = []) => {
  try {
    const response = await api.put(`/memories/${memoryId}`, { content, tags });
    return response.data;
  } catch (error) {
    console.error('Error updating memory:', error);
    throw error;
  }
};

export const deleteMemory = async (memoryId) => {
  try {
    const response = await api.delete(`/memories/${memoryId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting memory:', error);
    throw error;
  }
};

export const searchMemories = async (query) => {
  try {
    const response = await api.get('/memories/search', { params: { query } });
    return response.data;
  } catch (error) {
    console.error('Error searching memories:', error);
    throw error;
  }
};

// API functions for settings
export const getSettings = async () => {
  try {
    const response = await api.get('/settings');
    return response.data;
  } catch (error) {
    console.error('Error fetching settings:', error);
    throw error;
  }
};

export const updateSettings = async (settings) => {
  try {
    const response = await api.put('/settings', settings);
    return response.data;
  } catch (error) {
    console.error('Error updating settings:', error);
    throw error;
  }
};

export default api;
