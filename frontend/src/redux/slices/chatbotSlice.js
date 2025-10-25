import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { chatbotAPI } from '../../services/api';

// Async thunks
export const sendMessage = createAsyncThunk(
  'chatbot/sendMessage',
  async ({ message, conversationHistory }, { rejectWithValue }) => {
    try {
      const response = await chatbotAPI.sendMessage({ message, conversationHistory });
      return {
        userMessage: message,
        botResponse: response.data.data.message,
        timestamp: response.data.data.timestamp,
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to send message');
    }
  }
);

export const fetchSuggestions = createAsyncThunk(
  'chatbot/fetchSuggestions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await chatbotAPI.getSuggestions();
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch suggestions');
    }
  }
);

export const fetchFAQs = createAsyncThunk(
  'chatbot/fetchFAQs',
  async (_, { rejectWithValue }) => {
    try {
      const response = await chatbotAPI.getFAQs();
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch FAQs');
    }
  }
);

const initialState = {
  messages: [],
  suggestions: [],
  faqs: [],
  loading: false,
  error: null,
  isOpen: false,
};

const chatbotSlice = createSlice({
  name: 'chatbot',
  initialState,
  reducers: {
    toggleChatbot: (state) => {
      state.isOpen = !state.isOpen;
    },
    openChatbot: (state) => {
      state.isOpen = true;
    },
    closeChatbot: (state) => {
      state.isOpen = false;
    },
    clearMessages: (state) => {
      state.messages = [];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Send message
      .addCase(sendMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.loading = false;
        state.messages.push(
          {
            role: 'user',
            content: action.payload.userMessage,
            timestamp: new Date().toISOString(),
          },
          {
            role: 'assistant',
            content: action.payload.botResponse,
            timestamp: action.payload.timestamp,
          }
        );
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch suggestions
      .addCase(fetchSuggestions.fulfilled, (state, action) => {
        state.suggestions = action.payload;
      })
      // Fetch FAQs
      .addCase(fetchFAQs.fulfilled, (state, action) => {
        state.faqs = action.payload;
      });
  },
});

export const {
  toggleChatbot,
  openChatbot,
  closeChatbot,
  clearMessages,
  clearError,
} = chatbotSlice.actions;

export default chatbotSlice.reducer;
