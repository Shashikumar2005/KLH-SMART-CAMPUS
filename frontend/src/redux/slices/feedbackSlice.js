import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { feedbackAPI } from '../../services/api';

// Async thunks
export const fetchFeedback = createAsyncThunk(
  'feedback/fetchAll',
  async (params, { rejectWithValue }) => {
    try {
      const response = await feedbackAPI.getAll(params);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch feedback');
    }
  }
);

export const createFeedback = createAsyncThunk(
  'feedback/create',
  async (data, { rejectWithValue }) => {
    try {
      const response = await feedbackAPI.create(data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to submit feedback');
    }
  }
);

export const respondToFeedback = createAsyncThunk(
  'feedback/respond',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await feedbackAPI.respond(id, data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to respond');
    }
  }
);

export const deleteFeedback = createAsyncThunk(
  'feedback/delete',
  async (id, { rejectWithValue }) => {
    try {
      await feedbackAPI.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete feedback');
    }
  }
);

const initialState = {
  feedbackList: [],
  loading: false,
  error: null,
};

const feedbackSlice = createSlice({
  name: 'feedback',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    addFeedbackRealtime: (state, action) => {
      state.feedbackList.unshift(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch feedback
      .addCase(fetchFeedback.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeedback.fulfilled, (state, action) => {
        state.loading = false;
        state.feedbackList = action.payload;
      })
      .addCase(fetchFeedback.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create feedback
      .addCase(createFeedback.fulfilled, (state, action) => {
        state.feedbackList.unshift(action.payload);
      })
      // Respond to feedback
      .addCase(respondToFeedback.fulfilled, (state, action) => {
        const index = state.feedbackList.findIndex(f => f._id === action.payload._id);
        if (index !== -1) {
          state.feedbackList[index] = action.payload;
        }
      })
      // Delete feedback
      .addCase(deleteFeedback.fulfilled, (state, action) => {
        state.feedbackList = state.feedbackList.filter(f => f._id !== action.payload);
      });
  },
});

export const { clearError, addFeedbackRealtime } = feedbackSlice.actions;
export default feedbackSlice.reducer;
