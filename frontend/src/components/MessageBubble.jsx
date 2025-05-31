import React from 'react';
import { Box, Paper, Typography, IconButton, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import { styled } from '@mui/material/styles';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ReactMarkdown from 'react-markdown';
import { formatRelativeTime } from '../utils/formatters';

const StyledPaper = styled(Paper)(({ theme, isUser }) => ({
  padding: theme.spacing(2),
  maxWidth: '80%',
  backgroundColor: isUser ? theme.palette.primary.main : theme.palette.background.paper,
  color: isUser ? theme.palette.primary.contrastText : theme.palette.text.primary,
  borderRadius: isUser 
    ? '20px 20px 0 20px'
    : '20px 20px 20px 0',
  boxShadow: theme.shadows[1],
  position: 'relative',
  overflow: 'hidden',
  '&::after': isUser ? {
    content: '""',
    position: 'absolute',
    bottom: 0,
    right: '-10px',
    width: '10px',
    height: '20px',
    backgroundColor: theme.palette.primary.main,
    borderBottomLeftRadius: '50%',
  } : {},
}));

const MessageBubble = ({ message, onDelete, onCopy }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const isUser = message.sender === 'user';

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleCopy = () => {
    if (onCopy) onCopy(message);
    handleMenuClose();
  };

  const handleDelete = () => {
    if (onDelete) onDelete(message.id);
    handleMenuClose();
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', mb: 2 }}>
      <Box 
        sx={{
          display: 'flex', 
          flexDirection: isUser ? 'row-reverse' : 'row',
          alignItems: 'flex-end',
          mb: 0.5
        }}
      >
        <Typography variant="caption" color="text.secondary" sx={{ mx: 1 }}>
          {formatRelativeTime(message.timestamp)}
        </Typography>
        <Typography variant="subtitle2">
          {isUser ? 'You' : 'AI Assistant'}
        </Typography>
        <IconButton 
          size="small" 
          onClick={handleMenuOpen}
          sx={{ ml: 'auto', mr: isUser ? 'auto' : 0 }}
        >
          <MoreVertIcon fontSize="small" />
        </IconButton>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start', width: '100%' }}>
        <StyledPaper isUser={isUser} elevation={1}>
          <Typography variant="body1" component="div" sx={{ whiteSpace: 'pre-wrap' }}>
            <ReactMarkdown>
              {message.content}
            </ReactMarkdown>
          </Typography>
        </StyledPaper>
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleCopy}>
          <ListItemIcon>
            <ContentCopyIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Copy</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDelete}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default MessageBubble;
