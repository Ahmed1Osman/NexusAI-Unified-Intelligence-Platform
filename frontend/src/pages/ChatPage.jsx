import React, { useState, useRef, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import {
  Box,
  Paper,
  TextField,
  IconButton,
  Typography,
  Divider,
  Chip,
  Avatar,
  CircularProgress,
  Card,
  CardContent,
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';

// Icons
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import DescriptionIcon from '@mui/icons-material/Description';
import ImageIcon from '@mui/icons-material/Image';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import MemoryIcon from '@mui/icons-material/Memory';

// Mock data for initial development
import { mockConversation } from '../utils/mockData';

const ChatContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  overflow: 'hidden',
}));

const MessagesContainer = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  overflow: 'auto',
  padding: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
}));

const MessageBubble = styled(Paper)(({ theme, isUser }) => ({
  padding: theme.spacing(2),
  maxWidth: '80%',
  alignSelf: isUser ? 'flex-end' : 'flex-start',
  backgroundColor: isUser ? theme.palette.primary.main : theme.palette.background.paper,
  color: isUser ? theme.palette.primary.contrastText : theme.palette.text.primary,
  borderRadius: isUser 
    ? '20px 20px 0 20px'
    : '20px 20px 20px 0',
  boxShadow: theme.shadows[1],
  position: 'relative',
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

const InputContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
}));

const CommandChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.primary.contrastText,
  },
}));

const ChatPage = () => {
  const [messages, setMessages] = useState(mockConversation);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [attachMenu, setAttachMenu] = useState(null);
  const [messageMenu, setMessageMenu] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const messagesEndRef = useRef(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      content: input,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };
    setMessages([...messages, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response after a delay
    setTimeout(() => {
      const aiMessage = {
        id: Date.now() + 1,
        content: getAIResponse(input),
        sender: 'ai',
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  // Simple mock AI response generator
  const getAIResponse = (userInput) => {
    const input = userInput.toLowerCase();
    
    if (input.includes('hello') || input.includes('hi')) {
      return "Hello! How can I help you today?";
    } else if (input.includes('memory') || input.includes('remember')) {
      return "I've stored that in my memory. I'll remember it for future reference.";
    } else if (input.includes('document') || input.includes('pdf')) {
      return "I can process documents for you. Try uploading a PDF or image using the attachment button.";
    } else if (input.includes('help')) {
      return "I'm your unified AI assistant. I can chat with you, process documents, remember information, and more. Try using commands like !memory, !model, or !document.";
    } else {
      return "I understand your message. Is there anything specific you'd like me to help you with?";
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleAttachClick = (event) => {
    setAttachMenu(event.currentTarget);
  };

  const handleAttachClose = () => {
    setAttachMenu(null);
  };

  const handleMessageMenuClick = (event, message) => {
    setMessageMenu(event.currentTarget);
    setSelectedMessage(message);
  };

  const handleMessageMenuClose = () => {
    setMessageMenu(null);
    setSelectedMessage(null);
  };

  const handleCopyMessage = () => {
    if (selectedMessage) {
      navigator.clipboard.writeText(selectedMessage.content);
    }
    handleMessageMenuClose();
  };

  const handleDeleteMessage = () => {
    if (selectedMessage) {
      setMessages(messages.filter(msg => msg.id !== selectedMessage.id));
    }
    handleMessageMenuClose();
  };

  const commandChips = [
    { label: '!memory', icon: <MemoryIcon fontSize="small" /> },
    { label: '!document', icon: <DescriptionIcon fontSize="small" /> },
    { label: '!model', icon: <SmartToyIcon fontSize="small" /> },
    { label: '!help', icon: <SmartToyIcon fontSize="small" /> },
  ];

  return (
    <ChatContainer>
      <MessagesContainer>
        {messages.map((message) => (
          <Box key={message.id} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
            <Avatar
              sx={{
                bgcolor: message.sender === 'user' ? 'secondary.main' : 'primary.main',
                width: 36,
                height: 36,
              }}
            >
              {message.sender === 'user' ? <PersonIcon /> : <SmartToyIcon />}
            </Avatar>
            <Box sx={{ maxWidth: 'calc(100% - 50px)' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                <Typography variant="subtitle2">
                  {message.sender === 'user' ? 'You' : 'AI Assistant'}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                  {new Date(message.timestamp).toLocaleTimeString()}
                </Typography>
                <IconButton
                  size="small"
                  sx={{ ml: 'auto' }}
                  onClick={(e) => handleMessageMenuClick(e, message)}
                >
                  <MoreVertIcon fontSize="small" />
                </IconButton>
              </Box>
              <MessageBubble isUser={message.sender === 'user'} elevation={1}>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                  {message.content}
                </Typography>
              </MessageBubble>
            </Box>
          </Box>
        ))}
        {isTyping && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar sx={{ bgcolor: 'primary.main', width: 36, height: 36 }}>
              <SmartToyIcon />
            </Avatar>
            <Card variant="outlined" sx={{ p: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CircularProgress size={20} />
                <Typography variant="body2">AI is typing...</Typography>
              </Box>
            </Card>
          </Box>
        )}
        <div ref={messagesEndRef} />
      </MessagesContainer>

      <InputContainer>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', mb: 1 }}>
          {commandChips.map((chip) => (
            <CommandChip
              key={chip.label}
              label={chip.label}
              icon={chip.icon}
              variant="outlined"
              onClick={() => setInput(input + ' ' + chip.label + ' ')}
              size="small"
            />
          ))}
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TextField
            fullWidth
            multiline
            maxRows={4}
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            variant="outlined"
            size="small"
            InputProps={{
              sx: { borderRadius: 4 }
            }}
          />
          <IconButton color="primary" onClick={handleAttachClick}>
            <AttachFileIcon />
          </IconButton>
          <IconButton color="primary" onClick={handleSendMessage} disabled={!input.trim()}>
            <SendIcon />
          </IconButton>
        </Box>
      </InputContainer>

      {/* Attachment Menu */}
      <Menu
        anchorEl={attachMenu}
        open={Boolean(attachMenu)}
        onClose={handleAttachClose}
      >
        <MenuItem onClick={handleAttachClose}>
          <ListItemIcon>
            <PictureAsPdfIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Upload PDF</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleAttachClose}>
          <ListItemIcon>
            <ImageIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Upload Image</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleAttachClose}>
          <ListItemIcon>
            <DescriptionIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Upload Document</ListItemText>
        </MenuItem>
      </Menu>

      {/* Message Menu */}
      <Menu
        anchorEl={messageMenu}
        open={Boolean(messageMenu)}
        onClose={handleMessageMenuClose}
      >
        <MenuItem onClick={handleCopyMessage}>
          <ListItemIcon>
            <ContentCopyIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Copy</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDeleteMessage}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
    </ChatContainer>
  );
};

export default ChatPage;
