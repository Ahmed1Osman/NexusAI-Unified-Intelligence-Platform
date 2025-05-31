import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Divider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  Snackbar,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';

// Icons
import SaveIcon from '@mui/icons-material/Save';
import InfoIcon from '@mui/icons-material/Info';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';

const SettingsPage = () => {
  // API Settings
  const [apiKey, setApiKey] = useState('');
  const [apiEndpoint, setApiEndpoint] = useState('https://openrouter.ai/api/v1/chat/completions');
  const [selectedModel, setSelectedModel] = useState('openai/gpt-4');
  
  // User Information
  const [userName, setUserName] = useState('User');
  const [userEmail, setUserEmail] = useState('');
  
  // Application Settings
  const [enableVectorMemory, setEnableVectorMemory] = useState(true);
  const [enableDocumentProcessing, setEnableDocumentProcessing] = useState(true);
  const [maxMemoryItems, setMaxMemoryItems] = useState(100);
  
  // Notification Settings
  const [enableNotifications, setEnableNotifications] = useState(true);
  
  // UI Settings
  const [messageFontSize, setMessageFontSize] = useState(14);
  
  // Custom Commands
  const [customCommands, setCustomCommands] = useState([
    { id: '1', name: '!weather', description: 'Get current weather', enabled: true },
    { id: '2', name: '!translate', description: 'Translate text to another language', enabled: true },
    { id: '3', name: '!summarize', description: 'Summarize a document or text', enabled: true },
  ]);
  
  // Command Dialog
  const [commandDialogOpen, setCommandDialogOpen] = useState(false);
  const [editingCommand, setEditingCommand] = useState(null);
  const [newCommandName, setNewCommandName] = useState('');
  const [newCommandDescription, setNewCommandDescription] = useState('');
  
  // Snackbar
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  // Available models
  const availableModels = [
    { id: 'openai/gpt-4', name: 'GPT-4' },
    { id: 'openai/gpt-4-turbo', name: 'GPT-4 Turbo' },
    { id: 'openai/gpt-3.5-turbo', name: 'GPT-3.5 Turbo' },
    { id: 'anthropic/claude-3-opus', name: 'Claude 3 Opus' },
    { id: 'anthropic/claude-3-sonnet', name: 'Claude 3 Sonnet' },
    { id: 'anthropic/claude-3-haiku', name: 'Claude 3 Haiku' },
    { id: 'google/gemini-pro', name: 'Gemini Pro' },
  ];

  const handleSaveSettings = () => {
    // Simulate saving settings
    setSnackbarMessage('Settings saved successfully');
    setSnackbarSeverity('success');
    setSnackbarOpen(true);
  };

  const handleOpenCommandDialog = (command = null) => {
    if (command) {
      setEditingCommand(command);
      setNewCommandName(command.name);
      setNewCommandDescription(command.description);
    } else {
      setEditingCommand(null);
      setNewCommandName('');
      setNewCommandDescription('');
    }
    setCommandDialogOpen(true);
  };

  const handleCloseCommandDialog = () => {
    setCommandDialogOpen(false);
  };

  const handleSaveCommand = () => {
    if (!newCommandName.trim() || !newCommandDescription.trim()) return;

    if (editingCommand) {
      // Update existing command
      setCustomCommands(customCommands.map(cmd => 
        cmd.id === editingCommand.id 
          ? { ...cmd, name: newCommandName, description: newCommandDescription }
          : cmd
      ));
    } else {
      // Add new command
      const newCommand = {
        id: Date.now().toString(),
        name: newCommandName,
        description: newCommandDescription,
        enabled: true,
      };
      setCustomCommands([...customCommands, newCommand]);
    }

    handleCloseCommandDialog();
    setSnackbarMessage(`Command ${editingCommand ? 'updated' : 'added'} successfully`);
    setSnackbarSeverity('success');
    setSnackbarOpen(true);
  };

  const handleDeleteCommand = (id) => {
    setCustomCommands(customCommands.filter(cmd => cmd.id !== id));
    setSnackbarMessage('Command deleted successfully');
    setSnackbarSeverity('success');
    setSnackbarOpen(true);
  };

  const handleToggleCommand = (id) => {
    setCustomCommands(customCommands.map(cmd => 
      cmd.id === id ? { ...cmd, enabled: !cmd.enabled } : cmd
    ));
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box sx={{ height: '100%', overflow: 'auto' }}>
      <Paper sx={{ p: 2, mb: 2 }} elevation={0}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h5" component="h1" gutterBottom>
              Settings
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Configure your AI assistant and application preferences
            </Typography>
          </Grid>
          <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleSaveSettings}
              sx={{ borderRadius: 2 }}
            >
              Save Settings
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={3}>
        {/* API Settings */}
        <Grid item xs={12} md={6}>
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">API Settings</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Card variant="outlined" sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    OpenRouter API Configuration
                  </Typography>
                  <TextField
                    label="API Key"
                    fullWidth
                    margin="normal"
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Enter your OpenRouter API key"
                    helperText={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="caption">Get your API key from OpenRouter</Typography>
                        <Tooltip title="Visit openrouter.ai to get your API key">
                          <IconButton size="small">
                            <InfoIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    }
                  />
                  <TextField
                    label="API Endpoint"
                    fullWidth
                    margin="normal"
                    value={apiEndpoint}
                    onChange={(e) => setApiEndpoint(e.target.value)}
                  />
                </CardContent>
              </Card>
              
              <FormControl fullWidth margin="normal">
                <InputLabel id="model-select-label">Default AI Model</InputLabel>
                <Select
                  labelId="model-select-label"
                  value={selectedModel}
                  label="Default AI Model"
                  onChange={(e) => setSelectedModel(e.target.value)}
                >
                  {availableModels.map((model) => (
                    <MenuItem key={model.id} value={model.id}>
                      {model.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </AccordionDetails>
          </Accordion>

          {/* User Information */}
          <Accordion sx={{ mt: 2 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">User Information</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <TextField
                label="Name"
                fullWidth
                margin="normal"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
              <TextField
                label="Email"
                fullWidth
                margin="normal"
                type="email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
              />
            </AccordionDetails>
          </Accordion>

          {/* Notification Settings */}
          <Accordion sx={{ mt: 2 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Notification Settings</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <FormControlLabel
                control={
                  <Switch
                    checked={enableNotifications}
                    onChange={(e) => setEnableNotifications(e.target.checked)}
                  />
                }
                label="Enable Notifications"
              />
            </AccordionDetails>
          </Accordion>
        </Grid>

        {/* Application Settings */}
        <Grid item xs={12} md={6}>
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Application Settings</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <FormControlLabel
                control={
                  <Switch
                    checked={enableVectorMemory}
                    onChange={(e) => setEnableVectorMemory(e.target.checked)}
                  />
                }
                label="Enable Vector Memory"
              />
              <Typography variant="caption" color="text.secondary" paragraph>
                Vector memory enables semantic search and better recall of past conversations
              </Typography>
              
              <FormControlLabel
                control={
                  <Switch
                    checked={enableDocumentProcessing}
                    onChange={(e) => setEnableDocumentProcessing(e.target.checked)}
                  />
                }
                label="Enable Document Processing"
              />
              <Typography variant="caption" color="text.secondary" paragraph>
                Allows the AI to extract and process text from PDFs and images
              </Typography>
              
              <TextField
                label="Maximum Memory Items"
                type="number"
                fullWidth
                margin="normal"
                value={maxMemoryItems}
                onChange={(e) => setMaxMemoryItems(parseInt(e.target.value) || 0)}
                InputProps={{ inputProps: { min: 10, max: 1000 } }}
                helperText="Limit the number of memories stored (10-1000)"
              />
            </AccordionDetails>
          </Accordion>

          {/* UI Settings */}
          <Accordion sx={{ mt: 2 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">UI Settings</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <FormControl fullWidth margin="normal">
                <InputLabel id="font-size-label">Message Font Size</InputLabel>
                <Select
                  labelId="font-size-label"
                  value={messageFontSize}
                  label="Message Font Size"
                  onChange={(e) => setMessageFontSize(e.target.value)}
                >
                  <MenuItem value={12}>Small</MenuItem>
                  <MenuItem value={14}>Medium</MenuItem>
                  <MenuItem value={16}>Large</MenuItem>
                  <MenuItem value={18}>Extra Large</MenuItem>
                </Select>
              </FormControl>
            </AccordionDetails>
          </Accordion>

          {/* Custom Commands */}
          <Accordion sx={{ mt: 2 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Custom Commands</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={() => handleOpenCommandDialog()}
                >
                  Add Command
                </Button>
              </Box>
              
              <List>
                {customCommands.map((command) => (
                  <React.Fragment key={command.id}>
                    <ListItem>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography variant="subtitle2" sx={{ mr: 1 }}>
                              {command.name}
                            </Typography>
                            {!command.enabled && (
                              <Typography variant="caption" color="text.secondary">
                                (Disabled)
                              </Typography>
                            )}
                          </Box>
                        }
                        secondary={command.description}
                      />
                      <ListItemSecondaryAction>
                        <FormControlLabel
                          control={
                            <Switch
                              size="small"
                              checked={command.enabled}
                              onChange={() => handleToggleCommand(command.id)}
                            />
                          }
                          label=""
                        />
                        <Tooltip title="Edit Command">
                          <IconButton edge="end" onClick={() => handleOpenCommandDialog(command)}>
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Command">
                          <IconButton edge="end" onClick={() => handleDeleteCommand(command.id)}>
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </ListItemSecondaryAction>
                    </ListItem>
                    <Divider component="li" />
                  </React.Fragment>
                ))}
              </List>
              
              {customCommands.length === 0 && (
                <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 2 }}>
                  No custom commands added yet
                </Typography>
              )}
            </AccordionDetails>
          </Accordion>
        </Grid>
      </Grid>

      {/* Command Dialog */}
      <Dialog open={commandDialogOpen} onClose={handleCloseCommandDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingCommand ? 'Edit Command' : 'Add New Command'}
          <IconButton
            aria-label="close"
            onClick={handleCloseCommandDialog}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Command Name"
            fullWidth
            value={newCommandName}
            onChange={(e) => setNewCommandName(e.target.value)}
            placeholder="e.g., !weather"
            helperText="Command names should start with ! and be lowercase"
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={2}
            value={newCommandDescription}
            onChange={(e) => setNewCommandDescription(e.target.value)}
            placeholder="Describe what this command does"
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleCloseCommandDialog}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSaveCommand}
            disabled={!newCommandName.trim() || !newCommandDescription.trim()}
          >
            {editingCommand ? 'Save Changes' : 'Add Command'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SettingsPage;
