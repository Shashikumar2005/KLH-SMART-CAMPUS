import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { announcementsAPI } from '../../services/api';

// Async thunks
export const fetchAnnouncements = createAsyncThunk(
  'announcements/fetchAll',
  async (params, { rejectWithValue }) => {
    try {
      const response = await announcementsAPI.getAll(params);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch announcements');
    }
  }
);

export const createAnnouncement = createAsyncThunk(
  'announcements/create',
  async (data, { rejectWithValue }) => {
    try {
      const response = await announcementsAPI.create(data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create announcement');
    }
  }
);

export const updateAnnouncement = createAsyncThunk(
  'announcements/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await announcementsAPI.update(id, data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update announcement');
    }
  }
);

export const deleteAnnouncement = createAsyncThunk(
  'announcements/delete',
  async (id, { rejectWithValue }) => {
    try {
      await announcementsAPI.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete announcement');
    }
  }
);

const initialState = {
  announcements: [],
  loading: false,
  error: null,
};

const announcementSlice = createSlice({
  name: 'announcements',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    addAnnouncementRealtime: (state, action) => {
      state.announcements.unshift(action.payload);
    },
    updateAnnouncementRealtime: (state, action) => {
      const index = state.announcements.findIndex(a => a._id === action.payload._id);
      if (index !== -1) {
        state.announcements[index] = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch announcements
      .addCase(fetchAnnouncements.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAnnouncements.fulfilled, (state, action) => {
        state.loading = false;
        state.announcements = action.payload;
      })
      .addCase(fetchAnnouncements.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create announcement
      .addCase(createAnnouncement.fulfilled, (state, action) => {
        state.announcements.unshift(action.payload);
      })
      // Update announcement
      .addCase(updateAnnouncement.fulfilled, (state, action) => {
        const index = state.announcements.findIndex(a => a._id === action.payload._id);
        if (index !== -1) {
          state.announcements[index] = action.payload;
        }
      })
      // Delete announcement
      .addCase(deleteAnnouncement.fulfilled, (state, action) => {
        state.announcements = state.announcements.filter(a => a._id !== action.payload);
      });
  },
});

export const { clearError, addAnnouncementRealtime, updateAnnouncementRealtime } = announcementSlice.actions;
export default announcementSlice.reducer;
