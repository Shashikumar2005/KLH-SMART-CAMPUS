import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { clubAPI } from '../../services/api';

// Async thunks
export const fetchClubs = createAsyncThunk(
  'clubs/fetchClubs',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const response = await clubAPI.getAll(filters);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch clubs');
    }
  }
);

export const fetchClub = createAsyncThunk(
  'clubs/fetchClub',
  async (id, { rejectWithValue }) => {
    try {
      const response = await clubAPI.getOne(id);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch club');
    }
  }
);

export const createClub = createAsyncThunk(
  'clubs/createClub',
  async (clubData, { rejectWithValue }) => {
    try {
      const response = await clubAPI.create(clubData);
      return response.data; // Return the full response object including message
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create club');
    }
  }
);

export const updateClub = createAsyncThunk(
  'clubs/updateClub',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await clubAPI.update(id, data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update club');
    }
  }
);

export const requestJoinClub = createAsyncThunk(
  'clubs/requestJoinClub',
  async ({ id, message }, { rejectWithValue }) => {
    try {
      const response = await clubAPI.requestJoin(id, { message });
      return { id, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to send request');
    }
  }
);

export const handleMembershipRequest = createAsyncThunk(
  'clubs/handleMembershipRequest',
  async ({ clubId, requestId, action }, { rejectWithValue }) => {
    try {
      const response = await clubAPI.handleMembership(clubId, requestId, { action });
      return { clubId, requestId, action, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to process request');
    }
  }
);

export const addAchievement = createAsyncThunk(
  'clubs/addAchievement',
  async ({ id, achievement }, { rejectWithValue }) => {
    try {
      const response = await clubAPI.addAchievement(id, achievement);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add achievement');
    }
  }
);

export const addResource = createAsyncThunk(
  'clubs/addResource',
  async ({ id, resource }, { rejectWithValue }) => {
    try {
      const response = await clubAPI.addResource(id, resource);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add resource');
    }
  }
);

const clubSlice = createSlice({
  name: 'clubs',
  initialState: {
    clubList: [],
    selectedClub: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedClub: (state) => {
      state.selectedClub = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch clubs
      .addCase(fetchClubs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClubs.fulfilled, (state, action) => {
        state.loading = false;
        state.clubList = action.payload;
      })
      .addCase(fetchClubs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch single club
      .addCase(fetchClub.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClub.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedClub = action.payload;
      })
      .addCase(fetchClub.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create club
      .addCase(createClub.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createClub.fulfilled, (state, action) => {
        state.loading = false;
        // Only add to list if approved (for immediate display)
        if (action.payload.data?.isApproved) {
          state.clubList.unshift(action.payload.data);
        }
      })
      .addCase(createClub.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update club
      .addCase(updateClub.fulfilled, (state, action) => {
        const index = state.clubList.findIndex((c) => c._id === action.payload._id);
        if (index !== -1) {
          state.clubList[index] = action.payload;
        }
        if (state.selectedClub?._id === action.payload._id) {
          state.selectedClub = action.payload;
        }
      })
      // Add achievement
      .addCase(addAchievement.fulfilled, (state, action) => {
        if (state.selectedClub?._id === action.payload._id) {
          state.selectedClub = action.payload;
        }
      })
      // Add resource
      .addCase(addResource.fulfilled, (state, action) => {
        if (state.selectedClub?._id === action.payload._id) {
          state.selectedClub = action.payload;
        }
      });
  },
});

export const { clearError, clearSelectedClub } = clubSlice.actions;
export default clubSlice.reducer;
