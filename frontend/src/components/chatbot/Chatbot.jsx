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
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            boxShadow: '0 8px 32px rgba(102, 126, 234, 0.4)',
            '&:hover': {
              transform: 'scale(1.15) rotate(5deg)',
              boxShadow: '0 12px 48px rgba(102, 126, 234, 0.6)',
              background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
            },
            '&:active': {
              transform: 'scale(1.05)',
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
            elevation={24}
            sx={{
              position: 'fixed',
              bottom: 80,
              right: 16,
              width: { xs: 'calc(100% - 32px)', sm: 400 },
              height: { xs: 'calc(100vh - 100px)', sm: 600 },
              zIndex: 999,
              display: 'flex',
              flexDirection: 'column',
              borderRadius: 4,
              overflow: 'hidden',
              background: 'linear-gradient(to bottom, #ffffff 0%, #f8f9fa 100%)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              animation: 'slideUp 0.3s ease-out',
              '@keyframes slideUp': {
                from: {
                  transform: 'translateY(20px)',
                  opacity: 0,
                },
                to: {
                  transform: 'translateY(0)',
                  opacity: 1,
                },
              },
            }}
          >
          {/* Header */}
          <Box
            sx={{
              p: 2.5,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderRadius: '16px 16px 0 0',
              boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)',
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '3px',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)',
              },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Avatar 
                sx={{ 
                  bgcolor: 'rgba(255, 255, 255, 0.2)', 
                  width: 45, 
                  height: 45,
                  backdropFilter: 'blur(10px)',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'rotate(360deg) scale(1.1)',
                  },
                }}
              >
                <BotIcon sx={{ fontSize: 24 }} />
              </Avatar>
              <Box>
                <Typography variant="h6" fontWeight="bold" sx={{ fontSize: '1.1rem' }}>
                  Campus Assistant
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.9, fontSize: '0.75rem' }}>
                  ✨ Powered by Gemini AI
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              <Tooltip title={messages.length === 0 ? "No messages to clear" : "Clear Chat"}>
                <span>
                  <IconButton
                    size="small"
                    sx={{ 
                      color: 'white',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        transform: 'rotate(180deg) scale(1.2)',
                        bgcolor: 'rgba(255, 255, 255, 0.2)',
                      },
                    }}
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
                  sx={{ 
                    color: 'white',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      transform: 'scale(1.2)',
                      bgcolor: 'rgba(255, 255, 255, 0.2)',
                    },
                  }}
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
              background: 'linear-gradient(to bottom, #f8f9fa 0%, #e9ecef 100%)',
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              '&::-webkit-scrollbar': {
                width: '8px',
              },
              '&::-webkit-scrollbar-track': {
                background: 'transparent',
              },
              '&::-webkit-scrollbar-thumb': {
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '10px',
                '&:hover': {
                  background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                },
              },
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
                          sx={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white',
                            fontWeight: 500,
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'translateY(-2px) scale(1.05)',
                              boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
                              background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                            },
                          }}
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
                      animation: 'fadeInUp 0.4s ease-out',
                      '@keyframes fadeInUp': {
                        from: {
                          opacity: 0,
                          transform: 'translateY(10px)',
                        },
                        to: {
                          opacity: 1,
                          transform: 'translateY(0)',
                        },
                      },
                    }}
                  >
                    {message.role === 'assistant' && (
                      <Avatar 
                        sx={{ 
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
                          width: 32, 
                          height: 32,
                          boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)',
                        }}
                      >
                        <BotIcon sx={{ fontSize: 20 }} />
                      </Avatar>
                    )}
                    <Box
                      sx={{
                        maxWidth: '75%',
                        p: 1.5,
                        borderRadius: message.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                        background: message.role === 'user' 
                          ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                          : 'white',
                        color: message.role === 'user' ? 'white' : 'text.primary',
                        boxShadow: message.role === 'user'
                          ? '0 4px 12px rgba(102, 126, 234, 0.3)'
                          : '0 2px 8px rgba(0, 0, 0, 0.1)',
                        transition: 'transform 0.2s ease',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: message.role === 'user'
                            ? '0 6px 16px rgba(102, 126, 234, 0.4)'
                            : '0 4px 12px rgba(0, 0, 0, 0.15)',
                        },
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
                      <Avatar 
                        sx={{ 
                          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                          width: 32, 
                          height: 32,
                          boxShadow: '0 2px 8px rgba(245, 87, 108, 0.3)',
                        }}
                      >
                        <PersonIcon sx={{ fontSize: 20 }} />
                      </Avatar>
                    )}
                  </Box>
                ))}
                {loading && (
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      gap: 1, 
                      alignItems: 'center',
                      animation: 'pulse 1.5s ease-in-out infinite',
                      '@keyframes pulse': {
                        '0%, 100%': {
                          opacity: 1,
                        },
                        '50%': {
                          opacity: 0.6,
                        },
                      },
                    }}
                  >
                    <Avatar 
                      sx={{ 
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
                        width: 32, 
                        height: 32 
                      }}
                    >
                      <BotIcon sx={{ fontSize: 20 }} />
                    </Avatar>
                    <Box 
                      sx={{ 
                        p: 1.5, 
                        borderRadius: '16px 16px 16px 4px', 
                        bgcolor: 'white',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                      }}
                    >
                      <CircularProgress size={20} sx={{ color: '#667eea' }} />
                    </Box>
                  </Box>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </Box>

          {/* Input Area */}
          <Box 
            sx={{ 
              p: 2, 
              bgcolor: 'white', 
              borderRadius: '0 0 16px 16px',
              borderTop: '1px solid rgba(0, 0, 0, 0.08)',
              boxShadow: '0 -4px 12px rgba(0, 0, 0, 0.05)',
            }}
          >
            <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-end' }}>
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
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      boxShadow: '0 2px 8px rgba(102, 126, 234, 0.2)',
                    },
                    '&.Mui-focused': {
                      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                    },
                  },
                }}
              />
              <Button
                variant="contained"
                onClick={handleSend}
                disabled={!input.trim() || loading}
                sx={{ 
                  minWidth: 'auto', 
                  px: 2.5,
                  py: 1,
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    transform: 'translateY(-2px) scale(1.05)',
                    boxShadow: '0 6px 20px rgba(102, 126, 234, 0.4)',
                    background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                  },
                  '&:active': {
                    transform: 'translateY(0) scale(1)',
                  },
                  '&.Mui-disabled': {
                    background: 'rgba(0, 0, 0, 0.12)',
                  },
                }}
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
