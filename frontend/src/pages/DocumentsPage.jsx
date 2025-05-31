import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  IconButton,
  TextField,
  InputAdornment,
  Divider,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Tooltip,
  CircularProgress,
} from '@mui/material';

// Icons
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ImageIcon from '@mui/icons-material/Image';
import DescriptionIcon from '@mui/icons-material/Description';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseIcon from '@mui/icons-material/Close';

// Mock data
import { mockDocuments } from '../utils/mockData';

const DocumentsPage = () => {
  const [documents, setDocuments] = useState(mockDocuments);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
  };

  const handleUploadDialogOpen = () => {
    setUploadDialogOpen(true);
  };

  const handleUploadDialogClose = () => {
    setUploadDialogOpen(false);
    setSelectedFile(null);
  };

  const handleFileSelect = (e) => {
    if (e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!selectedFile) return;
    
    setUploading(true);
    
    // Simulate upload process
    setTimeout(() => {
      const newDocument = {
        id: Date.now().toString(),
        name: selectedFile.name,
        type: getFileType(selectedFile.name),
        size: selectedFile.size,
        uploadDate: new Date().toISOString(),
        content: 'Sample extracted content from ' + selectedFile.name,
      };
      
      setDocuments([newDocument, ...documents]);
      setUploading(false);
      handleUploadDialogClose();
    }, 2000);
  };

  const handleViewDocument = (document) => {
    setSelectedDocument(document);
    setViewDialogOpen(true);
  };

  const handleViewDialogClose = () => {
    setViewDialogOpen(false);
    setSelectedDocument(null);
  };

  const handleDeleteDocument = (id) => {
    setDocuments(documents.filter(doc => doc.id !== id));
  };

  const getFileType = (filename) => {
    const extension = filename.split('.').pop().toLowerCase();
    if (['pdf'].includes(extension)) return 'pdf';
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp'].includes(extension)) return 'image';
    return 'document';
  };

  const getFileIcon = (type) => {
    switch (type) {
      case 'pdf':
        return <PictureAsPdfIcon color="error" />;
      case 'image':
        return <ImageIcon color="primary" />;
      default:
        return <DescriptionIcon color="info" />;
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const filteredDocuments = documents.filter(doc => {
    // Apply search filter
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Apply type filter
    const matchesType = selectedFilter === 'all' || doc.type === selectedFilter;
    
    return matchesSearch && matchesType;
  });

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Paper sx={{ p: 2, mb: 2 }} elevation={0}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h5" component="h1" gutterBottom>
              Documents
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Upload and manage your documents for AI processing
            </Typography>
          </Grid>
          <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleUploadDialogOpen}
              sx={{ borderRadius: 2 }}
            >
              Upload Document
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ p: 2, mb: 2 }} elevation={0}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              placeholder="Search documents..."
              value={searchQuery}
              onChange={handleSearch}
              variant="outlined"
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                sx: { borderRadius: 2 }
              }}
            />
          </Grid>
          <Grid item xs={12} md={4} sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip 
              icon={<FilterListIcon />} 
              label="All" 
              onClick={() => handleFilterChange('all')}
              color={selectedFilter === 'all' ? 'primary' : 'default'}
              variant={selectedFilter === 'all' ? 'filled' : 'outlined'}
            />
            <Chip 
              icon={<PictureAsPdfIcon />} 
              label="PDF" 
              onClick={() => handleFilterChange('pdf')}
              color={selectedFilter === 'pdf' ? 'primary' : 'default'}
              variant={selectedFilter === 'pdf' ? 'filled' : 'outlined'}
            />
            <Chip 
              icon={<ImageIcon />} 
              label="Images" 
              onClick={() => handleFilterChange('image')}
              color={selectedFilter === 'image' ? 'primary' : 'default'}
              variant={selectedFilter === 'image' ? 'filled' : 'outlined'}
            />
            <Chip 
              icon={<DescriptionIcon />} 
              label="Documents" 
              onClick={() => handleFilterChange('document')}
              color={selectedFilter === 'document' ? 'primary' : 'default'}
              variant={selectedFilter === 'document' ? 'filled' : 'outlined'}
            />
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ p: 2, flexGrow: 1, overflow: 'auto' }} elevation={0}>
        {filteredDocuments.length > 0 ? (
          <List>
            {filteredDocuments.map((doc) => (
              <React.Fragment key={doc.id}>
                <ListItem
                  secondaryAction={
                    <Box>
                      <Tooltip title="View Document">
                        <IconButton edge="end" onClick={() => handleViewDocument(doc)}>
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Document">
                        <IconButton edge="end" onClick={() => handleDeleteDocument(doc.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  }
                >
                  <ListItemIcon>
                    {getFileIcon(doc.type)}
                  </ListItemIcon>
                  <ListItemText
                    primary={doc.name}
                    secondary={
                      <React.Fragment>
                        <Typography component="span" variant="body2" color="text.secondary">
                          {formatFileSize(doc.size)} • Uploaded on {new Date(doc.uploadDate).toLocaleDateString()}
                        </Typography>
                      </React.Fragment>
                    }
                  />
                </ListItem>
                <Divider variant="inset" component="li" />
              </React.Fragment>
            ))}
          </List>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 8 }}>
            <DescriptionIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No documents found
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center" sx={{ maxWidth: 400, mb: 3 }}>
              {searchQuery ? 'No documents match your search criteria' : 'Upload your first document to get started'}
            </Typography>
            {!searchQuery && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleUploadDialogOpen}
              >
                Upload Document
              </Button>
            )}
          </Box>
        )}
      </Paper>

      {/* Upload Dialog */}
      <Dialog open={uploadDialogOpen} onClose={handleUploadDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          Upload Document
          <IconButton
            aria-label="close"
            onClick={handleUploadDialogClose}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: 'center', py: 3 }}>
            <input
              accept=".pdf,.doc,.docx,.txt,image/*"
              style={{ display: 'none' }}
              id="file-upload"
              type="file"
              onChange={handleFileSelect}
            />
            <label htmlFor="file-upload">
              <Button
                variant="outlined"
                component="span"
                startIcon={<CloudUploadIcon />}
                sx={{ mb: 2 }}
              >
                Select File
              </Button>
            </label>
            {selectedFile && (
              <Box sx={{ mt: 2 }}>
                <Chip
                  icon={getFileIcon(getFileType(selectedFile.name))}
                  label={selectedFile.name}
                  onDelete={() => setSelectedFile(null)}
                  sx={{ maxWidth: '100%' }}
                />
                <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                  {formatFileSize(selectedFile.size)}
                </Typography>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleUploadDialogClose}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleUpload}
            disabled={!selectedFile || uploading}
            startIcon={uploading ? <CircularProgress size={20} /> : null}
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Document Dialog */}
      <Dialog open={viewDialogOpen} onClose={handleViewDialogClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedDocument?.name}
          <IconButton
            aria-label="close"
            onClick={handleViewDialogClose}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {selectedDocument && (
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Extracted Content:
              </Typography>
              <Paper variant="outlined" sx={{ p: 2, bgcolor: 'background.default' }}>
                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                  {selectedDocument.content}
                </Typography>
              </Paper>
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Document Information:
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Type: {selectedDocument.type.toUpperCase()}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Size: {formatFileSize(selectedDocument.size)}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">
                      Uploaded: {new Date(selectedDocument.uploadDate).toLocaleString()}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleViewDialogClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DocumentsPage;
