import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { pollAPI } from '../../services/api';

// Async thunks
export const fetchPolls = createAsyncThunk(
  'polls/fetchPolls',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const response = await pollAPI.getAll(filters);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch polls');
    }
  }
);

export const fetchPoll = createAsyncThunk(
  'polls/fetchPoll',
  async (id, { rejectWithValue }) => {
    try {
      const response = await pollAPI.getOne(id);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch poll');
    }
  }
);

export const createPoll = createAsyncThunk(
  'polls/createPoll',
  async (pollData, { rejectWithValue }) => {
    try {
      const response = await pollAPI.create(pollData);
      return response.data; // Return the full response object including message
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create poll');
    }
  }
);

export const votePoll = createAsyncThunk(
  'polls/votePoll',
  async ({ id, optionIds }, { rejectWithValue }) => {
    try {
      const response = await pollAPI.vote(id, { optionIds });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to vote');
    }
  }
);

export const closePoll = createAsyncThunk(
  'polls/closePoll',
  async (id, { rejectWithValue }) => {
    try {
      const response = await pollAPI.close(id);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to close poll');
    }
  }
);

const pollSlice = createSlice({
  name: 'polls',
  initialState: {
    pollList: [],
    selectedPoll: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedPoll: (state) => {
      state.selectedPoll = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch polls
      .addCase(fetchPolls.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPolls.fulfilled, (state, action) => {
        state.loading = false;
        state.pollList = action.payload;
      })
      .addCase(fetchPolls.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch single poll
      .addCase(fetchPoll.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPoll.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedPoll = action.payload;
      })
      .addCase(fetchPoll.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create poll
      .addCase(createPoll.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPoll.fulfilled, (state, action) => {
        state.loading = false;
        // Only add to list if approved (for immediate display)
        if (action.payload.data?.isApproved) {
          state.pollList.unshift(action.payload.data);
        }
      })
      .addCase(createPoll.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Vote on poll
      .addCase(votePoll.fulfilled, (state, action) => {
        const index = state.pollList.findIndex((p) => p._id === action.payload._id);
        if (index !== -1) {
          state.pollList[index] = action.payload;
        }
        if (state.selectedPoll?._id === action.payload._id) {
          state.selectedPoll = action.payload;
        }
      })
      // Close poll
      .addCase(closePoll.fulfilled, (state, action) => {
        const index = state.pollList.findIndex((p) => p._id === action.payload._id);
        if (index !== -1) {
          state.pollList[index] = action.payload;
        }
        if (state.selectedPoll?._id === action.payload._id) {
          state.selectedPoll = action.payload;
        }
      });
  },
});

export const { clearError, clearSelectedPoll } = pollSlice.actions;
export default pollSlice.reducer;
