import React from 'react';
import { Snackbar, Alert } from '@mui/material';
import { useApp } from '../utils/AppContext';

const Notification = () => {
  const { notification, clearNotification } = useApp();

  if (!notification) return null;

  const { message, severity, duration } = notification;

  return (
    <Snackbar
      open={Boolean(notification)}
      autoHideDuration={duration || 6000}
      onClose={clearNotification}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <Alert onClose={clearNotification} severity={severity || 'info'} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default Notification;
