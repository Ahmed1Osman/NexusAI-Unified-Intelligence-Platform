import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  InputAdornment,
  Button,
  IconButton,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
} from '@mui/material';

// Icons
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import MemoryIcon from '@mui/icons-material/Memory';
import CloseIcon from '@mui/icons-material/Close';
import TagIcon from '@mui/icons-material/Tag';

// Mock data
import { mockMemories, mockTags } from '../utils/mockData';

const MemoriesPage = () => {
  const [memories, setMemories] = useState(mockMemories);
  const [tags, setTags] = useState(mockTags);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedMemory, setSelectedMemory] = useState(null);
  const [newMemoryContent, setNewMemoryContent] = useState('');
  const [newMemoryTags, setNewMemoryTags] = useState([]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleTagSelect = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleAddDialogOpen = () => {
    setAddDialogOpen(true);
    setNewMemoryContent('');
    setNewMemoryTags([]);
  };

  const handleAddDialogClose = () => {
    setAddDialogOpen(false);
  };

  const handleAddMemory = () => {
    if (!newMemoryContent.trim()) return;

    const newMemory = {
      id: Date.now().toString(),
      content: newMemoryContent,
      tags: newMemoryTags,
      createdAt: new Date().toISOString(),
    };

    setMemories([newMemory, ...memories]);
    handleAddDialogClose();
  };

  const handleEditDialogOpen = (memory) => {
    setSelectedMemory(memory);
    setNewMemoryContent(memory.content);
    setNewMemoryTags(memory.tags);
    setEditDialogOpen(true);
  };

  const handleEditDialogClose = () => {
    setEditDialogOpen(false);
    setSelectedMemory(null);
  };

  const handleEditMemory = () => {
    if (!newMemoryContent.trim() || !selectedMemory) return;

    const updatedMemories = memories.map(memory => {
      if (memory.id === selectedMemory.id) {
        return {
          ...memory,
          content: newMemoryContent,
          tags: newMemoryTags,
        };
      }
      return memory;
    });

    setMemories(updatedMemories);
    handleEditDialogClose();
  };

  const handleDeleteMemory = (id) => {
    setMemories(memories.filter(memory => memory.id !== id));
  };

  const handleTagChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewMemoryTags(
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  const filteredMemories = memories.filter(memory => {
    // Apply search filter
    const matchesSearch = memory.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Apply tag filter
    const matchesTags = selectedTags.length === 0 || 
      selectedTags.some(tag => memory.tags.includes(tag));
    
    return matchesSearch && matchesTags;
  });

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Paper sx={{ p: 2, mb: 2 }} elevation={0}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h5" component="h1" gutterBottom>
              Memories
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Manage what your AI assistant remembers
            </Typography>
          </Grid>
          <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddDialogOpen}
              sx={{ borderRadius: 2 }}
            >
              Add Memory
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ p: 2, mb: 2 }} elevation={0}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              placeholder="Search memories..."
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
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle2" gutterBottom>
              Filter by Tags:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {tags.map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  icon={<TagIcon />}
                  onClick={() => handleTagSelect(tag)}
                  color={selectedTags.includes(tag) ? 'primary' : 'default'}
                  variant={selectedTags.includes(tag) ? 'filled' : 'outlined'}
                  size="small"
                />
              ))}
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ p: 2, flexGrow: 1, overflow: 'auto' }} elevation={0}>
        {filteredMemories.length > 0 ? (
          <List>
            {filteredMemories.map((memory) => (
              <React.Fragment key={memory.id}>
                <ListItem
                  alignItems="flex-start"
                  secondaryAction={
                    <Box>
                      <Tooltip title="Edit Memory">
                        <IconButton edge="end" onClick={() => handleEditDialogOpen(memory)}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Memory">
                        <IconButton edge="end" onClick={() => handleDeleteMemory(memory.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  }
                >
                  <ListItemText
                    primary={
                      <Typography
                        variant="body1"
                        sx={{
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          mb: 1,
                        }}
                      >
                        {memory.content}
                      </Typography>
                    }
                    secondary={
                      <React.Fragment>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
                          {memory.tags.map((tag) => (
                            <Chip key={tag} label={tag} size="small" variant="outlined" />
                          ))}
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          Created: {new Date(memory.createdAt).toLocaleString()}
                        </Typography>
                      </React.Fragment>
                    }
                  />
                </ListItem>
                <Divider component="li" />
              </React.Fragment>
            ))}
          </List>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 8 }}>
            <MemoryIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No memories found
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center" sx={{ maxWidth: 400, mb: 3 }}>
              {searchQuery || selectedTags.length > 0 
                ? 'No memories match your search criteria' 
                : 'Add your first memory to help your AI assistant remember important information'}
            </Typography>
            {!searchQuery && selectedTags.length === 0 && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddDialogOpen}
              >
                Add Memory
              </Button>
            )}
          </Box>
        )}
      </Paper>

      {/* Add Memory Dialog */}
      <Dialog open={addDialogOpen} onClose={handleAddDialogClose} maxWidth="md" fullWidth>
        <DialogTitle>
          Add New Memory
          <IconButton
            aria-label="close"
            onClick={handleAddDialogClose}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Memory Content"
            fullWidth
            multiline
            rows={4}
            value={newMemoryContent}
            onChange={(e) => setNewMemoryContent(e.target.value)}
            variant="outlined"
            placeholder="Enter information you want your AI to remember..."
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth variant="outlined">
            <InputLabel id="memory-tags-label">Tags</InputLabel>
            <Select
              labelId="memory-tags-label"
              multiple
              value={newMemoryTags}
              onChange={handleTagChange}
              input={<OutlinedInput label="Tags" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} size="small" />
                  ))}
                </Box>
              )}
            >
              {tags.map((tag) => (
                <MenuItem key={tag} value={tag}>
                  {tag}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleAddDialogClose}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleAddMemory}
            disabled={!newMemoryContent.trim()}
          >
            Add Memory
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Memory Dialog */}
      <Dialog open={editDialogOpen} onClose={handleEditDialogClose} maxWidth="md" fullWidth>
        <DialogTitle>
          Edit Memory
          <IconButton
            aria-label="close"
            onClick={handleEditDialogClose}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Memory Content"
            fullWidth
            multiline
            rows={4}
            value={newMemoryContent}
            onChange={(e) => setNewMemoryContent(e.target.value)}
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth variant="outlined">
            <InputLabel id="edit-memory-tags-label">Tags</InputLabel>
            <Select
              labelId="edit-memory-tags-label"
              multiple
              value={newMemoryTags}
              onChange={handleTagChange}
              input={<OutlinedInput label="Tags" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} size="small" />
                  ))}
                </Box>
              )}
            >
              {tags.map((tag) => (
                <MenuItem key={tag} value={tag}>
                  {tag}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleEditDialogClose}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleEditMemory}
            disabled={!newMemoryContent.trim()}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MemoriesPage;
