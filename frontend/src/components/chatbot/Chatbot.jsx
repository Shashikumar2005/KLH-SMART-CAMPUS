import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Fab,
  Paper,
  Typography,
  IconButton,
  TextField,
  Button,
  Avatar,
  Chip,
  CircularProgress,
  Collapse,
  Tooltip,
  Fade,
} from '@mui/material';
import {
  Chat as ChatIcon,
  Close as CloseIcon,
  Send as SendIcon,
  SmartToy as BotIcon,
  Person as PersonIcon,
  DeleteOutline as ClearIcon,
} from '@mui/icons-material';
import {
  toggleChatbot,
  sendMessage,
  fetchSuggestions,
  clearMessages,
} from '../../redux/slices/chatbotSlice';
import { format } from 'date-fns';

const Chatbot = () => {
  const dispatch = useDispatch();
  const { isOpen, messages, suggestions, loading } = useSelector((state) => state.chatbot);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen && suggestions.length === 0) {
      dispatch(fetchSuggestions());
    }
  }, [isOpen, suggestions.length, dispatch]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const messageText = input;
    setInput('');

    await dispatch(
      sendMessage({
        message: messageText,
        conversationHistory: messages.slice(-10), // Keep last 10 messages for context
      })
    );
  };

  const handleSuggestionClick = (suggestion) => {
    setInput(suggestion.text);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Chatbot FAB */}
      <Tooltip title={isOpen ? "Close Chat" : "Open Campus Assistant"} placement="left">
        <Fab
          color="primary"
          aria-label="chat"
          onClick={() => dispatch(toggleChatbot())}
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            zIndex: 1000,
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'scale(1.1)',
            },
          }}
        >
          {isOpen ? <CloseIcon /> : <ChatIcon />}
        </Fab>
      </Tooltip>

      {/* Chatbot Window */}
      <Collapse in={isOpen} timeout={300}>
        <Fade in={isOpen}>
          <Paper
            elevation={8}
            sx={{
              position: 'fixed',
              bottom: 80,
              right: 16,
              width: { xs: 'calc(100% - 32px)', sm: 400 },
              height: { xs: 'calc(100vh - 100px)', sm: 600 },
              zIndex: 999,
              display: 'flex',
              flexDirection: 'column',
              borderRadius: 3,
              overflow: 'hidden',
            }}
          >
          {/* Header */}
          <Box
            sx={{
              p: 2,
              bgcolor: 'primary.main',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderRadius: '12px 12px 0 0',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar sx={{ bgcolor: 'primary.dark', width: 40, height: 40 }}>
                <BotIcon />
              </Avatar>
              <Box>
                <Typography variant="h6" fontWeight="bold">Campus Assistant</Typography>
                <Typography variant="caption">Powered by Gemini AI</Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Tooltip title={messages.length === 0 ? "No messages to clear" : "Clear Chat"}>
                <span>
                  <IconButton
                    size="small"
                    sx={{ color: 'white' }}
                    onClick={() => dispatch(clearMessages())}
                    disabled={messages.length === 0}
                  >
                    <ClearIcon />
                  </IconButton>
                </span>
              </Tooltip>
              <Tooltip title="Close">
                <IconButton
                  size="small"
                  sx={{ color: 'white' }}
                  onClick={() => dispatch(toggleChatbot())}
                >
                  <CloseIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          {/* Messages Area */}
          <Box
            sx={{
              flex: 1,
              overflowY: 'auto',
              p: 2,
              bgcolor: '#f5f5f5',
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            {messages.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <BotIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Hi! I'm your Campus Assistant
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  I can help you with:
                </Typography>
                <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {[
                    '📅 Event information',
                    '🔍 Lost & Found queries',
                    '💬 Submit feedback',
                    '🏫 Campus navigation',
                    '❓ FAQs and more',
                  ].map((item, index) => (
                    <Typography key={index} variant="body2" color="text.secondary">
                      {item}
                    </Typography>
                  ))}
                </Box>

                {/* Suggestions */}
                {suggestions.length > 0 && (
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="body2" fontWeight="bold" gutterBottom>
                      Try asking:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
                      {suggestions.slice(0, 4).map((suggestion) => (
                        <Chip
                          key={suggestion.id}
                          label={suggestion.text}
                          onClick={() => handleSuggestionClick(suggestion)}
                          clickable
                          size="small"
                        />
                      ))}
                    </Box>
                  </Box>
                )}
              </Box>
            ) : (
              <>
                {messages.map((message, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: 'flex',
                      gap: 1,
                      alignItems: 'flex-start',
                      justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
                    }}
                  >
                    {message.role === 'assistant' && (
                      <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                        <BotIcon sx={{ fontSize: 20 }} />
                      </Avatar>
                    )}
                    <Box
                      sx={{
                        maxWidth: '75%',
                        p: 1.5,
                        borderRadius: 2,
                        bgcolor: message.role === 'user' ? 'primary.main' : 'white',
                        color: message.role === 'user' ? 'white' : 'text.primary',
                      }}
                    >
                      <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                        {message.content}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          display: 'block',
                          mt: 0.5,
                          opacity: 0.7,
                        }}
                      >
                        {format(new Date(message.timestamp), 'hh:mm a')}
                      </Typography>
                    </Box>
                    {message.role === 'user' && (
                      <Avatar sx={{ bgcolor: 'secondary.main', width: 32, height: 32 }}>
                        <PersonIcon sx={{ fontSize: 20 }} />
                      </Avatar>
                    )}
                  </Box>
                ))}
                {loading && (
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                      <BotIcon sx={{ fontSize: 20 }} />
                    </Avatar>
                    <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'white' }}>
                      <CircularProgress size={20} />
                    </Box>
                  </Box>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </Box>

          {/* Input Area */}
          <Box sx={{ p: 2, bgcolor: 'white', borderRadius: '0 0 8px 8px' }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={loading}
                multiline
                maxRows={3}
              />
              <Button
                variant="contained"
                onClick={handleSend}
                disabled={!input.trim() || loading}
                sx={{ minWidth: 'auto', px: 2 }}
              >
                <SendIcon />
              </Button>
            </Box>
          </Box>
        </Paper>
        </Fade>
      </Collapse>
    </>
  );
};

export default Chatbot;
