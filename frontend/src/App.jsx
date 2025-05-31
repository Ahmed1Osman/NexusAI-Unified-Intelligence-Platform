import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Pages
import ChatPage from './pages/ChatPage';
import DocumentsPage from './pages/DocumentsPage';
import MemoriesPage from './pages/MemoriesPage';
import SettingsPage from './pages/SettingsPage';

// Components
import Layout from './components/Layout';
import Notification from './components/Notification';

// Context and Utilities
import { AppProvider, useApp } from './utils/AppContext';
import { lightTheme, darkTheme } from './utils/theme';

// App content component (inside AppProvider context)
const AppContent = () => {
  const { darkMode, toggleDarkMode } = useApp();
  
  // Select theme based on dark mode preference
  const theme = darkMode ? darkTheme : lightTheme;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Layout toggleDarkMode={toggleDarkMode}>
        <Routes>
          <Route path="/" element={<ChatPage />} />
          <Route path="/documents" element={<DocumentsPage />} />
          <Route path="/memories" element={<MemoriesPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </Layout>
      <Notification />
    </ThemeProvider>
  );
};

// Main App component with context provider
function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
