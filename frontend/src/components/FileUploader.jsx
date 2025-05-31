import React, { useState, useRef } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  CircularProgress,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ImageIcon from '@mui/icons-material/Image';
import DescriptionIcon from '@mui/icons-material/Description';
import { formatFileSize, getFileType } from '../utils/formatters';
import { useApp } from '../utils/AppContext';

const FileUploader = ({ onUploadComplete, maxSize = 10485760 }) => {
  const { showNotification } = useApp();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;

    // Check file size
    if (selectedFile.size > maxSize) {
      showNotification(`File too large. Maximum size is ${formatFileSize(maxSize)}`, 'error');
      return;
    }

    setFile(selectedFile);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const droppedFile = event.dataTransfer.files[0];
    if (!droppedFile) return;

    // Check file size
    if (droppedFile.size > maxSize) {
      showNotification(`File too large. Maximum size is ${formatFileSize(maxSize)}`, 'error');
      return;
    }

    setFile(droppedFile);
  };

  const handleRemoveFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const simulateUpload = () => {
    setUploading(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((prevProgress) => {
        const newProgress = prevProgress + 10;
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setUploading(false);
            if (onUploadComplete) {
              onUploadComplete(file);
            }
            showNotification('File uploaded successfully', 'success');
            setFile(null);
          }, 500);
          return 100;
        }
        return newProgress;
      });
    }, 300);
  };

  const getFileIcon = (fileType) => {
    switch (fileType) {
      case 'pdf':
        return <PictureAsPdfIcon color="error" />;
      case 'image':
        return <ImageIcon color="primary" />;
      default:
        return <DescriptionIcon color="info" />;
    }
  };

  return (
    <Paper
      elevation={0}
      variant="outlined"
      sx={{
        p: 3,
        borderRadius: 2,
        borderStyle: 'dashed',
        borderWidth: 2,
        borderColor: 'divider',
        backgroundColor: 'background.default',
        textAlign: 'center',
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          borderColor: 'primary.main',
          backgroundColor: 'action.hover',
        },
      }}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <input
        type="file"
        hidden
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept=".pdf,.doc,.docx,.txt,image/*"
      />

      {!file && !uploading && (
        <Box>
          <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Drag & Drop or Click to Upload
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Supports PDF, images, and text documents (Max {formatFileSize(maxSize)})
          </Typography>
        </Box>
      )}

      {file && !uploading && (
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
            {getFileIcon(getFileType(file.name))}
            <Typography variant="subtitle1" sx={{ ml: 1 }}>
              {file.name}
            </Typography>
            <Tooltip title="Remove file">
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveFile();
                }}
                sx={{ ml: 1 }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {formatFileSize(file.size)}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={(e) => {
              e.stopPropagation();
              simulateUpload();
            }}
            sx={{ mt: 2 }}
          >
            Upload File
          </Button>
        </Box>
      )}

      {uploading && (
        <Box>
          <CircularProgress variant="determinate" value={uploadProgress} size={60} sx={{ mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Uploading...
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {uploadProgress}% complete
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default FileUploader;
